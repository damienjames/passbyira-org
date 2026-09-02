import { AbstractAuthProvider, defineConfig, LocalAuthProvider } from "tinacms";

const branch = process.env.GITHUB_BRANCH || process.env.GIT_BRANCH || process.env.HEAD || "main";
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
const authBasePath = "/api/tina/auth";

async function authRequest(path: string, init?: RequestInit) {
  const response = await fetch(`${authBasePath}/${path}`, {
    credentials: "same-origin",
    ...init,
  });
  return response.json();
}

class PassByIraAuthProvider extends AbstractAuthProvider {
  async authenticate(props?: Record<string, string>) {
    const username = props?.username?.trim();
    const password = props?.password;
    if (!username || !password) throw new Error("Username and password are required");

    const { csrfToken } = await authRequest("csrf");
    const response = await authRequest("callback/credentials", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: csrfToken || "",
        username,
        password,
        callbackUrl: "/admin/index.html",
      }).toString(),
    });

    if (typeof response?.url === "string" && response.url.includes("error=")) {
      throw new Error("Sign in failed. Check the username and password.");
    }
    return response;
  }

  async getToken() {
    return { id_token: "" };
  }

  async getUser() {
    const session = await authRequest("session");
    return session?.user || null;
  }

  async authorize() {
    const user = await this.getUser();
    return user?.role === "user";
  }

  async logout() {
    const { csrfToken } = await authRequest("csrf");
    await authRequest("signout", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfToken: csrfToken || "",
        callbackUrl: "/admin/index.html",
      }).toString(),
    });
  }

  getLoginStrategy() {
    return "UsernamePassword" as const;
  }
}

