import React from "react";
import { TeamSection } from "../types/teamTypes";
import { TEAM_SECTIONS, SECTION_KEYS } from "../utils/constants";

interface TeamMobileDropdownProps {
  view: TeamSection;
  activeLabel: string;
  isDropdownOpen: boolean;
  handleDropdownToggle: () => void;
  handleSectionChange: (section: TeamSection) => void;
  setIsDropdownOpen: (open: boolean) => void;
}

const TeamMobileDropdown: React.FC<TeamMobileDropdownProps> = React.memo(({
  view,
  activeLabel,
  isDropdownOpen,
  handleDropdownToggle,
  handleSectionChange,
  setIsDropdownOpen,
}) => {
  const handleSectionClick = React.useCallback((key: TeamSection) => {
    handleSectionChange(key);
    setIsDropdownOpen(false);
  }, [handleSectionChange, setIsDropdownOpen]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent, key?: TeamSection) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (key) {
        handleSectionClick(key);
      } else {
        handleDropdownToggle();
      }
    } else if (event.key === 'Escape' && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  }, [handleSectionClick, handleDropdownToggle, isDropdownOpen, setIsDropdownOpen]);

  return (
    <nav 
      className="lg:hidden px-4 pt-32 z-30 relative"
      aria-label="Team section navigation"
    >
      <div className="relative">
        <button
          onClick={handleDropdownToggle}
          onKeyDown={handleKeyDown}
          className="w-full p-3 rounded-lg text-left text-white border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors duration-200"
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          type="button"
        >
          {activeLabel}
          <span 
            className={`float-right transform transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : 'rotate-0'
            }`}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>
        
        {isDropdownOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 bg-black/80 border border-white/20 rounded-lg shadow-xl z-30 overflow-hidden"
            role="listbox"
            aria-label="Team sections"
          >
            {SECTION_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handleSectionClick(key)}
                onKeyDown={(e) => handleKeyDown(e, key)}
                className={`w-full text-left px-4 py-3 text-white hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors duration-150 ${
                  key === view ? "bg-white/10" : ""
                }`}
                role="option"
                aria-selected={key === view}
                type="button"
              >
                {TEAM_SECTIONS[key].label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
});

TeamMobileDropdown.displayName = "TeamMobileDropdown";

export default TeamMobileDropdown;