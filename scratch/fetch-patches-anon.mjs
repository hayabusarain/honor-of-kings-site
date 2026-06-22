import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0uwUYqE-iaWVjYiw5mHYGA_Uylqn6LP';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from('patches')
    .select('*')
    .eq('version', '7.1f');
    
  if (error) {
    console.error('Error fetching with Anon Key:', error);
  } else {
    console.log(`Fetched ${data?.length || 0} patches for 7.1f using Anon Key.`);
    if (data && data.length > 0) {
      console.log('Sample data:', data[0]);
    }
  }
}

main();
