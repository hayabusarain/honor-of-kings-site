import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  await supabase.from('patches').delete().eq('version', 'システム要件変更 (2025/11/25)');
  await supabase.from('patch_meta').delete().eq('version', 'システム要件変更 (2025/11/25)');
  console.log('Deleted system requirement data');
}
run();
