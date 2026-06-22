import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// プロジェクトルートの .env.local を読み込む
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const version = "7.1e";

const meta = {
  version,
  prediction_ja: "このパッチ7.1eでは、新チャンピオン「タリヤ」の参戦と、一部チャンピオンのバランス調整が行われます。ガレンの耐久力やシヴァーナのスノーボール性能が適正化される一方で、バードやグレイブス、ケインといったチャンピオンの序盤・中盤のパフォーマンスが強化されます。また、ランデュインオーメンの強化により、ADキャリーへのカウンターとしてのタンクの役割がさらに重要になります。全体として、タンクや中盤のテンポを重視した構成が環境の中心になると予想されます。",
  prediction_en: "In Patch 7.1e, the new champion Taliyah joins the rift alongside balance adjustments for several champions. While Garen's durability and Shyvana's snowball potential are tuned down, early to mid-game performers like Bard, Graves, and Kayn receive meaningful buffs. Furthermore, the buff to Randuin's Omen strengthens the role of tanks as a counter to AD carries. Overall, team compositions focusing on tanks and mid-game tempo are expected to dominate the meta."
};

const changes = [
  {
    version,
    champion_name: "タリヤ",
    champion_name_en: "Taliyah",
    is_champion: true,
    change_type: "new",
    description: "【新チャンピオン参戦】\nタリヤは少女の好奇心と大人の責任感の間で揺れ動く、シュリーマ出身の流浪のメイジだ。\n日本時間5月15日9時01分にリリース予定。",
    description_en: "[New Champion] Taliyah, the Stoneweaver, will be released on May 15 at 09:01 JST."
  },
  {
    version,
    champion_name: "ガレン",
    champion_name_en: "Garen",
    is_champion: true,
    change_type: "nerf",
    description: "【タフガイ】\n一定時間ダメージや敵のスキルを受けなかった際の体力自動回復：レベルに応じて1.3%～5.5% → 1.2%～4%\n\n【ジャッジメント】\n基本ダメージ：15/19/23/27 → 13/17/21/25\n物理防御低下：15% → 10%",
    description_en: "[Perseverance] Health regen: 1.3%-5.5% -> 1.2%-4%\n[Judgment] Base damage: 15/19/23/27 -> 13/17/21/25\nArmor reduction: 15% -> 10%"
  },
  {
    version,
    champion_name: "シヴァーナ",
    champion_name_en: "Shyvana",
    is_champion: true,
    change_type: "adjust",
    description: "【基本ステータス】\n基本攻撃力：58 → 62\n\n【龍血の憤怒】\n大型モンスターキル時の「龍血の力」スタック数：10 → 8\n\n【ツインバイト】\nドラゴン形態時のスロウ効果：50% → 30%\n\n【龍族の血統】\n毎秒獲得するフューリー：1.5/2/2.5 → 1/1.5/2",
    description_en: "[Base Stats] AD: 58 -> 62\n[Fury of the Dragonborn] Stacks from large monsters: 10 -> 8\n[Twin Bite] Dragon form slow: 50% -> 30%\n[Dragon's Descent] Fury per second: 1.5/2/2.5 -> 1/1.5/2"
  },
  {
    version,
    champion_name: "ライズ",
    champion_name_en: "Ryze",
    is_champion: true,
    change_type: "nerf",
    description: "【基本ステータス】\n基本攻撃力：58 → 54\n\n【オーバーロード】\n発動後の増加移動速度：30%/35%/40%/45% → 20%/27.5%/35%/42.5%\n基本ダメージ：80/105/130/155 → 70/95/120/145",
    description_en: "[Base Stats] AD: 58 -> 54\n[Overload] Movement speed: 30%-45% -> 20%-42.5%\nBase damage: 80/105/130/155 -> 70/95/120/145"
  },
  {
    version,
    champion_name: "ツイステッド・フェイト",
    champion_name_en: "TwistedFate",
    is_champion: true,
    change_type: "nerf",
    description: "【イカサマダイス】\nユニットキル時の追加ゴールド：2～12 → 1～9\n\n【スタックデッキ】\n発動中の攻撃速度：30%/35%/40%/45% → 20%/25%/30%/35%",
    description_en: "[Loaded Dice] Bonus gold per kill: 2-12 -> 1-9\n[Stacked Deck] Attack speed: 30%-45% -> 20%-35%"
  },
  {
    version,
    champion_name: "バード",
    champion_name_en: "Bard",
    is_champion: true,
    change_type: "buff",
    description: "【回復の遺物】\nチャージ時間：15秒(全ランク) → 15/14.5/14/13.5秒\n\n【運命の調律】\nクールダウン：80/70/60秒 → 75/65/55秒",
    description_en: "[Caretaker's Shrine] Charge time: 15s -> 15/14.5/14/13.5s\n[Tempered Fate] Cooldown: 80/70/60s -> 75/65/55s"
  },
  {
    version,
    champion_name: "グレイブス",
    champion_name_en: "Graves",
    is_champion: true,
    change_type: "buff",
    description: "【エンドライン】\n爆発時の増加攻撃力反映率：80%/110%/140%/170% → 110%/130%/150%/170%\n\n【クイックドロー】\nクールダウン：16/15/14/13秒 → 13/13/13/13秒",
    description_en: "[End of the Line] Explosion bonus AD ratio: 80%-170% -> 110%-170%\n[Quickdraw] Cooldown: 16-13s -> 13s at all ranks"
  },
  {
    version,
    champion_name: "ケイン",
    champion_name_en: "Kayn",
    is_champion: true,
    change_type: "buff",
    description: "【緋眼の大鎌】\n「影の暗殺者」形態時の追加ダメージの反映率：48%～62% → 52%～66%\n\n【刃影襲】\n増加攻撃力反映率：110% → 120%",
    description_en: "[The Darkin Scythe] Shadow Assassin bonus damage: 48%-62% -> 52%-66%\n[Blade's Reach] Bonus AD ratio: 110% -> 120%"
  },
  {
    version,
    champion_name: "スモルダー",
    champion_name_en: "Smolder",
    is_champion: true,
    change_type: "adjust",
    description: "【スーパーこげこげブレス】\n強化効果の発動に必要なスタック数：20/85/150 → 25/100/175\nクリティカルベースのダメージ反映率：クリティカル率 × 50% → （クリティカル率 + 追加クリティカルダメージ）× 45%",
    description_en: "[Super Scorcher Breath] Required stacks for upgrade: 20/85/150 -> 25/100/175\nCrit damage ratio: Crit Chance * 50% -> (Crit Chance + Bonus Crit Damage) * 45%"
  },
  {
    version,
    champion_name: "ランデュイン オーメン",
    champion_name_en: "RanduinsOmen",
    is_champion: false,
    change_type: "buff",
    description: "【忍耐力】\nクリティカルダメージ軽減：20% → 30%",
    description_en: "[Determination] Critical damage reduction: 20% -> 30%"
  },
  {
    version,
    champion_name: "クラーケンスレイヤー",
    champion_name_en: "KrakenSlayer",
    is_champion: false,
    change_type: "buff",
    description: "【基本ステータス】\n価格：3000ゴールド → 2800ゴールド\n\n【打倒】\n減少体力に応じた最大ダメージ：50% → 70%",
    description_en: "[Base Stats] Cost: 3000g -> 2800g\n[Bring It Down] Max damage based on missing health: 50% -> 70%"
  },
  {
    version,
    champion_name: "サンダード スカイ",
    champion_name_en: "SunderedSky",
    is_champion: false,
    change_type: "buff",
    description: "【基本ステータス】\n体力：300 → 350\n\n【ライトシールドストライク】\n減少体力に応じた回復量：5% → 6%",
    description_en: "[Base Stats] Health: 300 -> 350\n[Lightshield Strike] Missing health healing: 5% -> 6%"
  },
  {
    version,
    champion_name: "ランダムミッド (ARAM)",
    champion_name_en: "ARAM",
    is_champion: false,
    change_type: "adjust",
    description: "【オーグメント調整】\nバンパーカー: CD 40秒→60秒、ノックアップ 1.5秒→0.5秒\nゆっくり着実に: 変換率 0.75→1\nワンストライク: 基本購入ゴールド減少率 5%→4%\nチャージシールド: シールド量 30%→25%\nその他、複数のオーグメントでスキルヘイストやダメージの調整。",
    description_en: "Various adjustments to ARAM augments including Bumper Cars, Slow and Steady, One Strike, and Charged Shield."
  },
  {
    version,
    champion_name: "新スキン",
    champion_name_en: "Skins",
    is_champion: false,
    change_type: "new",
    description: "【カフェキューティーズ ノラ】 5月20日リリース予定\n【プールパーティー タリヤ】 5月15日リリース予定",
    description_en: "Cafe Cuties Norra (May 20)\nPool Party Taliyah (May 15)"
  }
];

async function main() {
  try {
    console.log(`Starting to insert Patch ${version}...`);
    
    // 既存データの削除
    await supabase.from('patch_meta').delete().eq('version', version);
    await supabase.from('patches').delete().eq('version', version);

    // meta の挿入
    const { error: metaError } = await supabase.from('patch_meta').insert(meta);
    if (metaError) throw metaError;
    console.log("Meta inserted successfully.");

    // patches の挿入
    const { error: patchError } = await supabase.from('patches').insert(changes);
    if (patchError) throw patchError;
    console.log(`Successfully inserted ${changes.length} changes for Patch ${version}.`);

  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

main();
