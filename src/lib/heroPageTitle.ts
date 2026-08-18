/**
 * ヒーロー詳細ページの表題まわりの文言。
 *
 * 以前は <title>（generateMetadata）、Article JSON-LD の headline / description、
 * 共有ボタンの title の3か所で同じ文字列を手書きしており、片方だけ直して
 * ずれる事故が起きやすかった。ここに純関数として1本化する。
 *
 * 注意: ビルド（推奨装備）セクションは現在非表示のため、文言で「ビルド」を
 * 約束しない（看板と実態の不一致は SEO・AdSense 双方に不利）。
 * 日本語タイトルに「コンボ」「カウンター対策」を入れているのは、全ヒーローに
 * 理由つきの「苦手な相手」とおすすめコンボ欄を載せているのに、その検索を
 * 取りに行けていなかったため。
 */
export type HeroPageText = {
  /** <title> と共有ボタンに使う。日本語は先頭に【オナーオブキングス】が付く */
  title: string;
  /** meta description と Article JSON-LD の description で共通 */
  description: string;
  /** Article JSON-LD の headline。先頭の【】は付けず、末尾にサイト名を添える */
  headline: string;
};

export function getHeroPageText(locale: string, heroName: string): HeroPageText {
  if (locale === 'ja') {
    return {
      title: `【オナーオブキングス】${heroName}の評価・コンボ・カウンター対策・立ち回り解説`,
      description: `オナーオブキングス（HoK）の${heroName}の最新Tier評価、スキル・コンボ解説、カウンター、立ち回りを徹底解説！`,
      headline: `${heroName}の評価・コンボ・カウンター対策・立ち回り解説 - Honor of Kings`,
    };
  }
  return {
    title: `${heroName} Guide: Combos, Counters & Strategy - Honor of Kings (HoK)`,
    description: `Complete ${heroName} guide for Honor of Kings (HoK): latest tier rating, skill breakdown, combos, counters, and strategy tips.`,
    headline: `${heroName} Guide: Combos, Counters & Strategy - Honor of Kings`,
  };
}
