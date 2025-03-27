<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Akkuyu Futbol</title>
</svelte:head>

<div class="mx-auto max-w-7xl">
	<Header />
	{@render children()}
</div>
