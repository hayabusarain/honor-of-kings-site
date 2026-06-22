import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: "システム要件変更 (2025/11/25)",
    champion_name: "動作環境変更",
    champion_name_en: "SystemRequirements",
    change_type: "adjust",
    description: "パッチ7.0に合わせてシステム要件が変更されます。\n\n【Androidの必要動作環境】\nOS：Android 8以降\nメモリ：3 GB RAM\nCPU：クアッドコアCortex-A53 2.0GHz Exynos 850、Helio A22\nGPU：Mali-G52MP1、PowerVR GE8320、Adreno 610\n\n【Appleの必要動作環境】\nモデル：iPhone 6s以降 \nOS：iOS 15以降\nメモリ：2 GB RAM\nCPU：Apple A9デュアルコア1.84 GHzプロセッサ\nGPU：PowerVR GT7600 GPU",
    description_en: "System requirements update for Patch 7.0 (Android & Apple).",
    is_champion: false
  }
];

const meta = {
  version: "システム要件変更 (2025/11/25)",
  prediction_ja: "パッチ7.0に向けたシステム要件の引き上げにより、プレイ環境の向上が期待される",
  prediction_en: "The increase in system requirements for Patch 7.0 is expected to improve the playing environment."
};

async function insertData() {
  // Insert patches
  const { error: patchError } = await supabase
    .from('patches')
    .insert(patches);
  if (patchError) {
    console.error('Error inserting patches:', patchError);
  } else {
    console.log('Patches inserted successfully.');
  }

  // Insert meta
  const { error: metaDeleteError } = await supabase
    .from('patch_meta')
    .delete()
    .eq('version', meta.version);
    
  if (metaDeleteError) {
    console.error('Error deleting old meta:', metaDeleteError);
  }

  const { error: metaInsertError } = await supabase
    .from('patch_meta')
    .insert([meta]);
    
  if (metaInsertError) {
    console.error('Error inserting meta:', metaInsertError);
  } else {
    console.log('Meta prediction inserted successfully.');
  }
}

insertData();
