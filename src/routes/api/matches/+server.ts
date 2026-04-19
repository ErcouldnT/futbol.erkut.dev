import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { lineups, matches, players } from '$lib/db/schema'
import { json } from '@sveltejs/kit'
import { and, eq } from 'drizzle-orm'
import { sendJerseyGoalNotification, sendMvpNotification } from '../../../services/telegram'

export const PATCH: RequestHandler = async ({ request }) => {
  const { id, mvpId, jerseyGoalId } = await request.json()

  if (!id) {
    return json({ error: 'Missing match id' }, { status: 400 })
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() }

  if (mvpId !== undefined)
    updateData.mvpId = mvpId || null
  if (jerseyGoalId !== undefined)
    updateData.jerseyGoalId = jerseyGoalId || null

  const updated = await db.update(matches)
    .set(updateData)
    .where(eq(matches.id, id))
    .returning()
    .get()

  // Send Telegram notification for MVP or Jersey Goal selection
  if (updated && (mvpId || jerseyGoalId)) {
    const matchData = await db.query.matches.findFirst({
      where: eq(matches.id, id),
      with: { homeTeam: true, awayTeam: true },
    })

    const playerId = mvpId || jerseyGoalId
    if (matchData && playerId) {
      const player = await db.query.players.findFirst({ where: eq(players.id, playerId) })
      if (player) {
        const info = {
          playerName: player.name,
          matchTitle: matchData.title,
          homeTeamName: matchData.homeTeam.name,
          awayTeamName: matchData.awayTeam.name,
          homeScore: matchData.homeScore,
          awayScore: matchData.awayScore,
        }

        if (mvpId) {
          sendMvpNotification(info).catch(err => console.error('[Telegram]', err))
        }
        if (jerseyGoalId) {
          // Forma golünü atan oyuncunun takımını bul, diğer takım forma giyecek
          const playerLineup = await db.query.lineups.findFirst({
            where: and(eq(lineups.matchId, id), eq(lineups.playerId, jerseyGoalId)),
          })
          const scorerTeamId = playerLineup?.teamId
          const losingTeamName = scorerTeamId === matchData.homeTeamId
            ? matchData.awayTeam.name
            : matchData.homeTeam.name

          sendJerseyGoalNotification({ ...info, losingTeamName }).catch(err => console.error('[Telegram]', err))
        }
      }
    }
  }

  return json(updated)
}
