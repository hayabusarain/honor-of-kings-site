/**
 * レーン別Tier表ページ（/tier-list/[lane]）の文言。
 *
 * 総合の /tier-list はタブ切り替えで、初期HTMLには既定レーンの分しか出ない。
 * つまり残り4レーンの順位は、どのURLにもインデックスできる形で存在していなかった。
 * レーンごとに固定URLを持たせ、「HoK ジャングル 最強」のような複合検索を受ける。
 *
 * lead は /guide のレーン解説に書いてある各レーンの役割と揃えている。
 * ここで新しい主張を足さないこと（裏の取れていない説明を増やさないため）。
 */

export type LaneId = 'CLASH' | 'JUNGLE' | 'MID' | 'FARM' | 'ROAM';

export type LaneTierPage = {
  /** URL に使う（/tier-list/jungle） */
  slug: string;
  /** hero_stats_camp.json の lane 値 */
  id: LaneId;
  /** 見出しに使うレーン名 */
  name: { ja: string; en: string };
  /** ページ冒頭の1〜2文。役割の説明はマクロガイドの記述に合わせる */
  lead: { ja: string; en: string };
  /** 検索結果に出るタイトル。レーン名を先頭寄りに置く */
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  /**
   * 表の下に出すレーン別の講評（段落ごと）。
   * 数値・ヒーロー名はすべて LANE_COMMENTARY_STATS_DATE 時点の
   * hero_stats_camp.json から取ったもの。統計を差し替えたら書き直す
   * （日付の不一致は npm run audit が落とす）
   */
  commentary: { ja: string[]; en: string[] };
};

/**
 * 講評が前提にしている統計の取得日。
 * data_freshness.json の campStats.updatedAt と一致しないと audit が落ちる。
 * 統計を取り直したら、講評を現行データで書き直してからこの日付を上げること。
 */
export const LANE_COMMENTARY_STATS_DATE = '2026-08-14';

