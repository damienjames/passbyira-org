import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AnnouncementRegion from "@/components/AnnouncementRegion";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import siteSettings from "@/content/site/settings.json";
import { getAbsoluteUrl, OG_IMAGE_ALT, OG_IMAGE_PATH, SITE_NAME } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getAbsoluteUrl("/")),
  title: "Pass by Ira | Eradicating Homelessness in the DFW Metroplex",
  description:
    "Pass by Ira is a 501(c)(3) nonprofit dedicated to eradicating homelessness in Dallas–Fort Worth through outreach programs, education, and advocacy. Donate, volunteer, or get involved today.",
  keywords: [
    "Pass by Ira",
    "homelessness Dallas",
    "DFW nonprofit",
    "homeless outreach Texas",
    "501c3 nonprofit",
    "#IRAdicateHomelessness",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pass by Ira | Eradicating Homelessness in DFW",
    description:
      "Join us in #IRAdicatingHomelessness across the Dallas–Fort Worth Metroplex. Outreach. Education. Advocacy.",
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1731,
        height: 909,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pass by Ira | Eradicating Homelessness in DFW",
    description:
      "Join us in #IRAdicatingHomelessness across the Dallas–Fort Worth Metroplex.",
    images: [OG_IMAGE_PATH],
  },
  category: "nonprofit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="flex flex-col min-h-dvh antialiased" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AnnouncementRegion fallback={siteSettings.announcement} />
        <SiteNav />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
