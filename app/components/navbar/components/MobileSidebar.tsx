import React, { useEffect } from "react";
import { NavLink } from "./navlink";
import { UserButton } from "./userButton";
import { NavbarItem } from "../types/navbarTypes";

interface MobileSidebarProps {
  isLeftOpen: boolean;
  isRightOpen: boolean;
  onNavClick: (link: string) => void;
  onClose: () => void;
  allNavItems: NavbarItem[];
  currentPath: string;
}

export const MobileSidebar = React.memo<MobileSidebarProps>(
  ({ isLeftOpen, isRightOpen, onNavClick, onClose, allNavItems, currentPath }) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && (isLeftOpen || isRightOpen)) {
          onClose();
        }
      };

      if (isLeftOpen || isRightOpen) {
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
      }
    }, [isLeftOpen, isRightOpen, onClose]);

    // For mobile, we'll use a single sidebar that can slide from either side
    const isOpen = isLeftOpen || isRightOpen;
    const slideDirection = isLeftOpen ? "left" : "right";

    if (!isOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Mobile Sidebar */}
        <div
          className={`fixed top-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            slideDirection === "left"
              ? `left-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
              : `right-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`
          }`}
        >
          <div className="p-4 pt-16">
            <h2 className="text-xl font-bold mb-6 text-center border-b border-gray-700 pb-3">
              Menu
            </h2>
            
            <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
              {allNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  item={item}
                  onClick={onNavClick}
                  currentPath={currentPath}
                  className="sidebar-link-mobile block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </NavLink>
              ))}
              
              {/* User Button */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <UserButton 
                  mobile 
                  onClick={onClose} 
                  currentPath={currentPath} 
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isLeftOpen === nextProps.isLeftOpen &&
      prevProps.isRightOpen === nextProps.isRightOpen &&
      prevProps.currentPath === nextProps.currentPath
    );
  }
);

MobileSidebar.displayName = "MobileSidebar";