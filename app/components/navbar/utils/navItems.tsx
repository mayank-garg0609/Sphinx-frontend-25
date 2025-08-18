import { NavItem } from "../types/navbarTypes";
import { lazy } from "react";

const FaCalendarCheck = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaCalendarCheck }))
);
const FaUserGraduate = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaUserGraduate }))
);
const FaIdBadge = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaIdBadge }))
);
const FaChalkboardTeacher = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaChalkboardTeacher }))
);
const FaHandshake = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaHandshake }))
);
const FaUserFriends = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaUserFriends }))
);
const FaInfoCircle = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaInfoCircle }))
);
const FaInstagram = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaInstagram }))
);
const FaLinkedin = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaLinkedin }))
);
const FaCode = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaCode }))
);
const FaBalanceScale = lazy(() =>
  import("react-icons/fa").then((m) => ({ default: m.FaBalanceScale }))
);

export const navItems: readonly NavItem[] = Object.freeze([
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
  { id: "team", label: "Core Team", link: "/team", icon: FaUserFriends },
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
] as const);

export const NAV_ITEMS_COUNT = navItems.length;
