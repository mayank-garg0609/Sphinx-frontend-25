import type { PerkItem } from "../types/caProgram";

export const perks: readonly PerkItem[] = [
  {
    id: "courses-workshops",
    icon: "book",
    title: "Letter of Appointment",
  },
  {
    id: "internship-certificate",
    icon: "badge",
    title: "Official Recognition  ",
  },
  {
    id: "sponsor-opportunities",
    icon: "users",
    title: "Professional Visibility",
  },
  {
    id: "networking",
    icon: "share",
    title: "Networking Opportunities",
  },
  {
    id: "recognition",
    icon: "star",
    title: "Merchandise, Goodies and Golden Fest Pass",
  },
  {
    id: "recommendation",
    icon: "userCheck",
    title: "Certificate of Appreciation",
  },
] as const;
