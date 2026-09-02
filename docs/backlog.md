# Pass by Ira Product Backlog

## Implemented

### P1 — Storage-backed, time-limited campaigns

Implemented locally and provisioned in Azure on September 1, 2026. The private campaign storage account/container, Static Web App settings, GitHub Actions secret/variables, validated initial catalog, and production-only publishing workflow are in place. See `docs/campaign-operations.md` and `docs/azure-production-configuration.md`.

Enable authorized editors to create seasonal or fundraising campaigns in TinaCMS, schedule when they are public, upload campaign photography, and apply a small set of safe visual choices without changing layout code.

#### Scope

- Add a Tina `campaigns` collection with a slug, campaign copy, calls to action, `startsAt`, `endsAt`, timezone, promotion placement, and post-expiration behavior.
- Build a generic campaign page instead of adding one hardcoded route per campaign.
- Keep the public site on Azure Static Web Apps and add a JavaScript Azure Function that reads the active campaign from a separate campaign storage location.
- Define the publishing path from Tina/GitHub into campaign storage, with validation before content becomes public.
- Use server-side UTC time for activation and expiration; do not rely on the visitor's browser clock.
- Keep campaign data separate from the Azure Table Storage used by Tina's indexing layer.

#### Photo and visual-editing requirements

- Let editors upload a hero image and supporting campaign images through Tina's media workflow.
- Store image alt text, captions, and optional credit with every campaign image.
- Support image ordering and an approved crop/focal-point treatment where practical.
- Offer only vetted visual presets and layout variants, such as approved campaign color themes, hero treatments, and CTA styles.
- Keep raw colors, typography, spacing, arbitrary CSS, and accessibility-sensitive layout rules code-owned.
- Validate image dimensions, alt text, contrast, and CTA accessibility before publishing.

#### Acceptance criteria

1. An editor can create and save a campaign in Tina without changing application code.
2. A campaign can include multiple uploaded images with editable order, alt text, captions, and credits.
3. A future campaign is not publicly active before its start time, is active during its configured window, and follows its configured expiration behavior afterward.
4. Start/end boundaries are deterministic across time zones, deployments, caching, and direct URL visits.
5. The public endpoint does not expose storage credentials or unpublished campaign documents.
6. The design works for both a homepage/announcement promotion and a standalone campaign page.
7. SEO behavior is defined and tested: if campaign pages need indexable server-rendered content, use a runtime Next.js route; otherwise document the static shell/client-fetch tradeoff.
8. Existing site content, Tina editing, and the static deployment path continue to work.

#### Open implementation decision

Resolved: use a private Blob Storage container plus an Azure Function/API for active-campaign reads. Campaign pages use a static, non-indexable client shell. Use Azure App Service only if campaigns later require indexable server-rendered pages or other runtime Next.js features.

#### Acceptance verification

1. TinaCMS includes a create-enabled Campaigns collection; no application route changes are needed for future campaign documents.
2. Hero and supporting images include order, alt text, caption, optional credit, focal point, and publish-time dimension validation.
3. Shared UTC scheduling tests cover future, start-boundary, active, end-boundary, archive, hide, and redirect states.
4. API cache TTLs stop before the next schedule boundary and client requests bypass browser caches.
5. The published catalog excludes drafts and strips fields outside the public schema; the Function alone receives storage credentials.
6. Active campaigns can replace the announcement bar, appear as a homepage feature, and render in the generic campaign page.
7. The static-shell SEO tradeoff and the runtime upgrade path are documented in `docs/campaign-operations.md`.
8. Campaign validation is part of the deployment build, and the existing Tina/API/static-site workflow is preserved.
