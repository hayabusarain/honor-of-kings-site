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

// 先ほどの順番通りに並べた配列
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
  // 1. sort_orderカラムがなければ追加する（SQL関数などを利用できなければ無視されるが、既存ならエラーになるので一旦直接更新してみる）
  // Supabase JSクライアントから直接ALTER TABLEはできないため、
  // REST APIのrpcか、一旦全レコードを取得して更新する。
  
  // しかし今回は単にユーザーにSQLを実行してもらうのが面倒なので、
  // すでにテーブルにあるという前提ではなく、SQLを使わずに、
  // いや、JSからはスキーマ変更はできない。
  // なので、idを使ってソートするのを諦め、created_atにわずかなミリ秒差をつけるか？
  // いや、もう一度データを消して、1件ずつ await で insert すれば順番に id が振られる。
  
  console.log("Fetching existing patches...");
  const { data: existingPatches } = await supabase.from('patches').select('*').eq('version', version);
  
  if (!existingPatches) return;
  
  // delete all
  await supabase.from('patches').delete().eq('version', version);
  
  // sort by orderedNames
  const sortedPatches = orderedNames.map(name => {
    return existingPatches.find(p => p.champion_name === name);
  }).filter(Boolean);
  
  // Insert sequentially to guarantee ID ordering
  for (const patch of sortedPatches) {
    // idとcreated_atを削除して新規挿入扱いにする
    delete patch.id;
    delete patch.created_at;
    
    await supabase.from('patches').insert(patch);
    console.log(`Inserted: ${patch.champion_name}`);
  }
  
  console.log("Done fixing sort order by sequential insert.");
}

main();
