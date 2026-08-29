import { NextResponse } from 'next/server';
import patchMetas from '@/data/patch_meta.json';
import dataFreshness from '@/data/data_freshness.json';
import hokHeroes from '@/data/hok_heroes.json';
import hokItems from '@/data/hok_items.json';
import hokSpells from '@/data/hok_spells.json';
import hokArcanas from '@/data/hok_arcanas.json';
import { getLatestPatchChanges } from '@/lib/patchBadges';
import { digestBody, digestHeading } from '@/lib/latestDigest';

/**
 * ポータル（hub-game.com）が「このサイトの最新情報」を取りに来るための公開エンドポイント。
 *
 * ポータル側にこのサイトのデータ構造を知らせずに済むよう、
 * 整形済みの JSON だけを返す。将来データ源を Supabase 等へ移しても、
 * 返す形さえ保てばポータルは影響を受けない。
 *
 * キーは2階建てになっている。
 * - site / path / version / date / ja / en … ポータルの「今週の注目」カードが使う。既存の形を変えない
 * - snapshot … ポータルのトップに出す「2タイトルの現在地」表が使う。数と日付だけを返す
 * snapshot 側の数はここで直書きせず、掲載データ（hok_heroes.json など）と
 * data_freshness.json から毎回数え直す。データを足したら表の数字も自動で追従する。
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

/**
 * 「8月27日アップデートのお知らせ」→「8月27日アップデート」。
 * patch_meta.json の version は公式の告知タイトルをそのまま入れてあるため、
 * 表の1セルに置く版名としては末尾が余る。受け取ったポータルに日本語の語尾を
 * 削らせるのは筋が悪いので、整えてから渡す。
 */
function toPatchLabelJa(version: string): string {
  return version.replace(/のお知らせ$/, '');
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

  // 直近パッチで調整されたヒーロー数。Tier表のバッジと同じ導出を使い、
  // 画面に出ている「調整」バッジの数とポータルの表を一致させる。
  // getLatestPatchChanges() も patch_meta.json から最新を選ぶが、
  // 選び方が将来ずれたときに件数だけ別パッチのものになるのを防ぐため版名で照合する。
  const patchChanges = getLatestPatchChanges();
  const changedHeroes =
    patchChanges.version === latest.version ? Object.keys(patchChanges.changes).length : null;

  const camp = dataFreshness.campStats;

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
      // ここから下は追加ぶん。既存キーには手を入れていないので、
      // snapshot を読まない側（今の「今週の注目」カード）の表示は変わらない。
      snapshot: {
        patch: {
          label: latest.version_en ?? latest.version ?? null,
          labelJa: latest.version ? toPatchLabelJa(latest.version) : null,
          date: latest.created_at ? latest.created_at.slice(0, 10) : null,
          changedHeroes,
        },
        catalog: {
          heroes: hokHeroes.length,
          items: hokItems.length,
          spells: hokSpells.length,
          arcana: hokArcanas.length,
        },
        // 勝率・出現率・BAN率の取得日と出所。表に「いつ時点か」を出すために要る
        stats: {
          updatedAt: camp.updatedAt,
          sourceJa: camp.sourceJa,
          sourceEn: camp.sourceEn,
          sourceUrl: camp.sourceUrl,
        },
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
