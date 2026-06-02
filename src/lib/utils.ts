import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCuota(cuota: number): string {
  return cuota.toFixed(2)
}

export function calcularROI(apuestas: { stake: number; ganancia?: number; resultado?: string }[]): number {
  const finalizadas = apuestas.filter(a => a.resultado && a.resultado !== 'pendiente')
  if (finalizadas.length === 0) return 0
  const totalStake = finalizadas.reduce((sum, a) => sum + a.stake, 0)
  const totalGanancia = finalizadas.reduce((sum, a) => sum + (a.ganancia ?? 0), 0)
  return totalStake === 0 ? 0 : ((totalGanancia / totalStake) * 100)
}

export function calcularKelly(prob: number, cuota: number, fraccion: number = 1): number {
  const b = cuota - 1
  const q = 1 - prob
  const kelly = (b * prob - q) / b
  return Math.max(0, kelly * fraccion * 100)
}

export function calcularArbitraje(cuotas: number[]): number {
  const suma = cuotas.reduce((sum, c) => sum + 1 / c, 0)
  return suma
}

export function esArbitraje(cuotas: number[]): boolean {
  return calcularArbitraje(cuotas) < 1
}

export function calcularStakesArbitraje(cuotas: number[], bankroll: number): number[] {
  const total = calcularArbitraje(cuotas)
  return cuotas.map(c => (bankroll / (c * total)))
}

export function formatFecha(fecha: string): string {
  const d = new Date(fecha)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function formatMoneda(valor: number, moneda: string = 'USD'): string {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: moneda, minimumFractionDigits: 2 }).format(valor)
}

export function obtenerColorResultado(resultado?: string): string {
  switch (resultado) {
    case 'ganada': return 'text-green-400'
    case 'perdida': return 'text-red-400'
    case 'void': return 'text-yellow-400'
    default: return 'text-zinc-400'
  }
}

export function obtenerColorForma(forma: string): string {
  switch (forma) {
    case 'W': return 'bg-green-500'
    case 'D': return 'bg-yellow-500'
    case 'L': return 'bg-red-500'
    default: return 'bg-zinc-600'
  }
}
