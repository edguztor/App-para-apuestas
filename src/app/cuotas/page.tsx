'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PARTIDOS_MOCK, CUOTAS_COMPARACION_MOCK } from '@/lib/api/mock-data'
import { formatCuota, calcularArbitraje, cn } from '@/lib/utils'
import { TrendingUp, AlertCircle, ExternalLink } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const MERCADOS = ['1X2', 'Over/Under', 'Arbitraje']

export default function CuotasPage() {
  const [mercado, setMercado] = useState('1X2')
  const [soloValor, setSoloValor] = useState(false)

  const partidosConCuotas = PARTIDOS_MOCK.filter(p => p.cuotas)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Comparador de cuotas</h1>
        <p className="text-zinc-500 text-sm">Las mejores cuotas de 8+ bookmakers para mercados en LATAM y España</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {MERCADOS.map(m => (
            <button
              key={m}
              onClick={() => setMercado(m)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                mercado === m
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-[#111118] text-zinc-400 border border-[#2a2a38] hover:text-white'
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 cursor-pointer ml-auto">
          <div
            onClick={() => setSoloValor(!soloValor)}
            className={cn(
              'w-9 h-5 rounded-full transition-colors relative',
              soloValor ? 'bg-indigo-600' : 'bg-zinc-700'
            )}
          >
            <span className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
              soloValor ? 'translate-x-4' : 'translate-x-0.5'
            )} />
          </div>
          <span className="text-sm text-zinc-400">Solo value bets</span>
        </label>
      </div>

      {/* Calculadora de arbitraje */}
      {mercado === 'Arbitraje' && (
        <div className="bg-[#111118] border border-indigo-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Detector de arbitraje (Surebets)</h2>
          <p className="text-sm text-zinc-500 mb-4">
            El arbitraje existe cuando la suma de probabilidades implícitas es menor a 1 (100%).
            Esto garantiza ganancia independientemente del resultado.
          </p>
          <ArbitrajeDetector />
        </div>
      )}

      {/* Tabla de cuotas por partido */}
      <div className="space-y-4">
        {partidosConCuotas.map(partido => {
          const cuotas = CUOTAS_COMPARACION_MOCK.filter(c => c.partidoId === partido.id)
          if (cuotas.length === 0 && partido.cuotas) {
            return <TarjetaCuotasSimple key={partido.id} partido={partido} />
          }
          if (cuotas.length > 0) {
            const arb = partido.cuotas?.empate
              ? calcularArbitraje([cuotas[0].local, cuotas[0].empate!, cuotas[0].visitante])
              : null
            return (
              <div key={partido.id} className="bg-[#111118] border border-[#2a2a38] rounded-2xl overflow-hidden hover:border-[#3a3a50] transition-colors">
                {/* Header partido */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a38]">
                  <Link href={`/partidos/${partido.id}`} className="flex items-center gap-3 hover:text-indigo-400 transition-colors">
                    <span className="text-sm font-semibold text-white">
                      {partido.local.nombre} <span className="text-zinc-600 mx-1">vs</span> {partido.visitante.nombre}
                    </span>
                    <ExternalLink size={12} className="text-zinc-600" />
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">{partido.liga}</span>
                    {arb && arb < 1 && (
                      <Badge variant="green">Arbitraje disponible</Badge>
                    )}
                    {partido.estado === 'en_vivo' && (
                      <Badge variant="red">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse mr-1" />
                        Vivo
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-zinc-600 border-b border-[#1a1a24]">
                        <th className="text-left px-5 py-2">Bookmaker</th>
                        <th className="text-center px-4 py-2">1</th>
                        {cuotas[0].empate !== undefined && <th className="text-center px-4 py-2">X</th>}
                        <th className="text-center px-4 py-2">2</th>
                        <th className="text-center px-4 py-2">+2.5</th>
                        <th className="text-center px-4 py-2">-2.5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a24]">
                      {cuotas.map((c) => {
                        const maxLocal = Math.max(...cuotas.map(x => x.local))
                        const maxEmpate = cuotas[0].empate ? Math.max(...cuotas.filter(x => x.empate).map(x => x.empate!)) : 0
                        const maxVisitante = Math.max(...cuotas.map(x => x.visitante))
                        return (
                          <tr key={c.bookmaker} className="hover:bg-[#1a1a24] transition-colors">
                            <td className="px-5 py-2.5 text-sm font-medium text-zinc-300">{c.bookmaker}</td>
                            <CuotaCell value={c.local} isBest={c.local === maxLocal} />
                            {c.empate !== undefined && <CuotaCell value={c.empate} isBest={c.empate === maxEmpate} />}
                            <CuotaCell value={c.visitante} isBest={c.visitante === maxVisitante} />
                            <td className="px-4 py-2.5 text-center text-sm text-zinc-500 tabular-nums">{c.over25 ? formatCuota(c.over25) : '—'}</td>
                            <td className="px-4 py-2.5 text-center text-sm text-zinc-500 tabular-nums">{c.under25 ? formatCuota(c.under25) : '—'}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
          return null
        })}
      </div>

      {/* Info disclaimer */}
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

function CuotaCell({ value, isBest }: { value: number; isBest: boolean }) {
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

function TarjetaCuotasSimple({ partido }: { partido: typeof PARTIDOS_MOCK[0] }) {
  if (!partido.cuotas) return null
  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-xl p-4 flex items-center justify-between">
      <Link href={`/partidos/${partido.id}`} className="text-sm font-medium text-zinc-300 hover:text-white">
        {partido.local.nombre} vs {partido.visitante.nombre}
        <span className="ml-2 text-xs text-zinc-600">{partido.liga}</span>
      </Link>
      <div className="flex gap-2">
        {[
          { label: '1', val: partido.cuotas.local },
          ...(partido.cuotas.empate ? [{ label: 'X', val: partido.cuotas.empate }] : []),
          { label: '2', val: partido.cuotas.visitante },
        ].map(({ label, val }) => (
          <div key={label} className="flex flex-col items-center px-2.5 py-1.5 bg-[#1a1a24] rounded-lg min-w-[44px]">
            <span className="text-xs text-zinc-600">{label}</span>
            <span className="text-sm font-bold text-white tabular-nums">{formatCuota(val)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArbitrajeDetector() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { equipo: 'Real Madrid vs Barcelona', cuotas: [2.25, 3.28, 3.08], bookmakers: ['Pinnacle', 'Betsson', 'Betano'] },
        { equipo: 'Man City vs Arsenal', cuotas: [1.85, 3.60, 4.20], bookmakers: ['Bet365', 'Unibet', 'Bwin'] },
      ].map(({ equipo, cuotas, bookmakers }) => {
        const suma = calcularArbitraje(cuotas)
        const esArb = suma < 1
        const profit = esArb ? ((1 / suma - 1) * 100).toFixed(2) : null
        return (
          <div key={equipo} className={cn(
            'p-4 rounded-xl border',
            esArb ? 'border-green-500/30 bg-green-500/5' : 'border-[#2a2a38] bg-[#1a1a24]'
          )}>
            <div className="text-sm font-medium text-zinc-300 mb-3">{equipo}</div>
            {cuotas.map((c, i) => (
              <div key={i} className="flex justify-between text-xs text-zinc-500 mb-1">
                <span>{bookmakers[i]}</span>
                <span className="font-mono">{formatCuota(c)}</span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-[#2a2a38] flex items-center justify-between">
              <span className="text-xs text-zinc-600">Suma implícita</span>
              <span className={cn('text-sm font-bold', esArb ? 'text-green-400' : 'text-zinc-400')}>
                {(suma * 100).toFixed(1)}%
              </span>
            </div>
            {profit && (
              <div className="mt-2 text-center text-xs font-semibold text-green-400 bg-green-500/10 rounded-lg py-1">
                Profit garantizado: +{profit}%
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
