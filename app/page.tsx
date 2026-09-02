import Image from "next/image";
import Link from "next/link";

import CampaignPromotion from "@/components/CampaignPromotion";
import homeContent from "@/content/pages/home.json";
import siteSettings from "@/content/site/settings.json";
import coatsAndCocoa from "@/content/events/coats-and-cocoa.json";
import restRetreat from "@/content/events/rest-retreat.json";
import thanksgivingDinner from "@/content/events/thanksgiving-dinner.json";
import programsData from "@/data/programs.json";

const featuredEvents = [coatsAndCocoa, thanksgivingDinner, restRetreat].sort(
  (a, b) => a.order - b.order,
);

const actionLinks = [
  {
    label: "Give",
    description: "Fund direct outreach and long-term change.",
    href: siteSettings.donateUrl,
    external: true,
  },
  {
    label: "Volunteer",
    description: "Bring your time, care, or professional skills.",
    href: siteSettings.volunteerUrl,
    external: true,
  },
  {
    label: "Partner",
    description: "Sponsor, advertise, or contribute in kind.",
    href: "/sponsorship",
    external: false,
  },
  {
    label: "Learn",
    description: "Understand the mission and share it forward.",
    href: "/about-3",
    external: false,
  },
] as const;

export default function HomePage() {
  const { hero, mission, currentNeed, programsIntro, story, eventsIntro, finalCta } = homeContent;
  const { pillars } = programsData;

  return (
    <div className="pb-home">
      <section className="pb-home-hero" aria-labelledby="home-heading">
        <div className="pb-shell pb-home-hero__grid">
          <div className="pb-home-hero__copy">
            <p className="pb-kicker">{hero.eyebrow}</p>
            <h1 id="home-heading">{hero.title}</h1>
            <p className="pb-home-hero__lead">{hero.lead}</p>
            <div className="pb-button-row">
              <a
                className="pb-button pb-button--dark"
                href={siteSettings.donateUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate to the mission <span aria-hidden="true">↗</span>
              </a>
              <a
                className="pb-button pb-button--line"
                href={siteSettings.volunteerUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Volunteer <span aria-hidden="true">↗</span>
              </a>
            </div>
            <p className="pb-home-hero__note">
              501(c)(3) nonprofit <span aria-hidden="true">·</span> Serving the Dallas–Fort Worth Metroplex
            </p>
          </div>

          <div className="pb-home-hero__visual">
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              width={1470}
              height={1065}
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
            <div className="pb-home-hero__logo-card" aria-label="Pass by Ira">
              <Image
                src={siteSettings.logo}
                alt="Pass by Ira — skyline, home, fork, and spoon logo"
                width={504}
                height={364}
                priority
                sizes="(max-width: 600px) 190px, 260px"
              />
            </div>
            <div className="pb-home-hero__caption">
              <span>Dallas–Fort Worth</span>
              <strong>Care that shows up.</strong>
            </div>
          </div>
        </div>
      </section>

      <nav className="pb-action-strip" aria-label="Ways to support Pass by Ira">
        <div className="pb-shell pb-action-strip__grid">
          {actionLinks.map((action, index) => {
            const content = (
              <>
                <span className="pb-action-strip__number">0{index + 1}</span>
                <span>
                  <strong>{action.label}</strong>
                  <small>{action.description}</small>
                </span>
                <span className="pb-action-strip__arrow" aria-hidden="true">↗</span>
              </>
            );

            return action.external ? (
              <a key={action.label} href={action.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <Link key={action.label} href={action.href}>
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      <CampaignPromotion />

      <section className="pb-section pb-mission" aria-labelledby="mission-heading">
        <div className="pb-shell pb-mission__grid">
          <div>
            <p className="pb-kicker">{mission.eyebrow}</p>
            <h2 id="mission-heading">{mission.title}</h2>
          </div>
          <div className="pb-mission__statement">
            <p>{mission.body}</p>
            <blockquote>“{mission.quote}”</blockquote>
            <Link className="pb-text-link" href="/about-3">
              Read Ira&apos;s story <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-section pb-current" aria-labelledby="current-heading">
        <div className="pb-shell pb-current__grid">
          <div className="pb-current__media">
            <Image
              src={currentNeed.image}
              alt={currentNeed.imageAlt}
              width={1470}
              height={744}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <span>Direct outreach, DFW</span>
          </div>
          <div className="pb-current__copy">
            <p className="pb-kicker">{currentNeed.eyebrow}</p>
            <h2 id="current-heading">{currentNeed.title}</h2>
            <p>{currentNeed.body}</p>
            <ul className="pb-need-list">
              {currentNeed.items.map((item) => (
                <li key={item}><span aria-hidden="true">+</span>{item}</li>
              ))}
            </ul>
            <div className="pb-button-row">
              <a className="pb-button pb-button--dark" href={`mailto:${siteSettings.contact.donationsEmail}`}>
                Arrange a donation
              </a>
              <Link className="pb-button pb-button--line" href="/support-us">
                All ways to help
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-section pb-programs" aria-labelledby="programs-heading">
        <div className="pb-shell">
          <div className="pb-section-heading">
            <p className="pb-kicker">{programsIntro.eyebrow}</p>
            <h2 id="programs-heading">{programsIntro.title}</h2>
            <p>{programsIntro.body}</p>
          </div>
          <div className="pb-program-grid">
            {pillars.map((pillar, index) => (
              <article className="pb-program-card" key={pillar.id}>
                <div className="pb-program-card__topline">
                  <span>0{index + 1}</span>
                  <span>{pillar.label}</span>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <ul>
                  {pillar.programs.map((program) => (
                    <li key={program.name}>{program.name}</li>
                  ))}
                </ul>
                <Link href={`/event#${pillar.id}`}>
                  Explore {pillar.label.toLowerCase()} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-section pb-origin" aria-labelledby="origin-heading">
        <div className="pb-shell pb-origin__grid">
          <div className="pb-origin__copy">
            <p className="pb-kicker">{story.eyebrow}</p>
            <h2 id="origin-heading">{story.title}</h2>
            <p>{story.body}</p>
            <Link className="pb-text-link pb-text-link--light" href="/about-3">
              Meet Pass by Ira <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="pb-origin__media">
            <Image
              src={story.image}
              alt={story.imageAlt}
              width={1130}
              height={1505}
              sizes="(max-width: 900px) 100vw, 44vw"
            />
          </div>
        </div>
      </section>

      <section className="pb-section pb-events" aria-labelledby="events-heading">
        <div className="pb-shell">
          <div className="pb-section-heading pb-section-heading--split">
            <div>
              <p className="pb-kicker">{eventsIntro.eyebrow}</p>
              <h2 id="events-heading">{eventsIntro.title}</h2>
            </div>
            <div>
              <p>{eventsIntro.body}</p>
              <Link className="pb-text-link" href="/past-events">
                View every event <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="pb-event-grid">
            {featuredEvents.map((event, index) => (
              <article className={`pb-event-card${index === 0 ? " pb-event-card--feature" : ""}`} key={event.title}>
                <Link href={event.href} aria-label={`${event.ctaLabel}: ${event.title}`}>
                  <div className="pb-event-card__media">
                    <Image
                      src={event.image}
                      alt={event.imageAlt}
                      width={1215}
                      height={890}
                      sizes={index === 0 ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 100vw, 25vw"}
                    />
                  </div>
                  <div className="pb-event-card__body">
                    <span>{event.category}</span>
                    <h3>{event.title}</h3>
                    <p>{event.summary}</p>
                    <strong>{event.ctaLabel} <span aria-hidden="true">→</span></strong>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-final-cta" aria-labelledby="final-cta-heading">
        <div className="pb-shell pb-final-cta__grid">
          <div>
            <p className="pb-kicker">{finalCta.eyebrow}</p>
            <h2 id="final-cta-heading">{finalCta.title}</h2>
          </div>
          <div>
            <p>{finalCta.body}</p>
            <div className="pb-button-row">
              <a className="pb-button pb-button--light" href={siteSettings.donateUrl} target="_blank" rel="noopener noreferrer">
                Donate now <span aria-hidden="true">↗</span>
              </a>
              <a className="pb-button pb-button--line-light" href={siteSettings.volunteerUrl} target="_blank" rel="noopener noreferrer">
                Volunteer <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
