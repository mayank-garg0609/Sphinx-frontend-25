import React, { memo } from 'react';
import type { MousePosition } from '../types/legal';

interface FloatingCursorProps {
  readonly position: MousePosition;
}

export const FloatingCursor: React.FC<FloatingCursorProps> = memo(({ position }) => (
  <div
    className="fixed w-4 h-4 pointer-events-none z-50 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-sm transition-all duration-300"
    style={{
      left: position.x - 8,
      top: position.y - 8,
      transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
    }}
  />
));

FloatingCursor.displayName = 'FloatingCursor';