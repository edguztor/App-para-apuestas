import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, TrendingUp } from 'lucide-react'
import { PARTIDOS_MOCK, CUOTAS_COMPARACION_MOCK, ESTADISTICAS_MOCK } from '@/lib/api/mock-data'
import { formatFecha, formatCuota, obtenerColorForma, cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

export default async function PartidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const partido = PARTIDOS_MOCK.find(p => p.id === Number(id))
  if (!partido) notFound()

  const cuotas = CUOTAS_COMPARACION_MOCK.filter(c => c.partidoId === partido.id)
  const statsLocal = ESTADISTICAS_MOCK.find(e => e.equipoId === partido.local.id)
  const statsVisitante = ESTADISTICAS_MOCK.find(e => e.equipoId === partido.visitante.id)

  const mejorLocal = cuotas.length ? Math.max(...cuotas.map(c => c.local)) : 0
  const mejorEmpate = cuotas.length && cuotas[0].empate ? Math.max(...cuotas.filter(c => c.empate).map(c => c.empate!)) : 0
  const mejorVisitante = cuotas.length ? Math.max(...cuotas.map(c => c.visitante)) : 0

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link href="/partidos" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors">
        <ArrowLeft size={16} />
        Volver a partidos
      </Link>

      {/* Header del partido */}
      <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-zinc-500">{partido.liga}</span>
          {partido.estado === 'en_vivo' ? (
            <Badge variant="red">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-pulse mr-1" />
              En vivo • {partido.marcador?.minuto}&apos;
            </Badge>
          ) : (
            <Badge variant="outline">
              <Clock size={11} className="mr-1" />
              {formatFecha(partido.fecha)}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-right">
            <div className="text-xl md:text-3xl font-bold text-white">{partido.local.nombre}</div>
            <div className="text-sm text-zinc-500 mt-1">Local</div>
          </div>

          {partido.estado === 'en_vivo' && partido.marcador ? (
            <div className="text-center px-6">
              <div className="text-4xl font-bold text-white tabular-nums">
                {partido.marcador.local} – {partido.marcador.visitante}
              </div>
              <div className="text-xs text-red-400 mt-1 font-medium">Min {partido.marcador.minuto}</div>
            </div>
          ) : (
            <div className="text-center px-6">
              <div className="text-2xl font-bold text-zinc-600">VS</div>
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <div className="text-xl md:text-3xl font-bold text-white">{partido.visitante.nombre}</div>
            <div className="text-sm text-zinc-500 mt-1">Visitante</div>
          </div>
        </div>
      </div>

      {/* Comparación de cuotas */}
      {cuotas.length > 0 && (
        <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Comparación de cuotas</h2>
            <Badge variant="indigo">{cuotas.length} bookmakers</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-zinc-500 border-b border-[#2a2a38]">
                  <th className="text-left pb-3 pr-4">Bookmaker</th>
                  <th className="text-center pb-3 px-3">1 ({partido.local.nombre})</th>
                  {cuotas[0].empate !== undefined && (
                    <th className="text-center pb-3 px-3">X (Empate)</th>
                  )}
                  <th className="text-center pb-3 px-3">2 ({partido.visitante.nombre})</th>
                  {cuotas[0].over25 !== undefined && (
                    <>
                      <th className="text-center pb-3 px-3">+2.5</th>
                      <th className="text-center pb-3 px-3">-2.5</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a24]">
                {cuotas.map((c) => (
                  <tr key={c.bookmaker} className="hover:bg-[#1a1a24] transition-colors">
                    <td className="py-3 pr-4 text-sm font-medium text-zinc-300">{c.bookmaker}</td>
                    <td className={cn(
                      'py-3 px-3 text-center text-sm font-bold tabular-nums',
                      c.local === mejorLocal ? 'text-green-400' : 'text-zinc-300'
                    )}>
                      {formatCuota(c.local)}
                      {c.local === mejorLocal && <span className="ml-1 text-xs">★</span>}
                    </td>
                    {c.empate !== undefined && (
                      <td className={cn(
                        'py-3 px-3 text-center text-sm font-bold tabular-nums',
                        c.empate === mejorEmpate ? 'text-green-400' : 'text-zinc-300'
                      )}>
                        {formatCuota(c.empate)}
                        {c.empate === mejorEmpate && <span className="ml-1 text-xs">★</span>}
                      </td>
                    )}
                    <td className={cn(
                      'py-3 px-3 text-center text-sm font-bold tabular-nums',
                      c.visitante === mejorVisitante ? 'text-green-400' : 'text-zinc-300'
                    )}>
                      {formatCuota(c.visitante)}
                      {c.visitante === mejorVisitante && <span className="ml-1 text-xs">★</span>}
                    </td>
                    {c.over25 !== undefined && (
                      <>
                        <td className="py-3 px-3 text-center text-sm text-zinc-400 tabular-nums">{formatCuota(c.over25)}</td>
                        <td className="py-3 px-3 text-center text-sm text-zinc-400 tabular-nums">{c.under25 ? formatCuota(c.under25) : '—'}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              {/* Mejores cuotas */}
              <tfoot>
                <tr className="border-t border-[#2a2a38]">
                  <td className="pt-3 text-xs text-zinc-600 font-medium">MEJOR</td>
                  <td className="pt-3 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(mejorLocal)}</td>
                  {cuotas[0].empate !== undefined && (
                    <td className="pt-3 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(mejorEmpate)}</td>
                  )}
                  <td className="pt-3 text-center text-sm font-bold text-green-400 tabular-nums">{formatCuota(mejorVisitante)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-zinc-600 mt-4">★ = Mejor cuota disponible. Cuotas actualizadas cada 2 minutos.</p>
        </div>
      )}

      {/* Estadísticas de equipos */}
      {(statsLocal || statsVisitante) && (
        <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Estadísticas de temporada</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { stats: statsLocal, equipo: partido.local.nombre },
              { stats: statsVisitante, equipo: partido.visitante.nombre },
            ].map(({ stats, equipo }) => stats && (
              <div key={equipo}>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">{equipo}</h3>
                <div className="space-y-2">
                  <StatRow label="Forma reciente" value={
                    <div className="flex gap-1">
                      {stats.formaReciente.map((f, i) => (
                        <span key={i} className={cn('w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white', obtenerColorForma(f))}>
                          {f}
                        </span>
                      ))}
                    </div>
                  } />
                  <StatRow label="Record" value={`${stats.victorias}V ${stats.empates}E ${stats.derrotas}D`} />
                  <StatRow label="Goles" value={`${stats.golesFavor} / ${stats.golesContra}`} />
                  {stats.xG && <StatRow label="xG / xGA" value={`${stats.xG} / ${stats.xGA}`} highlight />}
                  {stats.ppda && <StatRow label="PPDA" value={stats.ppda.toString()} />}
                </div>
              </div>
            ))}
          </div>

          {/* Explicación xG */}
          {(statsLocal?.xG || statsVisitante?.xG) && (
            <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
              <p className="text-xs text-indigo-300">
                <span className="font-semibold">¿Qué es xG?</span> El Expected Goals (xG) mide la calidad de las ocasiones de gol.
                Un xG mayor que goles reales indica que el equipo está por debajo de su potencial ofensivo —
                <span className="font-medium"> oportunidad de value bet si el equipo está &quot;infravalorado&quot;</span>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatRow({ label, value, highlight = false }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#1a1a24]">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={cn('text-sm font-medium', highlight ? 'text-indigo-400' : 'text-zinc-300')}>
        {value}
      </span>
    </div>
  )
}
