import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { matches } from '$lib/db/schema'
import { json } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

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

  return json(updated)
}
