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

export default function TeamMobileDropdown({
  view,
  activeLabel,
  isDropdownOpen,
  handleDropdownToggle,
  handleSectionChange,
  setIsDropdownOpen,
}: TeamMobileDropdownProps) {
  return (
    <div className="lg:hidden px-4 pt-28 z-20 relative">
      <div className="relative">
        <button
          onClick={handleDropdownToggle}
          className="w-full p-3 rounded-lg text-left text-white border border-white/20 bg-black/40 backdrop-blur-sm"
        >
          {activeLabel}
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-black/80 border border-white/20 rounded-lg shadow-xl z-30 overflow-hidden">
            {SECTION_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => {
                  handleSectionChange(key);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-white hover:bg-white/10 ${
                  key === view ? "bg-white/10" : ""
                }`}
              >
                {TEAM_SECTIONS[key].label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}