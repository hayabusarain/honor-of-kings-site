import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const patchNotes = [
  {
    "version": "7.1f",
    "champion_name": "ケイル",
    "champion_name_en": "Kayle",
    "change_type": "buff",
    "description": "【基本ステータス】\n基本攻撃力：50 → 54\nマナ自動回復：12 → 16\n\n【天の祝福】\n基本体力回復量：65/105/145/185 → 95/125/155/185",
    "description_en": "[Base Stats] AD and Mana regen increased. [Celestial Blessing] Base heal increased.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "タリヤ",
    "champion_name_en": "Taliyah",
    "change_type": "nerf",
    "description": "【スレッドボレー】\n5個の岩の初撃の基本ダメージ：50/70/90/110 → 40/60/80/100\n\n【サイズミックシャーブ】\n詠唱範囲：9 → 8\n\n【アンレイベルアース】\n最初の岩の爆発ダメージ：30/45/60/75 → 20/35/50/65",
    "description_en": "[Threaded Volley] Damage reduced. [Seismic Shove] Cast range reduced. [Unraveled Earth] Damage reduced.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "アンベッサ",
    "champion_name_en": "Ambessa",
    "change_type": "adjust",
    "description": "【断交】\nシールド耐久値：95～319 + 増加攻撃力の125% → 50～330 + 増加攻撃力の120%",
    "description_en": "[Repudiation] Shield scaling adjusted (weaker early, stronger late).",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "カ・サンテ",
    "champion_name_en": "KSante",
    "change_type": "nerf",
    "description": "【オールアウト】\n最大体力低下量：25% → 30%\n増加物理防御低下量：70% → 80%\n増加魔法防御低下量：70% → 80%",
    "description_en": "[All Out] HP and Armor/MR reduction increased.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "グラガス",
    "champion_name_en": "Gragas",
    "change_type": "adjust",
    "description": "【飲みすぎ注意】\nダメージ：65/90/115/140 + 魔力の90% + 対象の最大体力の7% → 35/70/105/140 + 魔力の70% + 対象の最大体力の8%",
    "description_en": "[Drunken Rage] Base damage and AP ratio reduced, Max HP ratio increased.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "ヴィエゴ",
    "champion_name_en": "Viego",
    "change_type": "nerf",
    "description": "【滅びの王剣】\n対象の現在体力に応じたダメージ：3%/4%/5%/6% → 2%/3%/4%/5%\n\n【ハートブレイカー】\nダメージ範囲：3 → 2.75",
    "description_en": "[Blade of the Ruined King] Current HP damage reduced. [Heartbreaker] Damage radius reduced.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "アクシャン",
    "champion_name_en": "Akshan",
    "change_type": "buff",
    "description": "【報復のブーメラン】\nダメージ：5/35/65/95 + 攻撃力の80% → 10/40/70/100 + 攻撃力の85%",
    "description_en": "[Avengerang] Damage and AD ratio increased.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "ノラ",
    "champion_name_en": "Norra",
    "change_type": "nerf",
    "description": "【記憶の波動】\n基本ダメージ：60/120/180/240 → 55/110/165/220\n\n【ポータルパルーザ！】\nダメージ：100/150/200 + 魔力の60% → 100/140/180 + 魔力の55%",
    "description_en": "[S1] Base damage reduced. [Ult] Damage and AP ratio reduced.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "コグ＝マウ",
    "champion_name_en": "KogMaw",
    "change_type": "nerf",
    "description": "【有機性魔力砲】\n最大体力に応じたダメージ率：2/3/4/5% → 1.5/2.5/3.5/4.5%",
    "description_en": "[Bio-Arcane Barrage] Max HP damage ratio reduced.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "シェン",
    "champion_name_en": "Shen",
    "change_type": "buff",
    "description": "【護刃招来】\n最大体力に応じたダメージ率：2.5/3/3.5/4% → 3/3.5/4/4.5%\n強化時の最大体力に応じたダメージ率：5/5.5/6/6.5% → 5.5/6/6.5/7%",
    "description_en": "[Twilight Assault] Max HP damage ratio increased.",
    "is_champion": true
  },
  {
    "version": "7.1f",
    "champion_name": "バグ修正",
    "champion_name_en": "Bugfixes",
    "change_type": "adjust",
    "description": "親しいフレンドシステム、ロールトレード時のUI不具合、iOSでのクラッシュ、デバイス加熱問題やカクつき等のパフォーマンス最適化を実施。",
    "description_en": "Various UI bugfixes and performance optimizations to address stuttering, crashing, and device heating.",
    "is_champion": false
  }
];

const newMeta = {
  "version": "7.1f",
  "prediction_ja": "今回のパッチは、強力すぎたチャンピオンの抑制と活躍できていなかったチャンピオンの救済が中心です。特にカ・サンテ、ヴィエゴ、タリヤなどの上位ティア常連ピックがナーフされたことで、ピックの多様性が広がります。一方でシェンやケイル、アクシャンといったチャンピオンが強化されたため、トップやミッドレーンでのダメージトレードの様相が変わり、新たな有利・不利のマッチアップが形成されるメタになるでしょう。",
  "prediction_en": "This patch focuses on reigning in overly dominant champions while uplifting struggling ones. Nerfs to top-tier regulars like K'Sante, Viego, and Taliyah will encourage wider pick diversity. Conversely, buffs to Shen, Kayle, and Akshan will shake up trading dynamics in the Top and Mid lanes, creating new favorable matchups and altering the meta landscape."
};

async function main() {
  console.log('Inserting 7.1f patches...');
  for (const patch of patchNotes) {
    const { error } = await supabase.from('patches').insert(patch);
    if (error) {
      console.error(`Failed to insert patch for ${patch.champion_name}:`, error);
    } else {
      console.log(`Inserted patch for ${patch.champion_name}`);
    }
  }
  
  console.log('Updating 7.1f Meta Prediction...');
  await supabase.from('patch_meta').delete().eq('version', '7.1f');
  const { error: metaError } = await supabase.from('patch_meta').insert(newMeta);
  if (metaError) {
    console.error('Failed to insert updated meta:', metaError);
  } else {
    console.log('Successfully updated 7.1f Meta Prediction.');
  }
  
  console.log('Done.');
}

main();
