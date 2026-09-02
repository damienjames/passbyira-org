import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import readinessContent from "@/content/pages/content-readiness.json";
import siteSettings from "@/content/site/settings.json";

export const metadata: Metadata = {
  title: "Content Readiness | Pass by Ira",
  description: "Internal content collection workspace for the Pass by Ira website redesign.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const reviewEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.HANDOVER_ENABLED === "true" ||
  process.env.CONTENT_REVIEW_ENABLED === "true";

export default function ContentReadinessPage() {
  if (!reviewEnabled) notFound();

  const readyCount = readinessContent.sections.filter((section) => section.publishReady).length;
  const criticalCount = readinessContent.sections.filter(
    (section) => section.priority === "Launch critical",
  ).length;

  return (
    <div className="pb-readiness">
      <section className="pb-readiness-hero" aria-labelledby="readiness-heading">
        <div className="pb-shell pb-readiness-hero__grid">
          <div>
            <p className="pb-kicker">{readinessContent.review.eyebrow}</p>
            <h1 id="readiness-heading">{readinessContent.review.title}</h1>
            <p className="pb-readiness-hero__lead">{readinessContent.review.description}</p>
            <div className="pb-button-row">
              <Link className="pb-button pb-button--dark" href="/admin/index.html">
                Open TinaCMS editor <span aria-hidden="true">→</span>
              </Link>
              <Link className="pb-button pb-button--line" href="/">
                View current homepage <span aria-hidden="true">→</span>
              </Link>
              <Link className="pb-button pb-button--line" href="/handover">
                Open handover portal <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="pb-readiness-hero__mark">
            <Image
              src={siteSettings.logo}
              alt="Pass by Ira"
              width={504}
              height={364}
              priority
            />
            <p>
              <strong>Internal review only</strong>
              Unverified numbers, draft stories, and incomplete service details must remain unpublished.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-readiness-summary" aria-label="Content readiness summary">
        <div className="pb-shell pb-readiness-summary__grid">
          <div>
            <strong>{readinessContent.sections.length}</strong>
            <span>content blocks defined</span>
          </div>
          <div>
            <strong>{criticalCount}</strong>
            <span>launch-critical blocks</span>
          </div>
          <div>
            <strong>{readyCount}</strong>
            <span>approved to publish</span>
          </div>
          <div>
            <strong>{readinessContent.review.lastReviewed}</strong>
            <span>workspace reviewed</span>
          </div>
        </div>
      </section>

      <section className="pb-readiness-index" aria-labelledby="readiness-index-heading">
        <div className="pb-shell">
          <div className="pb-readiness-heading">
            <p className="pb-kicker">Collection map</p>
            <h2 id="readiness-index-heading">What the team needs to complete.</h2>
            <p>
              Each block includes a reason, accountable owner, draft framing, required inputs, and a
              verification gate. Publish controls remain off until the content is approved.
            </p>
          </div>
          <nav className="pb-readiness-jump" aria-label="Jump to a content block">
            {readinessContent.sections.map((section, index) => (
              <a href={`#${section.id}`} key={section.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="pb-readiness-sections">
        {readinessContent.sections.map((section, index) => (
          <section className="pb-readiness-block" id={section.id} key={section.id}>
            <div className="pb-shell">
              <div className="pb-readiness-block__header">
                <div>
                  <p className="pb-kicker">Content block {String(index + 1).padStart(2, "0")}</p>
                  <h2>{section.title}</h2>
                </div>
                <dl className="pb-readiness-meta">
                  <div>
                    <dt>Priority</dt>
                    <dd>{section.priority}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{section.status}</dd>
                  </div>
                  <div>
                    <dt>Owner</dt>
                    <dd>{section.owner}</dd>
                  </div>
                  <div>
                    <dt>Publish</dt>
                    <dd>{section.publishReady ? "Approved" : "Off until approved"}</dd>
                  </div>
                </dl>
              </div>

              <div className="pb-readiness-block__reason">
                <span>Why this matters</span>
                <p>{section.reason}</p>
                <small>Recommended placement: {section.publicPlacement}</small>
              </div>

              <div className="pb-readiness-block__grid">
                <article className="pb-readiness-draft">
                  <span>Draft public framing</span>
                  <h3>{section.draftHeadline}</h3>
                  <p>{section.draftBody}</p>
                </article>

                <article>
                  <h3>Required inputs</h3>
                  <ul>
                    {section.requiredInputs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article>
                  <h3>Verification gate</h3>
                  <ul>
                    {section.verificationGate.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>

              <div className="pb-readiness-fields" aria-label={`${section.title} content fields`}>
                {section.contentFields.map((field) => (
                  <article key={field.label}>
                    <div>
                      <span>{field.label}</span>
                      <em>{field.verified ? "Verified" : "Needs verification"}</em>
                    </div>
                    <strong>{field.value}</strong>
                    <p>{field.guidance}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="pb-readiness-close" aria-labelledby="readiness-close-heading">
        <div className="pb-shell pb-readiness-close__grid">
          <div>
            <p className="pb-kicker">Launch rule</p>
            <h2 id="readiness-close-heading">Nothing publishes merely because a field was filled.</h2>
          </div>
          <div>
            <p>
              A content owner must confirm the source, verification gate, consent requirements, and
              public wording before changing a block to publish-ready.
            </p>
            <a className="pb-button pb-button--light" href="mailto:connect@passbyira.org">
              Assign content owners <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
