import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Azure Migration & Website Handover | Pass by Ira",
  description:
    "Internal runbook for transferring, rebuilding, operating, and maintaining the Pass by Ira website.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const handoverEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.HANDOVER_ENABLED === "true" ||
  process.env.TEAM_BRIEF_ENABLED === "true";

const azureSettings = [
  {
    name: "GITHUB_OWNER",
    value: "The final GitHub user or organization slug",
    purpose: "TinaCMS repository owner",
  },
  {
    name: "GITHUB_REPO",
    value: "passbyira-org",
    purpose: "Private source repository name",
  },
  {
    name: "GITHUB_BRANCH",
    value: "main",
    purpose: "Production content branch",
  },
  {
    name: "GITHUB_PERSONAL_ACCESS_TOKEN",
    value: "Secret — never commit",
    purpose: "Repository-scoped token with Contents read/write for TinaCMS",
  },
  {
    name: "AZURE_TABLE_CONNECTION_STRING",
    value: "Secret — never commit",
    purpose: "Connection to the TinaCMS index and user store",
  },
  {
    name: "AZURE_TABLE_NAME",
    value: "A valid table name chosen by the new owner",
    purpose: "TinaCMS index table",
  },
  {
    name: "AZURE_TABLE_PARTITION_KEY",
    value: "Optional; defaults to tina_main",
    purpose: "Keeps the Tina index isolated by branch",
  },
  {
    name: "NEXTAUTH_SECRET",
    value: "Secret — generate a new random value",
    purpose: "Signs CMS login sessions; TINA_SESSION_SECRET is also supported",
  },
  {
    name: "CAMPAIGN_STORAGE_CONNECTION_STRING",
    value: "Secret — never commit",
    purpose: "Connection to the published campaign catalog",
  },
  {
    name: "CAMPAIGN_STORAGE_CONTAINER",
    value: "passbyira-campaigns (default)",
    purpose: "Blob container for campaign data",
  },
  {
    name: "CAMPAIGN_STORAGE_BLOB",
    value: "published/campaigns.json (default)",
    purpose: "Published campaign catalog path",
  },
] as const;

const fileMap = [
  ["Public site", "app/, components/, lib/", "Next.js routes and presentation logic"],
  ["Editable content", "content/, data/", "Homepage, events, programs, people, posts, campaigns"],
  ["Media", "public/images/", "Logos, page photography, galleries, and CMS uploads"],
  ["CMS schema", "tina/config.ts", "Fields, collections, admin UI, and production API target"],
  ["CMS runtime", "api/tina/", "Azure Function for authentication, GraphQL, Git, and indexing"],
  ["Campaign runtime", "api/campaigns/", "Azure Function that serves the published campaign catalog"],
  [
    "Deployment",
    ".github/workflows/azure-static-web-apps-proud-mushroom-030eb6910.yml",
    "Build, preview, production deploy, and preview cleanup",
  ],
] as const;

const verificationItems = [
  ["Local build", "npm ci, npm run lint, and npm run build:deploy all pass on Node 22."],
  ["Static app", "The Azure-generated URL loads the homepage and normal content routes."],
  ["CMS API", "/api/tina/gql returns an authentication response, not a 5xx platform error."],
  ["CMS login", "The designated owner can sign in at /admin/index.html and no seed password remains active."],
  ["Editorial loop", "A harmless CMS edit creates a GitHub commit and a green production deployment."],
  ["Campaign API", "/api/campaigns/active returns an intentional 200 or 404, never a storage-related 503."],
  ["Preview flow", "A pull request creates a working Azure preview and closing it removes the preview."],
  ["Domain", "The custom domain resolves over HTTPS and both apex/www behavior are intentional."],
] as const;

function StepNumber({ children }: { children: React.ReactNode }) {
  return <span className="pb-handover-step-number">{children}</span>;
}

