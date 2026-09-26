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
    date: '2026-09-26',
    ja: 'サイト全体を墨の地に金の配色へ作り直し、文字はすべて14px以上にした。ロールごとのヒーロー一覧（6ロール）を追加し、Tier・レーン・難易度の内訳を載せた。用語集を独立したページにした。Tier表とヒーロー詳細では、前回（9月4日取得）の統計からのTierと勝率の変化が分かる。ヒーロー詳細から2体比較のページへ移れるようにした。新ヒーロー「元流の子（アサシン）」「元流の子（サポート）」の立ち回り解説を書き直した。',
    en: 'Redesigned the whole site in a dark ink-and-gold theme, with no text smaller than 14px. Added a hero list for each of the six roles, with its tier, lane and difficulty breakdown. The glossary now has its own page. The tier list and hero pages show how each hero\'s tier and win rate moved since the previous stats (taken September 4). Hero pages now link to the two-hero comparison. Rewrote the strategy sections for the new heroes Flowborn (Assassin) and Flowborn (Roamer).',
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
