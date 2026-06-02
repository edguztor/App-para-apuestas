import Link from 'next/link'
import { TrendingUp, BarChart3, DollarSign, BookOpen, ArrowRight, Zap, Shield, Globe, ChevronRight } from 'lucide-react'
import { getPartidosHoy } from '@/lib/api/football-data'
import { adaptarPartidoFD } from '@/lib/api/adapters'
import { Partido } from '@/types'
import { BackgroundGrid, GlowOrb } from '@/components/aceternity/background-grid'
import HeroSection from '@/components/home/HeroSection'
import PartidosSection from '@/components/home/PartidosSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import StatsSection from '@/components/home/StatsSection'

async function obtenerPartidos(): Promise<Partido[]> {
  try {
    const raw = await getPartidosHoy()
    if (raw.length > 0) return raw.map(adaptarPartidoFD)
  } catch { /* sin datos */ }
  return []
}

export default async function Home() {
  const partidos = await obtenerPartidos()
  const enVivo = partidos.filter(p => p.estado === 'en_vivo')
  const proximos = partidos.filter(p => p.estado === 'programado').slice(0, 6)

  return (
    <div className="space-y-16 relative">
      {/* Background effects */}
      <BackgroundGrid />
      <GlowOrb className="-top-40 -left-40 opacity-60" />
      <GlowOrb className="top-[40%] -right-40 opacity-40" />

      <HeroSection />
      <FeaturesSection />
      <PartidosSection enVivo={enVivo} proximos={proximos} />
      <StatsSection />

      {/* CTA final */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 via-[#111118] to-purple-950/30 p-8 md:p-12">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <GlowOrb className="-bottom-20 left-1/2 -translate-x-1/2 opacity-30" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium mb-4">
            <Zap size={14} />
            Máximas cuotas garantizadas
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Compara cuotas de 8+ bookmakers
          </h2>
          <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
            Bet365, Betsson, Codere, William Hill, Betano, Bwin, Pinnacle, Unibet — todos en una sola tabla actualizada cada 2 minutos.
          </p>
          <Link
            href="/cuotas"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          >
            Ver comparador de cuotas
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
