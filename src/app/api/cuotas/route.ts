import { NextRequest, NextResponse } from 'next/server'
import { getCuotasDeporte } from '@/lib/api/odds-api'
import { adaptarCuotasOddsAPI } from '@/lib/api/adapters'

const SPORT_MAP: Record<string, string> = {
  futbol: 'soccer_spain_la_liga',
  'futbol-premier': 'soccer_epl',
  'futbol-champions': 'soccer_uefa_champs_league',
  'futbol-mx': 'soccer_mexico_ligamx',
  'futbol-argentina': 'soccer_argentina_primera_division',
  baloncesto: 'basketball_nba',
  tenis: 'tennis_atp_wimbledon',
}

export async function GET(req: NextRequest) {
  const deporte = req.nextUrl.searchParams.get('deporte') || 'futbol'
  const sportKey = SPORT_MAP[deporte] || 'soccer_spain_la_liga'

  try {
    const raw = await getCuotasDeporte(sportKey, 'eu')
    const cuotas = raw.map(adaptarCuotasOddsAPI)
    return NextResponse.json(cuotas)
  } catch (error) {
    console.error('Error fetching cuotas:', error)
    return NextResponse.json([], { status: 200 })
  }
}
