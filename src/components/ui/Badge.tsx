import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'red' | 'yellow' | 'indigo' | 'outline'
  size?: 'sm' | 'md'
}

const VARIANTS = {
  default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  outline: 'bg-transparent text-zinc-400 border-zinc-600',
}

export default function Badge({ children, variant = 'default', size = 'sm' }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      VARIANTS[variant]
    )}>
      {children}
    </span>
  )
}
