<script lang="ts">
	import type { LineupExpand } from "$lib/types";
	import { pb } from "$lib/pb";

	export let playerData: LineupExpand;
	export let color: string;
	export let index;
	export let rotate = false;
	export let showRatings = false;
	export let showPlayerNames = true;
	export let showPlayerNumbers = true;

	export let startDrag: (event: PointerEvent | TouchEvent, player: LineupExpand) => void = () =>
		null;

	let rating: number | null = null;
</script>

<!-- Circle representing the player -->
<g
	class={rotate ? "origin-center cursor-pointer transform-fill lg:rotate-90" : "cursor-move"}
	tabindex={index}
	aria-label={`Drag ${playerData.expand.player?.name} player`}
	role="button"
	on:pointerdown={(event) => startDrag(event, playerData)}
	on:touchstart={(event) => startDrag(event, playerData)}
	style="filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));"
>
	<foreignObject x={playerData.pos_x - 16} y={playerData.pos_y - 16} width="32" height="32">
		<div class="avatar">
			<div class="h-8 w-8 rounded-full">
				<img
					src={playerData.expand.player?.profile_pic
						? `${pb.baseURL}/api/files/players/${playerData.expand.player.id}/${playerData.expand.player.profile_pic}`
						: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fb.fssta.com%2Fuploads%2Fapplication%2Fsoccer%2Fheadshots%2F885.png&f=1&nofb=1&ipt=9f471ea69d4917e6e6bd8623e7c809aedb7f482cf8901cd071efc6cda978471d"}
					alt={playerData.expand.player?.name}
				/>
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
			<tspan class="font-bold opacity-85">{playerData.expand.player?.number}</tspan>
			{#if showPlayerNames}
				<tspan>{playerData.expand.player?.name}</tspan>
			{/if}
		</text>
	{/if}
</g>
