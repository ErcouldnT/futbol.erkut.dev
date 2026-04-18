<script lang='ts'>
  import type { LineupExpand, Player } from '$lib/types'
  import { applyAction, deserialize, enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import {
    allPlayersStore,
    awayTeamNameStore,
    customPlayersStore,
    homeTeamNameStore,
    playersAwayStore,
    playersHomeStore,
  } from '$lib/stores/players'
  import { isSharingLineup, shareLineupTrigger, showSaveModalStore } from '$lib/stores/ui'
  import { titleCase } from '$lib/utils'
  import { Plus, Settings2 } from '@lucide/svelte'
  import { domToPng } from 'modern-screenshot'
  import { onMount } from 'svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'
  import SahaSvg from './SahaSvg.svelte'

  onMount(() => {
    shareLineupTrigger.set(0)
  })

  const playersList = $derived($allPlayersStore)

  let newHomePlayerName = $state('')
  let newAwayPlayerName = $state('')

  let playersHome: LineupExpand[] = $state($playersHomeStore)
  let playersAway: LineupExpand[] = $state($playersAwayStore)

  let homeTeamName = $state($homeTeamNameStore || 'Takım 1')
  let awayTeamName = $state($awayTeamNameStore || 'Takım 2')

  // Modal and Match Details state
  let showSaveModal = $state(false)
  $effect(() => {
    showSaveModal = $showSaveModalStore
  })
  $effect(() => {
    showSaveModalStore.set(showSaveModal)
  })

  let matchTitle = $state('Halısaha')
  const now = new Date()
  const tzOffset = now.getTimezoneOffset() * 60000
  const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16)
  let matchTime = $state(localISOTime)
  let matchDate = $state(localISOTime.slice(0, 10))
  let matchTimeOnly = $state(localISOTime.slice(11, 16))

  $effect(() => {
    matchTime = `${matchDate}T${matchTimeOnly}`
  })

  let matchDuration = $state(60)

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

  function startDrag(event: PointerEvent | TouchEvent, player: LineupExpand) {
    event.preventDefault()
    draggingPlayer = player
    window.addEventListener('pointermove', drag, { passive: false })
    window.addEventListener('pointerup', endDrag, { passive: false })
  }

  function drag(event: PointerEvent) {
    event.preventDefault()
    if (draggingPlayer) {
      const svg = document.getElementById('field-svg') as unknown as SVGSVGElement
      if (!svg)
        return

      const point = svg.createSVGPoint()
      point.x = event.clientX
      point.y = event.clientY

      const screenCTM = svg.getScreenCTM()
      if (!screenCTM)
        return

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

  function endDrag(event: PointerEvent) {
    event.preventDefault()
    draggingPlayer = null
    window.removeEventListener('pointermove', drag)
    window.removeEventListener('pointerup', endDrag)
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

    const isOnField = playersHome.some(lineup => lineup.player.id === player.id)
      || playersAway.some(lineup => lineup.player.id === player.id)

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

    const newNumber = Number.parseInt(newNumberStr)
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

  async function inlineExternalImages(container: Element) {
    const images = container.querySelectorAll('img[src^="http"]') as NodeListOf<HTMLImageElement>
    await Promise.all(Array.from(images).map(async (img) => {
      try {
        const res = await fetch(img.src)
        const blob = await res.blob()
        const dataUri = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
        img.src = dataUri
      }
      catch {
      // skip if fetch fails
      }
    }))
  }

  async function handleShareLineup() {
    const element = document.getElementById('field-svg')
    if (!element)
      return

    isSharingLineup.set(true)
    try {
      await inlineExternalImages(element)
      await new Promise(resolve => setTimeout(resolve, 50))

      const dataUrl = await domToPng(element, {
        scale: 3,
      })

      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'kadro.png', { type: 'image/png' })

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Kadro',
          text: `${homeTeamName} vs ${awayTeamName} | Akkuyu Futbol`,
        })
      }
      else {
        // Fallback: download
        const link = document.createElement('a')
        link.download = `kadro-${homeTeamName}-${awayTeamName}.png`.toLowerCase()
        link.href = dataUrl
        link.click()
      }
    }
    catch (err) {
      console.error('Share failed:', err)
    }
    finally {
      isSharingLineup.set(false)
    }
  }

  $effect(() => {
    if ($shareLineupTrigger > 0) {
      handleShareLineup()
      shareLineupTrigger.set(0)
    }
  })
