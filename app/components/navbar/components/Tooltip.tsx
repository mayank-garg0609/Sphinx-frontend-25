import React, { memo, useEffect, useState, useRef } from "react";
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
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && isExpanded && childRef.current) {
      const tooltip = document.createElement("div");
      tooltip.className = "portal-tooltip";
      tooltip.textContent = content;

      // Get the position of the child element (the button)
      const childRect = childRef.current.getBoundingClientRect();
      const tooltipX = childRect.left + childRect.width / 2;
      const tooltipY = childRect.bottom + 15; // Position just below the button

      tooltip.style.cssText = `
        position: fixed;
        left: ${tooltipX}px;
        top: ${tooltipY}px;
        transform: translateX(-50%);
        background: linear-gradient(135deg, 
          rgba(26, 26, 46, 0.98) 0%, 
          rgba(22, 33, 62, 0.98) 50%, 
          rgba(15, 15, 35, 0.98) 100%
        );
        color: #00ffff;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
        white-space: nowrap;
        pointer-events: none;
        z-index: 99999;
        border: 2px solid #00ffff;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        box-shadow: 
          0 0 25px rgba(0, 255, 255, 0.5), 
          inset 0 0 20px rgba(0, 255, 255, 0.1),
          0 8px 32px rgba(0, 0, 0, 0.4);
        text-shadow: 0 0 10px #00ffff;
        letter-spacing: 1px;
        transform-origin: top center;
        opacity: 0;
        animation: portalOpen 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      `;

      // Add portal arrow effect
      const arrowBefore = document.createElement("div");
      arrowBefore.style.cssText = `
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #00ffff;
        content: '';
      `;
      
      const arrowAfter = document.createElement("div");
      arrowAfter.style.cssText = `
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid rgba(26, 26, 46, 0.98);
        content: '';
      `;

      tooltip.appendChild(arrowBefore);
      tooltip.appendChild(arrowAfter);

      document.body.appendChild(tooltip);
      setTooltipElement(tooltip);

      // Add keyframe animation styles if not already present
      if (!document.querySelector('#portal-tooltip-styles')) {
        const style = document.createElement('style');
        style.id = 'portal-tooltip-styles';
        style.textContent = `
          @keyframes portalOpen {
            0% {
              opacity: 0;
              transform: translateX(-50%) scale(0.3) rotateY(90deg);
              filter: blur(10px);
            }
            50% {
              opacity: 0.7;
              transform: translateX(-50%) scale(1.1) rotateY(0deg);
              filter: blur(2px);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) scale(1) rotateY(0deg);
              filter: blur(0px);
            }
          }

          @keyframes portalClose {
            0% {
              opacity: 1;
              transform: translateX(-50%) scale(1) rotateY(0deg);
              filter: blur(0px);
            }
            50% {
              opacity: 0.7;
              transform: translateX(-50%) scale(1.1) rotateY(45deg);
              filter: blur(2px);
            }
            100% {
              opacity: 0;
              transform: translateX(-50%) scale(0.3) rotateY(90deg);
              filter: blur(10px);
            }
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      if (tooltipElement) {
        tooltipElement.style.animation = 'portalClose 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        setTimeout(() => {
          if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.parentNode.removeChild(tooltipElement);
          }
        }, 300);
        setTooltipElement(null);
      }
    }

    return () => {
      if (tooltipElement) {
        tooltipElement.style.animation = 'portalClose 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        setTimeout(() => {
          if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.parentNode.removeChild(tooltipElement);
          }
        }, 300);
      }
    };
  }, [show, isExpanded, content]);

  return (
    <div ref={childRef} style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export const Tooltip = memo(TooltipComponent);