"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTransitionRouter } from "next-view-transitions";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/image/logo.webp";
import { slideInOut } from "../animations/pageTrans";
import "./navbar.css";
import dynamic from 'next/dynamic';

const FaInstagram = dynamic(() => import("react-icons/fa").then(mod => ({ default: mod.FaInstagram })), {
  ssr: false,
  loading: () => <div className="w-5 h-5 animate-pulse bg-gray-400 rounded" />
});

const FaLinkedin = dynamic(() => import("react-icons/fa").then(mod => ({ default: mod.FaLinkedin })), {
  ssr: false,
  loading: () => <div className="w-5 h-5 animate-pulse bg-gray-400 rounded" />
});

const FaFacebook = dynamic(() => import("react-icons/fa").then(mod => ({ default: mod.FaFacebook })), {
  ssr: false,
  loading: () => <div className="w-5 h-5 animate-pulse bg-gray-400 rounded" />
});

const FaBars = dynamic(() => import("react-icons/fa").then(mod => ({ default: mod.FaBars })), {
  ssr: false,
  loading: () => <div className="w-6 h-6 animate-pulse bg-gray-400 rounded" />
});

const FaTimes = dynamic(() => import("react-icons/fa").then(mod => ({ default: mod.FaTimes })), {
  ssr: false,
  loading: () => <div className="w-8 h-8 animate-pulse bg-gray-400 rounded" />
});

interface NavbarItem {
  label: string;
  link: string;
  icon?: React.ReactNode;
  external?: boolean;
}

const navbarTL: NavbarItem[] = [
  { label: "Campus Ambassador", link: "/caProgram" },
  { label: "Accommodation", link: "/accommodation" },
  { label: "Workshops", link: "/workshops" },
];

const navbarTR: NavbarItem[] = [
  { label: "Events", link: "/events" },
  { label: "Competition", link: "/competition" },
  { label: "Profile", link: "/profile" },
];

const navbarBL: NavbarItem[] = [
  { label: "Contact Us", link: "/contact-us" },
  { label: "Sponsors", link: "/sponsors" },
  { label: "Legals", link: "/legals" },
  { label: "About Us", link: "/about-us" },
];

const EXTERNAL_LINKS = {
  INSTAGRAM: "https://www.instagram.com/sphinx_mnit/?hl=en",
  LINKEDIN: "https://www.linkedin.com/company/sphinx-mnit-jaipur/posts/?feedView=all",
  FACEBOOK: "https://www.facebook.com/sphinxMNIT/",
} as const;

const navbarBR: NavbarItem[] = [
  { label: "Team", link: "/team" },
  { label: "DevTeam", link: "/dev-team" },
  {
    label: "Instagram",
    link: EXTERNAL_LINKS.INSTAGRAM,
    icon: <FaInstagram size={20} />,
    external: true,
  },
  {
    label: "LinkedIn",
    link: EXTERNAL_LINKS.LINKEDIN,
    icon: <FaLinkedin size={20} />,
    external: true,
  },
  {
    label: "Facebook",
    link: EXTERNAL_LINKS.FACEBOOK,
    icon: <FaFacebook size={20} />,
    external: true,
  },
];

const MemoizedNavLink = React.memo<{
  item: NavbarItem;
  onClick?: (link: string) => void;
  className?: string;
  children?: React.ReactNode;
}>(({ item, onClick, className = "navbar-link", children }) => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!item.external && onClick) {
      e.preventDefault();
      onClick(item.link);
    }
  }, [item.external, item.link, onClick]);

  return (
    <Link
      href={item.link}
      onClick={handleClick}
      className={className}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
    >
      {children || (
        <div className="flex items-center gap-1">
          {item.icon}
          {item.label}
        </div>
      )}
    </Link>
  );
});

MemoizedNavLink.displayName = "MemoizedNavLink";

