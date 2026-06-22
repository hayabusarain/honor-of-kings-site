import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: "6.3c",
    champion_name: "グウェン",
    champion_name_en: "Gwen",
    change_type: "buff",
    description: "スキップスラッシュ: 強化通常攻撃ダメージが 10 + 魔力の15% から 10 + 魔力の18% に増加。",
    description_en: "Skip'n Slash enhanced attack damage increased.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "アーゴット",
    champion_name_en: "Urgot",
    change_type: "buff",
    description: "コラプトシェル: 基本ダメージが増加。\nパージ: 基本ダメージが増加。",
    description_en: "Corrosive Charge and Purge base damage increased.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "マルファイト",
    champion_name_en: "Malphite",
    change_type: "buff",
    description: "基本攻撃力が増加。\nグラウンドスラム: 基本ダメージと攻撃速度の低下率が増加。",
    description_en: "Base AD increased. Ground Slam base damage and attack speed reduction increased.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "オレリオン・ソル",
    champion_name_en: "AurelionSol",
    change_type: "buff",
    description: "天空への飛翔: マナコストが減少し、星炎の息吹のダメージが増加。\n特異点: 敵を閉じ込めた際の星屑獲得スタックが増加。",
    description_en: "Astral Flight mana cost reduced and damage increased. Singularity grants more Stardust stacks.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "ゼド",
    champion_name_en: "Zed",
    change_type: "buff",
    description: "基本物理・魔法防御が増加。\n風魔手裏剣: 進路上にいるその他の敵に与えるダメージ量が増加。",
    description_en: "Base armor and MR increased. Razor Shuriken secondary damage increased.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "ワーウィック",
    champion_name_en: "Warwick",
    change_type: "nerf",
    description: "野獣の牙: 追加ダメージが攻撃力の130%から120%に減少。",
    description_en: "Jaws of the Beast bonus damage decreased.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "ノクターン",
    champion_name_en: "Nocturne",
    change_type: "nerf",
    description: "基本攻撃力が58から54に減少。",
    description_en: "Base AD decreased.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "ゾーイ",
    champion_name_en: "Zoe",
    change_type: "nerf",
    description: "基本攻撃力が減少。\nスパークル！: 基本ダメージが減少。\nスペルシーフ: 基本ダメージが減少。",
    description_en: "Base AD decreased. More Sparkles! and Spell Thief base damage decreased.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "ビクター",
    champion_name_en: "Viktor",
    change_type: "adjust",
    description: "スキルのおすすめレベルアップ順が変更 (メイン1、2 → メイン2、1)。",
    description_en: "Recommended skill level-up order adjusted.",
    is_champion: true
  },
  {
    version: "6.3c",
    champion_name: "ヨードルのライアンドリーの仮面",
    champion_name_en: "LiandrysTorment",
    change_type: "adjust",
    description: "苦悶: 毎秒ダメージが対象の最大体力の0.6%～2.0%から0.3%～2.75%に調整。\n地獄の苦悶: ダメージが低下。",
    description_en: "Torment damage scaling adjusted to be weaker early and stronger late. Hell's Torment damage decreased.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "暁光の美徳",
    champion_name_en: "RadiantVirtue",
    change_type: "nerf",
    description: "導きの光: 自身の最大体力の増加が12.5%から10%に減少。",
    description_en: "Guiding Light max health increase decreased.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "リーサルテンポ",
    champion_name_en: "LethalTempo",
    change_type: "nerf",
    description: "スタックごとの攻撃速度増加が近接・遠隔ともに減少。",
    description_en: "Attack speed per stack decreased for both melee and ranged.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "秘儀の彗星",
    champion_name_en: "ArcaneComet",
    change_type: "nerf",
    description: "基本ダメージが減少 (23～100 → 18～95)。",
    description_en: "Base damage decreased.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "ファーストストライク",
    champion_name_en: "FirstStrike",
    change_type: "nerf",
    description: "与えた追加確定ダメージ量が8%から7%に減少。",
    description_en: "Bonus true damage decreased.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "Faker & TheShy コラボ",
    champion_name_en: "FakerTheShyCollab",
    change_type: "new",
    description: "FakerとTheShyのコラボレーションスキンがリリース。",
    description_en: "Faker & TheShy collaboration skins released.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "ラララランダムミッド",
    champion_name_en: "ARAM",
    change_type: "adjust",
    description: "共鳴撃のクールダウンが0秒に短縮。その他多数のバグ修正とVFX改善。",
    description_en: "Resonating Strike cooldown removed. Various bug fixes and VFX improvements.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "アリーナ",
    champion_name_en: "Arena",
    change_type: "adjust",
    description: "血の契約：虐殺のオムニヴァンプ無限スタック問題を修正して再有効化。金床システムのステータス付与を最適化。一部アイテムのステータス付与バグ修正。",
    description_en: "Blood Pact: Carnage re-enabled. Anvil system stat randomization optimized. Item stat bugs fixed.",
    is_champion: false
  },
  {
    version: "6.3c",
    champion_name: "システム・バグ修正",
    champion_name_en: "SystemBugfixes",
    change_type: "adjust",
    description: "ゾーイのスペルシーフ、暁光の美徳のショップ表示、アクシオムアルカニスト関連（シンドラ、ケイン、ワーウィック、ヴィエゴ）、魂の収穫などのシステムバグを修正。",
    description_en: "Fixed various system bugs including Zoe's Spell Thief, shop displays, and Axiom Arcane interactions.",
    is_champion: false
  }
];

