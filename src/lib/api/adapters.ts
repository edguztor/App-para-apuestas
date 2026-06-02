import { Partido, ComparacionCuotas } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptarPartidoFD(match: any): Partido {
  const estadoMap: Record<string, Partido['estado']> = {
    SCHEDULED: 'programado',
    TIMED: 'programado',
    IN_PLAY: 'en_vivo',
    PAUSED: 'en_vivo',
    FINISHED: 'finalizado',
    POSTPONED: 'aplazado',
    CANCELLED: 'aplazado',
  }

  return {
    id: match.id,
    deporte: 'futbol',
    liga: match.competition?.name ?? '',
    ligaLogo: match.competition?.emblem,
    local: {
      id: match.homeTeam?.id,
      nombre: match.homeTeam?.shortName ?? match.homeTeam?.name ?? 'Local',
      escudo: match.homeTeam?.crest,
    },
    visitante: {
      id: match.awayTeam?.id,
      nombre: match.awayTeam?.shortName ?? match.awayTeam?.name ?? 'Visitante',
      escudo: match.awayTeam?.crest,
    },
    fecha: match.utcDate,
    estado: estadoMap[match.status] ?? 'programado',
    marcador: match.score?.fullTime?.home != null ? {
      local: match.score.fullTime.home,
      visitante: match.score.fullTime.away,
      minuto: match.minute,
    } : undefined,
  }
}

export interface EventoConCuotas {
  id: string
  liga: string
  local: string
  visitante: string
  fecha: string
  cuotas: ComparacionCuotas[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptarCuotasOddsAPI(evento: any): EventoConCuotas {
  const BOOKMAKER_NOMBRES: Record<string, string> = {
    bet365: 'Bet365',
    betsson: 'Betsson',
    unibet: 'Unibet',
    williamhill: 'William Hill',
    bwin: 'Bwin',
    betano: 'Betano',
    codere: 'Codere',
    pinnacle: 'Pinnacle',
    draftkings: 'DraftKings',
    betway: 'Betway',
    betfair_ex_eu: 'Betfair',
    sport888: '888sport',
  }

  const cuotas: ComparacionCuotas[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const bm of (evento.bookmakers ?? [])) {
    const h2h = bm.markets?.find((m: any) => m.key === 'h2h')
    const totals = bm.markets?.find((m: any) => m.key === 'totals')

    if (!h2h) continue

    const outcomes = h2h.outcomes ?? []
    const localOut = outcomes.find((o: any) => o.name === evento.home_team)
    const visitanteOut = outcomes.find((o: any) => o.name === evento.away_team)
    const empateOut = outcomes.find((o: any) => o.name === 'Draw')

    const over = totals?.outcomes?.find((o: any) => o.name === 'Over' && o.point === 2.5)
    const under = totals?.outcomes?.find((o: any) => o.name === 'Under' && o.point === 2.5)

    if (!localOut || !visitanteOut) continue

    cuotas.push({
      partidoId: 0,
      bookmaker: BOOKMAKER_NOMBRES[bm.key] ?? bm.title ?? bm.key,
      local: localOut.price,
      empate: empateOut?.price,
      visitante: visitanteOut.price,
      over25: over?.price,
      under25: under?.price,
    })
  }

  return {
    id: evento.id,
    liga: evento.sport_title ?? '',
    local: evento.home_team ?? '',
    visitante: evento.away_team ?? '',
    fecha: evento.commence_time ?? '',
    cuotas,
  }
}
