<script lang="ts">
	import type { PlayerWithXAndY } from "$lib/types";
	import { onMount } from "svelte";
	import { supabase } from "$lib/supabase";

	export let playerData: PlayerWithXAndY;
	export let color: string;

	export let index;
	export let rotate = false;
	export let showRatings = false;
	export let showPlayerNames = true;
	export let showPlayerNumbers = true;

	export let startDrag: (event: PointerEvent | TouchEvent, player: PlayerWithXAndY) => void = () =>
		null;

	let rating: number | null = null;

	const fetchPlayerRating = async () => {
		const { data, error } = await supabase
			.from("votes")
			.select("rating")
			.eq("player_id", playerData.player.id)
			.eq("team_id", playerData.team_id);

		if (data && data.length > 0) {
			const sum = data.reduce((acc, vote) => acc + vote.rating, 0);
			rating = +(sum / data.length).toFixed(1) + 2;
			// rating = Math.round((sum / data.length) * 10) / 10; // round to 1 decimal
		} else {
			rating = null;
		}
	};

	onMount(fetchPlayerRating);
</script>

<!-- Circle representing the player -->
<g
	class={rotate ? "origin-center cursor-pointer transform-fill lg:rotate-90" : "cursor-move"}
	tabindex={index}
	aria-label={`Drag ${playerData.player.name}`}
	role="button"
	on:pointerdown={(event) => startDrag(event, playerData)}
	on:touchstart={(event) => startDrag(event, playerData)}
	style="filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));"
>
	<foreignObject x={playerData.pos_x - 16} y={playerData.pos_y - 16} width="32" height="32">
		<div class="avatar">
			<div class="h-8 w-8 rounded-full">
				<img src={playerData.player.profile_pic} alt={playerData.player.name} />
			</div>
		</div>
	</foreignObject>

	<!-- Player's rating above the avatar -->
	{#if showRatings}
		<text
			class="pointer-events-none font-extrabold"
			x={playerData.pos_x}
			y={playerData.pos_y - 22}
			fill={color}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="middle"
		>
			{rating !== null ? `${rating}` : ""}
		</text>
	{/if}

	<!-- Player's number above the avatar -->
	{#if showPlayerNumbers}
		<text
			class="pointer-events-none font-extrabold font-stretch-semi-expanded"
			x={playerData.pos_x}
			y={playerData.pos_y + 25}
			fill={color}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="middle"
		>
			<tspan class="font-bold opacity-85">{playerData.player.number}</tspan>
			{#if showPlayerNames}
				<tspan>{playerData.player.name}</tspan>
			{/if}
		</text>
	{/if}
</g>
