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
 * 数値はこの2つにあるものだけを使う。体感で書かない。
 * 2026-11-15 からの書き直しでは、合計値の足し引きと「○○Gで立つ」をやめ、どの装備がそろうと
 * 何ができるかを効果文の範囲で書いている（文は敬体にそろえる）。書き直した体は監査の検査36が見る。
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
 *   text   その中身。装備の効果で説明する。2〜4文
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
        label: '減速と凍結で足を止める型',
        when: '敵に物理ダメージのヒーローが多いときや、ステルスを使うヒーローがいるとき',
        text: '1品目のガーディアン・閃光は、自分の物理防御と魔法防御を上げ、近くの味方にもその半分を配ります。アクティブの鏡影は広い範囲の敵を何度も削って減速させ、ステルス中の敵も短い間だけ見えるようにします。3品目のフロストショックは、制圧以外のハードCCを受けるとシールドが付き、アクティブでは周りを減速させてから凍結させます。最後の覇者の重装は、敵ヒーローやタワーから攻撃を受けていない間の回復が厚くなる装備です。',
      },
      en: {
        label: 'Slows and freezes to stop the rush',
        when: 'When the enemy leans on physical damage, or has a stealth hero',
        text: 'Guardian - Radiance comes first: it raises Lian Po\'s physical and magical defense and gives nearby allies half of the effect. Its active, Mirror Domain, hits enemies across a wide area several times, slows them, and briefly reveals anyone in stealth. Frigid Charge, the third item, grants a shield when he is hit by hard crowd control other than suppression, and its active slows the area before freezing enemies. Overlord\'s Platemail closes the build, and its regeneration doubles while no enemy hero or tower is hitting him.',
      },
    },
    {
      ja: {
        label: '味方を守り、回復を削る型',
        when: '敵に魔法ダメージのヒーローや、回復に頼るヒーローがいるとき',
        text: '1品目をガーディアン・救済に替え、アクティブの救援で範囲内の味方ヒーローにシールドを張れるようにします。4品目の紅蓮のマントは周りの敵を燃やし、燃焼を受けた敵のHP回復とライフスティールを落とします。続く魔女のマントは、魔法ダメージだけを防ぐシールドを定期的に張り、追加魔法防御の一部を物理防御に回します。不吉な予兆と永夜の守護は2本で共通ですが、こちらは不吉な予兆を3品目に早めています。',
      },
      en: {
        label: 'Shield allies, cut healing',
        when: 'When the enemy has magic damage heroes or heroes who rely on healing',
        text: 'Guardian - Redemption takes the first slot, and its active, Rescue, shields teammates within range. Blazing Cape, the fourth item, burns nearby enemies and cuts the Health recovery and Lifesteal of anyone it burns. Succubus Cloak follows with a recurring shield against magical damage and turns part of its extra magical defense into physical defense. Ominous Premonition and Longnight Guardian appear in both builds, but here Ominous Premonition moves up to third.',
      },
    },
  ],
  // 小喬（Mage／MID）
  '106': [
    {
      ja: {
        label: '4品目に賢者の怒りを置く型',
        when: '敵に飛び込んでくるアサシンが少ないとき',
        text: 'ビルド2と違う装備は、4品目の賢者の怒りだけです。賢者の怒りは魔法攻撃を割合で伸ばすので、ヴォイドスタッフを5品目に下げてでも先に入れます。スペルはフラッシュを持ちます。',
      },
      en: {
        label: 'Savant\'s Wrath in the fourth slot',
        when: 'When the enemy has few assassins who dive',
        text: 'The only item that differs from build 2 is Savant\'s Wrath in the fourth slot. It raises magical attack by a percentage, so it goes in first even though that pushes Void Staff back to fifth. The spell is Flash.',
      },
    },
    {
      ja: {
        label: 'ムーンライトスタッフで身を守る型',
        when: '敵にアサシンなど飛び込んでくる相手がいるとき',
        text: '賢者の怒りの代わりにムーンライトスタッフを5品目に入れ、ヴォイドスタッフを4品目に上げています。ムーンライトスタッフは、動けなくなる代わりにすべての効果を無効化するアクティブを持つので、飛び込まれたときに使えます。スペルはフラッシュではなくワープを選んでいます。',
      },
      en: {
        label: 'Splendor for protection',
        when: 'When the enemy has assassins or other divers',
        text: 'Splendor replaces Savant\'s Wrath in the fifth slot, and Void Staff moves up to fourth. Splendor\'s active grants immunity to all effects at the cost of being unable to move or act, which gives her an answer when someone dives her. The spell is Teleport instead of Flash.',
      },
    },
  ],
  // 趙雲（Fighter／JUNGLE）
  '107': [
    {
      ja: {
        label: 'HPが減るほど伸びる殴り合い型',
        when: '敵に魔法ダメージのヒーローが少ないとき',
        text: '4品目まではビルド2と同じで、違うのは最後の2品です。5品目のブラッドレイジは通常攻撃に追加の物理ダメージを乗せ、自分のHPが半分を切ると、その追加分がさらに増えます。アクティブでは今のHPを少しずつ削る代わりにシールドを張れます。6品目の不死鳥の目もHPを失うほどHP回復の効果が上がるので、HPが減った場面で力を出す2品が並びます。',
      },
      en: {
        label: 'Brawler build that grows as Health drops',
        when: 'When the enemy has few magic damage heroes',
        text: 'The first four items match Build 2; the last two are what differ. Blood Rage, the fifth item, adds extra physical damage to Basic Attacks, and that extra grows further when his Health is below half. Its active drains some of his current Health in exchange for a shield. Eye of the Phoenix, the sixth, raises Health recovery the more Health he has lost, so both closing items peak when he is low.',
      },
    },
    {
      ja: {
        label: '魔法防御と軽減で耐える型',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '5品目に蒼天の剣、6品目に魔女のマントを置きます。蒼天の剣はスキルが最初に当たった敵ヒーローを減速させ、アクティブでは短い間だけ受けるダメージを軽減できます。魔女のマントは魔法ダメージだけを防ぐシールドを定期的に張り、追加魔法防御の一部を物理防御に回します。ブラッドレイジと不死鳥の目の火力と回復を手放すかわりに、魔法の多い相手への備えを厚くする選び方です。',
      },
      en: {
        label: 'Magic defense and mitigation',
        when: 'When the enemy has two or more magic damage heroes',
        text: 'Pure Sky goes fifth and Succubus Cloak sixth. Pure Sky slows the first enemy hero hit by a skill, and its active briefly reduces damage taken. Succubus Cloak puts up a recurring shield against magical damage and converts part of its extra magical defense into physical defense. You give up Blood Rage\'s damage and Eye of the Phoenix\'s healing in exchange for stronger protection against magic.',
      },
    },
  ],
  // 墨子（Mage／MID）
  '108': [
    {
      ja: {
        label: '防御を厚くしてオーラを配る型',
        when: '敵の主なダメージが物理と魔法の両方に分かれているとき',
        text: '1品目の極影の盾・閃光はローム専用装備で、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にもその半分を配ります。アクティブの鏡影は広い範囲の敵を何度も削って減速させ、ステルス中の敵も短い間だけ見えるようにします。攻撃の装備は3品目の聖杯だけで、残りはサンライズケープ、不吉な予兆、魔女のマントと守りの装備が並びます。物理を防ぐ不吉な予兆と魔法を防ぐ魔女のマントが両方入るので、どちらの火力にも備えられます。',
      },
      en: {
        label: 'Thick defenses and a team aura',
        when: 'When enemy damage is split between physical and magic',
        text: 'Crimson Shadow - Radiance, the first item, is roaming equipment: it raises Mozi\'s attack speed and cooldown reduction and gives allies in range half of the effect. Its active, Mirror Domain, hits enemies across a wide area several times, slows them, and briefly reveals anyone in stealth. Holy Grail in third is the only offensive item; Dawnlight, Ominous Premonition and Succubus Cloak fill the rest with defense. Ominous Premonition guards against physical damage and Succubus Cloak against magic, so he is covered against both.',
      },
    },
  ],
  // 妲己（Mage／MID）
  '109': [
    {
      ja: {
        label: '魔法攻撃を厚くする型',
        when: '敵に回復やライフスティールで粘るヒーローがいないとき',
        text: '1品目の秘法の靴が、魔法防御貫通とMPの回復を最初から持たせます。5品目の賢者の天書は魔法攻撃を大きく足し、魔法攻撃が高いほど与えるダメージと被ダメージ軽減も伸びる装備です。アルカナは聖人と生贄で魔法攻撃を厚くしてあり、ヴォイドスタッフの貫通は最後の6品目でそろいます。',
      },
      en: {
        label: 'Heavier magical attack',
        when: 'When the enemy has no hero relying on healing or lifesteal',
        text: 'Boots of the Arcane come first, providing magical pierce and Mana regeneration from the start. Sage\'s Tome, the fifth item, adds a large chunk of magical attack, and the higher her magical attack, the more damage and damage reduction it grants. The arcana (Saint and Tribute) lean on magical attack as well, and Void Staff\'s pierce only arrives with the sixth item.',
      },
    },
    {
      ja: {
        label: '貫通を早め、回復も止める型',
        when: '敵に回復役がいて、魔法防御を積む前衛もいるとき',
        text: '靴を疾風の靴に替え、移動速度と、戦闘から離れているときの加速を取ります。魔法防御貫通はアルカナの夢魔と4品目のヴォイドスタッフで早めに持つので、ビルド1より早くから硬い相手にもダメージが通り始めます。最後の夢魔の牙は、当てた敵のHP回復とライフスティールを落とします。',
      },
      en: {
        label: 'Early pierce, healing shut off',
        when: 'When the enemy has a healer and a frontliner stacking magical defense',
        text: 'The boots become Boots of Deftness for Movement Speed and an extra boost while out of combat. Magical pierce comes early from the arcana and a fourth-slot Void Staff, so her damage starts getting through tough targets sooner than in build 1. Venomous Staff closes the build and cuts the Health recovery and lifesteal of enemies she hits.',
      },
    },
  ],
  // カルラ（Mage／MID）
  '110': [
    {
      ja: {
        label: '回復阻害と移動速度を先に立てる',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '2品目は2,040Gの夢魔の牙で、累計2,740G。魔法攻撃+230に加え、敵のHP回復とライフスティールを35%減らす効果がここで付きます。5品目の賢者の怒りが魔法攻撃を30%増やし、合計は魔法攻撃+1027.8、魔法防御貫通+85.6。移動速度+17.5%はビルド2より7.5ポイント高く、前に出る速さで勝ります。',
      },
      en: {
        label: 'Early anti-heal, extra move speed',
        when: 'When the enemy team leans on healing or lifesteal to survive fights',
        text: 'Venomous Staff lands second at 2,040 gold, 2,740 into the build. It brings +230 magic attack and cuts enemy healing and lifesteal by 35%. Savant\'s Wrath in slot five raises magic attack by another 30%, closing at +1027.8 magic attack and +85.6 magic penetration. Movement speed finishes at +17.5%, 7.5 points above the other build, so you step up and rotate sooner.',
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
        label: '防御の靴とライフスティールで粘る型',
        when: '敵に魔法ダメージで戦うヒーローが多いとき',
        text: '1品目の抵抗の靴で、物理防御・魔法防御と耐性を最初に持ちます。4品目のシャドーブレードはクリティカルが出るたびに攻撃速度と移動速度を上げるので、撃ちながら位置を変えやすくなります。最後のブラッドエッジはスキルにもライフスティールを乗せるため、長い撃ち合いでもHPを戻しながら戦えます。',
      },
      en: {
        label: 'Resistance boots and lifesteal',
        when: 'When the enemy has several heroes dealing magical damage',
        text: 'Boots of Resistance come first, giving physical defense, magical defense and resistance from the start. Shadow Ripper, the fourth item, raises Attack Speed and Movement Speed after each critical hit, which makes it easier to reposition while shooting. Bloodweeper closes the build and adds lifesteal to skills as well, letting her recover Health through long exchanges.',
      },
    },
    {
      ja: {
        label: '通常攻撃の重さで押す型',
        when: '敵にHPの多い前衛が2体以上いるとき',
        text: '1品目の速攻の靴で、攻撃速度と、通常攻撃のたびのHP回復を持ちます。3品目のマスターブレードは最大HPを足しながら、スキルを使った直後の通常攻撃を強くする装備です。最後のドゥームズデイは相手の追加HPに応じたダメージを通常攻撃に乗せるので、HPを積んだ前衛ほど削りが伸びます。ビルド1が防御とライフスティールで粘るのに対し、こちらは通常攻撃の重さで押していきます。',
      },
      en: {
        label: 'Heavier basic attacks',
        when: 'When the enemy fields two or more high-Health frontliners',
        text: 'Boots of Dexterity come first for Attack Speed and Health restored on each Basic Attack. Master Sword, the third item, adds max Health and strengthens the next Basic Attack after a skill. Doomsday closes the build, adding damage based on the target\'s extra Health, so the more Health a frontliner stacks, the more each attack takes off. Where build 1 holds on through defense and lifesteal, this one pushes through the weight of each Basic Attack.',
      },
    },
  ],
  // 魯班7号（Marksman／FARM）
  '112': [
    {
      ja: {
        label: '手数で前衛を削る型',
        when: '敵にHPの高い前衛が2体以上いるとき',
        text: '2品目のスパークダガーは通常攻撃に魔法ダメージを足し、3回ごとに電撃も放ちます。4品目の威光の弓で物理防御貫通と通常攻撃のダメージを足し、5品目のドゥームズデイは相手の追加HPに応じたダメージを通常攻撃に乗せます。HPを積んだ前衛ほど、この上乗せが大きくなります。アルカナは狩猟を10枠使い、攻撃速度と移動速度に寄せています。',
      },
      en: {
        label: 'Grind down frontliners with volume',
        when: 'When the enemy fields two or more high-Health frontliners',
        text: 'Sparkforged Dagger in second adds magical damage to his Basic Attacks and fires chain lightning every third one. Daybreaker\'s Virtue in fourth adds physical pierce and Basic Attack damage, and Doomsday in fifth puts damage based on the target\'s extra Health on every Basic Attack. The more Health a frontliner has stacked, the bigger that bonus gets. The arcana use all ten Hunt slots, leaning into attack speed and movement speed.',
      },
    },
    {
      ja: {
        label: '貫通と吸収で粘る型',
        when: '敵にアサシンやファイターなど、近づいてくるヒーローが多いとき',
        text: '2品目をシャドーブレードにして、クリティカル率と攻撃速度を先に上げます。4品目の砕星の槌は物理防御貫通と最大HP、移動速度をまとめて足し、5品目のグレートブレイカーはHPが半分を切った敵へのダメージを増やします。最後のブラッドエッジで物理ライフスティールと最大HPを足すので、近づかれても撃ちながらHPを戻せます。アルカナは狩猟の半分を略奪に替えています。',
      },
      en: {
        label: 'Pierce and lifesteal to hold on',
        when: 'When the enemy has many heroes who close in, such as assassins and fighters',
        text: 'Shadow Ripper goes second, raising critical rate and attack speed early. Starbreaker in fourth adds physical pierce, max Health and movement speed together, and Overlord\'s Might in fifth increases damage to enemies below half Health. Bloodweeper at the end adds physical lifesteal and max Health, so he can heal while shooting even when someone reaches him. The arcana swap half of Hunt for Reaver.',
      },
    },
  ],
  // 荘子（Support／ROAM）
  '113': [
    {
      ja: {
        label: '重傷を早め、減速も足す',
        when: '敵にライフスティールで粘るヒーローが2体以上いるとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度20%とクールダウン15%短縮を、範囲800の味方にも半分配ります。3品目に紅蓮のマントを置くので、4,820Gの時点で燃焼と35%の回復・ライフスティール減少が入る。5品目の不吉な予兆は、攻撃してきた敵の攻撃速度を最大40%、移動速度を最大15%落とします。合計は最大HP+7587・物理防御+753で、ビルド2より物理防御が90高い。',
      },
      en: {
        label: 'Earlier anti-heal, added slow',
        when: 'When two or more enemy heroes sustain themselves through lifesteal',
        text: 'Crimson Shadow - Redemption goes first, handing Zhuangzi 20% attack speed and 15% cooldown reduction while allies within 800 range pick up half of it. Blazing Cape lands third, so the burn and its 35% cut to healing and lifesteal are running by 4,820 gold. Ominous Premonition in slot five strips up to 40% attack speed and 15% movement speed from whoever attacks him. The totals come to +7,587 max HP and +753 physical defense, 90 more physical defense than the other build.',
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
        text: '1品目の極影の盾・閃光は、攻撃速度20%とクールダウン15%短縮のオーラを味方にも半分配ります。3品目にシャドーアックスを置き、物理攻撃80と物理防御貫通90〜180を防御装備より先に立てる。4品目の紅蓮のマントが範囲375の敵を燃やし、HP回復とライフスティールを35%落とします。5品目のブラッドレイジは通常攻撃に追加HPの1.5%を上乗せし、最大HP+5387を積むほど通常攻撃が重くなる。',
      },
      en: {
        label: 'HP-Scaling Damage Support',
        when: 'When the enemy roster leans on healing and you want to push up and chip them down yourself.',
        text: 'Crimson Shadow - Radiance opens, handing allies half of its 20% attack speed and 15% cooldown reduction aura. Axe of Torment lands third, bringing 80 physical attack and 90-180 physical penetration online ahead of the defensive pieces. Blazing Cape follows in the fourth slot, burning everything within 375 range and cutting enemy healing and lifesteal by 35%. Blood Rage lands fifth, adding 1.5% of bonus HP to every basic attack, so the +5387 max HP total makes each hit heavier.',
      },
    },
    {
      ja: {
        label: '物理防御790で前に立ち続ける',
        when: '敵の物理火力が多く、集団戦で先頭に立ち続けたいとき',
        text: '1品目のガーディアン・星泉は、物理・魔法防御65〜130と5秒ごとの最大HP0.6%回復を範囲800の味方にも半分渡します。3品目のブリザードで物理防御240とクールダウン短縮20%、5品目の不吉な予兆で物理防御をさらに300積む。合計は物理防御+888・クールダウン短縮+32%。ビルド1の+223・+16%を大きく上回ります。6品目の賢者の庇護なら、死亡2秒後に劉禅がその場で復活し、HPを2000〜3000取り戻す（1試合2回まで）。',
      },
      en: {
        label: 'Armor-Stacked Frontline',
        when: 'When the enemy damage is mostly physical and you need to hold the front line through team fights.',
        text: 'Guardian - Starspring opens, passing allies within 800 range half of its 65-130 physical and magic defense and its 0.6% max HP regen every 5 seconds. Glacial Buckler arrives third for 240 physical defense and 20% cooldown reduction, and Ominous Premonition adds 300 more physical defense in the fifth slot. Totals land at +888 physical defense and +32% cooldown reduction, well past build 1\'s +223 and +16%. Sage\'s Sanctuary finishes it, reviving Liu Shan on the spot two seconds after death with 2000-3000 HP, twice per match.',
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
        text: '3品目に時の預言、4品目に羽化の衣を置き、7,030Gの時点でHPと物理・魔法防御を先に立てます。羽化の衣は追加HPの2%を魔法攻撃、3%を魔法防御貫通に上乗せするので、最大HP+3150という積み方と噛み合う。魔法攻撃を30%増やす賢者の怒りは5品目まで待つ形になり、合計は862とビルド1より260低い。締めの巫術の杖で、スキル発動から5秒以内の通常攻撃に追加の魔法ダメージが乗ります。',
      },
      en: {
        label: 'Health and defenses first',
        when: 'When you draw the enemy\'s focus early and want to hold ground up front.',
        text: 'Augur\'s Word third and Breakthrough Robe fourth put health, physical defense, and magic defense in place by 7,030G. Breakthrough Robe grants magic power worth 2% of bonus health and magic defense penetration worth 3%, which pays off at +3,150 max HP. Savant\'s Wrath and its 30% boost wait until the fifth slot, so magic power finishes at 862 — 260 below build 1. Staves of Sorcery closes the build, adding magic damage to the next basic attack within 5 seconds of a cast.',
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
        text: '5品目のグレートブレイカーまで9,520G分は、2本とも同じ順・同じ顔ぶれ。最後の2,020Gを永夜の守護に回し、魔法防御+280・最大HP+2,300で締める。2.5秒間の被ダメージが最大HPの25%を超えると、次の2.5秒間で最大HPの10%を回復します。アルカナは隠匿を10枠、物理攻撃が+16増えて合計+390。',
      },
      en: {
        label: 'Magic Defense and Sustain',
        when: 'When the enemy\'s main damage is magic and you need to hold the front line.',
        text: 'The first five items and their 9,520G are the same in both builds, order included. The last 2,020G goes to Longnight Guardian, closing at +280 magic defense and +2,300 max HP. Take more than 25% of your max HP in damage over 2.5 seconds and it heals 10% of max HP over the next 2.5. Stealth takes ten of the arcana slots, adding +16 physical attack for +390 in total.',
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
        text: '最初に極影の盾・救済を立て、240〜480＋最大HPの10%のシールドを60秒ごとに味方へ配ります。2品目の秘法の靴は700Gで、魔法防御貫通が60〜120増える。3品目からは防御装備を4つ重ね、最大HP+7387、物理防御+713まで積み上がります。締めの覇者の重装で最大HPがさらに4%増え、毎秒0.5%が自動で戻る。',
      },
      en: {
        label: 'HP and physical defense wall',
        when: 'When the enemy fields two or more physical damage dealers and you want to stand in front of your team.',
        text: 'Crimson Shadow - Redemption goes down first, handing allies a 240-480 shield plus 10% of max HP every 60 seconds. Boots of the Arcane follow at 700G, adding 60-120 magic penetration. From the third slot on, four defensive items go down back to back, finishing at +7387 max HP and +713 physical defense. Overlord\'s Platemail closes the run with another 4% max HP and 0.5% self-healing per second.',
      },
    },
    {
      ja: {
        label: '回復とクールダウン短縮を回す型',
        when: '敵に回復やライフスティールが多く、味方のHPを保ちたいとき',
        text: '先頭のガーディアン・星泉が、味方と孫臏自身を500〜1060＋最大HPの20%回復します。2品目の抵抗の靴で耐性が25%上がり、3品目の聖杯からMPとHPが毎秒戻る。最大HPは+4737と軽い代わりに、魔法攻撃+380・クールダウン短縮32.5%が付きます。締めの夢魔の牙は、当てた敵の回復とライフスティールを35%減らす。',
      },
      en: {
        label: 'Healing and cooldown engine',
        when: 'When enemies lean on healing or lifesteal and you want to keep your team topped up.',
        text: 'Guardian - Starspring leads, restoring 500-1060 plus 20% of max HP to both the linked ally and Sun Bin. Boots of Resistance bring 25% tenacity for 700G, and Holy Grail in the third slot keeps MP and HP ticking back every second. Max HP settles at a lighter +4737, in exchange for +380 magic attack and 32.5% cooldown reduction. Venomous Staff wraps it up by cutting enemy healing and lifesteal by 35%.',
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
        text: '6品のうち違うのは5品目だけで、残る5品は買う順まで2本とも同じ。ビルド1が置くフロストショック2030Gは、物理防御150とクールダウン短縮7.5%を足します。制圧以外のハードCCを受けると最大HPの10%のシールドが張られ、アクティブの氷霜領域は0.75秒後に敵を凍結させる。総合計は最大HP+6987、物理防御+893で、クールダウン短縮はビルド2より7.5%多い13.5%です。',
      },
      en: {
        label: 'Shield and freeze in slot five',
        when: 'When the enemy team stacks hard CC and you want to lock fights down',
        text: 'Only the fifth slot differs — the other five items, and the order they are bought in, match across both builds. Build one puts Frigid Charge (2,030G) there for 150 physical defense and 7.5% cooldown reduction. Any hard CC short of suppression grants a shield worth 10% of max HP, and the active frost field freezes enemies after 0.75s. Totals come to +6,987 max HP and +893 physical defense, with cooldown reduction at 13.5% — 7.5 points clear of the other build.',
      },
    },
    {
      ja: {
        label: 'HPと回復を伸ばす5品目',
        when: '敵の魔法ダメージが多く、粘って耐えたいとき',
        text: '5品目が不死鳥の目2020Gに変わるだけで、残る5品は買う順まで2本とも同じです。魔法防御180と最大HP1350が付き、HPを10%失うごとにHP回復効果が5%増える。毎秒最大HPの0.5%を戻す覇者の重装と、最大HPの10%を回復する永夜の守護が、削られた後ほど効きます。総合計は最大HP+7437、魔法防御+600で、ビルド1よりHPが450、魔法防御が180厚い。',
      },
      en: {
        label: 'More HP and healing in slot five',
        when: 'When enemy damage is mostly magic and fights run long',
        text: 'Slot five is the only change — Eye of the Phoenix (2,020G) — while the other five buys and their order match build one. It adds 180 magic defense and 1,350 max HP, and every 10% of HP lost raises healing received by 5%. Overlord\'s Platemail restoring 0.5% Health every second and Longnight Guardian\'s 10% max HP heal both scale up as the health bar drops. Totals reach +7,437 max HP and +600 magic defense — 450 HP and 180 magic defense over build 1.',
      },
    },
  ],
  // ミーユエ（Mage／CLASH）
  '121': [
    {
      ja: {
        label: 'HPを積むほど魔法攻撃が伸びる型',
        when: '集団戦が長引き、前に出て粘り続けたいとき',
        text: '4品目からは羽化の衣・巫術の杖・時の預言と、魔法攻撃とHPを兼ねる装備だけが並びます。羽化の衣は追加HPの2%を魔法攻撃、3%を魔法防御貫通に上乗せし、基礎値を含めた上限が+100と+150。6品目の時の預言は魔法攻撃の10%ぶんの物理・魔法防御を足し、魔法攻撃760なら76が乗ります。靴以外に防御装備はなく、HP+3330と魔法攻撃+760の両方に届く構成。',
      },
      en: {
        label: 'Bonus HP feeds magic power',
        when: 'When fights drag on and Mi Yue has to hold the front line.',
        text: 'From the fourth slot Mi Yue buys only items that pay in both magic attack and health: Breakthrough Robe, Staves of Sorcery and Augur\'s Word. Breakthrough Robe adds 2% of bonus HP as magic attack and 3% as magic penetration, with both bonuses capped at +100 and +150 including their 20-40 and 30-60 base. Augur\'s Word closes the build and grants physical and magic defense equal to 10% of magic attack, so 760 magic attack is worth 76 of each. Outside the boots there is no defensive item, yet the totals still reach +3330 max HP and +760 magic attack.',
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
        label: '被弾を力に変えて殴り合う型',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '抵抗の靴で耐性を上げ、2品目の蒼天の剣で、スキルが最初に当たった敵ヒーローを減速させ、受けるダメージも抑えます。4品目の猛攻の鎧はダメージを受けるたびに自分の与ダメージと移動速度が重なる装備で、殴られるほど攻撃が重くなります。最後のジャッジメントは物理ライフスティールを持ち、当てた敵のHP回復とライフスティールも下げます。',
      },
      en: {
        label: 'Brawl harder the more you are hit',
        when: 'When the enemy has heroes who stay alive through healing or lifesteal',
        text: 'Boots of Resistance raise Resistance, and Pure Sky in second slows the first enemy hero his skills hit and reduces the damage he takes. Cuirass of Savagery in fourth stacks damage and Movement Speed every time he takes damage, so the more he is hit the harder he swings. Mortal Punisher closes the build with physical lifesteal and cuts the healing and lifesteal of enemies it hits.',
      },
    },
    {
      ja: {
        label: '倒れても持ちこたえる型',
        when: '敵に物理ダメージで一気に倒しに来るヒーローが多いとき',
        text: '靴を忍びの靴に替えて物理被ダメージを減らし、2品目にグレートブレイカーを先に置いて、HPが半分を切った敵への与ダメージを早めに上げます。後半の名刀・司命は致命傷を受けても死なずに無敵になり、賢者の庇護は倒されたあとにその場で復活させてくれます。致命傷を受ける場面を装備で続けてしのげるので、先に飛び込む役を任されたときに合います。',
      },
      en: {
        label: 'Hold on through lethal hits',
        when: 'When the enemy has several heroes who burst you down with physical damage',
        text: 'Boots of Fortitude cut physical damage taken, and Overlord\'s Might moves up to second for extra damage against enemies below half Health. Later, Destiny turns a fatal hit into brief invincibility, and Sage\'s Sanctuary revives him on the spot after he dies. Items carry him through lethal moments more than once, which suits a game where he is the one diving in first.',
      },
    },
  ],
  // 周瑜（Mage／MID）
  '124': [
    {
      ja: {
        label: '割合ダメージと最大HPを先に積む',
        when: '敵にHPの高い前衛が2体以上並ぶとき',
        text: '3品目に苦痛のマスクを置き、4,820Gで割合ダメージを手にします。スキルが命中すると3秒間に4回、敵の現在HPの3%を追加で削る。最大HPは+1900、クールダウン短縮は42.5%まで伸び、どちらも2本のうち高いほう。魔法攻撃の合計は+1062で、うち+350を占める賢者の天書は6品目まで待ちます。',
      },
      en: {
        label: 'Percent-HP chip and bulk first',
        when: 'When the enemy team fields two or more high-HP frontliners',
        text: 'Mask of Agony comes third, so percent-HP damage is online at 4,820G. Each skill hit adds 3% of the target\'s current HP, four times over three seconds. Max HP climbs to +1900 and cooldown reduction to 42.5%, both the higher of the two builds. Total magic attack is +1062, and the +350 of that coming from Sage\'s Tome only arrives in slot six.',
      },
    },
    {
      ja: {
        label: '魔法攻撃と貫通を先に立てる',
        when: '敵が魔法防御を積み、削りが通りにくいとき',
        text: '3品目を賢者の天書に前倒しし、5,350Gで魔法攻撃+350を先に立てます。魔法攻撃100ごとにダメージが0.5%増えるため、中盤から火力の上乗せが効く。4品目のヴォイドスタッフは魔法防御貫通を45%増やし、魔法防御を買った相手にも通ります。魔法攻撃の合計は+1172とビルド1より110高く、最大HPは400低い+1500。',
      },
      en: {
        label: 'Magic attack and penetration first',
        when: 'When enemies buy magic defense and your damage stops landing',
        text: 'Sage\'s Tome moves up to third, putting +350 magic attack online at 5,350G. It adds 0.5% damage per 100 magic attack, so that bonus is already running from mid-game. Void Staff follows in slot four and raises magic penetration by 45%, keeping damage effective against enemies who stack magic defense. Totals land at +1172 magic attack, 110 above build 1, with max HP 400 lower at +1500.',
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
        label: '不死鳥の目で回復を伸ばす型',
        when: '敵の主なダメージが物理で、魔法ダメージ役が1体以下のとき',
        text: 'ビルド1は3品目に氷霜のグリップを置き、クールダウン短縮と物理防御を早めに持ちます。氷霜のグリップは、スキルを使ったあとの次の通常攻撃で周りの敵に追加ダメージと減速を与えるので、スキルと通常攻撃を交互に重ねるほど働きます。4品目の不死鳥の目を持つと、HPを失うほどHP回復効果が大きくなります。アルカナは調和と狩猟を5枠ずつに分け、時間ごとのHP回復も足しています。',
      },
      en: {
        label: 'Eye of the Phoenix for recovery',
        when: 'When most enemy damage is physical and there is at most one magic damage dealer',
        text: 'This build puts Frostscar\'s Embrace third for early cooldown reduction and physical defense. Its effect adds damage and a slow to nearby enemies on the next Basic Attack after a skill, so it pays off when he alternates skills and Basic Attacks. With Eye of the Phoenix in fourth, the more Health he loses, the stronger his Health recovery gets. The arcana split ten slots evenly between Health regeneration and Attack Speed with Movement Speed.',
      },
    },
    {
      ja: {
        label: '魔女のマントを先に持つ型',
        when: '敵に魔法ダメージ役が2体以上いるとき',
        text: '3品目に魔女のマントを置き、魔法防御と、一定の間隔で張り直される魔法ダメージのシールドを早めに持ちます。6品のうち違うのは、不死鳥の目の代わりに入るこの1品だけです。氷霜のグリップは5品目まで下がるので、クールダウン短縮が乗るのはビルド1より後になります。アルカナは狩猟を10枠にまとめ、攻撃速度と移動速度に寄せています。',
      },
      en: {
        label: 'Succubus Cloak early',
        when: 'When the enemy has two or more magic damage dealers',
        text: 'Succubus Cloak goes third, bringing magical defense and a magic-damage shield that renews at regular intervals early on. Of the six items, it is the only one that differs, taking the place of Eye of the Phoenix. Frostscar\'s Embrace drops to fifth, so its cooldown reduction arrives later than in build 1. All ten of those arcana slots go into Attack Speed and Movement Speed.',
      },
    },
  ],
  // 甄姫（Mage／MID）
  '127': [
    {
      ja: {
        label: '割合貫通で硬い敵を抜く',
        when: '敵に魔法防御を積む前衛が2体以上いるとき',
        text: '秘法の靴とフローズンブレスで足と削りを先に立てます。4品目に夢魔の牙を置くので、6,920Gの時点から敵のHP回復とライフスティールを35%落とせる。5品目のヴォイドスタッフは魔法防御貫通45%で、魔法防御を積んだ相手ほど効きが伸びます。合計は魔法攻撃+972、クールダウン短縮37.5%、最大HP+1900。',
      },
      en: {
        label: 'Percent penetration for tanky lineups',
        when: 'When two or more enemy front-liners stack magic defense.',
        text: 'Boots of the Arcane and Frozen Breath come first, for movement speed and steady chip damage. Venomous Staff lands fourth, so enemy healing and lifesteal are cut 35% from 6,920G onward. Void Staff follows at fifth with 45% magic defense penetration, which pays off more the more magic defense the enemy carries. Totals: +972 magic attack, 37.5% cooldown reduction, +1,900 max HP.',
      },
    },
    {
      ja: {
        label: '短縮と積み上げ貫通で撃ち続ける',
        when: '敵に回復持ちが少なく、集団戦が長引くとき',
        text: '4品目はトワイライトストームで、敵ヒーローにダメージを与えるたび魔法防御貫通が20〜40増え、6スタックまで重なる。5品目に賢者の怒りが前倒しになり、9,060Gで魔法攻撃+30%が乗ります。クールダウン短縮は合計42.5%でビルド1より5ポイント高く、魔法攻撃は+922。夢魔の牙は最後に回るので、敵のHP回復とライフスティールを35%削れるのは11,100G以降です。',
      },
      en: {
        label: 'Stacked penetration and faster rotations',
        when: 'When the enemy roster has little healing and teamfights run long.',
        text: 'Twilight Stream takes the fourth slot and adds 20-40 magic defense penetration each time you damage an enemy hero, up to six stacks. Savant\'s Wrath moves up to fifth, so the +30% magic attack passive arrives at 9,060G. Cooldown reduction totals 42.5%, five points above build 1, with +922 magic attack. Venomous Staff comes last, so the 35% cut to enemy healing and lifesteal only lands at 11,100G.',
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
        text: 'ビルド1は5品目の蒼天の剣で、スキルが敵ヒーローに当たると3秒間、被ダメージが20%減る。アクティブを押せば、さらに3秒間30%軽減。締めのブラッドエッジまで積むと物理ライフスティールは33%、物理攻撃は+427まで伸びます。2品目の抵抗の靴の魔法防御+100と耐性25%増加もあり、魔法主体の敵の前でも殴り合って居座れる。',
      },
      en: {
        label: 'Sustain and hold the front',
        when: 'When two or more enemy heroes deal magic damage',
        text: 'Pure Sky arrives fifth: land a skill on an enemy hero and incoming damage drops 20% for three seconds. Its active cuts another 30% for three more. Bloodweeper closes the build, taking physical lifesteal to 33% and physical attack to +427. Boots of Resistance, bought second, add +100 magic defense and 25% tenacity, so Miyamoto Musashi can trade in the middle of a magic-heavy fight.',
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
        label: '連射を重ね、耐久を後から足す型',
        when: '敵にHPの多い前衛と、魔法ダメージで戦うヒーローがいるとき',
        text: '速攻の靴から入り、スパークダガーとドゥームズデイで攻撃速度を重ねながら、通常攻撃に魔法ダメージと、相手の追加HPに応じたダメージを乗せていきます。4品目のフロストショックは、ハードCCを受けたときにシールドを張り、アクティブで周りの敵を減速させてから凍らせる装備です。5品目の威光の弓は、遠距離型のヒーローが持つと物理防御貫通と通常攻撃ダメージの上乗せが倍になります。最後の魔女のマントで、魔法防御と、魔法ダメージを防ぐシールドが加わります。',
      },
      en: {
        label: 'Stacked attack speed, bulk later',
        when: 'When the enemy has a high-Health frontline and a magical damage dealer',
        text: 'Boots of Dexterity come first, then Sparkforged Dagger and Doomsday stack Attack Speed while adding magical damage and damage based on the target\'s extra Health to his basic attacks. Frigid Charge, the fourth item, shields him when he is hit by hard crowd control, and its active slows nearby enemies before freezing them. Daybreaker\'s Virtue comes fifth, and its physical pierce and Basic Attack bonus double on a ranged hero. Succubus Cloak closes the build with magical defense and a shield against magical damage.',
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
        text: '1品目は靴ではなくガーディアン・救済（2080G）で、自身の物理・魔法防御65〜130を範囲800以内の味方にも50%配れます。以降は防御装備だけを重ね、装備とアルカナで最大HP+6487・物理防御+613・魔法防御+580。4品目の永夜の守護は、2.5秒間の被ダメージが最大HPの25%を超えると最大HPの10%を回復します。アルカナは宿命・調和・虚空を各10枠、HPだけで1162を積む。',
      },
      en: {
        label: 'Guardian frontline',
        when: 'When enemy damage is split between physical and magic and team fights drag on.',
        text: 'Guardian - Redemption takes the first slot at 2080G instead of the boots, and half of its 65-130 physical and magic defense also reaches allies within 800 range. Everything after that is pure defense, with items and arcana adding 6487 max HP, 613 physical defense and 580 magic defense. Longnight Guardian, the fourth buy, restores 10% of max HP once damage taken over 2.5 seconds passes 25% of it. Fate, Harmony and Void fill ten slots each and account for 1162 of that HP.',
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
        text: '3品目までは同じで、4品目に蒼天の剣を前倒しする。6,910Gで物理攻撃80と物理防御150が入り、スキルが敵ヒーローに当たれば3秒間は被ダメージも20%減ります。締めのサンライズケープは、敵ヒーローを攻撃すると自身と付近の味方1人に250〜500＋最大HPの4%のシールドを張る（CD10秒）。合計はクールダウン短縮+30%、物理防御+533、最大HP+3462で、ビルド1より硬さに寄ります。',
      },
      en: {
        label: 'Shielded frontline hold',
        when: 'When enemy physical damage is heavy and you need to stay on the front line.',
        text: 'The first three purchases match the other build. Pure Sky moves up to fourth, so 80 Physical Attack and 150 Physical Defense arrive at 6,910G, and landing a skill on an enemy hero cuts Fuzi\'s incoming damage by 20% for three seconds. Dawnlight finishes the set: damaging an enemy hero shields Fuzi and the lowest-Health ally nearby for 250–500 plus 4% of Max Health, on a 10-second cooldown. Totals lean defensive at +30% Cooldown Reduction, +533 Physical Defense and +3462 Max Health.',
      },
    },
  ],
  // 関羽（Fighter／CLASH）
  '140': [
    {
      ja: {
        label: '防御に全振りして前で粘る',
        when: '敵に物理アタッカーが2枚いて、前で受け続けるとき',
        text: '1品目は700Gの忍びの靴で、物理被ダメージが6〜12%減ります。2品目の紅蓮のマントは周囲に燃焼を撒き、当たった敵の回復とライフスティールを35%削る。以降も永夜の守護と不吉な予兆まで防御で固め、合計は物理防御+1000、最大HP+5000。物理攻撃は装備とアルカナを足しても+80止まりで、削るより前で受け切ることに寄せた並びです。',
      },
      en: {
        label: 'All defense, holds the front',
        when: 'When the enemy fields two physical carries and Guan Yu has to soak the front line.',
        text: 'Boots of Fortitude open the build at 700G, cutting physical damage taken by 6-12%. Blazing Cape comes second, burning everything nearby and stripping 35% of the healing and lifesteal off anything the burn touches. The rest stays defensive through Longnight Guardian and Ominous Premonition, for +1000 physical defense and +5,000 max HP. Physical attack tops out at +80 with items and arcana combined, so Guan Yu absorbs the fight rather than cutting through it.',
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
        text: '抵抗の靴・聖杯・神喰らいの書で4,780G、魔法ライフスティール24%はビルド2の倍にあたる。4品目の羽化の衣は追加HPを火力に変える装備です。最大HP+3530まで積むので、魔法攻撃+100と魔法防御貫通+150がどちらも上限に届く。靴の魔法防御+100も合わせ、魔法攻撃+832を前線で出し切る構成。',
      },
      en: {
        label: 'Turning HP into damage',
        when: 'When the enemy leans on magical damage and you want to stay in the fight.',
        text: 'Boots of Resistance, Holy Grail and Insatiable Tome come to 4,780G, and the 24% magical lifesteal is double what build 2 ends with. The fourth pickup, Breakthrough Robe, turns stacked HP into damage. Piling up +3,530 max HP takes both of its passives to their caps: +100 magical attack and +150 magical pierce. Add +100 magical defense from the boots and that +832 magical attack is meant to be spent up close.',
      },
    },
    {
      ja: {
        label: '回転を上げて撃ち続ける',
        when: '敵に飛び込み役が多く、無効化を挟んで撃ち続けたいとき',
        text: '静謐の靴と聖杯で2,720G、この2品だけでクールダウン短縮が30%。最終値57.5%はビルド1の25%の倍以上で、魔法攻撃+872を短い間隔で撃てます。3品目の時の預言で最大HP+900、次のトワイライトストームはヒーローを削るほど魔法防御貫通が伸びる。ムーンライトスタッフは動けなくなる代わりに、1.5秒すべての効果を無効化します。',
      },
      en: {
        label: 'Faster rotations',
        when: 'When the enemy fields several divers and you need an immunity window to keep casting.',
        text: 'Boots of Tranquility and Holy Grail cost 2,720G, and those two alone carry 30% cooldown reduction. The finished 57.5% is more than double build 1\'s 25%, so +872 magical attack comes off a much shorter cycle. Augur\'s Word lands third for +900 max HP, and Twilight Stream after it builds magical pierce the more you damage heroes. Splendor buys 1.5 seconds of full immunity at the price of standing still.',
      },
    },
  ],
  // アンジェラ（Mage／MID）
  '142': [
    {
      ja: {
        label: '範囲の爆発と吸収を足す型',
        when: '敵に回復やライフスティールで粘るヒーローがいないとき',
        text: '靴・賢者の怒り・ヴォイドスタッフ・賢者の天書の4品は2本とも同じで、違うのは2品目と4品目です。このビルドの2品目は残響の杖で、スキルが当たると周りに爆発を起こすので、ミニオンの列と敵をまとめて削れます。4品目の神喰らいの書は魔法ダメージの一部をHPとして吸い、吸う量に応じてクールダウンも縮めます。',
      },
      en: {
        label: 'Splash damage and sustain',
        when: 'When the enemy has no hero that relies on healing or lifesteal',
        text: 'Boots, Savant\'s Wrath, Void Staff and Sage\'s Tome are shared by both builds; only the second and fourth items differ. Here the second item is Scepter of Reverberation, which sets off an explosion when a skill lands, so the minion wave and nearby enemies take damage together. Insatiable Tome comes fourth, turning part of her magical damage into Health and adding cooldown reduction for the lifesteal it gives.',
      },
    },
    {
      ja: {
        label: '回復を止め、倒れかけを凌ぐ型',
        when: '敵に回復やライフスティールに頼るヒーローがいるとき、または飛び込んでくるアサシンがいるとき',
        text: '2品目の夢魔の牙は、通常攻撃やスキルが当たった敵のHP回復とライフスティールを落とします。4品目の灼熱の杖は、HPが大きく減ったときに自分のCCを解き、シールドと移動速度を足す装備です。飛び込まれて倒れかけた場面から、抜け出す手段が1つ増えます。最後の2品はビルド1と順番が入れ替わり、ヴォイドスタッフが6品目に下がります。',
      },
      en: {
        label: 'Anti-heal and a way out',
        when: 'When the enemy has a hero relying on healing or lifesteal, or an assassin who will dive you',
        text: 'Venomous Staff comes second and cuts the Health recovery and lifesteal of enemies hit by her basic attacks or skills. Ardent Dominion, the fourth item, clears crowd control when her Health drops low and gives her a shield and extra Movement Speed. That gives her one more way out when she is dived and close to dying. The last two items swap places compared to build 1, pushing Void Staff to sixth.',
      },
    },
  ],
  // ルナ（Fighter／JUNGLE）
  '146': [
    {
      ja: {
        label: '追加HPで魔法防御貫通を伸ばす積み方',
        when: '敵の前衛が魔法防御を積んでいて、火力が通りにくいとき',
        text: '1品目のルーンソードは、モンスターを倒すたび魔法攻撃が6ずつ増え、25スタックで+150に届く。2品目に700Gの抵抗の靴を挟み、移動速度+50と耐性25%を早めに確保。時の預言から羽化の衣までの3品で最大HP+2550を積み、羽化の衣がその3%を魔法防御貫通に上乗せします。心眼10枠の+64も別枠で乗り、締めの賢者の怒りまで積むと装備の魔法攻撃は770、そこからさらに30%増える。',
      },
      en: {
        label: 'Bonus HP that feeds magic pierce',
        when: 'When enemy frontliners stack magic defense and your damage stops getting through',
        text: 'Runeblade goes down first: every monster kill adds 6 magic attack, reaching +150 at 25 stacks. The 700G Boots of Resistance slot in second for +50 movement speed and 25% tenacity early. Augur\'s Word, Insatiable Tome and Breakthrough Robe push max HP to +2550, and the Robe adds 3% of that bonus HP on top of its base 30-60 magic pierce. Ten Mind\'s Eye arcana contribute a separate 64, and Savant\'s Wrath closes the gear at +770 magic attack before raising it another 30%.',
      },
    },
  ],
  // 太公望（Mage／MID）
  '148': [
    {
      ja: {
        label: '貫通の靴から入り、回復を止める型',
        when: '敵に回復役がいて、魔法防御も積まれるとき',
        text: '1品目の秘法の靴で、最初から魔法防御貫通とMPの回復を持ちます。3品目の夢魔の牙は、当てた敵のHP回復とライフスティールを落とす装備です。5品目にヴォイドスタッフを置くので、魔法防御を積んだ相手にもダメージが通るのは、ビルド2より早い時期です。最後のトワイライトストームは、ヒーローに当て続けるほど魔法防御貫通がさらに重なります。',
      },
      en: {
        label: 'Pierce boots first, healing shut off',
        when: 'When the enemy has a healer and stacks magical defense against you',
        text: 'Boots of the Arcane come first, giving magic pierce and mana regeneration from the start. Venomous Staff, the third item, cuts the healing and lifesteal of any enemy it hits. Void Staff sits fifth, so damage starts getting through magical defense earlier than in build 2. Twilight Stream closes the build and keeps adding magic pierce as long as he keeps hitting heroes.',
      },
    },
    {
      ja: {
        label: '割合の削りを先に、貫通を最後に',
        when: '敵に高HPの前衛が並び、削りを早く通したいとき',
        text: '1品目の疾風の靴は移動速度を上げ、戦闘から離れているとさらに速くなります。苦痛のマスクを3品目に上げているので、相手の現在HPに応じた削りがビルド1より早く始まります。5品目の賢者の怒りは、魔法攻撃そのものを割合で伸ばす装備です。その代わり、ヴォイドスタッフの魔法防御貫通は最後の6品目まで待つことになります。',
      },
      en: {
        label: 'Percent chip early, pierce last',
        when: 'When the enemy fields high-HP frontliners and your chip damage has to land early',
        text: 'Boots of Deftness come first, raising movement speed and adding more when he is out of combat. Mask of Agony moves up to third, so damage based on the target\'s current HP starts earlier than in build 1. Savant\'s Wrath, fifth, raises magic attack itself by a percentage. The trade is that Void Staff\'s magic pierce waits until the sixth and last slot.',
      },
    },
  ],
  // 劉邦（Tank／CLASH）
  '149': [
    {
      ja: {
        label: 'HPと防御を先に立てる前衛型',
        when: '敵の回復が厚く、前で受け続けたいとき',
        text: '1品目のガーディアン・閃光が物理防御と魔法防御を65〜130増やし、その半分は範囲800以内の味方にも届く。3品目の紅蓮のマントは4,820Gの時点で揃い、物理防御・魔法防御がさらに150ずつ増えます。マントの燃焼は、敵のHP回復とライフスティールを2.5秒間35%減らす。合計は最大HP+5100に対し魔法攻撃+492で、硬さを先に立てる構成です。',
      },
      en: {
        label: 'Defenses first, HP stacked',
        when: 'When the enemy team heals a lot and you need to hold the front line',
        text: 'Guardian - Radiance goes first, adding 65-130 physical and magic defense, with half of that passed to allies within 800 units. Blazing Cape lands third at the 4,820G mark and adds another 150 to each defense. Its burn cuts enemy HP regen and lifesteal by 35% for 2.5 seconds. Totals come to +5100 max HP against +492 magic attack, so durability is what this build buys first.',
      },
    },
    {
      ja: {
        label: '魔法攻撃+902まで伸ばす削り型',
        when: '敵前衛が薄く、序盤から手数で押し込みたいとき',
        text: '1品目の極影の盾・閃光が攻撃速度20%とクールダウン15%短縮を与え、その半分は範囲800以内の味方にも乗る。3・4品目が羽化の衣と巫術の杖なので、6,980Gで魔法攻撃と魔法防御貫通が先に揃います。終盤は賢者の天書が魔法攻撃100ごとにダメージと被ダメージ軽減を0.5%ずつ、賢者の怒りが魔法攻撃を30%上乗せ。合計は魔法攻撃+912とクールダウン短縮+25%で、最大HPはビルド1より2000少ない+3100です。',
      },
      en: {
        label: 'Magic attack stacked to +902',
        when: 'When the enemy front line is thin and you want to keep the pressure on early',
        text: 'Crimson Shadow - Radiance opens with 20% attack speed and 15% cooldown reduction, half of which reaches allies within 800 units. Breakthrough Robe and Staves of Sorcery come third and fourth, so magic attack and magic defense penetration are in place by 6,980G. Late game, Sage\'s Tome adds 0.5% damage and 0.5% damage reduction per 100 magic attack, and Savant\'s Wrath raises magic attack by another 30%. Totals reach +912 magic attack and 25% cooldown reduction, with max HP 2000 lower than build 1 at +3100.',
      },
    },
  ],
  // 韓信（Assassin／JUNGLE）
  '150': [
    {
      ja: {
        label: '靴を先に、締めはライフスティール',
        when: '立ち上がりを速くして、削られても居座りたいとき',
        text: '2品目が700Gの忍びの靴。2,860Gの時点で移動速度50と物理防御100が揃い、物理被ダメージも6〜12%減ります。締めのブラッドエッジの25%にアルカナ略奪×9の14.4%が重なり、物理ライフスティールは39.4%。物理攻撃+482・物理防御貫通+96.4はビルド2とほぼ同値で、差が出るのは居座る力のほうです。',
      },
      en: {
        label: 'Boots early, lifesteal to close',
        when: 'When you want a fast start and enough sustain to stay in the fight',
        text: 'Boots of Fortitude come second at 700G. By 2,860G the build already has 50 Movement Speed, 100 Physical Defense and 6-12% less physical damage taken. Bloodweeper closes it out: its own 25% plus 14.4% from nine Reaver arcana puts Physical Lifesteal at 39.4%. Physical Attack +482 and Physical Pierce +96.4 sit almost level with Build 2, so the gap between the two is sustain, not damage.',
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
        label: '疾風の靴と無効化で生き残る型',
        when: '敵に飛び込んでくるアサシンやファイターがいるとき',
        text: '1品目の疾風の靴は最大HPと移動速度を持ち、戦闘から離れるとさらに速くなります。5品目のトワイライトストームは、ヒーローにダメージを与え続けるほど魔法防御貫通が重なっていきます。最後のムーンライトスタッフには、動けなくなる代わりにすべての効果を無効化するアクティブがあり、飛び込まれたときにしのぐ手段になります。苦痛のマスクは4品目で、ビルド2より遅く入ります。',
      },
      en: {
        label: 'Deftness boots and an immunity active',
        when: 'When the enemy has assassins or fighters who dive',
        text: 'Boots of Deftness come first, adding max Health and Movement Speed and getting faster still out of combat. Twilight Stream, the fifth item, keeps adding magical pierce as long as she keeps damaging heroes. Splendor closes the build with an active that grants immunity to all effects at the cost of being unable to act, a way to survive a dive. Mask of Agony sits fourth, later than in build 2.',
      },
    },
    {
      ja: {
        label: '貫通と魔法攻撃を早く積む型',
        when: '敵に前衛が2体以上いるとき',
        text: '1品目の秘法の靴で魔法防御貫通を持ち、2品目に苦痛のマスクを上げて、相手の現在HPに応じた削りを早くから入れます。5品目のヴォイドスタッフで貫通がさらに増え、最後の賢者の天書で、魔法攻撃が多いほどダメージが上がり被ダメージも軽減されます。無効化のアクティブを持たないので、飛び込まれたときの備えはビルド1より薄くなります。',
      },
      en: {
        label: 'Pierce and magic attack early',
        when: 'When the enemy has two or more frontliners',
        text: 'Boots of the Arcane come first for magical pierce, and Mask of Agony moves up to second so damage based on the target\'s current Health starts early. Void Staff in fifth adds more pierce, and Sage\'s Tome closes the build, raising damage dealt and reducing damage taken the more magical attack she has. Without an immunity active, she has less to fall back on against dives than in build 1.',
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
        text: '700Gの忍びの靴から入り、移動速度50と物理被ダメージ6〜12%減を先に確保します。2品目のシャドーアックスで物理防御貫通90〜180、締めの砕星の槌で貫通30%増。アルカナは1枠だけ狩猟にあて、攻撃速度+1%を持たせた配分です。ビルド2との差はこの1枠のみで、11,080Gの完成時は物理攻撃+323.6・物理防御貫通+100・最大HP+3320。',
      },
      en: {
        label: 'One Hunt slot for attack speed',
        when: 'When enemy frontliners stack physical defense and trades drag on',
        text: 'Opens with the 700G Boots of Fortitude, locking in 50 movement speed and a 6-12% cut to physical damage taken. Axe of Torment lands second for 90-180 physical penetration, and Starbreaker finishes the build with a further 30%. One arcana slot goes to Hunt, adding 1% attack speed. That slot is the only difference from build 2: the finished 11,080G set totals +323.6 physical attack, +100 physical penetration and +3320 max HP.',
      },
    },
    {
      ja: {
        label: '隠匿7枠で物理攻撃に寄せる型',
        when: '一度の交戦で敵の後衛まで踏み込みたいとき',
        text: '装備の顔ぶれも買う順もビルド1と同じ。違いはアルカナ1枠で、狩猟を隠匿に替えている。攻撃速度+1%を落とすかわりに物理攻撃が+325.2まで伸び、移動速度は+0.7%のまま。5品目の魔女のマントで魔法防御+300と最大HP+1100が加わり、終盤は物理と魔法の両方を受け止めます。',
      },
      en: {
        label: 'Seven Stealth slots for damage',
        when: 'When you want to reach the enemy backline in a single dive',
        text: 'Same six items in the same order as build 1. The only change is one arcana slot, with Hunt traded for Stealth: 1% attack speed goes away, physical attack rises to +325.2, and movement speed still totals +0.7%. Succubus Cloak, the fifth buy, adds 300 magic defense and 1100 max HP, so the late game holds up against both damage types.',
      },
    },
  ],
  // エリン（Marksman／FARM）
  '155': [
    {
      ja: {
        label: '魔法防御貫通とHPを足す型',
        when: '敵に前衛が2体以上いるとき',
        text: 'スパークダガー、秘法の靴、ドゥームズデイと続く3品目までは、2本とも同じ並びです。このビルドは4品目にヴォイドスタッフを置き、魔法攻撃と魔法防御貫通に加えて最大HPも足します。アルカナは宿命で攻撃速度と最大HP、物理防御を補い、略奪で物理ライフスティールを伸ばしています。',
      },
      en: {
        label: 'Magical pierce plus Health',
        when: 'When the enemy fields two or more frontliners',
        text: 'Sparkforged Dagger, Boots of the Arcane and Doomsday come in the same order in both builds. This one puts Void Staff fourth, adding magical attack, magical pierce and max Health. The Fate arcana add attack speed, max Health and physical defense, while Reaver raises physical lifesteal.',
      },
    },
    {
      ja: {
        label: 'クリティカルと物理防御貫通の型',
        when: '敵の前衛が1体以下で、後衛を狙いやすいとき',
        text: 'ビルド1との違いは、ヴォイドスタッフの代わりに5品目へ入る威光の弓で、暴風は4品目に繰り上がります。威光の弓は物理攻撃・攻撃速度・クリティカル率をまとめて上げ、物理防御貫通と通常攻撃のダメージも足します。アルカナは禍源でクリティカル率を積み、略奪の一部を狩猟に替えて攻撃速度と移動速度を足しています。',
      },
      en: {
        label: 'Crit and physical pierce',
        when: 'When the enemy has one frontliner or fewer and their backline is easy to reach',
        text: 'The difference from build 1 is Daybreaker\'s Virtue in fifth place instead of Void Staff, which moves Tempest up to fourth. Daybreaker\'s Virtue raises physical attack, attack speed and critical rate together, and adds physical pierce and Basic Attack damage. The Calamity arcana stack critical rate, and part of Reaver is swapped for Hunt to add attack speed and movement speed.',
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
        text: '神喰らいの書と抵抗の靴を先に置き、3品目に夢魔の牙を立てる。通常攻撃かスキルが命中するたび、敵の回復とライフスティールが2.5秒間35%下がります。賢者の怒りを4品目に回す分、魔法攻撃の伸び方はビルド2より一歩遅い。合計は魔法攻撃+1202、クールダウン短縮+22.5%で、ビルド2より短縮が7.5%高くなります。',
      },
      en: {
        label: 'Anti-heal online by item three',
        when: 'When the enemy team fields multiple healers or lifesteal carries',
        text: 'Insatiable Tome and Boots of Resistance come first, with Venomous Staff third. Every basic attack or skill that lands cuts enemy healing and lifesteal by 35% for 2.5 seconds. Savant\'s Wrath slides to fourth, so magic power ramps a step later than in build 2. The finished line totals +1202 magic power and 22.5% cooldown reduction, 7.5 points clear of build 2.',
      },
    },
    {
      ja: {
        label: '範囲爆発で複数をまとめて削る型',
        when: '敵が固まって動き、複数を巻き込みたいとき',
        text: '3品目を賢者の怒りにして、魔法攻撃30%増を先に立てる。4品目の残響の杖が、スキル命中で周囲に140〜280＋魔法攻撃の28%の魔法ダメージを撒きます（5秒に1回）。夢魔の牙を外す分、クールダウン短縮は15%どまり。合計の魔法攻撃は+1182でビルド1より20低く、代わりに範囲ダメージを取る形です。',
      },
      en: {
        label: 'Area burst from the fourth slot',
        when: 'When enemies group up and you want to hit several at once',
        text: 'Savant\'s Wrath moves into the third slot, landing its 30% magic power boost earlier. Scepter of Reverberation follows at fourth and explodes for 140-280 plus 28% of magic power whenever a skill connects, once every 5 seconds. Dropping Venomous Staff caps cooldown reduction at 15%. Magic power totals +1182, twenty below build 1, and the trade is area damage in place of the anti-heal.',
      },
    },
  ],
  // ドリア（Support／ROAM）
  '159': [
    {
      ja: {
        label: '味方の手数を増やすオーラの型',
        when: '敵に魔法ダメージで戦うヒーローが多いとき、または味方に通常攻撃で戦うヒーローが多いとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にもその半分を届けます。5品目の魔女のマントは魔法防御とHPを大きく足し、一定時間ごとに魔法ダメージを防ぐシールドを張る装備です。物理防御を厚くする不吉な予兆は、最後の6品目に回ります。',
      },
      en: {
        label: 'Aura for more casts and attacks',
        when: 'When the enemy has several magical damage dealers, or your team has several basic-attack carries',
        text: 'Crimson Shadow - Redemption comes first, raising her Attack Speed and Cooldown Reduction and passing half of it to allies in range. Succubus Cloak, the fifth item, adds a lot of magical defense and Health and gives her a shield against magical damage at regular intervals. Ominous Premonition, which thickens physical defense, waits until the sixth slot.',
      },
    },
    {
      ja: {
        label: '殴る相手を鈍らせる守りの型',
        when: '敵に物理ダメージで戦うヒーローが多いとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げ、範囲内の味方にもその半分を届けます。5品目に上げた不吉な予兆は、攻撃してきた相手の攻撃速度と移動速度を落とすので、物理で攻める相手を早い時期から鈍らせます。最後の永夜の守護は、短い間に大きなダメージを受けたときにHPを戻します。アルカナは調和を10枠に増やし、HPの自然回復を厚くしています。',
      },
      en: {
        label: 'Slow down whoever hits you',
        when: 'When the enemy has several physical damage dealers',
        text: 'Guardian - Redemption comes first, raising her physical and magical defense and passing half of it to allies in range. Ominous Premonition moves up to fifth; it lowers the Attack Speed and Movement Speed of whoever damages her, blunting physical attackers earlier. Longnight Guardian closes the build and restores Health when she takes heavy damage in a short time. The arcana lean further into Health regeneration.',
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
        label: '受けたダメージを火力に変える型',
        when: '敵に近くで殴り合うヒーローが多いとき',
        text: '抵抗の靴で耐性を上げ、2品目の氷霜のグリップで、スキルのあとの通常攻撃に範囲ダメージと減速を足します。4品目のスパイクアーマーは、アクティブを使うと短い間だけ受けたダメージの一部を確定ダメージとして相手に返し、相手が離れているほど返す量は減ります。最後の猛攻の鎧は、ダメージを受けるたびに与ダメージと移動速度が上がり、殴られている時間が長いほど攻撃が重くなります。アルカナは宿命で、攻撃速度も少し足しています。',
      },
      en: {
        label: 'Turning hits taken into damage',
        when: 'When the enemy has many heroes who brawl at close range',
        text: 'Boots of Resistance add Resistance, and Frostscar\'s Embrace in the second slot gives the Basic Attack after each skill extra area damage and a slow. Spikemail, the fourth item, has an active that briefly reflects part of the damage taken back as true damage, with less returned the farther away the attacker is. Cuirass of Savagery closes the build, raising damage and Movement Speed each time he is hit, so the longer he is under fire, the harder he hits back. The arcana set adds a little Attack Speed.',
      },
    },
    {
      ja: {
        label: '物理を軽減して長く粘る型',
        when: '敵の主なダメージが物理のとき',
        text: '靴を忍びの靴に替えて物理被ダメージを減らし、2品目に紅蓮のマントを前倒しして、近くの敵のHP回復とライフスティールを早めに落とします。4品目のブリザードは、大きな一撃を受けるたびに周りの敵の攻撃速度と移動速度を下げる装備です。最後は覇者の重装で最大HPを伸ばし、攻撃を受けていない間の回復も厚くします。アルカナは変異に替え、物理防御貫通を足しています。',
      },
      en: {
        label: 'Physical damage cut for long fights',
        when: 'When the enemy\'s main damage is physical',
        text: 'Boots of Fortitude replace the other boots to reduce physical damage taken, and Blazing Cape moves up to second to cut nearby enemies\' Health recovery and Lifesteal early. Glacial Buckler, the fourth item, lowers nearby enemies\' Attack Speed and Movement Speed whenever a single big hit lands on him. Overlord\'s Platemail finishes the build with more max Health and stronger regeneration while he is not being attacked. The arcana switch to a set that adds physical pierce.',
      },
    },
  ],
  // 孫悟空（Assassin／JUNGLE）
  '167': [
    {
      ja: {
        label: '無双でクリティカルを伸ばす型',
        when: '敵にHPの低い後衛が2体以上いるとき',
        text: '装備の6品も買う順も2本とも同じで、違うのはアルカナのうち10枠の選び方だけです。ビルド1は無双を10枠積み、クリティカル率とクリティカル効果を上乗せします。エンドレスブレードはクリティカル率が高いほどクリティカル効果も上がるので、無双で足したクリティカル率もそこに効いてきます。',
      },
      en: {
        label: 'Crit arcana',
        when: 'When the enemy has two or more low-HP back-liners',
        text: 'All six items and their buy order are the same in both builds; only ten arcana slots differ. This build fills them with arcana that add Critical Rate and Critical Damage. Eternity Blade raises Critical Damage as Critical Rate climbs, so the extra Critical Rate from the arcana feeds into it as well.',
      },
    },
    {
      ja: {
        label: '宿命で硬さと手数を足す型',
        when: '敵に物理ダメージで攻めるヒーローが3体以上いるとき',
        text: '装備はビルド1と同じで、無双の10枠を宿命に替えています。宿命は攻撃速度と最大HPと物理防御を足すので、一撃の重さを少し譲るかわりに、殴り合いを長く続けやすくなります。忍びの靴の物理被ダメージ軽減とも重なり、物理で攻めてくる相手との打ち合いに向いています。',
      },
      en: {
        label: 'Sturdier arcana',
        when: 'When the enemy has three or more physical damage heroes',
        text: 'The items match build 1; those ten arcana slots switch to ones that add Attack Speed, Max Health and Physical Defense. That gives up a little damage per hit in exchange for staying in a brawl longer. It stacks with the physical damage reduction from Boots of Fortitude, which suits trades against physical attackers.',
      },
    },
  ],
  // ラプール（Support／ROAM）
  '168': [
    {
      ja: {
        label: 'シールドを配り、被弾を反射する',
        when: '敵の火力が物理側に寄り、味方の後衛を守りたいとき',
        text: '1品目のガーディアン・救済で、味方に240〜480＋最大HPの10%のシールドを4秒配れる（CD60秒）。3品目のブリザードでクールダウン短縮20%と物理防御240を先に確保します。4品目の永夜の守護は大きな被弾のあとの最大HP10%回復、5品目のスパイクアーマーは被ダメージの35%（最大50%）の確定ダメージ反射。装備とアルカナの合計は最大HP+6387、物理防御+883、移動速度+20%、クールダウン短縮+25%まで伸びる。',
      },
      en: {
        label: 'Shield the team, punish the hits',
        when: 'When enemy damage leans physical and your carries need cover',
        text: 'Guardian - Redemption goes down first, handing allies a 240–480 (+10% max HP) shield for four seconds on a 60-second cooldown. Glacial Buckler lands third, banking 20% cooldown reduction and 240 physical defense early. Longnight Guardian then heals 10% of max HP after a heavy burst, and Spikemail reflects 35% of incoming damage as true damage, up to 50%. Gear and arcana together come to +6,387 max HP, +883 physical defense, +20% movement speed and +25% cooldown reduction.',
      },
    },
    {
      ja: {
        label: '敵の足を止め、魔法にも耐える',
        when: '敵に魔法火力が多く、飛び込みや逃げを止めたいとき',
        text: '1品目のガーディアン・閃光は、範囲1200の敵に4回当てて移動速度を最大50%落とす。3品目のフロストショックで0.75秒の凍結、4品目の不吉な予兆で攻撃者の攻撃速度を最大40%減。5品目の魔女のマントは15秒ごとに400〜800＋追加HPの7%の魔法シールドを張り、追加魔法防御の15%を物理防御に変えます。装備とアルカナの合計は最大HP+7387、魔法防御+490で、ビルド1よりHPが1000多く魔法防御も120厚い。',
      },
      en: {
        label: 'Freeze them, soak the magic',
        when: 'When the enemy leans on magic damage and dives or escapes too easily',
        text: 'Guardian - Radiance opens instead: four hits inside a 1,200 range, each taking 3% of current HP and cutting movement speed by up to 50%. Frigid Charge adds a 0.75-second freeze in the third slot, and Ominous Premonition strips up to 40% attack speed off anyone who damages you. Succubus Cloak then refreshes a 400–800 (+7% bonus HP) magic shield every 15 seconds and converts 15% of bonus magic defense into physical defense. Gear and arcana total +7,387 max HP and +490 magic defense — 1,000 more HP and 120 more magic defense than build 1, paid for with 180 physical defense and 12.5 points of cooldown reduction.',
      },
    },
  ],
  // 后羿（Marksman／FARM）
  '169': [
    {
      ja: {
        label: '靴を先に、貫通は最後に',
        when: '敵の前衛が軽く、物理防御を積むタンクがいないとき',
        text: '装備の6品は2本とも同じで、違うのは買う順番とアルカナです。このビルドは速攻の靴を1品目に置き、移動速度と、通常攻撃のたびにHPが戻る効果を最初から持ちます。物理防御貫通を足す威光の弓は最後の6品目なので、硬い相手への削りは後半まで伸びません。アルカナは狩猟を10枠積み、攻撃速度と移動速度を足しています。',
      },
      en: {
        label: 'Boots first, pierce last',
        when: 'When the enemy frontline is light and has no tank stacking physical defense',
        text: 'Both builds use the same six items; only the buying order and arcana differ. This one opens with Boots of Dexterity, so the Movement Speed and the Health restored on every basic attack are there from the start. Daybreaker\'s Virtue, which adds physical pierce, comes sixth, so damage against tough targets does not pick up until late. All ten Hunt arcana slots go into Attack Speed and Movement Speed.',
      },
    },
    {
      ja: {
        label: 'ドゥームズデイと貫通を早めに',
        when: '敵に物理防御やHPを積むタンクがいるとき',
        text: 'ドゥームズデイを靴より先に買い、物理ライフスティールと、相手の追加HPに応じた上乗せダメージを最初に持ちます。威光の弓が4品目に上がるので、物理防御貫通がビルド1より早くそろいます。その代わり、射程を伸ばすサンセットチェイサーは最後まで待ちます。アルカナは狩猟の一部を略奪に替えて、ライフスティールを厚くしています。',
      },
      en: {
        label: 'Doomsday and pierce early',
        when: 'When the enemy has a tank stacking physical defense or Health',
        text: 'Doomsday comes before the boots, giving physical lifesteal and bonus damage based on the target\'s extra Health right away. Daybreaker\'s Virtue moves up to fourth, so physical pierce is in place earlier than in build 1. In exchange, Sunchaser and its range-boosting active wait until last. Some of the attack speed arcana are swapped for lifesteal arcana.',
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
        text: '1品目の極影の盾・救済は、攻撃速度20%とクールダウン15%短縮を範囲800の味方にも半分渡します。靴と紅蓮のマントのあとは魔女のマント、不吉な予兆、覇者の重装と積み、最大HP+7587・魔法防御+540に届く。魔女のマントは追加魔法防御の15%を物理防御へ変え、15秒ごとに400〜800の魔法ダメージシールドも張ります。不吉な予兆は被弾するだけで攻撃者の攻撃速度を20〜40%削るため、殴り合いが長引くほど得をする構成。',
      },
      en: {
        label: 'Stacked HP and magic defense',
        when: 'When enemy damage leans magic and teamfights drag on',
        text: 'Crimson Shadow - Redemption comes first, passing 20% attack speed and 15% cooldown reduction to allies within 800 at half value. After the boots and Blazing Cape come Succubus Cloak, Ominous Premonition and Overlord\'s Platemail, ending at +7587 max HP and +540 magic defense. Succubus Cloak converts 15% of bonus magic defense into physical defense and grants a 400-800 magic damage shield every 15 seconds. Ominous Premonition cuts 20-40% attack speed from anyone who damages Zhang Fei, so the longer a brawl runs, the more this build earns.',
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
        label: 'スパークダガーから入る型',
        when: '敵に物理防御を積むタンクが1体以下のとき',
        text: '6品のうち5品は2本とも同じで、ビルド1はスパークダガーを靴より先に買います。スパークダガーは通常攻撃3回ごとに電撃を放つので、早く持つほど通常攻撃の削りが早く始まります。5品目の暴風は、通常攻撃やスキルが当たるたびに攻撃速度・移動速度・ダメージが積み上がる装備で、最大HPも付きます。アルカナは隠匿の2枠を獣痕に替え、クリティカル率と最大HPを少し足しています。',
      },
      en: {
        label: 'Sparkforged Dagger first',
        when: 'When the enemy has one tank or fewer stacking physical defense',
        text: 'Five of the six items are shared by both builds; this one buys Sparkforged Dagger before the boots. The dagger releases chain lightning every third Basic Attack, so the sooner it arrives, the sooner her basic attack chip damage starts. Tempest, the fifth item, stacks Attack Speed, Movement Speed and damage each time a Basic Attack or skill lands, and it adds Max Health as well. Two of the movement-speed arcana slots are swapped for ones that add a little Critical Rate and Max Health.',
      },
    },
    {
      ja: {
        label: '威光の弓で防御を抜く型',
        when: '敵に物理防御を積むタンクが2体以上いるとき',
        text: '速攻の靴を1品目に置き、移動速度と、通常攻撃のたびのHP回復を最初から持ちます。違う装備は5品目だけで、暴風の代わりに威光の弓を買います。威光の弓は物理防御貫通を割合で上げるので、鷹の目のアルカナの貫通と重なり、物理防御の高い相手にもダメージが通りやすくなります。クリティカル率も付きますが、暴風のような最大HPは付きません。',
      },
      en: {
        label: 'Daybreaker\'s Virtue to cut through armor',
        when: 'When the enemy has two or more tanks stacking physical defense',
        text: 'Boots of Dexterity come first, giving Movement Speed and Health on every Basic Attack from the start. The only different item is the fifth: Daybreaker\'s Virtue instead of Tempest. It raises Physical Pierce by a percentage, which adds to the pierce from the arcana and helps damage get through high physical defense. It also brings Critical Rate, but none of the Max Health that Tempest gives.',
      },
    },
  ],
  // 李元芳（Marksman／FARM）
  '173': [
    {
      ja: {
        label: '回復を削るジャッジメント型',
        when: '敵に回復やライフスティールに頼るヒーローがいるとき',
        text: '1品目のグリードバイトはスマイトを選んだときにしか買えないので、2本ともスペルはスマイトにします。6品のうち違うのは4品目だけで、このビルドはジャッジメントを選びます。通常攻撃やスキルが当たった敵のHP回復とライフスティールを落とすので、回復で粘る相手を削り切りやすくなります。攻撃速度と、自分のHPが低くなったときに回復する効果も付いています。',
      },
      en: {
        label: 'Mortal Punisher to cut healing',
        when: 'When the enemy has heroes who rely on healing or Lifesteal',
        text: 'Rapacious Bite, the first item, can only be bought with Smite, so both builds take Smite. The six items differ only in the fourth slot, and this one takes Mortal Punisher. It cuts Health recovery and Lifesteal on enemies hit by Basic Attacks or skills, which makes it easier to finish targets who sustain. It also adds Attack Speed and a heal when his own Health drops low.',
      },
    },
    {
      ja: {
        label: 'HPと吸収で粘るブラッドエッジ型',
        when: '敵に飛び込んでくる近接ヒーローが多いとき',
        text: '4品目をブラッドエッジに替えた形で、ほかの5品とアルカナはビルド1と同じです。物理ライフスティールと最大HPが付き、スキルによる物理ライフスティールも上がるので、殴られながら撃ち続ける場面でHPを戻せます。攻撃速度と、敵の回復を落とす効果はビルド1にしか付きません。',
      },
      en: {
        label: 'Bloodweeper to heal through dives',
        when: 'When the enemy has many melee heroes who dive',
        text: 'This version swaps the fourth item for Bloodweeper; the other five items and the arcana match Build 1. It brings physical Lifesteal and max Health, plus extra physical Lifesteal on skill damage, so he can win Health back while firing under pressure. The Attack Speed and the healing cut stay with Build 1.',
      },
    },
  ],
  // 虞美人（Marksman／FARM）
  '174': [
    {
      ja: {
        label: '回復を止めて射程を伸ばす型',
        when: '敵に回復やライフスティールに頼るヒーローがいるとき',
        text: '速攻の靴のあと、エンドレスブレードとシャドーブレードでクリティカルを固め、4品目に威光の弓を置きます。ビルド2と違うのは、5品目のジャッジメントと最後のサンセットチェイサーの2品です。ジャッジメントは当てた敵のHP回復とライフスティールを落とし、自分のHPが低くなったときの回復も付きます。サンセットチェイサーのアクティブは、短い間だけ通常攻撃の射程と移動速度を伸ばせます。',
      },
      en: {
        label: 'Anti-healing and extra range',
        when: 'When the enemy relies on healing or lifesteal',
        text: 'After Boots of Dexterity, Eternity Blade and Shadow Ripper lock in critical damage, and Daybreaker\'s Virtue comes fourth. What sets this build apart from build 2 are two items: Mortal Punisher in fifth and Sunchaser at the end. Mortal Punisher cuts the healing and lifesteal of anyone it hits and heals her when her Health runs low. Sunchaser\'s active briefly extends her Basic Attack range and raises her movement speed.',
      },
    },
    {
      ja: {
        label: '前衛を削りながら粘る型',
        when: '敵にHPの高い前衛が2体以上いるとき',
        text: '3品目のドゥームズデイは通常攻撃に相手の追加HPに応じたダメージを足すので、HPを積んだ前衛ほど削りやすくなります。5品目のブラッドエッジは物理ライフスティールと最大HPを足し、長い殴り合いでもHPを戻しながら撃ち続けられます。威光の弓は最後に回るため、物理防御貫通が入るのはビルド1より後です。アルカナは2本で変わりません。',
      },
      en: {
        label: 'Wear down frontliners and stay healthy',
        when: 'When the enemy fields two or more high-Health frontliners',
        text: 'Doomsday, the third item, adds damage based on the target\'s extra Health to every Basic Attack, so the more Health a frontliner has stacked, the more it takes. Bloodweeper in fifth adds physical lifesteal and max Health, letting her keep shooting and healing through long brawls. Daybreaker\'s Virtue is held to the last slot, so its physical pierce arrives later than in build 1. The arcana are the same in both builds.',
      },
    },
  ],
  // 鐘馗（Support／ROAM）
  '175': [
    {
      ja: {
        label: '防御オーラを配る守りの型',
        when: '味方の前に立ち、周りの味方ごと守りを厚くしたいとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げ、範囲内の味方にもその半分を配ります。アクティブの救援は周りの味方にシールドを張るので、集団戦の入り口で味方を守る手札が1枚増えます。3品目のブリザードは、大きなダメージを受けるたびに周りの敵を減速させる装備です。前に立つ時間が長いほど、この減速が敵の足を止めてくれます。',
      },
      en: {
        label: 'Defense aura for the whole team',
        when: 'When you stand in front and want everyone near you to be harder to kill',
        text: 'Guardian - Redemption comes first: it raises Kui\'s physical and magical defense and gives allies in range half of the effect. Its active, Rescue, shields nearby allies, which adds one more way to protect the team as a fight opens. Glacial Buckler, the third item, slows nearby enemies every time he takes a big hit. The longer he holds the front, the more that slow keeps enemies in place.',
      },
    },
    {
      ja: {
        label: '攻撃速度を配り、ステルスを暴く型',
        when: '敵にステルスを使うヒーローがいるとき、または味方に通常攻撃で戦うヒーローが多いとき',
        text: '1品目の極影の盾・閃光は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にもその半分を配ります。アクティブの鏡影は広い範囲の敵を何度も削って減速させ、ステルス中の敵も短い間だけ見えるようにします。ビルド1のブリザードの代わりに最後に覇者の重装を積むので、HPの厚さで粘る形に仕上がります。',
      },
      en: {
        label: 'Attack-speed aura that exposes stealth',
        when: 'When the enemy has stealth heroes, or your team leans on basic attackers',
        text: 'Crimson Shadow - Radiance comes first: it raises Kui\'s attack speed and cooldown reduction and gives allies in range half of the effect. Its active, Mirror Domain, hits enemies across a wide area several times, slows them, and briefly reveals anyone in stealth. Overlord\'s Platemail takes the place of build 1\'s Glacial Buckler at the end, so this version holds on through sheer HP.',
      },
    },
  ],
  // 楊貴妃（Mage／MID）
  '176': [
    {
      ja: {
        label: 'HPで固めて前に出る型',
        when: '敵の物理火力が高く、前に出て粘りたいとき',
        text: '1品目の極影の盾・閃光（2080G）は、HP+1200と味方へのゴールド配布を持つローム専用装備。氷霜のグリップと不死鳥の目、羽化の衣を重ね、最大HPは+5137、物理防御は+413まで伸びます。羽化の衣が追加HPの2%を魔法攻撃（上限100）、3%を魔法防御貫通（上限150）に上乗せする。魔法攻撃の合計は+310で、+1054を積むビルド2とは狙いが別です。',
      },
      en: {
        label: 'Stack HP and play forward',
        when: 'When the enemy team leans physical and you want to hold the front line.',
        text: 'The first buy is Crimson Shadow - Radiance at 2080G, a roam-only item carrying 1200 HP that also feeds gold to whichever ally has the least. Frostscar\'s Embrace, Eye of the Phoenix and Breakthrough Robe follow, taking the totals to +5137 max HP and +413 physical defense. Breakthrough Robe adds 2% of bonus HP as magic attack (capped at 100) and 3% as magic defense penetration (capped at 150). Magic attack still ends at +310, well short of the +1054 that build 2 stacks.',
      },
    },
    {
      ja: {
        label: '魔法攻撃と貫通を積み切る型',
        when: '敵に回復やライフスティールが多く、後ろから撃ちたいとき',
        text: '1品目に700Gの秘法の靴を置き、魔法防御貫通60〜120を最速で立てます。以降は魔法攻撃装備を5品重ね、合計は魔法攻撃+1043、クールダウン短縮26%。夢魔の牙が敵の回復とライフスティールを35%落とし、ヴォイドスタッフが魔法防御貫通を45%増やす。最大HPは+2000で、ビルド1の+5112とは前に出る距離が違います。',
      },
      en: {
        label: 'Full magic damage stack',
        when: 'When enemies bring healing or lifesteal and you want to fire from the back.',
        text: 'Boots of the Arcane go down first at 700G, locking 60-120 magic defense penetration into the opening buy. Five magic attack items follow, for +1043 magic attack and 26% cooldown reduction in total. Venomous Staff cuts enemy healing and lifesteal by 35%, and Void Staff raises magic defense penetration by another 45%. Max HP stops at +2000 against build 1\'s +5112, so Yang Guifei picks her fights from further back.',
      },
    },
  ],
  // 蒼（Marksman／FARM）
  '177': [
    {
      ja: {
        label: 'フラッシュで組む攻撃速度型',
        when: 'スマイトを持たず、フラッシュを選ぶとき',
        text: '1品目に速攻の靴を買い、攻撃速度と、通常攻撃のたびに回復する効果を先に手に入れます。エンドレスブレードから続く4品はビルド2と同じ顔ぶれで、どれもクリティカル率か攻撃速度を伸ばします。最後のサンセットチェイサーは、アクティブで通常攻撃の射程と移動速度を少しの間上げられる装備です。射程が伸びるのは遠距離型ヒーローだけで、蒼はこの効果をそのまま使えます。',
      },
      en: {
        label: 'Attack speed build with Flash',
        when: 'When you take Flash instead of Smite',
        text: 'Boots of Dexterity come first, giving Attack Speed and Health on each Basic Attack right away. The four items from Eternity Blade onward are the same ones Build 2 buys, and each adds Critical Rate or Attack Speed. Sunchaser finishes the build with an active that briefly raises Basic Attack range and Movement Speed. The range bonus only works for ranged heroes, which Chano is.',
      },
    },
    {
      ja: {
        label: 'スマイトで組むグリードバイト型',
        when: 'スマイトを選び、敵に魔法ダメージのヒーローが多いとき',
        text: '1品目のグリードバイトはスマイトを選んだときだけ買え、モンスターから受けるダメージを減らして、モンスター撃破で得るEXPとゴールドを増やします。モンスターを倒すたびに物理攻撃とクールダウン短縮も重なっていきます。靴は2品目の抵抗の靴にし、魔法防御と耐性を足しています。速攻の靴とサンセットチェイサーが無いぶん、攻撃速度はビルド1より低く仕上がります。',
      },
      en: {
        label: 'Rapacious Bite build with Smite',
        when: 'When you take Smite and the enemy has several magic damage heroes',
        text: 'Rapacious Bite can only be bought with Smite; it reduces damage taken from monsters and raises the EXP and Gold they give. Each monster kill also stacks Physical Attack and Cooldown Reduction on it. Boots of Resistance come second, adding magical defense and Resistance. Without Boots of Dexterity and Sunchaser, this build finishes with less Attack Speed than Build 1.',
      },
    },
  ],
  // 楊戩（Fighter／CLASH）
  '178': [
    {
      ja: {
        label: '燃焼で敵の回復を削る最終装備',
        when: '敵にライフスティール持ちや回復役が多いとき',
        text: '9,010Gまでの5品はビルド2と共通で、分かれるのは最後の2,040Gだけ。紅蓮のマントは範囲375以内の敵を燃焼させ、最大HPの1.5%の魔法ダメージを与えます。燃焼を受けた敵はHP回復とライフスティールが2.5秒間35%下がる。魔法防御は合計+510まで伸び、ビルド2を150上回ります。',
      },
      en: {
        label: 'Burn that cuts enemy healing',
        when: 'When the enemy team leans on lifesteal or heavy sustain.',
        text: 'The first five items, through 9,010G, match Build 2; only the last 2,040G differs. Blazing Cape burns enemies within 375 units for 1.5% of their max HP as magic damage. Anything the burn touches loses 35% of its HP regen and lifesteal for 2.5 seconds. Magic defense climbs to +510, a full 150 above Build 2.',
      },
    },
    {
      ja: {
        label: '反射と物理防御で受け止める',
        when: '敵の物理火力が濃く、近距離で殴り合うとき',
        text: '不死鳥の目までの5品は共通で、最後の2,020Gをスパイクアーマーに使う。アクティブのカウンターは3秒間、被ダメージの35%を確定ダメージで反射します。反射量は距離が離れるほど減り、上限は50%、クールダウンは75秒。合計は物理防御+600・物理攻撃+242でビルド1を150と45上回り、魔法防御は+360で150低い。',
      },
      en: {
        label: 'Reflect damage, stack physical defense',
        when: 'When enemy damage is mostly physical and fights happen at close range.',
        text: 'The five items through Eye of the Phoenix are shared; the last 2,020G goes to Spikemail. Its Countersiege active reflects 35% of incoming damage as true damage for 3 seconds. The reflected share falls off with distance, caps at 50%, and comes back every 75 seconds. Totals land at +600 physical defense and +242 physical attack, 150 and 45 above Build 1, with magic defense at +360, 150 short.',
      },
    },
  ],
  // 女媧（Mage／MID）
  '179': [
    {
      ja: {
        label: 'クールダウンを37.5%まで詰める',
        when: 'レーン戦でMPが足りていて、手数で押し込みたいとき',
        text: '1品目の静謐の靴700Gが、+15%のクールダウン短縮を最初に用意する。残響の杖、賢者の天書、賢者の怒りと積んだ7,550G地点で、魔法攻撃が30%増加します。アルカナも生贄ではなく心眼を10枠選び、魔法防御貫通を+64上乗せ。合計はクールダウン短縮37.5%、魔法攻撃+1192、魔法防御貫通+88に届く。',
      },
      en: {
        label: 'Cooldowns cut by 37.5%',
        when: 'When your MP holds up in lane and you want to trade more often',
        text: 'Boots of Tranquility lead at 700G and lock in 15% cooldown reduction from the first buy. Scepter of Reverberation, Sage\'s Tome and Savant\'s Wrath follow, and by the 7,550G mark magical attack is raised by 30%. The arcana differ too: ten Mind\'s Eye instead of Tribute, worth 64 magical pierce. The build lands on 37.5% cooldown reduction, +1192 magical attack and +88 magical pierce.',
      },
    },
    {
      ja: {
        label: 'MPを切らさず魔法攻撃を伸ばす',
        when: '序盤にMPが切れてレーンを離れがちなとき',
        text: '1品目の秘法の靴700Gで、最大MP+400と5秒ごとのMP10回復が付く。アルカナは心眼ではなく生贄を10枠選び、魔法攻撃+22とクールダウン短縮+7%を足します。外した心眼の魔法防御貫通+64は、靴のパッシブの60~120で埋まる。クールダウン短縮は29.5%とビルド1に8ポイント劣るかわり、魔法攻撃は+1214まで伸びます。',
      },
      en: {
        label: 'MP upkeep, bigger magical attack',
        when: 'When MP runs dry early and you keep leaving the lane',
        text: 'Boots of the Arcane open at 700G with +400 max MP and 10 MP restored every 5 seconds. The arcana take ten Tribute rather than Mind\'s Eye, adding +22 magical attack and 7% cooldown reduction. The 64 magical pierce dropped with Mind\'s Eye is covered by the boots\' 60-120 pierce passive. Cooldown reduction settles at 29.5%, eight points behind build 1, while magical attack reaches +1214.',
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
        text: '靴の次に紅蓮のマントを置き、HP1100と、敵の回復・ライフスティールを35%削る燃焼を早く立てます。4品目のブラッドレイジは通常攻撃に追加HPの1.5%の物理ダメージを乗せ、積んだHPを火力に回す。覇者の重装まで積むと最大HP+4587、物理防御+753。物理攻撃はもう1本より175低く、HP50%未満へ30%増しのグレートブレイカーは6品目まで待ちます。',
      },
      en: {
        label: 'Health to hold the line',
        when: 'When the enemy team leans on healing and you want to stay on the front line.',
        text: 'Blazing Cape comes right after the boots: +1100 max HP, plus a burn that cuts enemy healing and lifesteal by 35%. Blood Rage in the fourth slot adds 1.5% of bonus HP as physical damage to basic attacks, so the stacked health feeds the damage too. By Overlord\'s Platemail the line sits at +4587 max HP and +753 physical defense. Physical attack is 175 lower than the other build, and the 30% bonus against enemies below half HP waits until Overlord\'s Might arrives sixth.',
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
        label: '攻撃速度のオーラと回復阻害の型',
        when: '敵に回復やライフスティールで戦うヒーローがいるとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にもその半分を配ります。4品目の夢魔の牙は、通常攻撃やスキルが当たった敵のHP回復とライフスティールを落とします。ほかの4品とアルカナ、スペルのヒールは2本とも同じです。',
      },
      en: {
        label: 'Speed aura and anti-heal',
        when: 'When the enemy has heroes who rely on healing or lifesteal',
        text: 'Crimson Shadow - Redemption, the first item, raises Cai Yan\'s attack speed and cooldown reduction and gives allies in range half of the effect. Venomous Staff, the fourth item, cuts the healing and lifesteal of enemies hit by a Basic Attack or skill. The other four items, the arcana and the Heal spell are the same in both builds.',
      },
    },
    {
      ja: {
        label: '防御のオーラと魔法攻撃の型',
        when: '敵に物理と魔法のダメージ役が両方いて、回復に頼る相手が少ないとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げ、範囲内の味方にもその半分を配ります。アクティブの救援はビルド1の1品目と同じで、範囲内の味方にシールドを張れます。4品目は夢魔の牙の代わりに賢者の怒りで、魔法攻撃そのものを割合で伸ばします。',
      },
      en: {
        label: 'Defense aura and magic attack',
        when: 'When the enemy splits its damage between physical and magic and few rely on healing',
        text: 'Guardian - Redemption, the first item, raises Cai Yan\'s physical and magical defense and gives allies in range half of the effect. Its active, Rescue, is the same as on build 1\'s first item and shields allies in range. The fourth item is Savant\'s Wrath instead of Venomous Staff, raising magic attack itself by a percentage.',
      },
    },
  ],
  // 東皇太一（Support／ROAM）
  '187': [
    {
      ja: {
        label: 'HPを重ねて魔法攻撃も伸ばす型',
        when: '敵の瞬間火力が高く、前に出て耐えたいとき',
        text: '2品目の羽化の衣は、追加HPの2%を魔法攻撃に、3%を魔法防御貫通に変える。調和と虚空のアルカナも合わせて最大HPは+3400まで伸び、硬さがそのまま火力になる。4品目に時の預言を置き、物理・魔法防御50~100と最大HP+900を先に確保する。5品目の神喰らいの書で魔法ライフスティール+24%が付き、賢者の天書は11,780G地点まで回せます。',
      },
      en: {
        label: 'Stacking Health into Magic Power',
        when: 'When the enemy has heavy burst and Donghuang needs to hold the front',
        text: 'Breakthrough Robe, bought second, turns 2% of bonus Health into Magic Attack and 3% into Magic Pierce. The Harmony and Void arcana take Max Health to +3400, so durability doubles as damage. Augur\'s Word lands fourth, a slot earlier than in the other build, adding 50–100 Physical and Magic Defense and another +900 Max Health. Insatiable Tome follows with +24% Magic Lifesteal, which is why Sage\'s Tome can wait for the 11,780G mark.',
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
        text: '4品目の永夜の守護と5品目の夢魔の牙が移動速度を7.5%ずつ足し、合計+32.5%まで伸びる。ビルド2の+17.5%とは足回りが別物です。夢魔の牙は魔法攻撃+230を持ち、命中した敵のHP回復とライフスティールを2.5秒間35%下げる。締めの覇者の重装まで積んで最大HP+5887、物理防御は+443にとどまります。',
      },
      en: {
        label: 'Roam fast, cut enemy healing',
        when: 'When the enemy team has healers or lifesteal and you want to roam wide',
        text: 'Longnight Guardian at slot four and Venomous Staff at slot five each add 7.5% movement speed, taking the total to +32.5% against Build 2\'s +17.5%. Venomous Staff also carries +230 magic power and cuts the HP recovery and lifesteal of anything it hits by 35% for 2.5 seconds. Overlord\'s Platemail closes the set, leaving +5887 max HP but only +443 physical defense.',
      },
    },
    {
      ja: {
        label: '物理防御+713で受け止める',
        when: '敵の物理アタッカーが2体以上で、正面から受け止めたいとき',
        text: '3品目のブリザードから防御装備が4つ続き、物理防御+713、最大HP+6087、クールダウン短縮+32.5%まで積み上がる。4品目の魔女のマントは追加魔法防御の15%を物理防御に変換し、15秒ごとに魔法ダメージシールドも張ります。5品目の不吉な予兆は、ダメージを受けると攻撃者の攻撃速度を2.5秒間最大40%下げる。フロストショックは6品目に回るので、凍結のアクティブが揃うのは終盤。',
      },
      en: {
        label: 'Soak damage with +713 physical defense',
        when: 'When two or more enemy physical carries force you to hold the front line',
        text: 'Glacial Buckler opens a run of four defensive items that takes physical defense to +713, max HP to +6087 and cooldown reduction to +32.5%. Succubus Cloak converts 15% of bonus magic defense into physical defense and puts up a magic damage shield every 15 seconds. Ominous Premonition cuts up to 40% attack speed from anyone who damages Guiguzi, for 2.5 seconds. Frigid Charge slides to slot six, so its freeze only arrives late.',
      },
    },
  ],
  // 孔明（Mage／MID）
  '190': [
    {
      ja: {
        label: '夢魔の牙と灼熱の杖で粘る型',
        when: 'スペルにピュリファイを持ち、敵に回復の多いヒーローがいるとき',
        text: 'ビルド2と違うのは、3品目の灼熱の杖と4品目の夢魔の牙です。灼熱の杖は、HPが減るとCCを解除してシールドを張り、移動速度も上げます。夢魔の牙は当てた敵のHP回復とライフスティールを下げるので、回復しながら戦う相手に合わせて選びます。1品目の秘法の靴で、魔法防御貫通とMPの回復を早くから持てます。',
      },
      en: {
        label: 'Venomous Staff and Ardent Dominion',
        when: 'When you take Purify and the enemy has heroes who heal a lot',
        text: 'The difference from build 2 is Ardent Dominion in the third slot and Venomous Staff in the fourth. Ardent Dominion removes crowd control and grants a shield with extra Movement Speed when Health gets low. Venomous Staff cuts the Health recovery and lifesteal of enemies it hits, which makes it the pick against teams that heal through fights. Boots of the Arcane come first, giving magical pierce and Mana regeneration early.',
      },
    },
    {
      ja: {
        label: 'スマイトでルーンソードから入る型',
        when: 'スペルにスマイトを持つとき',
        text: '1品目のルーンソードはスマイトを持っているときにしか買えないため、この型はスマイトが前提になります。孔明か近くの味方がモンスターを倒すたびに魔法攻撃とクールダウン短縮が積み上がり、モンスターからのEXPとゴールドも増えます。最後のムーンライトスタッフは、動けなくなる代わりにすべての効果を無効化するアクティブを持ちます。',
      },
      en: {
        label: 'Smite and a Runeblade start',
        when: 'When you take Smite',
        text: 'Runeblade, the first item, can only be bought with Smite, so this build depends on that spell. Each monster that Kongming or a nearby ally kills adds magical attack and cooldown reduction, and monsters also give more EXP and Gold. Splendor closes the build with an active that grants immunity to all effects at the cost of being unable to move or act.',
      },
    },
  ],
  // 大喬（Support／ROAM）
  '191': [
    {
      ja: {
        label: '攻撃速度オーラを配る型',
        when: '味方に通常攻撃で戦うヒーローが多く、敵の主なダメージが物理のとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にもその半分を配ります。アクティブの救援は範囲内の味方ヒーローにシールドを張る効果で、ビルド2の1品目と同じです。4品目の不吉な予兆は、ダメージを受けると攻撃者の攻撃速度と移動速度を落とすので、物理で殴ってくる相手に狙われても粘れます。最後の時の預言は魔法攻撃とHPに加え、魔法攻撃に応じた物理防御と魔法防御も足します。',
      },
      en: {
        label: 'Attack speed aura support',
        when: 'When your team has several basic attackers and the enemy deals mostly physical damage',
        text: 'Crimson Shadow - Redemption comes first: it raises Da Qiao\'s attack speed and cooldown reduction and gives allies in range half of the effect. Its active, Rescue, shields teammates within range, just like Build 2\'s first item. Ominous Premonition, the fourth item, lowers the attacker\'s Attack Speed and Movement Speed whenever she is hit, so physical attackers who focus her have a harder time. Augur\'s Word finishes the build with Magical Attack and Health, plus defense that scales with Magical Attack.',
      },
    },
    {
      ja: {
        label: '防御オーラと回復低下の型',
        when: '敵に回復やライフスティールに頼るヒーローがいるとき',
        text: '1品目をガーディアン・救済に替え、自分の物理防御と魔法防御を上げて、味方にもその半分を配ります。5品目のブリザードは、大きな一撃を受けるたびに周りの敵の攻撃速度と移動速度を下げる装備です。最後の夢魔の牙は魔法攻撃が大きく、通常攻撃やスキルが当たった敵のHP回復とライフスティールを落とします。抵抗の靴、サンライズケープ、魔女のマントは2本で共通です。',
      },
      en: {
        label: 'Defense aura and healing cut',
        when: 'When the enemy has heroes who rely on healing or Lifesteal',
        text: 'Guardian - Redemption takes the first slot, raising her physical and magical defense and giving allies half of the effect. Glacial Buckler, the fifth item, lowers nearby enemies\' Attack Speed and Movement Speed whenever a single big hit lands on her. Venomous Staff closes the build with a large amount of Magical Attack and cuts Health recovery and Lifesteal on anything her Basic Attacks or skills hit. Boots of Resistance, Dawnlight and Succubus Cloak are shared by both builds.',
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
        label: '最後に物理攻撃も足す型',
        when: '敵の魔法ダメージのヒーローが1体以下のとき',
        text: '5品目まではビルド2と同じで、どちらもスマイトを持つことが前提のグリードバイトから入ります。違うのは最後の1枠です。破魔の霊刀は物理攻撃と魔法防御を同時に足し、物理攻撃が高いほど魔法防御もさらに上がります。魔法の脅威が少ない相手なら、守りより攻撃を残すこちらが合います。',
      },
      en: {
        label: 'Add attack with the last slot',
        when: 'When the enemy has one magical damage hero or none',
        text: 'The first five items match build 2, starting from Rapacious Bite, which requires Smite. Only the last slot differs. Demonsbane adds physical attack and magical defense together, and its magical defense grows further with physical attack. Against a team with little magical threat, keeping the extra attack fits better than more defense.',
      },
    },
    {
      ja: {
        label: '最後を魔法の守りに回す型',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '5品目までの並びはビルド1と同じで、最後に魔女のマントを積みます。魔法防御とHPが大きく伸び、一定時間ごとに魔法ダメージを防ぐシールドが張られるうえ、追加の魔法防御の一部は物理防御にも変わります。物理攻撃は1品分少なくなるので、魔法ダメージに倒されないことを優先したいときに選びます。',
      },
      en: {
        label: 'Spend the last slot on magic defense',
        when: 'When the enemy has two or more magical damage heroes',
        text: 'The order matches build 1 through the fifth item, and Succubus Cloak goes last. It adds a large amount of magical defense and Health, grants a shield against magical damage at regular intervals, and converts part of the extra magical defense into physical defense. You give up one item\'s worth of physical attack, so pick it when not dying to magical damage comes first.',
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
        label: '敵の回復を削って締める型',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '靴からサンセットチェイサーまでの5品は2本とも同じで、違うのは最後の1品とアルカナだけです。このビルドは最後にジャッジメントを積み、通常攻撃やスキルが当たった敵のHP回復とライフスティールを落とします。自分のHPが低くなったときに回復する効果も付くので、飛び込まれたときの粘りも少し増えます。アルカナは略奪の一部を狩猟に替え、攻撃速度と移動速度を足しています。',
      },
      en: {
        label: 'Finish with anti-healing',
        when: 'When the enemy team leans on healing and lifesteal to stay alive',
        text: 'The first five items, from the boots through Sunchaser, are the same in both builds; only the last item and the arcana differ. This build ends with Mortal Punisher, which cuts the healing and lifesteal of anyone hit by a basic attack or skill. It also heals him when his HP runs low, which helps a little when he gets dived. The arcana swap part of the Reaver set for Hunt, adding attack speed and movement speed.',
      },
    },
    {
      ja: {
        label: 'HPの減った敵を仕留める型',
        when: '敵にHPの多い前衛が並び、削りきりたいとき',
        text: '共通の5品のあと、最後にグレートブレイカーを積みます。HPが半分を切った敵へのダメージが増えるので、狙撃で削った相手を仕留める力が上がります。アルカナは略奪を10枠まで使い、ライフスティールに寄せています。最後の1品がビルド1より高いぶん、そろうのは少し遅れます。',
      },
      en: {
        label: 'Finish off wounded targets',
        when: 'When the enemy fields high-HP frontliners you need to finish off',
        text: 'After the shared five items, Overlord\'s Might fills the last slot. It adds damage against enemies below half HP, so targets already worn down by snipes are easier to finish. All ten Reaver arcana go into lifesteal. The last item costs more than build 1\'s, so it arrives a little later.',
      },
    },
  ],
  // 棋星（Mage／MID）
  '197': [
    {
      ja: {
        label: '貫通と魔法攻撃で一点を抜く',
        when: '敵が魔法防御を積んでいて、後衛を短時間で落としたいとき',
        text: '魔法攻撃を+1049.6まで積む、貫通寄りの並び。5品目のヴォイドスタッフで魔法防御貫通が45%、仕上げの賢者の怒りで魔法攻撃が30%増えます。2品目の夢魔の牙は、当てた敵の回復とライフスティールを2.5秒間35%落とす。移動速度も+17.5%まで伸び、ビルド2の+10%を7.5ポイント上回ります。',
      },
      en: {
        label: 'Penetration and raw magic power',
        when: 'When the enemy stacks magic defense and you need their backline down fast.',
        text: 'A penetration-leaning order that stacks magic power to +1049.6. Void Staff in the fifth slot adds 45% magic defense penetration, and Savant\'s Wrath finishes by raising magic power a further 30%. Venomous Staff, the second buy, cuts the healing and lifesteal of anything it hits by 35% for 2.5 seconds. Movement speed reaches +17.5%, 7.5 points above build 2\'s +10%.',
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
        text: '共通の4品のあと、ディープフロストと覇者の重装で最大HPを+2550まで伸ばします。物理防御+380・魔法防御+190は2本のうち厚いほう。4品目に蒼天の剣を置くので、7,040Gの時点で被ダメージ30%軽減のアクティブが手に入る。ディープフロストの凍傷は命中時に135〜270の追加物理ダメージを乗せます（3秒間隔）。',
      },
      en: {
        label: 'Bulk route: +2,550 max HP',
        when: 'When the enemy brings both physical and magic damage and you need to hold the front.',
        text: 'After the four shared items, Deepfrost Siege and Overlord\'s Platemail supply the entire +2,550 max HP. The finished build sits at +380 physical defense and +190 magic defense — the tankier of the two lines. Pure Sky comes fourth here, so the active 30% damage reduction is online at 7,040G. Deepfrost Siege also lands 135-270 bonus physical damage on hit, no more than once every 3 seconds, and slows what it hits.',
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
        text: 'ガーディアン・救済で味方に防御オーラとシールドを配り、抵抗の靴まで2,780Gで立ち上げる。装備の顔ぶれで違うのは魔女のマント1品で、これを4品目（ここまで6,950G）に置きます。魔法防御は合計+400、最大HPは+4387まで伸び、明世隠自身も15秒ごとに400〜800（+追加HPの7%）の魔法ダメージシールドを得る。アルカナは宿命×10で、最大HPと物理防御に振るぶん魔法攻撃は+700にとどまります。',
      },
      en: {
        label: 'Magic resist and HP first',
        when: 'When the enemy\'s main damage is magic and you want to hold the front line',
        text: 'Guardian - Redemption hands allies the defensive aura and the shield, and Boots of Resistance takes you to 2,780G. The only item that differs is Succubus Cloak, slotted fourth at 6,950G. Magic defense totals +400 and max HP climbs to +4387, while Ming himself picks up a 400-800 (+7% of bonus HP) magic damage shield every 15 seconds. Fate arcana x10 feeds HP and physical defense, so magic attack stops at +700.',
      },
    },
    {
      ja: {
        label: '魔法攻撃を前に出し、回復も止める',
        when: '敵にライフスティールや回復で粘るヒーローがいるとき',
        text: '4品目に賢者の怒り、5品目に賢者の天書と続け、9,680Gで魔法攻撃を先に立てます。装備の差分は6品目の夢魔の牙で、命中した敵のHP回復とライフスティールを2.5秒間35%減らす。アルカナは聖人×10、合計は魔法攻撃+983、クールダウン短縮+22.5%、移動速度+20%まで伸びます。最大HPは+2950、魔法防御は+100で、打たれ強さはビルド1に及ばない。',
      },
      en: {
        label: 'Power first, healing shut down',
        when: 'When the enemy team leans on lifesteal or sustained healing',
        text: 'Savant\'s Wrath fourth and Sage\'s Tome fifth get magic attack online by 9,680G. The one differing item is Venomous Staff, bought last, cutting enemy healing and lifesteal by 35% for 2.5 seconds on hit. Saint arcana x10 brings the totals to +983 magic attack, +22.5% cooldown reduction and +20% movement speed. Max HP is +2950 with only +100 magic defense, so Ming trades durability for damage.',
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
        text: '1品目に700Gの抵抗の靴を置き、2品目の紅蓮のマントまでが2,740G。範囲375の燃焼が当たった敵は、HP回復とライフスティールが2.5秒間35%落ちます。蒼天の剣は4品目まで下がり、締めの覇者の重装が最大HP+4%と毎秒最大HPの0.5%回復を足す。合計は最大HP+5637・物理防御+883・魔法防御+520です。',
      },
      en: {
        label: 'Boots first, bulk after',
        when: 'When the enemy team leans on healing and lifesteal and you need to hold the front.',
        text: 'Boots of Resistance opens at 700G, and Blazing Cape lands by 2,740G. Enemies caught in its 375-radius burn lose 35% of their healing and lifesteal for 2.5 seconds. Pure Sky slips back to the fourth slot, and Overlord\'s Platemail closes the build with +4% max HP and 0.5% of max HP regenerated every second. Totals land at +5637 max HP, +883 physical defense and +520 magic defense.',
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
        label: '範囲の爆発を早めに持つ型',
        when: '敵にタンクやHPの多いヒーローが1体以下のとき',
        text: '2品目の残響の杖は、スキルが当たるたびに周りへ爆発を起こすので、ミニオンの列と敵をまとめて削れます。続くフローズンブレスとトワイライトストームはどちらもクールダウンを縮め、当てた相手の減速と、魔法防御貫通の積み上げを足します。アルカナは生贄でクールダウン短縮を補っているぶん、魔法防御貫通はビルド2より低めです。相手の現在HPを削る苦痛のマスクは最後に回るので、硬い相手への削りが立ち上がるのは後半になります。',
      },
      en: {
        label: 'Area explosions early',
        when: 'When the enemy has at most one tank or high-HP hero',
        text: 'Scepter of Reverberation comes second and sets off an explosion around every skill hit, so minion waves and enemies get chipped together. Frozen Breath and Twilight Stream follow; both cut cooldowns, one slowing whoever it hits and the other stacking magic pierce. The Tribute arcana cover cooldown reduction here, so magic pierce ends up lower than in build 2. Mask of Agony, which deals damage based on the target\'s current HP, comes last, so the damage against tough targets arrives late.',
      },
    },
    {
      ja: {
        label: '割合の削りを先に持つ型',
        when: '敵にタンクやHPの多いヒーローが2体以上いるとき',
        text: '2品目に苦痛のマスクを置き、スキルが当たるたびに相手の現在HPに応じた削りを入れます。HPの多い相手ほど削る量が増えるので、前衛が並ぶ相手にも早い時間から手応えが出ます。アルカナは心眼を10枠に振り、魔法防御を積んだ相手にもダメージを通しやすくしています。最後の夢魔の牙は、当てた敵のHP回復とライフスティールを落とす装備です。',
      },
      en: {
        label: 'Percent-HP damage first',
        when: 'When the enemy draft has two or more tanks or high-HP heroes',
        text: 'Mask of Agony comes second, adding damage based on the target\'s current HP to every skill hit. The more HP a target has, the more it takes, so this pays off early against a line of frontliners. All ten Mind\'s Eye arcana go into magic pierce, which helps damage get through enemies who stack magical defense. Venomous Staff closes the build and cuts the healing and lifesteal of anyone it hits.',
      },
    },
  ],
  // 瑶（Support／ROAM）
  '505': [
    {
      ja: {
        label: '回復をつなぎ、凍らせる型',
        when: '敵の魔法ダメージのヒーローが1体以下で、味方に回復役がいないとき',
        text: 'ビルド2との違いは2品だけです。1品目の極影の盾・星泉は範囲内の味方とリンクして、自分と味方の両方のHPとMPを回復しますが、攻撃したりされたりすると回復量が落ちます。4品目のフロストショックはアクティブで周りの敵を減速させてから凍らせられるので、味方に飛び込んできた敵の足を止めるのに使えます。',
      },
      en: {
        label: 'Linked healing and a freeze',
        when: 'When the enemy has one magical damage hero or none, and your team has no healer',
        text: 'Only two items differ from build 2. Crimson Shadow - Starspring comes first: it links her to a teammate in range and restores Health and Mana to both, though the healing drops when either of them attacks or is attacked. Frigid Charge in fourth has an active that slows and then freezes nearby enemies, which stops anyone diving onto your carry.',
      },
    },
    {
      ja: {
        label: '守りのオーラと魔法の盾の型',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '1品目をガーディアン・救済にすると、自分の物理防御と魔法防御を上げ、範囲内の味方にもその半分を配れます。アクティブの救援は、周りの味方にシールドを張ります。フロストショックの代わりに最後に魔女のマントを積むので、魔法防御が厚くなり、一定時間ごとに魔法ダメージを防ぐシールドも付きます。',
      },
      en: {
        label: 'Defense aura and a magic shield',
        when: 'When the enemy has two or more magical damage heroes',
        text: 'With Guardian - Redemption first, she raises her own physical and magical defense and shares half of it with teammates in range. Its active, Rescue, shields nearby teammates. Succubus Cloak goes last in place of Frigid Charge, adding thick magical defense and a shield against magical damage at regular intervals.',
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
        label: 'クリティカルと吸収で殴り続ける',
        when: '敵に物理ダメージのヒーローが少ないとき',
        text: '1品目の静謐の靴でクールダウン短縮を先に持ち、プレイヤースキルのクールダウンも縮めます。2〜4品目は、スパークダガー、ドゥームズデイ、シャドーブレードと攻撃速度の付く装備が続きます。5品目のエンドレスブレードがクリティカル効果を伸ばし、最後のブラッドエッジで物理ライフスティールを重ねて、殴りながらHPを戻せる形に仕上げます。スペルはピュリファイを持っていきます。',
      },
      en: {
        label: 'Crit and lifesteal to keep swinging',
        when: 'When the enemy team has few physical damage heroes',
        text: 'Boots of Tranquility come first, bringing cooldown reduction early and also shortening the cooldowns of Common Skills. Items two through four are Sparkforged Dagger, Doomsday and Shadow Ripper, all carrying Attack Speed. Eternity Blade, the fifth item, raises Critical Damage, and Bloodweeper closes the build with more physical lifesteal so Li Xin heals while he hits. The spell is Purify.',
      },
    },
    {
      ja: {
        label: '物理防御とHPで前に立つ型',
        when: '敵に物理ダメージのヒーローが多いとき',
        text: '1品目の忍びの靴で、物理防御と物理被ダメージの軽減を先に持ちます。4品目のブラッドレイジには、現在のHPを少しずつ失う代わりにシールドを張るアクティブが付きます。最後の不吉な予兆は、ダメージを受けると攻撃してきた相手の攻撃速度と移動速度を下げるので、物理で殴ってくる相手の手数を落とせます。スペルはビルド1のピュリファイではなくワープを選んでいます。',
      },
      en: {
        label: 'Defense and Health to hold the front',
        when: 'When the enemy team has many physical damage heroes',
        text: 'Boots of Fortitude come first, giving physical defense and reduced physical damage taken from the start. Blood Rage, the fourth item, has an active that slowly costs current Health in exchange for a shield. Ominous Premonition finishes the build; taking damage slows the attacker\'s Attack Speed and Movement Speed, which cuts down how often physical attackers can hit. The spell is Teleport instead of build 1\'s Purify.',
      },
    },
  ],
  // 伽羅（Marksman／FARM）
  '508': [
    {
      ja: {
        label: '吸収と復活で倒れにくくする型',
        when: '敵に飛び込みの得意なアサシンが2体以上いるとき',
        text: '速攻の靴、シャドーブレード、エンドレスブレード、威光の弓と、攻撃速度とクリティカルを先にそろえます。5品目のブラッドエッジは物理ライフスティールと最大HPを足し、最後の賢者の庇護は倒されても少しあとにその場で復活でき、物理防御と魔法防御も上がります。アルカナは隠匿と略奪を半分ずつにして、移動速度とライフスティールを分け合っています。',
      },
      en: {
        label: 'Lifesteal and a revive to stay alive',
        when: 'When the enemy has two or more assassins who like to dive',
        text: 'Boots of Dexterity, Shadow Ripper, Eternity Blade and Daybreaker\'s Virtue put attack speed and critical damage in place first. Bloodweeper in fifth adds physical lifesteal and max Health, and Sage\'s Sanctuary at the end revives her on the spot shortly after she falls while also raising physical and magical defense. The arcana split Stealth and Reaver evenly, sharing out movement speed and lifesteal.',
      },
    },
    {
      ja: {
        label: '妨害に耐えて回復を止める型',
        when: '敵に回復役がいて、妨害スキルの多いヒーローもいるとき',
        text: '抵抗の靴で耐性と魔法防御を持って入り、2品目のスパークダガーで通常攻撃に魔法ダメージを足します。スパークダガーは通常攻撃3回ごとに電撃も放つので、手数がそのまま削りになります。5品目のジャッジメントは当てた敵のHP回復とライフスティールを落とし、威光の弓は最後に回ります。アルカナは隠匿の全部と略奪の一部を狩猟に替え、攻撃速度と移動速度を足しています。',
      },
      en: {
        label: 'Hold up to crowd control, shut off healing',
        when: 'When the enemy has a healer and several heroes with heavy crowd control',
        text: 'Boots of Resistance bring Resistance and magical defense, and Sparkforged Dagger in second adds magical damage to her Basic Attacks. Sparkforged Dagger also fires chain lightning every third Basic Attack, so sheer volume of hits turns into damage. Mortal Punisher in fifth cuts the healing and lifesteal of anyone she hits, and Daybreaker\'s Virtue moves to the end. The arcana swap all of Stealth and part of Reaver for Hunt, adding attack speed and movement speed.',
      },
    },
  ],
  // 孫策（Fighter／CLASH）
  '510': [
    {
      ja: {
        label: '削りと減速を足す攻めの型',
        when: '味方にほかの前衛がいて、敵に妨害の多いヒーローがそろうとき',
        text: '抵抗の靴で耐性と魔法防御を持って入り、シャドーアックス、蒼天の剣、氷霜のグリップで物理攻撃とクールダウン短縮を重ねます。蒼天の剣はスキルが最初に当たった敵ヒーローを減速させ、受けるダメージも抑えます。氷霜のグリップはスキルのあとの通常攻撃に範囲の追加ダメージと減速を乗せるので、殴り合いの手数がそのまま削りになります。最後の砕星の槌で物理防御貫通を足し、スペルにはスタンを持ちます。',
      },
      en: {
        label: 'Offense with slows',
        when: 'When your team has another frontliner and the enemy has plenty of crowd control',
        text: 'Boots of Resistance bring Resistance and magical defense, then Axe of Torment, Pure Sky and Frostscar\'s Embrace stack physical attack and cooldown reduction. Pure Sky slows the first enemy hero hit by a skill and reduces the damage he takes. Frostscar\'s Embrace adds area damage and a slow to the Basic Attack after a skill, so every exchange of blows also wears the enemy down. Starbreaker at the end adds physical pierce, and the spell is Stun.',
      },
    },
    {
      ja: {
        label: '受け止めて燃やす守りの型',
        when: '味方の前衛が孫策だけのとき、または敵に物理ダメージのヒーローが多いとき',
        text: '忍びの靴で物理被ダメージを減らして入り、フロストショック、魔女のマント、スパイクアーマー、紅蓮のマントとHPと防御を重ねていきます。フロストショックはハードCCを受けたときにシールドを張り、アクティブでは周りの敵を減速させてから凍結させます。スパイクアーマーのアクティブは受けたダメージの一部を相手へ返し、紅蓮のマントは周りの敵を燃やしてHP回復とライフスティールを落とします。スペルはビルド1のスタンに代わって、ターミネートを持ちます。',
      },
      en: {
        label: 'Absorb and burn',
        when: 'When Sun Ce is your only frontliner, or the enemy has many physical damage heroes',
        text: 'Boots of Fortitude cut physical damage taken, and Frigid Charge, Succubus Cloak, Spikemail and Blazing Cape keep adding Health and defenses. Frigid Charge shields him when he is hit by hard crowd control, and its active slows nearby enemies before freezing them. Spikemail\'s active reflects part of the damage he takes, and Blazing Cape burns nearby enemies while cutting their healing and lifesteal. The spell is Execute instead of build 1\'s Stun.',
      },
    },
  ],
  // 上官婉児（Mage／MID）
  '513': [
    {
      ja: {
        label: '回復妨害と自己回復を先に',
        when: '敵に回復役やライフスティール持ちが複数いるとき',
        text: '2品目の夢魔の牙は、攻撃を当てた敵のHP回復とライフスティールを2.5秒間35%減らします。3品目の神喰らいの書で魔法ライフスティール24%が乗り、ここまで4,800G。魔法ライフスティール2%ごとにクールダウン短縮が1%増え、装備の12.5%に12%分が上乗せされる。ヴォイドスタッフは6品目に回り、最終形は魔法攻撃+1062、魔法防御貫通+88、最大HP+1250です。',
      },
      en: {
        label: 'Anti-heal and sustain first',
        when: 'When the enemy team has healers or heavy lifesteal.',
        text: 'Venomous Staff lands second, cutting healing and lifesteal on anything it hits by 35% for 2.5 seconds. Insatiable Tome follows for 24% magic lifesteal, 4,800G into the build. Every 2% of that lifesteal converts to 1% cooldown reduction, stacking 12% on top of the 12.5% the items list. Void Staff drops to the sixth slot, and the finished set reads +1062 magic attack, +88 magic penetration and +1250 max HP.',
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
        text: '2品目にスパークダガーを置き、2,740Gの時点で攻撃速度+35%と移動速度+7.5%が入る。通常攻撃3回ごとの電撃が160〜400の魔法ダメージを足すので、レーンを押し込みやすくなります。5品目のフロストショックは、制圧以外のハードCCを受けるたびに最大HPの10%のシールドを15秒ごとに張る。クールダウン短縮は合計13.5%、仕上がりは物理防御+603・最大HP+5487。',
      },
      en: {
        label: 'Attack speed first, shield for CC',
        when: 'When the enemy team is loaded with hard CC and you want early attack speed to push the lane.',
        text: 'Sparkforged Dagger goes second, so +35% attack speed and +7.5% movement speed are online at 2,740 gold. Every third basic attack arcs for 160-400 magic damage, which speeds up lane pressure. Frigid Charge in the fifth slot answers any hard CC other than suppression with a shield worth 10% of Allain\'s max health, once every 15 seconds. Cooldown reduction totals 13.5%, and the finished build reads +603 physical defense and +5,487 max health.',
      },
    },
    {
      ja: {
        label: '防御を先に固め、最後に攻撃も足す',
        when: '敵の物理火力が濃く、序盤から削られやすいレーンのとき',
        text: '2品目を紅蓮のマントにして、2,740Gで最大HP+1100と物理防御・魔法防御を+150ずつ先に固める。範囲375の燃焼が敵のHP回復とライフスティールを35%減少させるので、長い削り合いに強い。締めの猛攻の鎧で物理防御は合計+663、物理攻撃は+166となり、もう1本より60と35だけ高く仕上がります。被弾するたびに与ダメージと移動速度が最大10スタックまで伸びる。',
      },
      en: {
        label: 'Defense first, damage last',
        when: 'When enemy physical damage is heavy and the clash lane chips you down early.',
        text: 'Blazing Cape goes second here, locking in +1,100 max health plus +150 physical defense and +150 magic defense by 2,740 gold. Its 375-range burn cuts enemy health recovery and lifesteal by 35%, so drawn-out trades tilt Allain\'s way. Cuirass of Savagery closes the build at +663 physical defense and +166 physical attack, 60 and 35 above the other list. Every hit taken stacks up to 10 times for extra damage dealt and movement speed.',
      },
    },
  ],
  // 大司命（Fighter／JUNGLE）
  '517': [
    {
      ja: {
        label: 'ドゥームズデイで前衛を削る型',
        when: '敵に魔法ダメージのヒーローとHPの多い前衛がいるとき',
        text: 'ビルド2と違うのは、2品目の靴と4品目の2つです。2品目の抵抗の靴は魔法防御を多めに持ち、耐性も上げます。4品目のドゥームズデイは、通常攻撃に相手の追加HPに応じた物理ダメージを乗せるので、HPを積んだ前衛を殴るほど効きます。',
      },
      en: {
        label: 'Doomsday to wear down tanks',
        when: 'When the enemy team has magic damage heroes and a high-Health frontliner',
        text: 'Two slots differ from build 2: the boots in the second slot and the fourth item. Boots of Resistance carry more magical defense and raise Resistance. Doomsday, the fourth item, adds physical damage based on the target\'s extra Health to Basic Attacks, so it hits harder the more Health a frontliner stacks.',
      },
    },
    {
      ja: {
        label: 'ブラッドエッジで粘る型',
        when: '敵のダメージが物理に偏っているとき',
        text: 'ビルド1から、2品目の靴と4品目を入れ替えています。忍びの靴は物理防御を多めに持ち、物理被ダメージも減らします。4品目のブラッドエッジは物理ライフスティールを2つの効果で足すので、殴り合いながらHPを戻せます。',
      },
      en: {
        label: 'Bloodweeper to stay in fights',
        when: 'When the enemy team\'s damage leans physical',
        text: 'This swaps the boots and the fourth item from build 1. Boots of Fortitude carry more physical defense and reduce physical damage taken. Bloodweeper in the fourth slot adds physical lifesteal through two effects, so Augran can heal while he trades blows.',
      },
    },
  ],
  // 白龍（Marksman／FARM）
  '519': [
    {
      ja: {
        label: '抵抗の靴で守りを足す型',
        when: '敵に魔法ダメージのヒーローが多いとき',
        text: 'ビルド2との違いは2品目の靴だけで、残りの5品と買う順は同じです。抵抗の靴は物理防御と魔法防御を足し、耐性も上げます。魔法ダメージの多い相手と撃ち合うときに、この靴の守りが活きます。',
      },
      en: {
        label: 'Defensive boots with Resistance',
        when: 'When the enemy team has many magic damage heroes',
        text: 'The only difference from build 2 is the boots in the second slot; the other five items and the buy order are the same. Boots of Resistance add physical and magical defense and raise Resistance. That protection pays off when trading with heavy magic damage.',
      },
    },
    {
      ja: {
        label: '速攻の靴で手数を足す型',
        when: '敵に魔法ダメージのヒーローが少ないとき',
        text: '2品目を速攻の靴に替えた形で、ほかの装備はビルド1と変わりません。速攻の靴は攻撃速度を足し、通常攻撃のたびにHPを回復します。守りの代わりに、殴り続けるほどHPが戻る靴を選ぶ型になります。',
      },
      en: {
        label: 'Attack-speed boots that heal',
        when: 'When the enemy team has few magic damage heroes',
        text: 'Boots of Dexterity take the second slot, and every other item matches build 1. They add Attack Speed and restore Health on every Basic Attack. This trades defense for boots that heal Ao\'yin the longer he keeps hitting.',
      },
    },
  ],
  // 溟月（Mage／MID）
  '521': [
    {
      ja: {
        label: '狩猟9枠で移動速度を優先',
        when: '敵に接近戦を仕掛けるヒーローが多く、距離を保ち続けたいとき',
        text: '1品目に700Gの静謐の靴を置き、クールダウン短縮15%と移動速度50を最初から持ちます。2品目の夢魔の牙で魔法攻撃230と重傷を先に立て、敵のHP回復とライフスティールを35%削る。5品目の賢者の怒りが魔法攻撃を30%、6品目のヴォイドスタッフが魔法防御貫通を45%引き上げます。装備とアルカナの合計は魔法攻撃+1036.4で、狩猟9枠ぶんを含む移動速度+16.5%・攻撃速度+9%はビルド2を1%ずつ上回る。',
      },
      en: {
        label: 'Nine Hunt slots for mobility',
        when: 'When the enemy roster is full of divers and you need to hold your distance.',
        text: 'Boots of Tranquility come first at 700G, so the 15% cooldown reduction and 50 movement speed are online from the opening item. Venomous Staff follows for 230 magic attack and a passive that cuts enemy HP regen and lifesteal by 35%. Savant\'s Wrath then multiplies magic attack by 30% in slot five, and Void Staff adds 45% magic penetration in slot six. Items and arcana together come to 1,036.4 magic attack, +16.5% movement speed and +9% attack speed, and the nine Hunt slots put both speeds a point above build 2.',
      },
    },
    {
      ja: {
        label: '輪廻2枠でライフスティールを厚く',
        when: '敵の集中攻撃を受けやすく、レーンに長く居座りたいとき',
        text: '装備6品も買う順もビルド1と同じで、動かしたのはアルカナ1枠だけ。狩猟を1枠減らして輪廻を2枠に振り、魔法ライフスティール+26%と魔法攻撃+1038.8を確保します。4品目の神喰らいの書が魔法ライフスティール24%と最大HP750を足すので、輪廻の分もそこに上乗せされる。代わりに移動速度は+15.5%、攻撃速度は+8%とビルド1より1%ずつ低い数値です。',
      },
      en: {
        label: 'Two Reincarnation slots for sustain',
        when: 'When you are the focus of enemy pressure and want to hold the lane longer.',
        text: 'The six items and the buying order match build 1 exactly; only one arcana slot moves. Trading a Hunt slot for a second Reincarnation lifts magic lifesteal to +26% and magic attack to +1,038.8. Insatiable Tome, bought fourth, already carries 24% magic lifesteal and 750 max HP, so the extra point lands on top of that sustain. The trade-off is speed: +15.5% movement speed and +8% attack speed, a point under build 1 on each.',
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
        text: '2品目に夢魔の牙を置くので、2,740Gで敵のHP回復とライフスティールを35%下げる重傷が手に入る。以降は魔法攻撃の付く装備が並び、合計で魔法攻撃+1022、クールダウン短縮30%まで伸ばします。賢者の怒りが魔法攻撃を30%、ヴォイドスタッフが魔法防御貫通を45%上げる割合強化で、後半ほど効きが増す。最大HPは+1300止まりで、守りは移動速度+25%と、HP30%未満でCCを解除してシールドを張る灼熱の杖に任せます。',
      },
      en: {
        label: 'Raw magic attack and % penetration',
        when: 'When the enemy team leans on healing or lifesteal',
        text: 'Venomous Staff comes second, so the 35% cut to enemy healing and lifesteal is online at 2,740 gold. Every item after it carries magic attack, pushing the totals to +1022 magic attack and 30% cooldown reduction. Savant\'s Wrath adds 30% magic attack and Void Staff adds 45% magic penetration, percentage boosts that pay off more as the build fills out. Max HP stops at +1300, so safety rests on +25% movement speed and Ardent Dominion, which clears crowd control and grants a shield below 30% HP.',
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
        label: '魔法にも耐える締め方',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '4品目まではビルド2と同じで、どちらもスマイトで買えるグリードバイトから入ります。5品目の不吉な予兆はダメージを受けるたびに攻撃してきた相手の攻撃速度と移動速度を下げ、最後の破魔の霊刀は物理攻撃を保ったまま魔法防御を足します。魔法ダメージの多い相手に、攻撃を落としすぎずに守りを固める並びです。',
      },
      en: {
        label: 'Close out with magic defense',
        when: 'When the enemy has two or more magical damage heroes',
        text: 'The first four items match build 2, starting from Rapacious Bite, which needs Smite. Ominous Premonition in fifth cuts the attack speed and Movement Speed of whoever damages him, and Demonsbane at the end adds magical defense while keeping physical attack. Against heavy magical damage, it shores up defense without giving up too much attack.',
      },
    },
    {
      ja: {
        label: '削った敵を倒しきる締め方',
        when: '敵の魔法ダメージのヒーローが1体以下で、耐久の低い後衛が多いとき',
        text: '5品目の猛攻の鎧は、ダメージを受けるたびに与ダメージと移動速度が重なるので、乱戦に長くいるほど攻撃が重くなります。最後のグレートブレイカーはHPが半分を切った敵への与ダメージを上げる装備で、削った相手を倒しきる力が伸びます。魔法防御はビルド1より薄くなるため、魔法ダメージの少ない相手を選んで使います。',
      },
      en: {
        label: 'Close out wounded targets',
        when: 'When the enemy has one magical damage hero or none, and several fragile back-liners',
        text: 'Cuirass of Savagery in fifth stacks damage and Movement Speed every time he takes damage, so the longer he stays in a brawl the harder he hits. Overlord\'s Might at the end raises damage against enemies below half Health, making it easier to finish the targets he has worn down. Magical defense ends up lower than in build 1, so save it for drafts with little magical damage.',
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
        text: '3品目のシャドーブレード、4品目のエンドレスブレードでクリティカル率を先に40%積む。エンドレスブレードはクリティカル率2%ごとにクリティカル効果が1%増えるので、集めるほど一撃が伸びます。5品目のブラッドエッジで物理ライフスティール25%と最大HP+500を確保し、貫通を持つ威光の弓は6品目。装備とアルカナの合計はクリティカル率71%、物理攻撃+419とビルド2を135上回ります。',
      },
      en: {
        label: 'Stacked crit for bigger hits',
        when: 'When the enemy has one frontliner at most and you want their backline down fast.',
        text: 'Shadow Ripper third and Eternity Blade fourth put 40% crit rate up early. Eternity Blade turns every 2% crit rate into 1% more critical damage, so the earlier Agudo stacks rate, the harder each hit lands. Bloodweeper fifth adds 25% physical lifesteal and +500 max HP, and Daybreaker\'s Virtue with its penetration comes sixth. Gear and arcana finish at 71% crit rate and +419 physical attack, 135 more than build 2.',
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
        text: '2,780Gまでに極影の盾・救済と疾風の靴が揃い、移動速度+7.5%と靴の+70が同時に乗る。以降は覇者の重装・不死鳥の目・不吉な予兆で守りを重ね、合計は最大HP+7937、物理防御+593、魔法防御+270。救援のシールドは240〜480＋最大HPの10%なので、HPを積むほど味方に配れる量も厚くなります。魔法攻撃を持つ羽化の衣は最後の6品目で、ビルド2より4,040G遅い。',
      },
      en: {
        label: 'Frontline roam, 7,912 HP',
        when: 'When enemy damage is split between physical and magic, and you want to soak it up front.',
        text: 'The first 2,780G buy Crimson Shadow - Redemption and Boots of Deftness, so Sakeer carries +7.5% movement speed alongside the boots\' flat +70 early. Overlord\'s Platemail, Eye of the Phoenix and Ominous Premonition follow, taking the totals to +7,937 max HP, +593 physical defense and +270 magic defense. Redemption\'s shield is 240-480 plus 10% of max HP, so every HP item thickens what Sakeer hands to allies. Breakthrough Robe and its +130 magic attack land last, at 11,390G - 4,040G later than in build 2.',
      },
    },
    {
      ja: {
        label: '魔法防御貫通で削る支援型',
        when: '敵にタンクが2体以上いて、自分でも削りたいとき',
        text: '1品目のガーディアン・救済は自身の物理・魔法防御を65〜130上げ、範囲800以内の味方にも半分が届く。2,780G時点の秘法の靴で魔法防御貫通+60〜120、4品目に前倒しした羽化の衣がさらに最大150を足します。合計は最大HP+6487、魔法攻撃+450、クールダウン短縮+12.5%で、ビルド1よりHPは1450低く魔法攻撃は320高い。締めのフローズンブレスは、命中時に75〜150＋魔法攻撃の15%の魔法ダメージを3秒に1回上乗せする。',
      },
      en: {
        label: 'Magic-penetration support',
        when: 'When the enemy draft fields two or more tanks and you need to add damage yourself.',
        text: 'Guardian - Redemption opens with 65-130 physical and magic defense on Sakeer, and half of that aura reaches allies within 800 range. Boots of the Arcane bring 60-120 magic penetration by 2,780G, and Breakthrough Robe, moved up to the fourth slot, adds up to 150 more. Totals come to +6,487 max HP, +450 magic attack and 13.5% cooldown reduction - 1,450 less HP than build 1, but 320 more magic attack. Frozen Breath closes it out, adding 75-150 plus 15% of magic attack as magic damage on hit, once every 3 seconds.',
      },
    },
  ],
  // シャルロット（Fighter／CLASH）
  '536': [
    {
      ja: {
        label: '貫通で削り、物理攻撃に硬い',
        when: '敵に物理ダメージのヒーローが多く、前衛が硬いとき',
        text: '1品目の静謐の靴は700G、クールダウン短縮15%を先に握れる。装備4品で+45%、変異と鷹の目のアルカナで物理防御貫通は+100まで伸びます。ビルド2の貫通+36の2倍以上。締めの不死鳥の目と不吉な予兆で合計は最大HP+3450・物理防御+840、攻撃してきた相手の攻撃速度を2.5秒間20~40%落とします。',
      },
      en: {
        label: 'Pierce and physical defense',
        when: 'When the enemy team leans physical and you need to cut through a tanky front line.',
        text: 'Boots of Tranquility come first at 700G, locking in 15% cooldown reduction on the way to 45% across four items. Mutation and Eagle Eye arcana take physical pierce to +100, more than double Build 2\'s +36. Eye of the Phoenix and Ominous Premonition close things out, bringing the totals to +3450 max HP and +840 physical defense. Anything that damages Charlotte loses 20-40% attack speed for 2.5 seconds.',
      },
    },
    {
      ja: {
        label: '魔法防御とシールドで受け止める',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '1品目の抵抗の靴は700Gで、魔法防御100と耐性25%。クールダウン短縮は靴に付かず、装備3品と虚空10枠のアルカナで合計36%です。5品目の魔女のマントが15秒ごとに400~800の魔法ダメージシールドを張り、6品目の猛攻の鎧は被弾のたびに与ダメージを最大10スタックまで積む。魔法防御+400はビルド1の+180の2倍以上、最大HPも+3310まで伸びます。',
      },
      en: {
        label: 'Soak magic with resist and shields',
        when: 'When two or more enemy heroes deal magic damage.',
        text: 'Boots of Resistance open at 700G with 100 magic defense and 25% tenacity. Those boots carry no cooldown reduction, so three items and ten Void arcana bring the total to 36%. Succubus Cloak in the fifth slot throws a 400-800 magic damage shield every 15 seconds, and Cuirass of Savagery stacks bonus damage up to 10 times as Charlotte takes hits. Magic defense finishes at +400, more than double Build 1\'s +180, with max HP at +3310.',
      },
    },
  ],
  // デーヴァラ（Fighter／CLASH）
  '537': [
    {
      ja: {
        label: '攻撃速度を重ねて削る型',
        when: '敵の前衛に物理防御の高いタンクがいるとき',
        text: '2品目のスパークダガーで通常攻撃に魔法ダメージが乗り、3回ごとに電撃も出るようになります。続く暴風・ドゥームズデイ・サンセットチェイサー・威光の弓はどれも攻撃速度を持ちます。中でも暴風は、攻撃を当てるたびに攻撃速度とダメージが重なっていきます。最後の威光の弓で物理防御貫通が、アルカナの心眼で魔法防御貫通が加わるので、硬い前衛にも削りが通ります。スペルはピュリファイを持ちます。',
      },
      en: {
        label: 'Attack speed that keeps stacking',
        when: 'When the enemy has a tank with high physical defense in front',
        text: 'Sparkforged Dagger comes second, adding magical damage to Basic Attacks and chain lightning every third hit. Tempest, Doomsday, Sunchaser and Daybreaker\'s Virtue all carry attack speed, and Tempest stacks attack speed and damage with every hit. Daybreaker\'s Virtue adds physical pierce at the end and the arcana add magical pierce, so even a sturdy frontline takes real damage. The spell is Purify.',
      },
    },
    {
      ja: {
        label: 'HPと守りで殴り合う型',
        when: '敵に物理ダメージのヒーローやハードCCを持つヒーローが多いとき',
        text: '3品目からビルド1と分かれ、シャドーブレードのクリティカルで攻撃速度と移動速度を短く上げる形になります。5品目のフロストショックは制圧以外のハードCCを受けるとシールドを張り、アクティブで周りの敵を凍らせることもできます。最後のブラッドレイジは追加HPに応じた物理ダメージを通常攻撃に乗せるので、HPを積むほど攻撃も重くなります。アルカナは覇者で物理防御を足し、スペルはバーサークを持ちます。',
      },
      en: {
        label: 'Health and defense for brawling',
        when: 'When the enemy has many physical damage heroes or hard crowd control',
        text: 'The build splits from build 1 at the third item, where Shadow Ripper\'s critical hits briefly raise attack speed and Movement Speed. Frigid Charge in fifth grants a shield whenever hard crowd control other than suppression lands, and its active freezes nearby enemies. Blood Rage closes the build by adding physical damage based on extra Health to Basic Attacks, so more Health also means harder hits. The arcana switch to ones that add physical defense, and the spell is Frenzy.',
      },
    },
  ],
  // ユンエイ（Fighter／JUNGLE）
  '538': [
    {
      ja: {
        label: '防御を先に立て、締めに詰めの火力',
        when: '敵の主力が物理攻撃で、前衛と長く殴り合うとき',
        text: '3品目にドラゴンシールドを置き、4,900Gの時点で物理防御160と最大HP1350を確保。モンスターとミニオンにHPの7%の物理ダメージが乗り、半分はHPとして返ります。共通のシャドーアックスは4品目に下がり、物理防御貫通は6,990Gまで遅れる。締めのグレートブレイカー2540Gで、HP50%未満の敵への与ダメージが30%上がり、物理防御は合計+510に届きます。',
      },
      en: {
        label: 'Defense early, execute damage last',
        when: 'When the enemy\'s main damage is physical and you expect long trades against their frontline',
        text: 'Dragon\'s Rage goes third, so +160 physical defense and +1350 max HP are up by 4,900G. Its passive hits minions and monsters for 7% of their HP as physical damage and heals for half of that. Axe of Torment, which both builds run, drops to fourth, so its 90-180 physical penetration only lands at 6,990G. Overlord\'s Might closes at 2,540G for 30% extra damage against enemies under 50% HP, with physical defense totaling +510.',
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
        text: '2品目の抵抗の靴は700Gで物理防御50と魔法防御100が付き、耐性も25%増える。5品目のドラゴンシールドは最大HP1350を足し、敵ヒーローにHPの3.5%の物理ダメージも乗せます。合計は最大HP+2950、物理防御+210、魔法防御+180。物理攻撃はビルド1より80低い+308、攻撃速度も36.6%にとどまります。',
      },
      en: {
        label: 'Thicker defense and HP',
        when: 'When two or more enemies deal magic damage and you get focused in fights.',
        text: 'Boots of Resistance cost the same 700G but bring 50 physical defense, 100 magic defense and 25% more tenacity. Dragon\'s Rage lands fifth, adding 1,350 max HP plus a passive that deals 3.5% HP as physical damage to enemy heroes. Totals come to 2,950 max HP, 210 physical defense and 180 magic defense. Physical attack sits 80 lower at 308, and attack speed stops at 36.6%.',
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
        text: '2品目に暴風を置き、2,780Gの時点で最大HP+600と攻撃速度30%が入ります。シャドーブレードとエンドレスブレードは1品ずつ後ろにずれるので、アルカナは禍源10枠でクリティカル率71%まで補う。ブラッドエッジが最後の11,500Gまで来ない分、略奪5枠でライフスティールを8%先に持たせています。合計は攻撃速度120%、物理攻撃379、最大HP+1100。',
      },
      en: {
        label: 'Tempest second for early bulk',
        when: 'When you want to push the lane from the early game',
        text: 'Tempest goes second, so 2,780G already brings +600 max HP and 30% attack speed. Shadow Ripper and Eternity Blade each slide back a slot, so ten Calamity slots carry crit rate to 71%. Bloodweeper only lands at 11,500G, so five Reaver slots hold 8% physical lifesteal until then. Totals: 120% attack speed, 379 physical attack, +1,100 max HP.',
      },
    },
  ],
  // ルアンナ（Marksman／FARM）
  '547': [
    {
      ja: {
        label: 'HPと防御で前に残る型',
        when: '敵に物理ダメージで飛び込んでくるヒーローが多いとき',
        text: '忍びの靴で物理被ダメージを減らし、スパークダガーとドゥームズデイのあと、ディープフロスト、猛攻の鎧、ブラッドレイジとHPの付いた装備を重ねます。ディープフロストは当てた敵を減速させて追加ダメージを与え、猛攻の鎧はダメージを受けるたびに与ダメージと移動速度を上げます。ブラッドレイジのアクティブは、現在のHPを少しずつ失う代わりにシールドを張ります。スペルは、ビルド2のフラッシュに代わってバーサークを持ちます。',
      },
      en: {
        label: 'Health and defense to stay in front',
        when: 'When the enemy has many heroes who dive with physical damage',
        text: 'Boots of Fortitude cut physical damage taken, and after Sparkforged Dagger and Doomsday come Deepfrost Siege, Cuirass of Savagery and Blood Rage, all carrying Health. Deepfrost Siege slows and adds damage to enemies it hits, while Cuirass of Savagery raises her damage and movement speed each time she takes damage. Blood Rage\'s active trades a gradual loss of current Health for a shield. The spell is Frenzy instead of build 2\'s Flash.',
      },
    },
    {
      ja: {
        label: '攻撃速度とクリティカルで押す型',
        when: '敵の前衛が1体以下で、後衛を狙いやすいとき',
        text: '速攻の靴で攻撃速度を足して入り、2品目と3品目のスパークダガーとドゥームズデイはビルド1と同じです。4品目からマスターブレード、威光の弓、グレートブレイカーと攻めの装備が続き、防御の装備は入りません。マスターブレードはスキルを使うと移動速度を上げ、そのあとの通常攻撃に追加ダメージを乗せ、グレートブレイカーはHPが半分を切った敵へのダメージを増やします。スペルはフラッシュを持ちます。',
      },
      en: {
        label: 'Attack speed and crit to push the fight',
        when: 'When the enemy has one frontliner or fewer and their backline is easy to reach',
        text: 'Boots of Dexterity add attack speed, and Sparkforged Dagger and Doomsday in second and third match build 1. From the fourth slot, Master Sword, Daybreaker\'s Virtue and Overlord\'s Might are all offensive, with no defensive item at all. Master Sword raises her movement speed when she casts a skill and adds bonus damage to the Basic Attack that follows, and Overlord\'s Might increases damage to enemies below half Health. The spell is Flash.',
      },
    },
  ],
  // アタ（Tank／CLASH）
  '556': [
    {
      ja: {
        label: '物理防御963と反射で受ける型',
        when: '敵の主火力が物理で、殴り合いが長引くとき',
        text: '不吉な予兆を3品目に前倒しし、ダメージを受けると相手の攻撃速度が2.5秒間20〜40%落ちる。物理防御は合計+1053でビルド2より390高く、移動速度も+12.5%まで伸びます。5品目のスパイクアーマーは、3秒間だけ被ダメージの35%を確定ダメージで返す反射役。締めの永夜の守護は、2.5秒で最大HPの25%を削られると最大HPの10%を回復します。',
      },
      en: {
        label: 'Physical wall that hits back',
        when: 'When enemy damage is mostly physical and fights run long',
        text: 'Ominous Premonition comes third, cutting the attack speed of whoever damages Ata by 20-40% for 2.5 seconds. Physical defense stacks to +1053, 390 above the other build, and movement speed reaches +12.5%. Spikemail, bought fifth, spends three seconds returning 35% of incoming damage as true damage. Longnight Guardian closes the build, healing 10% of max HP whenever Ata loses 25% of it within 2.5 seconds.',
      },
    },
    {
      ja: {
        label: 'シールドと魔法防御を足した型',
        when: '敵に魔法火力が多く、自分から仕掛けたいとき',
        text: '3品目を不死鳥の目に、4品目をブラッドレイジに回し、不吉な予兆は5品目まで下げています。ブラッドレイジは物理攻撃+75を足し、アクティブで現在HPの30%と引き換えに最大HPの40%のシールドを4秒獲得する。締めの魔女のマントは15秒ごとに400〜800の魔法ダメージシールドを張り、魔法防御を合計+680まで伸ばします。最大HPは+6837でビルド1より400多く、物理防御は+663と390低い。',
      },
      en: {
        label: 'Shields and magic defense',
        when: 'When enemy damage leans magic and Ata wants to open the fight',
        text: 'Eye of the Phoenix takes the third slot and Blood Rage the fourth, pushing Ominous Premonition back to fifth. Blood Rage adds +75 physical attack, plus an active that trades 30% of current HP for a four-second shield worth 40% of max HP. Succubus Cloak finishes up with a 400-800 magic damage shield every 15 seconds, carrying magic defense to +680. Max HP lands at +6,837, 400 above build one, while physical defense sits 390 lower at +663.',
      },
    },
  ],
  // 影（Fighter／CLASH）
  '558': [
    {
      ja: {
        label: '砕星の槌で防御を抜く型',
        when: '敵に物理防御を積むタンクが2体以上いるとき',
        text: '忍びの靴、シャドーアックス、グレートブレイカーの位置は2本とも同じで、ビルド1は3品目にスパイクアーマーを置いて物理防御を先に固めます。スパイクアーマーのアクティブは、受けたダメージの一部を確定ダメージとして相手に返します。最後の砕星の槌は物理防御貫通を割合で上げるので、物理防御を積んだ相手にもダメージが通りやすくなります。スペルもビルド2と違い、ピュリファイを持ちます。',
      },
      en: {
        label: 'Starbreaker to cut through armor',
        when: 'When the enemy has two or more tanks stacking physical defense',
        text: 'Boots of Fortitude, Axe of Torment and Overlord\'s Might sit in the same slots in both builds; this one puts Spikemail third to lock in physical defense early. Spikemail\'s active, Countersiege, reflects part of the damage she takes back as true damage. Starbreaker closes the build and raises Physical Pierce by a percentage, so damage gets through enemies who stack physical defense. The spell also differs from build 2: this one takes Purify.',
      },
    },
    {
      ja: {
        label: '魔女のマントで魔法に備える型',
        when: '敵に魔法ダメージ役が2体以上いるとき',
        text: '3品目にディープフロストを繰り上げ、通常攻撃やスキルが当たった相手を減速させる効果と追加の物理ダメージを先に持ちます。スパイクアーマーは4品目に下がります。最後の1品は砕星の槌の代わりに魔女のマントで、魔法ダメージを防ぐシールドを一定の間隔で張り直します。スペルはワープを持ちます。',
      },
      en: {
        label: 'Succubus Cloak against magic',
        when: 'When the enemy has two or more magic damage dealers',
        text: 'Deepfrost Siege moves up to third, bringing its on-hit slow and bonus physical damage in earlier, and Spikemail drops to fourth. The last item is Succubus Cloak instead of Starbreaker, which renews a shield against magical damage at regular intervals. The spell is Teleport.',
      },
    },
  ],
  // ハイノ（Mage／MID）
  '563': [
    {
      ja: {
        label: '靴で耐性、貫通は戦闘中に重ねる',
        when: '敵に物理と魔法が混在し、靴の段階から耐性が欲しいとき',
        text: '1品目の抵抗の靴で、物理防御50・魔法防御100と耐性25%増を先に置く。4品目のトワイライトストームは、ヒーローにダメージを与えるたび4秒間、魔法防御貫通が20〜40増えます。最大6スタックまで重なるので、戦闘が続くほど貫通が積み上がる形。合計は魔法攻撃862、最大HP3500、クールダウン短縮31%まで伸びます。',
      },
      en: {
        label: 'Resistance boots, penetration that stacks in fights',
        when: 'When the enemy team mixes physical and magic damage and you want resistances from the first slot',
        text: 'Boots of Resistance opens the build with 50 physical defense, 100 magic defense and 25% added tenacity. In the fourth slot, Twilight Stream grants 20-40 magic penetration for 4 seconds each time you damage a hero, up to six stacks. It pays off in extended fights, where the stacks keep refreshing. Totals land at 862 magic attack, 3,500 max HP and 31% cooldown reduction.',
      },
    },
    {
      ja: {
        label: '靴で短縮、貫通は条件なしで常時',
        when: '敵が魔法防御を積み、短い接触で削り合う展開のとき',
        text: '1品目を静謐の靴にすると、700Gの時点でクールダウン短縮15%が入る。4品目の羽化の衣は、魔法防御貫通30〜60＋追加HPの3%（最大150まで）を発動条件なしで上乗せする。短い接触でも貫通が乗ります。総合計はクールダウン短縮36%・最大HP3900で、ビルド1より短縮5%・HP400ぶん高い。',
      },
      en: {
        label: 'Tranquility boots, penetration with no trigger',
        when: 'When enemies build magic defense and fights stay short and trade-heavy',
        text: 'The first slot goes to Boots of Tranquility: 15% cooldown reduction for 700 gold. In the fourth slot, Breakthrough Robe grants 30-60 magic penetration plus 3% of bonus HP, capped at 150, with no trigger condition attached. Short trades get the full value. Totals reach 36% cooldown reduction and 3,900 max HP, five points and 400 HP above build 1.',
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
        label: '攻撃速度を配り、物理を鈍らせる型',
        when: '敵に通常攻撃で戦うマークスマンや物理ファイターが多いとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にもその半分を配ります。4品目の不吉な予兆は、ダメージを受けるたびに攻撃してきた相手の攻撃速度と移動速度を下げるので、通常攻撃で殴ってくる相手ほど手が鈍ります。5品目のフローズンブレスは当てた相手を減速させ、追加の魔法ダメージも乗せます。',
      },
      en: {
        label: 'Share attack speed, slow attackers',
        when: 'When the enemy has several marksmen or physical fighters who fight with Basic Attacks',
        text: 'Crimson Shadow - Redemption comes first: it raises her attack speed and cooldown reduction and gives teammates in range half of the effect. Ominous Premonition in fourth cuts the attack speed and Movement Speed of whoever damages her, so enemies who rely on Basic Attacks slow down the most. Frozen Breath in fifth slows targets it hits and adds extra magical damage.',
      },
    },
    {
      ja: {
        label: '守りを配り、凍らせて止める型',
        when: '敵にハードCCを持つヒーローが多いとき',
        text: '1品目をガーディアン・救済にすると、味方に配るのは物理防御と魔法防御に変わります。4品目のフロストショックは制圧以外のハードCCを受けるとシールドを張り、アクティブで周りの敵を凍らせて足を止められます。最後の羽化の衣は追加HPに応じて魔法攻撃と魔法防御貫通が伸びるので、HPを積んだこの並びでも与えるダメージを保てます。',
      },
      en: {
        label: 'Share defense, freeze to hold',
        when: 'When the enemy has many heroes with hard crowd control',
        text: 'With Guardian - Redemption first, what she shares becomes physical and magical defense. Frigid Charge in fourth grants a shield when hard crowd control other than suppression lands, and its active freezes nearby enemies in place. Breakthrough Robe closes the build, adding magical attack and magical pierce based on extra Health, so this Health-heavy order still keeps her damage up.',
      },
    },
  ],
  // 元流の子（タンク）（Tank／CLASH）
  '581': [
    {
      ja: {
        label: '削りも持つクールダウン型',
        when: '味方に他の前衛がいて、自分も削りに回れるとき',
        text: '1品目は700Gの静謐の靴で、クールダウン短縮から先に立てます。3・4品目の氷霜のグリップとブラッドレイジに隠匿アルカナ10枠を足し、物理攻撃は+151。クールダウン短縮は合計+30%まで伸び、最大HPは+4887、物理防御は+863になります。ブラッドレイジは現在HPを徐々に30%失う代わりに、最大HPの40%のシールドを4秒張れる。',
      },
      en: {
        label: 'Cooldown-first bruiser tank',
        when: 'When another front-liner is already on your team and you can add damage yourself.',
        text: 'Boots of Tranquility open the build at 700G, so cooldown reduction lands before anything else. Frostscar\'s Embrace and Blood Rage come third and fourth, and with ten Stealth arcana they bring physical attack to +151. Cooldown reduction totals 31%, alongside +4887 max HP and +863 physical defense. Blood Rage gradually drains 30% of current HP in exchange for a shield worth 40% of max HP that lasts four seconds.',
      },
    },
    {
      ja: {
        label: 'HPと耐性だけを積む前衛型',
        when: '敵にハードCCが多く、前で耐え続けたいとき',
        text: '1品目の抵抗の靴で耐性を25%上げ、あとはHPと防御を積み続けます。3品目の覇者の重装で最大HPが4%増え、毎秒0.5%ずつ自動で回復する。5品目のフロストショックは、制圧以外のハードCCを受けると最大HPの10%のシールドを張ります。合計は最大HP+6687、物理防御+943、魔法防御+520で、ビルド1よりHPが1800多い。',
      },
      en: {
        label: 'Pure HP and tenacity wall',
        when: 'When the enemy team is stacked with hard CC and you have to hold the front.',
        text: 'Boots of Resistance start with 25% tenacity, and everything after is HP and defense. Overlord\'s Platemail at third raises max HP by 4% and regenerates 0.5% of it every second. Frigid Charge at fifth hands you a shield worth 10% of max HP whenever hard CC other than suppression lands on you. The totals reach +6687 max HP, +943 physical defense and +520 magic defense, 1800 more HP than the first build.',
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
        text: '3品目に2610Gの賢者の天書、4品目に賢者の怒りを置き、魔法攻撃を先に立てる買い方。賢者の怒りは魔法攻撃を30%増やすので、後から積む夢魔の牙とヴォイドスタッフの分まで一緒に伸びます。合計は魔法攻撃+1222でビルド1より350高く、締めのヴォイドスタッフが魔法防御貫通を45%増やす。1品目は貫通の付く秘法の靴ではなく移動速度70の疾風の靴で、戦闘から5秒離れるとさらに35~70が乗ります。',
      },
      en: {
        label: 'Stacking magic attack for the burst',
        when: 'When the enemy has at most one frontliner and fights are settled quickly',
        text: 'Sage\'s Tome at 2610G in slot three and Savant\'s Wrath in slot four put raw magic attack ahead of everything else. Savant\'s Wrath raises magic attack by 30%, so the Venomous Staff and Void Staff bought after it are worth more than their listed numbers. The total reaches +1222 magic attack, 350 above build 1, and Void Staff finishes by raising magic penetration 45%. Slot one is Boots of Deftness at 70 movement speed rather than the penetration boots, with another 35-70 after five seconds out of combat.',
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
        label: 'HPを吸いながら割合で削る型',
        when: '敵にHPの高い前衛が2体以上いるとき',
        text: '2品目の神喰らいの書は、魔法ダメージの一部をHPとして吸い、吸う量に応じてクールダウンも短くします。そのあと残響の杖と苦痛のマスクを続けて積むので、スキルが当たるたびに範囲の爆発と、相手の現在HPに応じた削りが重なります。苦痛のマスクの削りは相手のHPが多いほど大きくなるため、前衛が厚い相手ほどこの順番が生きます。最後は賢者の怒りと賢者の天書で、魔法攻撃をさらに伸ばして仕上げます。',
      },
      en: {
        label: 'Lifesteal plus percent-HP shred',
        when: 'When the enemy fields two or more high-HP frontliners',
        text: 'Insatiable Tome comes second: it turns part of his magic damage into healing and shortens cooldowns the more lifesteal he has. Scepter of Reverberation and Mask of Agony follow, so every skill hit adds an area explosion and damage based on the target\'s current HP. Mask of Agony\'s damage grows with the target\'s HP, so this order pays off most against thick frontliners. Savant\'s Wrath and Sage\'s Tome finish the build by pushing magic attack higher.',
      },
    },
    {
      ja: {
        label: '回復を止めてから吸う型',
        when: '敵にHP回復やライフスティールに頼るヒーローが多いとき',
        text: '2品目に夢魔の牙を置き、スキルや通常攻撃が当たった敵のHP回復とライフスティールを先に落とします。続くフローズンブレスは当てた相手を減速させるので、回復を止めた相手を逃がしにくくなります。神喰らいの書は4品目まで下がります。5品目のトワイライトストームはヒーローに当て続けるほど魔法防御貫通が重なるので、この並びは長く撃ち合う展開に向きます。',
      },
      en: {
        label: 'Shut off healing first',
        when: 'When several enemies rely on healing or lifesteal',
        text: 'Venomous Staff comes second, cutting the healing and lifesteal of any enemy hit by a skill or basic attack. Frozen Breath follows and slows whoever it hits, so a target whose healing is shut off has a harder time escaping. Insatiable Tome drops to fourth, but Twilight Stream in fifth keeps adding magic pierce as he keeps hitting heroes, which suits fights that drag on.',
      },
    },
  ],
  // アネット（Support／ROAM）
  '640': [
    {
      ja: {
        label: '救済のシールドと移動速度の型',
        when: '敵のバーストが強く、駆けつける足も欲しいとき',
        text: '1品目の極影の盾・救済は、範囲内の味方へ4秒間シールドを張るアクティブ。量は240〜480に最大HPの10%を足した値で、クールダウンは60秒です。2品目の疾風の靴で移動速度が70増え、戦闘から5秒離れるとさらに最大70上乗せされる。3品目以降はもう1本と同じ並びで、合計は最大HP+5887、クールダウン短縮+30%。',
      },
      en: {
        label: 'Redemption shield and early speed',
        when: 'When enemy burst is heavy and you need the speed to arrive in time',
        text: 'The opening buy, Crimson Shadow - Redemption, drops a 4-second shield on allies in range worth 240-480 plus 10% of max HP, on a 60-second cooldown. Boots of Deftness come second for 700G, adding 70 movement speed and up to 70 more once you have been out of combat for five seconds. Items three through six match the other build, so the totals land at +5887 max HP and 31% cooldown reduction.',
      },
    },
    {
      ja: {
        label: '星泉の回復とクールダウン短縮の型',
        when: '削り合いが続き、味方のHPとMPを支えたいとき',
        text: '1品目の極影の盾・星泉は、HPが最も低い味方とリンクして5秒間回復するアクティブ。回復量は500〜1060に最大HPの20%を足した値で、最大MPの25%も戻ります。敵ヒーローを攻撃するか攻撃を受けると効果は20%まで落ちるので、使いどころは戦闘の合間。2品目の静謐の靴でクールダウン短縮は46%に伸び、最大HPは+5587ともう1本より300低い。',
      },
      en: {
        label: 'Starspring healing and cooldowns',
        when: 'When trades drag on and the team needs HP and MP topped back up',
        text: 'Crimson Shadow - Starspring opens instead, linking to your lowest-HP ally and restoring 500-1060 plus 20% of max HP, along with 25% of max MP, over five seconds. The effect drops to 20% the moment you attack an enemy hero or take a hit from one, so the window for it sits between fights. Boots of Tranquility take the second slot, pushing cooldown reduction to 46% in total while max HP settles at +5587, three hundred under the other build.',
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
