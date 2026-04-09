import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import EventGallery from "@/components/EventGallery";
import InquiryForm from "@/components/InquiryForm";
import boardData from "@/data/board.json";
import programsData from "@/data/programs.json";
import {
  additionalGalleryNote,
  galleryItems,
  partnershipWays,
  restFramework,
  siteImages,
  sponsorshipLevels,
} from "@/data/site-content";
import {
  getAbsoluteUrl,
  OG_IMAGE_ALT,
  OG_IMAGE_PATH,
  SITE_NAME,
} from "@/lib/site";

interface BoardMember {
  group: "board" | "advisor";
  name: string;
  title: string;
  initials: string;
  bio: string;
  photo: string | null;
  linkedinUrl?: string;
}

interface Program {
  name: string;
  description: string;
  icon: string;
  season?: string;
  hashtag?: string;
  volunteerUrl?: string;
  advertiseUrl?: string;
  donationNeeds?: string[];
  comingSoon?: boolean;
}

interface Pillar {
  id: string;
  label: string;
  title: string;
  description: string;
  programs: Program[];
}

const STATIC_ROUTES = [
  "about-3",
  "meet-the-team",
  "event",
  "rest",
  "past-events",
  "support-us",
  "sign-up-to-volunteer",
  "donate",
  "sponsorship",
  "contact",
  "blog",
  "post/quarterly-newsletter-february-2025",
  "post/special-edition-newsletter-coats-cocoa-2024-the-recap",
  "post/quarterly-newsletter-november-2024",
  "30-for-30-campaign",
] as const;

const pageMeta: Record<(typeof STATIC_ROUTES)[number], { title: string; description: string }> = {
  "about-3": {
    title: "About | Pass by Ira",
    description: "Learn the story of Ira, our mission, our vision, and the values guiding Pass by Ira.",
  },
  "meet-the-team": {
    title: "Meet the Team | Pass by Ira",
    description: "Meet the board members and advisors guiding the work of Pass by Ira.",
  },
  event: {
    title: "Programs | Pass by Ira",
    description: "Explore Pass by Ira's outreach, education, and advocacy programs across the DFW Metroplex.",
  },
  rest: {
    title: "REST Retreat | Pass by Ira",
    description: "Learn about Pass by Ira's REST Leadership Retreat and its focus on renewal, collaboration, and community impact.",
  },
  "past-events": {
    title: "Gallery | Pass by Ira",
    description: "View highlights from 2023 Thanksgiving Dinner, Coats & Cocoa, and the 2024 Team Retreat.",
  },
  "support-us": {
    title: "Support Us | Pass by Ira",
    description: "Learn why support matters and the many ways to get involved with Pass by Ira.",
  },
  "sign-up-to-volunteer": {
    title: "Volunteer | Pass by Ira",
    description: "Learn how to volunteer with Pass by Ira and sign up for upcoming opportunities.",
  },
  donate: {
    title: "Donate | Pass by Ira",
    description: "Support Pass by Ira through one-time gifts, monthly giving, and in-kind donations.",
  },
  sponsorship: {
    title: "Partnership & Sponsorship | Pass by Ira",
    description: "Explore sponsorship, partnership, and advertising opportunities that support Pass by Ira's mission.",
  },
  contact: {
    title: "Connect | Pass by Ira",
    description: "Get in touch with Pass by Ira and stay connected through social channels and newsletters.",
  },
  blog: {
    title: "News | Pass by Ira",
    description: "Read the latest Pass by Ira updates and newsletter posts.",
  },
  "post/quarterly-newsletter-february-2025": {
    title: "Quarterly Newsletter: February 2025 | Pass by Ira",
    description: "Quarterly highlights and mission updates from Pass by Ira in February 2025.",
  },
  "post/special-edition-newsletter-coats-cocoa-2024-the-recap": {
    title: "Special Edition Newsletter: Coats & Cocoa 2024 THE RECAP | Pass by Ira",
    description: "A recap of Pass by Ira's Coats & Cocoa 2024 outreach effort.",
  },
  "post/quarterly-newsletter-november-2024": {
    title: "Quarterly Newsletter: November 2024 | Pass by Ira",
    description: "Newsletter highlights from Pass by Ira for November 2024.",
  },
  "30-for-30-campaign": {
    title: "30 for 30 Campaign | Pass by Ira",
    description: "Support Pass by Ira's 30 for 30 campaign and help sustain community outreach.",
  },
};

