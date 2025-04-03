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
			<p class="text-primary">
				{playerData.player.name}
				<span>{playerData.player.name === match.mvp?.name ? "👑" : ""}</span>
			</p>
			<p>
				<span>{playerData.player.name === match.jersey_goal?.name ? "👕" : ""} </span>
				{"⚽".repeat(playerData.goals)}
			</p>
		{/each}
	</div>
	<div class="grid grid-cols-2">
		{#each lineupAwayTeam as playerData (playerData.id)}
			<p class="text-secondary">
				{playerData.player.name}
				<span>{playerData.player.name === match.mvp?.name ? "👑" : ""}</span>
			</p>
			<p>
				<span>{playerData.player.name === match.jersey_goal?.name ? "👕" : ""}</span>
				{"⚽".repeat(playerData.goals)}
			</p>
		{/each}
	</div>
</main>
