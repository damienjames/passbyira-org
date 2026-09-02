import newsData from "@/content/posts/posts.json";

export const SITE_NAME = "Pass by Ira";
export const FALLBACK_SITE_URL = "https://www.passbyira.org";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/$/, "");
export const OG_IMAGE_PATH = "/og.png";
export const OG_IMAGE_ALT = "Pass by Ira — Everyone deserves a place to call home";

export const CONTACT_FORM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT || "";
export const NEWSLETTER_FORM_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_ENDPOINT || "";

const CORE_SITE_ROUTES = [
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
] as const;

export const SITE_ROUTES: readonly string[] = [
  ...CORE_SITE_ROUTES,
  ...newsData.posts.map((post) => `/${post.slug}`),
];

export function getAbsoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
