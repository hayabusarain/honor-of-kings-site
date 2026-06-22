import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const patchNotes = [
  {
    "version": "7.1",
    "champion_name": "カ・サンテ",
    "champion_name_en": "KSante",
    "change_type": "new",
    "description": "ナズーマの誇り、カ・サンテが参戦！",
    "description_en": "K'Sante, the Pride of Nazumah, joins the Rift!",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "バード",
    "champion_name_en": "Bard",
    "change_type": "adjust",
    "description": "【運命の調律】着弾インジケーターのタイミング：スキル詠唱後 → スキル詠唱開始時",
    "description_en": "[Tempered Fate] Indicator timing adjusted.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "イレリア",
    "champion_name_en": "Irelia",
    "change_type": "nerf",
    "description": "【瞬刃】回復量: 攻撃力の16/20/24/28% → 攻撃力の11/14/17/20%",
    "description_en": "[Bladesurge] Healing reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "ゾーイ",
    "champion_name_en": "Zoe",
    "change_type": "buff",
    "description": "【スペルシーフ】ミサイルの基本ダメージ: 20-50 → 25-55\n【スリープバブル】弾速増加\n【ポータルジャンプ】クールダウン短縮",
    "description_en": "[Spell Thief] Damage increased. [Sleepy Trouble Bubble] Missile speed increased. [Portal Jump] CD reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "コーキ",
    "champion_name_en": "Corki",
    "change_type": "buff",
    "description": "【基本ステータス】攻撃力：50 → 54\n【閃光弾】ダメージ反映率: 増加攻撃力の110% → 125%",
    "description_en": "[Base Stats] AD increased. [Phosphorus Bomb] AD ratio increased.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "フィオラ",
    "champion_name_en": "Fiora",
    "change_type": "nerf",
    "description": "【デュエリスト・ダンス】対象の最大体力に応じた確定ダメージ: 4% + (増加攻撃力100ごとに6%) → 3.5% + (増加攻撃力100ごとに5%)",
    "description_en": "[Duelist's Dance] True damage ratio reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "レネクトン",
    "champion_name_en": "Renekton",
    "change_type": "nerf",
    "description": "【ミートカット】通常攻撃命中時の回復量と回復上限が低下",
    "description_en": "[Cull the Meek] Healing and healing cap reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "メル",
    "champion_name_en": "Mel",
    "change_type": "nerf",
    "description": "【灼熱の輝き】キル確定体力割合へのスタックごとの魔力反映率: 0.6% → 0.5%\n【ソーラーフレア】スネア効果時間、直撃時の基本ダメージ低下\n【黄金蝕】追加ダメージの魔力反映率: 3% → 2.5%",
    "description_en": "[Passive] AP ratio reduced. [Q] Root duration and damage reduced. [E] Damage AP ratio reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "ジグス",
    "champion_name_en": "Ziggs",
    "change_type": "buff",
    "description": "【ショートヒューズ】強化ダメージの魔力反映率低下\n【バウンドボム】クールダウン短縮\n【ヘクステックマイン】クールダウン短縮",
    "description_en": "[Short Fuse] AP ratio reduced. [Bouncing Bomb] CD reduced. [Hexplosive Minefield] CD reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "ラカン",
    "champion_name_en": "Rakan",
    "change_type": "nerf",
    "description": "【華麗なる登場】ダメージと魔力反映率低下",
    "description_en": "[Grand Entrance] Damage and AP ratio reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "シヴァーナ",
    "champion_name_en": "Shyvana",
    "change_type": "adjust",
    "description": "【バーンアウト】ドラゴンフォームでの増加ヘイスト低下\n【龍族の血統】増加体力上昇",
    "description_en": "[Burnout] Dragon form haste reduced. [Dragon's Descent] Bonus HP increased.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "ヤスオ",
    "champion_name_en": "Yasuo",
    "change_type": "nerf",
    "description": "【抜刀】基本ダメージ低下\n【鬼哭啾々】物理防御貫通率：50% → 40%",
    "description_en": "[Sweeping Blade] Base damage reduced. [Last Breath] Armor pen reduced.",
    "is_champion": true
  },
  {
    "version": "7.1",
    "champion_name": "ドミニク リガード",
    "champion_name_en": "LordDominiksRegards",
    "change_type": "new",
    "description": "【新アイテム】コスト3300。+25 AD, +36% 物理防御貫通, +25% クリティカル。ジャイアントスレイヤー: 敵の増加体力に応じて最大12%追加ダメージ",
    "description_en": "New item: +25 AD, +36% Armor Pen, +25% Crit. Giant Slayer passive.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "プロテクターの誓い",
    "champion_name_en": "ProtectorsVow",
    "change_type": "remove",
    "description": "【削除】新ルーン「ガーディアン」との効果重複のため削除",
    "description_en": "Removed due to overlap with Guardian rune.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "ブーツ全般",
    "champion_name_en": "Boots",
    "change_type": "adjust",
    "description": "すべてのアップグレードブーツの価格が引き下げられ、ステータスが低下しました。",
    "description_en": "All upgraded boots received cost and stat reductions.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "リッチ ベイン",
    "champion_name_en": "LichBane",
    "change_type": "buff",
    "description": "【基本ステータス】価格：2950 → 2800ゴールド",
    "description_en": "Cost reduced from 2950 to 2800.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "コレクター",
    "champion_name_en": "TheCollector",
    "change_type": "nerf",
    "description": "【基本ステータス】価格：2900 → 3000ゴールド",
    "description_en": "Cost increased from 2900 to 3000.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "ルーデン エコー",
    "champion_name_en": "LudensEcho",
    "change_type": "buff",
    "description": "【基本ステータス】価格：3000 → 2900ゴールド",
    "description_en": "Cost reduced from 3000 to 2900.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "ルーンシステムアップデート",
    "champion_name_en": "Runes",
    "change_type": "adjust",
    "description": "ルーンシステムの大規模アップデート。新ルーン「ガーディアン」「氷の暴君」「エンパワーメント」や、新たな「魔道」パスの導入、「アフターショック」「グレイシャルオーグメント」などの削除。",
    "description_en": "Major rune system overhaul. New runes like Guardian, Iceborn, Empowerment. New Sorcery tree.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "システム変更＆新規要素",
    "champion_name_en": "System",
    "change_type": "new",
    "description": "ゲームエンジンのアップグレード、新シーズン S21 (輝ける威光ジャックス)、新たなワイルドパス、ジャングルモンスターのアグロ表示改善など",
    "description_en": "Game engine upgrade, Season 21, New Wild Pass, Jungle aggro display.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "ラララランダムミッド / アリーナ",
    "champion_name_en": "Modes",
    "change_type": "new",
    "description": "ラララランダムミッドの常設化。レースマップテーマ、新サモナースペル、新オーグメント。アリーナの複数チーム編成や新アイテム（プローラークロウなど）追加。",
    "description_en": "Arena/ARAM permanent and massive updates. Racing theme, new items, and augments.",
    "is_champion": false
  }
];

