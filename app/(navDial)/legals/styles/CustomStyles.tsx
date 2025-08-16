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

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .animate-float {
      animation: float 3s ease-in-out infinite;
    }

    .animate-slide-in-right {
      animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .animate-slide-in-left {
      animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
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

    /* Fixed: Mobile barrier for policy selector - content should not scroll over it */
    @media (max-width: 1023px) {
      main {
        padding-top: 140px; /* Account for mobile policy selector height */
      }
      
      .mobile-policy-barrier::before {
        content: '';
        position: fixed;
        top: 96px; /* top-24 = 96px */
        left: 0;
        right: 0;
        height: 80px; /* Height of mobile selector */
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(12px);
        z-index: 49;
        pointer-events: none;
      }
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

    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      html {
        scroll-behavior: auto;
      }

      .animate-slide-in-right,
      .animate-slide-in-left {
        animation: none;
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Fixed: Smooth scrolling improvements */
    html {
      scroll-behavior: smooth;
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      html {
        scroll-behavior: auto;
      }

      .animate-slide-in-right,
      .animate-slide-in-left {
        animation: none;
        opacity: 1;
        transform: translateX(0);
      }
    }
  `}</style>
));

CustomStyles.displayName = 'CustomStyles';