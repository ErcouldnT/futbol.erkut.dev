<script lang='ts'>
  import type { PageData } from './$types'

  import MatchCard from '$lib/components/MatchCard.svelte'

  const { data } = $props<{ data: PageData }>()
  const allMatches = $derived(data.matches)
</script>

<svelte:head>
  <title>Akkuyu Futbol</title>
</svelte:head>

<div class='flex flex-col items-center gap-5'>
  {#each allMatches as match, index (match.id)}
    <MatchCard {match} lastMatch={index === 0} />
  {/each}
</div>
