/**
 * 「最初の1体」に向くヒーローの選定。
 *
 * 選び方は機械的に絞ってから、1体ずつ理由を書いている。
 *
 *   1. skills/ja.json の difficulty が「イージー」または「ノーマル」
 *   2. hero_stats_camp.json の勝率が48%以上
 *   → 47体が残る。ここからレーンごとに2体を選んだ。
 *
 * 優先したのは、難易度イージーであること、出現率が高く情報を探しやすいこと、
 * そして「移動スキルが無い」「タイミング操作が要る」といった弱みが
 * 最初の1体としてつまずきやすいものでないこと。
 *
 * 難易度イージーが1体もいないレーン（ジャングル）は、その旨をページに書く。
 * 数字は勝率・出現率とも campStats の取得日時点のもので、表示側で日付を出す。
 *
 * reason は各ヒーローの strengths / weaknesses（ゲーム内表示から書き起こした
 * スキルデータをもとにした当サイトの解説）と矛盾しない範囲で書いている。
 */

export type BeginnerPick = {
  /** hok_heroes.json の slug。詳細ページへのリンクに使う */
  slug: string;
  name: string;
  role: string;
  /** skills/ja.json の difficulty をそのまま */
  difficulty: string;
  /** なぜ最初の1体に向くか。2〜3文 */
  reason: string;
  /** 先に知っておくべき弱み。1文 */
  caveat: string;
};

export type BeginnerLane = {
  lane: string;
  /** そのレーンが何をする場所か。1〜2文 */
  summary: string;
  /** レーン固有の補足。無ければ省略 */
  note?: string;
  picks: BeginnerPick[];
};