</script>

<svelte:window onkeydown={e => e.key === 'Escape' && (showSaveModal = false)} />

<form
  method='POST'
  action='?/saveMatch'
  use:enhance={() => {
    isSaving = true
    return async ({ result }) => {
      isSaving = false
      if (result.type === 'redirect' || result.type === 'success') {
        // Modal'ı kapat
        showSaveModalStore.set(false)

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
          alert(`Hata: ${result.data?.message || 'Bilinmeyen bir hata oluştu'}`)
        }
        await applyAction(result)
      }
    }
  }}
>
  <input type='hidden' name='homeTeamName' value={titleCase(homeTeamName.trim()) || 'Takım 1'} />
  <input type='hidden' name='awayTeamName' value={titleCase(awayTeamName.trim()) || 'Takım 2'} />
  <input type='hidden' name='homePlayers' value={JSON.stringify(playersHome)} />
  <input type='hidden' name='awayPlayers' value={JSON.stringify(playersAway)} />
  <input type='hidden' name='title' value={matchTitle.trim() || 'Halısaha'} />
  <input type='hidden' name='matchTime' value={matchTime} />
  <input type='hidden' name='duration' value={matchDuration} />

  <main class='mt-8 flex flex-wrap items-start justify-center gap-x-4 gap-y-8 lg:flex-nowrap lg:gap-12'>
    <!-- Home Team Column -->
    <div class='flex w-[calc(50%-0.5rem)] flex-col gap-4 lg:w-72 order-1'>
      <div class='group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-3 sm:p-5 shadow-xl backdrop-blur-xl'>
        <div class='absolute inset-0 bg-linear-to-br from-primary/10 to-transparent pointer-events-none'></div>

        <div class='relative flex flex-col gap-4'>
          <input
            type='text'
            bind:value={homeTeamName}
            placeholder='Ev Sahibi'
            class='w-full bg-transparent text-center text-sm sm:text-lg lg:text-xl font-black uppercase tracking-widest sm:tracking-[0.2em] text-primary outline-none placeholder:opacity-20'
            onkeydown={e => e.key === 'Enter' && e.preventDefault()}
          />

          <div class='flex items-center gap-2'>
            <div class='relative flex-1'>
              <input
                type='text'
                placeholder='Oyuncu ekle...'
                class='w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-medium outline-none transition-all focus:bg-white/10'
                bind:value={newHomePlayerName}
                onkeydown={e => e.key === 'Enter' && (e.preventDefault(), addNewPlayer('HOME'))}
              />
            </div>
            <button
              type='button'
              class='flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary transition-all hover:bg-primary hover:text-white active:scale-95'
              onclick={() => addNewPlayer('HOME')}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <div class='custom-scrollbar flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-1'>
        {#each playersList as player (player.id)}
          <div
            role='button'
            tabindex='0'
            onclick={() => {
              if (playersHome.some(lineup => lineup.player.id === player.id)) {
                removePlayer(player, 'HOME')
              }
              else if (!playersAway.some(lineup => lineup.player.id === player.id)) {
                addPlayer(player, 'HOME')
              }
            }}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (playersHome.some(lineup => lineup.player.id === player.id)) {
                  removePlayer(player, 'HOME')
                }
                else if (!playersAway.some(lineup => lineup.player.id === player.id)) {
                  addPlayer(player, 'HOME')
                }
              }
            }}
            class="group/player relative overflow-hidden rounded-2xl border p-3 text-left transition-all backdrop-blur-xl hover:bg-white/10 active:scale-98 {playersHome.some(lineup => lineup.player.id === player.id) ? 'bg-primary/20 border-primary/30 shadow-lg' : 'bg-white/5 border-white/5 opacity-40'}"
          >
            <div class='flex items-center gap-3'>
              <div class='avatar'>
                <div class='h-8 w-8 rounded-full border border-white/10'>
                  <img
                    src='https://api.dicebear.com/7.x/avataaars/svg?seed={player.name}'
                    alt={player.name}
                  />
                </div>
              </div>
              <div class='flex flex-1 flex-col'>
                <span class='text-xs font-bold text-white/90'>{player.name}</span>
                <span class='text-[10px] font-medium text-white/30 uppercase'>Oyuncu</span>
              </div>
              <button
                type='button'
                class='flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-[10px] font-black text-warning transition-colors group-hover/player:bg-warning group-hover/player:text-warning-content'
                onclick={(e) => {
                  e.stopPropagation()
                  updatePlayerNumber(e, player)
                }}
              >
                {player.number}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Pitch Area -->
    <div class='relative flex w-full flex-col items-center gap-6 lg:w-auto order-3 lg:order-2'>
      <SahaSvg {playersHome} {playersAway} {showPlayerNames} {showPlayerNumbers} {startDrag} />
    </div>

    <!-- Away Team Column -->
    <div class='flex w-[calc(50%-0.5rem)] flex-col gap-4 lg:w-72 order-2 lg:order-3'>
      <div class='group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-3 sm:p-5 shadow-xl backdrop-blur-xl'>
        <div class='absolute inset-0 bg-linear-to-br from-secondary/10 to-transparent pointer-events-none'></div>

        <div class='relative flex flex-col gap-4'>
          <input
            type='text'
            bind:value={awayTeamName}
            placeholder='Rakip Takım'
            class='w-full bg-transparent text-center text-sm sm:text-lg lg:text-xl font-black uppercase tracking-widest sm:tracking-[0.2em] text-secondary outline-none placeholder:opacity-20'
            onkeydown={e => e.key === 'Enter' && e.preventDefault()}
          />

          <div class='flex items-center gap-2'>
            <div class='relative flex-1'>
              <input
                type='text'
                placeholder='Oyuncu ekle...'
                class='w-full rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs font-medium outline-none transition-all focus:bg-white/10'
                bind:value={newAwayPlayerName}
                onkeydown={e => e.key === 'Enter' && (e.preventDefault(), addNewPlayer('AWAY'))}
              />
            </div>
            <button
              type='button'
              class='flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/20 text-secondary transition-all hover:bg-secondary hover:text-white active:scale-95'
              onclick={() => addNewPlayer('AWAY')}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      <div class='custom-scrollbar flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-1'>
        {#each playersList as player (player.id)}
          <div
            role='button'
            tabindex='0'
            onclick={() => {
              if (playersAway.some(lineup => lineup.player.id === player.id)) {
                removePlayer(player, 'AWAY')
              }
              else if (!playersHome.some(lineup => lineup.player.id === player.id)) {
                addPlayer(player, 'AWAY')
              }
            }}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                if (playersAway.some(lineup => lineup.player.id === player.id)) {
                  removePlayer(player, 'AWAY')
                }
                else if (!playersHome.some(lineup => lineup.player.id === player.id)) {
                  addPlayer(player, 'AWAY')
                }
              }
            }}
            class="group/player relative overflow-hidden rounded-2xl border p-3 text-left transition-all backdrop-blur-xl hover:bg-white/10 active:scale-98 {playersAway.some(lineup => lineup.player.id === player.id) ? 'bg-secondary/20 border-secondary/30 shadow-lg' : 'bg-white/5 border-white/5 opacity-40'}"
          >
            <div class='flex items-center gap-3'>
              <div class='avatar'>
                <div class='h-8 w-8 rounded-full border border-white/10'>
                  <img
                    src='https://api.dicebear.com/7.x/avataaars/svg?seed={player.name}'
                    alt={player.name}
                  />
                </div>
              </div>
              <div class='flex flex-1 flex-col'>
                <span class='text-xs font-bold text-white/90'>{player.name}</span>
                <span class='text-[10px] font-medium text-white/30 uppercase'>Oyuncu</span>
              </div>
              <button
                type='button'
                class='flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-[10px] font-black text-warning transition-colors group-hover/player:bg-warning group-hover/player:text-warning-content'
                onclick={(e) => {
                  e.stopPropagation()
                  updatePlayerNumber(e, player)
                }}
              >
                {player.number}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </main>

  {#if showSaveModal}
    <div class='fixed inset-0 z-100 flex items-end sm:items-center justify-center backdrop-blur-xl transition-all animate-in fade-in duration-300'>
      <div
        class='absolute inset-0 bg-black/60'
        onclick={() => showSaveModalStore.set(false)}
        onkeydown={e => (e.key === 'Enter' || e.key === ' ') && showSaveModalStore.set(false)}
        role='button'
        tabindex='0'
        aria-label='Close modal'
      ></div>

      <div
        class='relative w-full max-w-2xl overflow-y-auto rounded-t-4xl sm:rounded-[2.5rem] border border-white/10 bg-base-100 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 p-0 max-h-[95dvh] sm:max-h-[90dvh] sm:m-4'
        onclick={e => e.stopPropagation()}
        role='presentation'
      >
        <div class='relative flex flex-col gap-6 sm:gap-8 bg-base-100/40 p-6 sm:p-14'>
          <!-- Background Decor -->
          <div class='absolute inset-x-0 top-0 h-40 bg-linear-to-b from-warning/10 to-transparent pointer-events-none'></div>

          <div class='relative flex flex-col items-center text-center gap-2'>
            <div class='flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/10 text-warning mb-2 shadow-inner'>
              <Settings2 size={32} />
            </div>
            <h3 class='text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white'>Maç Yayınla</h3>
            <p class='text-xs font-bold text-white/20 uppercase tracking-[0.3em]'>Bilgileri Son Bir Kez Gözden Geçirin</p>
          </div>

          <!-- Summary Cards -->
          <div class='grid grid-cols-2 gap-4'>
            <div class='flex flex-col items-center gap-2 rounded-2xl border border-primary/10 bg-primary/5 p-4'>
              <span class='text-[10px] font-black uppercase tracking-widest text-primary/50'>Ev Sahibi</span>
              <span class='text-sm font-black text-white'>{homeTeamName || 'Takım 1'}</span>
              <span class='badge badge-sm border-primary/20 bg-primary/20 text-primary'>{playersHome.length} Oyuncu</span>
            </div>
            <div class='flex flex-col items-center gap-2 rounded-2xl border border-secondary/10 bg-secondary/5 p-4'>
              <span class='text-[10px] font-black uppercase tracking-widest text-secondary/50'>Rakip</span>
              <span class='text-sm font-black text-white'>{awayTeamName || 'Takım 2'}</span>
              <span class='badge badge-sm border-secondary/20 bg-secondary/20 text-secondary'>{playersAway.length} Oyuncu</span>
            </div>
          </div>

          <div class='flex flex-col gap-5'>
            <div class='grid grid-cols-1 gap-5 sm:grid-cols-2'>
              <div class='flex flex-col gap-2'>
                <label for='match-title-input' class='text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1'>Maç Başlığı</label>
                <input
                  id='match-title-input'
                  type='text'
                  name='title'
                  bind:value={matchTitle}
                  placeholder='Halısaha'
                  class='w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-bold outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-warning/30'
                />
              </div>
              <div class='flex flex-col gap-2'>
                <label for='match-duration-input' class='text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1'>Süre (Dakika)</label>
                <input
                  id='match-duration-input'
                  type='number'
                  name='duration'
                  bind:value={matchDuration}
                  class='w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-sm font-bold outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-warning/30'
                />
              </div>
            </div>

            <div class='grid grid-cols-2 gap-5'>
              <div class='flex flex-col gap-2'>
                <label for='match-date-input' class='text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1'>Başlama Tarihi</label>
                <input
                  id='match-date-input'
                  type='date'
                  bind:value={matchDate}
                  class='w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-5 text-sm font-black outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-warning/30'
                />
              </div>
              <div class='flex flex-col gap-2'>
                <label for='match-hour-input' class='text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-1'>Başlama Saati</label>
                <input
                  id='match-hour-input'
                  type='time'
                  bind:value={matchTimeOnly}
                  class='w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-5 text-sm font-black outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-warning/30'
                />
              </div>
            </div>
          </div>

          <div class='mt-2 sm:mt-4 flex flex-col gap-4'>
            <button
              type='submit'
              class='group/final relative overflow-hidden rounded-2xl bg-warning p-px transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50'
              disabled={isSaving}
            >
              <div class='flex items-center justify-center gap-3 rounded-[15px] bg-warning px-8 py-5 font-black uppercase tracking-[0.2em] text-warning-content transition-all group-hover/final:bg-warning-focus'>
                {#if isSaving}
                  <LoadingSpinner size='md' color='text-warning-content' />
                  Yayınlanıyor...
                {:else}
                  Maçı Şimdi Yayınla
                {/if}
              </div>
            </button>
            <button
              type='button'
              class='px-8 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 transition-all hover:text-white'
              onclick={() => showSaveModalStore.set(false)}
            >
              İşlemi İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</form>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
  }
</style>
