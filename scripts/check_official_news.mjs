/**
 * 公式お知らせの新着を確認する（読むだけ。データファイルは書き換えない）。
 *
 * 公式ページは中身が空の SPA で、記事一覧は CMS の API から来る。
 * その API は curl では空で返るため（2026-09-18 に確認。Cookie かセッションを見ている）、
 * 公式ページを開いた中から読む。本文の取得は curl でもできる（PATCH_NOTES_WORKFLOW.md の 1-2）。
 *
 *   node scripts/check_official_news.mjs          日英の最新10件と、反映済みかどうかを出す
 *   node scripts/check_official_news.mjs --sniff  一覧ページ自身の通信を出す（条件が変わったとき用）
 *
 * --sniff を使うのは、一覧が0件になったとき。ラベルIDは公式の都合で変わり、
 * 旧条件はエラーにならず0件で返るので、「新着なし」と取り違えやすい。
 * 2026-09-17 には primary_label_id が 671 → 785、secondary_label_id が 0 → "1158"、
 * content_class が 1 → 0 に変わっていた。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIST_PAGES = [
  ['ja', 'https://www.honorofkings.com/jp/news-list.html'],
  ['en', 'https://www.honorofkings.com/global-en/news-list.html'],
];
const PATCH_TITLE = /アップデートのお知らせ|update announcement|patch note|version update/i;

/** 一覧ページの表示から、記事のタイトル・日付・content_id を読む */
async function readList(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 5000));
  return page.evaluate(() =>
    [...document.querySelectorAll('a[href*="news-detail"]')]
      .map((a) => {
        const raw = (a.innerText || '').replace(/\s+/g, ' ').trim();
        return {
          date: (raw.match(/\d{4}\/\d{2}\/\d{2}/) || [''])[0],
          // 一覧のリンクには「すべてのニュース」「ALL NEWS」の見出しと日付が混ざって入っている
          title: raw.replace(/すべてのニュース|ALL NEWS/g, '').replace(/\d{4}\/\d{2}\/\d{2}/, '').trim(),
          id: (a.getAttribute('href').match(/[?&]content_id=([^&]+)/) || [])[1] || '',
        };
      })
      .filter((x) => x.title),
  );
}

async function sniff(page) {
  const hits = [];
  page.on('response', async (res) => {
    if (!/information_feeds/i.test(res.url())) return;
    let body = '';
    try { body = await res.text(); } catch { /* 本文を読めない応答は無視する */ }
    hits.push({ name: res.url().split('/').pop(), status: res.status(), req: res.request().postData(), body: body.slice(0, 200) });
  });
  await page.goto(LIST_PAGES[0][1], { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 6000));
  for (const h of hits) {
    if (!h.req) continue;
    console.log(`\n[${h.name}] ${h.status}\n  req: ${h.req}\n  res: ${h.body.replace(/\s+/g, ' ')}`);
  }
}

const patches = JSON.parse(fs.readFileSync(path.join(root, 'src/data/patches.json'), 'utf8'));
const known = [...new Set(patches.map((p) => p.version.trim()))];

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  if (process.argv.includes('--sniff')) {
    await sniff(page);
  } else {
    for (const [lang, url] of LIST_PAGES) {
      const rows = await readList(page, url);
      console.log(`--- ${lang} ${rows.length}件`);
      if (rows.length === 0) {
        console.log('  0件。公式の一覧の作りが変わった可能性がある。--sniff で今の条件を見る');
      }
      for (const r of rows.slice(0, 10)) {
        // 日本語の記事だけ patches.json と突き合わせる（英語は別タイトルのため）。
        // 照合は「9月10日」のような月日で行う。タイトルは公式が回によって変える
        // （例「7月30日S15.aミッドシーズンバージョンアップデートのお知らせ」）ので、全文一致は当てにならない
        const day = (r.title.match(/(\d+月\d+日)/) || [])[1];
        const mark = !PATCH_TITLE.test(r.title)
          ? '[    ]'
          : lang !== 'ja'
            ? '[ 英語 ]'
            : day && known.some((k) => k.includes(day)) ? '[反映済]' : '[未反映]';
        console.log(`  ${r.date || '　　　　　　'} ${mark} ${r.title.slice(0, 40)}${r.id ? '  content_id=' + r.id : ''}`);
      }
    }
  }
} finally {
  await browser.close();
}
