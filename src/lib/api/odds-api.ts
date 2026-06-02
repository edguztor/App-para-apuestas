const BASE_URL = 'https://api.the-odds-api.com/v4'
const API_KEY = process.env.ODDS_API_KEY || ''

export async function getCuotasDeporte(sport: string, region: string = 'eu') {
  const url = `${BASE_URL}/sports/${sport}/odds/?apiKey=${API_KEY}&regions=${region}&markets=h2h&oddsFormat=decimal`
  const res = await fetch(url, { next: { revalidate: 120 } })
  if (!res.ok) return []
  return res.json()
}

export async function getDeportesDisponibles() {
  const url = `${BASE_URL}/sports/?apiKey=${API_KEY}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  return res.json()
}

export async function getCuotasPartido(sport: string, eventId: string, region: string = 'eu') {
  const url = `${BASE_URL}/sports/${sport}/events/${eventId}/odds?apiKey=${API_KEY}&regions=${region}&markets=h2h,totals,spreads&oddsFormat=decimal`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

export const SPORTS_MAP: Record<string, string> = {
  futbol: 'soccer_spain_la_liga',
  'futbol-premier': 'soccer_epl',
  'futbol-champions': 'soccer_uefa_champs_league',
  'futbol-mx': 'soccer_mexico_ligamx',
  baloncesto: 'basketball_nba',
  tenis: 'tennis_atp_french_open',
}

export const BOOKMAKERS_LATAM = [
  'bet365', 'betsson', 'codere', 'betano', 'williamhill', 'bwin', 'unibet', 'pinnacle'
]
