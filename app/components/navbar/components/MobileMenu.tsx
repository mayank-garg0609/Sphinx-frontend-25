import React, { useEffect } from "react";
import { FaTimes, FaUser, FaUserPlus } from "react-icons/fa";
import { navItems } from "../utils/navItems";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  onNavigation: (item: any) => void;
  onInnerCircleNavigation: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  pathname,
  isLoggedIn,
  setIsLoggedIn,
  onNavigation,
  onInnerCircleNavigation,
}) => {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      document.body.classList.add("overflow-hidden");
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.classList.remove("overflow-hidden");
      };
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
        {navItems.map((item) => {
          const isActive = pathname === item.link;
          return (
            <button
              key={item.id}
              onClick={() => onNavigation(item)}
              className={`w-full text-center py-2 text-xs font-semibold tracking-wide rounded-md hover:bg-white hover:text-black transition-all duration-200 active:scale-95 ${
                isActive ? "bg-white text-black" : ""
              }`}
            >
              <div className="flex justify-center items-center gap-2">
                <item.icon size={16} />
                {item.label}
              </div>
            </button>
          );
        })}
        
        {/* User Button for Mobile */}
        <button
          onClick={onInnerCircleNavigation}
          className="mt-6 w-80 h-20 py-3 border border-white rounded-xl text-2xl font-semibold bg-transparent text-white hover:bg-white hover:text-black transition-all duration-200 ease-in-out active:scale-95 text-center flex items-center justify-center gap-2"
        >
          {isLoggedIn ? <FaUser size={16} /> : <FaUserPlus size={20} />}
          <span>{isLoggedIn ? "Logout" : "Sign Up"}</span>
        </button>

        {/* Demo Auth toggle */}
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="mt-4 px-4 py-2 text-sm bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        >
          Demo: {isLoggedIn ? "Switch to Not Logged" : "Switch to Logged In"}
        </button>
      </nav>
    </div>
  );
}