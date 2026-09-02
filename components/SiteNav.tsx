"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import siteSettings from "@/content/site/settings.json";

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab") return;
      const drawer = document.getElementById("mobile-site-menu");
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <header className="pb-site-header">
      <div className="pb-site-header__inner">
        <Link href="/" className="pb-site-brand" aria-label="Pass by Ira home">
          <Image
            src={siteSettings.logo}
            alt="Pass by Ira"
            width={504}
            height={364}
            priority
            sizes="(max-width: 760px) 88px, 118px"
          />
        </Link>

        <nav className="pb-desktop-nav" aria-label="Primary navigation">
          <ul>
            {siteSettings.primaryNavigation.map((item) => {
              const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          className="pb-header-donate"
          href={siteSettings.donateUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate <span aria-hidden="true">↗</span>
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="pb-menu-trigger"
          aria-expanded={menuOpen}
          aria-controls="mobile-site-menu"
          aria-label="Open site menu"
          onClick={() => setMenuOpen(true)}
        >
          <span>Menu</span>
          <span className="pb-menu-trigger__icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div
        id="mobile-site-menu"
        className={`pb-mobile-menu${menuOpen ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
      >
        <div className="pb-mobile-menu__top">
          <Link href="/" className="pb-mobile-menu__brand" onClick={() => closeMenu()}>
            <Image src={siteSettings.logo} alt="Pass by Ira" width={504} height={364} sizes="120px" />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="pb-mobile-menu__close"
            aria-label="Close site menu"
            onClick={() => closeMenu(true)}
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="pb-mobile-menu__nav" aria-label="Mobile navigation">
          <ol>
            {siteSettings.primaryNavigation.map((item, index) => {
              const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <span>0{index + 1}</span>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => closeMenu()}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="pb-mobile-menu__actions">
          <a href={siteSettings.donateUrl} target="_blank" rel="noopener noreferrer">
            Donate now <span aria-hidden="true">↗</span>
          </a>
          <a href={siteSettings.volunteerUrl} target="_blank" rel="noopener noreferrer">
            Volunteer <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="pb-mobile-menu__footer">
          <a href={`mailto:${siteSettings.contact.generalEmail}`}>{siteSettings.contact.generalEmail}</a>
          <span>{siteSettings.contact.location}</span>
        </div>
      </div>
    </header>
  );
}
