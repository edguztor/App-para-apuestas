import { cn } from '@/lib/utils'

interface Props {
  titulo: string
  valor: string | number
  subtitulo?: string
  tendencia?: 'up' | 'down' | 'neutral'
  color?: 'default' | 'green' | 'red' | 'yellow' | 'indigo'
  icon?: React.ReactNode
}

const COLOR_MAP = {
  default: 'text-white',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  indigo: 'text-indigo-400',
}

export default function StatCard({ titulo, valor, subtitulo, color = 'default', icon }: Props) {
  return (
    <div className="bg-[#111118] border border-[#2a2a38] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-zinc-500">{titulo}</span>
        {icon && <div className="text-zinc-600">{icon}</div>}
      </div>
      <div className={cn('text-2xl font-bold tabular-nums', COLOR_MAP[color])}>
        {valor}
      </div>
      {subtitulo && (
        <p className="text-xs text-zinc-600 mt-1">{subtitulo}</p>
      )}
    </div>
  )
}
