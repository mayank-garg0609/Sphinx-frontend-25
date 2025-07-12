"use client";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef } from "react";
import { useTeamState } from "./hooks/useTeamState";
import TeamNavigation from "./components/TeamNavigation";
import TeamMobileDropdown from "./components/TeamMobileDropdown";
import TeamContent from "./components/TeamContent";
import FixedBackgroundImage from "./components/BackgroundImage";

export default function Team() {
  const lenisRef = useRef(null);
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
    <div className="relative min-h-screen overflow-hidden">
      <FixedBackgroundImage />
      
      <ReactLenis root ref={lenisRef}>
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
      </ReactLenis>
    </div>
  );
}