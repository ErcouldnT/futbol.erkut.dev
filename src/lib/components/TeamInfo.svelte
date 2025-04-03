<script lang="ts">
	import type { MatchWithTeams, PlayerWithXAndY } from "$lib/types";

	export let match: MatchWithTeams;

	const lineupHomeTeam = sortPlayersByGoals(match.team_1.lineup);
	const lineupAwayTeam = sortPlayersByGoals(match.team_2.lineup);

	// sort players by goals scored (from most to least)
	function sortPlayersByGoals(players: PlayerWithXAndY[]) {
		return players.sort((a, b) => b.goals - a.goals);
	}
</script>

<main class="grid grid-cols-1 gap-5 p-2 sm:grid-cols-2 sm:gap-5">
	<div class="grid grid-cols-2">
		{#each lineupHomeTeam as playerData (playerData.id)}
			<div class="text-primary">
				{playerData.player.name}
				<span>{playerData.player.name === match.mvp?.name ? "👑" : ""}</span>
			</div>
			<div class="flex flex-row">
				<p>{playerData.player.name === match.jersey_goal?.name ? "👕" : ""}</p>
				<p>{"⚽".repeat(playerData.goals)}</p>
			</div>
		{/each}
	</div>
	<!-- <div class="divider divider-horizontal"></div> -->
	<div class="grid grid-cols-2">
		{#each lineupAwayTeam as playerData (playerData.id)}
			<div class="text-secondary">
				{playerData.player.name}
				<p>{playerData.player.name === match.mvp?.name ? "👑" : ""}</p>
			</div>
			<div class="flex flex-row">
				<p>{playerData.player.name === match.jersey_goal?.name ? "👕" : ""}</p>
				<p>{"⚽".repeat(playerData.goals)}</p>
			</div>
		{/each}
	</div>
</main>
