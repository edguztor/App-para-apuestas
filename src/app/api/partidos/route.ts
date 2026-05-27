import { NextResponse } from 'next/server'
import { getPartidosHoy } from '@/lib/api/football-data'
import { adaptarPartidoFD } from '@/lib/api/adapters'

export async function GET() {
  try {
    const raw = await getPartidosHoy()
    const partidos = raw.map(adaptarPartidoFD)
    return NextResponse.json(partidos)
  } catch (error) {
    console.error('Error fetching partidos:', error)
    return NextResponse.json([], { status: 200 })
  }
}
