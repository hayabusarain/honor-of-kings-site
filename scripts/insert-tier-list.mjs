import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const rawData = [
  { cn: "齐天大圣", jp: "ウーコン", en: "MonkeyKing", win: 53.75, pick: 2.59, ban: 0.40 },
  { cn: "迅捷斥候", jp: "ティーモ", en: "Teemo", win: 53.23, pick: 3.99, ban: 18.49 },
  { cn: "亡灵战神", jp: "サイオン", en: "Sion", win: 52.13, pick: 4.05, ban: 0.39 },
  { cn: "铁血狼母", jp: "アンベッサ", en: "Ambessa", win: 51.88, pick: 4.81, ban: 2.33 },
  { cn: "纳祖芒荣耀", jp: "カ・サンテ", en: "KSante", win: 51.86, pick: 9.82, ban: 65.55 },
  { cn: "暗夜猎手", jp: "ヴェイン", en: "Vayne", win: 51.62, pick: 2.39, ban: 13.27 },
  { cn: "腕豪", jp: "セト", en: "Sett", win: 51.54, pick: 14.72, ban: 2.75 },
  { cn: "圣锤之毅", jp: "ポッピー", en: "Poppy", win: 51.37, pick: 2.63, ban: 0.24 },
  { cn: "深海泰坦", jp: "ノーチラス", en: "Nautilus", win: 51.35, pick: 2.34, ban: 6.65 },
  { cn: "德玛西亚之力", jp: "ガレン", en: "Garen", win: 51.34, pick: 16.30, ban: 7.10 },
  { cn: "复仇之矛", jp: "カリスタ", en: "Kalista", win: 51.30, pick: 1.29, ban: 3.23 },
  { cn: "符文法师", jp: "ライズ", en: "Ryze", win: 51.29, pick: 1.51, ban: 4.49 },
  { cn: "炼金术士", jp: "シンジド", en: "Singed", win: 51.27, pick: 1.58, ban: 0.25 },
  { cn: "机械公敌", jp: "ランブル", en: "Rumble", win: 51.06, pick: 2.90, ban: 0.50 },
  { cn: "暮光之眼", jp: "シェン", en: "Shen", win: 50.82, pick: 1.34, ban: 0.06 },
  { cn: "祖安狂人", jp: "ドクター・ムンド", en: "DrMundo", win: 50.72, pick: 5.92, ban: 1.06 },
  { cn: "熔岩巨兽", jp: "マルファイト", en: "Malphite", win: 50.61, pick: 5.23, ban: 17.51 },
  { cn: "狂暴之心", jp: "ケネン", en: "Kennen", win: 50.58, pick: 1.28, ban: 0.33 },
  { cn: "山隐之焰", jp: "オーン", en: "Ornn", win: 50.26, pick: 2.40, ban: 0.17 },
  { cn: "蛮族之王", jp: "トリンダメア", en: "Tryndamere", win: 50.07, pick: 3.02, ban: 22.96 },
  { cn: "荒漠屠夫", jp: "レネクトン", en: "Renekton", win: 49.94, pick: 4.26, ban: 0.30 },
  { cn: "沙漠死神", jp: "ナサス", en: "Nasus", win: 49.79, pick: 9.18, ban: 3.75 },
  { cn: "不灭狂雷", jp: "ボリベア", en: "Volibear", win: 49.68, pick: 4.68, ban: 2.51 },
  { cn: "正义天使", jp: "ケイル", en: "Kayle", win: 49.50, pick: 2.42, ban: 0.36 },
  { cn: "未来守护者", jp: "ジェイス", en: "Jayce", win: 49.45, pick: 2.76, ban: 0.64 },
  { cn: "炽炎雏龙", jp: "スモルダー", en: "Smolder", win: 49.37, pick: 1.14, ban: 18.44 },
  { cn: "迷失之牙", jp: "ナー", en: "Gnar", win: 49.33, pick: 2.74, ban: 0.24 },
  { cn: "封魔剑魂", jp: "ヨネ", en: "Yone", win: 49.26, pick: 5.52, ban: 4.99 },
  { cn: "无畏战车", jp: "アーゴット", en: "Urgot", win: 49.10, pick: 6.74, ban: 3.21 },
  { cn: "武器大师", jp: "ジャックス", en: "Jax", win: 48.79, pick: 2.41, ban: 0.19 },
  { cn: "刀锋舞者", jp: "イレリア", en: "Irelia", win: 48.70, pick: 1.96, ban: 0.92 },
  { cn: "暗裔剑魔", jp: "エイトロックス", en: "Aatrox", win: 48.65, pick: 6.56, ban: 5.21 },
  { cn: "铁铠冥魂", jp: "モルデカイザー", en: "Mordekaiser", win: 48.52, pick: 8.55, ban: 13.87 },
  { cn: "诺克萨斯之手", jp: "ダリウス", en: "Darius", win: 48.23, pick: 16.22, ban: 7.33 },
  { cn: "灵罗娃娃", jp: "グウェン", en: "Gwen", win: 48.18, pick: 1.61, ban: 0.31 },
  { cn: "青钢影", jp: "カミール", en: "Camille", win: 48.01, pick: 1.97, ban: 0.08 },
  { cn: "疾风剑豪", jp: "ヤスオ", en: "Yasuo", win: 47.94, pick: 2.80, ban: 11.85 },
  { cn: "放逐之刃", jp: "リヴェン", en: "Riven", win: 47.76, pick: 1.95, ban: 0.34 },
  { cn: "无双剑姬", jp: "フィオラ", en: "Fiora", win: 47.70, pick: 2.35, ban: 0.49 },
  { cn: "猩红收割者", jp: "ブラッドミア", en: "Vladimir", win: 45.37, pick: 1.62, ban: 1.86 }
];

function calculateTier(winRate, pickRate, banRate) {
  // 簡易Tier算出ロジック:
  // 基本スコアは勝率。ピック率とバン率が影響力を増幅する。
  const score = winRate + (pickRate * 0.1) + (banRate * 0.1);

  if (score >= 53.0) return 'S';
  if (score >= 51.5) return 'A';
  if (score >= 49.5) return 'B';
  return 'C';
}

async function main() {
  try {
    console.log(`Starting to insert ${rawData.length} champions into tier list...`);
    
    // 古いデータを全削除
    await supabase.from('champion_stats').delete().neq('id', 0); // 全消しハック
    
    const records = rawData.map(c => {
      const tier = calculateTier(c.win, c.pick, c.ban);
      return {
        champion_name: c.jp,
        champion_name_en: c.en,
        win_rate: c.win,
        pick_rate: c.pick,
        ban_rate: c.ban,
        tier: tier
      };
    });

    const { error } = await supabase.from('champion_stats').insert(records);
    if (error) throw error;
    
    console.log(`Successfully updated tier list.`);

  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

main();
