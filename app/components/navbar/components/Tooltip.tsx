import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import { TooltipProps } from "../types/navbarTypes";

const TooltipComponent: React.FC<
  TooltipProps & {
    children: React.ReactNode;
    isExpanded?: boolean;
    buttonPosition?: { x: number; y: number };
  }
> = ({
  content,
  show = false,
  children,
  isExpanded = false,
  buttonPosition = { x: 0, y: 0 },
}) => {
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const childRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  // Debounced show/hide to prevent flickering
  const debouncedSetVisible = useCallback((visible: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(visible);
    }, visible ? 100 : 200);
  }, []);

  useEffect(() => {
    debouncedSetVisible(show && isExpanded);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [show, isExpanded, debouncedSetVisible]);

  useEffect(() => {
    if (isVisible && childRef.current) {
      // Create tooltip element
      const tooltip = document.createElement("div");
      tooltip.className = "elegant-tooltip";
      tooltip.textContent = content;
      tooltip.setAttribute("role", "tooltip");
      tooltip.setAttribute("aria-live", "polite");

      // Get the position of the child element (the button)
      const childRect = childRef.current.getBoundingClientRect();
      const tooltipX = childRect.left + childRect.width / 2;
      const tooltipY = childRect.bottom + 12; // Position below the button

      // Ensure tooltip doesn't go off screen
      const tooltipWidth = content.length * 8 + 32; // Approximate width
      const screenWidth = window.innerWidth;
      const adjustedX = Math.min(Math.max(tooltipX, tooltipWidth / 2 + 10), screenWidth - tooltipWidth / 2 - 10);

      tooltip.style.cssText = `
        position: fixed;
        left: ${adjustedX}px;
        top: ${tooltipY}px;
        transform: translateX(-50%);
        background: linear-gradient(135deg, 
          rgba(26, 26, 46, 0.98) 0%, 
          rgba(22, 33, 62, 0.98) 50%, 
          rgba(15, 15, 35, 0.98) 100%
        );
        color: #00ffff;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10000;
        border: 1px solid rgba(0, 255, 255, 0.4);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 
          0 4px 20px rgba(0, 255, 255, 0.2),
          0 0 40px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        text-shadow: 0 0 8px rgba(0, 255, 255, 0.5);
        letter-spacing: 0.5px;
        transform-origin: top center;
        opacity: 0;
        animation: elegantTooltipAppear 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        max-width: 200px;
        text-align: center;
      `;

      // Responsive font size based on screen width
      if (window.innerWidth >= 1920) {
        tooltip.style.fontSize = '13px';
        tooltip.style.padding = '10px 16px';
      } else if (window.innerWidth >= 1440) {
        tooltip.style.fontSize = '12px';
        tooltip.style.padding = '9px 14px';
      } else if (window.innerWidth >= 1200) {
        tooltip.style.fontSize = '11px';
        tooltip.style.padding = '8px 12px';
      } else {
        tooltip.style.fontSize = '10px';
        tooltip.style.padding = '7px 10px';
      }

      // Create elegant arrow
      const arrow = document.createElement("div");
      arrow.className = "tooltip-arrow";
      arrow.style.cssText = `
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid rgba(26, 26, 46, 0.98);
        filter: drop-shadow(0 -1px 0 rgba(0, 255, 255, 0.4));
      `;

      tooltip.appendChild(arrow);
      document.body.appendChild(tooltip);
      setTooltipElement(tooltip);

      // Add keyframe animation styles if not already present
      if (!document.querySelector('#elegant-tooltip-styles')) {
        const style = document.createElement('style');
        style.id = 'elegant-tooltip-styles';
        style.textContent = `
          @keyframes elegantTooltipAppear {
            0% {
              opacity: 0;
              transform: translateX(-50%) translateY(-8px) scale(0.9);
              filter: blur(4px);
            }
            60% {
              opacity: 0.8;
              transform: translateX(-50%) translateY(2px) scale(1.02);
              filter: blur(1px);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes elegantTooltipDisappear {
            0% {
              opacity: 1;
              transform: translateX(-50%) translateY(0) scale(1);
              filter: blur(0);
            }
            40% {
              opacity: 0.6;
              transform: translateX(-50%) translateY(-2px) scale(0.98);
              filter: blur(1px);
            }
            100% {
              opacity: 0;
              transform: translateX(-50%) translateY(-8px) scale(0.9);
              filter: blur(4px);
            }
          }

          .elegant-tooltip {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }

          /* Dark theme support */
          @media (prefers-color-scheme: dark) {
            .elegant-tooltip {
              background: linear-gradient(135deg, 
                rgba(26, 26, 46, 0.98) 0%, 
                rgba(22, 33, 62, 0.98) 50%, 
                rgba(15, 15, 35, 0.98) 100%
              ) !important;
              color: #00ffff !important;
              border-color: rgba(0, 255, 255, 0.4) !important;
            }
          }

          /* Light theme support */
          @media (prefers-color-scheme: light) {
            .elegant-tooltip {
              background: linear-gradient(135deg, 
                rgba(255, 255, 255, 0.95) 0%, 
                rgba(248, 250, 252, 0.95) 50%, 
                rgba(241, 245, 249, 0.95) 100%
              ) !important;
              color: #1e293b !important;
              border-color: rgba(0, 0, 0, 0.1) !important;
              text-shadow: none !important;
              box-shadow: 
                0 4px 20px rgba(0, 0, 0, 0.1),
                0 0 40px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
            }
            .tooltip-arrow {
              border-bottom-color: rgba(255, 255, 255, 0.95) !important;
              filter: drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.1)) !important;
            }
          }

          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .elegant-tooltip {
              background: #000000 !important;
              color: #ffffff !important;
              border: 2px solid #ffffff !important;
              text-shadow: none !important;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8) !important;
            }
            .tooltip-arrow {
              border-bottom-color: #000000 !important;
              filter: none !important;
            }
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .elegant-tooltip {
              animation: none !important;
              opacity: 1 !important;
              transform: translateX(-50%) translateY(0) scale(1) !important;
              filter: none !important;
              transition: opacity 0.2s ease !important;
            }
          }

          /* Responsive tooltip sizing */
          @media (min-width: 2560px) {
            .elegant-tooltip {
              font-size: 14px !important;
              padding: 12px 18px !important;
            }
            .tooltip-arrow {
              border-width: 7px 7px 7px transparent !important;
              top: -7px !important;
            }
          }

          @media (min-width: 1920px) and (max-width: 2559px) {
            .elegant-tooltip {
              font-size: 13px !important;
              padding: 10px 16px !important;
            }
          }

          @media (min-width: 1440px) and (max-width: 1919px) {
            .elegant-tooltip {
              font-size: 12px !important;
              padding: 9px 14px !important;
            }
          }

          @media (min-width: 1200px) and (max-width: 1439px) {
            .elegant-tooltip {
              font-size: 11px !important;
              padding: 8px 12px !important;
            }
          }

          @media (max-width: 1199px) {
            .elegant-tooltip {
              font-size: 10px !important;
              padding: 7px 10px !important;
            }
            .tooltip-arrow {
              border-width: 5px 5px 5px transparent !important;
              top: -5px !important;
            }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      // Hide tooltip
      if (tooltipElement) {
        tooltipElement.style.animation = 'elegantTooltipDisappear 0.2s cubic-bezier(0.23, 1, 0.32, 1) forwards';
        setTimeout(() => {
          if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.parentNode.removeChild(tooltipElement);
          }
        }, 200);
        setTooltipElement(null);
      }
    }

    // Cleanup function
    return () => {
      if (tooltipElement) {
        tooltipElement.style.animation = 'elegantTooltipDisappear 0.2s cubic-bezier(0.23, 1, 0.32, 1) forwards';
        setTimeout(() => {
          if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.parentNode.removeChild(tooltipElement);
          }
        }, 200);
      }
    };
  }, [isVisible, content]);

  // Handle window resize to reposition tooltips
  useEffect(() => {
    const handleResize = () => {
      if (tooltipElement && childRef.current) {
        const childRect = childRef.current.getBoundingClientRect();
        const tooltipX = childRect.left + childRect.width / 2;
        const tooltipY = childRect.bottom + 12;
        
        const tooltipWidth = content.length * 8 + 32;
        const screenWidth = window.innerWidth;
        const adjustedX = Math.min(Math.max(tooltipX, tooltipWidth / 2 + 10), screenWidth - tooltipWidth / 2 - 10);
        
        tooltipElement.style.left = `${adjustedX}px`;
        tooltipElement.style.top = `${tooltipY}px`;

        // Update responsive sizing on resize
        if (window.innerWidth >= 1920) {
          tooltipElement.style.fontSize = '13px';
          tooltipElement.style.padding = '10px 16px';
        } else if (window.innerWidth >= 1440) {
          tooltipElement.style.fontSize = '12px';
          tooltipElement.style.padding = '9px 14px';
        } else if (window.innerWidth >= 1200) {
          tooltipElement.style.fontSize = '11px';
          tooltipElement.style.padding = '8px 12px';
        } else {
          tooltipElement.style.fontSize = '10px';
          tooltipElement.style.padding = '7px 10px';
        }
      }
    };

    if (tooltipElement) {
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [tooltipElement, content]);

  // Handle clicks to hide tooltip immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // If clicking anywhere in the navbar area, hide the tooltip
      const target = e.target as Element;
      if (target && (target.closest('.dial-container') || target.closest('button'))) {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClick, { passive: true });
      return () => document.removeEventListener('click', handleClick);
    }
  }, [isVisible]);

  return (
    <div 
      ref={childRef} 
      className="w-full h-full relative"
    >
      {children}
    </div>
  );
};

export const Tooltip = memo(TooltipComponent);