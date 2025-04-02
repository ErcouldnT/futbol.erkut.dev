<script lang="ts">
	import { playersHomeStore, playersAwayStore } from "$lib/stores";
	import { supabase } from "$lib/supabase";
	import SahaSvg from "./SahaSvg.svelte";
	import type { Player, PlayerWithXAndY } from "$lib/types";

	// Persisted stores
	let playersHome: PlayerWithXAndY[] = $playersHomeStore;
	let playersAway: PlayerWithXAndY[] = $playersAwayStore;

	// Display settings
	let showPlayerNames = true;
	let showPlayerNumbers = true;
	// let showOpponentTeam = true;
	// let showHomeTeam = true;

	// todo: queries.ts den çekilecek, loading dahil!
	let isLoading = true;
	let players: Player[] = [];

	const fetchPlayers = async () => {
		const { data, error } = await supabase.from("players").select("*");
		if (error) {
			console.error("Error fetching players:", error);
		} else {
			players = data;
		}
		isLoading = false;
	};

	fetchPlayers();

	// todo: utils e gönder...
	// Drag and drop functionality
	let draggingPlayer: PlayerWithXAndY | null = null;

	function startDrag(event: MouseEvent | TouchEvent, player: PlayerWithXAndY) {
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
			// todo: hiyerarşideki 2. svg yi seçmek yerine daha spesifik bir çözüm bul!
			const svg = document.querySelectorAll("svg")[1];
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
				console.error("Cannot get screenCTM. Wrong SVG element?");
				return;
			}
			const transformedPoint = point.matrixTransform(screenCTM.inverse());

			// Saha sınırlarını kontrol et
			const fieldBounds = { xMin: 10, xMax: 290, yMin: 10, yMax: 490 };
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

	// Randomly generate x and y coordinates for players
	const randomXAndY = () => {
		return {
			x: Math.floor(Math.random() * 300),
			y: Math.floor(Math.random() * 500)
		};
	};

	// Add and remove players from teams
	const addPlayer = (player: Player, team: "HOME" | "AWAY") => {
		const teamPlayers = team === "HOME" ? playersHome : playersAway;
		const teamStore = team === "HOME" ? playersHomeStore : playersAwayStore;

		if (!teamPlayers.some((p) => p.id === player.id)) {
			const { x, y } = randomXAndY();
			const playerWithXAndY: PlayerWithXAndY = { ...player, x, y };
			if (team === "HOME") {
				playersHome = [...playersHome, playerWithXAndY];
				playersHomeStore.set(playersHome);
			} else {
				playersAway = [...playersAway, playerWithXAndY];
				playersAwayStore.set(playersAway);
			}
		}
	};

	const removePlayer = (player: Player, team: "HOME" | "AWAY") => {
		if (team === "HOME") {
			playersHome = playersHome.filter((p) => p.id !== player.id);
			playersHomeStore.set(playersHome);
		} else {
			playersAway = playersAway.filter((p) => p.id !== player.id);
			playersAwayStore.set(playersAway);
		}
	};

	// const clearHomePlayers = () => {
	// 	playersHome = [];
	// };

	// const clearAwayPlayers = () => {
	// 	playersAway = [];
	// };

	// const resetPlayers = () => {
	// 	playersHome = [];
	// 	playersAway = [];
	// };
</script>

<div class="flex flex-col items-center justify-center gap-4 lg:flex-row">
	<div class="flex flex-col gap-1 p-4">
		<h1 class="text-primary text-center text-sm">Ev sahibi</h1>

		<ul class="menu menu-vertical bg-base-200 rounded-box w-56">
			{#each players as player}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					on:click={() => {
						if (playersHome.some((p) => p.id === player.id)) {
							removePlayer(player, "HOME");
						} else {
							if (!playersAway.some((p) => p.id === player.id)) {
								addPlayer(player, "HOME");
							}
						}
					}}
					class="opacity-30"
					class:opacity-100={playersHome.some((p) => p.id === player.id)}
				>
					<div class="flex items-center justify-between gap-2">
						<div class="avatar">
							<div class="h-8 w-8 rounded-full">
								<img src={player.profile_pic} alt={player.name} />
							</div>
						</div>
						<div class="flex-1">
							<span class="font-bold">{player.name}</span>
						</div>
						<span class="text-warning badge text-xs">{player.number}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>

	<SahaSvg {playersHome} {playersAway} {showPlayerNames} {showPlayerNumbers} {startDrag} />

	<div class="flex flex-col gap-1 p-4">
		<h1 class="text-secondary text-center text-sm">Deplasman</h1>
		<ul class="menu menu-vertical bg-base-200 rounded-box w-56">
			{#each players as player}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<li
					on:click={() => {
						if (playersAway.some((p) => p.id === player.id)) {
							removePlayer(player, "AWAY");
						} else {
							if (!playersHome.some((p) => p.id === player.id)) {
								addPlayer(player, "AWAY");
							}
						}
					}}
					class="opacity-30"
					class:opacity-100={playersAway.some((p) => p.id === player.id)}
				>
					<div class="flex items-center gap-2">
						<div class="avatar">
							<div class="h-8 w-8 rounded-full">
								<img src={player.profile_pic} alt={player.name} />
							</div>
						</div>
						<div class="flex-1">
							<span class="font-bold">{player.name}</span>
						</div>
						<span class="text-warning badge text-xs">{player.number}</span>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>
