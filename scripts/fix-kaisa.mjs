import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase
    .from('champion_stats')
    .update({ champion_name_en: 'Kaisa' })
    .eq('champion_name_en', 'KaiSa');
    
  if (error) console.error(error);
  else console.log('Successfully updated Kaisa in the database!');
}
run();
