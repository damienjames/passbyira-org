import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Website Handover | Pass by Ira",
  description: "Review portal for the Pass by Ira website transition resources and content editor.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const handoverEnabled =
  process.env.NODE_ENV !== "production" || process.env.HANDOVER_ENABLED === "true";

function TeamBriefIcon() {
  return (
    <svg viewBox="0 0 72 72" role="img" aria-label="Presentation screen">
      <rect x="8" y="10" width="56" height="39" rx="2" />
      <path d="M19 38V29M29 38V22M39 38V32M49 38V18" />
      <path d="M36 49v12M26 61h20" />
    </svg>
  );
}

function TechnicalHandoverIcon() {
  return (
    <svg viewBox="0 0 72 72" role="img" aria-label="Cloud architecture">
      <path d="M23 42H17a9 9 0 0 1-.8-18A15 15 0 0 1 45 20a11 11 0 0 1 4 22H31" />
      <rect x="24" y="49" width="14" height="11" rx="1" />
      <rect x="49" y="49" width="14" height="11" rx="1" />
      <path d="M31 42v7M42 42v12h7M31 54h-9" />
      <circle cx="18" cy="54" r="4" />
    </svg>
  );
}

function ReadinessIcon() {
  return (
    <svg viewBox="0 0 72 72" role="img" aria-label="Content checklist">
      <path d="M25 13h-8a4 4 0 0 0-4 4v43h46V17a4 4 0 0 0-4-4h-8" />
      <path d="M27 8h18a3 3 0 0 1 3 3v7H24v-7a3 3 0 0 1 3-3Z" />
      <path d="m22 31 4 4 7-8M22 47l4 4 7-8M39 31h11M39 47h11" />
    </svg>
  );
}

function CmsIcon() {
  return (
    <svg viewBox="0 0 72 72" role="img" aria-label="Content management editor">
      <rect x="8" y="10" width="56" height="50" rx="3" />
      <path d="M8 22h56M18 16h.1M25 16h.1M32 16h.1" />
      <path d="M19 33h22M19 42h17M19 51h12" />
      <path d="m49 48 9-9 4 4-9 9-6 2 2-6Z" />
    </svg>
  );
}

export default function HandoverPage() {
  if (!handoverEnabled) notFound();

  return (
    <article className="pb-handover-hub">
      <header className="pb-handover-hub__hero">
        <div className="pb-shell">
          <div className="pb-handover-hub__meta">
            <span>Pass by Ira</span>
            <span>Website transition portal</span>
          </div>
          <div className="pb-handover-hub__intro">
            <p className="pb-kicker">One link · four resources</p>
            <h1>Everything your team needs to take it from here.</h1>
          </div>
        </div>
      </header>

      <section className="pb-handover-hub__resources" aria-labelledby="handover-resources-heading">
        <div className="pb-shell">
          <h2 className="sr-only" id="handover-resources-heading">Handover resources</h2>
          <div className="pb-handover-hub__grid">
            <Link className="pb-handover-card pb-handover-card--dark" href="/team-brief">
              <div className="pb-handover-card__topline">
                <span>01 · Start here</span>
                <span aria-hidden="true">↗</span>
              </div>
              <TeamBriefIcon />
              <div>
                <h3>Team brief</h3>
                <p>The website direction, audience needs, content priorities, and launch decisions in an 11-slide presentation.</p>
              </div>
              <small>Presentation · use for review and alignment</small>
            </Link>

            <Link className="pb-handover-card pb-handover-card--warm" href="/team-handover">
              <div className="pb-handover-card__topline">
                <span>02 · Build &amp; operate</span>
                <span aria-hidden="true">↗</span>
              </div>
              <TechnicalHandoverIcon />
              <div>
                <h3>Technical handover</h3>
                <p>The operational runbook for GitHub, Azure, the CMS, deployment, domain transfer, rollback, and acceptance.</p>
              </div>
              <small>Runbook · complete during ownership transfer</small>
            </Link>

            <Link className="pb-handover-card" href="/content-readiness">
              <div className="pb-handover-card__topline">
                <span>03 · Complete the content</span>
                <span aria-hidden="true">↗</span>
              </div>
              <ReadinessIcon />
              <div>
                <h3>Content readiness</h3>
                <p>The owners, required inputs, approval gates, and publishing status for each launch content priority.</p>
              </div>
              <small>Workspace · eight content priorities for review</small>
            </Link>

            <Link className="pb-handover-card pb-handover-card--paper" href="/admin/index.html">
              <div className="pb-handover-card__topline">
                <span>04 · Maintain the site</span>
                <span aria-hidden="true">↗</span>
              </div>
              <CmsIcon />
              <div>
                <h3>TinaCMS editor</h3>
                <p>The editing interface for approved page copy, programs, people, events, campaigns, and media.</p>
              </div>
              <small>Editor · production sign-in required</small>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-handover-hub__path" aria-labelledby="handover-path-heading">
        <div className="pb-shell pb-handover-hub__path-grid">
          <div>
            <p className="pb-kicker">Recommended path</p>
            <h2 id="handover-path-heading">Review. Provision. Complete. Maintain.</h2>
          </div>
          <ol>
            <li><span>01</span><strong>Align</strong><small>Present the brief.</small></li>
            <li><span>02</span><strong>Transfer</strong><small>Work through the runbook.</small></li>
            <li><span>03</span><strong>Approve</strong><small>Close content gaps.</small></li>
            <li><span>04</span><strong>Operate</strong><small>Edit through TinaCMS.</small></li>
          </ol>
        </div>
      </section>

      <footer className="pb-handover-hub__footer">
        <div className="pb-shell">
          <p>
            Transition material intended for team review. Production visibility is controlled by the
            {" "}<code>HANDOVER_ENABLED</code> build setting. No-index metadata is not access control.
          </p>
          <Link href="/">Return to the public website <span aria-hidden="true">→</span></Link>
        </div>
      </footer>
    </article>
  );
}
