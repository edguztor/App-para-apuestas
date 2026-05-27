'use client'

import { useState, useEffect } from 'react'
import { Apuesta, BancoStats } from '@/types'
import { APUESTAS_MOCK } from '@/lib/api/mock-data'
import { formatMoneda, formatCuota, obtenerColorResultado, cn } from '@/lib/utils'
import { Plus, TrendingUp, TrendingDown, Target, DollarSign, X, Check } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'

const BANKROLL_INICIAL = 1000

function calcularStats(apuestas: Apuesta[]): BancoStats {
  const finalizadas = apuestas.filter(a => a.resultado && a.resultado !== 'pendiente')
  const ganadas = finalizadas.filter(a => a.resultado === 'ganada')
  const perdidas = finalizadas.filter(a => a.resultado === 'perdida')
  const totalStake = finalizadas.reduce((s, a) => s + a.stake, 0)
  const totalGanancia = finalizadas.reduce((s, a) => s + (a.ganancia ?? 0), 0)
  const profit = totalGanancia - totalStake + ganadas.reduce((s, a) => s + a.stake, 0)

  let streakActual = 0
  let mejorRacha = 0
  let racha = 0
  for (const a of [...finalizadas].reverse()) {
    if (a.resultado === 'ganada') {
      racha++
      mejorRacha = Math.max(mejorRacha, racha)
    } else {
      racha = 0
    }
  }
  streakActual = racha

  return {
    bankrollInicial: BANKROLL_INICIAL,
    bankrollActual: BANKROLL_INICIAL + (totalGanancia - totalStake + ganadas.reduce((s, a) => s + a.stake, 0)),
    totalApuestas: apuestas.length,
    ganadas: ganadas.length,
    perdidas: perdidas.length,
    pendientes: apuestas.filter(a => a.resultado === 'pendiente').length,
    roi: totalStake === 0 ? 0 : ((totalGanancia - totalStake + ganadas.reduce((s, a) => s + a.stake, 0)) / totalStake * 100),
    profitTotal: totalGanancia - totalStake + ganadas.reduce((s, a) => s + a.stake, 0),
    streakActual,
    mejorRacha,
  }
}

