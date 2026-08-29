/**
 * サイトデータの整合性監査
 *
 * 使い方: npm run audit
 * すべてのチェックを実行し、問題があれば一覧表示して exit code 1 で終了する。
 * CI（ビルド前）とデータ更新後のセルフチェックの両方で使う。
 *
 * チェック内容:
 *   1. 翻訳キー差分   … messages/ja.json と en.json のキーが一致するか
 *   2. EN日本語残留   … 英語向けデータに日本語が混入していないか
 *   3. 画像参照       … データが参照する画像ファイルが実在するか
 *   4. スキルデータ欠損 … ja/en で ヒーロー・スキル構造が揃っているか
 *   5. ヒーロー名規約  … name=日本語 / name_en あり / 禁止表記が復活していないか
 *   6. 外部画像       … 公式CDNなど外部ホストの画像を直リンクしていないか
 *   7. 画像拡張子     … WebP へ移した配下を .png / .jpg で参照していないか
 *   8. 最終更新日     … 掲載内容を触ったのに site.lastUpdated が今日でないか
 *   9. スペル採用集計  … listNotes の数字が hero_item_builds.json の実数と合うか
 *  10. レーン講評日付   … laneTierPages の講評が現行統計の取得日と揃っているか
 *  11. スキル表の見出し … 表の headers が値の列数と一致し、空の見出しが混ざっていないか
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { siteToday } from './site_date.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const CJK = /[぀-ヿ㐀-䶿一-鿿]/;
const problems = [];
const warnings = [];
const report = (check, msg) => problems.push(`[${check}] ${msg}`);
const warn = (check, msg) => warnings.push(`[${check}] ${msg}`);

// 既知の未解決（素材待ち）。解決したらここから削除すること。
// 画像が無い間は UI 側のフォールバック表示で凌いでいる。
const KNOWN_MISSING_IMAGES = new Set([
  '/images/items/1217.webp', // 秘法のページ
  '/images/items/1218.webp', // 元流の結晶
]);

/* ---------- 1. 翻訳キー差分 ---------- */
{
  const flat = (o, p = '') =>
    Object.entries(o).reduce((acc, [k, v]) => {
      const key = p ? `${p}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(acc, flat(v, key));
      else acc[key] = v;
      return acc;
    }, {});
  const ja = flat(readJson('messages/ja.json'));
  const en = flat(readJson('messages/en.json'));
  for (const k of Object.keys(ja)) if (!(k in en)) report('i18nキー', `en.json に欠落: ${k}`);
  for (const k of Object.keys(en)) if (!(k in ja)) report('i18nキー', `ja.json に欠落: ${k}`);
  for (const [k, v] of Object.entries(en)) {
    if (typeof v === 'string' && CJK.test(v)) report('i18nキー', `messages/en.json に日本語: ${k} = ${v.slice(0, 40)}`);
  }
}

/* ---------- 2. EN 向けデータの日本語残留 ---------- */
{
  // 公式グローバル名が未確定で意図的に日本語のままにしているアイテム
  const allowedJa = new Set(['迅速の槍', 'フォージセイバー', '月神の杖', '天地石', '原初の玉石', '抗魔のマント']);
  const scan = (obj, p, out) => {
    for (const k in obj) {
      const v = obj[k];
      if (typeof v === 'string' && CJK.test(v) && !allowedJa.has(v)) out.push(`${p}.${k} = ${v.slice(0, 40)}`);
      else if (v && typeof v === 'object') scan(v, `${p}.${k}`, out);
    }
  };
  const hits = [];
  scan(readJson('public/data/skills/en.json'), '', hits);
  hits.slice(0, 20).forEach((h) => report('EN日本語残留', `skills/en.json ${h}`));
  if (hits.length > 20) report('EN日本語残留', `…他 ${hits.length - 20} 件`);

  const items = readJson('src/data/hok_items.json');
  items.forEach((it) => {
    if (it.name_en && CJK.test(it.name_en)) report('EN日本語残留', `hok_items ${it.id} name_en に日本語: ${it.name_en}`);
  });
}

/* ---------- 3. 画像参照の実在チェック ---------- */
{
  const exists = (rel) => fs.existsSync(path.join(root, 'public', rel.replace(/^\//, '')));
  const checkIcon = (label, icon) => {
    if (typeof icon === 'string' && icon.startsWith('/') && !exists(icon)) {
      if (KNOWN_MISSING_IMAGES.has(icon)) warn('画像404(既知)', `${label} → ${icon}`);
      else report('画像404', `${label} → ${icon}`);
    }
  };
  readJson('src/data/hok_items.json').forEach((it) => checkIcon(`item ${it.id} ${it.name}`, it.icon));
  readJson('src/data/hok_spells.json').forEach((sp) => checkIcon(`spell ${sp.id}`, sp.icon));
  // アルカナは 2026-08-14 に中国版CDN由来のアイコンを削除したが、
  // グローバル版公式から取り直して 2026-08-15 に復活させたため、チェックに戻した
  readJson('src/data/hok_arcanas.json').forEach((a) => checkIcon(`arcana ${a.id} ${a.name}`, a.icon));
  readJson('src/data/hok_heroes.json').forEach((h) => checkIcon(`hero ${h.id} ${h.name}`, h.image));
  // スキルデータ内の icon 参照（ローカルパスのみ）
  for (const lang of ['ja', 'en']) {
    const data = readJson(`public/data/skills/${lang}.json`);
    for (const id in data) {
      for (const sk of ['passive', 'skill1', 'skill2', 'skill3', 'skill4']) {
        const s = data[id]?.[sk];
        if (s?.icon) checkIcon(`skills/${lang} ${id}.${sk}`, s.icon);
        (s?.forms || []).forEach((f, i) => f?.icon && checkIcon(`skills/${lang} ${id}.${sk}.forms[${i}]`, f.icon));
      }
    }
  }
}

/* ---------- 4. スキルデータの ja/en 構造欠損 ---------- */
{
  const ja = readJson('public/data/skills/ja.json');
  const en = readJson('public/data/skills/en.json');
  const heroes = readJson('src/data/hok_heroes.json');
  for (const h of heroes) {
    const id = String(h.id);
    for (const [lang, data] of [['ja', ja], ['en', en]]) {
      const d = data[id];
      if (!d) { report('データ欠損', `skills/${lang}.json にヒーロー ${id} (${h.name}) が無い`); continue; }
      if (!d.passive && !d.skill1) report('データ欠損', `skills/${lang}.json ${id} (${h.name}) に passive/skill1 が無い`);
    }
    // 片言語だけ meta（カウンター解説）が無いケース
    const jaMeta = !!(ja[id]?.meta && (ja[id].meta.counters || ja[id].meta.synergy));
    const enMeta = !!(en[id]?.meta && (en[id].meta.counters || en[id].meta.synergy));
    if (jaMeta !== enMeta) report('データ欠損', `${id} (${h.name}) の meta が片言語のみ (ja:${jaMeta} en:${enMeta})`);
  }
}

/* ---------- 5. ヒーロー名の規約 ---------- */
{
  const heroes = readJson('src/data/hok_heroes.json');
  for (const h of heroes) {
    if (!h.name_en) report('名前規約', `${h.id} name_en が無い`);
    if (!CJK.test(h.name) && !/[ァ-ヶ]/.test(h.name)) report('名前規約', `${h.id} name が日本語でない: ${h.name}`);
    if (h.jpName !== undefined) report('名前規約', `${h.id} 廃止済み jpName フィールドが復活している`);
    if (h.enName !== undefined) report('名前規約', `${h.id} 廃止済み enName フィールドが復活している`);
  }
  // 過去に混入した誤表記が復活していないか（正: 大司命/白龍/Augran/Ao'yin/Chicha）
  const forbidden = ['オーグラン', 'アオイン', 'Chixia', '"Ao Yin"', '"Da Si Ming"', '"Bai Long"'];
  const dataFiles = [
    'src/data/hok_heroes.json', 'src/data/hero_stats_camp.json', 'src/data/patches.json',
    'src/data/patch_meta.json', 'src/data/top_tier.json',
    'public/data/skills/ja.json', 'public/data/skills/en.json',
  ];
  for (const f of dataFiles) {
    const c = fs.readFileSync(path.join(root, f), 'utf8');
    for (const t of forbidden) {
      if (c.includes(t)) report('名前規約', `${f} に誤表記「${t.replace(/"/g, '')}」が混入`);
    }
  }
  // パッチの version_en 欠落（EN表示が日本語に落ちる）
  readJson('src/data/patches.json').forEach((p) => {
    if (p.version && !p.version_en) report('名前規約', `patches ${p.id}: version_en が無い（EN表示が日本語になる）`);
  });
}

/* ---------- 6. 外部ホストの画像を掲載していないか ---------- */
{
  // 公式CDN（game.gtimg.cn など）への直リンクは、再ホストと違って相手のCDNに負荷がかかるため
  // 権利者側で最初に気づかれる。2026-08 に参照を0件にしたので、復活したらここで止める。
  // next.config.ts の images.remotePatterns では止まらない（unoptimized: true のとき
  // next/image は最適化器を通らず、hasRemoteMatch による検証が走らないため）。
  const SELF = 'hok.hub-game.com';
  const ALLOW_HOST = new Set([
    SELF,
    'placehold.co', // 画像が無いときのフォールバック。公式アセットではない
  ]);
  const IMG_URL = /https?:\/\/([a-z0-9.-]+)[^\s"'`)]*\.(png|jpe?g|webp|gif|avif)/gi;
  const targets = [];
  const walkDir = (rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) { if (e.name !== 'parsed_skills') walkDir(r); }
      else if (/\.(tsx?|jsx?|json)$/.test(e.name)) targets.push(r);
    }
  };
  ['src', 'public/data', 'messages'].forEach(walkDir);

  for (const f of targets) {
    const c = fs.readFileSync(path.join(root, f), 'utf8');
    const hits = new Map();
    for (const m of c.matchAll(IMG_URL)) {
      const host = m[1].toLowerCase();
      if (ALLOW_HOST.has(host)) continue;
      if (!hits.has(host)) hits.set(host, m[0]);
    }
    for (const [host, sample] of hits) {
      report('外部画像', `${f} が ${host} の画像を直リンクしている: ${sample.slice(0, 90)}`);
    }
  }
}

/* ---------- 7. 掲載画像の拡張子が .webp のままか ---------- */
{
  // 2026-08-15 に public/images 配下を WebP へ移した（20MB → 3.4MB）。
  // 実ファイルはもう .png / .jpg では存在しないので、テンプレートリテラルで
  // 組み立てたパスに拡張子を直書きすると 404 になる。実際 HeroDetailClient の
  // `/images/skills/${hero?.key || id}_${idx}.png` が一括置換から漏れて
  // 全ヒーローのスキルアイコンが消えかけた。3 の実在チェックは変数入りのパスを
  // 追えないので、ここで拡張子そのものを見る。
  // /images 直下の og-image.jpg などは WebP を読めない SNS があるため対象外。
  const CONVERTED = 'skills|heroes|arcana|items|summoners';
  const BAD_EXT = new RegExp(`/images/(?:${CONVERTED})/[^"'\`]*?\\.(png|jpe?g)`, 'gi');
  const files = [];
  const walk = (rel) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const r = `${rel}/${e.name}`;
      if (e.isDirectory()) walk(r);
      else if (/\.(tsx?|jsx?|json)$/.test(e.name)) files.push(r);
    }
  };
  ['src', 'public/data', 'messages'].forEach(walk);

  for (const f of files) {
    const c = fs.readFileSync(path.join(root, f), 'utf8');
    const hits = [...new Set((c.match(BAD_EXT) || []).map((h) => h.trim()))];
    hits.slice(0, 3).forEach((h) => report('画像拡張子', `${f} が変換前の拡張子を指している: ${h.slice(0, 70)}`));
    if (hits.length > 3) report('画像拡張子', `${f} … 他 ${hits.length - 3} 件`);
  }
}

