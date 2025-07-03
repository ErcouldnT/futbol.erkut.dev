import { writable } from "svelte/store";
import type { LineupExpand } from "$lib/types";

export const playersHomeStore = writable<LineupExpand[]>([]);
export const playersAwayStore = writable<LineupExpand[]>([]);
