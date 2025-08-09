// components/GlowGlitchLogo.tsx
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

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const GlowGlitchLogo: React.FC<GlowGlitchLogoProps> = ({
  text = "Sphinx",
  className = "",
  onAnimationComplete,
  autoPlay = true,
  duration = 4000,
}) => {
  const [isAnimating, setIsAnimating] = useState(autoPlay);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const particleIdRef = useRef(0);

  const generateParticles = () => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
      });
    }
    return newParticles;
  };

  const animateParticles = () => {
    setParticles((prev) => {
      const updatedParticles = prev
        .map((particle) => ({
          ...particle,
          x: Math.max(0, Math.min(100, particle.x + particle.vx)),
          y: Math.max(0, Math.min(100, particle.y + particle.vy)),
          life: particle.life - 1,
        }))
        .filter((particle) => particle.life > 0);

      // Add new particles occasionally, but limit total count
      if (Math.random() < 0.1 && updatedParticles.length < 30) {
        return [...updatedParticles, ...generateParticles().slice(0, 2)];
      }

      return updatedParticles;
    });

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animateParticles);
    }
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setParticles(generateParticles());
    animateParticles();

    // Complete animation after duration
    setTimeout(() => {
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onAnimationComplete?.();
    }, duration);
  };

  const replayAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setParticles([]);
    setTimeout(() => startAnimation(), 100);
  };

  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.logoContainer} ${className}`}
      onClick={!isAnimating ? replayAnimation : undefined}
    >
      <div
        className={`${styles.glowEffect} ${isAnimating ? styles.animate : ""}`}
      />

      <div
        className={`${styles.scanlines} ${isAnimating ? styles.animate : ""}`}
      />

      <div className={styles.electricLines}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`${styles.electricLine} ${
              isAnimating ? styles.animate : ""
            }`}
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <h1
        className={`${styles.logoText} ${isAnimating ? styles.animate : ""}`}
        data-text={text}
      >
        {text}
      </h1>

      <div className={styles.particles}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.life / particle.maxLife,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GlowGlitchLogo;
