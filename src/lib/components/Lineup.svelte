<script lang="ts">
	import type { Player, LineupExpand } from "$lib/types";
	import { onMount } from "svelte";
	import { pb } from "$lib/pb";
	import { playersHomeStore, playersAwayStore } from "$lib/stores/players";

	import SahaSvg from "./SahaSvg.svelte";
	import LoadingSpinner from "./LoadingSpinner.svelte";

	let playersHome: LineupExpand[] = $playersHomeStore;
	let playersAway: LineupExpand[] = $playersAwayStore;

	let homeTeamName = "Ev sahibi";
	let awayTeamName = "Deplasman";

	// Display settings
	let showPlayerNames = true;
	let showPlayerNumbers = true;
	// let showOpponentTeam = true;
	// let showHomeTeam = true;

	// todo: queries.ts den çekilecek, loading dahil
	let isLoading = true;
	let players: Player[] = [];

	const fetchPlayers = async () => {
		try {
			// fetch all player records from PocketBase "players" collection
			// `getFullList` returns an array of records
			players = await pb.collection<Player>("players").getFullList({
				sort: "name"
			});
		} catch (error) {
			// console.error("Error fetching players:", error.message);
		} finally {
			isLoading = false;
		}
	};

	onMount(fetchPlayers);

	// todo: SAHA nın içine gönder...
	// Drag and drop functionality
	let draggingPlayer: LineupExpand | null = null;

	function startDrag(event: MouseEvent | TouchEvent, player: LineupExpand) {
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
			// todo: hiyerarşideki 1. svg yi seçmek yerine daha spesifik bir çözüm bul!
			const svg = document.querySelectorAll("svg")[0];
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
			draggingPlayer.pos_x = newX;
			draggingPlayer.pos_y = newY;

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

		// console.log(playersHome);
		// console.log(playersAway);
	}

	// Randomly generate x and y coordinates for players
	const randomXAndY = (home: boolean) => {
		if (home) {
			return {
				pos_x: Math.floor(10 + Math.random() * 280),
				pos_y: Math.floor(10 + Math.random() * 230)
			};
		} else {
			return {
				pos_x: Math.floor(10 + Math.random() * 280),
				pos_y: Math.floor(260 + Math.random() * 230)
			};
		}
	};

	// Add and remove players from teams
	const addPlayer = (player: Player, team: "HOME" | "AWAY") => {
		// console.log(player);

		const teamPlayers = team === "HOME" ? playersHome : playersAway;
		// const teamStore = team === "HOME" ? playersHomeStore : playersAwayStore;

		if (!teamPlayers.some((lineup) => lineup.player === player.id)) {
			const { pos_x, pos_y } = randomXAndY(team === "HOME");
			// @ts-ignore
			const playerWithXAndY: LineupExpand = {
				player: player.id,
				expand: {
					player
				},
				pos_x,
				pos_y
				// match: player.id,
				// id: player.id, // fix later
				// team: player.id, // fix later
				// goals: 0, // fix later
				// rating: 0, // fix later
				// created: new Date().toISOString()
			};
			// console.log(playerWithXAndY);

			if (team === "HOME") {
				playersHome = [...playersHome, playerWithXAndY];
				playersHomeStore.set(playersHome);
				// console.log(playersHome);
			} else {
				playersAway = [...playersAway, playerWithXAndY];
				playersAwayStore.set(playersAway);
			}
		}
	};

	const removePlayer = (player: Player, team: "HOME" | "AWAY") => {
		// console.log(`Removing player ${player.name} from team ${team}`);

		if (team === "HOME") {
			playersHome = playersHome.filter((lineup) => lineup.player !== player.id);
			playersHomeStore.set(playersHome);
		} else {
			playersAway = playersAway.filter((lineup) => lineup.player !== player.id);
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

	async function saveMatch() {
		try {
			/* 1️⃣  Takımları kaydet */
			const homeTeam = await pb
				.collection("teams")
				.create({ name: homeTeamName.trim(), players: playersHome.map((p) => p.player) });
			const awayTeam = await pb
				.collection("teams")
				.create({ name: awayTeamName.trim(), players: playersAway.map((p) => p.player) });

			/* 🔄 3️⃣  Maç kaydını oluştur */
			const match = await pb.collection("matches").create({
				home_team: homeTeam.id,
				away_team: awayTeam.id,
				home_score: 0,
				away_score: 0,
				duration: 60 // 60 dakika
				// match_time: new Date().toISOString() // todo: next friday at 20:00
			});

			/* 2️⃣  Tüm oyuncuları tek listeye koyup tek seferde kaydet */
			const lineupPayload = [
				...playersHome.map((p) => ({
					match: match.id,
					team: homeTeam.id,
					player: p.player,
					goals: 0,
					rating: 0,
					pos_x: p.pos_x,
					pos_y: p.pos_y
				})),
				...playersAway.map((p) => ({
					match: match.id,
					team: awayTeam.id,
					player: p.player,
					goals: 0,
					rating: 0,
					pos_x: p.pos_x,
					pos_y: p.pos_y
				}))
			];

			// PocketBase REST API tek seferde çoklu kayıt desteklemediğinden
			// Promise.all ile paralel olarak yine tek istekte göndermeye en yakın yol:
			await Promise.all(
				lineupPayload.map((data) => pb.collection("lineups").create(data, { requestKey: null }))
			);

			console.log("Teams, lineups, and match saved successfully:", match);
			window.location.href = "/"; // Redirect to home or matches page
		} catch (error) {
			// console.error("Failed to save match:", error.message);
		}
	}
</script>

<main class="mt-5 flex flex-col items-center justify-center gap-16 lg:flex-row">
	<div class="flex flex-col items-center gap-2">
		<input
			type="text"
			bind:value={homeTeamName}
			placeholder="Ev sahibi takım adı"
			class="input input-bordered input-sm text-primary mb-2 w-full text-center font-bold"
			class:border-2={homeTeamName.trim() === ""}
			class:border-red-500={homeTeamName.trim() === ""}
		/>

		{#if isLoading}
			<LoadingSpinner />
		{:else}
			<ul class="menu menu-vertical bg-base-200/50 rounded-box w-56 gap-1 backdrop-blur-md">
				{#each players as player (player.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<li
						on:click={() => {
							if (playersHome.some((lineup) => lineup.player === player.id)) {
								removePlayer(player, "HOME");
							} else {
								if (!playersAway.some((lineup) => lineup.player === player.id)) {
									addPlayer(player, "HOME");
								}
							}
						}}
						class="card opacity-30"
						class:opacity-100={playersHome.some((lineup) => lineup.player === player.id)}
						class:bg-primary={playersHome.some((lineup) => lineup.player === player.id)}
					>
						<div class="flex items-center justify-between gap-2">
							<div class="avatar">
								<div class="h-4 w-4 rounded-full">
									<img
										src={player.profile_pic
											? `${pb.baseURL}/api/files/players/${player.id}/${player.profile_pic}`
											: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fb.fssta.com%2Fuploads%2Fapplication%2Fsoccer%2Fheadshots%2F885.png&f=1&nofb=1&ipt=9f471ea69d4917e6e6bd8623e7c809aedb7f482cf8901cd071efc6cda978471d"}
										alt={player.name}
									/>
								</div>
							</div>
							<div class="flex-1">
								<span class="text-xs font-bold">{player.name}</span>
							</div>
							<span class="text-warning badge text-xs">{player.number}</span>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<SahaSvg {playersHome} {playersAway} {showPlayerNames} {showPlayerNumbers} {startDrag} />

	<div class="flex flex-col items-center gap-2">
		<input
			type="text"
			bind:value={awayTeamName}
			placeholder="Rakip takım adı"
			class="input input-bordered input-sm text-secondary mb-2 w-full text-center font-bold"
			class:border-2={awayTeamName.trim() === ""}
			class:border-red-500={awayTeamName.trim() === ""}
		/>

		{#if isLoading}
			<LoadingSpinner />
		{:else}
			<ul class="menu menu-vertical bg-base-200/50 rounded-box w-56 gap-1 backdrop-blur-md">
				{#each players as player (player.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<li
						on:click={() => {
							if (playersAway.some((lineup) => lineup.player === player.id)) {
								removePlayer(player, "AWAY");
							} else {
								if (!playersHome.some((lineup) => lineup.player === player.id)) {
									addPlayer(player, "AWAY");
								}
							}
						}}
						class="card opacity-30"
						class:opacity-100={playersAway.some((lineup) => lineup.player === player.id)}
						class:bg-secondary={playersAway.some((lineup) => lineup.player === player.id)}
					>
						<div class="flex items-center gap-2">
							<div class="avatar">
								<div class="h-4 w-4 rounded-full">
									<img
										src={player.profile_pic
											? `${pb.baseURL}/api/files/players/${player.id}/${player.profile_pic}`
											: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fb.fssta.com%2Fuploads%2Fapplication%2Fsoccer%2Fheadshots%2F885.png&f=1&nofb=1&ipt=9f471ea69d4917e6e6bd8623e7c809aedb7f482cf8901cd071efc6cda978471d"}
										alt={player.name}
									/>
								</div>
							</div>
							<div class="flex-1">
								<span class="text-xs font-bold">{player.name}</span>
							</div>
							<span class="text-warning badge text-xs">{player.number}</span>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</main>

<button
	on:click={saveMatch}
	class="btn btn-warning m-4 mx-auto w-full"
	disabled={playersHome.length === 0 || playersAway.length === 0}
>
	Maçı Kaydet
</button>
