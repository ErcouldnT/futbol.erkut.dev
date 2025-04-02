import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import type { Database } from "./supabase-types";

export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// todo: dev için önce svelte meta check yap
// export const supabase = createClient(PUBLIC_LOCAL_SUPABASE_URL, PUBLIC_LOCAL_SUPABASE_ANON_KEY);
