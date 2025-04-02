<script lang="ts">
	import { HOME_COLOR, AWAY_COLOR } from "$lib/constants";
	import PlayerSvg from "./PlayerSvg.svelte";
	import type { PlayerWithXAndY } from "$lib/types";

	export let playersHome: PlayerWithXAndY[] = [];
	export let playersAway: PlayerWithXAndY[] = [];
	export let showPlayerNames = true;
	export let showPlayerNumbers = true;
	export let startDrag: (event: PointerEvent | TouchEvent, player: any) => void = () => null;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 300 500"
	class="h-full max-h-screen w-full max-w-md"
>
	<!-- Çim Alanı -->
	<rect x="0" y="0" width="300" height="500" fill="green" />

	<!-- Saha Dış Çizgisi -->
	<rect x="10" y="10" width="280" height="480" fill="none" stroke="white" stroke-width="2" />

	<!-- Orta Çizgi -->
	<line x1="10" y1="250" x2="290" y2="250" stroke="white" stroke-width="2" />

	<!-- Orta Daire -->
	<circle cx="150" cy="250" r="70" fill="none" stroke="white" stroke-width="2" />
	<circle cx="150" cy="250" r="2" fill="white" />

	<!-- Kale Alanları -->
	<rect x="70" y="10" width="160" height="70" fill="none" stroke="white" stroke-width="2" />
	<rect x="70" y="420" width="160" height="70" fill="none" stroke="white" stroke-width="2" />

	<!-- Oyuncular Home -->
	{#each playersHome as player}
		<g>
			<!-- Circle representing the player -->
			<PlayerSvg {player} color={HOME_COLOR} {startDrag} />

			<!-- Player's name above the circle -->
			{#if showPlayerNames}
				<text
					class="pointer-events-none font-bold"
					x={player.x}
					y={player.y - 15}
					fill="white"
					font-size="6"
					text-anchor="middle"
					dominant-baseline="middle"
				>
					{player.name}
				</text>
			{/if}

			<!-- Player's number inside the circle -->
			{#if showPlayerNumbers}
				<text
					class="pointer-events-none font-stretch-semi-expanded"
					x={player.x}
					y={player.y + 1}
					fill="white"
					font-size="8"
					text-anchor="middle"
					dominant-baseline="middle"
				>
					{player.number}
				</text>
			{/if}
		</g>
	{/each}

	<!-- Oyuncular Away -->
	{#each playersAway as player}
		<g>
			<!-- Circle representing the player -->
			<PlayerSvg {player} color={AWAY_COLOR} {startDrag} />

			<!-- Player's name above the circle -->
			{#if showPlayerNames}
				<text
					class="pointer-events-none font-bold"
					x={player.x}
					y={player.y - 15}
					fill="white"
					font-size="6"
					text-anchor="middle"
					dominant-baseline="middle"
				>
					{player.name}
				</text>
			{/if}

			<!-- Player's number inside the circle -->
			{#if showPlayerNumbers}
				<text
					class="pointer-events-none font-stretch-semi-expanded"
					x={player.x}
					y={player.y + 1}
					fill="white"
					font-size="8"
					text-anchor="middle"
					dominant-baseline="middle"
				>
					{player.number}
				</text>
			{/if}
		</g>
	{/each}
</svg>
