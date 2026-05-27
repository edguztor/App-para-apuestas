'use client'

import { motion } from 'framer-motion'

export function TextReveal({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ')
  return (
    <p className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
