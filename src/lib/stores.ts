import { persisted } from "svelte-persisted-store";
import type { PlayerWithXAndY } from "$lib/types";

// First param `playersHome` is the local storage key.
// Second param is the initial value.
export const playersHomeStore = persisted<PlayerWithXAndY[]>("playersHome", []);
export const playersAwayStore = persisted<PlayerWithXAndY[]>("playersAway", []);
