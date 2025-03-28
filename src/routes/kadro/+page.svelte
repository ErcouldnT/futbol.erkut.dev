<script lang="ts">
	import Saha from '$lib/components/Saha.svelte';
	import type { Player } from '$lib/types';

	let playersHome: Player[] = [
		{ id: 1, name: 'Ahmet', number: 10, x: 100, y: 100, color: 'blue' },
		{ id: 2, name: 'Mehmet', number: 8, x: 150, y: 250, color: 'blue' },
		{ id: 3, name: 'Ali', number: 7, x: 100, y: 150, color: 'blue' },
		{ id: 4, name: 'Veli', number: 5, x: 100, y: 200, color: 'blue' },
		{ id: 5, name: 'Hasan', number: 11, x: 150, y: 75, color: 'blue' },
		{ id: 6, name: 'Hüseyin', number: 6, x: 150, y: 175, color: 'blue' }
	];

	let playersAway: Player[] = [
		{ id: 7, name: 'Fatma', number: 9, x: 100, y: 350, color: 'red' },
		{ id: 8, name: 'Ayşe', number: 4, x: 140, y: 400, color: 'red' },
		{ id: 9, name: 'Zeynep', number: 3, x: 230, y: 450, color: 'red' },
		{ id: 10, name: 'Elif', number: 2, x: 280, y: 300, color: 'red' },
		{ id: 11, name: 'Merve', number: 12, x: 350, y: 375, color: 'red' },
		{ id: 12, name: 'Cemre', number: 1, x: 250, y: 475, color: 'red' }
	];

	// let playersTogether = [...playersHome, ...playersAway];
</script>

<p class="m-8 text-center"></p>
<Saha {playersHome} {playersAway} />
