import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { error } = await supabase
    .from('champion_stats')
    .update({ champion_name_en: 'Mel', champion_name: 'メル' })
    .eq('champion_name_en', 'UnknownNewChamp');
    
  if (error) console.error(error);
  else console.log('Successfully updated Mel in the database!');
}
run();