export default defineConfig({
  branch,
  contentApiUrlOverride: isLocal ? undefined : "/api/tina/gql",
  authProvider: isLocal ? new LocalAuthProvider() : new PassByIraAuthProvider(),
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images/uploads",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        label: "Site Settings",
        name: "siteSettings",
        path: "content/site",
        match: { include: "settings" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "organizationName", label: "Organization Name", required: true },
          { type: "image", name: "logo", label: "Official Logo", required: true },
          {
            type: "object",
            name: "announcement",
            label: "Announcement Bar",
            fields: [
              { type: "string", name: "label", label: "Short Label", required: true },
              { type: "string", name: "message", label: "Announcement", required: true, ui: { component: "textarea" } },
              { type: "string", name: "linkLabel", label: "Link Label", required: true },
              { type: "string", name: "linkHref", label: "Link URL", required: true },
            ],
          },
          {
            type: "object",
            name: "primaryNavigation",
            label: "Primary Navigation",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Navigation item" }) },
            fields: [
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "href", label: "URL", required: true },
            ],
          },
          { type: "string", name: "donateUrl", label: "Donation URL", required: true },
          { type: "string", name: "volunteerUrl", label: "Volunteer URL", required: true },
          {
            type: "object",
            name: "contact",
            label: "Contact Details",
            fields: [
              { type: "string", name: "generalEmail", label: "General Email", required: true },
              { type: "string", name: "eventsEmail", label: "Events Email", required: true },
              { type: "string", name: "donationsEmail", label: "Donations Email", required: true },
              { type: "string", name: "location", label: "Location", required: true },
              { type: "string", name: "ein", label: "EIN", required: true },
            ],
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              { type: "string", name: "instagram", label: "Instagram" },
              { type: "string", name: "facebook", label: "Facebook" },
              { type: "string", name: "linkedin", label: "LinkedIn" },
            ],
          },
        ],
      },
      {
        label: "Homepage",
        name: "homepage",
        path: "content/pages",
        match: { include: "home" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Headline", required: true },
              { type: "string", name: "lead", label: "Introduction", required: true, ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Hero Image", required: true },
              { type: "string", name: "imageAlt", label: "Image Description", required: true },
            ],
          },
          {
            type: "object",
            name: "mission",
            label: "Mission",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Heading", required: true },
              { type: "string", name: "body", label: "Body", required: true, ui: { component: "textarea" } },
              { type: "string", name: "quote", label: "Mission Quote", required: true, ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "currentNeed",
            label: "Current Need",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Heading", required: true },
              { type: "string", name: "body", label: "Body", required: true, ui: { component: "textarea" } },
              { type: "string", name: "items", label: "Needed Items", list: true, required: true },
              { type: "image", name: "image", label: "Image", required: true },
              { type: "string", name: "imageAlt", label: "Image Description", required: true },
            ],
          },
          {
            type: "object",
            name: "programsIntro",
            label: "Programs Introduction",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Heading", required: true },
              { type: "string", name: "body", label: "Body", required: true, ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "story",
            label: "Origin Story",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Heading", required: true },
              { type: "string", name: "body", label: "Body", required: true, ui: { component: "textarea" } },
              { type: "image", name: "image", label: "Image", required: true },
              { type: "string", name: "imageAlt", label: "Image Description", required: true },
            ],
          },
          {
            type: "object",
            name: "eventsIntro",
            label: "Events Introduction",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Heading", required: true },
              { type: "string", name: "body", label: "Body", required: true, ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "finalCta",
            label: "Closing Call to Action",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Heading", required: true },
              { type: "string", name: "body", label: "Body", required: true, ui: { component: "textarea" } },
            ],
          },
        ],
      },
      {
        label: "Conversion & Trust Readiness",
        name: "contentReadiness",
        path: "content/pages",
        match: { include: "content-readiness" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "review",
            label: "Workspace Introduction",
            fields: [
              { type: "string", name: "eyebrow", label: "Eyebrow", required: true },
              { type: "string", name: "title", label: "Title", required: true },
              { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
              { type: "string", name: "contentOwner", label: "Content Owner", required: true },
              { type: "string", name: "lastReviewed", label: "Last Reviewed", required: true },
            ],
          },
          {
            type: "object",
            name: "sections",
            label: "Missing Content Blocks",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Content block" }) },
            fields: [
              { type: "string", name: "id", label: "Section ID", required: true },
              { type: "string", name: "title", label: "Content Block", required: true, isTitle: true },
              {
                type: "string",
                name: "priority",
                label: "Priority",
                required: true,
                options: ["Launch critical", "High value", "Future enhancement"],
              },
              {
                type: "string",
                name: "status",
                label: "Status",
                required: true,
                options: [
                  "Needs verified data",
                  "Needs story and consent",
                  "Needs operating details",
                  "Needs scope decision",
                  "Needs documents",
                  "Needs program costing",
                  "Needs approvals",
                  "Needs operating cadence",
                  "In review",
                  "Approved",
                ],
              },
              { type: "boolean", name: "publishReady", label: "Approved to Publish" },
              { type: "string", name: "publicPlacement", label: "Recommended Public Placement", required: true, ui: { component: "textarea" } },
              { type: "string", name: "reason", label: "Why This Matters", required: true, ui: { component: "textarea" } },
              { type: "string", name: "owner", label: "Accountable Owner", required: true },
              { type: "string", name: "draftHeadline", label: "Draft Public Headline", required: true },
              { type: "string", name: "draftBody", label: "Draft Public Body", required: true, ui: { component: "textarea" } },
              { type: "string", name: "requiredInputs", label: "Required Inputs", list: true, required: true },
              { type: "string", name: "verificationGate", label: "Verification Gate", list: true, required: true },
              {
                type: "object",
                name: "contentFields",
                label: "Content Fields",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || "Content field" }) },
                fields: [
                  { type: "string", name: "label", label: "Field Label", required: true },
                  { type: "string", name: "value", label: "Draft Value", required: true, ui: { component: "textarea" } },
                  { type: "string", name: "guidance", label: "Editorial Guidance", required: true, ui: { component: "textarea" } },
                  { type: "boolean", name: "verified", label: "Verified" },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Campaigns",
        name: "campaign",
        path: "content/campaigns",
        format: "json",
        ui: {
          filename: {
            slugify: (values) =>
              values.slug?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
              values.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") ||
              "campaign",
          },
        },
        fields: [
          {
            type: "string",
            name: "status",
            label: "Publishing Status",
            required: true,
            options: ["draft", "published"],
            description: "Only published campaigns are copied to the public campaign store.",
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
            description: "Lowercase letters, numbers, and hyphens only.",
          },
          { type: "string", name: "eyebrow", label: "Short Label", required: true },
          { type: "string", name: "title", label: "Campaign Title", required: true, isTitle: true },
          {
            type: "string",
            name: "summary",
            label: "Campaign Summary",
            required: true,
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "body",
            label: "Body Paragraphs",
            required: true,
            list: true,
            ui: { component: "textarea" },
          },
          {
            type: "datetime",
            name: "startsAt",
            label: "Public Start",
            required: true,
            description: "Include the intended time and UTC offset; the public API evaluates this instant in UTC.",
          },
          {
            type: "datetime",
            name: "endsAt",
            label: "Public End",
            required: true,
            description: "The campaign stops being active at this exact instant.",
          },
          {
            type: "string",
            name: "timezone",
            label: "Editorial Time Zone",
            required: true,
            options: [
              "America/Chicago",
              "America/New_York",
              "America/Denver",
              "America/Los_Angeles",
              "UTC",
            ],
          },
          {
            type: "string",
            name: "promotionPlacement",
            label: "Promotion Placement",
            required: true,
            options: ["none", "homepage", "announcement", "both"],
          },
          {
            type: "number",
            name: "promotionPriority",
            label: "Promotion Priority",
            required: true,
            description: "0–100. The highest-priority active campaign wins a placement.",
          },
          {
            type: "object",
            name: "postExpiration",
            label: "After the Campaign Ends",
            required: true,
            fields: [
              {
                type: "string",
                name: "behavior",
                label: "Behavior",
                required: true,
                options: ["hide", "archive", "redirect"],
              },
              {
                type: "string",
                name: "redirectUrl",
                label: "Redirect URL",
                description: "Required only when Behavior is redirect.",
              },
            ],
          },
          {
            type: "object",
            name: "visual",
            label: "Approved Visual Treatment",
            required: true,
            fields: [
              {
                type: "string",
                name: "theme",
                label: "Brand Theme",
                required: true,
                options: ["slate", "warmth", "high-contrast"],
              },
              {
                type: "string",
                name: "heroTreatment",
                label: "Hero Treatment",
                required: true,
                options: ["split", "full-bleed", "editorial"],
              },
              {
                type: "string",
                name: "ctaStyle",
                label: "Call-to-Action Style",
                required: true,
                options: ["solid", "outlined"],
              },
            ],
          },
          {
            type: "object",
            name: "heroImage",
            label: "Hero Image",
            required: true,
            fields: [
              { type: "image", name: "src", label: "Image", required: true },
              { type: "string", name: "alt", label: "Image Description", required: true },
              { type: "string", name: "caption", label: "Caption", required: true },
              { type: "string", name: "credit", label: "Optional Credit" },
              {
                type: "string",
                name: "focalPoint",
                label: "Crop Focus",
                required: true,
                options: [
                  "top-left",
                  "top",
                  "top-right",
                  "left",
                  "center",
                  "right",
                  "bottom-left",
                  "bottom",
                  "bottom-right",
                ],
              },
            ],
          },
          {
            type: "object",
            name: "supportingImages",
            label: "Supporting Images",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.caption || item?.alt || "Campaign image" }) },
            fields: [
              { type: "number", name: "order", label: "Display Order", required: true },
              { type: "image", name: "src", label: "Image", required: true },
              { type: "string", name: "alt", label: "Image Description", required: true },
              { type: "string", name: "caption", label: "Caption", required: true },
              { type: "string", name: "credit", label: "Optional Credit" },
              {
                type: "string",
                name: "focalPoint",
                label: "Crop Focus",
                required: true,
                options: [
                  "top-left",
                  "top",
                  "top-right",
                  "left",
                  "center",
                  "right",
                  "bottom-left",
                  "bottom",
                  "bottom-right",
                ],
              },
            ],
          },
          {
            type: "object",
            name: "ctas",
            label: "Calls to Action",
            list: true,
            required: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Call to action" }) },
            fields: [
              { type: "string", name: "label", label: "Accessible Label", required: true },
              { type: "string", name: "href", label: "Destination URL", required: true },
              {
                type: "string",
                name: "kind",
                label: "Emphasis",
                required: true,
                options: ["primary", "secondary"],
              },
            ],
          },
          {
            type: "object",
            name: "seo",
            label: "Search Summary",
            required: true,
            fields: [
              { type: "string", name: "title", label: "SEO Title", required: true },
              {
                type: "string",
                name: "description",
                label: "SEO Description",
                required: true,
                ui: { component: "textarea" },
              },
            ],
          },
        ],
      },
      {
        label: "Featured Events & Stories",
        name: "event",
        path: "content/events",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          filename: { slugify: (values) => values.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "event" },
        },
        fields: [
          { type: "number", name: "order", label: "Display Order", required: true },
          { type: "boolean", name: "featured", label: "Feature on Homepage" },
          { type: "string", name: "category", label: "Category", required: true },
          { type: "string", name: "title", label: "Title", required: true, isTitle: true },
          { type: "string", name: "summary", label: "Summary", required: true, ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Image", required: true },
          { type: "string", name: "imageAlt", label: "Image Description", required: true },
          { type: "string", name: "href", label: "Destination URL", required: true },
          { type: "string", name: "ctaLabel", label: "Link Label", required: true },
        ],
      },
      {
        label: "Photo Archives",
        name: "gallery",
        path: "content/gallery",
        match: { include: "events" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "sourcePage", label: "Original Archive URL" },
          { type: "string", name: "sourceCapturedAt", label: "Archive Capture Date" },
          {
            type: "object",
            name: "items",
            label: "Event Photo Archives",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Photo archive" }) },
            fields: [
              { type: "string", name: "id", label: "Section ID", required: true },
              { type: "string", name: "title", label: "Event Name", required: true },
              { type: "string", name: "subtitle", label: "Event Type", required: true },
              { type: "string", name: "body", label: "Description", required: true, ui: { component: "textarea" } },
              { type: "image", name: "src", label: "Featured Image", required: true },
              { type: "string", name: "alt", label: "Featured Image Description", required: true },
              {
                type: "object",
                name: "images",
                label: "Archive Photographs",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.alt || "Photograph" }) },
                fields: [
                  { type: "image", name: "src", label: "Image", required: true },
                  { type: "string", name: "alt", label: "Image Description", required: true },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Programs",
        name: "programs",
        path: "data",
        match: { include: "programs" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "pillars",
            label: "Program Pillars",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label || "Program pillar" }) },
            fields: [
              { type: "string", name: "id", label: "Anchor ID", required: true },
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "title", label: "Title", required: true },
              { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
              {
                type: "object",
                name: "programs",
                label: "Programs",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.name || "Program" }) },
                fields: [
                  { type: "string", name: "name", label: "Name", required: true },
                  { type: "string", name: "season", label: "Season" },
                  { type: "string", name: "description", label: "Description", required: true, ui: { component: "textarea" } },
                  { type: "string", name: "icon", label: "Icon" },
                  { type: "string", name: "volunteerUrl", label: "Volunteer URL" },
                  { type: "string", name: "advertiseUrl", label: "Advertising URL" },
                  { type: "string", name: "hashtag", label: "Hashtag" },
                  { type: "string", name: "donationNeeds", label: "Donation Needs", list: true },
                  { type: "boolean", name: "comingSoon", label: "Coming Soon" },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Leadership",
        name: "leadership",
        path: "data",
        match: { include: "board" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "members",
            label: "People",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.name || "Person" }) },
            fields: [
              { type: "string", name: "group", label: "Group", required: true, options: ["board", "advisor"] },
              { type: "string", name: "name", label: "Name", required: true },
              { type: "string", name: "title", label: "Role", required: true },
              { type: "string", name: "initials", label: "Initials", required: true },
              { type: "string", name: "bio", label: "Biography", required: true, ui: { component: "textarea" } },
              { type: "image", name: "photo", label: "Photo" },
              { type: "string", name: "linkedinUrl", label: "LinkedIn URL" },
            ],
          },
        ],
      },
      {
        label: "News & Newsletters",
        name: "news",
        path: "content/posts",
        match: { include: "posts" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "posts",
            label: "Posts",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "News post" }) },
            fields: [
              { type: "string", name: "slug", label: "Route", required: true },
              { type: "string", name: "title", label: "Title", required: true },
              { type: "string", name: "date", label: "Display Date", required: true },
              { type: "string", name: "summary", label: "Summary", required: true, ui: { component: "textarea" } },
              { type: "string", name: "lead", label: "Introduction", required: true, ui: { component: "textarea" } },
              { type: "image", name: "imageSrc", label: "Header Image", required: true },
              { type: "string", name: "imageAlt", label: "Image Description", required: true },
              { type: "string", name: "bullets", label: "Highlights", list: true },
              { type: "string", name: "body", label: "Body Paragraphs", list: true, ui: { component: "textarea" } },
            ],
          },
        ],
      },
      {
        label: "CMS Users",
        name: "user",
        path: "content/users",
        match: { include: "index" },
        format: "json",
        isAuthCollection: true,
        isDetached: true,
        ui: { global: true, allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "users",
            label: "Authorized Users",
            list: true,
            fields: [
              { type: "string", name: "username", label: "Username", required: true, uid: true },
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "email", label: "Email" },
              { type: "password", name: "password", label: "Password", required: true },
            ],
          },
        ],
      },
    ],
  },
});
