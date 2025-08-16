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

    /* Enhanced mobile overlay styles - with hidden overflow */
    @media (max-width: 1023px) {
      /* Floating navigation that doesn't interfere with content */
      .mobile-nav-overlay {
        position: fixed;
        top: 6rem; /* top-24 = 6rem */
        left: 0;
        right: 0;
        z-index: 40;
        pointer-events: none;
        overflow: hidden; /* Hide anything that extends beyond */
      }
      
      .mobile-nav-content {
        pointer-events: auto;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        overflow: hidden; /* Clip content that extends beyond boundaries */
      }
      
      /* Allow content to flow naturally - no extra padding needed */
      .main-content-mobile {
        /* Content flows naturally behind the floating nav */
      }
    }

    /* Semi-transparent glassmorphism for floating nav with hidden overflow */
    .glass-morphism-floating {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden; /* Ensure no visual elements extend beyond */
      box-shadow: 
        0 20px 40px -12px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    /* Selected indicator line animations */
    .selected-indicator-line {
      background: linear-gradient(90deg, #06b6d4, #8b5cf6);
      height: 2px;
      border-radius: 1px;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    /* Button overflow management */
    .nav-button-content {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    /* Enhanced clipping for floating elements */
    .clip-bounds {
      clip-path: inset(0 0 0 0 round 1rem);
      overflow: hidden;
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

    /* Smooth scrolling improvements */
    html {
      scroll-behavior: smooth;
    }

    /* Accessibility and reduced motion preferences */
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

      .backdrop-blur-xl,
      .backdrop-blur-sm {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
    }

    /* Enhanced focus styles for better accessibility */
    .focus-enhanced:focus {
      outline: none;
      box-shadow: 
        0 0 0 2px rgba(34, 197, 94, 0.5),
        0 0 0 4px rgba(34, 197, 94, 0.2);
    }

    /* Mobile-specific improvements */
    @media (max-width: 640px) {
      .mobile-nav-content {
        margin: 0 1rem;
        border-radius: 1rem;
      }
    }
  `}</style>
));

CustomStyles.displayName = 'CustomStyles';