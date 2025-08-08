import React, { memo } from 'react';
import { TooltipProps } from '../types/navbarTypes';

const TooltipComponent: React.FC<TooltipProps & { children: React.ReactNode }> = ({
  content,
  show,
  children
}) => {
  return (
    <>
      {children}
      {show && (
        <div
          className="tooltip-content"
          style={{
            position: 'fixed',
            left: '120px', // Fixed position to always show tooltips
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 999999,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'tooltipFadeIn 0.2s ease-out',
          }}
        >
          {content}
          <div
            style={{
              position: 'absolute',
              left: '-6px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: '6px solid rgba(0, 0, 0, 0.95)',
            }}
          />
        </div>
      )}
    </>
  );
};

export const Tooltip = memo(TooltipComponent);