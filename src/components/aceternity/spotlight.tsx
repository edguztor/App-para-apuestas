'use client'

import { useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(99, 102, 241, 0.15)',
}: {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn('relative overflow-hidden', className)}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-xl"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  )
}
