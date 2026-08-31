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
 *  12. 掲載文の用語     … 別ゲームの語や、少数派に割れた言い方が復活していないか
 *  13. ビルド解説       … buildNotes.ts がビルドの本数と揃い、選ぶ条件が排他か
 *  14. ENの日本語残留  … src/content/*.ts の en: に日本語が混じっていないか
 *  15. ガイド更新日   … ガイド3本の本文を触ったのに guides.*.updatedAt が当日でないか
 *  16. デザイン規約   … 直した文字色・極小文字・main・th scope・nav の名前が戻っていないか
 *  17. サイトマップ   … staticPaths と実ルートが両方向で一致するか
 *  18. 広告と法務    … AdSense とプライバシーポリシー、権利表記が食い違っていないか
 *  19. パッチ要約    … 最新パッチのヒーロー項目が、トップのカードが読む書式に従っているか
 *  20. パッチの版    … patches.json と patch_meta.json の version が1対1で対応するか
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
  scan(readJson('src/data/skills/en.json'), '', hits);
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
    const data = readJson(`src/data/skills/${lang}.json`);
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
  const ja = readJson('src/data/skills/ja.json');
  const en = readJson('src/data/skills/en.json');
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

  // Tier表と一覧は camp を hok_heroes の id で直接引く。取りこぼしの保険を
  // 消した代わりに、両方向のずれをここで見張る（現状はどちらも0件）
  const camp = readJson('src/data/hero_stats_camp.json');
  for (const h of heroes) {
    if (!camp[String(h.id)]) report('データ欠損', `hero_stats_camp.json にヒーロー ${h.id} (${h.name}) が無い`);
  }
  const heroIds = new Set(heroes.map(h => String(h.id)));
  for (const k of Object.keys(camp)) {
    // ヒーロー詳細の「同レーン」導線が camp を直接列挙するため、
    // 孤児キーがあると存在しないヒーローへリンクが出る
    if (!heroIds.has(k)) report('データ欠損', `hero_stats_camp.json のキー ${k} が hok_heroes.json に無い`);
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
    'src/data/patch_meta.json',
    'src/data/skills/ja.json', 'src/data/skills/en.json',
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
      if (e.isDirectory()) walkDir(r);
      else if (/\.(tsx?|jsx?|json)$/.test(e.name)) targets.push(r);
    }
  };
  ['src', 'messages'].forEach(walkDir);

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
  ['src', 'messages'].forEach(walk);

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
 * フロレンティーノのページ（2つ目のビルドがウィークネス）と矛盾したまま公開された。
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
  if (!notes.includes(`おすすめビルド${sets.length}通り`) || !notes.includes(`the ${sets.length} recommended builds`)) {
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

/* ---------- 9-1. ジャングル装備の集計 ---------- */
/*
 * listNotes.ts と guide/ja.json が、ジャングル装備の採用数を地の文に書き写している。
 * この数字は2回続けて古くなった。1度目は 2026-08-28 のビルド差し替えで（49通りのまま）、
 * 2度目はその修正のときに「主戦場が JUNGLE のヒーローだけ」で数えてしまい8通り落とした。
 * カイザー・李元芳・孔明・蒼・楊戩はレーン持ちだが、ジャングル型のビルドも持っている。
 *
 * 正しい数え方は「スマイトを取るビルド」。ジャングル装備はスマイトが無いと買えないので、
 * この2つの集合は一致する。一致すること自体もここで確かめる。
 */
{
  const builds = readJson('src/data/hero_item_builds.json');
  const notes = fs.readFileSync(path.join(root, 'src/content/listNotes.ts'), 'utf8');
  const guide = fs.readFileSync(path.join(root, 'src/data/guide/ja.json'), 'utf8');
  const JUNGLE_ITEMS = { 1533: 'グリードバイト', 1531: 'ルーンソード', 1532: '巨人のグリップ' };

  const smite = [];
  const withItem = [];
  const heroes = new Set();
  const per = {};
  for (const [heroId, sets] of Object.entries(builds)) {
    sets.forEach((set, i) => {
      const hit = set.items.filter((id) => JUNGLE_ITEMS[id]);
      if (set.spell === 'smite') smite.push(`${heroId}:${i}`);
      if (hit.length) {
        withItem.push(`${heroId}:${i}`);
        heroes.add(heroId);
        for (const id of hit) per[JUNGLE_ITEMS[id]] = (per[JUNGLE_ITEMS[id]] || 0) + 1;
      }
    });
  }
  const same = smite.length === withItem.length && smite.every((k) => withItem.includes(k));
  if (!same) {
    report('ジャングル装備',
      `スマイトを取るビルド（${smite.length}通り）とジャングル装備を積むビルド（${withItem.length}通り）が一致しない。` +
      `\n      → 掲載文が「この2つは同じ」と書いているので、本文の書き直しが要る。`);
  }
  const need = [
    [`スマイトを取る${withItem.length}通り`, 'listNotes.ts', notes],
    [`グリードバイト${per['グリードバイト'] || 0}・ルーンソード${per['ルーンソード'] || 0}`, 'guide/ja.json', guide],
    [`おすすめビルド${withItem.length}通り`, 'guide/ja.json', guide],
    [`${heroes.size}体ぶん`, 'listNotes.ts', notes],
  ];
  const missing = need.filter(([text, , body]) => !body.includes(text));
  if (missing.length) {
    report('ジャングル装備',
      `ジャングル装備の集計が本文と合わない（実データ: ${withItem.length}通り / ${heroes.size}体 / ` +
      Object.entries(per).map(([k, v]) => `${k}${v}`).join('・') + `）。\n      ` +
      missing.map(([text, file]) => `${file} に「${text}」が見つからない`).join('\n      '));
  }
}

