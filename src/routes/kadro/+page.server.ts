import type { Actions, PageServerLoad } from './$types'
import { db } from '$lib/db'
import { lineups, matches, teams } from '$lib/db/schema'
import { fail, redirect } from '@sveltejs/kit'
import { v4 as uuidv4 } from 'uuid'

export const load: PageServerLoad = async () => {
  const players = await db.query.players.findMany({
    orderBy: (players, { asc }) => [asc(players.name)],
  })

  return {
    players,
  }
}

export const actions: Actions = {
  saveMatch: async ({ request }) => {
    const data = await request.formData()
    const homeTeamName = data.get('homeTeamName') as string
    const awayTeamName = data.get('awayTeamName') as string
    const homePlayers = JSON.parse(data.get('homePlayers') as string)
    const awayPlayers = JSON.parse(data.get('awayPlayers') as string)

    if (!homeTeamName || !awayTeamName) {
      return fail(400, { message: 'Missing team names' })
    }

    try {
      const homeTeamId = uuidv4()
      const awayTeamId = uuidv4()
      const matchId = uuidv4()

      await db.transaction(async (tx) => {
        await tx.insert(teams).values([
          { id: homeTeamId, name: homeTeamName },
          { id: awayTeamId, name: awayTeamName },
        ])

        await tx.insert(matches).values({
          id: matchId,
          title: `${homeTeamName} vs ${awayTeamName}`,
          homeTeamId,
          awayTeamId,
          matchTime: new Date().toISOString(),
        })

        const lineupValues = [
          ...homePlayers.map((p: any) => ({
            id: uuidv4(),
            matchId,
            teamId: homeTeamId,
            playerId: p.playerId,
            posX: p.posX,
            posY: p.posY,
          })),
          ...awayPlayers.map((p: any) => ({
            id: uuidv4(),
            matchId,
            teamId: awayTeamId,
            playerId: p.playerId,
            posX: p.posX,
            posY: p.posY,
          })),
        ]

        if (lineupValues.length > 0) {
          await tx.insert(lineups).values(lineupValues)
        }
      })

      throw redirect(303, '/')
    }
    catch (error) {
      if (error instanceof Error && 'status' in error)
        throw error // Re-throw redirect
      console.error(error)
      return fail(500, { message: 'Failed to save match' })
    }
  },
}
