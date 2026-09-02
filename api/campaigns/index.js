import { BlobServiceClient } from "@azure/storage-blob";

import {
  CAMPAIGN_SCHEMA_VERSION,
  findActiveCampaign,
  getCacheMaxAgeSeconds,
  resolveCampaign,
} from "../_lib/campaigns.js";

const connectionString = process.env.CAMPAIGN_STORAGE_CONNECTION_STRING || "";
const containerName = process.env.CAMPAIGN_STORAGE_CONTAINER || "passbyira-campaigns";
const blobName = process.env.CAMPAIGN_STORAGE_BLOB || "published/campaigns.json";
const catalogCacheMilliseconds = 15_000;

let cachedCatalog = null;
let cachedAt = 0;

function response(status, body, maxAge = 0, extraHeaders = {}) {
  return {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${maxAge}, must-revalidate`,
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function loadCatalog() {
  if (cachedCatalog && Date.now() - cachedAt < catalogCacheMilliseconds) {
    return cachedCatalog;
  }
  if (!connectionString) {
    throw new Error("Campaign storage is not configured");
  }

  const service = BlobServiceClient.fromConnectionString(connectionString);
  const blob = service.getContainerClient(containerName).getBlockBlobClient(blobName);
  const download = await blob.download();
  const text = await streamToString(download.readableStreamBody);
  const catalog = JSON.parse(text);

  if (catalog.schemaVersion !== CAMPAIGN_SCHEMA_VERSION || !Array.isArray(catalog.campaigns)) {
    throw new Error("Campaign catalog has an unsupported schema");
  }

  cachedCatalog = catalog;
  cachedAt = Date.now();
  return catalog;
}

function getRoute(req) {
  if (typeof req?.params?.route === "string") return req.params.route.replace(/^\/+|\/+$/g, "");
  const pathname = new URL(req?.url || "http://localhost/api/campaigns/active").pathname;
  return pathname.replace(/^.*\/api\/campaigns\/?/, "").replace(/^\/+|\/+$/g, "");
}

export default async function campaignsAzureFunction(context, req) {
  if ((req?.method || "GET").toUpperCase() === "OPTIONS") {
    return { status: 204, headers: { Allow: "GET, OPTIONS" }, body: "" };
  }

  try {
    const now = new Date();
    const catalog = await loadCatalog();
    const maxAge = getCacheMaxAgeSeconds(catalog.campaigns, now);
    const route = getRoute(req);

    if (route === "active") {
      const placement = req?.query?.placement === "announcement" ? "announcement" : "homepage";
      const campaign = findActiveCampaign(catalog.campaigns, placement, now);
      return campaign
        ? response(200, { state: "active", campaign }, maxAge)
        : response(404, { error: "No active campaign" }, maxAge);
    }

    if (!route || route.includes("/")) {
      return response(404, { error: "Campaign not found" }, maxAge);
    }

    const result = resolveCampaign(catalog.campaigns, decodeURIComponent(route), now);
    if (result.kind === "not-found") {
      return response(404, { error: "Campaign not found" }, maxAge);
    }
    if (result.kind === "redirect") {
      return response(200, result, maxAge);
    }
    return response(200, { state: result.state, campaign: result.campaign }, maxAge);
  } catch (error) {
    context?.log?.error?.("Campaign API error", error);
    return response(503, { error: "Campaign content is temporarily unavailable" }, 0);
  }
}
