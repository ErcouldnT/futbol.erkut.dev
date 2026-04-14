import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/db'
import { comments, lineups, matches } from '$lib/db/schema'
import { fail } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load: PageServerLoad = async () => {
  const matchesData = await db.query.matches.findMany({
    with: {
      homeTeam: true,
      awayTeam: true,
      mvp: true,
      jerseyGoal: true,
      lineups: {
        with: {
          player: true,
        },
      },
    },
    orderBy: (matches, { desc }) => [desc(matches.matchTime)],
  })

  return {
    matches: matchesData,
  }
}

export const actions: Actions = {
  deleteMatch: async ({ request }) => {
    const formData = await request.formData()
    const id = formData.get('id') as string

    if (!id) {
      return fail(400, { message: 'Match ID is required' })
    }

    try {
      // Manual cascade delete since schema doesn't have it
      await db.delete(lineups).where(eq(lineups.matchId, id))
      await db.delete(comments).where(eq(comments.matchId, id))
      await db.delete(matches).where(eq(matches.id, id))

      return { success: true }
    }
    catch (error) {
      console.error('Delete error:', error)
      return fail(500, { message: 'Failed to delete match' })
    }
  },
}
