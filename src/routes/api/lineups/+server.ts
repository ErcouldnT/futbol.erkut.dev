import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { lineups, matches } from '$lib/db/schema'
import { json } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'

export const GET: RequestHandler = async ({ url }) => {
  const matchId = url.searchParams.get('matchId')
  const teamId = url.searchParams.get('teamId')

  if (!matchId) {
    return json({ error: 'Missing matchId' }, { status: 400 })
  }

  const conditions = [eq(lineups.matchId, matchId)]
  if (teamId) {
    conditions.push(eq(lineups.teamId, teamId))
  }

  const data = await db.query.lineups.findMany({
    where: and(...conditions),
    with: {
      player: true,
    },
  })

  return json(data)
}

export const PATCH: RequestHandler = async ({ request }) => {
  const { id, goals, matchId, teamId, type } = await request.json()

  if (!id) {
    return json({ error: 'Missing lineup id' }, { status: 400 })
  }

  // Update logic: if 'type' is provided, we increment/decrement
  let newGoals = goals
  if (type === 'increment') {
    const current = await db.query.lineups.findFirst({ where: eq(lineups.id, id) })
    newGoals = (current?.goals || 0) + 1
  }
  else if (type === 'decrement') {
    const current = await db.query.lineups.findFirst({ where: eq(lineups.id, id) })
    newGoals = Math.max(0, (current?.goals || 0) - 1)
  }

  const updatedLineup = await db.update(lineups)
    .set({ goals: newGoals, updatedAt: new Date() })
    .where(eq(lineups.id, id))
    .returning()
    .get()

  // Sync match score
  if (matchId && teamId) {
    const allLineups = await db.query.lineups.findMany({
      where: and(eq(lineups.matchId, matchId), eq(lineups.teamId, teamId)),
    })
    const totalScore = allLineups.reduce((sum, l) => sum + (l.id === id ? newGoals : l.goals), 0)

    const matchData = await db.query.matches.findFirst({ where: eq(matches.id, matchId) })
    if (matchData) {
      const isHome = matchData.homeTeamId === teamId
      await db.update(matches)
        .set({
          [isHome ? 'homeScore' : 'awayScore']: totalScore,
          updatedAt: new Date(),
        })
        .where(eq(matches.id, matchId))
    }
  }

  return json(updatedLineup)
}
