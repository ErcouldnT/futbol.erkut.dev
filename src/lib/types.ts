import type { Database } from "./supabase-types";

export type Player = Database["public"]["Tables"]["players"]["Row"];

// export type PlayerLineup = Player & {
// 	pos_x: number;
// 	pos_y: number;
// };

export type Team = Database["public"]["Tables"]["teams"]["Row"];

export type PlayerWithXAndY = Database["public"]["Tables"]["lineups"]["Row"] & {
	player: Player;
};

export type TeamWithPlayers = Team & {
	lineup: PlayerWithXAndY[];
};

export type Match = Database["public"]["Tables"]["matches"]["Row"];

export type MatchWithTeams = Match & {
	team_1: TeamWithPlayers;
	team_2: TeamWithPlayers;
	jersey_goal: Player | null;
	mvp: Player | null;
};

export type Vote = Database["public"]["Tables"]["votes"]["Row"];
