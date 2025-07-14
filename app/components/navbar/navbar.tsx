// app/components/navbar/navbar.tsx
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { slideInOut } from "../../animations/pageTrans";
import "./navbar.css";
import { Logo } from "./components/logo";
import { DesktopSidebar } from "./components/DesktopSidebar";
import { MobileSidebar } from "./components/MobileSidebar";
import { SidebarToggle } from "./components/SidebarToggle";
import { LoadingPlaceholder } from "./components/loadingPlaceholder";
import { useIsDesktop } from "./hooks/usIsDesktop";
import { createNavbarItems, getAllNavItems } from "./utils/navbatUtils";
import { iconComponents } from "./components/icons";

const Navbar: React.FC = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const { isDesktop, isClient } = useIsDesktop();
  const router = useTransitionRouter();
  const pathname = usePathname();

  const navItems = useMemo(() => createNavbarItems(iconComponents), []);
  const allNavItems = useMemo(() => getAllNavItems(navItems), [navItems]);

  const handleNavClick = useCallback(
    (link: string) => {
      setIsLeftSidebarOpen(false);
      setIsRightSidebarOpen(false);
      router.push(link, { onTransitionReady: slideInOut });
    },
    [router]
  );

  const toggleLeftSidebar = useCallback(() => {
    setIsLeftSidebarOpen(prev => !prev);
    setIsRightSidebarOpen(false);
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarOpen(prev => !prev);
    setIsLeftSidebarOpen(false);
  }, []);

  const closeSidebars = useCallback(() => {
    setIsLeftSidebarOpen(false);
    setIsRightSidebarOpen(false);
  }, []);

  // Body overflow management for sidebars
  useEffect(() => {
    if (isLeftSidebarOpen || isRightSidebarOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isLeftSidebarOpen, isRightSidebarOpen]);

  // Close sidebars on route change
  useEffect(() => {
    closeSidebars();
  }, [pathname, closeSidebars]);

  // Loading state
  if (!isClient) {
    return (
      <main>
        <div className="flex items-center justify-between px-4 lg:px-8 mt-6">
          <LoadingPlaceholder className="w-6 h-6" />
          <Logo currentPath={pathname} />
          <LoadingPlaceholder className="w-6 h-6" />
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="flex items-center justify-between px-4 lg:px-8 mt-6 relative z-50">
        <SidebarToggle
          onClick={toggleLeftSidebar}
          isOpen={isLeftSidebarOpen}
          position="left"
        />
        <Logo currentPath={pathname} />
        <SidebarToggle
          onClick={toggleRightSidebar}
          isOpen={isRightSidebarOpen}
          position="right"
        />
      </div>

      {isDesktop ? (
        <DesktopSidebar
          isLeftOpen={isLeftSidebarOpen}
          isRightOpen={isRightSidebarOpen}
          onNavClick={handleNavClick}
          onClose={closeSidebars}
          navItems={navItems}
          currentPath={pathname}
        />
      ) : (
        <MobileSidebar
          isLeftOpen={isLeftSidebarOpen}
          isRightOpen={isRightSidebarOpen}
          onNavClick={handleNavClick}
          onClose={closeSidebars}
          allNavItems={allNavItems}
          currentPath={pathname}
        />
      )}
    </main>
  );
};

export default React.memo(Navbar);