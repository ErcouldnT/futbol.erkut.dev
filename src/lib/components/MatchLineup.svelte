<script lang='ts'>
  import type { LineupExpand, MatchExpand } from '$lib/types'
  import { onMount } from 'svelte'

  import LoadingSpinner from './LoadingSpinner.svelte'
  import SahaSvg from './SahaSvg.svelte'

  const { match }: { match: MatchExpand } = $props()

  const matchId = $derived(match.id)
  const homeTeamId = $derived(match.homeTeamId)
  const awayTeamId = $derived(match.awayTeamId)

  let homeTeamLineups: LineupExpand[] = $state([])
  let awayTeamLineups: LineupExpand[] = $state([])
  let loading = $state(true)

  onMount(async () => {
    try {
      const resHome = await fetch(`/api/lineups?matchId=${matchId}&teamId=${homeTeamId}`)
      homeTeamLineups = await resHome.json()

      const resAway = await fetch(`/api/lineups?matchId=${matchId}&teamId=${awayTeamId}`)
      awayTeamLineups = await resAway.json()
    }
    catch (err) {
      console.error('Kadro yüklenirken hata oluştu:', err)
    }
    finally {
      loading = false
    }
  })
</script>

<main class='flex items-center justify-center p-5'>
  {#if loading}
    <LoadingSpinner text='Kadro Yükleniyor...' size='lg' />
  {:else}
    <SahaSvg
      playersHome={homeTeamLineups}
      playersAway={awayTeamLineups}
      saha='HORIZONTAL'
      mvpId={match.mvpId || ''}
      jerseyGoalId={match.jerseyGoalId || ''}
    />
  {/if}
</main>
