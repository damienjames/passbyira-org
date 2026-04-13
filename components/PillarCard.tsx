"use client";

import { useEffect, useId, useState } from "react";

export interface Program {
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

export interface Pillar {
  id: string;
  label: string;
  title: string;
  description: string;
  programs: Program[];
}

export default function PillarCard({
  pillar,
  defaultExpandedMobile = false,
}: {
  pillar: Pillar;
  defaultExpandedMobile?: boolean;
}) {
  const panelId = useId();
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncViewportState = (matches: boolean) => {
      setIsMobile(matches);
      setIsExpanded(matches ? defaultExpandedMobile : true);
    };

    syncViewportState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncViewportState(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [defaultExpandedMobile]);

  const showPrograms = !isMobile || isExpanded;

  return (
    <article className="pillar-card">
      <div className="pillar-card__header">
        <span className="section-eyebrow">{pillar.label}</span>
        <h3>{pillar.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.9rem", marginTop: "0.5rem", lineHeight: 1.6 }}>
          {pillar.description}
        </p>
        <button
          type="button"
          className="pillar-card__toggle"
          aria-expanded={showPrograms}
          aria-controls={panelId}
          onClick={() => setIsExpanded((previousValue) => !previousValue)}
        >
          {showPrograms ? "Hide programs" : "Show programs"}
        </button>
      </div>
      <div id={panelId} className="pillar-card__body" hidden={!showPrograms}>
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
