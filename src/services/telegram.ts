import { env } from '$env/dynamic/private'

const TELEGRAM_API = 'https://api.telegram.org'

async function sendMessage(text: string): Promise<void> {
  const token = env.TELEGRAM_BOT_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('[Telegram] BOT_TOKEN veya CHAT_ID tanımlı değil, mesaj gönderilmedi.')
    return
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Telegram] Mesaj gönderilemedi:', err)
    }
  }
  catch (error) {
    console.error('[Telegram] Hata:', error)
  }
}

interface MatchInfo {
  title: string
  homeTeamName: string
  awayTeamName: string
  matchTime: string
  duration: number
  homePlayerNames: string[]
  awayPlayerNames: string[]
}

export async function sendNewMatchNotification(match: MatchInfo): Promise<void> {
  const date = new Date(match.matchTime)
  const dateStr = date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

  const homeList = match.homePlayerNames.map(n => `  • ${n}`).join('\n')
  const awayList = match.awayPlayerNames.map(n => `  • ${n}`).join('\n')

  const text = `⚽️ <b>YENİ MAÇ KURULDU!</b>

Arkadaşlar maç kadrosu hazır, saha bizi bekliyor!

🏟️ <b>${match.title}</b>

🔴 <b>${match.homeTeamName}</b> (${match.homePlayerNames.length} kişi)
${homeList}

🔵 <b>${match.awayTeamName}</b> (${match.awayPlayerNames.length} kişi)
${awayList}

📅 ${dateStr}
⏰ Saat ${timeStr}
⏱ ${match.duration} dakika

Hazır mısınız beyler? Top yuvarlanmaya başlıyor! 🔥`

  await sendMessage(text)
}

function formatScore(info: { homeTeamName: string, awayTeamName: string, homeScore: number, awayScore: number }): string {
  return `<b>${info.homeTeamName}</b>  <b>${info.homeScore}</b> ─ <b>${info.awayScore}</b>  <b>${info.awayTeamName}</b>`
}

interface GoalInfo {
  scorerName: string
  minute: number | null
  homeTeamName: string
  awayTeamName: string
  homeScore: number
  awayScore: number
  teamName: string
  isPostMatch: boolean
  matchTime: string
}

export async function sendGoalNotification(goal: GoalInfo): Promise<void> {
  if (goal.isPostMatch) {
    const dateStr = new Date(goal.matchTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })

    const text = `📝 <b>SKOR GÜNCELLEMESİ</b> (${dateStr})

<b>${goal.scorerName}</b>'in golü maç sonrası eklendi.

${formatScore(goal)}`

    await sendMessage(text)
    return
  }

  const minuteStr = goal.minute ? `${goal.minute}. dakikada` : ''

  const text = `⚽⚽⚽ GOOOOOL!!!! ⚽⚽⚽

🔥 <b>${goal.scorerName}</b> ${minuteStr} ağları sarsıyor!

${formatScore(goal)}`

  await sendMessage(text)
}

export async function sendGoalCancelledNotification(goal: GoalInfo): Promise<void> {
  if (goal.isPostMatch) {
    const dateStr = new Date(goal.matchTime).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })

    const text = `📝 <b>SKOR GÜNCELLEMESİ</b> (${dateStr})

<b>${goal.scorerName}</b>'in golü maç sonrası silindi.

${formatScore(goal)}`

    await sendMessage(text)
    return
  }

  const text = `❌ <b>GOL İPTAL!</b>

<b>${goal.scorerName}</b>'in golü iptal edildi!

${formatScore(goal)}`

  await sendMessage(text)
}

interface MvpInfo {
  playerName: string
  matchTitle: string
  homeTeamName: string
  awayTeamName: string
  homeScore: number
  awayScore: number
}

export async function sendMvpNotification(info: MvpInfo): Promise<void> {
  const text = `👑 <b>MAÇIN ADAMI SEÇİLDİ!</b>

<b>${info.matchTitle}</b>
${formatScore(info)}

Bu maçın yıldızı: 🌟 <b>${info.playerName}</b> 🌟

Sahada fark yarattı, herkesi büyüledi! Helal olsun! 👏`

  await sendMessage(text)
}

interface JerseyGoalInfo extends MvpInfo {
  losingTeamName: string
}

export async function sendJerseyGoalNotification(info: JerseyGoalInfo): Promise<void> {
  const text = `👕 <b>FORMA GOLÜ ATILDI!</b>

<b>${info.matchTitle}</b>
${formatScore(info)}

🎯 <b>${info.playerName}</b> forma golünü attı!

<b>${info.losingTeamName}</b> forma giyecek! 💀`

  await sendMessage(text)
}

interface CommentInfo {
  username: string
  content: string
  matchTitle: string
}

export async function sendCommentNotification(info: CommentInfo): Promise<void> {
  const text = `\u{1F4AC} <b>Yeni Yorum</b> \u2014 ${info.matchTitle}

<b>${info.username}</b> yazd\u0131:
<i>"${info.content}"</i>`

  await sendMessage(text)
}
