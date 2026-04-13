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

<main class='grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:gap-12'>
  <!-- Ev Sahibi Takım -->
  <div class='flex flex-col gap-4'>
    <div class='flex items-center justify-between border-b border-primary/20 pb-2'>
      <h3 class='text-sm font-black tracking-widest text-primary'>{match.homeTeam?.name}</h3>
      <span class='text-[10px] font-medium opacity-40'>OYUNCULAR</span>
    </div>
    <div class='flex flex-col gap-3'>
      {#each lineupHomeTeam as playerData (playerData.player.id)}
        <div class='flex items-center justify-between rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10'>
          <div class='flex items-center gap-3'>
            <div class='h-1.5 w-1.5 rounded-full bg-primary/60'></div>
            <span class='text-sm font-semibold text-white/90'>
              {playerData.player.name}
              {#if playerData.player.name === match.mvp?.name}
                <span class='ml-1 text-xs' title='Maçın Adamı'>👑</span>
              {/if}
            </span>
          </div>
          <div class='flex items-center gap-2'>
            {#if playerData.player.name === match.jerseyGoal?.name}
              <span class='text-xs' title='Forma Golü'>👕</span>
            {/if}
            <div class='flex gap-0.5'>
              {#each Array.from({ length: playerData.goals }) as _}
                <span class='text-xs drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'>⚽</span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Deplasman Takımı -->
  <div class='flex flex-col gap-4'>
    <div class='flex items-center justify-between border-b border-secondary/20 pb-2'>
      <h3 class='text-sm font-black tracking-widest text-secondary'>{match.awayTeam?.name}</h3>
      <span class='text-[10px] font-medium opacity-40'>OYUNCULAR</span>
    </div>
    <div class='flex flex-col gap-3'>
      {#each lineupAwayTeam as playerData (playerData.player.id)}
        <div class='flex items-center justify-between rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10'>
          <div class='flex items-center gap-3'>
            <div class='h-1.5 w-1.5 rounded-full bg-secondary/60'></div>
            <span class='text-sm font-semibold text-white/90'>
              {playerData.player.name}
              {#if playerData.player.name === match.mvp?.name}
                <span class='ml-1 text-xs' title='Maçın Adamı'>👑</span>
              {/if}
            </span>
          </div>
          <div class='flex items-center gap-2'>
            {#if playerData.player.name === match.jerseyGoal?.name}
              <span class='text-xs' title='Forma Golü'>👕</span>
            {/if}
            <div class='flex gap-0.5'>
              {#each Array.from({ length: playerData.goals }) as _}
                <span class='text-xs drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'>⚽</span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>