/* ---------- 9-2. おすすめビルドのアルカナ ---------- */
/*
 * アルカナの装着枠は赤10・青10・緑10の30で固定なので、1ビルドの中で
 * 同じ色の個数を足すと必ず10になる。スクショから読み取ったデータなので、
 * 数字の読み違いはここで必ず露見する（実際、最初の抽出では34セットが落ちた）。
 * 装備6枠とスペル1つも欠けていないかを併せて見る。
 */
{
  const builds = readJson('src/data/hero_item_builds.json');
  const arcana = readJson('src/data/hok_arcanas.json');
  const items = readJson('src/data/hok_items.json');
  const spells = readJson('src/data/hok_spells.json');
  const typeById = new Map(arcana.map(a => [a.id, a.type]));
  const itemIds = new Set(items.map(i => i.id));
  const spellIds = new Set(spells.map(s => s.id));

  const bad = [];
  for (const [heroId, sets] of Object.entries(builds)) {
    sets.forEach((set, i) => {
      const where = `ヒーローID ${heroId} のビルド${i + 1}`;
      if (set.items.length !== 6) bad.push(`${where}: 装備が ${set.items.length} 個`);
      for (const id of set.items) if (!itemIds.has(id)) bad.push(`${where}: 装備ID ${id} が hok_items.json に無い`);
      if (!spellIds.has(set.spell)) bad.push(`${where}: スペル ${set.spell} が hok_spells.json に無い`);
      const sum = {};
      for (const a of set.arcana || []) {
        const t = typeById.get(a.id);
        if (!t) { bad.push(`${where}: アルカナID ${a.id} が hok_arcanas.json に無い`); continue; }
        sum[t] = (sum[t] || 0) + a.count;
      }
      for (const color of ['red', 'blue', 'green']) {
        if (sum[color] !== 10) bad.push(`${where}: ${color} の合計が ${sum[color] ?? 0}（10のはず）`);
      }
    });
  }
  if (bad.length) {
    report('おすすめビルド',
      `hero_item_builds.json に ${bad.length} 件の不整合。\n      ` + bad.slice(0, 8).join('\n      '));
  }
}

