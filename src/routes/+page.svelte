<script lang="ts">
	let matches = [
		{
			homeTeam: 'Takım 1',
			awayTeam: 'Takım 2',
			score: '0-0',
			date: '28 Mart 2025 Cuma'
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
			</div>
		</div>
	{/each}
</div>
