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
  { cn: "岩雀", jp: "タリヤ", en: "Taliyah", win: 53.39, pick: 8.88, ban: 50.23 },
  { cn: "卡牌大师", jp: "ツイステッド・フェイト", en: "TwistedFate", win: 52.59, pick: 4.15, ban: 0.35 },
  { cn: "奥术先驱", jp: "ゼラス", en: "Xerath", win: 52.48, pick: 4.98, ban: 0.93 },
  { cn: "复仇焰魂", jp: "ブランド", en: "Brand", win: 52.12, pick: 10.83, ban: 7.64 },
  { cn: "奇妙远旅", jp: "ノラ", en: "Norra", win: 52.03, pick: 4.01, ban: 60.25 },
  { cn: "荆棘之兴", jp: "ザイラ", en: "Zyra", win: 51.85, pick: 2.99, ban: 22.71 },
  { cn: "狂暴之心", jp: "ケネン", en: "Kennen", win: 51.59, pick: 1.46, ban: 0.33 },
  { cn: "诺克萨斯统领", jp: "スウェイン", en: "Swain", win: 51.53, pick: 2.75, ban: 2.51 },
  { cn: "迅捷斥候", jp: "ティーモ", en: "Teemo", win: 51.43, pick: 1.59, ban: 18.49 },
  { cn: "堕落天使", jp: "モルガナ", en: "Morgana", win: 51.33, pick: 5.86, ban: 24.30 },
  { cn: "九尾妖狐", jp: "アーリ", en: "Ahri", win: 51.09, pick: 4.50, ban: 0.09 },
  { cn: "沙漠死神", jp: "ナサス", en: "Nasus", win: 50.91, pick: 1.47, ban: 3.75 },
  { cn: "符文法师", jp: "ライズ", en: "Ryze", win: 50.85, pick: 4.41, ban: 4.49 },
  { cn: "光辉女郎", jp: "ラックス", en: "Lux", win: 50.82, pick: 7.75, ban: 17.13 },
  { cn: "邪恶小法师", jp: "ベイガー", en: "Veigar", win: 50.80, pick: 10.77, ban: 13.75 },
  { cn: "影流之主", jp: "ゼド", en: "Zed", win: 50.70, pick: 4.07, ban: 1.37 },
  { cn: "正义巨像", jp: "ガリオ", en: "Galio", win: 50.69, pick: 10.41, ban: 1.72 },
  { cn: "虚空行者", jp: "カサディン", en: "Kassadin", win: 50.50, pick: 1.82, ban: 0.28 },
  { cn: "双界灵兔", jp: "オーロラ", en: "Aurora", win: 50.34, pick: 4.87, ban: 6.89 },
  { cn: "铸星龙王", jp: "オレリオン・ソル", en: "AurelionSol", win: 50.21, pick: 7.10, ban: 3.25 },
  { cn: "发条魔灵", jp: "オリアナ", en: "Orianna", win: 50.12, pick: 3.19, ban: 0.15 },
  { cn: "冰霜女巫", jp: "リサンドラ", en: "Lissandra", win: 49.78, pick: 4.45, ban: 4.29 },
  { cn: "爆破鬼才", jp: "ジグス", en: "Ziggs", win: 49.61, pick: 6.29, ban: 2.06 },
  { cn: "暗黑元首", jp: "シンドラ", en: "Syndra", win: 49.39, pick: 4.56, ban: 2.42 },
  { cn: "黑暗之女", jp: "アニー", en: "Annie", win: 49.22, pick: 2.06, ban: 0.09 },
  { cn: "疾风剑豪", jp: "ヤスオ", en: "Yasuo", win: 49.10, pick: 11.47, ban: 11.85 },
  { cn: "虚空之眼", jp: "ヴェル＝コズ", en: "Velkoz", win: 49.00, pick: 3.64, ban: 0.63 },
  { cn: "愁云使者", jp: "ヴェックス", en: "Vex", win: 48.92, pick: 2.69, ban: 0.56 },
  { cn: "潮汐海灵", jp: "フィズ", en: "Fizz", win: 48.50, pick: 3.04, ban: 3.88 },
  { cn: "熔岩巨兽", jp: "マルファイト", en: "Malphite", win: 48.38, pick: 1.04, ban: 17.51 },
  { cn: "流光镜影", jp: "メル", en: "Mel", win: 48.33, pick: 9.96, ban: 76.62 },
  { cn: "大发明家", jp: "ハイマーディンガー", en: "Heimerdinger", win: 48.24, pick: 1.21, ban: 1.01 },
  { cn: "封魔剑魂", jp: "ヨネ", en: "Yone", win: 47.53, pick: 3.84, ban: 4.99 },
  { cn: "炽炎雏龙", jp: "スモルダー", en: "Smolder", win: 47.53, pick: 1.02, ban: 18.44 },
  { cn: "猩红收割者", jp: "ブラッドミア", en: "Vladimir", win: 47.48, pick: 4.30, ban: 1.86 },
  { cn: "皎月女神", jp: "ダイアナ", en: "Diana", win: 47.26, pick: 1.26, ban: 0.08 },
  { cn: "未来守护者", jp: "ジェイス", en: "Jayce", win: 47.22, pick: 1.16, ban: 0.64 },
  { cn: "时间刺客", jp: "エコー", en: "Ekko", win: 46.97, pick: 1.69, ban: 0.09 },
  { cn: "不祥之刃", jp: "カタリナ", en: "Katarina", win: 46.35, pick: 1.30, ban: 0.32 },
  { cn: "离群之刺", jp: "アカリ", en: "Akali", win: 45.12, pick: 2.45, ban: 0.26 }
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
    console.log(`Starting to insert ${rawData.length} champions into MID tier list...`);
    
    await supabase.from('champion_stats').delete().eq('role', 'MID');
    
    const records = rawData.map(c => {
      const tier = calculateTier(c.win, c.pick, c.ban);
      return {
        champion_name: c.jp,
        champion_name_en: c.en,
        win_rate: c.win,
        pick_rate: c.pick,
        ban_rate: c.ban,
        tier: tier,
        role: 'MID'
      };
    });

    const { error } = await supabase.from('champion_stats').insert(records);
    if (error) throw error;
    
    console.log(`Successfully updated MID tier list.`);

  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

main();
