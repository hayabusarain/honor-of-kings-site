/**
 * 一覧ページの下に出す解説文。
 *
 * 内容はゲーム内表示（グローバル版）で裏を取ったものだけを書いている。
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
      title: 'Hero Roster and Role Guide',
      lead: 'Complete hero database for Honor of Kings Global. Each hero features unique passive and active abilities tailored to diverse playstyles.',
      sections: [
        {
          heading: 'Roles and Classification',
          body: [
            'Heroes are grouped into six core roles based on their primary kit design. Heroes with secondary roles (such as Mulan, who is classified as both Fighter and Assassin) will appear under both role filters.',
          ],
          list: [
            { term: 'Tank', desc: 'High durability and engage potential. Absorbs damage on the front line in Clash Lane or Roam.' },
            { term: 'Fighter', desc: 'Balances sustained damage and survivability. Holds and pushes the Clash Lane.' },
            { term: 'Assassin', desc: 'High single-target mobility and burst damage. Ganks from the Jungle to eliminate squishy targets.' },
            { term: 'Mage', desc: 'Ranged area-of-effect magical damage and crowd control. Controls the Mid Lane.' },
            { term: 'Marksman', desc: 'Ranged sustained physical damage scaling into late game with items. Primary damage dealer in Farm Lane.' },
            { term: 'Support', desc: 'Protects allies with shields, healing, and movement utility while setting up team fights. (Roam)' },
          ],
        },
        {
          heading: 'Hero Details Overview',
          body: [
            'Clicking any hero opens their full profile, including exact skill damage scaling and cooldown tables per level, base stats, recommended summoner spells, and counter matchups.',
          ],
        },
      ],
      footnote:
        'Hero stats and skill data are verified against the global server in-game display.',
    },
    ja: {
      title: 'ヒーロー一覧とロールの解説',
      lead: 'Honor of Kings グローバル版に登場する全ヒーローのデータベースです。各ヒーローは固有のパッシブスキルとアクティブスキルを持ち、多様なプレイスタイルに対応しています。',
      sections: [
        {
          heading: 'ロール分類と役割',
          body: [
            'ヒーローはスキル構成の設計思想に基づいて6つの主要ロールに分類されています。（※花木蘭のようにファイターとアサシンを兼ねるなど、2つのロールを持つヒーローは双方のフィルタに表示されます）',
          ],
          list: [
            { term: 'タンク', desc: '高い耐久力とエンゲージ能力を持ち、クラッシュレーンやロームで敵陣の攻撃を受け止めます。' },
            { term: 'ファイター', desc: '継続火力と耐久力を兼ね備え、主にクラッシュレーンで前線を維持・押し込みます。' },
            { term: 'アサシン', desc: '高い瞬間火力と機動力を活かし、ジャングルから敵の後衛アタッカーを奇襲・撃破します。' },
            { term: 'メイジ', desc: '遠距離から強力な範囲魔法火力と行動妨害（CC）を与え、ミッドレーンをコントロールします。' },
            { term: 'マークスマン', desc: '装備が揃う中盤〜終盤にかけて無類の継続遠距離物理火力を発揮する、ファームレーンの主力です。' },
            { term: 'サポート', desc: 'シールドや回復、移動補助で味方を守り、集団戦のきっかけを作ります。（ローム枠）' },
          ],
        },
        {
          heading: 'ヒーロー詳細データの見方',
          body: [
            '各ヒーローの個別ページでは、ゲーム内表示通りのスキル詳細（レベルごとのダメージ上昇値・クールダウン一覧）、基本ステータス、推奨サモナースペル、有利・不利な相性ヒーローを確認できます。',
          ],
        },
      ],
      footnote:
        '※数値・スキルデータはグローバル版のゲーム内表示と照合しています。',
    },
  },

  items: {
    en: {
      title: 'Equipment System & Build Fundamentals',
      lead: 'The shop features 114 items categorized across six tabs: Physical, Magical, Defense, Movement, Jungling, and Roaming. Builds accommodate up to 6 item slots.',
      sections: [
        {
          heading: 'Key Mechanics & Rules',
          body: [
            'Boots Swapping: Upgraded boots (700g) can be swapped for free on a 5-minute cooldown after purchase, allowing flexible defensive transitions. (Boots of Deftness offers +70 Movement Speed).',
            'Jungle Items: Requires Smite. Reduces minion damage by 25% before 10:00 while increasing monster EXP & gold, preventing junglers from taking lane resources early.',
            'Roaming Items: Provides passive income without taking gold or experience from nearby lane allies.',
          ],
        },
        {
          heading: 'Roaming Auras & Actives',
          body: [
            'Guardian Family: Grants Physical/Magical Defense & HP regen aura to nearby allies (800 range).',
            'Crimson Shadow Family: Grants Attack Speed, Cooldown Reduction & Mana regen aura (800 range).',
            'Active Upgrades: Choose between Redemption (Shield), Starspring (Healing link), Howl (Move Speed boost), or Radiance (Scouting wave). Active cooldowns are shared team-wide.',
          ],
        },
      ],
      footnote:
        'Item stats, prices, and passives match the current global server in-game shop.',
    },
    ja: {
      title: '装備システムとビルドの基礎知識',
      lead: 'ショップには全114種のアイテムが存在し、物理・魔法・防御・移動・ジャングル・ロームの6カテゴリに分かれています。ビルド枠は最大6枠で、状況に応じた選択が勝利のカギとなります。',
      sections: [
        {
          heading: '重要システムとルール',
          body: [
            '靴の履き替えシステム: 上位靴（一律700G）は一度購入すれば、5分のクールダウン後に無料で別の靴へ切り替えられます。序盤に防御寄りの靴を選んでも、後半戦で別の靴に変更可能です。（※疾風の靴のみ移動速度が+70と高く設定されています）',
            'ジャングル装備とゴールド設計: 購入にはスマイトが必須です。10:00までミニオンへのダメージが25%下がる代わりに、モンスターからの経験値・ゴールドが増加します。これによりジャングラーが序盤にレーンの経験値を奪ってしまうのを防ぎます。',
            'ローム装備: 近くの味方のミニオン/モンスターゴールドを減らさず、専用の自動収入を得ます。',
          ],
        },
        {
          heading: 'ローム装備のオーラとアクティブ',
          body: [
            'ガーディアン系: 周囲の味方に物理・魔法防御とHP回復オーラを付与（範囲800）',
            '極影の盾系: 周囲の味方に攻撃速度・CD短縮・マナ回復オーラを付与（範囲800）',
            '完成形アクティブ: 救済（シールド）・星泉（回復）・奔狼（加速）・閃光（索敵）の4種のアクティブ効果を選択できます。（※クールダウンはチーム共有）',
          ],
        },
      ],
      footnote:
        '※アイテムのステータス・価格・効果はグローバル版の最新ショップデータに準拠しています。',
    },
  },

  arcana: {
    en: {
      title: 'Arcana System & Leveling Guide',
      lead: 'Arcana provide flat pre-match stat bonuses across 30 types in three colors (Red, Blue, Green), each scaling from Level 1 to 5.',
      sections: [
        {
          heading: 'Color Slots & Scaling Curve',
          body: [
            'Color Slots: Slots are independent per color — Red (Offense/Crit), Blue (Health/Sustain/Speed), and Green (Defense/Penetration/CDR). Choose the optimal arcana for your hero per color.',
            'Level 5 Upgrade Curve: Stat scaling increases non-linearly toward Level 5 (e.g., Saint grants +1 Magical Attack at Lv1, but scales to +5.3 at Lv5). Fully maxing selected Level 5 arcana yields vastly superior stats compared to spreading levels thin.',
          ],
        },
      ],
      footnote:
        'All 30 arcana list maximum Level 5 values verified against the global server in-game display.',
    },
    ja: {
      title: 'アルカナ表の読み方と育成ガイド',
      lead: 'アルカナは試合開始前にセットする固定のステータス補正です。赤・青・緑の3色（全30種）が存在し、それぞれレベル1〜5の段階を持ちます。',
      sections: [
        {
          heading: '色の役割と育成のコツ',
          body: [
            '色の役割と装着枠: スロット枠は色ごとに独立しているため、赤（攻撃・会心）、青（HP・移動速度・ライフスティール）、緑（防御・貫通・CD短縮）の中で、使うヒーローに最適な1枚を選びます。',
            'レベル5への集中育成曲線: アルカナはレベル5になるとステータスが大きく飛躍します（例：聖人はLv1で魔法攻撃+1ですが、Lv5では+5.3まで上昇）。そのため、多くのアルカナを浅く育てるより、特定のアルカナをレベル5まで育て切る方が圧倒的に効果的です。',
          ],
        },
      ],
      footnote:
        '※全30種のアルカナ数値はレベル5（最大値）を掲載しています。',
    },
  },

  spells: {
    en: {
      title: 'Summoner Spell Strategy Guide',
      lead: 'Players select one summoner spell (11 total) before a match. Choice depends on role, tactical need, and cooldown window (30s to 120s).',
      sections: [
        {
          heading: 'Key Spells & Tactical Roles',
          body: [
            'Smite (CD 30s): Required for jungle item purchases. Lowest cooldown spell, serving as the core farming tool for junglers.',
            'Flash (CD 120s): Instant terrain-crossing movement. Standard pick for positioning and escaping.',
            'Purify (CD 120s): Cleanses crowd control and grants brief CC immunity. Essential for heroes vulnerable to enemy stuns.',
            'Execute / Frenzy (CD 60s): Short 60s cooldown combat spells that enhance kill pressure and dueling power.',
          ],
        },
      ],
      footnote:
        'Spell descriptions and cooldowns match the global server in-game Common Skills display.',
    },
    ja: {
      title: 'サモナースペルの選択方針',
      lead: '試合前に1つ持ち込める共通スキル（全11種）です。クールダウン（30秒〜120秒）と用途によって戦術が大きく変わります。',
      sections: [
        {
          heading: '選び方のポイント',
          body: [
            'ジャングルはスマイト固定: スマイトはジャングル装備の購入条件となっており、クールダウンも最短の30秒でファームの主軸となります。',
            'フラッシュ (CD 120s): 壁抜け移動。ポジショニングや離脱の基本選択。',
            'ピュリファイ (CD 120s): 状態異常解除＆耐性。行動妨害で固められると厳しいヒーロー向け。',
            'ターミネート / バーサーク (CD 60s): 60秒という短さで回るため、集団戦やソロキルで頻繁にアドバンテージを取れます。',
          ],
        },
      ],
      footnote:
        '※スペル効果およびクールダウン数値はグローバル版のゲーム内表示に準拠しています。',
    },
  },

  tierList: {
    en: {
      title: 'Understanding the Tier List Data',
      lead: 'Tier lists summarize current hero performance trends under the active patch. Use it as a guide to understand meta dynamics rather than a strict ranking.',
      sections: [
        {
          heading: 'Interpreting Win Rate, Pick Rate, and Ban Rate',
          body: [
            'Win Rate vs Difficulty: High-skill heroes often show elevated win rates due to dedicated main players, while accessible heroes sit near 50% due to high general pick rates.',
            'Ban Rate: High ban rates indicate heroes that are difficult to counter in draft rather than just raw win rate dominance.',
            'Patch Adaptivity: Performance statistics settle over time following balance patches. Boundary tier ratings immediately after a patch are provisional.',
          ],
        },
      ],
      footnote:
        'Tier placements update automatically as new patch data arrives.',
    },
    ja: {
      title: 'Tier表の読み方とデータの視点',
      lead: '現パッチにおけるヒーローの相対的なパフォーマンス傾向をまとめた指標です。単なる強さの順位ではなく、環境の傾向を把握するためのガイドです。',
      sections: [
        {
          heading: 'データの読み方',
          body: [
            '勝率・ピック率・バン率の読み取り: 勝率だけで判断すると誤ります。高難易度ヒーローは熟練者が使うため勝率が高くなりやすく、扱いやすいヒーローは使用率が高く勝率50%付近に落ち着きます。また、バン率は「相手にして対処しづらいか」を示す指標です。',
            'パッチ直後の評価: 調整パッチ直後は環境が適応するまで時間がかかるため、Tier境界付近の評価は暫定的なものとなります。',
          ],
        },
      ],
      footnote:
        '※Tier評価は集計データに基づき最新パッチごとに更新しています。',
    },
  },
};
