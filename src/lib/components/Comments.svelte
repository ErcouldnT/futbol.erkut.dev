<script lang='ts'>
  import type { Comment } from '$lib/types'
  import { titleCase } from '$lib/utils'
  import { MessageSquare, Send, User } from '@lucide/svelte'
  import { formatDistanceToNow } from 'date-fns'
  import { tr } from 'date-fns/locale'
  import { onMount } from 'svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'

  const { matchId }: { matchId: string } = $props()

  let comments: Comment[] = $state([])
  let newComment = $state('')
  let username = $state('')
  let loading = $state(true)

  onMount(async () => {
    try {
      const res = await fetch(`/api/comments?matchId=${matchId}`)
      const data: Comment[] = await res.json()
      // Sort comments by date (newest first)
      comments = data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
    }
    catch (err) {
      console.error('Yorumlar çekilemedi:', err)
    }
    finally {
      loading = false
    }
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
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const created = await res.json()
      comments = [created, ...comments]
      newComment = ''
    // keep username for convenience
    }
    catch {
    // console.error("Yorum eklenirken hata oluştu");
    }
  }

  function getTimeAgo(date: string | Date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })
  }
</script>

<div class='flex flex-col gap-6 w-full max-w-4xl mx-auto py-4'>
  <div class='flex items-center gap-2 px-2 text-white/40'>
    <MessageSquare size={18} />
    <span class='text-sm font-medium uppercase tracking-widest'>Maç Sohbeti</span>
  </div>

  <div class='flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar'>
    {#if loading}
      <div class='flex items-center justify-center py-20'>
        <LoadingSpinner text='Yorumlar Yükleniyor...' size='lg' />
      </div>
    {:else if comments.length === 0}
      <div class='flex flex-col items-center justify-center py-12 text-center text-white/20'>
        <div class='rounded-full bg-white/5 p-6 mb-4'>
          <MessageSquare size={48} strokeWidth={1} />
        </div>
        <p class='text-sm font-medium'>Sessizliği ilk bozan sen ol!</p>
        <p class='text-xs opacity-50 mt-1'>Maç hakkında yorumunu aşağıdan paylaşabilirsin.</p>
      </div>
    {:else}
      {#each comments as comment}
        <div class='flex flex-col gap-1 transition-all duration-300 hover:translate-x-1'>
          <div class='flex items-center gap-2 px-3'>
            <span class='text-xs font-bold text-primary/80 tracking-tight'>{comment.username}</span>
            <span class='h-1 w-1 rounded-full bg-white/10'></span>
            <span class='text-[10px] opacity-30'>{comment.createdAt ? getTimeAgo(comment.createdAt) : 'şimdi'}</span>
          </div>
          <div class='rounded-3xl bg-linear-to-br from-white/10 to-transparent border border-white/5 p-5 shadow-sm backdrop-blur-md'>
            <p class='text-sm leading-relaxed text-white/90'>{comment.content}</p>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <div class='divider opacity-5 my-2'></div>

  <form
    onsubmit={(e) => {
      e.preventDefault()
      submitComment()
    }}
    class='flex flex-col gap-4 rounded-[32px] bg-base-300/40 p-6 border border-white/5 shadow-2xl relative overflow-hidden'
  >
    <div class='absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none'></div>

    <div class='relative flex flex-col gap-4 sm:flex-row'>
      <div class='relative flex-1'>
        <div class='absolute left-4 top-1/2 -translate-y-1/2 text-white/30'>
          <User size={16} />
        </div>
        <input
          type='text'
          value={username}
          oninput={e => username = titleCase(e.currentTarget.value)}
          placeholder='İsim'
          class='input h-12 w-full border-none bg-white/5 pl-11 text-sm font-medium transition-all focus:bg-white/10 focus:ring-2 focus:ring-primary/20 rounded-2xl'
        />
      </div>

      <button
        type='submit'
        disabled={!newComment.trim()}
        class='btn btn-primary h-12 gap-3 rounded-2xl px-8 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 border-none group'
      >
        <span class='font-bold tracking-wide'>GÖNDER</span>
        <Send size={16} class='transition-transform group-hover:translate-x-1 group-hover:-translate-y-1' />
      </button>
    </div>

    <div class='relative w-full'>
      <textarea
        bind:value={newComment}
        placeholder='Maç hakkında düşüncelerini paylaş...'
        rows='3'
        class='textarea w-full resize-none border-none bg-white/5 p-5 text-sm leading-relaxed transition-all focus:bg-white/10 focus:ring-2 focus:ring-primary/20 rounded-2xl'
      ></textarea>
    </div>
  </form>
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
