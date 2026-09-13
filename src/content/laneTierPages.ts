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
export const LANE_COMMENTARY_STATS_DATE = '2026-09-11';

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
        'S評価は李信ただ1体です。出現率1.99%とBAN率2.86%はどちらも30体の首位で、人気と警戒が一致しています。ただし勝率は51.43%で、30体中10位。A帯は7体に増え、夏侯惇・チーシャ・カイザー・廉頗・呂布・ミーユエ・フロレンティーノが並びます。',
        '今回は廉頗と呂布がBからAへ上がり、デーヴァラがAからBへ下がりました。呂布とデーヴァラを並べると、Tierが3つの数字の足し算ではないと分かる。出現率は1.12%と1.10%、BAN率は0.33%と0.31%でほぼ同じです。勝率はデーヴァラの49.28%が呂布の48.92%を上回り、前回からも上がっている。それでも上がったのは呂布で、デーヴァラは下がりました。勝率の上位3体は達磨53.39%、ナタク53.00%、アタ52.98%で、いずれもC評価。出現率は0.26〜0.53%と小さく、使い手が少ないぶん数字が振れます。',
      ],
      en: [
        'Li Xin is the lone S-tier pick. He leads all 30 clash heroes on both pick rate (1.99%) and ban rate (2.86%), so popularity and caution agree on him. His 51.43% win rate, though, only ranks 10th in the lane. A tier grows to seven: Dun, Chicha, Kaizer, Lian Po, Lu Bu, Mi Yue and Florentino.',
        'Lian Po and Lu Bu moved up from B to A this week, while Devara dropped from A to B. Put Lu Bu and Devara side by side and it is clear the tier is not a sum of the three figures. Their pick rates are 1.12% and 1.10%, their ban rates 0.33% and 0.31%. Devara wins more often, 49.28% against 48.92%, and that figure rose from the previous snapshot. Lu Bu went up anyway, and Devara went down. The three best win rates all belong to C-tier heroes (Dharma 53.39%, Nezha 53.00%, Ata 52.98%) on pick rates of 0.26-0.53%, where a small pool makes the numbers swing.',
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
        '26体のうちS・A評価は3体だけで、5レーンでいちばん絞られています。今回は典韋がAからB、曜がBからCへ下がりました。頂点の大司命は勝率49.47%。評価を支えているのはBAN率3.97%のほうで、次に多い瀾と蘭陵王（どちらも1.16%）の3倍を超えます。',
        'S・A帯は3体とも勝率が5割を割っていて、こうなっているのは5レーンでジャングルだけです。勝率の首位はB評価の趙雲で54.56%。出現率1.07%はレーン4位で、S・A帯の1.14〜1.62%に迫っている。よく使われ、よく勝っていても評価はBのままです。曜も勝率を51.99%から52.21%へ上げながら、Cへ下がりました。',
      ],
      en: [
        'No lane grades harsher: of 26 junglers, only three sit in S or A tier. Dian Wei dropped from A to B this week and Yao from B to C. Augran holds the top spot on a 49.47% win rate, carried instead by a 3.97% ban rate, more than triple the 1.16% shared by Lam and Gao Changgong, the next highest.',
        'All three S and A junglers win fewer than half their games, and jungle is the only lane where that is true. The best win rate belongs to B-tier Zilong at 54.56%, on a 1.07% pick rate that ranks fourth in the lane and sits just below the 1.14-1.62% of the S and A heroes. Picked often and winning often, he is still graded B. Yao, too, raised his win rate from 51.99% to 52.21% and slid to C anyway.',
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
        'S評価は妲己・アンジェラ・張良・ミレディの4体で、5レーンの最多です。今回は墨子がSからAへ下がり、太公望がCからBへ上がりました。目を引くのは張良で、BAN率3.69%はレーン最多。出現率は0.81%とS・A帯でいちばん低いのに、禁止だけが突出しています。',
        '勝率の首位はA評価の女媧で53.77%。2位の漸離（51.81%）に2ポイント近い差をつけていますが、出現率1.02%はレーン8位です。S帯で勝率が最も低いのはミレディの47.76%で、こちらは出現率1.66%とBAN率1.84%が評価を支えている。迷ったら出現率の高いアンジェラ（2.74%）か妲己（2.61%）から入り、対面に合わせて持ち替えるのが実戦的です。',
      ],
      en: [
        'Mid carries four S-tier heroes (Daji, Angela, Liang and Milady), more than any other lane. Mozi slipped from S to A this week, and Ziya climbed from C to B. Liang is the one to look at: a lane-leading 3.69% ban rate on a 0.81% pick rate, the lowest among the S and A heroes. Few people play him, yet the bans keep coming.',
        'The best win rate belongs to A-tier Nuwa at 53.77%, almost two points clear of Gao in second (51.81%), though her 1.02% pick rate only ranks eighth in the lane. At the other end of S tier, Milady wins just 47.76% and is held up instead by a 1.66% pick rate and a 1.84% ban rate. If you are unsure what to learn, start with the most-picked options, Angela (2.74%) or Daji (2.61%), and swap by matchup.',
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
        '18体中S・A評価が8体で、C評価は黄忠と蒙牙の2体だけ。S・Aの割合は44%と5レーンで最も高く、いちばん「どれを選んでも形になる」枠です。並ぶのは全員マークスマンなので、ロール間の差を気にせず勝率と出現率だけで読めます。',
        'S帯は后羿・魯班7号・白龍の3体。魯班7号はAからSへ戻りました。前回はSからAへ落ちていたので、2週続けての入れ替わりです。その間の勝率は52.2%、51.89%、51.79%、出現率は2.18%、2.14%、2.16%で、ほとんど動いていない。Tierは公式がこの3つの数字とは別に決めているので、昇降をそのまま強弱と読むことはできません。勝率の首位はA評価の伽羅で53.87%。出現率3位、BAN率2位と、3つの数字すべてで上位3位に入るのはレーンで伽羅だけです。',
      ],
      en: [
        'Eight of the 18 heroes here grade S or A, and only Huang Zhong and Meng Ya sit in C. At 44%, that is the highest S-and-A share of any lane. Everyone in it is a marksman, so win and pick rates compare cleanly with no cross-role caveats.',
        "S tier holds three: Hou Yi, Luban No.7 and Ao'yin. Luban No.7 is back in S after dropping to A the week before, the second swap in two weeks. Across those three snapshots his win rate read 52.2%, 51.89% and 51.79%, and his pick rate 2.18%, 2.14% and 2.16%, barely a flicker. The official tier is set separately from these figures, so a promotion or a demotion on its own says nothing about the hero getting stronger. The win-rate lead goes to A-tier Garo at 53.87%, and he is the only hero in the lane to rank top three on all three figures: first on win rate, third on pick rate, second on ban rate.",
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
        '今回、ロームのTierは1体も動いていません。S評価は蔡文姫とドリアの2体です。ドリアは勝率47.07%で16体の最下位。それでも出現率2.04%はレーン最多で、評価はここに引っ張られています。BAN率の最多はA評価の東皇太一で2.43%。出現率0.77%はS・A帯でいちばん低く、使う人は少ないのに禁止される回数だけが多い。',
        '勝率の首位はC評価のラプールで54.89%。出現率0.38%の専門職が最上段に来る構図は、他のレーンと同じです。ロームは寄り・ピール・起点作りといった、キルに直結しない仕事の枠。勝率だけでは働きの量を測れないので、表の数字は傾向として読むのが安全です。',
      ],
      en: [
        'No roam tier changed this week. Cai Yan and Dolia remain the two S-tier heroes. Dolia wins 47.07% of games, the lowest figure among the 16 roamers, and still leads the lane on pick rate at 2.04%, which is what the grade is following. The highest ban rate belongs to A-tier Donghuang, at 2.43% on a 0.77% pick rate, the lowest among the S and A roamers.',
        'The win-rate leader is C-tier Lapulapu at 54.89%, a 0.38% specialist topping the column exactly as in the other lanes. Roam is the lane of rotations, peel and setup: work that does not convert into kills. A win rate cannot measure that, so read these numbers as tendencies.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
