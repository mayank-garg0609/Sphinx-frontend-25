import React from "react";
import { NavLink } from "./navlink";
import { UserButton } from "./userButton";
import { NavbarSection } from "../types/navbarTypes";

interface DesktopNavigationProps {
  onNavClick: (link: string) => void;
  sections: NavbarSection[];
  currentPath: string;
}

export const DesktopNavigation = React.memo<DesktopNavigationProps>(
  ({ onNavClick, sections, currentPath }) => (
    <>
      {sections.map(({ items, position, className, includeSignUp }) => (
        <div key={position} className={`hidden lg:block ${className}`}>
          <div
            className={`navbar-group ${position} text-white font-bold tracking-wider`}
          >
            {items.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onClick={onNavClick}
                currentPath={currentPath}
              />
            ))}
            {includeSignUp && <UserButton currentPath={currentPath} />}
          </div>
        </div>
      ))}
    </>
  ),
  (prevProps, nextProps) => {
    return prevProps.currentPath === nextProps.currentPath;
  }
);

DesktopNavigation.displayName = "DesktopNavigation";