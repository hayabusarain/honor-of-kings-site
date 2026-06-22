import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase
    .from('champion_stats')
    .update({ champion_name_en: 'Viktor', champion_name: 'ビクター' })
    .eq('champion_name_en', 'Xerath');
    
  if (error) console.error(error);
  else console.log('Successfully updated Viktor in the database!');
}
run();
