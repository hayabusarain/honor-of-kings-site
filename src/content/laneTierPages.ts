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
  /**
   * 検索結果に出るタイトル。レーン名を先頭寄りに置く。
   * 「最新」は書かない。ページ側が統計の年月を後ろに付ける（tier-list/[lane]/page.tsx）
   */
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
export const LANE_COMMENTARY_STATS_DATE = '2026-10-09';

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
      ja: 'クラッシュレーンTier表・最強キャラランキング',
      en: 'Honor of Kings Clash Lane Tier List - Best Solo Lane Heroes',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のクラッシュレーン専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、クラッシュに登録されているヒーローだけに絞って載せています。',
      en: 'Clash Lane tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to that lane only.',
    },
    commentary: {
      ja: [
        '今回は4体のTierが動きました。影がBからAへ、関羽がCからBへ上がった。カイザーとフロレンティーノはAからBへ下がっています。S・A評価は5体から4体に減り、5レーンで最も少ない。影は勝率を51.09%から50.38%に落とした。出現率は1.15%から1.48%に伸び、レーン3位に入っています。伸び幅0.33ポイントはレーン最大。関羽はBに上がったものの、勝率は47.87%から46.72%に下がり、30体の最下位です。カイザーは逆に、勝率を50.33%から50.59%へ上げながら降格した。',
        'S評価は李信のまま。BAN率2.44%と出現率1.6%は、どちらもレーン首位を保った。出現率は前回の1.99%から0.39ポイント減り、下げ幅はレーン最大です。勝率は51.34%から51.91%に上がり、レーン8位に入る。A評価の夏侯惇は、勝率52.95%と出現率1.57%がともに2位。BAN率0.67%は4位です。3つとも4位以内なのは、前回に続いて夏侯惇だけ。フロレンティーノのBAN率は1.56%から1.12%に下がったが、レーン2位は変わらない。勝率の首位はC評価のアタで53.55%でした。',
      ],
      en: [
        'Four clash heroes changed tier this time. Umbrosa rose from B to A and Guan Yu from C to B, while Kaizer and Florentino dropped from A to B. That leaves four heroes in S and A tier, down from five and the fewest of any lane. Umbrosa\'s win rate slipped from 51.09% to 50.38%, but the pick rate grew from 1.15% to 1.48% and now ranks third in the lane. That 0.33-point rise is the largest in clash. Guan Yu moved up even as his win rate fell from 47.87% to 46.72%, the lowest of the 30 clash heroes. Kaizer went the other way, dropping a tier while his win rate rose from 50.33% to 50.59%.',
        'Li Xin is still the lone S-tier hero and keeps the lane lead on both ban rate (2.44%) and pick rate (1.6%). His pick rate was 1.99% last time, and that 0.39-point drop is the largest in clash. His win rate rose from 51.34% to 51.91%, eighth in the lane. A-tier Dun ranks second on both win rate (52.95%) and pick rate (1.57%) and fourth on ban rate (0.67%). As last time, no other clash hero makes the top four on all three. Florentino\'s ban rate fell from 1.56% to 1.12%, yet it is still the second highest in the lane. The best win rate belongs to C-tier Ata at 53.55%.',
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
      ja: 'ジャングルTier表・最強ジャングラーランキング',
      en: 'Honor of Kings Jungle Tier List - Best Junglers',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のジャングル専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ジャングルに登録されているヒーローだけに絞って載せています。',
      en: 'Jungle tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to the jungle only.',
    },
    commentary: {
      ja: [
        'S評価は今回も大司命の1体だけ。出現率1.76%とBAN率3.56%は、どちらも27体の首位です。BAN率2位は元流の子（アサシン）の1.59%で、大司命はその2倍を超える。勝率は49.16%から48.15%へ下がり、レーン22位にとどまりました。A評価は4体のまま。趙雲がBから上がり、蘭陵王がBへ下がっています。趙雲の勝率54.52%は、前回に続いてレーン首位。出現率は0.99%から1.35%へ伸び、5位から2位に上がりました。伸び幅0.36ポイントはレーン最大。',
        '元流の子（アサシン）は、勝率を48.28%から50.19%へ上げました。1.91ポイントの伸びは27体で最も大きい。BAN率も0.95%から1.59%に増え、4位から2位へ。同じA評価の瀾と孫悟空は、勝率では23位と24位にいます。今回Tierが動いたのは5体で、ほかの4レーンより多い。司馬懿と李白はCからBへ上がり、司馬懿の勝率53.77%はレーン2位です。李白の勝率は52.44%から53.04%へ伸び、8位から4位に上がった。ハロルドはBからCへ下がり、勝率も53.78%から52.71%へ落としています。順位は3位から6位。蘭陵王は勝率を50.63%から50.86%へ上げながら、Aから外れた。',
      ],
      en: [
        'Augran is still the jungle\'s only S-tier hero and leads all 27 junglers on both pick rate (1.76%) and ban rate (3.56%). The next-highest ban rate is Flowborn (Assassin) at 1.59%, less than half of Augran\'s. Augran\'s win rate fell from 49.16% to 48.15%, which ranks only 22nd in the lane. A tier still has four heroes, with Zilong moving up from B and Gao Changgong dropping out. Zilong\'s 54.52% win rate leads the lane, as it did last time. His pick rate rose from 0.99% to 1.35%, lifting him from fifth to second, and that 0.36-point gain is the largest in the jungle.',
        'Flowborn (Assassin) raised its win rate from 48.28% to 50.19%. That 1.91-point gain is the biggest of all 27 junglers. Its ban rate also climbed from 0.95% to 1.59%, moving from fourth to second. The other two A-tier heroes, Lam and Wukong, rank 23rd and 24th on win rate. Five junglers changed tier this time, more than in any other lane. Sima Yi and Li Bai both rose from C to B, and Sima Yi\'s 53.77% win rate is second in the lane. Li Bai\'s win rate went from 52.44% to 53.04%, moving him from eighth to fourth. Feyd dropped from B to C, and his win rate also fell from 53.78% to 52.71%, from third to sixth in the lane. Gao Changgong fell to B even though his win rate rose from 50.63% to 50.86%.',
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
      ja: 'ミッドレーンTier表・最強メイジランキング',
      en: 'Honor of Kings Mid Lane Tier List - Best Mid Heroes',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のミッドレーン専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ミッドに登録されているヒーローだけに絞って載せています。',
      en: 'Mid Lane tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to that lane only.',
    },
    commentary: {
      ja: [
        'S評価は前回と同じ5体で、5レーンで最も多い。張良のBAN率は3.84%から4.16%へ上がった。レーン首位で、5レーンの全ヒーローを見ても最も高い数字です。勝率は51.06%から50.44%に下がり、27体中13位。前回から評価が動いたのは3体で、不知火舞がBからAへ、棋星と貂蝉がBからCへ移った。不知火舞は出現率が0.94%から1.24%へ上がりました。0.3ポイントの伸びはレーン最大。勝率は47.73%（前回48.29%）で、S・A評価の11体では最も低い。棋星は勝率51.02%でレーン9位に入りながら、Cに下がっています。',
        '勝率の首位はA評価の女媧で、53.86%。2位はC評価の扁鵲（51.76%）で、前回の50.71%から1.05ポイント上がった。上げ幅はレーン最大です。下げ幅が最も大きいのはA評価の孔明。51.74%から50.75%へ、0.99ポイント下がった。アンジェラは出現率2.68%でレーン首位、勝率51.66%で3位。勝率と出現率の両方で上位5位に入るのは、アンジェラだけです。初めて統計に載った王維はB評価で、勝率は48.14%、出現率は0.81%でした。BAN率0.68%はB・C評価の16体で最も高く、A評価の孔明・小喬・不知火舞も上回る。',
      ],
      en: [
        'Mid keeps the same five S-tier heroes as last time, more than any other lane. Liang\'s ban rate rose from 3.84% to 4.16%, the highest in the lane and the highest of any hero across all five lanes. His win rate slipped from 51.06% to 50.44%, 13th of 27. Three returning heroes changed tier: Mai Shiranui moved up from B to A, while Yixing and Diaochan dropped from B to C. Mai Shiranui\'s pick rate rose from 0.94% to 1.24%, and that 0.3-point gain is the largest in the lane. Her win rate is 47.73% (48.29% last time), the lowest among the 11 S- and A-tier heroes. Yixing was demoted despite a 51.02% win rate that ranks ninth in the lane.',
        'A-tier Nuwa has the best win rate at 53.86%. Second is C-tier Dr Bian at 51.76%, up 1.05 points from 50.71%, the biggest gain in the lane. The biggest drop belongs to A-tier Kongming, down 0.99 points from 51.74% to 50.75%. Angela leads the lane in pick rate at 2.68% and ranks third in win rate at 51.66%, making her the only hero in the top five on both. Wang Wei, appearing in the stats for the first time, enters at B tier with a 48.14% win rate and a 0.81% pick rate. His 0.68% ban rate is the highest of the 16 B- and C-tier heroes and tops three A-tier heroes as well: Kongming, Xiao Qiao and Mai Shiranui.',
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
      ja: 'ファームレーンTier表・最強マークスマンランキング',
      en: 'Honor of Kings Farm Lane Tier List - Best Marksmen',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のファームレーン専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ファームに登録されているヒーローだけに絞って載せています。',
      en: 'Farm Lane tier list for Honor of Kings, showing the official HoK Camp tiers and statistics for the marksmen and other heroes registered to that lane only.',
    },
    commentary: {
      ja: [
        '今回、ファームでTierが動いたヒーローはいません。S・A評価は18体中9体と半数を占め、この割合は5レーンで最も高い。大きく動いたのは魯班7号。勝率が48.05%から44.54%へ3.51ポイント下がった。この下げ幅は、5レーンの全ヒーローで最大です。評価はAのままで、勝率は18体の最下位になった。出現率も2%から1.39%に減り、レーン2位から9位へ後退しています。勝率の伸びがレーン最大だったのはマルコ・ポーロ。50.44%から51.47%へ、1.03ポイント上がりました。',
        'S評価は白龍と后羿の2体です。BAN率は白龍の2.66%、出現率は后羿の2.17%がレーン首位。どちらも前回（2.94%と2.42%）から下がった。2体の勝率は49.33%と49.03%で、14位と16位にとどまります。勝率の首位はA評価の伽羅で、53.6%。出現率1.8%が3位、BAN率0.42%が2位に入る。勝率・出現率・BAN率の3つとも3位以内なのは、レーンで伽羅だけです。出現率の増え幅もレーン最大で、1.55%から0.25ポイント伸びた。勝率3〜5位はすべてB評価。仁傑とアレッシオが52.7%で並び、蒼が52.1%で続きます。',
      ],
      en: [
        'No farm hero changed tier this time. Nine of the 18 heroes grade S or A, exactly half and the highest share of any lane. The big mover was Luban No.7, whose win rate fell from 48.05% to 44.54%. That 3.51-point drop is the largest for any hero across the five lanes. Luban No.7 is still graded A but now has the lowest win rate of the 18, and the pick rate also fell from 2% to 1.39%, sliding from second to ninth in the lane. Marco Polo posted the lane\'s biggest win-rate gain, rising 1.03 points from 50.44% to 51.47%.',
        'The two S-tier heroes are Ao\'yin and Hou Yi. Ao\'yin leads the lane on ban rate at 2.66% and Hou Yi on pick rate at 2.17%, both down from last time (2.94% and 2.42%). Their win rates of 49.33% and 49.03% rank only 14th and 16th. A-tier Garo has the top win rate at 53.6%, along with the third-highest pick rate (1.8%) and the second-highest ban rate (0.42%). No other farm hero makes the top three on all three figures, and Garo\'s pick rate also rose the most in the lane, up 0.25 points from 1.55%. Third through fifth on win rate are all B tier: Di Renjie and Alessio tied at 52.7%, then Chano at 52.1%.',
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
      ja: 'ロームTier表・最強サポートランキング',
      en: 'Honor of Kings Roam Tier List - Best Support Heroes',
    },
    description: {
      ja: 'オナーオブキングス（HoK）のローム専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ロームに登録されているヒーローだけに絞って載せています。',
      en: 'Roam tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to that role only.',
    },
    commentary: {
      ja: [
        'ロームは17体すべてが前回と同じTierだった。S評価は蔡文姫とドリア、A評価は大喬・少司縁・瑶・東皇太一です。蔡文姫は勝率51.67%で17体中3位、BAN率2.08%は2位に入ります。ドリアは出現率を1.87%から1.99%に伸ばし、レーン首位を保った。勝率46.95%は、前回に続いて17体の最下位。A評価で勝率5割を超えるのは大喬だけです。勝率は49.89%から51.27%へ伸び、順位は6位から4位に上がりました。BAN率も0.7%から1.12%に増えた。0.42ポイントの増加は、ロームで一番大きい。',
        '勝率を最も伸ばしたのは、B評価の元流の子（サポート）だった。48.7%から50.92%へ2.22ポイント上がり、順位は14位から5位になっています。勝率を最も下げたのは、C評価の鬼谷子。50.38%から48.64%へ1.74ポイント下がり、4位から14位に落ちた。BAN率首位（2.65%）の東皇太一も、勝率を48.56%から47.33%に下げて16位です。勝率の1位と2位は前回と同じく、C評価のラプール（54.74%）と啓（53.25%）。出現率はラプールが0.33%、啓が0.44%で、どちらも17体中の下位5体に入ります。',
      ],
      en: [
        'All 17 roamers kept their tier from last time, with Cai Yan and Dolia in S and Da Qiao, Dyadia, Yaria and Donghuang in A. Cai Yan\'s 51.67% win rate ranks third of 17, and her 2.08% ban rate ranks second. Dolia\'s pick rate rose from 1.87% to 1.99%, still the highest in the lane, while her 46.95% win rate is again the lowest of the 17. Da Qiao is the only A-tier roamer winning more than half her games: her win rate climbed from 49.89% to 51.27%, moving her from sixth to fourth in the lane. Her ban rate also went from 0.7% to 1.12%, a 0.42-point rise that is the largest in the lane.',
        'Flowborn (Roamer), in B tier, posted the lane\'s biggest win-rate gain: 2.22 points, from 48.7% to 50.92%, lifting it from 14th to fifth. The biggest drop belongs to C-tier Guiguzi, down 1.74 points from 50.38% to 48.64% and from fourth to 14th. Donghuang still has the highest ban rate in the lane at 2.65%, but his win rate fell from 48.56% to 47.33%, now 16th. As last time, the top two win rates belong to C-tier Lapulapu (54.74%) and Sakeer (53.25%). Their pick rates, 0.33% and 0.44%, are both among the five lowest of the 17.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