const patchMeta = {
  version: "6.3c",
  prediction_ja: "パッチ6.3cでは、グウェン、アーゴット、マルファイト、オレリオン・ソル、ゼドが強化され、存在感が増すことが予想されます。一方、強力だったゾーイやワーウィック、ノクターンは基本ステータスや火力が落ちており、序盤のプレッシャーが少し緩和されるでしょう。また、リーサルテンポ、秘儀の彗星、ファーストストライクといった主要ルーンが全体的に弱体化されたため、ダメージトレードがやや穏やかになり、耐久力のある構成が相対的に有利になる可能性があります。",
  prediction_en: "In Patch 6.3c, buffs to Gwen, Urgot, Malphite, Aurelion Sol, and Zed are expected to increase their presence. Meanwhile, dominant picks like Zoe, Warwick, and Nocturne received nerfs to base stats and damage, lowering their early-game pressure. Furthermore, major runes such as Lethal Tempo, Arcane Comet, and First Strike were nerfed, which may lead to slower damage trades and make durable team compositions more advantageous."
};

async function insertData() {
  console.log("パッチデータの挿入を開始します...");

  // patches テーブルの既存データ削除
  const { error: deletePatchesError } = await supabase
    .from('patches')
    .delete()
    .eq('version', '6.3c');
    
  if (deletePatchesError) {
    console.error("patchesの既存データ削除エラー:", deletePatchesError);
  } else {
    console.log("既存のpatchesデータを削除しました。");
  }

  // patches テーブルへの挿入
  const { error: insertPatchesError } = await supabase
    .from('patches')
    .insert(patches);

  if (insertPatchesError) {
    console.error("patchesの挿入エラー:", insertPatchesError);
  } else {
    console.log("patchesデータの挿入が完了しました。");
  }

  // patch_meta テーブルの既存データ削除
  const { error: deleteMetaError } = await supabase
    .from('patch_meta')
    .delete()
    .eq('version', '6.3c');
    
  if (deleteMetaError) {
    console.error("patch_metaの既存データ削除エラー:", deleteMetaError);
  } else {
    console.log("既存のpatch_metaデータを削除しました。");
  }

  // patch_meta テーブルへの挿入
  const { error: insertMetaError } = await supabase
    .from('patch_meta')
    .insert([patchMeta]);

  if (insertMetaError) {
    console.error("patch_metaの挿入エラー:", insertMetaError);
  } else {
    console.log("patch_metaデータの挿入が完了しました。");
  }
}

insertData();
