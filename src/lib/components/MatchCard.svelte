<script lang='ts'>
  import type { MatchExpand } from '$lib/types'
  import { enhance } from '$app/forms'
  import { Calendar, ChevronDown, Clock, Trash2, Trophy } from '@lucide/svelte'
  import { onMount } from 'svelte'

  import TabMenu from './TabMenu.svelte'

  const {
    match,
    lastMatch = false,
  }: {
    match: MatchExpand
    lastMatch?: boolean
  } = $props()
  let isExpanded = $state(false)

  onMount(() => {
    if (lastMatch)
      isExpanded = true
  })

  const matchStartingTime = $derived(new Date(match.matchTime || ''))
  const matchEndingTime = $derived(new Date(matchStartingTime.getTime() + match.duration * 60 * 1000))
  const now = new Date()

  // match status
  const notStarted = $derived(now < matchStartingTime)
  const playing = $derived(now > matchStartingTime && now < matchEndingTime)

  const toggleAccordion = () => {
    isExpanded = !isExpanded
  }

  function formatMatchTime(matchTime: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0')

    const startHours = pad(matchTime.getHours())
    const startMinutes = pad(matchTime.getMinutes())

    const endTime = new Date(matchTime)
    endTime.setMinutes(endTime.getMinutes() + match.duration)

    const endHours = pad(endTime.getHours())
    const endMinutes = pad(endTime.getMinutes())

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`
  }

  // Pre-calculate scorers to avoid expensive filter/sort on every render
  const homeScorers = $derived(
    match.lineups
      ?.filter(l => l.teamId === match.homeTeamId && l.goals > 0)
      .sort((a, b) => b.goals - a.goals) || [],
  )

  const awayScorers = $derived(
    match.lineups
      ?.filter(l => l.teamId === match.awayTeamId && l.goals > 0)
      .sort((a, b) => b.goals - a.goals) || [],
  )
</script>

<div
  class="group relative w-full overflow-hidden rounded-3xl border border-white/5 bg-linear-to-br from-base-200/80 to-base-300/80 p-px shadow-2xl transition-all duration-500 hover:shadow-primary/10
    {isExpanded ? 'ring-1 ring-primary/30' : ''}"
  style='will-change: transform;'
>
  <div class='relative overflow-hidden rounded-[23px] bg-base-200/40 backdrop-blur-lg'>
    <!-- Header Decor -->
    <div class='absolute inset-x-0 top-0 h-32 bg-linear-to-b from-primary/5 to-transparent pointer-events-none'></div>

    <main class='relative z-10 p-4 sm:p-8'>
      <div class='group/header'>
        <div class='flex flex-col gap-6'>
          <!-- Title & Date -->
          <div class='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div class='flex items-center gap-3'>
              <div class='rounded-full bg-primary/10 p-2 text-primary'>
                <Trophy size={20} />
              </div>
              <h2 class='text-lg font-bold tracking-tight sm:text-2xl bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent'>
                {match.title || 'Haftalık Maç'}
              </h2>
            </div>

            <div class='flex items-center gap-4 text-xs font-medium opacity-60 sm:text-sm'>
              <div class='flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1'>
                <Calendar size={14} />
                <span>
                  {new Date(match.matchTime).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                  })}
                </span>
              </div>
              <div class='flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1'>
                <Clock size={14} />
                <span>{formatMatchTime(new Date(match.matchTime))}</span>
              </div>

              <!-- Delete Button -->
              <form
                action='/?/deleteMatch'
                method='POST'
                use:enhance={({ cancel }) => {
                  // eslint-disable-next-line no-alert
                  if (!confirm('Bu maçı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
                    cancel()
                    return
                  }
                  return async ({ result, update }) => {
                    if (result.type === 'error') {
                      // eslint-disable-next-line no-alert
                      alert(result.error.message)
                    }
                    await update()
                  }
                }}
                class='ml-2'
              >
                <input type='hidden' name='id' value={match.id} />
                <button
                  type='submit'
                  class='flex items-center justify-center rounded-full bg-error/10 p-2 text-error transition-all hover:bg-error hover:text-white'
                  title='Maçı Sil'
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </div>
          </div>

          <!-- Scoreboard -->
          <div class='relative flex items-center justify-between gap-4 py-4 sm:gap-8'>
            <!-- Background Glows -->
            <div class='absolute inset-0 flex items-center justify-center opacity-20 blur-[80px] pointer-events-none'>
              <div class='h-32 w-32 rounded-full bg-primary'></div>
              <div class='h-32 w-32 rounded-full bg-secondary ml-[-40px]'></div>
            </div>

            <!-- Home Team -->
            <div class='flex flex-1 flex-col items-end gap-2'>
              <div class='group/logo relative h-12 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-px shadow-2xl sm:h-16 transition-transform hover:scale-105'>
                <div class='absolute inset-0 bg-linear-to-br from-primary/20 to-transparent'></div>
                <div class='relative flex h-full items-center justify-center rounded-[11px] bg-base-300/40 px-4 sm:px-6 backdrop-blur-md'>
                  <span class='text-sm font-black text-primary sm:text-xl drop-shadow-[0_0_12px_rgba(var(--primary),0.5)] whitespace-nowrap tracking-wider'>
                    {match.homeTeam?.name}
                  </span>
                </div>
              </div>

              <!-- Scorers Summary -->
              <div class='flex flex-col items-end opacity-40'>
                {#each homeScorers as scorer}
                  <div class='flex items-center gap-1 text-[10px] font-medium sm:text-xs'>
                    <span>{scorer.player.name}</span>
                    <div class='flex gap-0.5 leading-none'>
                      {#each Array.from({ length: scorer.goals }) as _}
                        <span>⚽</span>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Score -->
            <div class='relative flex flex-col items-center gap-2'>
              <div class='flex items-center gap-4 rounded-4xl border border-white/10 bg-linear-to-b from-white/10 to-transparent px-8 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md'>
                <span class='text-4xl font-black tabular-nums text-white sm:text-6xl'>{match.homeScore}</span>
                <div class='h-8 w-px bg-white/10 sm:h-12'></div>
                <span class='text-4xl font-black tabular-nums text-white sm:text-6xl'>{match.awayScore}</span>
              </div>

              <div class='absolute -bottom-3 flex translate-y-1/2 items-center gap-2 rounded-full border border-white/10 bg-base-300/80 px-4 py-1.5 shadow-xl backdrop-blur-xl'>
                {#if notStarted}
                  <span class='flex h-2 w-2 rounded-full bg-warning shadow-[0_0_8px_rgba(var(--warning),0.5)]'></span>
                  <span class='text-[10px] uppercase tracking-widest text-warning font-black'>Bekleniyor</span>
                {:else if playing}
                  <span class='relative flex h-2 w-2'>
                    <span class='absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75'></span>
                    <span class='relative inline-flex h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(var(--success),0.5)]'></span>
                  </span>
                  <span class='text-[10px] uppercase tracking-widest text-success font-black'>Canlı</span>
                {:else}
                  <span class='text-[10px] uppercase tracking-widest opacity-40 font-black'>Bitti</span>
                {/if}
              </div>
            </div>

            <!-- Away Team -->
            <div class='flex flex-1 flex-col items-start gap-2'>
              <div class='group/logo relative h-12 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-px shadow-2xl sm:h-16 transition-transform hover:scale-105'>
                <div class='absolute inset-0 bg-linear-to-br from-secondary/20 to-transparent'></div>
                <div class='relative flex h-full items-center justify-center rounded-[11px] bg-base-300/40 px-4 sm:px-6 backdrop-blur-md'>
                  <span class='text-sm font-black text-secondary sm:text-xl drop-shadow-[0_0_12px_rgba(var(--secondary),0.5)] whitespace-nowrap tracking-wider'>
                    {match.awayTeam?.name}
                  </span>
                </div>
              </div>

              <!-- Scorers Summary -->
              <div class='flex flex-col items-start opacity-40'>
                {#each awayScorers as scorer}
                  <div class='flex items-center gap-1 text-[10px] font-medium sm:text-xs'>
                    <div class='flex gap-0.5 leading-none'>
                      {#each Array.from({ length: scorer.goals }) as _}
                        <span>⚽</span>
                      {/each}
                    </div>
                    <span>{scorer.player.name}</span>
                  </div>
                {/each}
              </div>
            </div>
          </div>

          <!-- Interaction Footer -->
          <div class='flex items-center justify-center pt-2'>
            <button
              onclick={toggleAccordion}
              class='flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:bg-primary hover:text-white'
            >
              Maç Detayları
              <ChevronDown size={16} class="transition-transform duration-500 {isExpanded ? 'rotate-180' : ''}" />
            </button>
          </div>
        </div>
      </div>

      <!-- Expandable Area -->
      {#if isExpanded}
        <div class='mt-6 border-t border-white/5 pt-6 animate-in fade-in slide-in-from-top-4 duration-500'>
          <TabMenu {match} />
        </div>
      {/if}
    </main>
  </div>
</div>
