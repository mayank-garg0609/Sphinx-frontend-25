import React, { memo, Suspense, useState, useCallback } from 'react';
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
  index,
  onNavigation,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const animationDelay = `${index * 60}ms`; // Slightly increased delay for smoother staggered animation
  
  const buttonStyle = {
    position: 'absolute' as const,
    width: 54, // Slightly larger for better touch target
    height: 54,
    left: '50%',
    top: '50%',
    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
    opacity: isExpanded ? 1 : 0,
    zIndex: position.zIndex,
    transitionProperty: 'all',
    transitionDuration: '0.5s', // Smoother transition
    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)', // More elegant easing
    transitionDelay: animationDelay,
  };

  const handleClick = useCallback(() => {
    const cleanItem: NavItem = {
      id: item.id,
      label: item.label,
      link: item.link,
      icon: item.icon,
      ...(item.external && { external: item.external })
    };
    onNavigation(cleanItem);
  }, [item, onNavigation]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div style={buttonStyle}>
      <style jsx>{`
        @keyframes elegantGlow {
          0%, 100% { 
            box-shadow: 
              0 0 15px rgba(255, 255, 255, 0.3),
              inset 0 0 15px rgba(255, 255, 255, 0.1),
              0 0 30px rgba(255, 255, 255, 0.15);
          }
          50% { 
            box-shadow: 
              0 0 20px rgba(255, 255, 255, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.15),
              0 0 40px rgba(255, 255, 255, 0.2);
          }
        }

        @keyframes activeElegantGlow {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(255, 0, 255, 0.6),
              inset 0 0 20px rgba(255, 0, 255, 0.25),
              0 0 40px rgba(255, 0, 255, 0.3);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(255, 0, 255, 0.8),
              inset 0 0 25px rgba(255, 0, 255, 0.35),
              0 0 60px rgba(255, 0, 255, 0.4);
          }
        }

        @keyframes subtleShimmer {
          0% { 
            background-position: -200% center; 
          }
          100% { 
            background-position: 200% center; 
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .elegant-nav-button {
          background: 
            linear-gradient(135deg, 
              #f8f9fa 0%, 
              #e9ecef 25%, 
              #ffffff 50%, 
              #f8f9fa 75%, 
              #e9ecef 100%
            );
          border: 2px solid rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          animation: elegantGlow 4s ease-in-out infinite;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          width: 100%;
          height: 100%;
          transform: translateZ(0);
          will-change: transform, box-shadow, background;
        }

        .elegant-nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(0, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 0, 255, 0.1) 75%,
            transparent 100%
          );
          background-size: 300% 300%;
          opacity: 0;
          transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          border-radius: inherit;
        }

        .elegant-nav-button:hover::before {
          opacity: 1;
          animation: subtleShimmer 2s ease-in-out infinite;
        }

        .elegant-nav-button:hover {
          transform: translateZ(0) translateY(-3px);
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
            0 8px 25px rgba(0, 255, 255, 0.4),
            inset 0 0 20px rgba(0, 255, 255, 0.15),
            0 12px 40px rgba(0, 255, 255, 0.2);
          animation: gentleFloat 2s ease-in-out infinite;
        }

        .elegant-nav-button:active {
          transform: translateZ(0) translateY(-1px);
          transition: transform 0.1s ease-out;
        }

        .elegant-nav-button.active {
          background: 
            linear-gradient(135deg, 
              #2d1b69 0%, 
              #1a1a2e 25%, 
              #16213e 50%, 
              #1a1a2e 75%, 
              #2d1b69 100%
            );
          border-color: #ff00ff;
          animation: activeElegantGlow 2.5s ease-in-out infinite;
        }

        .elegant-nav-button.active:hover {
          box-shadow: 
            0 10px 30px rgba(255, 0, 255, 0.5),
            inset 0 0 25px rgba(255, 0, 255, 0.2),
            0 15px 50px rgba(255, 0, 255, 0.3);
          animation: activeElegantGlow 2.5s ease-in-out infinite, gentleFloat 2s ease-in-out infinite;
        }

        .nav-icon-elegant {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          color: #333333;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.2));
          z-index: 10;
          position: relative;
          transform: translateZ(0);
        }

        .elegant-nav-button:hover .nav-icon-elegant {
          color: #00ffff;
          filter: 
            drop-shadow(0 0 8px rgba(0, 255, 255, 0.6)) 
            drop-shadow(0 0 15px rgba(0, 255, 255, 0.3));
          transform: translateZ(0) scale(1.1);
        }

        .elegant-nav-button.active .nav-icon-elegant {
          color: #ff00ff;
          filter: 
            drop-shadow(0 0 8px rgba(255, 0, 255, 0.6)) 
            drop-shadow(0 0 15px rgba(255, 0, 255, 0.3));
          transform: translateZ(0) scale(1.05);
        }

        /* Focus styles for accessibility */
        .elegant-nav-button:focus {
          outline: 2px solid #00ffff;
          outline-offset: 4px;
        }

        .elegant-nav-button.active:focus {
          outline-color: #ff00ff;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .elegant-nav-button,
          .elegant-nav-button:hover,
          .elegant-nav-button.active {
            animation: none !important;
            transition: box-shadow 0.2s ease !important;
          }
          
          .elegant-nav-button:hover {
            transform: translateZ(0) translateY(-1px);
          }
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`elegant-nav-button ${isActive ? 'active' : ''}`}
          aria-label={item.label}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          <Suspense fallback={<div className="w-5 h-5 bg-gray-400 rounded animate-pulse" />}>
            <item.icon size={22} className="nav-icon-elegant" />
          </Suspense>
        </button>
      </Tooltip>
    </div>
  );
};

export const NavButton = memo(NavButtonComponent);