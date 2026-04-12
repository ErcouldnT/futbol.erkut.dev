import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { lineups } from '$lib/db/schema'
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
