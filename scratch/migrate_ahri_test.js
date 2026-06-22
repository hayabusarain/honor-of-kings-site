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
    let oldSkills = ahri.skills;
    if (Array.isArray(oldSkills)) {
      const newJaSkills = [...oldSkills];
      newJaSkills[0].description = "敵を倒すと体力が {heal_amount} 回復する。([item_bf_sword] がおすすめ) ※変数が機能しています！";
      
      const newEnSkills = [...oldSkills];
      newEnSkills[0].name = "Essence Theft";
      newEnSkills[0].description = "Restores {heal_amount} HP upon takedown. ([item_bf_sword] recommended) ※ English translation mock!";
      
      const variables = {
        heal_amount: "50/75/100"
      };
      
      const newSkillsObject = {
        ja: newJaSkills,
        en: newEnSkills,
        variables: variables
      };
      
      const { error } = await supabase
        .from('wr_champion_details')
        .update({ skills: newSkillsObject })
        .eq('champion_id', 'Ahri');
        
      if (error) console.error('Error updating:', error);
      else console.log('Ahri data migrated to new multilingual format!');
    } else {
      console.log('Ahri data is already an object (new format).');
    }
  }
}

run();
