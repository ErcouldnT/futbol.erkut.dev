<script lang='ts'>
  import { page } from '$app/state'
  import {
    allPlayersStore,
    awayTeamNameStore,
    customPlayersStore,
    homeTeamNameStore,
    playersAwayStore,
    playersHomeStore,
  } from '$lib/stores/players'
  import { showSaveModalStore } from '$lib/stores/ui'
  import { Home, LayoutDashboard, RotateCcw, Settings2 } from '@lucide/svelte'

  function resetKadro() {
    // eslint-disable-next-line no-alert
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

<header class='sticky top-4 z-50 mb-10 w-full'>
  <div class='relative flex items-center justify-center'>
    <nav class='w-full group relative overflow-hidden rounded-4xl border border-white/5 bg-linear-to-br from-base-200/80 to-base-300/80 p-px shadow-2xl transition-all duration-500 hover:shadow-primary/5'>
      <div class='relative flex items-center justify-between rounded-[31px] bg-base-200/40 px-4 py-3 backdrop-blur-xl sm:px-6'>

        <!-- Left: Navigation -->
        <div class='flex flex-1 items-center justify-start'>
          {#if page.url.pathname === '/kadro'}
            <button
              onclick={() => showSaveModalStore.set(true)}
              disabled={$playersHomeStore.length === 0 || $playersAwayStore.length === 0}
              class='group/save flex items-center gap-2 rounded-xl bg-warning/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-warning border border-warning/30 transition-all hover:bg-warning hover:text-warning-content active:scale-95 disabled:opacity-30 disabled:grayscale'
            >
              <Settings2 size={14} class='transition-transform duration-500 group-hover/save:rotate-90' />
              <span class='sm:hidden'>Kaydet</span>
              <span class='hidden sm:inline'>Maçı Kaydet</span>
            </button>
          {:else}
            <a
              href='/'
              class='flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/50 transition-all hover:bg-white/5 hover:text-white active:scale-95'
            >
              <Home size={14} />
              <span class='hidden sm:inline'>Ana Sayfa</span>
            </a>
          {/if}
        </div>

        <!-- Center: Spacer for overhanging logo -->
        <div class='w-28 sm:w-36'></div>

        <!-- Right: Actions -->
        <div class='flex flex-1 items-center justify-end'>
          {#if page.url.pathname === '/kadro'}
            <button
              onclick={resetKadro}
              class='group/reset flex items-center gap-2 rounded-xl bg-error/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-error border border-error/20 transition-all hover:bg-error hover:text-white shadow-lg shadow-error/5 active:scale-95'
            >
              <RotateCcw size={14} class='transition-transform duration-500 group-hover/reset:-rotate-180' />
              <span>Sıfırla</span>
            </button>
          {:else}
            <a
              href='/kadro'
              class='group/kadro flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 transition-all hover:bg-primary hover:text-white shadow-lg shadow-primary/5 active:scale-95'
            >
              <LayoutDashboard size={14} class='transition-transform group-hover/kadro:scale-110' />
              <span>Kadro Yap</span>
            </a>
          {/if}
        </div>
      </div>
    </nav>

    <!-- Overhanging Logo -->
    <div class='absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-[48%]'>
      <a href='/' class='transition-transform hover:scale-110 active:scale-95 block'>
        <img
          class='h-20 w-auto sm:h-28 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]'
          src='/favicon.png'
          alt='Akkuyu FC Logo'
        />
      </a>
    </div>
  </div>
</header>
