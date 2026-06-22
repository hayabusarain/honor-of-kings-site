import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const patchNotes = [
  {
    "version": "7.1c",
    "champion_name": "ランダムミッド (ARAM)",
    "champion_name_en": "ARAM",
    "change_type": "adjust",
    "description": "【サモナースペルの調整】\n「雪玉」の再発動時の速度が増加。\n※ランダムミッド、ラララランダムミッド、スペルブック ランダムミッドに適用",
    "description_en": "[Summoner Spells] Snowball recast speed increased.",
    "is_champion": false
  },
  {
    "version": "7.1c",
    "champion_name": "ラララランダムミッド",
    "champion_name_en": "Arena",
    "change_type": "adjust",
    "description": "【フィールドの調整】\nミッドレーンのテレポートトラックからアイテムを削除。\n最初のペイント選択フェーズは時間無制限となり、インターフェースを閉じられるようになりました。\n\n【オーグメントの調整】\n「初志貫徹」を選択した際に、アルティメットスキルに関連するオーグメントが出現しなくなります。\nオーグメントプールの最適化：一部のオーグメントが特定のクラス専用になりました。",
    "description_en": "Field adjustments, augment optimizations.",
    "is_champion": false
  },
  {
    "version": "7.1c",
    "champion_name": "ソーンメイル",
    "champion_name_en": "Thornmail",
    "change_type": "nerf",
    "description": "【魔法ダメージ】\n20 + 増加物理防御の6% + 増加体力の2% → 20 + 増加物理防御の6% + 増加体力の1%",
    "description_en": "[Magic Damage] 20 + 6% Bonus Armor + 2% Bonus HP -> 20 + 6% Bonus Armor + 1% Bonus HP",
    "is_champion": false
  },
  {
    "version": "7.1c",
    "champion_name": "ギャンブラーの剣",
    "champion_name_en": "GamblersBlade",
    "change_type": "adjust",
    "description": "アイテムパネルで所持しているゴールドのスタック数を確認できるようになりました。",
    "description_en": "Gold stacks can now be checked in the item panel.",
    "is_champion": false
  },
  {
    "version": "7.1c",
    "champion_name": "炎術師のクローク",
    "champion_name_en": "PyromancersCloak",
    "change_type": "nerf",
    "description": "【浄化の炎】\n継続ダメージ：60秒 → 30秒\n火傷効果ごとのダメージ: 40秒 → 30秒",
    "description_en": "[Cleansing Flame] DoT: 60s -> 30s\nDamage per burn: 40s -> 30s",
    "is_champion": false
  },
  {
    "version": "7.1c",
    "champion_name": "バグ修正",
    "champion_name_en": "Bugfixes",
    "change_type": "adjust",
    "description": "・「スタックサウルス・レックス」のスタックが「ヒュブリス」に正しく作用していなかった不具合を修正\n・特定の状況で「エーテル武器」が発動しない不具合を修正\n・オーグメント「お抱え運転手」とユーミの相互作用に関する不具合を修正",
    "description_en": "Various bugfixes including Hubris, Etherial Weapon, and Yuumi with Chauffeur.",
    "is_champion": false
  }
];

async function main() {
  console.log('Inserting patches for 7.1c...');
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
