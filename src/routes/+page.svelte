<script lang="ts">
	import type { MatchWithTeams } from "$lib/types";
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabase";
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import MatchCard from "$lib/components/MatchCard.svelte";

	let isLoading = true;
	let allMatches: MatchWithTeams[] = [];

	const getMatches = async () => {
		const { data, error } = await supabase
			.from("matches")
			.select(
				`
				*,
				mvp: players!matches_mvp_fkey(*),
				jersey_goal: players!matches_jersey_goal_fkey(*),
				team_1: teams!matches_team_1_fkey(*, lineup:lineups(*, player:players(*))),
				team_2: teams!matches_team_2_fkey(*, lineup:lineups(*, player:players(*)))
			`
			)
			.order("created_at", { ascending: true });
		if (error) {
			console.error("Database error:", error);
		}

		// listeyi tersine çevir, son oynanan maç en üstte olacak
		allMatches = data?.reverse() || [];
		isLoading = false;
	};

	onMount(() => {
		getMatches();

		const channel = supabase
			.channel("custom:matches-realtime")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "matches"
				},
				() => {
					getMatches();
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	});

	// todo: aşağıdaki if block yerine async await kullanarak veri çekme işlemini gerçekleştir
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
