import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ApuestaAnalytics — Estadísticas y Cuotas para Apostadores',
  description: 'La plataforma todo-en-uno para apostadores hispanohablantes. Compara cuotas, analiza estadísticas avanzadas y gestiona tu bankroll.',
  keywords: 'apuestas deportivas, cuotas, estadísticas, xG, bankroll, tipsters, fútbol, México, España',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#e4e4f0]">
        <Navbar />
        <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
