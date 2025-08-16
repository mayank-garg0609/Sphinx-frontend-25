import React from "react";
import { TeamSection } from "../types/teamTypes";
import { TEAM_SECTIONS, SECTION_KEYS } from "../utils/constants";

interface TeamNavigationProps {
  view: TeamSection;
  setView: (section: TeamSection) => void;
}

const TeamNavigation: React.FC<TeamNavigationProps> = React.memo(({ view, setView }) => {
  const handleSectionChange = React.useCallback((key: TeamSection) => {
    setView(key);
  }, [setView]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLButtonElement>, key: TeamSection) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSectionChange(key);
    }
  }, [handleSectionChange]);

  return (
    <nav 
      className="fixed top-36 right-6 z-20 hidden lg:flex flex-col gap-4 overflow-hidden"
      aria-label="Team section navigation"
    >
      {SECTION_KEYS.map((key) => (
        <button
          key={key}
          onClick={() => handleSectionChange(key)}
          onKeyDown={(e) => handleKeyDown(e, key)}
          className={`px-4 py-2 rounded-md font-semibold tracking-wide transition-all duration-300 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${
            view === key
              ? "bg-[#d6c094] text-zinc-900 shadow-md border border-[#f1e6b2] focus:ring-[#d6c094]"
              : "bg-black/30 text-white border border-white/20 hover:bg-white/10 focus:ring-white/30"
          }`}
          aria-pressed={view === key}
          type="button"
        >
          {TEAM_SECTIONS[key].label}
        </button>
      ))}
    </nav>
  );
});

TeamNavigation.displayName = "TeamNavigation";

export default TeamNavigation;