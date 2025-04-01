<script lang="ts">
	export let player;
	export let color = "black";
	export let startDrag: (event: PointerEvent | TouchEvent, player: any) => void = () => null;
</script>

<circle
	class="cursor-move"
	cx={player.x}
	cy={player.y}
	r="10"
	fill={color}
	aria-label="Oyuncu"
	role="button"
	tabindex="0"
	on:pointerdown={(event) => startDrag(event, player)}
	on:touchstart={(event) => startDrag(event, player)}
	style="filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));"
/>
