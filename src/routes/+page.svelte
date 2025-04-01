<script lang="ts">
	let matches = [
		{
			homeTeam: "Akkuyu-2023",
			homeTeamPlayers: ["Eray", "Cansın", "Baki", "Eyüp", "İbrahim", "Hakan"],
			awayTeam: "Akkuyu-2024",
			awayTeamPlayers: ["Mete", "Yasin", "Faruk", "Abdullah", "Murat", "Semih"],
			score: "10 - 10",
			date: "30 Mart 2025 Pazar",
			hour: "20:00-21:00",
			ratingHome: [
				{ player: "Eray", rating: 5 },
				{ player: "Cansın", rating: 7 },
				{ player: "Baki", rating: 8.5 },
				{ player: "Eyüp", rating: 8 },
				{ player: "İbrahim", rating: 5.5 },
				{ player: "Hakan", rating: 7.5 }
			],
			goalsHome: [
				{ player: "Baki", goalNumber: 3 },
				{ player: "Eyüp", goalNumber: 3 },
				{ player: "Hakan", goalNumber: 3 },
				{ player: "İbrahim", goalNumber: 1 }
			],
			ratingAway: [
				{ player: "Mete", rating: 7.5 },
				{ player: "Yasin", rating: 7.5 },
				{ player: "Faruk", rating: 8 },
				{ player: "Abdullah", rating: 7 },
				{ player: "Murat", rating: 6.5 },
				{ player: "Semih", rating: 7 }
			],
			goalsAway: [
				{ player: "Mete", goalNumber: 2 },
				{ player: "Semih", goalNumber: 2 },
				{ player: "Abdullah", goalNumber: 1 },
				{ player: "Yasin", goalNumber: 2 },
				{ player: "Faruk", goalNumber: 2 },
				{ player: "Murat", goalNumber: 1 }
			],
			goalJersey: "-",
			motm: "Baki",
			isOpen: false
		},

		{
			homeTeam: "Eray'ın Takımı",
			homeTeamPlayers: ["Eray", "Baki", "Çağrı", "Eyüp", "İbrahim", "Batuhan"],
			awayTeam: "Erkut'un Takımı",
			awayTeamPlayers: ["Erkut", "Yasin", "Faruk", "Cansın", "Velid", "Semih"],
			score: "8 - 9",
			date: "28 Mart 2025 Cuma",
			hour: "21:00-22:00",
			ratingHome: [
				{ player: "Eray", rating: 6 },
				{ player: "Baki", rating: 7 },
				{ player: "Çağrı", rating: 7 },
				{ player: "Eyüp", rating: 6.5 },
				{ player: "İbrahim", rating: 7.5 },
				{ player: "Batuhan", rating: 5.5 }
			],
			goalsHome: [
				{ player: "Baki", goalNumber: 2 },
				{ player: "Çağrı", goalNumber: 2 },
				{ player: "Eyüp", goalNumber: 1 },
				{ player: "İbrahim", goalNumber: 3 }
			],
			ratingAway: [
				{ player: "Erkut", rating: 6.5 },
				{ player: "Yasin", rating: 8.5 },
				{ player: "Faruk", rating: 8 },
				{ player: "Cansın", rating: 7 },
				{ player: "Velid", rating: 9.5 },
				{ player: "Semih", rating: 6 }
			],
			goalsAway: [
				{ player: "Velid", goalNumber: 3 },
				{ player: "Cansın", goalNumber: 2 },
				{ player: "Erkut", goalNumber: 1 },
				{ player: "Yasin", goalNumber: 2 },
				{ player: "Faruk", goalNumber: 1 }
			],
			goalJersey: "Velid",
			motm: "Velid",
			isOpen: false
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

	// Function to toggle the accordion state
	function toggleAccordion(index: number) {
		matches = matches.map((match, i) => ({
			...match,
			isOpen: i === index ? !match.isOpen : false // Close others, toggle the clicked one
		}));
	}
</script>

<div class="flex flex-col items-center gap-6 px-4 sm:px-8 lg:px-31">
	{#each matches as match, index}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="card bg-base-300 w-full max-w-4xl cursor-pointer shadow-xl"
			on:click={() => toggleAccordion(index)}
		>
			<div class="card-body">
				<h2 class="card-title text-primary">{match.date}</h2>
				<p class="text-success text-xs">{match.hour}</p>

				<div class="flex flex-wrap items-center justify-between">
					<!-- Home Team Section -->
					<div class="flex min-h-[20px] w-full flex-col items-center sm:w-1/3">
						<div class="collapse w-full" class:collapse-open={match.isOpen}>
							<div class="collapse-title p-3.5 text-center text-sm font-semibold">
								<span class="badge badge-primary mt-1">{match.homeTeam}</span>
							</div>
							<div class="collapse-content p-2">
								<ul class="list-none text-center text-sm leading-tight">
									{#each match.homeTeamPlayers as player}
										<li class="flex items-center gap-2">
											<span class="text-primary">{player}</span>
											{#if match.motm === player}
												<span>👑</span>
											{/if}
											{#if match.goalsHome.find((goal) => goal.player === player)}
												<div class="flex w-full justify-end text-right">
													{#if match.goalJersey === player}
														<span>🎽</span>
													{/if}
													{#each Array(match.goalsHome.find((goal) => goal.player === player)?.goalNumber ?? 0).fill(null) as _}
														⚽
													{/each}
												</div>
											{/if}
										</li>
									{/each}
									<!-- Boşluk için eklenen boş li -->
									<li class="min-h-[20px]"></li>
								</ul>
							</div>
						</div>
					</div>

					<!-- Scoreboard Section -->
					<div class="flex w-full flex-col items-center justify-center sm:w-1/4">
						<p class="text-4xl font-bold">
							<span class="text-primary">{match.score.split(" - ")[0]}</span>
							<span> - </span>
							<span class="text-secondary">{match.score.split(" - ")[1]}</span>
						</p>
					</div>

					<!-- Away Team Section -->
					<div class="flex min-h-[20px] w-full flex-col items-center sm:w-1/3">
						<div class="collapse w-full" class:collapse-open={match.isOpen}>
							<div class="collapse-title p-3.5 text-center text-sm font-semibold">
								<span class="badge badge-secondary mt-1">{match.awayTeam}</span>
							</div>
							<div class="collapse-content relative p-2">
								<ul class="list-none text-center text-sm leading-tight">
									{#each match.awayTeamPlayers as player}
										<li class="flex items-center gap-2">
											<span class="text-secondary">{player}</span>
											{#if match.motm === player}
												<span>👑</span>
											{/if}
											<div class="flex w-full justify-end text-right">
												{#if match.goalsAway.find((goal) => goal.player === player)}
													{#if match.goalJersey === player}
														<span>🎽</span>
													{/if}
													{#each Array(match.goalsAway.find((goal) => goal.player === player)?.goalNumber || 0).fill(null) as _}
														⚽
													{/each}
												{/if}
											</div>
										</li>
									{/each}
									<!-- Boşluk için eklenen boş li -->
									<li class="min-h-[20px]"></li>
								</ul>
								{#if match.isOpen}
									<div class="absolute right-0.5 bottom-0.5 text-[11px]">
										🎽: Forma golü<br />
										👑: Maçın Adamı
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/each}
</div>
