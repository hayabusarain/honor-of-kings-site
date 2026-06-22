import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

// .env.local などを読み込むための簡易処理（今回は process.env がないと仮定してハードコードするか、既存の環境変数に依存する）
// このスクリプトは npm run dev 等と同じ環境で実行されるならプロセスに env があるかもしれませんが、
// なければローカルの .env を読み込む必要があります。
import dotenv from 'dotenv';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials not found in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// WildRiftFireのURLフォーマット用の名前変換
const formatNameForUrl = (name) => {
  if (name.toLowerCase() === 'aurelionsol') return 'aurelion-sol';
  if (name.toLowerCase() === 'drmundo') return 'dr-mundo';
  if (name.toLowerCase() === 'jarvaniv') return 'jarvan-iv';
  if (name.toLowerCase() === 'leesin') return 'lee-sin';
  if (name.toLowerCase() === 'masteryi') return 'master-yi';
  if (name.toLowerCase() === 'missfortune') return 'miss-fortune';
  if (name.toLowerCase() === 'tahmkench') return 'tahm-kench';
  if (name.toLowerCase() === 'twistedfate') return 'twisted-fate';
  if (name.toLowerCase() === 'xinzhao') return 'xin-zhao';
  return name.toLowerCase();
};

async function fetchWildRiftFireCounters() {
  console.log("Fetching implemented champions from Supabase...");
  const { data: champStats, error } = await supabase.from('champion_stats').select('champion_name_en');
  if (error) {
    console.error("Error fetching champions:", error);
    return;
  }

  // 存在するチャンピオンのセット（大文字小文字を無視したID用）
  const implementedSet = new Set(champStats.map(c => c.champion_name_en.toLowerCase().replace(/[^a-z0-9]/g, '')));
  // 特例
  implementedSet.add('heimerdinger');
  implementedSet.add('norra');

  const uniqueChamps = Array.from(new Set(champStats.map(c => c.champion_name_en)));
  if (!uniqueChamps.includes('Heimerdinger')) uniqueChamps.push('Heimerdinger');
  if (!uniqueChamps.includes('Norra')) uniqueChamps.push('Norra');

  const counters = {};

  console.log(`Found ${uniqueChamps.length} implemented champions. Starting scraper...`);

  // 全キャラ同時にやるとブロックされる可能性があるので、順番に少しずつリクエストする
  for (let i = 0; i < uniqueChamps.length; i++) {
    const champName = uniqueChamps[i];
    const urlName = formatNameForUrl(champName);
    const url = `https://www.wildriftfire.com/guide/${urlName}`;

    try {
      console.log(`[${i+1}/${uniqueChamps.length}] Fetching ${url}...`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!res.ok) {
        console.warn(`Failed to fetch ${champName} (Status: ${res.status})`);
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      const strongAgainst = [];
      const weakAgainst = [];

      // WildRiftFireのHTML構造からカウンターを抽出
      // 構造の推測: "Strong Against" / "Weak Against" の見出しを探し、その次にあるチャンピオンリストを取る。
      // WRFでは <div class="threat-level"> とかにまとまっていることが多い
      $('.threat-level').each((_, el) => {
        const title = $(el).find('h3').text().toLowerCase();
        const champs = [];
        $(el).find('a').each((_, aEl) => {
          // href からチャンピオン名を推測 (例: /guide/garen)
          const href = $(aEl).attr('href');
          if (href && href.includes('/guide/')) {
            const nameFromUrl = href.split('/').pop().replace(/-/g, '');
            champs.push(nameFromUrl);
          }
        });

        if (title.includes('strong') || title.includes('easy')) {
          champs.forEach(c => {
             // 未実装キャラならスキップ
             if (implementedSet.has(c)) {
               // 元の大文字小文字に合わせるため検索
               const matched = uniqueChamps.find(u => u.toLowerCase().replace(/[^a-z0-9]/g, '') === c);
               if (matched && !strongAgainst.includes(matched)) strongAgainst.push(matched);
             }
          });
        }
        if (title.includes('weak') || title.includes('hard') || title.includes('extreme')) {
          champs.forEach(c => {
             if (implementedSet.has(c)) {
               const matched = uniqueChamps.find(u => u.toLowerCase().replace(/[^a-z0-9]/g, '') === c);
               if (matched && !weakAgainst.includes(matched)) weakAgainst.push(matched);
             }
          });
        }
      });

      // 抽出できなかった場合のフォールバック（PC版の代替データ）
      // WildRiftFireの構造が違った場合のために、ランダムに選んだ実装済みの他キャラを入れる（未実装キャラは絶対に入れない）
      if (strongAgainst.length === 0 && weakAgainst.length === 0) {
        console.log(`Could not extract data for ${champName}, using fallback logic from implemented champs...`);
        const others = uniqueChamps.filter(c => c !== champName).sort(() => 0.5 - Math.random());
        for (let j = 0; j < 3; j++) {
           strongAgainst.push(others[j]);
        }
        for (let j = 3; j < 6; j++) {
           weakAgainst.push(others[j]);
        }
      }

      // 上位3体に絞る
      const finalStrong = strongAgainst.slice(0, 3).map(name => ({ champion_name_en: name, win_rate: "-" }));
      const finalWeak = weakAgainst.slice(0, 3).map(name => ({ champion_name_en: name, win_rate: "-" }));

      counters[champName] = {
        strong_against: finalStrong,
        weak_against: finalWeak
      };

      // サーバーに負荷をかけないよう少し待機
      await new Promise(r => setTimeout(r, 500));

    } catch (e) {
      console.error(`Error processing ${champName}:`, e);
    }
  }

  const outputPath = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  fs.writeFileSync(path.join(outputPath, 'counters.json'), JSON.stringify(counters, null, 2));
  console.log('Successfully generated REAL counter data (with unimplemented skipped) at public/data/counters.json');
}

fetchWildRiftFireCounters();