/* ---------- 8. サイト最終更新日 ---------- */
// トップの「最終更新」バッジと、再訪時の赤点（TabBar）がこの日付を見ている。
// 更新したのに日付を上げ忘れると、読者には「止まっているサイト」に映る。
// 掲載内容に触った未コミットの変更があるなら、その日のうちに上げさせる。
// 中身に関係のない作業（スクリプト整理など）は SKIP_FRESHNESS_CHECK=1 で飛ばす。
{
  const { site } = readJson('src/data/data_freshness.json');
  // 日本時間の今日。実行環境のローカル時間で取ると、CI（UTC）が JST の当日日付を
  // 「未来」と誤判定して落ちる。site_date.mjs のコメントを参照。
  const today = siteToday();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(site.lastUpdated)) {
    report('最終更新日', `site.lastUpdated の書式が不正: ${site.lastUpdated}`);
  } else if (site.lastUpdated > today) {
    report('最終更新日', `site.lastUpdated が未来の日付になっている: ${site.lastUpdated}`);
  } else if (!process.env.SKIP_FRESHNESS_CHECK) {
    let changed = [];
    try {
      const out = execSync('git status --porcelain -- src public messages', {
        cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      });
      changed = out.split('\n')
        .map((l) => l.slice(3).trim())
        .filter(Boolean)
        .filter((f) => !f.includes('data_freshness.json'));
    } catch {
      // git が使えない環境では判定しない
    }
    if (changed.length > 0 && site.lastUpdated !== today) {
      const sample = changed.slice(0, 3).join(', ') + (changed.length > 3 ? ` 他${changed.length - 3}件` : '');
      report('最終更新日',
        `掲載内容に未コミットの変更（${sample}）があるのに site.lastUpdated が ${site.lastUpdated} のまま。` +
        `\n      → 読者に見える変更なら \`npm run touch:updated\` で ${today} に上げてからコミットする。` +
        `\n      → 中身に関係のない作業なら SKIP_FRESHNESS_CHECK=1 npm run audit`);
    }
  }
}

