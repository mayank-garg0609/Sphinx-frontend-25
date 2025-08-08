'use client'

import { useEffect } from 'react'
import { RefObject } from 'react'

export function useFluidBackground(canvasRef: RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    let w = window.innerWidth
    let h = window.innerHeight
    let mouse = { x: w / 2, y: h / 2 }
    let animationId: number

    if (!canvas || !ctx) return

    const updateCanvasSize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w
      canvas.height = h
    }

    updateCanvasSize()

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleResize = () => {
      updateCanvasSize()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, Math.min(w, h) / 1.5
      )
      grad.addColorStop(0, "rgba(20, 20, 50, 0.8)")
      grad.addColorStop(0.3, "rgba(50, 10, 40, 0.5)")
      grad.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("touchmove", handleTouchMove)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [canvasRef])
}