<script lang="ts">
	import type { PlayerWithXAndY } from "$lib/types";

	export let player: PlayerWithXAndY;
	export let color: string;
	export let showPlayerNames = true;
	export let showPlayerNumbers = true;
	export let startDrag: (event: PointerEvent | TouchEvent, player: PlayerWithXAndY) => void = () =>
		null;
</script>

<!-- Circle representing the player -->
<g
	class="cursor-move"
	tabindex="0"
	aria-label={`Drag ${player.name}`}
	role="button"
	on:pointerdown={(event) => startDrag(event, player)}
	on:touchstart={(event) => startDrag(event, player)}
	style="filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));"
>
	<foreignObject x={player.x - 16} y={player.y - 16} width="32" height="32">
		<div class="avatar">
			<div class="h-8 w-8 rounded-full">
				<img src={player.profile_pic} alt={player.name} />
			</div>
		</div>
	</foreignObject>

	<!-- Player's name below the avatar -->
	<!-- {#if showPlayerNames}
		<text
			class="pointer-events-none font-extrabold"
			x={player.x - 13}
			y={player.y + 25}
			fill={color}
			font-size="10"
			dominant-baseline="middle"
		>
			{player.name}
		</text>
	{/if} -->

	<!-- Player's number above the avatar -->
	{#if showPlayerNumbers}
		<text
			class="pointer-events-none font-extrabold font-stretch-semi-expanded"
			x={player.x}
			y={player.y + 25}
			fill={color}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="middle"
		>
			<tspan class="font-bold opacity-85">{player.number}</tspan>
			<tspan>{player.name}</tspan>
		</text>
	{/if}
</g>
