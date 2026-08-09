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

const PAGES = [
  '/ja', '/ja/heroes', '/ja/heroes/105', '/ja/heroes/154', '/ja/heroes/519',
  '/ja/tier-list', '/ja/items', '/ja/arcana', '/ja/skills', '/ja/spells',
  '/ja/patches', '/ja/guide', '/ja/calculator',
  '/en', '/en/heroes', '/en/heroes/105', '/en/heroes/631',
  '/en/tier-list', '/en/items', '/en/patches', '/en/calculator',
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
