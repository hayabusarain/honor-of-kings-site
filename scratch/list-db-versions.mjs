import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0uwUYqE-iaWVjYiw5mHYGA_Uylqn6LP';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from('patches')
    .select('version');
    
  if (error) {
    console.error('Error:', error);
  } else {
    const versions = data.map(d => d.version);
    const unique = Array.from(new Set(versions));
    console.log('Unique versions in DB:', unique);
    
    // Count per version
    const counts = {};
    versions.forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
    });
    console.log('Counts per version:', counts);
  }
}

main();
