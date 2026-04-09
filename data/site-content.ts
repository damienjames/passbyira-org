export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  alt: string;
  body: string;
  images: readonly GalleryImage[];
}

export const siteImages = {
  homeSupport: {
    src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
    alt: "Pass by Ira volunteers sharing meals with community members in Dallas",
  },
  aboutHero: {
    src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
    alt: "Pass by Ira outreach in the field",
  },
  teamHero: {
    src: "/images/gallery/wix-archive/026-4db8fe_cad34d6f0e2b47a39f72d22b114891dc-mv2.webp",
    alt: "Pass by Ira leadership team together at the REST Retreat",
  },
  programsHero: {
    src: "/images/gallery/wix-archive/011-129b3c_9502441c8934426ea707f5de634bbce5-mv2.webp",
    alt: "Pass by Ira volunteers preparing meals together",
  },
  supportHero: {
    src: "/images/gallery/wix-archive/003-129b3c_c8014410ad354faa9cea95febd8a87fb-mv2.webp",
    alt: "Pass by Ira volunteers handing prepared meals to community members",
  },
  contactHero: {
    src: "/images/gallery/wix-archive/028-4db8fe_a5b4cbe998ca40d9bab4445d37117037-mv2.webp",
    alt: "Pass by Ira community gathered together indoors",
  },
  restHero: {
    src: "/images/gallery/wix-archive/021-4db8fe_ab01646ecc6d448d91676b695327ddbe-mv2.webp",
    alt: "REST Retreat speaker leading a session with attendees",
  },
  sponsorshipHero: {
    src: "/images/gallery/wix-archive/019-4db8fe_f7928a0b5ad144d08420f57f390600e4-mv2.webp",
    alt: "REST Retreat guests gathered at a sponsor-facing event moment",
  },
  coatsAndCocoa: {
    src: "/images/gallery/wix-archive/003-129b3c_c8014410ad354faa9cea95febd8a87fb-mv2.webp",
    alt: "Pass by Ira volunteers preparing meals for Coats and Cocoa",
  },
} as const;

export const homepageFeaturedEvents = [
  {
    id: "serve",
    src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
    alt: "Pass by Ira volunteer connecting with a community member during outreach",
    caption: "2023 Thanksgiving Dinner",
    summary: "A SERVE photo set focused on preparing and distributing warm meals with dignity during the 2023 holiday season.",
  },
  {
    id: "coats-cocoa",
    src: siteImages.coatsAndCocoa.src,
    alt: siteImages.coatsAndCocoa.alt,
    caption: "Coats & Cocoa",
    summary: "A winter outreach built around coats, cocoa, hot meals, and direct care for neighbors during the coldest season.",
  },
  {
    id: "rest",
    src: "/images/gallery/wix-archive/026-4db8fe_cad34d6f0e2b47a39f72d22b114891dc-mv2.webp",
    alt: "Pass by Ira leadership team gathered at the REST Retreat",
    caption: "2024 Team Retreat",
    summary: "A REST retreat photo set centered on leadership development, collaboration, and relationship-building.",
  },
] as const;

