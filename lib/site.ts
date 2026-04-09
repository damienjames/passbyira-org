export const SITE_NAME = "Pass by Ira";
export const FALLBACK_SITE_URL = "https://proud-mushroom-030eb6910.1.azurestaticapps.net";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");
export const OG_IMAGE_PATH = "/images/hero/support-banner.webp";
export const OG_IMAGE_ALT = "Pass by Ira volunteers and community members during outreach";

export const CONTACT_FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT || "";
export const NEWSLETTER_FORM_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ENDPOINT || "";

export const SITE_ROUTES = [
  "/",
  "/about-3",
  "/meet-the-team",
  "/event",
  "/rest",
  "/past-events",
  "/support-us",
  "/sign-up-to-volunteer",
  "/donate",
  "/sponsorship",
  "/contact",
  "/blog",
  "/post/quarterly-newsletter-february-2025",
  "/post/special-edition-newsletter-coats-cocoa-2024-the-recap",
  "/post/quarterly-newsletter-november-2024",
  "/30-for-30-campaign",
] as const;

export function getAbsoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
