<script lang='ts'>
  import type { LineupExpand, Match } from '$lib/types'
  import { onMount } from 'svelte'

  import SahaSvg from './SahaSvg.svelte'

  const { match }: { match: Match } = $props()

  const matchId = $derived(match.id)
  const homeTeamId = $derived(match.homeTeamId)
  const awayTeamId = $derived(match.awayTeamId)

  let homeTeamLineups: LineupExpand[] = $state([])
  let awayTeamLineups: LineupExpand[] = $state([])

  onMount(async () => {
    try {
      const resHome = await fetch(`/api/lineups?matchId=${matchId}&teamId=${homeTeamId}`)
      homeTeamLineups = await resHome.json()

      const resAway = await fetch(`/api/lineups?matchId=${matchId}&teamId=${awayTeamId}`)
      awayTeamLineups = await resAway.json()
    }
    catch {
    // console.error("Lineups çekilemedi");
    }
  })

  const matchStartingTime = $derived(new Date(match.matchTime || ''))
  const matchEndingTime = $derived(new Date(matchStartingTime.getTime() + 60 * 60 * 1000)) // +1 hour
  const votingEndTime = $derived(new Date(matchEndingTime.getTime() + 24 * 60 * 60 * 1000)) // +24 hours
  const now = new Date()

  const votingEnded = $derived(now > votingEndTime)
</script>

<main class='flex max-h-full items-center justify-center p-5 lg:max-h-120'>
  <SahaSvg
    playersHome={homeTeamLineups}
    playersAway={awayTeamLineups}
    showRatings={votingEnded}
    saha='HORIZONTAL'
  />
</main>
