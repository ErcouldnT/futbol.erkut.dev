import type { LineupExpand } from '$lib/types'
import { writable } from 'svelte/store'

export const playersHomeStore = writable<LineupExpand[]>([])
export const playersAwayStore = writable<LineupExpand[]>([])
