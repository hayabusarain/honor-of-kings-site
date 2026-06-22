require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Resetting all remaining champion data (items, runes, custom text) to dummy values...');

  const { error } = await supabase
    .from('wr_champion_details')
    .update({ 
      runes: [],
      items: [],
      custom_skills: null
    })
    .neq('champion_id', 'DUMMY_ID_TO_UPDATE_ALL'); // 全件更新

  if (error) {
    console.error('Error resetting data:', error);
  } else {
    console.log('Successfully reset all data to dummy values!');
  }
}

run();
