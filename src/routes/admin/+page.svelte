<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	export let data;
	const supabase = data.supabase;

	let email = "";
	let password = "";
	let emailInput: HTMLInputElement;

	async function handleLogin(event: Event) {
		event.preventDefault();

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			alert("Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.");
			return console.error("Login error:", error.message);
		} else {
			goto("/dashboard");
		}
	}

	onMount(() => {
		emailInput?.focus();
	});
</script>

<main class="min-h-screen p-5">
	<form
		on:submit={handleLogin}
		class="bg-base-100/50 card mx-auto max-w-md space-y-6 p-8 shadow-xl drop-shadow-md"
	>
		<h2 class="text-center font-bold">Yönetici paneli</h2>

		<div class="form-control">
			<label class="label" for="email">
				<span class="label-text text-xs">Email</span>
			</label>
			<input
				bind:value={email}
				bind:this={emailInput}
				id="email"
				type="email"
				placeholder="me@erkut.dev"
				required
				class="input input-bordered w-full"
			/>
		</div>

		<div class="form-control">
			<label class="label" for="password">
				<span class="label-text text-xs">Şifre</span>
			</label>
			<input
				bind:value={password}
				id="password"
				type="password"
				placeholder="••••••••"
				required
				class="input input-bordered w-full"
			/>
		</div>

		<div class="flex flex-col gap-4">
			<button type="submit" class="btn btn-primary w-full">Giriş Yap</button>
		</div>
	</form>
</main>
