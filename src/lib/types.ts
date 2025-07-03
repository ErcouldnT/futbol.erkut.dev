/**
 * PocketBase "comments" collection record type
 */
export interface Comment {
	id: string;
	match: string; // id of the related match record
	username: string; // comment author's display name
	content: string; // comment body
	created: string;
	updated: string;
}

/**
 * PocketBase "players" collection record type
 */
export interface Player {
	id: string;
	name: string;
	number: number; // jersey number
	profile_pic?: string;
	created: string;
	updated: string;
}

/**
 * PocketBase "teams" collection record type
 */
export interface Team {
	id: string;
	name: string;
	players: string[]; // array of related player record ids
	created: string;
	updated: string;
}

export interface TeamExpand extends Team {
	expand?: {
		players?: Player[];
	};
}

/**
 * PocketBase "matches" collection record type
 */
export interface Match {
	id: string;
	APPROVED: boolean; // indicates if the match is approved
	title: string;
	home_team: string; // reference to Team
	away_team: string; // reference to Team
	home_score: number;
	away_score: number;
	mvp: string; // reference to Player
	jersey_goal: string; // reference to Player
	match_time: string;
	duration: number;
	is_votable: boolean;
	created: string;
	updated: string;
}

export interface MatchExpand extends Match {
	expand?: {
		home_team?: Team;
		away_team?: Team;
		mvp?: Player;
		jersey_goal?: Player;
	};
}

/**
 * PocketBase "lineups" collection record type
 */
export interface Lineup {
	id: string;
	match: string; // reference to Match
	team: string; // reference to Team
	player: string; // reference to Player
	goals: number;
	rating: number;
	pos_x: number; // x-coordinate on the field
	pos_y: number; // y-coordinate on the field
	created?: string;
	updated?: string;
}

export interface LineupExpand extends Lineup {
	expand: {
		match?: Match; // optional expand field for related match
		team?: Team; // optional expand field for related team
		player?: Player; // optional expand field for related player
	};
}
