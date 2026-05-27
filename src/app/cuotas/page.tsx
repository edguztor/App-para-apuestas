'use client'

import { useState, useEffect } from 'react'
import { CUOTAS_COMPARACION_MOCK, PARTIDOS_MOCK } from '@/lib/api/mock-data'
import { formatCuota, calcularArbitraje, cn } from '@/lib/utils'
import { TrendingUp, AlertCircle, ExternalLink, Loader2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { EventoConCuotas } from '@/lib/api/adapters'
import Link from 'next/link'

const DEPORTES = [
  { key: 'futbol', label: '⚽ La Liga' },
  { key: 'futbol-premier', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
  { key: 'futbol-champions', label: '🏆 Champions' },
  { key: 'futbol-mx', label: '🇲🇽 Liga MX' },
  { key: 'baloncesto', label: '🏀 NBA' },
]

export default function CuotasPage() {
  const [deporte, setDeporte] = useState('futbol')
  const [eventos, setEventos] = useState<EventoConCuotas[]>([])
  const [cargando, setCargando] = useState(true)
  const [usandoMock, setUsandoMock] = useState(false)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      try {
        const res = await fetch(`/api/cuotas?deporte=${deporte}`)
        const data: EventoConCuotas[] = await res.json()
        if (data.length > 0) {
          setEventos(data)
          setUsandoMock(false)
        } else {
          cargarMock()
        }
      } catch {
        cargarMock()
      } finally {
        setCargando(false)
      }
    }

    function cargarMock() {
      const mockEventos: EventoConCuotas[] = PARTIDOS_MOCK.filter(p => p.cuotas).map(p => ({
        id: String(p.id),
        liga: p.liga,
        local: p.local.nombre,
        visitante: p.visitante.nombre,
        fecha: p.fecha,
        cuotas: CUOTAS_COMPARACION_MOCK.filter(c => c.partidoId === p.id),
      }))
      setEventos(mockEventos)
      setUsandoMock(true)
    }

    cargar()
  }, [deporte])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Comparador de cuotas</h1>
        <p className="text-zinc-500 text-sm">Las mejores cuotas de 8+ bookmakers para mercados en LATAM y España</p>
      </div>

      {/* Selector de deporte/liga */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DEPORTES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setDeporte(key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              deporte === key
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-[#111118] text-zinc-400 border border-[#2a2a38] hover:text-white hover:border-[#3a3a50]'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {usandoMock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg text-xs text-yellow-500">
          <AlertCircle size={13} />
          Mostrando datos de demostración — la API se activará cuando haya eventos disponibles para esta liga.
        </div>
      )}

      {cargando ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={24} className="animate-spin mr-3" />
          <span>Cargando cuotas en tiempo real...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {eventos.map(evento => (
            <TablaEventoCuotas key={evento.id} evento={evento} />
          ))}
          {eventos.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
              <p>No hay eventos con cuotas disponibles ahora mismo</p>
              <p className="text-sm mt-1">Prueba con otra liga</p>
            </div>
          )}
        </div>
      )}

      {/* Calculadora de arbitraje */}
      <div className="bg-[#111118] border border-indigo-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-2">Detector de arbitraje (Surebets)</h2>
        <p className="text-sm text-zinc-500 mb-4">
          El arbitraje existe cuando la suma de probabilidades implícitas es menor a 100%.
          Esto garantiza ganancia independientemente del resultado.
        </p>
        <ArbitrajeDetector eventos={eventos} />
      </div>

      <div className="flex items-start gap-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
        <AlertCircle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500">
          Las cuotas se actualizan cada 2 minutos. Pueden variar al momento de apostar.
          ApuestaAnalytics no opera como casa de apuestas — solo compara información pública.
        </p>
      </div>
    </div>
  )
}

