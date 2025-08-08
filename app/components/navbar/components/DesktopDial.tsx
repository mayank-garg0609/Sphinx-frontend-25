import React, { useRef, useCallback, memo, Suspense } from 'react';
import { FaTimes, FaUser, FaUserPlus } from 'react-icons/fa';
import {
  CENTER_SIZE_CLOSED,
  INNER_CIRCLE_SIZE,
  BUTTON_SIZE,
  VISIBLE_ITEMS,
  STAGGER_DELAY,
} from '../utils/constants';
import { navItems, NAV_ITEMS_COUNT } from '../utils/navItems';
import { useDesktopDial } from '../hooks/useDesktopDial';
import { NavButton } from './NavButton';
import { RotationControls } from './RotationControls';
import { Tooltip } from './Tooltip';

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
  const {
    currentRadius,
    rotation,
    isRotating,
    hoveredItem,
    dialRef,
    getAllItems,
    getButtonPosition,
    rotateNext,
    rotatePrevious,
    setHoveredItem,
  } = useDesktopDial(isExpanded);

  const containerRef = useRef<HTMLDivElement>(null);
  const isOverDial = useRef<boolean>(false);

  const allItems = getAllItems();

  const handleMouseEnter = useCallback(() => {
    isOverDial.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isOverDial.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isExpanded || NAV_ITEMS_COUNT <= VISIBLE_ITEMS) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Direct rotation call with built-in throttling
    if (e.deltaY > 0) {
      rotateNext();
    } else {
      rotatePrevious();
    }
  }, [isExpanded, rotateNext, rotatePrevious]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded, setIsExpanded]);

  const handleInnerCircleEnter = useCallback(() => {
    setHoveredItem(isLoggedIn ? 'inner-profile' : 'inner-signup');
  }, [isLoggedIn, setHoveredItem]);

  const handleInnerCircleLeave = useCallback(() => {
    setHoveredItem(null);
  }, [setHoveredItem]);

  const showRotationControls = isExpanded && NAV_ITEMS_COUNT > VISIBLE_ITEMS;
  const innerCircleHoverId = isLoggedIn ? 'inner-profile' : 'inner-signup';
  const isInnerCircleHovered = hoveredItem === innerCircleHoverId;

  return (
    <>
      <style jsx>{`
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

        .dial-rotation-container {
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: 0 50%;
        }

        .nav-button-counter-rotate {
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .inner-circle-counter-rotate {
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
      
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
          {/* Static container for tracks and center hub (no rotation) */}
          <div
            className="dial-static-container"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              className="semicircle-track"
              style={{
                width: (currentRadius + BUTTON_SIZE / 2 + 10) * 2,
                height: (currentRadius + BUTTON_SIZE / 2 + 10) * 2,
                left: -(currentRadius + BUTTON_SIZE / 2 + 10),
                top: '50%',
                transform: 'translateY(-50%)',
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
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: isExpanded ? 1 : 0.3,
                cursor: isExpanded ? 'pointer' : 'default',
              }}
            />

            {/* Inner circle button - NOT ROTATING */}
            {isExpanded && (
              <div
                style={{
                  position: 'absolute',
                  width: INNER_CIRCLE_SIZE,
                  height: INNER_CIRCLE_SIZE,
                  left: (currentRadius - 60) / 2 - INNER_CIRCLE_SIZE / 2,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <button
                  onClick={onInnerCircleNavigation}
                  onMouseEnter={handleInnerCircleEnter}
                  onMouseLeave={handleInnerCircleLeave}
                  className={`inner-profile-circle ${!isLoggedIn ? 'signup' : ''}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '200ms',
                    position: 'relative',
                  }}
                  aria-label={isLoggedIn ? 'Profile' : 'Sign Up'}
                >
                  <Suspense fallback={<div className="w-5 h-5 bg-gray-400 rounded animate-pulse" />}>
                    {isLoggedIn ? (
                      <FaUser className="text-white" size={20} />
                    ) : (
                      <FaUserPlus className="text-white" size={22} />
                    )}
                  </Suspense>

                  <Tooltip content={isLoggedIn ? 'Profile' : 'Sign Up'} show={isInnerCircleHovered}>
                    <></>
                  </Tooltip>
                </button>
              </div>
            )}

            {/* Center hub stays fixed - not affected by rotation */}
            <button
              onClick={toggleExpanded}
              className="center-hub"
              style={{
                width: CENTER_SIZE_CLOSED,
                height: CENTER_SIZE_CLOSED,
                left: -(CENTER_SIZE_CLOSED / 2),
                top: '50%',
                transform: 'translateY(-50%)',
                position: 'absolute',
                zIndex: 10,
              }}
              aria-label={isExpanded ? 'Close navigation' : 'Open navigation'}
            >
              <Suspense fallback={<div className="w-6 h-6 bg-gray-400 rounded animate-pulse" />}>
                {isExpanded ? (
                  <FaTimes className="text-white" size={24} />
                ) : (
                  <span className="text-white font-bold text-2xl font-mono">S</span>
                )}
              </Suspense>
            </button>
          </div>

          {/* Navigation buttons container - positioned absolutely */}
          <div
            className="nav-buttons-container"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          >
            {allItems.map((item, index) => {
              const position = getButtonPosition(item.displayIndex);
              const isActive = pathname === item.link;
              const isHovered = hoveredItem === item.id;

              return (
                <NavButton
                  key={`${item.id}-${item.actualIndex}`}
                  item={item}
                  position={position}
                  isActive={isActive}
                  isExpanded={isExpanded}
                  isHovered={isHovered}
                  index={index}
                  counterRotation={0} // Icons stay straight
                  onNavigation={onNavigation}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              );
            })}
          </div>

          <RotationControls
            onRotateNext={rotateNext}
            onRotatePrevious={rotatePrevious}
            isRotating={isRotating}
            showControls={showRotationControls}
          />
        </div>
      </div>
    </>
  );
};

export const DesktopDial = memo(DesktopDialComponent);