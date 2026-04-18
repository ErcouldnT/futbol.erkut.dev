import { relations } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  number: integer('number').notNull(),
  profilePic: text('profile_pic'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const teamPlayers = sqliteTable('team_players', {
  teamId: text('team_id').notNull().references(() => teams.id),
  playerId: text('player_id').notNull().references(() => players.id),
})

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  approved: integer('approved', { mode: 'boolean' }).notNull().default(false),
  title: text('title').notNull(),
  homeTeamId: text('home_team_id').notNull().references(() => teams.id),
  awayTeamId: text('away_team_id').notNull().references(() => teams.id),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  mvpId: text('mvp_id').references(() => players.id),
  jerseyGoalId: text('jersey_goal_id').references(() => players.id),
  matchTime: text('match_time').notNull(),
  duration: integer('duration').notNull().default(90),
  isVotable: integer('is_votable', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const lineups = sqliteTable('lineups', {
  id: text('id').primaryKey(),
  matchId: text('match_id').notNull().references(() => matches.id),
  teamId: text('team_id').notNull().references(() => teams.id),
  playerId: text('player_id').notNull().references(() => players.id),
  goals: integer('goals').notNull().default(0),
  goalMinutes: text('goal_minutes').notNull().default('[]'),
  rating: real('rating').notNull().default(0),
  posX: real('pos_x').notNull().default(0),
  posY: real('pos_y').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  matchId: text('match_id').notNull().references(() => matches.id),
  username: text('username').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const matchesRelations = relations(matches, ({ one, many }) => ({
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
  }),
  mvp: one(players, {
    fields: [matches.mvpId],
    references: [players.id],
  }),
  jerseyGoal: one(players, {
    fields: [matches.jerseyGoalId],
    references: [players.id],
  }),
  lineups: many(lineups),
  comments: many(comments),
}))

export const lineupsRelations = relations(lineups, ({ one }) => ({
  match: one(matches, {
    fields: [lineups.matchId],
    references: [matches.id],
  }),
  team: one(teams, {
    fields: [lineups.teamId],
    references: [teams.id],
  }),
  player: one(players, {
    fields: [lineups.playerId],
    references: [players.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  match: one(matches, {
    fields: [comments.matchId],
    references: [matches.id],
  }),
}))
