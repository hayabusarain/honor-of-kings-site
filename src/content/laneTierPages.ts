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
export const LANE_COMMENTARY_STATS_DATE = '2026-08-21';

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
        'S評価は李信ただ1体。勝率53.7%・出現率2.4%・BAN率3.2%は、いずれも30体の首位です。強さ・人気・警戒がここまで一致するヒーローは他のレーンにいません。A帯はフロレンティーノ、夏侯惇、チーシャなど6体。',
        '勝率の2位は、S帯ではなくC評価のアタ（53.1%）です。出現率0.6%と使い手が限られ、勝率が高くても総合評価は伸びない。同じ出現率0.6%のフロレンティーノはBAN率2.0%で、「当たると厄介」型の嫌われ方をしています。3つの数字はセットで読むもの。クラッシュはその練習台にちょうどいいレーンです。',
      ],
      en: [
        'Li Xin is the lone S-tier pick, and he leads all 30 clash heroes on every axis: a 53.7% win rate, 2.4% pick rate and 3.2% ban rate. No hero in any other lane tops all three at once. Six more follow in A tier, led by Florentino, Dun and Chicha.',
        'Second on win rate is not an S-tier hero at all but C-tier Ata, at 53.1%. With a 0.6% pick rate he is the textbook specialist: a high win rate carried by a small player pool, and a modest overall rating. Florentino sits on the same 0.6% pick rate yet draws a 2.0% ban rate — the mark of a hero nobody wants to face. Read the three figures as a set; Clash is the best lane to practise on.',
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
        '5レーンで最も評価が絞られた枠です。26体のうちS・A評価は大司命・孫悟空・瀾の3体だけ。その大司命も勝率は49.8%で、評価を支えているのはBAN率4.0%という別格の警戒度のほうです。',
        '勝率だけならハロルドが55.2%で全体の首位、百里玄策が54.0%で続きます。出現率はそれぞれ0.5%と0.3%。少数の使い手が数字を押し上げている形です。ジャングルは習熟の差が勝率に出やすく、表の順位と環境での立ち位置のずれが5レーンでいちばん大きい枠になります。',
      ],
      en: [
        'No lane grades harsher: of 26 junglers, only Augran, Wukong and Lam sit in S or A tier. Even Augran wins just 49.8% of his games — what carries his rating is a 4.0% ban rate, the highest in the lane.',
        'By win rate alone Feyd leads the lane at 55.2%, with Xuance behind him at 54.0%. Their pick rates are 0.5% and 0.3%: small pools of dedicated players pushing the numbers up. Jungle rewards hero mastery more than any other role, so the gap between the table order and the meta is at its widest here.',
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
        'S評価6体（アンジェラ・妲己・墨子・張良・溟月・ミレディ）は5レーンで最多。この層の厚さがミッドの特徴です。中でも張良は勝率49.7%ながらBAN率3.7%とレーン最多。勝率に出ない対面での嫌がられ方が、禁止の数字に表れています。',
        '勝率トップは女媧の53.9%ですが、評価はAに留まります。出現率1.0%と母数が少ないぶん、数字の振れを差し引かれた形。迷ったら出現率の高い妲己（3.2%）かアンジェラ（2.7%）から入り、対面に合わせて持ち替えるのが実戦的です。',
      ],
      en: [
        'Mid has six S-tier heroes — Angela, Daji, Mozi, Liang, Haya and Milady — more than any other lane, and that depth is the story. Liang stands out: a 49.7% win rate but a lane-leading 3.7% ban rate. What the win rate hides, the bans reveal.',
        'The best win rate belongs to Nuwa at 53.9%, yet she grades A: at a 1.0% pick rate the sample is small enough to discount. If you are unsure what to learn, start with the most-picked options — Daji (3.2%) or Angela (2.7%) — and swap by matchup.',
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
        'S帯は白龍と后羿の2体だけです。白龍は勝率49.7%ながらBAN率3.5%でレーン最多と、「野放しにできない」側の評価。后羿は出現率2.8%でレーン最多です。勝率の首位はA評価の伽羅（54.2%）で、勝率と総合評価のねじれはこのレーンでも起きています。',
      ],
      en: [
        'Nine of the 18 heroes here grade S or A and only two sit in C — the most forgiving lane on the site. Everyone in it is a marksman, so win and pick rates compare cleanly with no cross-role caveats.',
        "S tier is down to two: Ao'yin and Hou Yi. Ao'yin wins only 49.7% of his games yet draws the lane's highest ban rate at 3.5% — rated for what he does when left unchecked. Hou Yi leads the lane on pick rate at 2.8%. The win-rate lead belongs to A-tier Garo at 54.2%, so the tier-versus-win-rate twist appears here too.",
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
        'S評価は蔡文姫だけ。勝率51.2%にBAN率2.4%が付き、回復役を野放しにしない意識が数字に出ています。A帯は瑶・少司縁・東皇太一・ドリアの4体。BAN率でレーン最多なのは東皇太一の2.5%。出現率0.7%に対して、禁止だけが突出しています。',
        '勝率の首位はC評価のラプール（55.2%）。出現率0.4%の専門職が最上段に来る構図は他レーンと同じです。ロームは寄り・ピール・起点作りといった、キルに直結しない仕事の枠。勝率46.6%のドリアがA評価という例も含め、表の数字は傾向として読むのが安全です。',
      ],
      en: [
        "Cai Yan is the only S-tier roamer: a 51.2% win rate paired with a 2.4% ban rate, because healing is not something opponents leave unchecked. A tier holds Yaria, Dyadia, Donghuang and Dolia. The lane's highest ban rate in fact belongs to Donghuang, at 2.5% on a mere 0.7% pick rate.",
        'The win-rate leader is C-tier Lapulapu at 55.2% — the same low-pick specialist pattern as the other lanes, here at a 0.4% pick rate. Roam is the lane of rotations, peel and setup rather than kills, so read these numbers as tendencies; Dolia grading A on a 46.6% win rate is the clearest example.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