export const LANE_TIER_PAGES: LaneTierPage[] = [
  {
    slug: 'clash',
    id: 'CLASH',
    name: { ja: 'クラッシュレーン', en: 'Clash Lane' },
    lead: {
      ja: '1v1のレーン戦とウェーブ管理をこなし、集団戦では前線を張るか敵の後衛へ回り込むレーンです。ファイターとタンクが中心になります。',
      en: 'The solo lane: 1v1 duels and wave control, then either holding the frontline or flanking the enemy backline in fights. Fighters and tanks dominate here.',
    },
    title: {
      ja: 'クラッシュレーン最新Tier表・最強ヒーローランキング',
      en: 'Honor of Kings Clash Lane Tier List - Best Solo Lane Heroes',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のクラッシュレーン専用Tier表。公式統計の勝率・出現率・BAN率から、クラッシュに登録されているヒーローだけをランキングしています。',
      en: 'Clash Lane tier list for Honor of Kings, ranking only the heroes registered to that lane using the official win rate, pick rate and ban rate figures.',
    },
    commentary: {
      ja: [
        'S評価は李信ただ1体。勝率53.3%・出現率2.5%・BAN率3.2%と、強さ・人気・警戒のすべてが数字に出ています。A帯には夏侯惇、フロレンティーノ、チーシャなど6体が続きます。',
        '一方、表の最上段はS帯ではなくC評価のアタ（勝率53.7%）です。出現率0.6%と使い手が限られ、勝率が高くても総合評価が伸びない典型例。逆にフロレンティーノは出現率0.7%に対しBAN率2.1%と、「当たると厄介」型の嫌われ方をしています。勝率・出現率・BAN率をセットで読む練習台に、クラッシュはちょうどいいレーンです。',
      ],
      en: [
        'Li Xin is the lone S-tier pick, and the numbers all point the same way: a 53.3% win rate, 2.5% pick rate and 3.2% ban rate. Six heroes follow in A tier, led by Dun, Florentino and Chicha.',
        'The top of the table, though, belongs to Ata — a C-tier tank with a 53.7% win rate. At a 0.6% pick rate he is the textbook specialist: a high win rate carried by a small player pool, with a modest overall rating. Florentino shows the opposite pattern, drawing a 2.1% ban rate on just a 0.7% pick rate. Clash is the best lane for learning to read win, pick and ban rates as a set.',
      ],
    },
  },
  {
    slug: 'jungle',
    id: 'JUNGLE',
    name: { ja: 'ジャングル', en: 'Jungle' },
    lead: {
      ja: 'ゲーム全体のテンポを左右する枠です。高速なジャングル周回、ガンク、タイラントとオーバーロードの奪取を担当します。',
      en: 'The role that sets the pace of the whole game: fast clears, ganks, and taking the Tyrant and Overlord. Assassins and fighters share this slot.',
    },
    title: {
      ja: 'ジャングル最新Tier表・最強ジャングラーランキング',
      en: 'Honor of Kings Jungle Tier List - Best Junglers',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のジャングル専用Tier表。公式統計の勝率・出現率・BAN率から、ジャングルに登録されているヒーローだけをランキングしています。',
      en: 'Jungle tier list for Honor of Kings, ranking only the heroes registered to the jungle using the official win rate, pick rate and ban rate figures.',
    },
    commentary: {
      ja: [
        '5レーンで最も評価が絞られた枠です。26体のうちS・A評価は大司命・孫悟空・瀾の3体だけ。その大司命も勝率は49.4%で、評価を支えているのはBAN率4.0%という別格の警戒度のほうです。',
        '勝率だけならハロルド（55.3%）と百里玄策（53.7%）が表の最上段に来ます。どちらも出現率0.5%前後の専門職で、少数の使い手が数字を押し上げている形。ジャングルは習熟の差が勝率に出やすく、表の順位と環境での立ち位置のずれが5レーンでいちばん大きい枠です。',
      ],
      en: [
        'No lane grades harsher: of 26 junglers, only Augran, Wukong and Lam sit in S or A tier. Even Augran wins just 49.4% of his games — what carries his rating is a 4.0% ban rate, the highest in the lane.',
        'By win rate alone, Feyd (55.3%) and Xuance (53.7%) top the table — both specialists at roughly a 0.5% pick rate, their numbers driven by a small pool of dedicated players. Jungle rewards hero mastery more than any other role, so the gap between the table order and the meta is at its widest here.',
      ],
    },
  },
  {
    slug: 'mid',
    id: 'MID',
    name: { ja: 'ミッドレーン', en: 'Mid Lane' },
    lead: {
      ja: '序盤のテンポを握る枠です。ウェーブを素早く処理してサイドレーンへ寄り、集団戦では範囲魔法か暗殺で火力を出します。',
      en: 'The tempo lane: clear the wave fast, rotate to the side lanes, then deliver area magic damage or an assassination in fights.',
    },
    title: {
      ja: 'ミッドレーン最新Tier表・最強メイジランキング',
      en: 'Honor of Kings Mid Lane Tier List - Best Mid Heroes',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のミッドレーン専用Tier表。公式統計の勝率・出現率・BAN率から、ミッドに登録されているヒーローだけをランキングしています。',
      en: 'Mid Lane tier list for Honor of Kings, ranking only the heroes registered to that lane using the official win rate, pick rate and ban rate figures.',
    },
    commentary: {
      ja: [
        'S評価5体（アンジェラ・妲己・墨子・張良・ミレディ）は5レーンで最多で、この層の厚さがミッドの特徴です。中でも張良は勝率50.0%ちょうどながらBAN率3.7%とレーン最多。勝率に出ない対面での嫌がられ方が、禁止の数字に表れています。',
        '勝率トップは女媧の53.8%ですが、評価はAに留まります。出現率1.0%と母数が少ないぶん、数字の振れを差し引かれた形です。迷ったら出現率の高い妲己（3.5%）かアンジェラ（2.7%）から入り、対面に合わせて持ち替えるのが実戦的です。',
      ],
      en: [
        'Mid has five S-tier heroes — Angela, Daji, Mozi, Liang and Milady — more than any other lane, and that depth is the story. Liang stands out: an exactly 50.0% win rate but a lane-leading 3.7% ban rate. What the win rate hides, the bans reveal.',
        'The best win rate belongs to Nuwa at 53.8%, yet she grades A: at a 1.0% pick rate the sample is small enough to discount. If you are unsure what to learn, start with the most-picked options — Daji (3.5%) or Angela (2.7%) — and swap by matchup.',
      ],
    },
  },
  {
    slug: 'farm',
    id: 'FARM',
    name: { ja: 'ファームレーン', en: 'Farm Lane' },
    lead: {
      ja: '物理ダメージの要となる枠です。安全にゴールドを集め、後方から正確に位置取りし、タワーやドラゴンを削ります。',
      en: 'The physical damage carry: farm safely, position precisely from the back, and convert that into towers and dragons.',
    },
    title: {
      ja: 'ファームレーン最新Tier表・最強マークスマンランキング',
      en: 'Honor of Kings Farm Lane Tier List - Best Marksmen',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のファームレーン専用Tier表。公式統計の勝率・出現率・BAN率から、ファームに登録されているヒーローだけをランキングしています。',
      en: 'Farm Lane tier list for Honor of Kings, ranking only the marksmen and other heroes registered to that lane using the official statistics.',
    },
    commentary: {
      ja: [
        '18体中S・A評価が9体と半数を占め、C評価は2体だけ。5レーンでいちばん「どれを選んでも形になる」枠です。並ぶのは全員マークスマンなので、ロール間の差を気にせず勝率と出現率だけで読めます。',
        'S帯は魯班7号（勝率51.7%）、出現率2.9%でレーン最多の后羿、そして白龍の3体。白龍は勝率48.9%ながらBAN率4.0%でレーン最多と、「野放しにできない」側の評価です。勝率の首位はA評価の伽羅（53.6%）で、勝率と総合評価のねじれはこのレーンでも起きています。',
      ],
      en: [
        'Nine of the 18 heroes here grade S or A and only two sit in C — the most forgiving lane on the site. Everyone in it is a marksman, so win and pick rates compare cleanly with no cross-role caveats.',
        "The S tier holds Luban No.7 (a 51.7% win rate), Hou Yi (a lane-high 2.9% pick rate) and Ao'yin. Ao'yin wins only 48.9% of his games yet draws the lane's highest ban rate at 4.0% — rated for what he does when left unchecked. The win-rate lead belongs to A-tier Garo at 53.6%, so the tier-versus-win-rate twist appears here too.",
      ],
    },
  },
  {
    slug: 'roam',
    id: 'ROAM',
    name: { ja: 'ローム', en: 'Roam' },
    lead: {
      ja: '決まったレーンを持たず、マップ全体を動く枠です。川の視界を取り、集団戦を始めるか、味方キャリーを守ります。',
      en: 'No fixed lane. Roamers take river vision and either start the fight or keep the carry alive.',
    },
    title: {
      ja: 'ローム最新Tier表・最強サポートランキング',
      en: 'Honor of Kings Roam Tier List - Best Support Heroes',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のローム専用Tier表。公式統計の勝率・出現率・BAN率から、ロームに登録されているヒーローだけをランキングしています。',
      en: 'Roam tier list for Honor of Kings, ranking only the heroes registered to that role using the official win rate, pick rate and ban rate figures.',
    },
    commentary: {
      ja: [
        'S評価は蔡文姫だけ。BAN率2.6%もレーン最多で、回復役を野放しにしない意識が数字に出ています。A帯は瑶・少司縁・東皇太一・ドリアの4体。東皇太一も出現率0.7%に対しBAN率2.4%と、禁止で消される側の常連です。',
        '勝率の首位はC評価のラプール（55.1%）。出現率0.4%の専門職が最上段に来る構図は他レーンと同じです。ロームは寄り・ピール・起点作りといったキルに直結しない仕事の枠なので、勝率46.8%のドリアがA評価という例も含め、表の数字は傾向として読むのが安全です。',
      ],
      en: [
        "Cai Yan is the only S-tier roamer, and her lane-high 2.6% ban rate says why: healing is not something opponents leave unchecked. A tier holds Yaria, Dyadia, Donghuang and Dolia — Donghuang likewise eats a 2.4% ban rate on a mere 0.7% pick rate.",
        'The win-rate leader is C-tier Lapulapu at 55.1% — the same low-pick specialist pattern as the other lanes, here at a 0.4% pick rate. Roam is the lane of rotations, peel and setup rather than kills, so read these numbers as tendencies; Dolia grading A on a 46.8% win rate is the clearest example.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
