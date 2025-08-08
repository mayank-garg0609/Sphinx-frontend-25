import React, { memo, Suspense } from 'react';
import { NavItem } from '../types/navbarTypes';
import { Tooltip } from './Tooltip';

interface NavButtonProps {
  readonly item: NavItem & { 
    displayIndex: number; 
    actualIndex?: number; 
    isAnimating?: boolean;
  };
  readonly position: { readonly x: number; readonly y: number; readonly zIndex: number; readonly angle?: number };
  readonly isActive: boolean;
  readonly isExpanded: boolean;
  readonly isHovered: boolean;
  readonly index: number;
  readonly counterRotation: number;
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
  counterRotation,
  onNavigation,
  onMouseEnter,
  onMouseLeave,
}) => {
  // Calculate staggered animation delay for smooth one-by-one movement
  const animationDelay = item.isAnimating ? `${index * 60}ms` : `${index * 30}ms`;
  
  const buttonStyle = {
    position: 'absolute' as const,
    width: 50, // BUTTON_SIZE constant
    height: 50,
    left: 0,
    top: '50%',
    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
    opacity: isExpanded ? 1 : 0,
    visibility: (isExpanded ? 'visible' : 'hidden') ,
    zIndex: position.zIndex,
    transition: item.isAnimating 
      ? 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
      : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: animationDelay,
  };

  const handleClick = () => {
    // Create a clean NavItem object without the extra properties
    const cleanItem: NavItem = {
      id: item.id,
      label: item.label,
      link: item.link,
      icon: item.icon,
      ...(item.external && { external: item.external })
    };
    onNavigation(cleanItem);
  };

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
          // Icons stay straight - no rotation applied
          transform: 'rotate(0deg)',
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