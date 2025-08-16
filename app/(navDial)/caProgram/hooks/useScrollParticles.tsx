'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { Particle } from '../types/caProgram'

const MAX_PARTICLES = 100

export function useScrollParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const particleIdRef = useRef(0)
  const lastScrollY = useRef(0)

  const createParticle = useCallback((scrollVelocity: number): Particle => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
    
    const side = Math.random() > 0.5 ? 'left' : 'right'
    const colors = ['#fbbf24', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
    
    return {
      id: particleIdRef.current++,
      x: side === 'left' ? -10 : windowWidth + 10,
      y: Math.random() * windowHeight,
      vx: side === 'left' ? 
        2 + Math.abs(scrollVelocity) * 0.1 : 
        -2 - Math.abs(scrollVelocity) * 0.1,
      vy: (Math.random() - 0.5) * 2 + scrollVelocity * 0.05,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.8 + 0.2,
      life: 0,
      maxLife: 180 + Math.random() * 120,
      side,
      color: colors[Math.floor(Math.random() * colors.length)]
    }
  }, [])

  const updateParticles = useCallback((scrollY: number) => {
    const scrollVelocity = scrollY - lastScrollY.current
    lastScrollY.current = scrollY

    setParticles(prev => {
      let newParticles = [...prev]

      // Add new particles if scrolling fast and under limit
      if (Math.abs(scrollVelocity) > 2 && newParticles.length < MAX_PARTICLES) {
        const numNewParticles = Math.min(
          Math.floor(Math.abs(scrollVelocity) / 5), 
          3,
          MAX_PARTICLES - newParticles.length
        )
        for (let i = 0; i < numNewParticles; i++) {
          newParticles.push(createParticle(scrollVelocity))
        }
      }

      // Update existing particles
      newParticles = newParticles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life + 1,
        opacity: particle.opacity * (1 - particle.life / particle.maxLife),
        vy: particle.vy * 0.98 // Add some drag
      }))

      // Filter out expired or out-of-bounds particles
      const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1080
      
      return newParticles.filter(particle => 
        particle.life < particle.maxLife && 
        particle.x > -50 && 
        particle.x < windowWidth + 50 &&
        particle.y > -50 && 
        particle.y < windowHeight + 50
      )
    })
  }, [createParticle])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      updateParticles(window.scrollY)
    }

    const handleWheel = (e: WheelEvent) => {
      const scrollVelocity = e.deltaY * 0.1
      updateParticles(window.scrollY + scrollVelocity)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [updateParticles])

  return particles
}