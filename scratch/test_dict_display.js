require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: ahri } = await supabase
    .from('wr_champion_details')
    .select('*')
    .eq('champion_id', 'Ahri')
    .single();
    
  if (ahri && ahri.skills) {
    if (!ahri.skills[0].description.includes('[item_bf_sword]')) {
      ahri.skills[0].description += ' 【AIからのテストメッセージ：今後は [item_bf_sword] や [item_rabadon] とプログラムに渡すだけで、ユーザーの画面では各言語の正しい名前に100%自動変換されます！】';
      
      const { error } = await supabase
        .from('wr_champion_details')
        .update({ skills: ahri.skills })
        .eq('champion_id', 'Ahri');
        
      if (error) console.error('Error updating:', error);
      else console.log('Ahri data updated with dictionary tags!');
    }
  }
}

run();
