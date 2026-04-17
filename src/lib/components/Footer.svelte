<script lang='ts'>
  import { page } from '$app/stores'
  import { isSharingLineup, shareLineupTrigger } from '$lib/stores/ui'
  import { Heart, Share2 } from '@lucide/svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'

  function handleShare() {
    shareLineupTrigger.update(n => n + 1)
  }
</script>

<footer class='mt-16 mb-8 flex flex-col items-center justify-center gap-6 px-4'>
  {#if $page.url.pathname === '/kadro'}
    <button
      onclick={handleShare}
      disabled={$isSharingLineup}
      class='group flex items-center gap-3 rounded-2xl border border-warning/20 bg-warning/10 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-warning shadow-xl backdrop-blur-md transition-all hover:bg-warning hover:text-warning-content active:scale-95 disabled:opacity-50'
    >
      {#if $isSharingLineup}
        <LoadingSpinner size='sm' color='text-warning group-hover:text-warning-content' />
        Hazırlanıyor...
      {:else}
        <Share2 size={18} class='transition-transform group-hover:scale-110' />
        Kadro Paylaş
      {/if}
    </button>
  {/if}

  <div class='group/sig flex cursor-pointer items-center gap-6 rounded-2xl border border-white/10 bg-base-200/80 px-10 py-4 shadow-xl backdrop-blur-md transition-all hover:bg-base-200'>
    <span class='w-24 text-right text-[10px] font-black uppercase tracking-[0.4em] mr-[-0.4em] text-white/20 transition-colors group-hover/sig:text-white/40 font-mono'>Moskova</span>
    <div class='relative flex h-6 w-6 shrink-0 items-center justify-center'>
      <Heart size={24} class='absolute text-error animate-ping opacity-20' />
      <Heart size={24} class='relative text-error fill-error/30' />
    </div>
    <span class='w-24 text-left text-[10px] font-black uppercase tracking-[0.8em] mr-[-0.8em] text-white/20 transition-colors group-hover/sig:text-white/40 font-mono'>Erkut</span>
  </div>
</footer>
