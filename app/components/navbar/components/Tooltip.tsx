import React, { memo } from 'react';
import { TooltipProps } from '../types/navbarTypes';

const TooltipComponent: React.FC<TooltipProps & { children: React.ReactNode }> = ({
  content,
  show,
  children
}) => {
  return (
    <>
      <style jsx>{`
        @keyframes tooltipSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-50%) translateX(-20px) scale(0.9);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(-50%) translateX(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes tooltipGlow {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 0.4),
              inset 0 0 20px rgba(0, 255, 255, 0.1),
              0 4px 20px rgba(0, 0, 0, 0.3);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(0, 255, 255, 0.6),
              inset 0 0 30px rgba(0, 255, 255, 0.2),
              0 6px 30px rgba(0, 0, 0, 0.4);
          }
        }

        @keyframes borderFlow {
          0% { border-color: #00ffff; }
          25% { border-color: #00ff88; }
          50% { border-color: #88ff00; }
          75% { border-color: #ff8800; }
          100% { border-color: #00ffff; }
        }

        .cyberpunk-tooltip {
          position: fixed;
          left: 130px;
          top: 50%;
          transform: translateY(-50%);
          background: 
            linear-gradient(135deg, 
              rgba(26, 26, 46, 0.98) 0%, 
              rgba(22, 33, 62, 0.98) 50%, 
              rgba(15, 15, 35, 0.98) 100%
            );
          color: #00ffff;
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          white-space: nowrap;
          pointer-events: none;
          z-index: 999999;
          border: 2px solid #00ffff;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: 
            tooltipSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
            tooltipGlow 3s ease-in-out infinite,
            borderFlow 4s linear infinite;
          text-shadow: 
            0 0 8px #00ffff,
            0 0 16px #00ffff60;
          letter-spacing: 0.5px;
          position: fixed;
          overflow: visible;
          display: block;
          visibility: visible;
          opacity: 1;
        }

        .cyberpunk-tooltip::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          animation: shimmer 2s ease-in-out infinite;
        }

        .cyberpunk-tooltip::after {
          content: '';
          position: absolute;
          left: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 10px solid rgba(26, 26, 46, 0.98);
          z-index: 1000000;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
      
      {children}
      {show && (
        <div className="cyberpunk-tooltip">
          {content}
        </div>
      )}
    </>
  );
};

export const Tooltip = memo(TooltipComponent);