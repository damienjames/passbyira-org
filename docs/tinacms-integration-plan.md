# TinaCMS Integration Plan for Pass By Ira

## Purpose

This document outlines what would need to change to support a fuller TinaCMS integration for the Pass By Ira site, with special attention to:

- the current Pass By Ira implementation
- the working TinaCMS pattern already used in `healingthaispabynapa`
- Azure Static Web Apps deployment implications
- what should and should not be handed over to non-technical editors

## Implemented State

The recommended hybrid TinaCMS model is now implemented in this repository.

- `tina/config.ts` defines protected editing models for site settings, homepage copy, featured events, complete photo archives, programs, leadership, news, and CMS users.
- `content/gallery/events.json` now holds the complete 98-photo event archive with editable featured images and image descriptions; layout and viewer behavior remain code-owned.
- `content/**` and the existing structured `data/**` files are the source of truth rendered by the Next.js static site.
- `npm run cms` starts the site with Tina's local filesystem editor at `/admin/index.html`.
- `npm run build:deploy` builds the production admin, bundles Tina's generated schema/content for the API, and exports the Next.js site.
- `api/tina/**` provides the Azure Static Web Apps function, custom Azure-to-Express request adapter, GitHub content bridge, and Azure Table Storage index adapter proven in the neighboring Healing Thai project.
- `.github/workflows/azure-static-web-apps-proud-mushroom-030eb6910.yml` validates, tests, builds, and deploys the prebuilt site and Tina API together.
- Azure production prerequisites are provisioned: `stpassbyiratina0edd` hosts the private `PassByIraTina` index table, and the required Tina/GitHub/session settings are configured on `passbyira-org-swa`.

No production CMS user or secret is committed. The runtime settings are configured in Azure, but a named editor still needs to be enrolled through a secure credential-provisioning method before production editing is opened. See `docs/azure-production-configuration.md` for the non-secret resource inventory and rotation runbook.

## Short Answer

Nothing in the current Pass By Ira site fundamentally blocks a TinaCMS integration.

The main work is structural:

1. Move more page content out of JSX and into content documents.
2. Decide whether to use a lightweight repo-backed Tina setup or a fuller self-hosted Tina backend on Azure.
3. Introduce a safe editing model for gallery and limited brand controls without exposing fragile layout or accessibility-sensitive design tokens.

## Current Pass By Ira Reality

### What already fits Tina well

These files are already content-shaped and are good candidates for Tina collections:

- `data/board.json`
- `data/programs.json`
- `data/site-content.ts`

These could be split into smaller JSON documents or moved into `content/**` collections.

### What is not yet Tina-friendly

Much of the most important page copy is still embedded directly in route code:

- `app/page.tsx`
- `app/[...slug]/page.tsx`

That means editors cannot meaningfully manage the homepage, donate page, sponsorship page, volunteer page, or gallery page without first refactoring those sections into content models.

### Current deployment shape

The site is currently built as a static export:

- `next.config.ts` uses `output: "export"`

The Azure Static Web Apps workflow also currently deploys no API:

- `.github/workflows/azure-static-web-apps-proud-mushroom-030eb6910.yml`
- `api_location: ""`
- `output_location: "out"`

This matters because a fuller self-hosted Tina setup would require an API endpoint for GraphQL and auth.

## What the Healing Thai Spa Project Already Solved

The `healingthaispabynapa` project is not just using Tina for local JSON editing. It already includes a more complete Azure-compatible self-hosted Tina architecture.

### Tina config pattern in Healing Thai

The current implementation uses:

- `tina/config.ts`
- `contentApiUrlOverride: "/api/tina/gql"`
- local auth in development
- custom credential auth in production
- repo-based media via Tina
- JSON collections for site settings, navigation, pages, gallery, team, FAQs, and more

### Managed function / API pattern in Healing Thai

Healing Thai includes a custom Azure Function-backed Tina API under:

