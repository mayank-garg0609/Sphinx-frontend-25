import { TeamSections } from "../types/teamTypes";

export const TEAM_SECTIONS: TeamSections = {
  core: {
    label: "Core Team",
  },
  advisors: {
    label: "Advisors",
  },
} as const;

export const SECTION_KEYS = Object.keys(TEAM_SECTIONS) as Array<keyof TeamSections>;