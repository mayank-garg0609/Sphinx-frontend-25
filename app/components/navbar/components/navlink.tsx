import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { NavbarItem } from "../types/navbarTypes";
import { normalizePathname } from "../utils/navbatUtils";

interface NavLinkProps {
  item: NavbarItem;
  onClick?: (link: string) => void;
  className?: string;
  children?: React.ReactNode;
  currentPath: string;
}

export const NavLink = React.memo<NavLinkProps>(
  ({ item, onClick, className = "navbar-link", children, currentPath }) => {
    const isActive = useMemo(() => {
      if (item.external) return false;
      return normalizePathname(currentPath) === normalizePathname(item.link);
    }, [currentPath, item.external, item.link]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isActive) {
          e.preventDefault();
          return;
        }
        if (!item.external && onClick) {
          e.preventDefault();
          onClick(item.link);
        }
      },
      [item.external, item.link, onClick, isActive]
    );

    const linkClassName = useMemo(() => {
      if (isActive) {
        return `${className} opacity-50 cursor-not-allowed`;
      }
      return className;
    }, [className, isActive]);

    return (
      <Link
        href={item.link}
        onClick={handleClick}
        className={linkClassName}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        aria-disabled={isActive}
      >
        {children || (
          <div className="flex items-center gap-1">
            {item.icon ? item.icon : item.label}
          </div>
        )}
      </Link>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.link === nextProps.item.link &&
      prevProps.currentPath === nextProps.currentPath &&
      prevProps.className === nextProps.className
    );
  }
);

NavLink.displayName = "NavLink";