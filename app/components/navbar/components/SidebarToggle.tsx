import React from "react";
import { iconComponents } from "./icons";

interface SidebarToggleProps {
  onClick: () => void;
  isOpen: boolean;
  position: "left" | "right";
}

export const SidebarToggle = React.memo<SidebarToggleProps>(
  ({ onClick, isOpen, position }) => {
    const { FaBars, FaTimes } = iconComponents;
    
    const baseClasses = "text-white hover:text-gray-300 transition-all duration-300 transform hover:scale-110 active:scale-95";
    const openClasses = isOpen ? "rotate-180" : "";
    
    return (
      <button
        className={`${baseClasses} ${openClasses} p-2 rounded-lg hover:bg-white hover:bg-opacity-10`}
        onClick={onClick}
        aria-label={`${isOpen ? "Close" : "Open"} ${position} sidebar`}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.position === nextProps.position
    );
  }
);

SidebarToggle.displayName = "SidebarToggle";