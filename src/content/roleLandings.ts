/**
 * ロール別のヒーロー一覧（/heroes/role/[role]）の文言。
 *
 * ヒーロー一覧のロール絞り込みは ?role= のクエリで動くので、初期HTMLには全体の一覧しか出ない。
 * 「オナーオブキングス タンク 一覧」の受け皿になる固定URLを、ロールごとに持たせる。
 * レーン別は作らない。/tier-list/[lane] がレーン別の一覧を持っていて、中身が重なるため。
 *
 * 要約の数字とヒーロー名は、src/lib/roleLanding.ts がデータ（hok_heroes / hero_stats_camp /
 * skills/ja.json の difficulty / data_freshness）から計算して渡す。ここに数字を直書きしない。
 * 統計を取り直したときに、ここだけ古くなるのを避けるため。
 *
 * ロールの一般的な役割（「タンクは前に出て味方を守る」など）は書かない。
 * 手元のデータで裏の取れない説明になる。書くのは、データから数えた内訳だけ。
 */

export type RoleId = 'Fighter' | 'Tank' | 'Mage' | 'Assassin' | 'Marksman' | 'Support';

export type RoleLanding = {
  /** URL に使う（/heroes/role/tank） */
  slug: string;
  /** hok_heroes.json の role の値。ヒーロー一覧の ?role= にもこの値を渡す */
  id: RoleId;
  /** messages の Role.* のキー。ロール名の日英はここから引く */
  labelKey: 'fighter' | 'tank' | 'mage' | 'assassin' | 'marksman' | 'support';
};

/** 並びはヒーロー一覧のロールのプルダウンと揃える */
export const ROLE_LANDINGS: RoleLanding[] = [
  { slug: 'fighter', id: 'Fighter', labelKey: 'fighter' },
  { slug: 'tank', id: 'Tank', labelKey: 'tank' },
  { slug: 'mage', id: 'Mage', labelKey: 'mage' },
  { slug: 'assassin', id: 'Assassin', labelKey: 'assassin' },
  { slug: 'marksman', id: 'Marksman', labelKey: 'marksman' },
  { slug: 'support', id: 'Support', labelKey: 'support' },
];

/** ページの初出。サイトマップの lastmod の下限に使う（統計の取得日はこれより古い） */
export const ROLE_LANDING_PUBLISHED = '2026-09-26';

export function findRoleLanding(slug: string): RoleLanding | undefined {
  return ROLE_LANDINGS.find((r) => r.slug === slug);
}

/**
 * 要約に差し込む事実。名前とラベルはページの言語に合わせて解決済みのものが入る。
 * 件数が0の項目は配列に入れない（「B評価0体」のような行を作らない）。
 */
export type RoleFacts = {
  roleName: string;
  /** そのロールのヒーロー数（統計の無い新ヒーローを含む） */
  count: number;
  /** 公式統計のある体数 */
  rankedCount: number;
  /** 統計でのレーンの登録。多い順 */
  lanes: { name: string; count: number }[];
  /** S評価のヒーロー名（勝率順） */
  sNames: string[];
  /** A・B・C の件数。この順 */
  otherTiers: { tier: string; count: number }[];
  /** ゲーム内の難易度がイージーのヒーロー名 */
  easyNames: string[];
  /** イージー以外の難易度の件数。ノーマル・ハード・ベリーハードの順 */
  otherDifficulties: { label: string; count: number }[];
  /** 難易度のデータが無いヒーロー名 */
  noDifficultyNames: string[];
  /** 公式統計にまだ載っていないヒーロー名 */
  unrankedNames: string[];
  /** 統計が直近の調整前のままのヒーロー名 */
  prePatchNames: string[];
  /** 「9月23日アップデート」「the September 23 update」 */
  patchName: string;
};

// 1行で書かない。監査の検査14は型を「行頭の }; まで」で読み飛ばすので、
// 1行の型だと、その先の文言ブロックまでまとめて検査から外れる
type Localized<T> = {
  ja: T;
  en: T;
};

/** 英語の列挙。「A, B and C」 */
const listEn = (xs: string[]): string =>
  xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];

const isAre = (n: number): string => (n === 1 ? 'is' : 'are');

/**
 * 冒頭の要約。段落は「体数とレーン」「Tier」「難易度」の3つ。
 * 日本語の語尾は「体。／です。」「体。」「です。／体。／ない。」と交互になるよう組んである。
 * 文を足すときは、続けて同じ語尾にしない。
 * 件数が0の項目は RoleFacts の配列に入ってこないので、空の列挙で文が切れないようにしてある。
 */
