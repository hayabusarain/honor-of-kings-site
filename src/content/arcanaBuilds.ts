/**
 * ロール別のアルカナ構成。
 *
 * 公式はロール別のおすすめ構成を公開していない。ここに書いてあるのは、
 * hok_arcanas.json に載っている全30種のレベル5の数値だけを根拠にした当サイトの解説。
 * 「この色で最大」「この色で唯一」といった記述は、いずれも同ファイルを集計して確認している。
 *
 *   物理防御貫通の最大 = 鷹の目 +6.4（次点は変異 +3.6）
 *   魔法防御貫通の最大 = 心眼 +6.4（次点は夢魔 +2.4）
 *   魔法攻撃の最大     = 聖人 +5.3（次点は夢魔・凶兆 +4.2）
 *   最大HPの最大       = 長寿 +75（次点は獣痕・瞑想 +60）
 *   CD短縮の最大       = 憐憫 +1%（次点は生贄 +0.7%）
 *   物理防御の最大     = 覇者 +9 ／ 魔法防御の最大 = 霊山 +9
 *   赤で耐久に寄っているのは宿命だけ（HP+33.7・物理防御+2.3）
 *   青で物理攻撃と移動速度を同時に持つのは隠匿だけ
 *
 * 装着枠の数には触れない。ゲーム内表示で裏を取れていないため。
 */

export type ArcanaPick = {
  /** アルカナ名。hok_arcanas.json の name / name_en と揃える */
  name: string;
  /** 効果。hok_arcanas.json の stats / stats_en をそのまま写す */
  stats: string;
};

/** 構成の識別子。ヒーロー詳細がロール→構成を引くのに使う（配列の並びに依存しないため） */
export type ArcanaBuildId =
  | 'marksman-crit'
  | 'marksman-as'
  | 'mage'
  | 'assassin'
  | 'fighter'
  | 'tank-support';

export type ArcanaBuild = {
  /** ja / en で同じ id を付ける。並び順ではなくこの id で引く */
  id: ArcanaBuildId;
  role: string;
  /** どんなヒーローに向く構成か。1行 */
  target: string;
  red: ArcanaPick[];
  blue: ArcanaPick[];
  green: ArcanaPick[];
  /** なぜこの組み合わせになるか。2〜3文 */
  reason: string;
};

