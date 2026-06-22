import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const patchNotes = [
  {
    "version": "7.1b",
    "champion_name": "タロン",
    "champion_name_en": "Talon",
    "change_type": "buff",
    "description": "【飛燕手裏剣】\n第1フェーズのダメージ：35/45/55/65 + 増加攻撃力の45% → 40/50/60/70 + 増加攻撃力の50%\nジャングルモンスターへのダメージ率：70% → 80%",
    "description_en": "[Rake] 1st phase damage: 35-65 + 45% bonus AD -> 40-70 + 50% bonus AD\nJungle monster damage ratio: 70% -> 80%",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "フィズ",
    "champion_name_en": "Fizz",
    "change_type": "buff",
    "description": "【ウニトゲストライク】\n魔力反映率：50% → 60%",
    "description_en": "[Urchin Strike] AP ratio: 50% -> 60%",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "ラムス",
    "champion_name_en": "Rammus",
    "change_type": "nerf",
    "description": "【かたくなる】\n物理防御反映率：55%/60%/65%/70% → 45%/50%/55%/60%",
    "description_en": "[Defensive Ball Curl] Armor ratio: 55-70% -> 45-60%",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "ジャックス",
    "champion_name_en": "Jax",
    "change_type": "adjust",
    "description": "【基本ステータス】\nレベルアップごとの物理防御増加量：3.9 → 4.5\n\n【アサルトアタック】\nレベルアップごとの攻撃速度増加量：5～19 → 6～20\n\n【カウンターストライク】\n最大体力に対するダメージ率：3% → 3.5%\n\n【ウェポングランドマスター】\n自動効果基本ダメージ：60/110/160 → 75/130/185\n発動効果基本ダメージ：150/250/350 → 100/200/300",
    "description_en": "[Base Stats] Armor per level: 3.9 -> 4.5\n[Relentless Assault] AS per level: 5-19 -> 6-20\n[Counter Strike] Max HP damage ratio: 3% -> 3.5%\n[Grandmaster's Might] Passive base damage: 60-160 -> 75-185\nActive base damage: 150-350 -> 100-300",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "ヴァルス",
    "champion_name_en": "Varus",
    "change_type": "buff",
    "description": "【復讐の化身】\nチャンピオン以外のユニットをキルした際の攻撃速度：15%/20%/25% → 20%/25%/30%\nチャンピオンキル時の攻撃速度：50% ⇒ 55%",
    "description_en": "[Living Vengeance] AS on non-champion kill: 15-25% -> 20-30%\nAS on champion kill: 50% -> 55%",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "トゥイッチ",
    "champion_name_en": "Twitch",
    "change_type": "buff",
    "description": "【スゴイ毒ダ！】\n最大速度時の攻撃速度：10/15/20/25/30% → 30/35/40/45/50%",
    "description_en": "[Deadly Venom] AS at max stacks: 10-30% -> 30-50%",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "レネクトン",
    "champion_name_en": "Renekton",
    "change_type": "nerf",
    "description": "【基本ステータス】\n攻撃力：70 → 66\n\n【メッタ斬り】\nクールダウン：12.5/11/9.5/8秒 → 14/12/10/8秒\n基本ダメージ：30/60/90/120 → 24/48/72/96\n強化時の基本ダメージ：45/90/135/180 → 36/72/108/144",
    "description_en": "[Base Stats] AD: 70 -> 66\n[Ruthless Predator] Cooldown: 12.5-8s -> 14-8s\nBase damage: 30-120 -> 24-96\nEmpowered base damage: 45-180 -> 36-144",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "スウェイン",
    "champion_name_en": "Swain",
    "change_type": "nerf",
    "description": "【魔帝戴冠】\n再発動時の魔力反映率：60% → 45%",
    "description_en": "[Demonic Ascension] Recast AP ratio: 60% -> 45%",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "ヨネ",
    "champion_name_en": "Yone",
    "change_type": "buff",
    "description": "【霊断刀】\nシールド量：30 + 増加攻撃力の70% → 45 + 増加攻撃力の80%",
    "description_en": "[Spirit Cleave] Shield amount: 30 + 70% bonus AD -> 45 + 80% bonus AD",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "ティーモ",
    "champion_name_en": "Teemo",
    "change_type": "nerf",
    "description": "【毒たっぷり吹き矢】\n通常攻撃時効果の基本ダメージ：10～38 → 8～36\n毎秒の基本ダメージ：11～53 → 8～50\n\n【目つぶしダーツ】\n基本ダメージ：60/110/160/210 → 50/95/140/185",
    "description_en": "[Toxic Shot] On-hit base damage: 10-38 -> 8-36\nDoT base damage: 11-53 -> 8-50\n[Blinding Dart] Base damage: 60-210 -> 50-185",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "アムム",
    "champion_name_en": "Amumu",
    "change_type": "nerf",
    "description": "【めそめそ】\n基本ダメージ：1.4/1.8/2.2/2.6% → 1.2/1.5/1.8/2.1%\n\n【だだっこ】\nスロウ効果：20% → 10%",
    "description_en": "[Despair] Base damage: 1.4-2.6% -> 1.2-2.1%\n[Tantrum] Slow: 20% -> 10%",
    "is_champion": true
  },
  {
    "version": "7.1b",
    "champion_name": "フォビドゥン アイドル",
    "champion_name_en": "ForbiddenIdol",
    "change_type": "buff",
    "description": "【基本ステータス】\nマナ自動回復：+0 → +25%",
    "description_en": "[Base Stats] Mana Regen: +0 -> +25%",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "ハーモニック エコー",
    "champion_name_en": "HarmonicEcho",
    "change_type": "buff",
    "description": "【基本ステータス】\nマナ自動回復：+0 → +50%",
    "description_en": "[Base Stats] Mana Regen: +0 -> +50%",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "フロー ウォーター スタッフ",
    "champion_name_en": "StaffofFlowingWater",
    "change_type": "buff",
    "description": "【基本ステータス】\nマナ自動回復：+0 → +50%",
    "description_en": "[Base Stats] Mana Regen: +0 -> +50%",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "アーデント センサー",
    "champion_name_en": "ArdentCenser",
    "change_type": "buff",
    "description": "【基本ステータス】\nマナ自動回復：+0 → +50%",
    "description_en": "[Base Stats] Mana Regen: +0 -> +50%",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "アイオニア ブーツ",
    "champion_name_en": "IonianBootsofLucidity",
    "change_type": "buff",
    "description": "【基本ステータス】\nマナ自動回復：+0 → +50%",
    "description_en": "[Base Stats] Mana Regen: +0 -> +50%",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "トリニティ フォース",
    "champion_name_en": "TrinityForce",
    "change_type": "adjust",
    "description": "【基本ステータス】\n体力：+250 → +333\nスキルヘイスト：+25 → +20\n\n【勇猛】\n[削除] キルを獲得すると、移動速度が60増加する。",
    "description_en": "[Base Stats] Health: +250 -> +333\nAbility Haste: +25 -> +20\n[Rage] Removed: 60 bonus MS on kill.",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "ナヴォリ クイックブレード",
    "champion_name_en": "NavoriQuickblades",
    "change_type": "adjust",
    "description": "【基本ステータス】\n価格：3000 → 2800ゴールド\n攻撃力：+40 → +0\n攻撃速度：+15% → +45%\n移動速度：+0 → +5%\n\n【限りある命】\n[削除]\n\n【巧みな一撃】\n[調整] 通常攻撃を行うと、通常スキルの残りクールダウンが15%短縮される。",
    "description_en": "[Base Stats] Cost: 3000 -> 2800\nAD: +40 -> 0\nAS: +15% -> +45%\nMS: +0 -> +5%\n[Impermenence] Removed\n[Deft Strikes] Adjusted: Basic attacks reduce remaining basic ability cooldowns by 15%.",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "ナッシャー トゥース",
    "champion_name_en": "NashorsTooth",
    "change_type": "buff",
    "description": "【基本ステータス】\n価格：3000ゴールド ⇒ 2800ゴールド",
    "description_en": "[Base Stats] Cost: 3000 -> 2800",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "ゲームモード変更",
    "champion_name_en": "Modes",
    "change_type": "adjust",
    "description": "【ランダムミッド】\n15分経過時点でのデスタイマーを50秒に調整\n\n【ラララランダムミッド】\nレースのスタート地点：発進後のハンドリングがさらにスムーズになります。\nオーグメントの調整（行動妨害耐性リバリー、文武両道、全速前進、レースカー強化キットなど）",
    "description_en": "[ARAM] Death timer at 15 mins adjusted to 50s.\n[Arena] Start area handling smoothed out. Augment adjustments.",
    "is_champion": false
  },
  {
    "version": "7.1b",
    "champion_name": "バグ修正",
    "champion_name_en": "Bugfixes",
    "change_type": "adjust",
    "description": "セナの攻撃速度バグ、エンチャントのVFX、ルーン説明文の修正などを実施。",
    "description_en": "Fixed Senna AS bug, enchant VFX, and rune tooltips.",
    "is_champion": false
  }
];

async function main() {
  console.log('Inserting patches for 7.1b...');
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
