/**
 * サイトの更新履歴（/updates）。新しい順に並べる。
 *
 * 再訪した人に TabBar が「前回の訪問後にサイトが更新されました」と出していたが、
 * 何が変わったかは書いておらず、行き先も無かった（2026-09-25 のレビュー指摘 #59）。
 *
 * 載せるのは、読者に見える掲載内容が変わった日だけ。書き方の決まり:
 * - 何が変わったかを具体的に書く。「データを更新しました」のような行は書かない
 * - 集め方（撮影や書き起こしの手順）は書かない。「ゲーム内の表示に合わせた」までにする
 * - 日付は data_freshness.json の site.lastUpdated と同じ規約（その日の作業の日付）
 *
 * site.lastUpdated の日付の行が無いと、npm run audit の検査28が落とす。
 * touch:updated で日付を上げたら、ここにも1行足すこと。
 */
export type ChangelogEntry = {
  /** YYYY-MM-DD */
  date: string;
  ja: string;
  en: string;
  /** 変更をいちばんよく見られるページ（ロケールを付けないパス） */
  path?: string;
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-10-28',
    ja: '「このサイトについて」と「免責事項」を整理した。免責事項に、掲載している公式画像の範囲と、削除・訂正のご依頼の窓口を書いた。',
    en: 'Tidied up the About and Disclaimer pages. The disclaimer now states which official images are shown here and where to send takedown or correction requests.',
    path: '/legal',
  },
  {
    date: '2026-10-25',
    ja: 'ヒーロー一覧の見出しと、メニューやパンくずの表記を「キャラ一覧」にそろえた。',
    en: 'On the Japanese pages, the hero list is now called the "character list" in its heading, the menu and breadcrumbs, matching how players search for it.',
    path: '/heroes',
  },
  {
    date: '2026-10-24',
    ja: '10月21日アップデートのパッチノートを掲載した。新ヒーロー「イージス」のページを追加し、スキルの説明と数値、基本ステータス、立ち回り、コンボ、相性を載せている。孫策・楊貴妃・孫尚香・阿軻・廉頗・夏侯惇のスキルを、調整後のゲーム内の表示に合わせた。趙雲のスキルはまだ調整前の表示で、統計は7体とも調整前。',
    en: 'Published the notes for the October 21 update and added a page for the new hero Dunshan, with skill descriptions and figures, base stats, gameplay guide, combos and matchups. The skills of Sun Ce, Yuhuan, Lady Sun, Arke, Lian Po and Dun now match the in-game text after the change. Zilong\'s skills still show the old values, and the statistics of all seven adjusted heroes predate the patch.',
    path: '/heroes/dunshan',
  },
  {
    date: '2026-10-18',
    ja: 'Tier・勝率・出現率・BAN率を10月16日時点の公式データに更新し、レーン別Tier表の講評を5レーンとも書き直した。王維はミッドのBからSに上がった。',
    en: 'Updated tiers and win, pick and ban rates to the official data as of October 16, and rewrote the commentary on all five lane tier lists. Wang Wei moved up from B to S tier in mid.',
    path: '/tier-list/mid',
  },
  {
    date: '2026-10-13',
    ja: 'Tier・勝率・出現率・BAN率を10月9日時点の公式データに更新し、レーン別Tier表の講評を5レーンとも書き直した。王維が公式の統計に載り、ミッドのB評価でTier表に加わった。王維の顔とスキルのアイコンは、公式のものに替えた。',
    en: 'Updated tiers and win, pick and ban rates to the official data as of October 9, and rewrote the commentary on all five lane tier lists. Wang Wei now appears in the official stats and joins the tier list at B tier in mid. His portrait and skill icons now use the official artwork.',
    path: '/tier-list/mid',
  },
  {
    date: '2026-10-10',
    ja: '10月8日に登場した新ヒーロー「王維」のページを追加した。スキルの説明と数値、基本ステータス、立ち回り、コンボ、相性を載せている。公式の統計にはまだ載っていないので、Tier表には入れていない。',
    en: 'Added a page for Wang Wei, the new hero released on October 8, with his skill descriptions and figures, base stats, gameplay guide, combos and matchups. He is not on the tier list yet, since the official stats do not include him so far.',
    path: '/heroes/wang-wei',
  },
  {
    date: '2026-10-05',
    ja: 'Tier表の「データの読み方」を書き直した。公式のTierは勝率の順ではなく、上の段ほど高いのは出現率とBAN率で、これは今の統計で確かめている。スマホのトップで、レーン別の注目の名前と「最新パッチの変更」の見出しが語の途中で折れていたのを直した。フッターの姉妹サイト名は、改名に合わせて「Mobare Hub」に。',
    en: 'Rewrote the note on reading the tier list data: the official tiers are not a win-rate ranking, and the figures that rise from C to S are pick rate and ban rate, checked against the current stats. On phones, hero names in the home page lane picks and the "latest patch changes" heading no longer break mid-word. The footer link to the sister site now uses its new name, Mobare Hub.',
    path: '/tier-list',
  },
  {
    date: '2026-09-30',
    ja: 'アジア競技大会のページを、大会の結果に合わせて書き直した。金メダルの中国、銀のマレーシア、銅の香港とフィリピンと、グループステージから決勝までの全15試合の結果を載せた。',
    en: 'The Asian Games page now covers the results: gold for China, silver for Malaysia, bronze for Hong Kong and the Philippines, and the scores of all 15 matches from the group stage to the final.',
    path: '/esports/asian-games-2026',
  },
  {
    date: '2026-09-28',
    ja: 'トップページを作り直した。レーンごとに注目ヒーローを3体ずつ、最新パッチで調整された全ヒーローと主な変更、前回の集計から勝率が動いたヒーロー、勝率とBAN率の上位5体を載せ、ロール別の一覧とレーン別のTier表へのボタンを足した。',
    en: 'Rebuilt the home page. It now shows three heroes to watch in each lane, every hero adjusted in the latest patch with the main change, the heroes whose win rate moved most since the last snapshot, and the top five by win rate and ban rate, plus buttons for the role lists and the lane tier lists.',
    path: '/',
  },
  {
    date: '2026-09-27',
    ja: 'パッチノートで、ヒーロー以外の項目（イベント・不具合の修正・装備やアルカナの調整・モードなど）に、中身に合ったアイコンを付けた。',
    en: 'In the patch notes, entries other than heroes (events, fixes, item and arcana changes, modes and so on) now have icons that match what they cover.',
    path: '/patches',
  },
  {
    date: '2026-09-26',
    ja: 'サイト全体を墨の地に金の配色へ作り直し、文字はすべて14px以上にした。ロールごとのヒーロー一覧（6ロール）を追加し、Tier・レーン・難易度の内訳を載せた。用語集を独立したページにした。Tier・勝率・出現率・BAN率を9月25日時点の公式データに更新し、新ヒーロー「元流の子（アサシン）」「元流の子（サポート）」をTier表に加え、レーン別Tier表の講評を書き直した。「最初に選ぶヒーロー」のミッドは、小喬が選定条件の勝率48%を下回ったため、アンジェラに替えた。Tier表とヒーロー詳細では、前回取得した統計からのTierと勝率の変化が分かる。ヒーロー詳細から2体比較のページへ移れるようにした。新ヒーロー「元流の子（アサシン）」「元流の子（サポート）」の立ち回り解説を書き直した。アジア競技大会のページに、出場する10の国と地域・組み分け・試合形式・日本からの観かたを足し、日程を9月27〜28日の2日間に直した。',
    en: 'Redesigned the whole site in a dark ink-and-gold theme, with no text smaller than 14px. Added a hero list for each of the six roles, with its tier, lane and difficulty breakdown. The glossary now has its own page. Tiers and win, pick and ban rates are updated to the official data as of September 25, the new heroes Flowborn (Assassin) and Flowborn (Roamer) join the tier list, and the lane tier list commentary is rewritten. In the beginner hero guide, Angela replaces Xiao Qiao in mid, whose win rate fell below the 48% cut-off. The tier list and hero pages show how each hero\'s tier and win rate moved since the previous stats. Hero pages now link to the two-hero comparison. Rewrote the strategy sections for the new heroes Flowborn (Assassin) and Flowborn (Roamer). The Asian Games page now lists the ten competing nations and regions, the groups, the format and how to watch from Japan, and the schedule is corrected to two days, 27–28 September.',
    path: '/heroes/role/tank',
  },
  {
    date: '2026-09-25',
    ja: 'スマホで見やすいように組み直した。ヒーロー一覧の絞り込みはプルダウンにまとめ、Tier表は顔アイコンの格子にした。基本ステータス表・アルカナ計算機・パッチノート・ガイドも、スマホの幅に合わせて組み直した。日本語ページは端末のフォントで表示して、読み込みを軽くした。ヒーロー2体を並べて比べるページと、この更新履歴を追加した。横断検索ではスキル名からも探せる。',
    en: 'Reworked the site for phones: the hero list filters are now dropdowns, the tier list is a grid of hero portraits, and the base stats table, arcana calculator, patch notes and guides are laid out again for narrow screens. Japanese pages now use the device font and load much faster. Added a page for comparing two heroes and this update log, and site search now also finds skill names.',
    path: '/compare',
  },
  {
    date: '2026-09-24',
    ja: 'S16の新ヒーロー「元流の子（アサシン）」「元流の子（サポート）」と、新装備「シャドウアロー」を追加した。9月23日アップデートで変わった装備8点・アルカナ11種・ヒーロー8体のスキルをゲーム内の表示に合わせ、調整された8体の統計には「調整前」の注記を付けた。',
    en: 'Added the two new Season 16 heroes, Flowborn (Assassin) and Flowborn (Roamer), and the new item Assassin\'s Wristbow. Eight items, eleven arcana and the skills of eight heroes changed in the September 23 update now match the in-game text, and the statistics of the eight adjusted heroes are marked as pre-patch.',
    path: '/heroes/yuanliu-child-assassin',
  },
  {
    date: '2026-09-23',
    ja: '9月23日アップデート（S16「流の交わる地」）のパッチノートを掲載した。ヒーローのおすすめコンボを、押す順の記号で表示するようにした。',
    en: 'Published the notes for the September 23 update (Season 16). Recommended combos on hero pages are now shown as a sequence of button icons.',
    path: '/patches/2026-09-23',
  },
  {
    date: '2026-09-22',
    ja: 'ヒーロー詳細を1列の構成にし、区画の並びと見出しを整理した。',
    en: 'Hero pages now use a single column, with their sections reordered and retitled.',
    path: '/heroes/lian-po',
  },
  {
    date: '2026-09-21',
    ja: 'ジャングル装備4種の説明文と、蘭陵王の二つ名（闇の刺客）をゲーム内の表示に合わせて直した。',
    en: 'Corrected the Japanese text of four jungle items and of Gao Changgong\'s title to match the game.',
  },
  {
    date: '2026-09-15',
    ja: 'よくある質問を22問追加し、一覧のページを作った。9月10日アップデートのパッチノートと、調整された6体のスキルを反映した。',
    en: 'Added 22 frequently asked questions with an index page. Published the September 10 update notes and updated the skills of the six adjusted heroes.',
    path: '/faq',
  },
  {
    date: '2026-09-14',
    ja: 'Tier・勝率・出現率・BAN率を9月11日時点の公式データに更新し、レーン別Tier表の講評を書き直した。',
    en: 'Updated tiers and win, pick and ban rates to the official data as of September 11, and rewrote the lane tier list commentary.',
    path: '/tier-list',
  },
  {
    date: '2026-09-07',
    ja: 'オーバーロードの出現時刻を2:00から4:00に直した。出所を示せなかったヒーローの「能力評価」4項目を取り下げた。',
    en: 'Corrected the Overlord spawn time from 2:00 to 4:00. Removed the four-part "ability ratings" from hero pages because their source could not be shown.',
    path: '/guide/bosses',
  },
  {
    date: '2026-09-05',
    ja: '統計を9月4日時点の公式データに更新し、統計をもとにした解説文を書き直した。',
    en: 'Updated the statistics to the official data as of September 4 and revised the commentary based on them.',
    path: '/tier-list',
  },
  {
    date: '2026-09-04',
    ja: '相性欄（苦手な相手・相性の良い味方）の理由を、スキルの説明文を根拠に見直し、1件1文にまとめた（453件）。',
    en: 'Reviewed the reasons given in the counters and synergies sections against the skill descriptions, and cut each of the 453 entries to one sentence.',
  },
  {
    date: '2026-09-01',
    ja: 'ゲーム内の表示と食い違っていた装備データ8件を直した。パッチノートに版ごとのページを作り、絞り込みや並び替えの状態をURLで共有できるようにした。',
    en: 'Fixed eight items whose data differed from the game. Each update now has its own patch notes page, and filters and sort orders are kept in the URL so they can be shared.',
    path: '/items',
  },
];
