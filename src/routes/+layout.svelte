<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
	import Footer from "$lib/components/Footer.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>Akkuyu Futbol</title>
	<meta
		name="description"
		content="Akkuyu Futbol dünyasından en güncel haberler, skorlar ve takım oluşturma araçları."
	/>
	<meta name="keywords" content="football, Akkuyu, sports, news, scores, updates" />
	<meta name="author" content="Ercode Tech" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta property="og:title" content="Akkuyu Futbol" />
	<meta
		property="og:description"
		content="Akkuyu Futbol dünyasından en güncel haberler, skorlar ve takım oluşturma araçları."
	/>
	<meta property="og:image" content="/favicon.png" />
	<meta property="og:url" content="https://futbol.erkut.dev" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Akkuyu Futbol" />
	<meta
		name="twitter:description"
		content="Akkuyu Futbol dünyasından en güncel haberler, skorlar ve takım oluşturma araçları."
	/>
	<meta name="twitter:image" content="/favicon.png" />
</svelte:head>

<div class="mx-auto min-h-screen max-w-5xl">
	<Header />
	<div class="divider text-sm opacity-50">Akkuyu FC</div>
	{@render children()}
	<Footer />
</div>
