import assert from "node:assert/strict";
import test from "node:test";

import {
  contrastRatio,
  findActiveCampaign,
  getCacheMaxAgeSeconds,
  getCampaignState,
  preparePublishedCampaigns,
  resolveCampaign,
  validateCampaign,
} from "../api/_lib/campaigns.js";

function makeCampaign(overrides = {}) {
  return {
    status: "published",
    slug: "winter-care",
    eyebrow: "Seasonal campaign",
    title: "Winter care starts with us",
    summary: "Help provide practical, dignified support to neighbors across Dallas–Fort Worth during the coldest weeks of the year.",
    body: [
      "This seasonal campaign connects community generosity with direct outreach led by Pass by Ira volunteers and trusted partners.",
    ],
    startsAt: "2026-11-01T00:00:00-05:00",
    endsAt: "2027-02-01T00:00:00-06:00",
    timezone: "America/Chicago",
    promotionPlacement: "both",
    promotionPriority: 50,
    postExpiration: { behavior: "archive", redirectUrl: "" },
    visual: { theme: "slate", heroTreatment: "split", ctaStyle: "solid" },
    heroImage: {
      src: "/images/uploads/winter-care.webp",
      alt: "Volunteers organizing winter outreach supplies",
      caption: "Preparing seasonal supplies for direct outreach.",
      credit: "Pass by Ira",
      focalPoint: "center",
      width: 1600,
      height: 1000,
    },
    supportingImages: [
      {
        order: 1,
        src: "/images/uploads/winter-team.webp",
        alt: "Volunteers working together at a winter outreach event",
        caption: "Volunteers turn community care into action.",
        credit: "Pass by Ira",
        focalPoint: "top",
        width: 1200,
        height: 900,
      },
    ],
    ctas: [
      { label: "Fund winter outreach", href: "https://example.org/give", kind: "primary" },
      { label: "Volunteer this winter", href: "/sign-up-to-volunteer", kind: "secondary" },
    ],
    seo: {
      title: "Winter Care Campaign | Pass by Ira",
      description: "Support Pass by Ira's winter care campaign and help fund dignified direct outreach for neighbors across the Dallas–Fort Worth Metroplex.",
    },
    ...overrides,
  };
}

test("a complete campaign passes publishing validation", () => {
  const result = validateCampaign(makeCampaign());
  assert.equal(result.valid, true, result.errors.join("\n"));
});

test("schedule timestamps must include a UTC designator or explicit offset", () => {
  const result = validateCampaign(makeCampaign({ startsAt: "2026-11-01T00:00:00" }));
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /explicit UTC offset/);
});

test("the publish catalog excludes drafts and strips fields not in the public schema", () => {
  const published = makeCampaign({ editorialNotes: "Never make this public" });
  const draft = makeCampaign({ status: "draft", slug: "future-draft" });
  const catalog = preparePublishedCampaigns([published, draft]);

  assert.equal(catalog.length, 1);
  assert.equal(catalog[0].slug, "winter-care");
  assert.equal("editorialNotes" in catalog[0], false);
  assert.equal(JSON.stringify(catalog).includes("Never make this public"), false);
});

test("campaign boundaries are inclusive at start and exclusive at end", () => {
  const campaign = preparePublishedCampaigns([makeCampaign()])[0];
  assert.equal(getCampaignState(campaign, new Date("2026-11-01T04:59:59.999Z")), "upcoming");
  assert.equal(getCampaignState(campaign, new Date("2026-11-01T05:00:00.000Z")), "active");
  assert.equal(getCampaignState(campaign, new Date("2027-02-01T05:59:59.999Z")), "active");
  assert.equal(getCampaignState(campaign, new Date("2027-02-01T06:00:00.000Z")), "expired");
});

test("future campaigns and hidden expired campaigns are not returned", () => {
  const hidden = preparePublishedCampaigns([
    makeCampaign({ postExpiration: { behavior: "hide", redirectUrl: "" } }),
  ]);
  assert.deepEqual(resolveCampaign(hidden, "winter-care", new Date("2026-10-01T00:00:00Z")), { kind: "not-found" });
  assert.deepEqual(resolveCampaign(hidden, "winter-care", new Date("2027-03-01T00:00:00Z")), { kind: "not-found" });
});

test("archive removes campaign-specific calls to action after expiration", () => {
  const campaigns = preparePublishedCampaigns([makeCampaign()]);
  const result = resolveCampaign(campaigns, "winter-care", new Date("2027-03-01T00:00:00Z"));
  assert.equal(result.kind, "campaign");
  assert.equal(result.state, "expired");
  assert.deepEqual(result.campaign.ctas, []);
});

test("redirect is returned only after the configured end boundary", () => {
  const campaigns = preparePublishedCampaigns([
    makeCampaign({ postExpiration: { behavior: "redirect", redirectUrl: "/support-us" } }),
  ]);
  assert.equal(resolveCampaign(campaigns, "winter-care", new Date("2027-01-01T00:00:00Z")).kind, "campaign");
  assert.deepEqual(resolveCampaign(campaigns, "winter-care", new Date("2027-03-01T00:00:00Z")), {
    kind: "redirect",
    redirectUrl: "/support-us",
  });
});

test("the highest-priority active campaign wins a promotion placement", () => {
  const campaigns = preparePublishedCampaigns([
    makeCampaign(),
    makeCampaign({ slug: "urgent-winter-care", promotionPriority: 90 }),
  ]);
  const active = findActiveCampaign(campaigns, "homepage", new Date("2026-12-01T00:00:00Z"));
  assert.equal(active.slug, "urgent-winter-care");
});

test("cache lifetime never crosses the next scheduling boundary", () => {
  const campaigns = preparePublishedCampaigns([makeCampaign()]);
  const now = new Date("2026-11-01T04:59:50.500Z");
  assert.equal(getCacheMaxAgeSeconds(campaigns, now), 9);
});

test("approved theme text pairs meet WCAG AA contrast", () => {
  assert.ok(contrastRatio("#393734", "#ffffff") >= 4.5);
  assert.ok(contrastRatio("#5b4638", "#ffffff") >= 4.5);
  assert.ok(contrastRatio("#221f1d", "#ffffff") >= 4.5);
});
