import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { comments } from '$lib/db/schema'
import { json } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const GET: RequestHandler = async ({ url }) => {
  const matchId = url.searchParams.get('matchId')

  if (!matchId) {
    return json({ error: 'Missing matchId' }, { status: 400 })
  }

  const data = await db.query.comments.findMany({
    where: eq(comments.matchId, matchId),
    orderBy: [asc(comments.createdAt)],
  })

  return json(data)
}

export const POST: RequestHandler = async ({ request }) => {
  const { matchId, username, content } = await request.json()

  if (!matchId || !username || !content) {
    return json({ error: 'Missing fields' }, { status: 400 })
  }

  const [newComment] = await db.insert(comments).values({
    id: uuidv4(),
    matchId,
    username,
    content,
  }).returning()

  return json(newComment)
}
