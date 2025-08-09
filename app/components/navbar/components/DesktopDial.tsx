import React, { useRef, useCallback, memo, Suspense } from 'react';
import { FaTimes, FaUser, FaUserPlus, FaChevronUp, FaChevronDown } from 'react-icons/fa';
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

    // Fixed direction: wheel up = previous (up arrow), wheel down = next (down arrow)
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

  const handleControlHover = useCallback((controlType: 'up' | 'down') => {
    setHoveredItem(`control-${controlType}`);
  }, [setHoveredItem]);

  const handleControlLeave = useCallback(() => {
    setHoveredItem(null);
  }, [setHoveredItem]);

  const showRotationControls = isExpanded && NAV_ITEMS_COUNT > VISIBLE_ITEMS;
  const innerCircleHoverId = isLoggedIn ? 'inner-profile' : 'inner-signup';
  const isInnerCircleHovered = hoveredItem === innerCircleHoverId;

  return (
    <>
      <style jsx>{`
        @keyframes neonPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 8px currentColor) drop-shadow(0 0 16px currentColor);
          }
          50% { 
            filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 24px currentColor);
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes controlPulse {
          0%, 100% { 
            box-shadow: 
              0 0 10px #00ffff40,
              inset 0 0 10px #00ffff20,
              0 0 20px #00ffff20;
          }
          50% { 
            box-shadow: 
              0 0 20px #00ffff60,
              inset 0 0 15px #00ffff30,
              0 0 30px #00ffff30;
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

        .cyberpunk-dial {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .neon-glow-cyan {
          box-shadow: 
            0 0 10px #00ffff,
            0 0 20px #00ffff40,
            0 0 30px #00ffff20,
            inset 0 0 10px #00ffff20;
        }

        .neon-glow-magenta {
          box-shadow: 
            0 0 10px #ff00ff,
            0 0 20px #ff00ff40,
            0 0 30px #ff00ff20,
            inset 0 0 10px #ff00ff20;
        }

        .neon-glow-amber {
          box-shadow: 
            0 0 10px #ffbf00,
            0 0 20px #ffbf0040,
            0 0 30px #ffbf0020,
            inset 0 0 10px #ffbf0020;
        }

        .control-button {
          position: absolute;
          width: 32px;
          height: 24px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
          border: 1px solid #00ffff;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: controlPulse 3s ease-in-out infinite;
          backdrop-filter: blur(10px);
          z-index: 150;
        }

        .control-button:hover {
          transform: scale(1.15);
          background: linear-gradient(135deg, #2a2a4e 0%, #26335e 50%, #1f1f43 100%);
          box-shadow: 
            0 0 20px #00ffff80,
            inset 0 0 20px #00ffff30,
            0 0 40px #00ffff40;
          animation: none;
        }

        .control-button:active {
          transform: scale(1.05);
          animation: none;
        }

        .control-button:active::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid #00ffff;
          border-radius: 8px;
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
        }

        .control-up {
          top: -12px;
          right: -20px;
        }

        .control-down {
          bottom: -12px;
          right: -20px;
        }

        .dial-rotation-container {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: 0 50%;
          will-change: transform;
        }

        .cyberpunk-track {
          background: 
            conic-gradient(from 0deg, 
              #1a1a2e 0deg, 
              #16213e 60deg, 
              #0f0f23 120deg, 
              #16213e 180deg, 
              #1a1a2e 240deg, 
              #0f0f23 300deg, 
              #1a1a2e 360deg
            );
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
        }

        .cyberpunk-inner-track {
          background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }

        .cyberpunk-inner-track::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, #00ffff10 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cyberpunk-inner-track:hover::before {
          opacity: 1;
        }

        .center-hub-cyberpunk {
          background: 
            radial-gradient(circle at 30% 30%, #2a2a4e 0%, #1a1a2e 50%, #0f0f23 100%);
          border: 2px solid #00ffff;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .center-hub-cyberpunk::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent 0deg, #00ffff40 60deg, transparent 120deg);
          animation: spin 4s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .center-hub-cyberpunk:hover::before {
          opacity: 1;
        }

        .center-hub-cyberpunk:hover {
          transform: scale(1.1);
          box-shadow: 
            0 0 20px #00ffff80,
            inset 0 0 20px #00ffff20,
            0 0 40px #00ffff40;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .inner-profile-cyberpunk {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2563eb 100%);
          border: 2px solid #00ffff;
          position: relative;
          overflow: hidden;
        }

        .inner-profile-cyberpunk::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, #ffffff20 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .inner-profile-cyberpunk:hover::before {
          transform: translateX(100%);
        }

        .inner-profile-cyberpunk:hover {
          transform: scale(1.15);
          box-shadow: 
            0 0 20px #4a90e280,
            inset 0 0 20px #ffffff20,
            0 0 40px #4a90e240;
        }

        .inner-profile-cyberpunk.signup {
          background: linear-gradient(135deg, #28a745 0%, #1e7e34 50%, #16a085 100%);
        }

        .inner-profile-cyberpunk.signup:hover {
          box-shadow: 
            0 0 20px #28a74580,
            inset 0 0 20px #ffffff20,
            0 0 40px #28a74540;
        }
      `}</style>
      
      <div
        className="dial-container cyberpunk-dial"
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
              ? currentRadius + BUTTON_SIZE + 120
              : CENTER_SIZE_CLOSED / 2 + 20,
            height: isExpanded
              ? currentRadius * 2 + BUTTON_SIZE + 60
              : CENTER_SIZE_CLOSED + 20,
          }}
        >
          {/* Static container for tracks and center hub */}
          <div
            className="dial-static-container"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Cyberpunk semicircle track */}
            <div
              className="semicircle-track cyberpunk-track neon-glow-cyan"
              style={{
                width: (currentRadius + BUTTON_SIZE / 2 + 10) * 2,
                height: (currentRadius + BUTTON_SIZE / 2 + 10) * 2,
                left: -(currentRadius + BUTTON_SIZE / 2 + 10),
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: '50%',
                opacity: isExpanded ? 1 : 0.3,
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid #00ffff40',
              }}
            />

            {/* Cyberpunk inner track */}
            <div
              className="inner-track cyberpunk-inner-track neon-glow-amber"
              onClick={onHomeNavigation}
              style={{
                width: (currentRadius - 20 + BUTTON_SIZE / 2) * 2 - 40,
                height: (currentRadius - 20 + BUTTON_SIZE / 2) * 2 - 40,
                left: -(currentRadius - 20 + BUTTON_SIZE / 2) + 20,
                top: '50%',
                transform: 'translateY(-50%)',
                borderRadius: '50%',
                opacity: isExpanded ? 1 : 0.3,
                cursor: isExpanded ? 'pointer' : 'default',
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid #ffbf0060',
              }}
            />

            {/* Integrated rotation controls - Fixed labels */}
            {showRotationControls && (
              <>
                <button
                  className="control-button control-up"
                  onClick={rotatePrevious}
                  onMouseEnter={() => handleControlHover('up')}
                  onMouseLeave={handleControlLeave}
                  disabled={isRotating}
                  aria-label="Show previous items"
                  style={{
                    width: 32,
                    height: 24,
                    borderRadius: '8px',
                    right: -(currentRadius + BUTTON_SIZE / 2 + 30),
                    top: '45%',
                    opacity: isRotating ? 0.5 : 1,
                    cursor: isRotating ? 'not-allowed' : 'pointer',
                  }}
                >
                  <FaChevronUp className="text-cyan-400" size={12} />
                </button>
                <button
                  className="control-button control-down"
                  onClick={rotateNext}
                  onMouseEnter={() => handleControlHover('down')}
                  onMouseLeave={handleControlLeave}
                  disabled={isRotating}
                  aria-label="Show next items"
                  style={{
                    width: 32,
                    height: 24,
                    borderRadius: '8px',
                    right: -(currentRadius + BUTTON_SIZE / 2 + 30),
                    top: '55%',
                    opacity: isRotating ? 0.5 : 1,
                    cursor: isRotating ? 'not-allowed' : 'pointer',
                  }}
                >
                  <FaChevronDown className="text-cyan-400" size={12} />
                </button>
              </>
            )}

            {/* Inner circle button - Fixed z-index and positioning */}
            {isExpanded && (
              <div
                style={{
                  position: 'absolute',
                  width: INNER_CIRCLE_SIZE,
                  height: INNER_CIRCLE_SIZE,
                  left: (currentRadius - 60) / 2 - INNER_CIRCLE_SIZE / 2,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 180,
                }}
              >
                <button
                  onClick={onInnerCircleNavigation}
                  onMouseEnter={handleInnerCircleEnter}
                  onMouseLeave={handleInnerCircleLeave}
                  className={`inner-profile-cyberpunk ${!isLoggedIn ? 'signup' : ''}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: '200ms',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 190,
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                  }}
                  aria-label={isLoggedIn ? 'Profile' : 'Sign Up'}
                >
                  <Suspense fallback={<div className="w-5 h-5 bg-gray-400 rounded animate-pulse" />}>
                    {isLoggedIn ? (
                      <FaUser className="text-white drop-shadow-lg" size={20} />
                    ) : (
                      <FaUserPlus className="text-white drop-shadow-lg" size={22} />
                    )}
                  </Suspense>

                  <Tooltip content={isLoggedIn ? 'Profile' : 'Sign Up'} show={isInnerCircleHovered}>
                    <></>
                  </Tooltip>
                </button>
              </div>
            )}

            {/* Center hub */}
            <button
              onClick={toggleExpanded}
              className="center-hub-cyberpunk neon-glow-cyan"
              style={{
                width: CENTER_SIZE_CLOSED,
                height: CENTER_SIZE_CLOSED,
                left: -(CENTER_SIZE_CLOSED / 2),
                top: '50%',
                transform: 'translateY(-50%)',
                position: 'absolute',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 200,
              }}
              aria-label={isExpanded ? 'Close navigation' : 'Open navigation'}
            >
              <Suspense fallback={<div className="w-6 h-6 bg-gray-400 rounded animate-pulse" />}>
                {isExpanded ? (
                  <FaTimes className="text-cyan-400 drop-shadow-lg" size={24} />
                ) : (
                  <span className="text-cyan-400 font-bold text-2xl font-mono drop-shadow-lg">S</span>
                )}
              </Suspense>
            </button>
          </div>

          {/* Navigation buttons container */}
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
                  counterRotation={0}
                  onNavigation={onNavigation}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
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