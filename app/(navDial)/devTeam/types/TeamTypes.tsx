import type { StaticImageData } from "next/image";
import { Url } from "url";

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
}

export type TeamMemberIndex = number;