export const ARCANA_BUILDS: { ja: ArcanaBuild[]; en: ArcanaBuild[] } = {
  ja: [
    {
      id: 'marksman-crit',
      role: 'マークスマン（クリティカル型）',
      target: '装備が揃う中盤以降に通常攻撃で削り切る形',
      red: [{ name: '無双', stats: 'クリティカル率 +0.7%, クリティカル効果 +3.6%' }],
      blue: [{ name: '狩猟', stats: '攻撃速度 +1%, 移動速度 +1%' }],
      green: [{ name: '鷹の目', stats: '物理攻撃 +0.9, 物理防御貫通 +6.4' }],
      reason:
        '主火力が通常攻撃なので、攻撃速度と移動速度がそのまま「撃ちながら下がる」動きになる。緑は鷹の目の物理防御貫通+6.4が全30種で最大で、防御を積んだ前衛にも通る。赤をクリティカル率だけに寄せるなら禍源（+1.6%）という選択もある。',
    },
    {
      id: 'marksman-as',
      role: 'マークスマン（攻撃速度型）',
      target: 'クリティカル装備が揃うまでの序盤を厚くしたい場合',
      red: [{ name: '紅月', stats: '攻撃速度 +1.6%, クリティカル率 +0.5%' }],
      blue: [{ name: '略奪', stats: '物理ライフスティール +1.6%' }],
      green: [{ name: '鷹の目', stats: '物理攻撃 +0.9, 物理防御貫通 +6.4' }],
      reason:
        'クリティカルは装備が揃うまで機能しにくい。紅月で攻撃速度を先に確保し、略奪の吸収でレーンに残る時間を伸ばす組み方。中盤以降の最大火力ではクリティカル型に劣る。',
    },
    {
      id: 'mage',
      role: 'メイジ',
      target: 'スキルの一撃で落としにいく形',
      red: [
        { name: '聖人', stats: '魔法攻撃 +5.3' },
        { name: '夢魔', stats: '魔法攻撃 +4.2, 魔法防御貫通 +2.4' },
      ],
      blue: [{ name: '輪廻', stats: '魔法攻撃 +2.4, 魔法ライフスティール +1%' }],
      green: [
        { name: '心眼', stats: '攻撃速度 +0.6%, 魔法防御貫通 +6.4' },
        { name: '憐憫', stats: 'クールダウン短縮 +1%' },
      ],
      reason:
        '赤で魔法攻撃が最大なのは聖人の+5.3。貫通を早めに欲しいなら夢魔に振る。緑は、相手が魔法防御を積んでくるなら心眼（魔法防御貫通+6.4は全30種で最大）、スキルの回転を上げたいなら憐憫（CD短縮+1%が最大）で分かれる。',
    },
    {
      id: 'assassin',
      role: 'アサシン',
      target: 'ジャングルから後衛を奇襲する形',
      red: [{ name: '変異', stats: '物理攻撃 +2, 物理防御貫通 +3.6' }],
      blue: [{ name: '隠匿', stats: '物理攻撃 +1.6, 移動速度 +1%' }],
      green: [{ name: '鷹の目', stats: '物理攻撃 +0.9, 物理防御貫通 +6.4' }],
      reason:
        'ガンクの成否は、気づかれる前に届くかどうかで決まる。青30種のうち物理攻撃と移動速度を同時に持つのは隠匿だけで、火力を落とさずに到達速度を上げられる。赤と緑で貫通を重ねるのは、狙う相手が防御を積んでいなくても、装備が揃う前の火力不足を補うため。',
    },
    {
      id: 'fighter',
      role: 'ファイター',
      target: 'クラッシュレーンに居座って前線を維持する形',
      red: [{ name: '紛争', stats: '物理攻撃 +2.5, 物理ライフスティール +0.5%' }],
      blue: [{ name: '略奪', stats: '物理ライフスティール +1.6%' }],
      green: [{ name: '反響', stats: '物理防御 +2.7, 魔法防御 +2.7, クールダウン短縮 +0.6%' }],
      reason:
        'レーンに立っている時間が長いロールなので、削られたぶんを吸収で戻せるかが継続力に直結する。赤と青の両方にライフスティールを置くのはそのため。緑の反響は物理防御・魔法防御・CD短縮を1枚で取れるため、相手の構成が読めない段階でも腐らない。',
    },
    {
      id: 'tank-support',
      role: 'タンク・サポート',
      target: '前で受ける、あるいは味方を守る形',
      red: [{ name: '宿命', stats: '攻撃速度 +1%, 最大HP +33.7, 物理防御 +2.3' }],
      blue: [
        { name: '長寿', stats: '最大HP +75' },
        { name: '調和', stats: '最大HP +45, 1秒ごとのHP回復量 +5.2, 移動速度 +0.4%' },
      ],
      green: [
        { name: '均衡', stats: '物理防御 +5, 魔法防御 +5' },
        { name: '覇者', stats: '物理防御 +9' },
      ],
      reason:
        '赤10種のうち耐久に寄っているのは宿命だけで、このロールでは実質の指定席になる。青は、集団戦で殴られ続けるなら最大HPが最大の長寿、レーンを歩き回るなら回復と移動速度が付く調和。緑は相手に物理と魔法が混ざるなら均衡、物理に寄っているなら覇者（物理防御+9が最大）に振る。',
    },
  ],

  en: [
    {
      id: 'marksman-crit',
      role: 'Marksman (Critical)',
      target: 'Carrying through auto-attacks once items come online',
      red: [{ name: 'Unparalleled', stats: 'Critical Rate +0.7%, Critical Damage +3.6%' }],
      blue: [{ name: 'Hunt', stats: 'Attack Speed +1%, Movement Speed +1%' }],
      green: [{ name: 'Eagle Eye', stats: 'Physical Attack +0.9, Physical Pierce +6.4' }],
      reason:
        'Auto-attacks are the damage source, so attack speed and movement speed translate directly into kiting. Eagle Eye carries the highest Physical Pierce of all 30 arcana at +6.4, which is what keeps you relevant against a frontline stacking defense. If you would rather push raw crit chance, Calamity (+1.6%) is the alternative in red.',
    },
    {
      id: 'marksman-as',
      role: 'Marksman (Attack Speed)',
      target: 'Front-loading the early game before crit items land',
      red: [{ name: 'Red Moon', stats: 'Attack Speed +1.6%, Critical Rate +0.5%' }],
      blue: [{ name: 'Reaver', stats: 'Physical Lifesteal +1.6%' }],
      green: [{ name: 'Eagle Eye', stats: 'Physical Attack +0.9, Physical Pierce +6.4' }],
      reason:
        'Critical strike does little until the items exist. This build takes attack speed first through Red Moon and uses Reaver\'s lifesteal to stay in lane longer. It gives up peak damage later on compared with the crit build.',
    },
    {
      id: 'mage',
      role: 'Mage',
      target: 'Killing with a single burst rotation',
      red: [
        { name: 'Saint', stats: 'Magical Attack +5.3' },
        { name: 'Nightmare', stats: 'Magical Attack +4.2, Magical Pierce +2.4' },
      ],
      blue: [{ name: 'Reincarnation', stats: 'Magical Attack +2.4, Magical Lifesteal +1%' }],
      green: [
        { name: "Mind's Eye", stats: 'Attack Speed +0.6%, Magical Pierce +6.4' },
        { name: 'Compassion', stats: 'Cooldown Reduction +1%' },
      ],
      reason:
        'Saint holds the highest Magical Attack in red at +5.3; Nightmare trades some of that for early penetration. Green splits on the matchup — Mind\'s Eye when the enemy builds magic defense (its +6.4 Magical Pierce is the highest of all 30), Compassion when you want the rotation itself to come back faster (+1% CDR is the highest).',
    },
    {
      id: 'assassin',
      role: 'Assassin',
      target: 'Jungle ganks onto the enemy backline',
      red: [{ name: 'Mutation', stats: 'Physical Attack +2, Physical Pierce +3.6' }],
      blue: [{ name: 'Stealth', stats: 'Physical Attack +1.6, Movement Speed +1%' }],
      green: [{ name: 'Eagle Eye', stats: 'Physical Attack +0.9, Physical Pierce +6.4' }],
      reason:
        'A gank succeeds or fails on whether you arrive before you are seen. Stealth is the only blue arcana carrying both Physical Attack and Movement Speed, so the travel speed costs you no damage. Doubling up on penetration in red and green covers the pre-item damage gap even against targets who have not built defense.',
    },
    {
      id: 'fighter',
      role: 'Fighter',
      target: 'Holding the Clash Lane frontline',
      red: [{ name: 'Conflict', stats: 'Physical Attack +2.5, Physical Lifesteal +0.5%' }],
      blue: [{ name: 'Reaver', stats: 'Physical Lifesteal +1.6%' }],
      green: [{ name: 'Reverberation', stats: 'Physical Defense +2.7, Magical Defense +2.7, Cooldown Reduction +0.6%' }],
      reason:
        'This role stands in lane for long stretches, so how much chip damage you can heal back decides how long you hold. That is why lifesteal appears in both red and blue. Reverberation covers physical defense, magical defense and cooldown reduction in one pick, which keeps it useful before you know the enemy composition.',
    },
    {
      id: 'tank-support',
      role: 'Tank / Support',
      target: 'Absorbing damage up front or protecting the carry',
      red: [{ name: 'Fate', stats: 'Attack Speed +1%, Max Health +33.7, Physical Defense +2.3' }],
      blue: [
        { name: 'Longevity', stats: 'Max Health +75' },
        { name: 'Harmony', stats: 'Max Health +45, Recovery/s +5.2, Movement Speed +0.4%' },
      ],
      green: [
        { name: 'Fortify', stats: 'Physical Defense +5, Magical Defense +5' },
        { name: 'Bulwark', stats: 'Physical Defense +9' },
      ],
      reason:
        'Fate is the only one of the ten red arcana that leans defensive, which makes it the default here. In blue, take Longevity for the highest flat Health (+75) if you expect to be focused in fights, or Harmony when roaming, for the regeneration and movement speed. Green depends on the enemy: Fortify against mixed damage, Bulwark (+9, the highest Physical Defense) when they are physical-heavy.',
    },
  ],
};
