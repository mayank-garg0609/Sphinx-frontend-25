import React, { useRef, useCallback } from "react";
import { FaTimes, FaUser, FaUserPlus } from "react-icons/fa";
import {
  CENTER_SIZE_CLOSED,
  INNER_CIRCLE_SIZE,
  BUTTON_SIZE,
  VISIBLE_ITEMS,
} from "../utils/constants";
import { navItems } from "../utils/navItems";
import { useDesktopDial } from "../hooks/useDesktopDial";

interface DesktopDialProps {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  isLoggedIn: boolean;
  pathname: string;
  onNavigation: (item: any) => void;
  onInnerCircleNavigation: () => void;
  onHomeNavigation: () => void;
}

export const DesktopDial: React.FC<DesktopDialProps> = ({
  isExpanded,
  setIsExpanded,
  isLoggedIn,
  pathname,
  onNavigation,
  onInnerCircleNavigation,
  onHomeNavigation,
}) => {
  const {
    currentRadius,
    currentOffset,
    isRotating,
    hoveredItem,
    mousePos,
    dialRef,
    getVisibleItems,
    getButtonPosition,
    rotateNext,
    rotatePrevious,
    setHoveredItem,
  } = useDesktopDial(isExpanded);

  const containerRef = useRef<HTMLDivElement>(null);
  const isOverDial = useRef(false);

  const visibleItems = getVisibleItems();

  // Handle mouse enter/leave for the dial container
  const handleMouseEnter = useCallback(() => {
    isOverDial.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isOverDial.current = false;
  }, []);

  // Handle wheel events only when over the dial
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isExpanded || isRotating || navItems.length <= VISIBLE_ITEMS) {
      return;
    }

    // Prevent the wheel event from bubbling up to the main page
    e.preventDefault();
    e.stopPropagation();

    // Determine scroll direction and rotate accordingly
    if (e.deltaY > 0) {
      rotateNext();
    } else {
      rotatePrevious();
    }
  }, [isExpanded, isRotating, rotateNext, rotatePrevious]);

  return (
    <>
      <style>
        {`
          @keyframes tooltipFadeIn {
            0% {
              opacity: 0;
              transform: translateY(-50%) translateX(-4px);
            }
            100% {
              opacity: 1;
              transform: translateY(-50%) translateX(0);
            }
          }
        `}
      </style>
      <div 
        className="dial-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <div
          ref={dialRef}
          className="dial-wrapper"
          style={{
            width: isExpanded
              ? currentRadius + BUTTON_SIZE + 90
              : CENTER_SIZE_CLOSED / 2 + 20,
            height: isExpanded
              ? currentRadius * 2 + BUTTON_SIZE + 40
              : CENTER_SIZE_CLOSED + 20,
          }}
        >
          <div
            className="semicircle-track"
            style={{
              width: (currentRadius + BUTTON_SIZE / 2 + 10) * 2,
              height: (currentRadius + BUTTON_SIZE / 2 + 10) * 2,
              left: -(currentRadius + BUTTON_SIZE / 2 + 10),
              top: "50%",
              transform: "translateY(-50%)",
              opacity: isExpanded ? 1 : 0.3,
            }}
          />

          <div
            className="inner-track"
            onClick={onHomeNavigation}
            style={{
              width: (currentRadius - 20 + BUTTON_SIZE / 2) * 2 - 40,
              height: (currentRadius - 20 + BUTTON_SIZE / 2) * 2 - 40,
              left: -(currentRadius - 20 + BUTTON_SIZE / 2) + 20,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: isExpanded ? 1 : 0.3,
              cursor: isExpanded ? "pointer" : "default",
            }}
          />

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="center-hub"
            style={{
              width: CENTER_SIZE_CLOSED,
              height: CENTER_SIZE_CLOSED,
              left: -(CENTER_SIZE_CLOSED / 2),
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {isExpanded ? (
              <FaTimes className="text-white" size={24} />
            ) : (
              <span className="text-white font-bold text-2xl font-mono">S</span>
            )}
          </button>

          {isExpanded && (
            <div
              style={{
                position: "relative",
                width: INNER_CIRCLE_SIZE,
                height: INNER_CIRCLE_SIZE,
                left: (currentRadius - 60) / 2 - INNER_CIRCLE_SIZE / 2,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <button
                onClick={onInnerCircleNavigation}
                onMouseEnter={() =>
                  setHoveredItem(isLoggedIn ? "inner-profile" : "inner-signup")
                }
                onMouseLeave={() => setHoveredItem(null)}
                className={`inner-profile-circle ${
                  !isLoggedIn ? "signup" : ""
                }`}
                style={{
                  width: "100%",
                  height: "100%",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionDelay: "200ms",
                  position: "relative",
                }}
              >
                {isLoggedIn ? (
                  <FaUser className="text-white" size={20} />
                ) : (
                  <FaUserPlus className="text-white" size={22} />
                )}

                {hoveredItem ===
                  (isLoggedIn ? "inner-profile" : "inner-signup") && (
                  <div
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      marginLeft: "12px",
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      color: "white",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      zIndex: 999999,
                      boxShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      animation: "tooltipFadeIn 0.2s ease-out",
                    }}
                  >
                    {isLoggedIn ? "Profile" : "Sign Up"}
                    <div
                      style={{
                        position: "absolute",
                        left: "-6px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 0,
                        height: 0,
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderRight: "6px solid rgba(0, 0, 0, 0.9)",
                      }}
                    />
                  </div>
                )}
              </button>
            </div>
          )}

          {visibleItems.map((item, index) => {
            const position = getButtonPosition(item.displayIndex);
            const isActive = pathname === item.link;

            return (
              <div
                key={`${item.id}-${currentOffset}`}
                style={{
                  position: "absolute",
                  width: BUTTON_SIZE,
                  height: BUTTON_SIZE,
                  left: 0,
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                  opacity: isExpanded ? 1 : 0,
                  visibility: isExpanded ? "visible" : "hidden",
                  zIndex: position.zIndex,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionDelay: `${index * 30}ms`,
                }}
              >
                <button
                  onClick={() => onNavigation(item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`nav-button ${isActive ? "active" : ""}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <item.icon size={20} className="nav-icon" />

                  {hoveredItem === item.id && (
                    <div
                      style={{
                        position: "absolute",
                        left: "100%",
                        top: "50%",
                        transform: "translateY(-50%)",
                        marginLeft: "12px",
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                        color: "white",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 99,
                        boxShadow:
                          "0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        animation: "tooltipFadeIn 0.2s ease-out",
                      }}
                    >
                      {item.label}
                      <div
                        style={{
                          position: "absolute",
                          left: "-6px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 0,
                          height: 0,
                          borderTop: "6px solid transparent",
                          borderBottom: "6px solid transparent",
                          borderRight: "6px solid rgba(0, 0, 0, 0.9)",
                        }}
                      />
                    </div>
                  )}
                </button>
              </div>
            );
          })}

          {isExpanded && navItems.length > VISIBLE_ITEMS && (
            <div
              style={{
                position: "absolute",
                right: -60,
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <button
                onClick={rotatePrevious}
                disabled={isRotating}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#333333",
                  border: "2px solid #f5f5f5",
                  color: "white",
                  cursor: isRotating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isRotating ? 0.5 : 1,
                }}
              >
                ↑
              </button>
              <button
                onClick={rotateNext}
                disabled={isRotating}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#333333",
                  border: "2px solid #f5f5f5",
                  color: "white",
                  cursor: isRotating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: isRotating ? 0.5 : 1,
                }}
              >
                ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};