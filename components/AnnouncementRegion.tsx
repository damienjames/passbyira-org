"use client";

import { useEffect, useState } from "react";

import {
  campaignApiUrl,
  campaignHref,
  type Campaign,
  type CampaignApiResponse,
} from "@/lib/campaigns";

interface AnnouncementRegionProps {
  fallback: {
    label: string;
    message: string;
    linkLabel: string;
    linkHref: string;
  };
}

export default function AnnouncementRegion({ fallback }: AnnouncementRegionProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(campaignApiUrl("active?placement=announcement"), {
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

  const announcement = campaign
    ? {
        label: "Current campaign",
        message: campaign.summary,
        linkLabel: "View campaign",
        linkHref: campaignHref(campaign.slug),
      }
    : fallback;

  return (
    <div className={`announcement-bar${campaign ? " announcement-bar--campaign" : ""}`} role="note" aria-label="Current need">
      <span>{announcement.label}</span>
      <p>{announcement.message}</p>
      <a href={announcement.linkHref}>
        {announcement.linkLabel} <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
