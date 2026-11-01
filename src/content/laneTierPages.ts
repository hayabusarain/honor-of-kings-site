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
export const LANE_COMMENTARY_STATS_DATE = '2026-10-30';

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
        '今回Tierが動いたのは、10月21日に強化された孫策の1体だけ。BからAに上がりました。勝率は48.1%から51.03%へ2.93ポイント伸びた。出現率は0.9%から1.5%へ0.6ポイント増え、順位は10位から2位に上がっている。どちらの伸び幅もレーンで最も大きい。同じ日に弱体化された夏侯惇はAにとどまり、勝率は53.18%から51.72%に下がりました。下げ幅1.46ポイントはレーン最大で、勝率の順位は2位から8位へ。弱体化された廉頗はBのままです。出現率は1.17%から1.02%に減り、0.15ポイントの減少はレーンで最も大きかった。',
        'S・A評価は李信、夏侯惇、チーシャ、影、孫策の5体になった。Sの李信は出現率1.72%とBAN率2.02%で、前回に続いてレーン首位。BAN率は2.25%から0.23ポイント下がった。下げ幅はフロレンティーノ（0.95%→0.72%）と並んでレーン最大です。BAN率の2位はミーユエの1.09%。勝率の上位はC評価が占める。首位のアタ（53.8%）から5位の達磨までの5体がCで、出現率はいずれも0.52%以下。李信の52.09%は、その次の6位に入っている。',
      ],
      en: [
        'Sun Ce, buffed on October 21, was the only clash hero to change tier, rising from B to A. His win rate climbed 2.93 points, from 48.1% to 51.03%, and his pick rate rose 0.6 points, from 0.9% to 1.5%, lifting him from 10th to 2nd on pick rate. Both gains are the largest in the lane. Dun, nerfed the same day, stays in A, but his win rate fell from 53.18% to 51.72%. That 1.46-point drop is the steepest in clash and takes him from 2nd to 8th on win rate. Lian Po, also nerfed, remains B tier. His pick rate slipped from 1.17% to 1.02%, the biggest fall in the lane at 0.15 points.',
        'The S and A tiers now hold five heroes: Li Xin, Dun, Chicha, Umbrosa and Sun Ce. S-tier Li Xin again leads the lane in both pick rate (1.72%) and ban rate (2.02%). His ban rate fell 0.23 points from 2.25%, tied with Florentino (0.95% to 0.72%) for the largest drop in clash. Mi Yue holds the second-highest ban rate at 1.09%. C-tier heroes fill the top of the win-rate table: the top five, from Ata at 53.8% down to Dharma, are all C tier, and none has a pick rate above 0.52%. Li Xin\'s 52.09% ranks sixth, right behind them.',
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
        'ジャングルでは3体のTierが動いた。10月21日に強化された阿軻はBからAへ。元流の子（アサシン）はAからB、百里玄策はBからCに下がった。阿軻は出現率を0.59%から0.71%、BAN率を0.87%から1.44%に伸ばしました。上げ幅はどちらもレーン最大で、BAN率の順位は5位から2位に上がった。勝率52.81%は8位で、S・A評価の4体では最も高い。元流の子（アサシン）のBAN率は1.01%から0.42%に下がった。下げ幅0.59ポイントは27体で最大です。百里玄策の勝率は52.87%から53.29%に伸び、順位も5位から3位に上がった。それでもCへの降格。',
        '10月21日に弱体化された趙雲は、B評価のまま勝率が54.67%から52.22%に下がった。2.45ポイントの下げ幅はレーンで最も大きく、首位から10位への後退です。出現率も1.19%から0.97%に減り、2位から4位に下がっている。勝率の首位はC評価のモンキ（54.2%）に替わり、2位の司馬懿（54.19%）との差は0.01ポイント。司馬懿は出現率が1.1%から0.79%に落ち、下げ幅0.31ポイントは27体で最大でした。S評価の大司命は、出現率1.56%とBAN率3.33%でどちらもレーン首位を守った。BAN率は2位の阿軻の2倍を超えています。',
      ],
      en: [
        'Three junglers changed tier. Arke, buffed in the October 21 update, rose from B to A, while Flowborn (Assassin) fell from A to B and Xuance from B to C. Arke\'s pick rate went from 0.59% to 0.71% and her ban rate from 0.87% to 1.44%, the biggest gains in the lane on both counts, lifting her from fifth to second on bans. Her 52.81% win rate ranks eighth, the best among the four S- and A-tier junglers. Flowborn (Assassin) saw its ban rate drop from 1.01% to 0.42%, a 0.59-point fall that is the steepest of all 27 junglers. Xuance was demoted even though his win rate climbed from 52.87% to 53.29%, moving him from fifth to third.',
        'Zilong, nerfed in the same update, stays in B tier, but his win rate fell from 54.67% to 52.22%. That 2.45-point drop is the largest in the lane and takes him from first to tenth. His pick rate also slipped, from 1.19% to 0.97%, dropping him from second to fourth. C-tier Menki now leads on win rate at 54.2%, just 0.01 points ahead of Sima Yi at 54.19%. Sima Yi\'s pick rate fell from 1.1% to 0.79%, the biggest drop among all 27 junglers. S-tier Augran still leads the lane on both pick rate (1.56%) and ban rate (3.33%), and that ban rate is more than double Arke\'s 1.44% in second place.',
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
        'S評価は6体から4体に減った。王維と溟月がSからAに下がり、楊貴妃がCからBに上がっています。王維は出現率が1.99%から1.04%に、BAN率が2.67%から1.41%に落ちた。下げ幅は2つともレーン最大。勝率は逆に50.51%から51.05%へ上がりました。楊貴妃は10月21日に強化されたヒーローの1体。勝率は49.84%から51.52%へ1.68ポイント伸び、レーン3位に入った。出現率も0.42%から0.69%に増え、どちらの伸び幅もレーン最大です。溟月の勝率は47.57%で、27体中26位。BAN率は2.19%と、張良に次ぐレーン2位だった。',
        '勝率の首位は女媧で54.03%。前回（53.72%）に続いて1位です。2位はC評価の扁鵲で、52.24%だった。アンジェラの勝率は51.74%から51.47%に下がり、2位から4位に後退。出現率は2.94%で前回に続いてレーン首位。全レーンを通しても最も高い数字です。張良のBAN率は4.17%から3.92%に下がったが、レーン首位は変わらない。全レーンではロームのイージス（4.39%）に次ぐ2位でした。孔明は勝率を51.17%から50.53%へ0.64ポイント落とし、下げ幅はレーン最大。出現率は1.49%から1.62%に増え、6位から3位に上がった。',
      ],
      en: [
        'The S tier shrank from six heroes to four. Wang Wei and Haya dropped from S to A, while Yuhuan rose from C to B. Wang Wei\'s pick rate fell from 1.99% to 1.04% and his ban rate from 2.67% to 1.41%, the largest drops in the lane on both counts. His win rate, on the other hand, rose from 50.51% to 51.05%. Yuhuan, one of the heroes buffed in the October 21 update, lifted her win rate from 49.84% to 51.52%, a 1.68-point gain that puts her third in mid. Her pick rate grew from 0.42% to 0.69%, and both increases are the largest in the lane. Haya\'s 47.57% win rate ranks 26th of 27, yet her 2.19% ban rate is second only to Liang\'s.',
        'Nuwa again has the best win rate in the lane, now 54.03%, up from 53.72%. C-tier Dr Bian is second at 52.24%. Angela\'s win rate slipped from 51.74% to 51.47%, moving her from second to fourth. Her 2.94% pick rate leads the lane and is the highest of any hero across all five lanes. Liang\'s ban rate eased from 4.17% to 3.92% but still leads mid; across all lanes, only roam newcomer Dunshan is higher, at 4.39%. Kongming\'s win rate fell 0.64 points, from 51.17% to 50.53%, the largest drop in mid. His pick rate rose from 1.49% to 1.62%, lifting him from sixth to third.',
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
        '10月21日に強化された孫尚香がAからSに上がり、S評価は白龍・后羿と合わせて3体になった。孫尚香は3つの数字がそろって伸びています。出現率は1.84%から2.39%へ0.55ポイント上がり、伸び幅はレーンで最も大きい。BAN率は0.09%から0.31%に増え、12位から3位へ。勝率は49.8%から50.4%で、順位は12位から11位でした。蒼はAからBに下がった。出現率は1.18%から0.96%へ0.22ポイント減り、下げ幅はレーン最大です。S・A評価は10体から9体に減り、18体のちょうど半数になった。',
        '勝率の首位は入れ替わった。A評価のルアンナが53.45%で1位に上がり、前回首位の伽羅は53.36%で2位。差は0.09ポイントです。3位はB評価の仁傑（53.01%）で、前回の4位から上がった。勝率を最も伸ばしたのは百里守約で、49.02%から50.55%へ1.53ポイント上がり、15位から10位になりました。下げ幅が最大だったのは蒙牙で、51.15%から50.17%へ0.98ポイント下がった。S評価の3体は勝率11位・15位・16位で、10位以内にいない。白龍はBAN率2.18%でレーン首位ですが、前回の2.52%からは下がっています。后羿は出現率2.46%で首位を保つ。',
      ],
      en: [
        'Lady Sun, buffed in the October 21 update, moved up from A to S, joining Ao\'yin and Hou Yi for three S-tier heroes in farm. All three of her numbers rose. Her pick rate climbed 0.55 points from 1.84% to 2.39%, the biggest gain in the lane, and her ban rate went from 0.09% to 0.31%, lifting her from 12th to 3rd. Her win rate edged up from 49.8% to 50.4%, 11th in the lane after 12th last time. Chano dropped from A to B. His pick rate fell 0.22 points from 1.18% to 0.96%, the largest decline in farm. The S and A tiers now hold 9 of the 18 heroes, exactly half, down from 10.',
        'The win-rate lead changed hands. A-tier Luara moved up to first at 53.45%, 0.09 points ahead of Garo (53.36%), who led last time. B-tier Di Renjie is third at 53.01%, up from fourth. Shouyue posted the lane\'s biggest win-rate gain, rising 1.53 points from 49.02% to 50.55% and climbing from 15th to 10th. Meng Ya had the largest drop, down 0.98 points from 51.15% to 50.17%. None of the three S-tier heroes is in the top 10 on win rate; they rank 11th, 15th and 16th. Ao\'yin still leads the lane on ban rate at 2.18%, though that is down from 2.52%. Hou Yi stays first on pick rate at 2.46%.',
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
        '10月21日のアップデートで登場したイージスが、初めての集計でS評価に入った。BAN率4.39%はロームの18体で最も高い。出現率は1.62%で、ドリアに次ぐ2位です。勝率44.63%はレーンの最下位。東皇太一もAからSに上がりました。勝率は48.14%から48.49%への小幅な伸びだ。BAN率は2.73%から2.78%に上がったものの、イージスに抜かれて1位から2位に下がっている。S評価はドリアを加えた3体で、勝率ではこの3体が下から3つを占める。A評価は蔡文姫・大喬・瑶・少司縁の4体です。',
        '前回から続けて載った17体は、全員が勝率を上げた。伸び幅が最も大きいのはB評価の荘子で、47.71%から49.37%へ1.66ポイント。鬼谷子と劉禅の伸びも1ポイントを超えている。出現率を上げたヒーローは1体もいませんでした。ドリアは2.46%から1.92%へ0.54ポイント下げ、下げ幅はレーン最大。それでも出現率は首位です。BAN率の下げ幅が最も大きいのは大喬で、1.12%から0.75%になった。勝率の1位と2位は、前回と同じC評価のラプール（55.02%）と啓（53.59%）。',
      ],
      en: [
        'Dunshan, who arrived in the October 21 update, debuted in the stats at S tier, with the highest ban rate of the 18 roamers (4.39%) and a 1.62% pick rate that trails only Dolia\'s. Dunshan\'s 44.63% win rate, however, is the lowest in the lane. Donghuang also moved up, from A to S. His win rate edged up from 48.14% to 48.49%, and his ban rate rose from 2.73% to 2.78%, but the newcomer pushed him from first to second on bans. With Dolia, that makes three S-tier roamers, and they hold the three lowest win rates in the lane. Cai Yan, Da Qiao, Yaria and Dyadia make up the A tier.',
        'All 17 returning roamers improved their win rates. B-tier Zhuangzi gained the most, 1.66 points, going from 47.71% to 49.37%. Guiguzi and Liu Shan also rose by more than a point. No roamer raised its pick rate. Dolia\'s fell the furthest, from 2.46% to 1.92%, a 0.54-point drop, yet it still leads the lane. Da Qiao had the biggest ban-rate decline, from 1.12% to 0.75%. C-tier Lapulapu (55.02%) and Sakeer (53.59%) again hold the top two win rates.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
