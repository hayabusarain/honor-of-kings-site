/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * ゲーム内公式「HoK Camp」から、全ヒーロー分のデータを取得する。
 *
 * 取得できるもの（1回の遷移で全部まとめて取れる）:
 *   - baseInfo.heroInfo.firstTimeUpgradeSkill … 公式の「最初に上げるスキル」（1〜3）
 *   - strategyData.combination … 公式の「組み合わせ」タブ。2人／3人編成とマッチ率
 *   - heroData.baseData … 人気・勝率・出現率・BAN率
 *   - strategyData.skill[0].skillList[].skillProirity … スキルの並び順。
 *     名前に Priority とあるが値は 0=パッシブ,1,2,3=ULT の並び順で、育成優先度ではない。
 *
 * なぜ Puppeteer なのか:
 *   api-camp.honorofkings.com への直接リクエストは 404 を返す（署名と地域判定があるため）。
 *   実ページを開いて、そのページが投げる getherodataall のレスポンスを傍受するのが確実。
 *
 * 数値の意味について（重要）:
 *   combination の値は画面上「マッチ率」と表示される。その編成が同じチームに揃った試合の割合で、
 *   勝率でも勝率上昇幅でもない。「相性が良い」という意味で扱わないこと。
 *
 * 使い方:
 *   node scripts/fetch_camp_hero_data.js [出力先パス]
 *   （既定の出力先: scratch/camp_all_heroes.json）
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2] || path.join(__dirname, '../scratch/camp_all_heroes.json');
const heroes = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/hok_heroes.json'), 'utf8'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/126 Mobile Safari/537.36');
  await page.setViewport({ width: 420, height: 900, isMobile: true });

  let captured = null;
  page.on('response', async (res) => {
    if (!res.url().includes('getherodataall')) return;
    try { captured = JSON.parse(await res.text()); } catch (_) { /* 本文を取れないことがある */ }
  });

  const result = {};
  let ok = 0, ng = 0;

  for (let i = 0; i < heroes.length; i++) {
    const h = heroes[i];
    captured = null;
    const url = `https://camp.honorofkings.com/h5/hero-detail/index.html?heroId=${h.id}&from=official&lang=ja`;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      for (let w = 0; w < 12 && !captured; w++) await new Promise((r) => setTimeout(r, 500));
    } catch (_) {
      // 遷移が途中で切れても captured に入っていることがあるので、ここでは打ち切らない
    }

    if (!captured || !captured.data) {
      // 取得できなかったヒーローは null で残す。前回値で埋めない
      result[h.id] = null;
      ng++;
      console.log(`[${i + 1}/${heroes.length}] ${h.id} ${h.name} … 取得できず`);
      continue;
    }

    const d = captured.data;
    const skillList = (((d.strategyData || {}).skill || [])[0] || {}).skillList || [];
    result[h.id] = {
      name: h.name,
      firstTimeUpgradeSkill: (d.baseInfo && d.baseInfo.heroInfo) ? d.baseInfo.heroInfo.firstTimeUpgradeSkill : null,
      skills: skillList.map((s) => ({
        index: s.skillIndex, name: s.skillName, isPassive: s.isPassive, isUlt: s.isUlt, priority: s.skillProirity,
      })),
      combination: (d.strategyData && d.strategyData.combination ? d.strategyData.combination : []).map((c) => ({
        type: c.combinationType, // 1 = 2人編成、2 = 3人編成
        heroes: (c.heroCombination || []).map((x) => ({ id: String(x.heroId), name: x.heroName })),
        data: (c.combinationData || []).map((x) => ({ type: x.dataType, value: x.dataValue, desc: x.dataDesc })),
        desc: c.combinationDesc,
      })),
      baseData: (d.heroData || {}).baseData || null,
    };
    ok++;
    const r = result[h.id];
    console.log(`[${i + 1}/${heroes.length}] ${h.id} ${h.name} … first=${r.firstTimeUpgradeSkill} 編成${r.combination.length}件 勝率${r.baseData ? r.baseData.winRate : '-'}`);
  }

  await browser.close();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 1), 'utf8');
  console.log(`\n完了: 成功 ${ok}体 / 失敗 ${ng}体 → ${OUT}`);
})();
