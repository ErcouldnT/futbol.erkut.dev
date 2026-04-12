import type { PageServerLoad } from './$types'
import { db } from '$lib/db'

export const load: PageServerLoad = async () => {
  const matches = await db.query.matches.findMany({
    with: {
      homeTeam: true,
      awayTeam: true,
      mvp: true,
      jerseyGoal: true,
    },
    orderBy: (matches, { desc }) => [desc(matches.matchTime)],
  })

  return {
    matches,
  }
}
