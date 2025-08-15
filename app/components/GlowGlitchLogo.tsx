"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./GlowGlitchLogo.module.css";

interface GlowGlitchLogoProps {
  text?: string;
  className?: string;
  onAnimationComplete?: () => void;
  autoPlay?: boolean;
  duration?: number;
}

interface ControlElement {
  id: number;
  x: number;
  y: number;
  size: number;
  type: "button" | "dial" | "slider";
  angle?: number;
  pulse?: number;
}

const GlowGlitchLogo: React.FC<GlowGlitchLogoProps> = ({
  text = "Sphinx",
  className = "",
  onAnimationComplete,
  autoPlay = true,
  duration = 4000,
}) => {
  const [isAnimating, setIsAnimating] = useState(autoPlay);
  const [controls, setControls] = useState<ControlElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const controlIdRef = useRef(0);

  const generateControls = () => {
    const newControls: ControlElement[] = [];
    for (let i = 0; i < 8; i++) {
      const type = ["button", "dial", "slider"][
        Math.floor(Math.random() * 3)
      ] as ControlElement["type"];

      newControls.push({
        id: controlIdRef.current++,
        x: Math.random() * 90,
        y: Math.random() * 90,
        size: 6 + Math.random() * 8,
        type,
        angle: type === "dial" ? Math.random() * 360 : undefined,
        pulse: type === "button" ? Math.random() : undefined,
      });
    }
    return newControls;
  };

  const animateControls = () => {
    setControls((prev) =>
      prev.map((ctrl) => {
        if (ctrl.type === "dial") {
          return { ...ctrl, angle: (ctrl.angle! + 1) % 360 };
        }
        if (ctrl.type === "button") {
          return {
            ...ctrl,
            pulse: Math.abs(Math.sin(Date.now() / 300 + ctrl.id)),
          };
        }
        if (ctrl.type === "slider") {
          return { ...ctrl, x: (ctrl.x + 0.3) % 100 };
        }
        return ctrl;
      })
    );

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animateControls);
    }
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setControls(generateControls());
    animateControls();
    setTimeout(() => {
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onAnimationComplete?.();
    }, duration);
  };

  useEffect(() => {
    if (autoPlay) startAnimation();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.logoContainer} ${className}`}
      onClick={!isAnimating ? startAnimation : undefined}
    >
      <h1
        className={`${styles.logoText} ${isAnimating ? styles.animate : ""}`}
        data-text={text}
      >
        {text}
      </h1>

      {/* Time Machine Control Elements */}
      <div className={styles.controlsLayer}>
        {controls.map((ctrl) => (
          <div
            key={ctrl.id}
            className={`${styles.control} ${styles[ctrl.type]}`}
            style={{
              left: `${ctrl.x}%`,
              top: `${ctrl.y}%`,
              width: `${ctrl.size}px`,
              height: `${ctrl.size}px`,
              transform:
                ctrl.type === "dial"
                  ? `rotate(${ctrl.angle}deg)`
                  : ctrl.type === "button"
                  ? `scale(${0.8 + ctrl.pulse! * 0.4})`
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default GlowGlitchLogo;