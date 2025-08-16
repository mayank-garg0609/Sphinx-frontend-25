import type { StaticImageData } from "next/image";

export interface TeamMember {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string;
  readonly imageData: StaticImageData;
}

export type TeamSection = "core" | "advisors";

export interface TeamSectionConfig {
  readonly label: string;
}

export interface TeamSections {
  readonly core: TeamSectionConfig;
  readonly advisors: TeamSectionConfig;
}

export type TeamMemberRole = 
  | "President"
  | "Vice President"
  | "General Secretary"
  | "Technical Secretary"
  | "Cultural Secretary"
  | "Finance Secretary"
  | "Logistics Secretary"
  | "Marketing Secretary"
  | "Decor Secretary"
  | "Publicity Secretary"
  | "Mass Media Secretary"
  | "Design Secretary"
  | "Advisor to President"
  | "Advisor to Vice President"
  | "Advisor to General Secretary"
  | "Advisor to Publicity Secretary"
  | "Advisor to Marketing Secretary";

export interface EnhancedTeamMember extends TeamMember {
  readonly role: TeamMemberRole;
  readonly department?: string;
  readonly email?: string;
  readonly linkedin?: string;
}

export interface TeamCardProps extends TeamMember {
  className?: string;
  priority?: boolean;
}