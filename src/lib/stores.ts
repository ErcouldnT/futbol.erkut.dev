import { persisted } from "svelte-persisted-store";

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const preferences = persisted("preferences", {
	theme: "dark",
	pane: "50%"
});

export const playersHomeStore = persisted("playersHome", []);

export const playersAwayStore = persisted("playersAway", []);
