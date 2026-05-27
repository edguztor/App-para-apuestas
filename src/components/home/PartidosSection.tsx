'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarX, RefreshCw } from 'lucide-react'
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
  const hayPartidos = enVivo.length > 0 || proximos.length > 0

  if (!hayPartidos) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-8 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
          <CalendarX size={24} className="text-zinc-500" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-300 mb-2">Sin partidos programados hoy</h3>
        <p className="text-sm text-zinc-600 max-w-sm mx-auto mb-5">
          No hay partidos activos en las ligas principales en este momento. Los datos aparecerán automáticamente cuando haya jornada.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/cuotas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all hover:scale-105"
          >
            Ver cuotas disponibles
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/estadisticas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-sm font-medium transition-all"
          >
            Estadísticas
          </Link>
        </div>
      </motion.section>
    )
  }

  return (
    <div className="space-y-10">
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
            <Link href="/partidos" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
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
