import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

export function createClient() {
  // fallback to a valid URL format to prevent initialization error when using placeholders
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const finalUrl = url.startsWith('http') ? url : 'https://dummy.supabase.co';
  const finalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

  return createBrowserClient<Database>(
    finalUrl,
    finalKey
  )
}
