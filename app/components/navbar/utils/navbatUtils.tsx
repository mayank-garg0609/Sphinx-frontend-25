import { NavbarItem, NavbarSection } from "../types/navbarTypes";
import { EXTERNAL_LINKS, ICON_SIZE, DESKTOP_BREAKPOINT } from "../types/constants";

export const createNavbarItems = (icons: any): Record<string, NavbarItem[]> => ({
  TL: [
    { label: "Campus Ambassador", link: "/caProgram" },
    { label: "Accommodation", link: "/accommodation" },
    { label: "Workshops", link: "/workshops" },
  ],
  TR: [
    { label: "Events", link: "/events" },
    { label: "Competition", link: "/competition" },
    { label: "Profile", link: "/profile" },
  ],
  BL: [
    { label: "Contact Us", link: "/contact-us" },
    { label: "Sponsors", link: "/sponsors" },
    { label: "Legals", link: "/legals" },
    { label: "About Us", link: "/about-us" },
  ],
  BR: [
    { label: "Team", link: "/team" },
    { label: "DevTeam", link: "/dev-team" },
    {
      label: "Instagram",
      link: EXTERNAL_LINKS.INSTAGRAM,
      icon: <icons.FaInstagram size={ICON_SIZE} />,
      external: true,
    },
    {
      label: "LinkedIn",
      link: EXTERNAL_LINKS.LINKEDIN,
      icon: <icons.FaLinkedin size={ICON_SIZE} />,
      external: true,
    },
    {
      label: "Facebook",
      link: EXTERNAL_LINKS.FACEBOOK,
      icon: <icons.FaFacebook size={ICON_SIZE} />,
      external: true,
    },
  ],
});

export const createDesktopSections = (navItems: Record<string, NavbarItem[]>): NavbarSection[] => [
  {
    items: navItems.TL,
    position: "top-left",
    className: "bg-TL top-left",
    includeSignUp: false,
  },
  {
    items: navItems.TR,
    position: "top-right",
    className: "bg-TR top-right",
    includeSignUp: true,
  },
  {
    items: navItems.BL,
    position: "bottom-left",
    className: "bg-BL bottom-left",
    includeSignUp: false,
  },
  {
    items: navItems.BR,
    position: "bottom-right",
    className: "bg-BR bottom-right",
    includeSignUp: false,
  },
];

export const checkIsDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;

export const getAllNavItems = (navItems: Record<string, NavbarItem[]>) =>
  Object.values(navItems).flat();

export const normalizePathname = (pathname: string) =>
  pathname === "/" ? "/" : pathname.replace(/\/$/, "");