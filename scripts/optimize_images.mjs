/**
 * public/images の webp を寸法そのままで再圧縮する。
 *
 * なぜ寸法を変えないか。2026-09-05 に実測したところ、ヒーロー一覧は 128px の画像を
 * 82px 枠で出しており、DPR2 の端末では 164px 必要なので今の 128px でも足りていない。
 * 「小さく出しているから縮めてよい」のは一部だけで、全体を縮めると Retina で劣化する。
 * 一方、品質だけを落とす再圧縮は寸法に触らないので、どの端末でも見た目が変わらない。
 *
 * 品質は 70。元・q80・q70・q60 を4倍に拡大して並べて見比べたが、
 * ヒーロー顔・スキルアイコンとも q60 まで判別できなかった（実際の表示は 36〜82px）。
 * 平均絶対誤差は q70 で 3.0〜3.5（0〜255 のスケール）。
 *
 * **劣化の累積を避けるため、処理済みの結果を scripts/optimized_images.json に記録する。**
 * webp の再圧縮は非可逆なので、同じファイルを2回通すと2回劣化する。
 * 記録したハッシュと一致するファイルは飛ばすので、何度実行しても安全。
 * 画像を差し替えたらハッシュが変わり、その1枚だけが処理される。
 *
 * 使い方: node scripts/optimize_images.mjs        （実行）
 *         node scripts/optimize_images.mjs --dry  （何がどう変わるかだけ表示）
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = path.join(root, 'public/images');
const LEDGER = path.join(root, 'scripts/optimized_images.json');
const QUALITY = 70;
const DRY = process.argv.includes('--dry');

const sha = (buf) => crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16);
const kb = (n) => (n / 1024).toFixed(0) + 'KB';

const ledger = fs.existsSync(LEDGER)
  ? JSON.parse(fs.readFileSync(LEDGER, 'utf8'))
  : { _comment: '', quality: QUALITY, done: {} };

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.webp')) files.push(p);
  }
})(IMAGES);

let before = 0, after = 0, changed = 0, skipped = 0, grew = 0;

for (const p of files) {
  const rel = path.relative(root, p).replace(/\\/g, '/');
  const buf = fs.readFileSync(p);
  const h = sha(buf);
  before += buf.length;

  // すでにこのスクリプトが作った状態なら触らない（再圧縮の重ねがけを防ぐ）
  if (ledger.done[rel] === h) {
    after += buf.length;
    skipped += 1;
    continue;
  }

  const meta = await sharp(buf).metadata();
  const out = await sharp(buf)
    .webp({ quality: QUALITY, effort: 6, alphaQuality: 100 })
    .toBuffer();

  // 元より大きくなるなら意味がないので残す。すでに強く圧縮された画像で起きる
  if (out.length >= buf.length) {
    after += buf.length;
    grew += 1;
    ledger.done[rel] = h;
    if (DRY) console.log('  すえおき ' + rel + '  ' + kb(buf.length) + ' → ' + kb(out.length));
    continue;
  }

  after += out.length;
  changed += 1;
  if (DRY) {
    console.log('  ' + rel.padEnd(46) + kb(buf.length).padStart(8) + ' → ' + kb(out.length).padStart(8) +
      '  ' + meta.width + 'x' + meta.height);
  } else {
    fs.writeFileSync(p, out);
    ledger.done[rel] = sha(out);
  }
}

if (!DRY) {
  ledger._comment = 'optimize_images.mjs が再圧縮した結果のハッシュ。'
    + '一致するファイルは再処理しない（webp の再圧縮は非可逆で、重ねると劣化が累積するため）。'
    + '画像を差し替えたらハッシュが変わり、その1枚だけが処理される。手で編集しないこと。';
  ledger.quality = QUALITY;
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');
}

console.log('');
console.log((DRY ? '【下見】 ' : '') + files.length + '枚を確認');
console.log('  再圧縮した   : ' + changed + '枚');
console.log('  据え置いた   : ' + grew + '枚（再圧縮すると大きくなるもの）');
console.log('  処理済みで飛ばした: ' + skipped + '枚');
console.log('  合計 ' + kb(before) + ' → ' + kb(after) +
  '  (' + (100 - (100 * after) / before).toFixed(0) + '%減)');
