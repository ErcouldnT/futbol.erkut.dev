import type { Actions } from './$types'
import { db } from '$lib/db'
import { lineups, matches, players, teams } from '$lib/db/schema'
import { fail, isRedirect, redirect } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { scheduleMatchNotifications } from '../../services/scheduler'
import { sendNewMatchNotification } from '../../services/telegram'

export const actions: Actions = {
  checkPlayer: async ({ request }) => {
    const formData = await request.formData()
    const name = formData.get('name') as string

    if (!name)
      return fail(400, { message: 'Name is required' })

    const player = db.select().from(players).where(eq(players.name, name)).get()
    return { player }
  },
  saveMatch: async ({ request }) => {
    const formData = await request.formData()
    const homeTeamName = formData.get('homeTeamName') as string
    const awayTeamName = formData.get('awayTeamName') as string
    const homePlayers = JSON.parse(formData.get('homePlayers') as string)
    const awayPlayers = JSON.parse(formData.get('awayPlayers') as string)
    const title = formData.get('title') as string
    const matchTime = formData.get('matchTime') as string
    const duration = Number.parseInt(formData.get('duration') as string || '60')

    if (!homeTeamName || !awayTeamName) {
      return fail(400, { message: 'Missing team names' })
    }

    try {
      const homeTeamId = uuidv4()
      const awayTeamId = uuidv4()
      const matchId = uuidv4()

      // Better-sqlite3 transactions must be synchronous
      db.transaction((tx) => {
        const playerMap = new Map<string, string>()
        const allPlayersInLineup = [...homePlayers, ...awayPlayers]

        for (const p of allPlayersInLineup) {
          if (playerMap.has(p.player.id))
            continue

          // Use sync .get() for check
          const existing = tx.select().from(players).where(eq(players.name, p.player.name)).get()

          if (existing) {
            playerMap.set(p.player.id, existing.id)
            // Numara veya fotoğraf değişmişse güncelle
            const updates: Record<string, any> = {}
            if (existing.number !== p.player.number)
              updates.number = p.player.number
            if (p.player.profilePic && existing.profilePic !== p.player.profilePic)
              updates.profilePic = p.player.profilePic
            if (Object.keys(updates).length > 0) {
              updates.updatedAt = new Date()
              tx.update(players)
                .set(updates)
                .where(eq(players.id, existing.id))
                .run()
            }
          }
          else {
            const newId = uuidv4()
            tx.insert(players).values({
              id: newId,
              name: p.player.name,
              number: p.player.number,
              ...(p.player.profilePic ? { profilePic: p.player.profilePic } : {}),
            }).run()
            playerMap.set(p.player.id, newId)
          }
        }

        tx.insert(teams).values([
          { id: homeTeamId, name: homeTeamName },
          { id: awayTeamId, name: awayTeamName },
        ]).run()

        tx.insert(matches).values({
          id: matchId,
          title: title || `${homeTeamName} vs ${awayTeamName}`,
          homeTeamId,
          awayTeamId,
          matchTime: matchTime || new Date().toISOString(),
          duration,
        }).run()

        const lineupValues = [
          ...homePlayers.map((p: any) => ({
            id: uuidv4(),
            matchId,
            teamId: homeTeamId,
            playerId: playerMap.get(p.player.id),
            posX: p.posX,
            posY: p.posY,
          })),
          ...awayPlayers.map((p: any) => ({
            id: uuidv4(),
            matchId,
            teamId: awayTeamId,
            playerId: playerMap.get(p.player.id),
            posX: p.posX,
            posY: p.posY,
          })),
        ]

        if (lineupValues.length > 0) {
          tx.insert(lineups).values(lineupValues).run()
        }
      })

      sendNewMatchNotification({
        title: title || `${homeTeamName} vs ${awayTeamName}`,
        homeTeamName,
        awayTeamName,
        matchTime: matchTime || new Date().toISOString(),
        duration,
        homePlayerNames: homePlayers.map((p: any) => p.player.name),
        awayPlayerNames: awayPlayers.map((p: any) => p.player.name),
      }).catch(err => console.error('[Telegram] Bildirim hatası:', err))

      // Schedule match notifications (reminder, start, end)
      const createdMatch = db.query.matches.findFirst({
        where: eq(matches.id, matchId),
        with: { homeTeam: true, awayTeam: true },
      })
      if (createdMatch) {
        scheduleMatchNotifications(createdMatch as any)
      }

      throw redirect(303, '/')
    }
    catch (error) {
      if (isRedirect(error))
        throw error
      console.error('SAVE MATCH ERROR:', error)
      return fail(500, { message: `Failed to save match: ${(error as Error).message}` })
    }
  },
}
