import React, { memo, Suspense, useCallback } from "react";
import { NavItem } from "../types/navbarTypes";
import { Tooltip } from "./Tooltip";

interface NavButtonProps {
  readonly item: NavItem & {
    displayIndex: number;
    actualIndex?: number;
    isAnimating?: boolean;
  };
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly zIndex: number;
    readonly angle?: number;
  };
  readonly isActive: boolean;
  readonly isExpanded: boolean;
  readonly isHovered: boolean;
  readonly index: number;
  readonly counterRotation: number;
  readonly onNavigation: (item: NavItem) => void;
  readonly onMouseEnter: () => void;
  readonly onMouseLeave: () => void;
  readonly hoveredTooltip?: string | null;
  readonly onTooltipShow?: (itemId: string) => void;
  readonly onTooltipHide?: () => void;
}

const NavButtonComponent: React.FC<NavButtonProps> = ({
  item,
  position,
  isActive,
  isExpanded,
  index,
  onNavigation,
  onMouseEnter,
  onMouseLeave,
  hoveredTooltip,
  onTooltipShow,
  onTooltipHide,
}) => {
  const animationDelay = `${index * 60}ms`;

  const handleClick = useCallback(() => {
    // Hide tooltip immediately on click
    if (onTooltipHide) {
      onTooltipHide();
    }

    const cleanItem: NavItem = {
      id: item.id,
      label: item.label,
      link: item.link,
      icon: item.icon,
      ...(item.external && { external: item.external }),
    };
    onNavigation(cleanItem);
  }, [item, onNavigation, onTooltipHide]);

  const handleMouseEnter = useCallback(() => {
    onMouseEnter();
    if (onTooltipShow) {
      onTooltipShow(item.id);
    }
  }, [onMouseEnter, onTooltipShow, item.id]);

  const handleMouseLeave = useCallback(() => {
    onMouseLeave();
    if (onTooltipHide) {
      onTooltipHide();
    }
  }, [onMouseLeave, onTooltipHide]);

  const isTooltipVisible = hoveredTooltip === item.id;

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes elegantGlow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3),
              inset 0 0 15px rgba(255, 255, 255, 0.1),
              0 0 30px rgba(255, 255, 255, 0.15);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.15),
              0 0 40px rgba(255, 255, 255, 0.2);
          }
        }

        @keyframes activeElegantGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6),
              inset 0 0 20px rgba(139, 92, 246, 0.25),
              0 0 40px rgba(139, 92, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.8),
              inset 0 0 25px rgba(139, 92, 246, 0.35),
              0 0 60px rgba(139, 92, 246, 0.4);
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
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .elegant-nav-button {
          background: linear-gradient(
            135deg,
            #00ffcc 0%,
            #00ffcc 50%,
            #00ffcc 100%
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
          transform: translateZ(0);
          will-change: transform, box-shadow, background;
        }

        .elegant-nav-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(168, 85, 247, 0.15) 25%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(59, 130, 246, 0.15) 75%,
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
          background: linear-gradient(
            135deg,
            #1e293b 0%,
            #334155 25%,
            #475569 50%,
            #334155 75%,
            #1e293b 100%
          );
          border-color: #a78bfa;
          box-shadow: 0 8px 25px rgba(167, 139, 250, 0.4),
            inset 0 0 20px rgba(167, 139, 250, 0.15),
            0 12px 40px rgba(167, 139, 250, 0.2);
          animation: gentleFloat 2s ease-in-out infinite;
        }

        .elegant-nav-button:active {
          transform: translateZ(0) translateY(-1px);
          transition: transform 0.1s ease-out;
        }

        .elegant-nav-button.active {
          background: linear-gradient(
            135deg,
            #3730a3 0%,
            #4c1d95 25%,
            #5b21b6 50%,
            #4c1d95 75%,
            #3730a3 100%
          );
          border-color: #8b5cf6;
          animation: activeElegantGlow 2.5s ease-in-out infinite;
        }

        .elegant-nav-button.active:hover {
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.5),
            inset 0 0 25px rgba(139, 92, 246, 0.2),
            0 15px 50px rgba(139, 92, 246, 0.3);
          animation: activeElegantGlow 2.5s ease-in-out infinite,
            gentleFloat 2s ease-in-out infinite;
        }

        .nav-icon-elegant {
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          color: #333333;
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.2));
          z-index: 10;
          position: relative;
          transform: translateZ(0);
        }

        .elegant-nav-button:hover .nav-icon-elegant {
          color: #c4b5fd;
          filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.6))
            drop-shadow(0 0 15px rgba(167, 139, 250, 0.3));
          transform: translateZ(0) scale(1.1);
        }

        .elegant-nav-button.active .nav-icon-elegant {
          color: #ddd6fe;
          filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))
            drop-shadow(0 0 15px rgba(139, 92, 246, 0.3));
          transform: translateZ(0) scale(1.05);
        }

        /* Focus styles for accessibility */
        .elegant-nav-button:focus {
          outline: 2px solid #a78bfa;
          outline-offset: 4px;
        }

        .elegant-nav-button.active:focus {
          outline-color: #8b5cf6;
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
        show={isTooltipVisible}
        isExpanded={isExpanded}
        buttonPosition={{ x: 0, y: 0 }}
      >
        <button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`elegant-nav-button ${
            isActive ? "active" : ""
          } w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16`}
          aria-label={item.label}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          style={{
            opacity: isExpanded ? 1 : 0,
            transitionProperty: "all",
            transitionDuration: "0.5s",
            transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
            transitionDelay: animationDelay,
          }}
        >
          <Suspense
            fallback={
              <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-400 rounded animate-pulse" />
            }
          >
            <item.icon
              size={16}
              className="nav-icon-elegant text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl"
            />
          </Suspense>
        </button>
      </Tooltip>
    </div>
  );
};

export const NavButton = memo(NavButtonComponent);
