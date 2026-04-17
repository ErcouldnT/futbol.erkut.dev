<script lang='ts'>
  import type { LineupExpand, MatchExpand } from '$lib/types'
  import { invalidateAll } from '$app/navigation'
  import { onMount } from 'svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'

  const { match }: { match: MatchExpand } = $props()

  let lineupHomeTeam: LineupExpand[] = $state([])
  let lineupAwayTeam: LineupExpand[] = $state([])
  let loading = $state(true)

  const homeTeamId = $derived(match.homeTeamId)
  const awayTeamId = $derived(match.awayTeamId)

  async function loadLineups() {
    loading = true
    try {
      const resHome = await fetch(`/api/lineups?matchId=${match.id}&teamId=${homeTeamId}`)
      const dataLineupHomeTeam = await resHome.json()
      lineupHomeTeam = sortPlayersAlphabetically([...dataLineupHomeTeam])

      const resAway = await fetch(`/api/lineups?matchId=${match.id}&teamId=${awayTeamId}`)
      const dataLineupAwayTeam = await resAway.json()
      lineupAwayTeam = sortPlayersAlphabetically([...dataLineupAwayTeam])
    }
    finally {
      loading = false
    }
  }

  onMount(async () => {
    loadLineups()
  })

  // sort players alphabetically
  function sortPlayersAlphabetically(players: LineupExpand[]) {
    return players.sort((a, b) => a.player.name.localeCompare(b.player.name, 'tr-TR'))
  }

  async function updateGoals(lineupId: string, teamId: string, type: 'increment' | 'decrement') {
    const res = await fetch('/api/lineups', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: lineupId,
        matchId: match.id,
        teamId,
        type,
      }),
    })

    if (res.ok) {
      await loadLineups()
      await invalidateAll()
    }
  }
</script>

{#if loading && lineupHomeTeam.length === 0}
  <div class='flex items-center justify-center py-20'>
    <LoadingSpinner text='İstatistikler Yükleniyor...' size='lg' />
  </div>
{:else}
  <main class='grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:gap-12 relative'>
    {#if loading}
      <div class='absolute inset-0 z-50 flex items-center justify-center bg-base-100/20 backdrop-blur-[2px] rounded-3xl'>
        <LoadingSpinner size='md' />
      </div>
    {/if}
    <!-- Ev Sahibi Takım -->
    <div class='flex flex-col gap-4'>
      <div class='flex items-center justify-between border-b border-primary/20 pb-2'>
        <h3 class='text-sm font-black tracking-widest text-primary'>{match.homeTeam?.name}</h3>
        <span class='text-[10px] font-medium opacity-40'>OYUNCULAR</span>
      </div>
      <div class='flex flex-col gap-3'>
        {#each lineupHomeTeam as playerData (playerData.player.id)}
          <div class='flex items-center justify-between rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10 group/row'>
            <div class='flex items-center gap-3'>
              <div class='h-1.5 w-1.5 rounded-full bg-primary/60 group-hover/row:scale-150 transition-transform'></div>
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

              <div class='flex items-center gap-1'>
                <button
                  onclick={() => updateGoals(playerData.id, homeTeamId, 'increment')}
                  oncontextmenu={(e) => {
                    e.preventDefault()
                    updateGoals(playerData.id, homeTeamId, 'decrement')
                  }}
                  class="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-bold transition-all hover:border-primary/50 hover:bg-primary/20 hover:scale-105 active:scale-95
                    {playerData.goals > 0 ? 'text-white border-primary/30 bg-primary/10' : 'text-white/20'}"
                  title='Tıkla: +1 Artır, Sağ Tık: -1 Azalt'
                >
                  <span class={playerData.goals > 0 ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'grayscale opacity-50'}>⚽</span>
                  {#if playerData.goals > 0}
                    <span class='text-primary'>x{playerData.goals}</span>
                  {/if}
                </button>
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
          <div class='flex items-center justify-between rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10 group/row'>
            <div class='flex items-center gap-3'>
              <div class='h-1.5 w-1.5 rounded-full bg-secondary/60 group-hover/row:scale-150 transition-transform'></div>
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

              <div class='flex items-center gap-1'>
                <button
                  onclick={() => updateGoals(playerData.id, awayTeamId, 'increment')}
                  oncontextmenu={(e) => {
                    e.preventDefault()
                    updateGoals(playerData.id, awayTeamId, 'decrement')
                  }}
                  class="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-xs font-bold transition-all hover:border-secondary/50 hover:bg-secondary/20 hover:scale-105 active:scale-95
                    {playerData.goals > 0 ? 'text-white border-secondary/30 bg-secondary/10' : 'text-white/20'}"
                  title='Tıkla: +1 Artır, Sağ Tık: -1 Azalt'
                >
                  <span class={playerData.goals > 0 ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'grayscale opacity-50'}>⚽</span>
                  {#if playerData.goals > 0}
                    <span class='text-secondary'>x{playerData.goals}</span>
                  {/if}
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>
{/if}
