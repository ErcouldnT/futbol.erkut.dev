<script lang='ts'>
  import type { LineupExpand, Player } from '$lib/types'
  import type { PageData } from './$types'
  import { applyAction, deserialize, enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import {
    awayTeamNameStore,
    customPlayersStore,
    homeTeamNameStore,
    playersAwayStore,
    playersHomeStore,
    allPlayersStore,
  } from '$lib/stores/players'
  import { Plus, Settings2 } from '@lucide/svelte'
  import { titleCase } from '$lib/utils'
  import SahaSvg from './SahaSvg.svelte'

  let { data }: { data: PageData } = $props()

  let playersList = $derived($allPlayersStore)

  let newHomePlayerName = $state('')
  let newAwayPlayerName = $state('')

  let playersHome: LineupExpand[] = $state($playersHomeStore)
  let playersAway: LineupExpand[] = $state($playersAwayStore)

  let homeTeamName = $state($homeTeamNameStore)
  let awayTeamName = $state($awayTeamNameStore)

  // Modal and Match Details state
  let showSaveModal = $state(false)
  let matchTitle = $state('')
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16)
  let matchTime = $state(localISOTime)
  let matchDuration = $state(60)

  function openSaveModal() {
    matchTitle = `${homeTeamName} vs ${awayTeamName}`
    showSaveModal = true
  }

  $effect(() => {
    const formatted = titleCase(homeTeamName)
    if (homeTeamName !== formatted)
      homeTeamName = formatted
    homeTeamNameStore.set(formatted)
  })
  $effect(() => {
    const formatted = titleCase(awayTeamName)
    if (awayTeamName !== formatted)
      awayTeamName = formatted
    awayTeamNameStore.set(formatted)
  })
  $effect(() => {
    const formatted = titleCase(newHomePlayerName)
    if (newHomePlayerName !== formatted)
      newHomePlayerName = formatted
  })
  $effect(() => {
    const formatted = titleCase(newAwayPlayerName)
    if (newAwayPlayerName !== formatted)
      newAwayPlayerName = formatted
  })
  $effect(() => {
    playersHomeStore.set(playersHome)
  })
  $effect(() => {
    playersAwayStore.set(playersAway)
  })

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
      const svg = document.getElementById('field-svg') as unknown as SVGSVGElement
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

    const isOnField = playersHome.some(lineup => lineup.player.id === player.id) ||
                     playersAway.some(lineup => lineup.player.id === player.id)

    if (!isOnField) {
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
      // console.log(playersHome);
      }
      else {
        playersAway = [...playersAway, playerWithXAndY]
      }
    }
  }

  const removePlayer = (player: Player, team: 'HOME' | 'AWAY') => {
    // console.log(`Removing player ${player.name} from team ${team}`);

    if (team === 'HOME') {
      playersHome = playersHome.filter(lineup => lineup.player.id !== player.id)
    }
    else {
      playersAway = playersAway.filter(lineup => lineup.player.id !== player.id)
    }
  }

  function updatePlayerNumber(event: MouseEvent, player: Player) {
    event.stopPropagation()
    // eslint-disable-next-line no-alert
    const newNumberStr = prompt(`${player.name} için yeni numara:`, player.number.toString())
    if (newNumberStr === null)
      return

    const newNumber = parseInt(newNumberStr)
    if (Number.isNaN(newNumber))
      return

    // Update the store (the source of truth for the list)
    allPlayersStore.update(players =>
      players.map(p => p.id === player.id ? { ...p, number: newNumber } : p),
    )

    // Update current session states if they are on the field
    playersHome = playersHome.map(lineup =>
      lineup.player.id === player.id ? { ...lineup, player: { ...lineup.player, number: newNumber } } : lineup,
    )
    playersAway = playersAway.map(lineup =>
      lineup.player.id === player.id ? { ...lineup, player: { ...lineup.player, number: newNumber } } : lineup,
    )
  }

  let isSaving = $state(false)

  async function addNewPlayer(team: 'HOME' | 'AWAY') {
    let name = team === 'HOME' ? newHomePlayerName : newAwayPlayerName
    name = titleCase(name.trim())
    if (!name)
      return

    // 1. Önce halihazırda görünen listede var mı diye bak
    const existingInList = playersList.find(
      p => p.name.trim().toLocaleLowerCase('tr-TR') === name.toLocaleLowerCase('tr-TR'),
    )

    if (existingInList) {
      addPlayer(existingInList, team)
    }
    else {
      // 2. Görünürde yoksa, DB'den kontrol et (fetch ile "sorarak")
      const formData = new FormData()
      formData.append('name', name)

      try {
        const response = await fetch('?/checkPlayer', {
          method: 'POST',
          body: formData,
        })

        const result = deserialize(await response.text())

        if (result.type === 'success' && result.data?.player) {
          // DB'de varsa, gelen gerçek oyuncu verisini kullan
          const p = result.data.player as Player
          allPlayersStore.update(existing => [...existing, p])
          addPlayer(p, team)
        }
        else {
          // 3. DB'de de yoksa yeni oyuncu oluştur
          const newPlayer: Player = {
            id: `temp-${crypto.randomUUID()}`,
            name,
            number: Math.floor(Math.random() * 99) + 1,
            profilePic: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          allPlayersStore.update(existing => [...existing, newPlayer])
          customPlayersStore.update(existing => [...existing, newPlayer])
          addPlayer(newPlayer, team)
        }
      }
      catch (err) {
        console.error('Check player error:', err)
      }
    }

    if (team === 'HOME')
      newHomePlayerName = ''
    else
      newAwayPlayerName = ''
  }
</script>

<form
  method='POST'
  action='?/saveMatch'
  use:enhance={() => {
    isSaving = true
    return async ({ result }) => {
      isSaving = false
      if (result.type === 'redirect' || result.type === 'success') {
        // Reset stores
        homeTeamNameStore.set('')
        awayTeamNameStore.set('')
        playersHomeStore.set([])
        playersAwayStore.set([])
        customPlayersStore.set([])
        allPlayersStore.set([])

        // Absolute forced navigation to home
        setTimeout(() => {
          goto('/')
        }, 100)
      }
      else {
        if (result.type === 'failure') {
          // eslint-disable-next-line no-alert
          alert('Hata: ' + (result.data?.message || 'Bilinmeyen bir hata oluştu'))
        }
        await applyAction(result)
      }
    }
  }}
>
  <input type='hidden' name='homeTeamName' value={titleCase(homeTeamName)} />
  <input type='hidden' name='awayTeamName' value={titleCase(awayTeamName)} />
  <input type='hidden' name='homePlayers' value={JSON.stringify(playersHome)} />
  <input type='hidden' name='awayPlayers' value={JSON.stringify(playersAway)} />
  <input type='hidden' name='title' value={matchTitle} />
  <input type='hidden' name='matchTime' value={matchTime} />
  <input type='hidden' name='duration' value={matchDuration} />

  <main class='mt-5 flex flex-col items-center justify-center gap-16 lg:flex-row'>
    <div class='flex flex-col items-center gap-2'>
      <input
        type='text'
        bind:value={homeTeamName}
        placeholder='Ev sahibi takım adı'
        class='input input-bordered input-sm text-primary mb-2 w-full text-center font-bold'
        class:border-2={homeTeamName.trim() === ''}
        class:border-red-500={homeTeamName.trim() === ''}
        onkeydown={e => e.key === 'Enter' && e.preventDefault()}
      />

      <div class='join mb-2 w-full px-2'>
        <input
          type='text'
          placeholder='Futbolcu ekle...'
          class='input input-bordered input-sm join-item flex-1'
          bind:value={newHomePlayerName}
          onkeydown={e => e.key === 'Enter' && (e.preventDefault(), addNewPlayer('HOME'))}
        />
        <button type='button' class='btn btn-sm join-item' onclick={() => addNewPlayer('HOME')}>
          <Plus size={16} />
        </button>
      </div>

      <ul class='menu menu-vertical bg-base-200/50 rounded-box w-56 gap-1 backdrop-blur-md'>
        {#each playersList as player (player.id)}
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
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <span
                onclick={e => updatePlayerNumber(e, player)}
                class='text-warning badge cursor-pointer text-xs transition-colors hover:bg-warning hover:text-warning-content'
              >
                {player.number}
              </span>
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
        onkeydown={e => e.key === 'Enter' && e.preventDefault()}
      />

      <div class='join mb-2 w-full px-2'>
        <input
          type='text'
          placeholder='Futbolcu ekle...'
          class='input input-bordered input-sm join-item flex-1'
          bind:value={newAwayPlayerName}
          onkeydown={e => e.key === 'Enter' && (e.preventDefault(), addNewPlayer('AWAY'))}
        />
        <button type='button' class='btn btn-sm join-item' onclick={() => addNewPlayer('AWAY')}>
          <Plus size={16} />
        </button>
      </div>

      <ul class='menu menu-vertical bg-base-200/50 rounded-box w-56 gap-1 backdrop-blur-md'>
        {#each playersList as player (player.id)}
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
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <span
                onclick={e => updatePlayerNumber(e, player)}
                class='text-warning badge cursor-pointer text-xs transition-colors hover:bg-warning hover:text-warning-content'
              >
                {player.number}
              </span>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </main>

  <button
    type='button'
    class='btn btn-warning m-4 mx-auto w-full'
    disabled={playersHome.length === 0 || playersAway.length === 0 || isSaving}
    onclick={openSaveModal}
  >
    {#if isSaving}
      <span class='loading loading-spinner'></span>
    {/if}
    Maçı Kaydet
  </button>

  {#if showSaveModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <dialog
      class='modal modal-open modal-bottom sm:modal-middle backdrop-blur-sm'
      onclick={() => (showSaveModal = false)}
    >
      <div class='modal-box border-warning/20 border text-left' onclick={e => e.stopPropagation()}>
        <h3 class='text-warning flex items-center gap-2 text-xl font-bold'>
          <Settings2 size={24} />
          Maç Detayları
        </h3>
        <p class='py-2 text-sm opacity-60'>Lütfen maç bilgilerini doğrulayın veya eksikleri tamamlayın.</p>

        <div class='mt-4 flex flex-col gap-4'>
          <div class='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <label class='form-control w-full'>
              <div class='label'>
                <span class='label-text font-semibold'>Ev Sahibi Takım</span>
              </div>
              <input
                type='text'
                bind:value={homeTeamName}
                class='input input-bordered w-full focus:input-warning transition-all'
              />
            </label>
            <label class='form-control w-full'>
              <div class='label'>
                <span class='label-text font-semibold'>Rakip Takım</span>
              </div>
              <input
                type='text'
                bind:value={awayTeamName}
                class='input input-bordered w-full focus:input-warning transition-all'
              />
            </label>
          </div>

          <label class='form-control w-full'>
            <div class='label'>
              <span class='label-text font-semibold'>Maç Başlığı</span>
            </div>
            <input
              type='text'
              bind:value={matchTitle}
              placeholder={`${homeTeamName} vs ${awayTeamName}`}
              class='input input-bordered w-full focus:input-warning transition-all'
            />
          </label>

          <div class='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <label class='form-control w-full'>
              <div class='label'>
                <span class='label-text font-semibold'>Maç Saati</span>
              </div>
              <input
                type='datetime-local'
                bind:value={matchTime}
                class='input input-bordered w-full focus:input-warning transition-all'
              />
            </label>

            <label class='form-control w-full'>
              <div class='label'>
                <span class='label-text font-semibold'>Süre (Dk)</span>
              </div>
              <input
                type='number'
                bind:value={matchDuration}
                placeholder='60'
                min='1'
                class='input input-bordered w-full focus:input-warning transition-all'
              />
            </label>
          </div>
        </div>

        <div class='modal-action gap-2'>
          <button type='button' class='btn btn-ghost' onclick={() => (showSaveModal = false)}>
            Vazgeç
          </button>
          <button
            type='submit'
            class='btn btn-warning px-8'
            disabled={isSaving}
          >
            {#if isSaving}
              <span class='loading loading-spinner'></span>
            {/if}
            Maçı Oluştur
          </button>
        </div>
      </div>
    </dialog>
  {/if}
</form>
