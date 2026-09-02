# Azure Production Configuration

Provisioned September 1, 2026 for the production Pass by Ira site. This file records resource names and operational behavior only; no credentials or connection strings are stored in the repository.

## Resource inventory

| Purpose | Resource | Value |
| --- | --- | --- |
| Azure subscription | Subscription ID | `0edd5912-29d0-4c82-9716-be1491c3efe6` |
| Application boundary | Resource group | `rg-passbyira-centralus` |
| Website and managed API | Static Web App | `passbyira-org-swa` |
| Tina content index | Storage account | `stpassbyiratina0edd` |
| Tina content index | Table | `PassByIraTina` |
| Campaign publishing | Storage account | `stpassbyiracamp0edd` |
| Campaign publishing | Private container | `passbyira-campaigns` |
| Campaign publishing | Catalog blob | `published/campaigns.json` |
| Source and CI/CD | GitHub repository | `damienjames/passbyira-org` |

Both storage accounts are `StorageV2`/`Standard_LRS` resources in `centralus`. HTTPS is required, the minimum TLS version is 1.2, and anonymous Blob access is disabled. Campaign data is deliberately stored separately from Tina's Table Storage index.

## Static Web App application settings

The production Static Web App has these server-side settings:

- `TINA_PUBLIC_IS_LOCAL`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `GITHUB_PERSONAL_ACCESS_TOKEN`
- `AZURE_TABLE_CONNECTION_STRING`
- `AZURE_TABLE_NAME`
- `AZURE_TABLE_PARTITION_KEY`
- `TINA_SESSION_SECRET`
- `CAMPAIGN_STORAGE_CONNECTION_STRING`
- `CAMPAIGN_STORAGE_CONTAINER`
- `CAMPAIGN_STORAGE_BLOB`

Values are managed in Azure and must never be copied into tracked files or variables exposed to browser code.

## GitHub Actions configuration

Repository secrets:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PROUD_MUSHROOM_030EB6910`
- `CAMPAIGN_STORAGE_CONNECTION_STRING`

Repository variables:

- `NEXT_PUBLIC_SITE_URL`
- `HANDOVER_ENABLED`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`
- `AZURE_STATIC_WEB_APP_NAME`
- `TINA_STORAGE_ACCOUNT`
- `AZURE_TABLE_NAME`
- `AZURE_TABLE_PARTITION_KEY`
- `CAMPAIGN_STORAGE_ACCOUNT`
- `CAMPAIGN_STORAGE_CONTAINER`
- `CAMPAIGN_STORAGE_BLOB`

The Azure deployment token is refreshed from `passbyira-org-swa`. The workflow never logs secret values.

## Deployment behavior

`.github/workflows/azure-static-web-apps-proud-mushroom-030eb6910.yml` now:

1. installs the website and Function dependencies;
2. runs linting, campaign behavior tests, and JavaScript syntax checks for the Function sources;
3. validates campaign documents and builds TinaCMS, the static site, and the Azure Functions bundle;
4. deploys the prebuilt site and `api/` directory to Azure Static Web Apps; and
5. publishes the validated campaign catalog only after a successful production deployment.

Same-repository pull requests may create Azure preview environments, but they cannot publish the production campaign catalog. Fork pull requests cannot receive deployment secrets and are therefore validation-only outside this workflow. Concurrency controls cancel superseded runs for the same branch or pull request.

`HANDOVER_ENABLED` is currently `true`, so `/handover`, `/team-handover`, `/team-brief`, and `/content-readiness` are included in the public static build for team review. Set the variable to `false` and redeploy when those review materials should be removed from public access.

## Secret rotation

- Refresh the Static Web Apps deployment token from Azure, then update the matching GitHub Actions secret.
- Rotate either storage account key in Azure, then update its affected Static Web App setting. The campaign account also requires updating the GitHub Actions campaign secret.
- Rotate the GitHub token used by TinaCMS in the Static Web App settings when its owner, scopes, or lifecycle changes.
- Rotate `TINA_SESSION_SECRET` to invalidate all existing CMS sessions.

## Remaining editor-onboarding decision

The infrastructure and API configuration are ready, but `content/users/index.json` intentionally contains no production editor. Do not commit a shared or default password. Before production CMS editing is opened to the organization, choose a named editor and complete a secure credential-provisioning method. Local editing through `npm run cms` remains available without production credentials.
