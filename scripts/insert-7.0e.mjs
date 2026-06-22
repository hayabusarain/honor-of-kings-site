import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const version = "7.0e";

const patches = [
  {
    version: version,
    champion_name: "オリジナルのタイタン ハイドラ",
    champion_name_en: "OriginalTitanicHydra",
    change_type: "nerf",
    description: "通常攻撃とスキルのダメージ倍率：通常攻撃とスキルで増加体力の3%にあたる追加ダメージを与える → 増加体力の1.5%にあたる追加ダメージを与える\n\n衝撃波のダメージ倍率：増加体力の10% → 増加体力の5%",
    description_en: "Attack and skill damage ratio: 3% bonus HP -> 1.5% bonus HP. Shockwave damage ratio: 10% bonus HP -> 5% bonus HP.",
    is_champion: false
  },
  {
    version: version,
    champion_name: "人形劇",
    champion_name_en: "Puppetry",
    change_type: "remove",
    description: "現在、「人形劇」に想定外の問題が確認され、クラッシュを引き起こす可能性があるため、一時的に無効化されています。",
    description_en: "Temporarily disabled due to an issue that could cause crashes.",
    is_champion: false
  },
  {
    version: version,
    champion_name: "万能薬",
    champion_name_en: "Panacea",
    change_type: "adjust",
    description: "「万能薬」が誤って「死の円環」を発動してしまう不具合を修正。",
    description_en: "Fixed a bug where Panacea would incorrectly trigger Circle of Death.",
    is_champion: false
  }
];

const meta = {
  version: version,
  prediction_ja: "パッチ7.0eでは、ARAM（ラララランダムミッド）のオーグメントバランス調整が行われました。特に「オリジナルのタイタン ハイドラ」が大きく弱体化されたことで、増加体力に依存するタンクやブルーザーの火力が低下し、他のオーグメントの優先度が上がると予想されます。また、バグ修正により意図しないダメージシナジーが解消されました。",
  prediction_en: "Patch 7.0e focuses on ARAM augment balancing. The significant nerf to 'Original Titanic Hydra' will lower the damage output of health-stacking tanks and bruisers, likely increasing the priority of other augments. Bug fixes also remove unintended damage synergies."
};

async function insertData() {
  // Delete existing data for this version
  const { error: delError1 } = await supabase.from('patches').delete().eq('version', version);
  if (delError1) console.error('Error deleting old patches:', delError1);

  const { error: delError2 } = await supabase.from('patch_meta').delete().eq('version', version);
  if (delError2) console.error('Error deleting old meta:', delError2);

  // Insert patches
  const { data: pData, error: pError } = await supabase.from('patches').insert(patches);
  if (pError) {
    console.error('Error inserting patches:', pError);
    return;
  }
  console.log('Successfully inserted patches.');

  // Insert meta
  const { data: mData, error: mError } = await supabase.from('patch_meta').insert(meta);
  if (mError) {
    console.error('Error inserting meta:', mError);
    return;
  }
  console.log('Successfully inserted patch meta.');
}

insertData();
