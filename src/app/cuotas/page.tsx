'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CUOTAS_COMPARACION_MOCK, PARTIDOS_MOCK } from '@/lib/api/mock-data'
import { formatCuota, calcularArbitraje, cn } from '@/lib/utils'
import { TrendingUp, AlertCircle, Loader2, Zap, ChevronDown, ChevronUp } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { EventoConCuotas } from '@/lib/api/adapters'
import { SpotlightCard } from '@/components/aceternity/spotlight'
import { BackgroundDots, GlowOrb } from '@/components/aceternity/background-grid'
import { NumberTicker } from '@/components/magicui/number-ticker'

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

  const totalArbitrajes = eventos.filter(e => {
    if (e.cuotas.length < 2) return false
    const maxL = Math.max(...e.cuotas.map(c => c.local))
    const maxV = Math.max(...e.cuotas.map(c => c.visitante))
    const maxE = e.cuotas[0].empate ? Math.max(...e.cuotas.filter(c => c.empate).map(c => c.empate!)) : null
    const vals = maxE ? [maxL, maxE, maxV] : [maxL, maxV]
    return calcularArbitraje(vals) < 1
  }).length

  return (
    <div className="space-y-8 relative">
      <BackgroundDots />
      <GlowOrb className="-top-20 right-0 opacity-30" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Comparador de cuotas</h1>
          <p className="text-zinc-500">Las mejores cuotas de 8+ bookmakers para LATAM y España</p>
        </div>
        {totalArbitrajes > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <Zap size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-green-400">
              {totalArbitrajes} arbitraje{totalArbitrajes > 1 ? 's' : ''} detectado{totalArbitrajes > 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Selector de liga */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {DEPORTES.map(({ key, label }, i) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setDeporte(key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              deporte === key
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : 'bg-[#111118] text-zinc-400 border border-[#2a2a38] hover:text-white hover:border-[#3a3a50]'
            )}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      {usandoMock && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs text-yellow-500"
        >
          <AlertCircle size={13} />
          Mostrando datos de demostración — la API se activará cuando haya eventos disponibles para esta liga.
        </motion.div>
      )}

      {/* Contenido */}
      <AnimatePresence mode="wait">
        {cargando ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-3"
          >
            <Loader2 size={28} className="animate-spin text-indigo-400" />
            <span className="text-sm">Cargando cuotas en tiempo real...</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {eventos.map((evento, i) => (
              <motion.div
                key={evento.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <TablaEventoCuotas evento={evento} />
              </motion.div>
            ))}

            {eventos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-zinc-500"
              >
                <TrendingUp size={32} className="mx-auto mb-3 opacity-30" />
                <p>No hay eventos con cuotas disponibles</p>
                <p className="text-sm mt-1">Prueba con otra liga</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detector de arbitraje */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#111118] border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden"
      >
        <GlowOrb className="-bottom-10 -right-10 opacity-20" />
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Zap size={16} className="text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-white">Detector de arbitraje</h2>
          <Badge variant="indigo">Surebets</Badge>
        </div>
        <p className="text-sm text-zinc-500 mb-5">
          Cuando la suma de probabilidades implícitas es &lt;100%, existe una oportunidad de ganancia garantizada.
        </p>
        <ArbitrajeDetector eventos={eventos} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex items-start gap-2 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl"
      >
        <AlertCircle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500">
          Cuotas actualizadas cada 2 minutos. Pueden variar al momento de apostar.
          ApuestaAnalytics no opera como casa de apuestas — solo compara información pública.
        </p>
      </motion.div>
    </div>
  )
}

function TablaEventoCuotas({ evento }: { evento: EventoConCuotas }) {
  const [expandido, setExpandido] = useState(false)
  const { cuotas } = evento
  if (cuotas.length === 0) return null

  const maxLocal = Math.max(...cuotas.map(c => c.local))
  const maxEmpate = cuotas[0].empate ? Math.max(...cuotas.filter(c => c.empate).map(c => c.empate!)) : 0
  const maxVisitante = Math.max(...cuotas.map(c => c.visitante))
  const tieneEmpate = cuotas.some(c => c.empate !== undefined)
  const tieneTotals = cuotas.some(c => c.over25 !== undefined)

  const suma = tieneEmpate
    ? calcularArbitraje([maxLocal, maxEmpate, maxVisitante])
    : calcularArbitraje([maxLocal, maxVisitante])
  const esArbitraje = suma < 1

  const visibles = expandido ? cuotas : cuotas.slice(0, 4)

  return (
    <SpotlightCard
      spotlightColor={esArbitraje ? 'rgba(34,197,94,0.08)' : 'rgba(99,102,241,0.08)'}
      className={cn(
        'bg-[#111118] border rounded-2xl overflow-hidden transition-all duration-300',
        esArbitraje ? 'border-green-500/30' : 'border-[#2a2a38] hover:border-[#3a3a50]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a24]">
        <div>
          <span className="text-sm font-semibold text-white">
            {evento.local} <span className="text-zinc-600 mx-1">vs</span> {evento.visitante}
          </span>
          <span className="ml-3 text-xs text-zinc-600">{evento.liga}</span>
        </div>
        <div className="flex items-center gap-2">
          {esArbitraje && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/20"
            >
              <Zap size={11} className="text-green-400" />
              <span className="text-xs font-bold text-green-400">
                +{((1 / suma - 1) * 100).toFixed(1)}% profit
              </span>
            </motion.div>
          )}
          <span className="text-xs text-zinc-700 hidden md:block">
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
              <th className="text-center px-4 py-2 font-medium">1</th>
              {tieneEmpate && <th className="text-center px-4 py-2 font-medium">X</th>}
              <th className="text-center px-4 py-2 font-medium">2</th>
              {tieneTotals && <>
                <th className="text-center px-4 py-2 font-medium">+2.5</th>
                <th className="text-center px-4 py-2 font-medium">-2.5</th>
              </>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#0f0f16]">
            <AnimatePresence>
              {visibles.map((c, i) => (
                <motion.tr
                  key={c.bookmaker}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-[#1a1a24] transition-colors"
                >
                  <td className="px-5 py-2.5 text-sm font-medium text-zinc-300">{c.bookmaker}</td>
                  <CuotaCell value={c.local} isBest={c.local === maxLocal} />
                  {tieneEmpate && <CuotaCell value={c.empate ?? 0} isBest={!!c.empate && c.empate === maxEmpate} />}
                  <CuotaCell value={c.visitante} isBest={c.visitante === maxVisitante} />
                  {tieneTotals && <>
                    <td className="px-4 py-2.5 text-center text-sm text-zinc-500 tabular-nums">{c.over25 ? formatCuota(c.over25) : '—'}</td>
                    <td className="px-4 py-2.5 text-center text-sm text-zinc-500 tabular-nums">{c.under25 ? formatCuota(c.under25) : '—'}</td>
                  </>}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
          <tfoot>
            <tr className="border-t border-[#2a2a38] bg-[#0d0d14]">
              <td className="px-5 py-2 text-xs text-zinc-600 font-semibold">MEJOR ★</td>
              <td className="px-4 py-2 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(maxLocal)}</td>
              {tieneEmpate && <td className="px-4 py-2 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(maxEmpate)}</td>}
              <td className="px-4 py-2 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(maxVisitante)}</td>
              {tieneTotals && <><td /><td /></>}
            </tr>
          </tfoot>
        </table>
      </div>

      {cuotas.length > 4 && (
        <button
          onClick={() => setExpandido(!expandido)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-zinc-500 hover:text-zinc-300 border-t border-[#1a1a24] transition-colors"
        >
          {expandido ? <><ChevronUp size={14} /> Ver menos</> : <><ChevronDown size={14} /> Ver {cuotas.length - 4} bookmakers más</>}
        </button>
      )}
    </SpotlightCard>
  )
}

function CuotaCell({ value, isBest }: { value: number; isBest: boolean }) {
  if (!value) return <td className="px-4 py-2.5 text-center text-sm text-zinc-700">—</td>
  return (
    <td className={cn('px-4 py-2.5 text-center text-sm font-bold tabular-nums', isBest ? 'text-green-400' : 'text-zinc-300')}>
      {isBest ? (
        <motion.span
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-1"
        >
          {formatCuota(value)}
          <TrendingUp size={9} />
        </motion.span>
      ) : formatCuota(value)}
    </td>
  )
}

function ArbitrajeDetector({ eventos }: { eventos: EventoConCuotas[] }) {
  const candidatos = eventos.map(e => {
    if (e.cuotas.length < 2) return null
    const maxL = Math.max(...e.cuotas.map(c => c.local))
    const maxV = Math.max(...e.cuotas.map(c => c.visitante))
    const maxE = e.cuotas[0].empate ? Math.max(...e.cuotas.filter(c => c.empate).map(c => c.empate!)) : null
    const vals = maxE ? [maxL, maxE, maxV] : [maxL, maxV]
    const suma = calcularArbitraje(vals)
    return { evento: e, suma, maxL, maxE, maxV }
  }).filter(Boolean).sort((a, b) => a!.suma - b!.suma).slice(0, 3)

  if (candidatos.length === 0) {
    return <p className="text-sm text-zinc-600 text-center py-6">No hay oportunidades detectadas en este momento.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {candidatos.map((item, i) => {
        if (!item) return null
        const { evento, suma, maxL, maxE, maxV } = item
        const esArb = suma < 1
        return (
          <motion.div
            key={evento.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              'p-4 rounded-xl border',
              esArb ? 'border-green-500/30 bg-green-500/5' : 'border-[#2a2a38] bg-[#1a1a24]'
            )}
          >
            <div className="text-sm font-medium text-zinc-300 mb-0.5 truncate">{evento.local} vs {evento.visitante}</div>
            <div className="text-xs text-zinc-600 mb-3">{evento.liga}</div>
            <div className="space-y-1.5">
              {[['Local', maxL], ...(maxE ? [['Empate', maxE]] : []), ['Visitante', maxV]].map(([label, val]) => (
                <div key={String(label)} className="flex justify-between text-xs">
                  <span className="text-zinc-500">{label}</span>
                  <span className="font-mono text-zinc-300">{formatCuota(Number(val))}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-[#2a2a38] flex items-center justify-between">
              <span className="text-xs text-zinc-600">Margen</span>
              <span className={cn('text-sm font-bold tabular-nums', esArb ? 'text-green-400' : 'text-zinc-500')}>
                {(suma * 100).toFixed(1)}%
              </span>
            </div>
            {esArb && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-center text-xs font-bold text-green-400 bg-green-500/10 rounded-lg py-1.5"
              >
                ✓ Profit: +{((1 / suma - 1) * 100).toFixed(2)}%
              </motion.div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
