/**
 * おすすめビルド1本ごとの解説。
 *
 * ゲーム内「推奨セット装備」の人気タブは、何を積むかは出すが理由は出さない。
 * 2本並んでいても、何を狙った構成なのか、どちらを選べばいいのかが分からない。
 * その2点だけを当サイトが書き足している。
 *
 * ## スキルには触れない
 *
 * これはビルドの解説であって、スキルの解説ではない。スキルの説明は同じページの
 * スキル一覧に全文が載っているので、ここで繰り返す意味がない。それ以上に、
 * スキル仕様の読み違いが混じる原因になる。2026-08-31 の最初の版では 27本中15本が
 * スキルの説明に紙面を使い、検証で78件の指摘が出た。装備データだけを根拠にすれば、
 * その種の誤りは起きない。
 *
 * 根拠にしてよいのは次の2つだけ。
 *
 *   src/data/hok_items.json   の stats / passive / active
 *   src/data/hok_arcanas.json の stats（1枠ぶん。装着数を掛ける）
 *
 * 数値は必ず上から足し合わせて出す。体感で書かない。
 *
 * ## 2本の差が小さいときは、無理に対立軸を作らない
 *
 * ビルドが2本あるヒーロー111体のうち、装備の違いが1品以下なのは40体。
 * うち9体は装備が完全に同じでアルカナだけが違い、公孫離とタイガーに至っては
 * 並び順以外まったく同一だった（2026-08-31 集計）。
 * ここで「攻めの型」対「守りの型」のような対立を作ると嘘になる。
 *
 *   装備が3品以上ちがう … 構成の性格の対比で書く
 *   装備が1〜2品ちがう  … その差分の装備を選ぶ理由だけを書く
 *   アルカナだけちがう  … アルカナの差だけを書く
 *   中身が同じ          … 同じ構成だと正直に書く
 *
 * ## 3つを書く
 *
 *   label  何を狙った構成かの一言（10〜20字）
 *   when   どういう場面で選ぶか。ドラフト画面で判断できる条件にする
 *   text   その中身。装備の効果と数値で説明する。2〜4文
 *
 * when は「火力が欲しいとき」のような、読んでも選べない条件を書かない。
 * 差が小さいビルドでは、2本の条件が排他にならなくてよい。
 *
 * 未執筆のヒーローは、この表に載せない。載っていないビルドは解説なしで出る。
 *
 * 手順の全体は docs/BUILD_NOTES.md。材料は node scripts/build_notes_source.mjs で作る。
 */

export type BuildNote = {
  /** ビルド番号の隣に出す一言。10〜20字 */
  label: string;
  /** どういうときにこのビルドを選ぶか。ドラフト画面で判断できる条件にする */
  when: string;
  /** なぜそうなるのか。2〜4文 */
  text: string;
};

