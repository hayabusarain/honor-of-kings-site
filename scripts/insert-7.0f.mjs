import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: '7.0f',
    champion_name: 'スモルダー',
    champion_name_en: 'Smolder',
    change_type: 'nerf',
    description: '基本ステータス\nレベルアップごとの攻撃力増加量：4 → 3.5\n\n駆けだしドラゴン\nスーパーこげこげブレスの追加ダメージ：40% → 30%\n\nスーパーこげこげブレス\n基本ダメージ：55/90/125/160 → 45/80/115/150',
    description_en: 'Base AD growth decreased. Passive bonus damage and Q base damage decreased.',
    is_champion: true
  },
  {
    version: '7.0f',
    champion_name: 'ノラ',
    champion_name_en: 'Norra',
    change_type: 'nerf',
    description: 'どこでもない場所へ\nクールダウン：18/17/16/15秒 → 23/22/21/20秒',
    description_en: 'Portal skill cooldown increased to reduce portal pressure in the late game.',
    is_champion: true
  },
  {
    version: '7.0f',
    champion_name: 'トリスターナ',
    champion_name_en: 'Tristana',
    change_type: 'buff',
    description: 'ラピッドファイア\nクールダウン：18/17/16/15秒 → 17/16/15/14秒',
    description_en: 'Rapid Fire cooldown reduced to allow more frequent combat participation.',
    is_champion: true
  },
  {
    version: '7.0f',
    champion_name: 'レル',
    champion_name_en: 'Rell',
    change_type: 'buff',
    description: 'フェロマンシー:装着/騎馬\nクールダウン：5秒 → 9秒',
    description_en: 'Ferromancy - Crash Down/Mount Up cooldown adjusted to allow more frequent form switching.',
    is_champion: true
  },
  {
    version: '7.0f',
    champion_name: 'ジャックス',
    champion_name_en: 'Jax',
    change_type: 'buff',
    description: 'ウェポングランドマスター\nチャンピオンへの攻撃命中時に獲得する、物理防御に応じた増加攻撃力：40% → 50%\nチャンピオンへの攻撃命中時に獲得する、魔法防御に応じた増加攻撃力：24% → 30%',
    description_en: 'Grandmaster\'s Might defense scaling based on AD increased for better late-game teamfight survivability.',
    is_champion: true
  },
  {
    version: '7.0f',
    champion_name: 'アカリ',
    champion_name_en: 'Akali',
    change_type: 'buff',
    description: '黄昏の帳\n不可視状態解除までの時間：0.8秒 → 0.67秒\n\n翻身手裏剣\n[新規追加] 最初の発動：「黄昏の帳」の煙をマークできるようになりました。',
    description_en: 'Twilight Shroud fade time decreased. Shuriken Flip can now mark the Twilight Shroud smoke.',
    is_champion: true
  },
  {
    version: '7.0f',
    champion_name: 'デス ダンス',
    champion_name_en: 'DeathsDance',
    change_type: 'nerf',
    description: '焼灼\n受けた物理ダメージの一部が自分に適用される時間が4秒 → 3秒に\n\n拒絶\n回復量が自身の最大体力の10% → 8%に',
    description_en: 'Cauterize bleed time reduced from 4s to 3s. Defy heal reduced from 10% to 8% max health.',
    is_champion: false
  }
];

const patchMeta = {
  version: '7.0f',
  prediction_ja: 'スモルダーの弱体化によりレイトゲーム志向の構成はやや落ち着くでしょう。また、「デス ダンス」の弱体化によりファイターのサステインが低下する一方、ジャックスやアカリの上方修正により、中盤以降の小規模戦やアサシン構成が活発化すると予想されます。',
  prediction_en: 'With the nerfs to Smolder\'s late-game scaling and Death\'s Dance\'s sustain, team compositions will likely shift away from late-game reliance. Buffs to Jax and Akali will encourage more aggressive skirmishes and assassin-focused plays in the mid-game.'
};

async function run() {
  console.log('Deleting existing patch data for 7.0f...');
  await supabase.from('patches').delete().eq('version', '7.0f');
  await supabase.from('patch_meta').delete().eq('version', '7.0f');

  console.log('Inserting patch data...');
  const { data, error } = await supabase.from('patches').insert(patches);
  if (error) {
    console.error('Error inserting patches:', error);
    process.exit(1);
  }
  
  console.log('Inserting patch meta...');
  const { data: metaData, error: metaError } = await supabase.from('patch_meta').insert(patchMeta);
  if (metaError) {
    console.error('Error inserting patch meta:', metaError);
    process.exit(1);
  }

  console.log('Successfully inserted patch 7.0f data and meta predictions.');
}

run();
