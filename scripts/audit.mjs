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
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  '/images/items/1217.png', // 秘法のページ
  '/images/items/1218.png', // 元流の結晶
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
  // アルカナはアイコンを掲載しない方針にしたため、画像参照のチェック対象から外した
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
    // Amazonアソシエイトは商品画像の再ホストを禁じており、Amazon側から配信させるのが規約上の正解。
    // 他の直リンクとは逆に、こちらは直リンクでなければならない
    'm.media-amazon.com',
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
