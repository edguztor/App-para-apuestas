'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, TrendingUp, DollarSign, BookOpen, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/partidos', label: 'Partidos', icon: BarChart3 },
  { href: '/cuotas', label: 'Cuotas', icon: TrendingUp },
  { href: '/estadisticas', label: 'Estadísticas', icon: BookOpen },
  { href: '/tracker', label: 'Mis Apuestas', icon: DollarSign },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a38] bg-[#0a0a0f]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-lg text-white">
              Apuesta<span className="text-indigo-400">Analytics</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  pathname === href
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Live badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 live-pulse" />
            <span className="text-xs font-medium text-red-400">En vivo</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2a2a38] bg-[#111118] px-4 py-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all mb-1',
                pathname === href
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
