import React from "react";

export const ScrollStyles: React.FC = () => {
  return (
    <style jsx global>{`
      /* Hide scrollbar for webkit browsers */
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
        width: 0;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .scrollbar-hide {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }

      /* Enhanced smooth scrolling behavior */
      .scrollbar-hide {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch; /* iOS momentum scrolling */
      }

      /* Custom styled scrollbar alternative - responsive */
      .scrollbar-custom {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      .scrollbar-custom::-webkit-scrollbar {
        width: 4px;
      }

      @media (min-width: 768px) {
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
      }

      @media (min-width: 1440px) {
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
      }

      .scrollbar-custom::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 3px;
      }

      .scrollbar-custom::-webkit-scrollbar-thumb {
        background: linear-gradient(
          180deg,
          rgba(59, 130, 246, 0.4),
          rgba(34, 197, 94, 0.4)
        );
        border-radius: 3px;
        transition: all 0.3s ease;
      }

      .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(
          180deg,
          rgba(59, 130, 246, 0.6),
          rgba(34, 197, 94, 0.6)
        );
      }

      @media (min-width: 1440px) {
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          width: 10px;
        }
      }

      /* Performance optimizations for smooth animations */
      .smooth-scroll-container {
        transform: translateZ(0); /* Force hardware acceleration */
        backface-visibility: hidden;
        perspective: 1000px;
      }

      .smooth-scroll-item {
        transform: translateZ(0);
        will-change: transform, opacity, filter;
      }

      /* Mobile-specific optimizations */
      @media (max-width: 768px) {
        .scrollbar-hide {
          overscroll-behavior: contain;
          scroll-snap-type: y mandatory;
        }

        .smooth-scroll-container {
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
      }

      /* Tablet-specific optimizations */
      @media (min-width: 769px) and (max-width: 1024px) {
        .scrollbar-hide {
          scroll-padding: 20% 0;
        }
      }

      /* Desktop-specific optimizations */
      @media (min-width: 1025px) {
        .scrollbar-hide {
          scroll-padding: 30% 0;
        }
      }

      /* High-resolution display optimizations */
      @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        .smooth-scroll-item {
          transform: translateZ(0) scale(1);
        }
      }

      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        .scrollbar-hide,
        .scrollbar-custom,
        .smooth-scroll-container,
        .smooth-scroll-item {
          scroll-behavior: auto;
          transition: none;
          animation: none;
        }
      }

      /* Focus styles for accessibility */
      .scrollbar-hide:focus,
      .scrollbar-custom:focus {
        outline: 2px solid rgba(59, 130, 246, 0.5);
        outline-offset: 2px;
      }

      /* Touch device optimizations */
      @media (hover: none) and (pointer: coarse) {
        .scrollbar-custom::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(59, 130, 246, 0.6),
            rgba(34, 197, 94, 0.6)
          );
        }
      }
    `}</style>
  );
};