import { useState, useCallback, useMemo, useEffect } from "react";
import { TeamSection } from "../types/teamTypes";
import { TEAM_SECTIONS } from "../utils/constants";

interface UseTeamStateReturn {
  view: TeamSection;
  setView: React.Dispatch<React.SetStateAction<TeamSection>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSectionChange: (section: TeamSection) => void;
  handleDropdownToggle: () => void;
  activeLabel: string;
}

export const useTeamState = (): UseTeamStateReturn => {
  const [view, setView] = useState<TeamSection>("core");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element)?.closest('[role="listbox"]') && !(event.target as Element)?.closest('button[aria-haspopup="listbox"]')) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDropdownOpen]);

  const handleSectionChange = useCallback((section: TeamSection) => {
    if (section !== view) {
      setView(section);
      setIsDropdownOpen(false);
    }
  }, [view]);

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const activeLabel = useMemo(() => {
    return TEAM_SECTIONS[view]?.label || "Select Section";
  }, [view]);

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