'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, TrendingUp, DollarSign, BookOpen, Home, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <nav className="sticky top-0 z-50 border-b border-[#2a2a38] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]"
            >
              <span className="text-white font-bold text-sm">A</span>
            </motion.div>
            <span className="font-bold text-lg text-white">
              Apuesta<span className="text-indigo-400">Analytics</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    active ? 'text-white' : 'text-zinc-400 hover:text-white'
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-indigo-500/20 border border-indigo-500/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon size={16} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </Link>
              )
            })}
          </div>

          {/* Live badge */}
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-400">En vivo</span>
          </motion.div>

          {/* Mobile button */}
          <button
            className="md:hidden text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[#2a2a38] bg-[#0d0d14]"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all',
                      pathname === href
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
