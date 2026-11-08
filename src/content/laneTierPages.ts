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
export const LANE_COMMENTARY_STATS_DATE = '2026-11-06';

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
        '今回Tierが動いたのは、BからAに上がったミーユエの1体です。勝率は49.72%から49.63%に下がりました。S・Aの6体のうち、50%を切るのはミーユエしかいません。BAN率は1.09%から1.14%に増え、上げ幅はレーン最大です。11月5日に強化されたバイロンは、出現率が0.69%から0.93%に増えています。0.24ポイントの伸びはレーン最大で、順位は14位から11位に上がりました。勝率48.32%は27位のままです。弱体化された2体のうち、孔子は勝率3位を保ちました。ナタクは52.53%から52.27%に下がり、順位は4位から5位に移っています。集計にパッチ後の試合がどこまで含まれるかは未確認です。',
        'S・A評価は李信、夏侯惇、チーシャ、影、孫策、ミーユエの6体になりました。Sの李信は出現率1.64%とBAN率1.98%で、どちらもレーン1位を守っています。勝率の上位5体はアタ（53.75%）、ファーティフ、孔子、白起、ナタクで、すべてC評価です。李信の52.16%は、それに次ぐ6位に入りました。前回5位の達磨は52.14%から51.51%に下がり、11位に後退しています。下げ幅0.63ポイントはレーン最大です。勝率を最も伸ばしたのは楊戩で、49.33%から50.82%へ1.49ポイント上がりました。',
      ],
      en: [
        'Mi Yue is the only clash hero to change tier this time, moving up from B to A. Her win rate dipped from 49.72% to 49.63%, and she is now the only S or A hero below 50%. Her ban rate rose from 1.09% to 1.14%, the largest increase in the lane. Biron, buffed on November 5, saw his pick rate climb from 0.69% to 0.93%. That 0.24-point jump is the biggest in clash and lifts him from 14th to 11th on pick rate. His 48.32% win rate still ranks 27th. Of the two nerfed heroes, Fuzi held third on win rate, while Nezha slipped from 52.53% to 52.27% and dropped from fourth to fifth. How many post-patch matches the November 6 data includes is unconfirmed.',
        'Six heroes now sit in S and A: Li Xin, Dun, Chicha, Umbrosa, Sun Ce and Mi Yue. S-tier Li Xin keeps first place in the lane for both pick rate (1.64%) and ban rate (1.98%). The five highest win rates all belong to C-tier heroes: Ata (53.75%), Fatih, Fuzi, Bai Qi and Nezha. Li Xin\'s 52.16% comes sixth, right behind them. Dharma, fifth last time, fell from 52.14% to 51.51% and now sits 11th; that 0.63-point drop is the steepest in clash. Yang Jian posted the biggest win-rate gain, rising 1.49 points from 49.33% to 50.82%.',
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
        'ジャングルでTierが動いたのは、BからAに上がった蘭陵王の1体だけです。出現率は0.58%から0.75%、BAN率は1.36%から1.49%に伸びました。上げ幅はそれぞれ0.17ポイントと0.13ポイントで、どちらもレーンで最大です。勝率だけは50.45%から50.17%に下がりました。BAN率1.49%は阿軻と同じ値で、2位に並びます。S評価は大司命だけで、出現率1.59%とBAN率3.34%でレーン首位を保ちました。BAN率は2位の2倍を超えるものの、勝率48.63%は22位にとどまります。S・A評価の5体で勝率が最も高いのは、6位の阿軻（52.87%）でした。',
        '勝率の首位は、前回2位だったB評価の司馬懿に替わりました。司馬懿は54.19%から54.71%に伸ばし、前回首位のモンキ（54.19%）を0.52ポイント上回ります。11月5日に強化されたナコルルは、C評価のまま勝率を49.12%から50.04%に上げました。上げ幅0.92ポイントはレーン最大で、勝率の順位は20位から16位になっています。出現率も0.46%から0.57%に増え、19位から11位まで上がりました。集計期間が非公開のため、11月6日版にパッチ後の試合がどこまで入っているかは未確認です。勝率の下げ幅が最も大きかったのはアテナで、53.11%から52.07%へ1.04ポイント落ちました。',
      ],
      en: [
        'Gao Changgong was the only jungler to change tier this time, moving up from B to A. His pick rate rose from 0.58% to 0.75% and his ban rate from 1.36% to 1.49%. Those gains of 0.17 and 0.13 points are both the largest in the lane. Win rate was the one figure that fell, from 50.45% to 50.17%. At 1.49%, his ban rate now ties Arke\'s for second place. Augran remains the only S-tier jungler and still leads the lane in both pick rate (1.59%) and ban rate (3.34%). That ban rate is more than double the second-highest, but the win rate of 48.63% ranks only 22nd. Among the five S- and A-tier junglers, Arke has the best win rate at 52.87%, sixth in the lane.',
        'Sima Yi, a B-tier hero who was second last time, has taken over first place on win rate. He climbed from 54.19% to 54.71% and now sits 0.52 points ahead of Menki (54.19%), the previous leader. Nakoruru, buffed in the November 5 update, stays in C tier but raised her win rate from 49.12% to 50.04%. That 0.92-point gain is the largest in the lane and moves her from 20th to 16th. Her pick rate also rose, from 0.46% to 0.57%, lifting her from 19th to 11th. The collection period is not published, so how many post-patch matches the November 6 data includes is unconfirmed. Athena had the steepest win rate drop in the lane, falling 1.04 points from 53.11% to 52.07%.',
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
        'Tierが変わったのは女媧の1体だけで、AからBに下がりました。勝率は54.03%から53.82%に落ちたものの、レーン1位は前回と同じです。出現率は1.02%から0.93%に減っています。S評価の4体（アンジェラ・妲己・張良・ミレディ）に入れ替わりはありません。ミレディは出現率を1.61%から1.79%へ伸ばし、4位から3位に上がりました。0.18ポイントの伸びはレーン最大です。王維は出現率が1.04%から0.86%に、BAN率が1.41%から0.96%に下がりました。どちらの減り幅も、27体の中で最も大きくなっています。',
        '勝率2位はB評価の楊貴妃で、51.79%です。前回2位の扁鵲は52.24%から51.65%に落ち、3位に後退しました。11月5日に強化された元流の子（メイジ）は、勝率を47.59%から48.31%へ上げています。0.72ポイントの伸びはレーン最大で、順位は25位から22位に上がりました。出現率は0.29%で、最下位からは抜けていません。集計にパッチ後の試合がどこまで入っているかは未確認です。アンジェラは出現率2.93%でレーン1位に立ち、5レーンの全ヒーローを見ても、これより高い値はありません。張良のBAN率3.93%もレーン1位で、全レーンではロームのイージス（4.23%）に次ぎます。',
      ],
      en: [
        'Nuwa was the only hero to change tier, dropping from A to B. Her win rate dipped from 54.03% to 53.82%, yet it still leads the lane, as it did last time. Her pick rate fell from 1.02% to 0.93%. The S tier is unchanged: Angela, Daji, Liang and Milady. Milady raised her pick rate from 1.61% to 1.79%, moving from fourth to third; the 0.18-point gain is the largest in mid. Wang Wei went the other way, with his pick rate down from 1.04% to 0.86% and his ban rate down from 1.41% to 0.96%. Both drops are the largest among the 27 mid heroes.',
        'Yuhuan, a B-tier hero, has the second-best win rate at 51.79%. Dr Bian, second last time, slipped from 52.24% to 51.65% and now sits third. Flowborn (Mage), buffed in the November 5 update, saw its win rate rise from 47.59% to 48.31%. That 0.72-point gain is the biggest in the lane and lifts it from 25th to 22nd. At 0.29%, its pick rate is still the lowest in mid. How many post-patch matches the data includes is unconfirmed. Angela\'s 2.93% pick rate tops the lane, and no hero in any of the five lanes is picked more often. Liang\'s 3.93% ban rate also leads mid; across all lanes, only roam\'s Dunshan is higher, at 4.23%.',
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
        'Tierが動いたヒーローはなく、S3体・A6体・B7体・C2体は前回と同じです。数字が大きく動いたのは、11月5日のアップデートで強化された后羿でした。勝率は49%から50.27%へ1.27ポイント伸び、16位から13位に上がりました。出現率も2.46%から2.81%へ0.35ポイント増え、首位を保っています。伸び幅は勝率・出現率ともにレーンで最も大きい値です。孫尚香は出現率が2.39%から2.19%へ下がり、こちらは下げ幅がレーン最大でした。同じく強化された公孫離は、BAN率が0.14%から0.18%に上がりました。勝率は46.36%から46.4%とほぼ変わらず、17位から動いていません。11月6日版にパッチ後の試合がどこまで入っているかは未確認です。',
        '勝率の首位はルアンナで、53.45%から53.02%に下げながらも1位を守りました。2位の伽羅は52.96%で、差は0.06ポイントしかありません。B評価のアレッシオは52.62%で4位から3位に上がり、仁傑（52.57%）と入れ替わっています。勝率を最も落としたのは元流の子（マークスマン）でした。50.08%から49.57%へ0.51ポイント下がり、13位から15位になっています。A評価の魯班7号は45.93%で、前回に続いて勝率がレーン最下位です。S評価の3体は勝率11位・13位・16位で、10位以内にはいません。BAN率は白龍が2.18%から2.13%に下げつつも首位で、2位の伽羅（0.36%）を大きく上回ります。',
      ],
      en: [
        'No hero changed tier this time, so farm keeps the same three S, six A, seven B and two C. The biggest mover was Hou Yi, one of the heroes buffed in the November 5 update. His win rate rose 1.27 points from 49% to 50.27%, lifting him from 16th to 13th. His pick rate grew 0.35 points from 2.46% to 2.81%, keeping him first. Both gains are the largest in the lane. Lady Sun\'s pick rate fell 0.20 points from 2.39% to 2.19%, the largest pick-rate drop in farm. Arli, also buffed, saw her ban rate rise from 0.14% to 0.18%. Her win rate barely moved, from 46.36% to 46.4%, and she stays 17th. Whether the November 6 data includes matches played after the patch, and how many, is unconfirmed; the collection period is not published.',
        'Luara keeps the top win rate despite slipping from 53.45% to 53.02%. Garo is second at 52.96%, just 0.06 points behind. B-tier Alessio moved up from fourth to third at 52.62%, swapping places with Di Renjie (52.57%). Flowborn (Marksman) had the largest win-rate drop, down 0.51 points from 50.08% to 49.57%, falling from 13th to 15th. A-tier Luban No.7 is again last in the lane on win rate at 45.93%. The three S-tier heroes rank 11th, 13th and 16th on win rate, so none makes the top 10. Ao\'yin\'s ban rate eased from 2.18% to 2.13% but still leads farm, far ahead of second-place Garo at 0.36%.',
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
        'Tierが動いたのは大喬の1体だけで、評価はAからBに下がりました。勝率は51.03%から50.84%へ0.19ポイント減り、順位は前回と同じ5位です。S・A評価はこれで7体から6体に減っています。大きく動いたのはイージスでした。出現率が1.62%から1.04%へ0.58ポイント落ち、順位は2位から5位になりました。下げ幅はレーンで最も大きい数字です。勝率は44.63%から45.53%へ0.9ポイント上がり、伸び幅はこちらもレーン最大でした。それでも勝率の順位は18体中18位で、前回と変わりません。',
        'BAN率の首位は、前回に続いてイージスです。数字は4.39%から4.23%に下がりました。それでも2位の東皇太一（2.87%）を1.36ポイント上回ります。この4.23%は全レーンで最も高い数字でした。東皇太一は出現率とBAN率をどちらも0.09ポイント上げ、伸び幅はともにレーン最大です。出現率の首位はドリアの1.94%で、前回から順位を守っています。勝率の1位と2位も前回と同じで、C評価のラプール（54.77%）と啓（53.29%）です。S・A評価で勝率が最も高いのは、3位に入った蔡文姫の52.41%でした。S評価の3体は前回に続き、勝率で下から3つを占めています。',
      ],
      en: [
        'Da Qiao was the only roamer to change tier, slipping from A to B. Her win rate dipped 0.19 points, from 51.03% to 50.84%, and she stays fifth on win rate. That leaves six heroes in the S and A tiers, down from seven. The biggest swings belonged to Dunshan, whose pick rate fell 0.58 points, from 1.62% to 1.04%. That is the steepest drop in the lane and moves Dunshan from second to fifth on picks. The win rate went the other way, up 0.9 points from 44.63% to 45.53%, the largest gain among roamers, yet it is still the lowest of the 18.',
        'Dunshan again leads the lane on ban rate. The rate eased from 4.39% to 4.23%, but that is still 1.36 points above second-placed Donghuang (2.87%) and the highest ban rate in any lane. Donghuang raised both his pick rate and his ban rate by 0.09 points, the largest increase in the lane on each count. Dolia keeps the top pick rate at 1.94%. C-tier Lapulapu (54.77%) and Sakeer (53.29%) hold the top two win rates, as they did last time. Cai Yan ranks third at 52.41%, the best among the S- and A-tier roamers. As before, the three S-tier heroes post the three lowest win rates in the lane.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
