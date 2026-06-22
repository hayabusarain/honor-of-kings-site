require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Resetting all champion data to dummy values...');
  
  const dummyBaseStats = {
    hp: 0,
    hpperlevel: 0,
    mp: 0,
    mpperlevel: 0,
    movespeed: 0,
    armor: 0,
    armorperlevel: 0,
    spellblock: 0,
    spellblockperlevel: 0,
    attackrange: 0,
    hpregen: 0,
    hpregenperlevel: 0,
    mpregen: 0,
    mpregenperlevel: 0,
    crit: 0,
    critperlevel: 0,
    attackdamage: 0,
    attackdamageperlevel: 0,
    attackspeedperlevel: 0,
    attackspeed: 0
  };

  const { error } = await supabase
    .from('wr_champion_details')
    .update({ 
      base_stats: dummyBaseStats,
      // スキルは後で私のOCRで埋めるため一旦空配列にしておく
      skills: [] 
    })
    .neq('champion_id', 'DUMMY_ID_TO_UPDATE_ALL'); // 全件更新するためのハック

  if (error) {
    console.error('Error resetting data:', error);
  } else {
    console.log('Successfully reset all data to dummy values!');
  }
}

run();