const newMeta = {
  "version": "7.1",
  "prediction_ja": "カ・サンテの参戦とルーンシステムの大規模アップデートにより、メタ全体が激変します。「ドミニク・リガード」の追加により対タンクの手段が増えた一方で、新ルーンによるビルドの多様化が進みます。また、全ブーツのコスト低下により序盤のパワースパイクが早まり、レーン戦の動きが活発になるでしょう。アリーナやラララランダムミッドも常設化され、ゲーム全体がスピーディな展開になりそうです。",
  "prediction_en": "The addition of K'Sante and the major overhaul of the rune system will drastically shift the meta. The new item Lord Dominik's Regards offers strong anti-tank capabilities, while the new runes provide diverse build paths. Across-the-board boot cost reductions will accelerate early-game power spikes. With Arena and ARAM changes, expect faster-paced games across all modes."
};

async function main() {
  console.log('Inserting 7.1 main patches...');
  for (const patch of patchNotes) {
    const { error } = await supabase.from('patches').insert(patch);
    if (error) {
      console.error(`Failed to insert patch for ${patch.champion_name}:`, error);
    } else {
      console.log(`Inserted patch for ${patch.champion_name}`);
    }
  }
  
  console.log('Updating 7.1 Meta Prediction...');
  // Delete the old 7.1 meta, then insert the new comprehensive one
  await supabase.from('patch_meta').delete().eq('version', '7.1');
  const { error: metaError } = await supabase.from('patch_meta').insert(newMeta);
  if (metaError) {
    console.error('Failed to insert updated meta:', metaError);
  } else {
    console.log('Successfully updated 7.1 Meta Prediction.');
  }
  
  console.log('Done.');
}

main();
