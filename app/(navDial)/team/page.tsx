"use client";
import React, { useRef, Suspense } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useTeamState } from "./hooks/useTeamState";
import TeamNavigation from "./components/TeamNavigation";
import TeamMobileDropdown from "./components/TeamMobileDropdown";
import TeamContent from "./components/TeamContent";
import FixedBackgroundImage from "./components/BackgroundImage";
import TeamErrorBoundary from "./components/TeamErrorBoundary";

const TeamLoadingFallback: React.FC = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="text-white/70">Loading team members...</p>
    </div>
  </div>
));

TeamLoadingFallback.displayName = "TeamLoadingFallback";

const Team: React.FC = () => {
  const lenisRef = useRef<any>(null);
  const {
    view,
    setView,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSectionChange,
    handleDropdownToggle,
    activeLabel,
  } = useTeamState();

  return (
    <TeamErrorBoundary>
      <div className="relative min-h-screen overflow-hidden">
        <FixedBackgroundImage />
        
        <ReactLenis 
          root 
          ref={lenisRef}
          options={{
            lerp: 0.1,
            duration: 1.2,
            smoothWheel: true,
          }}
        >
          <Suspense fallback={<TeamLoadingFallback />}>
            <TeamNavigation view={view} setView={setView} />
            
            <TeamMobileDropdown
              view={view}
              activeLabel={activeLabel}
              isDropdownOpen={isDropdownOpen}
              handleDropdownToggle={handleDropdownToggle}
              handleSectionChange={handleSectionChange}
              setIsDropdownOpen={setIsDropdownOpen}
            />
            
            <TeamContent view={view} />
          </Suspense>
        </ReactLenis>
      </div>
    </TeamErrorBoundary>
  );
};

export default Team;