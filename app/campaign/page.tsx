import type { Metadata } from "next";

import CampaignPageClient from "@/components/CampaignPageClient";
import siteSettings from "@/content/site/settings.json";

export const metadata: Metadata = {
  title: "Campaign | Pass by Ira",
  description: "View a current or archived Pass by Ira campaign.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CampaignPage() {
  return <CampaignPageClient ongoingSupportUrl={siteSettings.donateUrl} />;
}