function TablaEventoCuotas({ evento }: { evento: EventoConCuotas }) {
  const { cuotas } = evento
  if (cuotas.length === 0) return null

  const maxLocal = Math.max(...cuotas.map(c => c.local))
  const maxEmpate = cuotas[0].empate ? Math.max(...cuotas.filter(c => c.empate).map(c => c.empate!)) : 0
  const maxVisitante = Math.max(...cuotas.map(c => c.visitante))
  const tieneEmpate = cuotas.some(c => c.empate !== undefined)
  const tieneTotals = cuotas.some(c => c.over25 !== undefined)

  const sumaArbitraje = tieneEmpate
    ? calcularArbitraje([maxLocal, maxEmpate, maxVisitante])
    : calcularArbitraje([maxLocal, maxVisitante])
  const esArbitraje = sumaArbitraje < 1

  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl overflow-hidden hover:border-[#3a3a50] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a38]">
        <div>
          <span className="text-sm font-semibold text-white">
            {evento.local} <span className="text-zinc-600 mx-1">vs</span> {evento.visitante}
          </span>
          <span className="ml-3 text-xs text-zinc-600">{evento.liga}</span>
        </div>
        <div className="flex items-center gap-2">
          {esArbitraje && (
            <Badge variant="green">
              ⚡ Arbitraje +{((1 / sumaArbitraje - 1) * 100).toFixed(1)}%
            </Badge>
          )}
          <span className="text-xs text-zinc-600">
            {new Date(evento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-zinc-600 border-b border-[#1a1a24]">
              <th className="text-left px-5 py-2 font-medium">Bookmaker</th>
              <th className="text-center px-4 py-2 font-medium">1 (Local)</th>
              {tieneEmpate && <th className="text-center px-4 py-2 font-medium">X</th>}
              <th className="text-center px-4 py-2 font-medium">2 (Visit.)</th>
              {tieneTotals && (
                <>
                  <th className="text-center px-4 py-2 font-medium">+2.5</th>
                  <th className="text-center px-4 py-2 font-medium">-2.5</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a24]">
            {cuotas.map(c => (
              <tr key={c.bookmaker} className="hover:bg-[#1a1a24] transition-colors">
                <td className="px-5 py-2.5 text-sm font-medium text-zinc-300">{c.bookmaker}</td>
                <CuotaCell value={c.local} isBest={c.local === maxLocal} />
                {tieneEmpate && <CuotaCell value={c.empate ?? 0} isBest={!!c.empate && c.empate === maxEmpate} />}
                <CuotaCell value={c.visitante} isBest={c.visitante === maxVisitante} />
                {tieneTotals && (
                  <>
                    <td className="px-4 py-2.5 text-center text-sm text-zinc-500 tabular-nums">{c.over25 ? formatCuota(c.over25) : '—'}</td>
                    <td className="px-4 py-2.5 text-center text-sm text-zinc-500 tabular-nums">{c.under25 ? formatCuota(c.under25) : '—'}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[#2a2a38] bg-[#0f0f16]">
              <td className="px-5 py-2 text-xs text-zinc-600 font-semibold">MEJOR CUOTA ★</td>
              <td className="px-4 py-2 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(maxLocal)}</td>
              {tieneEmpate && <td className="px-4 py-2 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(maxEmpate)}</td>}
              <td className="px-4 py-2 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(maxVisitante)}</td>
              {tieneTotals && <><td /><td /></>}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

function CuotaCell({ value, isBest }: { value: number; isBest: boolean }) {
  if (!value) return <td className="px-4 py-2.5 text-center text-sm text-zinc-600">—</td>
  return (
    <td className={cn(
      'px-4 py-2.5 text-center text-sm font-bold tabular-nums',
      isBest ? 'text-green-400' : 'text-zinc-300'
    )}>
      {formatCuota(value)}
      {isBest && <TrendingUp size={10} className="inline ml-1" />}
    </td>
  )
}

function ArbitrajeDetector({ eventos }: { eventos: EventoConCuotas[] }) {
  const candidatos = eventos
    .map(e => {
      if (e.cuotas.length < 2) return null
      const maxLocal = Math.max(...e.cuotas.map(c => c.local))
      const maxVisitante = Math.max(...e.cuotas.map(c => c.visitante))
      const maxEmpate = e.cuotas[0].empate
        ? Math.max(...e.cuotas.filter(c => c.empate).map(c => c.empate!))
        : null

      const vals = maxEmpate ? [maxLocal, maxEmpate, maxVisitante] : [maxLocal, maxVisitante]
      const suma = calcularArbitraje(vals)
      return { evento: e, suma, vals, maxLocal, maxEmpate, maxVisitante }
    })
    .filter(Boolean)
    .sort((a, b) => a!.suma - b!.suma)
    .slice(0, 3)

  if (candidatos.length === 0) {
    return <p className="text-sm text-zinc-600 text-center py-4">No hay oportunidades de arbitraje detectadas ahora mismo.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {candidatos.map(item => {
        if (!item) return null
        const { evento, suma, maxLocal, maxEmpate, maxVisitante } = item
        const esArb = suma < 1
        const profit = esArb ? ((1 / suma - 1) * 100).toFixed(2) : null
        return (
          <div key={evento.id} className={cn(
            'p-4 rounded-xl border',
            esArb ? 'border-green-500/30 bg-green-500/5' : 'border-[#2a2a38] bg-[#1a1a24]'
          )}>
            <div className="text-sm font-medium text-zinc-300 mb-1 truncate">{evento.local} vs {evento.visitante}</div>
            <div className="text-xs text-zinc-600 mb-3">{evento.liga}</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Mejor local</span>
                <span className="font-mono text-zinc-300">{formatCuota(maxLocal)}</span>
              </div>
              {maxEmpate && (
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Mejor empate</span>
                  <span className="font-mono text-zinc-300">{formatCuota(maxEmpate)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Mejor visitante</span>
                <span className="font-mono text-zinc-300">{formatCuota(maxVisitante)}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#2a2a38] flex items-center justify-between">
              <span className="text-xs text-zinc-600">Margen implícito</span>
              <span className={cn('text-sm font-bold', esArb ? 'text-green-400' : 'text-zinc-400')}>
                {(suma * 100).toFixed(1)}%
              </span>
            </div>
            {profit && (
              <div className="mt-2 text-center text-xs font-semibold text-green-400 bg-green-500/10 rounded-lg py-1.5">
                ✓ Profit garantizado: +{profit}%
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
