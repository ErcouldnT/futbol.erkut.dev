<script lang="ts">
	let matches = [
		{
			homeTeam: "Eray'ın Takımı",
			homeTeamPlayers: ["Eray", "Baki", "Çağrı", "Eyüp", "İbrahim", "Batuhan"],
			awayTeam: "Erkut'un Takımı",
			awayTeamPlayers: ["Erkut", "Yasin", "Faruk", "Cansın", "Velid", "Semih"],
			score: "8 - 9",
			date: "28 Mart 2025 Cuma",
			hour: "21:00-22:00",
			goalsHome: [
				{ player: "Baki", goalNumber: 2 },
				{ player: "Çağrı", goalNumber: 2 },
				{ player: "Eyüp", goalNumber: 1 },
				{ player: "İbrahim", goalNumber: 3 }
			],
			goalsAway: [
				{ player: "Velid", goalNumber: 3 },
				{ player: "Cansın", goalNumber: 2 },
				{ player: "Erkut", goalNumber: 1 },
				{ player: "Yasin", goalNumber: 2 },
				{ player: "Faruk", goalNumber: 1 }
			]
		}
	];

	// Sort players by goals scored (from most to least) for each match
	matches.forEach((match) => {
		match.homeTeamPlayers = match.homeTeamPlayers.sort((a, b) => {
			const goalsA = match.goalsHome.find((goal) => goal.player === a)?.goalNumber || 0;
			const goalsB = match.goalsHome.find((goal) => goal.player === b)?.goalNumber || 0;
			return goalsB - goalsA;
		});

		match.awayTeamPlayers = match.awayTeamPlayers.sort((a, b) => {
			const goalsA = match.goalsAway.find((goal) => goal.player === a)?.goalNumber || 0;
			const goalsB = match.goalsAway.find((goal) => goal.player === b)?.goalNumber || 0;
			return goalsB - goalsA;
		});
	});
</script>

<div class="flex flex-col items-center gap-6 px-4 sm:px-8 lg:px-31">
	{#each matches as match}
		<div class="card bg-base-300 w-full max-w-4xl cursor-pointer shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-primary">{match.date}</h2>
				<p class="text-success text-xs">{match.hour}</p>
				<div class="flex flex-wrap items-start justify-between">
					<!-- Home Team Section -->
					<div class="flex min-h-[20px] w-full flex-col items-center sm:w-1/2 lg:w-1/4">
						<div class="collapse-arrow collapse w-full">
							<input type="checkbox" class="peer" />
							<div class="collapse-title p-3.5 text-center text-sm font-semibold">
								<span class="badge badge-primary mt-1">{match.homeTeam}</span>
							</div>
							<div class="collapse-content p-2">
								<ul class="list-none text-center text-sm leading-tight">
									{#each match.homeTeamPlayers as player}
										<li class="flex items-center gap-2">
											<span class="text-primary">{player}</span>
											{#if match.goalsHome.find((goal) => goal.player === player)}
												<div class="flex w-full justify-end text-right">
													{#each Array(match.goalsHome.find((goal) => goal.player === player)?.goalNumber ?? 0).fill(null) as _}
														<!-- <img
														src="/soccer_ball.svg"
														alt="Goal Ball"
														class="text-primary h-4 w-4"
													/> -->
														⚽
													{/each}
												</div>
											{/if}
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>

					<!-- Match Score Section -->
					<div class="mt-2 flex w-full flex-col items-center text-center sm:w-1/2 lg:w-1/4">
						<p class="text-4xl font-bold">{match.score}</p>
					</div>

					<!-- Away Team Section -->
					<div class="flex min-h-[20px] w-full flex-col items-center sm:w-1/2 lg:w-1/4">
						<div class="collapse-arrow collapse w-full">
							<input type="checkbox" class="peer" />
							<div class="collapse-title p-3.5 text-center text-sm font-semibold">
								<span class="badge badge-secondary mt-1">{match.awayTeam}</span>
							</div>
							<div class="collapse-content p-2">
								<ul class="list-none text-center text-sm leading-tight">
									{#each match.awayTeamPlayers as player}
										<li class="flex items-center gap-2">
											<span class="text-secondary">{player}</span>
											{#if match.goalsAway.find((goal) => goal.player === player)}
												<div class="flex w-full justify-end text-right">
													{#each Array(match.goalsAway.find((goal) => goal.player === player)?.goalNumber || 0).fill(null) as _}
														<!-- <img
														src="/soccer_ball.svg"
														alt="Goal Ball"
														class="text-secondary h-4 w-4"
													/> -->
														⚽
													{/each}
												</div>
											{/if}
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
