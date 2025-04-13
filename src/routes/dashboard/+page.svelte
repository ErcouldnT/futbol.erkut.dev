<script lang="ts">
	import { goto } from "$app/navigation";

	export let data;
	const supabase = data.supabase;

	async function handleLogout() {
		await supabase.auth.signOut();
		goto("/");
	}

	// oyuncu ekle
	// takım ekle
	// maç ekle

	// maç düzenle
	// oyuncu düzenle
	// takım düzenle
</script>

<main class="flex min-h-screen flex-col items-center gap-5">
	<button on:click={handleLogout} class="btn btn-outline btn-error mt-4">Çıkış Yap</button>
</main>
