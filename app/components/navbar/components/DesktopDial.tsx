import React, { useRef, useCallback, memo, Suspense, useEffect, useState } from "react";
import {
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import {
  CENTER_SIZE_CLOSED,
  INNER_CIRCLE_SIZE,
  BUTTON_SIZE,
} from "../utils/constants";
import { navItems, NAV_ITEMS_COUNT } from "../utils/navItems";
import { NavButton } from "./NavButton";
import { Tooltip } from "./Tooltip";
import type { NavItem } from "../types/navbarTypes";

type Item = NavItem & {
  displayIndex: number;
  actualIndex: number;
};

interface DesktopDialProps {
  readonly isExpanded: boolean;
  readonly setIsExpanded: (value: boolean) => void;
  readonly isLoggedIn: boolean;
  readonly pathname: string;
  readonly onNavigation: (item: any) => void;
  readonly onInnerCircleNavigation: () => void;
  readonly onHomeNavigation: () => void;
}

const DesktopDialComponent: React.FC<DesktopDialProps> = ({
  isExpanded, // This will always be true now
  setIsExpanded, // This will be a no-op function
  isLoggedIn,
  pathname,
  onNavigation,
  onInnerCircleNavigation,
  onHomeNavigation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get all navigation items without rotation logic
  const getAllItems = useCallback(() => {
    return navItems.map((item, index) => ({
      ...item,
      displayIndex: index,
      actualIndex: index,
    }));
  }, []);

  // Calculate button positions for full-width layout with responsive sizing
  const getButtonPosition = useCallback((displayIndex: number, containerWidth: number) => {
    const totalItems = NAV_ITEMS_COUNT;
    
    // Responsive calculations based on screen width
    const baseMargin = Math.max(120, containerWidth * 0.08); // 8% margin or minimum 120px
    const profileSpace = Math.max(80, containerWidth * 0.06); // 6% or minimum 80px
    const availableWidth = containerWidth - baseMargin - profileSpace;
    
    // Adjust spacing based on container width
    const minSpacing = 60; // Minimum space between items
    const maxSpacing = 120; // Maximum space between items
    const calculatedSpacing = Math.min(maxSpacing, Math.max(minSpacing, availableWidth / totalItems));
    
    const startX = -availableWidth / 2;
    const spacing = totalItems > 1 ? Math.min(calculatedSpacing, availableWidth / (totalItems - 1)) : 0;
    
    const x = startX + displayIndex * spacing;
    const y = 0;
    const zIndex = 100 + displayIndex;
    
    return { 
      x, 
      y, 
      zIndex,
      angle: 0
    };
  }, []);

  const allItems = getAllItems();

  // Remove toggle functionality - navbar stays expanded
  const toggleExpanded = useCallback(() => {
    // No-op: We don't want to allow collapsing
  }, []);

  const handleInnerCircleEnter = useCallback(() => {
    // Handle hover state if needed
  }, []);

  const handleInnerCircleLeave = useCallback(() => {
    // Handle hover state if needed
  }, []);

  const innerCircleHoverId = isLoggedIn ? "inner-profile" : "inner-signup";

  // Responsive container dimensions
  const getContainerDimensions = useCallback(() => {
    if (typeof window === 'undefined') return { width: 1200, height: 120 };
    
    const screenWidth = window.innerWidth;
    
    // Responsive height based on screen width
    let height = 120;
    if (screenWidth >= 2560) height = 160;
    else if (screenWidth >= 1920) height = 140;
    else if (screenWidth < 1200) height = 100; // Smaller height for smaller screens
    
    return {
      width: screenWidth,
      height: height,
    };
  }, []);

  const containerDimensions = getContainerDimensions();

  return (
    <>
      <style jsx>{`
        @keyframes neonPulse {
          0%,
          100% {
            filter: drop-shadow(0 0 8px currentColor)
              drop-shadow(0 0 16px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 12px currentColor)
              drop-shadow(0 0 24px currentColor);
          }
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes signupGlow {
          0%,
          100% {
            box-shadow: 0 0 15px #28a745, 0 0 30px #28a74540, 0 0 45px #28a74520,
              inset 0 0 15px #28a74520;
          }
          50% {
            box-shadow: 0 0 25px #28a745, 0 0 50px #28a74560, 0 0 75px #28a74540,
              inset 0 0 25px #28a74530;
          }
        }

        @keyframes profileGlow {
          0%,
          100% {
            box-shadow: 0 0 15px #4a90e2, 0 0 30px #4a90e240, 0 0 45px #4a90e220,
              inset 0 0 15px #4a90e220;
          }
          50% {
            box-shadow: 0 0 25px #4a90e2, 0 0 50px #4a90e260, 0 0 75px #4a90e240,
              inset 0 0 25px #4a90e230;
          }
        }

        .cyberpunk-dial {
          transform-style: preserve-3d;
          perspective: 1000px;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .full-width-container {
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 120px;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            90deg,
            rgba(26, 26, 46, 0.1) 0%,
            rgba(26, 26, 46, 0.8) 20%,
            rgba(26, 26, 46, 0.95) 50%,
            rgba(26, 26, 46, 0.8) 80%,
            rgba(26, 26, 46, 0.1) 100%
          );
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #00ffff20;
        }

        .neon-glow-cyan {
          box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff40, 0 0 30px #00ffff20,
            inset 0 0 10px #00ffff20;
        }

        .neon-glow-magenta {
          box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff40, 0 0 30px #ff00ff20,
            inset 0 0 10px #ff00ff20;
        }

        .neon-glow-amber {
          box-shadow: 0 0 10px #ffbf00, 0 0 20px #ffbf0040, 0 0 30px #ffbf0020,
            inset 0 0 10px #ffbf0020;
        }

        .cyberpunk-track {
          background: linear-gradient(
            90deg,
            #1a1a2e 0%,
            #16213e 25%,
            #0f0f23 50%,
            #16213e 75%,
            #1a1a2e 100%
          );
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
          border-radius: 60px;
          height: 80px;
          border: 1px solid #00ffff40;
        }

        .cyberpunk-inner-track {
          background: linear-gradient(
            90deg,
            #e8e8e8 0%,
            #f5f5f5 50%,
            #ffffff 100%
          );
          position: relative;
          overflow: hidden;
          border-radius: 50px;
          height: 60px;
          border: 1px solid #ffbf0060;
          cursor: pointer;
        }

        .cyberpunk-inner-track::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #00ffff10 50%,
            transparent 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cyberpunk-inner-track:hover::before {
          opacity: 1;
        }

        .center-hub-cyberpunk {
          background: radial-gradient(
            circle at 30% 30%,
            #2a2a4e 0%,
            #1a1a2e 50%,
            #0f0f23 100%
          );
          border: 2px solid #00ffff;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 
            0 0 15px #00ffff80,
            inset 0 0 10px #00ffff20,
            0 0 25px #00ffff40;
        }

        .center-hub-cyberpunk::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            #00ffff40 60deg,
            transparent 120deg
          );
          animation: spin 4s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .center-hub-cyberpunk:hover::before {
          opacity: 1;
        }

        .center-hub-cyberpunk:hover {
          transform: scale(1.1);
          box-shadow: 0 0 20px #00ffff80, inset 0 0 20px #00ffff20,
            0 0 40px #00ffff40;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .inner-profile-cyberpunk {
          background: linear-gradient(
            135deg,
            #4a90e2 0%,
            #357abd 50%,
            #2563eb 100%
          );
          border: 2px solid #4a90e2;
          position: relative;
          overflow: hidden;
          border-radius: 50%;
          cursor: pointer;
          animation: profileGlow 3s ease-in-out infinite;
        }

        .inner-profile-cyberpunk::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            transparent 0%,
            #ffffff20 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .inner-profile-cyberpunk:hover::before {
          transform: translateX(100%);
        }

        .inner-profile-cyberpunk:hover {
          transform: scale(1.15);
          box-shadow: 0 0 20px #4a90e280, inset 0 0 20px #ffffff20,
            0 0 40px #4a90e240;
          animation: none;
        }

        .inner-profile-cyberpunk.signup {
          background: linear-gradient(
            135deg,
            #28a745 0%,
            #1e7e34 50%,
            #16a085 100%
          );
          border: 2px solid #28a745;
          animation: signupGlow 3s ease-in-out infinite;
        }

        .inner-profile-cyberpunk.signup:hover {
          box-shadow: 0 0 20px #28a74580, inset 0 0 20px #ffffff20,
            0 0 40px #28a74540;
          animation: none;
        }

        /* Hide on tablet and mobile */
        @media (max-width: 1023px) {
          .dial-container {
            display: none !important;
          }
        }
      `}</style>

      {/* Always render as expanded - removed conditional rendering */}
      <div
        className="dial-container cyberpunk-dial full-width-container"
        ref={containerRef}
      >
        <div
          ref={dialRef}
          className="dial-wrapper"
          style={{
            width: containerDimensions.width,
            height: containerDimensions.height,
            position: 'relative',
          }}
        >
          {/* Background Track - responsive width and positioning */}
          <div
            className="cyberpunk-track neon-glow-cyan"
            style={{
              position: 'absolute',
              width: `${Math.min(90, Math.max(70, (containerDimensions.width - 200) / containerDimensions.width * 100))}%`,
              left: `${Math.max(5, (200 / containerDimensions.width * 100) / 2)}%`,
              top: `${containerDimensions.height * 0.167}px`, // 20/120 = 0.167
              opacity: 1,
            }}
          />

          {/* Inner Track - responsive sizing */}
          <div
            className="cyberpunk-inner-track neon-glow-amber"
            onClick={onHomeNavigation}
            style={{
              position: 'absolute',
              width: `${Math.min(85, Math.max(65, (containerDimensions.width - 240) / containerDimensions.width * 100))}%`,
              left: `${Math.max(7.5, (240 / containerDimensions.width * 100) / 2)}%`,
              top: `${containerDimensions.height * 0.25}px`, // 30/120 = 0.25
              height: `${containerDimensions.height * 0.5}px`, // Responsive height
              opacity: 1,
            }}
          />

          {/* Inner Circle - responsive positioning */}
          <div
            style={{
              position: 'absolute',
              width: Math.max(50, Math.min(INNER_CIRCLE_SIZE, containerDimensions.width * 0.05)),
              height: Math.max(50, Math.min(INNER_CIRCLE_SIZE, containerDimensions.width * 0.05)),
              right: Math.max(15, containerDimensions.width * 0.015) + 'px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 180,
            }}
          >
            <Tooltip
              content={isLoggedIn ? "Profile" : "Sign Up"}
              show={false}
              isExpanded={true} // Always expanded
              buttonPosition={{ x: 0, y: 0 }}
            >
              <button
                onClick={onInnerCircleNavigation}
                onMouseEnter={handleInnerCircleEnter}
                onMouseLeave={handleInnerCircleLeave}
                className={`inner-profile-cyberpunk ${
                  !isLoggedIn ? "signup" : ""
                }`}
                style={{
                  width: "100%",
                  height: "100%",
                  transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 190,
                }}
                aria-label={isLoggedIn ? "Profile" : "Sign Up"}
              >
                <Suspense
                  fallback={
                    <div className="w-5 h-5 bg-gray-400 rounded animate-pulse" />
                  }
                >
                  {isLoggedIn ? (
                    <FaUser
                      className="text-white drop-shadow-lg"
                      size={20}
                    />
                  ) : (
                    <FaUserPlus
                      className="text-white drop-shadow-lg"
                      size={22}
                    />
                  )}
                </Suspense>
              </button>
            </Tooltip>
          </div>

          {/* Center Hub Button - responsive sizing and positioning */}
          <button
            onClick={onHomeNavigation}
            className="center-hub-cyberpunk neon-glow-cyan"
            style={{
              width: Math.max(60, Math.min(CENTER_SIZE_CLOSED, containerDimensions.width * 0.05)),
              height: Math.max(60, Math.min(CENTER_SIZE_CLOSED, containerDimensions.width * 0.05)),
              position: 'absolute',
              left: Math.max(15, containerDimensions.width * 0.015) + 'px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 200,
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            aria-label="Go to home"
          >
            <Suspense
              fallback={
                <div className="w-6 h-6 bg-gray-400 rounded animate-pulse" />
              }
            >
              <span 
                className="text-cyan-400 font-bold font-mono drop-shadow-lg"
                style={{ 
                  fontSize: `${Math.max(16, Math.min(24, containerDimensions.width * 0.018))}px` 
                }}
              >
                S
              </span>
            </Suspense>
          </button>

          {/* Navigation Buttons Container - responsive spacing */}
          <div
            className="nav-buttons-container"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: Math.max(90, containerDimensions.width * 0.08) + 'px',
              paddingRight: Math.max(70, containerDimensions.width * 0.06) + 'px',
            }}
          >
            {allItems.map((item: Item, index: number) => {
              const availableSpace = containerDimensions.width - Math.max(90, containerDimensions.width * 0.08) - Math.max(70, containerDimensions.width * 0.06);
              const position = getButtonPosition(item.displayIndex, availableSpace);
              const isActive = pathname === item.link;

              return (
                <NavButton
                  key={`${item.id}-${item.actualIndex}`}
                  item={item}
                  position={position}
                  isActive={isActive}
                  isExpanded={true}
                  isHovered={false}
                  index={index}
                  counterRotation={0}
                  onNavigation={onNavigation}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export const DesktopDial = memo(DesktopDialComponent);