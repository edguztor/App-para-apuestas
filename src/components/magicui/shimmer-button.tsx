'use client'

import { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  onClick?: () => void
  href?: string
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = '#6366f1',
  shimmerSize = '0.05em',
  shimmerDuration = '3s',
  borderRadius = '12px',
  background = 'rgba(99, 102, 241, 0.9)',
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        '--shimmer-color': shimmerColor,
        '--radius': borderRadius,
        '--speed': shimmerDuration,
        '--cut': shimmerSize,
        '--bg': background,
      } as CSSProperties}
      className={cn(
        'group relative cursor-pointer overflow-hidden whitespace-nowrap px-6 py-3 font-semibold text-white',
        '[background:var(--bg)] [border-radius:var(--radius)]',
        'transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]',
        className,
      )}
    >
      <div className={cn(
        'absolute inset-0 overflow-hidden [border-radius:var(--radius)]',
      )}>
        <div className={cn(
          'absolute inset-[-100%] rotate-[-60deg] animate-[shimmer_3s_infinite]',
          'bg-[conic-gradient(from_90deg,transparent_25%,var(--shimmer-color)_50%,transparent_75%)]',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-500',
        )} />
      </div>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <style jsx>{`
        @keyframes shimmer {
          from { transform: rotate(-60deg) translateX(-100%); }
          to { transform: rotate(-60deg) translateX(100%); }
        }
      `}</style>
    </button>
  )
}