const newsPosts = [
  {
    slug: "post/quarterly-newsletter-february-2025",
    title: "Quarterly Newsletter: February 2025",
    date: "Feb 16, 2025",
    summary: "Quarterly highlights, updates across the mission, and ways the community can stay engaged.",
    lead: "A snapshot of recent momentum across outreach, education, advocacy, and community engagement.",
    imageSrc: "/images/hero/volunteer-header.webp",
    imageAlt: "February 2025 newsletter header",
    bullets: [
      "Mission updates and current momentum across outreach, education, and advocacy work.",
      "A concise snapshot of recent activity for supporters following Pass by Ira's progress.",
      "Clear next steps for staying connected through programs, events, and future updates.",
    ],
    body: [
      "This quarterly update highlights the steady work required to address homelessness with consistency, compassion, and practical support. It reflects the organization's continued focus on showing up for neighbors across the DFW Metroplex through outreach, education, and advocacy.",
      "For supporters, updates like this offer a concise way to follow the mission, celebrate progress, and stay connected to the programs and partnerships shaping the work ahead.",
    ],
  },
  {
    slug: "post/special-edition-newsletter-coats-cocoa-2024-the-recap",
    title: "Special Edition Newsletter: Coats & Cocoa 2024 THE RECAP",
    date: "Dec 14, 2024",
    summary: "A recap of Coats & Cocoa 2024 and the community support behind the winter outreach effort.",
    lead: "A recap of winter outreach centered on warmth, essential items, and community care.",
    imageSrc: "/images/hero/support-banner.webp",
    imageAlt: "Coats and Cocoa recap image",
    bullets: [
      "A winter-outreach recap centered on coats, cocoa, and direct community care.",
      "Recognition of the people and support that helped make the seasonal event possible.",
      "A preserved campaign-style update that now connects naturally to the new gallery and support pages.",
    ],
    body: [
      "Coats & Cocoa reflects Pass by Ira's cold-weather response work: meeting immediate needs with coats, blankets, gloves, hot drinks, and visible care for neighbors facing winter conditions.",
      "This recap highlights the people, generosity, and hands-on support that make seasonal outreach possible and underscores how community action can meet urgent needs with dignity.",
    ],
  },
  {
    slug: "post/quarterly-newsletter-november-2024",
    title: "Quarterly Newsletter: November 2024",
    date: "Dec 7, 2024",
    summary: "A late-2024 mission update covering outreach momentum, seasonal needs, and community engagement.",
    lead: "A snapshot of Pass by Ira's work and priorities heading into the winter season.",
    imageSrc: "/images/gallery/wix-archive/026-4db8fe_cad34d6f0e2b47a39f72d22b114891dc-mv2.webp",
    imageAlt: "Pass by Ira team at a community gathering",
    bullets: [
      "Seasonal outreach context and the importance of winter support.",
      "A broader look at community engagement and ongoing organizational momentum.",
      "An additional archived newsletter entry preserved from the live Wix blog.",
    ],
    body: [
      "This archived newsletter reflects the rhythm of Pass by Ira's work near the close of 2024: consistent outreach, growing community visibility, and preparation for seasonal needs that become more urgent in colder months.",
      "Keeping this post in the refactor matters because it preserves continuity in the organization's public story, rather than making the blog feel like it only began with the most recent two entries.",
    ],
  },
] as const;

function getRoutePreview(key: (typeof STATIC_ROUTES)[number]) {
  const newsPost = newsPosts.find((post) => post.slug === key);

  if (newsPost) {
    return {
      image: newsPost.imageSrc,
      imageAlt: newsPost.imageAlt,
      type: "article" as const,
    };
  }

  const previewMap: Partial<Record<(typeof STATIC_ROUTES)[number], { image: string; imageAlt: string }>> = {
    "about-3": { image: siteImages.aboutHero.src, imageAlt: siteImages.aboutHero.alt },
    "meet-the-team": { image: siteImages.teamHero.src, imageAlt: siteImages.teamHero.alt },
    event: { image: siteImages.programsHero.src, imageAlt: siteImages.programsHero.alt },
    rest: { image: siteImages.restHero.src, imageAlt: siteImages.restHero.alt },
    "past-events": { image: siteImages.coatsAndCocoa.src, imageAlt: siteImages.coatsAndCocoa.alt },
    "support-us": { image: siteImages.supportHero.src, imageAlt: siteImages.supportHero.alt },
    "sign-up-to-volunteer": { image: "/images/hero/volunteer-header.webp", imageAlt: "Volunteer signup header" },
    donate: { image: siteImages.supportHero.src, imageAlt: siteImages.supportHero.alt },
    sponsorship: { image: siteImages.sponsorshipHero.src, imageAlt: siteImages.sponsorshipHero.alt },
    contact: { image: siteImages.contactHero.src, imageAlt: siteImages.contactHero.alt },
    blog: { image: "/images/hero/volunteer-header.webp", imageAlt: "Pass by Ira newsletter archive header" },
    "30-for-30-campaign": { image: "/images/hero/volunteer-header.webp", imageAlt: "30 for 30 campaign header" },
  };

  const preview = previewMap[key];

  return {
    image: preview?.image || OG_IMAGE_PATH,
    imageAlt: preview?.imageAlt || OG_IMAGE_ALT,
    type: "website" as const,
  };
}

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/passbyira", icon: "instagram" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61557703994254", icon: "facebook" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/pass-by-ira", icon: "linkedin" },
] as const;

