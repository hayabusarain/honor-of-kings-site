/**
 * よくある質問（初心者向け）。
 *
 * 全文は話題のページの末尾に出す。/faq は索引で、質問・答えの1文目・置き場へのリンクだけを並べる。
 * どのページにも収まらない問いだけ page を '/faq' にして、/faq に全文を置く。
 * 「短い答え」の欄は作らない。索引は答えの1文目を firstSentence で切り出す。
 *
 * 書き方の決まり。scripts/audit.mjs の検査23が止める。
 * - 数値は直書きしない。{slotName} と書き、ページ側がデータから読んで差し込む。
 *   統計の日付や体数も同じ。直書きしてよいのは根拠ファイルにそのまま書いてある値だけ
 * - 「最多」「唯一」のように、数値を評価する言い回しは書かない
 * - 答えに確認日を書かない。ページに出す日付は最終更新日だけ
 * - 1文目は索引に単独で出る。日本語50字以内で、「これは」「それは」から始めない
 * - Tier・勝率・出現率・BAN率・今のパッチに紐づく問いは載せない（category 'site' の問いは、
 *   サイトがそれらの数字をどう扱っているかを答えるので Tier などの語を使ってよい）
 * - データの集め方は書かない。出どころは「ゲーム内の表示から」までに留める
 *
 * 構造化データ（FAQPage）は全文を持つページだけに付ける。/faq には付けない。
 */

/** 並びは /faq の索引に出す順。初心者が先に知りたい話を上に置き、サイトについての話は最後 */
export const FAQ_CATEGORIES = ['basics', 'heroes', 'lanes', 'objectives', 'spells', 'items', 'arcana', 'site'] as const;

/** 本文の {slotName} に差し込める名前。実装はページ側に置き、ここに無い名前は検査23が止める */
export const FAQ_SLOT_NAMES = [
  'statsDate',
  'heroCount',
  'difficultyLevelCount',
  'easyHeroCount',
  'normalHeroCount',
  'hardHeroCount',
  'veryHardHeroCount',
  'unratedDifficultyCount',
  'roleCount',
  'multiRoleHeroCount',
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];
export type FaqSlotName = (typeof FAQ_SLOT_NAMES)[number];
export type FaqText = { q: string; a: string };
export type FaqEntry = {
  /** 英小文字とハイフン。ページ内のアンカー #faq-{id} に使う */
  id: string;
  /** 全文を置くページ。ロケールを除いたパス（例 '/guide/bosses'）。どこにも収まらない問いは '/faq' */
  page: string;
  category: FaqCategory;
  /** 答えの裏付けになるファイル。リポジトリ直下からのパス */
  sources: string[];
  ja: FaqText;
  en: FaqText;
};

