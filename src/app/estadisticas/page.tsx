import { ESTADISTICAS_MOCK } from '@/lib/api/mock-data'
import { obtenerColorForma, cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { Info } from 'lucide-react'

export default function EstadisticasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Estadísticas avanzadas</h1>
        <p className="text-zinc-500 text-sm">xG, PPDA, forma reciente y más — explicados en español</p>
      </div>

      {/* Glosario */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            term: 'xG (Expected Goals)',
            def: 'Mide la calidad de las ocasiones. Si un equipo tiene xG > goles reales, está creando más de lo que convierte — potencial de mejora.',
            color: 'indigo',
          },
          {
            term: 'xGA (Expected Goals Against)',
            def: 'Calidad de ocasiones cedidas. Un xGA bajo con muchos goles concedidos indica mala suerte que puede revertirse.',
            color: 'purple',
          },
          {
            term: 'PPDA',
            def: 'Passes Per Defensive Action. Mide la presión. Un valor bajo (5-7) = presión muy alta. Alto (12+) = bloque bajo. Clave para apostar en partidos con alta o baja intensidad.',
            color: 'yellow',
          },
        ].map(({ term, def, color }) => (
          <div key={term} className={cn(
            'p-4 rounded-xl border',
            color === 'indigo' ? 'bg-indigo-500/5 border-indigo-500/20' :
            color === 'purple' ? 'bg-purple-500/5 border-purple-500/20' :
            'bg-yellow-500/5 border-yellow-500/20'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className={cn(
                color === 'indigo' ? 'text-indigo-400' :
                color === 'purple' ? 'text-purple-400' : 'text-yellow-400'
              )} />
              <span className={cn(
                'text-sm font-bold',
                color === 'indigo' ? 'text-indigo-400' :
                color === 'purple' ? 'text-purple-400' : 'text-yellow-400'
              )}>{term}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">{def}</p>
          </div>
        ))}
      </div>

      {/* Tabla de equipos */}
      <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2a2a38]">
          <h2 className="text-lg font-bold text-white">Equipos — temporada 2024/25</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-zinc-500 border-b border-[#2a2a38]">
                <th className="text-left px-5 py-3">Equipo</th>
                <th className="text-center px-3 py-3">PJ</th>
                <th className="text-center px-3 py-3">V</th>
                <th className="text-center px-3 py-3">E</th>
                <th className="text-center px-3 py-3">D</th>
                <th className="text-center px-3 py-3">GF/GC</th>
                <th className="text-center px-3 py-3 text-indigo-400">xG</th>
                <th className="text-center px-3 py-3 text-indigo-400">xGA</th>
                <th className="text-center px-3 py-3 text-yellow-400">PPDA</th>
                <th className="text-center px-3 py-3">Forma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a24]">
              {ESTADISTICAS_MOCK.map(e => (
                <tr key={e.equipoId} className="hover:bg-[#1a1a24] transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{e.equipo}</div>
                      <div className="text-xs text-zinc-600">{e.liga}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-zinc-400">{e.partidos}</td>
                  <td className="px-3 py-3 text-center text-sm text-green-400 font-medium">{e.victorias}</td>
                  <td className="px-3 py-3 text-center text-sm text-yellow-400">{e.empates}</td>
                  <td className="px-3 py-3 text-center text-sm text-red-400">{e.derrotas}</td>
                  <td className="px-3 py-3 text-center text-sm text-zinc-400">{e.golesFavor}/{e.golesContra}</td>
                  <td className="px-3 py-3 text-center text-sm font-bold text-indigo-400 tabular-nums">
                    {e.xG?.toFixed(1) ?? '—'}
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-indigo-300 tabular-nums">
                    {e.xGA?.toFixed(1) ?? '—'}
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-yellow-400 tabular-nums">
                    {e.ppda?.toFixed(1) ?? '—'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex gap-1 justify-center">
                      {e.formaReciente.map((f, i) => (
                        <span
                          key={i}
                          className={cn('w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white', obtenerColorForma(f))}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculadora Kelly */}
      <KellyCalculadora />
    </div>
  )
}

function KellyCalculadora() {
  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold text-white">Calculadora Kelly Criterion</h2>
        <Badge variant="indigo">Herramienta</Badge>
      </div>
      <p className="text-sm text-zinc-500 mb-4">
        El Criterio de Kelly calcula el % óptimo de tu bankroll a apostar según la cuota y tu estimación de probabilidad.
      </p>
      <KellyForm />
    </div>
  )
}

function KellyForm() {
  'use client'
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Tu estimación de probabilidad (%)</label>
          <input
            type="number"
            defaultValue={55}
            min={1}
            max={99}
            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Cuota decimal</label>
          <input
            type="number"
            defaultValue={2.10}
            step={0.05}
            min={1.01}
            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500 mb-1 block">Fracción Kelly (recomendado: 0.25)</label>
          <input
            type="number"
            defaultValue={0.25}
            step={0.05}
            min={0.05}
            max={1}
            className="w-full px-3 py-2 bg-[#1a1a24] border border-[#2a2a38] rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>
      <div className="bg-[#1a1a24] rounded-xl p-4 flex flex-col justify-center">
        <div className="text-xs text-zinc-500 mb-1">Stake recomendado de tu bankroll</div>
        <div className="text-4xl font-bold text-green-400">3.75%</div>
        <div className="text-xs text-zinc-600 mt-2">Con bankroll de $1,000 → apostar $37.50</div>
        <div className="mt-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400">
            Kelly completo puede ser agresivo. Usar fracción 0.25-0.5 es más conservador y recomendado para la mayoría.
          </p>
        </div>
      </div>
    </div>
  )
}