export const BEGINNER_HEROES: { ja: BeginnerLane[]; en: BeginnerLane[] } = {
  ja: [
    {
      lane: 'クラッシュレーン',
      summary:
        '上側のソロレーン。1対1で殴り合いながら、前線を押し引きする場所です。硬いヒーローが多く、多少の判断ミスが即死につながりにくいので、最初のレーンとして勧めやすい。',
      picks: [
        {
          slug: 'arthur',
          name: 'アーサー',
          role: 'ファイター／タンク',
          difficulty: 'イージー',
          reason:
            'マナを使わず、2秒ごとに自動でHPが戻るため、レーンに居座り続けられる。撃ち合いに負けても回復を待てば立て直せるので、引き際の判断を覚える前でも試合が壊れにくい。スキル3は対象指定で外れず、最大HPの16%を削る割合ダメージなので、硬い相手にも通ります。',
          caveat: '遠距離から引き撃ちされると近づけないまま削られる。無敵やシールドは持たず、集中砲火への答えが回復しかない。',
        },
        {
          slug: 'bai-qi',
          name: '白起',
          role: 'タンク',
          difficulty: 'イージー',
          reason:
            'スキル1は被弾すると20%の確率で自動発動するので、操作していなくても回復が挟まります。範囲挑発は追加HPが増えるほど長くなり、最大2.5秒あれば敵のコンボを丸ごと止められます。乱戦のど真ん中にいるほど硬くなる設計なので、前に出る役の感覚を掴みやすい。',
          caveat: '序盤は追加HPが少なく挑発が約1秒しか続かない。早い時間のタワーダイブは裏目に出やすい。',
        },
      ],
    },
    {
      lane: 'ファームレーン',
      summary:
        '下側のレーン。ロームと2人で立ち、ラストヒット（CS）を集めて装備を揃える場所です。中盤以降の主火力を担うので、ゴールドの稼ぎ方を覚えるのに向いています。',
      picks: [
        {
          slug: 'hou-yi',
          name: '后羿',
          role: 'マークスマン',
          difficulty: 'イージー',
          reason:
            '通常攻撃を当て続けるだけで強化状態に入り、3本の矢を同時に撃てる。狙って出す操作が要らないぶん、立ち位置に集中できます。スキル2で離れた場所の視界を取れるので、茂みの確認を安全に済ませられるのも初心者向き。出現率2.74%はマークスマンで最多です。',
          caveat: '移動スキルが1つもない。接近を許すと自力では逃げられないので、フラッシュの温存が前提になる。',
        },
        {
          slug: 'di-renjie',
          name: '仁傑',
          role: 'マークスマン',
          difficulty: 'イージー',
          reason:
            'スキル2に無敵とデバフ解除が付いており、危険に気づいてから押しても間に合う場面が多い。マークスマンの一番の課題である「捕まると即死する」を、自分の操作で解決できます。殴るほど攻撃速度と移動速度が伸びるので、撃ちながら下がる動きも自然に身につく。',
          caveat: 'こちらも壁越えの移動手段は無い。スキル3を外すと拘束も防御減も失い、働きが半減する。',
        },
      ],
    },
    {
      lane: 'ジャングル',
      summary:
        'レーンに立たず、中立モンスターを狩って育ち、各レーンに奇襲（ガンク）を仕掛ける役です。試合を動かす影響力が最も大きい反面、負担も大きい。',
      note:
        'ジャングルで難易度イージーは趙雲の1体だけです。最初の1体としては、まずクラッシュかミッドで基礎を覚えてからでも遅くありません。',
      picks: [
        {
          slug: 'zhao-yun',
          name: '趙雲',
          role: 'ファイター',
          difficulty: 'イージー',
          reason:
            'HPが減るほど被ダメージ軽減が上がるため、瀕死からの粘りが利く。飛び込みの判断を間違えても生き残る余地があります。スキル3は外してもクールダウンが半分戻るので、ガンクを強気に試せるのも練習向き。勝率53.75%は候補の中で最も高い。',
          caveat: 'HP満タンのときは軽減が薄く、開幕のバーストで一気に落とされることがある。',
        },
        {
          slug: 'dian-wei',
          name: '典韋',
          role: 'ファイター',
          difficulty: 'ノーマル',
          reason:
            'ジャングルの周回が速く、レベルで先行しやすい。ガンクがうまくいかない試合でも、育つ速さそのものが有利として残ります。スキル2が当たれば攻撃速度が200%上がり、ライフスティールで殴り合いながら回復できる。',
          caveat: 'スキル2を外すと強化が半減する。接近手段が少なく、遠距離から引き撃ちされると何もできない。',
        },
      ],
    },
    {
      lane: 'ミッドレーン',
      summary:
        '中央のレーン。左右どちらのレーンにも短時間で移動できるため、ガンクの起点になりやすい場所です。メイジが立つのが基本。',
      picks: [
        {
          slug: 'daji',
          name: '妲己',
          role: 'メイジ',
          difficulty: 'ノーマル',
          reason:
            'スキル2が対象指定の必中スタン。狙いを外す心配がないので、コンボの順番だけ覚えれば火力を再現できます。パッシブの魔法防御減少と噛み合い、単体へのバーストは最高峰。茂みから奇襲を1回決めるだけで集団戦が決まることもあります。',
          caveat: '狐火の着弾がランダムで、複数の敵やミニオン処理は極端に苦手。移動スキルが無く、コンボ後の長いクールダウン中はほぼ無力。',
        },
        {
          slug: 'xiao-qiao',
          name: '小喬',
          role: 'メイジ',
          difficulty: 'ノーマル',
          reason:
            'スキル1の射程と威力で、レーンの削り合いを一方的に進められる。当てるたびに加速するので、当て続けている限り捕まりにくい。スキル2のノックアップは発生が早く、攻めにも自衛にも使えます。メイジの基本を学ぶ入門役として素直な性能。',
          caveat: '瞬間移動を持たず、対象指定のCCで捕まると逃げ場がない。スキル1はミニオン越しだと威力が落ちる。',
        },
      ],
    },
    {
      lane: 'ローム',
      summary:
        'レーンを固定せず動き回り、味方を守ったり集団戦の起点を作ったりする役です。ラストヒットを取らない分、操作の負担が軽い。',
      picks: [
        {
          slug: 'cai-wenji',
          name: '蔡文姫',
          role: 'サポート',
          difficulty: 'ノーマル',
          reason:
            'スキル3が範囲内で最もHPの低い味方を自動で選んで回復する。誰を回復するか迷わなくていいので、集団戦の混乱の中でも仕事が安定します。跳弾スタンは敵が密集するほど当たり、タワーダイブを止めるのに強い。',
          caveat: '自分の火力はほぼ無く、味方が削れないと勝ち筋を作れない。回復阻害を積まれると存在価値が半減する。',
        },
        {
          slug: 'liu-shan',
          name: '劉禅',
          role: 'サポート',
          difficulty: 'ノーマル',
          reason:
            'ノックアップとスタンを一人で繋げられるため、味方の合わせを待たずにCCチェーンが完結する。スキル1のシールドと加速で開戦の一歩目を安全に踏み込めます。スキルをタワーに当てるとHPが280戻るので、タワーを折りに行く動きも覚えやすい。',
          caveat: '全スキルが至近距離。カイトされると触ることすらできず、本人の火力も控えめ。',
        },
      ],
    },
  ],

  en: [
    {
      lane: 'Clash Lane',
      summary:
        'The solo lane at the top. You trade one-on-one and push the front line back and forth. The heroes here are durable, so a misread rarely kills you outright — which makes it an easy lane to start in.',
      picks: [
        {
          slug: 'arthur',
          name: 'Arthur',
          role: 'Fighter / Tank',
          difficulty: 'Easy',
          reason:
            'Arthur uses no mana and regenerates health every two seconds, so he can simply stay in lane. Losing a trade is recoverable by waiting for the regen, which means the game does not fall apart while you are still learning when to back off. His third skill is targeted — it cannot miss — and deals 16% of the target\'s maximum health, so it stays relevant against tanks.',
          caveat: 'Ranged heroes can kite him down before he closes the gap, and with no shield or immunity, healing is his only answer to focus fire.',
        },
        {
          slug: 'bai-qi',
          name: 'Bai Qi',
          role: 'Tank',
          difficulty: 'Easy',
          reason:
            'His first skill fires automatically when he takes damage, so he starts doing his job without any input from you. The area taunt scales with bonus health up to 2.5s, long enough to swallow an entire enemy combo. He is designed to get tougher the deeper into the fight he stands, which teaches the frontline role well.',
          caveat: 'Early on he has little bonus health, so the taunt lasts only about a second — diving towers before that scales tends to backfire.',
        },
      ],
    },
    {
      lane: 'Farm Lane',
      summary:
        'The bottom lane, played as a pair with the roamer. You collect last hits to build items and become the team\'s main damage later on — the best place to learn how gold works.',
      picks: [
        {
          slug: 'hou-yi',
          name: 'Hou Yi',
          role: 'Marksman',
          difficulty: 'Easy',
          reason:
            'Landing basic attacks alone builds him into an empowered state that fires three arrows at once. Nothing needs to be aimed or timed, so your attention can go to positioning instead. His second skill grants vision at range, which makes checking bushes safe. At 2.74% he is also the most-picked marksman in the game.',
          caveat: 'He has no movement skill at all. If someone reaches him he cannot escape on his own, so Flash has to be saved for that.',
        },
        {
          slug: 'di-renjie',
          name: 'Di Renjie',
          role: 'Marksman',
          difficulty: 'Easy',
          reason:
            'His second skill grants invulnerability and clears debuffs, so reacting after you notice the danger is often still fast enough. It hands you a personal answer to the marksman\'s core problem — dying the instant you are caught. Attacking also ramps his attack and movement speed, so kiting becomes natural.',
          caveat: 'He also has no way through terrain, and missing his third skill costs both the crowd control and the defense shred.',
        },
      ],
    },
    {
      lane: 'Jungle',
      summary:
        'Instead of holding a lane you clear neutral camps to level up and ambush the lanes. It carries the most influence over a game — and the most workload.',
      note:
        'There is no Easy-difficulty hero in the jungle at all. This lane alone is picked from the sturdiest of the Normal-difficulty heroes. There is nothing wrong with learning the fundamentals in Clash or Mid first and coming back to it.',
      picks: [
        {
          slug: 'zhao-yun',
          name: 'Zilong',
          role: 'Fighter',
          difficulty: 'Normal',
          reason:
            'His damage reduction rises as his health falls, so he survives dives that were misjudged. Missing his third skill still refunds half the cooldown, which means you can afford to test ganks aggressively. His 53.75% win rate is the highest of any hero on this page.',
          caveat: 'At full health that reduction is thin, and heavy burst can remove him before it ever ramps.',
        },
        {
          slug: 'dian-wei',
          name: 'Dian Wei',
          role: 'Fighter',
          difficulty: 'Normal',
          reason:
            'He clears the jungle quickly and tends to lead on levels, so even ganks that go nowhere do not leave you behind. When his second skill connects, his attack speed goes up 200% and lifesteal keeps him healthy through a straight fight.',
          caveat: 'Missing that second skill halves the payoff, and with few gap closers he is helpless against kiting.',
        },
      ],
    },
    {
      lane: 'Mid Lane',
      summary:
        'The centre lane. It reaches both side lanes quickly, so it tends to be where ganks start. Mages are the standard pick here.',
      picks: [
        {
          slug: 'daji',
          name: 'Daji',
          role: 'Mage',
          difficulty: 'Normal',
          reason:
            'Her second skill is a targeted stun that cannot miss, so once the combo order is memorised the damage is repeatable. It pairs with her magic-defense-shredding passive to give her the sharpest single-target burst in the game. One ambush out of a bush can settle a fight before it starts.',
          caveat: 'Her fox fires land randomly, making her poor at multi-target fights and wave clear. With no movement skill, the long cooldown after a full combo leaves her helpless.',
        },
        {
          slug: 'xiao-qiao',
          name: 'Xiao Qiao',
          role: 'Mage',
          difficulty: 'Normal',
          reason:
            'Her first skill out-ranges and out-damages most laners, and every hit speeds her up, so while you keep connecting you are hard to catch. Her second skill knocks up quickly enough to work as both an opener and an escape. A straightforward kit for learning what a mage actually does.',
          caveat: 'She has no blink, so a targeted stun leaves her nowhere to go, and her first skill loses power through minions.',
        },
      ],
    },
    {
      lane: 'Roam',
      summary:
        'You hold no lane, moving instead to protect teammates and start fights. Not taking last hits keeps the mechanical load light.',
      picks: [
        {
          slug: 'cai-wenji',
          name: 'Cai Yan',
          role: 'Support',
          difficulty: 'Normal',
          reason:
            'Her third skill automatically heals whichever ally in range is lowest, so there is no target to pick in the middle of a chaotic fight. Her bouncing stun hits more the tighter the enemy clumps, which makes her strong at breaking up tower dives.',
          caveat: 'She has almost no damage of her own, so she needs teammates who can convert. Anti-heal cuts her value roughly in half.',
        },
        {
          slug: 'liu-shan',
          name: 'Liu Shan',
          role: 'Support',
          difficulty: 'Normal',
          reason:
            'He chains a knock-up into a stun by himself, so the crowd control lands without waiting on anyone else. His first skill gives a shield and a speed boost for stepping into a fight safely, and hitting structures heals him, which teaches how to actually close out towers.',
          caveat: 'Every one of his skills is short range. Kited, he cannot touch anyone, and his own damage is modest.',
        },
      ],
    },
  ],
};
