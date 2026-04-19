import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { lineups, matches } from '$lib/db/schema'
import { json } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { sendGoalCancelledNotification, sendGoalNotification } from '../../../services/telegram'

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

  const current = await db.query.lineups.findFirst({ where: eq(lineups.id, id) })
  if (!current) {
    return json({ error: 'Lineup not found' }, { status: 404 })
  }

  let newGoals = goals ?? current.goals
  let goalMinutes: number[] = []
  try {
    goalMinutes = JSON.parse(current.goalMinutes || '[]')
  }
  catch {
    goalMinutes = []
  }

  if (type === 'increment') {
    newGoals = current.goals + 1

    // Calculate goal minute only if match is currently live
    if (matchId) {
      const matchData = await db.query.matches.findFirst({ where: eq(matches.id, matchId) })
      if (matchData) {
        const matchStart = new Date(matchData.matchTime).getTime()
        const matchEnd = matchStart + (matchData.duration || 90) * 60000
        const now = Date.now()
        // Only record minute if match is in progress
        if (now >= matchStart && now <= matchEnd) {
          const minuteElapsed = Math.max(1, Math.round((now - matchStart) / 60000))
          goalMinutes.push(minuteElapsed)
        }
      }
    }
  }
  else if (type === 'decrement') {
    newGoals = Math.max(0, current.goals - 1)
    // Remove last recorded minute
    if (goalMinutes.length > 0) {
      goalMinutes.pop()
    }
  }

  const updatedLineup = await db.update(lineups)
    .set({ goals: newGoals, goalMinutes: JSON.stringify(goalMinutes), updatedAt: new Date() })
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

  // Send Telegram notification for goal events
  if (matchId && teamId && (type === 'increment' || type === 'decrement')) {
    const matchInfo = await db.query.matches.findFirst({
      where: eq(matches.id, matchId),
      with: { homeTeam: true, awayTeam: true },
    })
    const lineup = await db.query.lineups.findFirst({
      where: eq(lineups.id, id),
      with: { player: true },
    })

    if (matchInfo && lineup) {
      // Recalculate total scores
      const allHomeLineups = await db.query.lineups.findMany({
        where: and(eq(lineups.matchId, matchId), eq(lineups.teamId, matchInfo.homeTeamId)),
      })
      const allAwayLineups = await db.query.lineups.findMany({
        where: and(eq(lineups.matchId, matchId), eq(lineups.teamId, matchInfo.awayTeamId)),
      })
      const homeScore = allHomeLineups.reduce((sum, l) => sum + l.goals, 0)
      const awayScore = allAwayLineups.reduce((sum, l) => sum + l.goals, 0)

      const matchStart = new Date(matchInfo.matchTime).getTime()
      const matchEnd = matchStart + (matchInfo.duration || 90) * 60000
      const isPostMatch = Date.now() > matchEnd

      const goalInfo = {
        scorerName: lineup.player.name,
        minute: type === 'increment' && goalMinutes.length > 0 ? goalMinutes[goalMinutes.length - 1] : null,
        homeTeamName: matchInfo.homeTeam.name,
        awayTeamName: matchInfo.awayTeam.name,
        homeScore,
        awayScore,
        teamName: matchInfo.homeTeamId === teamId ? matchInfo.homeTeam.name : matchInfo.awayTeam.name,
        isPostMatch,
        matchTime: matchInfo.matchTime,
      }

      if (type === 'increment') {
        sendGoalNotification(goalInfo).catch(err => console.error('[Telegram]', err))
      }
      else if (type === 'decrement') {
        sendGoalCancelledNotification(goalInfo).catch(err => console.error('[Telegram]', err))
      }
    }
  }

  return json(updatedLineup)
}
