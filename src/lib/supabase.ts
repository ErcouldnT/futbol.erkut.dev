import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_LOCAL_SUPABASE_URL, PUBLIC_LOCAL_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// export const supabase = createClient(PUBLIC_LOCAL_SUPABASE_URL, PUBLIC_LOCAL_SUPABASE_ANON_KEY);
