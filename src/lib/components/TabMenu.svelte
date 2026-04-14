<script lang='ts'>
  import type { MatchExpand } from '$lib/types'

  import Comments from './Comments.svelte'
  import MatchLineup from './MatchLineup.svelte'
  import TeamInfo from './TeamInfo.svelte'

  const { match, defaultTab = 'LINEUP' } = $props<{
    match: MatchExpand
    defaultTab?: 'LINEUP' | 'COMMENTS'
  }>()

  let activeTab: 'LINEUP' | 'COMMENTS' = $state('LINEUP')

  $effect.pre(() => {
    activeTab = defaultTab
  })

  const setActiveTab = (tab: 'LINEUP' | 'COMMENTS') => {
    activeTab = tab
  }
</script>

<main class='mt-8 flex flex-col gap-6'>
  <div class='relative mx-auto flex w-fit items-center rounded-2xl bg-white/5 p-1 backdrop-blur-md border border-white/10'>
    <div
      class='absolute h-[calc(100%-8px)] rounded-xl bg-primary transition-all duration-300 ease-out shadow-[0_0_20px_rgba(var(--primary),0.3)]'
      style="width: {activeTab === 'LINEUP' ? '160px' : '120px'}; left: {activeTab === 'LINEUP' ? '4px' : '164px'}"
    ></div>

    <button
      onclick={() => setActiveTab('LINEUP')}
      class="relative z-10 flex h-10 w-[160px] items-center justify-center text-sm font-bold transition-colors duration-300 {activeTab === 'LINEUP' ? 'text-primary-content' : 'text-white/40 hover:text-white/60'}"
    >
      Kadrolar
    </button>
    <button
      onclick={() => setActiveTab('COMMENTS')}
      class="relative z-10 flex h-10 w-[120px] items-center justify-center text-sm font-bold transition-colors duration-300 {activeTab === 'COMMENTS' ? 'text-primary-content' : 'text-white/40 hover:text-white/60'}"
    >
      Yorumlar
    </button>
  </div>

  {#if activeTab === 'LINEUP'}
    <div class='flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <MatchLineup {match} />

      <div class='divider opacity-10'>İstatistikler</div>

      <TeamInfo {match} />

      <div class='flex justify-end p-2 px-4 shadow-inner rounded-xl bg-base-300/20'>
        <div class='grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-medium opacity-60 sm:text-xs'>
          <p class='flex items-center gap-1'>👕 <span class='hidden sm:inline'>Forma golü</span></p>
          <p class='flex items-center gap-1'>👑 <span class='hidden sm:inline'>Maçın adamı</span></p>
        </div>
      </div>
    </div>
  {/if}

  {#if activeTab === 'COMMENTS'}
    <div class='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <Comments matchId={match.id} />
    </div>
  {/if}
</main>
