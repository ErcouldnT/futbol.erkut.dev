<script lang='ts'>
  import type { LineupExpand, MatchExpand } from '$lib/types'
  import { onMount } from 'svelte'

  const { match }: { match: MatchExpand } = $props()

  let lineupHomeTeam: LineupExpand[] = $state([])
  let lineupAwayTeam: LineupExpand[] = $state([])

  const homeTeamId = $derived(match.homeTeamId)
  const awayTeamId = $derived(match.awayTeamId)

  async function loadLineups() {
    const resHome = await fetch(`/api/lineups?matchId=${match.id}&teamId=${homeTeamId}`)
    const dataLineupHomeTeam = await resHome.json()
    lineupHomeTeam = sortPlayersByGoals([...dataLineupHomeTeam])

    const resAway = await fetch(`/api/lineups?matchId=${match.id}&teamId=${awayTeamId}`)
    const dataLineupAwayTeam = await resAway.json()
    lineupAwayTeam = sortPlayersByGoals([...dataLineupAwayTeam])
  }

  onMount(async () => {
    loadLineups()
  })

  // sort players by goals scored (from most to least)
  function sortPlayersByGoals(players: LineupExpand[]) {
    return players.sort((a, b) => b.goals - a.goals)
  }
</script>

<main class='grid grid-cols-1 gap-5 p-2 sm:grid-cols-2 sm:gap-5'>
  <div class='grid grid-cols-2'>
    {#each lineupHomeTeam as playerData (playerData.player.id)}
      <div class='text-primary'>
        {playerData.player.name}
        <span>{playerData.player.name === match.mvp?.name ? '👑' : ''}</span>
      </div>
      <div class='flex flex-row'>
        <p>{playerData.player.name === match.jerseyGoal?.name ? '👕' : ''}</p>
        <p>{'⚽'.repeat(playerData.goals)}</p>
      </div>
    {/each}
  </div>
  <!-- <div class="divider divider-horizontal"></div> -->
  <div class='grid grid-cols-2'>
    {#each lineupAwayTeam as playerData (playerData.player.id)}
      <div class='text-secondary'>
        {playerData.player.name}
        <span>{playerData.player.name === match.mvp?.name ? '👑' : ''}</span>
      </div>
      <div class='flex flex-row'>
        <p>{playerData.player.name === match.jerseyGoal?.name ? '👕' : ''}</p>
        <p>{'⚽'.repeat(playerData.goals)}</p>
      </div>
    {/each}
  </div>
</main>
