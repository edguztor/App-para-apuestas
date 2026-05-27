export type Deporte = 'futbol' | 'baloncesto' | 'tenis' | 'americano'

export interface Equipo {
  id: number
  nombre: string
  escudo?: string
  pais?: string
}

export interface Partido {
  id: number
  deporte: Deporte
  liga: string
  ligaLogo?: string
  local: Equipo
  visitante: Equipo
  fecha: string
  estado: 'programado' | 'en_vivo' | 'finalizado' | 'aplazado'
  marcador?: {
    local: number
    visitante: number
    minuto?: number
  }
  cuotas?: Cuotas
}

export interface Cuotas {
  casa: string
  local: number
  empate?: number
  visitante: number
  actualizadoEn: string
}

export interface ComparacionCuotas {
  partidoId: number
  bookmaker: string
  bookmakerLogo?: string
  local: number
  empate?: number
  visitante: number
  over25?: number
  under25?: number
}

export interface Apuesta {
  id: string
  fecha: string
  deporte: Deporte
  liga: string
  partido: string
  mercado: string
  seleccion: string
  cuota: number
  stake: number
  resultado?: 'ganada' | 'perdida' | 'void' | 'pendiente'
  ganancia?: number
  bookmaker: string
  notas?: string
}

export interface EstadisticaEquipo {
  equipoId: number
  equipo: string
  liga: string
  temporada: string
  partidos: number
  victorias: number
  empates: number
  derrotas: number
  golesFavor: number
  golesContra: number
  xG?: number
  xGA?: number
  ppda?: number
  formaReciente: ('W' | 'D' | 'L')[]
}

export interface H2H {
  local: Equipo
  visitante: Equipo
  partidos: {
    fecha: string
    local: string
    visitante: string
    resultado: string
    golesLocal: number
    golesVisitante: number
  }[]
}

export interface BancoStats {
  bankrollInicial: number
  bankrollActual: number
  totalApuestas: number
  ganadas: number
  perdidas: number
  pendientes: number
  roi: number
  profitTotal: number
  streakActual: number
  mejorRacha: number
}
