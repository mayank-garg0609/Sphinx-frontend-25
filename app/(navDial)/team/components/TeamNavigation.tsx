import { TeamSection } from "../types/teamTypes";
import { TEAM_SECTIONS, SECTION_KEYS } from "../utils/constants";

interface TeamNavigationProps {
  view: TeamSection;
  setView: (section: TeamSection) => void;
}

export default function TeamNavigation({ view, setView }: TeamNavigationProps) {
  return (
    <div className="fixed top-32 right-6 z-20 hidden lg:flex flex-col gap-4 overflow-hidden">
      {SECTION_KEYS.map((key) => (
        <button
          key={key}
          onClick={() => setView(key)}
          className={`px-4 py-2 rounded-md font-semibold tracking-wide transition-all duration-300 text-sm shadow-inner ${
            view === key
              ? "bg-[#d6c094] text-zinc-900 shadow-md border border-[#f1e6b2]"
              : "bg-black/30 text-white border border-white/20 hover:bg-white/10"
          }`}
        >
          {TEAM_SECTIONS[key].label}
        </button>
      ))}
    </div>
  );
}