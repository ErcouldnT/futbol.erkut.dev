<script lang="ts">
	import { playersHomeStore, playersAwayStore } from "$lib/stores";
	import { supabase } from "$lib/supabase";
	import type { Player } from "$lib/types";
	import SahaSvg from "./SahaSvg.svelte";

	let players = [];

	// Fetch players from Supabase
	const fetchPlayers = async () => {
		const { data, error } = await supabase.from("players").select("*");
		if (error) {
			console.error("Error fetching players:", error);
		} else {
			players = data;
		}
		// loading = false;
	};

	fetchPlayers();

	let homeColor = "blue";
	let awayColor = "red";

	export let playersHome: Player[] = $playersHomeStore;
	export let playersAway: Player[] = $playersAwayStore;

	// let players = [...playersHome, ...playersAway];

	let draggingPlayer: Player | null = null;

	let showPlayerNames = true;
	let showPlayerNumbers = true;
	// let showOpponentTeam = true;
	// let showHomeTeam = true;

	function startDrag(event: MouseEvent | TouchEvent, player: Player) {
		event.preventDefault();
		draggingPlayer = player;
		window.addEventListener("pointermove", drag, { passive: false });
		window.addEventListener("pointerup", endDrag, { passive: false });
		window.addEventListener("touchmove", drag, { passive: false });
		window.addEventListener("touchend", endDrag, { passive: false });
	}

	function drag(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		if (draggingPlayer) {
			const svg = document.querySelectorAll("svg")[1]; // birden fazla saha varsa id'den yakala
			if (!svg) {
				console.error("SVG element not found");
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
				console.error("Cannot get screenCTM");
				return;
			}
			const transformedPoint = point.matrixTransform(screenCTM.inverse());

			// Saha sınırlarını kontrol et
			const fieldBounds = { xMin: 10, xMax: 290, yMin: 10, yMax: 490 }; // Saha sınırları
			const newX = Math.max(fieldBounds.xMin, Math.min(fieldBounds.xMax, transformedPoint.x));
			const newY = Math.max(fieldBounds.yMin, Math.min(fieldBounds.yMax, transformedPoint.y));

			// Oyuncunun pozisyonunu güncelle
			draggingPlayer.x = newX;
			draggingPlayer.y = newY;

			// Reassign the players array to trigger reactivity
			playersHome = [...playersHome];
			playersAway = [...playersAway];
			playersHomeStore.set(playersHome);
			playersAwayStore.set(playersAway);
		}
	}

	function endDrag(event: MouseEvent | TouchEvent) {
		event.preventDefault();
		draggingPlayer = null;
		window.removeEventListener("pointermove", drag);
		window.removeEventListener("pointerup", endDrag);
		window.removeEventListener("touchmove", drag);
		window.removeEventListener("touchend", endDrag);
	}

	// let selectedHomePlayer = '';

	const randomXandY = () => {
		return {
			x: Math.floor(Math.random() * 300),
			y: Math.floor(Math.random() * 500)
		};
	};

	const addHomePlayer = (player: Player) => {
		if (!playersHome.some((p) => p.id === player.id)) {
			player.color = homeColor;
			const { x, y } = randomXandY();
			player.x = x;
			player.y = y;
			playersHome = [...playersHome, player];
			playersHomeStore.set(playersHome);
		}
	};

	const addAwayPlayer = (player: Player) => {
		if (!playersAway.some((p) => p.id === player.id)) {
			player.color = awayColor;
			const { x, y } = randomXandY();
			player.x = x;
			player.y = y;
			playersAway = [...playersAway, player];
			playersAwayStore.set(playersAway);
		}
	};

	const removeHomePlayer = (player: Player) => {
		playersHome = playersHome.filter((p) => p.id !== player.id);
		playersHomeStore.set(playersHome);
	};

	const removeAwayPlayer = (player: Player) => {
		playersAway = playersAway.filter((p) => p.id !== player.id);
		playersAwayStore.set(playersAway);
	};

	const clearHomePlayers = () => {
		playersHome = [];
	};

	const clearAwayPlayers = () => {
		playersAway = [];
	};

	const resetPlayers = () => {
		playersHome = [];
		playersAway = [];
	};
</script>

<div class="flex flex-col items-center justify-center gap-4 lg:flex-row">
	<div class="flex flex-col gap-1 p-4">
		<p class="text-primary text-center text-sm">Takım 1</p>
		<!-- <input
			list="ice-cream-flavors"
			id="home-players-choice"
			bind:value={selectedHomePlayer}
			class="input input-bordered w-full max-w-xs"
		/>

		<datalist id="ice-cream-flavors">
			{#each players as player}
				<option value={player.name}></option>
			{/each}
		</datalist> -->

		<ul class="menu menu-vertical bg-base-200 rounded-box w-56">
			{#each players as player}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					on:click={() => {
						if (playersHome.some((p) => p.id === player.id)) {
							removeHomePlayer(player);
						} else {
							if (!playersAway.some((p) => p.id === player.id)) {
								addHomePlayer(player);
							}
						}
					}}
					class="opacity-30"
					class:opacity-100={playersHome.some((p) => p.id === player.id)}
				>
					<div>
						<span class="font-bold">{player.name}</span>
						<span class="text-warning badge text-xs">{player.number}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>

	<SahaSvg {playersHome} {playersAway} {showPlayerNames} {showPlayerNumbers} {startDrag} />

	<div class="flex flex-col gap-1 p-4">
		<p class="text-secondary text-center text-sm">Takım 2</p>
		<ul class="menu menu-vertical bg-base-200 rounded-box w-56">
			{#each players as player}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					on:click={() => {
						if (playersAway.some((p) => p.id === player.id)) {
							removeAwayPlayer(player);
						} else {
							if (!playersHome.some((p) => p.id === player.id)) {
								addAwayPlayer(player);
							}
						}
					}}
					class="opacity-30"
					class:opacity-100={playersAway.some((p) => p.id === player.id)}
				>
					<div>
						<span class="font-bold">{player.name}</span>
						<span class="text-warning badge text-xs">{player.number}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>
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

<!-- <div class="mt-4 flex items-center justify-center gap-4"></div> -->
