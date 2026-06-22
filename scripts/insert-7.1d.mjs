import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const patchNotes = [
  {
    "version": "7.1d",
    "champion_name": "ヴェイン",
    "champion_name_en": "Vayne",
    "change_type": "nerf",
    "description": "【タンブル】\n通常攻撃強化時間：7秒 → 4秒\n\n【シルバーボルト】\n確定ダメージ：3/6/9/12% → 2/5/8/11%\n攻撃速度：15/20/25/30% → 10/15/20/25%",
    "description_en": "[Tumble] Empowered attack duration: 7s -> 4s\n[Silver Bolts] True damage: 3/6/9/12% -> 2/5/8/11%\nAttack speed: 15-30% -> 10-25%",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "アーゴット",
    "champion_name_en": "Urgot",
    "change_type": "buff",
    "description": "【基本ステータス】\n基本攻撃力：58 → 62\n\n【エコーフレイム】\n攻撃力反映率：50/65/80/95% → 60/75/90/105%",
    "description_en": "[Base Stats] AD: 58 -> 62\n[Echoing Flames] AD ratio: 50-95% -> 60-105%",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "トリスターナ",
    "champion_name_en": "Tristana",
    "change_type": "buff",
    "description": "【ヨードルグレネード】\nユニットキル後の爆発ダメージ：55/85/115/145 → 65/100/135/170",
    "description_en": "[Explosive Charge] Explosion damage on kill: 55-145 -> 65-170",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "メル",
    "champion_name_en": "Mel",
    "change_type": "nerf",
    "description": "【輝きの連撃】\n爆発ごとのダメージ：13/16/19/22 + 魔力の7% → 11/14/17/20 + 魔力の6%\nミニオンに対するダメージ補正： 75% → 90%\n\n【反駁】\nクールダウン：32/29/26/23秒 → 38/36/34/32秒",
    "description_en": "[Shimmering Strike] Explosion damage: 13-22 + 7% AP -> 11-20 + 6% AP\nMinion damage modifier: 75% -> 90%\n[Rebuttal] Cooldown: 32-23s -> 38-32s",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "ブラッドミア",
    "champion_name_en": "Vladimir",
    "change_type": "buff",
    "description": "【基本ステータス】\n基本物理防御：34 → 37\n\n【真紅の盟約】\n魔力から増加体力への変換率：120% → 140%",
    "description_en": "[Base Stats] Armor: 34 -> 37\n[Crimson Pact] AP to bonus health conversion: 120% -> 140%",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "リヴェン",
    "champion_name_en": "Riven",
    "change_type": "adjust",
    "description": "【ルーンブレード】\n追加ダメージの反映率：32%～60% → 22%～50%\nジャングルモンスターへのダメージ率：50% → 65%",
    "description_en": "[Runic Blade] Bonus damage ratio: 32%-60% -> 22%-50%\nJungle monster damage ratio: 50% -> 65%",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "シヴィア",
    "champion_name_en": "Sivir",
    "change_type": "buff",
    "description": "【基本ステータス】\nレベルアップごとの攻撃力増加量：3.5 → 4\n\n【ブーメランブレード】\n攻撃力反映率：70/75/80/85% → 75/80/85/90%",
    "description_en": "[Base Stats] AD per level: 3.5 -> 4\n[Boomerang Blade] AD ratio: 70-85% -> 75-90%",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "ゼリ",
    "champion_name_en": "Zeri",
    "change_type": "buff",
    "description": "【基本ステータス】\nレベルアップごとの攻撃力増加量：3.5 → 4\n\n【生体バッテリー】\n攻撃力反映率：104/108/112/116/120% → 105/110/115/120/125%\n\n【スパークサージ】\nクールダウン：24/21.5/19/16.5秒 → 22/19.5/17/14.5秒",
    "description_en": "[Base Stats] AD per level: 3.5 -> 4\n[Living Battery] AD ratio: 104-120% -> 105-125%\n[Spark Surge] Cooldown: 24-16.5s -> 22-14.5s",
    "is_champion": true
  },
  {
    "version": "7.1d",
    "champion_name": "ルーン調整",
    "champion_name_en": "Runes",
    "change_type": "adjust",
    "description": "【リーサルテンポ】\nスタックごとの攻撃速度（遠隔）：3%～12% → 3%～10%\n\n【エンパワーメント】\nダメージ増加効果：8% → 9%\nアダプティブダメージ：40～180 → 60～200\n\n【英気集中】\n発動の下限値：70% → 65%\nアダプティブフォース：1～15 → 2～20\n\n【イシュタルの種入れ】\n各プラントの再取得までの時間：45秒 → 30秒",
    "description_en": "[Lethal Tempo] AS per stack (ranged): 3-12% -> 3-10%\n[Empowerment] Damage increase: 8% -> 9%\n[Absolute Focus] Threshold: 70% -> 65%\n[Ixtali Seedjar] Plant respawn: 45s -> 30s",
    "is_champion": false
  },
  {
    "version": "7.1d",
    "champion_name": "ランダムミッド (ARAM)",
    "champion_name_en": "ARAM",
    "change_type": "adjust",
    "description": "序盤の復活タイマーを延長。\nオレリオン・ソル、セト、ベイガー、レオナ、ラムス、シェン、アリスター、ブラッドミア、シヴァーナ、ガレン、ヴェイン、ジグス、ミス・フォーチュン、ザヤ、トゥイッチ、ヴァルスのダメージ調整。",
    "description_en": "Early game respawn timers extended. Various champion damage adjustments.",
    "is_champion": false
  },
  {
    "version": "7.1d",
    "champion_name": "ラララランダムミッド",
    "champion_name_en": "Arena",
    "change_type": "adjust",
    "description": "【フィールドの調整】\nレース開始地点でのノックアップ効果時間: 0.5秒 → 0.2秒\n\n【新オーグメント】\n「暴虐なる搾取」「チャージストライク」「ワンストライク」「ソードストライク」「アックスストライク」「パワー同期」「防御同期」「ヘイスト同期」などを追加。\n\n【オーグメントの調整】\nアダプティブフォース: 2 → 1\nプールの調整など。",
    "description_en": "Field adjustments, new augments added, augment adjustments.",
    "is_champion": false
  },
  {
    "version": "7.1d",
    "champion_name": "新スキン",
    "champion_name_en": "Skins",
    "change_type": "new",
    "description": "ネオンデアデビル カイ＝サ\nネオンデアデビル ヘカリム\nネオンデアデビル イレリア\nネオンデアデビル オーロラ\nネオンデアデビル ゼド\nネオンデアデビル グラガス\nプレステージセレクト ネオンデアデビル カイ＝サ\n(日本時間4月30日9時01分リリース)",
    "description_en": "Neon Daredevil Kai'Sa, Hecarim, Irelia, Aurora, Zed, Gragas & Prestige Kai'Sa (Apr 30)",
    "is_champion": false
  }
];

async function main() {
  console.log('Inserting patches for 7.1d...');
  for (const patch of patchNotes) {
    const { error } = await supabase.from('patches').insert(patch);
    if (error) {
      console.error(`Failed to insert patch for ${patch.champion_name}:`, error);
    } else {
      console.log(`Inserted patch for ${patch.champion_name}`);
    }
  }
  console.log('Done.');
}

main();
