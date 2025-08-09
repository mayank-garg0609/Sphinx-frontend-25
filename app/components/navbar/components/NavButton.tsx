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
  const animationDelay = item.isAnimating ? `${index * 80}ms` : `${index * 40}ms`;
  
  const buttonStyle = {
    position: 'absolute' as const,
    width: 50,
    height: 50,
    left: 0,
    top: '50%',
    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
    opacity: isExpanded ? 1 : 0,
    zIndex: position.zIndex,
    transitionProperty: 'all',
    transitionDuration: item.isAnimating ? '0.6s' : '0.5s',
    transitionTimingFunction: item.isAnimating 
      ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
      : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    transitionDelay: animationDelay,
  };

  const handleClick = () => {
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
      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 
              0 0 10px #ffffff40,
              inset 0 0 10px #ffffff20,
              0 0 20px #ffffff20;
          }
          50% { 
            box-shadow: 
              0 0 20px #ffffff60,
              inset 0 0 15px #ffffff30,
              0 0 30px #ffffff30;
          }
        }

        @keyframes activeGlow {
          0%, 100% { 
            box-shadow: 
              0 0 15px #ff00ff80,
              inset 0 0 15px #ff00ff30,
              0 0 30px #ff00ff40;
          }
          50% { 
            box-shadow: 
              0 0 25px #ff00ff,
              inset 0 0 20px #ff00ff40,
              0 0 40px #ff00ff60;
          }
        }

        @keyframes hoverShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes clickRipple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .cyberpunk-nav-button {
          background: 
            linear-gradient(135deg, 
              #f8f9fa 0%, 
              #e9ecef 25%, 
              #ffffff 50%, 
              #f8f9fa 75%, 
              #e9ecef 100%
            );
          border: 2px solid #ffffff;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: pulseGlow 4s ease-in-out infinite;
          backdrop-filter: blur(5px);
        }

        .cyberpunk-nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            #00ffff20 25%,
            #ffffff40 50%,
            #ff00ff20 75%,
            transparent 100%
          );
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cyberpunk-nav-button:hover::before {
          opacity: 1;
          animation: hoverShimmer 1.5s ease-in-out infinite;
        }

        .cyberpunk-nav-button:hover {
          transform: scale(1.2);
          background: 
            linear-gradient(135deg, 
              #1a1a2e 0%, 
              #16213e 25%, 
              #0f0f23 50%, 
              #16213e 75%, 
              #1a1a2e 100%
            );
          border-color: #00ffff;
          box-shadow: 
            0 0 20px #00ffff80,
            inset 0 0 20px #00ffff30,
            0 0 40px #00ffff40;
          animation: none;
        }

        .cyberpunk-nav-button:active {
          transform: scale(1.1);
        }

        .cyberpunk-nav-button:active::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid #00ffff;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: clickRipple 0.6s ease-out;
        }

        .cyberpunk-nav-button.active {
          background: 
            linear-gradient(135deg, 
              #2d1b69 0%, 
              #1a1a2e 25%, 
              #16213e 50%, 
              #1a1a2e 75%, 
              #2d1b69 100%
            );
          border-color: #ff00ff;
          animation: activeGlow 2s ease-in-out infinite;
        }

        .cyberpunk-nav-button.active:hover {
          box-shadow: 
            0 0 25px #ff00ff,
            inset 0 0 20px #ff00ff40,
            0 0 50px #ff00ff60;
        }

        .nav-icon-cyberpunk {
          transition: all 0.3s ease;
          color: #333333;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
          z-index: 10;
          position: relative;
        }

        .cyberpunk-nav-button:hover .nav-icon-cyberpunk {
          color: #00ffff;
          filter: 
            drop-shadow(0 0 5px #00ffff) 
            drop-shadow(0 0 10px #00ffff40);
        }

        .cyberpunk-nav-button.active .nav-icon-cyberpunk {
          color: #ff00ff;
          filter: 
            drop-shadow(0 0 5px #ff00ff) 
            drop-shadow(0 0 10px #ff00ff40);
        }
      `}</style>
      
      <Tooltip 
        content={item.label} 
        show={isHovered}
        isExpanded={isExpanded}
        buttonPosition={position}
      >
        <button
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={`cyberpunk-nav-button ${isActive ? 'active' : ''}`}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transform: 'rotate(0deg)',
          }}
          aria-label={item.label}
        >
          <Suspense fallback={<div className="w-5 h-5 bg-gray-400 rounded animate-pulse" />}>
            <item.icon size={20} className="nav-icon-cyberpunk" />
          </Suspense>
        </button>
      </Tooltip>
    </div>
  );
};

export const NavButton = memo(NavButtonComponent);