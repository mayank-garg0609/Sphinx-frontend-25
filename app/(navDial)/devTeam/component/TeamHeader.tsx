import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/image/logo.png";
import { useMediaQuery } from "../hooks/useMediaQuery";

const TeamHeader: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1440px)");
  const isExtraLarge = useMediaQuery("(min-width: 1920px)");

  // Responsive styling based on screen size
  const getResponsiveStyles = () => {
    if (isMobile) {
      return {
        container: "px-4 py-4",
        logo: "w-12 h-12",
        text: "text-sm font-medium tracking-[0.15em]"
      };
    }
    if (isTablet) {
      return {
        container: "px-8 py-6",
        logo: "w-14 h-14",
        text: "text-sm font-medium tracking-[0.2em]"
      };
    }
    if (isExtraLarge) {
      return {
        container: "px-16 py-10",
        logo: "w-20 h-20",
        text: "text-lg font-medium tracking-[0.2em]"
      };
    }
    if (isLargeDesktop) {
      return {
        container: "px-12 py-8",
        logo: "w-16 h-16",
        text: "text-base font-medium tracking-[0.2em]"
      };
    }
    // Default desktop
    return {
      container: "px-8 py-6",
      logo: "w-16 h-16",
      text: "text-base font-medium tracking-[0.2em]"
    };
  };

  const styles = getResponsiveStyles();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
      <div className={`max-w-full mx-auto flex items-center justify-between ${styles.container}`}>
        <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-4'}`}>
          <div className={`${styles.logo} bg-white rounded-full overflow-hidden flex items-center justify-center`}>
            <Image
              src={logo}
              alt="Sphinx 25 Logo"
              width={isExtraLarge ? 80 : isLargeDesktop ? 64 : isMobile ? 48 : 64}
              height={isExtraLarge ? 80 : isLargeDesktop ? 64 : isMobile ? 48 : 64}
              className="object-cover"
              priority
            />
          </div>
          <Link 
            className={`${styles.text} text-white/90 hover:text-white transition-colors`} 
            href="/"
          >
            SPHINX/25
          </Link>
        </div>

        {/* Mobile menu button (if needed in the future) */}
        {isMobile && (
          <button
            className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default TeamHeader;