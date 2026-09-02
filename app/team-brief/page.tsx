import type { Metadata } from "next";
import { notFound } from "next/navigation";

import TeamBriefDeck from "@/components/TeamBriefDeck";

export const metadata: Metadata = {
  title: "Website Redesign Team Brief | Pass by Ira",
  description: "Team presentation on the Pass by Ira website direction, audience needs, and content priorities.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const reviewEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.HANDOVER_ENABLED === "true" ||
  process.env.TEAM_BRIEF_ENABLED === "true";

export default function TeamBriefPage() {
  if (!reviewEnabled) notFound();

  return <TeamBriefDeck />;
}
