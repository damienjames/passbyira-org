'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

const NAV_GROUPS = [
  {
    label: 'About',
    items: [
      { href: '/about-3', label: 'The Story of Ira' },
      { href: '/about-3#mission', label: 'Mission & Vision' },
      { href: '/about-3#values', label: 'Values' },
      { href: '/meet-the-team', label: 'Meet the Team' },
    ],
  },
  {
    label: 'Programs',
    items: [
      { href: '/event', label: 'Overview' },
      { href: '/event#outreach', label: 'Outreach' },
      { href: '/event#education', label: 'Education' },
      { href: '/event#advocacy', label: 'Advocacy' },
      { href: '/rest', label: 'REST Retreat' },
    ],
  },
  {
    label: 'Get Involved',
    items: [
      { href: '/support-us', label: 'Support Us' },
      { href: '/sign-up-to-volunteer', label: 'Volunteer' },
      { href: '/donate', label: 'Donate' },
      { href: '/sponsorship', label: 'Partnerships & Sponsorship' },
      { href: '/support-us#fundraise', label: 'Fundraise' },
      { href: '/support-us#advocate', label: 'Advocate for Change' },
      { href: '/support-us#planned-giving', label: 'Planned Giving' },
    ],
  },
  {
    label: 'Gallery',
    href: '/past-events',
  },
  {
    label: 'Connect',
    href: '/contact#connect',
  },
] as const;

type NavGroup = (typeof NAV_GROUPS)[number];
type DropdownGroup = NavGroup & { items: readonly ({ href: string; label: string; external?: boolean } | { group: string })[] };
type DirectGroup = { label: string; href: string; external?: boolean };

function isDropdown(g: NavGroup): g is DropdownGroup {
  return 'items' in g;
}

function isDirectLink(g: NavGroup): g is NavGroup & DirectGroup {
  return 'href' in g;
}

function isGroupLabel(item: { href?: string; label?: string; group?: string }): item is { group: string } {
  return 'group' in item && !('href' in item);
}

interface DropdownProps {
  group: DropdownGroup;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function Dropdown({ group, isOpen, onToggle, onClose }: DropdownProps) {
  const menuRef = useRef<HTMLUListElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <li className="nav-item" data-open={isOpen ? 'true' : undefined}>
      <button
        type="button"
        ref={btnRef}
        className="nav-toggle"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
      >
        {group.label}
        <span className="nav-caret" aria-hidden="true">▾</span>
      </button>
      <ul
        ref={menuRef}
        className={`dropdown-menu${isOpen ? ' is-open' : ''}`}
        role="menu"
      >
        {group.items.map((item, i) => {
          if (isGroupLabel(item)) {
            return <li key={i}><span className="dropdown-group-label">{item.group}</span></li>;
          }
          const linkProps = item.external
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {};
          return (
            <li key={i} role="none">
              <Link href={item.href} role="menuitem" onClick={onClose} {...linkProps}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export default function SiteNav() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeAll = useCallback(() => setOpenIndex(null), []);

  // Close dropdowns on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenIndex(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className="pbi-nav" role="banner">
        <div className="nav-container">
          {/* Brand */}
          <Link href="/" className="nav-brand" aria-label="Pass by Ira — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.webp"
              alt=""
              className="nav-brand-logotype"
              width={58}
              height={42}
              aria-hidden="true"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="nav-brand-name">Pass by Ira</span>
          </Link>

          {/* Desktop nav */}
          <ul className="nav-links-list" role="list">
            {NAV_GROUPS.map((group, i) => {
              if (isDropdown(group)) {
                return (
                  <Dropdown
                    key={group.label}
                    group={group}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                    onClose={closeAll}
                  />
                );
              }
              if (!isDirectLink(group)) return null;
              const linkProps = group.external
                ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                : {};
              return (
                <li key={group.label} className="nav-item">
                  <Link href={group.href} className="nav-link" onClick={closeAll} {...linkProps}>
                    {group.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href="https://givebutter.com/Give4Ira"
                className="nav-cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                Donate
              </a>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            type="button"
            className="hamburger-btn"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <rect x="2" y="5" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="10" width="18" height="2" rx="1" fill="currentColor" />
              <rect x="2" y="15" width="18" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <nav
        id="mobile-nav"
        className={`mobile-overlay${mobileOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-overlay-header">
          <Link
            href="/"
            className="nav-brand"
            onClick={() => setMobileOpen(false)}
            aria-label="Pass by Ira — Home"
          >
            <span className="nav-brand-name" style={{ fontSize: '1.2rem' }}>Pass by Ira</span>
          </Link>
          <button
            type="button"
            className="mobile-close-btn"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="mobile-nav-section">
          <span className="mobile-nav-section-label">About</span>
          <Link href="/about-3" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>The Story of Ira</Link>
          <Link href="/about-3#mission" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Mission &amp; Vision</Link>
          <Link href="/about-3#values" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Values</Link>
          <Link href="/meet-the-team" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Meet the Team</Link>
        </div>

        <div className="mobile-nav-section">
          <span className="mobile-nav-section-label">Programs</span>
          <Link href="/event" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Overview</Link>
          <Link href="/event#outreach" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Outreach</Link>
          <Link href="/event#education" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Education</Link>
          <Link href="/event#advocacy" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Advocacy</Link>
          <Link href="/rest" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>REST Retreat</Link>
        </div>

        <div className="mobile-nav-section">
          <span className="mobile-nav-section-label">Get Involved</span>
          <Link href="/support-us" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Support Us</Link>
          <Link href="/sign-up-to-volunteer" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Volunteer</Link>
          <Link href="/donate" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Donate</Link>
          <Link href="/sponsorship" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Partnerships &amp; Sponsorship</Link>
          <Link href="/support-us#fundraise" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Fundraise</Link>
          <Link href="/support-us#advocate" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Advocate</Link>
          <Link href="/support-us#planned-giving" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Planned Giving</Link>
        </div>

        <div className="mobile-nav-section">
          <span className="mobile-nav-section-label">More</span>
          <Link href="/past-events" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Gallery</Link>
          <Link href="/contact#connect" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Connect</Link>
          <Link href="/blog" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>News</Link>
        </div>

        <a
          href="https://givebutter.com/Give4Ira"
          className="mobile-nav-cta"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen(false)}
        >
          Donate Now
        </a>
      </nav>
    </>
  );
}
