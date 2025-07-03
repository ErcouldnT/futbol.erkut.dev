<script lang="ts">
	import type { MatchExpand } from "$lib/types";
	import { onMount } from "svelte";
	import { pb } from "$lib/pb";

	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import MatchCard from "$lib/components/MatchCard.svelte";

	let isLoading = true;
	let allMatches: MatchExpand[] = [];

	const getMatches = async () => {
		try {
			// todo: APPROVED = true olanları çek
			const data = await pb.collection<MatchExpand>("matches").getFullList({
				sort: "-match_time", // en son eklenen en üstte
				expand: "home_team,away_team,mvp,jersey_goal"
			});

			allMatches = [...data];
		} catch (error) {
			// console.error("PocketBase error:", error.message);
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		getMatches();
	});
</script>

<svelte:head>
	<title>Akkuyu Futbol</title>
</svelte:head>

<div class="flex flex-col items-center gap-5">
	{#if isLoading}
		<LoadingSpinner />
	{:else}
		{#each allMatches as match, index (match.id)}
			<MatchCard {match} index={allMatches.length - index - 1} lastMatch={index === 0} />
		{/each}
	{/if}
</div>
