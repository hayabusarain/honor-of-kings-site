import dataFreshness from '@/data/data_freshness.json';
import patchMetas from '@/data/patch_meta.json';
import heroBaseStats from '@/data/hero_base_stats.json';
import heroItemBuilds from '@/data/hero_item_builds.json';
import { getPatchesForHero } from '@/lib/patchData';

/**
 * 掲載ページの「いつ時点か」を1箇所で決める。
 * JSON を読むので、サーバー側（page / layout / sitemap）からだけ import すること。
 *
 * 同じことを求める式が3箇所にあって、しかもキー集合がずれていた。
 *   sitemap.ts        … campStats / skillPriority / combos / site.lastUpdated
 *   heroes/[id]       … campStats / skillPriority / teamCombos / combos（site が無い）
 *   guide の3ページ    … 手書きの固定値
 * sitemap は teamCombos を落とし、ヒーロー詳細は site.lastUpdated を落としていた。
 * いったん「含む側」へ揃えたが、site.lastUpdated はプッシュのたびに当日へ上がるので、
 * 含めたページは毎回「今日更新した」ことになる。2026-09-25 にヒーロー詳細を
 * heroUpdatedAt() へ分け、site.lastUpdated を見るのは contentUpdatedAt() だけにした。
 *
 * 日付は YYYY-MM-DD の文字列。この形なら辞書順の比較がそのまま日付の比較になる。
 */

/** YYYY-MM-DD の中でいちばん新しいものを返す。空や undefined は無視する */
export function latestOf(...dates: (string | undefined | null)[]): string {
  const valid = dates.filter((d): d is string => typeof d === 'string' && d.length > 0);
  return valid.sort().at(-1) ?? '';
}

/**
 * トップ・ヒーロー一覧・FAQ索引など、掲載データ全体をまたぐページの更新日。
 * 統計・スキル優先度・編成・コンボ・装備・アルカナ・基本ステータス・
 * おすすめビルドと、本文の更新日（site.lastUpdated）を全部見る。
 * site.lastUpdated はプッシュのたびに当日へ上がるので、実質その日になる。
 *
 * ヒーロー詳細1体ぶんの日付には使わない。下の heroUpdatedAt() がある。
 */
export function contentUpdatedAt(): string {
  return latestOf(
    dataFreshness.campStats.updatedAt,
    dataFreshness.skillPriority.updatedAt,
    dataFreshness.teamCombos.updatedAt,
    dataFreshness.combos.updatedAt,
    dataFreshness.staticData.items.updatedAt,
    dataFreshness.staticData.arcana.updatedAt,
    dataFreshness.staticData.baseStats.updatedAt,
    dataFreshness.staticData.itemBuilds.updatedAt,
    dataFreshness.site.lastUpdated,
  );
}

/**
 * Tier表が使う更新日。統計の取得日そのもの。
 *
 * 以前は site.lastUpdated を混ぜていた。当時は他のURLも全部それを見ていたので、
 * 混ぜないとTier表だけが「いちばん古い lastmod」になってしまうためだった。
 * いまは固定ページが自分の日付を持つようになったので、その心配は無い。
 * 混ぜたままだと、統計を取り直していないのにプッシュしただけで
 * 「Tier表が更新された」と申告することになる。
 */
export function statsUpdatedAt(): string {
  return dataFreshness.campStats.updatedAt;
}

/**
 * 装備・アルカナ・スペル・基本ステータスなど、書き起こしデータの更新でしか
 * 中身が変わらないページの更新日。複数のデータを載せるページは、その中で
 * いちばん新しいものを使う（例: 装備シミュレーターは装備と基本ステータス）。
 */
export function dataUpdatedAt(...keys: (keyof typeof dataFreshness.staticData)[]): string {
  return latestOf(
    ...keys.map((k) => {
      const entry = dataFreshness.staticData[k];
      return typeof entry === 'object' && entry !== null && 'updatedAt' in entry
        ? (entry as { updatedAt: string }).updatedAt
        : undefined;
    }),
  );
}

/**
 * めったに変わらない固定ページの更新日。
 *
 * ここに site.lastUpdated を混ぜてはいけない。規約やプライバシーポリシーが
 * 「プッシュのたびに更新された」と申告する状態になり、Google が実ページと
 * 突き合わせれば嘘だと分かる。公式は lastmod を、一貫して検証可能なかたちで
 * 正確な場合にだけ使うと明記している。値は data_freshness.json の pages で手で維持する。
 */
export type StaticPageKey = Exclude<keyof typeof dataFreshness.pages, '_comment'>;

export function staticPageUpdatedAt(key: StaticPageKey): string {
  return dataFreshness.pages[key].updatedAt;
}

/** ヒーロー詳細の初出。初期コミット（2026-06-22）から全ヒーローのページがある。個別の初出日は記録がない */
export const HERO_PAGE_PUBLISHED = '2026-06-22';

/**
 * あとから足したヒーローのページの初出。ここに無いヒーローは HERO_PAGE_PUBLISHED。
 * hok_heroes.json の git 履歴で、2026-07-22 より後に足されたのはこの2体だけ（2026-09-25 に確認）
 */
const HERO_ADDED: Record<string, string> = {
  '583': '2026-09-24', // 元流の子（アサシン）a21795f
  '585': '2026-09-24', // 元流の子（サポート）a21795f
};

/** ヒーロー詳細1体ぶんの初出（Article の datePublished） */
export function heroPublishedAt(heroId: string): string {
  return HERO_ADDED[heroId] ?? HERO_PAGE_PUBLISHED;
}

