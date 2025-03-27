<script lang="ts">
	let players = [
		// Takım 1 oyuncuları
		{ id: 1, x: 200, y: 50, color: 'blue' },
		{ id: 2, x: 100, y: 100, color: 'blue' },
		{ id: 3, x: 100, y: 150, color: 'blue' },
		{ id: 4, x: 100, y: 200, color: 'blue' },
		{ id: 5, x: 150, y: 75, color: 'blue' },
		{ id: 6, x: 150, y: 175, color: 'blue' },
		// Takım 2 oyuncuları
		{ id: 7, x: 400, y: 50, color: 'red' },
		{ id: 8, x: 400, y: 100, color: 'red' },
		{ id: 9, x: 400, y: 150, color: 'red' },
		{ id: 10, x: 400, y: 200, color: 'red' },
		{ id: 11, x: 450, y: 75, color: 'red' },
		{ id: 12, x: 350, y: 175, color: 'red' }
	];

	type Player = {
		id: number;
		x: number;
		y: number;
		color: string;
	};

	let draggingPlayer: Player | null = null;

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
			const svg = document.querySelector('svg');
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

<div class="mt-8 flex items-center justify-center">
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
			/>
		{/each}
	</svg>
</div>
