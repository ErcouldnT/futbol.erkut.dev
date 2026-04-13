<script lang='ts'>
  import { Heart } from '@lucide/svelte'
</script>

<footer class='group relative mt-16 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-base-200/80 to-base-300/80 p-px shadow-2xl transition-all duration-500'>
  <div class='relative overflow-hidden rounded-[23px] bg-base-200/40 backdrop-blur-xl py-12 px-8'>
    <!-- Header Decor from MatchCard flavor -->
    <div class='absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none'></div>

    <div class='relative z-10 flex flex-col items-center gap-8'>
      <!-- Branding Area -->
      <div class='flex flex-col items-center gap-2'>
        <h3 class='text-xl font-black uppercase tracking-[0.4em] text-white/90'>
          Akkuyu Futbol
        </h3>
        <p class='text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60'>
          Professional Match Management
        </p>
      </div>

      <!-- Main Content -->
      <div class='flex flex-col items-center gap-4'>
        <p class='flex items-center gap-2 text-sm font-medium text-white/50'>
          <span>Developed by</span>
          <span class='flex items-center gap-1.5 font-bold text-white tracking-tight'>
            Erkut
            <span class='relative flex h-3.5 w-3.5 items-center justify-center'>
              <Heart size={14} class='absolute text-error animate-ping opacity-20' />
              <Heart size={14} class='relative text-error fill-error/20' />
            </span>
          </span>
        </p>

        <!-- Stats Bars -->
        <div class='flex flex-col items-center gap-4'>
          <!-- Location -->
          <div class='flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 pt-2'>
            <span>Moskova</span>
            <span class='h-1 w-1 rounded-full bg-white/10'></span>
            <span>{new Date().getFullYear()}</span>
          </div>

          <!-- Status en altta -->
          <div class='flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-3 py-1 scale-90'>
            <div class='h-1.5 w-1.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]'></div>
            <span class='text-[9px] font-black uppercase tracking-tighter text-success/80'>System Operational</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
