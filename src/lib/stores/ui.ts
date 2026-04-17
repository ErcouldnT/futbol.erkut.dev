import { writable } from 'svelte/store'

export const showSaveModalStore = writable(false)
export const shareLineupTrigger = writable(0)
export const isSharingLineup = writable(false)
