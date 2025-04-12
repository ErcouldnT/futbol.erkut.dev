export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			comments: {
				Row: {
					comment: string;
					created_at: string;
					id: number;
					match_id: number | null;
					username: string | null;
				};
				Insert: {
					comment: string;
					created_at?: string;
					id?: number;
					match_id?: number | null;
					username?: string | null;
				};
				Update: {
					comment?: string;
					created_at?: string;
					id?: number;
					match_id?: number | null;
					username?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "comments_match_id_fkey";
						columns: ["match_id"];
						isOneToOne: false;
						referencedRelation: "matches";
						referencedColumns: ["id"];
					}
				];
			};
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
					duration: number;
					home_score: number;
					id: number;
					is_votable: boolean;
					jersey_goal: number | null;
					match_time: string | null;
					mvp: number | null;
					team_1: number;
					team_2: number;
					title: string | null;
				};
				Insert: {
					away_score?: number;
					created_at?: string;
					duration?: number;
					home_score?: number;
					id?: number;
					is_votable?: boolean;
					jersey_goal?: number | null;
					match_time?: string | null;
					mvp?: number | null;
					team_1: number;
					team_2: number;
					title?: string | null;
				};
				Update: {
					away_score?: number;
					created_at?: string;
					duration?: number;
					home_score?: number;
					id?: number;
					is_votable?: boolean;
					jersey_goal?: number | null;
					match_time?: string | null;
					mvp?: number | null;
					team_1?: number;
					team_2?: number;
					title?: string | null;
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

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {}
	}
} as const;
