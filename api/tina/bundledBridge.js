import fs from "node:fs";
import path from "node:path";
import { FilesystemBridge } from "@tinacms/graphql";

class BundledBridge extends FilesystemBridge {
  async put() {
    return;
  }

  async delete() {
    return;
  }
}

function resolveBundledRoot() {
  const candidates = [
    path.join(process.cwd(), "api"),
    process.cwd(),
  ];

  for (const candidate of candidates) {
    const hasGenerated = fs.existsSync(path.join(candidate, "tina", "__generated__", "_schema.json"));
    const hasContent = fs.existsSync(path.join(candidate, "content"));
    if (hasGenerated && hasContent) {
      return candidate;
    }
  }

  return candidates[0];
}

function createBundledBridge() {
  return new BundledBridge(resolveBundledRoot());
}

export { BundledBridge, createBundledBridge };
