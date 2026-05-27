'use client'

import { cn } from '@/lib/utils'
import { CSSProperties } from 'react'

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  colorFrom = '#6366f1',
  colorTo = '#a855f7',
  delay = 0,
}: {
  className?: string
  size?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
  delay?: number
}) {
  return (
    <div
      style={{
        '--size': size,
        '--duration': duration,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--delay': `-${delay}s`,
      } as CSSProperties}
      className={cn(
        'absolute inset-0 rounded-[inherit] [border:calc(var(--size)*0.01px)_solid_transparent]',
        '[background:linear-gradient(#0f0f16,#0f0f16)_padding-box,conic-gradient(from_calc(360deg*(var(--delay)/var(--duration))),var(--color-from)_0,var(--color-to)_10%,transparent_30%)_border-box]',
        'animate-[beam_var(--duration)s_linear_infinite]',
        'pointer-events-none',
        className,
      )}
    >
      <style jsx>{`
        @keyframes beam {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
      `}</style>
    </div>
  )
}
