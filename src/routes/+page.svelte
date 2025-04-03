<script lang="ts">
	import { supabase } from "$lib/supabase";
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
	import MatchCard from "$lib/components/MatchCard.svelte";
	import type { MatchWithTeams } from "$lib/types";

	let isLoading = true;
	let allMatches: MatchWithTeams[] = [];

	const getMatches = async () => {
		const { data, error } = await supabase.from("matches").select(`
    *,
    mvp: players!matches_mvp_fkey(*),
    jersey_goal: players!matches_jersey_goal_fkey(*),
    team_1: teams!matches_team_1_fkey(*, lineup:lineups(*, player:players(*))),
    team_2: teams!matches_team_2_fkey(*, lineup:lineups(*, player:players(*)))
  `);
		if (error) {
			console.error("Database error:", error);
		}

		// listeyi tersine çevir, son oynanan maç en üstte olacak
		allMatches = data?.reverse() || [];
		isLoading = false;
	};

	getMatches();

	// todo: aşağıdaki if block yerine async await kullanarak veri çekme işlemini gerçekleştir
</script>

<div class="flex flex-col items-center gap-6 px-4 sm:px-8 lg:px-31">
	{#if isLoading}
		<LoadingSpinner />
	{:else}
		{#each allMatches as match, index (match.id)}
			<MatchCard {match} index={allMatches.length - index - 1} lastMatch={index === 0} />
		{/each}
	{/if}
</div>
