'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export function NumberTicker({
  value,
  decimalPlaces = 0,
  className,
}: {
  value: number
  decimalPlaces?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { damping: 60, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (isInView) motionVal.set(value)
  }, [isInView, motionVal, value])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('es-MX', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(v.toFixed(decimalPlaces)))
      }
    })
  }, [spring, decimalPlaces])

  return <span ref={ref} className={cn('tabular-nums', className)}>0</span>
}
