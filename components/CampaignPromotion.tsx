"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  campaignApiUrl,
  campaignHref,
  focalPointPosition,
  type Campaign,
  type CampaignApiResponse,
} from "@/lib/campaigns";

export default function CampaignPromotion() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(campaignApiUrl("active?placement=homepage"), {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as CampaignApiResponse;
      })
      .then((payload) => {
        if (payload && "campaign" in payload) setCampaign(payload.campaign);
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          setCampaign(null);
        }
      });

    return () => controller.abort();
  }, []);

  if (!campaign) return null;

  const primaryCta = campaign.ctas.find((cta) => cta.kind === "primary") || campaign.ctas[0];

  return (
    <section
      className={`pb-campaign-promo pb-campaign-theme--${campaign.visual.theme}`}
      aria-labelledby={`campaign-promo-${campaign.slug}`}
    >
      <div className="pb-shell pb-campaign-promo__grid">
        <div className="pb-campaign-promo__media">
          <Image
            src={campaign.heroImage.src}
            alt={campaign.heroImage.alt}
            width={campaign.heroImage.width}
            height={campaign.heroImage.height}
            sizes="(max-width: 900px) 100vw, 44vw"
            style={{ objectPosition: focalPointPosition(campaign.heroImage.focalPoint) }}
          />
        </div>
        <div className="pb-campaign-promo__copy">
          <p className="pb-campaign-kicker">{campaign.eyebrow}</p>
          <h2 id={`campaign-promo-${campaign.slug}`}>{campaign.title}</h2>
          <p>{campaign.summary}</p>
          <div className="pb-campaign-actions">
            {primaryCta ? (
              <a href={primaryCta.href} target={primaryCta.href.startsWith("http") ? "_blank" : undefined} rel={primaryCta.href.startsWith("http") ? "noopener noreferrer" : undefined} className="pb-campaign-button pb-campaign-button--primary">
                {primaryCta.label} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            <Link href={campaignHref(campaign.slug)} className="pb-campaign-button pb-campaign-button--secondary">
              Campaign details <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
