import galleryData from "@/content/gallery/events.json";

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

export const galleryItems = galleryData.items as readonly GalleryItem[];

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
