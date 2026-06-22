import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const version = "6.3";

const patches = [
  {
    version: version,
    champion_name: "ニダリー",
    champion_name_en: "Nidalee",
    change_type: "new",
    description: "新チャンピオンとして実装。原生林の奥深くで育った半獣の狩人。人間とパッカー（クーガー）の姿を切り替えて戦う。",
    description_en: "New champion release. A shapeshifter who switches between human and cougar forms.",
    is_champion: true
  },
  {
    version: version,
    champion_name: "セナ",
    champion_name_en: "Senna",
    change_type: "buff",
    description: "魂の赦し: 攻撃されなかった場合、近くの魂が消滅時に自動的に吸収されるように。通常攻撃が他のスキルで中断されないよう操作性を最適化。\nピアシングダークネス: 味方の回復範囲が2.3から2.8に拡大。",
    description_en: "Passive now auto-collects un-attacked souls upon expiration. Auto-attack optimization. Q allied heal range increased.",
    is_champion: true
  },
  {
    version: version,
    champion_name: "ナサス",
    champion_name_en: "Nasus",
    change_type: "nerf",
    description: "基本ステータス:\n基本攻撃力が62から58に減少。",
    description_en: "Base Attack Damage reduced.",
    is_champion: true
  },
  {
    version: version,
    champion_name: "ヴァルス",
    champion_name_en: "Varus",
    change_type: "nerf",
    description: "復讐の化身: キル/アシスト時の増加攻撃速度が低下。\n枯死の矢筒: 通常攻撃の追加魔法ダメージが低下(20/30/40/50 → 15/25/35/45)。",
    description_en: "Passive attack speed on takedown/minion kill reduced. W on-hit magic damage reduced.",
    is_champion: true
  },
  {
    version: version,
    champion_name: "アッシュ",
    champion_name_en: "Ashe",
    change_type: "nerf",
    description: "レンジャーフォーカス: 攻撃速度増加量が低下(20/30/40/50% → 15/25/35/45%)。\nボレー: 基本ダメージが低下(20/40/60/80 → 20/35/50/65)。",
    description_en: "Q attack speed reduced. W base damage reduced.",
    is_champion: true
  },
  {
    version: version,
    champion_name: "バード",
    champion_name_en: "Bard",
    change_type: "nerf",
    description: "宇宙の法則(Q): 基本ダメージが低下(120/160/200/240 → 90/140/190/240)。",
    description_en: "Q base damage reduced at lower ranks.",
    is_champion: true
  },
  {
    version: version,
    champion_name: "暁光の美徳",
    champion_name_en: "RadiantVirtue",
    change_type: "new",
    description: "新アイテムとして追加。価格: 2850G、最大体力: +300、物理防御: +45、スキルヘイスト: +15。",
    description_en: "New item release. Costs 2850g, grants HP, Armor, and Haste.",
    is_champion: false
  }
];

const metaPrediction = {
  version: version,
  prediction_ja: "強力なADCであるヴァルスとアッシュへのナーフにより、ボットレーンのパワーバランスが変化。セナへのバフと相まって、サスティン型のサポートADCが台頭する可能性があります。また、新アイテム『暁光の美徳』の登場により、タンク系サポートやエンゲージタンクの集団戦での影響力が向上しそうです。ジャングルには高い機動力とポーク能力を持つニダリーが加わり、序盤からゲームを動かすメタが予想されます。",
  prediction_en: "Nerfs to dominant ADCs like Varus and Ashe will shift bot lane dynamics, potentially allowing sustain-focused marksmen like Senna to rise. The new item Radiant Virtue bolsters tank supports and engagers in team fights. In the jungle, Nidalee's arrival introduces a highly mobile, early-game oriented skirmisher to the meta."
};

async function insertData() {
  try {
    console.log(`Starting data insertion for Patch ${version}...`);

    // Clean up existing data for this version to avoid duplicates
    await supabase.from('patches').delete().eq('version', version);
    await supabase.from('patch_meta').delete().eq('version', version);

    // Insert patches
    const { data: patchData, error: patchError } = await supabase
      .from('patches')
      .insert(patches);

    if (patchError) {
      throw new Error(`Error inserting patches: ${patchError.message}`);
    }
    console.log('Successfully inserted patch notes data.');

    // Insert meta prediction
    const { data: metaData, error: metaError } = await supabase
      .from('patch_meta')
      .insert(metaPrediction);

    if (metaError) {
      throw new Error(`Error inserting patch meta: ${metaError.message}`);
    }
    console.log('Successfully inserted patch meta prediction.');
    
    console.log('All operations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

insertData();
