import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const patchNotes = [
  {
    "version": "7.1",
    "champion_name": "ランダムミッド (ARAM)",
    "champion_name_en": "ARAM",
    "change_type": "adjust",
    "description": "【緊急調整 (4月11日)】\n【フィールドの調整】\nレースのスタート地点とミッドレーンからテレポートトラックを削除",
    "description_en": "[Hotfix] Removed teleport tracks from start and mid.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "ラララランダムミッド",
    "champion_name_en": "Arena",
    "change_type": "nerf",
    "description": "【緊急調整 (4月11日)】\n【フィールドの調整】\nレースのスタート地点の位置を調整\n\n【サモナースペルの調整】\n・雪玉チャリオット\nダメージ：60-200 + 最大体力の4% → 30-90 + 最大体力の1%\n射程：20 → 15 (アップグレード後 30 → 20)\n\n・活力の雪玉チャリオット\nダメージ、体力回復量、射程を減少\n\n・弾道の雪玉チャリオット\n雪玉とチャリオットのダメージ、射程を減少\n\n【オーグメントの調整】\n強化版「メガ雪玉」：追加確定ダメージ低下\n強化版「貫通雪玉」：追加確定ダメージ低下\n強化版「ヘイスト雪玉」：スキルヘイスト 100 → 50",
    "description_en": "[Hotfix] Various nerfs to Snowball Chariot variants and Snowball augments. Field start position adjusted.",
    "is_champion": false
  },
  {
    "version": "7.1",
    "champion_name": "バグ修正",
    "champion_name_en": "Bugfixes",
    "change_type": "adjust",
    "description": "【緊急調整 (4月11日)】\nチャンピオン選択画面でオーグメントを切り替える際に、時々失敗することがあった不具合を修正。",
    "description_en": "[Hotfix] Fixed an issue with swapping augments in champ select.",
    "is_champion": false
  }
];

async function main() {
  console.log('Inserting hotfix patches for 7.1...');
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
