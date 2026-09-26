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
export const LANE_COMMENTARY_STATS_DATE = '2026-09-25';

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
      ja: 'オナーオブキングス（HoK）のクラッシュレーン専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、クラッシュに登録されているヒーローだけに絞って載せています。',
      en: 'Clash Lane tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to that lane only.',
    },
    commentary: {
      ja: [
        '今回、廉頗・ミーユエ・呂布がAからBへ下がり、上がったヒーローはいません。5レーンのうち、降格しか出なかったのはクラッシュだけです。S・A評価は8体から5体に減った。S評価は李信のままで、出現率1.99%とBAN率2.53%はどちらもレーン首位。勝率51.34%は11位にとどまります。A帯の夏侯惇は勝率52.84%が3位、出現率1.44%が2位、BAN率0.57%が4位。3つとも4位以内に入るのは、レーンで夏侯惇だけです。',
        '廉頗はBへ下がったものの、勝率は52.49%から52.59%へ上がりました。S・A帯で廉頗より勝率が高いのは、夏侯惇しかいない。9月23日に強化された影は、出現率が0.9%から1.15%へ伸びてレーン5位に入った。伸び幅0.25ポイントはレーン最大。弱体化されたフロレンティーノは、勝率が51.62%から50.94%に下がった。BAN率1.56%は2位のままで、評価もAを保っています。同じく弱体化された元流の子（タンク）は、勝率が48.96%から49.38%へ上がりました。',
      ],
      en: [
        'No clash hero moved up this time. Lian Po, Mi Yue and Lu Bu all fell from A to B, making clash the only one of the five lanes where every tier change was a demotion. That trims S and A tier from eight heroes to five. Li Xin stays the lone S-tier pick and still leads the lane on both pick rate (1.99%) and ban rate (2.53%), though his 51.34% win rate ranks only 11th. In A tier, Dun places third on win rate (52.84%), second on pick rate (1.44%) and fourth on ban rate (0.57%). No other clash hero makes the top four on all three.',
        'Lian Po was demoted even as his win rate edged up from 52.49% to 52.59%; among the S and A heroes, only Dun wins more often. Umbrosa, buffed in the September 23 update, went from a 0.9% to a 1.15% pick rate and now ranks fifth in the lane. That 0.25-point jump is the largest in clash. Florentino, nerfed in the same update, slipped from 51.62% to 50.94% on win rate but keeps the second-highest ban rate at 1.56% and stays in A. Flowborn (Tank), also nerfed, went from a 48.96% to a 49.38% win rate.',
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
      ja: 'オナーオブキングス（HoK）のジャングル専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ジャングルに登録されているヒーローだけに絞って載せています。',
      en: 'Jungle tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to the jungle only.',
    },
    commentary: {
      ja: [
        'S評価は大司命の1体です。出現率1.51%とBAN率3.73%は、どちらも27体の首位。BAN率は2位の蘭陵王（1.47%）の2倍を超えます。A評価は孫悟空と瀾の2体から、4体に増えた。Bから上がった蘭陵王と、9月23日に実装された元流の子（アサシン）が加わっています。元流の子（アサシン）の出現率1.32%はレーン3位。勝率は48.28%で、27体中24位にとどまる。',
        '勝率の上位13体は、すべてB・C評価です。S・A帯で最も高い蘭陵王の50.63%でも14位。首位はB評価の趙雲で54.81%です。出現率0.99%もレーン5位で、A評価の蘭陵王（0.6%）を上回る。司馬懿は勝率を53.29%から53.91%へ上げたのに、BからCへ下がりました。百里玄策は逆で、勝率を53.52%から52.73%へ下げながらCからBへ上がっている。9月23日に強化された橘右京は、出現率が0.35%から0.55%に増えました。勝率は49.73%で、評価はCのまま。',
      ],
      en: [
        'Augran is the jungle\'s only S-tier hero and tops all 27 junglers on both pick rate (1.51%) and ban rate (3.73%). That ban rate is more than double the next highest, Gao Changgong\'s 1.47%. A tier has grown from two heroes, Wukong and Lam, to four. Gao Changgong joins them from B, along with Flowborn (Assassin), released on September 23. Flowborn (Assassin) already ranks third in the lane on pick rate at 1.32%, while its 48.28% win rate sits 24th of 27.',
        'The 13 best win rates in the jungle all belong to B- and C-tier heroes. Gao Changgong is the best of the S and A group at 50.63%, and that only ranks 14th. B-tier Zilong leads at 54.81%, and his 0.99% pick rate ranks fifth in the lane, ahead of A-tier Gao Changgong (0.6%). Some tier changes ran against win rate. Sima Yi raised his win rate from 53.29% to 53.91% and still fell from B to C, while Xuance slipped from 53.52% to 52.73% and climbed from C to B. Ukyo Tachibana, buffed on September 23, went from a 0.35% to a 0.55% pick rate. He wins 49.73% of games and stays in C.',
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
      ja: 'オナーオブキングス（HoK）のミッドレーン専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ミッドに登録されているヒーローだけに絞って載せています。',
      en: 'Mid Lane tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to that lane only.',
    },
    commentary: {
      ja: [
        'S評価は5体と、5レーンで最も多い。アンジェラ・張良・妲己・ミレディに、今回Aから上がった溟月が加わりました。溟月は3つの数字とも前回からほぼ横ばいで、勝率は48.31%から48.44%。26体中19位の勝率に対し、BAN率2.48%は張良（3.84%）に次ぐレーン2位です。ほかに棋星と不知火舞がCからB、太公望がBからCへ動いた。不知火舞は勝率を49.08%から48.29%へ下げての昇格でした。',
        '勝率の首位はA評価の女媧で53.81%。出現率1.04%はレーン8位にとどまります。勝率で下から2体は、S評価のミレディ（47.68%）とA評価の小喬（47.85%）でした。勝率と出現率の両方で上位5位に入るのはアンジェラだけ。出現率2.86%はレーン首位で、勝率51.48%は4位に入る。迷ったら、最初に覚える1体に向きます。9月23日に強化された元流の子（メイジ）は、出現率が0.43%から0.56%に増えた。勝率は51.35%から48.27%へ下がっています。',
      ],
      en: [
        'Mid has five S-tier heroes, more than any other lane: Angela, Liang, Daji and Milady, now joined by Haya, promoted from A in this update. Haya\'s three figures barely moved, with the win rate going from 48.31% to 48.44%. That win rate ranks 19th of 26, yet Haya\'s 2.48% ban rate is second in the lane, behind only Liang (3.84%). Elsewhere, Yixing and Mai Shiranui rose from C to B, and Ziya dropped from B to C. Mai Shiranui\'s promotion came even as the win rate fell from 49.08% to 48.29%.',
        'The top win rate belongs to A-tier Nuwa at 53.81%, though her 1.04% pick rate ranks only eighth in the lane. The two lowest win rates belong to S-tier Milady (47.68%) and A-tier Xiao Qiao (47.85%). Angela is the only hero in the top five on both win rate and pick rate: first in picks at 2.86% and fourth in wins at 51.48%, which makes Angela a sensible first mid hero to learn if you are unsure. Flowborn (Mage), buffed in the September 23 update, rose from a 0.43% to a 0.56% pick rate, while the win rate fell from 51.35% to 48.27%.',
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
      ja: 'オナーオブキングス（HoK）のファームレーン専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ファームに登録されているヒーローだけに絞って載せています。',
      en: 'Farm Lane tier list for Honor of Kings, showing the official HoK Camp tiers and statistics for the marksmen and other heroes registered to that lane only.',
    },
    commentary: {
      ja: [
        '18体のうちS・A評価は9体。ちょうど半数で、5レーンで最も高い割合です。今回はルアンナがBからAへ上がり、魯班7号がSからAへ下がりました。ルアンナの勝率は48.18%から52.7%へ4.52ポイント伸びた。上げ幅は5レーンの全ヒーローで最大です。いまはA評価の伽羅（53.55%）に次ぐレーン2位。魯班7号は勝率を51.79%から48.05%へ3.74ポイント下げ、18体中17位になった。下げ幅も5レーンで最大ですが、出現率2%はレーン2位を保っています。',
        'S評価の白龍と后羿は、勝率49.56%と49.18%でレーン14位と15位にとどまる。白龍はBAN率2.94%、后羿は出現率2.42%でレーン首位です。9月23日のアップデートでは、ファームの2体が調整を受けました。強化された蒼は勝率が50.87%から51.4%、出現率が0.78%から1.09%に上がっている。弱体化された元流の子（マークスマン）は、勝率が51.5%から49.83%へ下がりました。2体ともB評価のままです。',
      ],
      en: [
        'Nine of the 18 heroes here grade S or A. That is exactly half, the highest share of any lane. This time Luara moved up from B to A, and Luban No.7 dropped from S to A. Luara\'s win rate climbed from 48.18% to 52.7%, a 4.52-point rise that is the largest for any hero across the five lanes, and it now ranks second in the lane behind A-tier Garo (53.55%). Luban No.7\'s win rate fell from 51.79% to 48.05%, 17th of 18. That 3.74-point drop is also the largest across the five lanes, yet Luban No.7\'s 2% pick rate still ranks second in the lane.',
        'The two S-tier heroes, Ao\'yin and Hou Yi, win 49.56% and 49.18% of their games, only 14th and 15th in the lane. Where they lead is elsewhere: Ao\'yin has the lane\'s highest ban rate at 2.94%, Hou Yi its highest pick rate at 2.42%. Two farm heroes were adjusted in the September 23 update. Chano, buffed, went from 50.87% to 51.4% in win rate and from 0.78% to 1.09% in pick rate. Flowborn (Marksman), nerfed, slipped from 51.5% to 49.83%. Both stay in B tier.',
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
      ja: 'オナーオブキングス（HoK）のローム専用Tier表。公式「HoK Camp」のTierと勝率・出現率・BAN率を、ロームに登録されているヒーローだけに絞って載せています。',
      en: 'Roam tier list for Honor of Kings, showing the official HoK Camp tiers, win rates, pick rates and ban rates for the heroes registered to that role only.',
    },
    commentary: {
      ja: [
        'S評価は前回と同じく、蔡文姫とドリアの2体。蔡文姫は勝率51.31%、出現率1.18%、BAN率2.12%です。3つとも17体中3位以内に入るのは、蔡文姫しかいない。ドリアは出現率1.87%でレーン首位ながら、勝率47.35%は17体の最下位です。前回から評価が動いたのは大喬だけで、BからAへ上がった。大喬は9月23日のアップデートで強化されたヒーローです。勝率は48.45%から49.89%へ上がり、1.44ポイントの伸びはレーン最大。出現率も0.88%から1.09%に増えています。',
        '勝率の首位はC評価のラプールで54.8%、2位も同じC評価の啓で52.44%。前回の54.89%と52.49%からほぼ動かず、どちらもCのままです。A評価の4体は、そろって勝率5割を割っている。BAN率首位（2.54%）の東皇太一も、勝率は48.56%にとどまる。9月23日に実装された元流の子（サポート）は、初登場でB評価。勝率48.7%は14位ですが、出現率0.88%は6位です。A評価の東皇太一（0.73%）を上回り、B評価の5体では最も高い。',
      ],
      en: [
        'Cai Yan and Dolia remain the two S-tier roamers. Cai Yan wins 51.31% of games on a 1.18% pick rate and a 2.12% ban rate, and she is the only one of the 17 heroes to rank top three on all three figures. Dolia leads the lane on pick rate at 1.87%, yet her 47.35% win rate is the lowest of the 17. The only tier change among returning heroes is Da Qiao, up from B to A. Da Qiao was buffed in the September 23 update. Her win rate went from 48.45% to 49.89%, a 1.44-point gain that is the largest in the lane, and her pick rate from 0.88% to 1.09%.',
        'The top two win rates both belong to C-tier heroes: Lapulapu at 54.8% and Sakeer at 52.44%. Neither moved much from last time (54.89% and 52.49%), and both stayed in C. All four A-tier roamers win fewer than half their games, Donghuang included: he leads the lane on ban rate at 2.54% but wins only 48.56%. Flowborn (Roamer), released on September 23, debuts at B tier. The 48.7% win rate ranks 14th, while the 0.88% pick rate ranks sixth, ahead of A-tier Donghuang (0.73%) and the highest of the five B-tier heroes.',
      ],
    },
  },
];

export function findLanePage(slug: string): LaneTierPage | undefined {
  return LANE_TIER_PAGES.find(l => l.slug === slug);
}
