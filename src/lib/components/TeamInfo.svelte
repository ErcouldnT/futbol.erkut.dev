<script lang="ts">
	import type { LineupExpand, MatchExpand } from "$lib/types";
	import { onMount } from "svelte";
	import { pb } from "$lib/pb";

	export let match: MatchExpand;

	let lineupHomeTeam: LineupExpand[] = [];
	let lineupAwayTeam: LineupExpand[] = [];

	const home_team_id = match.home_team;
	const away_team_id = match.away_team;

	async function loadLineups() {
		// todo: match id'ye göre lineup çek ve burada takımlara göre ayır
		const dataLineupHomeTeam = await pb.collection<LineupExpand>("lineups").getFullList({
			filter: `team="${home_team_id}"`,
			expand: "player",
			$cancelKey: "homeLineup",
			$autoCancel: false
		});

		lineupHomeTeam = sortPlayersByGoals([...dataLineupHomeTeam]);

		const dataLineupAwayTeam = await pb.collection<LineupExpand>("lineups").getFullList({
			filter: `team="${away_team_id}"`,
			expand: "player",
			$cancelKey: "awayLineup",
			$autoCancel: false
		});

		lineupAwayTeam = sortPlayersByGoals([...dataLineupAwayTeam]);
	}

	onMount(async () => {
		loadLineups();
	});

	// sort players by goals scored (from most to least)
	function sortPlayersByGoals(players: LineupExpand[]) {
		return players.sort((a, b) => b.goals - a.goals);
	}
</script>

<main class="grid grid-cols-1 gap-5 p-2 sm:grid-cols-2 sm:gap-5">
	<div class="grid grid-cols-2">
		{#each lineupHomeTeam as playerData (playerData.player)}
			<div class="text-primary">
				{playerData.expand.player?.name}
				<span>{playerData.expand.player?.name === match.expand?.mvp?.name ? "👑" : ""}</span>
			</div>
			<div class="flex flex-row">
				<p>{playerData.expand.player?.name === match.expand?.jersey_goal?.name ? "👕" : ""}</p>
				<p>{"⚽".repeat(playerData.goals)}</p>
			</div>
		{/each}
	</div>
	<!-- <div class="divider divider-horizontal"></div> -->
	<div class="grid grid-cols-2">
		{#each lineupAwayTeam as playerData (playerData.player)}
			<div class="text-secondary">
				{playerData.expand.player?.name}
				<span>{playerData.expand.player?.name === match.expand?.mvp?.name ? "👑" : ""}</span>
			</div>
			<div class="flex flex-row">
				<p>{playerData.expand.player?.name === match.expand?.jersey_goal?.name ? "👕" : ""}</p>
				<p>{"⚽".repeat(playerData.goals)}</p>
			</div>
		{/each}
	</div>
</main>
