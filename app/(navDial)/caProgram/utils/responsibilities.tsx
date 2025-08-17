import type { ResponsibilityItem } from "../types/caProgram";

export const responsibilities: readonly ResponsibilityItem[] = [
  {
    id: "promote-events",
    description: "Promote Sphinx events on campus and social media.",
  },
  {
    id: "drive",
    description: "Drive registrations and participation from your college.",
  },
  {
    id: "representation",
    description:
      "Act as the official representative of Team Sphinx.",
  },
  {
    id:'Coordinate',
    description:"Coordinate offline publicity like posters and announcements.",
  },
  {
    id: "build-networks",
    description: "Assist in building connections with sponsors or partners.",
  },
  {
    id: "create-hype",
    description: "Create buzz and hype for flagship events and pronites.",
  },
] as const;
