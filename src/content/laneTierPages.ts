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
export const LANE_COMMENTARY_STATS_DATE = '2026-10-16';

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
        '今回Tierが動いたのは関羽の1体だけ。BからCに下がりました。勝率は46.72%から47.08%に上がり、前回30体中の最下位から29位になっている。出現率は0.59%から0.42%に減った。下げ幅0.17ポイントはレーン最大です。S・A評価は李信、夏侯惇、チーシャ、影の4体で、ジャングルと並んで5レーンで最も少ない。顔ぶれとTierは前回と変わっていません。勝率の上位にはC評価が並ぶ。首位のアタ（53.49%）から6位までの6体のうち、夏侯惇以外の5体がC。この5体の出現率は、いずれも0.53%以下でした。',
        'S評価の李信は、出現率1.67%とBAN率2.25%でレーン首位を守った。出現率の伸び0.07ポイントは、デーヴァラと並んでレーン最大。BAN率は2.44%から0.19ポイント下がり、下げ幅はレーンで最も大きい。夏侯惇は勝率53.18%で2位を保った。出現率は1.57%から1.43%に減り、3位に下がっている。2位に上がった影も、1.48%から1.45%に減った。BAN率の2位はミーユエの1.01%。前回の0.97%（3位）から上げ、1.12%から0.95%に下がったフロレンティーノを抜いた。',
      ],
      en: [
        'Guan Yu was the only clash hero to change tier, falling from B to C. His win rate rose from 46.72% to 47.08%, moving him from last of 30 to 29th. His pick rate dropped from 0.59% to 0.42%, and that 0.17-point fall is the largest in the lane. The S and A tiers hold four heroes, Li Xin, Dun, Chicha and Umbrosa, with the same lineup at the same tiers as last time. That ties jungle for the fewest S- and A-tier heroes of any lane. C-tier heroes crowd the top of the win-rate table: five of the top six are C tier, led by Ata at 53.49%, and none of those five has a pick rate above 0.53%.',
        'S-tier Li Xin keeps the lane lead on both pick rate (1.67%) and ban rate (2.25%). His pick rate rose 0.07 points, tied with Devara for the biggest gain in clash, while his ban rate fell 0.19 points from 2.44%, the steepest drop in the lane. Dun holds second on win rate at 53.18%, but his pick rate slid from 1.57% to 1.43%, dropping him from second to third. Umbrosa took over second, with a pick rate that also dipped, from 1.48% to 1.45%. Mi Yue now has the second-highest ban rate at 1.01%, up from 0.97% and third place last time, passing Florentino, who fell from 1.12% to 0.95%.',
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
        '趙雲がAからBへ、李白がBからCへ、それぞれ1段下がった。Tierが動いたのはこの2体です。趙雲の勝率は54.52%から54.67%に上がり、27体の首位を保った。出現率は1.35%から1.19%に下がったものの、レーン2位は変わりません。李白も勝率を53.04%から53.15%へ伸ばし、4位のまま降格した。出現率は0.75%から0.58%に減り、0.17ポイントの下げ幅はレーン最大です。A評価は元流の子（アサシン）・瀾・孫悟空の3体になり、勝率は16位・23位・24位。勝率の上位15体に、S・A評価は1体もいません。',
        'S評価は今回も大司命の1体だけ。出現率1.65%とBAN率3.48%は、前回に続いてどちらもレーン首位です。BAN率2位にはB評価の蘭陵王が3位から上がり、1.06%から1.16%になった。前回2位の元流の子（アサシン）は1.59%から1.01%へ下がり、3位に。下げ幅0.58ポイントは27体で最も大きい。出現率を最も伸ばしたのは司馬懿で、0.71%から1.1%へ上がり9位から4位に入りました。勝率54.13%は前回と同じレーン2位。勝率と出現率がともに4位以内なのは、B評価の趙雲と司馬懿だけです。勝率の上げ幅はC評価の雲中君が最大で、50.46%から51.23%へ0.77ポイント上がった。',
      ],
      en: [
        'Zilong dropped from A to B and Li Bai from B to C, the only two tier changes in the jungle. Zilong\'s win rate rose from 54.52% to 54.67%, still the best of all 27 junglers. His pick rate fell from 1.35% to 1.19% but remains second in the lane. Li Bai was demoted while his win rate went from 53.04% to 53.15%, holding fourth place. His pick rate dropped from 0.75% to 0.58%, and that 0.17-point fall is the largest in the jungle. A tier is now down to three heroes, Flowborn (Assassin), Lam and Wukong, who rank 16th, 23rd and 24th on win rate. None of the top 15 junglers by win rate is rated S or A.',
        'Augran is again the only S-tier jungler and, as last time, leads the lane on both pick rate (1.65%) and ban rate (3.48%). B-tier Gao Changgong moved up from third to second on ban rate, going from 1.06% to 1.16%. Flowborn (Assassin), second last time, slipped to third with its ban rate down from 1.59% to 1.01%, the biggest drop among all 27 junglers. Sima Yi posted the largest pick-rate gain, from 0.71% to 1.1%, and climbed from ninth to fourth. His 54.13% win rate ranks second in the lane, as it did last time. Zilong and Sima Yi, both B tier, are the only junglers in the top four on both win rate and pick rate. The biggest win-rate gain belongs to C-tier Cirrus, up 0.77 points from 50.46% to 51.23%.',
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
        '王維がBからSへ2段上がり、S評価は5体から6体に増えた。Tierが動いたのは計4体で、5レーンで最も多い。王維の勝率は48.14%から50.51%へ2.37ポイント伸びている。出現率は0.81%から1.99%に、BAN率は0.68%から2.67%に増えた。3つともレーン最大の伸び幅です。順位は出現率が3位、BAN率が張良に次ぐ2位。太公望と貂蝉はCからBへ上がりました。不知火舞はAからBに下がったが、勝率は47.73%から48.47%へ上がっている。出現率は1.24%から0.91%に落ち、0.33ポイントの下げ幅はレーン最大でした。',
        '勝率の首位は前回と同じく女媧（A評価）で、53.72%。2位はS評価のアンジェラで51.74%、前回の3位から1つ上がった。出現率は2.73%で、前回に続いてレーン首位を保っています。勝率と出現率の両方で上位5位に入るのは、今回もアンジェラだけです。張良のBAN率は4.17%で、5レーンの全ヒーローの中で最も高い。勝率は50.44%から50.2%に下がり、レーン14位。S評価でも、ミレディと溟月の勝率は47.87%と47.8%で、23位と24位にとどまる。溟月は前回の48.15%から0.35ポイント下げた。下げ幅はレーンで最も大きい。',
      ],
      en: [
        'Wang Wei jumped two tiers from B to S, taking the S tier from five heroes to six. Four mid heroes changed tier in all, more than in any other lane. Wang Wei\'s win rate climbed from 48.14% to 50.51%, a 2.37-point gain. His pick rate went from 0.81% to 1.99% and his ban rate from 0.68% to 2.67%, and all three increases are the largest in the lane. He now ranks third in pick rate, and second in ban rate behind only Liang. Ziya and Diaochan moved up from C to B. Mai Shiranui fell from A to B even though her win rate rose from 47.73% to 48.47%. Her pick rate dropped from 1.24% to 0.91%, and that 0.33-point fall is the largest in mid.',
        'A-tier Nuwa keeps the best win rate in the lane at 53.72%. S-tier Angela is second at 51.74%, up from third last time. Her 2.73% pick rate still leads the lane, and she is again the only hero in the top five on both win rate and pick rate. Liang\'s 4.17% ban rate is the highest of any hero across all five lanes. His win rate slipped from 50.44% to 50.2%, 14th in mid. Two S-tier heroes sit low on win rate: Milady at 47.87% (23rd) and Haya at 47.8% (24th). Haya\'s win rate fell 0.35 points from 48.15%, the largest drop in the lane.',
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
        '蒼がBからAに上がり、S・A評価は18体中10体になった。半数を超えたのは5レーンでファームだけです。ほかの17体は前回と同じTierのまま。蒼の数字は3つとも前回を下回っている。勝率は52.1%から51.94%に、出現率は1.22%から1.18%に下がった。BAN率は0.25%から0.23%。勝率を最も伸ばしたのは魯班7号で、44.54%から45.18%へ0.64ポイント上がった。それでも順位は、18体の最下位から動いていません。下げ幅が最大だったのは黄忠で、51.34%から50.7%へ同じく0.64ポイント下がった。',
        'S評価は前回と同じく白龍と后羿の2体。白龍はBAN率2.52%でレーン首位に立つが、前回の2.66%からは下がった。后羿は出現率2.27%で首位にあり、前回の2.17%からの伸びはレーンで最も大きい。2体の勝率は49.37%と48.87%で、14位と16位です。勝率の首位は前回に続いてA評価の伽羅で、53.47%。2位のルアンナ（53.35%）との差は、0.31ポイントから0.12ポイントに縮まった。伽羅の出現率は1.8%から1.66%に減り、3位から4位に下がっています。勝率3位と4位はB評価のアレッシオ（52.58%）と仁傑（52.55%）。前回は2体とも52.7%で並んでいた。',
      ],
      en: [
        'Chano moved up from B to A, the only tier change in farm. That puts 10 of the 18 heroes at S or A, and farm is the only lane where that share is more than half. Chano\'s own numbers all slipped: win rate from 52.1% to 51.94%, pick rate from 1.22% to 1.18%, and ban rate from 0.25% to 0.23%. Luban No.7 posted the lane\'s biggest win-rate gain, up 0.64 points from 44.54% to 45.18%, yet still sits last of the 18. Huang Zhong had the largest drop, falling the same 0.64 points from 51.34% to 50.7%.',
        'The S tier is unchanged: Ao\'yin and Hou Yi. Ao\'yin leads the lane on ban rate at 2.52%, down from 2.66%, while Hou Yi tops pick rate at 2.27%, up from 2.17% and the biggest pick-rate gain in the lane. Their win rates of 49.37% and 48.87% rank 14th and 16th. A-tier Garo holds the top win rate again at 53.47%, and the gap to second-placed Luara (53.35%) has narrowed from 0.31 points to 0.12. Garo\'s pick rate dipped from 1.8% to 1.66%, slipping from third to fourth. Third and fourth on win rate are B-tier Alessio (52.58%) and Di Renjie (52.55%), who were tied at 52.7% last time.',
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
        '蔡文姫がSからAに下がった。ロームでTierが変わったのはこの1体だけです。数字の動きは小さく、勝率は51.67%から51.43%、BAN率は2.08%から2.07%だった。順位は勝率3位・BAN率2位で、どちらも前回と変わらない。S評価はドリア1体になり、A評価は蔡文姫・大喬・少司縁・瑶・東皇太一の5体。ドリアの出現率は1.99%から2.46%に上がりました。0.47ポイントの伸びはロームで最も大きい。2.46%は、出現率2位の瑶（1.13%）の2倍を超える。勝率46.97%は前回に続いて17体の最下位です。',
        '勝率を最も伸ばしたのは東皇太一で、47.33%から48.14%へ0.81ポイント上がった。BAN率2.73%は前回に続いてレーン首位です。瑶も49.08%から49.71%に上げ、13位から9位へ。下げ幅が最も大きかったのは大喬。51.27%から50.49%へ0.78ポイント下がり、4位から5位になりました。4位に上がった元流の子（サポート）も、勝率は50.92%から50.57%に下げている。出現率とBAN率の減り幅は、どちらもレーン最大だった。C評価のラプール（54.56%）と啓（52.83%）は、今回も勝率の1位と2位。出現率は0.32%と0.44%で、低いほうから2番目と5番目です。',
      ],
      en: [
        'Cai Yan dropped from S to A, the only tier change among roamers. Her numbers barely moved: her win rate went from 51.67% to 51.43% and her ban rate from 2.08% to 2.07%, still third and second in the lane. That leaves Dolia as the lone S-tier roamer, with Cai Yan, Da Qiao, Dyadia, Yaria and Donghuang in A. Dolia\'s pick rate rose from 1.99% to 2.46%. That 0.47-point gain is the largest in the lane, and the new figure is more than double Yaria\'s second-place 1.13%. Dolia\'s 46.97% win rate is again the lowest of the 17.',
        'Donghuang posted the biggest win-rate gain, up 0.81 points from 47.33% to 48.14%. His 2.73% ban rate is still the highest in the lane. Yaria also improved, from 49.08% to 49.71%, climbing from 13th to ninth. The largest drop belongs to Da Qiao, down 0.78 points from 51.27% to 50.49% and from fourth to fifth. Flowborn (Roamer) moved up to fourth even though its win rate also slipped, from 50.92% to 50.57%. Its pick and ban rates both fell by more than any other roamer\'s. C-tier Lapulapu (54.56%) and Sakeer (52.83%) again hold the top two win rates, yet their pick rates of 0.32% and 0.44% are the second- and fifth-lowest of the 17.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
