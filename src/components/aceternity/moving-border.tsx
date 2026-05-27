'use client'

import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export function MovingBorderCard({
  children,
  className,
  containerClassName,
  borderClassName,
  duration = 3000,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  borderClassName?: string
  duration?: number
}) {
  const pathRef = useRef<SVGRectElement>(null)
  const progress = useMotionValue<number>(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength?.() ?? 0
    if (length) {
      const pct = (time % duration) / duration
      progress.set(pct)
    }
  })

  const x = useTransform(progress, (val) => {
    const rect = pathRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const totalLength = pathRef.current?.getTotalLength?.() ?? 0
    const point = pathRef.current?.getPointAtLength?.(val * totalLength)
    return point?.x ?? 0
  })

  const y = useTransform(progress, (val) => {
    const totalLength = pathRef.current?.getTotalLength?.() ?? 0
    const point = pathRef.current?.getPointAtLength?.(val * totalLength)
    return point?.y ?? 0
  })

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <div className={cn('relative p-[1px] overflow-hidden rounded-xl', containerClassName)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
      >
        <rect fill="none" width="100%" height="100%" rx="12" ry="12" ref={pathRef} />
      </svg>
      <motion.div
        style={{ transform }}
        className={cn(
          'absolute z-50 h-16 w-16 opacity-[0.8]',
          'bg-[radial-gradient(circle,rgba(99,102,241,0.8)_0%,transparent_70%)]',
          borderClassName
        )}
      />
      <div className={cn('relative bg-[#0f0f16] rounded-xl', className)}>
        {children}
      </div>
    </div>
  )
}
