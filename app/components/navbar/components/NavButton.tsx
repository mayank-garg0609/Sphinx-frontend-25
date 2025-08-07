import React, { memo, Suspense } from 'react';
import { NavItem } from '../types/navbarTypes';
import { Tooltip } from './Tooltip';

interface NavButtonProps {
  readonly item: NavItem & { displayIndex: number };
  readonly position: { readonly x: number; readonly y: number; readonly zIndex: number };
  readonly isActive: boolean;
  readonly isExpanded: boolean;
  readonly isHovered: boolean;
  readonly index: number;
  readonly onNavigation: (item: NavItem) => void;
  readonly onMouseEnter: () => void;
  readonly onMouseLeave: () => void;
}

const NavButtonComponent: React.FC<NavButtonProps> = ({
  item,
  position,
  isActive,
  isExpanded,
  isHovered,
  index,
  onNavigation,
  onMouseEnter,
  onMouseLeave,
}) => {
  const buttonStyle = {
    position: 'absolute' as const,
    width: 50, // BUTTON_SIZE constant
    height: 50,
    left: 0,
    top: '50%',
    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
    opacity: isExpanded ? 1 : 0,
    visibility: (isExpanded ? 'visible' : 'hidden') as const,
    zIndex: position.zIndex,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: `${index * 30}ms`,
  };

  const handleClick = () => onNavigation(item);

  return (
    <div style={buttonStyle}>
      <button
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`nav-button ${isActive ? 'active' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
        aria-label={item.label}
      >
        <Suspense fallback={<div className="w-5 h-5 bg-gray-400 rounded animate-pulse" />}>
          <item.icon size={20} className="nav-icon" />
        </Suspense>
        
        <Tooltip content={item.label} show={isHovered}>
          <></>
        </Tooltip>
      </button>
    </div>
  );
};

export const NavButton = memo(NavButtonComponent);