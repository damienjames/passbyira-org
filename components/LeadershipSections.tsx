"use client";

import { useEffect, useId, useState } from "react";

import BoardCard, { type BoardMember } from "@/components/BoardCard";

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const MOBILE_VISIBLE_CARD_COUNT = 2;

interface LeadershipSectionsProps {
  boardMembers: BoardMember[];
  boardAdvisors: BoardMember[];
  membersTitle: string;
  membersCopy: string;
  advisorsTitle: string;
  advisorsCopy: string;
}

export default function LeadershipSections({
  boardMembers,
  boardAdvisors,
  membersTitle,
  membersCopy,
  advisorsTitle,
  advisorsCopy,
}: LeadershipSectionsProps) {
  const membersPanelId = useId();
  const advisorsPanelId = useId();
  const [isMobile, setIsMobile] = useState(false);
  const [membersOpen, setMembersOpen] = useState(true);
  const [advisorsOpen, setAdvisorsOpen] = useState(true);
  const [showAllMembers, setShowAllMembers] = useState(true);
  const [showAllAdvisors, setShowAllAdvisors] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const syncViewportState = (matches: boolean) => {
      setIsMobile(matches);

      if (matches) {
        setMembersOpen(true);
        setAdvisorsOpen(false);
        setShowAllMembers(false);
        setShowAllAdvisors(false);
        return;
      }

      setMembersOpen(true);
      setAdvisorsOpen(true);
      setShowAllMembers(true);
      setShowAllAdvisors(true);
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

  const visibleBoardMembers = isMobile && !showAllMembers
    ? boardMembers.slice(0, MOBILE_VISIBLE_CARD_COUNT)
    : boardMembers;
  const visibleBoardAdvisors = isMobile && !showAllAdvisors
    ? boardAdvisors.slice(0, MOBILE_VISIBLE_CARD_COUNT)
    : boardAdvisors;

  return (
    <div className="board-sections">
      <div className="board-subsection">
        <div className="board-subsection__header">
          <div className="board-subsection__summary">
            <div>
              <h3 className="board-subsection__title">{membersTitle}</h3>
              <p className="board-subsection__copy">{membersCopy}</p>
            </div>
            <button
              type="button"
              className="board-subsection__toggle"
              aria-expanded={!isMobile || membersOpen}
              aria-controls={membersPanelId}
              onClick={() => setMembersOpen((previousValue) => !previousValue)}
            >
              {!isMobile || membersOpen ? "Hide section" : "Show section"}
            </button>
          </div>
        </div>
        <div id={membersPanelId} hidden={isMobile && !membersOpen}>
          <div className="board-grid board-grid--leadership">
            {visibleBoardMembers.map((member) => (
              <BoardCard key={member.name + member.title} member={member} />
            ))}
          </div>
          {isMobile && boardMembers.length > MOBILE_VISIBLE_CARD_COUNT ? (
            <button
              type="button"
              className="board-subsection__reveal"
              onClick={() => setShowAllMembers((previousValue) => !previousValue)}
            >
              {showAllMembers ? `Show fewer board members` : `Show all ${boardMembers.length} board members`}
            </button>
          ) : null}
        </div>
      </div>

      {boardAdvisors.length ? (
        <div className="board-subsection">
          <div className="board-subsection__header">
            <div className="board-subsection__summary">
              <div>
                <h3 className="board-subsection__title">{advisorsTitle}</h3>
                <p className="board-subsection__copy">{advisorsCopy}</p>
              </div>
              <button
                type="button"
                className="board-subsection__toggle"
                aria-expanded={!isMobile || advisorsOpen}
                aria-controls={advisorsPanelId}
                onClick={() => setAdvisorsOpen((previousValue) => !previousValue)}
              >
                {!isMobile || advisorsOpen ? "Hide section" : "Show section"}
              </button>
            </div>
          </div>
          <div id={advisorsPanelId} hidden={isMobile && !advisorsOpen}>
            <div className="board-grid board-grid--leadership">
              {visibleBoardAdvisors.map((member) => (
                <BoardCard key={member.name + member.title} member={member} />
              ))}
            </div>
            {isMobile && boardAdvisors.length > MOBILE_VISIBLE_CARD_COUNT ? (
              <button
                type="button"
                className="board-subsection__reveal"
                onClick={() => setShowAllAdvisors((previousValue) => !previousValue)}
              >
                {showAllAdvisors ? `Show fewer advisors` : `Show all ${boardAdvisors.length} advisors`}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}