import { useState, useCallback, useMemo } from "react";
import { TeamSection } from "../types/teamTypes";
import { TEAM_SECTIONS } from "../utils/constants";

export const useTeamState = () => {
  const [view, setView] = useState<TeamSection>("core");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSectionChange = useCallback((section: TeamSection) => {
    setView(section);
  }, []);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const activeLabel = useMemo(() => TEAM_SECTIONS[view].label, [view]);

  return {
    view,
    setView,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSectionChange,
    handleDropdownToggle,
    activeLabel,
  };
};