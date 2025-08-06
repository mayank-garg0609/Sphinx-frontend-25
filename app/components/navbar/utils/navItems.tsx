import {
  FaCalendarAlt,
  FaCertificate,
  FaTicketAlt,
  FaTools,
  FaHandshake,
  FaUsers,
  FaInfoCircle,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { NavItem } from "../types/navbarTypes";

export const navItems: NavItem[] = [
  { id: "events", label: "Events", link: "/events", icon: FaCalendarAlt },
  { id: "ca-program", label: "CA Program", link: "/caProgram", icon: FaCertificate },
  { id: "passes", label: "Passes", link: "/accommodation", icon: FaTicketAlt },
  { id: "workshops", label: "Workshops", link: "/workshops", icon: FaTools },
  { id: "sponsors", label: "Sponsors", link: "/sponsors", icon: FaHandshake },
  { id: "team", label: "Team", link: "/team", icon: FaUsers },
  { id: "about", label: "About Us", link: "/about-us", icon: FaInfoCircle },
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