import type { Database } from "./supabase-types";

export type Player = Database["public"]["Tables"]["players"]["Row"];

export type PlayerWithXAndY = Player & {
	x: number;
	y: number;
};
