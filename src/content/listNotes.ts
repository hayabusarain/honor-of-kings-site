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
      // 「多様なプレイスタイルに対応」の類は何も言っていない定型文なので、
      // このサイトの実際の強み（全116体に独自解説がある事実）を言う
      lead: 'All 116 Honor of Kings Global heroes, grouped into six roles. Every hero page carries this site\'s own strategy write-up — from laning to team fights — plus recommended combos, transcribed from and checked against the in-game display.',
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
            'Opening a hero shows the per-level damage and cooldown table for every skill, which skill to raise first (from the official app), the heroes they struggle against and pair well with — each with a written reason — recommended combos, a lane-by-lane strategy write-up, and that hero\'s patch history.',
            'Base stats are shown for the 113 heroes whose figures we could verify against the in-game display. For the remaining 3 the section is hidden rather than filled with a placeholder.',
          ],
        },
      ],
      footnote:
        'Hero stats and skill data are verified against the global server in-game display.',
    },
    ja: {
      title: 'ヒーロー一覧とロールの解説',
      // 「多様なプレイスタイルに対応」は何も言っていない定型文だった。
      // このサイトの実際の強み（全116体に独自解説がある事実）を冒頭で言う
      lead: 'Honor of Kings グローバル版の全116体を6つのロールに分けて掲載しています。全ヒーローの個別ページに、序盤から集団戦までの立ち回り解説とおすすめコンボを当サイトが書き起こしています。',
      sections: [
        {
          heading: 'ロール分類と役割',
          body: [
            'ヒーローはスキル構成の設計思想に基づいて6つの主要ロールに分類されています。（※ムーランのようにファイターとアサシンを兼ねるなど、2つのロールを持つヒーローは双方のフィルタに表示されます）',
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
            '各ヒーローのページで見られるのは、レベルごとのダメージとクールダウンを並べたスキル詳細、公式が示す「最初に上げるスキル」、理由つきの「苦手な相手」と「相性の良い味方」、おすすめコンボ、レーン別の立ち回り解説、そのヒーローのパッチ履歴です。',
            '基本ステータスは、ゲーム内表示と照合できた113体にだけ載せています。残る3体は既定値で埋めず、セクションごと出していません。',
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
      // 「current（最新）」は検証日なしでは言えない。日付は data_freshness.json の
      // {updatedAt} は ListNotes が data_freshness.json の staticData.items から埋める
      footnote:
        'Item stats, prices and passives are based on the global server in-game shop as of {updatedAt}.',
    },
    ja: {
      title: '装備システムとビルドの基礎知識',
      lead: 'ショップには全114種のアイテムが存在し、物理・魔法・防御・移動・ジャングル・ロームの6カテゴリに分かれています。ビルド枠は最大6枠です。靴は基礎の神速の靴が250G、そこから伸びる上位6種はいずれも700Gに揃っています。',
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
            '極影の盾系: 周囲の味方に攻撃速度・CD短縮・MP回復オーラを付与（範囲800）',
            '完成形アクティブ: 救済（シールド）・星泉（回復）・奔狼（加速）・閃光（索敵）の4種のアクティブ効果を選択できます。（※クールダウンはチーム共有）',
          ],
        },
      ],
      // 「最新」は検証日なしでは言えない。日付は data_freshness.json の
      // {updatedAt} は ListNotes が data_freshness.json の staticData.items から埋める
      footnote:
        '※アイテムのステータス・価格・効果は、{updatedAt}時点のグローバル版ショップデータに基づいています。',
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
            'Color Slots: There are 10 slots for each of red, blue and green — 30 in total, and the table shows the value of one slot. Slots are independent per color — Red (Offense/Crit), Blue (Health/Sustain/Speed), and Green (Defense/Penetration/CDR). Choose the optimal arcana for your hero per color.',
            'Level 5 Upgrade Curve: Stat scaling increases non-linearly toward Level 5 (e.g., Saint grants +1 Magical Attack at Lv1, but scales to +5.3 at Lv5). Fully maxing selected Level 5 arcana yields vastly superior stats compared to spreading levels thin.',
          ],
        },
      ],
      // 検証日なしの「verified against」をやめ、データ最終更新日（data_freshness.json の
      // {updatedAt} は ListNotes が data_freshness.json の staticData.arcana から埋める
      footnote:
        'All 30 arcana list their maximum Level 5 values, based on the global server in-game display as of {updatedAt}. The role builds above are this site\'s own reading of those values, not official data.',
    },
    ja: {
      title: 'アルカナ表の読み方と育成ガイド',
      lead: 'アルカナは試合開始前にセットする固定のステータス補正です。赤・青・緑の3色（全30種）が存在し、それぞれレベル1〜5の段階を持ちます。',
      sections: [
        {
          heading: '色の役割と育成のコツ',
          body: [
            '色の役割と装着枠: 装着枠は赤・青・緑それぞれ10枠、合わせて30枠あります。表の数値は1枠ぶんなので、実際に乗るのは最大でその10倍です。赤（攻撃・会心）、青（HP・移動速度・ライフスティール）、緑（防御・貫通・CD短縮）の中から使うヒーローに合う1種を選び、同じ色の枠を埋めます。',
            'レベル5への集中育成曲線: アルカナはレベル5になるとステータスが大きく飛躍します（例：聖人はLv1で魔法攻撃+1ですが、Lv5では+5.3まで上昇）。そのため、多くのアルカナを浅く育てるより、特定のアルカナをレベル5まで育て切るほうが効果的です。',
          ],
        },
      ],
      // {updatedAt} は ListNotes が data_freshness.json の staticData.arcana から埋める
      footnote:
        '※アルカナ数値は全30種ともレベル5（最大値）で掲載。数値は{updatedAt}時点のゲーム内表示に基づきます。上のロール別構成は公式データではなく、その数値をもとにした当サイトの解説です。',
    },
  },

  spells: {
    en: {
      title: 'Summoner Spell Strategy Guide',
      lead: 'Players select one summoner spell (11 total) before a match. Choice depends on role, tactical need, and cooldown window (30s to 120s).',
      sections: [
        {
          heading: 'What players actually take',
          body: [
            'Across the 227 recommended builds read from the game, Flash appears in 104 (45.8%), Smite in 58 (25.6%) and Heal in 19 (8.4%). Execute follows on 15, then Frenzy on 13, Purify on 7, Teleport and Stun on 4 each, Sprint on 2 and Intimidate on 1.',
            'The 58 builds that take Smite are exactly the 58 that buy a jungle item; the item cannot be bought without the spell, so there is no choice to make. They span 31 heroes: the 26 whose main lane is the jungle, plus five lane heroes that also keep a jungle build.',
            'Disrupt appears in none of the 227 builds. Intimidate turns up once, in Florentino\'s second build. Missing from the listed builds does not mean they never matter against the right opponent.',
          ],
        },
      ],
      // 検証日なしの「match」をやめ、データ最終更新日（data_freshness.json の
      // {updatedAt} は ListNotes が data_freshness.json の staticData.spells から埋める
      footnote:
        'Spell descriptions and cooldowns are based on the global server in-game Common Skills display as of {updatedAt}.',
    },
    ja: {
      title: 'サモナースペルの選択方針',
      lead: '試合前に1つ持ち込める共通スキル（全11種）です。クールダウン（30秒〜120秒）と用途によって戦術が大きく変わります。',
      sections: [
        {
          heading: '実際に選ばれているスペル',
          body: [
            'ゲーム内のおすすめビルド227通りを数えると、フラッシュ104通り（45.8%）、スマイト58通り（25.6%）、ヒール19通り（8.4%）の順でした。ターミネート15通り、バーサーク13通り、ピュリファイ7通り、ワープとスタンが各4通り、ダッシュ2通り、ウィークネス1通りと続きます。',
            'スマイトを取る58通りは、ジャングル装備を積んだ58通りとぴったり重なります。ジャングル装備はスマイトを選んでいないと買えないためで、ここに選択の余地はありません。主戦場がジャングルの26体に、レーン持ちながらジャングル型も残しているカイザーら5体を足した31体ぶんです。',
            'ジャミングは227通りのどれにも入っていません。ウィークネスも1通りだけで、フロレンティーノの2つ目に入っているのが唯一の例です。上位構成で選ばれないというだけのことで、対面によっては刺さる場面まで否定するものではありません。',
          ],
        },
      ],
      // {updatedAt} は ListNotes が data_freshness.json の staticData.spells から埋める
      footnote:
        '※スペル効果およびクールダウン数値は、{updatedAt}時点のグローバル版ゲーム内表示に基づいています。',
    },
  },

  tierList: {
    en: {
      title: 'Understanding the Tier List Data',
      lead: 'Tier lists summarize current hero performance trends under the active patch. Use them as a guide to understand meta dynamics rather than a strict ranking.',
      sections: [
        {
          heading: 'Interpreting Win Rate, Pick Rate, and Ban Rate',
          body: [
            'Win Rate vs Pick Rate: Heroes with a low pick rate swing more from game to game, because the sample comes from a small pool of dedicated players.',
            'Ban Rate: High ban rates indicate heroes that are difficult to counter in draft rather than just raw win rate dominance.',
            'Patch Adaptivity: Performance statistics settle over time following balance patches. Boundary tier ratings immediately after a patch are provisional.',
          ],
        },
      ],
      // 「自動更新」は事実に反していた（取得は手動実行）。data_freshness.json の
      // campStats.noteEn と矛盾しない表現にする。
      // ただし掲載文には取得手段（手動かどうか）を書かない。読者の行動が変わらない
      // 運営側の事情で、必要なのは「いつ時点の数値か」だけ（21c8e95 と同じ方針）
      footnote:
        'Tiers and statistics come from the official HoK Camp, so they may lag the live game. The date they were taken is shown at the top of this page.',
    },
    ja: {
      title: 'Tier表の読み方とデータの視点',
      lead: '現パッチにおけるヒーローの相対的なパフォーマンス傾向をまとめた指標です。単なる強さの順位ではなく、環境の傾向を把握するためのガイドです。',
      sections: [
        {
          heading: 'データの読み方',
          body: [
            '勝率・出現率・BAN率の読み取り: 勝率だけで判断すると誤ります。出現率が低いヒーローは使い手が限られるぶん数字が振れやすく、BAN率は「相手にして対処しづらいか」を示します。',
            'パッチ直後の評価: 調整パッチ直後は環境が適応するまで時間がかかるため、Tier境界付近の評価は暫定的なものとなります。',
          ],
        },
      ],
      // 「最新パッチごとに更新」は事実に反していた（取得は手動実行）。
      // data_freshness.json の campStats.noteJa と矛盾しない表現にする。
      // ただし掲載文には取得手段（手動かどうか）を書かない。読者の行動が変わらない
      // 運営側の事情で、必要なのは「いつ時点の数値か」だけ（21c8e95 と同じ方針）
      footnote:
        '※Tierと統計は公式HoK Campのものです。取得日はページ上部に表示。常時最新とは限りません。',
    },
  },
};