function SocialIcon({ icon }: { icon: (typeof socialLinks)[number]["icon"] }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "1.1rem", height: "1.1rem" }}>
        <path d="M7.75 3H16.25C18.87 3 21 5.13 21 7.75V16.25C21 18.87 18.87 21 16.25 21H7.75C5.13 21 3 18.87 3 16.25V7.75C3 5.13 5.13 3 7.75 3ZM7.6 4.8C6.05 4.8 4.8 6.05 4.8 7.6V16.4C4.8 17.95 6.05 19.2 7.6 19.2H16.4C17.95 19.2 19.2 17.95 19.2 16.4V7.6C19.2 6.05 17.95 4.8 16.4 4.8H7.6ZM17.2 6.15C17.75 6.15 18.2 6.6 18.2 7.15C18.2 7.7 17.75 8.15 17.2 8.15C16.65 8.15 16.2 7.7 16.2 7.15C16.2 6.6 16.65 6.15 17.2 6.15ZM12 7.5C14.48 7.5 16.5 9.52 16.5 12C16.5 14.48 14.48 16.5 12 16.5C9.52 16.5 7.5 14.48 7.5 12C7.5 9.52 9.52 7.5 12 7.5ZM12 9.3C10.51 9.3 9.3 10.51 9.3 12C9.3 13.49 10.51 14.7 12 14.7C13.49 14.7 14.7 13.49 14.7 12C14.7 10.51 13.49 9.3 12 9.3Z" fill="currentColor" />
      </svg>
    );
  }

  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "1.1rem", height: "1.1rem" }}>
        <path d="M13.5 21V13.82H15.93L16.29 11.02H13.5V9.23C13.5 8.42 13.73 7.86 14.89 7.86H16.38V5.36C15.67 5.29 14.97 5.26 14.26 5.27C12.15 5.27 10.71 6.56 10.71 8.93V11.02H8.28V13.82H10.71V21H13.5Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "1.1rem", height: "1.1rem" }}>
      <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.03 9.03A1.23 1.23 0 1 0 8 6.57A1.23 1.23 0 0 0 8.03 9.03ZM9.1 10.97H6.94V17.5H9.1V10.97ZM17.5 13.44C17.5 11.24 16.33 10.74 15.27 10.74C14.41 10.74 13.83 11.21 13.59 11.66H13.56V10.97H11.49V17.5H13.65V14.27C13.65 13.42 13.81 12.59 14.86 12.59C15.89 12.59 15.9 13.55 15.9 14.33V17.5H18.06L17.5 13.44Z" fill="currentColor" />
    </svg>
  );
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return STATIC_ROUTES.map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = slug.join("/") as (typeof STATIC_ROUTES)[number];
  const meta = pageMeta[key];

  if (!meta) {
    return {};
  }

  const pathname = `/${key}`;
  const preview = getRoutePreview(key);

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: pathname,
      siteName: SITE_NAME,
      type: preview.type,
      images: [
        {
          url: getAbsoluteUrl(preview.image),
          alt: preview.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [getAbsoluteUrl(preview.image)],
    },
  };
}

