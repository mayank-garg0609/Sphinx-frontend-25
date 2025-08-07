import type { StaticImageData } from "next/image";

export interface TeamMember {
  id: number;
  title: string;
  subtitle: string;
  imageData: StaticImageData;
}

export type TeamSection = "core" | "advisors";

export interface TeamSectionConfig {
  label: string;
}

export interface TeamSections {
  core: TeamSectionConfig;
  advisors: TeamSectionConfig;
}