// パッチの項目は日付を持たない。版の見出し（version）で patch_meta.json と結ぶ
const PATCH_DATE_BY_VERSION = new Map(
  (patchMetas as { version: string; created_at: string }[]).map((m) => [m.version, m.created_at.slice(0, 10)]),
);
const LATEST_PATCH_DATE = latestOf(...PATCH_DATE_BY_VERSION.values());

const UNRANKED_HERO_IDS: readonly string[] = dataFreshness.campStats.unrankedHeroIds;
const SKILL_PENDING_HERO_IDS: readonly string[] = dataFreshness.skillData.pendingHeroIds;
const PRIORITY_BY_HERO: Record<string, string | undefined> = dataFreshness.skillPriority.heroUpdatedAt;
const HAS_BASE_STATS = new Set(Object.keys(heroBaseStats));
const HAS_ITEM_BUILDS = new Set(
  Object.entries(heroItemBuilds).filter(([, b]) => b.length > 0).map(([id]) => id),
);

/**
 * ヒーロー詳細1体ぶんの更新日。heroId は数値ID（hok_heroes の id）。
 *
 * 以前は全ヒーローが contentUpdatedAt() で、site.lastUpdated を含むため、
 * プッシュのたびに236URLの lastmod が全部当日になっていた。
 * いまは、そのヒーローのページに載るデータの日付だけを見る。
 *
 * 統計と編成（HoK Camp）は、ランキングに載ったヒーローにだけ効かせる。
 * 載る前の新ヒーローのページには、どちらも出ていない。
 * 基本ステータスとおすすめビルドも、持っているヒーローだけ。
 *
 * おすすめビルドは撮り直した日（itemBuilds）だけを見る。装備とアルカナの日付は入れない。
 * この2つは画面と照合した日で、中身が同じでも上がる。8月29日のアルカナは30種を照合して食い違い0件。
 * 9月21日に直した装備2点は、どのビルドにも入っていなかった。
 * 入れた場合、8/29・9/1・9/21・9/24 の4回で116体ずつ、のべ464件の更新を申告することになる。
 * ビルド欄が実際に変わったのはそのうち120件（2026-09-25 に git の差分で数えた）。
 * 装備ごとの更新日が無いので、体ごとには絞れない。9月24日にビルド欄が変わった79体は、
 * 次に統計を取り直すまで古い日付のまま残る。多く申告するより、少なく申告するほうを選んだ。
 *
 * パッチの日付は、ページの「パッチ履歴」に項目が増えた日。スキル欄の書き起こしは数日遅れる。
 * 書き起こしの日付（skillData.updatedAt）は最新の版の分しか残らないので、
 * その版で調整され、反映待ちでないヒーローにだけ足す。9月10日の6体は、実際には 09-15 に書き起こした。
 *
 * site.lastUpdated は入れない。プッシュのたびに当日へ上がり、ヒーロー詳細の中身とは関係が無い。
 * 立ち回りや相性の本文、二つ名を1体だけ直した日も、ヒーロー別の日付が無いのでここには出ない
 * （9月21日の蘭陵王の二つ名の訂正がこれに当たる）。
 */
export function heroUpdatedAt(heroId: string): string {
  const ranked = !UNRANKED_HERO_IDS.includes(heroId);
  const lastPatch = latestOf(...getPatchesForHero(heroId).map((p) => PATCH_DATE_BY_VERSION.get(p.version ?? '')));
  const skillsTranscribed =
    lastPatch !== '' &&
    lastPatch === LATEST_PATCH_DATE &&
    dataFreshness.skillData.updatedAt >= lastPatch &&
    !SKILL_PENDING_HERO_IDS.includes(heroId);

  return latestOf(
    heroPublishedAt(heroId),
    ranked ? dataFreshness.campStats.updatedAt : undefined,
    ranked ? dataFreshness.teamCombos.updatedAt : undefined,
    PRIORITY_BY_HERO[heroId] ?? dataFreshness.skillPriority.updatedAt,
    dataFreshness.combos.updatedAt,
    HAS_BASE_STATS.has(heroId) ? dataFreshness.staticData.baseStats.updatedAt : undefined,
    HAS_ITEM_BUILDS.has(heroId) ? dataFreshness.staticData.itemBuilds.updatedAt : undefined,
    lastPatch,
    skillsTranscribed ? dataFreshness.skillData.updatedAt : undefined,
  );
}

/** 2026-09-25 に足したページの初出。統計や基本ステータスの日付はこれより古いので、下限に使う */
export const PAGE_PUBLISHED = {
  compare: '2026-09-25',
} as const;

/** ガイド3本の初出。git の初コミット日 */
export const GUIDE_PUBLISHED = {
  guide: '2026-06-22',
  bosses: '2026-08-08',
  beginnerHeroes: '2026-08-15',
} as const;

export type GuideKey = keyof typeof GUIDE_PUBLISHED;

/**
 * ガイド3本の更新日。
 *
 * site.lastUpdated は混ぜない。混ぜると3本とも同じ日になり、ページ別に持つ意味が消える。
 * 値は data_freshness.json の guides ブロックで手で維持する。
 * 上げ忘れは audit の検査15が見張る（src/content/beginnerHeroes.ts や
 * 各ガイドの本文に未コミットの変更があるのに、対応する updatedAt が当日でない場合）。
 */
export function guidePageUpdatedAt(key: GuideKey): string {
  return dataFreshness.guides[key].updatedAt;
}
