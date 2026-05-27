'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Partido } from '@/types'
import TarjetaPartido from '@/components/partidos/TarjetaPartido'
import { AnimatedListItem } from '@/components/magicui/animated-list'

export default function PartidosSection({
  enVivo,
  proximos,
}: {
  enVivo: Partido[]
  proximos: Partido[]
}) {
  return (
    <div className="space-y-10">
      {/* En vivo */}
      {enVivo.length > 0 && (
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 live-pulse" />
              <h2 className="text-xl font-bold text-white">En vivo ahora</h2>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-bold">
                {enVivo.length}
              </span>
            </div>
            <Link href="/partidos?filtro=vivo" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {enVivo.map((p, i) => (
              <AnimatedListItem key={p.id} index={i}>
                <TarjetaPartido partido={p} />
              </AnimatedListItem>
            ))}
          </div>
        </section>
      )}

      {/* Próximos */}
      {proximos.length > 0 && (
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-4"
          >
            <h2 className="text-xl font-bold text-white">Partidos de hoy</h2>
            <Link href="/partidos" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {proximos.map((p, i) => (
              <AnimatedListItem key={p.id} index={i}>
                <TarjetaPartido partido={p} />
              </AnimatedListItem>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
