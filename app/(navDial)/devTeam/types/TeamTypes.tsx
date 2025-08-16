import type { StaticImageData } from "next/image";

export interface TeamMember {
  id: string;
  name: string;
  branch: string;
  imageUrl: StaticImageData;
  age: number;
  designation: string;
  description: string;
  linkedIn: string;
  Instagram: string;
  Github: string;
}

export type TeamMemberIndex = number;