const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_WITH_ZONE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

export const CAMPAIGN_SCHEMA_VERSION = 1;
export const CAMPAIGN_STATUSES = ["draft", "published"];
export const PROMOTION_PLACEMENTS = ["none", "homepage", "announcement", "both"];
export const EXPIRATION_BEHAVIORS = ["hide", "archive", "redirect"];
export const CAMPAIGN_THEMES = ["slate", "warmth", "high-contrast"];
export const HERO_TREATMENTS = ["split", "full-bleed", "editorial"];
export const CTA_STYLES = ["solid", "outlined"];
export const CTA_KINDS = ["primary", "secondary"];
export const FOCAL_POINTS = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
];

export const THEME_PRESETS = {
  slate: { background: "#393734", foreground: "#ffffff", accent: "#d8c9b8", accentText: "#221f1d" },
  warmth: { background: "#5b4638", foreground: "#ffffff", accent: "#f6f1ea", accentText: "#393734" },
  "high-contrast": { background: "#221f1d", foreground: "#ffffff", accent: "#b7c9d3", accentText: "#221f1d" },
};

function valueAt(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function requireString(source, path, errors, options = {}) {
  const value = valueAt(source, path);
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) {
    errors.push(`${path} is required`);
    return "";
  }
  if (options.min && trimmed.length < options.min) {
    errors.push(`${path} must be at least ${options.min} characters`);
  }
  if (options.max && trimmed.length > options.max) {
    errors.push(`${path} must be no more than ${options.max} characters`);
  }
  return trimmed;
}

