export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			lineups: {
				Row: {
					created_at: string;
					goals: number;
					id: number;
					player_id: number;
					pos_x: number;
					pos_y: number;
					rating: number;
					team_id: number;
				};
				Insert: {
					created_at?: string;
					goals?: number;
					id?: number;
					player_id: number;
					pos_x?: number;
					pos_y?: number;
					rating?: number;
					team_id: number;
				};
				Update: {
					created_at?: string;
					goals?: number;
					id?: number;
					player_id?: number;
					pos_x?: number;
					pos_y?: number;
					rating?: number;
					team_id?: number;
				};
				Relationships: [
					{
						foreignKeyName: "line-ups_player_id_fkey";
						columns: ["player_id"];
						isOneToOne: false;
						referencedRelation: "players";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "line-ups_team_id_fkey";
						columns: ["team_id"];
						isOneToOne: false;
						referencedRelation: "teams";
						referencedColumns: ["id"];
					}
				];
			};
			matches: {
				Row: {
					away_score: number;
					created_at: string;
					home_score: number;
					id: number;
					jersey_goal: number | null;
					match_time: string | null;
					mvp: number | null;
					team_1: number;
					team_2: number;
				};
				Insert: {
					away_score?: number;
					created_at?: string;
					home_score?: number;
					id?: number;
					jersey_goal?: number | null;
					match_time?: string | null;
					mvp?: number | null;
					team_1: number;
					team_2: number;
				};
				Update: {
					away_score?: number;
					created_at?: string;
					home_score?: number;
					id?: number;
					jersey_goal?: number | null;
					match_time?: string | null;
					mvp?: number | null;
					team_1?: number;
					team_2?: number;
				};
				Relationships: [
					{
						foreignKeyName: "matches_jersey_goal_fkey";
						columns: ["jersey_goal"];
						isOneToOne: false;
						referencedRelation: "players";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "matches_mvp_fkey";
						columns: ["mvp"];
						isOneToOne: false;
						referencedRelation: "players";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "matches_team_1_fkey";
						columns: ["team_1"];
						isOneToOne: false;
						referencedRelation: "teams";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "matches_team_2_fkey";
						columns: ["team_2"];
						isOneToOne: false;
						referencedRelation: "teams";
						referencedColumns: ["id"];
					}
				];
			};
			players: {
				Row: {
					created_at: string;
					id: number;
					name: string;
					number: number;
					profile_pic: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
					number: number;
					profile_pic?: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
					number?: number;
					profile_pic?: string;
				};
				Relationships: [];
			};
			teams: {
				Row: {
					created_at: string;
					id: number;
					name: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					name: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					name?: string;
				};
				Relationships: [];
			};
			votes: {
				Row: {
					created_at: string;
					id: number;
					match_id: number;
					player_id: number;
					rating: number;
					team_id: number;
					user_token: string;
				};
				Insert: {
					created_at?: string;
					id?: number;
					match_id: number;
					player_id: number;
					rating: number;
					team_id: number;
					user_token: string;
				};
				Update: {
					created_at?: string;
					id?: number;
					match_id?: number;
					player_id?: number;
					rating?: number;
					team_id?: number;
					user_token?: string;
				};
				Relationships: [
					{
						foreignKeyName: "votes_match_id_fkey";
						columns: ["match_id"];
						isOneToOne: false;
						referencedRelation: "matches";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "votes_player_id_fkey";
						columns: ["player_id"];
						isOneToOne: false;
						referencedRelation: "players";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "votes_team_id_fkey";
						columns: ["team_id"];
						isOneToOne: false;
						referencedRelation: "teams";
						referencedColumns: ["id"];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
				Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;
