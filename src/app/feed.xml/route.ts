import patchMetas from '@/data/patch_meta.json';

/**
 * パッチノート更新の Atom 1.0 フィード。
 *
 * フィードリーダー（RSSリーダー）への登録と、更新の自動検知（autodiscovery）用。
 * データ源は /patches ページと同じ patch_meta.json で、整形済みの要約だけを流す。
 * 本文の詳細はページ側で読んでもらう方針のため、entry の link は一覧ページに固定する。
 * フィードは日本語のみ（元データの version・summary・details が日本語のため）。
 */

export const revalidate = 1800;

const ORIGIN = 'https://hok.hub-game.com';
const FEED_URL = `${ORIGIN}/feed.xml`;
const PAGE_URL = `${ORIGIN}/ja/patches`;

type PatchMeta = {
  id?: string;
  version?: string;
  version_en?: string;
  summary?: string;
  details?: string[];
  created_at?: string;
};

/** XML のテキストノード・属性値に使えない文字をエスケープする */
function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * エントリ要約: summary と details を「。」でつないで1段落にする。
 * details の各行は句点なしの体言・用言止めなので、末尾の重複だけ防いで連結する
 * （/api/latest の firstSentence と違い、こちらは全文を流してよい）。
 * summary が version と同文のエントリ（「5月28日アップデートのお知らせ」等）では
 * タイトルの繰り返しになるだけなので、summary は version と違うときだけ先頭に入れる。
 */
function digest(meta: PatchMeta): string {
  const summary = meta.summary?.trim() ?? '';
  const leadsWithSummary = summary !== '' && summary !== (meta.version ?? '').trim();
  const parts = [leadsWithSummary ? summary : undefined, ...(meta.details ?? [])]
    .filter((s): s is string => Boolean(s))
    .map((s) => s.trim().replace(/\s+/g, ' ').replace(/。$/, ''));
  return parts.length > 0 ? `${parts.join('。')}。` : '';
}

export async function GET() {
  const rows = (patchMetas as PatchMeta[])
    .filter((r) => r.created_at)
    .sort((a, b) => Date.parse(b.created_at as string) - Date.parse(a.created_at as string));

  // フィード全体の updated は最新エントリの日時。エントリが無い場合だけデータ日付の起点を返す
  const feedUpdated = rows[0]?.created_at ?? '2026-06-14T00:00:00.000Z';

  const entries = rows
    .map((meta) => {
      // Atom の id は「恒久的に変わらない一意な IRI」が必須。
      // 全エントリの link が一覧ページで同一のため、id はフラグメントで区別する
      const entryId = `${PAGE_URL}#${encodeURIComponent(meta.id ?? (meta.created_at as string))}`;
      return `  <entry>
    <title>${esc(meta.version ?? meta.version_en ?? 'アップデート情報')}</title>
    <id>${esc(entryId)}</id>
    <link rel="alternate" type="text/html" href="${PAGE_URL}"/>
    <updated>${esc(meta.created_at as string)}</updated>
    <summary>${esc(digest(meta))}</summary>
  </entry>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">
  <title>Honor of Kings Hub パッチノート</title>
  <subtitle>オナーオブキングス（HoK）のアップデート内容の要約</subtitle>
  <id>${FEED_URL}</id>
  <link rel="self" type="application/atom+xml" href="${FEED_URL}"/>
  <link rel="alternate" type="text/html" href="${PAGE_URL}"/>
  <updated>${esc(feedUpdated)}</updated>
  <author>
    <name>Honor of Kings Hub</name>
  </author>
${entries}
</feed>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  });
}
