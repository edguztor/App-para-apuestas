'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Apuesta, BancoStats } from '@/types'
import { APUESTAS_MOCK } from '@/lib/api/mock-data'
import { formatMoneda, formatCuota, obtenerColorResultado, cn } from '@/lib/utils'
import { Plus, TrendingUp, TrendingDown, Target, DollarSign, X, Check, Trash2 } from 'lucide-react'
import { SpotlightCard } from '@/components/aceternity/spotlight'
import { BackgroundDots, GlowOrb } from '@/components/aceternity/background-grid'
import { NumberTicker } from '@/components/magicui/number-ticker'
import Badge from '@/components/ui/Badge'

const BANKROLL_INICIAL = 1000

function calcularStats(apuestas: Apuesta[]): BancoStats {
  const finalizadas = apuestas.filter(a => a.resultado && a.resultado !== 'pendiente' && a.resultado !== 'void')
  const ganadas = finalizadas.filter(a => a.resultado === 'ganada')
  const perdidas = finalizadas.filter(a => a.resultado === 'perdida')
  const totalStake = finalizadas.reduce((s, a) => s + a.stake, 0)
  const profitTotal = ganadas.reduce((s, a) => s + (a.ganancia ?? 0) - a.stake, 0) - perdidas.reduce((s, a) => s + a.stake, 0)

  let racha = 0, mejorRacha = 0
  for (const a of [...finalizadas].reverse()) {
    if (a.resultado === 'ganada') { racha++; mejorRacha = Math.max(mejorRacha, racha) }
    else racha = 0
  }

  return {
    bankrollInicial: BANKROLL_INICIAL,
    bankrollActual: BANKROLL_INICIAL + profitTotal,
    totalApuestas: apuestas.length,
    ganadas: ganadas.length,
    perdidas: perdidas.length,
    pendientes: apuestas.filter(a => a.resultado === 'pendiente').length,
    roi: totalStake === 0 ? 0 : (profitTotal / totalStake) * 100,
    profitTotal,
    streakActual: racha,
    mejorRacha,
  }
}

