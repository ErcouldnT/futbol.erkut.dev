import type { LineupExpand, Player } from '$lib/types'
import { persisted } from 'svelte-persisted-store'

export const playersHomeStore = persisted<LineupExpand[]>('playersHome', [])
export const playersAwayStore = persisted<LineupExpand[]>('playersAway', [])
export const customPlayersStore = persisted<Player[]>('customPlayers', [])
export const homeTeamNameStore = persisted<string>('homeTeamName', '')
export const awayTeamNameStore = persisted<string>('awayTeamName', '')
export const allPlayersStore = persisted<Player[]>('allPlayers', [])
