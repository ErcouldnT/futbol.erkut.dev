<script lang='ts'>
  import { page } from '$app/state'
  import {
    awayTeamNameStore,
    customPlayersStore,
    homeTeamNameStore,
    playersAwayStore,
    playersHomeStore,
    allPlayersStore,
  } from '$lib/stores/players'

  function resetKadro() {
    if (confirm('Bütün kadroyu sıfırlamak istediğinize emin misiniz?')) {
      homeTeamNameStore.set('')
      awayTeamNameStore.set('')
      playersHomeStore.set([])
      playersAwayStore.set([])
      customPlayersStore.set([])
      allPlayersStore.set([])
      
      // Depoların güncellendiğinden emin olmak için çok kısa bir gecikme
      setTimeout(() => {
        window.location.reload()
      }, 50)
    }
  }
</script>

<main class='navbar bg-base-100/0 p-0 backdrop-blur-md'>
  <h1 class='navbar-start place-self-end'>
    <a href='/' class='btn btn-sm btn-soft mx-0.5'>Ana Sayfa</a>
  </h1>
  <div class='navbar-center'>
    <a class='mt-1.5 -mb-3' href='/'>
      <img class='w-36' src='/favicon.png' alt='Akkuyu FC Logo' />
    </a>
  </div>
  <div class='navbar-end place-self-end'>
    {#if page.url.pathname === '/kadro'}
      <button onclick={resetKadro} class='btn btn-error btn-sm mx-0.5'>Sıfırla</button>
    {:else}
      <a href='/kadro' class='btn btn-soft btn-sm mx-0.5'>Kadro yap</a>
    {/if}
  </div>
</main>
