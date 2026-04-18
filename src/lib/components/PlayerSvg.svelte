<script lang='ts'>
  import type { LineupExpand } from '$lib/types'

  const {
    playerData,
    color,
    index,
    rotate = false,
    showPlayerNames = true,
    showPlayerNumbers = true,
    isJerseyGoal = false,
    isMvp = false,
    startDrag = () => null,
  }: {
    playerData: LineupExpand
    color: string
    index: number
    rotate?: boolean
    showPlayerNames?: boolean
    showPlayerNumbers?: boolean
    isJerseyGoal?: boolean
    isMvp?: boolean
    startDrag?: (event: PointerEvent | TouchEvent, player: LineupExpand) => void
  } = $props()

  const px = $derived(playerData.posX)
  const py = $derived(playerData.posY)
</script>

<g
  class={rotate ? 'origin-center cursor-pointer transform-fill lg:rotate-90' : 'cursor-move'}
  tabindex={index}
  aria-label={`Drag ${playerData.player?.name} player`}
  role='button'
  onpointerdown={event => startDrag(event, playerData)}
  style='touch-action: none;'
>
  <!-- Invisible hit area -->
  <circle cx={px} cy={py} r='28' fill='transparent' />

  <!-- Player avatar -->
  <foreignObject x={px - 20} y={py - 20} width='40' height='40' style='pointer-events: none;'>
    <div style='width: 40px; height: 40px; border-radius: 50%; border: 2.5px solid {color}; box-shadow: 0 0 16px {color}60, 0 2px 8px rgba(0,0,0,0.5); overflow: hidden; background: #1d232a;'>
      <img
        src='https://api.dicebear.com/7.x/avataaars/svg?seed={playerData.player?.name}'
        alt={playerData.player?.name}
        style='width: 100%; height: 100%; border-radius: 50%; display: block;'
        draggable='false'
      />
    </div>
  </foreignObject>

  <!-- MVP Crown - above avatar -->
  {#if isMvp}
    <text
      x={px}
      y={py - 21}
      text-anchor='middle'
      font-size='14'
      style='filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8));'
    >👑</text>
  {/if}

  <!-- Goal badge - top right -->
  {#if playerData.goals > 0}
    <circle cx={px + 15} cy={py - 15} r='9' fill='#1d232a' stroke='white' stroke-width='0.5' opacity='0.9' />
    <text x={px + 15} y={py - 15} text-anchor='middle' dominant-baseline='central' font-size='9'>⚽</text>
    {#if playerData.goals > 1}
      <circle cx={px + 22} cy={py - 8} r='6' fill={color} stroke='#1d232a' stroke-width='1' />
      <text
        x={px + 22}
        y={py - 8}
        text-anchor='middle'
        dominant-baseline='central'
        font-size='7'
        fill='white'
        font-weight='900'
      >{playerData.goals}</text>
    {/if}
  {/if}

  <!-- Jersey Goal badge - top left -->
  {#if isJerseyGoal}
    <circle cx={px - 15} cy={py - 15} r='9' fill='#1d232a' stroke='white' stroke-width='0.5' opacity='0.9' />
    <text x={px - 15} y={py - 15} text-anchor='middle' dominant-baseline='central' font-size='9'>👕</text>
  {/if}

  <!-- Player name/number label -->
  {#if showPlayerNumbers || showPlayerNames}
    <rect
      x={px - 30}
      y={py + 20}
      width='60'
      height='18'
      rx='9'
      fill='black'
      opacity='0.7'
    />
    <text
      x={px}
      y={py + 29}
      fill='white'
      font-size='9'
      font-weight='900'
      text-anchor='middle'
      dominant-baseline='middle'
      style='font-family: system-ui, -apple-system, sans-serif; text-transform: uppercase; letter-spacing: -0.02em;'
    >
      {#if showPlayerNumbers && showPlayerNames}
        {playerData.player?.number} {playerData.player?.name?.split(' ')[0]}
      {:else if showPlayerNumbers}
        {playerData.player?.number}
      {:else}
        {playerData.player?.name?.split(' ')[0]}
      {/if}
    </text>
  {/if}
</g>
