import type { MetadataRoute } from "next";

import { SITE_ROUTES, getAbsoluteUrl, OG_IMAGE_PATH } from "@/lib/site";

export const dynamic = "force-static";

const lastModified = new Date("2026-09-01T00:00:00.000Z");

const routePriorities: Partial<Record<string, number>> = {
  "/": 1,
  "/donate": 0.95,
  "/sign-up-to-volunteer": 0.92,
  "/support-us": 0.9,
  "/rest": 0.82,
  "/sponsorship": 0.8,
  "/event": 0.8,
  "/contact": 0.78,
  "/blog": 0.72,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_ROUTES.map((path) => ({
    url: getAbsoluteUrl(path),
    lastModified,
    changeFrequency: path === "/" ? "weekly" : path.startsWith("/post/") ? "monthly" : "weekly",
    priority: routePriorities[path] ?? 0.68,
    images: path === "/" ? [getAbsoluteUrl(OG_IMAGE_PATH)] : undefined,
  }));
}
