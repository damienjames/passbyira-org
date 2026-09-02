import crypto from "crypto";

const SESSION_COOKIE = "tina_session";
const CSRF_COOKIE = "tina_csrf";
const ONE_DAY_SECONDS = 60 * 60 * 24;
const SESSION_MAX_AGE_SECONDS = ONE_DAY_SECONDS * 7;

function base64urlEncode(input) {
  return Buffer.from(input).toString("base64url");
}

function base64urlDecode(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getSecret() {
  return process.env.NEXTAUTH_SECRET || process.env.TINA_SESSION_SECRET || "";
}

function parseCookies(header = "") {
  return String(header)
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, part) => {
      const eqIndex = part.indexOf("=");
      if (eqIndex === -1) return acc;
      const key = decodeURIComponent(part.slice(0, eqIndex).trim());
      const value = decodeURIComponent(part.slice(eqIndex + 1).trim());
      acc[key] = value;
      return acc;
    }, {});
}

function appendHeader(res, name, value) {
  const existing = res.getHeader(name);
  if (!existing) {
    res.setHeader(name, value);
    return;
  }
  const nextValue = Array.isArray(existing) ? [...existing, value] : [existing, value];
  res.setHeader(name, nextValue);
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
  parts.push(`Path=${options.path || "/"}`);
  if (options.httpOnly !== false) parts.push("HttpOnly");
  if (options.secure !== false) parts.push("Secure");
  parts.push(`SameSite=${options.sameSite || "Lax"}`);
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${options.maxAge}`);
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  return parts.join("; ");
}

function createSignature(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

function signPayload(data, secret) {
  if (!secret) {
    throw new Error("Missing NEXTAUTH_SECRET or TINA_SESSION_SECRET");
  }
  const payload = base64urlEncode(JSON.stringify(data));
  const signature = createSignature(payload, secret);
  return `${payload}.${signature}`;
}

function verifyPayload(token, secret) {
  if (!token || !secret || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createSignature(payload, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }
  try {
    return JSON.parse(base64urlDecode(payload));
  } catch {
    return null;
  }
}

function getCookieMap(req) {
  const hasParsedCookies =
    req.cookies &&
    typeof req.cookies === "object" &&
    !Array.isArray(req.cookies) &&
    Object.keys(req.cookies).length > 0;

  if (!hasParsedCookies) {
    req.cookies = parseCookies(req.headers?.cookie || "");
  }
  return req.cookies;
}

function issueCsrfToken(req, res) {
  const secret = getSecret();
  const cookies = getCookieMap(req);
  const existing = verifyPayload(cookies[CSRF_COOKIE], secret);
  if (existing?.token) {
    return existing.token;
  }
  const token = crypto.randomBytes(24).toString("hex");
  const signed = signPayload(
    { token, expiresAt: Date.now() + ONE_DAY_SECONDS * 1000 },
    secret
  );
  appendHeader(
    res,
    "Set-Cookie",
    serializeCookie(CSRF_COOKIE, signed, { maxAge: ONE_DAY_SECONDS, httpOnly: true })
  );
  cookies[CSRF_COOKIE] = signed;
  return token;
}

function validateCsrf(req, token) {
  const secret = getSecret();
  const cookies = getCookieMap(req);
  const stored = verifyPayload(cookies[CSRF_COOKIE], secret);
  if (!stored?.token || !stored?.expiresAt) return false;
  if (stored.expiresAt < Date.now()) return false;
  return stored.token === token;
}

function createSessionCookie(user) {
  return signPayload(
    {
      user,
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
    },
    getSecret()
  );
}

function readSession(req) {
  const cookies = getCookieMap(req);
  const payload = verifyPayload(cookies[SESSION_COOKIE], getSecret());
  if (!payload?.user || !payload?.expiresAt || payload.expiresAt < Date.now()) {
    return null;
  }
  return payload.user;
}

function setSession(res, user) {
  appendHeader(
    res,
    "Set-Cookie",
    serializeCookie(SESSION_COOKIE, createSessionCookie(user), {
      maxAge: SESSION_MAX_AGE_SECONDS,
      httpOnly: true,
    })
  );
}

function clearSession(res) {
  appendHeader(
    res,
    "Set-Cookie",
    serializeCookie(SESSION_COOKIE, "", {
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
    })
  );
}

function clearCsrf(res) {
  appendHeader(
    res,
    "Set-Cookie",
    serializeCookie(CSRF_COOKIE, "", {
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
    })
  );
}

function sessionResponse(req) {
  const user = readSession(req);
  return user ? { user } : {};
}

export {
  SESSION_COOKIE,
  clearCsrf,
  clearSession,
  issueCsrfToken,
  readSession,
  sessionResponse,
  setSession,
  validateCsrf,
};
