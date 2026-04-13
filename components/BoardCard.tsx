"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

export interface BoardMember {
  group: "board" | "advisor";
  name: string;
  title: string;
  initials: string;
  bio: string;
  photo: string | null;
  email?: string;
  linkedinUrl?: string;
}

export default function BoardCard({ member }: { member: BoardMember }) {
  const panelId = useId();
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const syncViewportState = (matches: boolean) => {
      setIsMobile(matches);
      setIsExpanded(!matches);
    };

    syncViewportState(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncViewportState(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const showPanel = !isMobile || isExpanded;

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
        <div className="board-card__summary">
          <div className="board-card__summary-main">
            <h3 className="board-card__name">{member.name}</h3>
            <p className="board-card__role">{member.title}</p>
          </div>
          <button
            type="button"
            className="board-card__toggle"
            aria-expanded={showPanel}
            aria-controls={panelId}
            onClick={() => setIsExpanded((previousValue) => !previousValue)}
          >
            {showPanel ? "Hide bio" : "Read bio"}
          </button>
        </div>
        <div id={panelId} className="board-card__panel" hidden={!showPanel}>
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
      </div>
    </article>
  );
}
