import React from "react";
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

  const visibleItems = getVisibleItems();
  const tooltipStyles = {
    position: "fixed" as const,
    left: mousePos.x + 15,
    top: mousePos.y - 10,
    backgroundColor: "#333",
    color: "white",
    padding: "8px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    whiteSpace: "nowrap" as const,
    pointerEvents: "none" as const,
    zIndex: 9999,
    transform: "translateY(-50%)", // Center vertically relative to cursor
  };
  return (
    <div className="dial-container">
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
        {/* Outer circle track */}
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

        {/* Inner circle track */}
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

        {/* Center hub button */}
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

        {/* Inner Profile/Signup Circle */}
        {isExpanded && (
          <button
            onClick={onInnerCircleNavigation}
            onMouseEnter={() =>
              setHoveredItem(isLoggedIn ? "inner-profile" : "inner-signup")
            }
            onMouseLeave={() => setHoveredItem(null)}
            className={`inner-profile-circle ${!isLoggedIn ? "signup" : ""}`}
            style={{
              width: INNER_CIRCLE_SIZE,
              height: INNER_CIRCLE_SIZE,
              left: (currentRadius - 60) / 2 - INNER_CIRCLE_SIZE / 2,
              top: "50%",
              transform: "translateY(-50%)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transitionDelay: "200ms",
            }}
          >
            {isLoggedIn ? (
              <FaUser className="text-white" size={20} />
            ) : (
              <FaUserPlus className="text-white" size={22} />
            )}
          </button>
        )}

        {/* Navigation buttons */}
        {visibleItems.map((item, index) => {
          const position = getButtonPosition(item.displayIndex);
          const isActive = pathname === item.link;

          return (
            <button
              key={`${item.id}-${currentOffset}`}
              onClick={() => onNavigation(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`nav-button ${isActive ? "active" : ""}`}
              style={{
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
              <item.icon size={20} className="nav-icon" />
            </button>
          );
        })}

        {/* Rotation controls */}
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

      {/* Tooltip */}
      {hoveredItem && isExpanded && (
        <div
          className="tooltip"
          style={{
            position: "fixed", // Use fixed positioning
            left: mousePos.x + 15,
            top: mousePos.y - 10,
            pointerEvents: "none", // Prevent tooltip from interfering with mouse events
            zIndex: 9999,
          }}
        >
          {hoveredItem === "inner-profile"
            ? "Profile"
            : hoveredItem === "inner-signup"
            ? "Sign Up"
            : navItems.find((item) => item.id === hoveredItem)?.label}
        </div>
      )}
    </div>
  );
};
