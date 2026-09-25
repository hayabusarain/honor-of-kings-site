import campStatsRaw from '@/data/hero_stats_camp.json';
import campStatsPrevRaw from '@/data/hero_stats_camp_prev.json';
import dataFreshness from '@/data/data_freshness.json';
import { LANE_TIER_PAGES } from '@/content/laneTierPages';

/**
 * 前回の統計（hero_stats_camp_prev.json、取得日は campStats.prevUpdatedAt）との差を、
 * ヒーロー1体ずつ組み立てる。Tier表（詳細の枠と顔の札）とヒーロー詳細（統計の節）が使う。
 *
 * このファイルは src/data の JSON を読む。クライアント部品からは型だけを import すること
 * （値を1つでも import すると、前回と今回の統計がまるごとクライアントのバンドルに載る）。
 *
 * 差を出さない体と、その扱い:
 *  - 今回の統計に無い体（campStats.unrankedHeroIds）… null。統計の節も格子のマスも出ない
 *  - 調整前の注記がある体（campStats.patchBasisHeroIds）… 今回の統計がパッチ前の値なので、
 *    差を出すとパッチの効果のように読める。統計を取り直して ID が空になれば、自動で差が出る
 *  - 前回の統計に無い体 … 比べる相手が無い
 *  - 前回と今回でレーンが違う体 … Tier はレーンの中での段なので、比べると別の表の段を並べることになる
 */

type CampRow = { tier: string; lane?: string; win_rate: number; pick_rate: number; ban_rate: number };

const CUR = campStatsRaw as Record<string, CampRow>;
const PREV = campStatsPrevRaw as Record<string, CampRow>;
// 統計を取り直すと空配列になり、推論が never[] に変わるので string[] として扱う
const PATCH_BASIS = new Set(dataFreshness.campStats.patchBasisHeroIds as string[]);
const UNRANKED = new Set(dataFreshness.campStats.unrankedHeroIds as string[]);

export type StatsDiffEntry =
  | {
      kind: 'diff';
      /** 前回の Tier。今回と同じなら段は動いていない */
      prevTier: string;
      /**
       * 勝率の前回との差。pt・小数1桁・符号付きの表示用文字列（例 "+0.8pt" "−0.1pt" "±0.0pt"）。
       * 出現率・BAN率の差は持たない。値が1%前後しかなく、小数1桁に丸めると
       * 2026-09-11 と 09-04 の比較で108体中、出現率84体・BAN率99体が ±0.0pt になった
       */
      winRate: string;
    }
  | {
      kind: 'skip';
      reason: 'patchBasis' | 'noPrev' | 'laneChanged';
      /** 比べていない理由。ロケールで解決済み */
      note: string;
    };

/**
 * 2つの百分率の差を pt で表す。小数1桁、符号付き。
 * 元の値は小数2桁なので、0.01pt 単位の整数にしてから引く（浮動小数のまま引くと
 * 0.05 が 0.0499… になって丸めがずれる）。四捨五入は絶対値で行う
 * （Math.round は負の .5 を 0 の側へ寄せるので、+0.05 と −0.05 で結果が割れる）
 */
export function formatPtDiff(cur: number, prev: number): string {
  const hundredths = Math.round(cur * 100) - Math.round(prev * 100);
  const tenths = Math.sign(hundredths) * Math.round(Math.abs(hundredths) / 10);
  if (tenths === 0) return '±0.0pt';
  // 負号は U+2212。ハイフンより幅があり、小さい文字でも + と対になって読める
  return `${tenths > 0 ? '+' : '−'}${(Math.abs(tenths) / 10).toFixed(1)}pt`;
}

const laneName = (lane: string, ja: boolean) => {
  const page = LANE_TIER_PAGES.find((l) => l.id === lane);
  return page ? (ja ? page.name.ja : page.name.en) : lane;
};

/** heroId は数値ID（hero_stats_camp.json のキー） */
export function getStatsDiff(heroId: string, locale: string): StatsDiffEntry | null {
  const cur = CUR[heroId];
  if (!cur || UNRANKED.has(heroId)) return null;
  const ja = locale === 'ja';
  // 理由の文は狭い枠で折り返す。360px 幅では「2026-」と「09-04」の間で改行されていたので、
  // ハイフンの後ろに WORD JOINER（U+2060、幅0で表示されない）を挟んで日付の途中で切らせない
  const date = dataFreshness.campStats.prevUpdatedAt.replace(/-/g, '-\u2060');

  if (PATCH_BASIS.has(heroId)) {
    const patch = ja ? dataFreshness.campStats.patchBasisPatchJa : dataFreshness.campStats.patchBasisPatchEn;
    return {
      kind: 'skip',
      reason: 'patchBasis',
      // 「統計が調整前なので」だと主語と述語がねじれる。ヒーロー詳細の注記
      // （このヒーローは〜の調整対象です。上の数値は調整前のものです。）と言い方を揃える
      note: ja
        ? `${patch}の調整対象です。統計が調整前のものなので、前回比は出していません。`
        : `Adjusted in ${patch}. These stats predate it, so they are not compared with the previous stats.`,
    };
  }

  const prev = PREV[heroId];
  if (!prev) {
    return {
      kind: 'skip',
      reason: 'noPrev',
      note: ja ? `前回（${date}）の統計には載っていません。` : `Not in the previous stats (${date}).`,
    };
  }

  if ((prev.lane ?? '') !== (cur.lane ?? '')) {
    const name = laneName(prev.lane ?? '', ja);
    return {
      kind: 'skip',
      reason: 'laneChanged',
      note: ja
        ? `前回（${date}）は${name}の統計でした。レーンが変わったため比べていません。`
        : `On ${date} this hero was listed under ${name}. Its lane has changed, so the figures are not compared.`,
    };
  }

  return {
    kind: 'diff',
    prevTier: prev.tier,
    winRate: formatPtDiff(cur.win_rate, prev.win_rate),
  };
}
