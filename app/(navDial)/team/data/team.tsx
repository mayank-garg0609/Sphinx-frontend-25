import humanImg from "@/public/image/human.webp";
import p from "@/public/team/IMG_5085.webp";
import vp1 from "@/public/team/IMG_5084.webp";
import vp2 from "@/public/team/IMG_5016.webp";
import gs1 from "@/public/team/IMG_5069.webp";
import gs2 from "@/public/image/human.webp"; 
import gs3 from "@/public/team/IMG_5044.webp";
import ts1 from "@/public/team/IMG_5015.webp";
import ts2 from "@/public/team/IMG_5075.webp";
import ts3 from "@/public/team/IMG_5014.webp";
import cs1 from "@/public/team/IMG_5052.webp";
import cs2 from "@/public/team/IMG_5023.webp";
import cs3 from "@/public/team/IMG_5039.webp";
import fs1 from "@/public/team/IMG_5051.webp";
import fs2 from "@/public/team/IMG_5074.webp";
import fs3 from "@/public/team/IMG_5087.webp";
import ls1 from "@/public/team/IMG_5043.webp";
import ls2 from "@/public/team/IMG_5086.webp";
import ls3 from "@/public/team/IMG_5017.webp";
import ms1 from "@/public/team/IMG_5071.webp";
import ms2 from "@/public/team/IMG_50822.webp";
import ms3 from "@/public/image/human.webp"; 
import ds1 from "@/public/image/human.webp"; 
import ds2 from "@/public/team/IMG_5020.webp";
import ds3 from "@/public/team/IMG_5057.webp";
import ps1 from "@/public/team/IMG_5067.webp";
import ps2 from "@/public/team/IMG_5019.webp";
import ps3 from "@/public/team/IMG_5078.webp";
import mms1 from "@/public/image/human.webp";
import mms2 from "@/public/team/IMG_5027.webp";
import mms3 from "@/public/team/IMG_5066.webp";
import d1 from "@/public/team/IMG_5047.webp";
import d2 from "@/public/team/IMG_5030.webp";
import d3 from "@/public/team/IMG_5028.webp";
import { TeamMember } from "../types/teamTypes";

const createTeamMember = (
  id: number,
  title: string,
  subtitle: string,
  imageData: any
): TeamMember => ({
  id,
  title: title.trim(),
  subtitle: subtitle.trim(),
  imageData,
});

export const President: readonly TeamMember[] = [
  createTeamMember(1, "DHAIRYA ARORA", "President", p),
] as const;

export const VicePresident: readonly TeamMember[] = [
  createTeamMember(1, "SHIVANSH RAI", "Vice President", vp1),
  createTeamMember(2, "SIMRAN", "Vice President", vp2),
] as const;

export const GenSec: readonly TeamMember[] = [
  createTeamMember(1, "MUDITA VYAS", "General Secretary", gs1),
  createTeamMember(2, "VANSH KHATRI", "General Secretary", gs2),
  createTeamMember(3, "SHIVANG", "General Secretary", gs3),
] as const;

export const TechSec: readonly TeamMember[] = [
  createTeamMember(1, "MAHESH SHARMA", "Technical Secretary", ts2),
  createTeamMember(2, "ABHINAV THAPLIYAL", "Technical Secretary", ts1),
  createTeamMember(3, "MAYANK GARG", "Technical Secretary", ts3),
] as const;

export const CulSec: readonly TeamMember[] = [
  createTeamMember(1, "ARYAN PARASHAR", "Cultural Secretary", cs1),
  createTeamMember(2, "CHANCHAL SONI", "Cultural Secretary", cs2),
  createTeamMember(3, "DIVYANSH PRABHAKAR VERMA", "Cultural Secretary", cs3),
] as const;

export const FinSec: readonly TeamMember[] = [
  createTeamMember(1, "ADARSH SINGH", "Finance Secretary", fs1),
  createTeamMember(2, "AABHAR SONI", "Finance Secretary", fs2),
  createTeamMember(3, "KAMINI TOMAR", "Finance Secretary", fs3),
] as const;

export const LogSec: readonly TeamMember[] = [
  createTeamMember(1, "NAKSHATRA BANSAL", "Logistics Secretary", ls1),
  createTeamMember(2, "SHREYA ARUN SAWANT", "Logistics Secretary", ls2),
  createTeamMember(3, "ABHISHEK CHOUDHARY", "Logistics Secretary", ls3),
] as const;

export const MarSec: readonly TeamMember[] = [
  createTeamMember(1, "NAMAN KAUR", "Marketing Secretary", ms1),
  createTeamMember(2, "AMIT PARMAR", "Marketing Secretary", ms2),
  createTeamMember(3, "SHIVAM KUMAR MITTAL", "Marketing Secretary", ms3),
] as const;

export const DecSec: readonly TeamMember[] = [
  createTeamMember(1, "LOKESH", "Decor Secretary", ds1),
  createTeamMember(2, "EKTA KIRAN", "Decor Secretary", ds2),
  createTeamMember(3, "SOHA SHOAIB", "Decor Secretary", ds3),
] as const;

export const PubSec: readonly TeamMember[] = [
  createTeamMember(1, "HARSHITA GANESH", "Publicity Secretary", ps1),
  createTeamMember(2, "KASAK NIBHWANI", "Publicity Secretary", ps2),
  createTeamMember(3, "ROUNAK KUMAR", "Publicity Secretary", ps3),
] as const;

export const MasSec: readonly TeamMember[] = [
  createTeamMember(1, "RAVINDER SINGH", "Mass Media Secretary", mms1),
  createTeamMember(2, "CHAHAK RATHI", "Mass Media Secretary", mms2),
  createTeamMember(3, "RAJAT RAJ", "Mass Media Secretary", mms3),
] as const;

export const DesSec: readonly TeamMember[] = [
  createTeamMember(1, "RAGHAV GOYAL", "Design Secretary", d1),
  createTeamMember(2, "ABHAY SINGH", "Design Secretary", d2),
  createTeamMember(3, "SNEHA GATHWAL", "Design Secretary", d3),
] as const;

export const Advisors: readonly TeamMember[] = [
  createTeamMember(1, "Krishnav Maheshwari", "Advisor to President", humanImg),
  createTeamMember(2, "Bhavdeep", "Advisor to Vice President", humanImg),
  createTeamMember(3, "Aditya Jangid", "Advisor to General Secretary", humanImg), 
  createTeamMember(4, "Kunal Agarwal", "Advisor to Publicity Secretary", humanImg),
  createTeamMember(5, "Saransh", "Advisor to Marketing Secretary", humanImg),
] as const;

export const ALL_TEAM_SECTIONS = {
  President,
  VicePresident,
  GenSec,
  TechSec,
  CulSec,
  FinSec,
  LogSec,
  MarSec,
  DecSec,
  PubSec,
  MasSec,
  DesSec,
  Advisors,
} as const;

export const getCoreTeamMembers = (): readonly TeamMember[] => {
  return [
    ...President,
    ...VicePresident,
    ...GenSec,
    ...TechSec,
    ...CulSec,
    ...FinSec,
    ...LogSec,
    ...MarSec,
    ...DecSec,
    ...PubSec,
    ...MasSec,
    ...DesSec,
  ] as const;
};