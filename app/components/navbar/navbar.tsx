"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { slideInOut } from "../../animations/pageTrans";
import "./navbar.css";
import { Logo } from "./components/logo";
import { DesktopNavigation } from "./components/DesktopNavigation";
import { MobileNavigation } from "./components/MobileNavigation";
import { MobileMenuButton } from "./components/MobileMenuButton";
import { LoadingPlaceholder } from "./components/loadingPlaceholder";
import { useIsDesktop } from "./hooks/usIsDesktop";
import { createNavbarItems, createDesktopSections, getAllNavItems } from "./utils/navbatUtils";
import { iconComponents } from "./components/icons";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDesktop, isClient } = useIsDesktop();
  const router = useTransitionRouter();
  const pathname = usePathname();

  const navItems = useMemo(() => createNavbarItems(iconComponents), []);
  const desktopSections = useMemo(() => createDesktopSections(navItems), [navItems]);
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
          <Logo currentPath={pathname} />
          <div className="w-4 lg:hidden" />
          <LoadingPlaceholder className="lg:hidden w-6 h-6" />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex items-center justify-between px-4 lg:justify-center lg:gap-3 mt-6">
        <Logo currentPath={pathname} />
        <div className="w-4 lg:hidden" />
        {!isDesktop && <MobileMenuButton onClick={openMenu} />}
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