export const galleryItems: readonly GalleryItem[] = [
  {
    id: "serve",
    title: "2023 Thanksgiving Dinner",
    subtitle: "SERVE annual holiday meal drive",
    src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
    alt: "Pass by Ira volunteer connecting with a community member during outreach",
    body: "A SERVE event built around warm meals, steady outreach, and direct community care during the 2023 holiday season.",
    images: [
      {
        src: "/images/gallery/wix-archive/001-129b3c_5d17920a9f504fe8af22b93c06f15b05-mv2.webp",
        alt: "Pass by Ira volunteers serving hot meals during SERVE outreach",
      },
      {
        src: "/images/gallery/wix-archive/004-129b3c_428b7d7a55eb4afba4875e0bcd86df93-mv2.webp",
        alt: "Pass by Ira volunteer holding a plated meal during SERVE outreach",
      },
      {
        src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
        alt: "Pass by Ira volunteer connecting with a community member during SERVE outreach",
      },
      {
        src: "/images/gallery/wix-archive/010-129b3c_18868cc8893741f785f3d80f54ea7aa4-mv2.webp",
        alt: "Dallas skyline and outreach setting during a Pass by Ira SERVE event",
      },
      {
        src: "/images/gallery/wix-archive/011-129b3c_9502441c8934426ea707f5de634bbce5-mv2.webp",
        alt: "Pass by Ira volunteers preparing meals together for SERVE",
      },
    ],
  },
  {
    id: "coats-cocoa",
    title: "Coats & Cocoa",
    subtitle: "Winter outreach, meals, and direct distribution",
    src: siteImages.coatsAndCocoa.src,
    alt: siteImages.coatsAndCocoa.alt,
    body: "These photos belong with Coats & Cocoa: volunteers preparing warm meals, packing food, and meeting neighbors directly with winter-season care and visible support.",
    images: [
      {
        src: "/images/gallery/wix-archive/009-129b3c_a5172118cb874ef5a1bc0656ff35664e-mv2.webp",
        alt: "Pass by Ira volunteers setting up meal service for Coats and Cocoa",
      },
      {
        src: "/images/gallery/wix-archive/003-129b3c_c8014410ad354faa9cea95febd8a87fb-mv2.webp",
        alt: "Pass by Ira volunteers preparing meals for Coats and Cocoa",
      },
      {
        src: "/images/gallery/wix-archive/001-129b3c_5d17920a9f504fe8af22b93c06f15b05-mv2.webp",
        alt: "Pass by Ira volunteers serving hot meals during Coats and Cocoa",
      },
      {
        src: "/images/gallery/wix-archive/004-129b3c_428b7d7a55eb4afba4875e0bcd86df93-mv2.webp",
        alt: "Pass by Ira volunteer holding a plated meal during Coats and Cocoa",
      },
      {
        src: "/images/gallery/wix-archive/007-4db8fe_883fc845fe7e4c1bb457cc85c38a8901-mv2.webp",
        alt: "Pass by Ira volunteers sharing a plated meal together during Coats and Cocoa",
      },
      {
        src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
        alt: "Pass by Ira volunteer connecting with a community member during Coats and Cocoa outreach",
      },
      {
        src: "/images/gallery/wix-archive/002-129b3c_1436c874fe7c45c58dfb5236d0aa3dae-mv2.webp",
        alt: "Pass by Ira volunteers distributing meals during Coats and Cocoa in downtown Dallas",
      },
      {
        src: "/images/hero/support-banner.webp",
        alt: "Pass by Ira volunteers and community members at Coats and Cocoa",
      },
    ],
  },
  {
    id: "rest",
    title: "2024 Team Retreat",
    subtitle: "REST leadership retreat",
    src: "/images/gallery/wix-archive/021-4db8fe_ab01646ecc6d448d91676b695327ddbe-mv2.webp",
    alt: "REST Retreat speaker leading a session with attendees",
    body: "A retreat gallery showing REST's workshops, collaboration, and relationship-building moments from the 2024 team retreat.",
    images: [
      {
        src: "/images/gallery/wix-archive/021-4db8fe_ab01646ecc6d448d91676b695327ddbe-mv2.webp",
        alt: "REST Retreat speaker leading a session with attendees",
      },
      {
        src: "/images/gallery/wix-archive/020-4db8fe_c292ada5e42246efba82b536122c0f20-mv2.webp",
        alt: "REST Retreat collaboration session with attendees gathered in discussion",
      },
      {
        src: "/images/gallery/wix-archive/014-4db8fe_300e78648b0146a19e796e1e3f990915-mv2.webp",
        alt: "REST Retreat facilitator welcoming guests in the main event space",
      },
      {
        src: "/images/gallery/wix-archive/025-4db8fe_26d40945f1fb4796822df4153fdb3310-mv2.webp",
        alt: "REST Retreat participants listening during a group session",
      },
      {
        src: "/images/gallery/wix-archive/016-4db8fe_6ead3b08e245489f9e8075403d3632f2-mv2.webp",
        alt: "REST Retreat guests gathered beneath the event balloon installation",
      },
      {
        src: "/images/gallery/wix-archive/026-4db8fe_cad34d6f0e2b47a39f72d22b114891dc-mv2.webp",
        alt: "Pass by Ira leadership team gathered at the REST Retreat",
      },
      {
        src: "/images/gallery/wix-archive/019-4db8fe_f7928a0b5ad144d08420f57f390600e4-mv2.webp",
        alt: "REST Retreat guests posing beneath a balloon installation",
      },
    ],
  },
] as const;

export const restFramework = [
  {
    title: "Renew",
    body: "Create space for leaders to rest, reflect, and return to their work with restored energy.",
  },
  {
    title: "Elevate",
    body: "Share knowledge, expand leadership capacity, and raise the quality of community impact.",
  },
  {
    title: "Sustain",
    body: "Build durable relationships and support systems that outlast a single event or season.",
  },
  {
    title: "Transform",
    body: "Turn connection and strategy into meaningful change for organizations and the communities they serve.",
  },
] as const;

export const sponsorshipLevels = [
  {
    name: "Platinum Sponsor",
    amount: "$10,000+",
    body: "Maximum visibility with title-level recognition, premium placement, event presence, and a full-page ad.",
  },
  {
    name: "Gold Sponsor",
    amount: "$5,000",
    body: "Prominent event-wide visibility with strong branding, stage recognition, and a half-page ad.",
  },
  {
    name: "Silver Sponsor",
    amount: "$2,500",
    body: "Solid promotional benefits with logo placement, stage recognition, and a quarter-page ad.",
  },
  {
    name: "Bronze Sponsor",
    amount: "$1,000",
    body: "An accessible sponsorship tier for organizations that want to support the event and mission visibly.",
  },
  {
    name: "Community Partner",
    amount: "$500",
    body: "A grassroots way for local businesses and individuals to show support and be recognized.",
  },
  {
    name: "In-Kind Sponsor",
    amount: "Custom",
    body: "Support with goods or services such as catering, printing, venue support, or media and advertising.",
  },
] as const;

export const partnershipWays = [
  "Corporate and small-business sponsorships",
  "Employee volunteer and engagement opportunities",
  "Mission-aligned in-kind contributions",
  "Program or event advertising placements",
  "Planned giving and long-term legacy support",
] as const;
