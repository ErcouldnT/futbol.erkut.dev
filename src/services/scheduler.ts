import { db } from '$lib/db'
import { lineups, matches } from '$lib/db/schema'
import { and, eq, or } from 'drizzle-orm'
import schedule from 'node-schedule'
import { sendMatchEndedNotification, sendMatchReminderNotification, sendMatchStartedNotification } from './telegram'

// Track scheduled jobs by matchId
const scheduledJobs = new Map<string, schedule.Job[]>()

interface MatchWithTeams {
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

async function getMatchNotificationData(match: MatchWithTeams) {
  const homeLineups = await db.query.lineups.findMany({
    where: and(eq(lineups.matchId, match.id), eq(lineups.teamId, match.homeTeamId)),
    with: { player: true },
  })
  const awayLineups = await db.query.lineups.findMany({
    where: and(eq(lineups.matchId, match.id), eq(lineups.teamId, match.awayTeamId)),
    with: { player: true },
  })

  // Re-read match for latest scores
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

export function scheduleMatchNotifications(match: MatchWithTeams): void {
  // Cancel existing jobs for this match
  cancelMatchNotifications(match.id)

  const jobs: schedule.Job[] = []
  const matchStart = new Date(match.matchTime)
  const matchEnd = new Date(matchStart.getTime() + (match.duration || 90) * 60000)
  const now = new Date()

  // 30 minutes before match
  const reminderTime = new Date(matchStart.getTime() - 30 * 60000)
  if (reminderTime > now && !match.notifiedReminder) {
    const job = schedule.scheduleJob(`reminder-${match.id}`, reminderTime, async () => {
      try {
        const data = await getMatchNotificationData(match)
        await sendMatchReminderNotification(data)
        await db.update(matches).set({ notifiedReminder: true }).where(eq(matches.id, match.id))
        console.warn(`[Scheduler] Hatırlatma gönderildi: ${match.title}`)
      }
      catch (err) {
        console.error(`[Scheduler] Hatırlatma hatası:`, err)
      }
    })
    if (job)
      jobs.push(job)
  }

  // Match start
  if (matchStart > now && !match.notifiedStart) {
    const job = schedule.scheduleJob(`start-${match.id}`, matchStart, async () => {
      try {
        const data = await getMatchNotificationData(match)
        await sendMatchStartedNotification(data)
        await db.update(matches).set({ notifiedStart: true }).where(eq(matches.id, match.id))
        console.warn(`[Scheduler] Maç başladı gönderildi: ${match.title}`)
      }
      catch (err) {
        console.error(`[Scheduler] Maç başladı hatası:`, err)
      }
    })
    if (job)
      jobs.push(job)
  }

  // 5 minutes after match end
  const endNotifyTime = new Date(matchEnd.getTime() + 5 * 60000)
  if (endNotifyTime > now && !match.notifiedEnd) {
    const job = schedule.scheduleJob(`end-${match.id}`, endNotifyTime, async () => {
      try {
        const data = await getMatchNotificationData(match)
        await sendMatchEndedNotification(data)
        await db.update(matches).set({ notifiedEnd: true }).where(eq(matches.id, match.id))
        console.warn(`[Scheduler] Maç bitti gönderildi: ${match.title}`)
      }
      catch (err) {
        console.error(`[Scheduler] Maç bitti hatası:`, err)
      }
    })
    if (job)
      jobs.push(job)
  }

  if (jobs.length > 0) {
    scheduledJobs.set(match.id, jobs)
    console.warn(`[Scheduler] ${jobs.length} bildirim planlandı: ${match.title}`)
  }
}

export function cancelMatchNotifications(matchId: string): void {
  const jobs = scheduledJobs.get(matchId)
  if (jobs) {
    for (const job of jobs) {
      job.cancel()
    }
    scheduledJobs.delete(matchId)
    console.warn(`[Scheduler] Bildirimler iptal edildi: ${matchId}`)
  }
}

export async function initScheduler(): Promise<void> {
  // Only fetch matches that still have pending notifications
  const pendingMatches = await db.query.matches.findMany({
    where: or(
      eq(matches.notifiedReminder, false),
      eq(matches.notifiedStart, false),
      eq(matches.notifiedEnd, false),
    ),
    with: { homeTeam: true, awayTeam: true },
  })

  let scheduled = 0
  for (const match of pendingMatches) {
    scheduleMatchNotifications(match as MatchWithTeams)
    scheduled++
  }

  console.warn(`[Scheduler] ${scheduled} maç için bildirimler planlandı`)
}
