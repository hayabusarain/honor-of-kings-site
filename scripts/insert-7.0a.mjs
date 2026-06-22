import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: '7.0a',
    champion_name: 'フィズ',
    champion_name_en: 'Fizz',
    change_type: 'buff',
    description: 'ウニトゲストライク: 対象ロジックを最適化することでフィズが進路上の敵をより正確に認識できるようになり、ダメージを与え損なうケースが減少しました。',
    description_en: 'Urchin Strike: Optimization of targeting logic to reduce missed damage.',
    is_champion: true
  },
  {
    version: '7.0a',
    champion_name: 'ニダリー',
    champion_name_en: 'Nidalee',
    change_type: 'nerf',
    description: 'ジャンプ（クーガーの心）: 基本ダメージが80/115/150/185から65/100/135/170に低下。クーガー形態でキルまたはマークした対象に使用した際のクールダウン短縮時間が2/1.75/1.5/1.25秒から2.75/2.25/1.75/1.25秒に増加（弱体化）。',
    description_en: 'Pounce: Base damage decreased. Cooldown refund nerfed.',
    is_champion: true
  },
  {
    version: '7.0a',
    champion_name: 'ヴェイン',
    champion_name_en: 'Vayne',
    change_type: 'nerf',
    description: 'タンブル: 追加ダメージが攻撃力の40/50/60/70%から35/45/55/65%に低下。ファイナルアワー: 攻撃力増加が20/30/40から15/25/35に低下。',
    description_en: 'Tumble: Bonus damage decreased. Final Hour: Bonus AD decreased.',
    is_champion: true
  },
  {
    version: '7.0a',
    champion_name: 'スモルダー',
    champion_name_en: 'Smolder',
    change_type: 'nerf',
    description: 'スーパーこげこげブレス: クールダウンが4.5/4/3.5/3秒から5.5/5/4.5/4秒に増加。くしゅん！: くしゃみブラストのダメージが低下。',
    description_en: 'Super Scorcher Breath: Cooldown increased. Achooo!: Base damage decreased.',
    is_champion: true
  },
  {
    version: '7.0a',
    champion_name: 'ジリアン',
    champion_name_en: 'Zilean',
    change_type: 'nerf',
    description: 'クロノシフト: クールダウンが90/80/70秒から100/85/70秒に増加。ルーンの復活効果を発動しなかった場合のクールダウン短縮率が15%から10%に低下。',
    description_en: 'Chronoshift: Cooldown increased. Cooldown refund decreased.',
    is_champion: true
  },
  {
    version: '7.0a',
    champion_name: 'ルナーン・ハリケーン',
    champion_name_en: 'RunaansHurricane',
    change_type: 'buff',
    description: '価格が3000ゴールドから2900ゴールドに低下。',
    description_en: 'Cost decreased from 3000 to 2900 gold.',
    is_champion: false
  },
  {
    version: '7.0a',
    champion_name: '暁光の美徳',
    champion_name_en: 'RadiantVirtue',
    change_type: 'nerf',
    description: '導きの光: 秒間回復量が最大体力の3%から2.5%に低下。',
    description_en: 'Guiding Light: Healing decreased from 3% to 2.5% max HP.',
    is_champion: false
  },
  {
    version: '7.0a',
    champion_name: 'ショウジンの矛',
    champion_name_en: 'SpearOfShojin',
    change_type: 'nerf',
    description: '基本ステータス: 攻撃力が45から40に低下。ドラゴンフォース: 基本スキルヘイストが+25から+20に低下。',
    description_en: 'AD decreased from 45 to 40. Dragonforce: Basic ability haste decreased from 25 to 20.',
    is_champion: false
  },
  {
    version: '7.0a',
    champion_name: '超能力プロジェクター',
    champion_name_en: 'PsychicProjector',
    change_type: 'nerf',
    description: 'コンバージョン: 魔力増加量が増加体力の5%から3.5%に低下。',
    description_en: 'Conversion: AP conversion from bonus HP decreased from 5% to 3.5%.',
    is_champion: false
  },
  {
    version: '7.0a',
    champion_name: 'バグ修正',
    champion_name_en: 'BugFixes',
    change_type: 'adjust',
    description: 'モルガナやレネクトンのタグ修正、堅忍不抜の不具合修正など。',
    description_en: 'Bug fixes including Morgana and Renekton tags, and Perseverance rune.',
    is_champion: false
  },
  {
    version: '7.0a',
    champion_name: 'ランダムミッド',
    champion_name_en: 'ARAM',
    change_type: 'adjust',
    description: '15分時点でのデス時のリスポーン時間を50秒に調整。イブリン、シヴィア、フィオラ、ヴァイ、ゼド、アカリの与ダメージ調整。',
    description_en: 'Death timer at 15 min adjusted to 50s. Multiple champion damage adjusted.',
    is_champion: false
  },
  {
    version: '7.0a',
    champion_name: 'ラララランダムミッド',
    champion_name_en: 'UltimateSpellbookARAM',
    change_type: 'adjust',
    description: 'キラーヴォイド、ヒットコンボ、オリジン：リーサルテンポのオーグメント追加。複数のオーグメント調整。グウェンの与ダメージ調整。',
    description_en: 'New augments added and existing augments adjusted. Gwen damage adjusted.',
    is_champion: false
  },
  {
    version: '7.0a',
    champion_name: 'アリーナ',
    champion_name_en: 'Arena',
    change_type: 'adjust',
    description: 'ライズ、ヴェイン、ニダリー、レンガーのバランス調整。オーグメント、アイテムのステータス調整。',
    description_en: 'Multiple champion, augment, and item balance adjustments.',
    is_champion: false
  }
];

const meta = {
  version: '7.0a',
  prediction_ja: 'パッチ7.0aでは、序盤に強力なニダリーやスモルダー、ジリアンが弱体化され、ゲームの序盤でのスノーボールが抑えられる傾向にあります。ヴェインのダメージ低下や、ショウジンの矛、超能力プロジェクターの弱体化により、ブルーザーや体力依存のメイジの影響力が低下するでしょう。一方でルナーン・ハリケーンが値下げされたため、複数の対象を攻撃するマークスマンが間接的に強化されています。',
  prediction_en: 'Patch 7.0a tones down early-game snowballing by nerfing dominant early picks like Nidalee, Smolder, and Zilean. Damage nerfs to Vayne, Spear of Shojin, and Psychic Projector will slightly reduce the impact of bruisers and health-scaling mages. The cost reduction of Runaan\'s Hurricane offers a minor buff to multi-target marksmen.'
};

async function main() {
  // Delete existing patches for version 7.0a
  await supabase.from('patches').delete().eq('version', '7.0a');
  
  // Insert new patches
  const { error: patchesError } = await supabase.from('patches').insert(patches);
  if (patchesError) {
    console.error('Error inserting patches:', patchesError);
    return;
  }
  console.log('Patches inserted successfully.');

  // Delete existing meta for version 7.0a
  await supabase.from('patch_meta').delete().eq('version', '7.0a');

  // Insert new meta
  const { error: metaError } = await supabase.from('patch_meta').insert(meta);
  if (metaError) {
    console.error('Error inserting meta:', metaError);
    return;
  }
  console.log('Patch meta inserted successfully.');
}

main();