/* ---------- 13. おすすめビルドの解説 ---------- */
/*
 * buildNotes.ts はビルドの並び順で解説を持つ。ビルドを撮り直して本数が変わると、
 * 解説が1本ずれて「ビルド2の説明がビルド1に付く」という壊れ方をする。見た目では
 * 気づけないので、ここで本数を突き合わせる。
 *
 * when（どういうときに選ぶか）は2本で排他になっていないと役に立たない。
 * 同じ条件が並んでいたら、読者はどちらを選べばいいか決められない。
 * TS を正規表現で読むのは荒いが、このファイルの書式は1種類しかないので足りる。
 */
{
  const builds = readJson('src/data/hero_item_builds.json');
  const src = fs.readFileSync(path.join(root, 'src/content/buildNotes.ts'), 'utf8');
  const bad = [];

  const BLOCK_RE = new RegExp(String.raw`^ {2}'(\d+)': \[\r?$([\s\S]*?)^ {2}\],\r?$`, 'gm');
  const NOTE_RE = /^ {6}ja: \{/gm;
  const WHEN_RE = /^ {8}when: '(.*)',\r?$/gm;

  for (const m of src.matchAll(BLOCK_RE)) {
    const [, heroId, body] = m;
    const expected = builds[heroId]?.length ?? 0;
    const written = (body.match(NOTE_RE) ?? []).length;
    if (expected === 0) {
      bad.push(`ヒーローID ${heroId}: hero_item_builds.json にビルドが無いのに解説がある`);
      continue;
    }
    if (written !== expected) {
      bad.push(`ヒーローID ${heroId}: ビルド ${expected} 本に対して解説 ${written} 本`);
    }
    // when が同一だと、2本のうちどちらを選ぶかが決まらない
    const whens = [...body.matchAll(WHEN_RE)].map((w) => w[1]);
    const dup = whens.filter((w, i) => whens.indexOf(w) !== i);
    for (const d of new Set(dup)) {
      bad.push(`ヒーローID ${heroId}: 選ぶ条件が2本とも「${d}」で排他になっていない`);
    }
  }

  if (bad.length) {
    report('ビルド解説',
      `buildNotes.ts に ${bad.length} 件の不整合。\n      ` + bad.slice(0, 8).join('\n      '));
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
    const data = readJson(`src/data/skills/${lang}.json`);
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

/* ---------- 12. 掲載文の用語 ---------- */
/*
 * 2026-08-30 の点検で、掲載文に34箇所の用語ずれが見つかった。内訳は2種類ある。
 *
 * ひとつは「このゲームに無い語」。ワード（設置型の視界アイテムが存在しない）、
 * 陣営（狩り場はキャンプ）、資源・リソース（通貨と経験値をまとめて呼ぶ語が無い）、
 * 反殺（中国語）、中衛（日本語MOBAに無い区分）、遠隔（中国語「远程」の直訳）。
 * 文法は正常で、語の組み合わせも正常なので、読んでいるだけでは出てこない。
 *
 * もうひとつは「少数派に割れた言い方」。ブッシュ8対茂み142のように、
 * 片方が圧倒的多数なら少数派が誤り。放っておくと書くたびに増える。
 *
 * ゲーム内表示の書き起こし（skills/ja.json の passive / skillN / status_text）は
 * 対象外。ゲームがそう書いているものを揃えにいくと事故になる。
 */
{
  const NG = [
    // [禁止語, 採用語, 例外の正規表現]
    ['ワード', '視界の通らない角度など具体的に', null],
    ['陣営', 'キャンプ', null],
    ['資源', 'ゴールドと経験値・ファーム・取り分など具体的に', null],
    ['リソース', '同上', null],
    ['反殺', '返り討ちにあう', null],
    ['中衛', '前衛 / 後衛', null],
    ['遠隔', '遠距離', null],
    ['ギャンク', 'ガンク', null],
    ['チャンピオン', 'ヒーロー', /チャンピオンシップ/],
    ['ルーン', 'アルカナ', /ルーンソード/],
    ['ブルーバフ', '青バフ', null],
    ['レッドバフ', '赤バフ', null],
    ['ブッシュ', '茂み', /アンブッシュ|Backline|Frontline|フロントライン|バックライン/],
    ['スロー', 'スロウ', null],
    ['バトルスペル', 'サモナースペル', null],
    ['サモナースキル', 'サモナースペル', null],
    ['テレポート', 'ワープ', null],
    ['バックライン', '後衛', /Backline/],
    ['フロントライン', '前衛', /Frontline/],
    ['トドメ', 'ラストヒット（CS）', null],
    ['バロン', 'このゲームには存在しない', null],
    ['抑制装置', 'このゲームには存在しない', null],
    ['ネクサス', 'クリスタル', null],
    ['所持金', 'ゴールド', null],
    ['購買力', 'ゴールド', null],
    ['物理防御突破', '物理防御貫通', null],
    // 2026-08-30 の校正で3か所見つかった。散文だけの略記で、ゲーム内表記には一度も出ない。
    // 英語の本文にも AD / AP は出るので、前後が英字のものは除く
    ['AD', '物理攻撃', /[A-Za-z]AD|AD[A-Za-z]/],
    ['AP', '魔法攻撃', /[A-Za-z]AP|AP[A-Za-z]/],
  ];
  // 書き起こしのキー。ここはゲームの表示そのものなので触らない
  const TRANSCRIBED = /(^|\.)(passive|skill[1-4]|status_text|stats|cooldown_text)(\.|$)/;
  const walk = (node, keys, out) => {
    if (typeof node === 'string') out.push([keys.join('.'), node]);
    else if (Array.isArray(node)) node.forEach((v, i) => walk(v, [...keys, i], out));
    else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, [...keys, k], out);
  };

  const prose = [];
  {
    const out = [];
    walk(readJson('src/data/skills/ja.json'), [], out);
    for (const [key, text] of out) if (!TRANSCRIBED.test(key)) prose.push([`src/data/skills/ja.json:${key}`, text]);
  }
  for (const file of ['src/data/guide/ja.json', 'src/data/patches.json', 'src/data/patch_meta.json', 'messages/ja.json']) {
    const out = [];
    walk(readJson(file), [], out);
    for (const [key, text] of out) prose.push([`${file}:${key}`, text]);
  }
  // search_alias は検索用の旧表記を意図して持っているので外す
  for (const hero of readJson('src/data/hok_heroes.json')) {
    prose.push([`src/data/hok_heroes.json:${hero.id}.name`, `${hero.name} ${hero.title ?? ''}`]);
  }
  const contentDir = path.join(root, 'src/content');
  for (const f of fs.readdirSync(contentDir).sort()) {
    // コメント行は読者に見えないので外す
    const body = fs.readFileSync(path.join(contentDir, f), 'utf8')
      .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
    prose.push([`src/content/${f}`, body]);
  }

  const found = [];
  for (const [where, text] of prose) {
    // 英語のフィールドと英文は対象外。AD / bonus AD のように、英語では正しい語がある
    if (/_en(\.|$)/.test(where) || !/[぀-ヿ一-鿿]/.test(text)) continue;
    for (const [ng, ok, exception] of NG) {
      let i = -1;
      while ((i = text.indexOf(ng, i + 1)) !== -1) {
        const around = text.slice(Math.max(0, i - 12), i + ng.length + 12);
        if (exception && exception.test(around)) continue;
        found.push(`${where}  「${ng}」→ ${ok}\n      …${around.replace(/\n/g, ' ')}…`);
      }
    }
  }
  if (found.length) {
    report('掲載文の用語', `別ゲームの語または少数派の言い方が ${found.length} 件。\n      ` + found.slice(0, 10).join('\n      '));
  }
}

/* ---------- 14. src/content の EN に日本語が混じっていないか ---------- */
/*
 * 検査2は JSON（skills / guide / patches）だけを見ている。掲載文の大半は
 * src/content/*.ts に移っていて、buildNotes.ts だけで en: ブロックが227件ある。
 * ここに日本語が混じっても、型は通るし本番でも英語ページを開くまで分からない。
 * スモークは116体中2体しか踏まないので、静的に全部見るのはこの検査だけになる。
 *
 * 掲載文を messages/*.json へ移す案は採らない。src/content の値は
 * `{ ja: ...; en: ... }` の型で日英が対になっており、型が抜けを止めている。
 * JSON に移すとその強制が消える。塞ぐのは「EN に日本語が混じる」穴だけでよい。
 *
 * 行単位の正規表現では書けない。en: の値は複数行のオブジェクトや配列で、
 * `en: string` のような型定義側の出現も除く必要がある。文字列とコメントを
 * 読み飛ばしながら括弧を数える。
 */
{
  const contentDir = path.join(root, 'src/content');
  // 検査2と同じ許容語。EN の文中に日本語のアイテム名が出るのは正しい。
  // ただし en: の値は段落まるごとなので完全一致では効かない。
  // 許容語を消してから残りに CJK があるかを見る
  const allowed = ['迅速の槍', 'フォージセイバー', '月神の杖', '天地石', '原初の玉石', '抗魔のマント'];

  /**
   * src の i 文字目から始まる値を、括弧の対応を数えて切り出す。
   * コメントは返り値に含めない。日本語のコード注釈を掲載文と取り違えるため
   * （最初の実装ではこれで listNotes.ts の5件を誤検知した）
   */
  const readValue = (src, i) => {
    const out = [];
    let depth = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); if (e < 0) break; i = e; continue; }
      if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i); if (e < 0) break; i = e + 2; continue; }
      if (c === "'" || c === '"' || c === '`') {
        const q = c; const from = i; i++;
        while (i < src.length && src[i] !== q) { if (src[i] === '\\') i++; i++; }
        i++; out.push(src.slice(from, i)); continue;
      }
      if (c === '{' || c === '[' || c === '(') { depth++; out.push(c); i++; continue; }
      if (c === '}' || c === ']' || c === ')') { if (depth === 0) break; depth--; out.push(c); i++; continue; }
      if (c === ',' && depth === 0) break;
      out.push(c); i++;
    }
    return out.join('');
  };

  const bad = [];
  let blocks = 0;
  for (const f of fs.readdirSync(contentDir).filter((x) => x.endsWith('.ts'))) {
    const src = fs.readFileSync(path.join(contentDir, f), 'utf8');
    // 型定義の中の en: は除く。type / interface ブロックを先に潰しておく
    const body = src.replace(/(?:export\s+)?(?:type|interface)\s+\w+[\s\S]*?\n\};?\n/g, '\n');
    const re = /(^|[{,\n]\s*)en\s*:\s*/g;
    let m;
    while ((m = re.exec(body)) !== null) {
      const at = m.index + m[0].length;
      const value = readValue(body, at);
      // 型注釈（en: string / en: BuildNote など）は値を持たないので飛ばす
      if (/^[A-Za-z_$][\w$<>\[\]|\s.]*$/.test(value.trim())) continue;
      blocks++;
      let stripped = value;
      for (const w of allowed) stripped = stripped.split(w).join('');
      if (CJK.test(stripped)) {
        const line = body.slice(0, m.index).split('\n').length;
        const hit = stripped.match(/[぀-ヿ㐀-䶿一-鿿][^\n]{0,40}/);
        bad.push(`src/content/${f}:${line}  ${hit ? hit[0] : value.slice(0, 40)}`);
      }
    }
  }
  if (bad.length) {
    report('ENの日本語残留', `src/content の en: に日本語が ${bad.length} 件（走査 ${blocks} ブロック）。\n      ` + bad.slice(0, 10).join('\n      '));
  }
}

