/**
 * 一覧ページの下に出す解説文。
 *
 * 内容はゲーム内表示（グローバル版）で裏を取ったものだけを書いている。
 * 数値はパッチで変わるため、断定が必要な箇所には検証時点を添えること。
 */

export type ListNotesKey = 'heroes' | 'items' | 'arcana' | 'spells' | 'tierList';

type Section = {
  heading: string;
  body: string[];
  list?: { term: string; desc: string }[];
};

type Notes = {
  title: string;
  lead: string;
  sections: Section[];
  footnote: string;
};

export const LIST_NOTES: Record<ListNotesKey, { en: Notes; ja: Notes }> = {
  heroes: {
    en: {
      title: 'About the hero roster',
      lead: 'Honor of Kings currently has 116 playable heroes on the global server. Every hero on this page carries the same four skill slots the game itself shows: a passive plus three active skills, with a handful of heroes carrying a fourth.',
      sections: [
        {
          heading: 'Roles, and why the numbers do not add up to 116',
          body: [
            'Heroes are grouped into six roles, but many heroes carry two. Mulan is filed as both Fighter and Assassin, which is why the per-role counts add up to more than the roster size. Filtering by a role shows every hero who can be played there, not only those whose primary role it is.',
            'The role a hero is listed under describes what the kit is built for, not where you are forced to play them. Lane assignment in a real match depends on the draft, and a Mage listed here may still be picked into the jungle or the roaming slot.',
          ],
          list: [
            { term: 'Tank', desc: 'Absorbs damage and starts fights. Usually clash lane or roaming.' },
            { term: 'Fighter', desc: 'Trades sustained damage for durability. Most often clash lane.' },
            { term: 'Assassin', desc: 'Bursts down single targets. Usually jungle.' },
            { term: 'Mage', desc: 'Area damage and control from range. Usually mid lane.' },
            { term: 'Marksman', desc: 'Sustained ranged damage that scales with items. Usually farm lane.' },
            { term: 'Support', desc: 'Protects and enables teammates. Roaming slot.' },
          ],
        },
        {
          heading: 'What each hero page contains',
          body: [
            'Opening a hero gives the full skill text with the level-by-level damage and cooldown tables exactly as the game displays them, plus base stats, recommended summoner spells, synergy and counter picks.',
            'Skill names in English follow the in-game wording. Where a skill transforms mid-cast, both forms are listed together, since the game only ever shows the form you are currently in.',
          ],
        },
        {
          heading: 'Searching',
          body: [
            'The search box matches on hero name, title, and reading. Japanese readings work in either kana, so ムーラン and むーらん both find Mulan. Numeric hero IDs work too if you know them.',
          ],
        },
      ],
      footnote:
        'Hero data on this page was checked against the in-game display on the global server. Values change with patches; where a number here disagrees with your client, trust the client and let us know.',
    },
    ja: {
      title: 'ヒーロー一覧について',
      lead: 'Honor of Kings のグローバル版には現在116体のヒーローがいます。このページの各ヒーローは、ゲーム内と同じくパッシブ＋アクティブ3つのスキル枠を持ちます（一部のヒーローは4つ目を持ちます）。',
      sections: [
        {
          heading: 'ロールと、合計が116にならない理由',
          body: [
            'ヒーローは6つのロールに分類されますが、多くのヒーローは2つを兼ねます。花木蘭はファイターとアサシンの両方に属するため、ロール別の合計は116を超えます。ロールで絞り込むと、そこで運用できるヒーローが全て表示されます。主ロールだけではありません。',
            'ここでの分類はキットの設計思想を表すもので、そのレーンに固定されるわけではありません。実戦での配置はドラフト次第で、メイジ表記のヒーローがジャングルやロームで選ばれることもあります。',
          ],
          list: [
            { term: 'タンク', desc: 'ダメージを受け止めて戦闘を始める。クラッシュレーンかローム。' },
            { term: 'ファイター', desc: '継続ダメージと耐久を両立する。多くはクラッシュレーン。' },
            { term: 'アサシン', desc: '単体を瞬間的に倒し切る。多くはジャングル。' },
            { term: 'メイジ', desc: '遠距離から範囲ダメージと妨害を行う。多くはミッドレーン。' },
            { term: 'マークスマン', desc: '装備で伸びる継続遠距離ダメージ。多くはファームレーン。' },
            { term: 'サポート', desc: '味方を守り、動きを作る。ローム枠。' },
          ],
        },
        {
          heading: '各ヒーローページの内容',
          body: [
            'ヒーローを開くと、ゲーム内表示そのままのスキル文と、レベルごとのダメージ・クールダウン表が出ます。基本ステータス、推奨サモナースペル、相性の良いヒーローと苦手なヒーローも載せています。',
            '英語のスキル名はゲーム内の表記に合わせています。詠唱中に形態が変わるスキルは、両方の形態を併記しています。ゲーム画面はその時点の形態しか表示しないためです。',
          ],
        },
        {
          heading: '検索について',
          body: [
            '検索欄はヒーロー名・称号・読みに対応しています。読みはカタカナとひらがなのどちらでも引けるので、「ムーラン」でも「むーらん」でも花木蘭が出ます。ヒーローIDでの検索も可能です。',
          ],
        },
      ],
      footnote:
        'このページのヒーローデータはグローバル版のゲーム内表示と照合しています。数値はパッチで変動します。手元のクライアントと食い違う場合はクライアントが正です。お知らせいただければ直します。',
    },
  },

  items: {
    en: {
      title: 'How equipment works',
      lead: 'There are 114 items in the shop, split across six tabs — Physical, Magical, Defense, Movement, Jungling and Roaming — each with a Basic and an Advanced tier. Your build has six slots, and one of them is almost always boots.',
      sections: [
        {
          heading: 'Boots are a fixed cost, and switchable',
          body: [
            'All six upgraded boots cost 700 gold and grant 50 Movement Speed on top of their individual effect. Once you own a pair, you can swap to a different upgraded pair free of charge on a five-minute cooldown, so a defensive pick early does not lock you out of a different choice later.',
            'Boots of Deftness is the exception worth knowing: it grants 70 Movement Speed instead of 50, trading the utility the others offer for raw pace.',
          ],
        },
        {
          heading: 'Jungle and roaming items change how gold reaches you',
          body: [
            'Jungling items require Smite to purchase. They cut monster damage taken by 25% and grant extra experience and gold from monsters, but before the 10:00 mark they deal 25% less damage to minions, which is what stops junglers from simply taking the lanes.',
            'Roaming items go the other way: the holder takes no share of nearby minion and monster kills, and instead earns a separate stream that scales up to the 20:00 mark. This is why a support standing in lane does not starve the carry next to them.',
          ],
        },
        {
          heading: 'The two roaming families',
          body: [
            'Roaming splits into Guardian and Crimson Shadow, both 850 gold at base and 2,080 fully upgraded. They differ in the aura they project to teammates within 800 units.',
            'Each family then offers the same four upgrade choices, and the active cooldown is shared across the team, so two roamers cannot chain the same effect back to back.',
          ],
          list: [
            { term: 'Guardian', desc: 'Physical and Magical Defense plus health regeneration.' },
            { term: 'Crimson Shadow', desc: 'Attack Speed, Cooldown Reduction and mana regeneration.' },
            { term: 'Redemption', desc: 'Shields teammates in range.' },
            { term: 'Starspring', desc: 'Links to a teammate and heals both of you.' },
            { term: 'Howl', desc: 'Ramps team Movement Speed for a rotation or a chase.' },
            { term: 'Radiance', desc: 'Scouting wave that damages, slows and reveals.' },
          ],
        },
      ],
      footnote:
        'Item names, stats, passives and prices on this page were read from the in-game shop on the global server and match it line for line. The Chinese server uses different gold values and occasionally different stats, so figures quoted elsewhere may not apply here.',
    },
    ja: {
      title: '装備の仕組み',
      lead: 'ショップには114種のアイテムがあり、物理・魔法・防御・移動・ジャングル・ロームの6タブに分かれ、それぞれベーシックとアドバンスの2階層を持ちます。ビルドは6枠で、うち1枠はほぼ常に靴です。',
      sections: [
        {
          heading: '靴は価格が一律で、履き替えられる',
          body: [
            'アップグレード後の靴6種はすべて700ゴールドで、固有効果に加えて移動速度+50が付きます。一度購入すれば、5分のクールダウンで別の靴に無償で履き替えられます。序盤に防御寄りを選んでも、後から別の選択肢を潰すことにはなりません。',
            '疾風の靴だけは例外で、移動速度が+50ではなく+70です。他の靴が持つ利便性を捨てて、純粋な速さに寄せた選択肢になります。',
          ],
        },
        {
          heading: 'ジャングルとロームは、ゴールドの入り方が変わる',
          body: [
            'ジャングル装備の購入にはスマイトが必要です。モンスターからの被ダメージが25%減り、経験値とゴールドが増える代わりに、10:00までミニオンへのダメージが25%下がります。これがジャングラーがレーンを食い荒らすのを防ぐ仕組みです。',
            'ローム装備は逆向きです。所持者は近くのミニオンやモンスターの取り分を受け取らず、代わりに20:00まで伸びる別枠の収入を得ます。サポートがレーンに立っていても隣のキャリーが枯れないのはこのためです。',
          ],
        },
        {
          heading: 'ローム装備の2系統',
          body: [
            'ローム装備はガーディアン系と極影の盾系に分かれ、基幹はどちらも850ゴールド、完成形は2,080ゴールドです。違いは800ユニット以内の味方に配るオーラの中身にあります。',
            'どちらの系統も同じ4種の完成形を選べます。アクティブのクールダウンはチームで共有されるため、ローマーが2人いても同じ効果を連続では撃てません。',
          ],
          list: [
            { term: 'ガーディアン', desc: '物理防御・魔法防御とHP自動回復。' },
            { term: '極影の盾', desc: '攻撃速度・クールダウン短縮とマナ回復。' },
            { term: '救済', desc: '範囲内の味方にシールドを張る。' },
            { term: '星泉', desc: '味方1人と繋がり、双方を回復する。' },
            { term: '奔狼', desc: 'チームの移動速度を上げる。展開や追撃に使う。' },
            { term: '閃光', desc: '索敵波でダメージ・減速・可視化を行う。' },
          ],
        },
      ],
      footnote:
        'このページのアイテム名・ステータス・パッシブ・価格は、グローバル版のショップ画面から読み取り、1行ずつ突き合わせています。中国版はゴールド価格が異なり、ステータスも一部違うため、他所の数値がそのままは当てはまりません。',
    },
  },

  arcana: {
    en: {
      title: 'Reading the arcana table',
      lead: 'Arcana are the flat stat bonuses you bring into a match before it starts. There are 30 of them in three colours, ten each, and every one has five levels. This page lists the level 5 values.',
      sections: [
        {
          heading: 'Colours are slots, not power tiers',
          body: [
            'Your loadout has a fixed number of slots per colour, so a red arcana never competes with a green one for space. Choosing well means picking the strongest option within each colour for the hero you are playing, not comparing across colours.',
            'The colours group loosely by what they do, though there is deliberate overlap.',
          ],
          list: [
            { term: 'Red', desc: 'Offence — attack, penetration, critical rate and damage.' },
            { term: 'Blue', desc: 'Sustain and pace — health, recovery, lifesteal, movement speed.' },
            { term: 'Green', desc: 'Defence and efficiency — resistances, penetration, cooldown reduction.' },
          ],
        },
        {
          heading: 'Levels do not scale evenly',
          body: [
            'Level 5 is worth substantially more than five times level 1, so a partially levelled page is weaker than the raw numbers suggest. Saint gives Magical Attack +1 at level 1 and +5.3 at level 5; Longevity goes from Max Health +14.1 to +75.',
            'Because of that curve, concentrating on fewer fully levelled arcana generally beats spreading progress thin across many.',
          ],
        },
        {
          heading: 'Single stat or split',
          body: [
            'Some arcana put everything into one stat, others split across two or three. Bulwark is Physical Defense +9 and nothing else; Reverberation spreads across Physical Defense, Magical Defense and Cooldown Reduction. The concentrated ones are stronger when you know exactly what you need, the split ones are more forgiving across a variety of heroes.',
          ],
        },
      ],
      footnote:
        'All 30 arcana on this page were checked against the in-game arcana screen at level 5. Names use the in-game English wording.',
    },
    ja: {
      title: 'アルカナ表の読み方',
      lead: 'アルカナは試合開始前に持ち込む固定のステータス補正です。全30種が3色に10種ずつ分かれ、それぞれ5段階のレベルを持ちます。このページはレベル5の数値を掲載しています。',
      sections: [
        {
          heading: '色は枠であって、強さの序列ではない',
          body: [
            '装着枠は色ごとに数が決まっているため、赤と緑が席を奪い合うことはありません。選択とは、使うヒーローにとって各色の中で最も効く1枚を選ぶことであり、色をまたいで比べる作業ではありません。',
            '色はおおまかな役割で分かれていますが、意図的に重なりも持たせてあります。',
          ],
          list: [
            { term: '赤', desc: '攻撃 — 攻撃力、貫通、クリティカル率と効果。' },
            { term: '青', desc: '継続力と機動 — HP、回復、ライフスティール、移動速度。' },
            { term: '緑', desc: '防御と効率 — 防御力、貫通、クールダウン短縮。' },
          ],
        },
        {
          heading: 'レベルの伸びは直線ではない',
          body: [
            'レベル5はレベル1の5倍を大きく超える価値があります。中途半端に育てたページは、数字の印象より弱くなります。聖人はレベル1で魔法攻撃+1、レベル5で+5.3。長寿は最大HP+14.1から+75まで伸びます。',
            'この曲線があるため、多くの種類に薄く配るより、少数を完全に育て切るほうが有利になります。',
          ],
        },
        {
          heading: '単一型と分散型',
          body: [
            '1つのステータスに全振りするものと、2〜3種に分散するものがあります。覇者は物理防御+9のみ。反響は物理防御・魔法防御・クールダウン短縮に分かれます。必要なものが明確なら単一型が強く、幅広いヒーローで使い回すなら分散型が扱いやすくなります。',
          ],
        },
      ],
      footnote:
        'このページの全30種はゲーム内のアルカナ画面（レベル5表示）と照合しています。英語名はゲーム内表記に合わせています。',
    },
  },

  spells: {
    en: {
      title: 'Choosing a summoner spell',
      lead: 'You bring one summoner spell into a match. There are eleven, and the choice matters more than it looks — cooldowns run from 30 to 120 seconds, and several of them gate an entire playstyle rather than just adding an effect.',
      sections: [
        {
          heading: 'Smite is not optional for jungling',
          body: [
            'Jungle items cannot be purchased without Smite equipped. If you intend to jungle, the choice is made for you. Smite also carries the shortest cooldown of the eleven at 30 seconds, because it is a farming tool first and a combat tool second.',
          ],
        },
        {
          heading: 'The rest divide by what they answer',
          body: [
            'Outside the jungle the question is which problem you expect to face most often — getting caught, getting locked down, or failing to finish a kill.',
          ],
          list: [
            { term: 'Flash', desc: 'Repositioning over terrain. The default pick for most roles.' },
            { term: 'Purify', desc: 'Removes crowd control and grants brief immunity. For heroes that die while stunned.' },
            { term: 'Sprint', desc: 'Movement speed and slow resistance. Rotation and escape.' },
            { term: 'Execute', desc: 'True damage scaling with the target’s missing health. Closes out kills.' },
            { term: 'Heal', desc: 'Restores health to you and nearby teammates.' },
            { term: 'Frenzy', desc: 'Damage, resistance and lifesteal for a short window.' },
            { term: 'Stun', desc: 'Short area stun. Reliable engage or interrupt.' },
            { term: 'Intimidate', desc: 'Cuts nearby enemy damage and raises your own reduction.' },
            { term: 'Disrupt', desc: 'Silences enemy structures, or protects allied ones.' },
            { term: 'Teleport', desc: 'Channelled move to an allied structure or minion.' },
          ],
        },
        {
          heading: 'Cooldowns are part of the decision',
          body: [
            'Flash, Heal and Purify all sit at 120 seconds, the longest in the set. Execute and Frenzy come back in 60. A spell you can use twice in a teamfight window is a different tool from one you get once per skirmish, even when the immediate effect looks smaller.',
          ],
        },
      ],
      footnote:
        'Spell descriptions and cooldowns on this page were read from the in-game Common Skills screen on the global server.',
    },
    ja: {
      title: 'サモナースペルの選び方',
      lead: '試合に持ち込めるサモナースペルは1つです。全11種あり、見た目以上に選択が重要です。クールダウンは30秒から120秒まで幅があり、いくつかは効果を足すというより立ち回りそのものを決めます。',
      sections: [
        {
          heading: 'ジャングルにスマイトは必須',
          body: [
            'ジャングル装備はスマイトを装備していないと購入できません。ジャングルを担当するなら選択の余地はありません。スマイトのクールダウンは11種で最短の30秒です。戦闘用である以前にファーム用の道具だからです。',
          ],
        },
        {
          heading: '残りは「何に困るか」で分かれる',
          body: [
            'ジャングル以外では、最も頻繁に直面する問題がどれかで決まります。捕まること、拘束されること、あるいは倒し切れないこと。',
          ],
          list: [
            { term: 'フラッシュ', desc: '地形を越えて位置を変える。多くのロールでの既定選択。' },
            { term: 'ピュリファイ', desc: '妨害効果を解除し短時間の耐性を得る。拘束されると落ちるヒーロー向け。' },
            { term: 'ダッシュ', desc: '移動速度と減速耐性。展開と離脱。' },
            { term: 'ターミネート', desc: '相手の失ったHPに応じた確定ダメージ。倒し切るための一手。' },
            { term: 'ヒール', desc: '自分と周囲の味方のHPを回復する。' },
            { term: 'バーサーク', desc: '短時間、ダメージ・耐性・ライフスティールを上げる。' },
            { term: 'スタン', desc: '短い範囲スタン。確実な仕掛けと妨害。' },
            { term: 'ウィークネス', desc: '周囲の敵の与ダメージを下げ、自分の被ダメージを減らす。' },
            { term: 'ジャミング', desc: '敵の建物を沈黙させる。味方の建物を守ることもできる。' },
            { term: 'ワープ', desc: '詠唱して味方の建物やミニオンの隣へ移動する。' },
          ],
        },
        {
          heading: 'クールダウンも選択のうち',
          body: [
            'フラッシュ・ヒール・ピュリファイはいずれも120秒で、11種の中で最長です。ターミネートとバーサークは60秒で戻ります。集団戦の時間内に2回使えるスペルと、小競り合いごとに1回のスペルは、単発の効果が小さく見えても別物として扱うべきです。',
          ],
        },
      ],
      footnote:
        'このページのスペル説明とクールダウンは、グローバル版のコモンスキル画面から読み取っています。',
    },
  },

  tierList: {
    en: {
      title: 'How to read this tier list',
      lead: 'A tier list is a summary of how heroes are performing right now, at a particular skill level, under a particular patch. It is a starting point for narrowing a pool, not a ranking of which heroes are objectively better.',
      sections: [
        {
          heading: 'Win rate, pick rate and ban rate say different things',
          body: [
            'Win rate alone is misleading. Heroes that are difficult to play often show a high win rate simply because the people playing them have invested the practice, while easy heroes sit near 50% because everyone picks them.',
            'Ban rate is closer to a measure of how unpleasant a hero is to face. A hero with an unremarkable win rate and a high ban rate is usually one that is hard to answer in draft rather than one that is statistically dominant.',
          ],
        },
        {
          heading: 'Tiers move with patches, and lag behind them',
          body: [
            'After a balance patch, statistics take time to settle. The first days reflect players experimenting rather than the hero’s settled strength, and a hero that was adjusted may look stronger or weaker than it will once the meta adapts.',
            'If a patch has just landed, treat placements near tier boundaries as provisional.',
          ],
        },
        {
          heading: 'What this does not tell you',
          body: [
            'A tier list cannot account for your own comfort, your team composition, or the specific matchup in front of you. A B-tier hero you have hundreds of games on will usually outperform an S-tier hero you are learning.',
            'Use the list to find candidates, then check the hero page for counters and synergies before committing in draft.',
          ],
        },
      ],
      footnote:
        'Tier placements reflect aggregate performance data and are updated as new data arrives. Hero names, skills and item data throughout the site are checked against the in-game display on the global server.',
    },
    ja: {
      title: 'Tier表の読み方',
      lead: 'Tier表は、特定の帯・特定のパッチにおいて、いまヒーローがどう機能しているかの要約です。使うヒーローを絞り込むための出発点であり、客観的な優劣の順位ではありません。',
      sections: [
        {
          heading: '勝率・ピック率・バン率は別のことを示す',
          body: [
            '勝率だけを見ると判断を誤ります。操作が難しいヒーローは、使う人が練習を積んでいるという理由だけで勝率が高く出ます。逆に扱いやすいヒーローは、誰もが握るため50%付近に落ち着きます。',
            'バン率は「対面して嫌かどうか」に近い指標です。勝率が平凡でバン率が高いヒーローは、統計的に強いというより、ドラフトで対処しづらいヒーローであることが多いです。',
          ],
        },
        {
          heading: 'Tierはパッチで動き、しかも遅れて動く',
          body: [
            '調整パッチの直後は統計が落ち着くまで時間がかかります。最初の数日はヒーロー本来の強さではなく、プレイヤーが試している状態を映します。調整されたヒーローは、環境が適応した後の姿より強くも弱くも見えます。',
            'パッチ直後は、Tierの境界付近にいるヒーローの位置は暫定と考えてください。',
          ],
        },
        {
          heading: 'Tier表が答えないこと',
          body: [
            'Tier表は、あなた自身の習熟度、味方の構成、目の前の対面を考慮できません。数百戦を重ねたBランクのヒーローは、覚えたてのSランクより高い確率で結果を出します。',
            '候補を見つける用途に使い、ドラフトで確定する前にヒーローページで相性と苦手対面を確認してください。',
          ],
        },
      ],
      footnote:
        'Tierの配置は集計データに基づき、新しいデータが入り次第更新しています。サイト全体のヒーロー名・スキル・アイテムデータは、グローバル版のゲーム内表示と照合しています。',
    },
  },
};
