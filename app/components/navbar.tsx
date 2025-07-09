"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/image/logo.webp";
import { slideInOut } from "../animations/pageTrans";
import "./navbar.css";
import dynamic from "next/dynamic";

interface NavbarItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
  external?: boolean;
}

const EXTERNAL_LINKS = {
  INSTAGRAM: "https://www.instagram.com/sphinx_mnit/?hl=en",
  LINKEDIN:
    "https://www.linkedin.com/company/sphinx-mnit-jaipur/posts/?feedView=all",
  FACEBOOK: "https://www.facebook.com/sphinxMNIT/",
} as const;

const DESKTOP_BREAKPOINT = 1024;
const LOGO_SIZE = 48;
const ICON_SIZE = 20;

const createNavbarItems = (icons: any): Record<string, NavbarItem[]> => ({
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

const createDesktopSections = (navItems: Record<string, NavbarItem[]>) => [
  {
    items: navItems.TL,
    position: "top-left" as const,
    className: "bg-TL top-left",
    includeSignUp: false,
  },
  {
    items: navItems.TR,
    position: "top-right" as const,
    className: "bg-TR top-right",
    includeSignUp: true,
  },
  {
    items: navItems.BL,
    position: "bottom-left" as const,
    className: "bg-BL bottom-left",
    includeSignUp: false,
  },
  {
    items: navItems.BR,
    position: "bottom-right" as const,
    className: "bg-BR bottom-right",
    includeSignUp: false,
  },
];

const checkIsDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;
const getAllNavItems = (navItems: Record<string, NavbarItem[]>) =>
  Object.values(navItems).flat();
const normalizePathname = (pathname: string) =>
  pathname === "/" ? "/" : pathname.replace(/\/$/, "");

const LoadingPlaceholder: React.FC<{ className?: string }> = ({
  className,
}) => <div className={`bg-gray-400 rounded animate-pulse ${className}`} />;

const iconComponents = {
  FaInstagram: dynamic(
    () =>
      import("react-icons/fa").then((mod) => ({ default: mod.FaInstagram })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-5 h-5" />,
    }
  ),
  FaLinkedin: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaLinkedin })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-5 h-5" />,
    }
  ),
  FaFacebook: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaFacebook })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-5 h-5" />,
    }
  ),
  FaBars: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaBars })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-6 h-6" />,
    }
  ),
  FaTimes: dynamic(
    () => import("react-icons/fa").then((mod) => ({ default: mod.FaTimes })),
    {
      ssr: false,
      loading: () => <LoadingPlaceholder className="w-8 h-8" />,
    }
  ),
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsDesktop(checkIsDesktop());

    const handleResize = () => setIsDesktop(checkIsDesktop());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isDesktop, isClient };
};

const MemoizedNavLink = React.memo<{
  item: NavbarItem;
  onClick?: (link: string) => void;
  className?: string;
  children?: React.ReactNode;
  currentPath: string;
}>(({ item, onClick, className = "navbar-link", children, currentPath }) => {
  const isActive = useMemo(() => {
    if (item.external) return false;
    return normalizePathname(currentPath) === normalizePathname(item.link);
  }, [currentPath, item.external, item.link]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isActive) {
        e.preventDefault();
        return;
      }
      if (!item.external && onClick) {
        e.preventDefault();
        onClick(item.link);
      }
    },
    [item.external, item.link, onClick, isActive]
  );

  const linkClassName = useMemo(() => {
    if (isActive) {
      return `${className} opacity-50 cursor-not-allowed`;
    }
    return className;
  }, [className, isActive]);

  return (
    <Link
      href={item.link}
      onClick={handleClick}
      className={linkClassName}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      aria-disabled={isActive}
    >
      {children || (
        <div className="flex items-center gap-1">
          {item.icon ? item.icon : item.label}
        </div>
      )}
    </Link>
  );
});

MemoizedNavLink.displayName = "MemoizedNavLink";

const MemoizedLogo = React.memo<{ currentPath: string }>(({ currentPath }) => {
  const router = useTransitionRouter();
  const isActive = currentPath === "/";

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (!isActive) {
        router.push("/", { onTransitionReady: slideInOut });
      }
    },
    [router, isActive]
  );

  return (
    <div className="flex items-center gap-2 justify-center lg:mx-0">
      <Image
        src={logo}
        alt="Sphinx Logo"
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        className="bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        placeholder="blur"
        blurDataURL={logo.blurDataURL}
        priority
        quality={90}
      />
      <Link
        onClick={handleClick}
        href="/"
        className={isActive ? "cursor-not-allowed opacity-50" : ""}
        aria-disabled={isActive}
      >
        <h1 className="text-3xl font-bold text-white">Sphinx'25</h1>
      </Link>
    </div>
  );
});

MemoizedLogo.displayName = "MemoizedLogo";

