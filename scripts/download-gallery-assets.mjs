import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_CAPTURE_PATH = path.join(ROOT, "data", "gallery-source-capture.json");
const LEGACY_MANIFEST_PATH = path.join(ROOT, "data", "gallery-wix-assets.json");
const EXPANDED_MANIFEST_PATH = path.join(ROOT, "data", "gallery-expanded-assets.json");
const CONTENT_PATH = path.join(ROOT, "content", "gallery", "events.json");
const OUTPUT_ROOT = path.join(ROOT, "public", "images", "gallery", "expanded");

const GROUPS = {
  serve: {
    id: "serve",
    title: "2023 Thanksgiving Dinner",
    subtitle: "SERVE annual holiday meal drive",
    body: "The complete live-site archive from the 2023 SERVE dinner: food preparation, volunteer effort, and direct community care during the holiday season.",
    altPrefix: "Pass by Ira's 2023 Thanksgiving Dinner",
    coverAssetId: "129b3c_6c4307da023f42f2b365003f5e8dff40~mv2",
  },
  rest: {
    id: "rest",
    title: "2024 Team Retreat",
    subtitle: "REST leadership retreat",
    body: "The complete live-site REST archive, preserving the workshops, collaboration, reflection, and relationship-building moments from the 2024 team retreat.",
    altPrefix: "Pass by Ira's 2024 REST Leadership Retreat",
    coverAssetId: "4db8fe_ab01646ecc6d448d91676b695327ddbe~mv2",
  },
  coatsCocoa: {
    id: "coats-cocoa",
    title: "Coats & Cocoa",
    subtitle: "Winter outreach, meals, and direct distribution",
    body: "The complete embedded live-site archive from Coats & Cocoa, documenting volunteers, donated winter essentials, prepared meals, and community outreach.",
    altPrefix: "Pass by Ira's Coats & Cocoa outreach",
    coverAssetId: "4db8fe_18000a5d536249b6a3aed3337761dbd7~mv2",
  },
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeAssetId(assetFile) {
  return assetFile.replace(/\.(?:jpe?g|png|webp)$/i, "");
}

function webPath(filePath) {
  return filePath.replace(/^public/, "").split(path.sep).join("/");
}

function sourceUrl(assetFile) {
  return `https://static.wixstatic.com/media/${assetFile}/v1/fit/w_1800,h_1800,q_90/${assetFile}`;
}

function outputPath(groupKey, assetId) {
  return path.join(OUTPUT_ROOT, groupKey, `${assetId.replace(/[^a-zA-Z0-9_-]+/g, "-")}.webp`);
}

async function downloadAndConvert(entry, tempRoot) {
  if (fs.existsSync(entry.absolutePath)) {
    return false;
  }

  ensureDir(path.dirname(entry.absolutePath));
  const response = await fetch(entry.sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to download ${entry.sourceUrl} (${response.status})`);
  }

  const extension = path.extname(entry.assetFile) || ".jpg";
  const tempPath = path.join(tempRoot, `${entry.assetId.replace(/[^a-zA-Z0-9_-]+/g, "-")}${extension}`);
  fs.writeFileSync(tempPath, Buffer.from(await response.arrayBuffer()));

  const conversion = spawnSync("cwebp", ["-quiet", "-mt", "-q", "82", tempPath, "-o", entry.absolutePath], {
    encoding: "utf8",
  });
  if (conversion.status !== 0) {
    throw new Error(`cwebp failed for ${entry.assetFile}: ${conversion.stderr || conversion.stdout}`);
  }

  fs.rmSync(tempPath, { force: true });
  return true;
}

async function runPool(entries, size, worker) {
  let cursor = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (cursor < entries.length) {
        const entry = entries[cursor];
        cursor += 1;
        await worker(entry);
      }
    }),
  );
}

async function main() {
  if (!fs.existsSync(SOURCE_CAPTURE_PATH)) {
    throw new Error(`Missing expanded gallery capture: ${SOURCE_CAPTURE_PATH}`);
  }

  const capture = JSON.parse(fs.readFileSync(SOURCE_CAPTURE_PATH, "utf8"));
  const legacyManifest = fs.existsSync(LEGACY_MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(LEGACY_MANIFEST_PATH, "utf8"))
    : [];
  const legacyById = new Map(legacyManifest.map((item) => [item.assetId, item]));
  const groupedEntries = {};

  for (const [groupKey, assetFiles] of Object.entries(capture.groups)) {
    groupedEntries[groupKey] = assetFiles.map((assetFile) => {
      const assetId = normalizeAssetId(assetFile);
      const legacy = legacyById.get(assetId);
      const absolutePath = legacy ? path.join(ROOT, legacy.localPath) : outputPath(groupKey, assetId);
      return {
        group: groupKey,
        assetId,
        assetFile,
        sourceUrl: sourceUrl(assetFile),
        absolutePath,
        localPath: path.relative(ROOT, absolutePath).split(path.sep).join("/"),
        reusedFromInitialCrawl: Boolean(legacy),
      };
    });
  }

  const allEntries = Object.values(groupedEntries).flat();
  const missingEntries = allEntries.filter((entry) => !fs.existsSync(entry.absolutePath));
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "passbyira-gallery-"));
  let completed = 0;

  console.log(`Expanded archive: ${allEntries.length} photographs (${missingEntries.length} downloads needed)`);
  try {
    await runPool(missingEntries, 4, async (entry) => {
      await downloadAndConvert(entry, tempRoot);
      completed += 1;
      console.log(`Downloaded ${completed}/${missingEntries.length}: ${entry.group}/${entry.assetId}`);
    });
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  const content = {
    sourcePage: capture.sourcePage,
    sourceCapturedAt: capture.capturedAt,
    items: Object.entries(GROUPS).map(([groupKey, metadata]) => {
      const { altPrefix, coverAssetId, ...publicMetadata } = metadata;
      const entries = groupedEntries[groupKey];
      const images = entries.map((entry, index) => ({
        src: webPath(entry.localPath),
        alt: `${altPrefix} — archive photo ${index + 1} of ${entries.length}`,
      }));
      const coverIndex = Math.max(0, entries.findIndex((entry) => entry.assetId === coverAssetId));
      return {
        ...publicMetadata,
        src: images[coverIndex].src,
        alt: `${altPrefix} — featured archive photograph`,
        images,
      };
    }),
  };

  ensureDir(path.dirname(EXPANDED_MANIFEST_PATH));
  ensureDir(path.dirname(CONTENT_PATH));
  const manifestEntries = allEntries.map((entry) =>
    Object.fromEntries(Object.entries(entry).filter(([key]) => key !== "absolutePath")),
  );
  fs.writeFileSync(EXPANDED_MANIFEST_PATH, `${JSON.stringify(manifestEntries, null, 2)}\n`);
  fs.writeFileSync(CONTENT_PATH, `${JSON.stringify(content, null, 2)}\n`);

  console.log(`Saved ${allEntries.length} archive records to ${EXPANDED_MANIFEST_PATH}`);
  console.log(`Saved CMS-editable gallery content to ${CONTENT_PATH}`);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});
