import fs from "node:fs";
import path from "node:path";

// ─── Paths ────────────────────────────────────────────────────
// Reads .env.local from the healingthaispabynapa sibling directory
// since that's where the Gemini API key lives.
const ROOT = process.cwd();
const ENV_FILE = path.join(ROOT, "..", "healingthaispabynapa", ".env.local");
const INPUT_PATH = path.join(ROOT, "public", "images", "logo.jpg");
const OUTPUT_PATH = path.join(ROOT, "public", "images", "logo-nav.webp");
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return acc;
      const [key, ...rest] = trimmed.split("=");
      acc[key] = rest.join("=").trim();
      return acc;
    }, {});
}

function getApiKey() {
  const fileEnv = readEnvFile(ENV_FILE);
  return process.env.GEMINI_API_KEY || fileEnv.GEMINI_API_KEY || "";
}

async function main() {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY — check healingthaispabynapa/.env.local");

  console.log("Reading logo from:", INPUT_PATH);
  const imageBase64 = fs.readFileSync(INPUT_PATH).toString("base64");

  // Pass By Ira brand colors:
  //   Deep navy:  #0F2D54  (primary-dark — nav background)
  //   Brand blue: #1B4B8A  (primary)
  //   Warm gold:  #C9A227  (accent)
  //   White:      #FFFFFF
  const prompt = [
    "Edit this logo for use in a dark navy website navigation bar.",
    "The logo currently has a cream/beige background — remove it completely so the logo sits naturally on a flat deep navy background color #0F2D54.",
    "Keep the full logo design intact: the city skyline graphic, the house icon within the skyline, and the 'PASS BY Ira' wordmark.",
    "Recolor the cityscape/skyline graphic and the wordmark so they are clearly legible on the dark navy background:",
    "  - Use a warm gold color (#C9A227) for the city skyline and the house icon.",
    "  - Keep 'PASS BY' in clean white (#FFFFFF).",
    "  - Keep 'Ira' in the same warm gold (#C9A227).",
    "The background behind the logo should exactly match #0F2D54 with no box, shadow, or halo.",
    "Trim all excess whitespace so it fits compactly in a navigation bar.",
    "Do not redesign the logo. Do not change the layout or wording. Output a clean raster image.",
  ].join(" ");

  console.log("Sending to Gemini...");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
          ],
        },
      ],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed (${response.status}): ${await response.text()}`);
  }

  const json = await response.json();
  const parts =
    json?.candidates?.flatMap((c) => c?.content?.parts || []) || [];

  // Log any text feedback
  const textPart = parts.find((p) => p.text);
  if (textPart) console.log("Gemini note:", textPart.text);

  const imagePart = parts.find((p) => p.inlineData?.data);
  if (!imagePart) {
    throw new Error(
      `No image returned. Response keys: ${Object.keys(json || {}).join(", ")}`
    );
  }

  fs.writeFileSync(OUTPUT_PATH, Buffer.from(imagePart.inlineData.data, "base64"));
  console.log("✓ Saved recolored logo to:", OUTPUT_PATH);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exitCode = 1;
});
