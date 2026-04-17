<script lang='ts'>
  import type { LineupExpand } from '$lib/types'

  const {
    playerData,
    color,
    index,
    rotate = false,
    showPlayerNames = true,
    showPlayerNumbers = true,
    startDrag = () => null,
  }: {
    playerData: LineupExpand
    color: string
    index: number
    rotate?: boolean
    showPlayerNames?: boolean
    showPlayerNumbers?: boolean
    startDrag?: (event: PointerEvent | TouchEvent, player: LineupExpand) => void
  } = $props()

</script>

<!-- Circle representing the player -->
<g
  class={rotate ? 'origin-center cursor-pointer transform-fill lg:rotate-90' : 'cursor-move'}
  tabindex={index}
  aria-label={`Drag ${playerData.player?.name} player`}
  role='button'
  onpointerdown={event => startDrag(event, playerData)}
  style='filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5)); touch-action: none;'
>
  <!-- Invisible hit area for reliable pointer/touch events -->
  <circle cx={playerData.posX} cy={playerData.posY} r='28' fill='transparent' />
  <foreignObject x={playerData.posX - 22} y={playerData.posY - 22} width='44' height='44' style='pointer-events: none;'>
    <div class='flex h-full w-full items-center justify-center'>
      <div
        class='relative h-10 w-10 rounded-full border-2 bg-base-300 shadow-xl transition-transform hover:scale-110 active:scale-95'
        style='border-color: {color}; box-shadow: 0 0 20px {color}60;'
      >
        <img
          src='https://api.dicebear.com/7.x/avataaars/svg?seed={playerData.player?.name}'
          alt={playerData.player?.name}
          class='rounded-full pointer-events-none'
          draggable='false'
        />

        <!-- Goal Badge -->
        {#if playerData.goals > 0}
          <div class='absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-base-300 border border-white/20 shadow-lg text-[10px] pointer-events-none'>
            ⚽
            {#if playerData.goals > 1}
              <span class='absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-black text-white border border-white/20 shadow-sm'>
                {playerData.goals}
              </span>
            {/if}
          </div>
        {/if}

        <!-- Selection/Drag Indicator -->
        <div class='absolute -inset-1.5 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity'></div>
      </div>
    </div>
  </foreignObject>

  <!-- Player's name/number below the avatar (enlarged) -->
  {#if showPlayerNumbers || showPlayerNames}
    <g transform='translate({playerData.posX}, {playerData.posY + 30})'>
      <rect
        x='-30'
        y='-10'
        width='60'
        height='20'
        rx='10'
        fill='black'
        opacity='0.6'
      />
      <text
        class='pointer-events-none font-black uppercase tracking-tight'
        fill='white'
        font-size='10'
        text-anchor='middle'
        dominant-baseline='middle'
      >
        {#if showPlayerNumbers && showPlayerNames}
          {playerData.player?.number}. {playerData.player?.name?.split(' ')[0]}
        {:else if showPlayerNumbers}
          {playerData.player?.number}
        {:else}
          {playerData.player?.name?.split(' ')[0]}
        {/if}
      </text>
    </g>
  {/if}
</g>
