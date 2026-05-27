const BASE_URL = 'https://api.football-data.org/v4'
const API_KEY = process.env.FOOTBALL_DATA_API_KEY || ''

const headers = {
  'X-Auth-Token': API_KEY,
}

export async function getPartidosHoy(competitionId?: string) {
  const hoy = new Date().toISOString().split('T')[0]
  const url = competitionId
    ? `${BASE_URL}/competitions/${competitionId}/matches?dateFrom=${hoy}&dateTo=${hoy}`
    : `${BASE_URL}/matches?dateFrom=${hoy}&dateTo=${hoy}`

  const res = await fetch(url, { headers, next: { revalidate: 60 } })
  if (!res.ok) return []
  const data = await res.json()
  return data.matches || []
}

export async function getPartidosLiga(competitionId: string, limit = 10) {
  const res = await fetch(
    `${BASE_URL}/competitions/${competitionId}/matches?status=SCHEDULED&limit=${limit}`,
    { headers, next: { revalidate: 300 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.matches || []
}

export async function getTablaLiga(competitionId: string) {
  const res = await fetch(
    `${BASE_URL}/competitions/${competitionId}/standings`,
    { headers, next: { revalidate: 3600 } }
  )
  if (!res.ok) return null
  return res.json()
}

export async function getPartido(matchId: number) {
  const res = await fetch(`${BASE_URL}/matches/${matchId}`, { headers, next: { revalidate: 30 } })
  if (!res.ok) return null
  return res.json()
}

export async function getH2H(matchId: number) {
  const res = await fetch(`${BASE_URL}/matches/${matchId}/head2head`, { headers, next: { revalidate: 3600 } })
  if (!res.ok) return null
  return res.json()
}

export async function getEquipo(teamId: number) {
  const res = await fetch(`${BASE_URL}/teams/${teamId}`, { headers, next: { revalidate: 3600 } })
  if (!res.ok) return null
  return res.json()
}

export const COMPETICIONES = {
  PL: { nombre: 'Premier League', pais: 'Inglaterra', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  PD: { nombre: 'La Liga', pais: 'España', emoji: '🇪🇸' },
  BL1: { nombre: 'Bundesliga', pais: 'Alemania', emoji: '🇩🇪' },
  SA: { nombre: 'Serie A', pais: 'Italia', emoji: '🇮🇹' },
  FL1: { nombre: 'Ligue 1', pais: 'Francia', emoji: '🇫🇷' },
  CL: { nombre: 'Champions League', pais: 'Europa', emoji: '🏆' },
  MX: { nombre: 'Liga MX', pais: 'México', emoji: '🇲🇽' },
} as const
