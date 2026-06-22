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
  { cn: "殇之木乃伊", jp: "アムム", en: "Amumu", win: 55.62, pick: 3.90, ban: 0.14 },
  { cn: "披甲龙龟", jp: "ラムス", en: "Rammus", win: 54.90, pick: 4.50, ban: 3.82 },
  { cn: "雪原双子", jp: "ヌヌ＆ウィルンプ", en: "Nunu", win: 54.67, pick: 1.92, ban: 0.48 },
  { cn: "岩雀", jp: "タリヤ", en: "Taliyah", win: 54.36, pick: 3.84, ban: 50.23 },
  { cn: "祖安怒兽", jp: "ワーウィック", en: "Warwick", win: 53.25, pick: 3.11, ban: 0.73 },
  { cn: "远古恐惧", jp: "フィドルスティックス", en: "Fiddlesticks", win: 53.12, pick: 3.45, ban: 2.37 },
  { cn: "含羞蓓蕾", jp: "リリア", en: "Lillia", win: 52.75, pick: 2.80, ban: 0.90 },
  { cn: "祖安狂人", jp: "ドクター・ムンド", en: "DrMundo", win: 52.34, pick: 1.63, ban: 1.06 },
  { cn: "皮城执法官", jp: "ヴァイ", en: "Vi", win: 52.04, pick: 7.55, ban: 0.69 },
  { cn: "龙血武姬", jp: "シヴァーナ", en: "Shyvana", win: 51.97, pick: 9.20, ban: 6.04 },
  { cn: "德玛西亚皇子", jp: "ジャーヴァンIV", en: "JarvanIV", win: 51.40, pick: 6.87, ban: 0.40 },
  { cn: "痛苦之拥", jp: "イブリン", en: "Evelynn", win: 51.22, pick: 3.58, ban: 2.24 },
  { cn: "潮汐海灵", jp: "フィズ", en: "Fizz", win: 50.90, pick: 3.79, ban: 3.88 },
  { cn: "永恒梦魇", jp: "ノクターン", en: "Nocturne", win: 50.79, pick: 4.36, ban: 8.35 },
  { cn: "德邦总管", jp: "シン・ジャオ", en: "XinZhao", win: 50.70, pick: 10.12, ban: 1.58 },
  { cn: "深海泰坦", jp: "ノーチラス", en: "Nautilus", win: 50.62, pick: 4.06, ban: 6.65 },
  { cn: "无极剑圣", jp: "マスター・イー", en: "MasterYi", win: 50.58, pick: 13.20, ban: 60.67 },
  { cn: "破败之王", jp: "ヴィエゴ", en: "Viego", win: 50.57, pick: 8.27, ban: 13.27 },
  { cn: "狂野女猎手", jp: "ニダリー", en: "Nidalee", win: 50.45, pick: 2.57, ban: 1.92 },
  { cn: "不屈之枪", jp: "パンテオン", en: "Pantheon", win: 50.32, pick: 6.11, ban: 2.48 },
  { cn: "酒桶", jp: "グラガス", en: "Gragas", win: 50.28, pick: 2.28, ban: 0.24 },
  { cn: "狂战士", jp: "オラフ", en: "Olaf", win: 50.15, pick: 1.50, ban: 0.69 },
  { cn: "永猎双子", jp: "キンドレッド", en: "Kindred", win: 50.14, pick: 1.71, ban: 0.16 },
  { cn: "战争之影", jp: "ヘカリム", en: "Hecarim", win: 49.95, pick: 3.55, ban: 3.62 },
  { cn: "傲之追猎者", jp: "レンガー", en: "Rengar", win: 49.78, pick: 1.50, ban: 0.99 },
  { cn: "时间刺客", jp: "エコー", en: "Ekko", win: 49.47, pick: 1.69, ban: 0.09 },
  { cn: "刀锋之影", jp: "タロン", en: "Talon", win: 49.40, pick: 1.63, ban: 0.32 },
  { cn: "蛮族之王", jp: "トリンダメア", en: "Tryndamere", win: 49.13, pick: 7.20, ban: 22.96 },
  { cn: "封魔剑魂", jp: "ヨネ", en: "Yone", win: 48.59, pick: 2.38, ban: 4.99 },
  { cn: "诺克萨斯之手", jp: "ダリウス", en: "Darius", win: 48.48, pick: 3.93, ban: 7.33 },
  { cn: "虚空掠夺者", jp: "カジックス", en: "Khazix", win: 48.25, pick: 3.68, ban: 0.15 },
  { cn: "影流之镰", jp: "ケイン", en: "Kayn", win: 48.25, pick: 5.72, ban: 0.46 },
  { cn: "枪火狂徒", jp: "グレイブス", en: "Graves", win: 48.06, pick: 11.65, ban: 1.07 },
  { cn: "影流之主", jp: "ゼド", en: "Zed", win: 47.77, pick: 2.07, ban: 1.37 },
  { cn: "铁血狼母", jp: "アンベッサ", en: "Ambessa", win: 47.71, pick: 1.37, ban: 2.33 },
  { cn: "武器大师", jp: "ジャックス", en: "Jax", win: 47.29, pick: 2.11, ban: 0.19 },
  { cn: "不灭狂雷", jp: "ボリベア", en: "Volibear", win: 47.08, pick: 2.55, ban: 2.51 },
  { cn: "齐天大圣", jp: "ウーコン", en: "MonkeyKing", win: 46.74, pick: 2.94, ban: 0.40 },
  { cn: "盲僧", jp: "リー・シン", en: "LeeSin", win: 46.69, pick: 12.95, ban: 7.28 }
];

function calculateTier(winRate, pickRate, banRate) {
  const score = winRate + (pickRate * 0.1) + (banRate * 0.1);
  if (score >= 53.0) return 'S';
  if (score >= 51.5) return 'A';
  if (score >= 49.5) return 'B';
  return 'C';
}

async function main() {
  try {
    console.log(`Starting to insert ${rawData.length} champions into JUNGLE tier list...`);
    
    // 古いJUNGLEデータを削除（もしあれば）
    await supabase.from('champion_stats').delete().eq('role', 'JUNGLE');
    
    const records = rawData.map(c => {
      const tier = calculateTier(c.win, c.pick, c.ban);
      return {
        champion_name: c.jp,
        champion_name_en: c.en,
        win_rate: c.win,
        pick_rate: c.pick,
        ban_rate: c.ban,
        tier: tier,
        role: 'JUNGLE'
      };
    });

    const { error } = await supabase.from('champion_stats').insert(records);
    if (error) throw error;
    
    console.log(`Successfully updated JUNGLE tier list.`);

  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

main();
