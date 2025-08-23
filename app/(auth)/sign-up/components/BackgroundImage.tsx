"use client";

import Image from "next/image";
import { memo, useEffect, useState } from "react";
import ascended from "@/public/image/ascended.webp";

export const BackgroundImage = memo(function BackgroundImageOptimized() {
  const [isVisible, setIsVisible] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("background-container");
    if (element) observer.observe(element);

    const updateSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const getImageDimensions = () => {
    const { width, height } = viewportSize;

    if (width === 0 || height === 0) {
      return { width: "85vw", height: "85vh" };
    }

    const scaleFactor = width <= 768 ? 0.85 : 0.8;
    const maxWidth = Math.min(width * scaleFactor, 1200);
    const maxHeight = Math.min(height * scaleFactor, 1000);

    return {
      width: `${maxWidth}px`,
      height: `${maxHeight}px`,
    };
  };

  const dimensions = getImageDimensions();

  return (
    <div id="background-container" className="absolute inset-0 overflow-hidden">
      {isVisible && (
        <>
          <div className="absolute inset-0 flex items-end justify-center pb-8 lg:pb-16">
            <Image
              src={ascended}
              alt=""
              placeholder="blur"
              priority
              className="object-contain transition-all duration-700 ease-out opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                maxWidth: "90vw",
                maxHeight: "90vh",
              }}
              sizes="(min-width: 1024px) 80vw, (min-width: 768px) 85vw, 90vw"
              onLoad={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/50 lg:from-black/40 lg:via-black/10 lg:to-transparent" />

          <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        </>
      )}

      {!isVisible && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-pulse" />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
});