export const ROLE_SUMMARY: Localized<(f: RoleFacts) => string[]> = {
  ja: (f) => {
    const out: string[] = [];
    const unranked = f.count - f.rankedCount;
    const intro = unranked > 0
      ? `${f.roleName}は${f.count}体で、うち${f.rankedCount}体に公式統計（HoK Camp）の数字があります。`
      : `${f.roleName}は${f.count}体。`;
    const where = unranked > 0 ? '統計' : '公式統計（HoK Camp）';
    const laneList = f.lanes.map((l) => l.name + l.count + '体').join('、');
    const lanes = f.lanes.length === 0
      ? ''
      : f.lanes.length === 1
        ? `${where}で登録されているレーンは、${f.rankedCount}体とも${f.lanes[0].name}です。`
        : `${where}で登録されているレーンは、${laneList}です。`;
    out.push(intro + lanes);

    if (f.rankedCount > 0) {
      const rest = f.otherTiers.map((t) => t.tier + '評価' + t.count + '体').join('、');
      const sPart = `S評価は${f.sNames.join('・')}の${f.sNames.length}体`;
      out.push(
        f.sNames.length === 0
          ? `S評価はおらず、${rest}。`
          : rest
            ? `${sPart}で、ほかは${rest}。`
            : `${sPart}。`,
      );
    }

    const diffRest = f.otherDifficulties.map((d) => d.label + d.count + '体').join('、');
    // データの無い体は別の文にする。列挙の末尾に括弧で付けると
    // 「ベリーハード3体（フロレンティーノは…）」と、その3体に入っているように読めた
    const noDiff = f.noDifficultyNames.length > 0
      ? `${f.noDifficultyNames.join('・')}は難易度のデータが無く、この内訳には含めていない。`
      : '';
    if (f.easyNames.length > 0) {
      const easy = `ゲーム内の難易度でイージーなのは、${f.easyNames.join('・')}の${f.easyNames.length}体です。`;
      out.push(easy + (diffRest ? `ほかは${diffRest}。` : '') + noDiff);
    } else if (diffRest) {
      out.push(`ゲーム内の難易度は、${diffRest}。${noDiff}`);
    }
    return out;
  },
  en: (f) => {
    const out: string[] = [];
    const unranked = f.count - f.rankedCount;
    const intro = unranked > 0
      ? `There are ${f.count} ${f.roleName} heroes, and ${f.rankedCount} of them have official HoK Camp stats.`
      : `There are ${f.count} ${f.roleName} heroes.`;
    const who = unranked > 0 ? 'Those stats' : 'The official HoK Camp stats';
    const lanes = f.lanes.length === 0
      ? ''
      : f.lanes.length === 1
        ? ` ${who} register all ${f.rankedCount} of them to ${f.lanes[0].name}.`
        : ` ${who} register ${listEn(f.lanes.map((l) => l.count + ' to ' + l.name))}.`;
    out.push(intro + lanes);

    if (f.rankedCount > 0) {
      const rest = listEn(f.otherTiers.map((t) => t.count + ' ' + t.tier));
      const sPart = 'S tier: ' + listEn(f.sNames) + '.';
      out.push(
        f.sNames.length === 0
          ? `None of them is S tier. By tier they split into ${rest}.`
          : rest
            ? `${sPart} The other ${f.rankedCount - f.sNames.length} split into ${rest}.`
            : sPart,
      );
    }

    const diffRest = listEn(f.otherDifficulties.map((d) => d.count + ' ' + d.label));
    const noDiff = f.noDifficultyNames.length > 0
      ? ` ${listEn(f.noDifficultyNames)} ${f.noDifficultyNames.length === 1 ? 'has' : 'have'} no difficulty rating in this site's data.`
      : '';
    if (f.easyNames.length > 0) {
      const easy = `By in-game difficulty, ${f.easyNames.length} ${isAre(f.easyNames.length)} rated Easy: ${listEn(f.easyNames)}.`;
      out.push(diffRest ? `${easy} The rest are ${diffRest}.${noDiff}` : easy + noDiff);
    } else if (diffRest) {
      out.push(`By in-game difficulty, they are ${diffRest}.${noDiff}`);
    }
    return out;
  },
};

