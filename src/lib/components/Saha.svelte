<script lang="ts">
	import type { Player } from '$lib/types';

	export let playersHome: Player[] = [];
	export let playersAway: Player[] = [];

	let players = [...playersHome, ...playersAway];

	let draggingPlayer: Player | null = null;

	let showPlayerNames = true;
	let showPlayerNumbers = true;
	let showOpponentTeam = true;
	let showHomeTeam = true;

	function startDrag(event: MouseEvent | TouchEvent, player: Player) {
		event.preventDefault();
		draggingPlayer = player;
		window.addEventListener('pointermove', drag, { passive: false });
		window.addEventListener('pointerup', endDrag, { passive: false });
		window.addEventListener('touchmove', drag, { passive: false });
		window.addEventListener('touchend', endDrag, { passive: false });
	}

	function drag(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		if (draggingPlayer) {
			const svg = document.querySelectorAll('svg')[1]; // birden fazla saha varsa id'den yakala
			if (!svg) {
				console.error('SVG element not found');
				return;
			}
			const point = svg.createSVGPoint();
			if (event instanceof MouseEvent) {
				point.x = event.clientX;
				point.y = event.clientY;
			} else if (event instanceof TouchEvent) {
				point.x = event.touches[0].clientX;
				point.y = event.touches[0].clientY;
			}
			const screenCTM = svg.getScreenCTM();
			if (!screenCTM) {
				console.error('Cannot get screenCTM');
				return;
			}
			const transformedPoint = point.matrixTransform(screenCTM.inverse());

			// Saha sınırlarını kontrol et
			const fieldBounds = { xMin: 10, xMax: 490, yMin: 10, yMax: 290 }; // Saha sınırları
			const newX = Math.max(fieldBounds.xMin, Math.min(fieldBounds.xMax, transformedPoint.x));
			const newY = Math.max(fieldBounds.yMin, Math.min(fieldBounds.yMax, transformedPoint.y));

			// Oyuncunun pozisyonunu güncelle
			draggingPlayer.x = newX;
			draggingPlayer.y = newY;

			// Reassign the players array to trigger reactivity
			players = [...players];
		}
	}

	function endDrag(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		draggingPlayer = null;
		window.removeEventListener('pointermove', drag);
		window.removeEventListener('pointerup', endDrag);
		window.removeEventListener('touchmove', drag);
		window.removeEventListener('touchend', endDrag);
	}
</script>

<div class="flex items-center justify-center gap-4">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" class="w-full max-w-4xl">
		<!-- Çim Alanı -->
		<rect x="0" y="0" width="500" height="300" fill="green" />

		<!-- Saha Dış Çizgisi -->
		<rect x="10" y="10" width="480" height="280" fill="none" stroke="white" stroke-width="2" />

		<!-- Orta Çizgi -->
		<line x1="250" y1="10" x2="250" y2="290" stroke="white" stroke-width="2" />

		<!-- Orta Daire -->
		<circle cx="250" cy="150" r="70" fill="none" stroke="white" stroke-width="2" />
		<circle cx="250" cy="150" r="2" fill="white" />

		<!-- Kale Alanları -->
		<rect x="10" y="70" width="70" height="160" fill="none" stroke="white" stroke-width="2" />
		<rect x="420" y="70" width="70" height="160" fill="none" stroke="white" stroke-width="2" />

		<!-- Oyuncular -->
		{#each players as player}
			<g>
				<!-- Circle representing the player -->
				<circle
					class="cursor-move"
					cx={player.x}
					cy={player.y}
					r="10"
					fill={player.color}
					aria-label="Oyuncu"
					role="button"
					tabindex="0"
					on:pointerdown={(event) => startDrag(event, player)}
					on:touchstart={(event) => startDrag(event, player)}
					style="filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));"
				/>

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
</div>

<!-- <div class="mt-4 flex items-center justify-center gap-4">
	<fieldset class="fieldset bg-base-300 border-base-300 rounded-box w-64 border p-4">
		<legend class="fieldset-legend">Görünüm Ayarları</legend>
		<label class="fieldset-label flex items-center justify-between">
			<span class="text-sm font-medium">Oyuncu adları</span>
			<input type="checkbox" class="toggle toggle-primary" checked={showPlayerNames} />
		</label>
		<label class="fieldset-label flex items-center justify-between">
			<span class="text-sm font-medium">Oyuncu numarası</span>
			<input type="checkbox" class="toggle toggle-primary" checked={showPlayerNumbers} />
		</label>
		<label class="fieldset-label flex items-center justify-between">
			<span class="text-sm font-medium">Rakip takımı göster</span>
			<input type="checkbox" class="toggle toggle-primary" checked={showOpponentTeam} />
		</label>
		<label class="fieldset-label flex items-center justify-between">
			<span class="text-sm font-medium">Ev sahibi takımı göster</span>
			<input type="checkbox" class="toggle toggle-primary" checked={showHomeTeam} />
		</label>
	</fieldset>
</div> -->
