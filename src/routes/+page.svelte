<script lang="ts">
	let matches = [
		{
			homeTeam: 'Erayın Takımı',
			homeTeamPlayers: ['Eray', 'Baki', 'Çağrı', 'Eyüp', 'İbrahim', 'Batuhan'],
			awayTeam: 'Erkutun Takımı',
			awayTeamPlayers: ['Erkut', 'Yasin', 'Faruk', 'Cansın', 'Velid', 'Semih'],
			score: '8-9',
			date: '28 Mart 2025 Cuma',
			hour: '21:00-22:00',
			goalsHome: [
				{ player: 'Baki', goalNumber: 2 },
				{ player: 'Çağrı', goalNumber: 2 },
				{ player: 'Eyüp', goalNumber: 1 },
				{ player: 'İbrahim', goalNumber: 3 }
			],
			goalsAway: [
				{ player: 'Velid', goalNumber: 3 },
				{ player: 'Cansın', goalNumber: 2 },
				{ player: 'Erkut', goalNumber: 1 },
				{ player: 'Yasin', goalNumber: 2 },
				{ player: 'Faruk', goalNumber: 1 }
			]
		}
	];

	// Sort goals for each match
	matches.forEach((match) => {
		match.goalsHome.sort((a, b) => b.goalNumber - a.goalNumber);
		match.goalsAway.sort((a, b) => b.goalNumber - a.goalNumber);
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
										<li class="text-primary">{player}</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>

					<!-- Match Score and Goals Section -->
					<div class="mt-2 flex w-full flex-col items-center text-center sm:w-1/2 lg:w-1/4">
						<p class="text-4xl font-bold">{match.score}</p>
						<div class="mt-2 flex flex-col items-center gap-1">
							<div class="collapse-arrow collapse w-full">
								<input type="checkbox" class="peer" />
								<div class="collapse-title text-base-content p-4.5 text-sm font-semibold">
									Goller
								</div>
								<div class="collapse-content p-1">
									<div class="flex justify-between gap-1 text-xs">
										<ul class="text-primary list-none text-left text-[0.75rem] leading-tight">
											{#each match.goalsHome as goal}
												<li class="truncate">{goal.player} ({goal.goalNumber})</li>
											{/each}
										</ul>
										<ul class="text-secondary list-none text-right text-[0.75rem] leading-tight">
											{#each match.goalsAway as goal}
												<li class="truncate">{goal.player} ({goal.goalNumber})</li>
											{/each}
										</ul>
									</div>
								</div>
							</div>
						</div>
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
										<li class="text-secondary">{player}</li>
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