export default function TeamHandoverPage() {
  if (!handoverEnabled) notFound();

  return (
    <article className="pb-handover">
      <header className="pb-handover-hero">
        <div className="pb-shell">
          <div className="pb-handover-hero__meta">
            <span>Internal runbook</span>
            <span>Revision 01 · September 1, 2026</span>
          </div>
          <div className="pb-handover-hero__grid">
            <div>
              <p className="pb-kicker">Azure migration &amp; website handover</p>
              <h1>Own the system, not just the files.</h1>
            </div>
            <div className="pb-handover-hero__intro">
              <p>
                This codebase is the implementation package for the target Pass by Ira architecture.
                The runbook explains how to provision the remaining Azure resources, validate them,
                and transfer day-to-day control to the organization.
              </p>
              <div className="pb-button-row">
                <a className="pb-button pb-button--dark" href="#migration-sequence">
                  Start the migration <span aria-hidden="true">↓</span>
                </a>
                <Link className="pb-button pb-button--line" href="/handover">
                  Handover home <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="pb-handover-status" aria-labelledby="handover-status-heading">
        <div className="pb-shell pb-handover-status__grid">
          <div>
            <p className="pb-kicker">Handover position</p>
            <h2 id="handover-status-heading">The code package is ready. Cloud provisioning is the next phase.</h2>
          </div>
          <div className="pb-handover-status__items">
            <p><span>01</span><strong>Prepared</strong>The private repository contains the application, content, CMS, Functions, and deployment workflow.</p>
            <p><span>02</span><strong>Provision next</strong>Create the target Azure runtime, storage services, settings, and deployment token.</p>
            <p><span>03</span><strong>Accept last</strong>Test repository, deployment, CMS, campaign, rollback, and domain ownership with the receiving team.</p>
          </div>
        </div>
      </section>

      <section className="pb-handover-provisioning" aria-labelledby="provisioning-heading">
        <div className="pb-shell">
          <div className="pb-handover-provisioning__heading">
            <div>
              <p className="pb-kicker">Provisioning tracker</p>
              <h2 id="provisioning-heading">Replace the plan with the real inventory as each resource is created.</h2>
            </div>
            <p>
              Resource names below are intentionally not guessed. Update this record during the
              Azure build so the final handover reflects the organization&apos;s actual subscription.
            </p>
          </div>
          <div className="pb-handover-provisioning__stages" role="list" aria-label="Provisioning stages">
            <div role="listitem"><span>Prepared</span><strong>Application code &amp; workflow</strong><small>In the private repository</small></div>
            <div role="listitem"><span>Next phase</span><strong>Azure resource group &amp; Static Web App</strong><small>Record after creation</small></div>
            <div role="listitem"><span>Next phase</span><strong>Storage table &amp; Blob container</strong><small>Record after creation</small></div>
            <div role="listitem"><span>After resources</span><strong>Runtime secrets &amp; CMS administrator</strong><small>Configure and rotate</small></div>
            <div role="listitem"><span>After acceptance</span><strong>Custom domain cutover</strong><small>Validate before routing traffic</small></div>
          </div>
          <dl className="pb-handover-inventory">
            <div><dt>Azure tenant / subscription</dt><dd>[record after provisioning]</dd></div>
            <div><dt>Resource group</dt><dd>[record after provisioning]</dd></div>
            <div><dt>Static Web App / default URL</dt><dd>[record after provisioning]</dd></div>
            <div><dt>Plan / region</dt><dd>[record after provisioning]</dd></div>
            <div><dt>Storage account / table / container</dt><dd>[record after provisioning]</dd></div>
            <div><dt>GitHub organization / repository</dt><dd>[record after transfer decision]</dd></div>
            <div><dt>Technical, CMS, DNS, and billing owners</dt><dd>[record named owners]</dd></div>
            <div><dt>Provisioned / accepted / next review</dt><dd>[record dates]</dd></div>
          </dl>
        </div>
      </section>

      <nav className="pb-handover-index" aria-label="Handover sections">
        <div className="pb-shell pb-handover-index__grid">
          <a href="#architecture"><span>01</span>Architecture</a>
          <a href="#access"><span>02</span>GitHub access</a>
          <a href="#migration-sequence"><span>03</span>Azure rebuild</a>
          <a href="#settings"><span>04</span>Settings &amp; secrets</a>
          <a href="#maintenance"><span>05</span>Maintenance</a>
          <a href="#acceptance"><span>06</span>Acceptance</a>
        </div>
      </nav>

      <section className="pb-handover-section" id="architecture" aria-labelledby="architecture-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">01 · Code package &amp; target architecture</p>
            <h2 id="architecture-heading">Git is the source of truth. Azure will serve and index it.</h2>
            <p>
              The public website builds as a static Next.js export. The target Azure Static Web Apps
              resource serves that export and hosts two managed Functions: the self-hosted TinaCMS
              backend and the campaign API.
            </p>
          </div>

          <div className="pb-handover-architecture" aria-label="Website architecture flow">
            <div className="pb-handover-architecture__source">
              <span>Source of truth</span>
              <strong>Private GitHub repository</strong>
              <code>damienjames/passbyira-org · main</code>
              <small>Code, JSON content, images, and deployment workflow</small>
            </div>
            <div className="pb-handover-architecture__arrow" aria-hidden="true">→</div>
            <div className="pb-handover-architecture__build">
              <span>Build &amp; release</span>
              <strong>GitHub Actions · Node 22</strong>
              <code>npm run build:deploy</code>
              <small>Produces out/, prepares api/, and validates campaign documents</small>
            </div>
            <div className="pb-handover-architecture__arrow" aria-hidden="true">→</div>
            <div className="pb-handover-architecture__runtime">
              <span>Azure runtime</span>
              <strong>Static Web Apps</strong>
              <code>Static site + /api/*</code>
              <small>Production, pull-request previews, TLS, and managed Functions</small>
            </div>
            <div className="pb-handover-architecture__storage">
              <span>Persistent services</span>
              <strong>Azure Storage account</strong>
              <div>
                <code>Table: Tina index + users</code>
                <code>Blob: campaign catalog</code>
              </div>
            </div>
            <div className="pb-handover-architecture__editor">
              <span>Editor loop</span>
              <strong>/admin/index.html</strong>
              <small>TinaCMS authenticates, writes approved content to GitHub, then the action redeploys the site.</small>
            </div>
          </div>

          <aside className="pb-handover-note">
            <strong>Why this is a separate route</strong>
            <p>
              The <Link href="/team-brief">team brief</Link> explains the design and content
              decision. This runbook is longer-lived operational documentation: it can be printed,
              checked off, and updated as planned infrastructure becomes real without turning the
              presentation into a setup manual.
            </p>
          </aside>
          <aside className="pb-handover-note">
            <strong>Document visibility</strong>
            <p>
              Local development always exposes this route. A production build shows it only when
              <code>HANDOVER_ENABLED=true</code> or <code>TEAM_BRIEF_ENABLED=true</code> is present at
              build time. The no-index metadata prevents normal search indexing but is not access
              control; use a private review environment or a printed copy for sensitive discussion.
            </p>
          </aside>
        </div>
      </section>

      <section className="pb-handover-section pb-handover-section--sand" id="access" aria-labelledby="access-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">02 · Private repository access</p>
            <h2 id="access-heading">Put the repository under institutional ownership.</h2>
            <p>
              The current remote is <code>https://github.com/damienjames/passbyira-org.git</code>.
              The durable end state is a Pass by Ira GitHub organization with two organization
              owners—not a production site dependent on one person&apos;s account.
            </p>
          </div>

          <div className="pb-handover-choice">
            <article className="pb-handover-choice__recommended">
              <span>Recommended end state</span>
              <h3>Transfer the repository</h3>
              <ol>
                <li>Create or confirm the Pass by Ira GitHub organization.</li>
                <li>Add at least two organization owners and require two-factor authentication.</li>
                <li>Transfer <code>passbyira-org</code> into that organization.</li>
                <li>Give maintainers Write access; reserve Admin for the technical owner.</li>
                <li>Confirm Actions, branch protection, secrets, and the default branch after transfer.</li>
              </ol>
            </article>
            <article>
              <span>Safe interim state</span>
              <h3>Invite collaborators</h3>
              <ol>
                <li>Collect each maintainer&apos;s GitHub username.</li>
                <li>Open Repository Settings → Collaborators → Add people.</li>
                <li>Ask each person to accept the private-repository invitation.</li>
                <li>Verify clone, branch, pull-request, and Actions access before the workshop.</li>
                <li>Set a dated follow-up to complete the organization transfer.</li>
              </ol>
            </article>
          </div>

          <div className="pb-handover-command" aria-label="Local setup commands">
            <div>
              <span>Maintainer workstation</span>
              <strong>First local setup</strong>
            </div>
            <pre><code>{`git clone https://github.com/damienjames/passbyira-org.git
cd passbyira-org
npm ci
npm run cms`}</code></pre>
            <p>
              Use Node 22 to match the workflow. <code>npm run cms</code> starts Next.js and the
              local TinaCMS editor; local mode does not require production Azure credentials.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-handover-section" id="migration-sequence" aria-labelledby="migration-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">03 · Azure rebuild sequence</p>
            <h2 id="migration-heading">Build beside production, verify, then move the domain.</h2>
            <p>
              Provision beside any site currently serving the domain. The target subscription should
              reach a verified Azure-generated URL before any DNS record changes.
            </p>
          </div>

          <ol className="pb-handover-steps">
            <li>
              <StepNumber>01</StepNumber>
              <div>
                <span>Identity &amp; ownership</span>
                <h3>Name the accountable owners.</h3>
                <p>
                  Record the Azure subscription owner, resource-group Contributor, GitHub
                  organization owners, day-to-day maintainer, CMS owner, and DNS owner. Use
                  organization-controlled accounts wherever possible.
                </p>
              </div>
              <em>Exit: every production system has a primary and backup owner.</em>
            </li>
            <li>
              <StepNumber>02</StepNumber>
              <div>
                <span>Azure foundation</span>
                <h3>Create the resource group and storage.</h3>
                <p>
                  In the new subscription, create one production resource group and a general-purpose
                  v2 Storage account. Create a table for the Tina index and a private Blob container
                  named <code>passbyira-campaigns</code> (or document the chosen replacement names).
                </p>
              </div>
              <em>Exit: the table and container exist; connection strings are held only in the secret manager.</em>
            </li>
            <li>
              <StepNumber>03</StepNumber>
              <div>
                <span>Static Web App</span>
                <h3>Create an empty Azure Static Web App.</h3>
                <p>
                  Select <strong>Other</strong> as the deployment source so Azure does not generate a
                  competing workflow. Use the plan and region approved by the organization, then copy
                  the deployment token from Overview → Manage deployment token.
                </p>
              </div>
              <em>Exit: the new resource has an Azure-generated hostname and a newly issued token.</em>
            </li>
            <li>
              <StepNumber>04</StepNumber>
              <div>
                <span>Runtime configuration</span>
                <h3>Add the application settings and GitHub secret.</h3>
                <p>
                  Add the settings in the next section to the Static Web App. In GitHub Actions,
                  replace the value of <code>AZURE_STATIC_WEB_APPS_API_TOKEN_PROUD_MUSHROOM_030EB6910</code>
                  with the new resource&apos;s token, or rename the secret and workflow reference together.
                  Also add the campaign Storage connection string as a protected repository secret.
                </p>
              </div>
              <em>Exit: no secret value appears in a commit, issue, handover note, or screenshot.</em>
            </li>
            <li>
              <StepNumber>05</StepNumber>
              <div>
                <span>First deployment</span>
                <h3>Run the existing delivery pipeline.</h3>
                <p>
                  The workflow runs <code>npm ci</code>, <code>npm run build:deploy</code>, then uploads
                  the prebuilt <code>out/</code> site and <code>api/</code> Functions. A push to
                  <code>main</code> deploys production; pull requests create preview environments.
                </p>
              </div>
              <em>Exit: the workflow is green and the Azure-generated URL passes the acceptance checklist.</em>
            </li>
            <li>
              <StepNumber>06</StepNumber>
              <div>
                <span>CMS bootstrap</span>
                <h3>Create and rotate the initial editor.</h3>
                <p>
                  The current <code>content/users/index.json</code> contains no users. Add a designated
                  one-time seed administrator immediately before the first production index, deploy,
                  sign in, replace that password in the CMS user collection, and remove the plaintext
                  seed from the current branch. Treat the seed as exposed and never reuse it.
                </p>
              </div>
              <em>Exit: two authorized editors can sign in and the bootstrap password no longer works.</em>
            </li>
            <li>
              <StepNumber>07</StepNumber>
              <div>
                <span>Domain cutover</span>
                <h3>Validate ownership before routing traffic.</h3>
                <p>
                  Add Azure&apos;s TXT validation record first. After the new host is fully tested, update
                  the required CNAME, ALIAS/ANAME, or A record. Verify HTTPS, apex/www behavior,
                  donation links, forms, CMS, and APIs before retiring the old resource.
                </p>
              </div>
              <em>Exit: production traffic is stable and the prior deployment remains recoverable for an agreed window.</em>
            </li>
            <li>
              <StepNumber>08</StepNumber>
              <div>
                <span>Closeout</span>
                <h3>Rotate, document, and revoke.</h3>
                <p>
                  Rotate the Tina GitHub token and session secret, record billing and alert owners,
                  export the final resource inventory, and remove legacy collaborator or Azure access
                  only after the new owners accept the handover.
                </p>
              </div>
              <em>Exit: the organization can deploy, edit, diagnose, and roll back without the original builder.</em>
            </li>
          </ol>
        </div>
      </section>

      <section className="pb-handover-section pb-handover-section--dark" id="settings" aria-labelledby="settings-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">04 · Settings &amp; secrets</p>
            <h2 id="settings-heading">Recreate values. Do not copy credentials between owners.</h2>
            <p>
              These are Azure Static Web Apps application settings used by the managed Functions.
              Generate new credentials in the destination accounts and store the values only in Azure
              or GitHub&apos;s encrypted secret stores.
            </p>
          </div>

          <div className="pb-handover-settings" role="table" aria-label="Azure application settings">
            <div className="pb-handover-settings__head" role="row">
              <span role="columnheader">Setting</span>
              <span role="columnheader">Destination value</span>
              <span role="columnheader">Used for</span>
            </div>
            {azureSettings.map((setting) => (
              <div role="row" key={setting.name}>
                <code role="cell">{setting.name}</code>
                <span role="cell">{setting.value}</span>
                <span role="cell">{setting.purpose}</span>
              </div>
            ))}
          </div>

          <div className="pb-handover-secret-rule">
            <strong>GitHub delivery values</strong>
            <p>
              Repository secrets: <code>AZURE_STATIC_WEB_APPS_API_TOKEN_PROUD_MUSHROOM_030EB6910</code>
              (or a coordinated replacement name) and <code>CAMPAIGN_STORAGE_CONNECTION_STRING</code>.
              Repository variables: <code>CAMPAIGN_STORAGE_CONTAINER</code> and
              <code>CAMPAIGN_STORAGE_BLOB</code> when the defaults are not used. The Action&apos;s
              built-in <code>GITHUB_TOKEN</code> is supplied by GitHub and is not created manually.
            </p>
          </div>

          <div className="pb-handover-secret-rule">
            <strong>Credential boundary</strong>
            <p>
              GitHub collaborators do not need Azure storage connection strings. Content editors do
              not need GitHub accounts. Azure Contributors do not automatically need CMS access.
              Grant each role the narrowest access required and review it at least quarterly.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-handover-section" id="maintenance" aria-labelledby="maintenance-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">05 · Maintaining the site</p>
            <h2 id="maintenance-heading">Three workflows cover normal operations.</h2>
          </div>

          <div className="pb-handover-operations">
            <article>
              <span>Content editor</span>
              <h3>Edit through TinaCMS</h3>
              <ol>
                <li>Sign in at <code>/admin/index.html</code>.</li>
                <li>Edit text, programs, people, events, posts, or approved media.</li>
                <li>Preview for accuracy, consent, link quality, and image alt text.</li>
                <li>Save; Tina writes the change to <code>main</code> in GitHub.</li>
                <li>Confirm the GitHub Action is green and check production.</li>
              </ol>
              <p className="pb-handover-cadence">Use for approved editorial changes. Never place secrets or private client data in CMS fields.</p>
            </article>
            <article>
              <span>Developer</span>
              <h3>Change code through a pull request</h3>
              <ol>
                <li>Pull <code>main</code> and create a short-lived branch.</li>
                <li>Run <code>npm ci</code> and <code>npm run cms</code>.</li>
                <li>Implement and run <code>npm run lint</code> plus <code>npm run build:deploy</code>.</li>
                <li>Open a pull request and verify the Azure preview.</li>
                <li>Merge only after review; the merge deploys production.</li>
              </ol>
              <p className="pb-handover-cadence">Patch dependencies monthly; review Next.js and TinaCMS breaking changes before upgrades.</p>
            </article>
            <article>
              <span>Campaign publisher</span>
              <h3>Publish the runtime catalog</h3>
              <ol>
                <li>Update and approve files under <code>content/campaigns/</code>.</li>
                <li>Run <code>npm run campaigns:validate</code> before review.</li>
                <li>Merge the approved change; the production workflow publishes after deployment when its protected Storage secret is configured.</li>
                <li>Check <code>/api/campaigns/active</code> and the intended page placement.</li>
                <li>For an authorized manual recovery, set the secret only in the shell and run <code>npm run campaigns:publish</code>.</li>
              </ol>
              <p className="pb-handover-cadence pb-handover-cadence--warning">Provisioning dependency: CI skips this step until CAMPAIGN_STORAGE_CONNECTION_STRING exists as a GitHub secret.</p>
            </article>
          </div>

          <div className="pb-handover-file-map">
            <div className="pb-handover-section__heading pb-handover-section__heading--small">
              <p className="pb-kicker">Repository map</p>
              <h2>Know what to edit—and what generates itself.</h2>
            </div>
            <div role="table" aria-label="Repository ownership map">
              {fileMap.map(([area, path, purpose]) => (
                <div role="row" key={area}>
                  <strong role="cell">{area}</strong>
                  <code role="cell">{path}</code>
                  <span role="cell">{purpose}</span>
                </div>
              ))}
            </div>
            <p>
              Do not hand-edit <code>tina/__generated__/</code>, <code>api/tina/__generated__/</code>,
              <code>out/</code>, or dependency lock internals. The build regenerates or packages them.
            </p>
          </div>

          <div className="pb-handover-rollback">
            <div>
              <p className="pb-kicker">Rollback rule</p>
              <h2>Revert the source; let the pipeline restore production.</h2>
            </div>
            <p>
              For site or CMS content, revert the responsible Git commit and allow the main-branch
              workflow to redeploy. For campaigns, restore the approved campaign content from Git and
              rerun the publishing script. Never patch generated files directly in Azure.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-handover-section pb-handover-section--sand" id="acceptance" aria-labelledby="acceptance-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">06 · Acceptance &amp; open gates</p>
            <h2 id="acceptance-heading">Handover is complete when they can prove each loop.</h2>
            <p>
              A successful page load is only one test. The receiving team must demonstrate access,
              editing, deployment, storage, incident recovery, and billing ownership.
            </p>
          </div>

          <div className="pb-handover-acceptance">
            {verificationItems.map(([title, detail], index) => (
              <label key={title}>
                <input type="checkbox" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{title}</strong>
                <small>{detail}</small>
              </label>
            ))}
          </div>

          <div className="pb-handover-gates">
            <article>
              <span>Open gate 01</span>
              <h3>No production CMS user is seeded.</h3>
              <p><code>content/users/index.json</code> is currently empty. Complete the one-time bootstrap and rotation before calling CMS access handed over.</p>
            </article>
            <article>
              <span>Open gate 02</span>
              <h3>Campaign delivery awaits its protected secret.</h3>
              <p>The workflow validates campaigns and has a conditional publish step. Add CAMPAIGN_STORAGE_CONNECTION_STRING as a GitHub secret plus the optional container/blob variables when Storage is provisioned.</p>
            </article>
            <article>
              <span>Open gate 03</span>
              <h3>The deployment secret name is resource-specific.</h3>
              <p>The workflow still references the current Azure-generated secret name. Preserve it temporarily or rename the secret and workflow in the same change.</p>
            </article>
            <article>
              <span>Open gate 04</span>
              <h3>The target Azure inventory is not complete yet.</h3>
              <p>Populate the provisioning tracker with actual names, URLs, owners, and dates as resources are created. There is no Bicep or Terraform definition yet, so the accepted inventory is essential.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="pb-handover-sources" aria-labelledby="sources-heading">
        <div className="pb-shell pb-handover-sources__grid">
          <div>
            <p className="pb-kicker">Primary references</p>
            <h2 id="sources-heading">Use current vendor guidance during the workshop.</h2>
          </div>
          <ul>
            <li><a href="https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-token-management">Microsoft: Static Web Apps deployment tokens</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/static-web-apps/application-settings">Microsoft: Static Web Apps application settings</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/static-web-apps/apis-functions">Microsoft: managed Azure Functions APIs</a></li>
            <li><a href="https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain">Microsoft: custom domains and zero-downtime migration</a></li>
            <li><a href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/transferring-a-repository">GitHub: transferring a repository</a></li>
            <li><a href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/inviting-collaborators-to-a-personal-repository">GitHub: private repository collaborators</a></li>
            <li><a href="https://tina.io/docs/self-hosted/overview">TinaCMS: self-hosted architecture</a></li>
            <li><a href="https://tina.io/docs/reference/self-hosted/auth-provider/authjs">TinaCMS: initial user and authentication setup</a></li>
          </ul>
        </div>
      </section>

      <footer className="pb-handover-close">
        <div className="pb-shell pb-handover-close__grid">
          <div>
            <p className="pb-kicker">Definition of done</p>
            <h2>They can run the site without calling the person who built it.</h2>
          </div>
          <div>
            <p>
              Record the receiving GitHub owner, Azure owner, CMS owner, DNS owner, acceptance date,
              and next credential-review date in the organization&apos;s password manager or IT register.
              Do not record passwords in this document.
            </p>
            <div className="pb-button-row">
              <Link className="pb-button pb-button--light" href="/content-readiness">
                Open content readiness <span aria-hidden="true">→</span>
              </Link>
              <Link className="pb-button pb-button--line-light" href="/handover">
                Handover home <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}
