import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0uwUYqE-iaWVjYiw5mHYGA_Uylqn6LP';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const { count, error } = await supabase
    .from('patches')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error('Error counting patches:', error);
  } else {
    console.log('Total patches in database:', count);
  }
}

main();
