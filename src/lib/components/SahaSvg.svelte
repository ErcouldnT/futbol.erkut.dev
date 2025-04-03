<script lang="ts">
	import { HOME_COLOR, AWAY_COLOR, SAHA_COLOR } from "$lib/constants";
	import PlayerSvg from "./PlayerSvg.svelte";
	import type { PlayerWithXAndY } from "$lib/types";

	export let playersHome: PlayerWithXAndY[] = [];
	export let playersAway: PlayerWithXAndY[] = [];

	export let showRatings = false;
	export let showPlayerNames = true;
	export let showPlayerNumbers = true;

	export let startDrag: (event: PointerEvent | TouchEvent, player: PlayerWithXAndY) => void = () =>
		null;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 300 500"
	class="h-full max-h-screen w-full max-w-md"
>
	<!-- Çim Alanı -->
	<rect x="0" y="0" width="300" height="500" fill={SAHA_COLOR} />

	<!-- Saha Dış Çizgisi -->
	<rect
		x="10"
		y="10"
		width="280"
		height="480"
		fill="none"
		stroke="white"
		stroke-width="1.5"
		opacity="0.5"
	/>

	<!-- Orta Çizgi -->
	<line x1="10" y1="250" x2="290" y2="250" stroke="white" stroke-width="1.5" opacity="0.5" />

	<!-- Orta Daire -->
	<circle cx="150" cy="250" r="70" fill="none" stroke="white" stroke-width="1.5" opacity="0.5" />
	<circle cx="150" cy="250" r="2" fill="white" opacity="0.5" />

	<!-- Pen6 Noktasi -->
	<circle cx="150" cy="60" r="1.2" fill="white" opacity="0.5" />
	<circle cx="150" cy="440" r="1.2" fill="white" opacity="0.5" />

	<!-- Yarım Daireler -->
	<path
		d="M97.5,420 a70,70 0 0,1 105,0"
		fill="none"
		stroke="white"
		stroke-width="1.5"
		opacity="0.5"
	/>
	<path
		d="M202.5,80 a70,70 0 0,1 -105,0"
		fill="none"
		stroke="white"
		stroke-width="1.5"
		opacity="0.5"
	/>

	<!-- Ceza Alanlari -->
	<!-- <line x1="70" y1="10" x2="230" y2="10" stroke="white" stroke-width="1.5" opacity="0.5" /> -->
	<line x1="70" y1="10" x2="70" y2="80" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="230" y1="10" x2="230" y2="80" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="70" y1="80" x2="230" y2="80" stroke="white" stroke-width="1.5" opacity="0.5" />

	<line x1="70" y1="420" x2="230" y2="420" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="70" y1="420" x2="70" y2="490" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="230" y1="420" x2="230" y2="490" stroke="white" stroke-width="1.5" opacity="0.5" />
	<!-- <line x1="70" y1="490" x2="230" y2="490" stroke="white" stroke-width="1.5" opacity="0.5" /> -->

	<!-- Kale Alanlari -->
	<!-- <line x1="112.5" y1="10" x2="187.5" y2="10" stroke="white" stroke-width="1.5" opacity="0.5" /> -->
	<line x1="112.5" y1="10" x2="112.5" y2="40" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="187.5" y1="10" x2="187.5" y2="40" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="112.5" y1="40" x2="187.5" y2="40" stroke="white" stroke-width="1.5" opacity="0.5" />

	<line x1="112.5" y1="460" x2="187.5" y2="460" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="112.5" y1="460" x2="112.5" y2="490" stroke="white" stroke-width="1.5" opacity="0.5" />
	<line x1="187.5" y1="460" x2="187.5" y2="490" stroke="white" stroke-width="1.5" opacity="0.5" />
	<!-- <line x1="112.5" y1="490" x2="187.5" y2="490" stroke="white" stroke-width="1.5" opacity="0.5" /> -->

	<!-- Oyuncular Home -->
	{#each playersHome as playerData (playerData.player.id)}
		<PlayerSvg {playerData} color={HOME_COLOR} {startDrag} {showPlayerNames} {showPlayerNumbers} />
	{/each}

	<!-- Oyuncular Away -->
	{#each playersAway as playerData (playerData.player.id)}
		<!-- Circle representing the player -->
		<PlayerSvg
			{playerData}
			color={AWAY_COLOR}
			{startDrag}
			{showPlayerNames}
			{showPlayerNumbers}
			{showRatings}
		/>
	{/each}
</svg>
