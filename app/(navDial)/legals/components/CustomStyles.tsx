// components/CustomStyles.tsx
import React, { memo } from 'react';

export const CustomStyles: React.FC = memo(() => (
  <style jsx global>{`
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    /* Custom scrollbar for sidebar */
    aside::-webkit-scrollbar {
      width: 4px;
    }

    aside::-webkit-scrollbar-track {
      background: transparent;
    }

    aside::-webkit-scrollbar-thumb {
      background: rgba(34, 197, 94, 0.3);
      border-radius: 2px;
    }

    aside::-webkit-scrollbar-thumb:hover {
      background: rgba(34, 197, 94, 0.5);
    }

    /* Optimize for Core Web Vitals */
    * {
      will-change: auto;
    }

    .animate-pulse,
    .transition-all,
    .transform {
      will-change: transform, opacity;
    }
  `}</style>
));

CustomStyles.displayName = 'CustomStyles';