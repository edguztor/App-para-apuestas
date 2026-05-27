'use client'

import Link from 'next/link'
import { Partido } from '@/types'
import { formatCuota, formatFecha, cn } from '@/lib/utils'
import { Clock, Zap } from 'lucide-react'

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
      <div className={cn(
        'bg-[#111118] border border-[#2a2a38] rounded-xl p-4 hover:border-indigo-500/50 hover:bg-[#111118]/80 transition-all cursor-pointer group',
        enVivo && 'border-red-500/30 hover:border-red-500/60'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">{DEPORTE_EMOJI[partido.deporte]}</span>
            <span className="text-xs text-zinc-500 font-medium">{partido.liga}</span>
          </div>
          {enVivo ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse" />
              <span className="text-xs font-bold text-red-400">{partido.marcador?.minuto}&apos;</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-zinc-500">
              <Clock size={12} />
              <span className="text-xs">{formatFecha(partido.fecha)}</span>
            </div>
          )}
        </div>

        {/* Equipos y marcador */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {partido.local.escudo && (
                <img src={partido.local.escudo} alt="" className="w-5 h-5 object-contain" />
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
                <img src={partido.visitante.escudo} alt="" className="w-5 h-5 object-contain" />
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
              <div className="text-xl font-bold text-white tabular-nums">
                {partido.marcador.local}
              </div>
              <div className="text-xs text-zinc-600 my-0.5">-</div>
              <div className="text-xl font-bold text-white tabular-nums">
                {partido.marcador.visitante}
              </div>
            </div>
          ) : partido.cuotas && !compact ? (
            <div className="flex gap-1.5">
              <CuotaChip label="1" value={partido.cuotas.local} />
              {partido.cuotas.empate && <CuotaChip label="X" value={partido.cuotas.empate} />}
              <CuotaChip label="2" value={partido.cuotas.visitante} />
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!compact && partido.cuotas && (
          <div className="mt-3 pt-3 border-t border-[#2a2a38] flex items-center justify-between">
            <span className="text-xs text-zinc-600">{partido.cuotas.casa}</span>
            <div className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap size={12} />
              <span className="text-xs">Ver análisis</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

function CuotaChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center px-2.5 py-1.5 bg-[#1a1a24] rounded-lg border border-[#2a2a38] min-w-[44px]">
      <span className="text-xs text-zinc-500 mb-0.5">{label}</span>
      <span className="text-sm font-bold text-white tabular-nums">{formatCuota(value)}</span>
    </div>
  )
}
