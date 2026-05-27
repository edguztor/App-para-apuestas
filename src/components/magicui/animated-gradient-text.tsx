'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function AnimatedGradientText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn(
      'animate-gradient bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-[length:200%_auto] bg-clip-text text-transparent',
      className
    )}
    style={{ animation: 'gradient 4s linear infinite' }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </span>
  )
}
