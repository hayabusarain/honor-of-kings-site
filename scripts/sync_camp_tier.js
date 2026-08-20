/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * 公式「HoK Camp」のヒーローランキングから Tier・勝率・出現率・BAN率を取り込む。
 *
 * 2026-08-19 に現在の公式仕様へ合わせて書き直した。旧版は
 *   - 遷移先が h5/hero-list/index.html（現在は h5/app/index.html#/hero-hot-list）
 *   - 傍受条件が 'api/Hero' / 'hero/list' / 'camp.honorofkings.com/api'
 * で、いまのAPI（api-camp.honorofkings.com への POST /game/hero/getranklist）に
 * どれも一致せず、実行しても何も取れない状態だった。
 *
 * ヒーローの突き合わせは heroId で行う。hero_stats_camp.json のキーが
 * そのまま公式の heroId なので、名前の表記ゆれに左右されない（実測で116/116一致）。
 *
 * ランク帯は segment パラメータで切り替えられる（255=全ランク / 1=ダイヤ以上）が、
 * 両者の差は勝率で最大0.315pt・Tier変動2体しかなく、分けて持つ意味が薄いため
 * 全ランク（255）だけを取り込む（2026-08-19 に実測して判断）。
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const STATS_PATH = path.join(__dirname, '../src/data/hero_stats_camp.json');
const FRESHNESS_PATH = path.join(__dirname, '../src/data/data_freshness.json');
const PAGE_URL = 'https://camp.honorofkings.com/h5/app/index.html#/hero-hot-list?lang=ja';

// 公式の tRank と position の対応。position は現行データと116/116一致することを確認済み
const TIER_BY_RANK = { 0: 'S', 1: 'A', 2: 'B', 3: 'C' };
const LANE_BY_POSITION = { 0: 'CLASH', 1: 'MID', 2: 'FARM', 3: 'JUNGLE', 4: 'ROAM' };

async function fetchRankList() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 420, height: 900 });

    let payload = null;
    page.on('response', async (res) => {
      if (!res.url().includes('getranklist')) return;
      try {
        const json = await res.json();
        if (json && json.data && Array.isArray(json.data.list) && json.data.list.length > 0) {
          payload = json.data;
        }
      } catch {
        // JSON でないレスポンスは無視する
      }
    });

    console.log('公式ランキングを開いています...');
    await page.goto(PAGE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    // 描画後に API を叩くため、ネットワーク待機のあとにも少し待つ
    await new Promise((r) => setTimeout(r, 8000));
    return payload;
  } finally {
    await browser.close();
  }
}

async function main() {
  const data = await fetchRankList();
  if (!data) {
    console.error('ランキングを取得できませんでした。公式ページの構成が変わった可能性があります。');
    process.exit(1);
  }

  // updateTime は 20260814 のような数値8桁で返る
  const raw = String(data.updateTime || '');
  const updatedAt = /^\d{8}$/.test(raw)
    ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    : null;
  if (!updatedAt) {
    console.error(`updateTime を解釈できませんでした: ${JSON.stringify(data.updateTime)}`);
    process.exit(1);
  }
  console.log(`公式の更新日: ${updatedAt} / ${data.list.length}体`);

  const stats = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'));
  const before = JSON.parse(JSON.stringify(stats));

  let updated = 0;
  const unmatched = [];
  const tierChanges = [];

  for (const item of data.list) {
    const id = String(item.heroId);
    const cur = stats[id];
    if (!cur) {
      unmatched.push(`${id} (${item.heroInfo && item.heroInfo.heroName})`);
      continue;
    }

    const tier = TIER_BY_RANK[item.tRank];
    const lane = LANE_BY_POSITION[item.position];
    if (!tier || !lane) {
      unmatched.push(`${id} 未知の tRank/position: ${item.tRank}/${item.position}`);
      continue;
    }

    if (cur.tier !== tier) {
      tierChanges.push(`${cur.jpName}: ${cur.tier} → ${tier}`);
    }
    cur.tier = tier;
    cur.lane = lane;
    cur.win_rate = parseFloat((item.winRate * 100).toFixed(2));
    cur.pick_rate = parseFloat((item.showRate * 100).toFixed(2));
    cur.ban_rate = parseFloat((item.banRate * 100).toFixed(2));
    updated++;
  }

  if (unmatched.length > 0) {
    console.error(`突き合わせできなかったヒーローが ${unmatched.length} 件あります:`);
    unmatched.forEach((u) => console.error('  ' + u));
    console.error('取り込みを中止しました（部分的な更新は行いません）。');
    process.exit(1);
  }

  fs.writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2) + '\n', 'utf8');

  // 取得日を data_freshness.json にも反映する。表示側はこのファイルだけを見るため、
  // ここを直さないとページに古い日付が出たままになる
  const freshness = JSON.parse(fs.readFileSync(FRESHNESS_PATH, 'utf8'));
  const prevAt = freshness.campStats.updatedAt;
  freshness.campStats.updatedAt = updatedAt;
  fs.writeFileSync(FRESHNESS_PATH, JSON.stringify(freshness, null, 2) + '\n', 'utf8');

  const laneChanged = Object.keys(stats).filter((id) => before[id] && before[id].lane !== stats[id].lane);

  console.log(`\n取り込み完了: ${updated}体`);
  console.log(`取得日: ${prevAt} → ${updatedAt}`);
  console.log(`Tierが変わったヒーロー: ${tierChanges.length}体`);
  tierChanges.forEach((c) => console.log('  ' + c));
  if (laneChanged.length > 0) {
    console.log(`レーンが変わったヒーロー: ${laneChanged.length}体`);
    laneChanged.forEach((id) => console.log(`  ${before[id].jpName}: ${before[id].lane} → ${stats[id].lane}`));
  }
  console.log('\n※ 取得日より後にパッチが入っている場合は、data_freshness.json の');
  console.log('   campStats.patchBasis* と patchBasisHeroIds を手で更新すること。');
}

main();
