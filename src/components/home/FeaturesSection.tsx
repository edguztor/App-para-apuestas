'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, DollarSign, Shield, Zap, Users } from 'lucide-react'
import { SpotlightCard } from '@/components/aceternity/spotlight'
import Link from 'next/link'

const FEATURES = [
  {
    icon: TrendingUp,
    titulo: 'Comparación de cuotas',
    desc: 'Las mejores cuotas de 8+ bookmakers en tiempo real. Encuentra siempre el máximo valor.',
    href: '/cuotas',
    color: 'from-indigo-500/20 to-indigo-600/5',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10',
    spotlight: 'rgba(99, 102, 241, 0.12)',
  },
  {
    icon: BarChart3,
    titulo: 'Estadísticas avanzadas',
    desc: 'xG, xGA, PPDA y forma reciente explicados en español para tomar mejores decisiones.',
    href: '/estadisticas',
    color: 'from-purple-500/20 to-purple-600/5',
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    spotlight: 'rgba(168, 85, 247, 0.12)',
  },
  {
    icon: DollarSign,
    titulo: 'Bet Tracker',
    desc: 'Controla tu bankroll, ROI y rendimiento con gráficos y análisis detallados.',
    href: '/tracker',
    color: 'from-green-500/20 to-green-600/5',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/10',
    spotlight: 'rgba(34, 197, 94, 0.10)',
  },
  {
    icon: Shield,
    titulo: 'Value Bets',
    desc: 'Detecta apuestas con valor positivo comparando contra las líneas de Pinnacle.',
    href: '/cuotas',
    color: 'from-yellow-500/20 to-yellow-600/5',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/10',
    spotlight: 'rgba(234, 179, 8, 0.10)',
  },
  {
    icon: Zap,
    titulo: 'Arbitraje',
    desc: 'Detecta oportunidades de arbitraje en tiempo real para garantizar ganancias.',
    href: '/cuotas',
    color: 'from-pink-500/20 to-pink-600/5',
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10',
    spotlight: 'rgba(236, 72, 153, 0.10)',
  },
  {
    icon: Users,
    titulo: 'Multi-deporte',
    desc: 'Fútbol, básquet, tenis y más. Cobertura de ligas de México, España y el mundo.',
    href: '/partidos',
    color: 'from-cyan-500/20 to-cyan-600/5',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/10',
    spotlight: 'rgba(6, 182, 212, 0.10)',
  },
]

export default function FeaturesSection() {
  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Todo lo que necesitas para apostar mejor</h2>
        <p className="text-zinc-500">Herramientas profesionales, en español, gratis.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map(({ icon: Icon, titulo, desc, href, color, iconColor, iconBg, spotlight }, i) => (
          <motion.div
            key={titulo}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Link href={href}>
              <SpotlightCard
                spotlightColor={spotlight}
                className={`h-full bg-[#111118] border border-[#2a2a38] rounded-xl p-5 hover:border-[#3a3a50] transition-all duration-300 cursor-pointer group bg-gradient-to-br ${color}`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{titulo}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </SpotlightCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
