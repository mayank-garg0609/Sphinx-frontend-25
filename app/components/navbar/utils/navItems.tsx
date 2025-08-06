import {
  FaCalendarCheck,
  FaUserGraduate,
  FaIdBadge,
  FaChalkboardTeacher,
  FaHandshake,
  FaUserFriends,
  FaInfoCircle,
  FaInstagram,
  FaLinkedin,
  FaCode,
  FaBalanceScale,
} from "react-icons/fa";
import { NavItem } from "../types/navbarTypes";

export const navItems: NavItem[] = [
  { id: "events", label: "Events", link: "/events", icon: FaCalendarCheck },
  {
    id: "ca-program",
    label: "CA Program",
    link: "/caProgram",
    icon: FaUserGraduate,
  },
  { id: "access", label: "Access", link: "/accommodation", icon: FaIdBadge },
  {
    id: "workshops",
    label: "Workshops",
    link: "/workshops",
    icon: FaChalkboardTeacher,
  },
  { id: "sponsors", label: "Sponsors", link: "/sponsors", icon: FaHandshake },
  { id: "team", label: "Team", link: "/team", icon: FaUserFriends },
  { id: "devteam", label: "Dev Team", link: "/devTeam", icon: FaCode },

  { id: "about", label: "About Us", link: "/about-us", icon: FaInfoCircle },
  { id: "legals", label: "Legals", link: "/legals", icon: FaBalanceScale },

  {
    id: "instagram",
    label: "Instagram",
    link: "https://www.instagram.com/sphinx_mnit/?hl=en",
    icon: FaInstagram,
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    link: "https://www.linkedin.com/company/sphinx-mnit",
    icon: FaLinkedin,
    external: true,
  },
];
