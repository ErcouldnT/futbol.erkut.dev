<script lang="ts">
	import type { MatchWithTeams } from "$lib/types";
	import TeamInfo from "./TeamInfo.svelte";
	import Ratings from "./Ratings.svelte";
	import Comments from "./Comments.svelte";

	export let match: MatchWithTeams;

	let activeTab: "PLAYERS" | "RATINGS" | "COMMENTS" = "PLAYERS";

	const setActiveTab = (tab: "PLAYERS" | "RATINGS" | "COMMENTS") => {
		activeTab = tab;
	};
</script>

<!-- •	Goller ve rating'ler arasında geçiş yapmayı sağlayan sekmeleri göstermek.
	•	Seçilen sekmeye göre ilgili içeriği görüntülemek. -->

<main>
	<div class="flex items-center justify-center gap-5 opacity-50">
		<button on:click={() => setActiveTab("PLAYERS")} class="btn btn-sm">Oyuncular</button>
		<button on:click={() => setActiveTab("RATINGS")} class="btn btn-sm">Kadrolar</button>
		<button on:click={() => setActiveTab("COMMENTS")} class="btn btn-sm">Yorumlar</button>
	</div>

	{#if activeTab === "PLAYERS"}
		<TeamInfo {match} />
		<div class="flex justify-end">
			<div
				class="grid max-w-3xs grid-cols-1 items-center justify-items-end text-xs font-thin opacity-50"
			>
				<p>Forma golü: 👕</p>
				<p>Maçın adamı: 👑</p>
			</div>
		</div>
	{/if}

	{#if activeTab === "RATINGS"}
		<Ratings {match} />
	{/if}

	{#if activeTab === "COMMENTS"}
		<Comments matchId={match.id} />
	{/if}
</main>
