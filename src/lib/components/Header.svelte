<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<a href="/" class="btn btn-ghost text-xl normal-case">Akkuyu Futbol</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/games">Maçlar</a></li>
			<li><a href="/teams">Takımlar</a></li>
			<li><a href="/players">Oyuncular</a></li>
		</ul>
	</div>
	<div class="navbar-end">
		<button class="btn btn-primary hidden lg:block" on:click={() => goto('/kadro')}
			>Kadro yap</button
		>
		<div class="dropdown dropdown-end lg:hidden">
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16m-7 6h7"
					/>
				</svg>
			</label>
			<ul class="menu menu-compact dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow">
				<li><a href="/games">Maçlar</a></li>
				<li><a href="/teams">Takımlar</a></li>
				<li><a href="/players">Oyuncular</a></li>
				<li><button class="btn btn-primary w-full">Kadro yap</button></li>
			</ul>
		</div>
	</div>
</div>
