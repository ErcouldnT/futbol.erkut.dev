<script lang="ts">
	import type { MatchWithTeams } from "$lib/types";
	import SahaSvg from "./SahaSvg.svelte";

	export let match: MatchWithTeams;

	const playersHome = match.team_1.lineup;
	const playersAway = match.team_2.lineup;
</script>

<main class="flex max-h-full items-center justify-center p-5 lg:max-h-120">
	<SahaSvg {playersHome} {playersAway} showRatings={true} saha="HORIZONTAL" />
</main>
