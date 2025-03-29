<script>
	import { page } from "$app/stores";
</script>

<div class="hero bg-base-100 min-h-screen">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<!-- <h1 class="text-error text-6xl font-bold">Oops!</h1> -->
			<h1 class="text-error text-6xl font-bold">404</h1>
			<!-- <hr /> -->
			<p class="py-6 text-lg">
				<!-- {$page.error?.message || 'An unexpected error occurred.'} -->
				Sayfa mevcut değil
			</p>
			<a href="/" class="btn btn-primary btn-wide">Ana sayfa</a>
		</div>
	</div>
</div>
