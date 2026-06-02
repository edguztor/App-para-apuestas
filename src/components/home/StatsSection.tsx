'use client'

import { motion } from 'framer-motion'
import { NumberTicker } from '@/components/magicui/number-ticker'
import { MovingBorderCard } from '@/components/aceternity/moving-border'

const STATS = [
  { valor: 8, sufijo: '+', label: 'Bookmakers', desc: 'comparados en tiempo real', color: 'text-indigo-400' },
  { valor: 20, sufijo: '+', label: 'Ligas', desc: 'de todo el mundo', color: 'text-purple-400' },
  { valor: 100, sufijo: '%', label: 'Gratis', desc: 'sin registro obligatorio', color: 'text-green-400' },
]

export default function StatsSection() {
  return (
    <section>
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ valor, sufijo, label, desc, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <MovingBorderCard
              containerClassName="h-full"
              className="p-4 md:p-6 text-center h-full"
              duration={4000 + i * 1000}
            >
              <div className={`text-2xl md:text-3xl font-bold flex items-center justify-center gap-0.5 ${color}`}>
                <NumberTicker value={valor} />
                <span>{sufijo}</span>
              </div>
              <div className="text-sm font-semibold text-white mt-1">{label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
            </MovingBorderCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