function PageHero({
  eyebrow,
  title,
  lead,
  imageSrc,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <section className="section-shell section-alt" aria-labelledby="route-page-heading">
      <div className="pbi-container">
        <div className="page-hero-grid">
          <div>
            <div className="section-eyebrow">{eyebrow}</div>
            <h1 id="route-page-heading" className="section-title">{title}</h1>
            <p className="section-lead">{lead}</p>
          </div>
          <div className="gallery-item" style={{ borderRadius: "24px", aspectRatio: "4 / 3" }}>
            <Image src={imageSrc} alt={imageAlt} width={1400} height={1000} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member }: { member: BoardMember }) {
  return (
    <article className="board-card">
      {member.photo ? (
        <Image
          src={member.photo}
          alt={`${member.name}, ${member.title}`}
          width={400}
          height={400}
          className="board-card__avatar"
        />
      ) : (
        <div className="board-card__initials" aria-hidden="true">{member.initials}</div>
      )}
      <div className="board-card__body">
        <h3 className="board-card__name">{member.name}</h3>
        <p className="board-card__role">{member.title}</p>
        <p className="board-card__bio">{member.bio}</p>
        {member.linkedinUrl ? (
          <div className="board-card__actions">
            <a href={member.linkedinUrl} className="board-card__linkedin" target="_blank" rel="noopener noreferrer" aria-label={`View ${member.name} on LinkedIn`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8.03 9.03A1.23 1.23 0 1 0 8 6.57A1.23 1.23 0 0 0 8.03 9.03ZM9.1 10.97H6.94V17.5H9.1V10.97ZM17.5 13.44C17.5 11.24 16.33 10.74 15.27 10.74C14.41 10.74 13.83 11.21 13.59 11.66H13.56V10.97H11.49V17.5H13.65V14.27C13.65 13.42 13.81 12.59 14.86 12.59C15.89 12.59 15.9 13.55 15.9 14.33V17.5H18.06L17.5 13.44Z" fill="currentColor" />
              </svg>
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function renderAboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="The Story of Ira"
        lead="One bottle of water, one repeated act of care, and one relationship became the foundation for Pass by Ira."
        imageSrc={siteImages.aboutHero.src}
        imageAlt={siteImages.aboutHero.alt}
      />

        <section className="section-shell">
          <div className="pbi-container">
            <div className="responsive-split responsive-split--wide">
              <div className="feature-card">
              <div className="section-eyebrow">Our Beginning</div>
              <p>
                Pass by Ira began when founder Jene&apos;a encountered a woman named Ira asking for water on the way to work. That moment became a daily act of care: first water, then snacks, then breakfast, and eventually a recurring outreach routine rooted in relationship.
              </p>
              <p>
                Real change can begin with one routine act of kindness, repeated with intention until it becomes community action.
              </p>
            </div>
            <div className="feature-card">
              <div className="section-eyebrow">Founder Reflection</div>
              <p>
                “At Pass By Ira we believe that we have the power to change someone&apos;s circumstances and make a difference. One kind act, one bottle of water, and one relationship at a time.”
              </p>
              <p style={{ marginBottom: 0, fontWeight: 700, color: "var(--color-pbi-primary-dark)" }}>
                Jene&apos;a, Founder of Pass by Ira
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-alt" id="mission">
        <div className="pbi-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            <div className="feature-card">
              <div className="section-eyebrow">Mission</div>
              <h3>Basic human rights for every person</h3>
              <p>
                Our mission is to eradicate homelessness by increasing access to safe shelter, healthy food, clean water, quality education, healthcare, and a livable income.
              </p>
            </div>
            <div className="feature-card">
              <div className="section-eyebrow">Vision</div>
              <h3>No one unseen or underserved</h3>
              <p>
                We envision a world where no one is unseen, underserved, or without a place to call home.
              </p>
            </div>
            <div className="feature-card">
              <div className="section-eyebrow">Values</div>
              <h3>Compassion, dignity, equity, and integrity</h3>
              <p>
                Our work is grounded in compassion, dignity, equity, collaboration, integrity, innovation, empowerment, and environmental justice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell" id="values">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-eyebrow">Core Values</div>
            <h2 className="section-title">What Guides the Work</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {[
              "Compassion",
              "Dignity",
              "Equity",
              "Collaboration",
              "Integrity",
              "Innovation",
              "Empowerment",
              "Environmental Justice & Sustainability",
            ].map((value) => (
              <div key={value} className="feature-card">
                <h3 style={{ marginBottom: "0.5rem" }}>{value}</h3>
                <p style={{ marginBottom: 0 }}>
                  {value === "Environmental Justice & Sustainability"
                    ? "We believe human dignity is connected to healthy, sustainable environments and equitable access to clean air, water, and green spaces."
                    : "This value shapes how we serve, partner, and advocate in community."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function renderTeamPage(boardMembers: BoardMember[], boardAdvisors: BoardMember[]) {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="Meet the Team"
        lead="Meet the board members and advisors helping guide Pass by Ira's mission, partnerships, and long-term impact."
        imageSrc={siteImages.teamHero.src}
        imageAlt={siteImages.teamHero.alt}
      />

      <section className="section-shell">
        <div className="pbi-container">
          <div className="board-sections">
            <div className="board-subsection">
              <div className="board-subsection__header">
                <h2 className="board-subsection__title">Board Members</h2>
                <p className="board-subsection__copy">Current officers, founders, and general members serving on the board.</p>
              </div>
              <div className="board-grid board-grid--leadership">
                {boardMembers.map((member) => (
                  <TeamCard key={member.name + member.title} member={member} />
                ))}
              </div>
            </div>
            <div className="board-subsection">
              <div className="board-subsection__header">
                <h2 className="board-subsection__title">Board Advisors</h2>
                <p className="board-subsection__copy">Advisors who support strategy, partnership-building, and long-term organizational growth.</p>
              </div>
              <div className="board-grid board-grid--leadership">
                {boardAdvisors.map((member) => (
                  <TeamCard key={member.name + member.title} member={member} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function renderProgramsPage(pillars: Pillar[]) {
  return (
    <>
      <PageHero
        eyebrow="Current Programs"
        title="Education, Advocacy, and Outreach"
        lead="Pass by Ira's work is organized around three connected pillars: outreach, education, and advocacy."
        imageSrc={siteImages.programsHero.src}
        imageAlt={siteImages.programsHero.alt}
      />

      <section className="section-shell">
        <div className="pbi-container">
          <p className="section-lead" style={{ margin: "0 auto 2rem" }}>
            For additional information or questions, please email <a href="mailto:events@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>events@passbyira.org</a>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {pillars.map((pillar) => (
              <article key={pillar.id} id={pillar.id} className="pillar-card">
                <div className="pillar-card__header">
                  <span className="section-eyebrow">{pillar.label}</span>
                  <h3>{pillar.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.9rem", marginTop: "0.5rem", lineHeight: 1.6 }}>{pillar.description}</p>
                </div>
                <div className="pillar-card__body">
                  {pillar.programs.map((program) => (
                    <div
                      key={program.name}
                      id={program.name === "REST Leadership Retreat" ? "rest" : undefined}
                      className="program-item"
                    >
                      <h4>
                        <span aria-hidden="true" style={{ marginRight: "0.4rem" }}>{program.icon}</span>
                        {program.name}
                      </h4>
                      <p>{program.description}</p>
                      {program.season ? <p style={{ marginTop: "0.35rem", fontWeight: 700, color: "var(--color-pbi-primary-dark)" }}>{program.season}</p> : null}
                      {program.hashtag ? <p style={{ marginTop: "0.35rem", fontWeight: 700, color: "var(--color-pbi-accent)" }}>{program.hashtag}</p> : null}
                      {program.donationNeeds?.length ? (
                        <p style={{ marginTop: "0.35rem" }}>Donation needs: {program.donationNeeds.join(", ")}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <a href="https://forms.gle/6R56X5v6z9dCuvWS9" className="btn-pbi btn-blue" target="_blank" rel="noopener noreferrer">
              Sign Up to Volunteer
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function renderRestPage() {
  return (
    <>
      <PageHero
        eyebrow="REST Retreat"
        title="Renew. Elevate. Sustain. Transform."
        lead="REST is Pass by Ira's leadership retreat for nonprofit, small business, and community leaders building stronger, more connected communities."
        imageSrc={siteImages.restHero.src}
        imageAlt={siteImages.restHero.alt}
      />

      <section className="section-shell">
        <div className="pbi-container">
          <div className="feature-card" style={{ display: "grid", gap: "1rem" }}>
            <p>
              The live site still preserves detailed retreat copy from the 2025 event cycle. In the refactor, this page keeps the core intent intact: a dedicated home for the REST framework, retreat overview, and the partnership opportunities connected to it.
            </p>
            <p>
              REST exists to give leaders room to recharge, exchange ideas, strengthen relationships, and return to their work with clearer strategy and deeper support.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link href="/sponsorship" className="btn-pbi btn-blue">View Sponsorship Options</Link>
              <a href="mailto:events@passbyira.org" className="btn-pbi btn-outline-blue">Contact Events Team</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-alt">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-eyebrow">The Framework</div>
            <h2 className="section-title">What REST Stands For</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {restFramework.map((item) => (
              <div key={item.title} className="feature-card">
                <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function renderGalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="From the Field"
        lead="A closer look at the event archives that are most clearly represented in the local photo set, from holiday meal distribution to leadership retreat moments."
        imageSrc="/images/hero/support-banner.webp"
        imageAlt="Gallery hero image"
      />

      <section className="section-shell">
        <div className="pbi-container">
          <div className="feature-card" style={{ marginBottom: "1.5rem" }}>
            <p>{additionalGalleryNote}</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginBottom: "2rem" }}>
            {galleryItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="btn-pbi btn-outline-blue" style={{ padding: "0.55rem 1.2rem", fontSize: "0.85rem" }}>
                {item.title}
              </a>
            ))}
          </div>
          <EventGallery items={galleryItems} />
        </div>
      </section>
    </>
  );
}

function renderSupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support Us"
        title="Why Your Support Matters"
        lead="Homelessness is a public health, mental health, and systems issue, and meaningful support requires both immediate care and long-term change."
        imageSrc={siteImages.supportHero.src}
        imageAlt={siteImages.supportHero.alt}
      />

      <section className="section-shell">
        <div className="pbi-container">
          <div className="feature-card">
            <p>
              According to Housing Forward&apos;s 2023 point-in-time report, 4,244 individuals were identified as experiencing homelessness in Dallas and Collin Counties. Separate Fort Worth reporting cited 2,390 individuals experiencing homelessness as of January 2024.
            </p>
            <p>
              Support helps provide meals, access to basic necessities, pathways to community resources, community education, and advocacy for long-term change.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell section-alt">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-eyebrow">Ways To Get Involved</div>
            <h2 className="section-title">Support, Fundraise, Advocate, Plan</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {[
              ["Donate", "Support programs directly with one-time, recurring, or in-kind contributions."],
              ["Fundraise", "Host a birthday, holiday, or community fundraiser and explore employer matching gifts."],
              ["Advocate for Change", "Share the mission, host awareness events, and contact local officials."],
              ["Partnership & Sponsorship", "Support events and outreach through business sponsorships, ad placements, in-kind support, or team engagement."],
              ["Planned Giving", "Include Pass by Ira in your estate planning to create long-term impact."],
            ].map(([title, body]) => (
              <div
                key={title}
                id={
                  title === "Fundraise"
                    ? "fundraise"
                    : title === "Advocate for Change"
                      ? "advocate"
                      : title === "Partnership & Sponsorship"
                        ? "partnerships"
                      : title === "Planned Giving"
                        ? "planned-giving"
                        : undefined
                }
                className="involve-card"
              >
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--color-pbi-muted)" }}>
            Planned giving inquiries can be directed to <a href="mailto:jordanlowe@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>jordanlowe@passbyira.org</a> or <a href="mailto:donate@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>donate@passbyira.org</a>.
          </p>
        </div>
      </section>
    </>
  );
}

function renderVolunteerPage() {
  const volunteerOpportunities = [
    "Power pack and meal assembly",
    "In-kind donation coordination",
    "Resource distribution",
    "Event support and hospitality",
    "Professional skills such as coaching, logistics, or planning support",
  ] as const;

  return (
    <>
      <PageHero
        eyebrow="Volunteer"
        title="Volunteer with Our Team"
        lead="Pass by Ira welcomes volunteers to join the cause through one-time events, recurring support, and skill-based service."
        imageSrc="/images/gallery/wix-archive/011-129b3c_9502441c8934426ea707f5de634bbce5-mv2.webp"
        imageAlt="Pass by Ira volunteers preparing meals together"
        />

        <section className="section-shell">
          <div className="pbi-container">
            <div className="responsive-split responsive-split--wide">
            <div className="feature-card">
              <div className="section-eyebrow">Why Volunteer</div>
              <h2 style={{ marginTop: 0 }}>Time and Skills Matter Here</h2>
              <p style={{ marginBottom: "1rem" }}>
                The live site positioned volunteer work as more than an event signup, and that context is worth keeping. Volunteers help prepare meals, organize donations, distribute resources, and support the people-facing details that make each effort feel dignified and coordinated.
              </p>
              <p>
                Whether you can help once, return regularly, or contribute a specific skill set, Pass by Ira makes room for short-term, long-term, and event-based support.
              </p>
            </div>

            <div className="feature-card">
              <div className="section-eyebrow">Upcoming Opportunities</div>
              <h2 style={{ marginTop: 0 }}>Ways to Serve</h2>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.75 }}>
                {volunteerOpportunities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                Looking for what&apos;s coming up next? Start with our current programs and event pages, then use the volunteer form to raise your hand.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
                <a
                  href="https://forms.gle/6R56X5v6z9dCuvWS9"
                  className="btn-pbi btn-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign Up to Volunteer
                </a>
                <Link href="/event" className="btn-pbi btn-outline-blue">See What&apos;s Next</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function renderDonatePage() {
  const givingOptions = [
    "One-time donation to support current programs",
    "Monthly giving for sustaining support",
    "In-kind donations such as clothing, hygiene supplies, and non-perishable essentials",
  ] as const;

  const currentNeeds = [
    "Blankets",
    "Socks / Gloves / Scarves / Hats",
    "Travel-size toiletries",
    "Water",
    "Feminine products",
  ] as const;

  const sampleAmounts = ["$5", "$10", "$15", "$25", "$50", "$100", "Other"] as const;

  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Support Our Mission"
        lead="Financial gifts and in-kind contributions help Pass by Ira respond to immediate needs while sustaining long-term outreach, education, and advocacy."
        imageSrc="/images/gallery/wix-archive/003-129b3c_c8014410ad354faa9cea95febd8a87fb-mv2.webp"
        imageAlt="Pass by Ira volunteer handing a prepared meal to a community member"
        />

        <section className="section-shell">
          <div className="pbi-container">
            <div className="responsive-split responsive-split--wide">
            <div className="feature-card">
              <div className="section-eyebrow">Ways to Give</div>
              <h2 style={{ marginTop: 0 }}>What Your Support Makes Possible</h2>
              <p style={{ marginBottom: "1rem" }}>
                The live donate page did more than link outward. It explained why giving matters, what kinds of support are welcome, and what needs are most urgent right now.
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.75 }}>
                {givingOptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "1.25rem" }}>
                <a href="https://givebutter.com/Give4Ira" className="btn-pbi btn-gold" target="_blank" rel="noopener noreferrer">
                  Give via GiveButter
                </a>
                <a href="mailto:donate@passbyira.org" className="btn-pbi btn-outline-blue">
                  Ask About In-Kind Giving
                </a>
              </div>
            </div>

            <div className="feature-card">
              <div className="section-eyebrow">Current In-Kind Needs</div>
              <h2 style={{ marginTop: 0 }}>Most Needed Items</h2>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.75 }}>
                {currentNeeds.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: "1rem" }}>
                For in-kind donations, contact{" "}
                <a href="mailto:donate@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>
                  donate@passbyira.org
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

        <section className="section-shell section-alt">
          <div className="pbi-container">
            <div className="responsive-split responsive-split--wide responsive-split--center">
            <div className="feature-card">
              <div className="section-eyebrow">Current Focus</div>
              <h2 style={{ marginTop: 0 }}>SERVE: Signature Meal Outreach</h2>
              <p>
                The live donate page specifically spotlighted SERVE as a giving opportunity. This refactor preserves that emphasis: donations help fund warm meals, outreach logistics, and the direct community support tied to this signature program.
              </p>
              <p>
                To learn more about SERVE or how to support the next outreach effort, contact{" "}
                <a href="mailto:events@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>
                  events@passbyira.org
                </a>.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "1rem" }}>
                <Link href="/event#outreach" className="btn-pbi btn-blue">Learn About SERVE</Link>
                <Link href="/sign-up-to-volunteer" className="btn-pbi btn-outline-blue">Volunteer Instead</Link>
              </div>
            </div>

            <div className="feature-card">
              <div className="section-eyebrow">Suggested Giving</div>
              <h2 style={{ marginTop: 0 }}>Common Donation Amounts</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginBottom: "1rem" }}>
                {sampleAmounts.map((amount) => (
                  <span
                    key={amount}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "4.4rem",
                      padding: "0.65rem 0.95rem",
                      borderRadius: "999px",
                      background: "rgba(201, 162, 39, 0.12)",
                      border: "1px solid rgba(122, 90, 67, 0.18)",
                      color: "var(--color-pbi-primary-dark)",
                      fontWeight: 800,
                    }}
                  >
                    {amount}
                  </span>
                ))}
              </div>
              <p>
                On Wix, these fed directly into the donation widget. Here, they serve as giving cues while the secure contribution flow remains on GiveButter.
              </p>
              <a href="https://givebutter.com/Give4Ira" className="btn-pbi btn-gold" target="_blank" rel="noopener noreferrer" style={{ marginTop: "1rem" }}>
                Open Donation Form
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function renderContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Stay in Touch"
        lead="Stay connected through direct email, social channels, and the latest newsletter updates."
        imageSrc={siteImages.contactHero.src}
        imageAlt={siteImages.contactHero.alt}
      />

        <section className="section-shell" id="connect">
          <div className="pbi-container">
            <div className="responsive-split responsive-split--wide">
              <InquiryForm kind="contact" />
              <div style={{ display: "grid", gap: "1.5rem" }}>
                <div className="feature-card">
                  <div className="section-eyebrow">Emails</div>
                  <p><a href="mailto:connect@passbyira.org">connect@passbyira.org</a></p>
                  <p><a href="mailto:events@passbyira.org">events@passbyira.org</a></p>
                  <p style={{ marginBottom: 0 }}><a href="mailto:donate@passbyira.org">donate@passbyira.org</a></p>
                </div>
                <div className="feature-card">
                  <div className="section-eyebrow">Social</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
                    {socialLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.65rem",
                            color: "var(--color-pbi-primary)",
                            fontWeight: 700,
                          }}
                        >
                          <SocialIcon icon={link.icon} />
                          <span>{link.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="feature-card">
                  <div className="section-eyebrow">Archive</div>
                  <p>Prefer to browse first? You can catch up on updates and newsletter posts before reaching out.</p>
                  <Link href="/blog" className="btn-pbi btn-outline-blue" style={{ alignSelf: "flex-start" }}>
                    View News &amp; Newsletter Posts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
  );
}

function renderBlogPage() {
  return (
    <>
      <PageHero
        eyebrow="News"
        title="Updates and Newsletters"
        lead="Read recent updates, recaps, and newsletter-style highlights from Pass by Ira."
        imageSrc="/images/hero/volunteer-header.webp"
        imageAlt="Blog header graphic"
      />

      <section className="section-shell">
        <div className="pbi-container">
          <div className="feature-card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div className="section-eyebrow">Archive</div>
                <h2 style={{ marginTop: 0, marginBottom: "0.45rem" }}>All Posts</h2>
                <p style={{ margin: 0 }}>
                  The original Wix blog presented these entries as a lightweight archive. This refactor keeps that archive visible and makes each newsletter easier to browse.
                </p>
              </div>
              <div style={{ display: "grid", gap: "0.45rem", minWidth: "220px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-pbi-primary-dark)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Publisher
                </span>
                <span style={{ color: "var(--color-pbi-muted)" }}>passbyira</span>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: "1rem" }}>
            {newsPosts.map((post) => (
              <article key={post.slug} className="feature-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  <div className="section-eyebrow" style={{ marginBottom: 0 }}>{post.date}</div>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-pbi-muted)", fontWeight: 600 }}>passbyira</span>
                </div>
                <h2 style={{ marginTop: 0 }}>{post.title}</h2>
                <p>{post.summary}</p>
                <Link href={`/${post.slug}`} style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function renderBlogPostPage(post: (typeof newsPosts)[number]) {
  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title={post.title}
        lead={post.lead}
        imageSrc={post.imageSrc}
        imageAlt={post.imageAlt}
      />

      <section className="section-shell">
        <div className="pbi-container" style={{ maxWidth: "860px" }}>
          <article className="feature-card" style={{ display: "grid", gap: "1.5rem" }}>
            <div>
              <div className="section-eyebrow">Published {post.date}</div>
              <h2 style={{ marginTop: "0.35rem" }}>At a Glance</h2>
              <p style={{ marginBottom: 0, color: "var(--color-pbi-muted)", lineHeight: 1.7 }}>{post.summary}</p>
            </div>
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {post.body.map((paragraph) => (
                <p key={paragraph} style={{ margin: 0, color: "var(--color-pbi-muted)", lineHeight: 1.75 }}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div>
              <h3 style={{ marginTop: 0 }}>What this update covered</h3>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.7 }}>
                {post.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
              <Link href="/blog" className="btn-pbi btn-blue">Back to News</Link>
              <Link href="/support-us" className="btn-pbi btn-outline-blue">Support the Mission</Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function renderSponsorshipPage() {
  const sponsorshipDetails = [
    {
      name: "Platinum Sponsor",
      amount: "$10,000+",
      exclusivity: "Exclusive: 1 available",
      benefits: [
        'Title sponsor recognition: "Presented by [Sponsor Name]"',
        "Premium logo placement across flyers, banners, website, and social media",
        "Speaking opportunity or welcoming remarks at the event",
        "Booth or table space at the event",
        "Full-page advertisement in the event program",
        "Ten VIP tickets",
      ],
    },
    {
      name: "Gold Sponsor",
      amount: "$5,000",
      benefits: [
        "Prominent logo placement on event materials",
        "Half-page advertisement in the event program",
        "Recognition from the stage during the event",
        "Booth or table space",
        "Five VIP tickets",
      ],
    },
    {
      name: "Silver Sponsor",
      amount: "$2,500",
      benefits: [
        "Logo placement on select event materials",
        "Quarter-page advertisement in the event program",
        "Recognition from the stage",
        "Three event tickets",
      ],
    },
    {
      name: "Bronze Sponsor",
      amount: "$1,000",
      benefits: [
        "Logo placement on the website and social media",
        "Acknowledgment in the event program",
        "Two event tickets",
      ],
    },
    {
      name: "Community Partner",
      amount: "$500",
      benefits: [
        "Name listing in the event program and website",
        "One event ticket",
      ],
    },
  ] as const;

  const inKindIdeas = [
    "Catering or food donations",
    "Printing services",
    "Venue space",
    "Media or advertising support",
  ] as const;

  const previousPartners = ["Kenny's", "Raytheon / RTX", "Shipley"] as const;

  return (
    <>
      <PageHero
        eyebrow="Partnership & Sponsorship"
        title="Support the Mission at Scale"
        lead="Pass by Ira partners with businesses, community organizations, and individual supporters to expand outreach, strengthen events, and deepen long-term impact."
        imageSrc={siteImages.sponsorshipHero.src}
        imageAlt={siteImages.sponsorshipHero.alt}
      />

        <section className="section-shell">
          <div className="pbi-container">
            <div className="responsive-split responsive-split--wide">
              <div className="feature-card">
              <div className="section-eyebrow">Why Partner</div>
              <h2 style={{ marginTop: 0 }}>Ways to Support</h2>
              <p style={{ marginBottom: "1rem" }}>
                The live site includes a full sponsorship menu for the REST Retreat. This refactor keeps that pathway visible while making it easier to update for future event cycles.
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.7 }}>
                {partnershipWays.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="feature-card">
              <div className="section-eyebrow">Contact</div>
              <h2 style={{ marginTop: 0 }}>Start the Conversation</h2>
              <p>Jordan Lowe leads corporate sponsorship and fundraising efforts for Pass by Ira.</p>
              <p style={{ marginTop: "0.75rem" }}>
                <a href="mailto:jordanlowe@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>
                  jordanlowe@passbyira.org
                </a>
              </p>
              <p style={{ marginTop: "0.35rem" }}>
                <a href="mailto:donate@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 700 }}>
                  donate@passbyira.org
                </a>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "1rem" }}>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScvTciz2SDzOsRxr17EjSSc6viOmdta4mlOuXmUH5ush5RwnA/viewform?usp=sharing" className="btn-pbi btn-blue" target="_blank" rel="noopener noreferrer">
                  Advertising Form
                </a>
                <Link href="/rest" className="btn-pbi btn-outline-blue">About the REST Retreat</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-alt">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-eyebrow">Previous Partnerships</div>
            <h2 className="section-title">Organizations That Have Helped Shape the Work</h2>
            <p className="section-lead" style={{ margin: "0 auto" }}>
              The live site highlights previous partners as part of the sponsorship story. Until logo assets are added locally, this section keeps that recognition visible in text form.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {previousPartners.map((partner) => (
              <div key={partner} className="feature-card" style={{ textAlign: "center" }}>
                <div className="section-eyebrow">Partner</div>
                <h3 style={{ marginTop: 0 }}>{partner}</h3>
                <p>Recognized on the live Pass by Ira sponsorship page as a previous supporter of mission-driven work and event visibility.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-eyebrow">REST Retreat Sponsorship</div>
            <h2 className="section-title">Sponsorship Levels</h2>
            <p className="section-lead" style={{ margin: "0 auto" }}>
              This carries over the main tier structure from the live site so visitors can understand the scale, benefits, and intent behind the REST Retreat sponsorship program.
            </p>
          </div>
          <div style={{ display: "grid", gap: "1.25rem" }}>
            {sponsorshipDetails.map((level) => (
              <article key={level.name} className="feature-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "baseline" }}>
                  <div>
                    <div className="section-eyebrow" style={{ marginBottom: "0.45rem" }}>{level.amount}</div>
                    <h3 style={{ margin: 0 }}>{level.name}</h3>
                  </div>
                  {"exclusivity" in level ? (
                    <span style={{ color: "var(--color-pbi-primary)", fontWeight: 700, fontSize: "0.9rem" }}>
                      {level.exclusivity}
                    </span>
                  ) : null}
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.75 }}>
                  {level.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell section-alt">
        <div className="pbi-container">
          <div className="responsive-split responsive-split--balanced">
            <div className="feature-card">
              <div className="section-eyebrow">In-Kind Sponsorship</div>
              <h2 style={{ marginTop: 0 }}>Goods and Services That Help</h2>
              <p style={{ marginBottom: "1rem" }}>
                The live page also invites non-cash support. That matters, so this version preserves it as a first-class option rather than burying it behind the form.
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.75 }}>
                {inKindIdeas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="feature-card">
              <div className="section-eyebrow">How to Become a Sponsor</div>
              <h2 style={{ marginTop: 0 }}>Next Steps</h2>
              <ol style={{ margin: 0, paddingLeft: "1.2rem", color: "var(--color-pbi-muted)", lineHeight: 1.75 }}>
                <li>Review the sponsorship levels and decide what scale of support fits your organization.</li>
                <li>Use the advertising form for ad-book placements or email Jordan Lowe for custom sponsorship conversations.</li>
                <li>Coordinate recognition details, event visibility, and any in-kind support directly with the Pass by Ira team.</li>
              </ol>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginTop: "1.25rem" }}>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScvTciz2SDzOsRxr17EjSSc6viOmdta4mlOuXmUH5ush5RwnA/viewform?usp=sharing" className="btn-pbi btn-blue" target="_blank" rel="noopener noreferrer">
                  Start with the Form
                </a>
                <a href="mailto:jordanlowe@passbyira.org" className="btn-pbi btn-outline-blue">
                  Email Jordan Lowe
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-eyebrow">Quick Reference</div>
            <h2 className="section-title">Summary Cards</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {sponsorshipLevels.map((level) => (
              <div key={level.name} className="involve-card">
                <div className="section-eyebrow" style={{ marginBottom: 0 }}>{level.amount}</div>
                <h3>{level.name}</h3>
                <p>{level.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function renderCampaignPage() {
  return (
    <>
      <PageHero
        eyebrow="Campaign"
        title="30 for 30 Campaign"
        lead="Support the 30 for 30 campaign and help sustain the outreach, advocacy, and community care at the heart of Pass by Ira's mission."
        imageSrc="/images/hero/volunteer-header.webp"
        imageAlt="30 for 30 campaign header"
      />

      <section className="section-shell">
        <div className="pbi-container">
          <div className="feature-card" style={{ textAlign: "center" }}>
            <p>
              The 30 for 30 campaign is a call to support the mission with generosity, visibility, and practical action. Every contribution helps strengthen outreach efforts and deepen community impact.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.85rem", flexWrap: "wrap", marginTop: "1rem" }}>
              <a href="https://givebutter.com/Give4Ira" className="btn-pbi btn-gold" target="_blank" rel="noopener noreferrer">Donate</a>
              <a href="mailto:events@passbyira.org" className="btn-pbi btn-outline-blue">Contact Events Team</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ContentRoutePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug.join("/");

  if (!STATIC_ROUTES.includes(key as (typeof STATIC_ROUTES)[number])) {
    notFound();
  }

  const board = boardData as BoardMember[];
  const boardMembers = board.filter((member) => member.group === "board");
  const boardAdvisors = board.filter((member) => member.group === "advisor");
  const { pillars } = programsData as { pillars: Pillar[] };

  switch (key) {
    case "about-3":
      return renderAboutPage();
    case "meet-the-team":
      return renderTeamPage(boardMembers, boardAdvisors);
    case "event":
      return renderProgramsPage(pillars);
    case "rest":
      return renderRestPage();
    case "past-events":
      return renderGalleryPage();
    case "support-us":
      return renderSupportPage();
    case "sign-up-to-volunteer":
      return renderVolunteerPage();
    case "donate":
      return renderDonatePage();
    case "sponsorship":
      return renderSponsorshipPage();
    case "contact":
      return renderContactPage();
    case "blog":
      return renderBlogPage();
    case "post/quarterly-newsletter-february-2025":
      return renderBlogPostPage(newsPosts[0]);
    case "post/special-edition-newsletter-coats-cocoa-2024-the-recap":
      return renderBlogPostPage(newsPosts[1]);
    case "post/quarterly-newsletter-november-2024":
      return renderBlogPostPage(newsPosts[2]);
    case "30-for-30-campaign":
      return renderCampaignPage();
    default:
      notFound();
  }
}