const MemoizedSignUpButton = React.memo<{
  mobile?: boolean;
  onClick?: () => void;
  currentPath: string;
}>(({ mobile = false, onClick, currentPath }) => {
  const isActive = currentPath === "/sign-up";
  const router = useTransitionRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isActive) {
        e.preventDefault();
        return;
      }
      if (onClick) onClick();
    },
    [onClick, isActive]
  );

  const buttonClassName = useMemo(() => {
    const baseClass = mobile
      ? `mt-6 w-80 h-20 py-3 border border-white rounded-xl text-2xl font-semibold 
         bg-transparent text-white hover:bg-white hover:text-black 
         transition-all duration-200 ease-in-out active:scale-95 
         active:bg-[#3fe0b2] active:text-black shadow-md 
         hover:shadow-[0_0_15px_2px_rgba(63,224,178,0.6)] 
         active:shadow-[0_0_20px_4px_rgba(63,224,178,0.8)]`
      : `navbar-link px-4 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors z-55`;

    return isActive ? `${baseClass} opacity-50 cursor-not-allowed` : baseClass;
  }, [mobile, isActive]);

  return (
    <Link
      onClickCapture={(e) => {
        e.preventDefault;
        router.push("/sign-up", { onTransitionReady: slideInOut });
      }}
      href="/sign-up"
      onClick={handleClick}
      aria-disabled={isActive}
    >
      <button className={buttonClassName} disabled={isActive}>
        Sign Up
      </button>
    </Link>
  );
});

MemoizedSignUpButton.displayName = "MemoizedSignUpButton";

const DesktopNavigation = React.memo<{
  onNavClick: (link: string) => void;
  sections: ReturnType<typeof createDesktopSections>;
  currentPath: string;
}>(({ onNavClick, sections, currentPath }) => (
  <>
    {sections.map(({ items, position, className, includeSignUp }) => (
      <div key={position} className={`hidden lg:block ${className}`}>
        <div
          className={`navbar-group ${position} text-white font-bold tracking-wider`}
        >
          {items.map((item) => (
            <MemoizedNavLink
              key={item.label}
              item={item}
              onClick={onNavClick}
              currentPath={currentPath}
            />
          ))}
          {includeSignUp && <MemoizedSignUpButton currentPath={currentPath} />}
        </div>
      </div>
    ))}
  </>
));

DesktopNavigation.displayName = "DesktopNavigation";

const MobileNavigation = React.memo<{
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (link: string) => void;
  allNavItems: NavbarItem[];
  currentPath: string;
}>(({ isOpen, onClose, onNavClick, allNavItems, currentPath }) => {
  const { FaTimes } = iconComponents;

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-90 text-white z-50">
      <button
        className="absolute top-6 right-6 text-white"
        onClick={onClose}
        aria-label="Close navigation menu"
      >
        <FaTimes size={32} />
      </button>
      <nav className="flex flex-col items-center justify-center gap-1 mt-6 w-full">
        {allNavItems.map((item) => (
          <MemoizedNavLink
            key={item.label}
            item={item}
            onClick={onNavClick}
            currentPath={currentPath}
            className="w-full text-center py-2 text-xs font-semibold tracking-wide rounded-md hover:bg-white hover:text-black transition-all duration-200 active:scale-95"
          >
            <div className="flex justify-center items-center gap-2">
              {item.icon}
              {item.label}
            </div>
          </MemoizedNavLink>
        ))}
        <MemoizedSignUpButton
          mobile
          onClick={onClose}
          currentPath={currentPath}
        />
      </nav>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDesktop, isClient } = useIsDesktop();
  const router = useTransitionRouter();
  const pathname = usePathname();

  const navItems = useMemo(() => createNavbarItems(iconComponents), []);
  const desktopSections = useMemo(
    () => createDesktopSections(navItems),
    [navItems]
  );
  const allNavItems = useMemo(() => getAllNavItems(navItems), [navItems]);

  const handleNavClick = useCallback(
    (link: string) => {
      setIsMenuOpen(false);
      router.push(link, { onTransitionReady: slideInOut });
    },
    [router]
  );

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  if (!isClient) {
    return (
      <main>
        <div className="flex items-center justify-between px-4 lg:justify-center lg:gap-3 mt-6">
          <MemoizedLogo currentPath={pathname} />
          <div className="w-4 lg:hidden" />
          <LoadingPlaceholder className="lg:hidden w-6 h-6" />
        </div>
      </main>
    );
  }

  const { FaBars } = iconComponents;

  return (
    <main>
      <div className="flex items-center justify-between px-4 lg:justify-center lg:gap-3 mt-6">
        <MemoizedLogo currentPath={pathname} />
        <div className="w-4 lg:hidden" />
        {!isDesktop && (
          <button
            className="lg:hidden text-white"
            onClick={openMenu}
            aria-label="Open navigation menu"
          >
            <FaBars size={24} />
          </button>
        )}
      </div>

      {isDesktop && (
        <DesktopNavigation
          onNavClick={handleNavClick}
          sections={desktopSections}
          currentPath={pathname}
        />
      )}

      {!isDesktop && (
        <MobileNavigation
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onNavClick={handleNavClick}
          allNavItems={allNavItems}
          currentPath={pathname}
        />
      )}
    </main>
  );
};

export default React.memo(Navbar);
