import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { players } from '$lib/db/schema'
import { json } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const PATCH: RequestHandler = async ({ request }) => {
  const { id, profilePic } = await request.json()

  if (!id) {
    return json({ error: 'Missing player id' }, { status: 400 })
  }

  const updated = await db.update(players)
    .set({ profilePic, updatedAt: new Date() })
    .where(eq(players.id, id))
    .returning()
    .get()

  return json(updated)
}