function requireOption(source, path, allowed, errors) {
  const value = requireString(source, path, errors);
  if (value && !allowed.includes(value)) {
    errors.push(`${path} must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

function channelToLinear(value) {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
  return (
    channelToLinear(channels[0]) * 0.2126 +
    channelToLinear(channels[1]) * 0.7152 +
    channelToLinear(channels[2]) * 0.0722
  );
}

export function contrastRatio(first, second) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function validateDateTime(source, path, errors) {
  const value = requireString(source, path, errors);
  if (!value) return null;
  if (!ISO_WITH_ZONE_PATTERN.test(value)) {
    errors.push(`${path} must be an ISO date-time with Z or an explicit UTC offset`);
    return null;
  }
  const time = Date.parse(value);
  if (!Number.isFinite(time)) {
    errors.push(`${path} is not a valid date-time`);
    return null;
  }
  return time;
}

function validateUrl(value, path, errors, { allowRelative = true } = {}) {
  if (!value) return;
  if (allowRelative && value.startsWith("/") && !value.startsWith("//")) return;
  try {
    const parsed = new URL(value);
    if (!['https:', 'mailto:'].includes(parsed.protocol)) {
      errors.push(`${path} must use https, mailto, or a site-relative URL`);
    }
  } catch {
    errors.push(`${path} must be a valid URL`);
  }
}

function validateImage(image, path, errors, { hero = false } = {}) {
  if (!image || typeof image !== "object" || Array.isArray(image)) {
    errors.push(`${path} is required`);
    return;
  }

  const imageErrors = [];
  const src = requireString(image, "src", imageErrors);
  requireString(image, "alt", imageErrors, { min: 8, max: 180 });
  requireString(image, "caption", imageErrors, { min: 3, max: 240 });
  requireOption(image, "focalPoint", FOCAL_POINTS, imageErrors);
  imageErrors.forEach((error) => errors.push(`${path}.${error}`));

  if (src && (!src.startsWith("/images/") || src.includes(".."))) {
    errors.push(`${path}.src must reference an image managed under /public/images`);
  }

  if (image.width !== undefined || image.height !== undefined) {
    const width = Number(image.width);
    const height = Number(image.height);
    if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
      errors.push(`${path} dimensions must be positive integers`);
    } else {
      const minimumWidth = hero ? 1200 : 800;
      const minimumHeight = hero ? 600 : 600;
      if (width < minimumWidth || height < minimumHeight) {
        errors.push(`${path} must be at least ${minimumWidth}×${minimumHeight}px`);
      }
    }
  }
}

export function validateCampaign(campaign) {
  const errors = [];
  if (!campaign || typeof campaign !== "object" || Array.isArray(campaign)) {
    return { valid: false, errors: ["Campaign must be a JSON object"] };
  }

  const slug = requireString(campaign, "slug", errors, { min: 3, max: 80 });
  if (slug && !SLUG_PATTERN.test(slug)) {
    errors.push("slug must contain only lowercase letters, numbers, and single hyphens");
  }

  requireOption(campaign, "status", CAMPAIGN_STATUSES, errors);
  requireString(campaign, "eyebrow", errors, { min: 3, max: 60 });
  requireString(campaign, "title", errors, { min: 6, max: 90 });
  requireString(campaign, "summary", errors, { min: 30, max: 240 });

  if (!Array.isArray(campaign.body) || campaign.body.length === 0) {
    errors.push("body must include at least one paragraph");
  } else {
    campaign.body.forEach((paragraph, index) => {
      if (typeof paragraph !== "string" || paragraph.trim().length < 20) {
        errors.push(`body.${index} must be a paragraph of at least 20 characters`);
      }
    });
  }

  const startsAt = validateDateTime(campaign, "startsAt", errors);
  const endsAt = validateDateTime(campaign, "endsAt", errors);
  if (startsAt !== null && endsAt !== null && startsAt >= endsAt) {
    errors.push("endsAt must be later than startsAt");
  }

  const timezone = requireString(campaign, "timezone", errors);
  if (timezone) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
    } catch {
      errors.push("timezone must be a valid IANA time zone");
    }
  }

  requireOption(campaign, "promotionPlacement", PROMOTION_PLACEMENTS, errors);
  const priority = Number(campaign.promotionPriority);
  if (!Number.isInteger(priority) || priority < 0 || priority > 100) {
    errors.push("promotionPriority must be an integer from 0 to 100");
  }

  const behavior = requireOption(campaign, "postExpiration.behavior", EXPIRATION_BEHAVIORS, errors);
  const redirectUrl = typeof campaign.postExpiration?.redirectUrl === "string"
    ? campaign.postExpiration.redirectUrl.trim()
    : "";
  if (behavior === "redirect" && !redirectUrl) {
    errors.push("postExpiration.redirectUrl is required when behavior is redirect");
  }
  if (redirectUrl) validateUrl(redirectUrl, "postExpiration.redirectUrl", errors);

  const theme = requireOption(campaign, "visual.theme", CAMPAIGN_THEMES, errors);
  requireOption(campaign, "visual.heroTreatment", HERO_TREATMENTS, errors);
  requireOption(campaign, "visual.ctaStyle", CTA_STYLES, errors);
  if (theme) {
    const preset = THEME_PRESETS[theme];
    if (contrastRatio(preset.background, preset.foreground) < 4.5) {
      errors.push(`visual.theme ${theme} does not meet WCAG AA text contrast`);
    }
    if (contrastRatio(preset.accent, preset.accentText) < 4.5) {
      errors.push(`visual.theme ${theme} does not meet WCAG AA CTA contrast`);
    }
  }

  validateImage(campaign.heroImage, "heroImage", errors, { hero: true });
  if (!Array.isArray(campaign.supportingImages)) {
    errors.push("supportingImages must be a list");
  } else {
    const orders = new Set();
    campaign.supportingImages.forEach((image, index) => {
      validateImage(image, `supportingImages.${index}`, errors);
      const order = Number(image?.order);
      if (!Number.isInteger(order) || order < 1) {
        errors.push(`supportingImages.${index}.order must be a positive integer`);
      } else if (orders.has(order)) {
        errors.push(`supportingImages.${index}.order must be unique`);
      } else {
        orders.add(order);
      }
    });
  }

  if (!Array.isArray(campaign.ctas) || campaign.ctas.length === 0 || campaign.ctas.length > 2) {
    errors.push("ctas must include one or two calls to action");
  } else {
    const labels = new Set();
    campaign.ctas.forEach((cta, index) => {
      const label = requireString(cta, "label", errors, { min: 4, max: 50 });
      const normalized = label.toLowerCase();
      if (["click here", "learn more", "submit"].includes(normalized)) {
        errors.push(`ctas.${index}.label must describe the action`);
      }
      if (labels.has(normalized)) errors.push(`ctas.${index}.label must be unique`);
      labels.add(normalized);
      const href = requireString(cta, "href", errors);
      validateUrl(href, `ctas.${index}.href`, errors);
      requireOption(cta, "kind", CTA_KINDS, errors);
    });
  }

  requireString(campaign, "seo.title", errors, { min: 10, max: 70 });
  requireString(campaign, "seo.description", errors, { min: 50, max: 160 });

  return { valid: errors.length === 0, errors };
}

function sanitizeImage(image) {
  return {
    src: image.src.trim(),
    alt: image.alt.trim(),
    caption: image.caption.trim(),
    credit: typeof image.credit === "string" ? image.credit.trim() : "",
    focalPoint: image.focalPoint,
    width: Number(image.width),
    height: Number(image.height),
    ...(image.order === undefined ? {} : { order: Number(image.order) }),
  };
}

export function sanitizeCampaign(campaign) {
  return {
    schemaVersion: CAMPAIGN_SCHEMA_VERSION,
    slug: campaign.slug.trim(),
    status: campaign.status,
    eyebrow: campaign.eyebrow.trim(),
    title: campaign.title.trim(),
    summary: campaign.summary.trim(),
    body: campaign.body.map((paragraph) => paragraph.trim()),
    startsAt: new Date(campaign.startsAt).toISOString(),
    endsAt: new Date(campaign.endsAt).toISOString(),
    timezone: campaign.timezone.trim(),
    promotionPlacement: campaign.promotionPlacement,
    promotionPriority: Number(campaign.promotionPriority),
    postExpiration: {
      behavior: campaign.postExpiration.behavior,
      redirectUrl: campaign.postExpiration.redirectUrl?.trim() || "",
    },
    visual: {
      theme: campaign.visual.theme,
      heroTreatment: campaign.visual.heroTreatment,
      ctaStyle: campaign.visual.ctaStyle,
    },
    heroImage: sanitizeImage(campaign.heroImage),
    supportingImages: campaign.supportingImages
      .map(sanitizeImage)
      .sort((first, second) => first.order - second.order),
    ctas: campaign.ctas.map((cta) => ({
      label: cta.label.trim(),
      href: cta.href.trim(),
      kind: cta.kind,
    })),
    seo: {
      title: campaign.seo.title.trim(),
      description: campaign.seo.description.trim(),
    },
  };
}

export function preparePublishedCampaigns(campaigns) {
  const errors = [];
  const slugs = new Set();
  const sanitized = [];

  campaigns.forEach((campaign, index) => {
    const label = campaign?.slug || `campaign ${index + 1}`;
    const result = validateCampaign(campaign);
    result.errors.forEach((error) => errors.push(`${label}: ${error}`));
    if (campaign?.slug && slugs.has(campaign.slug)) {
      errors.push(`${label}: slug must be unique`);
    }
    if (campaign?.slug) slugs.add(campaign.slug);
    if (result.valid && campaign.status === "published") {
      sanitized.push(sanitizeCampaign(campaign));
    }
  });

  if (errors.length > 0) {
    const error = new Error(`Campaign validation failed:\n- ${errors.join("\n- ")}`);
    error.validationErrors = errors;
    throw error;
  }

  return sanitized.sort((first, second) => {
    if (second.promotionPriority !== first.promotionPriority) {
      return second.promotionPriority - first.promotionPriority;
    }
    return first.startsAt.localeCompare(second.startsAt);
  });
}

export function getCampaignState(campaign, now = new Date()) {
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const startsAt = Date.parse(campaign.startsAt);
  const endsAt = Date.parse(campaign.endsAt);
  if (nowTime < startsAt) return "upcoming";
  if (nowTime >= endsAt) return "expired";
  return "active";
}

export function placementIncludes(campaign, placement) {
  return campaign.promotionPlacement === placement || campaign.promotionPlacement === "both";
}

export function findActiveCampaign(campaigns, placement, now = new Date()) {
  return campaigns.find(
    (campaign) =>
      campaign.status === "published" &&
      getCampaignState(campaign, now) === "active" &&
      placementIncludes(campaign, placement),
  ) || null;
}

export function resolveCampaign(campaigns, slug, now = new Date()) {
  const campaign = campaigns.find(
    (item) => item.status === "published" && item.slug === slug,
  );
  if (!campaign) return { kind: "not-found" };

  const state = getCampaignState(campaign, now);
  if (state === "upcoming") return { kind: "not-found" };
  if (state === "active") return { kind: "campaign", state, campaign };

  if (campaign.postExpiration.behavior === "archive") {
    return {
      kind: "campaign",
      state,
      campaign: { ...campaign, ctas: [] },
    };
  }
  if (campaign.postExpiration.behavior === "redirect") {
    return {
      kind: "redirect",
      redirectUrl: campaign.postExpiration.redirectUrl,
    };
  }
  return { kind: "not-found" };
}

export function getCacheMaxAgeSeconds(campaigns, now = new Date(), ceiling = 60) {
  const nowTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const nextBoundary = campaigns
    .flatMap((campaign) => [Date.parse(campaign.startsAt), Date.parse(campaign.endsAt)])
    .filter((boundary) => Number.isFinite(boundary) && boundary > nowTime)
    .sort((first, second) => first - second)[0];

  if (!nextBoundary) return ceiling;
  return Math.max(0, Math.min(ceiling, Math.floor((nextBoundary - nowTime) / 1000)));
}
