<script lang="ts">
	import type { Match, LineupExpand } from "$lib/types";
	import { onMount } from "svelte";
	import { pb } from "$lib/pb";

	import SahaSvg from "./SahaSvg.svelte";

	export let match: Match;

	// console.log("Match Data:", match);

	const matchId = match.id;
	const home_team_id = match.home_team;
	const away_team_id = match.away_team;

	// console.log(home_team_id, away_team_id);

	let home_team_lineups: LineupExpand[] = [];
	let away_team_lineups: LineupExpand[] = [];

	onMount(async () => {
		try {
			// Home team line‑ups: match id AND team id
			const data_home_team_lineups = await pb.collection<LineupExpand>("lineups").getFullList({
				filter: `match="${matchId}" && team="${home_team_id}"`,
				sort: "+created",
				expand: "player"
			});

			home_team_lineups = [...data_home_team_lineups];

			// Away team line‑ups: match id AND team id
			const data_away_team_lineups = await pb.collection<LineupExpand>("lineups").getFullList({
				filter: `match="${matchId}" && team="${away_team_id}"`,
				sort: "+created",
				expand: "player"
			});

			away_team_lineups = [...data_away_team_lineups];
		} catch (error) {
			// console.error("Lineups çekilemedi:", error.message);
		}
	});

	const matchStartingTime = new Date(match.match_time || "");
	const matchEndingTime = new Date(matchStartingTime.getTime() + 60 * 60 * 1000); // +1 hour
	const votingEndTime = new Date(matchEndingTime.getTime() + 24 * 60 * 60 * 1000); // +24 hours
	const now = new Date();

	const votingEnded = now > votingEndTime;
</script>

<main class="flex max-h-full items-center justify-center p-5 lg:max-h-120">
	<SahaSvg
		playersHome={home_team_lineups}
		playersAway={away_team_lineups}
		showRatings={votingEnded}
		saha="HORIZONTAL"
	/>
</main>
