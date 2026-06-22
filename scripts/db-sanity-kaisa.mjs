import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Check patches table
  const { data: patches, error: patchError } = await supabase
    .from('patches')
    .select('id, champion_name_en')
    .eq('champion_name_en', 'KaiSa');

  if (patchError) {
    console.error('Error fetching patches:', patchError);
  } else if (patches && patches.length > 0) {
    console.log(`Found ${patches.length} patches with "KaiSa". Updating to "Kaisa"...`);
    const { error: updateError } = await supabase
      .from('patches')
      .update({ champion_name_en: 'Kaisa' })
      .eq('champion_name_en', 'KaiSa');
    if (updateError) console.error('Error updating patches:', updateError);
    else console.log('Successfully updated patches table!');
  } else {
    console.log('No "KaiSa" records found in patches table.');
  }

  // Check patch_meta table (if any)
  // Let's just check champion_stats again to be sure
  const { data: stats, error: statsError } = await supabase
    .from('champion_stats')
    .select('id, champion_name_en')
    .eq('champion_name_en', 'KaiSa');
    
  if (statsError) {
    console.error('Error fetching stats:', statsError);
  } else if (stats && stats.length > 0) {
    console.log(`Found ${stats.length} stats with "KaiSa". Updating to "Kaisa"...`);
    const { error: updateError } = await supabase
      .from('champion_stats')
      .update({ champion_name_en: 'Kaisa' })
      .eq('champion_name_en', 'KaiSa');
    if (updateError) console.error('Error updating stats:', updateError);
    else console.log('Successfully updated stats table!');
  } else {
    console.log('No "KaiSa" records found in champion_stats table.');
  }
}

run();