/* ---------- 15. ガイド3本の更新日 ---------- */
/*
 * ガイドの dateModified は data_freshness.json の guides ブロックで手で維持する。
 * site.lastUpdated と混ぜていないので、検査8ではこの上げ忘れを拾えない。
 *
 * 検査8と同じ git status --porcelain 方式で見る。git log を使わないのは、
 * CI の shallow clone で git log -1 -- path が当てにならないため。
 *
 * この検査は完全ではない。61ce3ae は skills/ja.json を180行直しながら
 * data_freshness.json を触らずコミットされていて、既存の検査8はそれを止めていない。
 * こちらも同じ穴を持つ（コミット後に気づいても遡っては直せない）。
 */
{
  const fresh = readJson('src/data/data_freshness.json');
  const today = siteToday();
  // ガイドごとに「本文が入っているファイル」だけを並べる。
  // layout.tsx はメタデータと構造化データの置き場なので含めない。
  // それでも色や a11y だけを触ったコミットでは反応してしまうので、
  // そのときは日付を上げずに SKIP_FRESHNESS_CHECK=1 で通す（検査8と同じ運用）。
  // CI は checkout 直後で作業ツリーが綺麗なため、この検査は手元でしか鳴らない
  const GUIDE_SOURCES = {
    guide: ['src/data/guide/', 'src/app/[locale]/guide/GuideClient.tsx'],
    bosses: ['src/app/[locale]/guide/bosses/page.tsx'],
    beginnerHeroes: ['src/content/beginnerHeroes.ts', 'src/app/[locale]/guide/beginner-heroes/page.tsx'],
  };

  for (const [key, updated] of Object.entries(fresh.guides || {})) {
    if (key.startsWith('_')) continue;
    const at = updated.updatedAt;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(at)) {
      report('ガイド更新日', `guides.${key}.updatedAt の書式が不正: ${at}`);
    } else if (at > today) {
      report('ガイド更新日', `guides.${key}.updatedAt が未来の日付: ${at}`);
    }
  }

  if (!process.env.SKIP_FRESHNESS_CHECK) {
    let changed = [];
    try {
      const out = execSync('git status --porcelain -- src', {
        cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      });
      changed = out.split('\n').map((l) => l.slice(3).trim()).filter(Boolean);
    } catch {
      // git が使えない環境では判定しない
    }
    for (const [key, globs] of Object.entries(GUIDE_SOURCES)) {
      const hit = changed.filter((f) => globs.some((g) => f.startsWith(g)));
      if (hit.length === 0) continue;
      const at = fresh.guides?.[key]?.updatedAt;
      if (at !== today) {
        report('ガイド更新日',
          `${hit.slice(0, 2).join(', ')} を触っているのに guides.${key}.updatedAt が ${at}（今日は ${today}）`);
      }
    }
  }
}

