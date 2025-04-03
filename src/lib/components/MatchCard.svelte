<script lang="ts">
	import type { MatchWithTeams } from "$lib/types";
	import { ArrowDownNarrowWide } from "@lucide/svelte";
	import TabMenu from "./TabMenu.svelte";

	export let match: MatchWithTeams;
	export let index: number;
	export let lastMatch = false;

	console.log(index + 1); // for future

	let isExpanded = false;

	// it is not a bug, it is a feature:
	// son maç istatistikleri otomatik olarak açık
	if (lastMatch) {
		isExpanded = true;
	}

	const toggleAccordion = () => {
		isExpanded = !isExpanded;
	};

	// todo: utils e gönder
	function formatMatchTime(matchTime: Date): string {
		const pad = (num: number) => num.toString().padStart(2, "0");

		const startHours = pad(matchTime.getHours());
		const startMinutes = pad(matchTime.getMinutes());

		const endTime = new Date(matchTime);
		endTime.setHours(endTime.getHours() + 1);

		const endHours = pad(endTime.getHours());
		const endMinutes = pad(endTime.getMinutes());

		return `${startHours}:${startMinutes} - ${endHours}.${endMinutes}`;
	}
</script>

<main class="card bg-base-300 w-full p-5">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div on:click={toggleAccordion} class="cursor-pointer">
		{#if match.match_time}
			<div class="flex items-center justify-between">
				<p class="text-primary text-lg font-bold">
					{new Date(match.match_time).toLocaleDateString("tr-TR", {
						day: "2-digit",
						month: "long",
						year: "numeric"
					})}
				</p>
				<button class="btn font-thin opacity-50"
					>Maç Detayları <ArrowDownNarrowWide size={18} /></button
				>
			</div>
			<p class="text-success text-xs">{formatMatchTime(new Date(match.match_time))}</p>
		{/if}

		<div class="grid grid-cols-3 items-center justify-items-center p-5">
			<p class="badge badge-primary font-bold">{match.team_1.name}</p>
			<div>
				<p class="text-4xl font-extrabold">{match.home_score} - {match.away_score}</p>
			</div>
			<p class="badge badge-secondary font-bold">{match.team_2.name}</p>
		</div>
	</div>

	<!-- <div class="flex items-center justify-center gap-5 opacity-50">
		<button on:click={() => setActiveTab("PLAYERS")} class="btn btn-sm">Oyuncular</button>
		<button on:click={() => setActiveTab("RATINGS")} class="btn btn-sm">Rating'ler</button>
	</div> -->

	{#if isExpanded}
		<TabMenu {match} />
	{/if}
</main>
