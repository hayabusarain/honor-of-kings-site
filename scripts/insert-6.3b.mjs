import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: '6.3b',
    champion_name: 'ダイブブレイク (ラララランダムミッド)',
    champion_name_en: 'ARAMDiveBreak',
    change_type: 'nerf',
    description: 'ダメージ：30% → 最大体力の25%',
    description_en: 'Damage decreased from 30% to 25% of maximum health.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: 'トキシックアビス (ラララランダムミッド)',
    champion_name_en: 'ARAMToxicAbyss',
    change_type: 'nerf',
    description: 'スタックごとに増加する継続ダメージ：20% → 10%',
    description_en: 'Damage over time increase per stack reduced from 20% to 10%.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: 'オーバーロード (ラララランダムミッド)',
    champion_name_en: 'ARAMOverload',
    change_type: 'buff',
    description: 'スタックごとの増加率：スキルヘイスト3% → 8%、移動速度5% → 8%',
    description_en: 'Ability Haste per stack increased from 3% to 8%, Movement Speed per stack increased from 5% to 8%.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: '共鳴撃 (ラララランダムミッド)',
    champion_name_en: 'ARAMResonatingStrike',
    change_type: 'buff',
    description: 'クールダウン：8秒 → 0.5秒',
    description_en: 'Cooldown significantly reduced from 8s to 0.5s.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: '影の秘術 (ラララランダムミッド)',
    champion_name_en: 'ARAMShadowArt',
    change_type: 'buff',
    description: 'マーク付与中のダメージ：30% → 50%',
    description_en: 'Damage while marked increased from 30% to 50%.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: 'ブルズアイ (ラララランダムミッド)',
    champion_name_en: 'ARAMBullseye',
    change_type: 'buff',
    description: 'ダメージ：50～150 × （1 + 通常攻撃回数×20%） → 50～150×（1 + 通常攻撃回数×40%）',
    description_en: 'Damage scaling with basic attacks increased from 20% to 40%.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: 'バグ修正 (ラララランダムミッド)',
    champion_name_en: 'ARAMBugFixes',
    change_type: 'adjust',
    description: 'オーグメントの不具合、「救急箱」の回復量とタグ、不死者の握撃の表示などを修正。「超精密シャープシューター」を調整し再導入。',
    description_en: 'Various bug fixes including augments, First Aid Kit healing, Grasp of the Undying visual bugs. Super Precision Sharpshooter reintroduced.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: '金床 (アリーナ)',
    champion_name_en: 'ArenaAnvil',
    change_type: 'adjust',
    description: 'マナ消費と自動回復の補正を最適化。物理攻撃系チャンピオンが魔力系のステータスとアイテムも入手可能に。',
    description_en: 'Mana cost and regen optimized. AD champions can now roll AP stats and items for more build flexibility.',
    is_champion: false
  },
  {
    version: '6.3b',
    champion_name: '血の契約：虐殺 (アリーナ)',
    champion_name_en: 'ArenaBloodContractSlaughter',
    change_type: 'remove',
    description: '一時的に削除されました。',
    description_en: 'Temporarily removed.',
    is_champion: false
  }
];

const patchMeta = {
  version: '6.3b',
  prediction_ja: 'パッチ6.3bは主にARAMとアリーナのゲームモード向けの調整となっています。サモナーズリフト（通常モード）のメタには影響しませんが、ARAMでは「オーバーロード」や「共鳴撃」などのオーグメントが大幅に強化され、スキル回転率の高いチャンピオンやマークスマンの活躍が期待されます。アリーナでは「金床」でADチャンピオンがAPアイテムを獲得できるようになり、ハイブリッドビルドの自由度が増加しました。',
  prediction_en: 'Patch 6.3b is focused entirely on ARAM and Arena modes. While it won\'t impact the standard Summoner\'s Rift meta, ARAM sees significant buffs to augments like Overload and Resonating Strike, favoring ability-spamming champions. In Arena, the Anvil adjustments allow AD champions to roll AP items, opening up creative hybrid builds.'
};

async function main() {
  console.log('Inserting patch notes for 6.3b...');
  
  // Insert patches
  const { error: patchesError } = await supabase
    .from('patches')
    .insert(patches);

  if (patchesError) {
    console.error('Error inserting patches:', patchesError);
  } else {
    console.log('Successfully inserted patches.');
  }

  // Delete existing meta just in case
  await supabase
    .from('patch_meta')
    .delete()
    .eq('version', '6.3b');

  // Insert meta
  const { error: metaError } = await supabase
    .from('patch_meta')
    .insert([patchMeta]);

  if (metaError) {
    console.error('Error inserting patch meta:', metaError);
  } else {
    console.log('Successfully inserted patch meta.');
  }
}

main();
