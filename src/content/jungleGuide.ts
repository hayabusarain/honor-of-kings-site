/**
 * ジャングル攻略の本文。
 *
 * 書いてある数字の出どころ:
 *   - スマイト 49/49 … hero_item_builds.json のジャングル26体・49セットを集計
 *   - 装備の採用率  … 同上（/items/usage と同じ集計）
 *   - 装備の解禁条件と対モンスター補正 … hok_items.json の passive をそのまま
 *   - ボスの出現時刻 … guide/bosses に載せている値
 *   - ヒーローの数と勝率 … hero_stats_camp.json
 *
 * キャンプの湧き時間と、どの順で回るかの秒単位の手順は書いていない。
 * ゲーム内で計測した記録が手元に無く、外部の記事も値が割れているため。
 */

export type JungleSection = {
  heading: string;
  /** 本文。1要素が1段落 */
  body: string[];
  /** 数字を並べたいときだけ使う。無ければ省略 */
  rows?: { term: string; desc: string }[];
};

export type JungleGuide = {
  lead: string;
  sections: JungleSection[];
  /** 出典の注記。日付は表示側が data_freshness から差し込む */
  sourceNote: string;
};

export const JUNGLE_GUIDE: { ja: JungleGuide; en: JungleGuide } = {
  ja: {
    lead: 'ジャングラーは、レーンに立たずに中立モンスターを狩って育つ担当です。稼いだレベルの差を、レーンへの奇襲とボス戦にぶつけていきます。3レーンのどこにでも行ける代わりに、何もしなければどこにも影響を残せません。',
    sections: [
      {
        heading: 'スマイトを持たないとジャングルは始まらない',
        body: [
          'ジャングル用の装備は、スマイトを選んでいないと購入できません。これはゲーム内の装備説明にそう書いてあります。持ち忘れると、モンスターからの被ダメージ25%減も、撃破時の獲得EXP増加も、まるごと手に入りません。',
          '当サイトが読み取ったジャングル26体・49通りの人気セットは、49通りすべてがスマイトでした。例外はありません。',
        ],
      },
      {
        heading: '購入できるジャングル装備は4種',
        body: [
          '250Gのハンターブレードが入口です。モンスターからの被ダメージが25%減り、撃破時の獲得EXPが20%増えます。',
          '700Gの3種はどれも同じ補正を持ちます。被ダメージ25%減、獲得EXP30%増、獲得ゴールド20%増。違うのは乗るステータスだけなので、ここは自分のヒーローに合わせて選びます。',
        ],
        rows: [
          { term: '三日月刀（700G）', desc: '魔法攻撃 +40。司馬懿やモンキのように魔法で狩るヒーロー向け' },
          { term: 'チェイスブレード（700G）', desc: '物理攻撃 +25。アサシンや物理型ファイターの標準' },
          { term: '巡視の斧（700G）', desc: '最大HP +400。序盤の削られ方がきついヒーロー向け' },
        ],
      },
      {
        heading: '中盤の軸はグリードバイト',
        body: [
          'ジャングルの人気セット49通りのうち、45通り（91.8%）にグリードバイトが入っていました。物理攻撃+90、クールダウン短縮+7.5%、移動速度+5%。ジャングルで最も採用率が高い装備です。',
          'ただし開戦から10分のあいだ、ミニオンに与えるダメージが25%減ります。レーンのミニオンを横取りして育つ動きとは噛み合いません。狩る対象はあくまでモンスターです。',
          '次に多いのはシャドーアックス（83.7%）、抵抗の靴（51.0%）、マスターブレード（42.9%）。レーン別の採用率は採用率ランキングで比べられます。',
        ],
      },
      {
        heading: '最初の1周とレベル4',
        body: [
          '狩り始めるキャンプは、最初にガンクしたいレーンで決めます。そのレーンに近い側から入れば、1周し終えたときに足が向いている状態になる。',
          'スキルのクールダウンと通常攻撃をつなげて、1分20秒前後でレベル4に届かせるのが目安です。レベル4はスキルが揃うタイミングで、ここからガンクが通り始めます。',
          'キャンプの合間には川の精霊を回収します。反撃してこないので、スマイトを使う必要はありません。',
        ],
      },
      {
        heading: 'ボスの時刻から逆算する',
        body: [
          'オーバーロードは2:00、タイラントは4:00に出現します。10:00でどちらもシャドウ系に置き換わり、20:00からはテンペストドラゴンが出ます。',
          'ジャングラーの動きは、この時刻から逆算して組み立てます。2:00にオーバーロードへ入るなら、それまでに1周を終えてレベルを作り、味方を呼んでおく。時間が来てから動き出すと、たいてい間に合いません。',
          '各ボスの効果と、討伐後の再出現までの時間はボス攻略にまとめてあります。',
        ],
      },
      {
        heading: '誰を使うか',
        body: [
          'ジャングルに立つヒーローは26体です。Tier表ではSが大司命の1体だけで、Aは孫悟空と瀾。この3体は出現率もBAN率も高く、対策される前提で使うことになります。',
          '勝率だけを見るとハロルド（55.32%）、百里玄策（53.67%）、ユンエイ（53.41%）が上位に来ます。いずれも出現率は1%未満で、使い手が限られているぶん数字が高く出ている点は割り引いて見てください。',
        ],
      },
    ],
    sourceNote: 'スマイトの比率と装備の採用率は、ゲーム内「推奨セット装備」の人気タブから読み取った26体・49通りを当サイトが集計したものです。装備の解禁条件と対モンスター補正はゲーム内の装備説明そのままで、ボスの出現時刻はボス攻略と同じ値を使っています。',
  },
  en: {
    lead: 'The jungler levels up on neutral monsters instead of holding a lane, then spends that level lead on ganks and objectives. Being able to go anywhere means nothing if you go nowhere.',
    sections: [
      {
        heading: 'No Smite, no jungle',
        body: [
          'Jungle items cannot be bought unless you have taken Smite — the in-game item text says so directly. Without it you lose the 25% reduction in monster damage and the bonus experience on every clear.',
          'Across the 26 jungle heroes and 49 popular sets we read from the game, all 49 take Smite. There are no exceptions.',
        ],
      },
      {
        heading: 'Four jungle items exist',
        body: [
          'Hunting Knife at 250 gold is the entry point: 25% less damage from monsters and 20% more experience per clear.',
          'The three 700-gold options all share the same bonuses — 25% less monster damage, 30% more experience, 20% more gold. Only the stat differs, so pick the one that matches your hero.',
        ],
        rows: [
          { term: 'Guerrilla Machete (700g)', desc: '+40 Magical Attack, for heroes like Sima Yi or Menki who clear with magic damage' },
          { term: 'Relentless Blade (700g)', desc: '+25 Physical Attack, the default for assassins and physical fighters' },
          { term: 'Patrol Axe (700g)', desc: '+400 Max Health, for heroes who struggle to survive the early clear' },
        ],
      },
      {
        heading: 'Rapacious Bite carries the mid game',
        body: [
          'Rapacious Bite appears in 45 of the 49 popular jungle sets (91.8%): +90 Physical Attack, +7.5% Cooldown Reduction, +5% Movement Speed. Nothing else in the jungle comes close.',
          'It does cut your damage to minions by 25% for the first ten minutes, so it does not reward farming lanes. Monsters are the target.',
          'Next come Axe of Torment (83.7%), Boots of Resistance (51.0%) and Master Sword (42.9%). The pick rate rankings let you compare these lane by lane.',
        ],
      },
      {
        heading: 'The first clear and level 4',
        body: [
          'Start on the side closest to the lane you intend to gank first, so the clear ends with you already facing the right way.',
          'Chain your skill cooldowns into auto-attacks and aim to hit level 4 around 1:20. Level 4 completes your kit, and that is when ganks start landing.',
          'Sweep the river sprites between camps. They do not fight back, so never spend Smite on them.',
        ],
      },
      {
        heading: 'Work backwards from the objective timers',
        body: [
          'Overlord spawns at 2:00 and Tyrant at 4:00. Both are replaced by their Shadow versions at 10:00, and Tempest Dragon arrives from 20:00.',
          'Plan around those clocks. If you want Overlord at 2:00, finish your clear, hit the level you need and call teammates before it spawns. Starting to move once the timer hits is usually too late.',
          'Each boss\'s buffs and its respawn delay are covered on the objectives page.',
        ],
      },
      {
        heading: 'Who to play',
        body: [
          'Twenty-six heroes are listed as junglers. Only Augran holds S tier; Wukong and Lam are A. All three carry high pick and ban rates, so expect to be planned against.',
          'By win rate alone the leaders are Feyd (55.32%), Xuance (53.67%) and Ying (53.41%). Each sits under 1% pick rate, so those figures reflect a small pool of dedicated players.',
        ],
      },
    ],
    sourceNote: 'The Smite share and item pick rates are this site\'s own tally of the 26 heroes and 49 sets read from the in-game recommended-builds screen. Unlock conditions and monster bonuses are quoted from the in-game item text, and the objective timers match the objectives page.',
  },
};
