import React, {
  useRef,
  useCallback,
  memo,
  Suspense,
  useEffect,
  useState,
} from "react";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { CENTER_SIZE_CLOSED, INNER_CIRCLE_SIZE } from "../utils/constants";
import { navItems } from "../utils/navItems";
import { NavButton } from "./NavButton";
import { Tooltip } from "./Tooltip";
import type { NavItem } from "../types/navbarTypes";
import Image from "next/image";
import logo from "@/public/image/logo.png";

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
  isExpanded,
  setIsExpanded,
  isLoggedIn,
  pathname,
  onNavigation,
  onInnerCircleNavigation,
  onHomeNavigation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get all navigation items without rotation logic
  const getAllItems = useCallback(() => {
    return navItems.map((item, index) => ({
      ...item,
      displayIndex: index,
      actualIndex: index,
    }));
  }, []);

  // Calculate responsive gap between items
  const getResponsiveGap = useCallback((containerWidth: number) => {
    if (containerWidth >= 2560) return "gap-x-8"; // Ultra-wide
    if (containerWidth >= 1920) return "gap-x-6"; // Large desktop
    if (containerWidth >= 1440) return "gap-x-5"; // Desktop
    if (containerWidth >= 1200) return "gap-x-4"; // Small desktop
    return "gap-x-3"; // Tablet
  }, []);

  const allItems = getAllItems();

  // Handle tooltip visibility
  const handleTooltipShow = useCallback((itemId: string) => {
    setHoveredTooltip(itemId);
  }, []);

  const handleTooltipHide = useCallback(() => {
    setHoveredTooltip(null);
  }, []);

  const handleNavClick = useCallback(
    (item: any) => {
      setHoveredTooltip(null); // Hide tooltip immediately on click
      onNavigation(item);
    },
    [onNavigation]
  );

  const handleInnerCircleClick = useCallback(() => {
    setHoveredTooltip(null); // Hide tooltip immediately on click
    onInnerCircleNavigation();
  }, [onInnerCircleNavigation]);

  const handleHomeClick = useCallback(() => {
    setHoveredTooltip(null); // Hide tooltip immediately on click
    onHomeNavigation();
  }, [onHomeNavigation]);

  const innerCircleHoverId = isLoggedIn ? "inner-profile" : "inner-signup";
  const homeHoverId = "home-button";

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
          border: 1px solid #00ffff40;
        }

        .cyberpunk-inner-track {
          background: linear-gradient(
            90deg,
            #00ffcc 0%,
            #00ffcc 50%,
            #00ffcc 100%
          );
          position: relative;
          overflow: hidden;
          border-radius: 45px;
          border: 0.5px solid #ffbf0060;
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
          box-shadow: 0 0 15px #00ffff80, inset 0 0 10px #00ffff20,
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

      <div
        className="dial-container cyberpunk-dial full-width-container h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-32"
        ref={containerRef}
      >
        <div ref={dialRef} className="dial-wrapper w-full h-full relative">
          <div
            className="cyberpunk-track neon-glow-cyan absolute h-12 md:h-16 lg:h-20 xl:h-24 2xl:h-28"
            style={{
              width: "85%",
              left: "7.5%",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />

          <div
            className="cyberpunk-inner-track neon-glow-amber absolute h-8 md:h-10 lg:h-12 xl:h-16 2xl:h-20 cursor-pointer"
            onClick={handleHomeClick}
            onMouseEnter={() => handleTooltipShow(homeHoverId)}
            onMouseLeave={handleTooltipHide}
            style={{
              width: "80%",
              left: "10%",
              top: "50%",
              transform: "translateY(-50%)",
              height: "60%",
            }}
          >
            <Tooltip
              content="Go to Home"
              show={hoveredTooltip === homeHoverId}
              isExpanded={true}
              buttonPosition={{ x: 0, y: 0 }}
            >
              <div className="w-full h-full" />
            </Tooltip>
          </div>

          <div
            className={`absolute inset-0 flex items-center justify-center px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 ${getResponsiveGap(
              windowWidth
            )}`}
            style={{
              paddingLeft: `${Math.max(80, windowWidth * 0.06)}px`,
              paddingRight: `${Math.max(80, windowWidth * 0.06)}px`,
            }}
          >
            {allItems.map((item: Item, index: number) => {
              const isActive = pathname === item.link;

              return (
                <div
                  key={`${item.id}-${item.actualIndex}`}
                  className="flex-shrink-0"
                >
                  <NavButton
                    item={item}
                    position={{ x: 0, y: 0, zIndex: 100 + index, angle: 0 }}
                    isActive={isActive}
                    isExpanded={true}
                    isHovered={hoveredTooltip === item.id}
                    index={index}
                    counterRotation={0}
                    onNavigation={handleNavClick}
                    onMouseEnter={() => handleTooltipShow(item.id)}
                    onMouseLeave={handleTooltipHide}
                    hoveredTooltip={hoveredTooltip}
                    onTooltipShow={handleTooltipShow}
                    onTooltipHide={handleTooltipHide}
                  />
                </div>
              );
            })}
          </div>

          <div
            className="absolute right-2 md:right-4 lg:right-6 xl:right-8 2xl:right-12 top-1/2 transform -translate-y-1/2 z-50"
            style={{
              width: `clamp(40px, ${Math.min(
                INNER_CIRCLE_SIZE,
                windowWidth * 0.04
              )}px, 60px)`,
              height: `clamp(40px, ${Math.min(
                INNER_CIRCLE_SIZE,
                windowWidth * 0.04
              )}px, 60px)`,
            }}
          >
            <Tooltip
              content={isLoggedIn ? "Profile" : "Sign Up"}
              show={hoveredTooltip === innerCircleHoverId}
              isExpanded={true}
              buttonPosition={{ x: 0, y: 0 }}
            >
              <button
                onClick={handleInnerCircleClick}
                onMouseEnter={() => handleTooltipShow(innerCircleHoverId)}
                onMouseLeave={handleTooltipHide}
                className={`inner-profile-cyberpunk ${
                  !isLoggedIn ? "signup" : ""
                } w-full h-full flex items-center justify-center`}
                aria-label={isLoggedIn ? "Profile" : "Sign Up"}
              >
                <Suspense
                  fallback={
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-400 rounded animate-pulse" />
                  }
                >
                  {isLoggedIn ? (
                    <FaUser className="text-white drop-shadow-lg text-sm md:text-base lg:text-lg" />
                  ) : (
                    <FaUserPlus className="text-white drop-shadow-lg text-sm md:text-base lg:text-lg" />
                  )}
                </Suspense>
              </button>
            </Tooltip>
          </div>

          <div
            className="absolute left-2 md:left-4 lg:left-6 xl:left-8 2xl:left-12 top-1/2 transform -translate-y-1/2 z-50"
            style={{
              width: `clamp(50px, ${Math.min(
                CENTER_SIZE_CLOSED,
                windowWidth * 0.05
              )}px, 70px)`,
              height: `clamp(50px, ${Math.min(
                CENTER_SIZE_CLOSED,
                windowWidth * 0.05
              )}px, 70px)`,
            }}
          >
            <Tooltip
              content="Home"
              show={hoveredTooltip === "center-hub"}
              isExpanded={true}
              buttonPosition={{ x: 0, y: 0 }}
            >
              <button
                onClick={handleHomeClick}
                onMouseEnter={() => handleTooltipShow("center-hub")}
                onMouseLeave={handleTooltipHide}
                className="center-hub-cyberpunk neon-glow-cyan w-full h-full flex items-center justify-center relative overflow-hidden"
                aria-label="Go to home"
              >
                <Suspense
                  fallback={
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-400 rounded animate-pulse" />
                  }
                >
                  <Image
                    src={logo}
                    alt="Sphinx Logo"
                    fill
                    className="object-cover animate-pulse"
                    placeholder="blur"
                    blurDataURL={logo.blurDataURL}
                    priority
                    quality={90}
                  />
                </Suspense>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
};

export const DesktopDial = memo(DesktopDialComponent);
