import { Partido, ComparacionCuotas, EstadisticaEquipo, Apuesta } from '@/types'

export const PARTIDOS_MOCK: Partido[] = [
  {
    id: 1,
    deporte: 'futbol',
    liga: 'La Liga',
    local: { id: 1, nombre: 'Real Madrid', escudo: 'https://crests.football-data.org/86.png' },
    visitante: { id: 2, nombre: 'FC Barcelona', escudo: 'https://crests.football-data.org/81.png' },
    fecha: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    estado: 'programado',
    cuotas: { casa: 'Bet365', local: 2.10, empate: 3.40, visitante: 3.20, actualizadoEn: new Date().toISOString() },
  },
  {
    id: 2,
    deporte: 'futbol',
    liga: 'Premier League',
    local: { id: 3, nombre: 'Manchester City', escudo: 'https://crests.football-data.org/65.png' },
    visitante: { id: 4, nombre: 'Arsenal', escudo: 'https://crests.football-data.org/57.png' },
    fecha: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    estado: 'en_vivo',
    marcador: { local: 1, visitante: 1, minuto: 67 },
    cuotas: { casa: 'Bet365', local: 1.85, empate: 3.60, visitante: 4.20, actualizadoEn: new Date().toISOString() },
  },
  {
    id: 3,
    deporte: 'futbol',
    liga: 'Liga MX',
    local: { id: 5, nombre: 'Club América' },
    visitante: { id: 6, nombre: 'Chivas Guadalajara' },
    fecha: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    estado: 'programado',
    cuotas: { casa: 'Codere', local: 2.30, empate: 3.10, visitante: 2.90, actualizadoEn: new Date().toISOString() },
  },
  {
    id: 4,
    deporte: 'futbol',
    liga: 'Champions League',
    local: { id: 7, nombre: 'Bayern Múnich', escudo: 'https://crests.football-data.org/5.png' },
    visitante: { id: 8, nombre: 'PSG' },
    fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    estado: 'programado',
    cuotas: { casa: 'Bet365', local: 1.75, empate: 3.80, visitante: 4.50, actualizadoEn: new Date().toISOString() },
  },
  {
    id: 5,
    deporte: 'baloncesto',
    liga: 'NBA',
    local: { id: 9, nombre: 'LA Lakers' },
    visitante: { id: 10, nombre: 'Golden State Warriors' },
    fecha: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    estado: 'programado',
    cuotas: { casa: 'Bet365', local: 1.90, visitante: 1.90, actualizadoEn: new Date().toISOString() },
  },
  {
    id: 6,
    deporte: 'tenis',
    liga: 'Roland Garros',
    local: { id: 11, nombre: 'C. Alcaraz' },
    visitante: { id: 12, nombre: 'R. Nadal' },
    fecha: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    estado: 'programado',
    cuotas: { casa: 'Bet365', local: 1.60, visitante: 2.30, actualizadoEn: new Date().toISOString() },
  },
]

export const CUOTAS_COMPARACION_MOCK: ComparacionCuotas[] = [
  { partidoId: 1, bookmaker: 'Bet365', local: 2.10, empate: 3.40, visitante: 3.20, over25: 1.85, under25: 1.95 },
  { partidoId: 1, bookmaker: 'Betsson', local: 2.15, empate: 3.35, visitante: 3.15, over25: 1.87, under25: 1.93 },
  { partidoId: 1, bookmaker: 'Codere', local: 2.05, empate: 3.45, visitante: 3.25, over25: 1.82, under25: 1.98 },
  { partidoId: 1, bookmaker: 'William Hill', local: 2.12, empate: 3.38, visitante: 3.18, over25: 1.86, under25: 1.94 },
  { partidoId: 1, bookmaker: 'Betano', local: 2.20, empate: 3.30, visitante: 3.10, over25: 1.90, under25: 1.90 },
  { partidoId: 1, bookmaker: 'Bwin', local: 2.08, empate: 3.42, visitante: 3.22, over25: 1.84, under25: 1.96 },
  { partidoId: 1, bookmaker: 'Pinnacle', local: 2.25, empate: 3.28, visitante: 3.08, over25: 1.92, under25: 1.88 },
  { partidoId: 1, bookmaker: 'Unibet', local: 2.11, empate: 3.39, visitante: 3.19, over25: 1.85, under25: 1.95 },
]

export const ESTADISTICAS_MOCK: EstadisticaEquipo[] = [
  {
    equipoId: 1, equipo: 'Real Madrid', liga: 'La Liga', temporada: '2024/25',
    partidos: 30, victorias: 22, empates: 5, derrotas: 3,
    golesFavor: 68, golesContra: 28,
    xG: 71.2, xGA: 24.8, ppda: 8.4,
    formaReciente: ['W', 'W', 'D', 'W', 'W'],
  },
  {
    equipoId: 2, equipo: 'FC Barcelona', liga: 'La Liga', temporada: '2024/25',
    partidos: 30, victorias: 19, empates: 7, derrotas: 4,
    golesFavor: 62, golesContra: 32,
    xG: 65.5, xGA: 29.1, ppda: 7.9,
    formaReciente: ['W', 'L', 'W', 'W', 'D'],
  },
  {
    equipoId: 3, equipo: 'Manchester City', liga: 'Premier League', temporada: '2024/25',
    partidos: 30, victorias: 20, empates: 6, derrotas: 4,
    golesFavor: 65, golesContra: 30,
    xG: 68.3, xGA: 27.5, ppda: 7.2,
    formaReciente: ['W', 'W', 'W', 'D', 'W'],
  },
]

export const APUESTAS_MOCK: Apuesta[] = [
  {
    id: '1', fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deporte: 'futbol', liga: 'La Liga', partido: 'Real Madrid vs Atlético',
    mercado: '1X2', seleccion: 'Real Madrid', cuota: 1.85, stake: 50,
    resultado: 'ganada', ganancia: 92.50, bookmaker: 'Bet365',
  },
  {
    id: '2', fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deporte: 'futbol', liga: 'Premier League', partido: 'Liverpool vs Chelsea',
    mercado: 'Over/Under', seleccion: 'Over 2.5', cuota: 1.75, stake: 30,
    resultado: 'perdida', ganancia: -30, bookmaker: 'Betsson',
  },
  {
    id: '3', fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deporte: 'baloncesto', liga: 'NBA', partido: 'Lakers vs Warriors',
    mercado: 'Moneyline', seleccion: 'LA Lakers', cuota: 2.10, stake: 25,
    resultado: 'ganada', ganancia: 52.50, bookmaker: 'Bet365',
  },
  {
    id: '4', fecha: new Date().toISOString(),
    deporte: 'futbol', liga: 'Champions League', partido: 'Bayern vs PSG',
    mercado: '1X2', seleccion: 'Bayern Múnich', cuota: 1.75, stake: 40,
    resultado: 'pendiente', bookmaker: 'Codere',
  },
  {
    id: '5', fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deporte: 'tenis', liga: 'Roland Garros', partido: 'Alcaraz vs Djokovic',
    mercado: 'Ganador', seleccion: 'C. Alcaraz', cuota: 2.20, stake: 20,
    resultado: 'ganada', ganancia: 44, bookmaker: 'William Hill',
  },
]
