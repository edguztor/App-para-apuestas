'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Partido } from '@/types'
import { formatCuota, formatFecha, cn } from '@/lib/utils'
import { Clock, Zap } from 'lucide-react'
import { SpotlightCard } from '@/components/aceternity/spotlight'

interface Props {
  partido: Partido
  compact?: boolean
}

const DEPORTE_EMOJI: Record<string, string> = {
  futbol: '⚽',
  baloncesto: '🏀',
  tenis: '🎾',
  americano: '🏈',
}

export default function TarjetaPartido({ partido, compact = false }: Props) {
  const enVivo = partido.estado === 'en_vivo'

  return (
    <Link href={`/partidos/${partido.id}`}>
      <SpotlightCard
        spotlightColor={enVivo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)'}
        className={cn(
          'bg-[#111118] border rounded-xl p-4 transition-all duration-300 cursor-pointer group hover:scale-[1.01]',
          enVivo
            ? 'border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]'
            : 'border-[#2a2a38] hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.08)]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{DEPORTE_EMOJI[partido.deporte]}</span>
            <span className="text-xs text-zinc-500 font-medium">{partido.liga}</span>
          </div>
          {enVivo ? (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-400">{partido.marcador?.minuto}&apos;</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1 text-zinc-600">
              <Clock size={11} />
              <span className="text-xs">{formatFecha(partido.fecha)}</span>
            </div>
          )}
        </div>

        {/* Equipos y marcador */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {partido.local.escudo && (
                <img src={partido.local.escudo} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
              )}
              <span className={cn(
                'text-sm font-semibold truncate',
                enVivo && partido.marcador && partido.marcador.local > partido.marcador.visitante
                  ? 'text-white' : 'text-zinc-200'
              )}>
                {partido.local.nombre}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {partido.visitante.escudo && (
                <img src={partido.visitante.escudo} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
              )}
              <span className={cn(
                'text-sm font-semibold truncate',
                enVivo && partido.marcador && partido.marcador.visitante > partido.marcador.local
                  ? 'text-white' : 'text-zinc-200'
              )}>
                {partido.visitante.nombre}
              </span>
            </div>
          </div>

          {/* Marcador o cuotas */}
          {enVivo && partido.marcador ? (
            <div className="text-center min-w-[48px]">
              <motion.div
                key={partido.marcador.local}
                initial={{ scale: 1.3, color: '#22c55e' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-xl font-bold tabular-nums"
              >
                {partido.marcador.local}
              </motion.div>
              <div className="text-xs text-zinc-700 my-0.5">—</div>
              <motion.div
                key={partido.marcador.visitante}
                initial={{ scale: 1.3, color: '#22c55e' }}
                animate={{ scale: 1, color: '#ffffff' }}
                className="text-xl font-bold tabular-nums"
              >
                {partido.marcador.visitante}
              </motion.div>
            </div>
          ) : partido.cuotas && !compact ? (
            <div className="flex gap-1.5 flex-shrink-0">
              <CuotaChip label="1" value={partido.cuotas.local} />
              {partido.cuotas.empate && <CuotaChip label="X" value={partido.cuotas.empate} />}
              <CuotaChip label="2" value={partido.cuotas.visitante} />
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!compact && partido.cuotas && (
          <div className="mt-3 pt-3 border-t border-[#1a1a24] flex items-center justify-between">
            <span className="text-xs text-zinc-700">{partido.cuotas.casa}</span>
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Zap size={11} />
              <span className="text-xs">Ver análisis</span>
            </motion.div>
          </div>
        )}
      </SpotlightCard>
    </Link>
  )
}

function CuotaChip({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(99,102,241,0.1)' }}
      className="flex flex-col items-center px-2.5 py-1.5 bg-[#1a1a24] rounded-lg border border-[#2a2a38] min-w-[44px] cursor-pointer transition-colors"
    >
      <span className="text-xs text-zinc-600 mb-0.5">{label}</span>
      <span className="text-sm font-bold text-white tabular-nums">{formatCuota(value)}</span>
    </motion.div>
  )
}
