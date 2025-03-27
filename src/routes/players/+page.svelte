<script lang="ts">
	import { supabase } from '$lib/supabase';

	let players = [];
	let loading = true;

	// Fetch players from Supabase
	const fetchPlayers = async () => {
		const { data, error } = await supabase.from('players').select('name, number');
		if (error) {
			console.error('Error fetching players:', error);
		} else {
			players = data;
		}
		loading = false;
	};

	fetchPlayers();
</script>

<!-- Responsive player list -->
<div class="container mx-auto p-4">
	{#if loading}
		<div class="flex justify-center">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if players.length === 0}
		<p class="text-center text-gray-500">Hiç oyuncu bulunamadı.</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each players as player}
				<div class="card bg-base-300 shadow-md">
					<div class="card-body flex flex-row items-center gap-4">
						<!-- Avatar on the left -->
						<div class="avatar">
							<div class="mask mask-square card h-32 w-24">
								<img src="https://picsum.photos/200/300?random={player.number}" alt={player.name} />
							</div>
						</div>
						<!-- Player details on the right -->
						<div>
							<h2 class="card-title text-primary-content">{player.name}</h2>
							<p class="text-primary-content">
								Numara: <span class="font-bold">{player.number}</span>
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
