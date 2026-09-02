export type CampaignState = "active" | "expired";
export type CampaignPlacement = "none" | "homepage" | "announcement" | "both";
export type CampaignTheme = "slate" | "warmth" | "high-contrast";
export type CampaignHeroTreatment = "split" | "full-bleed" | "editorial";
export type CampaignCtaStyle = "solid" | "outlined";
export type CampaignCtaKind = "primary" | "secondary";
export type CampaignFocalPoint =
  | "top-left"
  | "top"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom"
  | "bottom-right";

export interface CampaignImage {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  focalPoint: CampaignFocalPoint;
  width: number;
  height: number;
  order?: number;
}

export interface Campaign {
  schemaVersion: number;
  slug: string;
  status: "published";
  eyebrow: string;
  title: string;
  summary: string;
  body: string[];
  startsAt: string;
  endsAt: string;
  timezone: string;
  promotionPlacement: CampaignPlacement;
  promotionPriority: number;
  postExpiration: {
    behavior: "hide" | "archive" | "redirect";
    redirectUrl: string;
  };
  visual: {
    theme: CampaignTheme;
    heroTreatment: CampaignHeroTreatment;
    ctaStyle: CampaignCtaStyle;
  };
  heroImage: CampaignImage;
  supportingImages: CampaignImage[];
  ctas: Array<{
    label: string;
    href: string;
    kind: CampaignCtaKind;
  }>;
  seo: {
    title: string;
    description: string;
  };
}

export type CampaignApiResponse =
  | { state: CampaignState; campaign: Campaign }
  | { kind: "redirect"; redirectUrl: string };

const configuredApiBase = (process.env.NEXT_PUBLIC_CAMPAIGN_API_BASE || "/api").replace(/\/$/, "");

export function campaignHref(slug: string) {
  return `/campaign/?slug=${encodeURIComponent(slug)}`;
}

export function campaignApiUrl(path: string) {
  const apiBase =
    configuredApiBase === "/api" &&
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:7071/api"
      : configuredApiBase;
  return `${apiBase}/campaigns/${path.replace(/^\//, "")}`;
}

export function focalPointPosition(focalPoint: CampaignFocalPoint) {
  const positions: Record<CampaignFocalPoint, string> = {
    "top-left": "left top",
    top: "center top",
    "top-right": "right top",
    left: "left center",
    center: "center center",
    right: "right center",
    "bottom-left": "left bottom",
    bottom: "center bottom",
    "bottom-right": "right bottom",
  };
  return positions[focalPoint];
}
