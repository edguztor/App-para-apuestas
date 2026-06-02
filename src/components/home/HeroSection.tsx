'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Globe, Sparkles } from 'lucide-react'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { NumberTicker } from '@/components/magicui/number-ticker'

export default function HeroSection() {
  return (
    <section className="relative text-center pt-8 pb-4">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6"
      >
        <Globe size={14} />
        Para apostadores hispanohablantes
        <Sparkles size={12} className="text-yellow-400" />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-[1.1]"
      >
        Toma decisiones con
        <br />
        <AnimatedGradientText className="text-4xl md:text-6xl lg:text-7xl font-bold">
          datos reales
        </AnimatedGradientText>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-8"
      >
        Compara cuotas, analiza estadísticas avanzadas (xG, PPDA) y gestiona tu bankroll.
        Todo en un solo lugar, en español.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap gap-3 justify-center mb-12"
      >
        <Link
          href="/partidos"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
        >
          Ver partidos de hoy
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/cuotas"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-semibold transition-all hover:scale-105"
        >
          Comparar cuotas
        </Link>
      </motion.div>

      {/* Stats en vivo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-8 text-center"
      >
        {[
          { valor: 8, sufijo: '+', label: 'Bookmakers' },
          { valor: 20, sufijo: '+', label: 'Ligas' },
          { valor: 670, sufijo: 'M', label: 'Hispanohablantes' },
        ].map(({ valor, sufijo, label }) => (
          <div key={label}>
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-0.5">
              <NumberTicker value={valor} className="text-indigo-400" />
              <span className="text-indigo-400">{sufijo}</span>
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