- `api/tina/index.js`
- `api/tina/database.js`
- `api/tina/bundledBridge.js`
- `api/tina/azureTableLevel.js`
- `api/_lib/tinaSession.js`

That implementation does several important things:

- hosts Tina GraphQL and auth endpoints under `/api/tina/*`
- uses a custom Azure Functions to Express adapter
- avoids a generic serverless wrapper that was unreliable on newer Node runtimes
- persists Tina indexing data in Azure Table Storage
- writes content back to GitHub through `tinacms-gitprovider-github`
- handles production auth and signed sessions in Azure Functions

### Important custom connector pieces from Healing Thai

These are the pieces most likely to matter if Pass By Ira adopts the same architecture:

- Git provider:
  - `tinacms-gitprovider-github`
- database/index adapter:
  - custom Azure Table Storage adapter in `api/tina/azureTableLevel.js`
- bundled filesystem bridge:
  - `api/tina/bundledBridge.js`
- auth/session layer:
  - custom credential auth and cookie session handling in `api/tina/index.js` and `api/_lib/tinaSession.js`

### Environment requirements already proven in Healing Thai

Healing Thai's production Tina flow depends on environment variables like:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_PERSONAL_ACCESS_TOKEN`
- `AZURE_TABLE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_TABLE_PARTITION_KEY`
- `GITHUB_BRANCH`
- `NEXTAUTH_SECRET` or `TINA_SESSION_SECRET`

If Pass By Ira reuses this approach, it will need equivalent secrets configured in Azure Static Web Apps.

## Recommendation: Use a Hybrid Tina Model

For this site, the best fit is not "make everything editable."

The better approach is:

- content is Tina-managed
- layout remains code-owned
- brand changes are constrained
- forms and infrastructure stay developer-owned

This gives the nonprofit editing freedom without letting the site drift into broken spacing, weak accessibility, or inconsistent brand behavior.

## Recommended Editing Scope for Pass By Ira

### Safe to hand over

These are strong Tina candidates:

- homepage hero copy
- homepage section intros
- program cards
- board members
- sponsorship tiers and supporting copy
- donate page copy and giving blocks
- volunteer page copy
- blog/newsletter posts
- event gallery groups
- image alt text and captions
- social/contact/settings content
- limited site-wide CTA labels

### Better kept in code

These should remain code-owned:

- layout structure
- navigation logic
- forms and submission endpoints
- sitemap generation
- robots rules
- metadata plumbing
- gallery component behavior
- image optimization rules
- accessibility-critical design decisions

### Brand controls should be limited

If the goal is to let them "manage the gallery and brand a bit," I would not expose freeform color values.

Safer options:

- logo upload
- hero image selection
- approved color preset selection
- CTA label text
- optional mission tagline updates

Riskier options that should stay out of Tina unless you add validation:

- raw hex values
- arbitrary CSS variables
- unrestricted typography choices
- per-page visual overrides

## What Would Need to Change in Pass By Ira

### 1. Add TinaCMS dependencies and config

At minimum, Pass By Ira would need:

- `tinacms`
- `@tinacms/cli`

For a fuller self-hosted Azure setup similar to Healing Thai, it would also likely need:

- `@tinacms/datalayer`
- `tinacms-gitprovider-github`
- `tinacms-authjs` or a custom auth layer
- `next-auth` or equivalent session/auth dependency if you follow the same pattern
- `express` if you reuse the Azure Function to Express adapter approach
- `@azure/data-tables` if you adopt Azure Table Storage for Tina indexing

It would also need:

- `tina/config.ts`
- Tina build scripts in `package.json`
- an editor output folder, likely `/admin`

### 2. Refactor content out of JSX

This is the largest real task.

The site currently mixes content and presentation inside route components. To make Tina useful, the following should be moved into content documents or settings files:

- homepage hero
- mission intro
- event section copy
- support/donate/sponsorship/volunteer page text
- route-specific SEO text
- repeating CTA sections

