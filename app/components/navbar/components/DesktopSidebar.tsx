import React, { useEffect } from "react";
import { NavLink } from "./navlink";
import { UserButton } from "./userButton";
import { NavbarItem } from "../types/navbarTypes";

interface DesktopSidebarProps {
  isLeftOpen: boolean;
  isRightOpen: boolean;
  onNavClick: (link: string) => void;
  onClose: () => void;
  navItems: Record<string, NavbarItem[]>;
  currentPath: string;
}

export const DesktopSidebar = React.memo<DesktopSidebarProps>(
  ({ isLeftOpen, isRightOpen, onNavClick, onClose, navItems, currentPath }) => {
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

    return (
      <>
        {/* Overlay */}
        {(isLeftOpen || isRightOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={onClose}
          />
        )}

        {/* Left Sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            isLeftOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 pt-20">
            <h2 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
              Navigation
            </h2>
            
            <div className="space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Main</h3>
                <div className="space-y-2">
                  {[...navItems.TL, ...navItems.TR].map((item) => (
                    <NavLink
                      key={item.label}
                      item={item}
                      onClick={onNavClick}
                      currentPath={currentPath}
                      className="sidebar-link block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    />
                  ))}
                </div>
              </div>

              {/* User Section */}
              <div className="border-t border-gray-700 pt-4">
                <UserButton currentPath={currentPath} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
            isRightOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 pt-20">
            <h2 className="text-2xl font-bold mb-8 text-center border-b border-gray-700 pb-4">
              More
            </h2>
            
            <div className="space-y-6">
              {/* Info Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Information</h3>
                <div className="space-y-2">
                  {navItems.BL.map((item) => (
                    <NavLink
                      key={item.label}
                      item={item}
                      onClick={onNavClick}
                      currentPath={currentPath}
                      className="sidebar-link block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    />
                  ))}
                </div>
              </div>

              {/* Team & Social */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-300">Team & Social</h3>
                <div className="space-y-2">
                  {navItems.BR.map((item) => (
                    <NavLink
                      key={item.label}
                      item={item}
                      onClick={onNavClick}
                      currentPath={currentPath}
                      className={`sidebar-link block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                        item.external ? "hover:bg-blue-600" : "hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  ))}
                </div>
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

DesktopSidebar.displayName = "DesktopSidebar";