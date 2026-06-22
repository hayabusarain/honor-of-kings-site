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

const version = "7.1e";

const orderedNames = [
  "タリヤ",
  "ガレン",
  "シヴァーナ",
  "ライズ",
  "ツイステッド・フェイト",
  "バード",
  "グレイブス",
  "ケイン",
  "スモルダー",
  "ランデュイン オーメン",
  "クラーケンスレイヤー",
  "サンダード スカイ",
  "ランダムミッド (ARAM)",
  "新スキン"
];

async function main() {
  console.log("Fetching existing patches...");
  const { data: existingPatches } = await supabase.from('patches').select('*').eq('version', version);
  
  if (!existingPatches) return;
  
  // delete all
  await supabase.from('patches').delete().eq('version', version);
  
  // sort by orderedNames
  const sortedPatches = orderedNames.map(name => {
    return existingPatches.find(p => p.champion_name === name);
  }).filter(Boolean);
  
  // 基準となる現在時刻
  const baseTime = Date.now();
  
  for (let i = 0; i < sortedPatches.length; i++) {
    const patch = sortedPatches[i];
    delete patch.id;
    
    // 順番が絶対に保証されるように、created_atを1秒ずつずらして手動設定する
    patch.created_at = new Date(baseTime + i * 1000).toISOString();
    
    await supabase.from('patches').insert(patch);
    console.log(`Inserted: ${patch.champion_name} with created_at: ${patch.created_at}`);
  }
  
  console.log("Done fixing sort order by created_at.");
}

main();
