'use client'

import { useState, useEffect } from 'react'
import TarjetaPartido from '@/components/partidos/TarjetaPartido'
import { PARTIDOS_MOCK } from '@/lib/api/mock-data'
import { cn } from '@/lib/utils'
import { Partido } from '@/types'
import { Loader2 } from 'lucide-react'

const DEPORTES = [
  { key: 'todos', label: 'Todos', emoji: '🌐' },
  { key: 'futbol', label: 'Fútbol', emoji: '⚽' },
  { key: 'baloncesto', label: 'Básquet', emoji: '🏀' },
  { key: 'tenis', label: 'Tenis', emoji: '🎾' },
]

const ESTADOS = [
  { key: 'todos', label: 'Todos' },
  { key: 'en_vivo', label: '🔴 En vivo' },
  { key: 'programado', label: 'Próximos' },
  { key: 'finalizado', label: 'Finalizados' },
]

export default function PartidosPage() {
  const [deporte, setDeporte] = useState('todos')
  const [estado, setEstado] = useState('todos')
  const [busqueda, setBusqueda] = useState('')
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      try {
        const res = await fetch('/api/partidos')
        const data = await res.json()
        setPartidos(data.length > 0 ? data : PARTIDOS_MOCK)
      } catch {
        setPartidos(PARTIDOS_MOCK)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const filtrados = partidos.filter(p => {
    const matchDeporte = deporte === 'todos' || p.deporte === deporte
    const matchEstado = estado === 'todos' || p.estado === estado
    const matchBusqueda = !busqueda ||
      p.local.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.visitante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.liga.toLowerCase().includes(busqueda.toLowerCase())
    return matchDeporte && matchEstado && matchBusqueda
  })

  const enVivoCount = partidos.filter(p => p.estado === 'en_vivo').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Partidos</h1>
        <p className="text-zinc-500 text-sm">Partidos de hoy con cuotas y estadísticas</p>
      </div>

      {/* Filtros deporte */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DEPORTES.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setDeporte(key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              deporte === key
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-[#111118] text-zinc-400 border border-[#2a2a38] hover:text-white hover:border-[#3a3a50]'
            )}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Filtros estado + búsqueda */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setEstado(key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                estado === key
                  ? 'bg-zinc-700 text-white'
                  : 'bg-[#111118] text-zinc-500 border border-[#2a2a38] hover:text-white'
              )}
            >
              {label}
              {key === 'en_vivo' && enVivoCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                  {enVivoCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Buscar equipo o liga..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-[#111118] border border-[#2a2a38] rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Resultados */}
      {cargando ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 size={24} className="animate-spin mr-3" />
          <span>Cargando partidos...</span>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-2">No hay partidos</p>
          <p className="text-sm">Prueba con otros filtros</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-600">{filtrados.length} partido{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtrados.map(p => <TarjetaPartido key={p.id} partido={p} />)}
          </div>
        </>
      )}
    </div>
  )
}
