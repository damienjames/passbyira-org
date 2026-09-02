import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Azure Migration & Website Handover | Pass by Ira",
  description:
    "Operational runbook for transferring, verifying, and maintaining the Pass by Ira website.",
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
    name: "TINA_PUBLIC_IS_LOCAL",
    value: "false",
    purpose: "Uses the production TinaCMS API instead of the local content server",
  },
  {
    name: "GITHUB_OWNER",
    value: "damienjames (update after an organization transfer)",
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
    value: "Configured in Azure — never record here",
    purpose: "Repository-scoped token with Contents read/write for TinaCMS",
  },
  {
    name: "AZURE_TABLE_CONNECTION_STRING",
    value: "Configured in Azure — never record here",
    purpose: "Connection to the TinaCMS index and user store",
  },
  {
    name: "AZURE_TABLE_NAME",
    value: "PassByIraTina",
    purpose: "TinaCMS index table",
  },
  {
    name: "AZURE_TABLE_PARTITION_KEY",
    value: "tina_main",
    purpose: "Keeps the Tina index isolated by branch",
  },
  {
    name: "TINA_SESSION_SECRET",
    value: "Configured in Azure — rotate during ownership transfer",
    purpose: "Signs CMS login sessions; NEXTAUTH_SECRET is also supported",
  },
  {
    name: "CAMPAIGN_STORAGE_CONNECTION_STRING",
    value: "Configured in Azure and GitHub — never record here",
    purpose: "Connection to the published campaign catalog",
  },
  {
    name: "CAMPAIGN_STORAGE_CONTAINER",
    value: "passbyira-campaigns",
    purpose: "Blob container for campaign data",
  },
  {
    name: "CAMPAIGN_STORAGE_BLOB",
    value: "published/campaigns.json",
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
  ["Static app", "The Azure-generated URL loads the homepage and public content routes."],
  ["CMS API", "/api/tina/gql returns an authentication response, not a 5xx platform error."],
  ["CMS login", "The designated owners can sign in at /admin/index.html and no seed password remains active."],
  ["Editorial loop", "A low-risk CMS edit creates a GitHub commit and a successful production deployment."],
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
            <span>Transition runbook</span>
            <span>Revision 02 · September 1, 2026</span>
          </div>
          <div className="pb-handover-hero__grid">
            <div>
              <p className="pb-kicker">Azure migration &amp; website handover</p>
              <h1>Take confident ownership of the full system.</h1>
            </div>
            <div className="pb-handover-hero__intro">
              <p>
                This repository contains the Pass by Ira website, content, CMS, campaign services,
                and deployment workflow. The Azure foundation is provisioned; this runbook explains
                how to verify it and transfer day-to-day control to the organization.
              </p>
              <div className="pb-button-row">
                <a className="pb-button pb-button--dark" href="#migration-sequence">
                  Review remaining steps <span aria-hidden="true">↓</span>
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
            <h2 id="handover-status-heading">The application and Azure foundation are ready. Ownership acceptance comes next.</h2>
          </div>
          <div className="pb-handover-status__items">
            <p><span>01</span><strong>Prepared</strong>The private repository contains the application, content, CMS, Functions, and deployment workflow.</p>
            <p><span>02</span><strong>Provisioned</strong>The Azure runtime, storage services, application settings, and delivery secrets are configured.</p>
            <p><span>03</span><strong>Complete next</strong>Onboard CMS owners, verify each operating workflow, transfer access, and complete the domain decision.</p>
          </div>
        </div>
      </section>

      <section className="pb-handover-provisioning" aria-labelledby="provisioning-heading">
        <div className="pb-shell">
          <div className="pb-handover-provisioning__heading">
            <div>
              <p className="pb-kicker">Production inventory</p>
              <h2 id="provisioning-heading">Confirm the live resources, then add the accountable owners and acceptance dates.</h2>
            </div>
            <p>
              The infrastructure values below reflect the provisioned Azure environment. Complete
              the ownership and review fields during handover so the record remains operational.
            </p>
          </div>
          <div className="pb-handover-provisioning__stages" role="list" aria-label="Provisioning stages">
            <div role="listitem"><span>Prepared</span><strong>Application code &amp; workflow</strong><small>Available in the private repository</small></div>
            <div role="listitem"><span>Provisioned</span><strong>Azure resource group &amp; Static Web App</strong><small>Deployed and responding</small></div>
            <div role="listitem"><span>Provisioned</span><strong>Storage table &amp; Blob container</strong><small>Configured for the CMS and campaigns</small></div>
            <div role="listitem"><span>Complete next</span><strong>CMS administrators &amp; credential rotation</strong><small>Onboard named owners securely</small></div>
            <div role="listitem"><span>Decision required</span><strong>Custom domain cutover</strong><small>Validate before routing traffic</small></div>
          </div>
          <dl className="pb-handover-inventory">
            <div><dt>Azure subscription</dt><dd>Pay-As-You-Go · 0edd5912-29d0-4c82-9716-be1491c3efe6</dd></div>
            <div><dt>Resource group</dt><dd>rg-passbyira-centralus</dd></div>
            <div><dt>Static Web App / default URL</dt><dd>passbyira-org-swa · proud-mushroom-030eb6910.1.azurestaticapps.net</dd></div>
            <div><dt>Plan / region</dt><dd>Free · Central US</dd></div>
            <div><dt>Storage</dt><dd>stpassbyiratina0edd / PassByIraTina · stpassbyiracamp0edd / passbyira-campaigns</dd></div>
            <div><dt>GitHub repository / branch</dt><dd>damienjames/passbyira-org · main</dd></div>
            <div><dt>Technical, CMS, DNS, and billing owners</dt><dd>[add named primary and backup owners]</dd></div>
            <div><dt>Provisioned / accepted / next review</dt><dd>September 1, 2026 / [add acceptance and review dates]</dd></div>
          </dl>
        </div>
      </section>

      <nav className="pb-handover-index" aria-label="Handover sections">
        <div className="pb-shell pb-handover-index__grid">
          <a href="#architecture"><span>01</span>Architecture</a>
          <a href="#access"><span>02</span>GitHub access</a>
          <a href="#migration-sequence"><span>03</span>Azure transition</a>
          <a href="#settings"><span>04</span>Settings &amp; secrets</a>
          <a href="#maintenance"><span>05</span>Maintenance</a>
          <a href="#acceptance"><span>06</span>Acceptance</a>
        </div>
      </nav>

      <section className="pb-handover-section" id="architecture" aria-labelledby="architecture-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">01 · Application &amp; production architecture</p>
            <h2 id="architecture-heading">GitHub is the source of truth. Azure serves and indexes it.</h2>
            <p>
              The public website builds as a static Next.js export. The Azure Static Web Apps
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
              <small>Produces out/, prepares api/, validates campaign documents, and deploys the result</small>
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
              decisions. This runbook is longer-lived operational documentation: it can be printed,
              checked off, and updated as ownership changes without turning the
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
            <h2 id="access-heading">Move the repository to organization-managed ownership.</h2>
            <p>
              The current remote is <code>https://github.com/damienjames/passbyira-org.git</code>.
              The recommended long-term arrangement is a Pass by Ira GitHub organization with at
              least two organization owners, so the production site does not depend on one person&apos;s account.
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
              <span>Interim arrangement</span>
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
            <p className="pb-kicker">03 · Azure transition sequence</p>
            <h2 id="migration-heading">Verify the new environment beside the current site, then complete the domain decision.</h2>
            <p>
              The Azure environment is deployed at its generated hostname. Keep any site currently
              serving the custom domain in place until the receiving team completes acceptance.
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
              <em>Complete when: every production system has a primary and backup owner.</em>
            </li>
            <li>
              <StepNumber>02</StepNumber>
              <div>
                <span>Azure foundation</span>
                <h3>Confirm the resource group and storage configuration.</h3>
                <p>
                  The <code>rg-passbyira-centralus</code> resource group contains two general-purpose
                  v2 Storage accounts. Confirm <code>PassByIraTina</code> remains available for the CMS
                  index and <code>passbyira-campaigns</code> remains a private campaign Blob container.
                </p>
              </div>
              <em>Complete when: both storage services respond and connection strings remain only in encrypted settings.</em>
            </li>
            <li>
              <StepNumber>03</StepNumber>
              <div>
                <span>Static Web App</span>
                <h3>Confirm the deployed Azure Static Web App.</h3>
                <p>
                  The <code>passbyira-org-swa</code> resource runs on the Free plan in Central US at
                  <code>proud-mushroom-030eb6910.1.azurestaticapps.net</code>. Confirm that the
                  repository, <code>main</code> branch, generated hostname, and deployment token belong
                  to the expected production environment.
                </p>
              </div>
              <em>Complete when: the generated hostname serves the current build and the deployment token is controlled by the receiving technical owner.</em>
            </li>
            <li>
              <StepNumber>04</StepNumber>
              <div>
                <span>Runtime configuration</span>
                <h3>Review the application settings and GitHub secrets.</h3>
                <p>
                  The settings in the next section and both required GitHub Actions secrets are
                  configured. Confirm their presence without exposing their values. During ownership
                  transfer, rotate the deployment token, TinaCMS GitHub token, session secret, and
                  affected storage keys; update each encrypted setting at the same time.
                </p>
              </div>
              <em>Complete when: the required values are present, newly controlled, and absent from commits, issues, notes, and screenshots.</em>
            </li>
            <li>
              <StepNumber>05</StepNumber>
              <div>
                <span>Delivery pipeline</span>
                <h3>Verify the existing build and deployment workflow.</h3>
                <p>
                  The workflow runs <code>npm ci</code>, <code>npm run build:deploy</code>, then uploads
                  the prebuilt <code>out/</code> site and <code>api/</code> Functions. A push to
                  <code>main</code> deploys production; same-repository pull requests create preview
                  environments. Review the latest successful run and repeat the test after credentials transfer.
                </p>
              </div>
              <em>Complete when: the workflow succeeds under receiving-team control and the generated URL passes the acceptance checklist.</em>
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
              <em>Complete when: two authorized editors can sign in and the bootstrap password no longer works.</em>
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
              <em>Complete when: production traffic is stable and the prior deployment remains recoverable for an agreed window.</em>
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
              <em>Complete when: the organization can deploy, edit, diagnose, and roll back without the original builder.</em>
            </li>
          </ol>
        </div>
      </section>

      <section className="pb-handover-section pb-handover-section--dark" id="settings" aria-labelledby="settings-heading">
        <div className="pb-shell">
          <div className="pb-handover-section__heading">
            <p className="pb-kicker">04 · Settings &amp; secrets</p>
            <h2 id="settings-heading">Transfer control by rotating credentials, not by sharing them.</h2>
            <p>
              These Azure Static Web Apps settings are used by the managed Functions. The listed
              non-secret values reflect production. Rotate credentials during ownership transfer and
              keep their values only in Azure or GitHub&apos;s encrypted secret stores.
            </p>
          </div>

          <div className="pb-handover-settings" role="table" aria-label="Azure application settings">
            <div className="pb-handover-settings__head" role="row">
              <span role="columnheader">Setting</span>
              <span role="columnheader">Production value or requirement</span>
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
              The repository contains the required secrets
              {" "}<code>AZURE_STATIC_WEB_APPS_API_TOKEN_PROUD_MUSHROOM_030EB6910</code> and
              {" "}<code>CAMPAIGN_STORAGE_CONNECTION_STRING</code>. It also records the campaign container
              and Blob path as repository variables. GitHub supplies the workflow&apos;s built-in
              <code>GITHUB_TOKEN</code>; no one creates or stores that value manually.
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
            <h2 id="maintenance-heading">Three workflows support day-to-day operations.</h2>
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
              <p className="pb-handover-cadence">The production workflow validates and publishes the catalog only after the site deployment succeeds.</p>
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
              or <code>out/</code>. The build regenerates or packages them. Use <code>npm</code> to
              update dependencies so the lockfiles change consistently.
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
            <h2 id="acceptance-heading">Handover is complete after the receiving team verifies every workflow.</h2>
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
              <h3>Production CMS administrators must still be onboarded.</h3>
              <p><code>content/users/index.json</code> is intentionally empty. Complete the one-time bootstrap and credential rotation before accepting CMS access.</p>
            </article>
            <article>
              <span>Open gate 02</span>
              <h3>The custom-domain decision remains open.</h3>
              <p>The Azure-generated hostname is live, but no custom domain is attached to the Static Web App. Confirm the intended apex and www behavior before changing DNS.</p>
            </article>
            <article>
              <span>Open gate 03</span>
              <h3>Operational ownership must be recorded.</h3>
              <p>Add named primary and backup owners for GitHub, Azure, the CMS, DNS, billing, and incident response, along with the acceptance and next-review dates.</p>
            </article>
            <article>
              <span>Open gate 04</span>
              <h3>Repository ownership remains personal.</h3>
              <p>The production repository is still owned by <code>damienjames</code>. Transfer it to a Pass by Ira organization, or approve a dated interim access arrangement.</p>
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
            <li><a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository">GitHub: transferring a repository</a></li>
            <li><a href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/repository-access-and-collaboration/inviting-collaborators-to-a-personal-repository">GitHub: private repository collaborators</a></li>
            <li><a href="https://tina.io/docs/self-hosted/overview">TinaCMS: self-hosted architecture</a></li>
            <li><a href="https://tina.io/docs/reference/self-hosted/auth-provider/authjs">TinaCMS: initial user and authentication setup</a></li>
          </ul>
        </div>
      </section>

      <footer className="pb-handover-close">
        <div className="pb-shell pb-handover-close__grid">
          <div>
            <p className="pb-kicker">Definition of done</p>
            <h2>The organization can operate the site independently and confidently.</h2>
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