/** 要約の下に出す、統計の欠けと調整前の断り。該当が無ければ空配列 */
export const ROLE_STATS_CAVEATS: Localized<(f: RoleFacts) => string[]> = {
  ja: (f) => [
    ...(f.unrankedNames.length > 0
      ? [`${f.unrankedNames.join('・')}は公式統計にまだ載っていないため、Tierと勝率がありません。`]
      : []),
    ...(f.prePatchNames.length > 0
      ? [`${f.prePatchNames.join('・')}の統計は、${f.patchName}の調整前のものです。`]
      : []),
  ],
  en: (f) => [
    ...(f.unrankedNames.length > 0
      ? [`${listEn(f.unrankedNames)} ${isAre(f.unrankedNames.length)} not in the HoK Camp stats yet, so there is no tier or win rate to show.`]
      : []),
    ...(f.prePatchNames.length > 0
      ? [`Stats for ${listEn(f.prePatchNames)} predate ${f.patchName}.`]
      : []),
  ],
};

/** ページの title と description。数字は page.tsx が差し込む */
export const ROLE_META: Localized<(roleName: string, count: number) => { title: string; description: string }> = {
  ja: (roleName, count) => ({
    // layout の title.template が屋号を付けるので、ここでは接尾辞を付けない。
    // OGP 画像の見出しは最初の「・」までになる（ogHeading）
    title: `【オナーオブキングス】${roleName}のヒーロー一覧（${count}体）・Tierと勝率`,
    description: `オナーオブキングス（HoK）の${roleName}${count}体を、公式「HoK Camp」のTier順に勝率つきで並べた一覧。統計で登録されているレーンと、ゲーム内の難易度の内訳も載せています。`,
  }),
  en: (roleName, count) => ({
    title: `Honor of Kings ${roleName} Heroes (${count}): Tiers and Win Rates`,
    description: `The ${count} ${roleName} heroes in Honor of Kings (HoK), ordered by official HoK Camp tier with win rates, plus how they split across lanes and in-game difficulty.`,
  }),
};

/** 画面の見出しと導線の文言 */
export const ROLE_UI = {
  heading: {
    ja: (roleName: string, count: number) => `${roleName}のヒーロー一覧（${count}体）`,
    en: (roleName: string, count: number) => `${roleName} Heroes (${count})`,
  },
  summaryHeading: {
    ja: (roleName: string) => `${roleName}の内訳`,
    en: (roleName: string) => `${roleName} heroes at a glance`,
  },
  gridHeading: {
    ja: (roleName: string) => `${roleName}のヒーロー`,
    en: (roleName: string) => `${roleName} heroes`,
  },
  gridOrder: {
    ja: 'Tierの高い順に並べ、同じTierの中は勝率の高い順。名前の下の数字が勝率です。',
    en: 'Sorted by tier, then by win rate within each tier. The figure under each name is the win rate.',
  },
  winRate: { ja: '勝率', en: 'Win rate' },
  noStats: { ja: '統計なし', en: 'No stats' },
  prePatch: { ja: '調整前', en: 'Pre-patch' },
  /**
   * カードのリンクの読み上げ用。顔に重ねた Tier と「調整前」の帯は読み上げから外し、名前のあとでこれを読む。
   * 読むものが無ければ空文字
   */
  cardSr: {
    ja: (tier: string | null, prePatch: boolean) =>
      [tier ? `Tier ${tier}` : '', prePatch ? '調整前の統計' : ''].filter(Boolean).join('、'),
    en: (tier: string | null, prePatch: boolean) =>
      [tier ? `Tier ${tier}` : '', prePatch ? 'pre-patch stats' : ''].filter(Boolean).join(', '),
  },
  moreHeading: { ja: 'さらに絞り込む', en: 'Narrow it down' },
  toList: {
    ja: (roleName: string) => `ヒーロー一覧で${roleName}を絞り込む`,
    en: (roleName: string) => `Filter ${roleName} heroes in the full list`,
  },
  // 見出しとリンクがどちらも「絞り込む」なので、ここでは言い換える
  toListDesc: {
    ja: 'レーン・難易度・戦い方タイプを組み合わせて選べるほか、名前順・Tier順・勝率順にも並べ替えられます。',
    en: 'Combine lane, difficulty and play type, and sort by name, tier or win rate.',
  },
  lanesHeading: {
    ja: (roleName: string) => `${roleName}が登録されているレーンのTier表`,
    en: (roleName: string) => `Tier lists for the lanes ${roleName} heroes are registered to`,
  },
  otherRolesHeading: { ja: 'ほかのロール', en: 'Other roles' },
  count: {
    ja: (n: number) => `${n}体`,
    en: (n: number) => (n === 1 ? '1 hero' : `${n} heroes`),
  },
} as const;