export const FAQ_CATEGORY_LABELS: Record<FaqCategory, { ja: string; en: string }> = {
  basics: { ja: 'はじめに', en: 'Getting started' },
  heroes: { ja: 'ヒーロー', en: 'Heroes' },
  lanes: { ja: 'レーン', en: 'Lanes' },
  objectives: { ja: 'ボス', en: 'Bosses' },
  spells: { ja: 'サモナースペル', en: 'Summoner spells' },
  items: { ja: '装備', en: 'Items' },
  arcana: { ja: 'アルカナ', en: 'Arcana' },
  site: { ja: 'このサイトについて', en: 'About this site' },
};

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'tier-who-decides',
    page: '/tier-list',
    category: 'site',
    sources: ['scripts/sync_camp_tier.js', 'src/app/[locale]/about/page.tsx', 'src/components/tier-list/TierListClient.tsx'],
    ja: {
      q: 'Tierはこのサイトが決めているのですか？',
      a: '当サイトの判定ではなく、公式の「HoK Camp」が付けた評価をそのまま載せています。同じTierの中の並び順は当サイトが付けたもので、勝率・出現率・BAN率のうち選択中の数値が高い順。',
    },
    en: {
      q: 'Does this site decide the tiers itself?',
      a: 'No, the tiers are the official HoK Camp\'s own ratings, shown as given; this site does not assign them. Only the order within a tier is set by this site: highest first by whichever of win rate, pick rate or ban rate is selected.',
    },
  },
  {
    id: 'tier-vs-win-rate',
    page: '/tier-list',
    category: 'site',
    sources: ['src/data/hero_stats_camp.json', 'scripts/sync_camp_tier.js', 'src/app/[locale]/about/page.tsx'],
    ja: {
      q: '勝率が高いのにTierが低いヒーローがいるのはなぜですか？',
      a: 'Tierは公式の「HoK Camp」が付ける評価で、勝率が高いほど上になるわけではありません。HoK CampがTierを付ける基準は、当サイトでは未確認。ヒーローを選ぶときはTierだけで決めず、勝率もあわせて見てください。',
    },
    en: {
      q: 'Why do some heroes have a high win rate but a low tier?',
      a: 'Tiers are ratings set by the official HoK Camp, and a higher win rate does not mean a higher tier. This site has not confirmed what HoK Camp bases the ratings on. When choosing a hero, look at the win rate as well instead of going by the tier alone.',
    },
  },
  {
    id: 'stats-date',
    page: '/tier-list',
    category: 'site',
    sources: ['src/data/data_freshness.json', 'scripts/sync_camp_tier.js', 'src/components/common/StatsFreshnessNote.tsx'],
    ja: {
      q: 'Tier表の勝率や出現率は、いつ時点の数字ですか？',
      a: '{statsDate}時点の、公式「HoK Camp」の統計です。ゲーム内で見る最新の数字とは、ずれることがある。統計の日付より後のパッチで調整されたヒーローは、数字もTierも調整前のまま。',
    },
    en: {
      q: 'What date are the tier list\'s win rates and pick rates from?',
      a: 'The tier list uses official HoK Camp stats as of {statsDate}. The latest figures in the game can differ from these. Heroes adjusted in a patch released after that date still show their tier and numbers from before the change.',
    },
  },
  {
    id: 'official-site',
    page: '/about',
    category: 'site',
    sources: ['src/app/[locale]/about/page.tsx', 'src/app/[locale]/legal/page.tsx', 'src/components/layout/Footer.tsx'],
    ja: {
      q: 'このサイトは公式ですか？',
      a: 'いいえ、個人が運営する非公式のファンサイトです。Tencentとも、ゲームを運営するLevel Infiniteとも関係がありません。告知とパッチノートは、Honor of Kings 公式サイトで読める。公式の表記と食い違う箇所があれば、当サイトの誤りです。',
    },
    en: {
      q: 'Is this an official Honor of Kings site?',
      a: 'No, Honor of Kings Hub is an unofficial fan site run by one person. The site has no connection to Tencent or to Level Infinite, which publishes the game. Announcements and patch notes are posted on the official Honor of Kings website. If anything here disagrees with the official wording, the mistake is on this site\'s end.',
    },
  },
  {
    id: 'hero-names-en',
    page: '/heroes',
    category: 'site',
    sources: ['src/data/hok_heroes.json', 'scripts/sync_official_heroes.js', 'src/components/heroes/HeroesListClient.tsx', 'src/utils/searchNormalize.ts'],
    ja: {
      q: '日本語ページと英語ページで、ヒーローの名前が違うのはなぜですか？',
      a: '日本語ページはゲーム内の日本語表示の名前を、英語ページは公式の英語名を使っているためです。英語ページでは、大司命はAugran、白龍はAo\'yinと表記される。日本語ページのヒーロー一覧は英語名でも検索でき、Augranと入れれば大司命が見つかります。',
    },
    en: {
      q: 'Why do hero names differ between the English and Japanese pages?',
      a: 'The Japanese pages use each hero\'s name as the game displays it in Japanese, while the English pages use the official English name. Augran and Ao\'yin, for example, are listed under kanji names on the Japanese pages. The search box on the Japanese hero list also accepts English names, so typing Augran still finds the hero.',
    },
  },
  {
    id: 'matchups-source',
    page: '/heroes',
    category: 'site',
    sources: ['src/data/data_freshness.json', 'src/components/heroes/HeroDetailClient.tsx'],
    ja: {
      q: 'ヒーロー詳細の「苦手な相手」「相性の良い味方」は、公式のデータですか？',
      a: '「苦手な相手」「相性の良い味方」は公式のデータではなく、当サイトの解説です。各ヒーローのスキル構成をもとに苦手な理由と噛み合う理由を書いており、勝率は使っていない。同じページの「よく一緒に選ばれる編成」は、公式の「HoK Camp」から載せています。数字は同じチームに揃った試合の割合で、高いほど相性が良いという意味ではない。',
    },
    en: {
      q: 'Is the "Counters & Synergies" section on hero pages based on official data?',
      a: 'The "Counters & Synergies" section is this site\'s own write-up, not official data. Each entry is based on the heroes\' kits, not on win rates, and explains why one hero struggles against another or why two heroes work well together. The "Frequently Paired With" section on the same page does come from the official HoK Camp. Its figures show how often heroes end up on the same team, so a higher number does not mean they work better together.',
    },
  },
  {
    id: 'skill-priority-source',
    page: '/heroes',
    category: 'site',
    sources: ['src/data/data_freshness.json', 'src/app/[locale]/about/page.tsx', 'src/components/heroes/HeroDetailClient.tsx'],
    ja: {
      q: '「最初に上げるスキル」は、どこの情報をもとにしていますか？',
      a: '公式の「HoK Camp」が示すスキルを、そのまま載せています。値は取得した時点のもので、最新の「HoK Camp」とはずれることがある。取得日は、各ヒーローページの「最初に上げるスキル」の下に出ています。',
    },
    en: {
      q: 'Where does the "First Skill to Level Up" pick come from?',
      a: 'The pick comes straight from the official HoK Camp. What you see is as of the day it was fetched and can differ from what HoK Camp shows now. Each hero page gives that date just below its First Skill to Level Up section.',
    },
  },
  {
    id: 'hero-difficulty',
    page: '/heroes',
    category: 'heroes',
    sources: ['src/data/skills/ja.json', 'src/content/heroDifficulty.ts', 'src/app/[locale]/heroes/[id]/page.tsx', 'src/components/heroes/HeroesListClient.tsx'],
    ja: {
      q: 'ヒーローの難易度は何段階ありますか？',
      a: 'ゲーム内の難易度はイージー・ノーマル・ハード・ベリーハードの{difficultyLevelCount}段階です。掲載ヒーローの内訳は、イージー{easyHeroCount}体、ノーマル{normalHeroCount}体、ハード{hardHeroCount}体、ベリーハード{veryHardHeroCount}体。残る{unratedDifficultyCount}体は難易度を掲載していないため、どの段階で絞り込んでも一覧に出てきません。',
    },
    en: {
      q: 'How many difficulty levels do heroes have?',
      a: 'Heroes are rated on {difficultyLevelCount} in-game difficulty levels, labeled Easy, Normal, Hard and Very Hard on this site. Of the heroes listed, {easyHeroCount} are Easy, {normalHeroCount} are Normal, {hardHeroCount} are Hard and {veryHardHeroCount} are Very Hard. The other {unratedDifficultyCount} have no difficulty listed, so they won\'t show up under any difficulty filter.',
    },
  },
  {
    id: 'hero-roles',
    page: '/heroes',
    category: 'heroes',
    sources: ['src/data/hok_heroes.json', 'messages/ja.json', 'src/components/heroes/HeroesListClient.tsx'],
    ja: {
      q: 'ヒーローのロールは何種類ありますか？',
      a: 'タンク・ファイター・アサシン・メイジ・マークスマン・サポートの{roleCount}種類です。複数のロールを兼ねるヒーローも{multiRoleHeroCount}体いる。ムーランならファイターとアサシンのどちらで絞り込んでも、一覧に出ます。',
    },
    en: {
      q: 'How many hero roles are there?',
      a: 'There are {roleCount} roles: Tank, Fighter, Assassin, Mage, Marksman and Support. In total, {multiRoleHeroCount} heroes have more than one role. Mulan, for example, is both a Fighter and an Assassin, so she shows up in the hero list under either filter.',
    },
  },
  {
    id: 'skill-data-lag',
    page: '/patches',
    category: 'site',
    sources: ['src/data/data_freshness.json', 'src/components/heroes/HeroDetailClient.tsx', 'src/lib/patchData.ts'],
    ja: {
      q: 'パッチのあとも、ヒーローページのスキルの数値が古いままなのはなぜですか？',
      a: 'スキルの数値と説明文はゲーム内の表示から載せており、パッチのあと反映までに時間がかかるためです。反映待ちのヒーローのページには、「スキル」の見出しの横に注記が出る。注記が消えるまでは、そのヒーローのページにある「パッチ履歴」で変更点を確かめられます。',
    },
    en: {
      q: 'Why are the skill numbers on a hero\'s page still outdated after a patch?',
      a: 'Skill values and descriptions come from the in-game display, so they take a while to catch up after a patch. Pages for heroes whose skill data is still pending show a note next to the Skills heading. Until the note goes away, the Patch History section on the same page lists what changed.',
    },
  },
];

/** 答えの1文目。索引と検査23の字数判定で同じ切り方を使う */
export function firstSentence(text: string, locale: 'ja' | 'en'): string {
  if (locale === 'ja') {
    const i = text.indexOf('。');
    return i === -1 ? text : text.slice(0, i + 1);
  }
  const m = text.match(/^[\s\S]*?[.!?](?=\s+[A-Z0-9{]|$)/);
  return m ? m[0] : text;
}
