<script lang="ts">
	let matches = [
		{
			homeTeam: 'Erayın Takımı',
			awayTeam: 'Erkutun Takımı',
			score: '8-9',
			date: '28 Mart 2025 Cuma',
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
				{ player: 'Yasin ', goalNumber: 2 },
				{ player: 'Faruk ', goalNumber: 1 }
			]
		}
	];
</script>

<div class="flex flex-col items-center gap-6">
	{#each matches as match}
		<div class="card bg-base-300 w-96 cursor-pointer shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-primary">{match.date}</h2>
				<div class="flex items-center justify-between">
					<span class="badge badge-primary">{match.homeTeam}</span>
					<span class="text-lg font-thin">vs</span>
					<span class="badge badge-secondary">{match.awayTeam}</span>
				</div>
				<p class="mt-2 text-center text-4xl font-bold">
					{match.score}
				</p>
				<div class="collapse-arrow collapse mt-4">
					<input type="checkbox" class="peer" />
					<div class="text-primary collapse-title text-center text-xl font-medium">Goller</div>
					<div class="collapse-content">
						<div class="mt-4 flex justify-between">
							<div class="w-1/2">
								<h3 class="text-primary text-center text-lg font-semibold">{match.homeTeam}</h3>
								<ul class="list-inside list-disc">
									{#each match.goalsHome as goal}
										<li>{goal.player} - {goal.goalNumber} gol</li>
									{/each}
								</ul>
							</div>
							<div class="w-1/2">
								<h3 class="text-secondary text-center text-lg font-semibold">{match.awayTeam}</h3>
								<ul class="list-inside list-disc">
									{#each match.goalsAway as goal}
										<li>{goal.player} - {goal.goalNumber} gol</li>
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