Suggested destination:

- `content/site/settings.json`
- `content/site/navigation.json`
- `content/pages/home.json`
- `content/pages/donate.json`
- `content/pages/sponsorship.json`
- `content/pages/sign-up-to-volunteer.json`
- `content/pages/support.json`
- `content/events/*.json`
- `content/gallery/*.json`
- `content/posts/*.mdx` or `*.json`

### 3. Convert `data/site-content.ts` into editable documents

Today, `data/site-content.ts` is useful for developers but not ideal for editors.

That file should likely be split into Tina-managed collections such as:

- event groups
- gallery entries
- featured homepage sections
- support CTAs
- social/contact settings

This would be one of the highest-value migrations because it directly supports gallery management and homepage storytelling.

### 4. Decide between two Tina operating models

#### Option A: Lighter repo-backed Tina

This is the simpler option.

Characteristics:

- editors work in Tina
- content commits back to Git
- GitHub Actions rebuilds and redeploys the static site
- less custom infrastructure
- weaker production editing ergonomics than a fuller backend

Good fit if:

- edits are occasional
- you want low operational overhead
- handoff matters more than real-time preview sophistication

#### Option B: Self-hosted Tina on Azure, modeled after Healing Thai

This is the more complete option.

Characteristics:

- custom Tina backend hosted in Azure SWA Functions
- GraphQL API under `/api/tina/gql`
- production auth flow
- custom GitHub connector setup
- custom database/indexing layer
- more moving parts, but better editing flexibility

Good fit if:

- they will actively manage content
- multiple editors may be involved
- you want a more durable handoff path
- you are comfortable maintaining the CMS infrastructure

## Azure Static Web Apps Production State

The fuller self-hosted Tina approach is now implemented and configured in Azure.

### Workflow changes

Previous workflow:

- `app_location: "/"`
- `api_location: ""`
- `output_location: "out"`

Implemented workflow:

- `app_location: "out"` (prebuilt site and Tina admin)
- `api_location: "api"`
- `skip_app_build: true`
- campaign validation, linting, tests, and Function source checks run before deployment
- the private campaign catalog publishes only after a successful production deployment

### Runtime implications

The deployed system includes:

- an `api/` folder in Pass By Ira
- Tina backend function files
- environment variables added in Azure Static Web Apps configuration
- generated Tina API artifacts available during build/deploy

### Managed function requirements

If you mirror Healing Thai, the following managed function responsibilities are required:

- authenticate editors
- serve Tina GraphQL
- manage Tina session cookies and CSRF
- initialize/index the Tina database when needed
- proxy Git-backed writes

### Configured Azure settings/secrets

The Static Web App is configured with:

- GitHub repo owner/name/token
- Azure Table Storage connection details
- branch settings
- session/auth secrets

## Gallery Management Feasibility

Gallery management is one of the strongest Tina fits for this site.

Recommended content shape:

- one collection for event groups
- one collection for gallery items
- each gallery item stores:
  - event reference
  - image path
  - alt text
  - caption
  - sort order
  - optional homepage feature flag

This would let editors:

- add/remove photos
- correct captions
- reorder images
- attach photos to the right event
- manage featured event imagery without touching code

### Important media note

Repo-based media is a good fit because the site already stores images locally in `public/images`.

But editors should be trained that:

- renaming media files after publishing can be disruptive
- image dimensions and crops should still follow guardrails
- alt text should be required

## Brand Management Feasibility

This is possible, but it needs guardrails.

Recommended CMS-managed brand fields:

- logo asset
- secondary logo asset if needed
- selected color preset
- mission tagline
- CTA labels
- optional hero image choices

Recommended code-owned brand system:

- actual CSS variables
- accessible color pair logic
- button component styling
- contrast-safe tokens

If you want them to manage "brand a bit," use a controlled enum like:

- `hopeful-blue`
- `warm-neutral`
- `campaign-gold-accent`

Then map that enum to vetted design tokens in code.