const MemoizedLogo = React.memo(() => (
  <div className="flex items-center gap-2 justify-center lg:mx-0">
    <Image
      src={logo}
      alt="Sphinx Logo"
      width={48}
      height={48}
      className="bg-white animate-pulse rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      placeholder="blur"
      blurDataURL={logo.blurDataURL}
      priority={true}
      quality={90}
    />
    <Link href="/">
      <h1 className="text-3xl font-bold text-white">Sphinx'25</h1>
    </Link>
  </div>
));

MemoizedLogo.displayName = "MemoizedLogo";

const MemoizedSignUpButton = React.memo<{
  mobile?: boolean;
  onClick?: () => void;
}>(({ mobile = false, onClick }) => (
  <Link href="/sign-up" onClick={onClick}>
    <button
      className={
        mobile
          ? `mt-6 w-80 h-20 py-3 border border-white rounded-xl text-2xl font-semibold 
             bg-transparent text-white hover:bg-white hover:text-black 
             transition-all duration-200 ease-in-out active:scale-95 
             active:bg-[#3fe0b2] active:text-black shadow-md 
             hover:shadow-[0_0_15px_2px_rgba(63,224,178,0.6)] 
             active:shadow-[0_0_20px_4px_rgba(63,224,178,0.8)]`
          : `navbar-link px-4 border border-white text-white rounded-md hover:bg-white hover:text-black transition-colors z-55`
      }
    >
      Sign Up
    </button>
  </Link>
));

MemoizedSignUpButton.displayName = "MemoizedSignUpButton";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useTransitionRouter();

  const allNavItems = useMemo(
    () => [...navbarTL, ...navbarTR, ...navbarBL, ...navbarBR],
    []
  );

  const handleNavClick = useCallback((link: string) => {
    setIsMenuOpen(false);
    router.push(link, { onTransitionReady: slideInOut });
  }, [router]);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);


  const desktopNavSections = useMemo(() => [
    {
      items: navbarTL,
      position: "top-left",
      className: "bg-TL top-left",
    },
    {
      items: navbarTR,
      position: "top-right",
      className: "bg-TR top-right",
      includeSignUp: true,
    },
    {
      items: navbarBL,
      position: "bottom-left",
      className: "bg-BL bottom-left",
    },
    {
      items: navbarBR,
      position: "bottom-right",
      className: "bg-BR bottom-right",
    },
  ], []);

  return (
    <main>
    
      <div className="flex items-center justify-between px-4 lg:justify-center lg:gap-3 mt-6">
        <MemoizedLogo />
        <div className="w-4 lg:hidden" />
        <button
          className="lg:hidden text-white"
          onClick={openMenu}
          aria-label="Open navigation menu"
        >
          <FaBars size={24} />
        </button>
      </div>
]
      {desktopNavSections.map(({ items, position, className, includeSignUp }) => (
        <div key={position} className={`hidden lg:block ${className}`}>
          <div className={`navbar-group ${position} text-white font-bold tracking-wider`}>
            {items.map((item) => (
              <MemoizedNavLink
                key={item.label}
                item={item}
                onClick={handleNavClick}
              />
            ))}
            {includeSignUp && <MemoizedSignUpButton />}
          </div>
        </div>
      ))}
\
      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-90 text-white z-50">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <FaTimes size={32} />
          </button>
          <nav className="flex flex-col items-center justify-center gap-1 mt-6 w-full">
            {allNavItems.map((item) => (
              <MemoizedNavLink
                key={item.label}
                item={item}
                onClick={handleNavClick}
                className="w-full text-center py-2 text-xs font-semibold tracking-wide rounded-md hover:bg-white hover:text-black transition-all duration-200 active:scale-95"
              >
                <div className="flex justify-center items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
              </MemoizedNavLink>
            ))}
            <MemoizedSignUpButton mobile onClick={closeMenu} />
          </nav>
        </div>
      )}
    </main>
  );
};

export default React.memo(Navbar);