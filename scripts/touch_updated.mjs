/**
 * サイトの最終更新日（data_freshness.json の site.lastUpdated）を今日に上げる。
 *
 * 使い方: npm run touch:updated
 *
 * この日付はトップの「最終更新」バッジと、再訪した人に出す赤点（TabBar）が見ている。
 * 掲載内容を変えたらプッシュ前に上げる。上げ忘れは npm run audit が止める。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'src/data/data_freshness.json');

// ローカル時間の YYYY-MM-DD。toISOString はUTCになり日付がずれる
const today = new Date().toLocaleDateString('sv-SE');
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);
const before = data.site.lastUpdated;

if (before === today) {
  console.log(`最終更新日はすでに ${today} です。変更はありません。`);
  process.exit(0);
}

data.site.lastUpdated = today;
// 末尾の改行の有無は元のファイルに合わせる
fs.writeFileSync(file, JSON.stringify(data, null, 2) + (raw.endsWith('\n') ? '\n' : ''), 'utf8');
console.log(`最終更新日を ${before} → ${today} に更新しました。`);
