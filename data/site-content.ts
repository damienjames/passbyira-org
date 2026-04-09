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
    src: "/images/hero/support-banner.webp",
    alt: "Pass by Ira volunteers and community members at Coats and Cocoa",
  },
} as const;

export const homepageFeaturedEvents = [
  {
    id: "coats-cocoa",
    src: siteImages.coatsAndCocoa.src,
    alt: siteImages.coatsAndCocoa.alt,
    caption: "Coats & Cocoa",
    summary: "A winter outreach focused on coats, blankets, gloves, and hot drinks for neighbors facing cold-weather conditions.",
  },
  {
    id: "rest",
    src: "/images/gallery/wix-archive/026-4db8fe_cad34d6f0e2b47a39f72d22b114891dc-mv2.webp",
    alt: "Pass by Ira leadership team gathered at the REST Retreat",
    caption: "REST Retreat",
    summary: "A leadership gathering built to strengthen collaboration, knowledge-sharing, and long-term community impact.",
  },
] as const;

export const galleryItems: readonly GalleryItem[] = [
  {
    id: "serve",
    title: "SERVE",
    subtitle: "Meal prep and direct outreach",
    src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
    alt: "Pass by Ira volunteer delivering a meal during outreach",
    body: "SERVE is the meal-centered outreach tradition that helped shape Pass by Ira's work: preparing food, delivering it with dignity, and making sure neighbors are seen.",
    images: [
      {
        src: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
        alt: "Pass by Ira volunteer delivering a meal during outreach",
      },
      {
        src: "/images/gallery/wix-archive/003-129b3c_c8014410ad354faa9cea95febd8a87fb-mv2.webp",
        alt: "Pass by Ira volunteer handing out a prepared meal",
      },
      {
        src: "/images/gallery/wix-archive/001-129b3c_5d17920a9f504fe8af22b93c06f15b05-mv2.webp",
        alt: "Pass by Ira volunteers preparing food before service",
      },
      {
        src: "/images/gallery/wix-archive/011-129b3c_9502441c8934426ea707f5de634bbce5-mv2.webp",
        alt: "Pass by Ira volunteers plating and packing meals together",
      },
    ],
  },
  {
    id: "rest",
    title: "REST Leadership Retreat",
    subtitle: "Education and collaboration",
    src: "/images/gallery/wix-archive/026-4db8fe_cad34d6f0e2b47a39f72d22b114891dc-mv2.webp",
    alt: "Pass by Ira leadership team gathered at the REST Retreat",
    body: "The REST Retreat brings together nonprofit, small business, and community leaders to recharge, share strategy, and build partnerships that strengthen long-term impact.",
    images: [
      {
        src: "/images/gallery/wix-archive/026-4db8fe_cad34d6f0e2b47a39f72d22b114891dc-mv2.webp",
        alt: "Pass by Ira leadership team gathered at the REST Retreat",
      },
      {
        src: "/images/gallery/wix-archive/021-4db8fe_ab01646ecc6d448d91676b695327ddbe-mv2.webp",
        alt: "REST Retreat speaker leading a session with attendees",
      },
      {
        src: "/images/gallery/wix-archive/024-4db8fe_6b9360fd96de48a1a88634285c058a62-mv2.webp",
        alt: "REST Retreat team activity in the main meeting room",
      },
      {
        src: "/images/gallery/wix-archive/028-4db8fe_a5b4cbe998ca40d9bab4445d37117037-mv2.webp",
        alt: "REST Retreat group portrait",
      },
      {
        src: "/images/gallery/wix-archive/019-4db8fe_f7928a0b5ad144d08420f57f390600e4-mv2.webp",
        alt: "REST Retreat guests posing beneath a balloon installation",
      },
    ],
  },
  {
    id: "coats-cocoa",
    title: "Coats & Cocoa",
    subtitle: "Winter essentials and hot drinks",
    src: siteImages.coatsAndCocoa.src,
    alt: siteImages.coatsAndCocoa.alt,
    body: "Coats & Cocoa is Pass by Ira's cold-weather outreach effort, centered on coats, blankets, gloves, hot drinks, and visible care for neighbors navigating winter conditions.",
    images: [
      {
        src: siteImages.coatsAndCocoa.src,
        alt: siteImages.coatsAndCocoa.alt,
      },
    ],
  },
] as const;

export const additionalGalleryNote =
  "The live site references additional seasonal archives, but the local asset archive currently supports clearly identifiable SERVE, REST, and Coats & Cocoa coverage. THIRST photos can be slotted in cleanly once that set is organized.";

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
