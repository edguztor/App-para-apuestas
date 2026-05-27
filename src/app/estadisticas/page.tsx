'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ESTADISTICAS_MOCK } from '@/lib/api/mock-data'
import { obtenerColorForma, cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { Info, Calculator, TrendingUp, TrendingDown } from 'lucide-react'
import { SpotlightCard } from '@/components/aceternity/spotlight'
import { BackgroundGrid, GlowOrb } from '@/components/aceternity/background-grid'
import { NumberTicker } from '@/components/magicui/number-ticker'

export default function EstadisticasPage() {
  return (
    <div className="space-y-8 relative">
      <BackgroundGrid />
      <GlowOrb className="-top-20 left-1/2 -translate-x-1/2 opacity-20" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Estadísticas avanzadas</h1>
        <p className="text-zinc-500">xG, PPDA, forma reciente — explicados para tomar mejores decisiones</p>
      </motion.div>

      {/* Glosario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            term: 'xG',
            full: 'Expected Goals',
            def: 'Mide la calidad de las ocasiones creadas. Si el xG es mayor que los goles reales, el equipo está bajo su potencial ofensivo — señal de posible mejora.',
            color: 'indigo',
            icon: TrendingUp,
          },
          {
            term: 'xGA',
            full: 'Expected Goals Against',
            def: 'Calidad de ocasiones cedidas. Un xGA bajo con muchos goles en contra indica mala suerte defensiva que puede revertirse pronto.',
            color: 'purple',
            icon: TrendingDown,
          },
          {
            term: 'PPDA',
            full: 'Passes Per Defensive Action',
            def: 'Mide la intensidad de la presión. Un valor bajo (5-7) = presión muy alta. Alto (12+) = bloque defensivo profundo. Clave para over/under.',
            color: 'yellow',
            icon: Info,
          },
        ].map(({ term, full, def, color, icon: Icon }, i) => (
          <motion.div
            key={term}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SpotlightCard
              spotlightColor={color === 'indigo' ? 'rgba(99,102,241,0.1)' : color === 'purple' ? 'rgba(168,85,247,0.1)' : 'rgba(234,179,8,0.1)'}
              className={cn(
                'h-full p-5 rounded-2xl border transition-all',
                color === 'indigo' ? 'bg-indigo-500/5 border-indigo-500/20' :
                color === 'purple' ? 'bg-purple-500/5 border-purple-500/20' :
                'bg-yellow-500/5 border-yellow-500/20'
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  color === 'indigo' ? 'bg-indigo-500/15' : color === 'purple' ? 'bg-purple-500/15' : 'bg-yellow-500/15'
                )}>
                  <Icon size={16} className={color === 'indigo' ? 'text-indigo-400' : color === 'purple' ? 'text-purple-400' : 'text-yellow-400'} />
                </div>
                <div>
                  <span className={cn('text-base font-bold', color === 'indigo' ? 'text-indigo-400' : color === 'purple' ? 'text-purple-400' : 'text-yellow-400')}>
                    {term}
                  </span>
                  <span className="text-xs text-zinc-600 ml-2">{full}</span>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">{def}</p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Tabla de equipos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-[#111118] border border-[#2a2a38] rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-[#2a2a38] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Equipos — temporada 2024/25</h2>
          <Badge variant="indigo">{ESTADISTICAS_MOCK.length} equipos</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-600 border-b border-[#1a1a24]">
                {['Equipo', 'PJ', 'V', 'E', 'D', 'GF/GC', 'xG', 'xGA', 'PPDA', 'Forma'].map((h, i) => (
                  <th key={h} className={cn('py-3 font-medium', i === 0 ? 'text-left px-5' : 'text-center px-3',
                    h === 'xG' || h === 'xGA' ? 'text-indigo-500' : h === 'PPDA' ? 'text-yellow-500' : ''
                  )}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0f0f16]">
              {ESTADISTICAS_MOCK.map((e, i) => (
                <motion.tr
                  key={e.equipoId}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-[#1a1a24] transition-colors group"
                >
                  <td className="px-5 py-3">
                    <div className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">{e.equipo}</div>
                    <div className="text-xs text-zinc-600">{e.liga}</div>
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-zinc-400">{e.partidos}</td>
                  <td className="px-3 py-3 text-center text-sm font-semibold text-green-400">{e.victorias}</td>
                  <td className="px-3 py-3 text-center text-sm text-yellow-400">{e.empates}</td>
                  <td className="px-3 py-3 text-center text-sm text-red-400">{e.derrotas}</td>
                  <td className="px-3 py-3 text-center text-sm text-zinc-400">{e.golesFavor}/{e.golesContra}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm font-bold text-indigo-400 tabular-nums">{e.xG?.toFixed(1) ?? '—'}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-sm text-indigo-300 tabular-nums">{e.xGA?.toFixed(1) ?? '—'}</span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={cn(
                      'text-sm font-semibold tabular-nums',
                      e.ppda && e.ppda < 8 ? 'text-green-400' : e.ppda && e.ppda < 11 ? 'text-yellow-400' : 'text-red-400'
                    )}>
                      {e.ppda?.toFixed(1) ?? '—'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      {e.formaReciente.map((f, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn('w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white', obtenerColorForma(f))}
                        >
                          {f}
                        </motion.span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Calculadora Kelly */}
      <KellyCalculadora />
    </div>
  )
}

function KellyCalculadora() {
  const [prob, setProb] = useState(55)
  const [cuota, setCuota] = useState(2.10)
  const [fraccion, setFraccion] = useState(0.25)
  const [bankroll, setBankroll] = useState(1000)

  const b = cuota - 1
  const q = 1 - prob / 100
  const p = prob / 100
  const kellyFull = ((b * p - q) / b) * 100
  const kelly = Math.max(0, kellyFull * fraccion)
  const stake = (bankroll * kelly) / 100
  const gananciaEsperada = stake * b
  const esPositivo = kelly > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-6 relative overflow-hidden"
    >
      <GlowOrb className="-bottom-10 -right-10 opacity-15" />
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
          <Calculator size={18} className="text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Calculadora Kelly Criterion</h2>
          <p className="text-xs text-zinc-500">Calcula el stake óptimo para maximizar tu bankroll</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <SliderCampo
            label="Tu estimación de probabilidad"
            value={prob}
            min={1} max={99} step={1}
            display={`${prob}%`}
            onChange={setProb}
            color="indigo"
          />
          <SliderCampo
            label="Cuota decimal"
            value={cuota}
            min={1.05} max={10} step={0.05}
            display={cuota.toFixed(2)}
            onChange={setCuota}
            color="purple"
          />
          <SliderCampo
            label="Fracción Kelly"
            value={fraccion}
            min={0.05} max={1} step={0.05}
            display={`${(fraccion * 100).toFixed(0)}%`}
            onChange={setFraccion}
            color="yellow"
          />
          <SliderCampo
            label="Bankroll"
            value={bankroll}
            min={100} max={10000} step={100}
            display={`$${bankroll.toLocaleString('es-MX')}`}
            onChange={setBankroll}
            color="green"
          />
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${kelly}-${esPositivo}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'rounded-2xl p-5 border flex-1',
                esPositivo
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              )}
            >
              <div className="text-xs text-zinc-500 mb-1">Stake recomendado</div>
              <div className={cn('text-4xl font-bold mb-1', esPositivo ? 'text-green-400' : 'text-red-400')}>
                <NumberTicker value={Math.round(kelly * 10) / 10} decimalPlaces={1} />
                <span className="text-2xl">%</span>
              </div>
              <div className="text-sm text-zinc-400">
                = <span className="font-semibold text-white">${stake.toFixed(2)}</span> de tu bankroll
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">Kelly completo</span>
                  <span className="text-zinc-400">{Math.max(0, kellyFull).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">Ganancia si ganas</span>
                  <span className="text-green-400">+${gananciaEsperada.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">Pérdida si pierdes</span>
                  <span className="text-red-400">-${stake.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <p className="text-xs text-yellow-400">
              <span className="font-semibold">Consejo:</span> Kelly completo es agresivo. Una fracción del 25% es más conservadora y recomendada para la mayoría de apostadores.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SliderCampo({ label, value, min, max, step, display, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number
  display: string; onChange: (v: number) => void; color: string
}) {
  const colors: Record<string, string> = {
    indigo: 'accent-indigo-500',
    purple: 'accent-purple-500',
    yellow: 'accent-yellow-500',
    green: 'accent-green-500',
  }
  const textColors: Record<string, string> = {
    indigo: 'text-indigo-400',
    purple: 'text-purple-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs text-zinc-500">{label}</label>
        <motion.span
          key={display}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn('text-sm font-bold tabular-nums', textColors[color])}
        >
          {display}
        </motion.span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={cn('w-full h-1.5 rounded-full bg-[#2a2a38] appearance-none cursor-pointer', colors[color])}
      />
    </div>
  )
}
