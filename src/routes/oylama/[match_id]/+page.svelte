<script lang="ts">
	import type { MatchWithTeams, PlayerWithXAndY } from "$lib/types";
	import { page } from "$app/state";
	import { browser } from "$app/environment";
	import { supabase } from "$lib/supabase";
	import { shuffleArray } from "$lib/utils";
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

	const getUserToken = (): string => {
		if (!browser) return "";
		let token = localStorage.getItem("user_token");
		if (!token) {
			token = crypto.randomUUID();
			localStorage.setItem("user_token", token);
		}
		return token;
	};

	let matchId = page.params.match_id;
	let match: MatchWithTeams | null = null;
	let isLoading = true;
	let votingEnded = false;
	let errorMessage = "";
	let matchStartingTime: Date;
	let matchEndingTime: Date;
	let votingEndTime: Date;
	let timeLeft: string = "";
	let players: PlayerWithXAndY[] = [];
	let availablePoints = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
	let playerPoints: Record<number, { point: number; teamId: number }> = {}; // player.id -> points
	let votesCount = 0;
	let userAlreadyVoted = false;

	const assignPoint = (playerId: number) => {
		if (availablePoints.length === 0 || playerPoints[playerId]) return;
		const point = availablePoints[0];
		availablePoints = availablePoints.slice(1);

		const player = players.find((p) => p.player.id === playerId);
		if (point !== undefined && player) {
			playerPoints = {
				...playerPoints,
				[playerId]: {
					point,
					teamId: player.team_id
				}
			};
		}
	};

	const unassignPoint = (playerId: number) => {
		if (playerPoints[playerId]) {
			availablePoints = [...availablePoints, playerPoints[playerId].point].sort((a, b) => b - a);
			const { [playerId]: _, ...rest } = playerPoints;
			playerPoints = rest;
		}
	};

	const isSelected = (playerId: number): boolean => !!playerPoints[playerId];

	const updateTimeLeft = () => {
		const now = new Date();
		const diff = votingEndTime.getTime() - now.getTime();

		if (diff <= 0) {
			timeLeft = "Oylama sona erdi.";
			votingEnded = true;
			return;
		}

		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		timeLeft = `${hours} saat ${minutes} dakika ${seconds} saniye kaldı.`;
	};

	let interval: ReturnType<typeof setInterval>;

	$: {
		if (votingEndTime) {
			updateTimeLeft();
			clearInterval(interval);
			interval = setInterval(updateTimeLeft, 1000);
		}
	}

	const fetchMatchVotes = async () => {
		const { data, error } = await supabase
			.from("votes")
			.select("*")
			.eq("match_id", Number(matchId));

		if (data) {
			votesCount = data.length / 10;
		}
	};

	// get match information from supabase
	const fetchMatch = async () => {
		const { data, error } = await supabase
			.from("matches")
			.select(
				`
    *,
    mvp: players!matches_mvp_fkey(*),
    jersey_goal: players!matches_jersey_goal_fkey(*),
    team_1: teams!matches_team_1_fkey(*, lineup:lineups(*, player:players(*))),
    team_2: teams!matches_team_2_fkey(*, lineup:lineups(*, player:players(*)))
  `
			)
			.eq("id", Number(matchId))
			.single();

		if (error) {
			errorMessage = "Maç bulunamadı.";
			isLoading = false;
			return;
			// throw error(404, "Maç bulunamadı.");
		}

		matchStartingTime = new Date(data.match_time || "");
		matchEndingTime = new Date(matchStartingTime.getTime() + 60 * 60 * 1000); // +1 hour
		votingEndTime = new Date(matchEndingTime.getTime() + 24 * 60 * 60 * 1000); // +24 hours

		match = data;
		players = shuffleArray([...data.team_1.lineup, ...data.team_2.lineup]);
		isLoading = false;
	};

	const checkUserAlreadyVoted = async () => {
		const userToken = getUserToken();
		const { data, error } = await supabase
			.from("votes")
			.select("id")
			.eq("user_token", userToken)
			.eq("match_id", Number(matchId))
			.limit(1);

		if (data && data.length > 0) {
			userAlreadyVoted = true;
			return;
		}
	};

	fetchMatch();
	fetchMatchVotes();
	checkUserAlreadyVoted();
</script>

<svelte:head>
	<title>Anonim Maç Oylaması</title>
	<meta
		name="description"
		content="“Gerçek adalet, kimse bakmıyorken bile adil kalabilmektir; çünkü adil olmak, kazanmaktan daha onurludur.”"
	/>
</svelte:head>

<div class="py-10 text-center font-medium">
	{#if isLoading}
		<LoadingSpinner />
	{:else if errorMessage}
		<p class="text-error">{errorMessage}</p>
	{:else if match && !votingEnded}
		<div class="space-y-1">
			<p class="mb-5 text-2xl opacity-50">Toplam {votesCount} kişi oy kullandı.</p>
			<p>Oylamanın bitmesine</p>
			<h1 class="text-success">{timeLeft}</h1>
		</div>

		{#if userAlreadyVoted}
			<h1 class="text-warning my-16 font-bold">Rating oylamasına katıldığınız için teşekkürler.</h1>
		{:else}
			<div class="mt-5">
				<p class="text-warning text-xl font-bold">
					{availablePoints.join(" - ") || "Kaydetmeyi unutma"}
				</p>
				<p class="opacity-50">Oyunculara tıklayarak oy kullanabilirsin.</p>
			</div>
			<div class="my-5 space-y-2">
				<div class="grid grid-cols-2 gap-2">
					{#each players as playerData}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="hover:bg-base-300 cursor-pointer rounded p-2 transition"
							class:text-success={isSelected(playerData.player.id)}
							on:click={() => {
								isSelected(playerData.player.id)
									? unassignPoint(playerData.player.id)
									: assignPoint(playerData.player.id);
							}}
						>
							<img
								class="avatar mx-auto h-12 w-12 rounded-full object-cover"
								src={playerData.player.profile_pic}
								alt={playerData.player.name}
							/>
							<div class="mt-1 text-sm">
								{playerData.player.name}
								{#if isSelected(playerData.player.id)}
									<span class="ml-1 font-semibold text-green-600"
										>({playerPoints[playerData.player.id].point} puan)</span
									>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
			{#if availablePoints.length === 0 && !votingEnded}
				<button
					class="btn btn-success btn-block mt-4"
					on:click={async () => {
						const userToken = getUserToken();

						const votesToInsert = Object.entries(playerPoints).map(([playerId, data]) => ({
							user_token: userToken,
							match_id: Number(matchId),
							player_id: Number(playerId),
							team_id: Number(data.teamId),
							rating: data.point
						}));

						const { error } = await supabase.from("votes").insert(votesToInsert);

						if (!error) {
							console.log("Oylar başarıyla kaydedildi.");
							// refresh the page
							location.reload();
						} else {
							console.error("Oy kaydetme hatası:", error.message);
						}
					}}
				>
					Oyları Kaydet
				</button>
			{/if}
		{/if}
	{:else}
		<div>
			<h1 class="text-warning">Bu maç için oylamalar kapandı.</h1>
		</div>
	{/if}
</div>
