'use client'

import { useEffect, useRef } from 'react'
import { useFluidBackground } from '../hooks/useFluidBackground'
import { useScrollParticles } from '../hooks/useScrollParticles'

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useFluidBackground(canvasRef)
  const particles = useScrollParticles()

  return (
    <>
      <canvas
        ref={canvasRef}
        id="fluid-bg"
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{ touchAction: 'none' }}
        aria-hidden="true"
      />

      <div className="fixed inset-0 pointer-events-none z-20" aria-hidden="true">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full transition-all duration-100"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
              transform: `scale(${1 - particle.life / particle.maxLife})`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </>
  )
}