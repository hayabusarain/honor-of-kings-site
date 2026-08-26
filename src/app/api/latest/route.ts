import { NextResponse } from 'next/server';
import patchMetas from '@/data/patch_meta.json';
import { digestBody, digestHeading } from '@/lib/latestDigest';

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
 * ポータルのカードは3行前後の本文を想定している。日本語は60〜160字、
 * 英語は120〜260字に収めると、ワイリフ側の一文要約と並べても釣り合う
 */
const JA_LEN = { min: 60, max: 160 };
const EN_LEN = { min: 120, max: 260 };

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
        body: digestBody(latest.prediction_ja ?? '', JA_LEN),
      },
      en: {
        // version_en は「August 13 Update」のような日付だけの文字列なので、
        // 分析文の見出し（… — Meta Analysis）があればそちらを題名にする
        title: digestHeading(latest.prediction_en ?? '', latest.version_en || latest.summary || 'Latest update'),
        body: digestBody(latest.prediction_en ?? '', EN_LEN),
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
