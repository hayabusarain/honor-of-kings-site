import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback for when the environment variables are not set yet
const safeUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://dummy.supabase.co';

let supabase: SupabaseClient;

if (typeof window !== 'undefined') {
  if (!(window as any)._supabaseClient) {
    (window as any)._supabaseClient = createClient(safeUrl, supabaseAnonKey);
  }
  supabase = (window as any)._supabaseClient;
} else {
  // Always create a new client on the server
  supabase = createClient(safeUrl, supabaseAnonKey);
}

export { supabase };
