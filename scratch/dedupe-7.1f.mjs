import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('Fetching all 7.1f patches from database...');
  const { data, error } = await supabase
    .from('patches')
    .select('*')
    .eq('version', '7.1f');
    
  if (error) {
    console.error('Error fetching patches:', error);
    return;
  }
  
  console.log(`Found ${data.length} records for 7.1f.`);
  
  // Track unique items based on champion and description
  const seen = new Set();
  const duplicates = [];
  
  for (const patch of data) {
    const key = `${patch.champion_name_en}-${patch.description}`;
    if (seen.has(key)) {
      duplicates.push(patch.id);
    } else {
      seen.add(key);
    }
  }
  
  console.log(`Identified ${duplicates.length} duplicate records to delete.`);
  
  if (duplicates.length === 0) {
    console.log('No duplicates found.');
    return;
  }
  
  // Delete duplicates
  console.log('Deleting duplicate records...');
  for (const id of duplicates) {
    const { error: deleteError } = await supabase
      .from('patches')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      console.error(`Failed to delete record ${id}:`, deleteError);
    } else {
      console.log(`Deleted duplicate record ${id}`);
    }
  }
  
  console.log('Deduplication complete.');
}

main();
