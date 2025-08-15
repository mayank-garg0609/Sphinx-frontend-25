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

      /* Custom styled scrollbar alternative */
      .scrollbar-custom {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }

      .scrollbar-custom::-webkit-scrollbar {
        width: 6px;
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
        width: 8px;
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
    `}</style>
  );
};
