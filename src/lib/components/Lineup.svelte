<script lang='ts'>
  import type { LineupExpand, Player } from '$lib/types'
  import { enhance } from '$app/forms'
  import { playersAwayStore, playersHomeStore } from '$lib/stores/players'

  import SahaSvg from './SahaSvg.svelte'

  const { players = [] }: { players?: Player[] } = $props()

  let playersHome: LineupExpand[] = $state($playersHomeStore)
  let playersAway: LineupExpand[] = $state($playersAwayStore)

  let homeTeamName = $state('Ev sahibi')
  let awayTeamName = $state('Deplasman')

  // Display settings
  const showPlayerNames = $state(true)
  const showPlayerNumbers = $state(true)

  // todo: SAHA nın içine gönder...
  // Drag and drop functionality
  let draggingPlayer: LineupExpand | null = $state(null)

  function startDrag(event: MouseEvent | TouchEvent, player: LineupExpand) {
    event.preventDefault()
    draggingPlayer = player
    window.addEventListener('pointermove', drag, { passive: false })
    window.addEventListener('pointerup', endDrag, { passive: false })
    window.addEventListener('touchmove', drag, { passive: false })
    window.addEventListener('touchend', endDrag, { passive: false })
  }

  function drag(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    if (draggingPlayer) {
      // todo: hiyerarşideki 1. svg yi seçmek yerine daha spesifik bir çözüm bul!
      const svg = document.querySelectorAll('svg')[0]
      if (!svg) {
        console.error('SVG element not found')
        return
      }
      const point = svg.createSVGPoint()
      if (event instanceof MouseEvent) {
        point.x = event.clientX
        point.y = event.clientY
      }
      else if (event instanceof TouchEvent) {
        point.x = event.touches[0].clientX
        point.y = event.touches[0].clientY
      }
      const screenCTM = svg.getScreenCTM()
      if (!screenCTM) {
        console.error('Cannot get screenCTM. Wrong SVG element?')
        return
      }
      const transformedPoint = point.matrixTransform(screenCTM.inverse())

      // Saha sınırlarını kontrol et
      const fieldBounds = { xMin: 10, xMax: 290, yMin: 10, yMax: 490 }
      const newX = Math.max(fieldBounds.xMin, Math.min(fieldBounds.xMax, transformedPoint.x))
      const newY = Math.max(fieldBounds.yMin, Math.min(fieldBounds.yMax, transformedPoint.y))

      // Oyuncunun pozisyonunu güncelle
      draggingPlayer.posX = newX
      draggingPlayer.posY = newY

      // Reassign the players array to trigger reactivity
      playersHome = [...playersHome]
      playersAway = [...playersAway]

      playersHomeStore.set(playersHome)
      playersAwayStore.set(playersAway)
    }
  }

  function endDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    draggingPlayer = null
    window.removeEventListener('pointermove', drag)
    window.removeEventListener('pointerup', endDrag)
    window.removeEventListener('touchmove', drag)
    window.removeEventListener('touchend', endDrag)

  // console.log(playersHome);
    // console.log(playersAway);
  }

  // Randomly generate x and y coordinates for players
  const randomXAndY = (home: boolean) => {
    if (home) {
      return {
        posX: Math.floor(10 + Math.random() * 280),
        posY: Math.floor(10 + Math.random() * 230),
      }
    }
    else {
      return {
        posX: Math.floor(10 + Math.random() * 280),
        posY: Math.floor(260 + Math.random() * 230),
      }
    }
  }

  // Add and remove players from teams
  const addPlayer = (player: Player, team: 'HOME' | 'AWAY') => {
    // console.log(player);

    const teamPlayers = team === 'HOME' ? playersHome : playersAway
    // const teamStore = team === "HOME" ? playersHomeStore : playersAwayStore;

    if (!teamPlayers.some(lineup => lineup.player.id === player.id)) {
      const { posX, posY } = randomXAndY(team === 'HOME')
      // @ts-ignore
      const playerWithXAndY: LineupExpand = {
        id: '', // set by server
        matchId: '', // set by server
        teamId: '', // set by server
        playerId: player.id,
        player,
        posX,
        posY,
        goals: 0,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      // console.log(playerWithXAndY);

      if (team === 'HOME') {
        playersHome = [...playersHome, playerWithXAndY]
        playersHomeStore.set(playersHome)
      // console.log(playersHome);
      }
      else {
        playersAway = [...playersAway, playerWithXAndY]
        playersAwayStore.set(playersAway)
      }
    }
  }

  const removePlayer = (player: Player, team: 'HOME' | 'AWAY') => {
    // console.log(`Removing player ${player.name} from team ${team}`);

    if (team === 'HOME') {
      playersHome = playersHome.filter(lineup => lineup.player.id !== player.id)
      playersHomeStore.set(playersHome)
    }
    else {
      playersAway = playersAway.filter(lineup => lineup.player.id !== player.id)
      playersAwayStore.set(playersAway)
    }
  }

  let isSaving = $state(false)
</script>

<form
  method='POST'
  action='?/saveMatch'
  use:enhance={() => {
    isSaving = true
    return async ({ update }) => {
      isSaving = false
      update()
    }
  }}
>
  <input type='hidden' name='homeTeamName' value={homeTeamName} />
  <input type='hidden' name='awayTeamName' value={awayTeamName} />
  <input type='hidden' name='homePlayers' value={JSON.stringify(playersHome)} />
  <input type='hidden' name='awayPlayers' value={JSON.stringify(playersAway)} />

  <main class='mt-5 flex flex-col items-center justify-center gap-16 lg:flex-row'>
    <div class='flex flex-col items-center gap-2'>
      <input
        type='text'
        bind:value={homeTeamName}
        placeholder='Ev sahibi takım adı'
        class='input input-bordered input-sm text-primary mb-2 w-full text-center font-bold'
        class:border-2={homeTeamName.trim() === ''}
        class:border-red-500={homeTeamName.trim() === ''}
      />

      <ul class='menu menu-vertical bg-base-200/50 rounded-box w-56 gap-1 backdrop-blur-md'>
        {#each players as player (player.id)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <li
            onclick={() => {
              if (playersHome.some(lineup => lineup.player.id === player.id)) {
                removePlayer(player, 'HOME')
              }
              else {
                if (!playersAway.some(lineup => lineup.player.id === player.id)) {
                  addPlayer(player, 'HOME')
                }
              }
            }}
            class='card opacity-30'
            class:opacity-100={playersHome.some(lineup => lineup.player.id === player.id)}
            class:bg-primary={playersHome.some(lineup => lineup.player.id === player.id)}
          >
            <div class='flex items-center justify-between gap-2'>
              <div class='avatar'>
                <div class='h-4 w-4 rounded-full'>
                  <img
                    src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fb.fssta.com%2Fuploads%2Fapplication%2Fsoccer%2Fheadshots%2F885.png&f=1&nofb=1&ipt=9f471ea69d4917e6e6bd8623e7c809aedb7f482cf8901cd071efc6cda978471d'
                    alt={player.name}
                  />
                </div>
              </div>
              <div class='flex-1'>
                <span class='text-xs font-bold'>{player.name}</span>
              </div>
              <span class='text-warning badge text-xs'>{player.number}</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <SahaSvg {playersHome} {playersAway} {showPlayerNames} {showPlayerNumbers} {startDrag} />

    <div class='flex flex-col items-center gap-2'>
      <input
        type='text'
        bind:value={awayTeamName}
        placeholder='Rakip takım adı'
        class='input input-bordered input-sm text-secondary mb-2 w-full text-center font-bold'
        class:border-2={awayTeamName.trim() === ''}
        class:border-red-500={awayTeamName.trim() === ''}
      />

      <ul class='menu menu-vertical bg-base-200/50 rounded-box w-56 gap-1 backdrop-blur-md'>
        {#each players as player (player.id)}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <li
            onclick={() => {
              if (playersAway.some(lineup => lineup.player.id === player.id)) {
                removePlayer(player, 'AWAY')
              }
              else {
                if (!playersHome.some(lineup => lineup.player.id === player.id)) {
                  addPlayer(player, 'AWAY')
                }
              }
            }}
            class='card opacity-30'
            class:opacity-100={playersAway.some(lineup => lineup.player.id === player.id)}
            class:bg-secondary={playersAway.some(lineup => lineup.player.id === player.id)}
          >
            <div class='flex items-center gap-2'>
              <div class='avatar'>
                <div class='h-4 w-4 rounded-full'>
                  <img
                    src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fb.fssta.com%2Fuploads%2Fapplication%2Fsoccer%2Fheadshots%2F885.png&f=1&nofb=1&ipt=9f471ea69d4917e6e6bd8623e7c809aedb7f482cf8901cd071efc6cda978471d'
                    alt={player.name}
                  />
                </div>
              </div>
              <div class='flex-1'>
                <span class='text-xs font-bold'>{player.name}</span>
              </div>
              <span class='text-warning badge text-xs'>{player.number}</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </main>

  <button
    type='submit'
    class='btn btn-warning m-4 mx-auto w-full'
    disabled={playersHome.length === 0 || playersAway.length === 0 || isSaving}
  >
    {#if isSaving}
      <span class='loading loading-spinner'></span>
    {/if}
    Maçı Kaydet
  </button>
</form>
