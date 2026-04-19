import { db } from '$lib/db'
import { lineups, matches } from '$lib/db/schema'
import { and, eq, or } from 'drizzle-orm'
import { sendMatchEndedNotification, sendMatchReminderNotification, sendMatchStartedNotification } from './telegram'

const POLL_INTERVAL = 5 * 60 * 1000 // 5 minutes
let pollTimer: ReturnType<typeof setInterval> | null = null

interface MatchRow {
  id: string
  title: string
  matchTime: string
  duration: number
  homeScore: number
  awayScore: number
  notifiedReminder: boolean
  notifiedStart: boolean
  notifiedEnd: boolean
  homeTeamId: string
  awayTeamId: string
  homeTeam: { name: string }
  awayTeam: { name: string }
}

async function getMatchNotificationData(match: MatchRow) {
  const homeLineups = await db.query.lineups.findMany({
    where: and(eq(lineups.matchId, match.id), eq(lineups.teamId, match.homeTeamId)),
    with: { player: true },
  })
  const awayLineups = await db.query.lineups.findMany({
    where: and(eq(lineups.matchId, match.id), eq(lineups.teamId, match.awayTeamId)),
    with: { player: true },
  })

  const freshMatch = await db.query.matches.findFirst({ where: eq(matches.id, match.id) })

  return {
    title: match.title,
    homeTeamName: match.homeTeam.name,
    awayTeamName: match.awayTeam.name,
    homeScore: freshMatch?.homeScore ?? match.homeScore,
    awayScore: freshMatch?.awayScore ?? match.awayScore,
    matchTime: match.matchTime,
    duration: match.duration,
    homePlayerNames: homeLineups.map(l => l.player.name),
    awayPlayerNames: awayLineups.map(l => l.player.name),
  }
}

async function checkAndSendNotifications(): Promise<void> {
  try {
    const pendingMatches = await db.query.matches.findMany({
      where: or(
        eq(matches.notifiedReminder, false),
        eq(matches.notifiedStart, false),
        eq(matches.notifiedEnd, false),
      ),
      with: { homeTeam: true, awayTeam: true },
    })

    const now = Date.now()

    for (const match of pendingMatches) {
      const m = match as MatchRow
      const matchStart = new Date(m.matchTime)
      const matchEnd = new Date(matchStart.getTime() + (m.duration || 90) * 60000)
      const reminderTime = new Date(matchStart.getTime() - 30 * 60000)
      const endNotifyTime = new Date(matchEnd.getTime() + 5 * 60000)

      // Reminder: 30 min before match
      if (!m.notifiedReminder && reminderTime.getTime() <= now) {
        try {
          const data = await getMatchNotificationData(m)
          await sendMatchReminderNotification(data)
          await db.update(matches).set({ notifiedReminder: true }).where(eq(matches.id, m.id))
          console.warn(`[Scheduler] Hatırlatma gönderildi: ${m.title}`)
        }
        catch (err) {
          console.error(`[Scheduler] Hatırlatma hatası:`, err)
        }
      }

      // Match start
      if (!m.notifiedStart && matchStart.getTime() <= now) {
        try {
          const data = await getMatchNotificationData(m)
          await sendMatchStartedNotification(data)
          await db.update(matches).set({ notifiedStart: true }).where(eq(matches.id, m.id))
          console.warn(`[Scheduler] Maç başladı gönderildi: ${m.title}`)
        }
        catch (err) {
          console.error(`[Scheduler] Maç başladı hatası:`, err)
        }
      }

      // Match end: 5 min after
      if (!m.notifiedEnd && endNotifyTime.getTime() <= now) {
        try {
          const data = await getMatchNotificationData(m)
          await sendMatchEndedNotification(data)
          await db.update(matches).set({ notifiedEnd: true }).where(eq(matches.id, m.id))
          console.warn(`[Scheduler] Maç bitti gönderildi: ${m.title}`)
        }
        catch (err) {
          console.error(`[Scheduler] Maç bitti hatası:`, err)
        }
      }
    }
  }
  catch (err) {
    console.error('[Scheduler] Polling hatası:', err)
  }
}

export function initScheduler(): void {
  if (pollTimer) {
    clearInterval(pollTimer)
  }

  // Run immediately on startup
  checkAndSendNotifications()

  // Then poll every 5 minutes
  pollTimer = setInterval(checkAndSendNotifications, POLL_INTERVAL)
  console.warn(`[Scheduler] Polling başlatıldı (${POLL_INTERVAL / 1000}s aralıkla)`)
}