/* ---------- 9. スペル採用集計と実データの照合 ---------- */
/*
 * listNotes.ts の「実際に選ばれているスペル」は hero_item_builds.json を数えた結果を
 * 地の文に書き写している。2026-08-25、ビルドを3体追加したのに集計文を更新し忘れ、
 * 「ウィークネスはどれにも入っていない」という記述が、同じサイトの
 * フロレンティーノのページ（人気2位がウィークネス）と矛盾したまま公開された。
 * 書き写しである以上ズレるので、実数と突き合わせて落とす。
 */
{
  const builds = readJson('src/data/hero_item_builds.json');
  const spells = readJson('src/data/hok_spells.json');
  const notes = fs.readFileSync(path.join(root, 'src/content/listNotes.ts'), 'utf8');

  const sets = Object.values(builds).flat();
  const count = {};
  for (const set of sets) count[set.spell] = (count[set.spell] || 0) + 1;

  // 総数は日英どちらの本文にも出るので、まずそこを見る
  if (!notes.includes(`人気セット${sets.length}通り`) || !notes.includes(`the ${sets.length} popular sets`)) {
    report('スペル集計',
      `hero_item_builds.json のセット総数は ${sets.length} 通りだが、listNotes.ts の本文がその数字になっていない。` +
      `\n      → src/content/listNotes.ts の spells セクション（ja/en 両方）を数え直した値に更新する。`);
  }

  // 「どれにも入っていない」と書いたスペルが、実際には採用されていないか
  for (const spell of spells) {
    const used = count[spell.id] || 0;
    if (used === 0) continue;
    const claimsZeroJa = new RegExp(`${spell.japanese_name}[^。]*どれにも入っていま`).test(notes);
    const claimsZeroEn = new RegExp(`${spell.english_name}[^.]*appear in none of the`).test(notes);
    if (claimsZeroJa || claimsZeroEn) {
      report('スペル集計',
        `listNotes.ts は ${spell.japanese_name}（${spell.english_name}）を「どれにも入っていない」と書いているが、` +
        `hero_item_builds.json では ${used} 通りで採用されている。`);
    }
  }
}

