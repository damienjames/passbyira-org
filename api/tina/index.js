import express from "express";
import { TinaNodeBackend, LocalBackendAuthProvider } from "@tinacms/datalayer";
import databaseClient from "./__generated__/databaseClient.js";
import { ensureDatabaseReady } from "./database.js";
import {
  clearCsrf,
  clearSession,
  issueCsrfToken,
  readSession,
  sessionResponse,
  setSession,
  validateCsrf,
} from "../_lib/tinaSession.js";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

// Thin Azure Functions → Express adapter. Avoids @codegenie/serverless-express
// whose ServerlessResponse doesn't emit 'finish' reliably on Node 20+.
function makeAzureExpressAdapter(app) {
  return function handleAzureRequest(azContext, azReq) {
    return new Promise((resolve, reject) => {
      const azHttpReq = azReq || azContext.req || {};
      console.log("[tina] adapter start", azHttpReq.method, azHttpReq.url);
      const urlStr = azHttpReq.url || "http://localhost/";
      let urlObj;
      try { urlObj = new URL(urlStr); } catch { urlObj = new URL("http://localhost/"); }
      const rawBodyData = azHttpReq.body ?? undefined;
      const headers = Object.fromEntries(
        Object.entries(azHttpReq.headers || {}).map(([k, v]) => [k.toLowerCase(), String(v)])
      );
      const contentType = String(headers["content-type"] || "").toLowerCase();

      let parsedBody = rawBodyData;
      if (typeof rawBodyData === "string") {
        if (contentType.includes("application/json")) {
          try {
            parsedBody = JSON.parse(rawBodyData);
          } catch {
            parsedBody = rawBodyData;
          }
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          parsedBody = Object.fromEntries(new URLSearchParams(rawBodyData));
        }
      } else if (Buffer.isBuffer(rawBodyData)) {
        const text = rawBodyData.toString("utf8");
        if (contentType.includes("application/json")) {
          try {
            parsedBody = JSON.parse(text);
          } catch {
            parsedBody = text;
          }
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          parsedBody = Object.fromEntries(new URLSearchParams(text));
        } else {
          parsedBody = text;
        }
      }

      // Build a minimal Express-compatible request object (plain, Express will set prototype)
      const req = {
        method: (azHttpReq.method || "GET").toUpperCase(),
        url: urlObj.pathname + urlObj.search,
        query: Object.fromEntries(urlObj.searchParams),
        params: azHttpReq.params || {},
        headers,
        body: parsedBody,
        rawBodyData,
        cookies: {},  // next-auth reads req.cookies
        socket: { remoteAddress: "127.0.0.1", encrypted: urlObj.protocol === "https:" },
        connection: { remoteAddress: "127.0.0.1" },
        get(field) { return this.headers[field.toLowerCase()]; },
        header(field) { return this.get(field); },
      };

      // Build response accumulator (plain object, Express will set prototype)
      let statusCode = 200;
      const respHeaders = {};
      const bodyChunks = [];
      let finished = false;

      const res = {
        statusCode: 200,
        headersSent: false,
        locals: {},
        setHeader(k, v) { respHeaders[k.toLowerCase()] = v; return this; },
        getHeader(k) { return respHeaders[k.toLowerCase()]; },
        getHeaders() { return respHeaders; },
        removeHeader(k) { delete respHeaders[k.toLowerCase()]; return this; },
        status(code) { statusCode = code; this.statusCode = code; return this; },
        writeHead(code, hdrs) {
          statusCode = code; this.statusCode = code;
          if (hdrs) Object.entries(hdrs).forEach(([k,v]) => { respHeaders[k.toLowerCase()] = v; });
          return this;
        },
        write(chunk) {
          if (chunk) bodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
          return true;
        },
        end(chunk) {
          if (finished) return this;
          finished = true;
          console.log("[tina] res.end() called, statusCode:", this.statusCode || statusCode);
          if (chunk) bodyChunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
          resolve({
            status: this.statusCode || statusCode,
            headers: respHeaders,
            body: Buffer.concat(bodyChunks).toString("utf8"),
          });
          return this;
        },
        send(body) {
          if (typeof body === "object" && body !== null) {
            if (!this.getHeader("content-type")) this.setHeader("content-type", "application/json; charset=utf-8");
            body = JSON.stringify(body);
          }
          const str = body == null ? "" : String(body);
          if (!this.getHeader("content-length")) this.setHeader("content-length", Buffer.byteLength(str).toString());
          return this.end(str);
        },
        json(body) {
          this.setHeader("content-type", "application/json; charset=utf-8");
          return this.send(body);
        },
        redirect(url) {
          this.setHeader("location", url);
          return this.writeHead(302).end("");
        },
        set(field, val) {
          if (typeof field === "object") {
            Object.entries(field).forEach(([k,v]) => this.setHeader(k, v));
          } else {
            this.setHeader(field, val);
          }
          return this;
        },
        get(field) { return this.getHeader(field); },
        type(ct) { this.setHeader("content-type", ct); return this; },
        contentType(ct) { return this.type(ct); },
      };

      // app.handle sets up Express prototypes on req/res and runs the middleware stack
      try {
        app.handle(req, res, (err) => {
          if (!finished) {
            if (err) {
              resolve({ status: err.status || 500, headers: { "content-type": "text/plain" }, body: err.message || "Error" });
            } else {
              resolve({ status: 404, headers: { "content-type": "text/plain" }, body: "Not found" });
            }
          }
        });
      } catch (err) {
        console.error("[tina] adapter sync error:", err);
        if (!finished) reject(err);
      }
    });
  };
}

