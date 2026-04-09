import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import MobileDock from "@/components/MobileDock";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
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
        width: 1470,
        height: 744,
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
    >
      <body className="flex flex-col min-h-dvh antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="announcement-bar" role="banner" aria-label="Site announcement">
          Now accepting in-kind donations: blankets, socks, gloves, toiletries &amp; water.&nbsp;
          <a
            href="mailto:donate@passbyira.org"
            style={{ color: "inherit", fontWeight: 800, textDecoration: "underline" }}
          >
            donate@passbyira.org
          </a>
        </div>
        <SiteNav />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <MobileDock />
        <Footer />
      </body>
    </html>
  );
}