/* ---------- 16. 直した状態が戻っていないか ---------- */
/*
 * 項目2・4・5・7・19 で直したものは、次に誰かが同じ書き方をすれば静かに戻る。
 * 見た目では気づけないので、ここで止める。
 *
 * 禁止クラスは除外の正規表現を書かず、件数の上限で見る。
 * `<Icon size={20} className={isActive ? "..." : "text-slate-400"} />` のような
 * 行は lucide のアイコンだが、それを機械的に判別する式は書けない。
 * 除外を広げるほど検査が空になるので、今日の実測値を上限として持ち、
 * 増えたら落とす。減らしたらこの数字も下げること。
 */
{
  const srcFiles = [];
  const walkSrc = (dir) => {
    for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) walkSrc(rel);
      else if (/\.(tsx|ts|css)$/.test(e.name)) srcFiles.push(rel);
    }
  };
  walkSrc('src');
  const textOf = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
  const countAll = (needle) =>
    srcFiles.reduce((n, f) => n + textOf(f).split(needle).length - 1, 0);

  // 上限。0 のものは「一度も使わない」の意味
  const CEILINGS = [
    ['text-slate-400', 23, 'アイコン・placeholder・暗背景・区切りの恒久的な残り。文字には使わない（下限は slate-500）'],
    ['text-brand-600', 0, '白地3.79・slate-100上3.46でAAに届かない。金の文字と塗りは brand-700'],
    ['animate-in', 0, '@keyframes の定義が無い。付けても何も起きない'],
    ['text-[8px]', 1, 'ふりがなの rt だけ。他は10px以上にする（Tier表のバッジは 2026-09-01 に10pxへ上げた）'],
    ['text-[9px]', 12, '固定幅のマス内ラベルだけ。増やさない'],
    ['dark:', 0, 'ダークモードは提供しない（globals.css のヘッダーコメント）'],
    ['touch-action:', 0, 'pinch-zoom を殺す。拡大して読む人がスキル表を読めなくなる。'
      + 'コロン付きで見るのは、globals.css に「付けない理由」のコメントがあるため'],
  ];
  for (const [needle, max, why] of CEILINGS) {
    const n = countAll(needle);
    if (n > max) {
      report('デザイン規約', `${needle} が ${n} 件（上限 ${max}）。${why}`);
    }
  }

  // シェルの土台。項目2で入れたものが消えていないか
  const shell = textOf('src/components/mobile/MobileAppShell.tsx');
  if (!shell.includes('href="#main-content"')) report('デザイン規約', 'シェルからスキップリンクが消えている');
  if (!shell.includes('id="main-content"')) report('デザイン規約', 'シェルの main から id="main-content" が消えている');

  // <main> はシェルの1件だけ。global-error と global-not-found はロケール層の
  // 外にある独立ドキュメントなので main を持つのが正しく、総数では見られない
  // NotFoundBody はロケール層の外（global-not-found / not-found）で使う部品なので
  // NotFoundBody はロケール層の外（global-not-found / not-found）で使う部品なので
  // main を持つのが正しい。コメント内の「<main>」への言及は数えないよう、
  // 行コメントを落としてから開きタグの形だけを見る
  const MAIN_ALLOWED = new Set(['src/components/NotFoundBody.tsx']);
  const stripLineComments = (t) => t.split('\n').map((l) => l.replace(/\/\/.*$/, '')).join('\n');
  const MAIN_TAG = /<main[\s>]/;
  const mainOwners = srcFiles.filter((f) =>
    (f.startsWith('src/app/[locale]/') || f.startsWith('src/components/'))
    && !MAIN_ALLOWED.has(f)
    && MAIN_TAG.test(stripLineComments(textOf(f))));
  if (mainOwners.length !== 1 || !mainOwners[0].endsWith('MobileAppShell.tsx')) {
    report('デザイン規約', `ロケール配下の <main> は MobileAppShell の1件だけにする。今: ${mainOwners.join(', ') || 'なし'}`);
  }

  // 表の見出し。<th から対応する > までをまとめて見る（複数行のタグがあるため）
  let thTotal = 0, thNoScope = 0;
  for (const f of srcFiles.filter((x) => x.endsWith('.tsx'))) {
    const t = textOf(f);
    let i = 0;
    while ((i = t.indexOf('<th', i)) !== -1) {
      if (t.startsWith('<thead', i)) { i += 6; continue; }
      const end = t.indexOf('>', i);
      thTotal++;
      if (!t.slice(i, end).includes('scope=')) {
        thNoScope++;
        report('デザイン規約', `${f}:${t.slice(0, i).split('\n').length} の <th> に scope が無い`);
      }
      i = end;
    }
  }
  if (thTotal === 0) report('デザイン規約', '<th> が1件も無い。表が素の td だけになっていないか確認する');

  // nav には名前を付ける。同じページに3つ以上並ぶので、無いと読み上げで区別できない
  for (const f of srcFiles.filter((x) => x.endsWith('.tsx'))) {
    const t = textOf(f);
    let i = 0;
    while ((i = t.indexOf('<nav', i)) !== -1) {
      const end = t.indexOf('>', i);
      if (!t.slice(i, end).includes('aria-label')) {
        report('デザイン規約', `${f}:${t.slice(0, i).split('\n').length} の <nav> に aria-label が無い`);
      }
      i = end;
    }
  }
}

