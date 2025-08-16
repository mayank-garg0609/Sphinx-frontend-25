import { TeamSections, TeamSection } from "../types/teamTypes";

export const TEAM_SECTIONS: TeamSections = {
  core: {
    label: "Core Team",
  },
  advisors: {
    label: "Advisors",
  },
} as const;

export const SECTION_KEYS: readonly TeamSection[] = Object.keys(TEAM_SECTIONS) as TeamSection[];

export const NAVIGATION_CONFIG = {
  desktop: {
    position: "fixed top-36 right-6 z-20",
    display: "hidden lg:flex flex-col gap-4",
  },
  mobile: {
    position: "lg:hidden px-4 pt-32 z-30",
    display: "relative",
  },
} as const;

export const BUTTON_STYLES = {
  active: "bg-[#d6c094] text-zinc-900 shadow-md border border-[#f1e6b2] focus:ring-[#d6c094]",
  inactive: "bg-black/30 text-white border border-white/20 hover:bg-white/10 focus:ring-white/30",
  base: "px-4 py-2 rounded-md font-semibold tracking-wide transition-all duration-300 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
} as const;

export const DROPDOWN_STYLES = {
  trigger: "w-full p-3 rounded-lg text-left text-white border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors duration-200",
  menu: "absolute top-full left-0 right-0 mt-2 bg-black/80 border border-white/20 rounded-lg shadow-xl z-30 overflow-hidden",
  item: "w-full text-left px-4 py-3 text-white hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors duration-150",
  itemActive: "bg-white/10",
} as const;

export const Z_INDEX = {
  background: -10,
  overlay: -9,
  content: 10,
  navigation: 20,
  dropdown: 30,
  modal: 40,
} as const;