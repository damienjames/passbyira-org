import Image from "next/image";
import Link from "next/link";

import siteSettings from "@/content/site/settings.json";

const actionLinks = [
  { label: "Donate", href: siteSettings.donateUrl, external: true },
  { label: "Volunteer", href: siteSettings.volunteerUrl, external: true },
  { label: "Partner or sponsor", href: "/sponsorship", external: false },
  { label: "Current needs", href: "/support-us", external: false },
] as const;

export default function Footer() {
  return (
    <footer className="pb-footer">
      <div className="pb-shell pb-footer__grid">
        <div className="pb-footer__brand">
          <Link href="/" aria-label="Pass by Ira home">
            <Image
              src={siteSettings.logo}
              alt="Pass by Ira"
              width={504}
              height={364}
              sizes="180px"
            />
          </Link>
          <p>
            A 501(c)(3) nonprofit working to eradicate homelessness through outreach,
            education, and advocacy across Dallas–Fort Worth.
          </p>
        </div>

        <nav className="pb-footer__column" aria-label="Explore">
          <h2>Explore</h2>
          <ul>
            {siteSettings.primaryNavigation.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>

        <nav className="pb-footer__column" aria-label="Take action">
          <h2>Take action</h2>
          <ul>
            {actionLinks.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label} ↗</a>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="pb-footer__column pb-footer__contact">
          <h2>Connect</h2>
          <a href={`mailto:${siteSettings.contact.generalEmail}`}>{siteSettings.contact.generalEmail}</a>
          <a href={`mailto:${siteSettings.contact.eventsEmail}`}>{siteSettings.contact.eventsEmail}</a>
          <a href={`mailto:${siteSettings.contact.donationsEmail}`}>{siteSettings.contact.donationsEmail}</a>
          <div className="pb-footer__social" aria-label="Social media">
            <a href={siteSettings.social.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href={siteSettings.social.facebook} target="_blank" rel="noopener noreferrer">Facebook ↗</a>
            <a href={siteSettings.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </div>

      <div className="pb-shell pb-footer__bottom">
        <span>© {new Date().getFullYear()} Pass by Ira</span>
        <span>EIN {siteSettings.contact.ein}</span>
        <span>{siteSettings.contact.location}</span>
      </div>
    </footer>
  );
}
