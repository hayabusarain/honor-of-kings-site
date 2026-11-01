/**
 * Tier の基準。公式「HoK Camp」の Tier の付け方（当サイトの推定）と、当サイトが付ける Tier の計算。
 *
 * 公式の Tier（S〜C）は勝率の順ではない。2026-11-02 に 10/16 版（119体）と 10/30 版（120体）で確かめたところ、
 * 全ヒーローを「出現率 + BAN率 × 0.5」の大きい順に並べ、上から累積 10% / 30% / 60% の位置（体数の小数は切り捨て）で
 * S / A / B / C に切ると、2版とも全員の Tier が公式と一致した（120体は 12/24/36/48、119体は 11/24/36/48）。
 * レーンごとではなく全ヒーローまとめての順位。BAN率の重みが全員一致する範囲は 10/30 版で 0.49〜0.52、10/16 版で 0.44〜0.55。
 * 確かめられたのは「勝率を使わずに全員を再現できる」ことまで。勝率を重み0.002で足しても2版とも一致したまま
 * （0.01 で 10/30 版2体・10/16 版4体がずれる）なので、勝率をまったく使っていないとまでは言えない。
 * 公式の説明は当サイトでは見つけていない（HoK Camp の画面や公式サイトを網羅的に調べたわけではない）。だから掲載文では「推定」と書き、
 * 「公表していない」とは書かない（確かめていない不在を言い切らない）。
 * 統計を取り直すたびに npm run audit の検査33がこの規則で今の Tier が再現できるかを確かめ、崩れたら落ちる（説明文を直す合図）。
 *
 * 当サイトの Tier（OP〜D）は、公式の基準に勝率を加えたもの（2026-11-02、運営者の判断）。
 * 1. 公式の基準（出現率 + BAN率 × 0.5）の順位と、勝率の順位を取る
 * 2. 点数 = 2つの順位の平均。小さいほど上位
 * 3. 点数の小さい順に並べ、上から累積の割合で OP / S / A / B / C / D に切る（THRESHOLDS）
 * 段の数としきい値は MLBB（Mobare Hub）の tierRule.ts と同じ。MLBB は勝率と BAN率の順位を 7:3 で合わせているが、
 * HoK には公式の Tier があるので、それと別の見方として「よく使われているか」と「勝てているか」を半々にした。
 * 勝率だけを強く見ると、ほとんど使われない高勝率のヒーロー（得意な人だけが使っている体）が最上位に並ぶ。
 *
 * このファイルは JSON を読まない。クライアント部品から型や関数を import しても統計はバンドルに載らない。
 */

export type OfficialTier = 'S' | 'A' | 'B' | 'C';
export type SiteTier = 'OP' | 'S' | 'A' | 'B' | 'C' | 'D';

export const OFFICIAL_TIER_ORDER: OfficialTier[] = ['S', 'A', 'B', 'C'];
export const SITE_TIER_ORDER: SiteTier[] = ['OP', 'S', 'A', 'B', 'C', 'D'];

/** 公式の基準での BAN率の重み（出現率 + BAN率 × この値） */
export const OFFICIAL_BAN_WEIGHT = 0.5;

/** 公式の Tier の割合（上から S / A / B / C）。体数は累積の割合 × 全体の数を切り捨てた位置で切る（検査33が確かめる） */
export const OFFICIAL_SHARES: [OfficialTier, number][] = [
  ['S', 0.1],
  ['A', 0.2],
  ['B', 0.3],
  ['C', 0.4],
];

/** 当サイトの Tier の、上からの累積割合。MLBB の tierRule.ts と同じ */
export const THRESHOLDS: [SiteTier, number][] = [
  ['OP', 0.05],
  ['S', 0.2],
  ['A', 0.45],
  ['B', 0.7],
  ['C', 0.9],
  ['D', 1.0],
];

/** 点数で、公式の基準の順位と勝率の順位をどれだけずつ見るか */
export const POPULARITY_WEIGHT = 0.5;
export const WIN_WEIGHT = 0.5;

export type TierStatInput = { id: string; win: number; pick: number; ban: number };

/** 公式の基準の値（出現率 + BAN率 × 0.5）。大きいほど上 */
export function officialScore(e: { pick: number; ban: number }): number {
  return e.pick + OFFICIAL_BAN_WEIGHT * e.ban;
}