/* ---------- 17. sitemap と実ルートの突き合わせ ---------- */
/*
 * sitemap.ts の staticPaths は手で並べている。ページを足したのに載せ忘れると
 * 検索エンジンに見つけてもらえず、消したページを残すと404が sitemap に載る。
 * 両方向で突き合わせる。
 */
{
  const sitemapSrc = fs.readFileSync(path.join(root, 'src/app/sitemap.ts'), 'utf8');
  const block = sitemapSrc.slice(sitemapSrc.indexOf('const staticPaths'), sitemapSrc.indexOf('];', sitemapSrc.indexOf('const staticPaths')));
  const listed = new Set([...block.matchAll(/'([^']*)'/g)].map((m) => m[1]));

  // 実ルート。動的セグメントは sitemap 側で別に展開しているので除く
  const routes = new Set();
  const walkRoutes = (dir, prefix) => {
    for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith('[')) continue; // [id] / [lane] は個別に展開済み
      const next = `${prefix}/${e.name}`;
      if (fs.existsSync(path.join(root, dir, e.name, 'page.tsx'))) routes.add(next);
      walkRoutes(`${dir}/${e.name}`, next);
    }
  };
  const localeDir = 'src/app/[locale]';
  if (fs.existsSync(path.join(root, localeDir, 'page.tsx'))) routes.add('');
  walkRoutes(localeDir, '');

  // /links は noindex なので意図的に載せていない（sitemap.ts にコメントあり）
  const INTENTIONAL_OMIT = new Set(['/links']);
  for (const r of routes) {
    if (listed.has(r) || INTENTIONAL_OMIT.has(r)) continue;
    report('サイトマップ', `${r} のページがあるのに sitemap.ts の staticPaths に無い`);
  }
  for (const l of listed) {
    if (routes.has(l)) continue;
    report('サイトマップ', `sitemap.ts に ${l} があるが、対応する page.tsx が無い`);
  }
}

