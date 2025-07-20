import React from "react";
import { iconComponents } from "./icons";

interface MobileMenuButtonProps {
  onClick: () => void;
}

export const MobileMenuButton = React.memo<MobileMenuButtonProps>(
  ({ onClick }) => {
    const { FaBars } = iconComponents;

    return (
      <button
        className="lg:hidden text-white hover:text-gray-300 transition-colors"
        onClick={onClick}
        aria-label="Open navigation menu"
      >
        <FaBars size={24} />
      </button>
    );
  },
  () => true
);

MobileMenuButton.displayName = "MobileMenuButton";