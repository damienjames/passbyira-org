"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const DOCK_ITEMS = [
  {
    label: "Programs",
    href: "/event",
    kind: "internal",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.75C4 4.78 4.78 4 5.75 4H18.25C19.22 4 20 4.78 20 5.75V18.25C20 19.22 19.22 20 18.25 20H5.75C4.78 20 4 19.22 4 18.25V5.75ZM7 8.25C7 8.66 7.34 9 7.75 9H16.25C16.66 9 17 8.66 17 8.25C17 7.84 16.66 7.5 16.25 7.5H7.75C7.34 7.5 7 7.84 7 8.25ZM7.75 12.75H11.25C11.66 12.75 12 12.41 12 12C12 11.59 11.66 11.25 11.25 11.25H7.75C7.34 11.25 7 11.59 7 12C7 12.41 7.34 12.75 7.75 12.75ZM7.75 16.5H14.25C14.66 16.5 15 16.16 15 15.75C15 15.34 14.66 15 14.25 15H7.75C7.34 15 7 15.34 7 15.75C7 16.16 7.34 16.5 7.75 16.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Volunteer",
    href: "https://forms.gle/6R56X5v6z9dCuvWS9",
    kind: "external",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21C11.74 21 11.49 20.9 11.29 20.71L4.94 14.56C3.08 12.75 3.02 9.74 4.81 7.87C6.56 6.04 9.49 5.96 11.35 7.68L12 8.28L12.65 7.68C14.51 5.96 17.44 6.04 19.19 7.87C20.98 9.74 20.92 12.75 19.06 14.56L12.71 20.71C12.51 20.9 12.26 21 12 21ZM7.99 7.75C7.06 7.75 6.13 8.11 5.44 8.83C4.22 10.11 4.26 12.16 5.54 13.41L12 19.67L18.46 13.41C19.74 12.16 19.78 10.11 18.56 8.83C17.35 7.57 15.33 7.51 14.05 8.7L12.51 10.13C12.22 10.39 11.78 10.39 11.49 10.13L9.95 8.7C9.4 8.19 8.69 7.75 7.99 7.75Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Donate",
    href: "https://givebutter.com/Give4Ira",
    kind: "external",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3C9.24 3 7 5.24 7 8C7 9.61 7.76 11.04 8.94 11.95C6.09 12.9 4 15.58 4 18.75C4 19.16 4.34 19.5 4.75 19.5H19.25C19.66 19.5 20 19.16 20 18.75C20 15.58 17.91 12.9 15.06 11.95C16.24 11.04 17 9.61 17 8C17 5.24 14.76 3 12 3ZM12 4.5C13.93 4.5 15.5 6.07 15.5 8C15.5 9.93 13.93 11.5 12 11.5C10.07 11.5 8.5 9.93 8.5 8C8.5 6.07 10.07 4.5 12 4.5ZM5.58 18C5.95 15.33 8.25 13.25 11 13.05V15.25H9.75C9.34 15.25 9 15.59 9 16C9 16.41 9.34 16.75 9.75 16.75H11V18H5.58ZM12.5 18V16.75H13.75C14.16 16.75 14.5 16.41 14.5 16C14.5 15.59 14.16 15.25 13.75 15.25H12.5V13.05C15.25 13.25 17.55 15.33 17.92 18H12.5Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Connect",
    href: "/contact#connect",
    kind: "internal",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.75 5H19.25C20.22 5 21 5.78 21 6.75V17.25C21 18.22 20.22 19 19.25 19H4.75C3.78 19 3 18.22 3 17.25V6.75C3 5.78 3.78 5 4.75 5ZM4.5 7.32V17.25C4.5 17.39 4.61 17.5 4.75 17.5H19.25C19.39 17.5 19.5 17.39 19.5 17.25V7.32L12.48 12.58C12.21 12.79 11.79 12.79 11.52 12.58L4.5 7.32ZM18.77 6.5H5.23L12 11.58L18.77 6.5Z" fill="currentColor" />
      </svg>
    ),
  },
] as const;

export default function MobileDock() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const showAfterIdle = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        setHidden(false);
      }, 1500);
    };

    const handleScroll = () => {
      setHidden(true);
      showAfterIdle();
    };

    showAfterIdle();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <nav
      className={`mobile-dock${hidden ? " is-hidden" : ""}`}
      aria-label="Mobile quick actions"
    >
      <div className="mobile-dock__inner">
        {DOCK_ITEMS.map((item) => {
          const isCurrent = item.kind === "internal" && pathname === item.href.split("#")[0];
          const isAccent = item.label === "Donate";
          const content = (
            <>
              <span className="mobile-dock__icon">{item.icon}</span>
              <span className="mobile-dock__label">{item.label}</span>
            </>
          );

          if (item.kind === "internal") {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`mobile-dock__action${isAccent ? " mobile-dock__action--accent" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              className={`mobile-dock__action${isAccent ? " mobile-dock__action--accent" : ""}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        })}
      </div>
    </nav>
  );
}