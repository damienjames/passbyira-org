import Image from "next/image";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
import boardData from "@/data/board.json";
import programsData from "@/data/programs.json";
import { siteImages } from "@/data/site-content";

// ─── Types ────────────────────────────────────────────────────
interface BoardMember {
  group: "board" | "advisor";
  name: string;
  title: string;
  initials: string;
  bio: string;
  photo: string | null;
  email?: string;
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

const homepageEventSpotlights = [
  {
    eyebrow: "Featured Event",
    title: "2024 Team Retreat",
    body:
      "Recharge. Elevate. Strategize. Transform. The 2024 Team Retreat reflects Pass by Ira's REST experience for nonprofit, small business, and community leaders building lasting impact across DFW.",
    meta: ["Leadership retreat", "Community partnerships", "Sponsor and advertise"],
    imageSrc: "/images/gallery/wix-archive/021-4db8fe_ab01646ecc6d448d91676b695327ddbe-mv2.webp",
    imageAlt: "REST Retreat speaker leading a session with attendees",
    primaryHref: "/rest",
    primaryLabel: "Explore REST",
    secondaryHref: "/sponsorship",
    secondaryLabel: "Sponsor the Event",
    secondaryExternal: false,
  },
  {
    eyebrow: "Signature Outreach",
    title: "2023 Thanksgiving Dinner",
    body:
      "The 2023 Thanksgiving Dinner gallery captures a SERVE outreach tradition: preparing and sharing warm meals with neighbors across the Dallas–Fort Worth Metroplex through consistent, dignity-centered care.",
    meta: ["Meal preparation", "Direct outreach", "Volunteer-driven"],
    imageSrc: "/images/gallery/wix-archive/008-129b3c_6c4307da023f42f2b365003f5e8dff40-mv2.webp",
    imageAlt: "Pass by Ira volunteer delivering a meal during outreach",
    primaryHref: "/event#outreach",
    primaryLabel: "View SERVE Programs",
    secondaryHref: "https://forms.gle/6R56X5v6z9dCuvWS9",
    secondaryLabel: "Volunteer for Thanksgiving",
    secondaryExternal: true,
  },
] as const;

// ─── Component: Board Card ─────────────────────────────────────
function BoardCard({ member }: { member: BoardMember }) {
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
        <div className="board-card__initials" aria-hidden="true">
          {member.initials}
        </div>
      )}
      <div className="board-card__body">
        <h3 className="board-card__name">{member.name}</h3>
        <p className="board-card__role">{member.title}</p>
        <p className="board-card__bio">{member.bio}</p>
        {member.linkedinUrl ? (
          <div className="board-card__actions">
            <a
              href={member.linkedinUrl}
              className="board-card__linkedin"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${member.name} on LinkedIn`}
              title="LinkedIn"
            >
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

// ─── Component: Pillar Card ────────────────────────────────────
function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <article className="pillar-card">
      <div className="pillar-card__header">
        <span className="section-eyebrow">{pillar.label}</span>
        <h3>{pillar.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.9rem", marginTop: "0.5rem", lineHeight: 1.6 }}>
          {pillar.description}
        </p>
      </div>
      <div className="pillar-card__body">
        {pillar.programs.map((program) => (
          <div key={program.name} className="program-item">
            <h4>
              <span aria-hidden="true" style={{ marginRight: "0.4rem" }}>{program.icon}</span>
              {program.name}
              {program.comingSoon && (
                <span style={{
                  display: "inline-block",
                  marginLeft: "0.5rem",
                  fontSize: "0.7rem",
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--color-pbi-accent-strong)",
                  border: "1px solid rgba(201,162,39,0.4)",
                  borderRadius: "999px",
                  padding: "0.1rem 0.5rem",
                }}>
                  Coming Soon
                </span>
              )}
            </h4>
            <p>{program.description}</p>
            {program.volunteerUrl && (
              <a
                href={program.volunteerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "var(--color-pbi-primary)",
                  textDecoration: "none",
                  marginTop: "0.25rem",
                }}
              >
                Sign up to volunteer →
              </a>
            )}
            {program.hashtag && (
              <span style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                  color: "var(--color-pbi-accent-strong)",
              }}>
                {program.hashtag}
              </span>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  const board = boardData as BoardMember[];
  const boardMembers = board.filter((member) => member.group === "board");
  const boardAdvisors = board.filter((member) => member.group === "advisor");
  const { pillars } = programsData as { pillars: Pillar[] };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pbi-hero" aria-label="Hero">
        <div
          className="pbi-hero-bg"
          style={{
            // Replace with a local hero asset later if desired.
            ["--hero-img" as string]: `url('/images/hero/home-hero.webp')`,
          }}
          aria-hidden="true"
        />
        <div className="pbi-hero-content">
          <div className="hero-eyebrow">#IRAdicateHomelessness · DFW Metroplex</div>
          <h1>
            Eradicating homelessness by increasing access to{" "}
            <em>basic human rights</em>.
          </h1>
          <p className="hero-lead">
            Safe shelter, healthy food, clean water, quality education, healthcare, and
            a livable income — these are not privileges. Pass by Ira works to make them
            a reality for every person in the Dallas–Fort Worth Metroplex.
          </p>
          <div className="hero-cta-group">
            <a
              href="https://givebutter.com/Give4Ira"
              className="btn-pbi btn-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate Now
            </a>
            <a
              href="https://forms.gle/6R56X5v6z9dCuvWS9"
              className="btn-pbi btn-outline-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Volunteer with Us
            </a>
          </div>
          <div className="hero-stats" aria-label="Homelessness statistics">
            <div className="hero-stat">
              <strong>4,244+</strong>
              <span>Unhoused individuals in Dallas &amp; Collin Counties (2023)</span>
            </div>
            <div className="hero-stat">
              <strong>2,390+</strong>
              <span>Experiencing homelessness in Fort Worth (Jan 2024)</span>
            </div>
            <div className="hero-stat">
              <strong>28%</strong>
              <span>Living completely unsheltered — in places not meant for human habitation</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats banner ─────────────────────────────────────── */}
      <div className="stats-banner" aria-label="Organization facts">
        <div className="pbi-container">
          <div className="stats-banner-grid">
            <div className="stats-banner-item">
              <strong>501(c)(3)</strong>
              <span>Registered nonprofit organization</span>
            </div>
            <div className="stats-banner-item">
              <strong>3</strong>
              <span>Program pillars: Outreach, Education, Advocacy</span>
            </div>
            <div className="stats-banner-item">
              <strong>DFW</strong>
              <span>Serving the Dallas–Fort Worth Metroplex</span>
            </div>
            <div className="stats-banner-item">
              <strong>Year-Round</strong>
              <span>Active programs every season of the year</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mission & Vision ─────────────────────────────────── */}
      <section className="section-shell section-alt" id="mission" aria-labelledby="mission-heading">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-eyebrow">Who We Are</div>
            <h2 id="mission-heading" className="section-title">Our Mission &amp; Vision</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <div className="feature-card">
              <div className="section-eyebrow">Mission</div>
              <h3>Why We Exist</h3>
              <p>
                Our mission is to eradicate homelessness by increasing access to basic
                human rights — including safe shelter, healthy food, clean water, quality
                education, healthcare, and a livable income.
              </p>
            </div>
            <div className="feature-card">
              <div className="section-eyebrow">Vision</div>
              <h3>What We Work Toward</h3>
              <p>
                We envision a world where no one is unseen, underserved, or without a
                place to call home — a future built on dignity, equity, and community.
              </p>
            </div>
            <div className="feature-card">
              <div className="section-eyebrow">Our Approach</div>
              <h3>How We Do It</h3>
              <p>
                Pass by Ira works through three interconnected pillars: direct{" "}
                <strong>Outreach</strong> to meet immediate needs, community{" "}
                <strong>Education</strong> to reduce stigma and shift narratives, and
                systemic <strong>Advocacy</strong> to drive lasting policy change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Events spotlight ─────────────────────────────────── */}
      <section className="section-shell" id="events" aria-labelledby="events-heading">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-eyebrow">Events</div>
            <h2 id="events-heading" className="section-title">Events That Bring the Mission to Life</h2>
            <p className="section-lead" style={{ margin: "0 auto" }}>
              From leadership development to direct outreach, these gatherings show how Pass by Ira turns care, partnership, and action into real community impact.
            </p>
          </div>

          <div style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem" }}>
            {homepageEventSpotlights.map((event, index) => (
              <article
                key={event.title}
                className="feature-card home-event-card"
                style={{
                  display: "grid",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <div style={{ order: index % 2 === 0 ? 0 : 1 }}>
                  <div className="section-eyebrow">{event.eyebrow}</div>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", fontSize: "clamp(1.6rem, 2vw, 2rem)" }}>{event.title}</h3>
                  <p style={{ marginBottom: "1.1rem" }}>{event.body}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "1.25rem" }}>
                    {event.meta.map((item) => (
                      <span
                        key={item}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.42rem 0.8rem",
                          borderRadius: "999px",
                          background: "rgba(201, 162, 39, 0.12)",
                          border: "1px solid rgba(122, 90, 67, 0.18)",
                          color: "var(--color-pbi-primary-dark)",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
                    <Link href={event.primaryHref} className="btn-pbi btn-blue">
                      {event.primaryLabel}
                    </Link>
                    {event.secondaryExternal ? (
                      <a
                        href={event.secondaryHref}
                        className="btn-pbi btn-outline-blue"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {event.secondaryLabel}
                      </a>
                    ) : (
                      <Link href={event.secondaryHref} className="btn-pbi btn-outline-blue">
                        {event.secondaryLabel}
                      </Link>
                    )}
                  </div>
                </div>

                <div
                  className="gallery-item home-event-card__media"
                  style={{
                    order: index % 2 === 0 ? 1 : 0,
                    aspectRatio: "16 / 11",
                    minHeight: "320px",
                    borderRadius: "24px",
                  }}
                >
                  <Image
                    src={event.imageSrc}
                    alt={event.imageAlt}
                    width={1215}
                    height={890}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="home-events-footer">
            <p className="section-lead" style={{ margin: 0 }}>
              Looking for the full archive? Explore event photos, outreach moments, and team gatherings in one place.
            </p>
            <Link href="/past-events" className="btn-pbi btn-outline-blue">
              View Full Event Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── Programs ─────────────────────────────────────────── */}
      <section className="section-shell section-alt" id="programs" aria-labelledby="programs-heading">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-eyebrow">What We Do</div>
            <h2 id="programs-heading" className="section-title">Our Programs</h2>
            <p className="section-lead" style={{ margin: "0 auto" }}>
              Built around three pillars — Outreach, Education, and Advocacy — our programs
              make the vision of a home for every person a concrete, measurable reality
              across the DFW Metroplex.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {pillars.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a
              href="https://forms.gle/6R56X5v6z9dCuvWS9"
              className="btn-pbi btn-blue"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sign Up to Volunteer at Our Next Event
            </a>
          </div>
        </div>
      </section>

      {/* ── Why Support Section ──────────────────────────────── */}
      <section className="section-shell" aria-labelledby="support-heading">
        <div className="pbi-container">
          <div className="responsive-split responsive-split--wide responsive-split--center" style={{ gap: "2rem" }}>
            <div>
              <div className="section-eyebrow">Why It Matters</div>
              <h2 id="support-heading" className="section-title">
                Why Your Support Matters
              </h2>
              <p className="section-lead" style={{ marginBottom: "1.5rem" }}>
                Homelessness is a public health issue, a housing issue, and a systems issue. Meeting immediate needs matters, and so does building long-term pathways toward stability, dignity, and belonging.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  "Provide meals and access to basic necessities",
                  "Connect people with community resources",
                  "Build public understanding and reduce stigma",
                  "Support advocacy for long-term change",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.95rem", color: "var(--color-pbi-muted)", lineHeight: 1.55 }}>
                    <span style={{ color: "var(--color-pbi-accent-strong)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem" }}>
                <a
                  href="https://givebutter.com/Give4Ira"
                  className="btn-pbi btn-gold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Donate
                </a>
                <Link
                  href="/support-us"
                  className="btn-pbi btn-outline-blue"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="gallery-item home-support-card__media" style={{ borderRadius: "22px", aspectRatio: "3/4", minHeight: "420px" }}>
              <Image
                src={siteImages.homeSupport.src}
                alt={siteImages.homeSupport.alt}
                width={1130}
                height={1505}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Board ─────────────────────────────────────────────── */}
      <section className="section-shell" id="board" aria-labelledby="board-heading">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-eyebrow">Leadership</div>
            <h2 id="board-heading" className="section-title">The Board of Directors</h2>
            <p className="section-lead" style={{ margin: "0 auto" }}>
              Our board brings together diverse expertise from nonprofit, corporate, and
              community leadership to guide Pass by Ira&apos;s mission and ensure its impact.
            </p>
          </div>
          <div className="board-sections">
            <div className="board-subsection">
              <div className="board-subsection__header">
                <h3 className="board-subsection__title">Board Members</h3>
                <p className="board-subsection__copy">
                  Current officers, founders, and general members serving on the board.
                </p>
              </div>
              <div className="board-grid board-grid--leadership">
                {boardMembers.map((member) => (
                  <BoardCard key={member.name + member.title} member={member} />
                ))}
              </div>
            </div>
            {boardAdvisors.length ? (
              <div className="board-subsection">
                <div className="board-subsection__header">
                  <h3 className="board-subsection__title">Board Advisors</h3>
                  <p className="board-subsection__copy">
                    Advisors who help strengthen strategy, care, and long-term community partnerships.
                  </p>
                </div>
                <div className="board-grid board-grid--leadership">
                  {boardAdvisors.map((member) => (
                    <BoardCard key={member.name + member.title} member={member} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.85rem", color: "var(--color-pbi-muted)" }}>
            Board member profiles are updated as new members join. Contact{" "}
            <a href="mailto:connect@passbyira.org" style={{ color: "var(--color-pbi-primary)", fontWeight: 600 }}>
              connect@passbyira.org
            </a>{" "}
            for inquiries.
          </p>
        </div>
      </section>

      {/* ── Get Involved ─────────────────────────────────────── */}
      <section className="section-shell" id="get-involved" aria-labelledby="involve-heading">
        <div className="pbi-container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-eyebrow">Take Action</div>
            <h2 id="involve-heading" className="section-title">Ways to Get Involved</h2>
            <p className="section-lead" style={{ margin: "0 auto" }}>
              There are many ways to support our mission — from a one-time gift to raising
              your voice in your community.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.25rem" }}>
            {[
              {
                icon: "💛",
                title: "Donate",
                body: "Your financial contribution powers every program — from meals delivered to voices amplified. One-time, monthly, or in-kind.",
                href: "https://givebutter.com/Give4Ira",
                cta: "Donate Now",
                external: true,
              },
              {
                icon: "🤲",
                title: "Volunteer",
                body: "Join us at our next outreach event and make a direct difference in your community. All skill levels welcome.",
                href: "https://forms.gle/6R56X5v6z9dCuvWS9",
                cta: "Sign Up",
                external: true,
              },
              {
                icon: "📢",
                title: "Fundraise",
                body: "Celebrate a birthday or holiday by encouraging donations. Check if your employer matches gifts to nonprofits.",
                href: "/support-us#fundraise",
                cta: "Learn How",
                external: false,
              },
              {
                icon: "🗣️",
                title: "Advocate",
                body: "Share our mission, contact local officials, and host awareness events. Your voice drives systemic change.",
                href: "/support-us#advocate",
                cta: "Start Advocating",
                external: false,
              },
              {
                icon: "🏢",
                title: "Sponsor / Advertise",
                body: "Partner with Pass by Ira through sponsorships, advertising, in-kind support, and employee engagement opportunities.",
                href: "/sponsorship",
                cta: "View Opportunities",
                external: false,
              },
              {
                icon: "🏛️",
                title: "Planned Giving",
                body: "Leave a lasting legacy by including Pass by Ira in your estate planning. Your gift ensures our work continues for years to come.",
                href: "mailto:jordanlowe@passbyira.org",
                cta: "Contact Jordan Lowe",
                external: false,
              },
            ].map((card) => (
              <div key={card.title} className="involve-card">
                <div className="involve-card__icon" aria-hidden="true">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <a
                  href={card.href}
                  className="btn-pbi btn-outline-blue"
                  style={{ marginTop: "auto", alignSelf: "flex-start", padding: "0.55rem 1.25rem", fontSize: "0.88rem" }}
                  {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {card.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Donate CTA band ──────────────────────────────────── */}
      <section className="cta-band" aria-labelledby="cta-heading">
        <div className="pbi-container">
          <div className="section-eyebrow" style={{ color: "var(--color-pbi-accent-soft)", background: "rgba(255,255,255,0.1)", borderColor: "rgba(201,162,39,0.45)" }}>
            Make an Impact Today
          </div>
          <h2 id="cta-heading">
            No one should be unseen,<br />underserved, or without a home.
          </h2>
          <p>
            Every contribution — financial, material, or in time — moves us closer to
            a DFW Metroplex where homelessness is the exception, not the norm.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem" }}>
            <a
              href="https://givebutter.com/Give4Ira"
              className="btn-pbi btn-gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Donate via GiveButter
            </a>
            <a
              href="https://forms.gle/6R56X5v6z9dCuvWS9"
              className="btn-pbi btn-outline-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Volunteer
            </a>
          </div>
        </div>
      </section>

      {/* ── Newsletter & Connect ────────────────────────────── */}
      <section className="newsletter-section" id="connect" aria-labelledby="newsletter-heading">
          <div className="pbi-container" style={{ maxWidth: "760px" }}>
            <div className="section-eyebrow">Stay Connected</div>
            <h2 id="newsletter-heading" className="section-title">Subscribe to Our Newsletter</h2>
            <p className="section-lead" style={{ margin: "0 auto 2rem" }}>
              Get the latest updates on programs, events, and ways to get involved —
              delivered straight to your inbox.
            </p>
            <InquiryForm kind="newsletter" />
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1.5rem" }}>
              <Link
                href="/blog"
                className="btn-pbi btn-blue"
              >
                View News &amp; Newsletter Posts
              </Link>
            </div>
          </div>
        </section>
      </>
  );
}
