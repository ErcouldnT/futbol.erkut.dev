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
  ontouchstart={event => startDrag(event, playerData)}
  style='filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));'
>
  <foreignObject x={playerData.posX - 16} y={playerData.posY - 16} width='32' height='32'>
    <div class='avatar'>
      <div class='h-8 w-8 rounded-full'>
        <img
          src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fb.fssta.com%2Fuploads%2Fapplication%2Fsoccer%2Fheadshots%2F885.png&f=1&nofb=1&ipt=9f471ea69d4917e6e6bd8623e7c809aedb7f482cf8901cd071efc6cda978471d'
          alt={playerData.player?.name}
        />
      </div>
    </div>
  </foreignObject>

  <!-- Player's number above the avatar -->
  {#if showPlayerNumbers}
    <text
      class='pointer-events-none font-extrabold font-stretch-semi-expanded'
      x={playerData.posX}
      y={playerData.posY + 25}
      fill={color}
      font-size='10'
      text-anchor='middle'
      dominant-baseline='middle'
    >
      <tspan class='font-bold opacity-85'>{playerData.player?.number}</tspan>
      {#if showPlayerNames}
        <tspan>{playerData.player?.name}</tspan>
      {/if}
    </text>
  {/if}
</g>
