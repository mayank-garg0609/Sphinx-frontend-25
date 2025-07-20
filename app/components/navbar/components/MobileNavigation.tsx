import React, { useEffect } from "react";
import { NavLink } from "./navlink";
import { UserButton } from "./userButton";
import { iconComponents } from "./icons";
import { NavbarItem } from "../types/navbarTypes";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (link: string) => void;
  allNavItems: NavbarItem[];
  currentPath: string;
}

export const MobileNavigation = React.memo<MobileNavigationProps>(
  ({ isOpen, onClose, onNavClick, allNavItems, currentPath }) => {
    const { FaTimes } = iconComponents;

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
      }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-90 text-white z-50">
        <button
          className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <FaTimes size={32} />
        </button>
        <nav className="flex flex-col items-center justify-center gap-1 mt-6 w-full">
          {allNavItems.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              onClick={onNavClick}
              currentPath={currentPath}
              className="w-full text-center py-2 text-xs font-semibold tracking-wide rounded-md hover:bg-white hover:text-black transition-all duration-200 active:scale-95"
            >
              <div className="flex justify-center items-center gap-2">
                {item.icon}
                {item.label}
              </div>
            </NavLink>
          ))}
          <UserButton
            mobile
            onClick={onClose}
            currentPath={currentPath}
          />
        </nav>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isOpen === nextProps.isOpen &&
      prevProps.currentPath === nextProps.currentPath
    );
  }
);

MobileNavigation.displayName = "MobileNavigation";