## Likely Tina Collections for Pass By Ira

This is the most natural first-pass content model for the current site.

### Site-level collections

- `siteSettings`
- `navigation`
- `footer`
- `brand`

### Page collections

- `homePage`
- `standardPages`
- `campaignPages`

### Structured content collections

- `programs`
- `board`
- `events`
- `gallery`
- `donationOptions`
- `sponsorshipTiers`
- `blogPosts`

### Optional admin collections

- `users` if self-hosting auth with a Tina user collection

## Pass By Ira File-to-Collection Mapping

Suggested mapping from the current repo:

- `data/board.json` -> `board`
- `data/programs.json` -> `programs`
- `data/site-content.ts` -> split into `events`, `gallery`, `siteSettings`, `homepageSections`
- `app/page.tsx` -> consume `homePage` and shared collections
- `app/[...slug]/page.tsx` -> consume `standardPages`, `campaignPages`, `blogPosts`, and shared collections

## Risks and Friction Points

### 1. Static export plus Tina is workable, but editorial flow changes

Because Pass By Ira currently uses `output: "export"`, content publishing should be treated as:

- edit in Tina
- write to Git
- rebuild site
- redeploy site

That is fine for a nonprofit handoff, but it is not the same as instant runtime content publishing.

### 2. Full visual editing is not the real bottleneck here

The harder part is not Tina itself. It is reorganizing the site so content has a clean editorial model.

### 3. Brand editing can easily harm accessibility

Without guardrails, editors can accidentally:

- break contrast
- make buttons unreadable
- reduce brand consistency
- create visual drift across pages

### 4. Self-hosting Tina on Azure adds real maintenance overhead

The Healing Thai setup proves this is possible, but it is not free in complexity. It includes custom API code, auth/session logic, and database/indexing infrastructure.

## Recommended Implementation Path

### Phase 1: Content model cleanup

- move route copy into content files
- split `data/site-content.ts`
- create Tina collections for programs, board, events, gallery, and page content

### Phase 2: Add Tina editor

- add `tina/config.ts`
- configure collections
- enable repo-based media
- create `/admin`

### Phase 3: Choose deployment style

Pick one:

- lightweight Git-backed Tina with rebuild/redeploy flow
- self-hosted Tina API on Azure modeled after Healing Thai

### Phase 4: Add limited brand controls

- logo
- hero assets
- approved theme preset
- CTA labels

### Phase 5: Train for handoff

- photo upload/caption workflow
- event grouping rules
- alt text expectations
- when not to edit visual settings

## My Recommendation

For Pass By Ira, I would recommend:

1. Start with Tina-managed content and repo-based media.
2. Keep the public site static.
3. Only move to the fuller self-hosted Azure Tina backend if the organization will truly edit often enough to justify the complexity.

That gives you the handoff benefits you want without immediately inheriting the full maintenance cost of custom auth, Azure Table indexing, and managed function support.

If the handoff goal is specifically "they can manage the gallery and update page content safely," this lighter first version is probably the highest-value move.

If the goal is "they should have a durable, more independent editorial admin experience," then the Healing Thai pattern is a valid foundation to adapt.

## Official TinaCMS References

These are the official docs consulted for this assessment:

- Next.js / App Router guidance:
  - https://tina.io/docs/frameworks/next/app-router
- Self-hosting overview:
  - https://tina.io/docs/self-hosted/overview
- Self-hosted manual setup:
  - https://tina.io/docs/self-hosted/manual-setup
- Collections and schema reference:
  - https://tina.io/docs/reference/collections
- Tina folder and project structure:
  - https://tina.io/docs/tina-folder/overview
- Repo-based media:
  - https://tina.io/docs/reference/media/repo-based

## Optional Next Step

If helpful, the next document can be a concrete Pass By Ira Tina content model:

- exact collections to create
- field definitions for each collection
- which current files map into which documents
- which pieces should remain outside the CMS
