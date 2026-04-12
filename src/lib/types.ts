import type { InferSelectModel } from 'drizzle-orm'
import type * as schema from './db/schema'

export type Player = InferSelectModel<typeof schema.players>
export type Team = InferSelectModel<typeof schema.teams>
export type Match = InferSelectModel<typeof schema.matches>
export type Lineup = InferSelectModel<typeof schema.lineups>
export type Comment = InferSelectModel<typeof schema.comments>

export interface MatchExpand extends Match {
  homeTeam: Team
  awayTeam: Team
  mvp?: Player | null
  jerseyGoal?: Player | null
}

export interface LineupExpand extends Lineup {
  match?: Match
  team?: Team
  player: Player
}
