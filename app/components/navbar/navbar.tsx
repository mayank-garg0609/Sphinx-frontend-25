"use client";

import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useDesktop } from "./hooks/useDesktop";
import { useNavigation } from "./hooks/useNavigation";
import { DesktopDial } from "./components/DesktopDial";
import { MobileMenu } from "./components/MobileMenu";
import { navbarStyles } from "./styles/navbar";

const Navbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const { isDesktop, isClient } = useDesktop();
  const { pathname, handleNavigation, handleInnerCircleNavigation, navigateHome } = useNavigation(
    setIsExpanded,
    setIsMobileMenuOpen
  );

  const onInnerCircleNavigation = () => handleInnerCircleNavigation(isLoggedIn);

  if (!isClient) {
    return (
      <div className="flex items-center justify-between px-4 lg:justify-center lg:gap-3 mt-6">
        <div className="flex items-center gap-2 justify-center lg:mx-0">
          <h1 className="text-3xl font-bold text-white">Sphinx'25</h1>
        </div>
        <div className="w-4 lg:hidden" />
        <div className="lg:hidden w-6 h-6 bg-gray-400 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <style jsx>{navbarStyles}</style>

      <div className="flex items-center justify-between px-4 lg:justify-center lg:gap-3 mt-6">
        <div className="flex items-center gap-2 justify-center lg:mx-0">
          <button
            onClick={navigateHome}
            className="text-3xl font-bold text-white hover:opacity-80 transition-opacity"
          >
            Sphinx'25
          </button>
        </div>

        {!isDesktop && (
          <button
            className="text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <FaBars size={24} />
          </button>
        )}
      </div>

      {isDesktop && (
        <DesktopDial
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isLoggedIn={isLoggedIn}
          pathname={pathname}
          onNavigation={handleNavigation}
          onInnerCircleNavigation={onInnerCircleNavigation}
          onHomeNavigation={navigateHome}
        />
      )}

      {!isDesktop && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          pathname={pathname}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          onNavigation={handleNavigation}
          onInnerCircleNavigation={onInnerCircleNavigation}
        />
      )}
    </>
  );
};

export default Navbar;