function normalizeRequestBody(req) {
  const source = req.body ?? req.rawBodyData;
  if (!source) return {};
  if (typeof source === "string") {
    return Object.fromEntries(new URLSearchParams(source));
  }
  if (Buffer.isBuffer(source)) {
    return Object.fromEntries(new URLSearchParams(source.toString("utf8")));
  }
  if (typeof source === "object") {
    return source;
  }
  return {};
}

let cachedExpressAdapter;
let initError;

try {
  const authProvider = isLocal
    ? LocalBackendAuthProvider()
    : {
        initialize: async () => {},
        isAuthorized: async (req) => {
          const user = readSession(req);
          if (!user) {
            return {
              errorCode: 401,
              errorMessage: "Unauthorized",
              isAuthorized: false,
            };
          }
          if (!req.session) {
            Object.defineProperty(req, "session", {
              value: { user },
              writable: false,
            });
          }
          return { isAuthorized: true };
        },
        extraRoutes: {
          auth: {
            secure: false,
            handler: async (req, res, opts) => {
              const basePath = opts.basePath || "/api/tina/";
              const url = new URL(req.url, `http://${req.headers?.host || "localhost"}`);
              const subRoute = url.pathname.replace(`${basePath}auth/`, "");

              if (req.method === "GET" && subRoute === "csrf") {
                return res.status(200).json({ csrfToken: issueCsrfToken(req, res) });
              }

              if (req.method === "GET" && subRoute === "session") {
                return res.status(200).json(sessionResponse(req));
              }

              if (req.method === "POST" && subRoute === "callback/credentials") {
                const body = normalizeRequestBody(req);
                const username = String(body.username || "").trim();
                const password = String(body.password || "");
                const callbackUrl = String(body.callbackUrl || "/admin/index.html");
                const csrfToken = String(body.csrfToken || "");

                if (!validateCsrf(req, csrfToken)) {
                  return res.status(200).json({ url: `${callbackUrl}?error=Callback` });
                }

                const result = await databaseClient.authenticate({ username, password });
                const user = result?.data?.authenticate;
                if (!user?.username) {
                  return res.status(200).json({ url: `${callbackUrl}?error=CredentialsSignin` });
                }

                setSession(res, {
                  name: user.name || user.username,
                  email: user.email || "",
                  role: "user",
                  sub: user.username,
                  username: user.username,
                });
                return res.status(200).json({ url: callbackUrl });
              }

              if (req.method === "POST" && subRoute === "signout") {
                const body = normalizeRequestBody(req);
                const callbackUrl = String(body.callbackUrl || "/admin/index.html");
                clearSession(res);
                clearCsrf(res);
                return res.status(200).json({ url: callbackUrl });
              }

              return res.status(404).json({ error: "Not found" });
            },
          },
        },
      };

  const tinaHandler = TinaNodeBackend({
    authProvider,
    databaseClient,
  });

  const app = express();
  app.disable("x-powered-by");
  app.all("/api/tina", async (req, res, next) => {
    console.log("[tina] route /api/tina matched, calling handler");
    try { await tinaHandler(req, res); console.log("[tina] handler returned"); } catch (e) { console.error("[tina] handler threw:", e); next(e); }
  });
  app.all("/api/tina/*path", async (req, res, next) => {
    console.log("[tina] route /api/tina/*path matched:", req.url);
    try { await tinaHandler(req, res); console.log("[tina] handler returned"); } catch (e) { console.error("[tina] handler threw:", e); next(e); }
  });
  // Global error handler — prevents 502 by returning a JSON 500 body
  app.use((err, req, res, _next) => {
    void _next;
    console.error("[tina] Request error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });

  cachedExpressAdapter = makeAzureExpressAdapter(app);
} catch (err) {
  initError = err;
  console.error("[tina] Initialization failed:", err);
}

export default async function tinaAzureFunction(context, req) {
  if (initError) {
    const msg = initError.message || String(initError);
    console.error("[tina] Returning initError response:", msg);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: msg }),
    };
  }
  // 25-second timeout to surface hangs as readable 500 responses instead of Azure 502
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Tina request timed out after 25s" }),
      });
    }, 25000)
  );
  try {
    if (!isLocal) {
      await ensureDatabaseReady();
    }
    return await Promise.race([cachedExpressAdapter(context, req), timeoutPromise]);
  } catch (err) {
    console.error("[tina] adapter error:", err);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