/* ---------- 18. 広告と法務の整合 ---------- */
/*
 * AdSense を読み込んでいるのにプライバシーポリシーに書いていない、
 * あるいは同意管理を外した、という食い違いは審査で直接効く。
 * 権利表記が掲載文の整理で丸ごと消えるのも止める。
 */
{
  const layout = fs.readFileSync(path.join(root, 'src/app/[locale]/layout.tsx'), 'utf8');
  const privacy = fs.readFileSync(path.join(root, 'src/app/[locale]/privacy/page.tsx'), 'utf8');

  const hasAds = layout.includes('adsbygoogle');
  const claimsAds = privacy.includes('Google AdSense') && privacy.includes('AdSense について');
  if (hasAds && !claimsAds) {
    report('広告と法務', 'AdSense を読み込んでいるのに、プライバシーポリシーの日英どちらかに AdSense の記載が無い');
  }
  if (!hasAds && claimsAds) {
    report('広告と法務', 'プライバシーポリシーは AdSense を使うと書いているのに、レイアウトが読み込んでいない');
  }
  if (hasAds && !layout.includes("gtag('consent', 'default'")) {
    report('広告と法務', '広告を出しているのに Consent Mode の既定値が無い（GDPR 対象地域で必要）');
  }

  // 権利表記。守りたいのは表記が丸ごと消えること。出現数は見ない
  const REQUIRED = [
    ['src/app/[locale]/legal/page.tsx', ['Tencent', 'Level Infinite']],
    ['src/components/layout/Footer.tsx', ['Tencent', 'Level Infinite']],
    ['src/app/[locale]/terms/page.tsx', ['Tencent']],
  ];
  for (const [rel, words] of REQUIRED) {
    const t = fs.readFileSync(path.join(root, rel), 'utf8');
    for (const w of words) {
      if (!t.includes(w)) report('広告と法務', `${rel} から「${w}」の表記が消えている`);
    }
  }
}

