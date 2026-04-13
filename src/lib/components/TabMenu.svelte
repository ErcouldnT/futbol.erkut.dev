<script lang='ts'>
  import type { MatchExpand } from '$lib/types'

  import Comments from './Comments.svelte'
  import MatchLineup from './MatchLineup.svelte'
  import TeamInfo from './TeamInfo.svelte'

  const { match }: { match: MatchExpand } = $props()

  let activeTab: 'PLAYERS' | 'LINEUP' | 'COMMENTS' = $state('PLAYERS')

  const setActiveTab = (tab: 'PLAYERS' | 'LINEUP' | 'COMMENTS') => {
    activeTab = tab
  }
</script>

<!-- •  Goller ve kadro arasında geçiş yapmayı sağlayan sekmeleri göstermek.
  •  Seçilen sekmeye göre ilgili içeriği görüntülemek. -->

<main>
  <div class='flex items-center justify-center gap-5 opacity-50'>
    <button onclick={() => setActiveTab('PLAYERS')} class='btn btn-sm'>Oyuncular</button>
    <button onclick={() => setActiveTab('LINEUP')} class='btn btn-sm'>Kadrolar</button>
    <button onclick={() => setActiveTab('COMMENTS')} class='btn btn-sm'>Yorumlar</button>
  </div>

  {#if activeTab === 'PLAYERS'}
    <TeamInfo {match} />
    <div class='flex justify-end'>
      <div
        class='grid max-w-3xs grid-cols-1 items-center justify-items-end text-xs font-thin opacity-50'
      >
        <p>Forma golü: 👕</p>
        <p>Maçın adamı: 👑</p>
      </div>
    </div>
  {/if}

  {#if activeTab === 'LINEUP'}
    <MatchLineup {match} />
  {/if}

  {#if activeTab === 'COMMENTS'}
    <Comments matchId={match.id} />
  {/if}
</main>
