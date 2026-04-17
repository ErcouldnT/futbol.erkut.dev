<script lang='ts'>
  import { Heart } from '@lucide/svelte'
</script>

<footer class='mt-16 mb-8 flex flex-col items-center justify-center gap-4 px-4'>
  <div class='group/sig flex cursor-pointer items-center gap-6 rounded-2xl border border-white/10 bg-base-200/80 px-10 py-4 shadow-xl backdrop-blur-md transition-all hover:bg-base-200'>
    <span class='w-24 text-right text-[10px] font-black uppercase tracking-[0.4em] mr-[-0.4em] text-white/20 transition-colors group-hover/sig:text-white/40 font-mono'>Moskova</span>
    <div class='relative flex h-6 w-6 shrink-0 items-center justify-center'>
      <Heart size={24} class='absolute text-error animate-ping opacity-20' />
      <Heart size={24} class='relative text-error fill-error/30' />
    </div>
    <span class='w-24 text-left text-[10px] font-black uppercase tracking-[0.8em] mr-[-0.8em] text-white/20 transition-colors group-hover/sig:text-white/40 font-mono'>Erkut</span>
  </div>
</footer>
