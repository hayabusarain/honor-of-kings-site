require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// 管理者キーを使ってRLSを完全にバイパスする
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const dummyData = [
    {
      key_id: 'item_bf_sword',
      type: 'item',
      ja: 'B.F.ソード',
      en: 'B.F. Sword',
      ko: 'B.F. 대검',
      vi: 'Kiếm B.F.'
    },
    {
      key_id: 'item_rabadon',
      type: 'item',
      ja: 'ラバドン・デスキャップ',
      en: 'Rabadon\'s Deathcap',
      ko: '라바돈의 죽음모자',
      vi: 'Mũ Phù Thủy Rabadon'
    }
  ];

  const { data, error } = await supabase
    .from('localization_dictionary')
    .upsert(dummyData);

  if (error) {
    console.error('Error inserting dummy data:', error);
  } else {
    console.log('Dummy data successfully inserted!');
  }
}

run();
