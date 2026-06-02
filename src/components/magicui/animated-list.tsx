'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

export function AnimatedListItem({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedList({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence>
      {children}
    </AnimatePresence>
  )
}
