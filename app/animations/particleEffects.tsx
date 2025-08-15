"use client";
import { useEffect, useState } from "react";

interface Dot {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

export default function ParticleEffect() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const generatedDots = Array.from({ length: 50 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
    }));
    setDots(generatedDots);
  }, []);

  return (
    <div className="absolute inset-0 opacity-20">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
          style={{
            left: dot.left,
            top: dot.top,
            animationDelay: dot.animationDelay,
            animationDuration: dot.animationDuration,
          }}
        />
      ))}
    </div>
  );
}
