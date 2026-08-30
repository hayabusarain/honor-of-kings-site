/**
 * ヒーロー詳細ページの表題まわりの文言。
 *
 * 以前は <title>（generateMetadata）、Article JSON-LD の headline / description、
 * 共有ボタンの title の3か所で同じ文字列を手書きしており、片方だけ直して
 * ずれる事故が起きやすかった。ここに純関数として1本化する。
 *
 * 「おすすめ装備」は、ビルドを載せているヒーローにだけ入れる。2026-08-30 の
 * 撮り直しで116体すべてが揃ったが、撮れていないヒーローが出たときに看板と中身が
 * 食い違わないよう、出し分けはそのまま残す（その不一致は SEO・AdSense 双方に不利）。
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

export function getHeroPageText(locale: string, heroName: string, hasItemBuilds = false): HeroPageText {
  if (locale === 'ja') {
    const topic = hasItemBuilds
      ? '評価・おすすめ装備・コンボ・カウンター対策・立ち回り'
      : '評価・コンボ・カウンター対策・立ち回り解説';
    return {
      title: `【オナーオブキングス】${heroName}の${topic}`,
      description: hasItemBuilds
        ? `オナーオブキングス（HoK）の${heroName}の最新Tier評価、おすすめビルド（装備とアルカナ）、スキル・コンボ解説、カウンター、立ち回りを徹底解説！`
        : `オナーオブキングス（HoK）の${heroName}の最新Tier評価、スキル・コンボ解説、カウンター、立ち回りを徹底解説！`,
      headline: `${heroName}の${topic} - Honor of Kings`,
    };
  }
  const topic = hasItemBuilds
    ? 'Build Guide: Items, Combos & Counters'
    : 'Guide: Combos, Counters & Strategy';
  return {
    title: `${heroName} ${topic} - Honor of Kings (HoK)`,
    description: hasItemBuilds
      ? `Complete ${heroName} guide for Honor of Kings (HoK): recommended builds with items and arcana, latest tier rating, skill breakdown, combos and counters.`
      : `Complete ${heroName} guide for Honor of Kings (HoK): latest tier rating, skill breakdown, combos, counters, and strategy tips.`,
    headline: `${heroName} ${topic} - Honor of Kings`,
  };
}
