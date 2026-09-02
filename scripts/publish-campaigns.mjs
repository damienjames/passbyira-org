import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { BlobServiceClient } from "@azure/storage-blob";
import { imageSize } from "image-size";

import {
  CAMPAIGN_SCHEMA_VERSION,
  preparePublishedCampaigns,
} from "../api/_lib/campaigns.js";

const root = process.cwd();
const sourceDirectory = path.join(root, "content", "campaigns");
const validateOnly = process.argv.includes("--validate-only");
const requireStorage = process.argv.includes("--require-storage");

async function readCampaignFiles() {
  let entries;
  try {
    entries = await fs.readdir(sourceDirectory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  return Promise.all(
    filenames.map(async (filename) => {
      const text = await fs.readFile(path.join(sourceDirectory, filename), "utf8");
      try {
        return JSON.parse(text);
      } catch (error) {
        throw new Error(`${filename} is not valid JSON: ${error.message}`);
      }
    }),
  );
}

async function addImageDimensions(image, label) {
  if (!image?.src || typeof image.src !== "string") return image;
  if (!image.src.startsWith("/images/") || image.src.includes("..")) return image;

  const imagePath = path.join(root, "public", image.src.slice(1));
  let buffer;
  try {
    buffer = await fs.readFile(imagePath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new Error(`${label} references a missing file: ${image.src}`);
    }
    throw error;
  }

  const dimensions = imageSize(buffer);
  if (!dimensions.width || !dimensions.height) {
    throw new Error(`${label} dimensions could not be read: ${image.src}`);
  }

  return { ...image, width: dimensions.width, height: dimensions.height };
}

async function hydrateCampaign(campaign) {
  const heroImage = await addImageDimensions(campaign.heroImage, `${campaign.slug || "campaign"}.heroImage`);
  const supportingImages = await Promise.all(
    (campaign.supportingImages || []).map((image, index) =>
      addImageDimensions(image, `${campaign.slug || "campaign"}.supportingImages.${index}`),
    ),
  );
  return { ...campaign, heroImage, supportingImages };
}

async function publishCatalog(catalog) {
  const connectionString = process.env.CAMPAIGN_STORAGE_CONNECTION_STRING || "";
  if (!connectionString) {
    if (requireStorage) {
      throw new Error("CAMPAIGN_STORAGE_CONNECTION_STRING is required for campaign publishing");
    }
    console.log("Campaign content is valid. Storage upload skipped because no campaign connection string is configured.");
    return;
  }

  const containerName = process.env.CAMPAIGN_STORAGE_CONTAINER || "passbyira-campaigns";
  const blobName = process.env.CAMPAIGN_STORAGE_BLOB || "published/campaigns.json";
  const service = BlobServiceClient.fromConnectionString(connectionString);
  const container = service.getContainerClient(containerName);
  await container.createIfNotExists();
  const accessPolicy = await container.getAccessPolicy();
  if (accessPolicy.blobPublicAccess) {
    throw new Error(
      `Campaign publishing refused: ${containerName} allows public ${accessPolicy.blobPublicAccess} access`,
    );
  }

  const payload = JSON.stringify(catalog);
  await container.getBlockBlobClient(blobName).upload(payload, Buffer.byteLength(payload), {
    blobHTTPHeaders: {
      blobContentType: "application/json; charset=utf-8",
      blobCacheControl: "no-store",
    },
    metadata: {
      schemaVersion: String(CAMPAIGN_SCHEMA_VERSION),
      publishedCount: String(catalog.campaigns.length),
    },
  });

  console.log(`Published ${catalog.campaigns.length} campaign(s) to ${containerName}/${blobName}.`);
}

async function main() {
  const sourceCampaigns = await readCampaignFiles();
  const hydratedCampaigns = await Promise.all(sourceCampaigns.map(hydrateCampaign));
  const campaigns = preparePublishedCampaigns(hydratedCampaigns);
  const catalog = {
    schemaVersion: CAMPAIGN_SCHEMA_VERSION,
    publishedAt: new Date().toISOString(),
    campaigns,
  };

  console.log(`Validated ${sourceCampaigns.length} campaign document(s); ${campaigns.length} are approved for public delivery.`);
  if (!validateOnly) await publishCatalog(catalog);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
