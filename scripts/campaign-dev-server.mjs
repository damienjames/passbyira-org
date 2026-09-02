import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

import { imageSize } from "image-size";

import {
  findActiveCampaign,
  getCacheMaxAgeSeconds,
  preparePublishedCampaigns,
  resolveCampaign,
} from "../api/_lib/campaigns.js";

const root = process.cwd();
const sourceDirectory = path.join(root, "content", "campaigns");
const port = Number(process.env.CAMPAIGN_DEV_PORT || 7071);
const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

async function hydrateImage(image) {
  if (!image?.src?.startsWith("/images/") || image.src.includes("..")) return image;
  const buffer = await fs.readFile(path.join(root, "public", image.src.slice(1)));
  const dimensions = imageSize(buffer);
  return { ...image, width: dimensions.width, height: dimensions.height };
}

async function loadCampaigns() {
  const entries = await fs.readdir(sourceDirectory, { withFileTypes: true });
  const campaigns = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .map(async (entry) => {
        const source = JSON.parse(await fs.readFile(path.join(sourceDirectory, entry.name), "utf8"));
        return {
          ...source,
          heroImage: await hydrateImage(source.heroImage),
          supportingImages: await Promise.all((source.supportingImages || []).map(hydrateImage)),
        };
      }),
  );
  return preparePublishedCampaigns(campaigns);
}

function writeJson(response, status, body, requestOrigin, maxAge = 0) {
  const origin = allowedOrigins.has(requestOrigin) ? requestOrigin : "http://localhost:3000";
  response.writeHead(status, {
    "Access-Control-Allow-Origin": origin,
    "Cache-Control": `public, max-age=0, s-maxage=${maxAge}, must-revalidate`,
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
  const requestOrigin = request.headers.origin || "";
  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": allowedOrigins.has(requestOrigin) ? requestOrigin : "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Vary": "Origin",
    });
    response.end();
    return;
  }

  try {
    const requestUrl = new URL(request.url || "/", `http://localhost:${port}`);
    const route = requestUrl.pathname.replace(/^\/api\/campaigns\/?/, "").replace(/^\/+|\/+$/g, "");
    const campaigns = await loadCampaigns();
    const now = new Date();
    const maxAge = getCacheMaxAgeSeconds(campaigns, now);

    if (route === "active") {
      const placement = requestUrl.searchParams.get("placement") === "announcement" ? "announcement" : "homepage";
      const campaign = findActiveCampaign(campaigns, placement, now);
      writeJson(
        response,
        campaign ? 200 : 404,
        campaign ? { state: "active", campaign } : { error: "No active campaign" },
        requestOrigin,
        maxAge,
      );
      return;
    }

    const result = resolveCampaign(campaigns, decodeURIComponent(route), now);
    if (result.kind === "not-found") {
      writeJson(response, 404, { error: "Campaign not found" }, requestOrigin, maxAge);
      return;
    }
    if (result.kind === "redirect") {
      writeJson(response, 200, result, requestOrigin, maxAge);
      return;
    }
    writeJson(response, 200, { state: result.state, campaign: result.campaign }, requestOrigin, maxAge);
  } catch (error) {
    writeJson(
      response,
      500,
      { error: error instanceof Error ? error.message : "Campaign API failed" },
      requestOrigin,
    );
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Campaign preview API listening on http://localhost:${port}/api/campaigns`);
});