export default function TrackerPage() {
  const [apuestas, setApuestas] = useState<Apuesta[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    const guardadas = localStorage.getItem('apuestas')
    setApuestas(guardadas ? JSON.parse(guardadas) : APUESTAS_MOCK)
  }, [])

  const guardar = (nuevas: Apuesta[]) => {
    setApuestas(nuevas)
    localStorage.setItem('apuestas', JSON.stringify(nuevas))
  }

  const stats = calcularStats(apuestas)
  const roiPositivo = stats.roi >= 0

  const filtradas = apuestas.filter(a => filtro === 'todos' || a.resultado === filtro)

  return (
    <div className="space-y-8 relative">
      <BackgroundDots />
      <GlowOrb className="-top-20 -right-20 opacity-25" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Mis Apuestas</h1>
          <p className="text-zinc-500 text-sm">Controla tu bankroll y analiza tu rendimiento</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMostrarForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        >
          <Plus size={16} />
          Nueva apuesta
        </motion.button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            titulo: 'Bankroll actual',
            valor: formatMoneda(stats.bankrollActual),
            sub: `Inicial: ${formatMoneda(stats.bankrollInicial)}`,
            color: stats.bankrollActual >= stats.bankrollInicial ? 'green' : 'red',
            icon: DollarSign,
            spotlight: stats.bankrollActual >= stats.bankrollInicial ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
          },
          {
            titulo: 'ROI',
            valor: `${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`,
            sub: `Profit: ${stats.profitTotal >= 0 ? '+' : ''}${formatMoneda(stats.profitTotal)}`,
            color: roiPositivo ? 'green' : 'red',
            icon: roiPositivo ? TrendingUp : TrendingDown,
            spotlight: roiPositivo ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
          },
          {
            titulo: 'Record',
            valor: `${stats.ganadas}W / ${stats.perdidas}L`,
            sub: `${stats.pendientes} pendientes`,
            color: 'default',
            icon: Target,
            spotlight: 'rgba(99,102,241,0.08)',
          },
          {
            titulo: 'Win rate',
            valor: `${stats.ganadas + stats.perdidas > 0 ? Math.round((stats.ganadas / (stats.ganadas + stats.perdidas)) * 100) : 0}%`,
            sub: `Mejor racha: ${stats.mejorRacha}W`,
            color: 'indigo',
            icon: TrendingUp,
            spotlight: 'rgba(99,102,241,0.08)',
          },
        ].map(({ titulo, valor, sub, color, icon: Icon, spotlight }, i) => (
          <motion.div
            key={titulo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <SpotlightCard spotlightColor={spotlight} className="bg-[#111118] border border-[#2a2a38] rounded-xl p-4 h-full">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-zinc-500">{titulo}</span>
                <Icon size={15} className={cn(
                  color === 'green' ? 'text-green-400' :
                  color === 'red' ? 'text-red-400' :
                  color === 'indigo' ? 'text-indigo-400' : 'text-zinc-600'
                )} />
              </div>
              <div className={cn(
                'text-xl font-bold tabular-nums',
                color === 'green' ? 'text-green-400' :
                color === 'red' ? 'text-red-400' :
                color === 'indigo' ? 'text-indigo-400' : 'text-white'
              )}>
                {valor}
              </div>
              <p className="text-xs text-zinc-600 mt-1">{sub}</p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>

      {/* Gráfico de bankroll */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <BankrollChart apuestas={apuestas} bankrollInicial={BANKROLL_INICIAL} />
      </motion.div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'todos', label: 'Todas', count: apuestas.length },
          { key: 'ganada', label: 'Ganadas', count: stats.ganadas },
          { key: 'perdida', label: 'Perdidas', count: stats.perdidas },
          { key: 'pendiente', label: 'Pendientes', count: stats.pendientes },
        ].map(({ key, label, count }) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFiltro(key)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
              filtro === key
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-[#111118] text-zinc-500 border border-[#2a2a38] hover:text-white'
            )}
          >
            {label}
            <span className={cn('px-1.5 py-0.5 rounded-full text-xs', filtro === key ? 'bg-indigo-500/20' : 'bg-zinc-800')}>
              {count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtradas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-zinc-600"
            >
              <Target size={32} className="mx-auto mb-3 opacity-30" />
              <p>No hay apuestas registradas</p>
            </motion.div>
          ) : (
            filtradas.map((apuesta, i) => (
              <motion.div
                key={apuesta.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.04 }}
              >
                <FilaApuesta
                  apuesta={apuesta}
                  onEliminar={() => guardar(apuestas.filter(a => a.id !== apuesta.id))}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {mostrarForm && (
          <FormNuevaApuesta
            onClose={() => setMostrarForm(false)}
            onGuardar={(a) => {
              guardar([a, ...apuestas])
              setMostrarForm(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function FilaApuesta({ apuesta, onEliminar }: { apuesta: Apuesta; onEliminar: () => void }) {
  const profit = apuesta.resultado === 'ganada' && apuesta.ganancia
    ? apuesta.ganancia - apuesta.stake
    : apuesta.resultado === 'perdida' ? -apuesta.stake : null

  return (
    <SpotlightCard
      spotlightColor={apuesta.resultado === 'ganada' ? 'rgba(34,197,94,0.06)' : apuesta.resultado === 'perdida' ? 'rgba(239,68,68,0.06)' : 'rgba(99,102,241,0.06)'}
      className="bg-[#111118] border border-[#2a2a38] rounded-xl p-4 group hover:border-[#3a3a50] transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-white truncate">{apuesta.partido}</span>
            <Badge variant="outline">{apuesta.deporte}</Badge>
            <span className="text-xs text-zinc-600">{apuesta.liga}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
            <span className="text-zinc-400">{apuesta.mercado}: <span className="font-medium text-zinc-300">{apuesta.seleccion}</span></span>
            <span className="text-zinc-700">•</span>
            <span>Cuota <span className="font-mono text-white">{formatCuota(apuesta.cuota)}</span></span>
            <span className="text-zinc-700">•</span>
            <span>{apuesta.bookmaker}</span>
            <span className="text-zinc-700">•</span>
            <span>{new Date(apuesta.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-zinc-600">Stake</div>
            <div className="text-sm font-bold text-zinc-300">{formatMoneda(apuesta.stake)}</div>
          </div>

          {profit !== null && (
            <motion.div
              key={profit}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-right"
            >
              <div className="text-xs text-zinc-600">P/L</div>
              <div className={cn('text-sm font-bold', profit >= 0 ? 'text-green-400' : 'text-red-400')}>
                {profit >= 0 ? '+' : ''}{formatMoneda(profit)}
              </div>
            </motion.div>
          )}

          <div className={cn('px-2.5 py-1 rounded-lg text-xs font-bold', {
            'bg-green-500/10 text-green-400 border border-green-500/20': apuesta.resultado === 'ganada',
            'bg-red-500/10 text-red-400 border border-red-500/20': apuesta.resultado === 'perdida',
            'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20': apuesta.resultado === 'pendiente',
            'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20': apuesta.resultado === 'void',
          })}>
            {apuesta.resultado === 'ganada' && <Check size={10} className="inline mr-1" />}
            {apuesta.resultado === 'pendiente' ? 'Pendiente' : apuesta.resultado}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onEliminar}
            className="opacity-0 group-hover:opacity-100 text-zinc-700 hover:text-red-400 transition-all"
          >
            <Trash2 size={15} />
          </motion.button>
        </div>
      </div>
    </SpotlightCard>
  )
}

function BankrollChart({ apuestas, bankrollInicial }: { apuestas: Apuesta[]; bankrollInicial: number }) {
  const finalizadas = apuestas
    .filter(a => a.resultado && a.resultado !== 'pendiente' && a.resultado !== 'void')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  let bankroll = bankrollInicial
  const puntos = [{ fecha: 'Inicio', valor: bankroll }]
  for (const a of finalizadas) {
    if (a.resultado === 'ganada' && a.ganancia) bankroll += a.ganancia - a.stake
    else if (a.resultado === 'perdida') bankroll -= a.stake
    puntos.push({ fecha: new Date(a.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }), valor: Math.round(bankroll * 100) / 100 })
  }

  const max = Math.max(...puntos.map(p => p.valor))
  const min = Math.min(...puntos.map(p => p.valor))
  const range = max - min || 1

  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-300">Evolución del bankroll</h3>
        <div className={cn('text-sm font-bold', puntos[puntos.length - 1].valor >= bankrollInicial ? 'text-green-400' : 'text-red-400')}>
          {formatMoneda(puntos[puntos.length - 1].valor)}
        </div>
      </div>
      <div className="flex items-end gap-1 h-28">
        {puntos.map((p, i) => {
          const altura = ((p.valor - min) / range * 100)
          const color = p.valor >= bankrollInicial ? 'bg-indigo-500' : 'bg-red-500'
          const isLast = i === puntos.length - 1
          return (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(altura, 4)}%` }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-end group relative h-full"
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#2a2a38] text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {formatMoneda(p.valor)}
              </div>
              <div className={cn('w-full rounded-sm', color, isLast ? 'opacity-100 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'opacity-50')} style={{ height: '100%' }} />
            </motion.div>
          )
        })}
      </div>
      <div className="flex justify-between text-xs text-zinc-700 mt-2">
        <span>Inicio</span>
        <span>Hoy</span>
      </div>
    </div>
  )
}

function FormNuevaApuesta({ onClose, onGuardar }: { onClose: () => void; onGuardar: (a: Apuesta) => void }) {
  const [form, setForm] = useState({ partido: '', liga: '', deporte: 'futbol', mercado: '1X2', seleccion: '', cuota: '', stake: '', bookmaker: 'Bet365', notas: '' })

  const handleGuardar = () => {
    if (!form.partido || !form.seleccion || !form.cuota || !form.stake) return
    const cuota = parseFloat(form.cuota)
    const stake = parseFloat(form.stake)
    onGuardar({
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      deporte: form.deporte as Apuesta['deporte'],
      liga: form.liga || 'Sin liga',
      partido: form.partido,
      mercado: form.mercado,
      seleccion: form.seleccion,
      cuota, stake,
      resultado: 'pendiente',
      ganancia: cuota * stake,
      bookmaker: form.bookmaker,
      notas: form.notas,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', bounce: 0.25 }}
        className="bg-[#111118] border border-[#2a2a38] rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Nueva apuesta</h2>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={20} />
          </motion.button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Deporte">
              <select value={form.deporte} onChange={e => setForm(f => ({ ...f, deporte: e.target.value }))} className="input-field">
                <option value="futbol">⚽ Fútbol</option>
                <option value="baloncesto">🏀 Básquet</option>
                <option value="tenis">🎾 Tenis</option>
                <option value="americano">🏈 Americano</option>
              </select>
            </Campo>
            <Campo label="Liga">
              <input placeholder="La Liga, NBA..." value={form.liga} onChange={e => setForm(f => ({ ...f, liga: e.target.value }))} className="input-field" />
            </Campo>
          </div>
          <Campo label="Partido">
            <input placeholder="Real Madrid vs Barcelona" value={form.partido} onChange={e => setForm(f => ({ ...f, partido: e.target.value }))} className="input-field" />
          </Campo>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Mercado">
              <select value={form.mercado} onChange={e => setForm(f => ({ ...f, mercado: e.target.value }))} className="input-field">
                {['1X2', 'Over/Under', 'Ambos marcan', 'Hándicap', 'Moneyline', 'Otro'].map(m => <option key={m}>{m}</option>)}
              </select>
            </Campo>
            <Campo label="Selección">
              <input placeholder="Real Madrid" value={form.seleccion} onChange={e => setForm(f => ({ ...f, seleccion: e.target.value }))} className="input-field" />
            </Campo>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Campo label="Cuota">
              <input type="number" placeholder="2.10" step="0.05" value={form.cuota} onChange={e => setForm(f => ({ ...f, cuota: e.target.value }))} className="input-field" />
            </Campo>
            <Campo label="Stake ($)">
              <input type="number" placeholder="50" value={form.stake} onChange={e => setForm(f => ({ ...f, stake: e.target.value }))} className="input-field" />
            </Campo>
            <Campo label="Bookmaker">
              <select value={form.bookmaker} onChange={e => setForm(f => ({ ...f, bookmaker: e.target.value }))} className="input-field">
                {['Bet365', 'Betsson', 'Codere', 'William Hill', 'Betano', 'Bwin', 'Pinnacle', 'Unibet'].map(b => <option key={b}>{b}</option>)}
              </select>
            </Campo>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[#2a2a38] text-zinc-400 hover:text-white text-sm transition-colors">Cancelar</button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGuardar}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            Guardar
          </motion.button>
        </div>

        <style jsx>{`
          .input-field { width: 100%; padding: 8px 12px; background: #1a1a24; border: 1px solid #2a2a38; border-radius: 10px; font-size: 14px; color: #e4e4f0; outline: none; transition: border-color 0.2s; }
          .input-field:focus { border-color: rgba(99,102,241,0.5); }
          .input-field option { background: #1a1a24; }
        `}</style>
      </motion.div>
    </motion.div>
  )
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
      {children}
    </div>
  )
}