/* ---------- 10. レーン別Tier表の講評と統計取得日の整合 ---------- */
/*
 * laneTierPages.ts の講評（commentary）は 2026-08-14 取得の hero_stats_camp.json の
 * 実数（勝率・出現率・BAN率・Tier）を地の文に書き写している。統計を差し替えると
 * 講評だけが古い数字で残るため、宣言された日付と data_freshness.json の取得日を突き合わせる。
 */
{
  const freshness = readJson('src/data/data_freshness.json');
  const src = fs.readFileSync(path.join(root, 'src/content/laneTierPages.ts'), 'utf8');
  const m = src.match(/LANE_COMMENTARY_STATS_DATE = '([0-9-]+)'/);
  if (!m) {
    report('レーン講評', 'laneTierPages.ts に LANE_COMMENTARY_STATS_DATE が見つからない。');
  } else if (m[1] !== freshness.campStats.updatedAt) {
    report('レーン講評',
      `統計の取得日は ${freshness.campStats.updatedAt} だが、レーン講評は ${m[1]} 時点の数字のまま。` +
      `
      → src/content/laneTierPages.ts の commentary を現行データで書き直し、LANE_COMMENTARY_STATS_DATE を上げる。`);
  }
}

/* ---------- 11. スキル表の見出し ---------- */
// ヒーロー詳細は先頭に「詳細」列を必ず描くので、データ側の headers に空文字が入ると
// 表全体が1列ずれる（フロレンティーノ等15件で実際に起きていた）。headers が空だと
// Lv. 見出しが丸ごと消え、2列の表が「Lv.1で2倍」に読めてしまう。
{
  const KEYS = ['passive', 'skill1', 'skill2', 'skill3', 'skill4'];
  for (const lang of ['ja', 'en']) {
    const data = readJson(`public/data/skills/${lang}.json`);
    for (const [hid, hero] of Object.entries(data)) {
      for (const key of KEYS) {
        const skill = hero?.[key];
        if (!skill) continue;
        const nodes = [[null, skill], ...(skill.forms ?? []).map((f, i) => [i, f])];
        for (const [fi, node] of nodes) {
          const table = node?.table;
          const rows = table?.rows;
          if (!table || !Array.isArray(rows) || rows.length === 0) continue;
          const where = `${lang} ${hid} ${hero.hero_name} ${key}${fi === null ? '' : `[${fi}]`}`;
          const cols = rows[0]?.values?.length ?? 0;
          const headers = table.headers ?? [];
          if (headers.length === 0) {
            report('スキル表の見出し', `${where}: 値は${cols}列あるのに headers が空。Lv. 見出しが表示されない。`);
          } else if (headers.some((h) => String(h).trim() === '')) {
            report('スキル表の見出し', `${where}: headers に空文字が入っている。表示が1列ずれる。`);
          } else if (headers.length !== cols) {
            report('スキル表の見出し', `${where}: headers ${headers.length}個に対し値は${cols}列。`);
          }
          const bad = rows.filter((r) => (r.values?.length ?? 0) !== cols);
          if (bad.length) {
            report('スキル表の見出し', `${where}: 行によって列数が違う（${bad.map((r) => r.label).join(', ')}）。`);
          }
        }
      }
    }
  }
}

/* ---------- 結果 ---------- */
if (warnings.length) {
  console.log(`⚠ 既知の未解決 ${warnings.length} 件（CIは止めない）`);
  warnings.forEach((w) => console.log('  ' + w));
}
if (problems.length === 0) {
  console.log('✓ 監査OK: 新たな問題は見つかりませんでした');
  process.exit(0);
} else {
  console.error(`✗ 監査NG: ${problems.length} 件の問題`);
  problems.forEach((p) => console.error('  ' + p));
  process.exit(1);
}
