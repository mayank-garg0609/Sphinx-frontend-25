import React, { memo, useEffect, useState } from "react";
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
  const [tooltipElement, setTooltipElement] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    if (show && isExpanded) {
      const tooltip = document.createElement("div");
      tooltip.className = "cyberpunk-tooltip-global";
      tooltip.textContent = content;

      const dialContainer = document.querySelector(".dial-container");
      if (dialContainer) {
        const dialRect = dialContainer.getBoundingClientRect();
        const tooltipX = dialRect.left + buttonPosition.x + 70;
        const tooltipY = dialRect.top + dialRect.height / 2 + buttonPosition.y;

        tooltip.style.cssText = `
          position: fixed;
          left: ${tooltipX}px;
          top: ${tooltipY}px;
          transform: translateY(-50%);
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 15, 35, 0.95) 100%);
          color: #00ffff;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          white-space: nowrap;
          pointer-events: none;
          z-index: 99999;
          border: 1px solid #00ffff;
          backdrop-filter: blur(8px);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1);
          text-shadow: 0 0 8px #00ffff;
          letter-spacing: 0.5px;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        `;

        document.body.appendChild(tooltip);

        requestAnimationFrame(() => {
          tooltip.style.opacity = "1";
        });

        setTooltipElement(tooltip);
      }
    } else {
      if (tooltipElement) {
        tooltipElement.style.opacity = "0";
        setTimeout(() => {
          if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.parentNode.removeChild(tooltipElement);
          }
        }, 200);
        setTooltipElement(null);
      }
    }

    return () => {
      if (tooltipElement) {
        tooltipElement.style.opacity = "0";
        setTimeout(() => {
          if (tooltipElement && tooltipElement.parentNode) {
            tooltipElement.parentNode.removeChild(tooltipElement);
          }
        }, 200);
      }
    };
  }, [show, isExpanded, content, buttonPosition.x, buttonPosition.y]);

  return <>{children}</>;
};

export const Tooltip = memo(TooltipComponent);