/** ヒーローID（hok_heroes.json の id）→ ビルドの並び順ぶんの解説 */
export const BUILD_NOTES: Record<string, { ja: BuildNote; en: BuildNote }[]> = {
  // 廉頗（Tank／CLASH）
  '105': [
    {
      ja: {
        label: 'スロウと物理防御733で止める',
        when: '敵の主力が物理側で、自分から前に出て止めたいとき',
        text: '1品目のガーディアン・閃光は、範囲1200の敵に現在HPの3%ダメージと最大50%のスロウを撒ける。3品目のフロストショックが4,810Gで立ち、ハードCCを受けると最大HPの10%シールドが15秒に1度付きます。6品目の覇者の重装まで積めば最大HP+7262、物理防御+733に届く。クールダウン短縮13.5%はビルド2の6%の倍以上で、差の7.5%はフロストショック1品ぶん。',
      },
      en: {
        label: 'Slows and 733 physical defense',
        when: 'When enemy damage is mostly physical and you want to start the fight yourself',
        text: 'Guardian - Radiance comes first, hitting enemies within 1200 range for 3% of their current HP and slowing them by up to 50%. Frigid Charge lands third at 4,810G, granting a shield worth 10% of max HP when hard CC connects, once every 15 seconds. Push through to Overlord\'s Platemail in the sixth slot and the totals reach +7262 max HP and +733 physical defense. Cooldown reduction sits at 13.5% against build 2\'s 6%, and the whole 7.5% gap comes from Frigid Charge alone.',
      },
    },
    {
      ja: {
        label: '味方シールドと魔法防御710',
        when: '敵に魔法攻撃と回復持ちがいて、味方を守りたいとき',
        text: '1品目のガーディアン・救済は、味方に240〜480＋最大HPの10%のシールドを60秒ごとに配れます。4品目の紅蓮のマントが6,840Gで立ち、範囲375の敵に最大HPの1.5%の魔法ダメージが入る。燃焼を受けた敵は、回復とライフスティールが35%落ちます。5品目の魔女のマントまで積めば魔法防御+710、ビルド1の+340の倍以上に伸び、追加魔法防御の15%は物理防御に変わる。',
      },
      en: {
        label: 'Team shields and 710 magic defense',
        when: 'When enemies bring magic damage and healing, and your allies need cover',
        text: 'Guardian - Redemption opens the build, handing allies a 240-480 plus 10% max HP shield every 60 seconds. Blazing Cape lands fourth at 6,840G, burning enemies within 375 range for 1.5% of their max HP. Anything the burn touches loses 35% of its healing and lifesteal. Stack through to Succubus Cloak and magic defense reaches +710, more than double build 1\'s +340, with 15% of that bonus magic defense converting into physical defense.',
      },
    },
  ],
  // 小喬（Mage／MID）
  '106': [
    {
      ja: {
        label: '4品目の賢者の怒りで魔法攻撃+30%',
        when: '敵に飛び込んでくる相手が少なく、中盤の火力を優先したいとき',
        text: '4品目に賢者の怒りを置き、7,000Gの時点で魔法攻撃が30%上乗せされる。合計の魔法攻撃は+1182で、ビルド2より50高い。代わりにヴォイドスタッフは5品目に下がり、魔法防御貫通45%が立つのは9,040Gから。魔法ライフスティールは24%、クールダウン短縮は15%で止まります。',
      },
      en: {
        label: 'Savant\'s Wrath fourth, +30% magic power',
        when: 'When nothing on the enemy team dives you and you want the midgame damage spike sooner.',
        text: 'Savant\'s Wrath goes fourth, so magic power runs 30% higher from 7,000 gold onward. That puts the total at +1182, fifty above build 2. Void Staff drops to fifth, which pushes its 45% magic defense penetration back to 9,040 gold. Magic lifesteal stops at 24% and cooldown reduction at 15%.',
      },
    },
    {
      ja: {
        label: '貫通を4品目に前倒し、5品目に無効化',
        when: '敵にバーストの高いアサシンがいて、集中砲火を受けやすいとき',
        text: 'ヴォイドスタッフを4品目に前倒しし、6,900Gで魔法防御貫通45%が立ちます。5品目のムーンライトスタッフは1.5秒すべての効果を無効化する（CD75秒）。その間は動けず攻撃もできないが、敵の集中砲火をここでやり過ごせます。賢者の怒りを外した魔法攻撃は+1132、魔法ライフスティールは36%、クールダウン短縮は22.5%。',
      },
      en: {
        label: 'Penetration early, plus a 1.5s stasis',
        when: 'When enemy assassins burst hard and focus fire is what actually ends your fights.',
        text: 'Void Staff moves up to fourth, so 45% magic defense penetration is live at 6,900 gold. Splendor lands fifth and nullifies every effect for 1.5 seconds on a 75-second cooldown. You cannot move or attack while it runs, but an opening burst lands on nothing. Without Savant\'s Wrath magic power sits at +1132, with 36% magic lifesteal and 22.5% cooldown reduction.',
      },
    },
  ],
  // 趙雲（Fighter／JUNGLE）
  '107': [
    {
      ja: {
        label: '最大HPを積んで殴り合う型',
        when: '敵に魔法ヒーローが1体以下で、HPを積んで押し切りたいとき',
        text: '1〜4品目はビルド2と共通で、分かれるのは5・6品目。ブラッドレイジと不死鳥の目を重ね、最大HPを+2750まで伸ばします。ブラッドレイジは通常攻撃に追加HPの1.5%の物理ダメージを上乗せし、HPが50%を切るとその分が25〜50%増える。不死鳥の目はHPを10%失うごとに回復効果を5%上げるが、合計の魔法防御は+280でビルド2より120低い。',
      },
      en: {
        label: 'Stack HP and trade',
        when: 'When at most one enemy hero deals magic damage and you want to win straight trades',
        text: 'The first four items match Build 2, so the split lands on slots five and six. Blood Rage and Eye of the Phoenix together push max HP to +2750. Blood Rage adds physical damage equal to 1.5% of bonus HP on every basic attack, and that bonus grows another 25-50% once Zhao Yun drops below half HP. Eye of the Phoenix raises healing by 5% per 10% HP lost, but total magic defense stops at +280 here, 120 below Build 2.',
      },
    },
    {
      ja: {
        label: '魔法防御と軽減で耐える型',
        when: '敵に魔法ヒーローが2体以上いて、集中砲火を受けやすいとき',
        text: '5品目に蒼天の剣、6品目に魔女のマントを置いた形。蒼天の剣が加わるとクールダウン短縮は合計37.5%で、ビルド1より10ポイント高い。スキルが敵ヒーローに命中すると3秒間は被ダメージが20%減り、アクティブなら3秒間30%軽減できます。魔女のマントは魔法防御+300と15秒ごとのシールドを足し、合計の魔法防御を+400まで押し上げる。',
      },
      en: {
        label: 'Magic defense and mitigation',
        when: 'When two or more enemy heroes deal magic damage and you get focused',
        text: 'Slot five becomes Pure Sky and slot six Succubus Cloak. Pure Sky brings total cooldown reduction to 37.5%, ten points above Build 1. For three seconds after a skill lands on an enemy hero, incoming damage drops 20%, and the active cuts another 30% for three seconds. Succubus Cloak adds 300 magic defense plus a shield every 15 seconds, lifting total magic defense to +400.',
      },
    },
  ],
  // 墨子（Mage／MID）
  '108': [
    {
      ja: {
        label: '火力は聖杯1品、残る5品は防御',
        when: '敵の物理と魔法のダメージ源が両方揃っているとき',
        text: '攻撃装備は3品目の聖杯だけで、魔法攻撃は+150。1品目の極影の盾・閃光が2080Gで最大HP+1200と移動速度+7.5%を先に立てます。2品目に700Gの抵抗の靴を挟むので、魔法防御+100と耐性25%増加が聖杯より先に入る。残る3品も防御に寄せ、最大HP+5612、物理防御+583、魔法防御+400、クールダウン短縮31%まで届きます。',
      },
      en: {
        label: 'One offense item, five defensive',
        when: 'When the enemy team splits its damage between physical and magic',
        text: 'The only offensive item is Holy Grail in slot three, worth 150 magic attack. Crimson Shadow - Radiance opens the build at 2,080G for 1,200 max HP and 7.5% movement speed. Boots of Resistance come second at just 700G, so 100 magic defense and the 25% tenacity bonus land before the Grail does. The last three items carry no attack stats at all, finishing at +5,612 max HP, +583 physical defense, +400 magic defense and 31% cooldown reduction.',
      },
    },
  ],
  // 妲己（Mage／MID）
  '109': [
    {
      ja: {
        label: '賢者の天書で魔法攻撃を上乗せする型',
        when: '敵に前衛が少なく、後衛を早く落としたいとき',
        text: '1品目の秘法の靴が700Gで魔法防御貫通60〜120を乗せる。4品目の神喰らいの書は魔法ライフスティール24%を、ビルド2より2,040G早く付けます。ビルド1だけの賢者の天書は魔法攻撃+350、刻印で魔法攻撃100ごとに被ダメージ軽減0.5%。総合計は魔法攻撃+1217、クールダウン短縮22%で、ビルド2より魔法攻撃が約111高い。',
      },
      en: {
        label: 'Sage\'s Tome for extra magic power',
        when: 'When the enemy draft is light on frontliners and you want the backline down fast.',
        text: 'Boots of the Arcane come first at 700G, putting 60-120 magical pierce on the board straight away. The fourth slot goes to Insatiable Tome, so its 24% magic lifesteal arrives 2,040G earlier than in build 2. Sage\'s Tome is exclusive to this build: +350 magic power, and its Enlightenment passive adds 0.5% damage reduction per 100 magic power. Totals come to +1217 magic power and 22% cooldown reduction, about 111 magic power above build 2.',
      },
    },
    {
      ja: {
        label: '魔法防御貫通を早く立て、回復も止める型',
        when: '敵に前衛や回復役がいて、削りを通したいとき',
        text: 'ヴォイドスタッフを4品目に繰り上げ、6,980Gで魔法防御貫通45%が立ちます。アルカナの夢魔10枠が魔法防御貫通+24を持つため、靴は疾風の靴で移動速度+70を取る。6品目の夢魔の牙は、命中した敵のHP回復とライフスティールを2.5秒間35%減らします。合計は移動速度+21%と最大HP+1550で、魔法攻撃+1105.6はビルド1より約111低い。',
      },
      en: {
        label: 'Magical pierce early, healing shut off',
        when: 'When the enemy has frontliners or a healer and your damage has to land.',
        text: 'Void Staff moves up to the fourth slot, so 45% magical pierce is online by 6,980G. Ten Nightmare arcana carry another 24 magical pierce, which frees the boot slot for Boots of Deftness and its +70 movement speed. Venomous Staff closes the build, cutting an enemy\'s health recovery and lifesteal by 35% for 2.5 seconds on hit. Totals land at 21% movement speed and +1550 max HP, with magic power at +1105.6, about 111 below build 1.',
      },
    },
  ],
  // カルラ（Mage／MID）
  '110': [
    {
      ja: {
        label: '回復阻害と移動速度を先に立てる',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '2品目は2,040Gの夢魔の牙で、累計2,740G。魔法攻撃+240に加え、敵のHP回復とライフスティールを35%減らす効果がここで付きます。5品目の賢者の怒りが魔法攻撃を30%増やし、合計は魔法攻撃+1037.8、魔法防御貫通+85.6。移動速度+17.5%はビルド2より7.5ポイント高く、前に出る速さで勝ります。',
      },
      en: {
        label: 'Early anti-heal, extra move speed',
        when: 'When the enemy team leans on healing or lifesteal to survive fights',
        text: 'Venomous Staff lands second at 2,040 gold, 2,740 into the build. It brings +240 magic attack and cuts enemy healing and lifesteal by 35%. Savant\'s Wrath in slot five raises magic attack by another 30%, closing at +1037.8 magic attack and +85.6 magic penetration. Movement speed finishes at +17.5%, 7.5 points above the other build, so you step up and rotate sooner.',
      },
    },
    {
      ja: {
        label: 'HP割合の削りと回転の速さを積む',
        when: '敵の前衛が厚く、HPの高いヒーローが2体以上いるとき',
        text: '3品目の苦痛のマスクは、スキルが命中すると3秒間に4回、相手の現在HPの3%を魔法ダメージで削る。ここまでで最大HP+1,400、6品そろえば+2,400まで伸び、クールダウン短縮も+40%に届きます。魔法攻撃の合計+1037.8は2本とも同じ。差は回転の速さと硬さで、代わりに移動速度は+10%に下がる。',
      },
      en: {
        label: 'Percent-HP damage and faster cooldowns',
        when: 'When two or more high-HP frontliners show up in the enemy draft',
        text: 'Mask of Agony comes third, dealing 3% of the target\'s current HP as magic damage four times over three seconds whenever a skill connects. Max HP sits at +1,400 by then, and the full six items take it to +2,400 alongside +40% cooldown reduction. Both builds land the same +1037.8 magic attack, so the gap is uptime and bulk — paid for with movement speed dropping to +10%.',
      },
    },
  ],
  // 孫尚香（Marksman／FARM）
  '111': [
    {
      ja: {
        label: '防御の靴とライフスティールで居座る',
        when: '敵に魔法ダメージ役が2体以上いて、集団戦で長く殴りたいとき',
        text: '1品目に700Gの抵抗の靴を置き、物理防御+50と魔法防御+100、耐性25%増を先に確保します。4品目のシャドーブレードは、クリティカルヒットごとに攻撃速度20%と移動速度5%を3.5秒間上乗せする。6品目のブラッドエッジまで積むと、アルカナ込みで物理ライフスティール37.8%、移動速度+9.5%、物理攻撃+414。もう1本より硬く、足も速い。',
      },
      en: {
        label: 'Resist boots and lifesteal to hold ground',
        when: 'When two or more enemies deal magic damage and you want to keep firing through long fights',
        text: 'Boots of Resistance opens at 700G, locking in 50 physical defense, 100 magic defense and a 25% resistance boost before anything else. Shadow Ripper lands fourth, adding 20% attack speed and 5% movement speed for 3.5 seconds on every critical hit. Bloodweeper closes it out, and with arcana counted the totals reach 37.8% physical lifesteal, +9.5% movement speed and +414 physical attack. That is tougher and quicker on its feet than the other build.',
      },
    },
    {
      ja: {
        label: '攻撃速度と割合ダメージで硬い敵を削る',
        when: '敵にタンクが2体以上いて、通常攻撃で削り切りたいとき',
        text: '1品目の速攻の靴は攻撃速度+20%に加え、通常攻撃のたびにHPを30〜60回復します。3品目にマスターブレードを入れて最大HP+600を先に確保し、エンドレスブレードは4品目に回す。仕上げのドゥームズデイは、通常攻撃ごとに80〜160＋対象の追加HPの7%を上乗せします。アルカナ込みの攻撃速度+87%と最大HP+1600はどちらももう1本を上回り、相手のHPが多いほど削りが伸びる。',
      },
      en: {
        label: 'Attack speed and percent damage against big HP',
        when: 'When the enemy fields two or more tanks and you need basic attacks to finish them',
        text: 'Boots of Dexterity opens with 20% attack speed and restores 30-60 HP on every basic attack. Master Sword comes third for its +600 max HP, pushing Eternity Blade back to the fourth slot. Doomsday closes the build, adding 80-160 plus 7% of the target\'s bonus HP to each basic attack. With arcana counted, +87% attack speed and +1600 max HP both beat the other build, and the damage grows with the HP the enemy stacks.',
      },
    },
  ],
  // 魯班7号（Marksman／FARM）
  '112': [
    {
      ja: {
        label: '攻撃速度で手数を積む型',
        when: '敵にHPを盛った前衛が2体以上いて、手数で削りたいとき',
        text: '靴の次はスパークダガーで、2,740Gから通常攻撃に40〜80の魔法ダメージが乗る。3回ごとの電撃は160〜400を足し、合計の攻撃速度は+115%まで伸びます。4品目の威光の弓が物理防御貫通を15%足し、遠距離型の魯班7号では倍の30%になる。5品目のドゥームズデイが対象の追加HPの7%を通常攻撃に上乗せするので、HPを盛った相手ほど手数で削れます。',
      },
      en: {
        label: 'Attack speed and on-hit damage',
        when: 'When two or more high-HP front-liners are on the enemy team and you want to grind them down with volume',
        text: 'Boots come first, then Sparkforged Dagger, so from 2,740G every basic attack carries 40-80 magic damage. Every third attack fires a spark for 160-400, and the finished build reaches +115% attack speed. Daybreaker\'s Virtue in the fourth slot adds 15% physical penetration, doubled to 30% on a ranged hero like Luban No.7. Doomsday then folds 7% of the target\'s bonus HP into each basic attack, so the bulkier the enemy, the more the volume of hits pays off.',
      },
    },
    {
      ja: {
        label: '貫通を早め、粘って撃ち続ける型',
        when: '敵の物理防御が高く、長く前に出て撃ち続けたいとき',
        text: '2品目のシャドーブレードでクリティカル率+20%を取り、合計は+56%まで届く。4品目の砕星の槌が6,930Gの時点で物理防御貫通を30%足し、ビルド1より約500G早く硬い相手へ通り始めます。グレートブレイカーも1品前倒しで、HPが50%を切った敵への追加30%が9,470Gで立つ。締めのブラッドエッジまで積めば最大HP+1,200、物理ライフスティール+33%で、前に出続けても引き下がらずに済みます。',
      },
      en: {
        label: 'Earlier penetration, sustain to keep firing',
        when: 'When enemies stack physical defense and you need to keep firing from up front',
        text: 'Shadow Ripper takes the second slot for 20% critical rate, bringing the build to +56%. Starbreaker lands at 6,930G, so its 30% physical penetration comes online about 500G earlier than Build 1\'s fourth item. Overlord\'s Might also moves up a slot, putting the 30% bonus damage against enemies under half HP in play at 9,470G. Bloodweeper closes the build out at +1,200 max HP and +33% physical lifesteal, enough to hold position instead of backing off.',
      },
    },
  ],
  // 荘子（Support／ROAM）
  '113': [
    {
      ja: {
        label: '重傷を早め、減速も足す',
        when: '敵にライフスティールで粘るヒーローが2体以上いるとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度20%とクールダウン15%短縮を、範囲800の味方にも半分配ります。3品目に紅蓮のマントを置くので、4,820Gの時点で燃焼と35%の回復・ライフスティール減少が入る。5品目の不吉な予兆は、攻撃してきた敵の攻撃速度を最大40%、移動速度を最大15%落とします。合計は最大HP+7562・物理防御+733で、ビルド2より物理防御が90高い。',
      },
      en: {
        label: 'Earlier anti-heal, added slow',
        when: 'When two or more enemy heroes sustain themselves through lifesteal',
        text: 'Crimson Shadow - Redemption goes first, handing Zhuangzi 20% attack speed and 15% cooldown reduction while allies within 800 range pick up half of it. Blazing Cape lands third, so the burn and its 35% cut to healing and lifesteal are running by 4,820 gold. Ominous Premonition in slot five strips up to 40% attack speed and 15% movement speed from whoever attacks him. The totals come to +7,562 max HP and +733 physical defense, 90 more physical defense than the other build.',
      },
    },
    {
      ja: {
        label: '防御オーラとシールドで支える',
        when: '味方の後衛が狙われやすく、シールドを何度も配りたいとき',
        text: '1品目のガーディアン・救済は、最大130の物理・魔法防御と5秒ごとのHP回復を、範囲800の味方にも半分配ります。3品目のサンライズケープでクールダウン短縮が10%付き、合計16%まで伸びる。敵ヒーローにダメージを与えると、10秒に1回、250〜500＋最大HPの4%のシールドが、付近でHPが最も少ない味方にも入ります。紅蓮のマントは5品目に回るので、35%の回復・ライフスティール減少はビルド1より4,060G分遅い。',
      },
      en: {
        label: 'Defense aura and repeat shields',
        when: 'When your backline keeps getting dived and needs shields on repeat',
        text: 'Guardian - Redemption opens with up to 130 physical and magic defense plus a heal of 0.6% max HP every 5 seconds, half of it passed to allies within 800 range. Dawnlight third adds 10% cooldown reduction, taking the build to 16%. Damaging an enemy hero puts out a shield of 250-500 plus 4% of max HP on Zhuangzi and the lowest-health ally nearby, once every 10 seconds. Blazing Cape slips to slot five, so the 35% anti-heal arrives 4,060 gold later than in build one.',
      },
    },
  ],
  // 劉禅（Support／ROAM）
  '114': [
    {
      ja: {
        label: 'HPを火力に変える支援型',
        when: '敵に回復持ちが多く、前に出て自分から削りたいとき',
        text: '1品目の極影の盾・閃光は、攻撃速度20%とクールダウン15%短縮のオーラを味方にも半分配ります。3品目にシャドーアックスを置き、物理攻撃80と物理防御貫通90〜180を防御装備より先に立てる。4品目の紅蓮のマントが範囲375の敵を燃やし、HP回復とライフスティールを35%落とします。5品目のブラッドレイジは通常攻撃に追加HPの1.5%を上乗せし、最大HP+5412を積むほど通常攻撃が重くなる。',
      },
      en: {
        label: 'HP-Scaling Damage Support',
        when: 'When the enemy roster leans on healing and you want to push up and chip them down yourself.',
        text: 'Crimson Shadow - Radiance opens, handing allies half of its 20% attack speed and 15% cooldown reduction aura. Axe of Torment lands third, bringing 80 physical attack and 90-180 physical penetration online ahead of the defensive pieces. Blazing Cape follows in the fourth slot, burning everything within 375 range and cutting enemy healing and lifesteal by 35%. Blood Rage lands fifth, adding 1.5% of bonus HP to every basic attack, so the +5412 max HP total makes each hit heavier.',
      },
    },
    {
      ja: {
        label: '物理防御790で前に立ち続ける',
        when: '敵の物理火力が多く、集団戦で先頭に立ち続けたいとき',
        text: '1品目のガーディアン・星泉は、物理・魔法防御65〜130と5秒ごとの最大HP0.6%回復を範囲800の味方にも半分渡します。3品目のブリザードで物理防御240とクールダウン短縮20%、5品目の不吉な予兆で物理防御をさらに300積む。合計は物理防御+790・クールダウン短縮+31%。ビルド1の+223・+16%を大きく上回ります。6品目の賢者の庇護なら、死亡2秒後に劉禅がその場で復活し、HPを2000〜3000取り戻す（1試合2回まで）。',
      },
      en: {
        label: 'Armor-Stacked Frontline',
        when: 'When the enemy damage is mostly physical and you need to hold the front line through team fights.',
        text: 'Guardian - Starspring opens, passing allies within 800 range half of its 65-130 physical and magic defense and its 0.6% max HP regen every 5 seconds. Glacial Buckler arrives third for 240 physical defense and 20% cooldown reduction, and Ominous Premonition adds 300 more physical defense in the fifth slot. Totals land at +790 physical defense and +31% cooldown reduction, well past build 1\'s +223 and +16%. Sage\'s Sanctuary finishes it, reviving Liu Shan on the spot two seconds after death with 2000-3000 HP, twice per match.',
      },
    },
  ],
  // 漸離（Mage／MID）
  '115': [
    {
      ja: {
        label: '魔法攻撃と貫通を積み切る型',
        when: '敵が魔法防御を積み、後衛を一度で落としたいとき',
        text: '700Gの靴から入り、神喰らいの書までの2,760Gで魔法ライフスティール24%と最大HP750を確保します。3品目の灼熱の杖はHPが30%を切るとCCを解除し、4秒のシールドと移動速度30%が付く。残る3品は賢者の怒り・賢者の天書・ヴォイドスタッフで、魔法攻撃は合計1122、クールダウン短縮は15%まで伸びます。最後のヴォイドスタッフで魔法防御貫通が45%増え、固定値の85.6と合わせて硬い相手にも通る形。',
      },
      en: {
        label: 'Magic power and penetration',
        when: 'When the enemy stacks magic defense and you want to delete a backliner in one go.',
        text: 'Boots of the Arcane at 700G lead into Insatiable Tome, so 24% magic lifesteal and 750 max HP are up by 2,760G. Ardent Dominion, bought third, clears crowd control below 30% HP and grants a 4-second shield with +30% movement speed. The last three slots — Savant\'s Wrath, Sage\'s Tome, Void Staff — push magic power to 1,122 and cooldown reduction to 15%. Void Staff lands last, adding 45% magic defense penetration on top of the flat 85.6.',
      },
    },
    {
      ja: {
        label: 'HPと防御を先に立てる型',
        when: '敵の狙いが集中しやすく、前に出て粘りたいとき',
        text: '3品目に時の預言、4品目に羽化の衣を置き、7,030Gの時点でHPと物理・魔法防御を先に立てます。羽化の衣は追加HPの2%を魔法攻撃、3%を魔法防御貫通に上乗せするので、最大HP+3150という積み方と噛み合う。魔法攻撃を30%増やす賢者の怒りは5品目まで待つ形になり、合計は852とビルド1より270低い。締めの巫術の杖で、スキル発動から5秒以内の通常攻撃に追加の魔法ダメージが乗ります。',
      },
      en: {
        label: 'Health and defenses first',
        when: 'When you draw the enemy\'s focus early and want to hold ground up front.',
        text: 'Augur\'s Word third and Breakthrough Robe fourth put health, physical defense, and magic defense in place by 7,030G. Breakthrough Robe grants magic power worth 2% of bonus health and magic defense penetration worth 3%, which pays off at +3,150 max HP. Savant\'s Wrath and its 30% boost wait until the fifth slot, so magic power finishes at 852 — 270 below build 1. Staves of Sorcery closes the build, adding magic damage to the next basic attack within 5 seconds of a cast.',
      },
    },
  ],
  // 阿軻（Assassin／JUNGLE）
  '116': [
    {
      ja: {
        label: 'クリティカルと貫通で火力を伸ばす',
        when: '自分から仕掛けて、後衛を一人ずつ落としに行きたいとき',
        text: '最初にグリードバイト2160G、700Gの静謐の靴を挟んだあとは、残る4品すべてが攻撃装備です。物理攻撃+444、クリティカル率47%、クリティカル効果+36%まで伸びる。エンドレスブレードとマスターブレードでクリティカル率を20%ずつ重ね、最後の砕星の槌が物理防御貫通を30%増やします。移動速度+22.5%とクールダウン短縮32.5%も付き、仕掛け直しが速い。',
      },
      en: {
        label: 'Crit and penetration damage',
        when: 'When you want to start the fight yourself and pick off the enemy backline one at a time.',
        text: 'Rapacious Bite opens at 2,160G, a 700G Boots of Tranquility follows, and the remaining four slots are all offence. The totals reach +444 physical attack, 47% critical rate and +36% critical effect. Eternity Blade and Master Sword each stack 20% critical rate, then Starbreaker closes the build with 30% physical penetration. Arke also carries +22.5% movement speed and 32.5% cooldown reduction, so re-engaging comes around fast.',
      },
    },
    {
      ja: {
        label: '防御を混ぜて前線で殴り続ける',
        when: '敵にハードCCが多く、集団戦で先に落とされたくないとき',
        text: 'ビルド1と同じなのはグリードバイトとシャドーアックスの2品だけ。2品目の靴を抵抗の靴にして、4品目から氷霜のグリップ・ドゥームズデイ・フロストショックと防御を混ぜます。物理防御+523、魔法防御+100、最大HP+2237、物理ライフスティール20%まで積み上がる。フロストショックは制圧以外のハードCCを受けると最大HPの10%のシールドを張り、抵抗の靴の耐性25%と合わせて拘束されても粘れます。',
      },
      en: {
        label: 'Defence mixed in for staying power',
        when: 'When the enemy stacks hard crowd control and Arke cannot afford to fall first in teamfights.',
        text: 'Only Rapacious Bite and Axe of Torment carry over from Build 1. Boots of Resistance takes the second slot, and from the fourth slot on Frostscar\'s Embrace, Doomsday and Frigid Charge mix in defence. That builds up to +523 physical defence, +100 magic defence, +2,237 max HP and 20% physical lifesteal. Frigid Charge grants a shield worth 10% of max HP whenever Arke takes hard CC other than suppression, and Boots of Resistance adds 25% tenacity on top.',
      },
    },
  ],
  // 鐘無艶（Fighter／CLASH）
  '117': [
    {
      ja: {
        label: '魔法防御と回復で前に立つ',
        when: '敵の主力が魔法攻撃で、集団戦の前で粘りたいとき',
        text: '5品目のグレートブレイカーまで9,520G分は、2本とも同じ順・同じ顔ぶれ。最後の2,020Gを永夜の守護に回し、魔法防御+310・最大HP+2,400で締める。3秒間の被ダメージが最大HPの30%を超えると、次の3秒間で320+HPの8%を回復します。アルカナは隠匿を10枠、物理攻撃が+16増えて合計+390。',
      },
      en: {
        label: 'Magic Defense and Sustain',
        when: 'When the enemy\'s main damage is magic and you need to hold the front line.',
        text: 'The first five items and their 9,520G are the same in both builds, order included. The last 2,020G goes to Longnight Guardian, closing at +310 magic defense and +2,400 max HP. Take more than 30% of your max HP in damage over three seconds and it heals 320 plus 8% of HP over the next three. Stealth takes ten of the arcana slots, adding +16 physical attack for +390 in total.',
      },
    },
    {
      ja: {
        label: '貫通30%で硬い相手を削る',
        when: '敵に物理防御を積むタンクやファイターが2体以上いるとき',
        text: '5品目のグレートブレイカーまで9,520G分は、ビルド1と同じ順・同じ顔ぶれ。最後の2,080Gを砕星の槌に回し、物理攻撃は合計+464、パッシブの破甲で物理防御貫通が30%増加する。アルカナは変異と鷹の目で貫通+100を積み、残る10枠の狩猟で攻撃速度+10%が付きます。永夜の守護がないぶん、魔法防御は靴の+100だけ。',
      },
      en: {
        label: 'Pierce +30% for Tanky Targets',
        when: 'When two or more enemy tanks or fighters stack physical defense.',
        text: 'The first five items and their 9,520G match build 1, order included. The last 2,080G buys Starbreaker instead: physical attack reaches +464 in total, and the passive raises physical pierce by 30%. Mutation and Eagle Eye supply +100 pierce, and the remaining ten slots go to Hunt for +10% attack speed. With no Longnight Guardian, magic defense stays at the boots\' +100.',
      },
    },
  ],
  // 孫臏（Support／ROAM）
  '118': [
    {
      ja: {
        label: 'HPと物理防御を積む前衛型',
        when: '敵に物理攻撃のヒーローが2体以上いて、前に出て受けたいとき',
        text: '最初に極影の盾・救済を立て、240〜480＋最大HPの10%のシールドを60秒ごとに味方へ配ります。2品目の秘法の靴は700Gで、魔法防御貫通が60〜120増える。3品目からは防御装備を4つ重ね、最大HP+7362、物理防御+693まで積み上がります。締めの覇者の重装で最大HPがさらに4%増え、毎秒0.5%が自動で戻る。',
      },
      en: {
        label: 'HP and physical defense wall',
        when: 'When the enemy fields two or more physical damage dealers and you want to stand in front of your team.',
        text: 'Crimson Shadow - Redemption goes down first, handing allies a 240-480 shield plus 10% of max HP every 60 seconds. Boots of the Arcane follow at 700G, adding 60-120 magic penetration. From the third slot on, four defensive items go down back to back, finishing at +7362 max HP and +693 physical defense. Overlord\'s Platemail closes the run with another 4% max HP and 0.5% self-healing per second.',
      },
    },
    {
      ja: {
        label: '回復とクールダウン短縮を回す型',
        when: '敵に回復やライフスティールが多く、味方のHPを保ちたいとき',
        text: '先頭のガーディアン・星泉が、味方と孫臏自身を500〜1060＋最大HPの20%回復します。2品目の抵抗の靴で耐性が25%上がり、3品目の聖杯からMPとHPが毎秒戻る。最大HPは+4787と軽い代わりに、魔法攻撃+390・クールダウン短縮32.5%が付きます。締めの夢魔の牙は、当てた敵の回復とライフスティールを35%減らす。',
      },
      en: {
        label: 'Healing and cooldown engine',
        when: 'When enemies lean on healing or lifesteal and you want to keep your team topped up.',
        text: 'Guardian - Starspring leads, restoring 500-1060 plus 20% of max HP to both the linked ally and Sun Bin. Boots of Resistance bring 25% tenacity for 700G, and Holy Grail in the third slot keeps MP and HP ticking back every second. Max HP settles at a lighter +4787, in exchange for +390 magic attack and 32.5% cooldown reduction. Venomous Staff wraps it up by cutting enemy healing and lifesteal by 35%.',
      },
    },
  ],
  // 扁鵲（Mage／MID）
  '119': [
    {
      ja: {
        label: 'HPを火力に、火力を防御に変える型',
        when: '敵に飛び込み役が多く、前に出て撃ち続けたいとき',
        text: '静謐の靴から賢者の天書まで、クールダウン短縮は合計+40%、最大HPは+2300。羽化の衣は魔法攻撃を20〜40＋追加HPの2%、魔法防御貫通を30〜60＋追加HPの3%増やす。時の預言が足す物理・魔法防御は50〜100＋魔法攻撃の10%。HPが火力に、火力が防御に返るので、前に出たまま撃ち続けられます。',
      },
      en: {
        label: 'HP into damage, damage into defense',
        when: 'When the enemy team has multiple divers and you want to hold your ground and keep casting',
        text: 'Cooldown reduction totals +40% from Boots of Tranquility through Sage\'s Tome, and max HP reaches +2300. Breakthrough Robe adds 20-40 magic attack plus 2% of bonus HP, and 30-60 magic penetration plus 3% of bonus HP. Augur\'s Word contributes 50-100 physical and magic defense plus 10% of magic attack. HP feeds damage and damage feeds defense, so bulk and output rise together.',
      },
    },
    {
      ja: {
        label: '貫通を重ねて足で押し切る型',
        when: '敵に魔法防御が高いヒーローや回復役がいるとき',
        text: '1品目の秘法の靴が魔法防御貫通を60〜120足し、最後のヴォイドスタッフがそれを45%増やす。3品目の夢魔の牙で、攻撃を当てた敵のHP回復とライフスティールは2.5秒間35%減。移動速度+17.5%はビルド1より7.5ポイント高く、装備合計10,980Gも760G安い。硬さを削って、貫通と足に振った構成です。',
      },
      en: {
        label: 'Penetration and pace',
        when: 'When the enemy fields high magic defense or a healer you need to shut down',
        text: 'Boots of the Arcane opens with 60-120 magic penetration, and Void Staff closes the build by raising that penetration another 45%. Venomous Staff, third in the order, cuts an enemy\'s healing and lifesteal by 35% for 2.5 seconds once you land a hit. Movement speed reaches +17.5%, 7.5 points above build 1, and the full set costs 10,980G, 760G less. Less bulk, more penetration and pace.',
      },
    },
  ],
  // 白起（Tank／CLASH）
  '120': [
    {
      ja: {
        label: 'シールドと凍結を足す5品目',
        when: '敵にハードCCが多く、集団戦で足止めしたいとき',
        text: '6品のうち違うのは5品目だけで、残る5品は買う順まで2本とも同じ。ビルド1が置くフロストショック2030Gは、物理防御150とクールダウン短縮7.5%を足します。制圧以外のハードCCを受けると最大HPの10%のシールドが張られ、アクティブの氷霜領域は0.75秒後に敵を凍結させる。総合計は最大HP+7012、物理防御+783で、クールダウン短縮はビルド2より7.5%多い13.5%です。',
      },
      en: {
        label: 'Shield and freeze in slot five',
        when: 'When the enemy team stacks hard CC and you want to lock fights down',
        text: 'Only the fifth slot differs — the other five items, and the order they are bought in, match across both builds. Build one puts Frigid Charge (2,030G) there for 150 physical defense and 7.5% cooldown reduction. Any hard CC short of suppression grants a shield worth 10% of max HP, and the active frost field freezes enemies after 0.75s. Totals come to +7,012 max HP and +783 physical defense, with cooldown reduction at 13.5% — 7.5 points clear of the other build.',
      },
    },
    {
      ja: {
        label: 'HPと回復を伸ばす5品目',
        when: '敵の魔法ダメージが多く、粘って耐えたいとき',
        text: '5品目が不死鳥の目2020Gに変わるだけで、残る5品は買う順まで2本とも同じです。魔法防御180と最大HP1350が付き、HPを10%失うごとにHP回復効果が5%増える。毎秒最大HPの0.5%を戻す覇者の重装と、（320+HPの8%）を回復する永夜の守護が、削られた後ほど効きます。総合計は最大HP+7462、魔法防御+620で、ビルド1よりHPが450、魔法防御が180厚い。',
      },
      en: {
        label: 'More HP and healing in slot five',
        when: 'When enemy damage is mostly magic and fights run long',
        text: 'Slot five is the only change — Eye of the Phoenix (2,020G) — while the other five buys and their order match build one. It adds 180 magic defense and 1,350 max HP, and every 10% of HP lost raises healing received by 5%. Overlord\'s Platemail restoring 0.5% Health every second and Longnight Guardian\'s 320 + 8% Health both scale up as the health bar drops. Totals reach +7,462 max HP and +620 magic defense — 450 HP and 180 magic defense over build 1.',
      },
    },
  ],
  // ミーユエ（Mage／CLASH）
  '121': [
    {
      ja: {
        label: 'HPを積むほど魔法攻撃が伸びる型',
        when: '集団戦が長引き、前に出て粘り続けたいとき',
        text: '4品目からは羽化の衣・巫術の杖・時の預言と、魔法攻撃とHPを兼ねる装備だけが並びます。羽化の衣は追加HPの2%を魔法攻撃、3%を魔法防御貫通に上乗せし、基礎値を含めた上限が+100と+150。6品目の時の預言は魔法攻撃の10%ぶんの物理・魔法防御を足し、魔法攻撃750なら75が乗ります。靴以外に防御装備はなく、HP+3330と魔法攻撃+750の両方に届く構成。',
      },
      en: {
        label: 'Bonus HP feeds magic power',
        when: 'When fights drag on and Mi Yue has to hold the front line.',
        text: 'From the fourth slot Mi Yue buys only items that pay in both magic attack and health: Breakthrough Robe, Staves of Sorcery and Augur\'s Word. Breakthrough Robe adds 2% of bonus HP as magic attack and 3% as magic penetration, with both bonuses capped at +100 and +150 including their 20-40 and 30-60 base. Augur\'s Word closes the build and grants physical and magic defense equal to 10% of magic attack, so 750 magic attack is worth 75 of each. Outside the boots there is no defensive item, yet the totals still reach +3330 max HP and +750 magic attack.',
      },
    },
    {
      ja: {
        label: '通常攻撃と物理防御400に寄せた型',
        when: '敵の主力が通常攻撃を振る物理ヒーローのとき',
        text: '4品目のトワイライトストームで、ヒーローに当てるたび魔法防御貫通が20~40、6スタックまで伸びます。5品目の不吉な予兆で物理防御+300が入り、被弾すると攻撃者の攻撃速度を最大40%、移動速度を最大15%落とす。6品目のシャドーブレードまで揃えば攻撃速度+87%・クリティカル率+25%で、通常攻撃を回し続けられます。魔法攻撃はビルド1の750に対し470で、その差を手数と物理防御+400に置き換えた構成。',
      },
      en: {
        label: 'Basic attacks and 400 physical defense',
        when: 'When the enemy\'s main damage comes from a physical hero\'s basic attacks.',
        text: 'The fourth slot is Twilight Stream: damaging an enemy hero adds 20-40 magic penetration, stacking up to six times. Ominous Premonition comes fifth for +300 physical defense, and whenever Mi Yue takes damage it cuts the attacker\'s attack speed by up to 40% and movement speed by up to 15%. Shadow Ripper closes the build, bringing the totals to +87% attack speed and +25% crit rate. Magic attack stops at +470 against build one\'s +750, and that gap is paid back as attack speed and +400 physical defense.',
      },
    },
  ],
  // 呂布（Fighter／CLASH）
  '123': [
    {
      ja: {
        label: 'ライフスティールで殴り勝つ',
        when: '敵に回復役がいて、レーン戦を長く続けたいとき',
        text: '700Gの抵抗の靴で魔法防御+100と耐性25%増を先に取り、2品目の蒼天の剣で被ダメージ20%減を早く立てる。猛攻の鎧は被弾のたびに与ダメージが1%増え、最大10スタックまで乗ります。6品目のジャッジメントは物理ライフスティール+20%に加え、敵のHP回復とライフスティールを35%減らす。合計は物理攻撃+495・攻撃速度+24.2%で、殴り合いが長引くほど効く構成です。',
      },
      en: {
        label: 'Win the brawl with lifesteal',
        when: 'When the enemy team has healing and you want long lane trades',
        text: 'Boots of Resistance come first at 700G for +100 magic defense and 25% more resistance, then Pure Sky lands second and brings its 20% damage reduction online early. Cuirass of Savagery adds 1% damage every time you take a hit, up to 10 stacks. Mortal Punisher closes the build with +20% physical lifesteal and a passive that cuts enemy healing and lifesteal by 35%. Totals reach +495 physical attack and +24.2% attack speed, so the longer a fight drags on, the better this build gets.',
      },
    },
    {
      ja: {
        label: '復活と無敵で二度突っ込む',
        when: '集団戦で先に飛び込み、何度も前に出たいとき',
        text: '忍びの靴で物理被ダメージを6〜12%減らし、2品目にグレートブレイカーを置く。3,240Gの時点で、HPが50%を切った敵に+30%ダメージが乗ります。名刀・司命は致命傷でも死亡させず無敵に変え（CD120秒）、賢者の庇護は死亡2秒後にHP2000〜3000で復活させる（1試合2回まで）。合計は最大HP+2375・魔法防御+350・クールダウン短縮+26%で、ビルド1よりHPが500多くなります。',
      },
      en: {
        label: 'Revive and dive again',
        when: 'When you dive in first and need to re-enter fights again and again',
        text: 'Boots of Fortitude shave 6-12% off incoming physical damage, and Overlord\'s Might goes second. By 3,240G you already deal +30% to enemies under 50% HP. Destiny turns a lethal blow into brief invulnerability instead of death (120s cooldown), while Sage\'s Sanctuary revives you on the spot two seconds after death with 2,000-3,000 HP, twice per match. Totals land at +2,375 max HP, +350 magic defense and 26% cooldown reduction, 500 more HP than build 1.',
      },
    },
  ],
  // 周瑜（Mage／MID）
  '124': [
    {
      ja: {
        label: '割合ダメージと最大HPを先に積む',
        when: '敵にHPの高い前衛が2体以上並ぶとき',
        text: '3品目に苦痛のマスクを置き、4,820Gで割合ダメージを手にします。スキルが命中すると3秒間に4回、敵の現在HPの3%を追加で削る。最大HPは+1900、クールダウン短縮は42.5%まで伸び、どちらも2本のうち高いほう。魔法攻撃の合計は+1072で、うち+350を占める賢者の天書は6品目まで待ちます。',
      },
      en: {
        label: 'Percent-HP chip and bulk first',
        when: 'When the enemy team fields two or more high-HP frontliners',
        text: 'Mask of Agony comes third, so percent-HP damage is online at 4,820G. Each skill hit adds 3% of the target\'s current HP, four times over three seconds. Max HP climbs to +1900 and cooldown reduction to 42.5%, both the higher of the two builds. Total magic attack is +1072, and the +350 of that coming from Sage\'s Tome only arrives in slot six.',
      },
    },
    {
      ja: {
        label: '魔法攻撃と貫通を先に立てる',
        when: '敵が魔法防御を積み、削りが通りにくいとき',
        text: '3品目を賢者の天書に前倒しし、5,350Gで魔法攻撃+350を先に立てます。魔法攻撃100ごとにダメージが0.5%増えるため、中盤から火力の上乗せが効く。4品目のヴォイドスタッフは魔法防御貫通を45%増やし、魔法防御を買った相手にも通ります。魔法攻撃の合計は+1182とビルド1より110高く、最大HPは400低い+1500。',
      },
      en: {
        label: 'Magic attack and penetration first',
        when: 'When enemies buy magic defense and your damage stops landing',
        text: 'Sage\'s Tome moves up to third, putting +350 magic attack online at 5,350G. It adds 0.5% damage per 100 magic attack, so that bonus is already running from mid-game. Void Staff follows in slot four and raises magic penetration by 45%, keeping damage effective against enemies who stack magic defense. Totals land at +1182 magic attack, 110 above build 1, with max HP 400 lower at +1500.',
      },
    },
  ],
  // 元歌（Assassin／CLASH）
  '125': [
    {
      ja: {
        label: '最後の1枠を耐久で締める',
        when: '集団戦で先に踏み込み、集中攻撃を受けやすいとき',
        text: '5品目までは2本とも同じで、9,450Gを積んでから最後の1枠が分かれます。ビルド1は蒼天の剣で締め、物理防御250・物理攻撃515。スキルが敵ヒーローに最初に当たると、3秒間は自身の被ダメージが20%減る（クールダウン8秒）。アクティブの3秒間30%軽減（クールダウン75秒）と合わせ、踏み込んだ直後を自分の操作でしのげます。',
      },
      en: {
        label: 'Closing with survivability',
        when: 'When you commit first and draw the focus in teamfights',
        text: 'Both builds run the same five items up to 9,450G, and only the last slot splits. Build 1 finishes with Pure Sky, landing on 250 Physical Defense and 515 Physical Attack. Once a skill first connects with an enemy hero, Pure Sky cuts your own damage taken by 20% for 3s, on an 8s cooldown. Add the active — 30% reduction for 3s, 75s cooldown — and the seconds right after you commit are yours to manage.',
      },
    },
    {
      ja: {
        label: '最後の1枠を削りと硬さに回す',
        when: '敵の前衛が硬く、殴り合いが長引きやすいとき',
        text: '分かれるのは同じ9,450G地点の最後の1枠。氷霜のグリップは物理防御を400まで伸ばし、蒼天の剣の250を150上回ります。スキル発動から5秒以内の次の通常攻撃が範囲内の敵に210〜420の追加物理ダメージを与え、移動速度も0.5秒下げる。クールダウン1.2秒なので、殴り合いが続くほど差が出ます。',
      },
      en: {
        label: 'Closing with chip damage and armor',
        when: 'When enemy frontliners are tanky and fights tend to drag',
        text: 'The split arrives at the same 9,450G mark. Frostscar\'s Embrace pushes Physical Defense to 400, a full 150 above Pure Sky\'s 250. Within 5s of a skill, the next basic attack deals 210–420 bonus physical damage in an area and slows for 0.5s. On a 1.2s cooldown, that stacks up the longer a fight runs.',
      },
    },
  ],
  // 夏侯惇（Tank／CLASH）
  '126': [
    {
      ja: {
        label: '物理防御を先に立て、回復を重ねる',
        when: '敵の主力ダメージが物理で、前で粘りたいとき',
        text: '3品目に氷霜のグリップを置き、4,800Gで物理防御+300とクールダウン短縮10%が入ります。4品目の不死鳥の目は、HPを10%失うごとにHP回復効果が5%増えるパッシブ。調和アルカナ5枠の毎秒HP回復+26と合わせ、削られた後ほど戻りが速くなります。合計の物理防御+913・最大HP+5487は、ビルド2をそれぞれ90と475上回る。',
      },
      en: {
        label: 'Physical Defense First, Regen Stacked',
        when: 'When the enemy\'s main damage is physical and you want to hold the front line.',
        text: 'Frostscar\'s Embrace lands third, so +300 physical defense and 10% cooldown reduction are up by 4,800G. Fourth comes Eye of the Phoenix, which raises HP recovery by 5% for every 10% of HP lost. Add the +26 HP regen per second from five Harmony arcana and Dun recovers faster the lower his HP falls. Totals of +913 physical defense and +5487 max HP sit 90 and 475 above build 2.',
      },
    },
    {
      ja: {
        label: 'シールドと魔法防御を先に立てる',
        when: '敵に魔法ダメージ源が2体以上いるとき',
        text: '3品目に魔女のマントを置き、4,760Gで魔法防御+300を先に確保します。15秒ごとに400〜800（+追加HPの7%）の魔法ダメージシールドを獲得。氷霜のグリップは5品目に下がるので、クールダウン短縮10%は8,840Gまで待つ。魔法防御は合計+550でビルド1より120高く、移動速度も狩猟10枠で+10%乗ります。',
      },
      en: {
        label: 'Magic Shield First',
        when: 'When two or more enemies on the draft deal magic damage.',
        text: 'Succubus Cloak takes the third slot, locking in +300 magic defense by 4,760G. It also grants a 400-800 (+7% bonus HP) magic damage shield every 15 seconds. Frostscar\'s Embrace slips to fifth, so its 10% cooldown reduction waits until 8,840G. Magic defense totals +550, a full 120 over build 1, and ten Hunt arcana add +10% movement speed.',
      },
    },
  ],
  // 甄姫（Mage／MID）
  '127': [
    {
      ja: {
        label: '割合貫通で硬い敵を抜く',
        when: '敵に魔法防御を積む前衛が2体以上いるとき',
        text: '秘法の靴とフローズンブレスで足と削りを先に立てます。4品目に夢魔の牙を置くので、6,920Gの時点から敵のHP回復とライフスティールを35%落とせる。5品目のヴォイドスタッフは魔法防御貫通45%で、魔法防御を積んだ相手ほど効きが伸びます。合計は魔法攻撃+982、クールダウン短縮37.5%、最大HP+1900。',
      },
      en: {
        label: 'Percent penetration for tanky lineups',
        when: 'When two or more enemy front-liners stack magic defense.',
        text: 'Boots of the Arcane and Frozen Breath come first, for movement speed and steady chip damage. Venomous Staff lands fourth, so enemy healing and lifesteal are cut 35% from 6,920G onward. Void Staff follows at fifth with 45% magic defense penetration, which pays off more the more magic defense the enemy carries. Totals: +982 magic attack, 37.5% cooldown reduction, +1,900 max HP.',
      },
    },
    {
      ja: {
        label: '短縮と積み上げ貫通で撃ち続ける',
        when: '敵に回復持ちが少なく、集団戦が長引くとき',
        text: '4品目はトワイライトストームで、敵ヒーローにダメージを与えるたび魔法防御貫通が20〜40増え、6スタックまで重なる。5品目に賢者の怒りが前倒しになり、9,060Gで魔法攻撃+30%が乗ります。クールダウン短縮は合計42.5%でビルド1より5ポイント高く、魔法攻撃は+932。夢魔の牙は最後に回るので、敵のHP回復とライフスティールを35%削れるのは11,100G以降です。',
      },
      en: {
        label: 'Stacked penetration and faster rotations',
        when: 'When the enemy roster has little healing and teamfights run long.',
        text: 'Twilight Stream takes the fourth slot and adds 20-40 magic defense penetration each time you damage an enemy hero, up to six stacks. Savant\'s Wrath moves up to fifth, so the +30% magic attack passive arrives at 9,060G. Cooldown reduction totals 42.5%, five points above build 1, with +932 magic attack. Venomous Staff comes last, so the 35% cut to enemy healing and lifesteal only lands at 11,100G.',
      },
    },
  ],
  // ファーティフ（Fighter／CLASH）
  '128': [
    {
      ja: {
        label: 'クールダウン短縮45%で手数を出す',
        when: '敵にスロウや沈黙が少なく、序盤から手数で押したいとき',
        text: '静謐の靴の+15%から入り、シャドーアックス以降の3品と重ねてクールダウン短縮を45%まで積み上げます。3品目の氷霜のグリップが4,850Gで揃い、スキル発動から5秒以内の通常攻撃に210~420の追加物理ダメージが乗る。魔女のマントはビルド2より一段早い5品目。9,010Gで魔法防御+300と15秒ごとのシールドが立ち、総合では物理攻撃+303、物理防御貫通+96.4まで伸びます。',
      },
      en: {
        label: 'Cooldowns first, 45% total',
        when: 'When enemy slows and silences are scarce and you want more attacks going out early.',
        text: 'Boots of Tranquility open with 15% cooldown reduction, and the three cooldown items stacked on top of them take the total to 45%. Frostscar\'s Embrace lands third at 4,850G, adding 210-420 physical damage to the next basic attack within 5 seconds of a cast. Succubus Cloak moves up to fifth, one slot earlier than in build 2, so 300 magic defense and a shield every 15 seconds are up by 9,010G. Totals reach 303 physical attack and 96.4 physical defense penetration.',
      },
    },
    {
      ja: {
        label: '抵抗の靴で耐性を先に確保する',
        when: '敵にスロウや沈黙が多く、前で殴り合いたいとき',
        text: '抵抗の靴は物理防御+50と魔法防御+100に加え、耐性25%でCCの拘束時間を短くします。3品目を蒼天の剣にするので、4,930Gの時点でスキル命中時の被ダメージ20%減が先に立つ。ドゥームズデイも5品目に前倒しで、9,090Gから物理ライフスティール20%で回復しながら殴れます。防御は合計で物理+500・魔法+400、ビルド1より一段厚い。',
      },
      en: {
        label: 'Resistances and tenacity first',
        when: 'When enemy slows and silences pile up and you plan to trade up front.',
        text: 'Boots of Resistance open with 50 physical defense, 100 magic defense and 25% tenacity, cutting how long crowd control holds Fatih. Pure Sky comes third rather than fourth, so the 20% damage reduction on a skill hit is up by 4,930G. Doomsday also moves earlier, giving 20% physical lifesteal from 9,090G onward. Defenses finish at 500 physical and 400 magic, a step above build 1.',
      },
    },
  ],
  // 典韋（Fighter／JUNGLE）
  '129': [
    {
      ja: {
        label: '最後の枠で削りと軽減を両取り',
        when: '敵の火力が物理寄りで、終盤も削り役を続けたいとき',
        text: '5品目9,070Gまでの並びは2本とも同じで、違うのは最後の枠だけ。ビルド1は蒼天の剣を置き、物理攻撃+375、クールダウン短縮+27.5%まで伸ばします。拘束のパッシブは、スキルが最初に命中した敵ヒーローを3秒スロウし、その3秒は自分の被ダメージが20%減る。75秒ごとのアクティブで3秒間30%軽減も足せるので、削りを落とさず前に出られます。',
      },
      en: {
        label: 'Last slot for damage and mitigation',
        when: 'When enemy damage is mostly physical and you keep carrying late',
        text: 'Both builds buy the same five items in the same order, 9,070G in total, and only the last slot splits. Build 1 closes with Pure Sky, taking physical attack to +375 and cooldown reduction to +27.5%. Its passive slows the first enemy hero a skill connects with for 3 seconds, and Dian Wei takes 20% less damage over those same 3 seconds. The active layers on another 30% reduction for 3 seconds every 75 seconds, so he keeps trading without giving up damage.',
      },
    },
    {
      ja: {
        label: '最後の枠をHPと魔法防御に',
        when: '敵に魔法攻撃のヒーローが2体以上いるとき',
        text: '5品目9,070Gまでの並びはビルド1と同じで、最後の枠が魔女のマントに変わります。最大HP+2900、魔法防御+350まで伸び、追加魔法防御の15%は物理防御にも回る。15秒ごとに400〜800＋追加HPの7%分の魔法ダメージシールドも張られます。蒼天の剣の物理攻撃+80とクールダウン短縮10%を落とし、魔法の削りに居座る側へ寄せた1本。',
      },
      en: {
        label: 'Last slot for HP and magic defense',
        when: 'When two or more enemy heroes deal magic damage',
        text: 'The 9,070G opening matches Build 1 item for item, and Succubus Cloak takes the final slot. Max HP reaches +2,900 and magic defense +350, with 15% of that bonus magic defense converting into physical defense. Every 15 seconds it also grants a shield that absorbs 400-800 magic damage plus 7% of bonus HP. Dropping Pure Sky costs 80 physical attack and 10% cooldown reduction, and buys a body that can stand in magic damage instead.',
      },
    },
  ],
  // 宮本武蔵（Fighter／JUNGLE）
  '130': [
    {
      ja: {
        label: '殴って回復し前に居座る',
        when: '敵に魔法攻撃のヒーローが2体以上いるとき',
        text: 'ビルド1は5品目の蒼天の剣で、スキルが敵ヒーローに当たると3秒間、被ダメージが20%減る。アクティブを押せば、さらに3秒間30%軽減。締めのブラッドエッジまで積むと物理ライフスティールは33%、物理攻撃は+432まで伸びます。2品目の抵抗の靴の魔法防御+100と耐性25%増加もあり、魔法主体の敵の前でも殴り合って居座れる。',
      },
      en: {
        label: 'Sustain and hold the front',
        when: 'When two or more enemy heroes deal magic damage',
        text: 'Pure Sky arrives fifth: land a skill on an enemy hero and incoming damage drops 20% for three seconds. Its active cuts another 30% for three more. Bloodweeper closes the build, taking physical lifesteal to 33% and physical attack to +432. Boots of Resistance, bought second, add +100 magic defense and 25% tenacity, so Miyamoto Musashi can trade in the middle of a magic-heavy fight.',
      },
    },
    {
      ja: {
        label: 'HPを積んで火力に変える',
        when: '敵前衛にHPの高いタンクがいるとき',
        text: 'ビルド2は2品目を静謐の靴にして、クールダウン短縮を合計42.5%まで引き上げる。3品目のシャドーアックス、5品目のドラゴンシールド、締めのブラッドレイジで最大HPは+2750。ブラッドレイジは追加HPの1.5%を通常攻撃に乗せ、現在HPの30%と引き換えに最大HPの40%のシールドを張る。ドラゴンシールドは敵ヒーローのHPの3.5%を削るので、硬い相手ほど通ります。',
      },
      en: {
        label: 'Stack HP, turn it into damage',
        when: 'When the enemy front line runs high-HP tanks',
        text: 'Boots of Tranquility go in second here, pushing total cooldown reduction to 42.5%. Max HP piles up across Axe of Torment third, Dragon\'s Rage fifth and Blood Rage last, +2750 in all. Blood Rage adds 1.5% of that bonus HP to every basic attack, and trades 30% of current HP for a shield worth 40% of max HP. Dragon\'s Rage strips 3.5% of an enemy hero\'s HP per hit, so the tankier the target, the harder it bites.',
      },
    },
  ],
  // 李白（Assassin／JUNGLE）
  '131': [
    {
      ja: {
        label: '回復封じとスロウを足す型',
        when: '敵に回復やライフスティール持ちが2体以上いるとき',
        text: '3品目までは共通で、差は4・5品目だけ。4品目のジャッジメント（2080G）は、命中した敵の回復とライフスティールを2.5秒間35%減らします。5品目のディープフロストで移動速度を最大10%削り、追加物理ダメージ135〜270を乗せる。アルカナも紅月が1枠多く、合計の攻撃速度+79.8%はビルド2を16.6ポイント上回ります。',
      },
      en: {
        label: 'Antiheal and slow',
        when: 'When two or more enemies bring healing or lifesteal',
        text: 'The first three items are identical, and only slots 4 and 5 differ. Mortal Punisher (2080G) cuts an enemy\'s healing and lifesteal by 35% for 2.5 seconds on hit. Deepfrost Siege follows, shaving up to 10% off enemy movement speed and adding 135-270 physical damage. With an extra Red Moon arcana on top, total attack speed reaches +79.8%, 16.6 points above build 2.',
      },
    },
    {
      ja: {
        label: 'スタックとHPで居座る型',
        when: '乱戦が長引き、前に出て殴り合い続けたいとき',
        text: 'こちらも3品目まで共通で、4品目に暴風（2080G）を置く。命中ごとに攻撃速度・移動速度・ダメージが2.5秒間2%増え、5スタックで10%まで伸びます。5品目のブラッドエッジは物理ライフスティール25%、スキル分にはさらに25%。アルカナは変異が1枠多く貫通+92.8、最大HPは+1600でビルド1より350多い。',
      },
      en: {
        label: 'Stacked speed and sustain',
        when: 'When fights drag on and you want to hold melee range',
        text: 'The same opening three items, with Tempest (2080G) in the fourth slot. Each hit adds 2% attack speed, movement speed and damage for 2.5 seconds, reaching 10% at five stacks. Bloodweeper then adds 25% physical lifesteal, plus another 25% on skill damage. An extra Mutation arcana lifts penetration to +92.8, and 1600 max HP is 350 more than build 1.',
      },
    },
  ],
  // マルコ・ポーロ（Marksman／FARM）
  '132': [
    {
      ja: {
        label: '攻撃速度131%の連射に耐久を足す',
        when: '敵に高HPの前衛と魔法ダメージ源が揃っているとき',
        text: '700Gの速攻の靴を先に置き、移動速度50と攻撃速度20%を早い時間帯から確保します。スパークダガーとドゥームズデイで攻撃速度が55%増え、通常攻撃に対象の追加HPの7%が乗る。5品目の威光の弓は遠距離型で効果が倍になり、物理防御貫通30%と通常攻撃ダメージ+50を上乗せします。フロストショックと魔女のマントで物理防御150と魔法防御300を足し、最終形は攻撃速度+131%、最大HP+2500。',
      },
      en: {
        label: '131% attack speed, then bulk',
        when: 'When the enemy fields a high-HP frontline alongside a magic damage dealer.',
        text: 'Boots of Dexterity come down first at 700G, putting 50 movement speed and 20% attack speed on the board early. Sparkforged Dagger and Doomsday add another 55% attack speed, and Doomsday makes every basic attack carry 7% of the target\'s bonus HP. Daybreaker\'s Virtue lands fifth and doubles for ranged heroes: 30% physical penetration and +50 basic attack damage. Frigid Charge and Succubus Cloak add 150 physical defense and 300 magic defense, finishing at +131% attack speed and +2500 max HP.',
      },
    },
  ],
  // 仁傑（Marksman／FARM）
  '133': [
    {
      ja: {
        label: '攻撃速度と貫通で押し切る',
        when: '敵の前衛が物理防御を積んでいて、貫通で押し込みたいとき',
        text: '700Gの速攻の靴を1品目に置き、攻撃速度20%と移動速度50を先に確保する。4品目の威光の弓は遠距離型で効果が2倍になり、物理防御貫通30%と通常攻撃ダメージ+50が乗ります。6品そろえば攻撃速度+133%、クリティカル率+46%、物理防御貫通+64。防御装備は魔女のマント1品だけで、粘りはライフスティール23.2%に任せる形です。',
      },
      en: {
        label: 'Attack speed and pierce',
        when: 'When the enemy front line is stacking physical defense and you want to cut through it',
        text: 'Boots of Dexterity go down first at 700G for 20% attack speed and 50 movement speed. Daybreaker\'s Virtue arrives fourth and doubles on a ranged hero: 30% physical pierce and +50 damage on every normal attack. Six items land at +133% attack speed, +46% crit rate and +64 physical pierce. Succubus Cloak is the only defensive buy, so 23.2% physical lifesteal carries the sustain.',
      },
    },
    {
      ja: {
        label: 'HPと防御を厚くして殴り合う',
        when: '敵に瞬間火力の高いヒーローが複数いて、狙われやすいとき',
        text: '1品目の忍びの靴は物理防御100と魔法防御50で、物理被ダメージも6~12%減る。4品目のディープフロストは通常攻撃で移動速度を5~10%落とし、3秒に1度135~270の追加ダメージを与えます。5品目の不吉な予兆と6品目の魔女のマントで、最大HP+3887、物理防御+423、魔法防御+350。攻撃速度はビルド1の133%に対し90%まで下がるが、ライフスティール36%で粘れる。',
      },
      en: {
        label: 'Health and defense first',
        when: 'When two or more enemies can burst you down and you keep getting focused',
        text: 'Boots of Fortitude open the build with 100 physical defense, 50 magic defense and 6-12% less physical damage taken. Deepfrost Siege lands fourth, cutting target movement speed by 5-10% on every normal attack and adding 135-270 damage once every three seconds. Ominous Premonition fifth and Succubus Cloak sixth bring the totals to +3887 max HP, +423 physical defense and +350 magic defense. Attack speed settles at +90% against build one\'s +133%, with 36% physical lifesteal covering the sustain.',
      },
    },
  ],
  // 達磨（Fighter／CLASH）
  '134': [
    {
      ja: {
        label: '貫通と硬さを同時に積む前衛',
        when: '敵に物理防御の高い前衛が並び、殴り合って残りたいとき',
        text: '700Gの抵抗の靴から入り、耐性25%と移動速度50を先に確保する。2品目のシャドーアックスは2,790Gで物理防御貫通90〜180と最大HP+500を同時に乗せます。物理防御貫通30%の砕星の槌は5品目に回し、先に氷霜のグリップと蒼天の剣で物理防御を450積むのが買う順の要点。締めの破魔の霊刀が魔法防御を物理攻撃の50%ぶん足し、物理攻撃+445・物理防御+500・最大HP+1800・クールダウン短縮30%まで積み上がります。',
      },
      en: {
        label: 'Penetration on a durable frame',
        when: 'When the enemy stacks armored frontliners and you need to trade and stay alive.',
        text: 'Boots of Resistance opens at 700G, locking in 25% tenacity and 50 movement speed. Axe of Torment lands second, adding 90-180 physical penetration and +500 max HP by the 2,790G mark. Starbreaker and its 30% physical penetration wait until the fifth slot, so Frostscar\'s Embrace and Pure Sky bank 450 physical defense first. Demonsbane closes the build, adding magic defense equal to 50% of physical attack and topping the totals at +445 physical attack, +500 physical defense, +1800 max HP and 30% cooldown reduction.',
      },
    },
  ],
  // 項羽（Tank／CLASH）
  '135': [
    {
      ja: {
        label: '貫通を積んで硬い敵を削る型',
        when: '敵の前衛が硬く、殴り合いで押し切りたいとき',
        text: '1品目は700Gの抵抗の靴で、2品目のシャドーアックスが物理攻撃80と物理防御貫通90〜180を早く乗せます。アルカナは変異と鷹の目を各10枠、こちらだけで貫通100が乗る。5品目のグレートブレイカーがHP50%未満の敵に30%の追加ダメージを与え、硬い前衛も削り切れます。装備とアルカナの合計は物理攻撃+327・クールダウン短縮+32.5%で、防御は物理+500・魔法+400に留まる。',
      },
      en: {
        label: 'Penetration bruiser',
        when: 'When enemy frontliners are tanky and you want to grind them down in a straight fight.',
        text: 'Boots of Resistance open at 700G, then Axe of Torment in slot two lands 80 physical attack and 90-180 physical penetration early. Ten Mutation and ten Eagle Eye slots add 100 penetration on top of that. Overlord\'s Might, the fifth buy, deals 30% extra damage to enemies below 50% HP, so tanky frontliners still come down. Items and arcana together add 327 physical attack and 32.5% cooldown reduction, while defenses stop at 500 physical and 400 magic.',
      },
    },
    {
      ja: {
        label: 'HPを6562積んで味方ごと守る型',
        when: '敵の火力が物理と魔法に分かれ、集団戦が長引くとき',
        text: '1品目は靴ではなくガーディアン・救済（2080G）で、自身の物理・魔法防御65〜130を範囲800以内の味方にも50%配れます。以降は防御装備だけを重ね、装備とアルカナで最大HP+6562・物理防御+523・魔法防御+610。4品目の永夜の守護は、3秒間の被ダメージが最大HPの30%を超えると320+HPの8%を回復します。アルカナは宿命・調和・虚空を各10枠、HPだけで1162を積む。',
      },
      en: {
        label: 'Guardian frontline',
        when: 'When enemy damage is split between physical and magic and team fights drag on.',
        text: 'Guardian - Redemption takes the first slot at 2080G instead of the boots, and half of its 65-130 physical and magic defense also reaches allies within 800 range. Everything after that is pure defense, with items and arcana adding 6562 max HP, 523 physical defense and 610 magic defense. Longnight Guardian, the fourth buy, restores 320 plus 8% of HP once damage taken over three seconds passes 30% of max HP. Fate, Harmony and Void fill ten slots each and account for 1162 of that HP.',
      },
    },
  ],
  // 司馬懿（Assassin／JUNGLE）
  '137': [
    {
      ja: {
        label: 'HPと貫通を厚くするアルカナ',
        when: '敵の物理ダメージが多く、HPを厚めにしておきたいとき',
        text: 'ルーンソード2160Gを1品目に置き、モンスターを倒すたび魔法攻撃+6を25スタックまで積む。靴は700Gの2品目なので、2860Gで移動速度+50と魔法防御貫通60〜120が揃います。アルカナは夢魔5枠に宿命5枠を足し、最大HP+168.5と物理防御+11.5を確保。合計は魔法攻撃+911・最大HP+2018.5・魔法防御貫通+76で、ビルド2よりHPと貫通が厚い。',
      },
      en: {
        label: 'Arcana weighted to HP and penetration',
        when: 'When the enemy team leans physical and you want a thicker HP pool',
        text: 'Runeblade leads at 2160G, stacking +6 magic attack for every monster killed, up to 25 stacks. Boots of the Arcane are the 700G second buy, so by 2860G Sima Yi already holds +50 movement speed and 60-120 magic penetration. The arcana pair five Nightmare slots with five Fate slots, which is where the +168.5 max HP and +11.5 physical defense come from. Totals land at +911 magic attack, +2018.5 max HP and +76 magic penetration - thicker in both HP and penetration than build 2.',
      },
    },
    {
      ja: {
        label: '魔法攻撃に寄せたアルカナ',
        when: '敵が魔法防御を積まず、貫通よりも魔法攻撃を伸ばしたいとき',
        text: '装備の顔ぶれも買う順もビルド1と同じで、違うのはアルカナだけ。夢魔5枠・宿命5枠を凶兆9枠・夢魔1枠に組み替え、魔法攻撃へ寄せます。合計は魔法攻撃+932で、ビルド1より21高い。引き換えに最大HPは1850、魔法防御貫通は66.4まで下がります。',
      },
      en: {
        label: 'Arcana weighted to magic attack',
        when: 'When the enemy skips magic defense and you would rather grow magic attack than penetration',
        text: 'Same six items in the same buying order as build 1; only the arcana differ. Five Nightmare and five Fate slots become nine Omen plus one Nightmare, weighting the setup toward raw magic attack. The total reaches +932 magic attack, 21 more than build 1. The trade is max HP down to 1850 and magic penetration down to 66.4.',
      },
    },
  ],
  // 孔子（Fighter／CLASH）
  '139': [
    {
      ja: {
        label: '通常攻撃で硬い敵を削る型',
        when: '敵に最大HPの高い前衛が2体以上いるとき',
        text: '1品目のスパークダガーと700Gの速攻の靴で、攻撃速度と移動速度を序盤から確保します。4品目に魔女のマントを置くため、魔法防御300はビルド2より1品早い6,790Gで入る。締めのドゥームズデイは通常攻撃に80〜160＋対象の追加HPの7%の物理ダメージを上乗せします。顔ぶれの違いはこの最後の1品だけで、合計は物理攻撃+164.5、攻撃速度+95%、物理ライフスティール+20%。',
      },
      en: {
        label: 'Percent-HP damage finish',
        when: 'When the enemy fields two or more high-Health frontliners.',
        text: 'Sparkforged Dagger opens and Boots of Dexterity follows at 700G, so attack speed and movement are both up early. Succubus Cloak lands fourth, one slot earlier than in the other build, putting 300 Magic Defense on the board by 6,790G. Doomsday closes: every Basic Attack adds 80–160 physical damage plus 7% of the target\'s extra Health. That last slot is the only item this build does not share with the other, and the totals read +164.5 Physical Attack, +95% Attack Speed, +20% Physical Lifesteal.',
      },
    },
    {
      ja: {
        label: 'シールドと硬さで前に残る型',
        when: '敵の物理火力が高く、集団戦で前に立ち続けたいとき',
        text: '3品目までは同じで、4品目に蒼天の剣を前倒しする。6,910Gで物理攻撃80と物理防御150が入り、スキルが敵ヒーローに当たれば3秒間は被ダメージも20%減ります。締めのサンライズケープは、敵ヒーローを攻撃すると自身と付近の味方1人に250〜500＋最大HPの4%のシールドを張る（CD10秒）。合計はクールダウン短縮+30.5%、物理防御+533、最大HP+3424.5で、ビルド1より硬さに寄ります。',
      },
      en: {
        label: 'Shielded frontline hold',
        when: 'When enemy physical damage is heavy and you need to stay on the front line.',
        text: 'The first three purchases match the other build. Pure Sky moves up to fourth, so 80 Physical Attack and 150 Physical Defense arrive at 6,910G, and landing a skill on an enemy hero cuts Fuzi\'s incoming damage by 20% for three seconds. Dawnlight finishes the set: damaging an enemy hero shields Fuzi and the lowest-Health ally nearby for 250–500 plus 4% of Max Health, on a 10-second cooldown. Totals lean defensive at +30.5% Cooldown Reduction, +533 Physical Defense and +3424.5 Max Health.',
      },
    },
  ],
  // 関羽（Fighter／CLASH）
  '140': [
    {
      ja: {
        label: '防御に全振りして前で粘る',
        when: '敵に物理アタッカーが2枚いて、前で受け続けるとき',
        text: '1品目は700Gの忍びの靴で、物理被ダメージが6〜12%減ります。2品目の紅蓮のマントは周囲に燃焼を撒き、当たった敵の回復とライフスティールを35%削る。以降も永夜の守護と不吉な予兆まで防御で固め、合計は物理防御+910、最大HP+5100。物理攻撃は装備とアルカナを足しても+80止まりで、削るより前で受け切ることに寄せた並びです。',
      },
      en: {
        label: 'All defense, holds the front',
        when: 'When the enemy fields two physical carries and Guan Yu has to soak the front line.',
        text: 'Boots of Fortitude open the build at 700G, cutting physical damage taken by 6-12%. Blazing Cape comes second, burning everything nearby and stripping 35% of the healing and lifesteal off anything the burn touches. The rest stays defensive through Longnight Guardian and Ominous Premonition, for +910 physical defense and +5,100 max HP. Physical attack tops out at +80 with items and arcana combined, so Guan Yu absorbs the fight rather than cutting through it.',
      },
    },
    {
      ja: {
        label: '貫通を重ねて硬い前衛を削る',
        when: '敵の前衛が硬く、こちらから削りに行きたいとき',
        text: '2品目の猛攻の鎧に3品目のシャドーアックスを重ね、4,840Gで物理攻撃+115と貫通90〜180が乗ります。5品目の砕星の槌で貫通はさらに30%増加。合計は物理攻撃+250、クールダウン短縮+17.5%で、物理防御はビルド1の+910に対し+410です。締めの魔女のマントが追加魔法防御の15%を物理防御に変え、15秒ごとに400〜800の魔法ダメージシールドを補う。',
      },
      en: {
        label: 'Stacked penetration for tanky front lines',
        when: 'When the enemy front line is tanky and Guan Yu is the one who has to cut it down.',
        text: 'Cuirass of Savagery into Axe of Torment puts +115 physical attack and 90-180 physical penetration on the board by 4,840G. Starbreaker at item five raises that penetration another 30%. Totals land at +250 physical attack and 17.5% cooldown reduction, with physical defense at +410 against build one\'s +910. Succubus Cloak closes it out, converting 15% of the extra magic defense into physical defense and refreshing a 400-800 magic damage shield every 15 seconds.',
      },
    },
  ],
  // 貂蝉（Mage／MID）
  '141': [
    {
      ja: {
        label: 'HPを火力に変えて居座る',
        when: '敵の魔法ダメージが多く、殴り合いに残りたいとき',
        text: '抵抗の靴・聖杯・神喰らいの書で4,780G、魔法ライフスティール24%はビルド2の倍にあたる。4品目の羽化の衣は追加HPを火力に変える装備です。最大HP+3560まで積むので、魔法攻撃+100と魔法防御貫通+150がどちらも上限に届く。靴の魔法防御+100も合わせ、魔法攻撃+822を前線で出し切る構成。',
      },
      en: {
        label: 'Turning HP into damage',
        when: 'When the enemy leans on magical damage and you want to stay in the fight.',
        text: 'Boots of Resistance, Holy Grail and Insatiable Tome come to 4,780G, and the 24% magical lifesteal is double what build 2 ends with. The fourth pickup, Breakthrough Robe, turns stacked HP into damage. Piling up +3,560 max HP takes both of its passives to their caps: +100 magical attack and +150 magical pierce. Add +100 magical defense from the boots and that +822 magical attack is meant to be spent up close.',
      },
    },
    {
      ja: {
        label: '回転を上げて撃ち続ける',
        when: '敵に飛び込み役が多く、無効化を挟んで撃ち続けたいとき',
        text: '静謐の靴と聖杯で2,720G、この2品だけでクールダウン短縮が30%。最終値57.5%はビルド1の25%の倍以上で、魔法攻撃+862を短い間隔で撃てます。3品目の時の預言で最大HP+900、次のトワイライトストームはヒーローを削るほど魔法防御貫通が伸びる。ムーンライトスタッフは動けなくなる代わりに、1.5秒すべての効果を無効化します。',
      },
      en: {
        label: 'Faster rotations',
        when: 'When the enemy fields several divers and you need an immunity window to keep casting.',
        text: 'Boots of Tranquility and Holy Grail cost 2,720G, and those two alone carry 30% cooldown reduction. The finished 57.5% is more than double build 1\'s 25%, so +862 magical attack comes off a much shorter cycle. Augur\'s Word lands third for +900 max HP, and Twilight Stream after it builds magical pierce the more you damage heroes. Splendor buys 1.5 seconds of full immunity at the price of standing still.',
      },
    },
  ],
  // アンジェラ（Mage／MID）
  '142': [
    {
      ja: {
        label: '残響の杖とライフスティールで押す型',
        when: '序盤からレーンを押し込み、集団戦でも粘りたいとき',
        text: '2品目の残響の杖を2,800Gで立て、スキル命中ごとに140〜280＋魔法攻撃28%の爆発を5秒おきに足す。4品目の神喰らいの書は魔法ライフスティール24%と最大HP+750で、その2%ごとにクールダウン短縮が1%増えます。5品目にヴォイドスタッフを置き、9,040Gで魔法防御貫通45%増を先に確保。総合計は魔法攻撃+1182、最大HP+1250、移動速度+17.5%です。',
      },
      en: {
        label: 'Reverberation and lifesteal',
        when: 'When you want to shove the lane early and still hold up in teamfights.',
        text: 'The Scepter of Reverberation lands second at 2,800G, adding a 140-280 + 28% magic attack blast on skill hits, once every 5 seconds. Fourth is the Insatiable Tome: 24% magic lifesteal, +750 max HP, plus 1% cooldown reduction for every 2% of that lifesteal. Void Staff comes fifth, so the 45% magic defense penetration is online by 9,040G. Totals come to +1182 magic attack, +1250 max HP and +17.5% movement speed.',
      },
    },
    {
      ja: {
        label: '回復封じと自衛を足す型',
        when: '敵に回復やライフスティールの多いヒーローがいるとき',
        text: '2品目の夢魔の牙は、命中した敵のHP回復とライフスティールを2.5秒間35%落とす。4品目の灼熱の杖はHP30%未満でCCを解除し、移動速度が30%上がる4秒のシールドを張ります（CD90秒）。5品目を賢者の天書にして9,530Gで魔法攻撃+350とクールダウン短縮10%を先に確保し、ヴォイドスタッフの貫通は最後に回す。総合計はクールダウン短縮+22.5%、移動速度+25%、魔法攻撃+1202。',
      },
      en: {
        label: 'Anti-heal with a safety net',
        when: 'When the enemy team leans on healing or lifesteal to stay alive.',
        text: 'Venomous Staff arrives second and cuts enemy healing and lifesteal by 35% for 2.5 seconds on every hit. Ardent Dominion follows fourth, clearing crowd control below 30% HP and granting a 4-second shield that also adds 30% movement speed (90s cooldown). Sage\'s Tome is bought fifth at 9,530G for the early +350 magic attack and 10% cooldown reduction, which leaves Void Staff\'s penetration for last. The build totals +22.5% cooldown reduction, +25% movement speed and +1202 magic attack.',
      },
    },
  ],
  // ルナ（Fighter／JUNGLE）
  '146': [
    {
      ja: {
        label: '追加HPで魔法防御貫通を伸ばす積み方',
        when: '敵の前衛が魔法防御を積んでいて、火力が通りにくいとき',
        text: '1品目のルーンソードは、モンスターを倒すたび魔法攻撃が6ずつ増え、25スタックで+150に届く。2品目に700Gの抵抗の靴を挟み、移動速度+50と耐性25%を早めに確保。時の預言から羽化の衣までの3品で最大HP+2550を積み、羽化の衣がその3%を魔法防御貫通に上乗せします。心眼10枠の+64も別枠で乗り、締めの賢者の怒りまで積むと装備の魔法攻撃は760、そこからさらに30%増える。',
      },
      en: {
        label: 'Bonus HP that feeds magic pierce',
        when: 'When enemy frontliners stack magic defense and your damage stops getting through',
        text: 'Runeblade goes down first: every monster kill adds 6 magic attack, reaching +150 at 25 stacks. The 700G Boots of Resistance slot in second for +50 movement speed and 25% tenacity early. Augur\'s Word, Insatiable Tome and Breakthrough Robe push max HP to +2550, and the Robe adds 3% of that bonus HP on top of its base 30-60 magic pierce. Ten Mind\'s Eye arcana contribute a separate 64, and Savant\'s Wrath closes the gear at +760 magic attack before raising it another 30%.',
      },
    },
  ],
  // 太公望（Mage／MID）
  '148': [
    {
      ja: {
        label: '貫通の靴から入り、回復を止める',
        when: '敵に回復役がいて、魔法防御も積まれるとき',
        text: '700Gの秘法の靴から入り、魔法防御貫通60〜120を1品目で乗せる。3品目の夢魔の牙は、命中した敵のHP回復とライフスティールを2.5秒間35%減らします。ヴォイドスタッフが5品目に来るため、魔法防御貫通45%はビルド2より2,140G早い8,960Gで立つ。夢魔の牙がある分、クールダウン短縮37.5%と移動速度+17.5%がビルド2を7.5ポイントずつ上回ります。',
      },
      en: {
        label: 'Pierce boots first, healing shut off',
        when: 'When the enemy has a healer and stacks magic defense against you',
        text: 'Boots of the Arcane open at 700G, putting 60-120 magic defense penetration on the board with the very first purchase. Venomous Staff lands third and cuts an enemy\'s HP recovery and lifesteal by 35% for 2.5 seconds on hit. Void Staff sits fifth here, so its 45% penetration is live at 8,960G, 2,140G earlier than in build 2. Venomous Staff also carries the totals to 37.5% cooldown reduction and +17.5% movement speed, both 7.5 points above build 2.',
      },
    },
    {
      ja: {
        label: '割合削りを先に、貫通45%を最後に',
        when: '敵に高HPの前衛が並び、削りを早く通したいとき',
        text: '疾風の靴を1品目に置き、移動速度+70と、戦闘を5秒離れたときの追加35〜70を700Gで取ります。苦痛のマスクが3品目に上がり、現在HPの3%を3秒で4回刻む削りは4,880Gで立つ。ビルド1より2,040G早い代わりに、ヴォイドスタッフの魔法防御貫通45%は11,100Gまで遅れます。5品目の賢者の怒りは魔法攻撃を30%増やす装備で、合計+902の上にもう一段乗る。',
      },
      en: {
        label: 'Percent chip early, 45% pierce last',
        when: 'When the enemy fields high-HP frontliners and your chip damage has to land early',
        text: 'Boots of Deftness come first at 700G for +70 movement speed, plus another 35-70 after five seconds out of combat. Mask of Agony moves up to third, so its 3% current-HP hit, four times over three seconds, is online at 4,880G. That is 2,040G earlier than in build 1, and the trade is Void Staff: its 45% magic defense penetration waits until 11,100G. Savant\'s Wrath lands fifth and raises magic power by 30%, stacked on top of the +902 total.',
      },
    },
  ],
  // 劉邦（Tank／CLASH）
  '149': [
    {
      ja: {
        label: 'HPと防御を先に立てる前衛型',
        when: '敵の回復が厚く、前で受け続けたいとき',
        text: '1品目のガーディアン・閃光が物理防御と魔法防御を65〜130増やし、その半分は範囲800以内の味方にも届く。3品目の紅蓮のマントは4,820Gの時点で揃い、物理防御・魔法防御がさらに150ずつ増えます。マントの燃焼は、敵のHP回復とライフスティールを2.5秒間35%減らす。合計は最大HP+5150に対し魔法攻撃+482で、硬さを先に立てる構成です。',
      },
      en: {
        label: 'Defenses first, HP stacked',
        when: 'When the enemy team heals a lot and you need to hold the front line',
        text: 'Guardian - Radiance goes first, adding 65-130 physical and magic defense, with half of that passed to allies within 800 units. Blazing Cape lands third at the 4,820G mark and adds another 150 to each defense. Its burn cuts enemy HP regen and lifesteal by 35% for 2.5 seconds. Totals come to +5150 max HP against +482 magic attack, so durability is what this build buys first.',
      },
    },
    {
      ja: {
        label: '魔法攻撃+902まで伸ばす削り型',
        when: '敵前衛が薄く、序盤から手数で押し込みたいとき',
        text: '1品目の極影の盾・閃光が攻撃速度20%とクールダウン15%短縮を与え、その半分は範囲800以内の味方にも乗る。3・4品目が羽化の衣と巫術の杖なので、6,980Gで魔法攻撃と魔法防御貫通が先に揃います。終盤は賢者の天書が魔法攻撃100ごとにダメージと被ダメージ軽減を0.5%ずつ、賢者の怒りが魔法攻撃を30%上乗せ。合計は魔法攻撃+902とクールダウン短縮+25%で、最大HPはビルド1より2000少ない+3150です。',
      },
      en: {
        label: 'Magic attack stacked to +902',
        when: 'When the enemy front line is thin and you want to keep the pressure on early',
        text: 'Crimson Shadow - Radiance opens with 20% attack speed and 15% cooldown reduction, half of which reaches allies within 800 units. Breakthrough Robe and Staves of Sorcery come third and fourth, so magic attack and magic defense penetration are in place by 6,980G. Late game, Sage\'s Tome adds 0.5% damage and 0.5% damage reduction per 100 magic attack, and Savant\'s Wrath raises magic attack by another 30%. Totals reach +902 magic attack and 25% cooldown reduction, with max HP 2000 lower than build 1 at +3150.',
      },
    },
  ],
  // 韓信（Assassin／JUNGLE）
  '150': [
    {
      ja: {
        label: '靴を先に、締めはライフスティール',
        when: '立ち上がりを速くして、削られても居座りたいとき',
        text: '2品目が700Gの忍びの靴。2,860Gの時点で移動速度50と物理防御100が揃い、物理被ダメージも6〜12%減ります。締めのブラッドエッジの25%にアルカナ略奪×9の14.4%が重なり、物理ライフスティールは39.4%。物理攻撃+487・物理防御貫通+96.4はビルド2とほぼ同値で、差が出るのは居座る力のほうです。',
      },
      en: {
        label: 'Boots early, lifesteal to close',
        when: 'When you want a fast start and enough sustain to stay in the fight',
        text: 'Boots of Fortitude come second at 700G. By 2,860G the build already has 50 Movement Speed, 100 Physical Defense and 6-12% less physical damage taken. Bloodweeper closes it out: its own 25% plus 14.4% from nine Reaver arcana puts Physical Lifesteal at 39.4%. Physical Attack +487 and Physical Pierce +96.4 sit almost level with Build 2, so the gap between the two is sustain, not damage.',
      },
    },
    {
      ja: {
        label: '貫通を先に立て、最後も貫通',
        when: '敵に物理防御の高い前衛が多く、中盤の削りを早めたいとき',
        text: '2品目をシャドーアックスに回し、4,250Gで物理防御貫通90〜180を立てます。靴は3品目に下がるものの、3品を買い終えた4,950Gはビルド1と同額。締めの砕星の槌は貫通を30%増やし、移動速度+7.5%と最大HP+700も付きます。合計では移動速度+15.5%・攻撃速度+21.2%まで伸び、物理ライフスティールは11.2%に留まる。',
      },
      en: {
        label: 'Penetration first, penetration last',
        when: 'When the enemy front line stacks physical defense and you want mid-game damage sooner',
        text: 'Axe of Torment takes the second slot, putting 90-180 Physical Pierce on the board by 4,250G. The boots drop to third, yet both builds sit at the same 4,950G once three items are done. Starbreaker finishes the run with 30% more Pierce, +7.5% Movement Speed and +700 Max Health. Totals climb to +15.5% Movement Speed and +21.2% Attack Speed, while Physical Lifesteal stops at 11.2%.',
      },
    },
  ],
  // 王昭君（Mage／MID）
  '152': [
    {
      ja: {
        label: 'HPと移動速度で粘る型',
        when: '敵に飛び込み役がいて、狙われながら撃ちたいとき',
        text: '疾風の靴を700Gで先に置き、移動速度70を立ち上がりから持つ。5品目のトワイライトストームで、ヒーローに当てるたび魔法防御貫通が4秒間20〜40増えます（最大6スタック）。締めのムーンライトスタッフは魔法ライフスティール12%と、移動も攻撃も止まる代わりに1.5秒すべての効果を無効化するアクティブ。装備とアルカナの合計は最大HP+2200、魔法攻撃+882、クールダウン短縮40%で、HPはビルド2より300高い。',
      },
      en: {
        label: 'Survive-and-cast core',
        when: 'When the enemy has divers and you need to keep casting under pressure.',
        text: 'Boots of Deftness goes down first at 700G, so the +70 movement speed is there from the opening. Twilight Stream, the fifth pick, stacks 20-40 magic defense penetration for four seconds each time you damage an enemy hero, up to six stacks. Splendor closes the build with 12% magic lifesteal and an active that nullifies every effect for 1.5 seconds, though moving and attacking stop for that window. Equipment and arcana together come to +2200 max HP, +882 magic power and 40% cooldown reduction, 300 more HP than Build 2.',
      },
    },
    {
      ja: {
        label: '貫通を先に立てて削り切る型',
        when: '敵の前衛が2体以上で、魔法防御を積まれるとき',
        text: '秘法の靴を1品目に置くと、700Gの時点で魔法防御貫通が60〜120乗る。2品目に繰り上げた苦痛のマスクは2,780Gで立ち、スキルが命中すると3秒間に4回、現在HPの3%を削ります。5品目のヴォイドスタッフで貫通をさらに45%増やし、賢者の天書まで積んで装備とアルカナの合計は魔法攻撃+1122。ビルド1より魔法攻撃で240高く、最大HPは300低い。',
      },
      en: {
        label: 'Penetration first, then burn',
        when: 'When two or more enemy frontliners are stacking magic defense.',
        text: 'Boots of the Arcane in the first slot buys 60-120 magic defense penetration for 700G. Mask of Agony moves up to second and lands at 2,780G total, chipping 3% of the target\'s current HP four times across three seconds whenever a skill connects. Void Staff raises penetration by a further 45%, and Sage\'s Tome brings equipment and arcana to +1122 magic power. That is 240 more magic power than Build 1, and 300 less max HP.',
      },
    },
  ],
  // 蘭陵王（Assassin／JUNGLE）
  '153': [
    {
      ja: {
        label: 'クールダウンと物理防御で居座る',
        when: '敵の主力が物理ダメージで、殴り合いが長引くとき',
        text: '2品目に静謐の靴を入れ、クールダウン短縮を合計37.5%まで積む構成。4品目のグレートブレイカーが先に来るため、7,490GでHP50%未満の敵に30%上乗せできます。5品目の猛攻の鎧は物理防御210とHP900を足し、被弾のたびに与ダメージと移動速度が3秒間伸びる。もう1本と違って攻撃速度は付かないが、殴り合いが続く場面で落ちにくくなります。',
      },
      en: {
        label: 'Cooldowns and armor to hold the fight',
        when: 'When the enemy\'s damage is mostly physical and fights drag on',
        text: 'Boots of Tranquility go in second, pushing total cooldown reduction to 37.5%. Overlord\'s Might comes fourth, so by 7,490G every enemy under 50% HP takes 30% more damage. Cuirass of Savagery follows at 9,540G with 210 physical defense and 900 max HP, and every hit taken raises Gao Changgong\'s damage and movement speed for 3 seconds. No attack speed in this line, but the armor keeps him swinging through a long fight.',
      },
    },
    {
      ja: {
        label: '攻撃速度とクリティカルで手数を出す',
        when: '後衛を狙って、出入りを繰り返したいとき',
        text: '2品目の疾風の靴は移動速度を70増やし、5秒戦闘から離れるとさらに35〜70伸ばす。4品目にマスターブレードを差し込むので、7,050Gで攻撃速度15%とクリティカル率20%が入ります。グレートブレイカーは5品目に下がり、HP50%未満への30%上乗せは9,590Gから。クールダウン短縮は22.5%止まりだが、物理攻撃503.6を通常攻撃の手数で通せます。',
      },
      en: {
        label: 'Attack speed and crit for more swings',
        when: 'When you want to dive the back line and slip out again, over and over',
        text: 'Boots of Deftness are the second buy: 70 movement speed, and 35-70 more after 5 seconds out of combat. Master Sword slots in fourth, so 15% attack speed and 20% critical rate arrive at 7,050G. Overlord\'s Might drops to fifth, pushing the 30% bonus against targets below 50% HP back to 9,590G. Cooldown reduction stops at 22.5%, so this line puts its 503.6 physical attack through raw swing count.',
      },
    },
  ],
  // ムーラン（Fighter／CLASH）
  '154': [
    {
      ja: {
        label: '狩猟1枠で攻撃速度を足す型',
        when: '敵に物理防御を積む前衛が並び、削り合いが長引くとき',
        text: '700Gの忍びの靴から入り、移動速度50と物理被ダメージ6〜12%減を先に確保します。2品目のシャドーアックスで物理防御貫通90〜180、締めの砕星の槌で貫通30%増。アルカナは1枠だけ狩猟にあて、攻撃速度+1%を持たせた配分です。ビルド2との差はこの1枠のみで、11,080Gの完成時は物理攻撃+323.6・物理防御貫通+100・最大HP+3335。',
      },
      en: {
        label: 'One Hunt slot for attack speed',
        when: 'When enemy frontliners stack physical defense and trades drag on',
        text: 'Opens with the 700G Boots of Fortitude, locking in 50 movement speed and a 6-12% cut to physical damage taken. Axe of Torment lands second for 90-180 physical penetration, and Starbreaker finishes the build with a further 30%. One arcana slot goes to Hunt, adding 1% attack speed. That slot is the only difference from build 2: the finished 11,080G set totals +323.6 physical attack, +100 physical penetration and +3335 max HP.',
      },
    },
    {
      ja: {
        label: '隠匿7枠で物理攻撃に寄せる型',
        when: '一度の交戦で敵の後衛まで踏み込みたいとき',
        text: '装備の顔ぶれも買う順もビルド1と同じ。違いはアルカナ1枠で、狩猟を隠匿に替えている。攻撃速度+1%を落とすかわりに物理攻撃が+325.2まで伸び、移動速度は+15.7%のまま。5品目の魔女のマントで魔法防御+300と最大HP+1100が加わり、終盤は物理と魔法の両方を受け止めます。',
      },
      en: {
        label: 'Seven Stealth slots for damage',
        when: 'When you want to reach the enemy backline in a single dive',
        text: 'Same six items in the same order as build 1. The only change is one arcana slot, with Hunt traded for Stealth: 1% attack speed goes away, physical attack rises to +325.2, and movement speed still totals +15.7%. Succubus Cloak, the fifth buy, adds 300 magic defense and 1100 max HP, so the late game holds up against both damage types.',
      },
    },
  ],
  // エリン（Marksman／FARM）
  '155': [
    {
      ja: {
        label: '魔法防御貫通を先に立てる型',
        when: '敵に前衛が2体以上いて、耐えながら削りたいとき',
        text: '差はヴォイドスタッフ1品で、4品目に入れて暴風を5品目へ回します。6,880Gの時点で魔法攻撃+210、魔法防御貫通45%増。秘法の靴の60~120と心眼10枠の+64も重なり、通常攻撃3回ごとに出るスパークダガーの電撃160~400が通る。宿命10枠と略奪10枠も乗せて、最大HP+2837・物理ライフスティール36%で撃ち合いに居座れます。',
      },
      en: {
        label: 'Magic penetration first',
        when: 'When the enemy fields two or more frontliners and you need to keep firing through them.',
        text: 'The one difference is Void Staff, bought fourth with Tempest pushed back to fifth. That puts +210 magic attack and 45% magic penetration on the board at 6,880G. Stacked with the 60-120 from Boots of the Arcane and the +64 from ten Mind\'s Eye slots, the 160-400 jolt Sparkforged Dagger throws every third basic attack lands through magic defense. Ten Fate and ten Reaver slots take the totals to +2837 max HP and 36% physical lifesteal, so Erin can stand in the trade.',
      },
    },
    {
      ja: {
        label: 'クリティカルと物理防御貫通の型',
        when: '敵の前衛が薄く、後衛を素早く落としたいとき',
        text: '4品目を暴風に入れ替え、6,920Gの時点で攻撃速度と移動速度のスタックを先に立てます。もう1本との差である威光の弓は2,570Gと高く、9,490Gまで待つ形。そのぶん遠距離型のエリンには効果が2倍で乗り、物理防御貫通30%と通常攻撃ダメージ+50が付く。禍源10枠と合わせてクリティカル率は+31%、物理攻撃+280・攻撃速度+123%まで伸びます。',
      },
      en: {
        label: 'Crit and physical penetration',
        when: 'When the enemy front line is thin and the backline needs to die fast.',
        text: 'Tempest moves up to fourth here, bringing the attack speed and movement speed stacks online at 6,920G. Daybreaker\'s Virtue, the one item the other build lacks, costs 2,570G and waits until 9,490G. Erin is ranged, so the bow doubles: 30% physical penetration and +50 on basic attack damage. Ten Calamity slots on top of the bow\'s own 15% put crit at +31%, with +280 physical attack and +123% attack speed overall.',
      },
    },
  ],
  // 張良（Mage／MID）
  '156': [
    {
      ja: {
        label: '魔法防御貫通を重ねて硬い敵を削る',
        when: '敵に魔法防御を積むタンクやHPの高いヒーローが並ぶとき',
        text: '1品目の秘法の靴は700Gで、魔法防御貫通を60〜120足す。2品目の苦痛のマスクと3品目の残響の杖で、削りの軸は4,880Gで揃います。現在HPの3%を3秒で4回削り、そこへ140〜280＋魔法攻撃28%の範囲爆発が重なる。5品目のヴォイドスタッフで貫通はさらに45%増え、総合計は魔法攻撃+1122、最大HP+1400。',
      },
      en: {
        label: 'Stacked Magical Pierce for tanky drafts',
        when: 'When the enemy team fields tanks or high-Health heroes stacking Magical Defense.',
        text: 'Boots of the Arcane cost 700G and already carry 60–120 Magical Pierce. Mask of Agony and Scepter of Reverberation follow second and third, putting the damage core online at 4,880G: 3% of current Health four times over 3s, plus a 140–280 (+28% Magical Attack) blast on every skill hit. Void Staff raises pierce another 45% in the fifth slot, and the totals reach +1122 Magical Attack and +1400 Max Health.',
      },
    },
    {
      ja: {
        label: 'クールダウン短縮40%で撃ち続ける',
        when: '敵に回復やライフスティール持ちが複数いるとき',
        text: '2品目の聖杯が、1秒ごとに最大MPの1.5%と最大HPの0.5%を回復する。2,720Gからレーンに居座れて、リコールを挟む回数が減ります。3品目の夢魔の牙は、敵のHP回復とライフスティールを2.5秒間35%減らす。貫通装備がない分、クールダウン短縮は40%（ビルド1は22.5%）、最大HPは+1700まで伸びます。',
      },
      en: {
        label: '40% Cooldown Reduction and healing cuts',
        when: 'When two or more enemies bring healing or Lifesteal.',
        text: 'Holy Grail comes second, restoring 1.5% max Mana and 0.5% max Health every second. Holding the lane from 2,720G cuts down how often you need to recall. Venomous Staff follows at third, dropping enemy healing and Lifesteal by 35% for 2.5s per hit. With no pierce items in the list, Cooldown Reduction reaches 40% (against 22.5% on build 1) and Max Health +1700.',
      },
    },
  ],
  // 不知火舞（Assassin／MID）
  '157': [
    {
      ja: {
        label: '回復封じを3品目で立てる型',
        when: '敵にライフスティール持ちや回復役が複数いるとき',
        text: '神喰らいの書と抵抗の靴を先に置き、3品目に夢魔の牙を立てる。通常攻撃かスキルが命中するたび、敵の回復とライフスティールが2.5秒間35%下がります。賢者の怒りを4品目に回す分、魔法攻撃の伸び方はビルド2より一歩遅い。合計は魔法攻撃+1212、クールダウン短縮+22.5%で、ビルド2より短縮が7.5%高くなります。',
      },
      en: {
        label: 'Anti-heal online by item three',
        when: 'When the enemy team fields multiple healers or lifesteal carries',
        text: 'Insatiable Tome and Boots of Resistance come first, with Venomous Staff third. Every basic attack or skill that lands cuts enemy healing and lifesteal by 35% for 2.5 seconds. Savant\'s Wrath slides to fourth, so magic power ramps a step later than in build 2. The finished line totals +1212 magic power and 22.5% cooldown reduction, 7.5 points clear of build 2.',
      },
    },
    {
      ja: {
        label: '範囲爆発で複数をまとめて削る型',
        when: '敵が固まって動き、複数を巻き込みたいとき',
        text: '3品目を賢者の怒りにして、魔法攻撃30%増を先に立てる。4品目の残響の杖が、スキル命中で周囲に140〜280＋魔法攻撃の28%の魔法ダメージを撒きます（5秒に1回）。夢魔の牙を外す分、クールダウン短縮は15%どまり。合計の魔法攻撃は+1182でビルド1より30低く、代わりに範囲ダメージを取る形です。',
      },
      en: {
        label: 'Area burst from the fourth slot',
        when: 'When enemies group up and you want to hit several at once',
        text: 'Savant\'s Wrath moves into the third slot, landing its 30% magic power boost earlier. Scepter of Reverberation follows at fourth and explodes for 140-280 plus 28% of magic power whenever a skill connects, once every 5 seconds. Dropping Venomous Staff caps cooldown reduction at 15%. Magic power totals +1182, thirty below build 1, and the trade is area damage in place of the anti-heal.',
      },
    },
  ],
  // ドリア（Support／ROAM）
  '159': [
    {
      ja: {
        label: '攻撃速度とクールダウン短縮を配る',
        when: '敵の魔法攻撃が多く、味方に攻撃速度も配りたいとき',
        text: '1品目の極影の盾・救済が攻撃速度20%とクールダウン短縮15%を乗せ、範囲800以内の味方にもその半分が届きます。5品目の魔女のマントは魔法防御+300と、15秒ごとに400〜800の魔法ダメージシールドを足す。物理防御+300の不吉な予兆は6品目に回り、+583が揃うのは10,880Gの地点です。合計は最大HP+5927・魔法防御+400で、ビルド2より魔法防御が90厚い。',
      },
      en: {
        label: 'Attack speed and cooldown aura',
        when: 'Enemy damage is mostly magic, and your carries want the extra attack speed.',
        text: 'Crimson Shadow - Redemption leads off with 20% attack speed and 15% cooldown reduction, and allies within 800 units pick up half of that. Succubus Cloak in slot five adds 300 magic defense and a 400-800 magic damage shield every 15 seconds. Ominous Premonition waits for slot six, so the full +583 physical defense only comes online at 10,880G. Totals land at +5,927 max HP and +400 magic defense, 90 more magic defense than build 2.',
      },
    },
    {
      ja: {
        label: '防御と回復を配り、移動速度も稼ぐ',
        when: '敵の物理攻撃が多く、中盤から前に出続けたいとき',
        text: '1品目のガーディアン・救済で、物理防御と魔法防御が65〜130、5秒ごとに最大HPの0.6%が回復します。範囲800以内の味方にも、その半分が届く。物理防御+300の不吉な予兆を5品目に前倒しし、8,860Gの時点で+583が揃います。永夜の守護まで積んだ合計は最大HP+5962・移動速度+19%で、1秒ごとのHP回復+52はビルド1より3枠多い調和による。',
      },
      en: {
        label: 'Defense and sustain aura',
        when: 'Enemy damage is mostly physical, and you want to hold the front from the mid game on.',
        text: 'Guardian - Redemption leads off with 65-130 physical and magic defense plus 0.6% max HP healed every 5 seconds. Allies within 800 units pick up half of that. Ominous Premonition moves up to slot five, so the full +583 physical defense is online at 8,860G. Longnight Guardian closes the build at +5,962 max HP and +19% movement speed, with the +52 HP regen per second coming from three more Harmony arcana than build 1.',
      },
    },
  ],
  // ナコルル（Assassin／JUNGLE）
  '162': [
    {
      ja: {
        label: '被弾を火力に変えて押し切る',
        when: '集団戦が長引き、殴られながら前に出続けるとき',
        text: 'グリードバイトと抵抗の靴で2,860G、シャドーアックスの貫通90〜180とグレートブレイカーを重ねて7,490G。HPが50%を切った敵への追加30%が、5品目を買う前にそろいます。5品目の猛攻の鎧は物理防御210と最大HP900で、被弾ごとに与ダメージと移動速度が3秒間1%ずつ伸びる（最大10スタック）。総合計は物理攻撃+490、最大HP+2100、移動速度+22.5%です。',
      },
      en: {
        label: 'Turning hits taken into damage',
        when: 'When fights drag on and Nakoruru keeps pushing forward under fire',
        text: 'Rapacious Bite and Boots of Resistance come to 2,860G, then Axe of Torment\'s 90-180 Physical Pierce and Overlord\'s Might bring the total to 7,490G. The 30% bonus against enemies below 50% Health is online before the fifth slot is bought. Cuirass of Savagery fills that slot with 210 Physical Defense and 900 Max Health, and each hit taken adds 1% damage and Movement Speed for 3s, up to 10 stacks. Totals: +490 Physical Attack, +2,100 Max Health, +22.5% Movement Speed.',
      },
    },
    {
      ja: {
        label: '物理防御を厚くして反射で返す',
        when: '敵の主力が物理ダメージで、集中攻撃を受けやすいとき',
        text: '1品目から4品目まではビルド1と同じで、7,490Gまでの並びは変わりません。違うのは5品目で、スパイクアーマー2,020Gは物理防御300と物理攻撃45。3秒間のカウンター状態になり、被ダメージの35%を確定ダメージで返す（CD75秒）。猛攻の鎧より物理防御が90多く、総合計は物理防御+350、物理攻撃+500、最大HP+1900。',
      },
      en: {
        label: 'Countersiege behind extra Physical Defense',
        when: 'When the enemy\'s main damage is physical and Nakoruru draws the focus',
        text: 'The first four slots match Build 1, so the road to 7,490G is unchanged. Only the fifth differs: Spikemail at 2,020G gives 300 Physical Defense and 45 Physical Attack. Its Countersiege runs for 3s and reflects 35% of damage taken as true damage, on a 75s cooldown. That is 90 more Physical Defense than Cuirass of Savagery, for totals of +350 Physical Defense, +500 Physical Attack, and +1,900 Max Health.',
      },
    },
  ],
  // 橘右京（Assassin／JUNGLE）
  '163': [
    {
      ja: {
        label: '締めに貫通を足して前衛を削る',
        when: '敵の前衛が物理防御を積んでくるとき',
        text: 'グリードバイトから不吉な予兆までの5品は、2本とも同じ順です。9,110Gの時点で物理防御+500と最大HP+1700が揃い、正面から受けられる土台ができる。締めの砕星の槌が物理防御貫通を30%増やし、アルカナの固定値+96.4とは別に割合分が加わって硬い前衛を削れます。移動速度も+7.5%足されて合計+22.5%、ジャングルを渡る足はビルド2より速い。',
      },
      en: {
        label: 'Penetration in the final slot',
        when: 'When enemy frontliners are stacking physical defense',
        text: 'The first five buys, Rapacious Bite through Ominous Premonition, run in the same order in both builds. By 9,110G you hold +500 physical defense and +1,700 max HP, enough to take a fight head-on. Starbreaker closes it out with 30% physical defense penetration, a percentage that lands on top of the flat +96.4 from the arcana and cuts into armored frontliners. It also adds +7.5% movement speed for +22.5% total, so this build moves through the jungle faster than Build 2.',
      },
    },
    {
      ja: {
        label: '締めの1品を魔法防御に回す',
        when: '敵に魔法ヒーローが2体以上いるとき',
        text: '5品目までの買う順はビルド1と同じで、違いは締めの1品だけ。砕星の槌の代わりに破魔の霊刀を置き、魔法防御+150に加えて物理攻撃の50%（上限250）が魔法防御に乗ります。装備とアルカナ分の物理攻撃+383だけでも、魔法防御は190ほど増える。代わりに貫通の割合上乗せは無く、移動速度も+15%どまりです。',
      },
      en: {
        label: 'Magic defense in the final slot',
        when: 'When the enemy team fields two or more magic heroes',
        text: 'The buy order through the fifth item matches Build 1, and only the closer changes. Demonsbane takes the last slot instead of Starbreaker, giving +150 magic defense plus 50% of physical attack as extra magic defense, capped at 250. The +383 physical attack from gear and arcana alone adds about 190 on its own. What you give up is the percentage penetration, and movement speed stops at +15%.',
      },
    },
  ],
  // アーサー（Fighter／CLASH）
  '166': [
    {
      ja: {
        label: '反射と被弾で火力を伸ばす',
        when: '敵の前衛と正面から殴り合い、押し返したいとき',
        text: '700Gの抵抗の靴で耐性が25%上がり、2,760Gの氷霜のグリップで物理攻撃+60と物理防御+300が乗る。4品目のスパイクアーマーは3秒間カウンター状態になり、被ダメージの35%を確定ダメージで反射します。6品目の猛攻の鎧は被弾するたびに与ダメージが1%ずつ増え、最大10スタックまで伸びる。宿命アルカナ込みの総合計は物理攻撃+140・攻撃速度+10%・物理防御+1033で、殴られる時間がそのまま火力に変わります。',
      },
      en: {
        label: 'Turning damage taken into damage dealt',
        when: 'When you want to trade blows with the enemy frontline and push them off the lane.',
        text: 'Boots of Resistance open at 700G for +25% Resistance, and Frostscar\'s Embrace brings +60 Physical Attack and +300 Physical Defense online by 2,760G. Spikemail, the fourth buy, spends three seconds reflecting 35% of the damage you take as true damage. Cuirass of Savagery closes the build: every hit taken adds 1% to your damage dealt, stacking up to ten. Counting Fate arcana, the totals reach +140 Physical Attack, +10% Attack Speed and +1,033 Physical Defense, so time spent under fire converts straight into output.',
      },
    },
    {
      ja: {
        label: 'HPとクールダウンで前線を維持',
        when: '敵の主火力が物理で、長い集団戦を耐えたいとき',
        text: '1品目の忍びの靴で物理被ダメージが6%~12%減る。紅蓮のマントを2品目に前倒しし、2,740Gの時点で敵のHP回復とライフスティールを35%減らせます。氷霜のグリップとブリザード、虚空アルカナでクールダウン短縮は36%、最大HPは+5425まで伸びる。覇者の重装が毎秒最大HPの0.5%を回復し、変異アルカナの物理防御貫通+36で硬い相手にも削りが通ります。',
      },
      en: {
        label: 'Health and cooldowns to hold the front',
        when: 'When the enemy\'s main damage is physical and you need to survive a long teamfight.',
        text: 'Boots of Fortitude cut physical damage taken by 6%–12% for the opening 700G. Moving Blazing Cape up to second lands the 35% cut to enemy Health recovery and Lifesteal at 2,740G. Frostscar\'s Embrace, Glacial Buckler and Void arcana together push Cooldown Reduction to 36%, with Max Health climbing +5,425. Overlord\'s Platemail then restores 0.5% of Max Health every second, and Mutation arcana\'s +36 Physical Defense Penetration keeps your damage relevant against armored targets.',
      },
    },
  ],
  // 孫悟空（Assassin／JUNGLE）
  '167': [
    {
      ja: {
        label: 'クリティカルの一撃を最大化',
        when: '敵に柔らかい後衛が2体以上並ぶとき',
        text: '買う順は2本とも同じで、グリードバイト2160Gのあと700Gの忍びの靴で足を確保する。エンドレスブレードとシャドーブレードの2品で、クリティカル率は装備だけで40%。無双を10枠積むとそこに+7%が乗り、クリティカル効果もアルカナだけで+36%になります。攻撃速度と最大HPは宿命の側に譲り、一撃の大きさを取った形。',
      },
      en: {
        label: 'Crit damage stacked high',
        when: 'When the enemy draft fields two or more squishy backline heroes.',
        text: 'The buy order matches Build 2: Rapacious Bite at 2160G, then Boots of Fortitude at 700G to get moving early. Eternity Blade and Shadow Ripper alone carry crit rate to 40%. Ten Unparalleled slots add another 7% and pile on 36% critical damage from arcana alone. Attack speed and health are left to the Fate setup; this one buys the size of the hit.',
      },
    },
    {
      ja: {
        label: '攻撃速度とHPで殴り続ける',
        when: '敵に硬い前衛が並び、一撃で落とせないとき',
        text: '装備の顔ぶれも買う順もビルド1と同じ。10枠を宿命に替え、攻撃速度+48%、最大HP+1337、物理防御+123まで伸ばす。クリティカル率は装備分の40%で止まり、アルカナからのクリティカル効果の上乗せはない。物理ライフスティール36.2%は2本共通で、攻撃速度が10%多いこちらが速く回せます。',
      },
      en: {
        label: 'Attack speed and health',
        when: 'When the enemy fields durable frontliners that no single burst can drop.',
        text: 'The same six items in the same order as Build 1. Swapping the ten slots to Fate lifts the totals to +48% attack speed, +1337 max health and +123 physical defense. Crit rate stops at the 40% the items provide, and no arcana critical damage sits behind it. Both builds carry the same 36.2% physical lifesteal from Reaver and Bloodweeper; the extra 10% attack speed is what turns it over faster.',
      },
    },
  ],
  // ラプール（Support／ROAM）
  '168': [
    {
      ja: {
        label: 'シールドを配り、被弾を反射する',
        when: '敵の火力が物理側に寄り、味方の後衛を守りたいとき',
        text: '1品目のガーディアン・救済で、味方に240〜480＋最大HPの10%のシールドを4秒配れる（CD60秒）。3品目のブリザードでクールダウン短縮20%と物理防御240を先に確保します。4品目の永夜の守護は大きな被弾のあとの320＋HPの8%回復、5品目のスパイクアーマーは被ダメージの35%（最大50%）の確定ダメージ反射。装備とアルカナの合計は最大HP+6462、物理防御+773、移動速度+19%、クールダウン短縮+26%まで伸びる。',
      },
      en: {
        label: 'Shield the team, punish the hits',
        when: 'When enemy damage leans physical and your carries need cover',
        text: 'Guardian - Redemption goes down first, handing allies a 240–480 (+10% max HP) shield for four seconds on a 60-second cooldown. Glacial Buckler lands third, banking 20% cooldown reduction and 240 physical defense early. Longnight Guardian then heals 320 (+8% HP) after a heavy burst, and Spikemail reflects 35% of incoming damage as true damage, up to 50%. Gear and arcana together come to +6,462 max HP, +773 physical defense, +19% movement speed and +26% cooldown reduction.',
      },
    },
    {
      ja: {
        label: '敵の足を止め、魔法にも耐える',
        when: '敵に魔法火力が多く、飛び込みや逃げを止めたいとき',
        text: '1品目のガーディアン・閃光は、範囲1200の敵に4回当てて移動速度を最大50%落とす。3品目のフロストショックで0.75秒の凍結、4品目の不吉な予兆で攻撃者の攻撃速度を最大40%減。5品目の魔女のマントは15秒ごとに400〜800＋追加HPの7%の魔法シールドを張り、追加魔法防御の15%を物理防御に変えます。装備とアルカナの合計は最大HP+7362、魔法防御+480で、ビルド1よりHPが900多く魔法防御も90厚い。',
      },
      en: {
        label: 'Freeze them, soak the magic',
        when: 'When the enemy leans on magic damage and dives or escapes too easily',
        text: 'Guardian - Radiance opens instead: four hits inside a 1,200 range, each taking 3% of current HP and cutting movement speed by up to 50%. Frigid Charge adds a 0.75-second freeze in the third slot, and Ominous Premonition strips up to 40% attack speed off anyone who damages you. Succubus Cloak then refreshes a 400–800 (+7% bonus HP) magic shield every 15 seconds and converts 15% of bonus magic defense into physical defense. Gear and arcana total +7,362 max HP and +480 magic defense — 900 more HP and 90 more magic defense than build 1, paid for with 90 physical defense and 12.5 points of cooldown reduction.',
      },
    },
  ],
  // 后羿（Marksman／FARM）
  '169': [
    {
      ja: {
        label: '靴を先に置き、足と手数を伸ばす',
        when: '序盤からレーンを押し込み、前に出て撃ちたいとき',
        text: '1品目に700Gの速攻の靴を置き、移動速度50と通常攻撃ごとのHP回復30〜60を最初に確保します。サンセットチェイサーが5品目に来るので、射程を125伸ばす逐日は9,050Gで使えるようになる。狩猟を10枠積むぶん、合計は攻撃速度+135%・移動速度+25%でビルド2より3ポイントずつ高い。遠距離型の后羿で貫通30%になる威光の弓は最後に回り、揃うのは11,620Gです。',
      },
      en: {
        label: 'Boots first for speed and volume',
        when: 'When you want to push the lane early and hold a forward position',
        text: 'Boots of Dexterity opens at 700G, so 50 movement speed and a 30-60 heal on every basic attack are on the board immediately. Sunchaser lands fifth, so Daybreak — the active that adds 125 attack range for a ranged hero — is online at 9,050G. Ten Hunt arcana take the totals to +135% attack speed and +25% movement speed, three points clear of build 2 on both counts. Daybreaker\'s Virtue closes the build, so the 30% physical pierce a ranged hero like Hou Yi gets from it only arrives at 11,620G.',
      },
    },
    {
      ja: {
        label: 'ドゥームズデイと貫通を前に出す',
        when: '敵にタンクが2体以上いて、中盤から粘って削りたいとき',
        text: '靴より先に2,100Gのドゥームズデイを買い、物理ライフスティール20%と最大HP500を確保します。通常攻撃に80〜160＋対象の追加HPの7%が乗るので、HPを盛った相手ほど削れる。威光の弓は4品目の7,410Gで、遠距離型の后羿で30%になる貫通がビルド1より4,210G早く立ちます。略奪を3枠混ぜたぶん物理ライフスティールは24.8%まで伸び、20%止まりのビルド1より前に出たまま粘れる。',
      },
      en: {
        label: 'Doomsday and pierce moved up',
        when: 'When the enemy fields two or more tanks and fights run long from the mid game',
        text: 'Doomsday comes before the boots at 2,100G, locking in 20% physical lifesteal and +500 max HP. Its Destruction passive adds 80-160 plus 7% of the target\'s bonus HP to each basic attack, so the more HP the enemy stacks, the more comes off. Daybreaker\'s Virtue moves up to the fourth slot at 7,410G, so the 30% physical pierce a ranged hero draws from it arrives 4,210G earlier than in build 1. Three Reaver arcana push physical lifesteal to 24.8% against build 1\'s 20%, enough to hold a forward position longer.',
      },
    },
  ],
  // 劉備（Fighter／JUNGLE）
  '170': [
    {
      ja: {
        label: '6品目で硬さを足す型',
        when: '敵に通常攻撃で殴り合うヒーローが多いとき',
        text: '1品目のグリードバイトは、モンスターを倒すたびに物理攻撃が3ずつ、25スタックまで積み上がる。2品目の速攻の靴は700Gで、2860Gの時点で移動速度+50が付きます。6品目の不吉な予兆が物理防御+300と最大HP+1200を足し、ダメージを受けると相手の攻撃速度を20~40%落とす。アルカナは紅月・狩猟・鷹の目が10枠ずつで、装備と合わせた合計は攻撃速度+81%、クリティカル率+25%、最大HP+2800です。',
      },
      en: {
        label: 'Defense in the sixth slot',
        when: 'When the enemy team leans on basic-attack heroes',
        text: 'Rapacious Bite comes first at 2,160G: every monster kill adds 3 physical attack, stacking up to 25 times. The 700G Boots of Dexterity follow, so 50 movement speed is locked in by the 2,860G mark. The sixth slot, Ominous Premonition, adds 300 physical defense and 1,200 max HP, and taking damage cuts the attacker\'s attack speed by 20-40%. Ten slots each of Red Moon, Hunt and Eagle Eye sit on top, and gear plus arcana totals +81% attack speed, +25% critical rate and +2,800 max HP.',
      },
    },
    {
      ja: {
        label: '6品目の硬さを薄くして攻めに回す型',
        when: '敵の物理防御が厚く、貫通を足して削りたいとき',
        text: '5品目までの並びはビルド1と同じで、分かれるのは2050Gの猛攻の鎧を置く6品目。物理攻撃+35と物理防御+210、最大HP+900を足し、ダメージを受けるたび与ダメージが1%ずつ、最大10%まで上がります。アルカナは紅月と狩猟を減らして変異5枠と略奪3枠を差し込み、物理攻撃+319、物理防御貫通+82、物理ライフスティール+24.8%まで伸ばす。攻撃速度はアルカナの入れ替えで11ポイント下がって+70%、最大HPは6品目の差で300低い+2500です。',
      },
      en: {
        label: 'A thinner sixth slot, more offense',
        when: 'When enemy physical defense is thick and you need penetration',
        text: 'The first five purchases match Build 1; the split is the sixth slot, where Cuirass of Savagery costs 2,050G. It brings 35 physical attack, 210 physical defense and 900 max HP, and every hit taken raises damage dealt by 1%, up to 10%. Cutting Red Moon and Hunt to make room for five slots of Mutation and three of Reaver lifts the totals to +319 physical attack, +82 physical penetration and +24.8% physical lifesteal. The arcana swap costs 11 points of attack speed, leaving +70%, and the sixth-slot difference leaves max HP 300 lower at +2,500.',
      },
    },
  ],
  // 張飛（Support／ROAM）
  '171': [
    {
      ja: {
        label: 'HPと魔法防御を積む前線型',
        when: '敵に魔法ダメージ源が多く、集団戦が長引くとき',
        text: '1品目の極影の盾・救済は、攻撃速度20%とクールダウン15%短縮を範囲800の味方にも半分渡します。靴と紅蓮のマントのあとは魔女のマント、不吉な予兆、覇者の重装と積み、最大HP+7562・魔法防御+530に届く。魔女のマントは追加魔法防御の15%を物理防御へ変え、15秒ごとに400〜800の魔法ダメージシールドも張ります。不吉な予兆は被弾するだけで攻撃者の攻撃速度を20〜40%削るため、殴り合いが長引くほど得をする構成。',
      },
      en: {
        label: 'Stacked HP and magic defense',
        when: 'When enemy damage leans magic and teamfights drag on',
        text: 'Crimson Shadow - Redemption comes first, passing 20% attack speed and 15% cooldown reduction to allies within 800 at half value. After the boots and Blazing Cape come Succubus Cloak, Ominous Premonition and Overlord\'s Platemail, ending at +7562 max HP and +530 magic defense. Succubus Cloak converts 15% of bonus magic defense into physical defense and grants a 400-800 magic damage shield every 15 seconds. Ominous Premonition cuts 20-40% attack speed from anyone who damages Zhang Fei, so the longer a brawl runs, the more this build earns.',
      },
    },
    {
      ja: {
        label: '物理防御と復活で粘り続ける型',
        when: '敵の物理火力が中心で、集団戦の回数が多いとき',
        text: '1品目のガーディアン・救済は、物理・魔法防御65〜130と5秒ごとの最大HP0.6%回復を、範囲800の味方にも半分渡します。サンライズケープ、フロストショック、賢者の庇護と重ね、物理防御+683もクールダウン短縮43.5%もビルド1を上回る。フロストショックの氷霜領域は敵の移動速度を30〜60%減らし、0.75秒間凍結させるクールダウン75秒のアクティブ。賢者の庇護は1バトル2回まで、死亡2秒後にその場で復活してHPを2000〜3000戻すので、集団戦を続けて踏む試合で粘れます。',
      },
      en: {
        label: 'Physical defense and a revive',
        when: 'When enemy damage is mostly physical and fights come one after another',
        text: 'Guardian - Redemption opens instead, sharing 65-130 physical and magic defense and a heal worth 0.6% of max HP every 5 seconds with allies within 800. Dawnlight, Frigid Charge and Sage\'s Sanctuary follow, putting both physical defense (+683) and cooldown reduction (43.5%) ahead of build 1. Frigid Charge\'s ice field slows enemies by 30-60% and freezes them for 0.75 seconds, on a 75-second cooldown. Sage\'s Sanctuary revives Zhang Fei on the spot 2 seconds after death with 2000-3000 HP, twice per match, so he keeps showing up for the next fight.',
      },
    },
  ],
  // チーシャ（Fighter／CLASH）
  '172': [
    {
      ja: {
        label: 'スパークダガーを先に、HPで粘る型',
        when: 'レーン戦で先に削り合いたいときや、殴り合いが長引くとき',
        text: '最初の2040Gをスパークダガーに使い、靴は2品目へ回す。通常攻撃3回ごとの電撃160〜400が先に立ち、レーン戦の削りが早く出ます。5品目の暴風は命中ごとに攻撃速度・移動速度・ダメージが2%増え、最大5スタックまで乗る。暴風の+600HPと獣痕2枠の+120で、最大HPの合計は+2957とビルド2を720上回ります。',
      },
      en: {
        label: 'Dagger first, health to outlast',
        when: 'When you want the first trades in lane, or fights tend to drag on',
        text: 'The first 2,040G goes into Sparkforged Dagger, pushing the boots back to slot two. Its chain lightning every third basic attack (160-400) comes online early, so lane chip damage starts sooner. Tempest in slot five adds 2% attack speed, movement speed and damage per hit, stacking up to five times. Tempest\'s +600 Max Health and the two Beast Scar slots (+120) bring the total to +2,957 - 720 more than build two.',
      },
    },
    {
      ja: {
        label: '靴を先に、割合貫通で削る型',
        when: '序盤から動き回りたいときや、物理防御を積む相手が並ぶとき',
        text: '700Gの速攻の靴を1品目に置き、移動速度+50を最初から確保します。スパークダガーは2品目へ下がるが、通常攻撃ごとのHP回復20〜40は700Gの時点から働く。5品目の威光の弓2570Gは物理防御貫通を15%増やし、鷹の目の貫通64に割合分が重なります。合計は物理攻撃+330・クリティカル率+15%、最大HPは+2237でビルド1より720低い。',
      },
      en: {
        label: 'Boots first, percentage pierce',
        when: 'When you want early mobility, or the enemy team stacks physical defense',
        text: 'Boots of Dexterity at 700G go down first, locking in +50 movement speed from the opening. Sparkforged Dagger drops to slot two, but the boots\' 20-40 heal per basic attack is already running from 700G onward. Daybreaker\'s Virtue at 2,570G in slot five adds 15% physical pierce on top of Eagle Eye\'s flat 64. Totals come to +330 Physical Attack and +15% Critical Rate, with +2,237 Max Health - 720 below build one.',
      },
    },
  ],
  // 李元芳（Marksman／FARM）
  '173': [
    {
      ja: {
        label: '攻撃速度70%と敵の回復低下',
        when: '敵に回復役やライフスティール持ちがいて、削り切りたいとき',
        text: '6品のうち違うのは4品目だけ。2,080Gのジャッジメントで、ここまでの累計は7,030Gです。攻撃速度+20%が乗り、命中した敵はHP回復とライフスティールが2.5秒間35%落ちる。6品そろえば物理攻撃+425、物理防御貫通+100、攻撃速度はビルド2を20ポイント上回る70%に届きます。',
      },
      en: {
        label: '70% attack speed and healing cut',
        when: 'When the enemy team heals or lifesteals its way through fights',
        text: 'Only the fourth slot differs across the six items. Mortal Punisher costs 2,080G and brings the running total to 7,030G, adding 20% attack speed. Anything it hits loses 35% of its health recovery and lifesteal for 2.5 seconds. Finished, the build carries +425 physical attack, +100 physical pierce and 70% attack speed, twenty points above build 2.',
      },
    },
    {
      ja: {
        label: 'ライフスティール25%とHP+1900',
        when: '飛び込んでくる敵が多く、殴られながら撃ち続けたいとき',
        text: '4品目をブラッドエッジに替えた形。2,000Gで物理ライフスティール25%と最大HP+500が入り、ここまでの累計は6,950Gです。スキルによる物理ライフスティールは、パッシブでさらに25%増える。最大HPは合計+1900でビルド1より500高く、攻撃速度は50%、物理攻撃は+410で止まります。',
      },
      en: {
        label: '25% lifesteal and +1900 max health',
        when: 'When the enemy team has divers and you must keep firing while taking hits',
        text: 'Same build with Bloodweeper in the fourth slot. It costs 2,000G for 25% physical lifesteal and +500 max health, putting the running total at 6,950G. Its passive adds another 25% physical lifesteal on skill damage. Max health finishes at +1900, five hundred above build 1, while attack speed settles at 50% and physical attack at +410.',
      },
    },
  ],
  // 虞美人（Marksman／FARM）
  '174': [
    {
      ja: {
        label: 'クリティカルと射程を先に立てる',
        when: '敵の飛び込みが少なく、後ろから撃ち続けられるとき',
        text: '速攻の靴の次にエンドレスブレードを置き、2,810Gでクリティカル効果を立てます。4品目の威光の弓は遠距離型に2倍で乗り、物理防御貫通30%と通常攻撃ダメージ+50。5品目のジャッジメントが敵のHP回復とライフスティールを35%減らし、締めのサンセットチェイサーは5秒だけ射程を125伸ばします。合計はクリティカル率+86%、攻撃速度+132%、移動速度+22%で、ビルド2より手数も足も速い。',
      },
      en: {
        label: 'Crit and reach first',
        when: 'When the enemy has little dive and Consort Yu can keep firing from the back',
        text: 'Eternity Blade goes right after Boots of Dexterity, so the crit damage bonus is live at 2,810 gold. Daybreaker\'s Virtue lands fourth and doubles on a ranged hero: 30% physical penetration and +50 basic attack damage. Fifth-item Mortal Punisher cuts enemy healing and lifesteal by 35%, and the closing Sunchaser buys 125 extra range for five seconds. Totals reach +86% crit rate, +132% attack speed and +22% movement speed — faster hands and feet than build 2.',
      },
    },
    {
      ja: {
        label: '割合ダメージと粘りを足す',
        when: '敵にHPの高い前衛が2体以上いて、殴り合いが長引くとき',
        text: '2品目をシャドーブレードにして、2,740Gで攻撃速度+35%と移動速度+7.5%を先に確保します。3品目のドゥームズデイが通常攻撃に80〜160＋対象の追加HPの7%を上乗せするので、HPの高い相手ほど削れる。ブラッドエッジまで積めば物理ライフスティールは+49.8%、最大HPは+1,000まで伸びます。威光の弓は6品目に回るぶん、物理防御貫通30%が立つのは11,520Gからで、ビルド1の7,420Gより遅い。',
      },
      en: {
        label: 'Percent damage and sustain',
        when: 'When two or more high-HP frontliners are on the enemy side and fights drag on',
        text: 'Shadow Ripper goes second, banking +35% attack speed and +7.5% movement speed by 2,740 gold. Doomsday follows third and adds 80-160 plus 7% of the target\'s bonus HP to every basic attack, so the bulkier the target, the harder it melts. Once Bloodweeper is in, physical lifesteal sits at +49.8% and max HP at +1,000. Daybreaker\'s Virtue is held back to sixth, so the 30% physical penetration only arrives at 11,520 gold, well after build 1\'s 7,420.',
      },
    },
  ],
  // 鐘馗（Support／ROAM）
  '175': [
    {
      ja: {
        label: '防御オーラを配り、クールダウンを詰める',
        when: '味方の前に立って、周りごと防御を底上げしたいとき',
        text: '1品目のガーディアン・救済は自身の物理・魔法防御を65〜130上げ、範囲800の味方にも半分を配ります。3品目のブリザード2040Gは、クールダウン短縮20%と物理防御240を4,820Gの時点で足す。仕上がりは最大HP+6062、物理防御+713。クールダウン短縮は+48.5%で、ブリザードを持たないビルド2より20ポイント高い。',
      },
      en: {
        label: 'Defense aura, faster cooldowns',
        when: 'When you stand in front of your team and want the defense boost to cover everyone nearby',
        text: 'Guardian - Redemption opens the build with 65-130 physical and magic defense on Kui, and allies within 800 units pick up half of it. Glacial Buckler goes in third, adding 20% cooldown reduction and 240 physical defense by the 4,820G mark. The finished line lands at +6062 max HP and +713 physical defense. Cooldown reduction ends at 48.5%, 20 points above build 2, which never buys Glacial Buckler.',
      },
    },
    {
      ja: {
        label: '攻撃速度を配り、HPで粘る',
        when: 'ステルスの敵がいて、味方の攻撃速度も上げたいとき',
        text: '1品目の極影の盾・閃光は自身の攻撃速度を20%上げ、範囲800の味方にも半分を配ります。アクティブは4回ヒットし、1回ごとに現在HPの3%を削って移動速度を25〜50%落とす。ブリザードを抜いた分、3品目以降が1つずつ前倒しになり、フロストショックは4,810Gで揃います。締めの覇者の重装2450Gで最大HPは+7262、ビルド1を1200上回る。',
      },
      en: {
        label: 'Attack-speed aura, deeper HP pool',
        when: 'When the enemy team hides in stealth and your allies scale with attack speed',
        text: 'Crimson Shadow - Radiance leads here, giving Kui 20% attack speed and handing half of the aura to allies within 800 units. Its active hits four times, each hit stripping 3% of current HP and cutting movement speed by 25-50%. Dropping Glacial Buckler pulls every later slot forward by one, so Frigid Charge is finished at 4,810G. Overlord\'s Platemail closes the build at 2450G and takes max HP to +7262, 1200 above build 1.',
      },
    },
  ],
  // 楊貴妃（Mage／MID）
  '176': [
    {
      ja: {
        label: 'HPで固めて前に出る型',
        when: '敵の物理火力が高く、前に出て粘りたいとき',
        text: '1品目の極影の盾・閃光（2080G）は、HP+1200と味方へのゴールド配布を持つローム専用装備。氷霜のグリップと不死鳥の目、羽化の衣を重ね、最大HPは+5112、物理防御は+413まで伸びます。羽化の衣が追加HPの2%を魔法攻撃（上限100）、3%を魔法防御貫通（上限150）に上乗せする。魔法攻撃の合計は+300で、+1054を積むビルド2とは狙いが別です。',
      },
      en: {
        label: 'Stack HP and play forward',
        when: 'When the enemy team leans physical and you want to hold the front line.',
        text: 'The first buy is Crimson Shadow - Radiance at 2080G, a roam-only item carrying 1200 HP that also feeds gold to whichever ally has the least. Frostscar\'s Embrace, Eye of the Phoenix and Breakthrough Robe follow, taking the totals to +5112 max HP and +413 physical defense. Breakthrough Robe adds 2% of bonus HP as magic attack (capped at 100) and 3% as magic defense penetration (capped at 150). Magic attack still ends at +300, well short of the +1054 that build 2 stacks.',
      },
    },
    {
      ja: {
        label: '魔法攻撃と貫通を積み切る型',
        when: '敵に回復やライフスティールが多く、後ろから撃ちたいとき',
        text: '1品目に700Gの秘法の靴を置き、魔法防御貫通60〜120を最速で立てます。以降は魔法攻撃装備を5品重ね、合計は魔法攻撃+1054、クールダウン短縮26%。夢魔の牙が敵の回復とライフスティールを35%落とし、ヴォイドスタッフが魔法防御貫通を45%増やす。最大HPは+2050で、ビルド1の+5112とは前に出る距離が違います。',
      },
      en: {
        label: 'Full magic damage stack',
        when: 'When enemies bring healing or lifesteal and you want to fire from the back.',
        text: 'Boots of the Arcane go down first at 700G, locking 60-120 magic defense penetration into the opening buy. Five magic attack items follow, for +1054 magic attack and 26% cooldown reduction in total. Venomous Staff cuts enemy healing and lifesteal by 35%, and Void Staff raises magic defense penetration by another 45%. Max HP stops at +2050 against build 1\'s +5112, so Yang Guifei picks her fights from further back.',
      },
    },
  ],
  // 蒼（Marksman／FARM）
  '177': [
    {
      ja: {
        label: '攻撃速度と靴を最優先する型',
        when: '序盤からレーンを押し込み、立ち上がりを速くしたいとき',
        text: '700Gの速攻の靴から入り、攻撃速度20%と移動速度50を最短で確保する。残る5品も全てクリティカル率か攻撃速度が付き、合計は攻撃速度+130%、クリティカル率+86%まで伸びます。締めのサンセットチェイサーは、5秒間だけ移動速度を20%上げるアクティブ持ち。速攻の靴とサンセットチェイサーはビルド2に無く、攻撃速度で40%、クリティカル率で15%上回る。',
      },
      en: {
        label: 'Boots and attack speed first',
        when: 'When you want the fastest start and to push the lane early',
        text: 'Opens with the 700g Boots of Dexterity, so 20% Attack Speed and 50 Movement Speed land as early as possible. The other five items all carry Critical Rate or Attack Speed, finishing at +130% Attack Speed and +86% Critical Rate. Sunchaser caps the order with an active that adds 20% Movement Speed for 5s. Boots of Dexterity and Sunchaser are the two items Build 2 never buys, and they are where the 40% Attack Speed and 15% Critical Rate gap comes from.',
      },
    },
    {
      ja: {
        label: 'ジャングル装備と耐性を先に立てる型',
        when: '敵の魔法ダメージ役が多く、ジャングルも回れるとき',
        text: '1品目に2160Gのグリードバイトを立て、700Gの抵抗の靴は2品目へ回す。グリードバイトはモンスター撃破ごとに物理攻撃+3、クールダウン短縮0.2%が25回まで重なります。2品目の抵抗の靴で物理防御50と魔法防御100が入り、ビルド1に無い耐性25%も付く。合計の物理攻撃は+379でビルド1より50高く、攻撃速度は+90%にとどまります。',
      },
      en: {
        label: 'Jungle item and resistances first',
        when: 'When the enemy leans on magic damage and jungle camps are open to you',
        text: 'Rapacious Bite goes down first at 2,160g, and the 700g Boots of Resistance wait for the second slot. Every monster killed stacks +3 Physical Attack and 0.2% Cooldown Reduction on Rapacious Bite, up to 25 times. Those boots then add 50 Physical Defense, 100 Magical Defense and 25% Resistance, none of which Build 1 ever buys. Total Physical Attack reaches +379, 50 above Build 1, while Attack Speed stops at +90%.',
      },
    },
  ],
  // 楊戩（Fighter／CLASH）
  '178': [
    {
      ja: {
        label: '燃焼で敵の回復を削る最終装備',
        when: '敵にライフスティール持ちや回復役が多いとき',
        text: '9,010Gまでの5品はビルド2と共通で、分かれるのは最後の2,040Gだけ。紅蓮のマントは範囲375以内の敵を燃焼させ、最大HPの1.5%の魔法ダメージを与えます。燃焼を受けた敵はHP回復とライフスティールが2.5秒間35%下がる。魔法防御は合計+520まで伸び、ビルド2を150上回ります。',
      },
      en: {
        label: 'Burn that cuts enemy healing',
        when: 'When the enemy team leans on lifesteal or heavy sustain.',
        text: 'The first five items, through 9,010G, match Build 2; only the last 2,040G differs. Blazing Cape burns enemies within 375 units for 1.5% of their max HP as magic damage. Anything the burn touches loses 35% of its HP regen and lifesteal for 2.5 seconds. Magic defense climbs to +520, a full 150 above Build 2.',
      },
    },
    {
      ja: {
        label: '反射と物理防御で受け止める',
        when: '敵の物理火力が濃く、近距離で殴り合うとき',
        text: '不死鳥の目までの5品は共通で、最後の2,020Gをスパイクアーマーに使う。アクティブのカウンターは3秒間、被ダメージの35%を確定ダメージで反射します。反射量は距離が離れるほど減り、上限は50%、クールダウンは75秒。合計は物理防御+620・物理攻撃+242でビルド1を150と45上回り、魔法防御は+370で150低い。',
      },
      en: {
        label: 'Reflect damage, stack physical defense',
        when: 'When enemy damage is mostly physical and fights happen at close range.',
        text: 'The five items through Eye of the Phoenix are shared; the last 2,020G goes to Spikemail. Its Countersiege active reflects 35% of incoming damage as true damage for 3 seconds. The reflected share falls off with distance, caps at 50%, and comes back every 75 seconds. Totals land at +620 physical defense and +242 physical attack, 150 and 45 above Build 1, with magic defense at +370, 150 short.',
      },
    },
  ],
  // 女媧（Mage／MID）
  '179': [
    {
      ja: {
        label: 'クールダウンを37.5%まで詰める',
        when: 'レーン戦でMPが足りていて、手数で押し込みたいとき',
        text: '1品目の静謐の靴700Gが、+15%のクールダウン短縮を最初に用意する。残響の杖、賢者の天書、賢者の怒りと積んだ7,550G地点で、魔法攻撃が30%増加します。アルカナも生贄ではなく心眼を10枠選び、魔法防御貫通を+64上乗せ。合計はクールダウン短縮37.5%、魔法攻撃+1182、魔法防御貫通+88に届く。',
      },
      en: {
        label: 'Cooldowns cut by 37.5%',
        when: 'When your MP holds up in lane and you want to trade more often',
        text: 'Boots of Tranquility lead at 700G and lock in 15% cooldown reduction from the first buy. Scepter of Reverberation, Sage\'s Tome and Savant\'s Wrath follow, and by the 7,550G mark magical attack is raised by 30%. The arcana differ too: ten Mind\'s Eye instead of Tribute, worth 64 magical pierce. The build lands on 37.5% cooldown reduction, +1182 magical attack and +88 magical pierce.',
      },
    },
    {
      ja: {
        label: 'MPを切らさず魔法攻撃を伸ばす',
        when: '序盤にMPが切れてレーンを離れがちなとき',
        text: '1品目の秘法の靴700Gで、最大MP+400と5秒ごとのMP10回復が付く。アルカナは心眼ではなく生贄を10枠選び、魔法攻撃+24とクールダウン短縮+7%を足します。外した心眼の魔法防御貫通+64は、靴のパッシブの60~120で埋まる。クールダウン短縮は29.5%とビルド1に8ポイント劣るかわり、魔法攻撃は+1206まで伸びます。',
      },
      en: {
        label: 'MP upkeep, bigger magical attack',
        when: 'When MP runs dry early and you keep leaving the lane',
        text: 'Boots of the Arcane open at 700G with +400 max MP and 10 MP restored every 5 seconds. The arcana take ten Tribute rather than Mind\'s Eye, adding +24 magical attack and 7% cooldown reduction. The 64 magical pierce dropped with Mind\'s Eye is covered by the boots\' 60-120 pierce passive. Cooldown reduction settles at 29.5%, eight points behind build 1, while magical attack reaches +1206.',
      },
    },
  ],
  // ナタク（Fighter／CLASH）
  '180': [
    {
      ja: {
        label: '貫通と火力を先に立てる型',
        when: '敵の前衛が物理防御を積み、早い段階から削り合いたいとき',
        text: '700Gの靴のあと、2品目のシャドーアックスで物理防御貫通90〜180を先に立てます。氷霜のグリップ、蒼天の剣と10%ずつ重なり、クールダウン短縮は最終的に41%。5品目のグレートブレイカーはHP50%未満の敵へのダメージを30%増やす。締めの破魔の霊刀が物理攻撃の50%（最大250）ぶんの魔法防御を上乗せし、物理攻撃+476と物理防御+573が並びます。',
      },
      en: {
        label: 'Penetration first',
        when: 'When enemy frontliners stack physical defense and you want to trade from early on.',
        text: 'After the 700G boots, Axe of Torment lands second and puts 90-180 physical defense penetration on the board early. Frostscar\'s Embrace and Pure Sky each stack another 10% cooldown reduction on top of it, and the finished build sits at 41%. Overlord\'s Might in the fifth slot raises damage against enemies below 50% HP by 30%. Demonsbane closes it out, adding magic defense equal to 50% of physical attack (up to 250), so +476 physical attack and +573 physical defense end up side by side.',
      },
    },
    {
      ja: {
        label: 'HPを積んで前に残る型',
        when: '敵に回復持ちが多く、集団戦で長く前に残りたいとき',
        text: '靴の次に紅蓮のマントを置き、HP1100と、敵の回復・ライフスティールを35%削る燃焼を早く立てます。4品目のブラッドレイジは通常攻撃に追加HPの1.5%の物理ダメージを乗せ、積んだHPを火力に回す。覇者の重装まで積むと最大HP+4512、物理防御+733。物理攻撃はもう1本より175低く、HP50%未満へ30%増しのグレートブレイカーは6品目まで待ちます。',
      },
      en: {
        label: 'Health to hold the line',
        when: 'When the enemy team leans on healing and you want to stay on the front line.',
        text: 'Blazing Cape comes right after the boots: +1100 max HP, plus a burn that cuts enemy healing and lifesteal by 35%. Blood Rage in the fourth slot adds 1.5% of bonus HP as physical damage to basic attacks, so the stacked health feeds the damage too. By Overlord\'s Platemail the line sits at +4512 max HP and +733 physical defense. Physical attack is 175 lower than the other build, and the 30% bonus against enemies below half HP waits until Overlord\'s Might arrives sixth.',
      },
    },
  ],
  // 干将・莫耶（Mage／MID）
  '182': [
    {
      ja: {
        label: 'アルカナで最大HPを足す型',
        when: '敵に瞬間火力の高いヒーローがいて、一撃で落とされたくないとき',
        text: '700Gの秘法の靴から入り、残響の杖と賢者の天書で魔法攻撃を積み上げます。4品目の賢者の怒りはパッシブで魔法攻撃を30%増やすので、先に積んだ+350にもそのまま乗る。5品目のヴォイドスタッフで魔法防御貫通が45%増え、締めの神喰らいの書が魔法ライフスティール24%を足します。ビルド2との差はアルカナ3枠だけで、獣痕を入れると最大HPの合計が1430まで伸びる。',
      },
      en: {
        label: 'Arcana Tuned for Max Health',
        when: 'When the enemy team has burst threats and you cannot afford to go down first.',
        text: 'The build opens with Boots of the Arcane at 700G, then stacks Magical Attack through Scepter of Reverberation and Sage\'s Tome. Savant\'s Wrath lands fourth: its passive adds 30% Magical Attack, and the +350 from Sage\'s Tome is already there to be multiplied. Void Staff follows and raises Magical Pierce by 45%, while Insatiable Tome closes the build with 24% Magical Lifesteal. Three arcana slots are the only difference from Build 2 — Beast Scar takes Max Health to 1430.',
      },
    },
    {
      ja: {
        label: 'アルカナでライフスティールを足す型',
        when: 'レーンに長く居座って、リコールの回数を減らしたいとき',
        text: '装備の顔ぶれも買う順もビルド1と同じで、替えているのはアルカナ3枠だけ。獣痕を貪欲にすると、魔法ライフスティールが24%から28.8%に上がります。神喰らいの書はライフスティール2%ごとにクールダウン短縮を1%足す。増えた4.8%は短縮2.4%ぶんにもなり、引き換えに最大HPは1250へ180下がります。',
      },
      en: {
        label: 'Arcana Tuned for Lifesteal',
        when: 'When you want to hold the lane longer and cut down on recalls.',
        text: 'The items and the buying order match Build 1 exactly; only three arcana slots change. Swapping Beast Scar for Avarice lifts Magical Lifesteal from 24% to 28.8%. Insatiable Tome turns every 2% of Magical Lifesteal into 1% Cooldown Reduction, so that extra 4.8% is worth another 2.4% of reduction. The trade is Max Health, which sits at 1250 — 180 lower than Build 1.',
      },
    },
  ],
  // アテナ（Fighter／JUNGLE）
  '183': [
    {
      ja: {
        label: '攻撃速度と追加ダメージで削る型',
        when: '敵にHPの高い前衛が並び、ジャングルを回って育てたいとき',
        text: '1品目のグリードバイトで、モンスターを撃破するたび物理攻撃+3とクールダウン0.2%短縮を最大25スタックまで貯める。2品目は700Gの速攻の靴なので、攻撃速度+20%と移動速度50が早い時間に揃います。後半はドゥームズデイがターゲットの追加HPの7%を通常攻撃に上乗せし、HPを積んだ相手ほど削りが伸びる。合計で物理攻撃+368、攻撃速度+52.8%、物理防御貫通+89.2、物理ライフスティール+23.2%、最大HP+1900、物理防御+300。',
      },
      en: {
        label: 'Attack speed and on-hit chip',
        when: 'When the enemy fields high-HP frontliners and you plan to farm the jungle.',
        text: 'Rapacious Bite comes first, stacking +3 physical attack and 0.2% cooldown reduction on every monster kill, up to 25 stacks. Boots of Dexterity follow at only 700G, so +20% attack speed and 50 movement speed arrive early. Later on, Doomsday adds 7% of the target\'s bonus HP to each basic attack, and the chip damage grows against anyone stacking health. The finished build totals +368 physical attack, +52.8% attack speed, +89.2 physical penetration, +23.2% physical lifesteal, +1900 max HP and +300 physical defense.',
      },
    },
  ],
  // 蔡文姫（Support／ROAM）
  '184': [
    {
      ja: {
        label: '回転率を配り、回復を止める',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '1品目の極影の盾・救済は攻撃速度20%とクールダウン15%短縮のオーラを持ち、範囲800以内の味方にも半分が届く。4品目の夢魔の牙（2,040G）は、攻撃を当てた敵のHP回復とライフスティールを2.5秒間35%落とします。仕上がりは魔法攻撃+757、クールダウン短縮+29.5%、移動速度+26.5%。ビルド2との差はこの2品だけで、回転と足がそのぶん速い。',
      },
      en: {
        label: 'Cooldown aura, anti-heal',
        when: 'When the enemy team sustains through healing and lifesteal',
        text: 'Crimson Shadow - Redemption opens the build with an aura of 20% attack speed and 15% cooldown reduction, half of which reaches allies within 800 range. Venomous Staff fills the fourth slot at 2,040G, cutting HP regeneration and lifesteal by 35% for 2.5 seconds on any enemy you connect with. Totals come to +757 magic attack, +29.5% cooldown reduction and +26.5% movement speed. Those two items are the only gap to build two, and they buy the faster cooldowns and the faster feet.',
      },
    },
    {
      ja: {
        label: '味方ごと硬くし、火力も足す',
        when: '敵の火力が物理と魔法の両方に分かれているとき',
        text: '1品目のガーディアン・救済は物理防御と魔法防御を65〜130上げ、この効果は範囲800以内の味方にも半分が届く。装備とアルカナの合計は魔法攻撃+727、クールダウン短縮+22%、移動速度+19%。4品目の賢者の怒り（2,140G）のパッシブは、この合計とは別に魔法攻撃を30%増やします。ビルド1との差もこの2品で、移動速度が7.5%低いかわりに味方ごと硬くなる。',
      },
      en: {
        label: 'Shared defense, extra damage',
        when: 'When enemy damage comes from both physical and magic sources',
        text: 'Guardian - Redemption leads, adding 65-130 physical and magic defense, and half of that aura reaches allies within 800 range. Equipment and arcana together come to +727 magic attack, +22% cooldown reduction and +19% movement speed. Savant\'s Wrath in the fourth slot, 2,140G, adds a further 30% magic attack on top of that sum. The same two items are the whole gap to build one: 7.5% less movement speed, traded for defense that covers nearby allies too.',
      },
    },
  ],
  // 東皇太一（Support／ROAM）
  '187': [
    {
      ja: {
        label: 'HPを重ねて魔法攻撃も伸ばす型',
        when: '敵の瞬間火力が高く、前に出て耐えたいとき',
        text: '2品目の羽化の衣は、追加HPの2%を魔法攻撃に、3%を魔法防御貫通に変える。調和と虚空のアルカナも合わせて最大HPは+3375まで伸び、硬さがそのまま火力になる。4品目に時の預言を置き、物理・魔法防御50~100と最大HP+900を先に確保する。5品目の神喰らいの書で魔法ライフスティール+24%が付き、賢者の天書は11,780G地点まで回せます。',
      },
      en: {
        label: 'Stacking Health into Magic Power',
        when: 'When the enemy has heavy burst and Donghuang needs to hold the front',
        text: 'Breakthrough Robe, bought second, turns 2% of bonus Health into Magic Attack and 3% into Magic Pierce. The Harmony and Void arcana take Max Health to +3375, so durability doubles as damage. Augur\'s Word lands fourth, a slot earlier than in the other build, adding 50–100 Physical and Magic Defense and another +900 Max Health. Insatiable Tome follows with +24% Magic Lifesteal, which is why Sage\'s Tome can wait for the 11,780G mark.',
      },
    },
    {
      ja: {
        label: '移動速度を先に、貫通で締める型',
        when: '敵が魔法防御を積み、動き回って削りたいとき',
        text: '2品目の残響の杖の移動速度+7.5%に、アルカナの狩猟の+10%が乗って合計+17.5%。スキルが命中するたび周囲が爆発し、140~280＋魔法攻撃の28%の魔法ダメージが入る（CD5秒）。賢者の天書を4品目に前倒しし、7,550Gの時点で魔法攻撃+350が揃います。締めのヴォイドスタッフが魔法防御貫通を45%増やし、アルカナ由来の貫通はビルド1の+24に対して+88。',
      },
      en: {
        label: 'Movement First, Pierce Last',
        when: 'When the enemy stacks Magic Defense and Donghuang needs to keep roaming between lanes',
        text: 'Scepter of Reverberation arrives second for +7.5% Movement Speed, and ten slots of the Hunt arcana add +10% more, for +17.5% in total. Every skill hit detonates around Donghuang for 140–280 plus 28% of Magic Attack as magic damage, on a 5s cooldown. Sage\'s Tome moves up to the fourth slot, putting +350 Magic Attack online by 7,550G. Void Staff closes the build with 45% more Magic Pierce, while the arcana carry flat Pierce to +88 against build one\'s +24.',
      },
    },
  ],
  // 鬼谷子（Support／ROAM）
  '189': [
    {
      ja: {
        label: '足を伸ばし、敵の回復を削る',
        when: '敵に回復役やライフスティール持ちがいて、広く動き回りたいとき',
        text: '4品目の永夜の守護と5品目の夢魔の牙が移動速度を7.5%ずつ足し、合計+32.5%まで伸びる。ビルド2の+17.5%とは足回りが別物です。夢魔の牙は魔法攻撃+240を持ち、命中した敵のHP回復とライフスティールを2.5秒間35%下げる。締めの覇者の重装まで積んで最大HP+5912、物理防御は+333にとどまります。',
      },
      en: {
        label: 'Roam fast, cut enemy healing',
        when: 'When the enemy team has healers or lifesteal and you want to roam wide',
        text: 'Longnight Guardian at slot four and Venomous Staff at slot five each add 7.5% movement speed, taking the total to +32.5% against Build 2\'s +17.5%. Venomous Staff also carries +240 magic power and cuts the HP recovery and lifesteal of anything it hits by 35% for 2.5 seconds. Overlord\'s Platemail closes the set, leaving +5912 max HP but only +333 physical defense.',
      },
    },
    {
      ja: {
        label: '物理防御+713で受け止める',
        when: '敵の物理アタッカーが2体以上で、正面から受け止めたいとき',
        text: '3品目のブリザードから防御装備が4つ続き、物理防御+713、最大HP+6012、クールダウン短縮+33.5%まで積み上がる。4品目の魔女のマントは追加魔法防御の15%を物理防御に変換し、15秒ごとに魔法ダメージシールドも張ります。5品目の不吉な予兆は、ダメージを受けると攻撃者の攻撃速度を2.5秒間最大40%下げる。フロストショックは6品目に回るので、凍結のアクティブが揃うのは終盤。',
      },
      en: {
        label: 'Soak damage with +713 physical defense',
        when: 'When two or more enemy physical carries force you to hold the front line',
        text: 'Glacial Buckler opens a run of four defensive items that takes physical defense to +713, max HP to +6012 and cooldown reduction to +33.5%. Succubus Cloak converts 15% of bonus magic defense into physical defense and puts up a magic damage shield every 15 seconds. Ominous Premonition cuts up to 40% attack speed from anyone who damages Guiguzi, for 2.5 seconds. Frigid Charge slides to slot six, so its freeze only arrives late.',
      },
    },
  ],
  // 孔明（Mage／MID）
  '190': [
    {
      ja: {
        label: '靴から入り、粘りと移動速度を足す',
        when: '序盤から前で削り合い、回復持ちの敵を抑えたいとき',
        text: '700Gの秘法の靴を1品目に置くので、移動速度50と魔法防御貫通60〜120が早い時間からそろいます。3品目の灼熱の杖は、HPが30%を切るとCCを解除して4秒のシールドを張る。4品目の夢魔の牙は、当てた敵の回復とライフスティールを2.5秒間35%減らします。合計は魔法攻撃+1012・移動速度+25%まで伸び、ヴォイドスタッフの貫通45%は6品目11,020Gで入る。',
      },
      en: {
        label: 'Boots first, then staying power',
        when: 'When you trade up front from the early game and need to shut down enemy healing',
        text: 'Boots of the Arcane opens at 700G, so 50 movement speed and 60-120 magical pierce are online early. Ardent Dominion, the third buy, clears crowd control below 30% HP and puts up a 4-second shield. The fourth item, Venomous Staff, cuts enemy healing and lifesteal by 35% for 2.5 seconds on every hit. Totals reach +1012 magical attack and +25% movement speed, with Void Staff\'s 45% pierce arriving last at 11,020G.',
      },
    },
    {
      ja: {
        label: 'ルーンソードを1品目に置く型',
        when: '味方ジャングラーと組み、序盤からモンスターを絡めたいとき',
        text: '700Gの秘法の靴を2品目に回し、1品目には2160Gのルーンソードを置きます。孔明か近くの味方がモンスターを倒すたび、魔法攻撃+6が乗って25スタックまで伸びる。賢者の怒りの魔法攻撃+30%は4品目7,060Gで入り、ビルド1より1,920G早く届きます。6品目のムーンライトスタッフは1.5秒間なにもできなくなる代わりに全ての効果を無効化し、合計のクールダウン短縮は+22.5%。',
      },
      en: {
        label: 'Runeblade as the opening buy',
        when: 'When you can pair with the jungler and work the camps from the early game',
        text: 'Runeblade takes the 2160G opening slot and Boots of the Arcane slides to second. Every monster Kongming or a nearby ally kills feeds Runeblade 6 magical attack, stacking up to 25 times. Savant\'s Wrath and its 30% magical attack bonus lands fourth at 7,060G, a full 1,920G sooner than in the first build. Splendor finishes the build with 1.5 seconds where nothing can touch Kongming — though he cannot move, attack, or cast either — and cooldown reduction totals +22.5%.',
      },
    },
  ],
  // 大喬（Support／ROAM）
  '191': [
    {
      ja: {
        label: 'HPと物理防御に寄せた耐久型',
        when: '敵の主力ダメージが物理で、前で受け止めたいとき',
        text: '1品目の極影の盾・救済が、攻撃速度20%とクールダウン15%短縮のオーラを味方にも半分渡します。不吉な予兆を4品目に置くので、物理防御+583は6,840Gで出そろう。ダメージを受けると攻撃者の移動速度が最大15%落ち、狙われても粘れます。仕上げの時の預言まで積めば最大HPは+6462に届き、もう1本より1,500厚い。',
      },
      en: {
        label: 'Bulk and physical defense',
        when: 'When the enemy\'s main damage is physical and you want to absorb it up front',
        text: 'Crimson Shadow - Redemption opens the build, passing half of its +20% attack speed and 15% cooldown reduction aura to nearby allies. Ominous Premonition comes fourth, so the full +583 physical defense is up by the 6,840G mark. Damage taken slows the attacker by up to 15% for 2.5 seconds, so you hold up when the enemy focuses you. Augur\'s Word closes at +6462 max HP, 1,500 more than the other line.',
      },
    },
    {
      ja: {
        label: 'クールダウン短縮43.5%の回転型',
        when: '敵に回復持ちがいるときや、広く動き回りたいとき',
        text: '1品目のガーディアン・救済は、物理・魔法防御+130と5秒ごとに最大HPの0.6%を回復するオーラを味方にも半分渡す。クールダウン短縮+43.5%と移動速度+19%は、もう1本の+16%／+11.5%を大きく上回ります。短縮の20%は5品目のブリザードが持ち、現在HPの10%を超える一撃を受けると周囲の敵に最大30%のスロウをかける。仕上げの夢魔の牙は、命中した敵のHP回復とライフスティールを2.5秒間35%下げます。',
      },
      en: {
        label: 'Cooldowns cut by 43.5%',
        when: 'Against healing-heavy enemies, or when you want to roam the map nonstop',
        text: 'Guardian - Redemption starts things off with up to +130 physical and magic defense plus 0.6% max HP healed every 5 seconds, half of it shared with allies nearby. Cooldown reduction reaches +43.5% and movement speed +19%, against +16% and +11.5% on the other line. Glacial Buckler carries 20% of that reduction and slows nearby enemies by up to 30% whenever a single hit takes more than 10% of your current HP. Venomous Staff finishes the build, cutting enemy healing and lifesteal by 35% for 2.5 seconds.',
      },
    },
  ],
  // 黄忠（Marksman／FARM）
  '192': [
    {
      ja: {
        label: 'ジャッジメントと暴風で耐えて撃つ',
        when: '敵に回復やライフスティール持ちが並ぶとき',
        text: '靴を700Gで先に履き、シャドーブレードとエンドレスブレードでクリティカル率を40%まで積む。累計6,930Gの4品目にジャッジメントが入り、物理ライフスティール20%に略奪3枠が乗って合計24.8%になります。5品目の暴風は最大HP+600を足し、命中ごとに攻撃速度・移動速度・ダメージが2%ずつ最大5スタック伸びる。威光の弓が6品目に回るぶん、割合の物理防御貫通が効くのは11,580Gの完成後で、総合計は攻撃速度+142%・物理攻撃+399・クリティカル率+71%です。',
      },
      en: {
        label: 'Mortal Punisher and Tempest for staying power',
        when: 'When the enemy side stacks healing and lifesteal',
        text: 'Boots of Dexterity go down first at 700G, then Shadow Ripper and Eternity Blade stack 40% crit rate. Mortal Punisher is the fourth buy, reached at the 6,930G mark, where 20% physical lifesteal plus three Reaver slots comes to 24.8%. Tempest follows fifth for +600 max HP and a stack that adds 2% attack speed, movement speed and damage per hit, up to five. Daybreaker\'s Virtue waits until sixth, so its percentage physical penetration only arrives once the full 11,580G is spent; the finished line reads +142% attack speed, +399 physical attack and +71% crit rate.',
      },
    },
    {
      ja: {
        label: '威光の弓を4品目に繰り上げる',
        when: '敵の前衛が物理防御を積み、中盤から硬くなるとき',
        text: '3品目までは同じ並びで、累計7,420Gの4品目に威光の弓が繰り上がる。遠距離型には物理防御貫通が2倍、通常攻撃ダメージも+50が乗り、硬い前衛を早く削れます。ジャッジメントは5品目へ下がり、略奪枠を狩猟に回したぶん物理ライフスティールは20%止まり。締めのサンセットチェイサーは射程+125と移動速度+20%を75秒ごとに使え、狩猟10枠で移動速度+25%、禍源10枠込みでクリティカル率+86%まで届く。',
      },
      en: {
        label: 'Daybreaker\'s Virtue moved up to fourth',
        when: 'When enemy frontliners stack physical defense and harden by mid-game',
        text: 'The first three items are identical, and Daybreaker\'s Virtue moves up to fourth at the 7,420G mark. On a ranged hero its physical penetration counts double and basic attacks hit for +50 more, so armored frontliners melt sooner. Mortal Punisher slides back to fifth, and the three Reaver slots go to Hunt instead, so physical lifesteal stops at 20%. Sunchaser closes the build with +125 attack range and +20% movement speed on a 75-second cooldown, while ten Hunt slots hold movement speed at +25% and ten Calamity slots push crit rate to +86%.',
      },
    },
  ],
  // カイザー（Fighter／CLASH）
  '193': [
    {
      ja: {
        label: '最後の1枠で火力と魔法防御を同時に足す',
        when: '敵の魔法ダメージ源が1〜2体で、自分も削り役を兼ねるとき',
        text: '5品目までは2本とも共通で、グリードバイト2160Gから入り、700Gの抵抗の靴で足を作ります。6品目に破魔の霊刀2060Gを置くと、物理攻撃は合計+369、魔法防御+250、最大HP+2400。この合計とは別に、物理攻撃の50%が魔法防御へ上乗せされる（上限250）。もう1本と比べると、最大HPが500低い代わりに物理攻撃が90高く仕上がります。',
      },
      en: {
        label: 'Last slot buys damage and magic defense',
        when: 'When one or two enemies carry the magic damage and you also need to be a damage source',
        text: 'The first five buys are identical in both lines: Rapacious Bite at 2160G, then Boots of Resistance at 700G to get boots down early, followed by Axe of Torment, Spikemail and Master Sword. Closing with Demonsbane at 2060G puts the totals at +369 physical attack, +250 magic defense and +2400 max HP. On top of that listed total, Demonsbane converts 50% of physical attack into magic defense, capped at 250. Compared with the other line, you trade 500 max HP for 90 more physical attack.',
      },
    },
    {
      ja: {
        label: '6品目をHPと魔法防御に振る',
        when: '敵に魔法ダメージ源が2体以上いて、耐えて長く戦いたいとき',
        text: '5品目までの並びはビルド1と同じで、違うのは6品目の1枠だけ。魔女のマント2020Gを置くと最大HP+2900、魔法防御+400まで伸びます。15秒ごとに400~800（+追加HPの7%）の魔法ダメージシールドが乗り、追加魔法防御の15%は物理防御へ変わる。物理攻撃は+279で、ビルド1より90低く仕上がります。',
      },
      en: {
        label: 'Sixth slot goes to HP and magic defense',
        when: 'When two or more enemies deal magic damage and you need to stay in the fight',
        text: 'The buy order matches build 1 through the fifth slot, and only the sixth differs. Succubus Cloak at 2020G takes max HP to +2900 and magic defense to +400. It also grants a 400-800 (+7% bonus HP) magic damage shield every 15 seconds and turns 15% of bonus magic defense into physical defense. Physical attack finishes at +279, 90 short of build 1.',
      },
    },
  ],
  // 百里玄策（Assassin／JUNGLE）
  '195': [
    {
      ja: {
        label: '回復と復活で居座る持久型',
        when: '敵の前衛が厚く、集団戦で長く殴り続けたいとき',
        text: '2品目の速攻の靴で、攻撃速度20%と通常攻撃ごとのHP回復20〜40が2,860Gの時点で入ります。4品目のブラッドエッジは物理ライフスティール25%に加え、スキルによる分にも同じ25%が乗る。締めの賢者の庇護は死亡2秒後にその場で復活し、HP2000〜3000を得て1試合に2回まで使えます。変異7枠で物理防御貫通は89.2まで伸び、ビルド2より18高い。',
      },
      en: {
        label: 'Sustain and revive',
        when: 'When the enemy frontline is thick and you need to keep swinging through long fights',
        text: 'Boots of Dexterity at slot two brings 20% attack speed and 20–40 health restored per basic attack, all in place by 2,860G. Bloodweeper at slot four adds 25% physical lifesteal, with another 25% applied to skill damage. Sage\'s Sanctuary closes the build: die and you stand back up on the spot two seconds later with 2,000–3,000 health, twice per match. Seven Mutation slots push physical pierce to 89.2, eighteen higher than build 2.',
      },
    },
    {
      ja: {
        label: '攻撃速度で硬い敵を削る耐久型',
        when: '敵にHPを盛ったタンクが2体以上並ぶとき',
        text: '2品目の抵抗の靴が、物理防御50と魔法防御100、耐性25%増を700Gで埋めます。マスターブレードが4品目に繰り上がり、攻撃速度とクリティカル率はビルド1より1品早く立つ。5品目のドゥームズデイは通常攻撃ごとに80〜160＋敵の追加HPの7%を上乗せし、締めの蒼天の剣まで積めば物理防御は200に届きます。アルカナも紅月8枠に寄せ、装備と合わせて攻撃速度+57.8%、クリティカル率+24%。',
      },
      en: {
        label: 'Attack speed against tanks',
        when: 'When two or more health-stacked tanks sit in the enemy draft',
        text: 'Boots of Resistance at slot two covers 50 physical defense, 100 magical defense and 25% resistance for 700G. Master Sword moves up to slot four, so the attack speed and crit rate land one item earlier than in build 1. Doomsday at slot five adds 80–160 plus 7% of the target\'s extra health to every basic attack, and Pure Sky at the end takes physical defense to 200. Eight Red Moon slots finish the arcana: together with the items, +57.8% attack speed and +24% crit rate.',
      },
    },
  ],
  // 百里守約（Marksman／FARM）
  '196': [
    {
      ja: {
        label: '敵の回復を削って締める',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '靴からサンセットチェイサーまでの5品は2本とも共通で、分かれるのは6品目だけ。2,080Gのジャッジメントを最後に置き、自分のHPが30%を切ると5秒かけて375〜750回復します。通常攻撃が当たった敵は2.5秒間、HP回復とライフスティールが35%落ちる。アルカナは略奪7枠に狩猟3枠で、合計のライフスティールは31.2%、攻撃速度はビルド2を23ポイント上回る+128%です。',
      },
      en: {
        label: 'A last item that cuts enemy healing',
        when: 'When the enemy team leans on healing and lifesteal to stay alive',
        text: 'The first five items are shared, so the two builds only split at the sixth. Mortal Punisher costs 2,080G and heals you 375-750 over five seconds once your HP falls under 30%. Enemies hit by a basic attack lose 35% of their healing and lifesteal for 2.5 seconds. With seven Reaver slots and three Hunt, the totals land at 31.2% lifesteal and +128% attack speed, 23 points over build 2.',
      },
    },
    {
      ja: {
        label: '追加ダメージで削り切る',
        when: '敵にHPの多い前衛が並び、削り切りたいとき',
        text: '共通の5品を9,520Gまで積み、6品目に2,540Gのグレートブレイカーを置く。HPが50%を切った敵に追加で30%のダメージが乗り、物理攻撃の合計はビルド1より50多い+439です。アルカナは狩猟を外して略奪を10枠まで伸ばし、ライフスティールは16%、攻撃速度は+105%。装備合計は12,060Gでビルド1より460G高く、最後の1品が揃うのはその分遅れる。',
      },
      en: {
        label: 'A finisher for wounded targets',
        when: 'When the enemy fields high-HP frontliners you need to finish off',
        text: 'The same five items carry the build to 9,520G, then Overlord\'s Might at 2,540G fills the sixth slot. Targets under 50% HP take an extra 30% damage, and total physical attack sits at +439, fifty above build 1. Dropping Hunt for a full ten Reaver slots leaves lifesteal at 16% and attack speed at +105%. At 12,060G the build costs 460G more than build 1, so that last item lands later.',
      },
    },
  ],
  // 棋星（Mage／MID）
  '197': [
    {
      ja: {
        label: '貫通と魔法攻撃で一点を抜く',
        when: '敵が魔法防御を積んでいて、後衛を短時間で落としたいとき',
        text: '魔法攻撃を+1061.2まで積む、貫通寄りの並び。5品目のヴォイドスタッフで魔法防御貫通が45%、仕上げの賢者の怒りで魔法攻撃が30%増えます。2品目の夢魔の牙は、当てた敵の回復とライフスティールを2.5秒間35%落とす。移動速度も+17.5%まで伸び、ビルド2の+10%を7.5ポイント上回ります。',
      },
      en: {
        label: 'Penetration and raw magic power',
        when: 'When the enemy stacks magic defense and you need their backline down fast.',
        text: 'A penetration-leaning order that stacks magic power to +1061.2. Void Staff in the fifth slot adds 45% magic defense penetration, and Savant\'s Wrath finishes by raising magic power a further 30%. Venomous Staff, the second buy, cuts the healing and lifesteal of anything it hits by 35% for 2.5 seconds. Movement speed reaches +17.5%, 7.5 points above build 2\'s +10%.',
      },
    },
    {
      ja: {
        label: '硬さとクールダウン短縮で押し続ける',
        when: '敵にHPの高い前衛が並び、戦闘が長引きそうなとき',
        text: '魔法攻撃を+782に抑え、最大HP+3550とクールダウン短縮+35%に振った構成。2品目の苦痛のマスクが現在HPの3%を3秒間で4回削るので、HPの厚い前衛ほどよく効きます。4品目のトワイライトストームは、敵ヒーローに当てるたび魔法防御貫通が20〜40ずつ伸び、6スタックまで乗る。締めの時の預言は物理防御と魔法防御を50〜100足し、レベルアップのたびに最大HPとMPの20%を戻します。',
      },
      en: {
        label: 'Bulk and cooldown to keep firing',
        when: 'When the enemy fields high-HP frontliners and fights are likely to run long.',
        text: 'Magic power is held to +782, with the rest poured into +3550 max HP and 35% cooldown reduction. Mask of Agony, the second buy, burns 3% of current HP four times over three seconds, so a bigger health bar means a bigger tick. Twilight Stream in the fourth slot adds 20-40 magic defense penetration every time you damage an enemy hero, up to six stacks. Augur\'s Word closes the set with 50-100 physical and magic defense, plus 20% of max HP and MP restored on every level-up.',
      },
    },
  ],
  // モンキ（Fighter／JUNGLE）
  '198': [
    {
      ja: {
        label: 'HP+2550まで積む耐久寄り',
        when: '敵に物理と魔法の火力が両方いて、前で受けたいとき',
        text: '共通の4品のあと、ディープフロストと覇者の重装で最大HPを+2550まで伸ばします。物理防御+360・魔法防御+180は2本のうち厚いほう。4品目に蒼天の剣を置くので、7,040Gの時点で被ダメージ30%軽減のアクティブが手に入る。ディープフロストの凍傷は命中時に135〜270の追加物理ダメージを乗せます（3秒間隔）。',
      },
      en: {
        label: 'Bulk route: +2,550 max HP',
        when: 'When the enemy brings both physical and magic damage and you need to hold the front.',
        text: 'After the four shared items, Deepfrost Siege and Overlord\'s Platemail supply the entire +2,550 max HP. The finished build sits at +360 physical defense and +180 magic defense — the tankier of the two lines. Pure Sky comes fourth here, so the active 30% damage reduction is online at 7,040G. Deepfrost Siege also lands 135-270 bonus physical damage on hit, no more than once every 3 seconds, and slows what it hits.',
      },
    },
    {
      ja: {
        label: 'クリティカル率45%で削る型',
        when: '敵の前衛が薄く、殴り続ける時間を取れるとき',
        text: '4品目をエンドレスブレードに替え、6品でクリティカル率45%・物理攻撃+394まで積みます。クリティカル効果はパッシブで20%、さらにクリティカル率2%ごとに1%増え、上限は50%。締めの暴風は命中ごとに攻撃速度・移動速度・ダメージが2%ずつ、5スタックまで乗る。蒼天の剣が5品目に下がるぶん、被ダメージ軽減が揃うのは9,150G以降になります。',
      },
      en: {
        label: 'Crit route: 45% crit rate',
        when: 'When the enemy front line is thin and you can stay in range to keep swinging.',
        text: 'Eternity Blade takes the fourth slot, and the finished six-item build reaches 45% crit rate and +394 physical attack — 100 more than the other line. Eternity Blade\'s passive grants 20% crit effect, plus another 1% for every 2% crit rate, capped at 50%. Tempest closes the build, stacking 2% attack speed, movement speed and damage per hit up to five times. Pure Sky slides to fifth, so the damage reduction only arrives past 9,150G.',
      },
    },
  ],
  // 公孫離（Marksman／FARM）
  '199': [
    {
      ja: {
        label: '2,040Gの火力を先に立てる',
        when: 'レーン戦が有利で、2,040Gを早く貯められるとき',
        text: '最初の2,040Gをスパークダガーに回す買い方。攻撃速度+35%と、通常攻撃3回ごとの電撃160〜400が靴より先に立ちます。速攻の靴は2品目に後ろ倒しで、移動速度+50が入るのは2,740G地点。3品目以降の4品とアルカナ30枠はビルド2と同じで、完成時は物理攻撃+324・攻撃速度+148%・物理防御貫通+64に届きます。',
      },
      en: {
        label: 'Damage online first at 2,040G',
        when: 'When you are ahead in lane and can bank 2,040G quickly.',
        text: 'The first 2,040G goes entirely into the Sparkforged Dagger. That puts +35% attack speed and the 160-400 shock on every third basic attack in play before any boots. Boots of Dexterity slips to second, so the +50 movement speed only lands at the 2,740G mark. Items three through six and all 30 arcana slots match Build 2, finishing at +324 physical attack, +148% attack speed and +64 physical penetration.',
      },
    },
    {
      ja: {
        label: '700Gの靴で先に足を作る',
        when: '敵のガンクが早く、序盤から逃げ足を確保したいとき',
        text: '速攻の靴を1品目に置き、700Gの時点で移動速度+50と攻撃速度+20%を確保する。靴のパッシブが通常攻撃ごとにHPを30〜60回復し、公孫離はレーンに居座りやすくなります。スパークダガーは2品目に回るので、電撃160〜400が出るのは2,740Gから。装備6品もアルカナ30枠もビルド1と同一で、完成後の性能差はない。',
      },
      en: {
        label: 'Footspeed first for 700G',
        when: 'When enemy ganks come early and you want mobility from the start.',
        text: 'Boots of Dexterity opens the build, buying +50 movement speed and +20% attack speed for just 700G. Its passive restores 30-60 HP on every basic attack, which makes it easier for Arli to hold the lane. Sparkforged Dagger drops to second, so the 160-400 shock only comes online at 2,740G. The six items and 30 arcana slots are identical to Build 1, so the finished stat line matches.',
      },
    },
  ],
  // 明世隠（Support／ROAM）
  '501': [
    {
      ja: {
        label: '魔法防御と最大HPを先に厚くする',
        when: '敵の主力ダメージが魔法寄りで、前に出て守りたいとき',
        text: 'ガーディアン・救済で味方に防御オーラとシールドを配り、抵抗の靴まで2,780Gで立ち上げる。装備の顔ぶれで違うのは魔女のマント1品で、これを4品目（ここまで6,950G）に置きます。魔法防御は合計+400、最大HPは+4362まで伸び、明世隠自身も15秒ごとに400〜800（+追加HPの7%）の魔法ダメージシールドを得る。アルカナは宿命×10で、最大HPと物理防御に振るぶん魔法攻撃は+700にとどまります。',
      },
      en: {
        label: 'Magic resist and HP first',
        when: 'When the enemy\'s main damage is magic and you want to hold the front line',
        text: 'Guardian - Redemption hands allies the defensive aura and the shield, and Boots of Resistance takes you to 2,780G. The only item that differs is Succubus Cloak, slotted fourth at 6,950G. Magic defense totals +400 and max HP climbs to +4362, while Ming himself picks up a 400-800 (+7% of bonus HP) magic damage shield every 15 seconds. Fate arcana x10 feeds HP and physical defense, so magic attack stops at +700.',
      },
    },
    {
      ja: {
        label: '魔法攻撃を前に出し、回復も止める',
        when: '敵にライフスティールや回復で粘るヒーローがいるとき',
        text: '4品目に賢者の怒り、5品目に賢者の天書と続け、9,680Gで魔法攻撃を先に立てます。装備の差分は6品目の夢魔の牙で、命中した敵のHP回復とライフスティールを2.5秒間35%減らす。アルカナは聖人×10、合計は魔法攻撃+993、クールダウン短縮+23.5%、移動速度+19%まで伸びます。最大HPは+2925、魔法防御は+100で、打たれ強さはビルド1に及ばない。',
      },
      en: {
        label: 'Power first, healing shut down',
        when: 'When the enemy team leans on lifesteal or sustained healing',
        text: 'Savant\'s Wrath fourth and Sage\'s Tome fifth get magic attack online by 9,680G. The one differing item is Venomous Staff, bought last, cutting enemy healing and lifesteal by 35% for 2.5 seconds on hit. Saint arcana x10 brings the totals to +993 magic attack, +23.5% cooldown reduction and +19% movement speed. Max HP is +2925 with only +100 magic defense, so Ming trades durability for damage.',
      },
    },
  ],
  // タイガー（Fighter／JUNGLE）
  '502': [
    {
      ja: {
        label: '貫通を3品目に繰り上げる型',
        when: '敵に物理防御の高い前衛が2体以上いるとき',
        text: 'シャドーアックスを3品目に置き、4,950Gの地点で物理防御貫通90~180を先に立てる。アルカナの鷹の目10枠が+64を上乗せするので、物理防御を積み始めた相手にも通ります。氷霜のグリップは4品目送りで、追撃用のスロウと物理防御300がそろうのは7,010G。最終形は2本とも同じで、物理攻撃+384、クールダウン短縮37.5%、物理ライフスティール25%まで伸びる。',
      },
      en: {
        label: 'Penetration first',
        when: 'When two or more enemy frontliners are built around physical defense',
        text: 'Axe of Torment goes in the third slot, bringing 90-180 physical penetration online at 4,950 gold. Ten slots of the Eagle Eye arcana add another 64, so the damage still gets through once the enemy frontline stacks physical defense. Frostscar\'s Embrace slides to fourth, which pushes its slow and 300 physical defense back to 7,010 gold. Both builds finish identically: +384 physical attack, 37.5% cooldown reduction, 25% physical lifesteal.',
      },
    },
    {
      ja: {
        label: '追撃と硬さを先に立てる型',
        when: '敵に逃げ足の速いヒーローが多く、追い切りたいとき',
        text: '氷霜のグリップを3品目に繰り上げ、4,920Gの地点で先に立てる。スキル発動から5秒以内の通常攻撃が、210~420の追加物理ダメージと15~30%のスロウを持ちます。逃げる相手に張り付けるうえ、物理防御300が先に入る分だけ中盤の小競り合いでも粘れる。シャドーアックスの物理防御貫通90~180は4品目送りで、立つのは7,010G。',
      },
      en: {
        label: 'Chase tools first',
        when: 'When the enemy fields several mobile heroes and you need to chase them down',
        text: 'Frostscar\'s Embrace moves up to third, so at 4,920 gold the basic attack within five seconds of a skill carries 210-420 bonus physical damage. That same hit cuts enemy movement speed by 15-30%, keeping runners inside your range. The 300 physical defense also lands early, making mid-game skirmishes easier to hold. Axe of Torment\'s 90-180 penetration drops to the fourth slot and only arrives at 7,010 gold.',
      },
    },
  ],
  // バイロン（Fighter／CLASH）
  '503': [
    {
      ja: {
        label: '靴を先に置いて耐久を積む型',
        when: '敵に回復やライフスティール持ちが多く、前で受け止めたいとき',
        text: '1品目に700Gの抵抗の靴を置き、2品目の紅蓮のマントまでが2,740G。範囲375の燃焼が当たった敵は、HP回復とライフスティールが2.5秒間35%落ちます。蒼天の剣は4品目まで下がり、締めの覇者の重装が最大HP+4%と毎秒最大HPの0.5%回復を足す。合計は最大HP+5562・物理防御+863・魔法防御+510です。',
      },
      en: {
        label: 'Boots first, bulk after',
        when: 'When the enemy team leans on healing and lifesteal and you need to hold the front.',
        text: 'Boots of Resistance opens at 700G, and Blazing Cape lands by 2,740G. Enemies caught in its 375-radius burn lose 35% of their healing and lifesteal for 2.5 seconds. Pure Sky slips back to the fourth slot, and Overlord\'s Platemail closes the build with +4% max HP and 0.5% of max HP regenerated every second. Totals land at +5562 max HP, +863 physical defense and +510 magic defense.',
      },
    },
    {
      ja: {
        label: '蒼天の剣を1品目に前倒す型',
        when: '敵前衛が硬く、序盤から前に出て押し込みたいとき',
        text: '1品目に2,140Gの蒼天の剣を置き、靴は2品目へ回す。物理攻撃+80とクールダウン短縮10%が、移動速度より先に立ちます。5品目のフロストショックは、制圧以外のハードCC被弾で最大HPの10%のシールドを5秒張る（CD15秒）。締めの砕星の槌が物理防御貫通+30%を足し、合計は物理攻撃+170・クールダウン短縮43.5%・移動速度+17.5%です。',
      },
      en: {
        label: 'Pure Sky opens the build',
        when: 'When the enemy front line is tanky and you want to push the lane from early on.',
        text: 'Pure Sky comes first at 2,140G, which pushes the boots back to the second slot. That puts +80 physical attack and 10% cooldown reduction on the board before any movement speed. Frigid Charge in the fifth slot grants a shield worth 10% of max HP for 5 seconds whenever a hard CC other than suppression lands (15s cooldown). Starbreaker closes with +30% physical penetration, for totals of +170 physical attack, 43.5% cooldown reduction and +17.5% movement speed.',
      },
    },
  ],
  // ミレディ（Mage／MID）
  '504': [
    {
      ja: {
        label: '残響の杖を2品目に置く範囲火力',
        when: '序盤から範囲で削り、レーンを押し込みたいとき',
        text: '2品目の残響の杖が2,800Gで揃い、スキル命中時に140〜280＋魔法攻撃の28%を5秒に1回、範囲へ落とせます。以降はフローズンブレス、トワイライトストーム、賢者の怒りで魔法攻撃を重ね、総合計は魔法攻撃+918.8、クールダウン短縮+44.9%。アルカナは生贄を7枠使ってクールダウン短縮を補うぶん、魔法防御貫通は+43.2とビルド2の半分ほどです。割合ダメージの苦痛のマスクは6品目に回るため、硬い相手への削りは後半に立ち上がる。',
      },
      en: {
        label: 'Scepter second for early AoE',
        when: 'When you want to shove the lane and chip at grouped enemies early.',
        text: 'Scepter of Reverberation lands second, at 2,800 gold, so a skill hit detonates for 140-280 plus 28% of magic attack once every five seconds. Frozen Breath, Twilight Stream and Savant\'s Wrath stack magic attack after that, with equipment and arcana closing at +918.8 magic attack and 44.9% cooldown reduction. Seven Tribute slots pay for cooldown, which leaves magic defense penetration at +43.2 - about half of build 2. Mask of Agony only arrives sixth, so the percent-HP damage against tanky targets comes online late.',
      },
    },
    {
      ja: {
        label: '苦痛のマスクを2品目に置く割合ダメージ',
        when: '敵にタンクや高HPのヒーローが2体以上いるとき',
        text: '2品目に苦痛のマスクを置くと、2,780Gで最大HP+900が乗り、現在HPの3%の割合ダメージが3秒間に4回入ります。アルカナは心眼を10枠に振り、魔法防御貫通はビルド1の+43.2に対して+88。魔法防御を積んだ相手にも通り、総合計もクールダウン短縮+47.5%、魔法攻撃+932とわずかに上回る。締めの夢魔の牙は、命中した敵のHP回復とライフスティールを2.5秒間35%減らす装備です。',
      },
      en: {
        label: 'Mask of Agony second for percent damage',
        when: 'When the enemy draft has two or more tanks or high-HP heroes.',
        text: 'Mask of Agony comes second here: 2,780 gold buys +900 max HP and 3% current-HP damage, four times over three seconds. Ten Mind\'s Eye slots put magic defense penetration at +88 against build 1\'s +43.2. Stacked magic defense gives way, and the totals edge ahead as well, at 47.5% cooldown reduction and +932 magic attack. Venomous Staff closes the build, cutting enemy HP regeneration and lifesteal by 35% for 2.5 seconds.',
      },
    },
  ],
  // 瑶（Support／ROAM）
  '505': [
    {
      ja: {
        label: 'リンク回復と足止めを先に置く',
        when: '敵の火力が物理中心で、味方を守り足止めしたいとき',
        text: '1品目の極影の盾・星泉は、味方1体とリンクして双方のHPを500〜1060＋最大HPの20%回復する。4品目のフロストショックで、移動速度30〜60%減と0.75秒の凍結が6,850Gから使えます。この1品が加わって、物理防御は383、クールダウン短縮は53.5%に届く。夢魔の牙とフローズンブレスは、ビルド2より1品ずつ後ろに回ります。',
      },
      en: {
        label: 'Link heal and lockdown first',
        when: 'When enemy damage is mostly physical and you need to peel for your carry',
        text: 'Crimson Shadow - Starspring opens the build, linking to one ally and healing both for 500-1060 plus 20% of max HP. Frigid Charge comes fourth, so the 30-60% slow and the 0.75s freeze are available from 6,850G. That one item is what takes physical defense to 383 and cooldown reduction to 53.5%. Venomous Staff and Frozen Breath each come one slot later than in build 2.',
      },
    },
    {
      ja: {
        label: '防御オーラから魔法防御まで積む',
        when: '敵に魔法攻撃のヒーローが2体以上いるとき',
        text: '1品目のガーディアン・救済は物理・魔法防御を65〜130上げ、範囲800の味方にも半分を配る。夢魔の牙は4品目。敵のHP回復とライフスティールを35%下げる効果が6,860Gで入ります。締めの魔女のマントは魔法防御300に、15秒ごとの400〜800魔法ダメージシールドが付く。最大HPは4862、クールダウン短縮はビルド1より7.5%低い46%に収まります。',
      },
      en: {
        label: 'Defensive aura, then magic defense',
        when: 'When two or more enemy heroes deal magic damage',
        text: 'Guardian - Redemption grants 65-130 physical and magic defense and shares half of it with allies within 800 range. Venomous Staff moves up to fourth, so the 35% cut to enemy healing and lifesteal arrives at 6,860G. Succubus Cloak closes the build with 300 magic defense and a 400-800 magic damage shield every 15 seconds. Max HP climbs to 4,862, while cooldown reduction settles at 46%, 7.5 points under build 1.',
      },
    },
  ],
  // 雲中君（Assassin／JUNGLE）
  '506': [
    {
      ja: {
        label: '攻撃速度を先に取り、硬さは最後',
        when: '敵の主力が物理攻撃で、集団戦が長引きやすいとき',
        text: 'ビルド2とは4品を共有し、違うのは2品目の靴と6品目だけ。速攻の靴は700Gで攻撃速度20%が付き、通常攻撃ごとにHPが20〜40戻る。合計は攻撃速度+66%、物理攻撃+449。硬さは最後の蒼天の剣にまとめてあり、物理防御150とスキル命中時の被ダメージ20%減が9,590Gを超えてから加わります。',
      },
      en: {
        label: 'Attack speed early, armor last',
        when: 'When the enemy\'s main damage is physical and team fights tend to drag on.',
        text: 'Four of the six items are shared with build 2; only the slot-2 boots and the sixth item differ. Boots of Dexterity cost 700G for 20% attack speed and 20-40 HP back on every basic attack. Attack speed tops out at +66% and physical attack at +449. Defense is saved for last: Pure Sky brings 150 physical defense plus 20% less damage taken once a skill lands on an enemy hero, and it arrives only past the 9,590G mark.',
      },
    },
    {
      ja: {
        label: '靴の時点で防御を先に取る',
        when: '敵に魔法攻撃のヒーローが2体以上いて、序盤から狙われるとき',
        text: '共通の4品はビルド1と同じで、違いは2品目の靴と6品目だけ。抵抗の靴は同じ700Gで物理防御50と魔法防御100が付き、耐性も25%増える。名刀・司命は致命傷を受けても死亡せず、一定時間の無敵と、1秒間の攻撃速度・移動速度15%増が付きます（CD120秒）。最大HPは+1500とビルド1より500多い代わりに、クールダウン短縮は+22.5%で10ポイント低い。',
      },
      en: {
        label: 'Resistances bought with the boots',
        when: 'When two or more enemy heroes deal magic damage and Cirrus gets focused early.',
        text: 'The four shared items match build 1; only the slot-2 boots and the sixth item change. Boots of Resistance cost the same 700G but bring 50 physical defense, 100 magic defense and 25% more tenacity. Destiny carries Cirrus through a fatal hit, granting a brief invulnerability plus one second of 15% bonus attack and movement speed (120s cooldown). Max HP finishes 500 higher at +1500, while cooldown reduction sits 10 points lower at +22.5%.',
      },
    },
  ],
  // 李信（Fighter／CLASH）
  '507': [
    {
      ja: {
        label: '攻撃速度とクリティカルで押し切る',
        when: '敵に物理火力のヒーローが少なく、防御を積まずに殴り合えるとき',
        text: '1品目に700Gの静謐の靴を置き、クールダウン短縮15%を開幕から確保します。2〜4品目で攻撃速度を積み上げ、6品そろった合計は物理攻撃+339、攻撃速度+110%、クリティカル率40%。5品目のエンドレスブレードがクリティカル効果を20%足し、クリティカル率2%ごとにさらに1%上乗せする。締めのブラッドエッジで物理ライフスティールは合計45%に届き、殴りながら立て直せます。',
      },
      en: {
        label: 'Attack speed and crit',
        when: 'When the enemy team has little physical damage, so Li Xin can skip armor and keep trading.',
        text: 'Boots of Tranquility come first at 700G, so the 15% cooldown reduction is in hand from the opening buy. Items two through four stack attack speed, and the finished six-item line reaches +339 physical attack, +110% attack speed and 40% crit rate. Eternity Blade, the fifth purchase, adds 20% crit effect and another 1% for every 2% of crit rate. Bloodweeper closes the set at 45% physical lifesteal, enough to heal back mid-fight.',
      },
    },
    {
      ja: {
        label: '防御とHPを重ねて前で耐える',
        when: '敵の物理火力が厚く、前で受け続けたいとき',
        text: '1品目の忍びの靴が物理防御+100と物理被ダメージ最大12%減を用意します。4品目のブラッドレイジは、現在HPの30%と引き換えに最大HPの40%のシールドを4秒張れる装備。締めの不吉な予兆で物理防御+423、最大HP+2937まで伸び、殴ってきた相手の攻撃速度も最大40%落ちる。物理攻撃はビルド1の339に対して209で、火力より前で耐え続ける側へ振った並びです。',
      },
      en: {
        label: 'Defense and HP to hold the front',
        when: 'When the enemy damage is mostly physical and you have to hold the front.',
        text: 'Boots of Fortitude open with +100 physical defense and up to 12% less physical damage taken. Blood Rage, bought fourth, trades 30% of current HP for a four-second shield worth 40% of max HP. Ominous Premonition finishes the line at +423 physical defense and +2937 max HP, and it cuts the attack speed of whoever hits Li Xin by up to 40%. Physical attack lands at +209 against build one\'s +339, trading damage for staying power.',
      },
    },
  ],
  // 伽羅（Marksman／FARM）
  '508': [
    {
      ja: {
        label: 'クリティカルに復活と回復を足す',
        when: '敵に前衛が多く、集団戦が長引く編成のとき',
        text: '速攻の靴を700Gで先に置き、攻撃速度を20%確保する。シャドーブレードとエンドレスブレードでクリティカル率40%、ここまで4,850G。4品目の威光の弓まで火力を積んで累計7,420G、残る2品で最大HPが1400増えます。合計33%の物理ライフスティールで粘り、賢者の庇護は死亡2秒後にその場で復活して1試合2回まで戻れる。',
      },
      en: {
        label: 'Crit damage backed by lifesteal and a revive',
        when: 'When the enemy fields multiple frontliners and fights run long',
        text: 'Boots of Dexterity come first at 700G for the 20% attack speed. Shadow Ripper and Eternity Blade take crit rate to 40%, and the build stands at 4,850G there. Damage runs through the fourth item, Daybreaker\'s Virtue, for a running 7,420G, and the last two slots add 1400 max HP. Physical lifesteal totals 33%, and Sage\'s Sanctuary revives you on the spot two seconds after death, twice per match.',
      },
    },
    {
      ja: {
        label: '手数と移動速度で削り続ける',
        when: '敵に回復役がいて、魔法ダメージも重いとき',
        text: '抵抗の靴から入り、700Gの時点で魔法防御100と耐性25%を確保する。2品目のスパークダガーは通常攻撃に40〜80の魔法ダメージを足し、3回ごとに160〜400の電撃。攻撃速度は合計143%、移動速度は22%まで伸び、ビルド1より手数で押せます。5品目のジャッジメントが敵の回復とライフスティールを2.5秒間35%落とし、威光の弓は最後に回る。',
      },
      en: {
        label: 'Attack speed and steady chip damage',
        when: 'When the enemy has a healer and their magic damage is heavy',
        text: 'Boots of Resistance open the build, giving 100 magic defense and 25% tenacity for 700G. Sparkforged Dagger adds 40-80 magic damage to every basic attack, plus a 160-400 shock on every third. Totals climb to 143% attack speed and 22% movement speed, so this line trades on volume where build 1 trades on survival. Mortal Punisher cuts enemy healing and lifesteal by 35% for 2.5 seconds, and Daybreaker\'s Virtue waits until the sixth and final slot.',
      },
    },
  ],
  // 孫策（Fighter／CLASH）
  '510': [
    {
      ja: {
        label: '貫通と短縮を厚くした攻め型',
        when: '敵に物理防御を積むタンクがいて、正面から削りたいとき',
        text: '700Gの抵抗の靴から入り、移動速度50と耐性25%増を先に確保します。2〜4品目のシャドーアックス・蒼天の剣・氷霜のグリップで、6,990Gまでに物理攻撃+220とクールダウン短縮30%が入る。氷霜のグリップはスキル発動から5秒以内の通常攻撃に210~420の追加物理ダメージを乗せます。6品目の砕星の槌で物理防御貫通が30%増え、合計は物理攻撃+355、移動速度+17.5%。',
      },
      en: {
        label: 'Penetration and cooldown pressure',
        when: 'When the enemy drafts armored tanks you have to cut through.',
        text: 'Boots of Resistance lead at 700G for 50 movement speed and 25% tenacity. Axe of Torment, Pure Sky and Frostscar\'s Embrace bring the running cost to 6,990G, with +220 physical attack and 30% cooldown reduction already in hand. Frostscar\'s Embrace adds 210-420 bonus physical damage to the next basic attack within 5 seconds of a skill cast. Starbreaker closes the build with 30% more physical penetration, and the totals land at +355 physical attack and +17.5% movement speed.',
      },
    },
    {
      ja: {
        label: 'HPと防御を最優先した耐久型',
        when: '敵の物理火力が高く、最前線で受け続けたいとき',
        text: '700Gの忍びの靴から入り、物理被ダメージを6~12%減らして前に立ちます。3品目のフロストショックまでで物理防御250、最大HP1400。魔女のマント以降の3品で、物理防御+700・魔法防御+500・最大HP+4300まで伸びる。スパイクアーマーは3秒間、被ダメージの35%を確定ダメージで返し、紅蓮のマントの燃焼が敵のHP回復とライフスティールを35%減らします。',
      },
      en: {
        label: 'Health and resistances first',
        when: 'When enemy physical damage is heavy and you need to hold the front line.',
        text: 'Boots of Fortitude open at 700G and cut physical damage taken by 6-12%. By the third item, Frigid Charge, the build already holds 250 physical defense and 1,400 extra HP. Succubus Cloak, Spikemail and Blazing Cape push the totals to +700 physical defense, +500 magic defense and +4,300 max HP. Spikemail reflects 35% of damage taken as true damage for 3 seconds, and Blazing Cape\'s burn cuts enemy healing and lifesteal by 35%.',
      },
    },
  ],
  // 上官婉児（Mage／MID）
  '513': [
    {
      ja: {
        label: '回復妨害と自己回復を先に',
        when: '敵に回復役やライフスティール持ちが複数いるとき',
        text: '2品目の夢魔の牙は、攻撃を当てた敵のHP回復とライフスティールを2.5秒間35%減らします。3品目の神喰らいの書で魔法ライフスティール24%が乗り、ここまで4,800G。魔法ライフスティール2%ごとにクールダウン短縮が1%増え、装備の12.5%に12%分が上乗せされる。ヴォイドスタッフは6品目に回り、最終形は魔法攻撃+1072、魔法防御貫通+88、最大HP+1250です。',
      },
      en: {
        label: 'Anti-heal and sustain first',
        when: 'When the enemy team has healers or heavy lifesteal.',
        text: 'Venomous Staff lands second, cutting healing and lifesteal on anything it hits by 35% for 2.5 seconds. Insatiable Tome follows for 24% magic lifesteal, 4,800G into the build. Every 2% of that lifesteal converts to 1% cooldown reduction, stacking 12% on top of the 12.5% the items list. Void Staff drops to the sixth slot, and the finished set reads +1072 magic attack, +88 magic penetration and +1250 max HP.',
      },
    },
    {
      ja: {
        label: '共通の火力を先に立てる',
        when: '敵に回復役がおらず、CCで狙われやすいとき',
        text: '残響の杖と賢者の怒りを2・3品目に前倒しし、魔法攻撃30%増が4,940Gで入ります。ビルド1では賢者の怒りが9,040G、ヴォイドスタッフが11,080Gと後ろに寄る。4品目の灼熱の杖はHP30%未満でCCを解除し、移動速度30%増の4秒シールドを獲得します。6品目の巫術の杖まで積んで魔法攻撃+997.8、移動速度+32.5%、最大MP+700。',
      },
      en: {
        label: 'Shared damage items first',
        when: 'When the enemy has no healers and crowd control keeps landing on you.',
        text: 'Scepter of Reverberation and Savant\'s Wrath move up to slots two and three, so the 30% magic attack bonus arrives at 4,940G. Build 1 reaches Savant\'s Wrath only at 9,040G and Void Staff at 11,080G. Ardent Dominion, bought fourth, clears crowd control below 30% HP and grants a 4-second shield that carries 30% movement speed. Staves of Sorcery closes out the set at +997.8 magic attack, +32.5% movement speed and +700 max MP.',
      },
    },
  ],
  // アレン（Fighter／CLASH）
  '514': [
    {
      ja: {
        label: '攻撃速度が先、CCにはシールド',
        when: '敵にハードCCが多く、先に攻撃速度を立てて押したいとき',
        text: '2品目にスパークダガーを置き、2,740Gの時点で攻撃速度+35%と移動速度+7.5%が入る。通常攻撃3回ごとの電撃が160〜400の魔法ダメージを足すので、レーンを押し込みやすくなります。5品目のフロストショックは、制圧以外のハードCCを受けるたびに最大HPの10%のシールドを15秒ごとに張る。クールダウン短縮は合計13.5%、仕上がりは物理防御+583・最大HP+5412。',
      },
      en: {
        label: 'Attack speed first, shield for CC',
        when: 'When the enemy team is loaded with hard CC and you want early attack speed to push the lane.',
        text: 'Sparkforged Dagger goes second, so +35% attack speed and +7.5% movement speed are online at 2,740 gold. Every third basic attack arcs for 160-400 magic damage, which speeds up lane pressure. Frigid Charge in the fifth slot answers any hard CC other than suppression with a shield worth 10% of Allain\'s max health, once every 15 seconds. Cooldown reduction totals 13.5%, and the finished build reads +583 physical defense and +5,412 max health.',
      },
    },
    {
      ja: {
        label: '防御を先に固め、最後に攻撃も足す',
        when: '敵の物理火力が濃く、序盤から削られやすいレーンのとき',
        text: '2品目を紅蓮のマントにして、2,740Gで最大HP+1100と物理防御・魔法防御を+150ずつ先に固める。範囲375の燃焼が敵のHP回復とライフスティールを35%減少させるので、長い削り合いに強い。締めの猛攻の鎧で物理防御は合計+643、物理攻撃は+166となり、もう1本より60と35だけ高く仕上がります。被弾するたびに与ダメージと移動速度が最大10スタックまで伸びる。',
      },
      en: {
        label: 'Defense first, damage last',
        when: 'When enemy physical damage is heavy and the clash lane chips you down early.',
        text: 'Blazing Cape goes second here, locking in +1,100 max health plus +150 physical defense and +150 magic defense by 2,740 gold. Its 375-range burn cuts enemy health recovery and lifesteal by 35%, so drawn-out trades tilt Allain\'s way. Cuirass of Savagery closes the build at +643 physical defense and +166 physical attack, 60 and 35 above the other list. Every hit taken stacks up to 10 times for extra damage dealt and movement speed.',
      },
    },
  ],
  // 大司命（Fighter／JUNGLE）
  '517': [
    {
      ja: {
        label: '追加HPを削る攻撃速度型',
        when: '敵の前衛が厚く、魔法攻撃のヒーローも多いとき',
        text: '4品目のドゥームズデイが、通常攻撃に80〜160＋対象の追加HPの7%の物理ダメージを乗せます。HPを積んだ前衛ほど1発が重い。攻撃速度は合計65%、クリティカル率36%、2品目の抵抗の靴で魔法防御100。ビルド2と違うのは2品目の靴と4品目だけです。',
      },
      en: {
        label: 'Attack Speed and Bonus-HP Shred',
        when: 'When enemy frontliners are bulky and magic damage is common',
        text: 'Doomsday, the fourth buy, adds 80-160 plus 7% of the target\'s bonus HP as physical damage to every basic attack. The more HP a frontliner stacks, the harder each hit lands. Totals reach 65% attack speed and 36% crit rate, with 100 magic defense from Boots of Resistance in slot two. Only the boots and the fourth item differ from build 2.',
      },
    },
    {
      ja: {
        label: '物理攻撃と回復を厚くする型',
        when: '敵の物理火力が高く、粘って戦いたいとき',
        text: '4品目のブラッドエッジは物理攻撃+85、物理ライフスティール+25%。パッシブでスキルによる物理ライフスティールがさらに25%乗り、殴り合いながらHPを戻せます。2品目の忍びの靴は物理防御+100で、物理被ダメージを6〜12%減らす。合計の物理攻撃はビルド1より45高い309、攻撃速度は20%低い45%です。',
      },
      en: {
        label: 'Raw Damage and Sustain',
        when: 'When the enemy leans physical and fights drag on',
        text: 'Bloodweeper in slot four brings +85 physical attack and 25% physical lifesteal. Its passive adds another 25% lifesteal on skill damage, so Augran heals back through extended trades. Boots of Fortitude in slot two give 100 physical defense and cut physical damage taken by 6-12%. The totals land at 309 physical attack, 45 more than build 1, with attack speed 20% lower at 45%.',
      },
    },
  ],
  // 白龍（Marksman／FARM）
  '519': [
    {
      ja: {
        label: '靴で防御を足すクリティカル型',
        when: '敵に魔法攻撃のヒーローが2体以上いるとき',
        text: 'エンドレスブレードから入り、装備とアルカナで物理攻撃+455、クリティカル率+71%まで積み上げる。4品目の威光の弓は遠距離型で効果が2倍になり、物理防御貫通30%と通常攻撃ダメージ+50が付きます。ビルド2との差は2品目の靴だけで、抵抗の靴が物理防御+50・魔法防御+100を足して耐性を25%増やす。攻撃速度の合計は+85%にとどまります。',
      },
      en: {
        label: 'Crit build with defensive boots',
        when: 'When two or more enemy heroes deal magic damage',
        text: 'It opens on Eternity Blade and stacks to +455 physical attack and +71% crit rate once the arcana are counted in. Daybreaker\'s Virtue in the fourth slot doubles up on a ranged hero, so it lands 30% physical penetration and +50 basic attack damage. The only change from Build 2 sits in the second slot: Boots of Resistance add +50 physical defense and +100 magic defense, and raise tenacity by 25%. Total attack speed stops at +85%.',
      },
    },
    {
      ja: {
        label: '靴で攻撃速度を足すクリティカル型',
        when: '敵の魔法ダメージが薄く、通常攻撃を出し続けられるとき',
        text: '買う順も残り5品もビルド1と同じで、違うのは2品目の靴だけ。速攻の靴は攻撃速度+20%に加え、通常攻撃1回ごとにHPを30~60回復します。攻撃速度は合計+105%まで伸び、装備からの物理防御・魔法防御は付かない。物理攻撃+455、クリティカル率+71%、物理防御貫通+64はビルド1と共通です。',
      },
      en: {
        label: 'Crit build with attack-speed boots',
        when: 'When enemy magic damage is light and you can keep auto-attacking',
        text: 'The other five items and the buy order match Build 1; only the second slot changes. Boots of Dexterity bring +20% attack speed and heal 30-60 HP on every basic attack. Total attack speed climbs to +105%, but the build picks up no physical or magic defense from its items. The +455 physical attack, +71% crit rate and +64 physical penetration are shared with Build 1.',
      },
    },
  ],
  // 溟月（Mage／MID）
  '521': [
    {
      ja: {
        label: '狩猟9枠で移動速度を優先',
        when: '敵に接近戦を仕掛けるヒーローが多く、距離を保ち続けたいとき',
        text: '1品目に700Gの静謐の靴を置き、クールダウン短縮15%と移動速度50を最初から持ちます。2品目の夢魔の牙で魔法攻撃240と重傷を先に立て、敵のHP回復とライフスティールを35%削る。5品目の賢者の怒りが魔法攻撃を30%、6品目のヴォイドスタッフが魔法防御貫通を45%引き上げます。装備とアルカナの合計は魔法攻撃+1048.4で、狩猟9枠ぶんを含む移動速度+16.5%・攻撃速度+9%はビルド2を1%ずつ上回る。',
      },
      en: {
        label: 'Nine Hunt slots for mobility',
        when: 'When the enemy roster is full of divers and you need to hold your distance.',
        text: 'Boots of Tranquility come first at 700G, so the 15% cooldown reduction and 50 movement speed are online from the opening item. Venomous Staff follows for 240 magic attack and a passive that cuts enemy HP regen and lifesteal by 35%. Savant\'s Wrath then multiplies magic attack by 30% in slot five, and Void Staff adds 45% magic penetration in slot six. Items and arcana together come to 1,048.4 magic attack, +16.5% movement speed and +9% attack speed, and the nine Hunt slots put both speeds a point above build 2.',
      },
    },
    {
      ja: {
        label: '輪廻2枠でライフスティールを厚く',
        when: '敵の集中攻撃を受けやすく、レーンに長く居座りたいとき',
        text: '装備6品も買う順もビルド1と同じで、動かしたのはアルカナ1枠だけ。狩猟を1枠減らして輪廻を2枠に振り、魔法ライフスティール+26%と魔法攻撃+1050.8を確保します。4品目の神喰らいの書が魔法ライフスティール24%と最大HP750を足すので、輪廻の分もそこに上乗せされる。代わりに移動速度は+15.5%、攻撃速度は+8%とビルド1より1%ずつ低い数値です。',
      },
      en: {
        label: 'Two Reincarnation slots for sustain',
        when: 'When you are the focus of enemy pressure and want to hold the lane longer.',
        text: 'The six items and the buying order match build 1 exactly; only one arcana slot moves. Trading a Hunt slot for a second Reincarnation lifts magic lifesteal to +26% and magic attack to +1,050.8. Insatiable Tome, bought fourth, already carries 24% magic lifesteal and 750 max HP, so the extra point lands on top of that sustain. The trade-off is speed: +15.5% movement speed and +8% attack speed, a point under build 1 on each.',
      },
    },
  ],
  // 曜（Fighter／JUNGLE）
  '522': [
    {
      ja: {
        label: 'クールダウン短縮37.5%まで回す',
        when: 'ジャングルを回り続けて、ガンクの回転を上げたいとき',
        text: '1品目のグリードバイトは、モンスターの撃破ごとに物理攻撃+3とクールダウン短縮0.2%が25スタックまで乗る。2品目に700Gの静謐の靴を挟めば、スタック分を除いてもクールダウン短縮は22.5%。6品そろうと、装備とアルカナの合計は物理攻撃+455、クールダウン短縮37.5%、物理防御貫通100になります。ビルド2の抵抗の靴と比べると、防御値の代わりに手数の速さを取った形。',
      },
      en: {
        label: 'Cooldown stacked to 37.5%',
        when: 'When you want to keep clearing camps and ganking on a short cycle',
        text: 'Rapacious Bite comes first, adding 3 physical attack and 0.2% cooldown reduction per monster killed, up to 25 stacks. Boots of Tranquility at 700G follow, putting cooldown reduction at 22.5% before any stacks are counted. With all six items, gear and arcana add up to +455 physical attack, 37.5% cooldown reduction and 100 physical penetration. Next to build 2\'s Boots of Resistance, this one trades defensive stats for a faster cycle.',
      },
    },
    {
      ja: {
        label: '抵抗の靴で耐性と防御を足す',
        when: '敵に魔法攻撃のヒーローや行動阻害が多いとき',
        text: 'ビルド1との違いは2品目の靴だけ。抵抗の靴700Gで物理防御+50、魔法防御+100、耐性25%増加が乗り、序盤から殴り合いに耐える。残り5品と買う順は同じなので、物理攻撃+455と物理防御貫通100は共通。代わりにクールダウン短縮は37.5%から22.5%へ落ちます。',
      },
      en: {
        label: 'Boots of Resistance instead',
        when: 'When the enemy draft leans on magic damage and crowd control',
        text: 'Only the second buy changes. Boots of Resistance at 700G bring 50 physical defense, 100 magic defense and 25% added tenacity, so Yao can stay in a brawl from early on. The other five items and their order are identical, so +455 physical attack and 100 physical penetration carry over unchanged. What gives way is cooldown reduction, down from 37.5% to 22.5%.',
      },
    },
  ],
  // 西施（Mage／MID）
  '523': [
    {
      ja: {
        label: 'HPを積んで火力と貫通に変える',
        when: '敵にHPの高い前衛が2体以上いるとき',
        text: '疾風の靴から5品目の神喰らいの書まで、HPの付く装備が並び、最大HPは+3350まで伸びる。4品目の羽化の衣が、その追加HPの2%を魔法攻撃、3%を魔法防御貫通に変えます（上限は+100と+150）。3品目の苦痛のマスクは、スキルが当たると3秒間に4回、相手の現在HPの3%を魔法ダメージで削る。魔法ライフスティールは合計36%に届き、締めのムーンライトスタッフは1.5秒すべての効果を無効化する代わりに動けなくなります。',
      },
      en: {
        label: 'Stack HP, then convert it',
        when: 'When the enemy team fields two or more high-HP frontliners',
        text: 'Boots of Deftness opens a run of five HP items that ends with Insatiable Tome, taking max HP to +3350. Breakthrough Robe, bought fourth, turns 2% of that bonus HP into magic attack and 3% into magic penetration, capped at +100 and +150. Mask of Agony, the third item, deals 3% of the target\'s current HP as magic damage four times over three seconds. Magic lifesteal totals 36%, and Splendor closes the build with an active that nullifies all effects for 1.5 seconds, at the cost of being unable to move or act.',
      },
    },
    {
      ja: {
        label: '魔法攻撃と割合貫通で削り切る',
        when: '敵に回復やライフスティール持ちがいるとき',
        text: '2品目に夢魔の牙を置くので、2,740Gで敵のHP回復とライフスティールを35%下げる重傷が手に入る。以降は魔法攻撃の付く装備が並び、合計で魔法攻撃+1032、クールダウン短縮30%まで伸ばします。賢者の怒りが魔法攻撃を30%、ヴォイドスタッフが魔法防御貫通を45%上げる割合強化で、後半ほど効きが増す。最大HPは+1300止まりで、守りは移動速度+25%と、HP30%未満でCCを解除してシールドを張る灼熱の杖に任せます。',
      },
      en: {
        label: 'Raw magic attack and % penetration',
        when: 'When the enemy team leans on healing or lifesteal',
        text: 'Venomous Staff comes second, so the 35% cut to enemy healing and lifesteal is online at 2,740 gold. Every item after it carries magic attack, pushing the totals to +1032 magic attack and 30% cooldown reduction. Savant\'s Wrath adds 30% magic attack and Void Staff adds 45% magic penetration, percentage boosts that pay off more as the build fills out. Max HP stops at +1300, so safety rests on +25% movement speed and Ardent Dominion, which clears crowd control and grants a shield below 30% HP.',
      },
    },
  ],
  // 蒙牙（Marksman／FARM）
  '524': [
    {
      ja: {
        label: '貫通を先に立てて押し切る',
        when: '敵に回復やライフスティール持ちが多いとき',
        text: '3品目に威光の弓を置くと、5,310Gで物理防御貫通15%（遠距離型は2倍）が立ちます。終盤のジャッジメントとグレートブレイカーまで積み終えると、物理攻撃は合計+499、物理ライフスティールは+20%。通常攻撃を当てた敵は、HP回復とライフスティールが2.5秒間35%落ちる。HPが半分を切った相手には、さらに30%の追加ダメージが乗ります。',
      },
      en: {
        label: 'Penetration first, close it out',
        when: 'When the enemy team carries heavy healing or lifesteal',
        text: 'Daybreaker\'s Virtue comes third, so 15% physical penetration — doubled for ranged heroes — is online by 5,310G. Finishing with Mortal Punisher and Overlord\'s Might takes physical attack to +499 and physical lifesteal to +20%. Anything your basic attacks land on loses 35% of its healing and lifesteal for 2.5 seconds. Below half HP, Overlord\'s Might adds another 30% damage.',
      },
    },
    {
      ja: {
        label: 'クリティカル先行、硬さと射程',
        when: '敵に飛び込み役がいて、後衛が詰められやすいとき',
        text: '3品目を2,110Gのエンドレスブレードにすると、4,850Gで3品が並ぶ。威光の弓が4品目に下がるぶん、物理防御貫通は7,420Gまで待ちます。5品目の猛攻の鎧で物理防御+210と最大HP+900、6品目まで積めばクリティカル率+86%・移動速度+25%。サンセットチェイサーのアクティブは75秒ごとに使え、5秒間だけ通常攻撃の射程が125、移動速度が20%伸びます。',
      },
      en: {
        label: 'Crit first, then bulk and reach',
        when: 'When divers are on the enemy team and the backline gets pressured',
        text: 'Eternity Blade goes third at 2,110G, putting three items on the board by 4,850G. Daybreaker\'s Virtue slides to fourth, pushing physical penetration back to the 7,420G mark. Cuirass of Savagery brings +210 physical defense and +900 max HP, and the sixth item takes crit rate to +86% and movement speed to +25%. Sunchaser\'s active comes up every 75 seconds, adding 125 attack range and 20% movement speed for 5 seconds.',
      },
    },
  ],
  // 瀾（Assassin／JUNGLE）
  '528': [
    {
      ja: {
        label: '魔法防御250まで固める耐久寄り',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '共通の4品目で7,090Gまで積み、5品目に不吉な予兆を置く。物理防御300と最大HP1200が入り、瀾が被弾すると攻撃者の攻撃速度が最大40%下がります。締めの破魔の霊刀が魔法防御を+150、パッシブで物理攻撃の50%ぶん（最大250）を上乗せ。合計は魔法防御+250・最大HP+2300で、ビルド2より150と900ずつ多い。',
      },
      en: {
        label: 'Magic resist to 250',
        when: 'When the enemy draft brings two or more magic damage heroes.',
        text: 'Both builds share the first four items and reach 7,090G before they split. Ominous Premonition comes fifth for 300 physical defense and 1,200 max HP, and it cuts an attacker\'s attack speed by up to 40% when Lam takes damage. Demonsbane closes the build with 150 magic defense, then a passive that adds 50% of Lam\'s physical attack on top, capped at 250. Totals land at +250 magic defense and +2,300 max HP, 150 and 900 above build 2.',
      },
    },
    {
      ja: {
        label: '物理攻撃478まで伸ばす詰め型',
        when: '敵の魔法ダメージが少なく、乱戦で削り切りたいとき',
        text: '5品目の猛攻の鎧は、被弾のたびに与ダメージ1%と移動速度が3秒間上がる。ヒーローからの被弾なら1回で2スタック、上限は10スタックまで。締めのグレートブレイカーは2,540Gと2本で最も高く、HP50%未満の敵への与ダメージを30%上げます。合計は物理攻撃+478でクールダウン短縮は32.5%、ビルド1より攻撃が95多く最大HPは900少ない。',
      },
      en: {
        label: 'Physical attack to 478',
        when: 'When the enemy draft is light on magic damage and you plan to brawl and finish wounded targets.',
        text: 'Cuirass of Savagery takes the fifth slot: every hit taken raises Lam\'s damage by 1% and lifts movement speed for 3 seconds, and hero damage counts double, up to ten stacks. Overlord\'s Might closes at 2,540G, the priciest item across the two builds, and adds 30% damage against enemies below half HP. Totals reach +478 physical attack with 32.5% cooldown reduction, 95 attack above build 1 and 900 max HP below it.',
      },
    },
  ],
  // 鏡（Assassin／JUNGLE）
  '531': [
    {
      ja: {
        label: 'アルカナを貫通に寄せる',
        when: '敵の前衛に物理防御の高いヒーローが2体以上いるとき',
        text: '1品目のグリードバイトは、モンスター撃破ごとに物理攻撃+3とクールダウン短縮0.2%を25まで積む。3品目のシャドーアックスが物理防御貫通90〜180、6品目の砕星の槌が同30%を足します。アルカナは変異を8枠まで伸ばし、合計は物理攻撃+506・物理防御貫通+92.8。装備も買う順もビルド2と同じで、攻撃速度14.8%を諦めて貫通10.8と物理攻撃22を取る形です。',
      },
      en: {
        label: 'Pierce-weighted arcana',
        when: 'When two or more enemy frontliners stack Physical Defense',
        text: 'Rapacious Bite goes down first, stacking +3 Physical Attack and 0.2% Cooldown Reduction per monster kill, up to 25. Axe of Torment adds 90–180 Physical Pierce at slot three, Starbreaker another 30% at slot six. Mutation runs to 8 slots here, putting the totals at +506 Physical Attack and +92.8 Physical Pierce. Items and buy order match Build 2 exactly; the arcana simply give up 14.8% attack speed for 10.8 more Pierce and 22 more Physical Attack.',
      },
    },
    {
      ja: {
        label: '攻撃速度に寄せて手数を出す',
        when: '敵の前衛にタンクが1体以下で、通常攻撃で削り切りたいとき',
        text: 'グリードバイトから砕星の槌まで、買う順はビルド1と1品も変わりません。差はアルカナだけで、隠匿10枠を狩猟10枠、変異3枠を紅月3枠に振り替えている。攻撃速度は38.2%から53%へ、クリティカル率は21%から22.5%に上がります。通常攻撃ごとにHPを20〜40戻す速攻の靴の回復も、そのぶん多く入る。',
      },
      en: {
        label: 'Attack-speed arcana',
        when: 'When the enemy front line has at most one tank and you can keep swinging',
        text: 'The buy order is identical to Build 1, Rapacious Bite through Starbreaker for 11,670G. Only the arcana change: 10 Hunt in place of 10 Stealth, and 3 Red Moon in place of 3 Mutation. Attack speed climbs from 38.2% to 53%, and crit rate from 21% to 22.5%. Boots of Dexterity restore 20–40 Health on every basic attack, so the extra swings keep more of that healing coming.',
      },
    },
  ],
  // アグド（Marksman／JUNGLE）
  '533': [
    {
      ja: {
        label: 'クリティカル率71%で一撃を伸ばす',
        when: '敵の前衛が1体以下で、後衛を早く落としたいとき',
        text: '3品目のシャドーブレード、4品目のエンドレスブレードでクリティカル率を先に40%積む。エンドレスブレードはクリティカル率2%ごとにクリティカル効果が1%増えるので、集めるほど一撃が伸びます。5品目のブラッドエッジで物理ライフスティール25%と最大HP+500を確保し、貫通を持つ威光の弓は6品目。装備とアルカナの合計はクリティカル率71%、物理攻撃+424とビルド2を140上回ります。',
      },
      en: {
        label: 'Stacked crit for bigger hits',
        when: 'When the enemy has one frontliner at most and you want their backline down fast.',
        text: 'Shadow Ripper third and Eternity Blade fourth put 40% crit rate up early. Eternity Blade turns every 2% crit rate into 1% more critical damage, so the earlier Agudo stacks rate, the harder each hit lands. Bloodweeper fifth adds 25% physical lifesteal and +500 max HP, and Daybreaker\'s Virtue with its penetration comes sixth. Gear and arcana finish at 71% crit rate and +424 physical attack, 140 more than build 2.',
      },
    },
    {
      ja: {
        label: 'HPと防御を足して削り続ける',
        when: '敵にHPの高い前衛が2体以上並ぶドラフトのとき',
        text: '3品目のディープフロスト、4品目のドゥームズデイで、通常攻撃の追加ダメージと最大HPを同時に積む。ドゥームズデイの追加分にはターゲットの追加HPの7%が乗るので、HPを盛った前衛ほど削れます。貫通を持つ威光の弓は5品目（9,570G）に前倒しし、締めの不吉な予兆で物理防御+300と最大HP+1200。合計は攻撃速度+105%・最大HP+2450で、ビルド1より前に出て撃ち続けられます。',
      },
      en: {
        label: 'HP and defense to keep firing',
        when: 'When the draft puts two or more high-HP frontliners on the enemy team.',
        text: 'Deepfrost Siege third and Doomsday fourth stack bonus basic-attack damage together with max HP. Doomsday\'s extra hit scales with 7% of the target\'s bonus HP, so the more health a frontliner carries, the more it strips away. Daybreaker\'s Virtue moves up to fifth at 9,570G for earlier penetration, and Ominous Premonition closes with +300 physical defense and +1200 max HP. Totals of +105% attack speed and +2450 max HP let Agudo hold a more forward position than build 1 and keep firing.',
      },
    },
  ],
  // 啓（Support／ROAM）
  '534': [
    {
      ja: {
        label: '最大HP+7912を積む前線ローム',
        when: '敵の火力が物理と魔法に散り、前で受け止めたいとき',
        text: '2,780Gまでに極影の盾・救済と疾風の靴が揃い、移動速度+7.5%と靴の+70が同時に乗る。以降は覇者の重装・不死鳥の目・不吉な予兆で守りを重ね、合計は最大HP+7912、物理防御+573、魔法防御+260。救援のシールドは240〜480＋最大HPの10%なので、HPを積むほど味方に配れる量も厚くなります。魔法攻撃を持つ羽化の衣は最後の6品目で、ビルド2より4,040G遅い。',
      },
      en: {
        label: 'Frontline roam, 7,912 HP',
        when: 'When enemy damage is split between physical and magic, and you want to soak it up front.',
        text: 'The first 2,780G buy Crimson Shadow - Redemption and Boots of Deftness, so Sakeer carries +7.5% movement speed alongside the boots\' flat +70 early. Overlord\'s Platemail, Eye of the Phoenix and Ominous Premonition follow, taking the totals to +7,912 max HP, +573 physical defense and +260 magic defense. Redemption\'s shield is 240-480 plus 10% of max HP, so every HP item thickens what Sakeer hands to allies. Breakthrough Robe and its +120 magic attack land last, at 11,390G - 4,040G later than in build 2.',
      },
    },
    {
      ja: {
        label: '魔法防御貫通で削る支援型',
        when: '敵にタンクが2体以上いて、自分でも削りたいとき',
        text: '1品目のガーディアン・救済は自身の物理・魔法防御を65〜130上げ、範囲800以内の味方にも半分が届く。2,780G時点の秘法の靴で魔法防御貫通+60〜120、4品目に前倒しした羽化の衣がさらに最大150を足します。合計は最大HP+6462、魔法攻撃+440、クールダウン短縮+13.5%で、ビルド1よりHPは1450低く魔法攻撃は320高い。締めのフローズンブレスは、命中時に75〜150＋魔法攻撃の15%の魔法ダメージを3秒に1回上乗せする。',
      },
      en: {
        label: 'Magic-penetration support',
        when: 'When the enemy draft fields two or more tanks and you need to add damage yourself.',
        text: 'Guardian - Redemption opens with 65-130 physical and magic defense on Sakeer, and half of that aura reaches allies within 800 range. Boots of the Arcane bring 60-120 magic penetration by 2,780G, and Breakthrough Robe, moved up to the fourth slot, adds up to 150 more. Totals come to +6,462 max HP, +440 magic attack and 13.5% cooldown reduction - 1,450 less HP than build 1, but 320 more magic attack. Frozen Breath closes it out, adding 75-150 plus 15% of magic attack as magic damage on hit, once every 3 seconds.',
      },
    },
  ],
  // シャルロット（Fighter／CLASH）
  '536': [
    {
      ja: {
        label: '貫通で削り、物理攻撃に硬い',
        when: '敵に物理ダメージのヒーローが多く、前衛が硬いとき',
        text: '1品目の静謐の靴は700G、クールダウン短縮15%を先に握れる。装備4品で+45%、変異と鷹の目のアルカナで物理防御貫通は+100まで伸びます。ビルド2の貫通+36の2倍以上。締めの不死鳥の目と不吉な予兆で合計は最大HP+3500・物理防御+840、攻撃してきた相手の攻撃速度を2.5秒間20~40%落とします。',
      },
      en: {
        label: 'Pierce and physical defense',
        when: 'When the enemy team leans physical and you need to cut through a tanky front line.',
        text: 'Boots of Tranquility come first at 700G, locking in 15% cooldown reduction on the way to 45% across four items. Mutation and Eagle Eye arcana take physical pierce to +100, more than double Build 2\'s +36. Eye of the Phoenix and Ominous Premonition close things out, bringing the totals to +3500 max HP and +840 physical defense. Anything that damages Charlotte loses 20-40% attack speed for 2.5 seconds.',
      },
    },
    {
      ja: {
        label: '魔法防御とシールドで受け止める',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '1品目の抵抗の靴は700Gで、魔法防御100と耐性25%。クールダウン短縮は靴に付かず、装備3品と虚空10枠のアルカナで合計36%です。5品目の魔女のマントが15秒ごとに400~800の魔法ダメージシールドを張り、6品目の猛攻の鎧は被弾のたびに与ダメージを最大10スタックまで積む。魔法防御+400はビルド1の+180の2倍以上、最大HPも+3280まで伸びます。',
      },
      en: {
        label: 'Soak magic with resist and shields',
        when: 'When two or more enemy heroes deal magic damage.',
        text: 'Boots of Resistance open at 700G with 100 magic defense and 25% tenacity. Those boots carry no cooldown reduction, so three items and ten Void arcana bring the total to 36%. Succubus Cloak in the fifth slot throws a 400-800 magic damage shield every 15 seconds, and Cuirass of Savagery stacks bonus damage up to 10 times as Charlotte takes hits. Magic defense finishes at +400, more than double Build 1\'s +180, with max HP at +3280.',
      },
    },
  ],
  // デーヴァラ（Fighter／CLASH）
  '537': [
    {
      ja: {
        label: '攻撃速度と貫通で削り切る',
        when: '敵が物理防御と魔法防御の両方を積んでくるとき',
        text: '速攻の靴とスパークダガーを2,740Gで先に立て、通常攻撃1回ごとの40〜80魔法ダメージと3回ごとの電撃160〜400を序盤から回す。以降は暴風・サンセットチェイサー・威光の弓を重ね、装備とアルカナの総計は攻撃速度+184%、クリティカル率+32.5%、物理攻撃+245。威光の弓の物理防御貫通15%と心眼10枠の魔法防御貫通+64で、電撃の魔法ダメージも通ります。物理防御は+11.5しかなく、耐久はドゥームズデイの物理ライフスティール20%と最大HP+1268.5に頼る構成。',
      },
      en: {
        label: 'Attack speed and penetration',
        when: 'When the enemy team is stacking both physical and magic defense',
        text: 'Boots of Dexterity and Sparkforged Dagger land first for 2,740G, so the dagger\'s 40-80 magic damage per hit and its 160-400 arc every third hit are running from early on. Tempest, Sunchaser and Daybreaker\'s Virtue follow, and the finished set plus arcana totals +184% attack speed, +32.5% crit and +245 physical attack. Daybreaker\'s Virtue adds 15% physical penetration and ten Mind\'s Eye arcana add 64 magic penetration, so the dagger\'s magic damage gets through too. Physical defense finishes at just +11.5, leaving survivability to Doomsday\'s 20% physical lifesteal and the +1268.5 max HP.',
      },
    },
    {
      ja: {
        label: 'HPと物理防御を足して前で殴る',
        when: '敵にハードCCが多く、前に出たまま殴り合いたいとき',
        text: '3品目をシャドーブレードに変え、クリティカル率20%を先に確保する。後半のフロストショックとブラッドレイジで、装備とアルカナの総計は最大HP+2637、物理防御+263まで伸びます。フロストショックは制圧以外のハードCCを受けると最大HP10%のシールドを張り、ブラッドレイジは追加HPの1.5%を通常攻撃に乗せる。攻撃速度はビルド1より54%低い代わりに、殴られながら手数を出し続けられます。',
      },
      en: {
        label: 'Max HP and physical defense',
        when: 'When the enemy is loaded with hard CC and you want to stay in the brawl',
        text: 'Shadow Ripper takes the third slot instead of Tempest, locking in 20% crit early. Frigid Charge and Blood Rage close the build, and the finished set plus arcana totals +2637 max HP and +263 physical defense. Frigid Charge grants a shield worth 10% of max HP whenever any hard CC other than suppression lands on Devara, and Blood Rage adds 1.5% of bonus HP to every basic attack. Attack speed lands 54% below build 1, and in exchange Devara keeps swinging while taking hits.',
      },
    },
  ],
  // ユンエイ（Fighter／JUNGLE）
  '538': [
    {
      ja: {
        label: '防御を先に立て、締めに詰めの火力',
        when: '敵の主力が物理攻撃で、前衛と長く殴り合うとき',
        text: '3品目にドラゴンシールドを置き、4,900Gの時点で物理防御180と最大HP1350を確保。モンスターとミニオンにHPの7%の物理ダメージが乗り、半分はHPとして返ります。共通のシャドーアックスは4品目に下がり、物理防御貫通は6,990Gまで遅れる。締めのグレートブレイカー2540Gで、HP50%未満の敵への与ダメージが30%上がり、物理防御は合計+530に届きます。',
      },
      en: {
        label: 'Defense early, execute damage last',
        when: 'When the enemy\'s main damage is physical and you expect long trades against their frontline',
        text: 'Dragon\'s Rage goes third, so +180 physical defense and +1350 max HP are up by 4,900G. Its passive hits minions and monsters for 7% of their HP as physical damage and heals for half of that. Axe of Torment, which both builds run, drops to fourth, so its 90-180 physical penetration only lands at 6,990G. Overlord\'s Might closes at 2,540G for 30% extra damage against enemies under 50% HP, with physical defense totaling +530.',
      },
    },
    {
      ja: {
        label: '貫通を先に、HPと魔法防御で残る',
        when: '敵に魔法攻撃のヒーローが2体以上いるとき',
        text: 'シャドーアックスを3品目に繰り上げ、4,950Gの時点で物理防御貫通90〜180が立ちます。5品目のブラッドレイジのアクティブは、現在HPを30%失う代わりに最大HPの40%のシールドを4秒張る。締めの魔女のマント2020Gで魔法防御+300、追加魔法防御の15%が物理防御に変わります。合計は最大HP+2500・魔法防御+400で、物理攻撃はビルド1の425に対して350。',
      },
      en: {
        label: 'Penetration first, HP and magic defense after',
        when: 'When two or more enemy heroes deal magic damage',
        text: 'Axe of Torment moves up to third, so 90-180 physical penetration is online at 4,950G. Blood Rage arrives fifth with an active that drains 30% of current HP for a four-second shield worth 40% of max HP. Succubus Cloak finishes at 2,020G with +300 magic defense, and 15% of that bonus magic defense converts into physical defense. Totals land at +2500 max HP and +400 magic defense, with physical attack at 350 against build 1\'s 425.',
      },
    },
  ],
  // ハロルド（Assassin／JUNGLE）
  '542': [
    {
      ja: {
        label: '攻撃速度を先に伸ばす型',
        when: '敵の魔法ダメージ源が1体以下で、通常攻撃を長く続けたいとき',
        text: '2品目に700Gの速攻の靴を置き、2,860Gの時点で攻撃速度20%を確保する。5品目の蒼天の剣は物理防御150を足し、被ダメージを3秒間30%軽減するアクティブが使えます。合計は物理攻撃+388、攻撃速度+56.6%、物理防御貫通+96.4で、魔法防御は0のまま。ビルド2との差はこの2品だけで、アルカナは共通です。',
      },
      en: {
        label: 'Attack speed first',
        when: 'When the enemy fields at most one magic damage dealer and you want long basic-attack windows.',
        text: 'Boots of Dexterity go second for 700G, putting 20% attack speed in hand by 2,860G. Pure Sky adds 150 physical defense fifth, along with an active that cuts incoming damage by 30% for 3 seconds. Totals reach 388 physical attack, 56.6% attack speed and 96.4 physical defense penetration, with magic defense still at zero. Only these two items differ from build 2 - the arcana are identical.',
      },
    },
    {
      ja: {
        label: '防御と最大HPを厚くする型',
        when: '敵に魔法ダメージ源が2体以上いて、集団戦で狙われやすいとき',
        text: '2品目の抵抗の靴は700Gで物理防御50と魔法防御100が付き、耐性も25%増える。5品目のドラゴンシールドは最大HP1350を足し、敵ヒーローにHPの3.5%の物理ダメージも乗せます。合計は最大HP+2950、物理防御+230、魔法防御+190。物理攻撃はビルド1より80低い+308、攻撃速度も36.6%にとどまります。',
      },
      en: {
        label: 'Thicker defense and HP',
        when: 'When two or more enemies deal magic damage and you get focused in fights.',
        text: 'Boots of Resistance cost the same 700G but bring 50 physical defense, 100 magic defense and 25% more tenacity. Dragon\'s Rage lands fifth, adding 1,350 max HP plus a passive that deals 3.5% HP as physical damage to enemy heroes. Totals come to 2,950 max HP, 230 physical defense and 190 magic defense. Physical attack sits 80 lower at 308, and attack speed stops at 36.6%.',
      },
    },
  ],
  // アレッシオ（Marksman／FARM）
  '545': [
    {
      ja: {
        label: 'クリティカル先行、締めに割合ダメージ',
        when: '敵に最大HPの高い前衛が並ぶとき',
        text: 'シャドーブレードを2品目、エンドレスブレードを3品目に置き、4,850Gで装備分のクリティカル率40%に届きます。アルカナは禍源7枠に無双3枠を混ぜ、クリティカル効果を+10.8%上乗せする。締めのドゥームズデイは通常攻撃に80〜160＋対象の追加HPの7%を足す1品。合計はクリティカル率68.3%、攻撃速度115%、物理ライフスティール45%、移動速度17.5%になります。',
      },
      en: {
        label: 'Crit first, Doomsday last',
        when: 'When the enemy front line stacks high max HP',
        text: 'Shadow Ripper lands second and Eternity Blade third, so item crit rate hits 40% by 4,850G. Seven Calamity slots and three Unparalleled slots add +10.8% crit damage on top. Doomsday closes the build, adding 80-160 plus 7% of the target\'s bonus HP to every basic attack. Totals: 68.3% crit rate, 115% attack speed, 45% physical lifesteal and +17.5% movement speed.',
      },
    },
    {
      ja: {
        label: '暴風を2品目に置き、HPを先に確保',
        when: '序盤から前に出て、レーンを押し込みたいとき',
        text: '2品目に暴風を置き、2,780Gの時点で最大HP+600と攻撃速度30%が入ります。シャドーブレードとエンドレスブレードは1品ずつ後ろにずれるので、アルカナは禍源10枠でクリティカル率71%まで補う。ブラッドエッジが最後の11,500Gまで来ない分、略奪5枠でライフスティールを8%先に持たせています。合計は攻撃速度120%、物理攻撃384、最大HP+1100。',
      },
      en: {
        label: 'Tempest second for early bulk',
        when: 'When you want to push the lane from the early game',
        text: 'Tempest goes second, so 2,780G already brings +600 max HP and 30% attack speed. Shadow Ripper and Eternity Blade each slide back a slot, so ten Calamity slots carry crit rate to 71%. Bloodweeper only lands at 11,500G, so five Reaver slots hold 8% physical lifesteal until then. Totals: 120% attack speed, 384 physical attack, +1,100 max HP.',
      },
    },
  ],
  // ルアンナ（Marksman／FARM）
  '547': [
    {
      ja: {
        label: 'HPと物理防御を重ねて前で耐える',
        when: '敵に前衛が多く、集団戦で先に狙われるとき',
        text: '忍びの靴から入り、物理防御+100と物理被ダメージ6〜12%減で序盤の削り合いに耐えます。スパークダガーとドゥームズデイを挟み、4品目以降はディープフロスト・猛攻の鎧・ブラッドレイジ。3品ともHPが付き、最大HP+3050、物理防御+310、物理ライフスティール24.8%まで積み上がる。ブラッドレイジは現在HPを徐々に30%失うかわりに、積んだ最大HPの40%を4秒間シールドに変えます。',
      },
      en: {
        label: 'HP and armor to hold the fight',
        when: 'When the enemy fields several front-liners and Luara gets focused first in team fights',
        text: 'Boots of Fortitude come first, and their +100 physical defense plus 6-12% less physical damage taken carry Luara through the early trades. Sparkforged Dagger and Doomsday follow, then slots four to six go to Deepfrost Siege, Cuirass of Savagery and Blood Rage. All three carry health, and the totals reach +3050 max HP, +310 physical defense and 24.8% physical lifesteal. Blood Rage drains 30% of current HP to convert 40% of that max HP into a shield for 4 seconds.',
      },
    },
    {
      ja: {
        label: 'クリティカルと貫通に全振りする火力型',
        when: '敵にタンクが少なく、後衛を早く落としたいとき',
        text: '速攻の靴の攻撃速度+20%から入り、スパークダガーとドゥームズデイで通常攻撃の手数を先に積みます。4品目以降のマスターブレード・威光の弓・グレートブレイカーで、攻撃速度+125%、クリティカル率+51%、物理攻撃+369。威光の弓は遠距離型のルアンナなら物理防御貫通が30%増え、グレートブレイカーはHP50%未満の敵に30%を上乗せする。防御装備は1品も入らず、物理防御の上乗せはゼロ、最大HPも+1100止まりです。',
      },
      en: {
        label: 'All-in on crit and penetration',
        when: 'When the enemy team is light on tanks and their backline has to fall fast',
        text: 'Boots of Dexterity open with +20% attack speed, and Sparkforged Dagger plus Doomsday keep raising the rate of fire. From the fourth slot on, Master Sword, Daybreaker\'s Virtue and Overlord\'s Might push the totals to +125% attack speed, 51% crit rate and +369 physical attack. Daybreaker\'s Virtue doubles its penetration bonus for a ranged hero, so Luara reads 30% physical penetration, and Overlord\'s Might adds 30% damage against any enemy under 50% HP. No defensive item goes in at all: gear and arcana add zero physical defense, and max HP tops out at +1100.',
      },
    },
  ],
  // アタ（Tank／CLASH）
  '556': [
    {
      ja: {
        label: '物理防御963と反射で受ける型',
        when: '敵の主火力が物理で、殴り合いが長引くとき',
        text: '不吉な予兆を3品目に前倒しし、ダメージを受けると相手の攻撃速度が2.5秒間20〜40%落ちる。物理防御は合計+963でビルド2より300高く、移動速度も+11.5%まで伸びます。5品目のスパイクアーマーは、3秒間だけ被ダメージの35%を確定ダメージで返す反射役。締めの永夜の守護は、3秒で最大HPの30%を削られると320+HPの8%を回復します。',
      },
      en: {
        label: 'Physical wall that hits back',
        when: 'When enemy damage is mostly physical and fights run long',
        text: 'Ominous Premonition comes third, cutting the attack speed of whoever damages Ata by 20-40% for 2.5 seconds. Physical defense stacks to +963, 300 above the other build, and movement speed reaches +11.5%. Spikemail, bought fifth, spends three seconds returning 35% of incoming damage as true damage. Longnight Guardian closes the build, healing 320 plus 8% of HP whenever Ata loses 30% of max HP within three seconds.',
      },
    },
    {
      ja: {
        label: 'シールドと魔法防御を足した型',
        when: '敵に魔法火力が多く、自分から仕掛けたいとき',
        text: '3品目を不死鳥の目に、4品目をブラッドレイジに回し、不吉な予兆は5品目まで下げています。ブラッドレイジは物理攻撃+75を足し、アクティブで現在HPの30%と引き換えに最大HPの40%のシールドを4秒獲得する。締めの魔女のマントは15秒ごとに400〜800の魔法ダメージシールドを張り、魔法防御を合計+680まで伸ばします。最大HPは+6812でビルド1より300多く、物理防御は+663と300低い。',
      },
      en: {
        label: 'Shields and magic defense',
        when: 'When enemy damage leans magic and Ata wants to open the fight',
        text: 'Eye of the Phoenix takes the third slot and Blood Rage the fourth, pushing Ominous Premonition back to fifth. Blood Rage adds +75 physical attack, plus an active that trades 30% of current HP for a four-second shield worth 40% of max HP. Succubus Cloak finishes up with a 400-800 magic damage shield every 15 seconds, carrying magic defense to +680. Max HP lands at +6,812, 300 above build one, while physical defense sits 300 lower at +663.',
      },
    },
  ],
  // 影（Fighter／CLASH）
  '558': [
    {
      ja: {
        label: '最後に貫通30%を足して押し切る',
        when: '敵の前衛が物理防御を積んでいるとき',
        text: '700Gの靴で足を作り、シャドーアックスで貫通90〜180とHP+500を早めに乗せる。3品目がスパイクアーマーなので、4,810Gの時点で物理防御+400・最大HP+1200が揃う。締めの砕星の槌が物理防御貫通をさらに30%上乗せし、合計は物理攻撃+480、移動速度+17.5%。装備で違うのは、この最終装備1品と3・4品目の入れ替えだけです。',
      },
      en: {
        label: 'Penetration finish',
        when: 'When the enemy front line is stacking physical defense.',
        text: 'Boots of Fortitude come first for the movement, then Axe of Torment for 90-180 physical penetration and 500 max HP. Spikemail lands third, so Umbrosa holds +400 physical defense and +1,200 max HP by 4,810G. Starbreaker closes the build with another 30% physical penetration, pushing the totals to +480 physical attack and +17.5% movement speed. That final item and the third/fourth swap are the only differences in gear between the two builds.',
      },
    },
    {
      ja: {
        label: '魔法防御とHPで落ちにくくする',
        when: '敵に魔法ダメージ役が2体以上いるとき',
        text: '3品目をディープフロストに繰り上げた形。4,830Gで攻撃速度+25%と、命中時の追加物理ダメージ135〜270が手に入る。スパイクアーマーは4品目へ下がるが、6,850Gの到達点は2本とも同じ。締めの魔女のマントが15秒ごとの魔法ダメージシールドを足し、合計は魔法防御+350・最大HP+3050へ伸びます。',
      },
      en: {
        label: 'Magic-resist finish',
        when: 'When the enemy team fields two or more magic damage dealers.',
        text: 'Deepfrost Siege moves up to third here. By 4,830G Umbrosa has +25% attack speed and Deepfrost\'s 135-270 bonus physical damage on hit. Spikemail slips to fourth, though both builds stand at the same 6,850G mark. Succubus Cloak finishes the set with a 400-800 magic damage shield every 15 seconds, taking the totals to +350 magic defense and +3,050 max HP.',
      },
    },
  ],
  // ハイノ（Mage／MID）
  '563': [
    {
      ja: {
        label: '靴で耐性、貫通は戦闘中に重ねる',
        when: '敵に物理と魔法が混在し、靴の段階から耐性が欲しいとき',
        text: '1品目の抵抗の靴で、物理防御50・魔法防御100と耐性25%増を先に置く。4品目のトワイライトストームは、ヒーローにダメージを与えるたび4秒間、魔法防御貫通が20〜40増えます。最大6スタックまで重なるので、戦闘が続くほど貫通が積み上がる形。合計は魔法攻撃862、最大HP3475、クールダウン短縮31%まで伸びます。',
      },
      en: {
        label: 'Resistance boots, penetration that stacks in fights',
        when: 'When the enemy team mixes physical and magic damage and you want resistances from the first slot',
        text: 'Boots of Resistance opens the build with 50 physical defense, 100 magic defense and 25% added tenacity. In the fourth slot, Twilight Stream grants 20-40 magic penetration for 4 seconds each time you damage a hero, up to six stacks. It pays off in extended fights, where the stacks keep refreshing. Totals land at 862 magic attack, 3,475 max HP and 31% cooldown reduction.',
      },
    },
    {
      ja: {
        label: '靴で短縮、貫通は条件なしで常時',
        when: '敵が魔法防御を積み、短い接触で削り合う展開のとき',
        text: '1品目を静謐の靴にすると、700Gの時点でクールダウン短縮15%が入る。4品目の羽化の衣は、魔法防御貫通30〜60＋追加HPの3%（最大150まで）を発動条件なしで上乗せする。短い接触でも貫通が乗ります。総合計はクールダウン短縮36%・最大HP3875で、ビルド1より短縮5%・HP400ぶん高い。',
      },
      en: {
        label: 'Tranquility boots, penetration with no trigger',
        when: 'When enemies build magic defense and fights stay short and trade-heavy',
        text: 'The first slot goes to Boots of Tranquility: 15% cooldown reduction for 700 gold. In the fourth slot, Breakthrough Robe grants 30-60 magic penetration plus 3% of bonus HP, capped at 150, with no trigger condition attached. Short trades get the full value. Totals reach 36% cooldown reduction and 3,875 max HP, five points and 400 HP above build 1.',
      },
    },
  ],
  // 姫小満（Fighter／CLASH）
  '564': [
    {
      ja: {
        label: 'クールダウン40%と削り切り',
        when: '敵の前衛が硬く、削り切る手数が要るとき',
        text: '静謐の靴で先に足とクールダウンを取り、シャドーアックス、蒼天の剣と重ねる。クールダウン短縮は4品目のグレートブレイカーで40%に届き、物理攻撃は最終480。同じグレートブレイカーが、HPが50%を切った敵に追加で30%のダメージを乗せます。締めの破魔の霊刀は物理攻撃の50%を魔法防御に上乗せするので、480なら240が加わる。',
      },
      en: {
        label: 'Cooldown reduction and execute damage',
        when: 'When enemy frontliners are tanky and you need the volume to grind their HP down',
        text: 'Boots of Tranquility come first for the movement speed and cooldown, then Axe of Torment and Pure Sky stack on top. Cooldown reduction reaches 40% at Overlord\'s Might in the fourth slot, and physical attack finishes at 480 across the full six items. That same item adds 30% bonus damage against any enemy already below half HP. Demonsbane closes the build, adding magic defense equal to half your physical attack — 240 at 480.',
      },
    },
    {
      ja: {
        label: 'HP3450で前線を保つ',
        when: '敵の火力が物理と魔法に分かれ、前で受け止めるとき',
        text: '抵抗の靴を先に履き、耐性25%と魔法防御100を序盤から確保する。ビルド1が火力を積む4品目に猛攻の鎧を差し込み、5品目は不死鳥の目。HPは最終3450、物理防御は500まで伸び、HPを10%失うごとに回復効果が5%上がります。締めの砕星の槌が物理防御貫通を30%増やし、移動速度は合計17.5%に届く。',
      },
      en: {
        label: 'Front-line bulk at 3,450 HP',
        when: 'When enemy damage is split between physical and magic and someone has to hold the front',
        text: 'Boots of Resistance go on first for 25% tenacity and 100 magic defense. Cuirass of Savagery takes the fourth slot where build 1 buys damage, and Eye of the Phoenix follows it. HP finishes at 3,450 and physical defense at 500, with healing climbing 5% for every 10% HP lost. Starbreaker caps things off: 30% more physical defense penetration, and 17.5% total movement speed.',
      },
    },
  ],
  // 少司縁（Support／ROAM）
  '577': [
    {
      ja: {
        label: '味方を速めるオーラと対物理の硬さ',
        when: '敵の火力が物理側に寄り、味方の手数で押したいとき',
        text: '極影の盾・救済を1品目に置き、攻撃速度20%とクールダウン短縮15%を範囲800以内の味方にも半分ずつ配ります。4品目の不吉な予兆で物理防御を300足すと、合計は物理防御+373・最大HP+5662。ダメージを受けると、攻撃者の攻撃速度を20〜40%、移動速度を7.5〜15%落とす（対象ごとに3秒間隔）。5品目のフローズンブレスは3秒に1度、75〜150＋魔法攻撃15%の魔法ダメージを上乗せし、スロウも重ねます。',
      },
      en: {
        label: 'Team attack speed aura, physical defense',
        when: 'When the enemy threat is mostly physical and your team wins on volume of attacks',
        text: 'Crimson Shadow - Redemption goes down first for 20% attack speed and 15% cooldown reduction, with half of that passed to allies within 800 range. Ominous Premonition in the fourth slot adds 300 physical defense, taking the totals to +373 physical defense and +5662 max HP. Damage taken cuts the attacker\'s attack speed by 20-40% and movement speed by 7.5-15%, on a 3-second cooldown per target. Frozen Breath at fifth adds 75-150 plus 15% of magic attack as magic damage every 3 seconds, stacking a slow on top.',
      },
    },
    {
      ja: {
        label: '防御オーラと凍結、HPが貫通に乗る',
        when: '敵が魔法防御を積み、自分から仕掛けて止めたいとき',
        text: '1品目のガーディアン・救済が物理・魔法防御を65〜130増やし、範囲800以内の味方にも半分が乗ります。4品目のフロストショックのアクティブは、範囲450の敵を移動速度30〜60%減にして0.75秒凍結させる。6品目の羽化の衣は追加HPの3%分を魔法防御貫通に上乗せし、最大HP+5762なら上限の150に届きます。物理防御はビルド1の+373に対して+223で、物理側の硬さを削った分を貫通と足止めに回した並び。',
      },
      en: {
        label: 'Guard aura, freeze, HP feeds penetration',
        when: 'When enemies stack magic defense and you want to open fights yourself',
        text: 'Guardian - Redemption leads, adding 65-130 physical and magic defense and passing half of it to allies within 800 range. Frigid Charge in the fourth slot carries an active that cuts enemy movement speed by 30-60% inside 450 range and freezes for 0.75 seconds. Breakthrough Robe at sixth adds 3% of bonus HP as magic defense penetration, and +5762 max HP pushes that straight to the 150 cap. Physical defense lands at +223 against build 1\'s +373 - the armor given up goes into penetration and lockdown.',
      },
    },
  ],
  // 元流の子（タンク）（Tank／CLASH）
  '581': [
    {
      ja: {
        label: '削りも持つクールダウン型',
        when: '味方に他の前衛がいて、自分も削りに回れるとき',
        text: '1品目は700Gの静謐の靴で、クールダウン短縮から先に立てます。3・4品目の氷霜のグリップとブラッドレイジに隠匿アルカナ10枠を足し、物理攻撃は+151。クールダウン短縮は合計+31%まで伸び、最大HPは+4912、物理防御は+773になります。ブラッドレイジは現在HPを徐々に30%失う代わりに、最大HPの40%のシールドを4秒張れる。',
      },
      en: {
        label: 'Cooldown-first bruiser tank',
        when: 'When another front-liner is already on your team and you can add damage yourself.',
        text: 'Boots of Tranquility open the build at 700G, so cooldown reduction lands before anything else. Frostscar\'s Embrace and Blood Rage come third and fourth, and with ten Stealth arcana they bring physical attack to +151. Cooldown reduction totals 31%, alongside +4912 max HP and +773 physical defense. Blood Rage gradually drains 30% of current HP in exchange for a shield worth 40% of max HP that lasts four seconds.',
      },
    },
    {
      ja: {
        label: 'HPと耐性だけを積む前衛型',
        when: '敵にハードCCが多く、前で耐え続けたいとき',
        text: '1品目の抵抗の靴で耐性を25%上げ、あとはHPと防御を積み続けます。3品目の覇者の重装で最大HPが4%増え、毎秒0.5%ずつ自動で回復する。5品目のフロストショックは、制圧以外のハードCCを受けると最大HPの10%のシールドを張ります。合計は最大HP+6712、物理防御+833、魔法防御+540で、ビルド1よりHPが1800多い。',
      },
      en: {
        label: 'Pure HP and tenacity wall',
        when: 'When the enemy team is stacked with hard CC and you have to hold the front.',
        text: 'Boots of Resistance start with 25% tenacity, and everything after is HP and defense. Overlord\'s Platemail at third raises max HP by 4% and regenerates 0.5% of it every second. Frigid Charge at fifth hands you a shield worth 10% of max HP whenever hard CC other than suppression lands on you. The totals reach +6712 max HP, +833 physical defense and +540 magic defense, 1800 more HP than the first build.',
      },
    },
  ],
  // 元流の子（メイジ）（Mage／MID）
  '582': [
    {
      ja: {
        label: 'HPとライフスティールで粘る型',
        when: '敵に高HPの前衛が2体以上並び、長く撃ち合うとき',
        text: '1品目に700Gの秘法の靴を置き、魔法防御貫通60~120と移動速度50を序盤から確保する。4品目のトワイライトストームは敵ヒーローにダメージを与えるたび貫通が20~40増え、6スタックで最大240まで伸びます。5品目の神喰らいの書が魔法ライフスティール24%を足し、魔力転化でクールダウン短縮も12%上乗せされる。締めの苦痛のマスクが敵の現在HPの3%を3秒間に4回削り、最大HP+2650を抱えたまま前で撃ち続けられます。',
      },
      en: {
        label: 'HP and lifesteal to keep casting',
        when: 'When two or more high-HP frontliners are on the enemy team and fights run long',
        text: 'Boots of the Arcane go down first at 700G, locking in 60-120 magic penetration and 50 movement speed before anything else. Twilight Stream in slot four adds 20-40 penetration every time you damage an enemy hero, reaching 240 at six stacks. Insatiable Tome in slot five brings 24% magic lifesteal, and its Mana Conversion passive turns that into 12% more cooldown reduction. Mask of Agony closes the build, dealing 3% of the target\'s current HP four times over three seconds, and +2650 max HP keeps you in range.',
      },
    },
    {
      ja: {
        label: '魔法攻撃を積んで一撃を通す',
        when: '敵の前衛が1体以下で、短い交戦で後衛を落としたいとき',
        text: '3品目に2610Gの賢者の天書、4品目に賢者の怒りを置き、魔法攻撃を先に立てる買い方。賢者の怒りは魔法攻撃を30%増やすので、後から積む夢魔の牙とヴォイドスタッフの分まで一緒に伸びます。合計は魔法攻撃+1232でビルド1より350高く、締めのヴォイドスタッフが魔法防御貫通を45%増やす。1品目は貫通の付く秘法の靴ではなく移動速度70の疾風の靴で、戦闘から5秒離れるとさらに35~70が乗ります。',
      },
      en: {
        label: 'Stacking magic attack for the burst',
        when: 'When the enemy has at most one frontliner and fights are settled quickly',
        text: 'Sage\'s Tome at 2610G in slot three and Savant\'s Wrath in slot four put raw magic attack ahead of everything else. Savant\'s Wrath raises magic attack by 30%, so the Venomous Staff and Void Staff bought after it are worth more than their listed numbers. The total reaches +1232 magic attack, 350 above build 1, and Void Staff finishes by raising magic penetration 45%. Slot one is Boots of Deftness at 70 movement speed rather than the penetration boots, with another 35-70 after five seconds out of combat.',
      },
    },
  ],
  // 元流の子（マークスマン）（Marksman／FARM）
  '584': [
    {
      ja: {
        label: '物理攻撃439で削り切る',
        when: '敵にHPの高い前衛が2体以上いるとき',
        text: 'ドゥームズデイを2品目に前倒しし、2,800Gで最大HP+500と物理ライフスティール20%を確保。通常攻撃に80〜160（＋ターゲットの追加HPの7%）が上乗せされ、HPを盛った相手ほど削れます。威光の弓も4品目に置くので、7,410Gで物理防御貫通が15%増える（遠距離型は2倍）。締めのグレートブレイカーはHP50%未満の敵に30%の追加ダメージを与え、物理攻撃は合計439まで伸びます。',
      },
      en: {
        label: 'Finishing with 439 physical attack',
        when: 'When the enemy team fields two or more high-HP front-liners',
        text: 'Doomsday moves up to second, locking in 500 max HP and 20% physical lifesteal by 2,800G. Its passive adds 80-160 plus 7% of the target\'s bonus HP to every basic attack, biting hardest into stacked HP. Daybreaker\'s Virtue also comes early, fourth at 7,410G, for 15% physical penetration (doubled on ranged heroes). Overlord\'s Might closes the set with 30% extra damage to enemies below 50% HP, taking physical attack to 439 in total.',
      },
    },
    {
      ja: {
        label: '射程と攻撃速度を伸ばす',
        when: '敵に飛び込んでくるヒーローが多く、距離を保ちたいとき',
        text: '2品目をシャドーブレードにすると、2,740Gでクリティカル率20%と移動速度7.5%が先に入る。4品目のエンドレスブレードでクリティカル効果を早く立て、威光の弓は5品目に回します。締めのサンセットチェイサーのアクティブは、5秒間、通常攻撃の射程を125、移動速度を20%上げる（CD75秒）。合計はクリティカル率86%・攻撃速度130%で、物理攻撃はビルド1より110低い代わりに手数が増えます。',
      },
      en: {
        label: 'Extra range and attack speed',
        when: 'When enemies dive you often and you want to hold your distance',
        text: 'Shadow Ripper second puts 20% crit rate and 7.5% movement speed on the board at 2,740G. Eternity Blade then comes fourth to raise crit damage early, pushing Daybreaker\'s Virtue back to fifth. Sunchaser closes the set with an active that adds 125 basic-attack range and 20% movement speed for 5 seconds, on a 75-second cooldown. Totals reach 86% crit rate and 130% attack speed, trading 110 physical attack against build 1 for more shots landed.',
      },
    },
  ],
  // フロレンティーノ（Fighter／CLASH）
  '631': [
    {
      ja: {
        label: '貫通と手数で前衛を削り切る',
        when: '敵の前衛が硬く、削り切る手数が要るとき',
        text: '1品目の静謐の靴は700Gでクールダウン短縮15%、積み切れば合計50%に届く。物理防御貫通100は変異と鷹の目から出るので、装備を買う前から通っています。締めのグレートブレイカーは、HPが50%未満の敵への追加ダメージ30%。物理防御660と最大HP2000を抱えたまま、前で削り切れます。',
      },
      en: {
        label: 'Pierce and uptime to grind tanks down',
        when: 'When the enemy front line is thick and you need attrition to break it.',
        text: 'Boots of Tranquility open at 700G with 15% Cooldown Reduction, and the finished build reaches 50%. All 100 points of Physical Pierce come from the Mutation and Eagle Eye arcana, so it is live before the first item lands. Overlord\'s Might closes the build with 30% bonus damage against enemies under 50% HP. With 660 Physical Defense and 2000 Max Health behind him, Florentino can hold the front and finish the job.',
      },
    },
    {
      ja: {
        label: 'HPを厚くして前で殴り合う',
        when: '敵に物理攻撃のヒーローが多く、前で殴り合いたいとき',
        text: '1品目は忍びの靴で、700Gの時点から物理被ダメージが6~12%軽減される。3品目にシャドーアックスを置き、物理防御貫通90~180を4,930Gの時点で立てます。最大HP2500を土台に、ブラッドレイジが通常攻撃へ追加HPの1.5%の物理ダメージを上乗せする。アルカナは禍源と憐憫で、クリティカル率16%とクールダウン短縮10%。',
      },
      en: {
        label: 'Stacked health for long trades',
        when: 'When the enemy team leans physical and you want to keep trading up front.',
        text: 'Boots of Fortitude lead, cutting physical damage taken by 6-12% from 700G onward. Axe of Torment lands third, putting 90-180 Physical Pierce online at the 4,930G mark. Max Health reaches 2500, and Blood Rage converts it: every basic attack deals bonus physical damage equal to 1.5% of bonus health. Calamity and Compassion arcana finish it with 16% Critical Rate and 10% Cooldown Reduction.',
      },
    },
  ],
  // ロリアン（Mage／MID）
  '635': [
    {
      ja: {
        label: '魔法攻撃を積み切って割合で削る',
        when: '敵にHPの高い前衛が2体以上いるとき',
        text: '2品目に神喰らいの書を置き、2,760Gで魔法ライフスティール24%とHP750を確保する。3品目の残響の杖と4品目の苦痛のマスクは、どちらもスキル命中で追撃が出る装備。特に苦痛のマスクは現在HPの3%を3秒で4回削るので、HPの厚い相手ほど効きます。6品目の賢者の天書まで積んだ合計は魔法攻撃+1072で、2本目を80上回る。',
      },
      en: {
        label: 'Stack magic power, shred by percent HP',
        when: 'When the enemy team fields two or more high-HP frontliners',
        text: 'Insatiable Tome comes second, so 24% magic lifesteal and 750 HP are in place by 2,760G. Scepter of Reverberation and Mask of Agony follow, both firing extra damage whenever a skill lands. Mask of Agony alone strips 3% of current HP four times over three seconds, which hurts most against large health pools. Sage\'s Tome closes out slot six, and the total magic power lands at +1072, 80 ahead of the other build.',
      },
    },
    {
      ja: {
        label: '妨害を先に立てて回転を上げる',
        when: '敵にライフスティールや回復持ちが多いとき',
        text: '回復より妨害を優先し、神喰らいの書を4品目まで下げたのがビルド2。先に置く夢魔の牙が敵の回復とライフスティールを35%減らし、フローズンブレスがスロウを重ねる。5品目のトワイライトストームは、ヒーローに当てるたび魔法防御貫通を最大6スタック積みます。完成時の魔法攻撃は+992で1本目に届かないぶん、クールダウン短縮は+25%と高い。',
      },
      en: {
        label: 'Disruption first, faster cooldowns',
        when: 'When several enemies rely on lifesteal or healing',
        text: 'Build 2 pushes Insatiable Tome back to the fourth slot and buys disruption first. Venomous Staff cuts enemy healing and lifesteal by 35%, and Frozen Breath layers a slow on top of it. Twilight Stream in slot five stacks magic penetration up to six times as damage keeps landing on heroes. Magic power finishes lower at +992, while cooldown reduction climbs to 25%.',
      },
    },
  ],
  // アネット（Support／ROAM）
  '640': [
    {
      ja: {
        label: '救済のシールドと移動速度の型',
        when: '敵のバーストが強く、駆けつける足も欲しいとき',
        text: '1品目の極影の盾・救済は、範囲内の味方へ4秒間シールドを張るアクティブ。量は240〜480に最大HPの10%を足した値で、クールダウンは60秒です。2品目の疾風の靴で移動速度が70増え、戦闘から5秒離れるとさらに最大70上乗せされる。3品目以降はもう1本と同じ並びで、合計は最大HP+5862、クールダウン短縮+31%。',
      },
      en: {
        label: 'Redemption shield and early speed',
        when: 'When enemy burst is heavy and you need the speed to arrive in time',
        text: 'The opening buy, Crimson Shadow - Redemption, drops a 4-second shield on allies in range worth 240-480 plus 10% of max HP, on a 60-second cooldown. Boots of Deftness come second for 700G, adding 70 movement speed and up to 70 more once you have been out of combat for five seconds. Items three through six match the other build, so the totals land at +5862 max HP and 31% cooldown reduction.',
      },
    },
    {
      ja: {
        label: '星泉の回復とクールダウン短縮の型',
        when: '削り合いが続き、味方のHPとMPを支えたいとき',
        text: '1品目の極影の盾・星泉は、HPが最も低い味方とリンクして5秒間回復するアクティブ。回復量は500〜1060に最大HPの20%を足した値で、最大MPの25%も戻ります。敵ヒーローを攻撃するか攻撃を受けると効果は20%まで落ちるので、使いどころは戦闘の合間。2品目の静謐の靴でクールダウン短縮は46%に伸び、最大HPは+5562ともう1本より300低い。',
      },
      en: {
        label: 'Starspring healing and cooldowns',
        when: 'When trades drag on and the team needs HP and MP topped back up',
        text: 'Crimson Shadow - Starspring opens instead, linking to your lowest-HP ally and restoring 500-1060 plus 20% of max HP, along with 25% of max MP, over five seconds. The effect drops to 20% the moment you attack an enemy hero or take a hit from one, so the window for it sits between fights. Boots of Tranquility take the second slot, pushing cooldown reduction to 46% in total while max HP settles at +5562, three hundred under the other build.',
      },
    },
  ],
  // バタフライ（Fighter／JUNGLE）
  '646': [
    {
      ja: {
        label: '火力を伸ばし、保険を1枚積む',
        when: '敵の瞬間火力が高く、飛び込んだ直後に落とされやすいとき',
        text: '4品目に名刀・司命を置き、7,010Gの時点で致命傷を受けても死なない保険を作ります。最後の蒼天の剣まで積むと物理攻撃+407、攻撃速度+41.6%、クールダウン短縮+27.5%。蒼天の剣には被ダメージを3秒間30%軽減するアクティブもあり、飛び込んだあとの返しを受け止めやすい。アルカナは変異1枠を紅月に替え、クリティカル率を20.5%まで伸ばしています。',
      },
      en: {
        label: 'Damage first, one safety net',
        when: 'When enemy burst can delete you the moment you engage',
        text: 'Destiny takes the fourth slot, so by 7,010G Butterfly survives one lethal hit and goes invulnerable instead. Finished with Pure Sky, the totals reach +407 physical attack, +41.6% attack speed and +27.5% cooldown reduction. Pure Sky also carries an active that cuts incoming damage by 30% for 3 seconds, taking the edge off the return fire after a dive. One Mutation slot is swapped for Red Moon, lifting critical rate to 20.5%.',
      },
    },
    {
      ja: {
        label: '防御を先に立てて殴り合う',
        when: '敵の主力が物理で、殴り合いが長引きやすいとき',
        text: '4品目をスパイクアーマーにして、6,970Gで物理防御+300とHP+700を先に立てる。3秒間、被ダメージの35%を確定ダメージとして返すアクティブも付いてきます。締めの不死鳥の目まで積むと最大HP+3150、物理防御+440、魔法防御+280に届き、物理攻撃はビルド1より108低い+299。アルカナは変異を10枠すべて使い、物理防御貫通を100まで伸ばします。',
      },
      en: {
        label: 'Defense first, built to trade',
        when: 'When the enemy damage is mostly physical and fights run long',
        text: 'Spikemail goes fourth, so +300 physical defense and +700 max HP arrive at 6,970G. It also brings an active that reflects 35% of the damage taken as true damage for 3 seconds. Closing with Eye of the Phoenix pushes the totals to +3150 max HP, +440 physical defense and +280 magic defense, with physical attack at +299, 108 below build 1. All ten Mutation slots are kept, holding physical defense penetration at 100.',
      },
    },
  ],
};
