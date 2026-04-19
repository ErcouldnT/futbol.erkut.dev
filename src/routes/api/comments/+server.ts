import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { comments, matches } from '$lib/db/schema'
import { censorText } from '$lib/profanity'
import { json } from '@sveltejs/kit'
import { asc, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { sendCommentNotification } from '../../../services/telegram'

export const GET: RequestHandler = async ({ url }) => {
  const matchId = url.searchParams.get('matchId')

  if (!matchId) {
    return json({ error: 'Missing matchId' }, { status: 400 })
  }

  const data = await db.query.comments.findMany({
    where: eq(comments.matchId, matchId),
    orderBy: [asc(comments.createdAt)],
  })

  const censored = data.map(c => ({ ...c, content: censorText(c.content) }))

  return json(censored)
}

export const POST: RequestHandler = async ({ request }) => {
  const { matchId, username, content } = await request.json()

  if (!matchId || !username || !content) {
    return json({ error: 'Missing fields' }, { status: 400 })
  }

  const censoredContent = censorText(content)

  const [newComment] = await db.insert(comments).values({
    id: uuidv4(),
    matchId,
    username,
    content: censoredContent,
  }).returning()

  // Send Telegram notification
  const matchData = await db.query.matches.findFirst({ where: eq(matches.id, matchId) })
  if (matchData) {
    sendCommentNotification({
      username,
      content: censoredContent,
      matchTitle: matchData.title,
    }).catch(err => console.error('[Telegram]', err))
  }

  return json(newComment)
}
