<script lang='ts'>
  import type { LineupExpand, MatchExpand } from '$lib/types'
  import { invalidateAll } from '$app/navigation'
  import { onMount } from 'svelte'

  import Comments from './Comments.svelte'
  import MatchLineup from './MatchLineup.svelte'
  import TeamInfo from './TeamInfo.svelte'

  const { match, defaultTab = 'STATS' } = $props<{
    match: MatchExpand
    defaultTab?: 'STATS' | 'LINEUP' | 'COMMENTS'
  }>()

  type Tab = 'STATS' | 'LINEUP' | 'COMMENTS'

  const tabs: { id: Tab, label: string }[] = [
    { id: 'STATS', label: 'İstatistikler' },
    { id: 'LINEUP', label: 'Kadrolar' },
    { id: 'COMMENTS', label: 'Yorumlar' },
  ]

  let activeTab: Tab = $state('STATS')

  $effect.pre(() => {
    activeTab = defaultTab
  })

  // All lineups for player selection
  let allLineups: LineupExpand[] = $state([])

  async function loadAllLineups() {
    try {
      const res = await fetch(`/api/lineups?matchId=${match.id}`)
      allLineups = await res.json()
    }
    catch {
    // ignore
    }
  }

  onMount(() => {
    loadAllLineups()
  })

  // Key to force re-render of MatchLineup when data changes
  let lineupKey = $state(0)

  // Selecting mode
  let selectingMode: 'mvp' | 'jerseyGoal' | null = $state(null)

  async function selectPlayer(playerId: string) {
    if (!selectingMode)
      return

    const body: Record<string, string> = { id: match.id }
    if (selectingMode === 'mvp')
      body.mvpId = playerId
    else
      body.jerseyGoalId = playerId

    await fetch('/api/matches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    selectingMode = null
    await invalidateAll()
    await loadAllLineups()
    lineupKey++
  }

  async function clearSelection(type: 'mvp' | 'jerseyGoal') {
    const body: Record<string, string> = { id: match.id }
    if (type === 'mvp')
      body.mvpId = ''
    else
      body.jerseyGoalId = ''

    await fetch('/api/matches', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    await invalidateAll()
    lineupKey++
  }

  function handleTeamInfoUpdate() {
    lineupKey++
    loadAllLineups()
  }

  // Tab indicator positioning
  const tabIndex = $derived(tabs.findIndex(t => t.id === activeTab))
</script>

<main class='mt-8 flex flex-col gap-6'>
  <div class='relative mx-auto flex w-fit items-center rounded-2xl bg-white/5 p-1 backdrop-blur-md border border-white/10'>
    <div
      class='absolute h-[calc(100%-8px)] rounded-xl bg-primary transition-all duration-300 ease-out shadow-[0_0_20px_rgba(var(--primary),0.3)]'
      style='width: calc(100% / 3 - 4px); left: calc({tabIndex} * 100% / 3 + 4px)'
    ></div>

    {#each tabs as tab}
      <button
        onclick={() => (activeTab = tab.id)}
        class="relative z-10 flex h-10 w-[100px] items-center justify-center text-xs font-bold transition-colors duration-300 sm:w-[120px] sm:text-sm
          {activeTab === tab.id ? 'text-primary-content' : 'text-white/40 hover:text-white/60'}"
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#if activeTab === 'STATS'}
    <div class='flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <TeamInfo {match} onUpdate={handleTeamInfoUpdate} />

      <!-- Forma Golü & Maçın Adamı Seçim -->
      <div class='flex flex-col gap-3 p-2 px-4'>
        {#if selectingMode}
          <div class='rounded-2xl border border-warning/20 bg-warning/5 p-4'>
            <p class='text-xs font-bold text-warning mb-3 uppercase tracking-widest'>
              {selectingMode === 'mvp' ? '👑 Maçın Adamını Seç' : '👕 Forma Golünü Seç'}
            </p>
            <div class='flex flex-wrap gap-2'>
              {#each allLineups as lineup (lineup.id)}
                <button
                  onclick={() => selectPlayer(lineup.playerId)}
                  class='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-primary/20 hover:border-primary/30 active:scale-95'
                >
                  {lineup.player.name}
                </button>
              {/each}
            </div>
            <button
              onclick={() => selectingMode = null}
              class='mt-3 text-[10px] font-bold text-white/30 uppercase tracking-widest hover:text-white/60'
            >
              İptal
            </button>
          </div>
        {:else}
          <div class='flex flex-wrap items-center gap-2'>
            <button
              onclick={() => selectingMode = 'jerseyGoal'}
              class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95
                {match.jerseyGoal ? 'border-primary/30 bg-primary/10 text-white' : 'border-white/10 bg-white/5 text-white/50'}"
            >
              👕
              <span>{match.jerseyGoal?.name || 'Forma Golü Seç'}</span>
            </button>
            {#if match.jerseyGoal}
              <button
                onclick={() => clearSelection('jerseyGoal')}
                class='text-[10px] text-error/60 hover:text-error'
              >
                Kaldır
              </button>
            {/if}

            <button
              onclick={() => selectingMode = 'mvp'}
              class="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all hover:scale-105 active:scale-95
                {match.mvp ? 'border-warning/30 bg-warning/10 text-white' : 'border-white/10 bg-white/5 text-white/50'}"
            >
              👑
              <span>{match.mvp?.name || 'Maçın Adamı Seç'}</span>
            </button>
            {#if match.mvp}
              <button
                onclick={() => clearSelection('mvp')}
                class='text-[10px] text-error/60 hover:text-error'
              >
                Kaldır
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if activeTab === 'LINEUP'}
    <div class='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      {#key lineupKey}
        <MatchLineup {match} />
      {/key}
    </div>
  {/if}

  {#if activeTab === 'COMMENTS'}
    <div class='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <Comments matchId={match.id} />
    </div>
  {/if}
</main>
