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
    }, visible ? 100 : 200); // Slight delay for show, longer for hide
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
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 12px;
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
      }
    };

    if (tooltipElement) {
      window.addEventListener('resize', handleResize, { passive: true });
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [tooltipElement, content]);

  return (
    <div 
      ref={childRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
};

export const Tooltip = memo(TooltipComponent);