/* ---------- 19. 最新パッチの要約行の書式 ---------- */
/*
 * トップの「最新パッチ バフ対象」カードは、本文の1行目から
 * 「**ルナ — スキル2の火力を…**」の区切りの後ろを取って要約にしている。
 * 書式が崩れると静かに本文まるごとの表示へ戻り、見た目では気づきにくい。
 *
 * 見るのは最新パッチのヒーロー項目だけ。過去の版は56件中20件しか
 * 従っておらず、遡って直す予定も無い。
 */
{
  const patches = readJson('src/data/patches.json');
  const metas = readJson('src/data/patch_meta.json');
  const latest = [...metas].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))[0];
  if (latest) {
    const rows = patches.filter((p) => p.version === latest.version && p.is_hero);
    for (const r of rows) {
      const first = String(r.description || '').split('\n')[0].replace(/\*\*/g, '').trim();
      if (!first.includes(' \u2014 ')) {
        report('パッチ要約', `${latest.version} の「${r.hero_name || r.id}」の1行目に「 \u2014 」の区切りが無い。`
          + 'トップのカードが本文まるごとの表示に落ちる');
      }
    }
    // 英語側も同じ書式で書く。英語トップのカードが同じ処理を通る
    for (const r of rows) {
      const en = String(r.description_en || '');
      if (!en) continue;
      const first = en.split('\n')[0].replace(/\*\*/g, '').trim();
      if (!first.includes(' \u2014 ')) {
        report('パッチ要約', `${latest.version} の「${r.hero_name_en || r.id}」の英語1行目に「 \u2014 」の区切りが無い`);
      }
    }
  }
}

/* ---------- 20. パッチの版と meta の突き合わせ ---------- */
/*
 * patches.json の version と patch_meta.json の version は1対1で対応する。
 * meta を書き忘れると、これまではその版のメタ分析が静かに消えるだけだったが、
 * 版ページ /patches/[date] を作った今は、URLが1本まるごと生成されなくなる。
 * 現状の担保は PATCH_NOTES_WORKFLOW.md の目視だけなので、機械で見る。
 */
{
  const patches = readJson('src/data/patches.json');
  const metas = readJson('src/data/patch_meta.json');
  const inPatches = new Set(patches.map((p) => p.version).filter(Boolean));
  const inMeta = new Set(metas.map((m) => m.version));

  for (const v of inPatches) {
    if (!inMeta.has(v)) report('パッチの版', `patches.json に「${v}」があるが patch_meta.json に無い。版ページが生成されない`);
  }
  for (const v of inMeta) {
    if (!inPatches.has(v)) report('パッチの版', `patch_meta.json に「${v}」があるが patches.json に項目が1件も無い。空の版ページになる`);
  }
  // 版ページのスラッグは created_at の YYYY-MM-DD。重複すると片方が消える
  const slugs = metas.map((m) => String(m.created_at).slice(0, 10));
  const dup = slugs.filter((x, i) => slugs.indexOf(x) !== i);
  if (dup.length) report('パッチの版', `patch_meta.json の created_at の日付が重複している: ${[...new Set(dup)].join(', ')}`);
  for (const m of metas) {
    if (!/^\d{4}-\d{2}-\d{2}/.test(String(m.created_at))) {
      report('パッチの版', `patch_meta.json の created_at が YYYY-MM-DD で始まっていない: ${m.version} → ${m.created_at}`);
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
