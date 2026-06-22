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
  '正义巨像': { en: 'Galio', jp: 'ガリオ' },
  '时光守护者': { en: 'Zilean', jp: 'ジリアン' },
  '腕豪': { en: 'Sett', jp: 'セト' },
  '奇妙远旅': { en: 'Norra', jp: 'ノラ' },
  '曙光女神': { en: 'Leona', jp: 'レオナ' },
  '扭曲树精': { en: 'Maokai', jp: 'マオカイ' },
  '荆棘之兴': { en: 'Zyra', jp: 'ザイラ' },
  '弗雷尔卓德之心': { en: 'Braum', jp: 'ブラウム' },
  '镕铁少女': { en: 'Rell', jp: 'レル' },
  '众星之子': { en: 'Soraka', jp: 'ソラカ' },
  '唤潮鲛姬': { en: 'Nami', jp: 'ナミ' },
  '深海泰坦': { en: 'Nautilus', jp: 'ノーチラス' },
  '天启者': { en: 'Karma', jp: 'カルマ' },
  '蒸汽机器人': { en: 'Blitzcrank', jp: 'ブリッツクランク' },
  '风暴之怒': { en: 'Janna', jp: 'ジャンナ' },
  '复仇焰魂': { en: 'Brand', jp: 'ブランド' },
  '明烛': { en: 'Milio', jp: 'ミリオ' },
  '熔岩巨兽': { en: 'Malphite', jp: 'マルファイト' },
  '仙灵女巫': { en: 'Lulu', jp: 'ルル' },
  '琴瑟仙女': { en: 'Sona', jp: 'ソナ' },
  '虚空之眼': { en: 'Velkoz', jp: 'ヴェル＝コズ' },
  '堕落天使': { en: 'Morgana', jp: 'モルガナ' },
  '涤魂圣枪': { en: 'Senna', jp: 'セナ' },
  '血港鬼影': { en: 'Pyke', jp: 'パイク' },
  '牛头酋长': { en: 'Alistar', jp: 'アリスター' },
  '山隐之焰': { en: 'Ornn', jp: 'オーン' },
  '光辉女郎': { en: 'Lux', jp: 'ラックス' },
  '星籁歌姬': { en: 'Seraphine', jp: 'セラフィーン' },
  '邪恶小法师': { en: 'Veigar', jp: 'ベイガー' },
  '幻翎': { en: 'Rakan', jp: 'ラカン' },
  '诺克萨斯统领': { en: 'Swain', jp: 'スウェイン' },
  '魂锁典狱长': { en: 'Thresh', jp: 'スレッシュ' },
  '星界游神': { en: 'Bard', jp: 'バード' },
  '魔法猫咪': { en: 'Yuumi', jp: 'ユーミ' }
};

const rawData = `
1 正义巨像 53.69% 3.25% 1.68%
2 时光守护者 53.03% 1.64% 1.41%
3 腕豪 52.82% 2.44% 2.79%
4 奇妙远旅 52.37% 1.62% 59.70%
5 曙光女神 52.31% 11.63% 6.81%
6 扭曲树精 52.22% 4.80% 0.40%
7 荆棘之兴 51.79% 5.44% 22.23%
8 弗雷尔卓德之心 51.57% 4.92% 1.09%
9 镕铁少女 51.46% 4.47% 2.19%
10 众星之子 51.08% 5.11% 1.48%
11 唤潮鲛姬 51.08% 5.45% 0.13%
12 深海泰坦 51.01% 16.42% 6.59%
13 天启者 50.91% 4.73% 0.32%
14 蒸汽机器人 50.59% 8.42% 2.32%
15 风暴之怒 50.52% 1.73% 0.09%
16 复仇焰魂 50.46% 2.73% 7.77%
17 明烛 50.45% 3.66% 3.50%
18 熔岩巨兽 50.25% 9.60% 17.36%
19 仙灵女巫 50.13% 8.82% 6.13%
20 琴瑟仙女 49.98% 1.52% 0.03%
21 虚空之眼 49.93% 1.93% 0.63%
22 堕落天使 49.80% 6.30% 24.09%
23 涤魂圣枪 49.64% 4.77% 0.70%
24 血港鬼影 49.63% 3.99% 1.67%
25 牛头酋长 49.41% 4.45% 0.47%
26 山隐之焰 49.34% 1.91% 0.19%
27 光辉女郎 49.32% 9.39% 17.07%
28 星籁歌姬 49.13% 6.43% 0.59%
29 邪恶小法师 48.89% 3.77% 13.63%
30 幻翎 48.68% 2.41% 0.21%
31 诺克萨斯统领 48.51% 3.98% 2.57%
32 魂锁典狱长 47.96% 12.02% 4.17%
33 星界游神 46.05% 1.30% 0.35%
34 魔法猫咪 45.45% 8.44% 24.42%
`;

// Calculate Tier based on Win Rate, Pick Rate, and Ban Rate logic
function calculateTier(winRate, pickRate, banRate) {
  const score = (winRate * 0.6) + (pickRate * 0.3) + (banRate * 0.1);
  if (winRate > 51.5 && score > 35) return 'S';
  if (winRate > 50.5 && score > 32) return 'A';
  if (winRate >= 49.5 && score > 30) return 'B';
  return 'C';
}

async function insertData() {
  const lines = rawData.trim().split('\n');
  const role = 'SUPPORT';
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
    console.log(`Starting to insert ${records.length} champions into SUPPORT tier list...`);
    
    await supabase.from('champion_stats').delete().eq('role', 'SUPPORT');
    
    const { error } = await supabase.from('champion_stats').insert(records);
    if (error) throw error;
    
    console.log('Successfully updated SUPPORT tier list.');
  } catch (err) {
    console.error("Error inserting data:", err);
  }
}

insertData();
