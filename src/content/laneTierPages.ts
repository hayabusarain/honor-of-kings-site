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
export const LANE_COMMENTARY_STATS_DATE = '2026-09-04';

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
        'S評価は李信ただ1体です。出現率2.16%とBAN率3.01%はどちらも30体の首位で、人気と警戒が一致しています。ただし勝率は51.38%で、30体中11位。A帯は夏侯惇・チーシャ・フロレンティーノ・カイザー・ミーユエ・デーヴァラの6体です。',
        '勝率の上位4体は0.03ポイント差に固まっています。アタ52.82%、夏侯惇52.81%、達磨52.80%、ファーティフ52.79%。この順位そのものに意味はありません。差が出るのは出現率のほうで、夏侯惇の1.68%に対してアタは0.53%、達磨は0.25%。使い手が少ないほど数字は振れます。今回A評価へ上がったデーヴァラは勝率48.8%で、前回より下がっている。Tierが3つの数字の足し算ではないと分かる例です。',
      ],
      en: [
        'Li Xin is the lone S-tier pick. He leads all 30 clash heroes on both pick rate (2.16%) and ban rate (3.01%), so popularity and caution agree on him. The 51.38% win rate, though, only ranks 11th in the lane. Six heroes follow in A tier: Dun, Chicha, Florentino, Kaizer, Mi Yue and Devara.',
        'The four best win rates sit within 0.03 points of one another — Ata 52.82%, Dun 52.81%, Dharma 52.80%, Fatih 52.79% — so the ordering itself carries no information. Pick rate is what separates them: Dun is on 1.68%, Ata on 0.53%, Dharma on 0.25%. The smaller the pool, the more a win rate swings. Devara climbed into A this week on a 48.8% win rate that fell from the previous snapshot, which is about as clear as it gets that the tier is not a sum of the three figures.',
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
        '26体のうちS・A評価は4体だけで、5レーンでいちばん絞られています。頂点の大司命は勝率49.57%と5割を割っている。評価を支えているのはBAN率3.98%のほうで、2位の瀾（1.15%）の3倍以上です。今回は典韋がBからAへ上がりました。',
        '勝率だけを見るとB評価の趙雲が54.39%で首位、C評価のアテナが54.25%で続きます。ただしアテナの出現率は0.06%で、26体の最下位。ほとんど使われていない以上、母数が小さすぎて傾向としては読めません。3位の百里玄策も0.30%、4位のハロルドで0.52%です。S・A帯の0.98〜1.63%と比べれば差は明らかで、ジャングルは表の順位と環境のずれが5レーンでいちばん大きい枠になります。',
      ],
      en: [
        'No lane grades harsher: of 26 junglers, only four sit in S or A tier. Augran holds the top spot on a 49.57% win rate — under even — and the rating is carried instead by a 3.98% ban rate, more than triple the 1.15% of second-placed Lam. Dian Wei moved up from B to A this week.',
        'By win rate alone, B-tier Zilong leads at 54.39% with C-tier Athena just behind on 54.25%. Athena appears in 0.06% of games, though, the lowest figure in the lane: that sample is far too small to read as a trend. Xuance is third on 0.30% and Feyd fourth on 0.52%, against 0.98-1.63% across the S and A heroes. Jungle is where the table order and the actual meta diverge most.',
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
        'S評価は妲己・アンジェラ・張良・墨子・ミレディの5体で、5レーンの最多です。今回は溟月がSからAへ下がりました。目を引くのは張良で、勝率50.73%に対しBAN率3.71%はレーン最多。出現率0.77%と使う人は多くないのに、禁止だけが突出しています。',
        '勝率の首位はA評価の女媧で53.82%。出現率1.01%と母数が小さいぶん、総合評価では割り引かれた形です。S帯で最も勝率が低いのはミレディの47.82%で、こちらは出現率1.66%とBAN率1.84%が評価を支えている。迷ったら出現率の高いアンジェラ（2.76%）か妲己（2.75%）から入り、対面に合わせて持ち替えるのが実戦的です。',
      ],
      en: [
        'Mid carries five S-tier heroes — Daji, Angela, Liang, Mozi and Milady — more than any other lane. Haya slipped from S to A this week. Liang is the one to look at: a 50.73% win rate against a lane-leading 3.71% ban rate. Barely anyone picks him, at 0.77%, yet the bans keep coming.',
        'The best win rate belongs to A-tier Nuwa at 53.82%, discounted in the overall grade by a 1.01% pick rate. At the other end of S tier, Milady wins only 47.82% and is held up instead by a 1.66% pick rate and a 1.84% ban rate. If you are unsure what to learn, start with the most-picked options — Angela (2.76%) or Daji (2.75%) — and swap by matchup.',
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
        '18体中S・A評価が8体で、C評価は蒙牙と黄忠の2体だけ。5レーンでいちばん「どれを選んでも形になる」枠です。並ぶのは全員マークスマンなので、ロール間の差を気にせず勝率と出現率だけで読めます。',
        'S帯は白龍と后羿の2体。前回Sへ上がった魯班7号は、1週でAへ戻りました。その間、勝率は52.2%から51.89%、出現率は2.18%から2.14%とほとんど動いていません。Tierは公式がこの3つの数字とは別に決めているので、昇降をそのまま強弱と読むことはできない。白龍は勝率49.53%ながらBAN率3.23%でレーン最多、后羿は出現率2.67%で最多です。勝率の首位はA評価の伽羅（53.78%）で、ここでも勝率と総合評価はねじれています。',
      ],
      en: [
        'Eight of the 18 heroes here grade S or A, and only Meng Ya and Huang Zhong sit in C — the most forgiving lane on the site. Everyone in it is a marksman, so win and pick rates compare cleanly with no cross-role caveats.',
        "S tier holds two: Ao'yin and Hou Yi. Luban No.7, promoted into S in the previous snapshot, is back in A a week later, with a win rate that moved from 52.2% to 51.89% and a pick rate from 2.18% to 2.14%. The official tier is set separately from these three figures, so a promotion or a demotion on its own says nothing about the hero getting stronger. Ao'yin wins 49.53% of games yet draws the lane's highest ban rate at 3.23%, while Hou Yi leads on pick rate at 2.67%. The win-rate lead goes to A-tier Garo at 53.78%, so the tier-versus-win-rate twist appears here too.",
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
        '前回はS評価が1体もいませんでしたが、今回は蔡文姫とドリアの2体が上がりました。ドリアは勝率46.97%で16体の最下位。それでも出現率2.27%はレーン最多で、評価はここに引っ張られています。BAN率の最多はA評価の東皇太一で2.53%。出現率0.73%に対して、禁止だけが突出しています。',
        '勝率の首位はC評価のラプールで55.09%。出現率0.36%の専門職が最上段に来る構図は、他のレーンと同じです。ロームは寄り・ピール・起点作りといった、キルに直結しない仕事の枠。勝率だけでは働きの量を測れないので、表の数字は傾向として読むのが安全です。',
      ],
      en: [
        "Roam had no S-tier hero at all in the previous snapshot; this week Cai Yan and Dolia both moved up. Dolia wins 46.97% of games, the lowest figure among the 16 roamers, and still leads the lane on pick rate at 2.27% — that is what the grade is following. The highest ban rate belongs to A-tier Donghuang, at 2.53% on a mere 0.73% pick rate.",
        'The win-rate leader is C-tier Lapulapu at 55.09%, a 0.36% specialist topping the column exactly as in the other lanes. Roam is the lane of rotations, peel and setup — work that does not convert into kills. A win rate cannot measure that, so read these numbers as tendencies.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
