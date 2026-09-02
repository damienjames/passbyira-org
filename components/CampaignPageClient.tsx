"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  campaignApiUrl,
  focalPointPosition,
  type Campaign,
  type CampaignApiResponse,
  type CampaignState,
} from "@/lib/campaigns";

interface CampaignPageClientProps {
  initialSlug?: string;
  ongoingSupportUrl: string;
}

type LoadState =
  | { kind: "loading" }
  | { kind: "missing-slug" }
  | { kind: "not-found" }
  | { kind: "error" }
  | { kind: "ready"; state: CampaignState; campaign: Campaign };

function campaignSlugFromLocation(initialSlug?: string) {
  if (initialSlug) return initialSlug;
  const querySlug = new URLSearchParams(window.location.search).get("slug")?.trim();
  return querySlug || "";
}

function formattedEndDate(campaign: Campaign) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: campaign.timezone,
  }).format(new Date(campaign.endsAt));
}

export default function CampaignPageClient({ initialSlug, ongoingSupportUrl }: CampaignPageClientProps) {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    const slug = campaignSlugFromLocation(initialSlug);
    if (!slug) {
      const timeout = window.setTimeout(() => setLoadState({ kind: "missing-slug" }), 0);
      return () => window.clearTimeout(timeout);
    }

    const controller = new AbortController();

    fetch(campaignApiUrl(encodeURIComponent(slug)), {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 404) return { notFound: true } as const;
        if (!response.ok) throw new Error("Campaign request failed");
        return (await response.json()) as CampaignApiResponse;
      })
      .then((payload) => {
        if ("notFound" in payload) {
          setLoadState({ kind: "not-found" });
          return;
        }
        if ("campaign" in payload) {
          setLoadState({ kind: "ready", state: payload.state, campaign: payload.campaign });
          return;
        }
        window.location.assign(payload.redirectUrl);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setLoadState({ kind: "error" });
      });

    return () => controller.abort();
  }, [initialSlug]);

  const themeClass = loadState.kind === "ready"
    ? `pb-campaign-theme--${loadState.campaign.visual.theme}`
    : "pb-campaign-theme--slate";
  const treatmentClass = loadState.kind === "ready"
    ? `pb-campaign-hero--${loadState.campaign.visual.heroTreatment}`
    : "pb-campaign-hero--split";
  const ctaStyleClass = loadState.kind === "ready"
    ? `pb-campaign-actions--${loadState.campaign.visual.ctaStyle}`
    : "";

  const endDate = useMemo(
    () => (loadState.kind === "ready" ? formattedEndDate(loadState.campaign) : ""),
    [loadState],
  );

  if (loadState.kind !== "ready") {
    const messages = {
      loading: ["Loading campaign", "Checking the current campaign details…"],
      "missing-slug": ["Choose a campaign", "This page needs a campaign link. Return home to see current opportunities."],
      "not-found": ["Campaign unavailable", "This campaign is not public, has not started, or is no longer available."],
      error: ["Campaign temporarily unavailable", "We could not load this campaign right now. Please try again shortly."],
    } as const;
    const [title, body] = messages[loadState.kind];

    return (
      <section className={`pb-campaign-empty ${themeClass}`} aria-live="polite">
        <div className="pb-campaign-empty__card">
          <p className="pb-campaign-kicker">Pass by Ira</p>
          <h1>{title}</h1>
          <p>{body}</p>
          {loadState.kind !== "loading" ? (
            <Link href="/" className="pb-campaign-button pb-campaign-button--primary">
              Return home <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>
      </section>
    );
  }

  const { campaign } = loadState;

  return (
    <article className={`pb-campaign ${themeClass}`}>
      {loadState.state === "expired" ? (
        <div className="pb-campaign-status" role="status">
          <div className="pb-shell">
            <strong>Campaign archive</strong>
            <span>This campaign ended on {endDate}. Its story remains available for reference.</span>
          </div>
        </div>
      ) : null}

      <header className={`pb-campaign-hero ${treatmentClass}`}>
        <div className="pb-shell pb-campaign-hero__grid">
          <div className="pb-campaign-hero__copy">
            <p className="pb-campaign-kicker">{campaign.eyebrow}</p>
            <h1>{campaign.title}</h1>
            <p className="pb-campaign-hero__summary">{campaign.summary}</p>
            {loadState.state === "active" ? (
              <div className={`pb-campaign-actions ${ctaStyleClass}`}>
                {campaign.ctas.map((cta) => (
                  <a
                    key={`${cta.label}-${cta.href}`}
                    href={cta.href}
                    target={cta.href.startsWith("http") ? "_blank" : undefined}
                    rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={`pb-campaign-button pb-campaign-button--${cta.kind}`}
                  >
                    {cta.label} <span aria-hidden="true">{cta.href.startsWith("http") ? "↗" : "→"}</span>
                  </a>
                ))}
              </div>
            ) : (
              <a href={ongoingSupportUrl} target="_blank" rel="noopener noreferrer" className="pb-campaign-button pb-campaign-button--primary">
                Support the current mission <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>

          <figure className="pb-campaign-hero__media">
            <Image
              src={campaign.heroImage.src}
              alt={campaign.heroImage.alt}
              width={campaign.heroImage.width}
              height={campaign.heroImage.height}
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
              style={{ objectPosition: focalPointPosition(campaign.heroImage.focalPoint) }}
            />
            <figcaption>
              <span>{campaign.heroImage.caption}</span>
              {campaign.heroImage.credit ? <small>Photo: {campaign.heroImage.credit}</small> : null}
            </figcaption>
          </figure>
        </div>
      </header>

      <section className="pb-campaign-story" aria-labelledby="campaign-story-heading">
        <div className="pb-shell pb-campaign-story__grid">
          <div>
            <p className="pb-campaign-kicker">Why it matters</p>
            <h2 id="campaign-story-heading">A campaign grounded in practical care</h2>
          </div>
          <div className="pb-campaign-story__body">
            {campaign.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      {campaign.supportingImages.length > 0 ? (
        <section className="pb-campaign-gallery" aria-labelledby="campaign-gallery-heading">
          <div className="pb-shell">
            <div className="pb-campaign-gallery__heading">
              <p className="pb-campaign-kicker">The work in view</p>
              <h2 id="campaign-gallery-heading">Community, dignity, and action</h2>
            </div>
            <div className="pb-campaign-gallery__grid">
              {campaign.supportingImages.map((image) => (
                <figure key={`${image.order}-${image.src}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 700px) 100vw, 50vw"
                    style={{ objectPosition: focalPointPosition(image.focalPoint) }}
                  />
                  <figcaption>
                    <span>{image.caption}</span>
                    {image.credit ? <small>Photo: {image.credit}</small> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-campaign-close" aria-labelledby="campaign-close-heading">
        <div className="pb-shell pb-campaign-close__grid">
          <div>
            <p className="pb-campaign-kicker">Keep the work moving</p>
            <h2 id="campaign-close-heading">
              {loadState.state === "active" ? "Turn care into action today." : "The campaign ended. The mission continues."}
            </h2>
          </div>
          <div className="pb-campaign-close__action">
            <p>Every gift helps Pass by Ira show up with dignity, consistency, and care across Dallas–Fort Worth.</p>
            <a href={ongoingSupportUrl} target="_blank" rel="noopener noreferrer" className="pb-campaign-button pb-campaign-button--primary">
              Donate to the mission <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
