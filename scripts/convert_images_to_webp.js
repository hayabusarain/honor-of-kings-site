/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * public/images/ 配下の画像を WebP に変換し、参照側のパスも書き換える。
 *
 * 背景:
 *   next.config.ts で images.unoptimized: true にしているため、next/image は
 *   最適化器を通らず原寸のまま配信される。掲載画像は 747 枚・約 20MB あり、
 *   ヒーロー一覧を最後までスクロールすると 116 枚 2.05MB を落とすことになる。
 *
 *   既存の PNG は既に十分圧縮されていて、可逆の再圧縮ではむしろ太る（実測 -23〜-32%）。
 *   パレット量子化は 67〜83% 減るが、白背景に合成して比べた誤差が 0.15〜0.25 と
 *   見て分かる劣化が出る。WebP q85 なら誤差 0.027（最大 0.043）で 86% 減る。
 *   これは「同一画像を別経路で書き出したもの」と同程度の差でしかない。
 *
 * 変換しないもの:
 *   public/images 直下の og-image.jpg とバナー背景。OGP 画像は WebP を読めない
 *   SNS があるため JPEG のまま置く。
 *
 * 使い方: node scripts/convert_images_to_webp.js [--dry]
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const IMG_DIR = path.join(ROOT, 'public/images');

// 変換対象のサブディレクトリ。直下のファイル（OGP画像など）は触らない
const DIRS = ['skills', 'heroes', 'arcana', 'items', 'summoners'];
const QUALITY = 85;
const MAX_EDGE = 128; // サイトの表示は最大96px。2倍解像度でも128あれば足りる

// パスを書き換える対象。JSON はデータ、tsx はフォールバック文字列
const REWRITE_TARGETS = [
  'src/data/hok_heroes.json',
  'src/data/hok_items.json',
  'src/data/hok_spells.json',
  'src/data/hok_arcanas.json',
  'public/data/skills/ja.json',
  'public/data/skills/en.json',
  'src/components/heroes/HeroDetailClient.tsx',
  'src/components/spells/SpellsClient.tsx',
  'src/components/tier-list/TierListClient.tsx',
  'src/components/home/HomeClient.tsx',
  'src/components/patches/PatchTable.tsx',
  'src/components/search/GlobalSearchModal.tsx',
  'src/app/[locale]/heroes/page.tsx',
  'src/app/[locale]/items/page.tsx',
  'src/app/[locale]/heroes/[id]/page.tsx',
  'scripts/audit.mjs',
];

// /images/<dir>/... で終わる .png / .jpg / .jpeg を .webp にする。
// 除外するのは引用符とバッククォートだけにしてある。以前は空白も除外していたため、
// `/images/skills/${hero?.key || id}_${idx}.png` のように ${} の中に空白が入る
// テンプレートリテラルを取りこぼした。漏れは scripts/audit.mjs のチェック7が拾う
const PATH_RE = new RegExp(`(/images/(?:${DIRS.join('|')})/[^"'\`]*?)\\.(png|jpe?g)`, 'gi');

(async () => {
  let before = 0;
  let after = 0;
  let converted = 0;
  const resized = [];
  const failed = [];

  for (const dir of DIRS) {
    const abs = path.join(IMG_DIR, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of fs.readdirSync(abs)) {
      if (!/\.(png|jpe?g)$/i.test(file)) continue;
      const src = path.join(abs, file);
      const dest = src.replace(/\.(png|jpe?g)$/i, '.webp');
      const buf = fs.readFileSync(src);
      before += buf.length;

      try {
        const meta = await sharp(buf).metadata();
        let pipeline = sharp(buf);
        if ((meta.width || 0) > MAX_EDGE || (meta.height || 0) > MAX_EDGE) {
          resized.push(`${dir}/${file} ${meta.width}x${meta.height} → ${MAX_EDGE}px`);
          pipeline = pipeline.resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true });
        }
        const out = await pipeline.webp({ quality: QUALITY, effort: 6, alphaQuality: 100 }).toBuffer();
        after += out.length;
        converted++;
        if (!DRY) {
          fs.writeFileSync(dest, out);
          fs.unlinkSync(src);
        }
      } catch (e) {
        failed.push(`${dir}/${file}: ${e.message}`);
        after += buf.length;
      }
    }
  }

  let rewritten = 0;
  for (const rel of REWRITE_TARGETS) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const text = fs.readFileSync(abs, 'utf8');
    const next = text.replace(PATH_RE, '$1.webp');
    if (next !== text) {
      rewritten += (text.match(PATH_RE) || []).length;
      if (!DRY) fs.writeFileSync(abs, next, 'utf8');
    }
  }

  const mb = (n) => (n / 1048576).toFixed(2) + ' MB';
  console.log(DRY ? '--- dry run（書き込みなし）---' : '--- 完了 ---');
  console.log(`変換: ${converted} 枚  ${mb(before)} → ${mb(after)}（${((1 - after / before) * 100).toFixed(0)}% 減）`);
  console.log(`参照の書き換え: ${rewritten} 箇所 / 対象 ${REWRITE_TARGETS.length} ファイル`);
  if (resized.length) {
    console.log(`\n表示サイズより大きく、縮小したもの ${resized.length} 枚:`);
    resized.forEach((r) => console.log('  ' + r));
  }
  if (failed.length) {
    console.log(`\n変換できなかったもの ${failed.length} 枚:`);
    failed.forEach((f) => console.log('  ' + f));
  }
})();
