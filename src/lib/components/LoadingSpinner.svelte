<script lang='ts'>
  interface Props {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    color?: string
    text?: string
    fullScreen?: boolean
    class?: string
  }

  const {
    size = 'md',
    color = 'text-primary',
    text = '',
    fullScreen = false,
    class: customClass = '',
  }: Props = $props()

  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-[6px]',
  }

  const textClasses = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  }
</script>

<div
  class="flex flex-col items-center justify-center gap-4 {fullScreen
    ? 'fixed inset-0 z-100 bg-base-100/80 backdrop-blur-sm'
    : ''} {customClass}"
>
  <div class='relative'>
    <!-- Inner glowing circle -->
    <div
      class="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse {color.replace(
        'text-',
        'bg-',
      )}"
    ></div>

    <!-- The actual spinner -->
    <div
      class='rounded-full border-t-transparent animate-spin {sizeClasses[size]} {color} border-current shadow-lg'
    ></div>

    <!-- Football overlay (subtle) -->
    {#if size === 'lg' || size === 'xl'}
      <div
        class='absolute inset-0 flex items-center justify-center opacity-10 {color}'
      >
        <svg
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          class='h-1/2 w-1/2'
        >
          <circle cx='12' cy='12' r='10' />
          <path d='m12 2 10 7.5-3.5 12.5H5.5L2 9.5 12 2Z' />
          <path d='m12 2-3 3.5 1 4.5 4 1 3-3.5' />
          <path d='M12 22v-5l3-2.5 4 .5.5 3.5' />
          <path d='M12 22v-5l-3-2.5-4 .5-.5 3.5' />
          <path d='M22 9.5h-5.5l-1.5 4 .5 4.5' />
          <path d='M2 9.5h5.5l1.5 4-.5 4.5' />
        </svg>
      </div>
    {/if}
  </div>

  {#if text}
    <p
      class='font-black uppercase tracking-[0.2em] animate-pulse {textClasses[
        size
      ]} {color} opacity-80'
    >
      {text}
    </p>
  {/if}
</div>

<style>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
</style>
