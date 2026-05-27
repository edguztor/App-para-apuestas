import Link from 'next/link'
import { TrendingUp, BarChart3, DollarSign, BookOpen, ArrowRight, Zap, Shield, Globe } from 'lucide-react'
import TarjetaPartido from '@/components/partidos/TarjetaPartido'
import { PARTIDOS_MOCK } from '@/lib/api/mock-data'

const enVivo = PARTIDOS_MOCK.filter(p => p.estado === 'en_vivo')
const proximos = PARTIDOS_MOCK.filter(p => p.estado === 'programado').slice(0, 4)

export default function Home() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            <Globe size={14} />
            Para apostadores hispanohablantes
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Toma decisiones con
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> datos reales</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            Compara cuotas de todos los bookmakers, analiza estadísticas avanzadas como xG y PPDA,
            y gestiona tu bankroll. Todo en un solo lugar, en español.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/partidos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
            >
              Ver partidos de hoy
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/cuotas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a1a24] hover:bg-[#222230] border border-[#2a2a38] text-zinc-300 font-semibold transition-colors"
            >
              Comparar cuotas
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, titulo: 'Comparación de cuotas', desc: 'Más de 8 bookmakers en tiempo real', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { icon: BarChart3, titulo: 'Stats avanzadas', desc: 'xG, PPDA, forma reciente y H2H', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { icon: DollarSign, titulo: 'Bet Tracker', desc: 'Controla tu bankroll y ROI', color: 'text-green-400', bg: 'bg-green-500/10' },
          { icon: Shield, titulo: 'Value Bets', desc: 'Encuentra apuestas con valor real', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map(({ icon: Icon, titulo, desc, color, bg }) => (
          <div key={titulo} className="bg-[#111118] border border-[#2a2a38] rounded-xl p-4 hover:border-[#3a3a50] transition-colors">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{titulo}</h3>
            <p className="text-xs text-zinc-500">{desc}</p>
          </div>
        ))}
      </section>

      {/* En vivo */}
      {enVivo.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
              <h2 className="text-lg font-bold text-white">En vivo ahora</h2>
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                {enVivo.length}
              </span>
            </div>
            <Link href="/partidos?filtro=vivo" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {enVivo.map(p => <TarjetaPartido key={p.id} partido={p} />)}
          </div>
        </section>
      )}

      {/* Próximos partidos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Próximos partidos</h2>
          <Link href="/partidos" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {proximos.map(p => <TarjetaPartido key={p.id} partido={p} />)}
        </div>
      </section>

      {/* CTA Cuotas */}
      <section className="bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Máximas cuotas garantizadas</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Compara cuotas de 8+ bookmakers</h3>
          <p className="text-zinc-400 text-sm">Bet365, Betsson, Codere, William Hill, Betano, Bwin, Pinnacle, Unibet</p>
        </div>
        <Link
          href="/cuotas"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
        >
          Comparar cuotas
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Stats rápidas */}
      <section className="grid grid-cols-3 gap-3 pb-6">
        {[
          { valor: '8+', label: 'Bookmakers', sub: 'comparados en tiempo real' },
          { valor: '20+', label: 'Ligas', sub: 'de todo el mundo' },
          { valor: '100%', label: 'Gratis', sub: 'sin registro obligatorio' },
        ].map(({ valor, label, sub }) => (
          <div key={label} className="text-center bg-[#111118] border border-[#2a2a38] rounded-xl p-4">
            <div className="text-2xl font-bold text-indigo-400">{valor}</div>
            <div className="text-sm font-semibold text-white mt-1">{label}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
