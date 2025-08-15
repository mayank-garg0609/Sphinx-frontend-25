"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
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

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  trail: { x: number; y: number; opacity: number }[];
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
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const particleAnimationRef = useRef<number>(0);
  const controlIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastFrameTime = useRef<number>(0);

  // Memoized control types array to avoid recreation
  const controlTypes = useMemo(() => ["button", "dial", "slider"] as const, []);

  // Cached window dimensions to avoid repeated access
  const windowDimensions = useRef({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      windowDimensions.current = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const generateControls = useCallback((): ControlElement[] => {
    const newControls: ControlElement[] = [];
    for (let i = 0; i < 8; i++) {
      const type = controlTypes[Math.floor(Math.random() * 3)];
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
  }, [controlTypes]);

  const generateParticles = useCallback((): Particle[] => {
    const newParticles: Particle[] = [];
    const { width, height } = windowDimensions.current;
    
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      newParticles.push({
        id: particleIdRef.current++,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1 + Math.random() * 3,
        opacity: 0.3 + Math.random() * 0.7,
        hue: Math.random() * 360,
        trail: []
      });
    }
    return newParticles;
  }, []);

  const animateControls = useCallback((timestamp: number) => {
    // Throttle to ~60fps
    if (timestamp - lastFrameTime.current < 16) {
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animateControls);
      }
      return;
    }
    
    lastFrameTime.current = timestamp;
    const currentTime = timestamp;

    setControls((prev) =>
      prev.map((ctrl) => {
        if (ctrl.type === "dial") {
          return { ...ctrl, angle: (ctrl.angle! + 1) % 360 };
        }
        if (ctrl.type === "button") {
          return {
            ...ctrl,
            pulse: Math.abs(Math.sin(currentTime / 300 + ctrl.id)),
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
  }, [isAnimating]);

  const animateParticles = useCallback(() => {
    const { width, height } = windowDimensions.current;
    
    setParticles((prev) =>
      prev.map((particle) => {
        // Update trail - limit to 8 points for performance
        const newTrail = [
          { x: particle.x, y: particle.y, opacity: particle.opacity },
          ...particle.trail.slice(0, 7).map(t => ({ ...t, opacity: t.opacity * 0.8 }))
        ];

        // Update position with boundary wrapping
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        // More efficient boundary checking
        if (newX < -10) newX = width + 10;
        else if (newX > width + 10) newX = -10;
        
        if (newY < -10) newY = height + 10;
        else if (newY > height + 10) newY = -10;

        // Reduced jitter calculation
        const jitter = 0.1;
        newX += (Math.random() - 0.5) * jitter;
        newY += (Math.random() - 0.5) * jitter;

        return {
          ...particle,
          x: newX,
          y: newY,
          trail: newTrail,
          hue: (particle.hue + 0.5) % 360,
        };
      })
    );
    
    particleAnimationRef.current = requestAnimationFrame(animateParticles);
  }, []);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setControls(generateControls());
    animateControls(performance.now());
    
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onAnimationComplete?.();
    }, duration);
  }, [generateControls, animateControls, duration, onAnimationComplete]);

  const handleClick = useCallback(() => {
    if (!isAnimating) {
      startAnimation();
    }
  }, [isAnimating, startAnimation]);

  // Memoized particle rendering to reduce re-renders
  const particleElements = useMemo(() => 
    particles.map((particle) => (
      <React.Fragment key={particle.id}>
        {/* Particle trail */}
        {particle.trail.map((trailPoint, index) => (
          <div
            key={`trail-${particle.id}-${index}`}
            className={styles.particleTrail}
            style={{
              left: `${trailPoint.x}px`,
              top: `${trailPoint.y}px`,
              width: `${particle.size * (1 - index * 0.1)}px`,
              height: `${particle.size * (1 - index * 0.1)}px`,
              opacity: trailPoint.opacity * 0.6,
              background: `hsl(${particle.hue}, 80%, 60%)`,
              boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue}, 80%, 60%)`,
            }}
          />
        ))}
        {/* Main particle */}
        <div
          className={styles.particle}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: `hsl(${particle.hue}, 100%, 70%)`,
            boxShadow: `0 0 ${particle.size * 3}px hsl(${particle.hue}, 100%, 70%)`,
          }}
        />
      </React.Fragment>
    )), [particles]);

  // Memoized control elements
  const controlElements = useMemo(() =>
    controls.map((ctrl) => (
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
    )), [controls]);

  useEffect(() => {
    // Initialize particles immediately
    setParticles(generateParticles());
    
    // Start particle animation
    animateParticles();
    
    if (autoPlay) {
      startAnimation();
    }

    // Regenerate particles periodically for variety
    intervalRef.current = setInterval(() => {
      setParticles(generateParticles());
    }, 15000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, generateParticles, animateParticles, startAnimation]);

  return (
    <div
      ref={containerRef}
      className={`${styles.logoContainer} ${className}`}
      onClick={handleClick}
    >
      {/* Fast Moving Particles */}
      <div className={styles.particlesLayer}>
        {particleElements}
      </div>

      <h1
        className={`${styles.logoText} ${isAnimating ? styles.animate : ""}`}
        data-text={text}
      >
        {text}
      </h1>

      {/* Time Machine Control Elements */}
      <div className={styles.controlsLayer}>
        {controlElements}
      </div>
    </div>
  );
};

export default GlowGlitchLogo;