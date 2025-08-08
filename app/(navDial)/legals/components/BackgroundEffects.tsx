import React, { memo } from 'react';

export const BackgroundEffects: React.FC = memo(() => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }} />
  </div>
));

BackgroundEffects.displayName = 'BackgroundEffects';