import { NextResponse } from 'next/server';
import patchMetas from '@/data/patch_meta.json';

/**
 * ポータル（hub-game.com）が「このサイトの最新情報」を取りに来るための公開エンドポイント。
 *
 * ポータル側にこのサイトのデータ構造を知らせずに済むよう、
 * 整形済みの JSON だけを返す。将来データ源を Supabase 等へ移しても、
 * 返す形さえ保てばポータルは影響を受けない。
 */

export const revalidate = 1800;

type PatchMeta = {
  version?: string;
  version_en?: string;
  summary?: string;
  prediction_ja?: string;
  prediction_en?: string;
  created_at?: string;
};

/**
 * 予測文からダイジェスト用の一文を取り出す。
 * 先頭の見出し行（【...】や[...]）を落とし、Markdown の強調記号を除いてから
 * 最初の一文だけを返す（記号がそのまま画面に出るのを防ぐ）。
 */
function firstSentence(text: string, max = 160): string {
  const body = text
    .replace(/^\s*[【[][^】\]]*[】\]]\s*/, '')
    .replace(/\*\*/g, '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!body) return '';
  // 日本語は「。」の直後に空白を置かないので単独で文末とみなす。
  // 英語のピリオドは "7.2c" のような数字で切れないよう、後ろに空白か終端を要求する。
  const idx = body.search(/。|[.](\s|$)/);
  const sentence = idx >= 0 ? body.slice(0, idx + 1) : body;
  return sentence.length > max ? `${sentence.slice(0, max - 1)}…` : sentence;
}

export async function GET() {
  const rows = patchMetas as PatchMeta[];

  // version が日付文字列なので、比較には created_at を使う
  const latest = rows
    .filter((r) => r.created_at)
    .reduce<PatchMeta | null>(
      (best, cur) =>
        !best || Date.parse(cur.created_at as string) > Date.parse(best.created_at as string) ? cur : best,
      null
    );

  if (!latest) {
    return NextResponse.json({ error: 'no patch data' }, { status: 503 });
  }

  return NextResponse.json(
    {
      site: 'hok',
      path: '/patches',
      version: latest.version_en ?? latest.version ?? null,
      date: latest.created_at ?? null,
      ja: {
        title: latest.summary || latest.version || 'アップデート情報',
        body: firstSentence(latest.prediction_ja ?? ''),
      },
      en: {
        title: latest.version_en || latest.summary || 'Latest update',
        body: firstSentence(latest.prediction_en ?? ''),
      },
    },
    {
      headers: {
        // ポータルは別オリジンから取得するため許可しておく
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    }
  );
}
