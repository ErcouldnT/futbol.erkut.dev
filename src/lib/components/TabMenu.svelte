<script lang="ts">
	import TeamInfo from "./TeamInfo.svelte";
	import type { MatchWithTeams } from "$lib/types";
	import Ratings from "./Ratings.svelte";

	export let match: MatchWithTeams;

	let activeTab: "PLAYERS" | "RATINGS" = "PLAYERS";

	const setActiveTab = (tab: "PLAYERS" | "RATINGS") => {
		activeTab = tab;
	};
</script>

<!-- •	Goller ve rating'ler arasında geçiş yapmayı sağlayan sekmeleri göstermek.
	•	Seçilen sekmeye göre ilgili içeriği görüntülemek. -->

<main>
	<div class="flex items-center justify-center gap-5 opacity-50">
		<button on:click={() => setActiveTab("PLAYERS")} class="btn btn-sm">Oyuncular</button>
		<button on:click={() => setActiveTab("RATINGS")} class="btn btn-sm">Rating'ler</button>
	</div>

	{#if activeTab === "PLAYERS"}
		<TeamInfo {match} />

		<div
			class="absolute right-0 bottom-0 m-5 grid max-w-3xs grid-cols-1 items-center justify-items-end text-xs font-thin opacity-50"
		>
			<p>Forma golü: 👕</p>
			<p>Maçın adamı: 👑</p>
		</div>
	{/if}

	{#if activeTab === "RATINGS"}
		<Ratings {match} />
	{/if}
</main>
