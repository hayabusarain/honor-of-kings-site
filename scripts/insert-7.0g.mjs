import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const version = '7.0g';

  const patches = [
    {
      version,
      champion_name: '前衛ミニオン',
      champion_name_en: 'MeleeMinion',
      change_type: 'adjust',
      description: '🔪🐶🛡️',
      description_en: 'Melee minions are now dogs with knives and shields.',
      is_champion: false
    },
    {
      version,
      champion_name: '後衛ミニオン',
      champion_name_en: 'CasterMinion',
      change_type: 'adjust',
      description: '🐶🪄',
      description_en: 'Caster minions are now magic dogs.',
      is_champion: false
    },
    {
      version,
      champion_name: '砲台ミニオン',
      champion_name_en: 'SiegeMinion',
      change_type: 'adjust',
      description: '🚀🐶\n🛡️',
      description_en: 'Siege minions are now dogs with rockets and shields.',
      is_champion: false
    },
    {
      version,
      champion_name: '砲撃ミニオン',
      champion_name_en: 'BombardMinion',
      change_type: 'adjust',
      description: '🚗🐶\n🔪🛡️🔪',
      description_en: 'Bombard minions are driving dogs with multiple knives and shields.',
      is_champion: false
    },
    {
      version,
      champion_name: 'スーパーミニオン',
      champion_name_en: 'SuperMinion',
      change_type: 'adjust',
      description: '🛡️💪🐶🗡️',
      description_en: 'Super minions are super buff dogs with armor and swords.',
      is_champion: false
    }
  ];

  console.log('Inserting patches...');
  // Delete existing just in case
  await supabase.from('patches').delete().eq('version', version);
  
  const { error: patchError } = await supabase.from('patches').insert(patches);
  if (patchError) {
    console.error('Error inserting patches:', patchError);
    process.exit(1);
  }
  console.log('Patches inserted successfully.');

  const metaPrediction = {
    version,
    prediction_ja: 'エイプリルフールのジョークパッチにより、サモナーズリフトがドッグランへと変貌しました。可愛いワンちゃんたち（ミニオン）を攻撃するのは心理的負担が極めて大きいため、CSを取る難易度が過去最高に跳ね上がるでしょう。全プレイヤーが平和主義者となり、ファームを放棄して犬と戯れ続けるため、試合時間が無制限に延びるアルティメット・レイトゲームメタが予想されます！🐶🐾',
    prediction_en: "Due to the April Fools' joke patch, Summoner's Rift has been transformed into a dog park. Attacking these adorable doggy minions carries a heavy psychological burden, making CSing harder than ever. We expect an ultimate late-game meta where all players become pacifists and abandon farming to play with the dogs, extending match times indefinitely! 🐶🐾"
  };

  console.log('Inserting patch meta...');
  await supabase.from('patch_meta').delete().eq('version', version);
  const { error: metaError } = await supabase.from('patch_meta').insert(metaPrediction);
  if (metaError) {
    console.error('Error inserting patch meta:', metaError);
    process.exit(1);
  }
  console.log('Patch meta inserted successfully.');
}

run();
