/**
 * E2E スモークテスト
 *
 * 使い方: 開発サーバー(npm run dev)か本番サーバー(npm start)を起動した状態で
 *   npm run smoke
 *   BASE_URL=http://localhost:3001 npm run smoke   # ポート指定
 *
 * 主要ページを実ブラウザ(puppeteer)で開き、以下を検査する:
 *   - HTTP エラーなくレンダリングできるか
 *   - コンソールエラーが出ていないか
 *   - 404 リクエスト（画像等）が発生していないか
 *   - EN ページに日本語が漏れていないか（許容リストを除く）
 */
import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

// canonical・sitemap・内部リンクと同じURLを直接開く。
// 数値ID（/ja/heroes/105）と /ja/skills も 308 で現行URLへ送られるので puppeteer は
// 追従して 200 を返すが、それはリダイレクトの検査であってページ本体の検査ではない。
// 戻さないこと。
const PAGES = [
  '/ja', '/ja/heroes', '/ja/heroes/lian-po', '/ja/heroes/mulan', '/ja/heroes/bai-long',
  '/ja/tier-list', '/ja/items', '/ja/arcana', '/ja/spells',
  '/ja/patches', '/ja/patches/2026-08-27', '/ja/guide', '/ja/heroes/stats',
  '/ja/items/usage',
  '/ja/items/simulator',
  '/ja/arcana/calculator',
  '/en', '/en/heroes', '/en/heroes/lian-po', '/en/heroes/florentino',
  '/en/tier-list', '/en/items', '/en/patches', '/en/items/usage',
  '/en/items/simulator', '/en/spells',
  // src/content を英語で描画する唯一のURL。/en/arcana は listNotes の arcana、
  // /en/tier-list/jungle は laneTierPages。ここが無いと、掲載文に日本語が
  // 混じっても英語ページを開くまで気づけない
  '/en/arcana', '/en/tier-list/jungle',
  '/en/links', '/en/terms', '/en/privacy', '/en/legal', '/en/contact',
];

const CJK = /[぀-ヿ㐀-䶿一-鿿]+/g;
// EN ページで許容する日本語（公式グローバル名が未確定のアイテム等）
const ALLOWED_JA = new Set(['迅速の槍', 'フォージセイバー', '月神の杖', '天地石', '原初の玉石', '抗魔のマント']);
// 既知の未解決 404（素材待ち。scripts/audit.mjs の KNOWN_MISSING_IMAGES と揃える）
const KNOWN_404 = ['/images/items/1217.png', '/images/items/1218.png', '/images/skills/'];

const main = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // BASE が本当にこのサイトかを先に確かめる。
  // 2026-08-31、既定の 3000 番で姉妹サイトが動いており、30ページ中15ページが
  // 「404」「日本語残留」で落ちた。出力に「チャンピオン一覧」（当サイトは「ヒーロー」）が
  // 出て初めて気づいた。ポートの取り違えは検査の失敗ではなく検査の不成立なので、
  // 1ページも回さずに止める。
  const probe = await page.goto(BASE + '/ja', { waitUntil: 'domcontentloaded', timeout: 90000 })
    .catch(() => null);
  if (!probe || probe.status() >= 400) {
    console.error(`✗ ${BASE} が応答しない。開発サーバーを起動してから実行する`);
    await browser.close();
    process.exit(1);
  }
  const title = await page.title();
  if (!/Honor of Kings|HoK/i.test(title)) {
    console.error(`✗ ${BASE} は Honor of Kings Hub ではない（title: ${title.slice(0, 60)}）`);
    console.error('  別のサイトがそのポートを使っている。BASE_URL=http://localhost:3211 のように指定する');
    await browser.close();
    process.exit(1);
  }

  let failures = 0;
  for (const path of PAGES) {
    const errors = [];
    const notFound = [];
    const onConsole = (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 120)); };
    const onResponse = (r) => {
      if (r.status() >= 400) {
        const u = r.url().replace(BASE, '');
        if (!KNOWN_404.some((k) => u.startsWith(k))) notFound.push(`${r.status()} ${u.slice(0, 100)}`);
      }
    };
    page.on('console', onConsole);
    page.on('response', onResponse);

    const issues = [];
    try {
      const res = await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 90000 });
      if (!res || res.status() >= 400) issues.push(`HTTP ${res ? res.status() : '???'}`);
      await new Promise((r) => setTimeout(r, 1000));

      if (notFound.length) issues.push(`404等: ${[...new Set(notFound)].slice(0, 5).join(' , ')}`);
      // 404 由来の console error は notFound 側で報告済みなので除外
      const realErrors = [...new Set(errors)].filter((e) => !/Failed to load resource/.test(e) || notFound.length);
      if (realErrors.length) issues.push(`console: ${realErrors.slice(0, 3).join(' | ')}`);

      if (path.startsWith('/en')) {
        const text = await page.evaluate(() => document.body.innerText);
        const hits = [...new Set(text.match(CJK) || [])].filter((h) => !ALLOWED_JA.has(h));
        if (hits.length) issues.push(`日本語残留: ${hits.slice(0, 5).join(', ')}${hits.length > 5 ? ` 他${hits.length - 5}種` : ''}`);
      }
    } catch (e) {
      issues.push(`例外: ${e.message.slice(0, 100)}`);
    }
    page.off('console', onConsole);
    page.off('response', onResponse);

    if (issues.length) {
      failures++;
      console.error(`✗ ${path}\n    ${issues.join('\n    ')}`);
    } else {
      console.log(`✓ ${path}`);
    }
  }

  await browser.close();
  console.log(failures ? `\n✗ スモークNG: ${failures}/${PAGES.length} ページで問題` : `\n✓ スモークOK: 全 ${PAGES.length} ページ正常`);
  process.exit(failures ? 1 : 0);
};

main().catch((e) => { console.error(e); process.exit(1); });
