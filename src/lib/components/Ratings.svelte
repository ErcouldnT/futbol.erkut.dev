<script lang="ts">
	import type { MatchWithTeams } from "$lib/types";
	import SahaSvg from "./SahaSvg.svelte";

	export let match: MatchWithTeams;

	const matchStartingTime = new Date(match.match_time || "");
	const matchEndingTime = new Date(matchStartingTime.getTime() + 60 * 60 * 1000); // +1 hour
	const votingEndTime = new Date(matchEndingTime.getTime() + 24 * 60 * 60 * 1000); // +24 hours
	const now = new Date();

	const votingEnded = now > votingEndTime;

	const playersHome = match.team_1.lineup;
	const playersAway = match.team_2.lineup;
</script>

<main class="flex max-h-full items-center justify-center p-5 lg:max-h-120">
	<SahaSvg {playersHome} {playersAway} showRatings={votingEnded} saha="HORIZONTAL" />
</main>
