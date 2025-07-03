<script lang="ts">
	import type { Comment } from "$lib/types";
	import { onMount } from "svelte";
	import { pb } from "$lib/pb";

	export let matchId: string;

	let comments: Comment[] = [];
	let newComment = "";
	let username = "";
	let loading = true;

	onMount(async () => {
		try {
			// matchId’ye göre yorumları sırayla al
			const data = await pb.collection<Comment>("comments").getFullList({
				filter: `match="${matchId}"`,
				sort: "+created" // yeni yorumlar en altta olsun
			});
			comments = [...data];
		} catch (err) {
			console.error("Yorumlar çekilemedi:", err);
		} finally {
			loading = false;
		}
	});

	async function submitComment() {
		if (!newComment.trim()) return;

		const payload = {
			content: newComment.trim(),
			match: matchId,
			username: username.trim() || "Anonim"
		};

		try {
			const created = await pb.collection<Comment>("comments").create(payload);
			comments = [...comments, created]; // yeni yorumu listeye ekle
			newComment = "";
		} catch (error) {
			// console.error("Yorum eklenirken hata oluştu:", error.message || error);
		}
	}
</script>

<main class="py-5 text-center">
	{#if loading}
		<div class="flex items-center justify-center py-10">
			<span class="loading loading-spinner text-primary"></span>
		</div>
	{:else if comments.length === 0}
		<p class="text-sm text-gray-400">Henüz yorum yok.</p>
	{/if}

	<ul class="mx-auto max-w-xl space-y-4 text-left">
		{#each comments as comment}
			<li class="dark:bg-neutral flex items-start gap-3 rounded-lg bg-white p-3 shadow-md">
				<!-- <div class="flex-shrink-0">
					<div class="avatar placeholder">
						<div class="bg-neutral-focus text-neutral-content w-8 rounded-full">
							<span>{comment.username.charAt(0).toUpperCase()}</span>
						</div>
					</div>
				</div> -->
				<div>
					<div class="text-primary text-sm font-semibold">{comment.username}</div>
					<div class="text-sm text-gray-700 dark:text-gray-300">{comment.content}</div>
				</div>
			</li>
		{/each}
	</ul>

	<form on:submit|preventDefault={submitComment} class="mt-4 flex flex-col items-center gap-2">
		<input
			type="text"
			bind:value={username}
			placeholder="Rumuz"
			class="input input-bordered w-full max-w-xs"
		/>
		<input
			type="text"
			bind:value={newComment}
			placeholder="Yorumunu yaz..."
			class="input input-bordered w-full max-w-xs"
		/>
		<button type="submit" class="btn btn-success w-full max-w-xs">Gönder</button>
	</form>
</main>
