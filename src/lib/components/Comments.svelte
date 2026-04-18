<script lang='ts'>
  import type { Comment } from '$lib/types'
  import { titleCase } from '$lib/utils'
  import { MessageSquare, RefreshCw, Send } from '@lucide/svelte'
  import { formatDistanceToNow } from 'date-fns'
  import { tr } from 'date-fns/locale'
  import { onMount, tick } from 'svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'

  const { matchId }: { matchId: string } = $props()

  let comments: Comment[] = $state([])
  let newComment = $state('')
  let username = $state('')
  let loading = $state(true)
  let refreshing = $state(false)
  let scrollContainer: HTMLDivElement | undefined = $state()

  function scrollToBottom() {
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }

  async function loadComments() {
    try {
      const res = await fetch(`/api/comments?matchId=${matchId}`)
      const data: Comment[] = await res.json()
      comments = data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateA - dateB
      })
    }
    catch (err) {
      console.error('Yorumlar çekilemedi:', err)
    }
  }

  async function refreshComments() {
    refreshing = true
    await loadComments()
    refreshing = false
    await tick()
    scrollToBottom()
  }

  onMount(async () => {
    await loadComments()
    loading = false
    await tick()
    scrollToBottom()
  })

  async function submitComment() {
    if (!newComment.trim())
      return

    const processedUsername = titleCase(username.trim() || 'Anonim')
    const payload = {
      content: newComment.trim(),
      matchId,
      username: processedUsername,
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })
      const created = await res.json()
      comments = [...comments, created]
      newComment = ''
      await tick()
      scrollToBottom()
    }
    catch {
    // ignore
    }
  }

  function getTimeAgo(date: string | Date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })
  }
</script>

<div class='flex flex-col gap-4 w-full max-w-4xl mx-auto py-4'>
  <!-- Header -->
  <div class='flex items-center justify-between px-1'>
    <div class='flex items-center gap-2 text-white/40'>
      <MessageSquare size={16} />
      <span class='text-xs font-bold uppercase tracking-widest'>Yorumlar</span>
      {#if comments.length > 0}
        <span class='text-[10px] opacity-50'>({comments.length})</span>
      {/if}
    </div>
    <button
      onclick={refreshComments}
      disabled={refreshing}
      class='flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30 transition-all hover:bg-white/5 hover:text-white/60 active:scale-95 disabled:opacity-30'
    >
      <RefreshCw size={12} class={refreshing ? 'animate-spin' : ''} />
      Yenile
    </button>
  </div>

  <!-- Comments List -->
  <div bind:this={scrollContainer} class='flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-1 custom-scrollbar'>
    {#if loading}
      <div class='flex items-center justify-center py-16'>
        <LoadingSpinner text='Yorumlar Yükleniyor...' size='lg' />
      </div>
    {:else if comments.length === 0}
      <div class='flex flex-col items-center justify-center py-8 text-center text-white/20'>
        <div class='rounded-full bg-white/5 p-4 mb-3'>
          <MessageSquare size={32} strokeWidth={1} />
        </div>
        <p class='text-sm font-medium'>Henüz yorum yok</p>
        <p class='text-xs opacity-50 mt-1'>İlk yorumu aşağıdan yaz!</p>
      </div>
    {:else}
      {#each comments as comment}
        <div class='flex flex-col gap-1'>
          <div class='flex items-center gap-2 px-3'>
            <span class='text-xs font-bold text-primary/80'>{comment.username}</span>
            <span class='h-1 w-1 rounded-full bg-white/10'></span>
            <span class='text-[10px] opacity-30'>{comment.createdAt ? getTimeAgo(comment.createdAt) : 'şimdi'}</span>
          </div>
          <div class='rounded-2xl bg-white/5 border border-white/5 px-4 py-3'>
            <p class='text-sm leading-relaxed text-white/90'>{comment.content}</p>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Input Area -->
  <div class='flex flex-col gap-2 rounded-2xl bg-white/5 border border-white/5 p-3'>
    <div class='flex items-center gap-2'>
      <input
        type='text'
        value={username}
        oninput={e => username = titleCase(e.currentTarget.value)}
        placeholder='İsim (opsiyonel)'
        class='w-24 shrink-0 bg-transparent px-2 py-1.5 text-xs font-bold text-primary/80 outline-none placeholder:text-white/20 sm:w-28'
      />
    </div>
    <div class='flex items-center gap-2'>
      <input
        type='text'
        bind:value={newComment}
        placeholder='Mesajını yaz...'
        class='flex-1 bg-transparent px-2 py-1.5 text-sm text-white/90 outline-none placeholder:text-white/20'
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submitComment()
          }
        }}
      />
      <button
        onclick={submitComment}
        disabled={!newComment.trim()}
        class='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary transition-all hover:bg-primary hover:text-primary-content active:scale-95 disabled:opacity-20'
      >
        <Send size={14} />
      </button>
    </div>
  </div>
</div>

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
