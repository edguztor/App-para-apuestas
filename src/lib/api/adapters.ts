import { Partido } from '@/types'

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