/**
 * 集合に当サイトの Tier を付ける。返り値は id → Tier。
 * 同値は勝率 → 出現率の順で決める（並びが毎回同じになるように）。
 */
export function computeSiteTiers(entries: TierStatInput[]): Map<string, SiteTier> {
  const n = entries.length;
  const out = new Map<string, SiteTier>();
  if (n === 0) return out;

  const tieBreak = (a: TierStatInput, b: TierStatInput) => b.win - a.win || b.pick - a.pick || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const rankBy = (key: (e: TierStatInput) => number) => {
    const order = [...entries].sort((a, b) => key(b) - key(a) || tieBreak(a, b));
    const m = new Map<string, number>();
    order.forEach((e, i) => m.set(e.id, i + 1));
    return m;
  };
  const popularityRank = rankBy(officialScore);
  const winRank = rankBy((e) => e.win);

  const scored = entries
    .map((e) => ({
      e,
      score: POPULARITY_WEIGHT * (popularityRank.get(e.id) ?? n) + WIN_WEIGHT * (winRank.get(e.id) ?? n),
    }))
    .sort((a, b) => a.score - b.score || tieBreak(a.e, b.e));

  scored.forEach(({ e }, i) => {
    const ratio = (i + 1) / n;
    out.set(e.id, THRESHOLDS.find(([, limit]) => ratio <= limit)?.[0] ?? 'D');
  });
  return out;
}

/**
 * 統計の JSON（hero_stats_camp.json の形）から当サイトの Tier を付ける。
 * 今回と前回の統計の両方に使う（前回比の札のため）
 */
export function siteTiersFromCampStats(
  stats: Record<string, { win_rate: number; pick_rate: number; ban_rate: number }>,
): Map<string, SiteTier> {
  return computeSiteTiers(
    Object.entries(stats).map(([id, s]) => ({ id, win: s.win_rate, pick: s.pick_rate, ban: s.ban_rate })),
  );
}

/** 勝率込みの Tier の計算方法（Tier表の下の「Tierの付け方」で使う）。数値は上の定数から作る */
export function siteTierRuleText(locale: string): string {
  const shares = THRESHOLDS.map(([tier, limit], i) => {
    const from = i === 0 ? 0 : THRESHOLDS[i - 1][1];
    return `${tier} ${Math.round((limit - from) * 100)}%`;
  });
  if (locale === 'ja') {
    return `「勝率込み」のTierは当サイトが付けたもので、公式のTierではありません。公式と同じ「出現率＋BAN率×0.5」の順位と、勝率の順位を平均した点数で全ヒーローを並べる。上から ${shares.join('・')} に分けています。点数が同じときは勝率の高い方が上。勝率だけで並べると、使う人の少ない高勝率のヒーローが上に集まるため、使われ方と半々にした。`;
  }
  return `The "With win rate" tiers are this site's own, not the official ones. Each hero's rank on the official criterion (pick rate + 0.5 × ban rate) and its rank on win rate are averaged, and heroes are split by that score into ${shares.join(', ')} from the top. Ties go to the higher win rate. Ranking by win rate alone would push rarely played heroes with high win rates to the top, so how often a hero is used counts for half.`;
}

/**
 * 公式の Tier の付け方（当サイトの推定）。statsDate と count は検査33がその日の統計で確かめている日付と体数。
 * 掲載文では「推定」と書く。公式の説明は見つけていない（冒頭のコメント）
 */
export function officialTierRuleText(locale: string, statsDate: string, count: number): string {
  if (locale === 'ja') {
    return `公式「HoK Camp」のTierは、勝率の順ではありません。全ヒーローを「出現率＋BAN率×0.5」の値が大きい順に並べる。上から約1割がS、次の2割がA、次の3割がB、残りがC。${statsDate}取得の統計では、この切り方で全${count}体が公式のTierと一致しました。公式の説明は当サイトでは見つけておらず、この並べ方は推定です。順位はレーンごとではなく全体で付くので、レーンによってSの数は違う。`;
  }
  return `The official HoK Camp tiers are not ordered by win rate. Ranking every hero by pick rate + 0.5 × ban rate and cutting the list at roughly the top tenth (S), the next fifth (A) and the next three tenths (B), with the rest in C, reproduces the official tier of all ${count} heroes in the stats taken on ${statsDate}. This site has not found an official explanation, so this rule is an inference. Heroes are ranked all together rather than lane by lane, so the number of S-tier heroes differs by lane.`;
}
