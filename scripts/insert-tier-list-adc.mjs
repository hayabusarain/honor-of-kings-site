import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CHAMPION_MAP = {
  '深渊巨口': { en: 'KogMaw', jp: 'コグ＝マウ' },
  '赏金猎人': { en: 'MissFortune', jp: 'ミス・フォーチュン' },
  '炽炎雏龙': { en: 'Smolder', jp: 'スモルダー' },
  '戏命师': { en: 'Jhin', jp: 'ジン' },
  '寒冰射手': { en: 'Ashe', jp: 'アッシュ' },
  '探险家': { en: 'Ezreal', jp: 'エズリアル' },
  '逆羽': { en: 'Xayah', jp: 'ザヤ' },
  '暗夜猎手': { en: 'Vayne', jp: 'ヴェイン' },
  '复仇之矛': { en: 'Kalista', jp: 'カリスタ' },
  '英勇投弹手': { en: 'Corki', jp: 'コーキ' },
  '惩戒之箭': { en: 'Varus', jp: 'ヴァルス' },
  '战争女神': { en: 'Sivir', jp: 'シヴィア' },
  '祖安花火': { en: 'Zeri', jp: 'ゼリ' },
  '暴走萝莉': { en: 'Jinx', jp: 'ジンクス' },
  '皮城女警': { en: 'Caitlyn', jp: 'ケイトリン' },
  '圣枪游侠': { en: 'Lucian', jp: 'ルシアン' },
  '荣耀行刑官': { en: 'Draven', jp: 'ドレイヴン' },
  '瘟疫之源': { en: 'Twitch', jp: 'トゥイッチ' },
  '沙漠玫瑰': { en: 'Samira', jp: 'サミーラ' },
  '虚空之女': { en: 'Kaisa', jp: 'カイ＝サ' },
  '麦林炮手': { en: 'Tristana', jp: 'トリスターナ' }
};

const rawData = `
1 深渊巨口 53.64% 6.80% 1.01%
2 赏金猎人 51.83% 20.40% 2.55%
3 炽炎雏龙 51.75% 12.24% 18.37%
4 戏命师 51.38% 16.05% 0.56%
5 寒冰射手 51.14% 7.49% 0.14%
6 探险家 51.06% 10.57% 0.27%
7 逆羽 50.82% 5.05% 0.14%
8 暗夜猎手 50.25% 10.31% 13.38%
9 复仇之矛 49.87% 4.89% 3.29%
10 英勇投弹手 49.70% 1.61% 0.02%
11 惩戒之箭 49.47% 5.95% 0.36%
12 战争女神 49.45% 7.23% 0.11%
13 祖安花火 49.27% 2.63% 0.03%
14 暴走萝莉 49.06% 9.00% 0.25%
15 皮城女警 49.05% 21.18% 2.92%
16 圣枪游侠 48.97% 6.31% 0.17%
17 荣耀行刑官 48.48% 6.11% 2.34%
18 瘟疫之源 48.13% 4.29% 0.26%
19 沙漠玫瑰 48.00% 7.77% 4.93%
20 虚空之女 48.00% 11.86% 0.22%
21 麦林炮手 47.91% 8.77% 0.18%
`;

function calculateTier(winRate, pickRate, banRate) {
  const score = (winRate * 0.6) + (pickRate * 0.3) + (banRate * 0.1);
  if (winRate > 51.5 && score > 35) return 'S';
  if (winRate > 50.5 && score > 32) return 'A';
  if (winRate >= 49.5 && score > 30) return 'B';
  return 'C';
}

async function insertData() {
  const lines = rawData.trim().split('\n');
  const role = 'ADC';
  const records = [];
  
  for (const line of lines) {
    const parts = line.split(' ');
    if (parts.length < 5) continue;
    
    const cnName = parts[1];
    const winRate = parseFloat(parts[2].replace('%', ''));
    const pickRate = parseFloat(parts[3].replace('%', ''));
    const banRate = parseFloat(parts[4].replace('%', ''));
    
    const mapped = CHAMPION_MAP[cnName];
    if (!mapped) {
      console.warn(`Mapping not found for: ${cnName}`);
      continue;
    }
    
    const tier = calculateTier(winRate, pickRate, banRate);
    
    records.push({
      champion_name: mapped.jp,
      champion_name_en: mapped.en,
      win_rate: winRate,
      pick_rate: pickRate,
      ban_rate: banRate,
      tier: tier,
      role: role
    });
  }
  
  try {
    console.log(`Starting to insert ${records.length} champions into ADC tier list...`);
    
    await supabase.from('champion_stats').delete().eq('role', 'ADC');
    
    const { error } = await supabase.from('champion_stats').insert(records);
    if (error) throw error;
    
    console.log('Successfully updated ADC tier list.');
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

insertData();
