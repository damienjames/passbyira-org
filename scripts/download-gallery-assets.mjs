import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PAGE_URL = "https://www.passbyira.org/past-events";
const OUTPUT_DIR = path.join(ROOT, "public", "images", "gallery", "wix-archive");
const MANIFEST_PATH = path.join(ROOT, "data", "gallery-wix-assets.json");

const URL_PATTERN = /https:\/\/static\.wixstatic\.com\/media\/[^"'\s)<>]+/g;
const MEDIA_PATTERN = /\/media\/([^./]+_[^./]+~mv2\.(?:jpg|jpeg|png|webp))(?:\/v1\/(fill|fit)\/w_(\d+),h_(\d+)[^/]*\/([^/?#]+))?/i;

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function scoreCandidate(candidate) {
  return candidate.width * candidate.height;
}

function extractCandidates(html) {
  const urls = html.match(URL_PATTERN) || [];
  const byAsset = new Map();

  for (const rawUrl of urls) {
    const url = rawUrl.replace(/&amp;/g, "&");
    const match = url.match(MEDIA_PATTERN);
    if (!match) {
      continue;
    }

    const [, assetFile, mode = "raw", width = "0", height = "0", trailingName] = match;
    const lowerName = (trailingName || assetFile).toLowerCase();
    if (lowerName.includes("logo") || lowerName.includes("blur_2")) {
      continue;
    }

    const assetId = assetFile.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    const candidate = {
      assetId,
      assetFile,
      fileName: sanitizeFileName(trailingName || assetFile),
      url,
      mode,
      width: Number(width),
      height: Number(height),
    };

    const existing = byAsset.get(assetId);
    if (!existing || scoreCandidate(candidate) > scoreCandidate(existing)) {
      byAsset.set(assetId, candidate);
    }
  }

  return [...byAsset.values()].sort((left, right) => right.width * right.height - left.width * left.height);
}

async function downloadFile(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
}

async function main() {
  console.log(`Fetching ${PAGE_URL}`);
  const response = await fetch(PAGE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch gallery page (${response.status})`);
  }

  const html = await response.text();
  const candidates = extractCandidates(html);

  ensureDir(OUTPUT_DIR);
  ensureDir(path.dirname(MANIFEST_PATH));

  const manifest = [];
  for (const [index, candidate] of candidates.entries()) {
    const targetName = `${String(index + 1).padStart(3, "0")}-${candidate.fileName}`;
    const outputPath = path.join(OUTPUT_DIR, targetName);
    console.log(`Downloading ${index + 1}/${candidates.length}: ${targetName}`);
    await downloadFile(candidate.url, outputPath);
    manifest.push({
      assetId: candidate.assetId,
      fileName: targetName,
      sourceUrl: candidate.url,
      width: candidate.width,
      height: candidate.height,
      mode: candidate.mode,
      localPath: `public/images/gallery/wix-archive/${targetName}`,
    });
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\nSaved ${manifest.length} images to ${OUTPUT_DIR}`);
  console.log(`Manifest written to ${MANIFEST_PATH}`);
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});