export default function TrackerPage() {
  const [apuestas, setApuestas] = useState<Apuesta[]>(APUESTAS_MOCK)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [filtro, setFiltro] = useState<string>('todos')

  const stats = calcularStats(apuestas)

  const filtradas = apuestas.filter(a => {
    if (filtro === 'todos') return true
    return a.resultado === filtro || (filtro === 'pendiente' && a.resultado === 'pendiente')
  })

  const roiPositivo = stats.roi >= 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Mis Apuestas</h1>
          <p className="text-zinc-500 text-sm">Controla tu bankroll y analiza tu rendimiento</p>
        </div>
        <button
          onClick={() => setMostrarForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-colors"
        >
          <Plus size={16} />
          Nueva apuesta
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          titulo="Bankroll actual"
          valor={formatMoneda(stats.bankrollActual)}
          subtitulo={`Inicial: ${formatMoneda(stats.bankrollInicial)}`}
          color={stats.bankrollActual >= stats.bankrollInicial ? 'green' : 'red'}
          icon={<DollarSign size={16} />}
        />
        <StatCard
          titulo="ROI"
          valor={`${stats.roi >= 0 ? '+' : ''}${stats.roi.toFixed(1)}%`}
          subtitulo={`Profit: ${formatMoneda(stats.profitTotal)}`}
          color={roiPositivo ? 'green' : 'red'}
          icon={roiPositivo ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        />
        <StatCard
          titulo="Record"
          valor={`${stats.ganadas}W / ${stats.perdidas}L`}
          subtitulo={`${stats.pendientes} pendientes`}
          color="default"
          icon={<Target size={16} />}
        />
        <StatCard
          titulo="Win rate"
          valor={`${stats.ganadas + stats.perdidas > 0 ? ((stats.ganadas / (stats.ganadas + stats.perdidas)) * 100).toFixed(0) : 0}%`}
          subtitulo={`Racha actual: ${stats.streakActual}W`}
          color="indigo"
        />
      </div>

      {/* Gráfico de bankroll simple */}
      <BankrollChart apuestas={apuestas} bankrollInicial={BANKROLL_INICIAL} />

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'todos', label: 'Todas' },
          { key: 'ganada', label: 'Ganadas' },
          { key: 'perdida', label: 'Perdidas' },
          { key: 'pendiente', label: 'Pendientes' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filtro === key
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-[#111118] text-zinc-500 border border-[#2a2a38] hover:text-white'
            )}
          >
            {label}
            {key !== 'todos' && (
              <span className="ml-1.5 text-zinc-600">
                {key === 'ganada' ? stats.ganadas : key === 'perdida' ? stats.perdidas : stats.pendientes}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de apuestas */}
      <div className="space-y-2">
        {filtradas.length === 0 ? (
          <div className="text-center py-12 text-zinc-600">
            <Target size={32} className="mx-auto mb-3 opacity-40" />
            <p>No hay apuestas registradas</p>
          </div>
        ) : (
          filtradas.map(apuesta => (
            <FilaApuesta key={apuesta.id} apuesta={apuesta} />
          ))
        )}
      </div>

      {/* Modal nueva apuesta */}
      {mostrarForm && (
        <FormNuevaApuesta
          onClose={() => setMostrarForm(false)}
          onGuardar={(a) => {
            setApuestas(prev => [a, ...prev])
            setMostrarForm(false)
          }}
        />
      )}
    </div>
  )
}

function FilaApuesta({ apuesta }: { apuesta: Apuesta }) {
  const colorResultado = obtenerColorResultado(apuesta.resultado)
  const gananciaColor = (apuesta.ganancia ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-semibold text-white truncate">{apuesta.partido}</span>
          <Badge variant="outline">{apuesta.deporte}</Badge>
          <span className="text-xs text-zinc-600">{apuesta.liga}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
          <span className="text-zinc-400">{apuesta.mercado}: <span className="font-medium text-zinc-300">{apuesta.seleccion}</span></span>
          <span>•</span>
          <span>Cuota: <span className="font-mono text-white">{formatCuota(apuesta.cuota)}</span></span>
          <span>•</span>
          <span>{apuesta.bookmaker}</span>
          <span>•</span>
          <span>{new Date(apuesta.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <div className="text-xs text-zinc-600">Stake</div>
          <div className="text-sm font-bold text-zinc-300">{formatMoneda(apuesta.stake)}</div>
        </div>
        {apuesta.ganancia !== undefined && (
          <div className="text-right">
            <div className="text-xs text-zinc-600">Ganancia</div>
            <div className={cn('text-sm font-bold', gananciaColor)}>
              {apuesta.ganancia >= 0 ? '+' : ''}{formatMoneda(apuesta.ganancia - apuesta.stake)}
            </div>
          </div>
        )}
        <div className={cn('px-2.5 py-1 rounded-lg text-xs font-bold capitalize', {
          'bg-green-500/10 text-green-400': apuesta.resultado === 'ganada',
          'bg-red-500/10 text-red-400': apuesta.resultado === 'perdida',
          'bg-yellow-500/10 text-yellow-400': apuesta.resultado === 'pendiente',
          'bg-zinc-500/10 text-zinc-400': apuesta.resultado === 'void',
        })}>
          {apuesta.resultado === 'ganada' && <Check size={10} className="inline mr-1" />}
          {apuesta.resultado === 'pendiente' ? 'Pendiente' : apuesta.resultado}
        </div>
      </div>
    </div>
  )
}

function BankrollChart({ apuestas, bankrollInicial }: { apuestas: Apuesta[]; bankrollInicial: number }) {
  const finalizadas = apuestas
    .filter(a => a.resultado && a.resultado !== 'pendiente')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  let bankroll = bankrollInicial
  const puntos = [{ fecha: 'Inicio', valor: bankroll }]

  for (const a of finalizadas) {
    if (a.resultado === 'ganada' && a.ganancia) {
      bankroll += a.ganancia - a.stake
    } else if (a.resultado === 'perdida') {
      bankroll -= a.stake
    }
    puntos.push({
      fecha: new Date(a.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      valor: Math.round(bankroll * 100) / 100,
    })
  }

  const max = Math.max(...puntos.map(p => p.valor))
  const min = Math.min(...puntos.map(p => p.valor))
  const range = max - min || 1

  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-zinc-400 mb-4">Evolución del bankroll</h3>
      <div className="flex items-end gap-1 h-24">
        {puntos.map((p, i) => {
          const altura = ((p.valor - min) / range * 100)
          const esUltimo = i === puntos.length - 1
          const color = p.valor >= bankrollInicial ? 'bg-green-500' : 'bg-red-500'
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group relative h-full">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#2a2a38] text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {formatMoneda(p.valor)}
              </div>
              <div
                className={cn('w-full rounded-sm transition-all', color, esUltimo ? 'opacity-100' : 'opacity-60')}
                style={{ height: `${Math.max(altura, 4)}%` }}
              />
            </div>
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

function FormNuevaApuesta({ onClose, onGuardar }: {
  onClose: () => void
  onGuardar: (a: Apuesta) => void
}) {
  const [form, setForm] = useState({
    partido: '',
    liga: '',
    deporte: 'futbol',
    mercado: '1X2',
    seleccion: '',
    cuota: '',
    stake: '',
    bookmaker: 'Bet365',
    notas: '',
  })

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
      cuota,
      stake,
      resultado: 'pendiente',
      bookmaker: form.bookmaker,
      notas: form.notas,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111118] border border-[#2a2a38] rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Nueva apuesta</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Deporte">
              <select
                value={form.deporte}
                onChange={e => setForm(f => ({ ...f, deporte: e.target.value }))}
                className="input-base"
              >
                <option value="futbol">Fútbol</option>
                <option value="baloncesto">Básquet</option>
                <option value="tenis">Tenis</option>
                <option value="americano">Americano</option>
              </select>
            </Campo>
            <Campo label="Liga">
              <input
                placeholder="La Liga, NBA..."
                value={form.liga}
                onChange={e => setForm(f => ({ ...f, liga: e.target.value }))}
                className="input-base"
              />
            </Campo>
          </div>

          <Campo label="Partido">
            <input
              placeholder="Ej: Real Madrid vs Barcelona"
              value={form.partido}
              onChange={e => setForm(f => ({ ...f, partido: e.target.value }))}
              className="input-base"
            />
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Mercado">
              <select
                value={form.mercado}
                onChange={e => setForm(f => ({ ...f, mercado: e.target.value }))}
                className="input-base"
              >
                <option>1X2</option>
                <option>Over/Under</option>
                <option>Ambos marcan</option>
                <option>Hándicap</option>
                <option>Moneyline</option>
                <option>Otro</option>
              </select>
            </Campo>
            <Campo label="Selección">
              <input
                placeholder="Ej: Real Madrid"
                value={form.seleccion}
                onChange={e => setForm(f => ({ ...f, seleccion: e.target.value }))}
                className="input-base"
              />
            </Campo>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Campo label="Cuota">
              <input
                type="number"
                placeholder="2.10"
                step="0.05"
                value={form.cuota}
                onChange={e => setForm(f => ({ ...f, cuota: e.target.value }))}
                className="input-base"
              />
            </Campo>
            <Campo label="Stake ($)">
              <input
                type="number"
                placeholder="50"
                value={form.stake}
                onChange={e => setForm(f => ({ ...f, stake: e.target.value }))}
                className="input-base"
              />
            </Campo>
            <Campo label="Bookmaker">
              <select
                value={form.bookmaker}
                onChange={e => setForm(f => ({ ...f, bookmaker: e.target.value }))}
                className="input-base"
              >
                {['Bet365','Betsson','Codere','William Hill','Betano','Bwin','Pinnacle','Unibet'].map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Campo>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#2a2a38] text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
          >
            Guardar apuesta
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-base {
          width: 100%;
          padding: 8px 12px;
          background: #1a1a24;
          border: 1px solid #2a2a38;
          border-radius: 8px;
          font-size: 14px;
          color: #e4e4f0;
          outline: none;
        }
        .input-base:focus {
          border-color: rgba(99, 102, 241, 0.5);
        }
        .input-base option {
          background: #1a1a24;
        }
      `}</style>
    </div>
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
