# Campaign Operations

Pass by Ira campaigns are now managed as structured TinaCMS content, published to a private Azure Blob container, and served through an Azure Function that evaluates each campaign window using server UTC.

## What editors can control

In TinaCMS, open **Campaigns** to create or update a campaign. Editors can manage:

- campaign copy, status, URL slug, and one or two calls to action;
- public start and end instants plus an editorial time zone;
- homepage and/or announcement placement and promotion priority;
- hide, archive, or redirect behavior after expiration;
- a hero image and ordered supporting images, each with alt text, caption, optional credit, and an approved focal point;
- one of three brand-safe color themes, one of three hero treatments, and an approved CTA treatment; and
- a search title and description for a future server-rendered implementation.

Raw colors, fonts, spacing, HTML, CSS, and arbitrary layout changes remain code-owned. The publishing validator rejects campaign documents that do not meet the schedule, image, accessibility, CTA, URL, and content requirements.

## Publishing flow

1. An editor saves a campaign in Tina. Tina commits the JSON document and uploaded media to GitHub.
2. Every deployment runs `npm run campaigns:validate` before building the public site.
3. After Azure Static Web Apps successfully deploys the website and Function API, the workflow runs `npm run campaigns:publish` when the campaign storage secret is configured.
4. The publishing script validates every campaign, reads the real dimensions of repository-managed images, removes drafts and non-public fields, and uploads one versioned catalog to `published/campaigns.json` in a dedicated private Blob container.
5. `/api/campaigns/active` and `/api/campaigns/{slug}` read that catalog. They never return drafts, storage credentials, or the Tina indexing data.
6. The API evaluates `[startsAt, endsAt)` against the Function server's UTC clock. Cache lifetimes are shortened so a cached response never crosses the next start or end boundary.

The campaign Blob container must remain separate from the Azure Table Storage used by Tina's content index.

## Azure setup

Production provisioning was completed September 1, 2026:

- campaign storage account: `stpassbyiracamp0edd`
- private container: `passbyira-campaigns`
- catalog blob: `published/campaigns.json`
- Static Web App: `passbyira-org-swa`

The connection string is configured in both the Static Web App and the GitHub Actions repository secret. The initial validated catalog has been published. The following instructions remain the rotation/recovery runbook.

Create a private Blob container, then add these values to the Azure Static Web Apps production environment:

- `CAMPAIGN_STORAGE_CONNECTION_STRING`
- `CAMPAIGN_STORAGE_CONTAINER` (defaults to `passbyira-campaigns`)
- `CAMPAIGN_STORAGE_BLOB` (defaults to `published/campaigns.json`)

Add the same connection string as the GitHub Actions secret `CAMPAIGN_STORAGE_CONNECTION_STRING`. The optional container and blob names can be GitHub Actions variables with the matching names. Do not put the connection string in tracked files or a browser-exposed environment variable.

Azure Static Web Apps makes API application settings available to its managed Functions as environment variables. Microsoft documents those settings and their production configuration in [Configure application settings for Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/application-settings).

## Local review

Run the site/CMS and campaign preview API in separate terminals:

```text
npm run cms
npm run campaigns:dev
```

The local browser automatically uses the preview API at `http://localhost:7071`. The migrated 30 for 30 campaign can be reviewed at:

```text
http://localhost:3000/campaign/?slug=30-for-30-campaign
```

The local preview API reads the same Tina campaign documents and runs the same validation and timing rules as the Azure Function. It never uploads content.

## SEO decision

The public site remains a Next.js static export on Azure Static Web Apps. A campaign page is therefore a static, non-indexable shell that fetches public campaign content in the browser. It works for direct links and campaign conversion, but campaign-specific copy and metadata are not present in the initial HTML.

The generic `/campaign/` shell is intentionally marked `noindex`. The legacy `/30-for-30-campaign/` path remains available and now uses the same generic campaign renderer.

If campaign pages later need indexable, campaign-specific server-rendered HTML and social metadata, move only the campaign route to a runtime Next.js host or migrate the application to Azure App Service. Do not add one hardcoded Next.js route per campaign.
