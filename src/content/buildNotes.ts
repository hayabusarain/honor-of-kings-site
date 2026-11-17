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
        label: '回復阻害と足の速さを先に持つ型',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '2品目に夢魔の牙を置き、当てた敵のHP回復とライフスティールを早い時間から落とします。夢魔の牙は移動速度も足すので、前へ出る速さもビルド2より上です。5品目の賢者の怒りで魔法攻撃そのものを割合で伸ばし、最後のヴォイドスタッフで魔法防御を積んだ相手にも通るようにします。',
      },
      en: {
        label: 'Anti-healing and speed first',
        when: 'When the enemy has heroes who hold on with healing or lifesteal',
        text: 'Venomous Staff comes second, cutting the healing and lifesteal of enemies he hits from early on. It also adds movement speed, so he moves up faster than in build 2. Savant\'s Wrath, fifth, raises magic attack itself by a percentage, and Void Staff at the end lets his damage get through magical defense.',
      },
    },
    {
      ja: {
        label: '割合の削りと回転の速さを積む型',
        when: '敵の前衛が厚く、HPの多いヒーローが2体以上いるとき',
        text: '3品目の苦痛のマスクは、スキルが当たると相手の現在HPに応じた削りを重ねます。5品目の賢者の天書まで積むとクールダウン短縮も高くなり、スキルを撃つ回数が増えます。夢魔の牙を持たないぶん移動速度は控えめですが、最大HPが増えて硬さも上がります。',
      },
      en: {
        label: 'Percent damage and faster cycles',
        when: 'When the enemy front line is thick with two or more high-Health heroes',
        text: 'Mask of Agony, third, adds damage based on the target\'s current Health when a skill lands. With Sage\'s Tome in fifth, his cooldown reduction climbs and he casts more often. Without Venomous Staff his movement speed is lower, but the extra max Health makes him sturdier.',
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
        label: '貫通とライフスティールで粘る型',
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
        label: '回復減少を早め、減速も足す型',
        when: '敵にライフスティールや回復で粘るヒーローがいるとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にも半分を配ります。3品目に紅蓮のマントを置くので、燃焼で当てた敵のHP回復とライフスティールを落とす効果が早く入ります。5品目の不吉な予兆は、攻撃してきた相手の攻撃速度と移動速度を落とします。',
      },
      en: {
        label: 'Earlier anti-heal plus slows',
        when: 'When the enemy has heroes who hold on with lifesteal or healing',
        text: 'Crimson Shadow - Redemption comes first, raising his attack speed and cooldown reduction and giving allies in range half of the effect. Blazing Cape takes the third slot, so its burn cuts the healing and lifesteal of enemies early. Ominous Premonition, fifth, lowers the attack and movement speed of anyone who hits him.',
      },
    },
    {
      ja: {
        label: '防御オーラとシールドで支える型',
        when: '味方の後衛が狙われやすく、シールドを配りたいとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げ、範囲内の味方にも半分を配ります。3品目のサンライズケープは、敵ヒーローにダメージを与えると、自分と近くでHPがいちばん低い味方にシールドを張ります。紅蓮のマントは5品目に回るので、回復を落とす効果が入るのはビルド1より遅くなります。',
      },
      en: {
        label: 'Defense aura and shields',
        when: 'When your back line is likely to be targeted and you want to hand out shields',
        text: 'Guardian - Redemption comes first, raising his physical and magical defense and giving allies in range half of the effect. Dawnlight, third, shields him and the nearby ally with the lowest Health when he damages an enemy hero. Blazing Cape moves down to fifth, so its healing cut arrives later than in build 1.',
      },
    },
  ],
  // 劉禅（Support／ROAM）
  '114': [
    {
      ja: {
        label: 'HPを積んで自分でも削る型',
        when: '敵に回復に頼るヒーローが多く、前に出て自分からも削りたいとき',
        text: '1品目の極影の盾・閃光は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にも半分を配ります。3品目にシャドーアックスを置いて物理防御貫通を早めに持ち、4品目の紅蓮のマントで周りの敵を燃やしてHP回復とライフスティールを落とします。5品目のブラッドレイジは追加HPに応じたダメージを通常攻撃に乗せるので、HPを積むほど一撃が重くなります。スペルはピュリファイを持ちます。',
      },
      en: {
        label: 'Health that also deals damage',
        when: 'When the enemy has many heroes who rely on healing and you want to step up and chip yourself',
        text: 'Crimson Shadow - Radiance comes first, raising his attack speed and cooldown reduction and giving allies in range half of the effect. Axe of Torment moves up to third for early physical pierce, and Blazing Cape, fourth, burns nearby enemies and cuts their healing and lifesteal. Blood Rage, fifth, adds damage based on his extra Health to basic attacks, so the more Health he stacks, the harder each hit lands. The spell is Purify.',
      },
    },
    {
      ja: {
        label: '守りを固めて先頭に立ち続ける型',
        when: '敵に物理ダメージのヒーローが多く、集団戦で先頭に立ち続けたいとき',
        text: '1品目のガーディアン・星泉で、範囲内の味方とリンクしてHPを回復させる手段を持ちます。3品目のブリザードと5品目の不吉な予兆で物理防御を大きく積み、受けた攻撃に応じて相手を減速させます。最後の賢者の庇護は、倒されても少し待ってその場で復活できる装備です。スペルはフラッシュを持ちます。',
      },
      en: {
        label: 'Hold the front line',
        when: 'When the enemy has many physical damage heroes and you want to lead every teamfight',
        text: 'Guardian - Starspring comes first, giving him a way to link to an ally and heal them. Glacial Buckler, third, and Ominous Premonition, fifth, stack heavy physical defense and slow attackers when he takes hits. Sage\'s Sanctuary closes the build and lets him revive on the spot a moment after he falls. The spell is Flash.',
      },
    },
  ],
  // 漸離（Mage／MID）
  '115': [
    {
      ja: {
        label: '魔法攻撃と貫通を積みきる型',
        when: '敵が魔法防御を積みそうで、後衛を一度で落としたいとき',
        text: '秘法の靴と神喰らいの書で、魔法防御貫通と魔法ライフスティールを早く持ちます。3品目の灼熱の杖はHPが減るとかかっているCCを解除してシールドを張り、踏み込んだあとの保険になります。残りは賢者の怒り・賢者の天書・ヴォイドスタッフと魔法攻撃を積み、最後に魔法防御貫通を割合で上げます。',
      },
      en: {
        label: 'Magic attack and pierce all the way',
        when: 'When the enemy is likely to stack magical defense and you want to take down a back-liner in one go',
        text: 'Boots of the Arcane and Insatiable Tome bring early magic pierce and magical lifesteal. Ardent Dominion, third, removes crowd control and grants a shield when his Health drops, acting as insurance after diving in. The rest stacks magic attack with Savant\'s Wrath, Sage\'s Tome and Void Staff, raising magic pierce by a percentage at the end.',
      },
    },
    {
      ja: {
        label: 'HPと防御を先に持つ型',
        when: '敵に飛び込み役が多く、乱戦の中で長く残りたいとき',
        text: '3品目から時の預言と羽化の衣でHPと防御を足し、羽化の衣は追加HPに応じて魔法攻撃と魔法防御貫通も上げます。最後の巫術の杖は、スキルのあとの通常攻撃に魔法ダメージを上乗せします。魔法攻撃はビルド1より低くなります。',
      },
      en: {
        label: 'Health and defense first',
        when: 'When the enemy has many divers and he wants to stay alive inside brawls',
        text: 'From the third item, Augur\'s Word and Breakthrough Robe add Health and defense, and Breakthrough Robe also raises magic attack and magic pierce based on his extra Health. Staves of Sorcery at the end adds magical damage to the Basic Attack after a skill. His magic attack ends up lower than in build 1.',
      },
    },
  ],
  // 阿軻（Assassin／JUNGLE）
  '116': [
    {
      ja: {
        label: 'クリティカルと貫通で火力を伸ばす型',
        when: '自分から仕掛けて、後衛を1人ずつ落としに行きたいとき',
        text: 'グリードバイトと静謐の靴のあとは、残りの4品がすべて攻撃の装備です。エンドレスブレードとマスターブレードでクリティカル率を重ね、エンドレスブレードの効果でクリティカルのダメージも伸ばします。最後の砕星の槌で物理防御貫通を足すので、守りの装備を積んだ後衛にもダメージが通ります。',
      },
      en: {
        label: 'Crit and pierce',
        when: 'When you want to start fights yourself and pick off back-liners one by one',
        text: 'After Rapacious Bite and Boots of Tranquility, the remaining four items are all offensive. Eternity Blade and Master Sword stack critical rate, and Eternity Blade also raises critical damage. Starbreaker closes the build with physical pierce, so her damage gets through back-liners who buy defensive items.',
      },
    },
    {
      ja: {
        label: '守りを混ぜて殴り続ける型',
        when: '敵にハードCCが多く、集団戦で先に倒されたくないとき',
        text: 'ビルド1と同じなのはグリードバイトとシャドーアックスの2品だけで、2品目の靴を抵抗の靴にして耐性を足します。4品目から氷霜のグリップ・ドゥームズデイ・フロストショックと守りを混ぜ、HPと物理防御、ライフスティールを積みます。最後のフロストショックは制圧以外のハードCCを受けたときにシールドを張るので、止められても倒れにくくなります。',
      },
      en: {
        label: 'Mixed defense for longer brawls',
        when: 'When the enemy has a lot of hard crowd control and you don\'t want to fall first in teamfights',
        text: 'Only Rapacious Bite and Axe of Torment are shared with build 1; the boots become Boots of Resistance for Resistance. From the fourth slot, Frostscar\'s Embrace, Doomsday and Frigid Charge mix in defense, stacking Health, physical defense and lifesteal. Frigid Charge closes the build and shields her when she is hit by hard crowd control other than suppression, so she is harder to kill even when stopped.',
      },
    },
  ],
  // 鐘無艶（Fighter／CLASH）
  '117': [
    {
      ja: {
        label: '魔法防御と回復で前に立つ型',
        when: '敵の主な火力が魔法ダメージで、集団戦の前で粘りたいとき',
        text: '5品目のグレートブレイカーまでは2本とも同じ並びで、最後の1品を永夜の守護にします。永夜の守護は魔法防御とHPを足し、短い間に大きなダメージを受けるとHPを回復します。アルカナは隠匿で物理攻撃を少し足しています。',
      },
      en: {
        label: 'Magical defense and healing up front',
        when: 'When the enemy\'s main damage is magical and she wants to hold the front in teamfights',
        text: 'Both builds share the same order through Overlord\'s Might, fifth, and this one ends with Longnight Guardian. Longnight Guardian adds magical defense and Health and restores Health when she takes heavy damage in a short time. The Stealth arcana add a little physical attack.',
      },
    },
    {
      ja: {
        label: '貫通で硬い相手を削る型',
        when: '敵に物理防御の高いタンクやファイターが多いとき',
        text: '最後の1品を砕星の槌にして、物理防御貫通を割合で上げます。アルカナは狩猟で攻撃速度と移動速度を足しています。永夜の守護が無いぶん、魔法防御は靴の分だけになります。',
      },
      en: {
        label: 'Pierce against tough targets',
        when: 'When the enemy has many tanks or fighters with high physical defense',
        text: 'Starbreaker takes the last slot, raising physical pierce by a percentage. The Hunt arcana add attack speed and movement speed. Without Longnight Guardian, her magical defense comes only from her boots.',
      },
    },
  ],
  // 孫臏（Support／ROAM）
  '118': [
    {
      ja: {
        label: '防御を重ねて前に出る型',
        when: '敵に物理ダメージのヒーローが多く、前で味方を守りたいとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げて範囲内の味方にも半分を配り、アクティブで味方にシールドを張ります。3品目のサンライズケープは、敵ヒーローにダメージを与えると自分と近くの味方にシールドを張り、そのあとは不吉な予兆・魔女のマント・覇者の重装と守りを重ねます。',
      },
      en: {
        label: 'Stacked defense to step forward',
        when: 'When the enemy has many physical damage heroes and he wants to protect his team up front',
        text: 'Crimson Shadow - Redemption comes first, raising his attack speed and cooldown reduction, giving allies in range half of the effect, and shielding teammates with its active. Dawnlight, third, shields him and a nearby ally when he damages an enemy hero, and Ominous Premonition, Succubus Cloak and Overlord\'s Platemail stack defense after it.',
      },
    },
    {
      ja: {
        label: '回復のリンクとクールダウン短縮の型',
        when: '敵に回復やライフスティールに頼るヒーローがいて、味方のHPも戻したいとき',
        text: '1品目のガーディアン・星泉はアクティブで味方1人とつながり、しばらく双方のHPとMPを回復します。敵ヒーローを攻撃したり攻撃を受けたりすると回復は弱まります。3品目の聖杯でクールダウン短縮を足し、最後の夢魔の牙で当てた敵の回復も落とします。',
      },
      en: {
        label: 'Healing link and cooldown reduction',
        when: 'When the enemy has heroes who rely on healing or lifesteal and he wants to restore his team\'s Health',
        text: 'Guardian - Starspring comes first; its active links him to a teammate and restores both their Health and mana for a while. The healing weakens if either attacks or is hit by an enemy hero. Holy Grail, third, adds cooldown reduction, and Venomous Staff at the end cuts the healing of enemies he hits.',
      },
    },
  ],
  // 扁鵲（Mage／MID）
  '119': [
    {
      ja: {
        label: 'HPとクールダウン短縮で撃ち続ける型',
        when: '敵に飛び込み役が多く、前に出て撃ち続けたいとき',
        text: '静謐の靴と聖杯でクールダウン短縮を早く持ち、聖杯はHPとMPを時間で回復します。時の預言は物理防御と魔法防御を足し、羽化の衣は追加HPに応じて魔法攻撃と魔法防御貫通を上げます。最後の賢者の天書は魔法攻撃の量に応じてダメージと被ダメージ軽減を上げるので、火力と硬さの両方が伸びます。',
      },
      en: {
        label: 'Health and cooldown reduction to keep firing',
        when: 'When the enemy has many divers and you want to stay forward and keep firing',
        text: 'Boots of Tranquility and Holy Grail bring cooldown reduction early, and Holy Grail restores Health and mana over time. Augur\'s Word adds physical and magical defense, and Breakthrough Robe raises magic attack and magic pierce based on his extra Health. Sage\'s Tome closes the build, raising damage and damage reduction based on his magic attack, so both his damage and durability grow.',
      },
    },
    {
      ja: {
        label: '貫通を重ねて削る型',
        when: '敵に回復役やライフスティールを持つヒーローがいるとき',
        text: '1品目の秘法の靴で魔法防御貫通を早く持ち、3品目の夢魔の牙で当てた敵のHP回復とライフスティールを落とします。トワイライトストームは敵ヒーローにダメージを与えるたびに魔法防御貫通を積み上げ、最後のヴォイドスタッフが貫通を大きく上げます。最大HPはビルド1より低く、守りを削って貫通に回した並びです。',
      },
      en: {
        label: 'Stacking pierce to wear enemies down',
        when: 'When the enemy has healers or heroes with lifesteal',
        text: 'Boots of the Arcane bring magic pierce early, and Venomous Staff, third, cuts the healing and lifesteal of enemies he hits. Twilight Stream builds up magic pierce each time he damages an enemy hero, and Void Staff at the end raises pierce sharply. His max Health is lower than in build 1, trading defense for pierce.',
      },
    },
  ],
  // 白起（Tank／CLASH）
  '120': [
    {
      ja: {
        label: 'シールドと凍結を足す型',
        when: '敵にハードCCが多く、集団戦で足止めしたいとき',
        text: '6品のうち違うのは5品目だけで、残りの5品は買う順まで2本とも同じです。このビルドの5品目はフロストショックで、制圧以外のハードCCを受けるとシールドを張り、アクティブで周りの敵を凍らせます。クールダウン短縮もビルド2より多くなります。',
      },
      en: {
        label: 'Adding a shield and a freeze',
        when: 'When the enemy has a lot of hard crowd control and you want to hold them in teamfights',
        text: 'Only the fifth of the six items differs; the other five are bought in the same order in both builds. This build\'s fifth item is Frigid Charge, which grants a shield when hard crowd control other than suppression lands, and its active freezes nearby enemies. It also carries more cooldown reduction than build 2.',
      },
    },
    {
      ja: {
        label: 'HPと回復を伸ばす型',
        when: '敵に魔法ダメージのヒーローが多く、粘って耐えたいとき',
        text: '5品目を不死鳥の目にして、魔法防御とHPを足します。不死鳥の目はHPが減るほど回復効果が上がるので、覇者の重装の自動回復や永夜の守護の回復と合わせて、削られたあとほど効いてきます。HPと魔法防御はビルド1より厚い並びです。',
      },
      en: {
        label: 'More Health and healing',
        when: 'When the enemy has many magic damage heroes and you want to outlast them',
        text: 'Eye of the Phoenix takes the fifth slot, adding magical defense and Health. Eye of the Phoenix raises healing the more Health he has lost, so together with Overlord\'s Platemail\'s regeneration and Longnight Guardian\'s healing, it pays off more after he has been worn down. Health and magical defense are thicker than in build 1.',
      },
    },
  ],
  // ミーユエ（Mage／CLASH）
  '121': [
    {
      ja: {
        label: 'HPを積んで魔法攻撃を伸ばす型',
        when: '集団戦が長引きそうで、前に出て粘り続けたいとき',
        text: '4品目から羽化の衣・巫術の杖・時の預言と、魔法攻撃とHPを兼ねる装備を並べます。羽化の衣は追加HPに応じて魔法攻撃と魔法防御貫通を足し、時の預言は魔法攻撃に応じて物理防御と魔法防御を足します。靴以外に守りだけの装備は無く、HPと魔法攻撃を同時に伸ばす並びです。',
      },
      en: {
        label: 'Health that grows her magic attack',
        when: 'When fights are likely to drag on and you want to stay in front',
        text: 'From the fourth slot, Breakthrough Robe, Staves of Sorcery and Augur\'s Word all give both magic attack and Health. Breakthrough Robe adds magic attack and magic pierce based on her extra Health, and Augur\'s Word adds physical and magical defense based on her magic attack. Apart from the boots, there is no purely defensive item; the build grows Health and magic attack together.',
      },
    },
    {
      ja: {
        label: '通常攻撃と物理防御に寄せる型',
        when: '敵の主力が通常攻撃で戦う物理ヒーローのとき',
        text: '4品目のトワイライトストームは、ヒーローに当てるたびに魔法防御貫通を重ねます。5品目の不吉な予兆で物理防御を足し、攻撃してきた相手の攻撃速度と移動速度を落とします。6品目のシャドーブレードで攻撃速度とクリティカル率を足すので、魔法攻撃はビルド1より低いかわりに、通常攻撃の手数で戦えます。',
      },
      en: {
        label: 'Basic attacks and physical defense',
        when: 'When the enemy\'s main threats are physical basic attackers',
        text: 'Twilight Stream, fourth, stacks magic pierce each time she hits a hero. Ominous Premonition, fifth, adds physical defense and slows the attack and movement speed of anyone who hits her. Shadow Ripper, sixth, adds attack speed and critical rate, so she has less magic attack than in build 1 but more basic attacks to fight with.',
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
        label: '割合ダメージとHPを先に積む型',
        when: '敵にHPの高い前衛が多いとき',
        text: '3品目に苦痛のマスクを置き、スキルを当てた相手の現在のHPに応じた魔法ダメージを早く持ちます。続くフローズンブレスとトワイライトストームでクールダウン短縮とHPを重ね、魔法攻撃を大きく足す賢者の天書は最後の6品目まで待ちます。最大HPは2本のうちこちらが高くなります。',
      },
      en: {
        label: 'Percent damage and Health first',
        when: 'When the enemy has many high-Health frontliners',
        text: 'Mask of Agony comes third for early magical damage based on the current Health of enemies his skills hit. Frozen Breath and Twilight Stream follow with cooldown reduction and Health, and Sage\'s Tome, which adds a lot of magic attack, waits until sixth. This build has the higher max Health of the two.',
      },
    },
    {
      ja: {
        label: '魔法攻撃と貫通を先に持つ型',
        when: '敵に魔法防御を積みそうな前衛がいて、削りが通りにくいとき',
        text: '3品目に賢者の天書を繰り上げ、魔法攻撃を先に大きく足します。賢者の天書は魔法攻撃の量に応じてダメージと被ダメージ軽減も上げます。4品目のヴォイドスタッフで魔法防御貫通を割合で上げるので、魔法防御を積んだ相手にもダメージが通ります。',
      },
      en: {
        label: 'Magic attack and pierce first',
        when: 'When the enemy has frontliners likely to stack magical defense and damage is hard to get through',
        text: 'Sage\'s Tome moves up to third for a big early boost to magic attack. It also raises damage and damage reduction based on his magic attack. Void Staff, fourth, raises magic pierce by a percentage, getting damage through enemies who stack magical defense.',
      },
    },
  ],
  // 元歌（Assassin／CLASH）
  '125': [
    {
      ja: {
        label: '最後の1枠を守りで締める型',
        when: '集団戦で先に踏み込み、集中して狙われやすいとき',
        text: '5品目までは2本とも同じで、最後の1品が分かれます。このビルドは蒼天の剣で締め、物理攻撃と物理防御を足し、アクティブで少しの間受けるダメージを減らせます。踏み込んだ直後の反撃を、自分の操作でしのぐための1品です。',
      },
      en: {
        label: 'Closing on defense',
        when: 'When he engages first in teamfights and is likely to be focused',
        text: 'The first five items match in both builds; only the last differs. This one closes with Pure Sky, adding physical attack and physical defense, with an active that briefly reduces the damage he takes. It is the item for surviving the counterattack right after diving in through his own timing.',
      },
    },
    {
      ja: {
        label: '最後の1枠を削りと硬さに回す型',
        when: '敵の前衛が硬く、殴り合いが長引きそうなとき',
        text: '最後の1品を氷霜のグリップにして、物理防御をビルド1より厚くします。氷霜のグリップは、スキルのあとの通常攻撃に範囲の追加ダメージと減速を乗せます。',
      },
      en: {
        label: 'Closing on damage and toughness',
        when: 'When the enemy front line is tough and brawls are likely to drag on',
        text: 'Frostscar\'s Embrace takes the last slot, making his physical defense thicker than in build 1. Frostscar\'s Embrace adds area damage and a slow to the Basic Attack after a skill.',
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
        label: '回復阻害を早め、貫通で抜く型',
        when: '敵に回復役がいて、魔法防御を積む前衛も並ぶとき',
        text: '最初の3品は2本とも同じで、秘法の靴・フローズンブレス・苦痛のマスクで魔法防御貫通と削りを先に持ちます。このビルドは4品目に夢魔の牙を置くので、当てた敵のHP回復とライフスティールを早い時間から落とせます。5品目のヴォイドスタッフで、魔法防御を積んだ相手にもダメージが通るようになります。',
      },
      en: {
        label: 'Early anti-healing, then pierce',
        when: 'When the enemy has a healer and frontliners who stack magical defense',
        text: 'The first three items are the same in both builds: Boots of the Arcane, Frozen Breath and Mask of Agony bring magic pierce and steady damage early. This build places Venomous Staff fourth, so it cuts the healing and lifesteal of enemies she hits from earlier in the game. Void Staff, fifth, lets her damage get through enemies who stack magical defense.',
      },
    },
    {
      ja: {
        label: 'クールダウンと積み上げ貫通で撃ち続ける型',
        when: '敵に回復役が少なく、集団戦が長引きそうなとき',
        text: '4品目はトワイライトストームで、敵ヒーローにダメージを与え続けるほど魔法防御貫通が重なります。5品目に賢者の怒りが早く来るので、魔法攻撃そのものを割合で伸ばせる時期も、ビルド1より早まります。夢魔の牙は最後に回るため、回復を落とす効果が付くのは装備がそろってからです。',
      },
      en: {
        label: 'Cooldowns and stacking pierce',
        when: 'When the enemy has few healers and teamfights are likely to drag on',
        text: 'Twilight Stream comes fourth and stacks magic pierce the longer she keeps damaging enemy heroes. Savant\'s Wrath moves up to fifth, so magic attack itself rises by a percentage earlier than in build 1. Venomous Staff comes last, so its anti-healing only arrives once the build is complete.',
      },
    },
  ],
  // ファーティフ（Fighter／CLASH）
  '128': [
    {
      ja: {
        label: 'クールダウン短縮で手数を出す型',
        when: '敵にCCが少なく、序盤から手数で押したいとき',
        text: '静謐の靴から入り、シャドーアックス・氷霜のグリップ・蒼天の剣と重ねてクールダウン短縮を大きく積みます。3品目の氷霜のグリップは、スキルのあとの通常攻撃に範囲の追加ダメージと減速を乗せます。魔女のマントはビルド2より早い5品目で、一定時間ごとに魔法ダメージを防ぐシールドを張ります。',
      },
      en: {
        label: 'Cooldown reduction for more casts',
        when: 'When the enemy has little crowd control and you want to push with more casts from the start',
        text: 'Boots of Tranquility come first, and Axe of Torment, Frostscar\'s Embrace and Pure Sky stack heavy cooldown reduction on top. Frostscar\'s Embrace, third, adds area damage and a slow to the Basic Attack after a skill. Succubus Cloak comes fifth, earlier than in build 2, periodically granting a shield against magic damage.',
      },
    },
    {
      ja: {
        label: '抵抗の靴で耐性を先に持つ型',
        when: '敵にCCが多く、前で殴り合いたいとき',
        text: '1品目の抵抗の靴で、物理防御と魔法防御に加えて耐性を上げます。ドゥームズデイは5品目に繰り上がり、物理ライフスティールで回復しながら殴れるようになるのがビルド1より早くなります。防御の合計は、ビルド1より厚い並びです。',
      },
      en: {
        label: 'Boots of Resistance first',
        when: 'When the enemy has a lot of crowd control and you want to brawl up front',
        text: 'Boots of Resistance come first, adding Resistance on top of physical and magical defense. Doomsday moves up to fifth, so he starts healing through physical lifesteal earlier than in build 1. His total defense is thicker than in build 1.',
      },
    },
  ],
  // 典韋（Fighter／JUNGLE）
  '129': [
    {
      ja: {
        label: '削りと軽減を両方持つ型',
        when: '敵の火力が物理ダメージに寄っているとき',
        text: '5品目までの並びは2本とも同じで、違うのは最後の1品だけです。このビルドは蒼天の剣を置き、スキルが最初に当たった敵ヒーローを減速させて、受けるダメージを抑えます。アクティブでもしばらく受けるダメージを減らせるので、攻めの手を落とさずに前へ出られます。',
      },
      en: {
        label: 'Damage and damage reduction',
        when: 'When the enemy\'s damage leans physical',
        text: 'The first five items are the same in both builds; only the last one differs. This build ends with Pure Sky, which slows the first enemy hero his skills hit and reduces the damage he takes. Its active also cuts incoming damage for a short time, so he can step forward without giving up offense.',
      },
    },
    {
      ja: {
        label: 'HPと魔法防御で居座る型',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '5品目までの並びはビルド1と同じで、最後の1品が魔女のマントに変わります。最大HPと魔法防御が大きく伸び、一定の間隔で魔法ダメージを防ぐシールドも張られます。蒼天の剣の攻撃力とクールダウン短縮を手放すかわりに、魔法の削りに耐えて殴り合いに残れる形です。',
      },
      en: {
        label: 'Health and magical defense',
        when: 'When the enemy has two or more magic damage heroes',
        text: 'The first five items match build 1, and the last becomes Succubus Cloak. His max Health and magical defense rise sharply, and it periodically gives him a shield against magical damage. He gives up Pure Sky\'s attack and cooldown reduction in exchange for lasting through magic damage in a brawl.',
      },
    },
  ],
  // 宮本武蔵（Fighter／JUNGLE）
  '130': [
    {
      ja: {
        label: '魔法に耐えて殴り続ける型',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: 'グリードバイトとシャドーアックス、氷霜のグリップは2本とも同じで、このビルドは2品目に抵抗の靴を置いて魔法防御と耐性を足します。5品目の蒼天の剣はスキルが最初に当たった敵ヒーローを減速させ、受けるダメージを抑えます。最後のブラッドエッジでスキルからもHPを吸えるので、殴り合いの中でHPを戻しながら前に居座れます。',
      },
      en: {
        label: 'Hold out against magic and keep hitting',
        when: 'When the enemy has two or more magic damage heroes',
        text: 'Rapacious Bite, Axe of Torment and Frostscar\'s Embrace are shared by both builds; this one adds Boots of Resistance second for magical defense and Resistance. Pure Sky, fifth, slows the first enemy hero his skills hit and reduces the damage he takes. Bloodweeper finishes the build and lets his skills heal him too, so he can recover mid-brawl and hold his ground.',
      },
    },
    {
      ja: {
        label: 'HPを積んで火力に変える型',
        when: '敵の前衛にHPの多いタンクがいるとき',
        text: '2品目を静謐の靴にして、クールダウン短縮を先に足します。5品目のドラゴンシールドは敵ヒーローに当てるとそのHPの一部を削るので、HPの多い相手ほど効いてきます。最後のブラッドレイジは自分の追加HPに応じたダメージを通常攻撃に乗せ、アクティブでHPと引き換えに大きなシールドを張れます。',
      },
      en: {
        label: 'Turn Health into damage',
        when: 'When the enemy frontline has a high-Health tank',
        text: 'Boots of Tranquility come second, adding cooldown reduction early. Dragon\'s Rage, fifth, takes a share of an enemy hero\'s Health when he hits them, so it matters more against bulky targets. Blood Rage closes the build, adding damage based on his extra Health to basic attacks, and its active trades Health for a large shield.',
      },
    },
  ],
  // 李白（Assassin／JUNGLE）
  '131': [
    {
      ja: {
        label: '回復封じと減速を足す型',
        when: '敵に回復やライフスティールを持つヒーローがいるとき',
        text: '3品目のシャドーアックスまではビルド2と同じで、違うのは4品目と5品目です。4品目のジャッジメントは当てた敵のHP回復とライフスティールを落とし、自分のHPが減ったときには時間をかけて回復します。5品目のディープフロストは命中した敵の足を鈍らせ、追加の物理ダメージも乗せます。',
      },
      en: {
        label: 'Adding anti-heal and slows',
        when: 'When the enemy has heroes with healing or lifesteal',
        text: 'Everything through Axe of Torment, third, matches build 2; only the fourth and fifth items differ. Mortal Punisher, fourth, cuts the healing and lifesteal of enemies he hits and restores his Health over time when it drops low. Deepfrost Siege, fifth, slows enemies he hits and adds extra physical damage.',
      },
    },
    {
      ja: {
        label: '暴風の重ねがけとHPで居座る型',
        when: '乱戦が長引きそうなとき',
        text: '4品目の暴風は、通常攻撃やスキルを当てるたびに攻撃速度・移動速度・ダメージが少しずつ上がり、上限まで重なります。5品目のブラッドエッジは物理ライフスティールを足し、スキルによる物理ライフスティールも上げます。最大HPはビルド1より多く、前に出て殴り合い続ける並びです。',
      },
      en: {
        label: 'Tempest stacks and Health to stay in',
        when: 'When brawls are likely to drag on',
        text: 'Tempest, fourth, raises attack speed, movement speed and damage a little each time his basic attacks or skills hit, up to a cap. Bloodweeper, fifth, adds physical lifesteal and boosts lifesteal from skill damage. His max Health is higher than in build 1, suited to staying forward and trading blows.',
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
        label: '攻撃速度と貫通で殴り続ける型',
        when: '敵の前衛が物理防御を積んでくるとき',
        text: '速攻の靴から入り、通常攻撃のたびにHPを少し戻しながら攻撃速度を足します。4品目の威光の弓は遠距離型ヒーローだと効果が2倍になり、物理防御貫通と通常攻撃のダメージが大きく伸びます。守りの装備は5品目の魔女のマントだけで、HPの粘りは2品目のドゥームズデイのライフスティールに任せる形になります。',
      },
      en: {
        label: 'Attack speed and pierce',
        when: 'When the enemy frontline stacks physical defense',
        text: 'Boots of Dexterity come first, adding Attack Speed and a little healing on every basic attack. Daybreaker\'s Virtue, fourth, has doubled effects on ranged heroes, so his physical pierce and basic attack damage rise sharply. Succubus Cloak, fifth, is his only defensive item, and staying healthy is left to Doomsday\'s lifesteal from the second slot.',
      },
    },
    {
      ja: {
        label: '防御を固めて殴り合う型',
        when: '敵に瞬間火力の高いヒーローが複数いて、狙われやすいとき',
        text: '1品目の忍びの靴で物理防御を足し、受ける物理ダメージも減らします。4品目のディープフロストは当てた相手を減速させ、間隔を空けて追加のダメージを与えます。5品目の不吉な予兆と6品目の魔女のマントで物理と魔法の両方の守りを固めるので、攻撃速度はビルド1より低いかわりに、狙われても倒れにくくなります。',
      },
      en: {
        label: 'Defensive brawler',
        when: 'When the enemy has several high-burst heroes likely to target you',
        text: 'Boots of Fortitude come first, adding physical defense and reducing physical damage taken. Deepfrost Siege, fourth, slows whoever it hits and periodically adds extra damage. Ominous Premonition and Succubus Cloak in the last two slots cover both physical and magical defense, so this version attacks slower than build 1 but is harder to kill when focused.',
      },
    },
  ],
  // 達磨（Fighter／CLASH）
  '134': [
    {
      ja: {
        label: '貫通と硬さを同時に積む前衛',
        when: '敵に物理防御の高い前衛が多く、殴り合って残りたいとき',
        text: '1品目の抵抗の靴で耐性と魔法防御を先に持ち、2品目のシャドーアックスで物理防御貫通とHPを足します。3品目の氷霜のグリップと4品目の蒼天の剣で物理防御を重ねてから、5品目の砕星の槌で物理防御貫通を割合で上げます。最後の破魔の霊刀は、物理攻撃に応じた魔法防御を上乗せします。',
      },
      en: {
        label: 'Pierce and toughness together',
        when: 'When the enemy has many frontliners with high physical defense and he wants to brawl and survive',
        text: 'Boots of Resistance come first for early Resistance and magical defense, and Axe of Torment, second, adds Physical Pierce and Health. Frostscar\'s Embrace, third, and Pure Sky, fourth, stack physical defense before Starbreaker, fifth, raises Physical Pierce by a percentage. Demonsbane at the end adds magical defense based on his physical attack.',
      },
    },
  ],
  // 項羽（Tank／CLASH）
  '135': [
    {
      ja: {
        label: '貫通を積んで硬い前衛を削る型',
        when: '敵の前衛が硬く、殴り合いで削りきりたいとき',
        text: '抵抗の靴から入り、2品目のシャドーアックスで物理防御貫通を早めに持ちます。3品目の氷霜のグリップは、スキルを使ったあとの通常攻撃で周りの敵に追加のダメージと減速を与えます。5品目のグレートブレイカーはHPが半分を切った敵へのダメージを増やすので、削った前衛を倒しきる力が上がります。HPを大きく伸ばすのはフロストショックと魔女のマントで、残りは攻撃と貫通に寄せた並びです。',
      },
      en: {
        label: 'Pierce for tough frontliners',
        when: 'When the enemy frontline is tough and you want to win the brawl',
        text: 'Boots of Resistance come first, and Axe of Torment, second, brings physical pierce early. Frostscar\'s Embrace, third, adds damage and a slow around him on the basic attack after a skill. Overlord\'s Might, fifth, increases damage against enemies below half Health, so worn-down frontliners are easier to finish. Frigid Charge and Succubus Cloak carry most of the added Health; the rest leans toward attack and pierce.',
      },
    },
    {
      ja: {
        label: 'ローム装備で味方ごと守る型',
        when: '敵の火力が物理と魔法の両方にあり、集団戦が長引きそうなとき',
        text: '1品目に靴ではなくローム専用のガーディアン・救済を置き、自分の物理防御と魔法防御を上げて、範囲内の味方にも半分を配ります。以降は守りの装備だけを重ね、4品目の永夜の守護で、短い間に大きく削られたときにHPを戻す効果を足します。攻撃の装備を1つも積まないので、仕事は前に立って敵の攻撃を受けることに絞られます。',
      },
      en: {
        label: 'Roaming item that protects the team',
        when: 'When the enemy deals both physical and magical damage and fights are likely to drag on',
        text: 'Instead of boots, the roam-only Guardian - Redemption comes first, raising his physical and magical defense and giving allies in range half of the effect. Every item after it is defensive, and Longnight Guardian, fourth, adds healing when he takes a lot of damage in a short time. With no offensive items at all, his job narrows to standing in front and absorbing the enemy\'s attacks.',
      },
    },
  ],
  // 司馬懿（Assassin／JUNGLE）
  '137': [
    {
      ja: {
        label: 'HPと貫通を厚くするアルカナの型',
        when: '敵に物理ダメージのヒーローが多く、HPを厚めにしておきたいとき',
        text: '装備の顔ぶれも買う順も2本とも同じで、違うのはアルカナだけです。1品目のルーンソードはモンスターを倒すたびに魔法攻撃を積み、2品目の秘法の靴で魔法防御貫通を持ちます。このビルドはアルカナに宿命を混ぜて、最大HPと物理防御を少し足しています。',
      },
      en: {
        label: 'Arcana for Health and pierce',
        when: 'When the enemy has many physical damage heroes and you want a bit more Health',
        text: 'Both builds share the same items in the same order; only the arcana differ. Runeblade, first, builds magic attack with every monster kill, and Boots of the Arcane, second, bring magic pierce. This build mixes Fate into the arcana for a little more max Health and physical defense.',
      },
    },
    {
      ja: {
        label: '魔法攻撃に寄せるアルカナの型',
        when: '敵が魔法防御をあまり積まず、魔法攻撃を伸ばしたいとき',
        text: '装備はビルド1と同じで、アルカナを凶兆中心に組み替えて魔法攻撃へ寄せています。そのぶん最大HPと魔法防御貫通は、ビルド1より少し下がります。4品目の巫術の杖は、スキルを使ったあとの通常攻撃に追加ダメージを乗せます。',
      },
      en: {
        label: 'Arcana for magic attack',
        when: 'When the enemy does not stack much magical defense and you want more magic attack',
        text: 'The items match build 1, and the arcana shift toward Omen for more magic attack. Max Health and magic pierce end up slightly lower than in build 1. Staves of Sorcery, fourth, adds damage to the basic attack after a skill.',
      },
    },
  ],
  // 孔子（Fighter／CLASH）
  '139': [
    {
      ja: {
        label: '通常攻撃で硬い敵を削る型',
        when: '敵にHPの高い前衛が多いとき',
        text: '1品目のスパークダガーと速攻の靴で、攻撃速度と移動速度を序盤から持ちます。4品目の魔女のマントで魔法防御がビルド2より早くそろい、最後のドゥームズデイが通常攻撃に相手の追加HPに応じたダメージを上乗せします。違いは4品目からの並びと最後の1品です。',
      },
      en: {
        label: 'Basic Attacks to wear down tough enemies',
        when: 'When the enemy has many high-Health frontliners',
        text: 'Sparkforged Dagger first and Boots of Dexterity bring attack speed and movement speed from the start. Succubus Cloak, fourth, gets his magical defense in place earlier than build 2, and Doomsday at the end adds damage based on the target\'s extra Health to his Basic Attacks. The differences are the order from the fourth item and the last item.',
      },
    },
    {
      ja: {
        label: 'シールドと硬さで前に残る型',
        when: '敵の主な火力が物理ダメージで、集団戦で前に立ち続けたいとき',
        text: '3品目までは同じで、4品目に蒼天の剣を繰り上げて物理攻撃と物理防御を早く足します。最後のサンライズケープは、敵ヒーローにダメージを与えると、自分と近くでHPがいちばん低い味方にシールドを張ります。クールダウン短縮と物理防御はビルド1より多い並びです。',
      },
      en: {
        label: 'Shields and toughness to stay up front',
        when: 'When the enemy\'s main damage is physical and he needs to stay in front through teamfights',
        text: 'The first three items match, and Pure Sky moves up to fourth for earlier physical attack and physical defense. Dawnlight at the end shields him and the nearby ally with the lowest Health when he damages an enemy hero. This build carries more cooldown reduction and physical defense than build 1.',
      },
    },
  ],
  // 関羽（Fighter／CLASH）
  '140': [
    {
      ja: {
        label: '守りを固めて前で粘る型',
        when: '敵に物理ダメージのヒーローが多く、前で受け続けたいとき',
        text: '1品目の忍びの靴で物理被ダメージを減らし、2品目の紅蓮のマントで燃焼を周りに撒いて、当たった敵の回復とライフスティールを落とします。そのあとも永夜の守護と不吉な予兆まで守りの装備を重ね、物理攻撃はほとんど足しません。削るより、前で受けきることに寄せた並びです。',
      },
      en: {
        label: 'Full defense to hold the front',
        when: 'When the enemy has many physical damage heroes and he wants to keep absorbing hits up front',
        text: 'Boots of Fortitude reduce physical damage taken, and Blazing Cape, second, spreads a burn that cuts the healing and lifesteal of enemies it hits. Defensive items continue through Longnight Guardian and Ominous Premonition, adding almost no physical attack. This build is about absorbing damage up front rather than wearing enemies down.',
      },
    },
    {
      ja: {
        label: '貫通を重ねて硬い前衛を削る型',
        when: '敵に物理防御の高い前衛が多いとき',
        text: '2品目の猛攻の鎧に3品目のシャドーアックスを重ね、物理攻撃と物理防御貫通を早く持ちます。5品目の砕星の槌で貫通を割合でも上げ、最後の魔女のマントで魔法防御と、一定時間ごとの魔法ダメージを防ぐシールドを足します。物理防御はビルド1より低くなります。',
      },
      en: {
        label: 'Stacking pierce against tough frontliners',
        when: 'When the enemy has many frontliners with high physical defense',
        text: 'Cuirass of Savagery, second, and Axe of Torment, third, bring physical attack and physical pierce early. Starbreaker, fifth, raises pierce by a percentage too, and Succubus Cloak at the end adds magical defense and a periodic shield against magic damage. His physical defense is lower than in build 1.',
      },
    },
  ],
  // 貂蝉（Mage／MID）
  '141': [
    {
      ja: {
        label: 'HPを火力に変えて居座る型',
        when: '敵に魔法ダメージのヒーローが多く、殴り合いに残りたいとき',
        text: '抵抗の靴・聖杯・神喰らいの書で、魔法防御とMPの回復、魔法ダメージからのHP吸収を先に持ちます。4品目の羽化の衣は追加HPに応じて魔法攻撃と魔法防御貫通を足すので、HPを積むほど火力も上がります。スペルはピュリファイを持ちます。',
      },
      en: {
        label: 'Turn Health into damage and stay',
        when: 'When the enemy has many magic damage heroes and you want to stay in the brawl',
        text: 'Boots of Resistance, Holy Grail and Insatiable Tome bring magical defense, mana regeneration and lifesteal from magic damage first. Breakthrough Robe, fourth, adds magic attack and magic pierce based on her extra Health, so stacking Health also raises her damage. The spell is Purify.',
      },
    },
    {
      ja: {
        label: 'クールダウンを縮めて撃ち続ける型',
        when: '敵に飛び込み役が多く、無効化を挟みながら撃ち続けたいとき',
        text: '静謐の靴と聖杯の2品でクールダウン短縮を大きく持ち、スキルを短い間隔で撃てます。4品目のトワイライトストームはヒーローを削るほど魔法防御貫通が重なり、5品目のムーンライトスタッフはアクティブで少しの間すべての効果を受けなくなります。動けなくなる代わりに、飛び込みの攻撃をやり過ごせる装備です。スペルはワープを持ちます。',
      },
      en: {
        label: 'Lower cooldowns and keep casting',
        when: 'When the enemy has many divers and you want to keep casting with an immunity window in reserve',
        text: 'Boots of Tranquility and Holy Grail alone bring heavy cooldown reduction, so she casts at short intervals. Twilight Stream, fourth, stacks magic pierce as she damages heroes, and Splendor, fifth, has an active that makes her immune to all effects for a moment. She cannot move while it is active, but it lets her wait out a dive. The spell is Teleport.',
      },
    },
  ],
  // アンジェラ（Mage／MID）
  '142': [
    {
      ja: {
        label: '範囲の爆発とライフスティールを足す型',
        when: '敵に回復やライフスティールで粘るヒーローがいないとき',
        text: '靴・賢者の怒り・ヴォイドスタッフ・賢者の天書の4品は2本とも同じで、違うのは2品目と4品目です。このビルドの2品目は残響の杖で、スキルが当たると周りに爆発を起こすので、ミニオンの列と敵をまとめて削れます。4品目の神喰らいの書は魔法ライフスティールを足し、その値に応じてクールダウン短縮も増えます。',
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
        label: '追加HPを魔法防御貫通に変える型',
        when: '敵の前衛が魔法防御を積みそうで、ダメージが通りにくそうなとき',
        text: '1品目のルーンソードは、モンスターを倒すたびに魔法攻撃とクールダウン短縮が少しずつ積み上がります。2品目の抵抗の靴で耐性を早めに持ち、時の預言・神喰らいの書・羽化の衣とHPを重ねます。羽化の衣は追加HPに応じて魔法攻撃と魔法防御貫通を上げ、最後の賢者の怒りが魔法攻撃を割合で伸ばします。',
      },
      en: {
        label: 'Turning extra Health into magic pierce',
        when: 'When enemy frontliners are likely to stack magical defense and damage looks hard to get through',
        text: 'Runeblade comes first and gradually stacks magic attack and cooldown reduction each time she kills a monster. Boots of Resistance, second, bring Resistance early, and Augur\'s Word, Insatiable Tome and Breakthrough Robe stack Health. Breakthrough Robe raises magic attack and magic pierce based on her extra Health, and Savant\'s Wrath at the end raises magic attack by a percentage.',
      },
    },
  ],
  // 太公望（Mage／MID）
  '148': [
    {
      ja: {
        label: '貫通の靴から入り、回復を止める型',
        when: '敵に回復役がいて、魔法防御も積まれるとき',
        text: '1品目の秘法の靴で、最初から魔法防御貫通とMPの回復を持ちます。3品目の夢魔の牙は、当てた敵のHP回復とライフスティールを落とします。5品目にヴォイドスタッフを置くので、魔法防御を積んだ相手にもダメージが通るのは、ビルド2より早い時期です。最後のトワイライトストームは、ヒーローに当て続けるほど魔法防御貫通がさらに重なります。',
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
        label: 'HPと防御を先に立てる前衛の型',
        when: '敵の回復が多く、前で受け続けたいとき',
        text: '1品目のガーディアン・閃光は自分の物理防御と魔法防御を上げ、範囲内の味方にも半分を配ります。3品目の紅蓮のマントで防御とHPを足し、燃焼で敵のHP回復とライフスティールも落とせます。スペルはヒールです。',
      },
      en: {
        label: 'Health and defense up front',
        when: 'When the enemy has a lot of healing and he wants to keep absorbing hits up front',
        text: 'Guardian - Radiance comes first, raising his physical and magical defense and giving allies in range half of the effect. Blazing Cape, third, adds defense and Health, and its burn cuts enemy healing and lifesteal. The spell is Heal.',
      },
    },
    {
      ja: {
        label: '魔法攻撃とクールダウン短縮で削る型',
        when: '敵の前衛が少なく、序盤から手数で押し込みたいとき',
        text: '1品目の極影の盾・閃光は自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にも半分を配ります。3品目から羽化の衣と巫術の杖で魔法攻撃と魔法防御貫通を先に持ち、最後に賢者の天書と賢者の怒りで魔法攻撃を伸ばします。最大HPはビルド1より低く、スペルはターミネートです。',
      },
      en: {
        label: 'Magical attack and cooldown reduction to chip',
        when: 'When the enemy has few frontliners and he wants to push with frequent casts from early on',
        text: 'Crimson Shadow - Radiance comes first, raising his attack speed and cooldown reduction and giving allies in range half of the effect. From the third item, Breakthrough Robe and Staves of Sorcery bring magical attack and Magical Pierce early, and Sage\'s Tome and Savant\'s Wrath at the end raise magical attack further. His max Health is lower than in build 1, and the spell is Execute.',
      },
    },
  ],
  // 韓信（Assassin／JUNGLE）
  '150': [
    {
      ja: {
        label: '靴を先に持ち、ライフスティールで締める型',
        when: '早く動き出したく、削られても居座りたいとき',
        text: '2品目の忍びの靴で、移動速度と物理防御、物理被ダメージの軽減を早く持ちます。最後のブラッドエッジは物理ライフスティールを足し、スキルのダメージにも物理ライフスティールが乗るようにします。アルカナの略奪とも重なり、ビルド2より居座る力が高い並びです。',
      },
      en: {
        label: 'Boots first, ending on lifesteal',
        when: 'When he wants to get moving early and stay in fights even while worn down',
        text: 'Boots of Fortitude, second, bring early movement speed, physical defense and physical damage reduction. Bloodweeper at the end adds physical lifesteal and boosts lifesteal from skill damage. Together with the Reaver arcana, this build holds on better than build 2.',
      },
    },
    {
      ja: {
        label: '貫通を先に持ち、最後も貫通の型',
        when: '敵に物理防御の高い前衛が多いとき',
        text: '2品目をシャドーアックスにして物理防御貫通を先に持ち、靴は3品目に下がります。最後の砕星の槌で貫通を割合でも上げ、移動速度とHPも足します。物理ライフスティールはビルド1より低くなります。',
      },
      en: {
        label: 'Pierce first, pierce at the end',
        when: 'When the enemy has many frontliners with high physical defense',
        text: 'Axe of Torment moves up to second for early physical pierce, pushing the boots back to third. Starbreaker at the end raises pierce by a percentage as well and adds movement speed and Health. His physical lifesteal ends up lower than in build 1.',
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
        label: '貫通と割合の削りを早く持つ型',
        when: '敵に前衛が2体以上いるとき',
        text: '1品目の秘法の靴で魔法防御貫通を持ち、2品目に苦痛のマスクを上げて、相手の現在HPに応じた削りを早くから入れます。5品目のヴォイドスタッフで貫通がさらに増え、最後の賢者の天書で、魔法攻撃が多いほどダメージが上がり被ダメージも軽減されます。無効化のアクティブを持たないので、飛び込まれたときの備えはビルド1より薄くなります。',
      },
      en: {
        label: 'Pierce and percent-HP damage early',
        when: 'When the enemy has two or more frontliners',
        text: 'Boots of the Arcane come first for magical pierce, and Mask of Agony moves up to second so damage based on the target\'s current Health starts early. Void Staff in fifth adds more pierce, and Sage\'s Tome closes the build, raising damage dealt and reducing damage taken the more magical attack she has. Without an immunity active, she has less to fall back on against dives than in build 1.',
      },
    },
  ],
  // 蘭陵王（Assassin／JUNGLE）
  '153': [
    {
      ja: {
        label: 'クールダウンと物理防御で居座る型',
        when: '敵の主力が物理ダメージで、殴り合いが長引きそうなとき',
        text: '2品目に静謐の靴を入れ、クールダウン短縮を多めに積みます。4品目のグレートブレイカーが早く来るので、HPが半分を切った敵へのダメージが増える時期も早まります。5品目の猛攻の鎧は物理防御とHPを足し、攻撃を受けるたびに与えるダメージと移動速度が重なっていくので、殴り合いが続く場面で倒れにくくなります。',
      },
      en: {
        label: 'Cooldowns and physical defense',
        when: 'When the enemy\'s main damage is physical and brawls are likely to drag on',
        text: 'Boots of Tranquility come second for plenty of cooldown reduction. Overlord\'s Might arrives early in fourth, so his bonus damage against enemies below half Health comes online sooner. Cuirass of Savagery, fifth, adds physical defense and Health and stacks damage dealt and movement speed each time he is hit, so he holds up in longer brawls.',
      },
    },
    {
      ja: {
        label: '攻撃速度とクリティカルで手数を出す型',
        when: '敵の後衛を狙って、出入りを繰り返したいとき',
        text: '2品目の疾風の靴は移動速度を大きく足し、戦闘から離れているとさらに速くなります。4品目にマスターブレードを差し込み、スキルを使ったあとの通常攻撃に追加のダメージを乗せます。グレートブレイカーは5品目に下がり、クールダウン短縮もビルド1より少ないかわりに、出入りの速さと通常攻撃の手数で戦う並びです。',
      },
      en: {
        label: 'Attack speed and crit',
        when: 'When you want to keep diving in and out on the enemy back line',
        text: 'Boots of Deftness come second, adding a lot of movement speed and more when out of combat. Master Sword slots in fourth, adding damage to the basic attack after a skill. Overlord\'s Might moves to fifth and cooldown reduction is lower than in build 1, but he fights through speed of entry and more basic attacks.',
      },
    },
  ],
  // ムーラン（Fighter／CLASH）
  '154': [
    {
      ja: {
        label: '狩猟を1枠入れる型',
        when: '削り合いが長引きそうなとき',
        text: '装備の顔ぶれも買う順も2本とも同じで、違うのはアルカナの1枠だけです。このビルドは隠匿の1枠を狩猟にして、攻撃速度をわずかに足しています。装備は2品目のシャドーアックスと最後の砕星の槌で、物理防御貫通を固定値と割合の両方で足します。',
      },
      en: {
        label: 'One Hunt slot',
        when: 'When trades are likely to drag on',
        text: 'Both builds use the same items in the same order; only one arcana slot differs. This one turns a Stealth slot into Hunt for a tiny bit of attack speed. On the item side, Axe of Torment, second, and Starbreaker at the end add physical pierce both as a flat value and as a percentage.',
      },
    },
    {
      ja: {
        label: '隠匿で物理攻撃に寄せる型',
        when: '1度の撃ち合いで後衛まで踏み込みたいとき',
        text: '狩猟の1枠を隠匿に戻し、物理攻撃をわずかに足した形です。ビルド1との差はこれだけで、数値の差はごくわずかです。5品目の魔女のマントで魔法防御とHPを足すのは、2本とも同じです。',
      },
      en: {
        label: 'Stealth for physical attack',
        when: 'When she wants to reach the enemy back line in a single trade',
        text: 'This returns the Hunt slot to Stealth for a tiny bit of physical attack. That is the only difference from build 1, and the numbers barely change. Both builds add magical defense and Health with Succubus Cloak, fifth.',
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
        label: '貫通を重ねて硬い相手を削る型',
        when: '敵に魔法防御を積むタンクやHPの多いヒーローが並ぶとき',
        text: '1品目の秘法の靴で魔法防御貫通を持ち、2品目の苦痛のマスクと3品目の残響の杖で削りの柱を早めにそろえます。苦痛のマスクは相手の現在HPに応じた削りを重ね、残響の杖はスキルが当たると周りに爆発を起こします。5品目のヴォイドスタッフで、魔法防御を積んだ相手にもダメージが通るようになります。',
      },
      en: {
        label: 'Stack pierce for tough targets',
        when: 'When the enemy fields tanks who stack magical defense or high-Health heroes',
        text: 'Boots of the Arcane bring magic pierce first, and Mask of Agony second and Scepter of Reverberation third set up his damage early. Mask of Agony adds damage based on the target\'s current Health, and Scepter of Reverberation sets off an explosion when a skill lands. Void Staff, fifth, lets his damage get through enemies who stack magical defense.',
      },
    },
    {
      ja: {
        label: 'クールダウンを縮めて撃ち続ける型',
        when: '敵に回復やライフスティールに頼るヒーローが複数いるとき',
        text: '2品目の聖杯が時間とともにMPとHPを戻すので、レーンに長く残れて、戻る回数が減ります。3品目の夢魔の牙は当てた敵のHP回復とライフスティールを落とします。貫通の装備を持たないかわりにクールダウン短縮が高く、スキルを撃つ回数が増えます。',
      },
      en: {
        label: 'Lower cooldowns, keep casting',
        when: 'When several enemies rely on healing or lifesteal',
        text: 'Holy Grail, second, restores mana and Health over time, so he can stay in lane longer and recall less. Venomous Staff, third, cuts the healing and lifesteal of enemies he hits. With no pierce items, his cooldown reduction runs higher and he casts more often.',
      },
    },
  ],
  // 不知火舞（Assassin／MID）
  '157': [
    {
      ja: {
        label: '回復阻害を3品目で持つ型',
        when: '敵にライフスティールに頼るヒーローや回復役が複数いるとき',
        text: '神喰らいの書と抵抗の靴を先に置き、3品目に夢魔の牙を立てます。通常攻撃かスキルが当たるたびに、敵のHP回復とライフスティールがしばらく落ちます。賢者の怒りを4品目に回すぶん、魔法攻撃の伸び方はビルド2より少し遅れますが、クールダウン短縮は高くなります。',
      },
      en: {
        label: 'Anti-healing by the third item',
        when: 'When the enemy has several lifesteal heroes or healers',
        text: 'Insatiable Tome and Boots of Resistance come first, then Venomous Staff third. Every basic attack or skill that lands cuts the enemy\'s healing and lifesteal for a while. Savant\'s Wrath moves to fourth, so her magic attack grows a little later than in build 2, but her cooldown reduction is higher.',
      },
    },
    {
      ja: {
        label: '範囲の爆発で複数を削る型',
        when: '敵が固まって動き、まとめて巻き込みたいとき',
        text: '3品目を賢者の怒りにして、魔法攻撃そのものを割合で伸ばす時期を早めます。4品目の残響の杖は、スキルが当たると周りに爆発を起こすので、固まった敵をまとめて削れます。夢魔の牙を持たないぶん、クールダウン短縮はビルド1より低くなります。',
      },
      en: {
        label: 'Area explosions for groups',
        when: 'When the enemy moves as a group and you want to catch several at once',
        text: 'Savant\'s Wrath comes third, bringing the percentage boost to magic attack forward. Scepter of Reverberation, fourth, sets off an explosion when a skill lands, wearing down grouped enemies together. Without Venomous Staff, her cooldown reduction is lower than in build 1.',
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
        label: '殴ってきた相手を鈍らせる守りの型',
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
        label: '被弾を火力に変える型',
        when: '集団戦が長引き、殴られながら前に出続けそうなとき',
        text: '1品目から4品目まではビルド2と同じで、グリードバイト・抵抗の靴・シャドーアックス・グレートブレイカーの順に買います。グレートブレイカーはHPが半分を切った敵への与ダメージを上げ、シャドーアックスが物理防御貫通を足します。5品目の猛攻の鎧はダメージを受けるたびに与ダメージと移動速度を上げるので、殴られながら前に出続けるほど効いてきます。',
      },
      en: {
        label: 'Turning hits taken into damage',
        when: 'When teamfights are likely to drag on and she expects to keep pushing forward while taking hits',
        text: 'The first four items match build 2: Rapacious Bite, Boots of Resistance, Axe of Torment and Overlord\'s Might, in that order. Overlord\'s Might raises damage against enemies below half Health, and Axe of Torment adds physical pierce. Cuirass of Savagery, fifth, raises her damage and movement speed every time she takes damage, so it works better the longer she keeps pushing forward under fire.',
      },
    },
    {
      ja: {
        label: '物理防御を厚くして反射で返す型',
        when: '敵の主な火力が物理ダメージで、集中攻撃を受けやすいとき',
        text: '違うのは5品目だけで、猛攻の鎧の代わりにスパイクアーマーを買います。スパイクアーマーは物理防御が猛攻の鎧より厚く、アクティブで少しの間カウンター状態になって、受けたダメージの一部を相手に返します。最後の砕星の槌で物理防御貫通を足すのはビルド1と同じです。',
      },
      en: {
        label: 'Thicker physical defense and reflection',
        when: 'When the enemy\'s main damage is physical and she is likely to be focused',
        text: 'Only the fifth item differs: Spikemail replaces Cuirass of Savagery. Spikemail gives more physical defense than Cuirass of Savagery, and its active briefly puts her in a counter state that returns part of the damage she takes. Starbreaker closes the build with physical pierce, just as in build 1.',
      },
    },
  ],
  // 橘右京（Assassin／JUNGLE）
  '163': [
    {
      ja: {
        label: '最後に貫通を足して前衛を削る型',
        when: '敵に物理防御の高い前衛が多いとき',
        text: 'グリードバイトから不吉な予兆までの5品は、2本とも同じ順です。最後の砕星の槌で物理防御貫通を割合で上げ、硬い前衛にもダメージを通します。移動速度も足されるので、ジャングルを渡る足はビルド2より速くなります。',
      },
      en: {
        label: 'Pierce at the end for tough frontliners',
        when: 'When the enemy has many frontliners with high physical defense',
        text: 'The five items from Rapacious Bite through Ominous Premonition are bought in the same order in both builds. Starbreaker at the end raises physical pierce by a percentage, getting damage through tough frontliners. It also adds movement speed, so he crosses the jungle faster than with build 2.',
      },
    },
    {
      ja: {
        label: '最後の1品を魔法防御に回す型',
        when: '敵に魔法ダメージのヒーローが多いとき',
        text: '5品目までの買う順はビルド1と同じで、違うのは最後の1品だけです。砕星の槌の代わりに破魔の霊刀を置き、魔法防御に加えて、物理攻撃に応じた魔法防御も上乗せされます。そのぶん物理防御貫通の割合の上乗せは無くなります。',
      },
      en: {
        label: 'Last slot for magical defense',
        when: 'When the enemy has many magic damage heroes',
        text: 'The buying order through the fifth item matches build 1; only the last item differs. Demonsbane replaces Starbreaker, adding magical defense plus extra magical defense based on his physical attack. In exchange, the percentage physical pierce is gone.',
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
        text: 'Boots of Resistance add Resistance, and Frostscar\'s Embrace in the second slot gives the Basic Attack after a skill extra area damage and a slow. Spikemail, the fourth item, has an active that briefly reflects part of the damage taken back as true damage, with less returned the farther away the attacker is. Cuirass of Savagery closes the build, raising damage and Movement Speed each time he is hit, so the longer he is under fire, the harder he hits back. The arcana set adds a little Attack Speed.',
      },
    },
    {
      ja: {
        label: '物理を軽減して長く粘る型',
        when: '敵の主なダメージが物理のとき',
        text: '靴を忍びの靴に替えて物理被ダメージを減らし、2品目に紅蓮のマントを前倒しして、近くの敵のHP回復とライフスティールを早めに落とします。4品目のブリザードは、大きな一撃を受けると周りの敵の攻撃速度と移動速度を下げる装備です。最後は覇者の重装で最大HPを伸ばし、攻撃を受けていない間の回復も厚くします。アルカナは変異に替え、物理防御貫通を足しています。',
      },
      en: {
        label: 'Physical damage cut for long fights',
        when: 'When the enemy\'s main damage is physical',
        text: 'Boots of Fortitude replace the other boots to reduce physical damage taken, and Blazing Cape moves up to second to cut nearby enemies\' Health recovery and Lifesteal early. Glacial Buckler, the fourth item, lowers nearby enemies\' Attack Speed and Movement Speed when a single big hit lands on him. Overlord\'s Platemail finishes the build with more max Health and stronger regeneration while he is not being attacked. The arcana switch to a set that adds physical pierce.',
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
        label: 'クールダウン短縮と反射で前に立つ型',
        when: '敵に物理ダメージのヒーローが多く、前で受け続けたいとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げて範囲内の味方にも半分を配り、アクティブで味方にシールドを張ります。3品目のブリザードはクールダウン短縮を大きく足し、大きな一撃を受けると周りの敵の攻撃速度と移動速度を下げます。5品目のスパイクアーマーは、アクティブで受けたダメージの一部を相手に返します。',
      },
      en: {
        label: 'Cooldown reduction and reflection up front',
        when: 'When the enemy has many physical damage heroes and he wants to keep absorbing hits up front',
        text: 'Guardian - Redemption comes first, raising his physical and magical defense, giving allies in range half of the effect, and shielding teammates with its active. Glacial Buckler, third, adds a lot of cooldown reduction and lowers nearby enemies\' attack speed and movement speed when he takes a big hit. Spikemail, fifth, has an active that returns part of the damage he takes.',
      },
    },
    {
      ja: {
        label: '減速と凍結で足を止める型',
        when: '敵に魔法ダメージのヒーローや飛び込み役が多いとき',
        text: '1品目のガーディアン・閃光は、アクティブで範囲の敵に何度もダメージを与えて足を鈍らせ、視界も取ります。3品目のフロストショックはアクティブで周りの敵を凍らせ、不吉な予兆は攻撃してきた相手の攻撃速度と移動速度を落とします。5品目の魔女のマントは、魔法ダメージを防ぐシールドを定期的に張ります。スペルはビルド1のヒールに代わってフラッシュを持ちます。',
      },
      en: {
        label: 'Slows and freezes to stop enemies',
        when: 'When the enemy has many magic damage heroes or divers',
        text: 'Guardian - Radiance comes first; its active damages enemies in range several times, slows them and grants vision. Frigid Charge, third, freezes nearby enemies with its active, and Ominous Premonition lowers the attack and movement speed of anyone who hits him. Succubus Cloak, fifth, regularly raises a shield against magical damage. The spell is Flash instead of build 1\'s Heal.',
      },
    },
  ],
  // 后羿（Marksman／FARM）
  '169': [
    {
      ja: {
        label: '靴を先に、貫通は最後に',
        when: '敵の前衛が軽く、物理防御を積むタンクがいないとき',
        text: '装備の6品は2本とも同じで、違うのは買う順番とアルカナです。このビルドは速攻の靴を1品目に置き、移動速度と、通常攻撃のたびにHPが戻る効果を最初から持ちます。物理防御貫通を足す威光の弓は最後の6品目なので、物理防御を積んだ相手への貫通がそろうのは後半になります。アルカナは狩猟を10枠積み、攻撃速度と移動速度を足しています。',
      },
      en: {
        label: 'Boots first, pierce last',
        when: 'When the enemy frontline is light and has no tank stacking physical defense',
        text: 'Both builds use the same six items; only the buying order and arcana differ. This one opens with Boots of Dexterity, so the Movement Speed and the Health restored on every basic attack are there from the start. Daybreaker\'s Virtue, which adds physical pierce, comes sixth, so full pierce against armored targets only arrives late. All ten Hunt arcana slots go into Attack Speed and Movement Speed.',
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
        label: '最後に物理防御とHPを足す型',
        when: '敵に通常攻撃で殴り合うヒーローが多いとき',
        text: '1品目はスマイト用のグリードバイトで、モンスターを倒すたびに物理攻撃とクールダウン短縮が重なります。5品目までは2本とも同じ並びで、最後の不吉な予兆が物理防御とHPを足します。ダメージを受けると、攻撃してきた相手の攻撃速度と移動速度を落とします。',
      },
      en: {
        label: 'Physical defense and Health at the end',
        when: 'When the enemy has many heroes who trade with Basic Attacks',
        text: 'The first item is Rapacious Bite, which requires Smite; each monster kill stacks physical attack and cooldown reduction. Both builds share the same order through the fifth item, and Ominous Premonition at the end adds physical defense and Health. When he takes damage, it lowers the attacker\'s attack speed and movement speed.',
      },
    },
    {
      ja: {
        label: '最後に硬さと与ダメージを足す型',
        when: '敵の物理防御が厚く、貫通を足して削りたいとき',
        text: '分かれるのは最後の1品で、猛攻の鎧が物理攻撃・物理防御・HPを足し、ダメージを受けると与ダメージが上限まで重なって上がります。アルカナは紅月と狩猟を減らして変異と略奪を入れ、物理攻撃・物理防御貫通・物理ライフスティールを上げています。攻撃速度と最大HPはビルド1より低くなります。',
      },
      en: {
        label: 'Toughness and damage dealt at the end',
        when: 'When the enemy\'s physical defense is high and he wants extra pierce to wear them down',
        text: 'The builds split at the last item: Cuirass of Savagery adds physical attack, physical defense and Health, and taking damage stacks his damage dealt, up to a cap. The arcana cut Red Moon and Hunt for Mutation and Reaver, raising physical attack, Physical Pierce and physical lifesteal. His attack speed and max Health end up lower than in build 1.',
      },
    },
  ],
  // 張飛（Support／ROAM）
  '171': [
    {
      ja: {
        label: 'HPと魔法防御を積む前線の型',
        when: '敵に魔法ダメージのヒーローが多く、集団戦が長引きそうなとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にも半分を配ります。靴と紅蓮のマントのあとは、魔女のマント・不吉な予兆・覇者の重装と守りを重ね、HPと魔法防御を大きく積みます。不吉な予兆は攻撃を受けると相手の攻撃速度と移動速度を落とすので、殴り合いが長引くほど効いてきます。',
      },
      en: {
        label: 'Health and magical defense for the front',
        when: 'When the enemy has many magic damage heroes and teamfights are likely to drag on',
        text: 'Crimson Shadow - Redemption comes first, raising his attack speed and cooldown reduction and giving allies in range half of the effect. After the boots and Blazing Cape, Succubus Cloak, Ominous Premonition and Overlord\'s Platemail stack heavy Health and magical defense. Ominous Premonition slows the attack and movement speed of anyone who hits him, so it matters more the longer the brawl lasts.',
      },
    },
    {
      ja: {
        label: '物理防御と復活で粘る型',
        when: '敵の火力が物理ダメージ中心で、集団戦の回数が多い試合のとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げ、範囲内の味方にも半分を配ります。4品目のサンライズケープは敵ヒーローに攻撃を当てると自分とHPの低い味方にシールドを張り、5品目のフロストショックはアクティブで敵を凍らせます。最後の賢者の庇護は、倒されても少し待ってその場で復活できる装備です。',
      },
      en: {
        label: 'Physical defense and a revive',
        when: 'When the enemy\'s damage is mostly physical and the match has many teamfights',
        text: 'Guardian - Redemption comes first, raising his physical and magical defense and giving allies in range half of the effect. Dawnlight, fourth, shields him and the lowest-Health ally nearby when he damages an enemy hero, and Frigid Charge, fifth, has an active that freezes enemies. Sage\'s Sanctuary closes the build and lets him revive on the spot a moment after he falls.',
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
        label: 'HPとライフスティールで粘るブラッドエッジ型',
        when: '敵に飛び込んでくる近接ヒーローが多いとき',
        text: '4品目をブラッドエッジに替えた形で、ほかの5品とアルカナはビルド1と同じです。物理ライフスティールと最大HPが付き、スキルによる物理ライフスティールも上がるので、殴られながら撃ち続ける場面でHPを戻せます。ジャッジメントの攻撃速度と、敵の回復を落とす効果は、このビルドには付きません。',
      },
      en: {
        label: 'Bloodweeper to heal through dives',
        when: 'When the enemy has many melee heroes who dive',
        text: 'This version swaps the fourth item for Bloodweeper; the other five items and the arcana match Build 1. It brings physical Lifesteal and max Health, plus extra physical Lifesteal on skill damage, so he can win Health back while firing under pressure. Mortal Punisher\'s Attack Speed and healing cut are what this build gives up.',
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
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げ、範囲内の味方にもその半分を配ります。アクティブの救援は周りの味方にシールドを張るので、集団戦の入り口で味方を守る手札が1枚増えます。3品目のブリザードは、大きなダメージを受けると周りの敵を減速させる装備です。前に立つ時間が長いほど、この減速が敵の足を止めてくれます。',
      },
      en: {
        label: 'Defense aura for the whole team',
        when: 'When you stand in front and want everyone near you to be harder to kill',
        text: 'Guardian - Redemption comes first: it raises Kui\'s physical and magical defense and gives allies in range half of the effect. Its active, Rescue, shields nearby allies, which adds one more way to protect the team as a fight opens. Glacial Buckler, the third item, slows nearby enemies when he takes a big hit. The longer he holds the front, the more that slow keeps enemies in place.',
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
        when: '敵の物理ダメージが多く、前に出て粘りたいとき',
        text: '1品目にローム専用の極影の盾・閃光を置き、自分の攻撃速度とクールダウン短縮を上げて、範囲内の味方にも半分を配ります。氷霜のグリップ・不死鳥の目・羽化の衣とHPと守りを重ね、羽化の衣で追加HPに応じた魔法攻撃と魔法防御貫通を足します。魔法攻撃はビルド2よりずっと低く、狙いは前に立って粘ることにあります。',
      },
      en: {
        label: 'Health to step up front',
        when: 'When the enemy deals heavy physical damage and you want to step forward and hold on',
        text: 'The roam-only Crimson Shadow - Radiance comes first, raising her attack speed and cooldown reduction and giving allies in range half of the effect. Frostscar\'s Embrace, Eye of the Phoenix and Breakthrough Robe stack Health and defense, and Breakthrough Robe adds magic attack and magic pierce based on her extra Health. Her magic attack is far lower than in build 2; the aim is to stand in front and hold on.',
      },
    },
    {
      ja: {
        label: '魔法攻撃と貫通を積みきる型',
        when: '敵に回復やライフスティールが多く、後ろから撃ちたいとき',
        text: '1品目の秘法の靴で魔法防御貫通を早く持ち、そのあとは魔法攻撃の装備を5品重ねます。3品目の夢魔の牙が当てた敵のHP回復とライフスティールを落とし、最後のヴォイドスタッフで魔法防御貫通を大きく足します。最大HPはビルド1より低いので、立つ位置は後ろに下げることになります。',
      },
      en: {
        label: 'Full magic attack and pierce',
        when: 'When the enemy has a lot of healing or lifesteal and you want to fire from the back',
        text: 'Boots of the Arcane bring magic pierce early, followed by five magic attack items. Venomous Staff, third, cuts the healing and lifesteal of enemies she hits, and Void Staff at the end adds heavy magic pierce. Her max Health is lower than in build 1, so she stands further back.',
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
        label: '燃焼で敵の回復を削る型',
        when: '敵にライフスティールや回復を持つヒーローが多いとき',
        text: '1品目はスマイト用のグリードバイトで、5品目の不死鳥の目までは2本とも同じ並びです。最後の紅蓮のマントは周りの敵を燃やし、当たった敵のHP回復とライフスティールを落とします。',
      },
      en: {
        label: 'Burn to cut enemy healing',
        when: 'When the enemy has many heroes with lifesteal or healing',
        text: 'The first item is Rapacious Bite, which requires Smite, and both builds share the same order through Eye of the Phoenix, fifth. Blazing Cape at the end burns nearby enemies and cuts the healing and lifesteal of those it hits.',
      },
    },
    {
      ja: {
        label: '反射と物理防御で受け止める型',
        when: '敵の主な火力が物理ダメージで、近い距離で殴り合いそうなとき',
        text: '最後の1品をスパイクアーマーにして、物理防御を厚くします。アクティブで少しの間カウンター状態になり、受けたダメージの一部を相手に返します。',
      },
      en: {
        label: 'Reflection and physical defense',
        when: 'When the enemy\'s main damage is physical and close-range brawls are likely',
        text: 'Spikemail takes the last slot, thickening his physical defense. Its active briefly puts him in a counter state that returns part of the damage he takes.',
      },
    },
  ],
  // 女媧（Mage／MID）
  '179': [
    {
      ja: {
        label: 'クールダウンを靴で先に縮める型',
        when: 'スキルを撃つ回数を早くから増やしたいとき',
        text: '靴より後の5品は2本とも同じで、違うのは靴とアルカナです。このビルドは静謐の靴でクールダウンを縮めてから入り、アルカナの心眼で魔法防御貫通を足しています。2品目の残響の杖はスキルが当たると周りに爆発を起こすので、ウェーブと相手をまとめて削れます。',
      },
      en: {
        label: 'Cooldown boots first',
        when: 'When you want to cast more often from early on',
        text: 'The five items after the boots are the same in both builds; only the boots and the arcana differ. This build opens with Boots of Tranquility for cooldown reduction, and the Mind\'s Eye arcana add magic pierce. Scepter of Reverberation, the second item, sets off an explosion when a skill lands, so the wave and the opponent get chipped together.',
      },
    },
    {
      ja: {
        label: 'MPの回復と貫通を靴で持つ型',
        when: 'MPが切れてレーンを離れることが多いとき',
        text: '秘法の靴から入り、魔法防御貫通とMPの回復を1品目で持ちます。アルカナは心眼の代わりに生贄を選び、魔法攻撃とクールダウン短縮を足しています。4品目の賢者の怒りは魔法攻撃そのものを割合で伸ばし、5品目のヴォイドスタッフで、魔法防御を積んだ相手にもダメージが通るようになります。',
      },
      en: {
        label: 'Mana and pierce from the boots',
        when: 'When running out of mana keeps forcing you out of lane',
        text: 'Boots of the Arcane come first, giving magic pierce and mana regeneration from the first item. The arcana swap Mind\'s Eye for Tribute, adding magic attack and cooldown reduction. Savant\'s Wrath, fourth, raises magic attack itself by a percentage, and Void Staff, fifth, lets damage get through enemies who stack magical defense.',
      },
    },
  ],
  // ナタク（Fighter／CLASH）
  '180': [
    {
      ja: {
        label: '貫通と火力を先に持つ型',
        when: '敵に物理防御の高い前衛が多いとき',
        text: '靴のあと、2品目のシャドーアックスで物理防御貫通を先に持ちます。氷霜のグリップと蒼天の剣でクールダウン短縮も重ね、5品目のグレートブレイカーでHPが半分を切った敵への与ダメージを上げます。最後の破魔の霊刀は、物理攻撃に応じた魔法防御を上乗せします。',
      },
      en: {
        label: 'Pierce and damage first',
        when: 'When the enemy has many frontliners with high physical defense',
        text: 'After the boots, Axe of Torment comes second for early physical pierce. Frostscar\'s Embrace and Pure Sky stack cooldown reduction, and Overlord\'s Might, fifth, raises damage against enemies below half Health. Demonsbane closes the build, adding magical defense based on his physical attack.',
      },
    },
    {
      ja: {
        label: 'HPを積んで前に残る型',
        when: '敵に回復を持つヒーローが多く、集団戦で長く前に残りたいとき',
        text: '靴の次に紅蓮のマントを置き、HPと、燃焼で敵のHP回復とライフスティールを落とす効果を早く持ちます。4品目のブラッドレイジは通常攻撃に追加HPに応じたダメージを乗せ、積んだHPを火力に回します。物理攻撃はビルド1より低く、HPが半分を切った敵への与ダメージを上げるグレートブレイカーは6品目まで待ちます。',
      },
      en: {
        label: 'Health to stay up front',
        when: 'When the enemy has many heroes with healing and you want to stay in front through long teamfights',
        text: 'Blazing Cape follows the boots, bringing Health early along with a burn that cuts enemy healing and lifesteal. Blood Rage, fourth, adds damage based on extra Health to his basic attacks, turning the Health he stacks into damage. His physical attack is lower than in build 1, and Overlord\'s Might, which raises damage against enemies below half Health, waits until sixth.',
      },
    },
  ],
  // 干将・莫耶（Mage／MID）
  '182': [
    {
      ja: {
        label: 'アルカナで最大HPを足す型',
        when: '敵に瞬間火力の高いヒーローがいて、一度に倒されたくないとき',
        text: '装備の顔ぶれも買う順も2本とも同じで、違うのはアルカナの3枠だけです。このビルドは獣痕を入れて、最大HPとクリティカル率を少し足します。装備は残響の杖と賢者の天書で魔法攻撃を積み、賢者の怒りで割合を上げ、ヴォイドスタッフで魔法防御貫通を伸ばす並びです。',
      },
      en: {
        label: 'Arcana for extra max Health',
        when: 'When the enemy has heroes with heavy burst and you don\'t want to be taken down in one go',
        text: 'Both builds use the same items in the same order; only three arcana slots differ. This one takes Beast Scar for a little extra max Health and critical rate. The items stack magic attack with Scepter of Reverberation and Sage\'s Tome, raise it by a percentage with Savant\'s Wrath, and extend magic pierce with Void Staff.',
      },
    },
    {
      ja: {
        label: 'アルカナでライフスティールを足す型',
        when: 'レーンに長く残って、リコールの回数を減らしたいとき',
        text: '獣痕の代わりに貪欲を入れ、魔法ライフスティールを足します。最後の神喰らいの書は魔法ライフスティールの値に応じてクールダウン短縮も増えるので、貪欲の分は短縮にも少し回ります。その代わり、最大HPはビルド1より低くなります。',
      },
      en: {
        label: 'Arcana for extra lifesteal',
        when: 'When you want to stay in lane longer and recall less often',
        text: 'Avarice replaces Beast Scar, adding magical lifesteal. Insatiable Tome at the end adds cooldown reduction based on magical lifesteal, so Avarice also turns into a little cooldown reduction. In exchange, their max Health is lower than in build 1.',
      },
    },
  ],
  // アテナ（Fighter／JUNGLE）
  '183': [
    {
      ja: {
        label: '攻撃速度と追加ダメージで削る型',
        when: '敵にHPの高い前衛が多く、ジャングルを回って育てたいとき',
        text: '1品目はスマイト用のグリードバイトで、モンスターを倒すたびに物理攻撃とクールダウン短縮が重なります。2品目の速攻の靴は、攻撃速度と移動速度を早めに上げる靴です。5品目のドゥームズデイは相手の追加HPに応じたダメージを通常攻撃に足し、最後のブラッドレイジは通常攻撃に追加のダメージを足し、自分のHPが減ると追加分が増えます。アクティブではシールドを張れます。',
      },
      en: {
        label: 'Attack speed and extra damage to wear them down',
        when: 'When the enemy has many high-Health frontliners and she wants to grow by clearing the jungle',
        text: 'The first item is Rapacious Bite, which requires Smite; each monster kill stacks physical attack and cooldown reduction. Boots of Dexterity, second, bring early attack speed and movement speed. Doomsday, fifth, adds damage based on the target\'s extra Health to her Basic Attacks, and Blood Rage at the end adds extra damage to her Basic Attacks, more when her own Health is low, and has an active shield.',
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
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げ、範囲内の味方にもその半分を配ります。4品目は夢魔の牙の代わりに賢者の怒りで、魔法攻撃そのものを割合で伸ばします。',
      },
      en: {
        label: 'Defense aura and magic attack',
        when: 'When the enemy splits its damage between physical and magic and few rely on healing',
        text: 'Guardian - Redemption, the first item, raises Cai Yan\'s physical and magical defense and gives allies in range half of the effect. The fourth item is Savant\'s Wrath instead of Venomous Staff, raising magic attack itself by a percentage.',
      },
    },
  ],
  // 東皇太一（Support／ROAM）
  '187': [
    {
      ja: {
        label: 'HPを積んで魔法攻撃に変える型',
        when: '敵の瞬間火力が高く、前に出て耐えたいとき',
        text: '2品目の羽化の衣は、追加HPに応じて魔法攻撃と魔法防御貫通を増やすので、HPを積むほど火力も上がります。4品目の時の預言で物理防御と魔法防御を足し、5品目の神喰らいの書で魔法ダメージの一部をHPとして吸えるようになります。アルカナも調和と虚空でHPを伸ばしているので、全体が硬さと火力を同時に積む並びです。',
      },
      en: {
        label: 'Health into magic power',
        when: 'When the enemy has heavy burst and you want to stand in front and survive',
        text: 'Breakthrough Robe, second, raises magic attack and magic pierce based on his extra Health, so stacking Health also raises his damage. Augur\'s Word, fourth, adds physical and magical defense, and Insatiable Tome, fifth, lets part of his magic damage heal him. The Harmony and Void arcana also add Health, so the whole build stacks toughness and damage together.',
      },
    },
    {
      ja: {
        label: '足の速さを先に、貫通で締める型',
        when: '敵が魔法防御を積んでいて、動き回りながら削りたいとき',
        text: '2品目の残響の杖は移動速度を足し、スキルが当たると周りに爆発を起こします。賢者の天書を4品目に早めているので、魔法攻撃が大きく伸びる時期がビルド1より前に来ます。最後のヴォイドスタッフで魔法防御貫通を足し、アルカナも心眼で貫通を上乗せしているため、魔法防御を積んだ相手にもダメージを通しやすくなります。',
      },
      en: {
        label: 'Speed first, pierce to finish',
        when: 'When the enemy stacks magical defense and you want to move around while chipping',
        text: 'Scepter of Reverberation, second, adds movement speed and sets off an explosion when a skill lands. Sage\'s Tome moves up to fourth, so his magic attack rises sharply earlier than in build 1. Void Staff closes the build with magic pierce, and the Mind\'s Eye arcana add more, so his damage gets through enemies who stack magical defense.',
      },
    },
  ],
  // 鬼谷子（Support／ROAM）
  '189': [
    {
      ja: {
        label: '足を伸ばし、敵の回復を削る型',
        when: '敵に回復役やライフスティールを持つヒーローがいて、広く動き回りたいとき',
        text: '1品目の極影の盾・閃光は自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にも半分を配ります。4品目の永夜の守護と5品目の夢魔の牙で移動速度を足し、夢魔の牙は命中した敵のHP回復とライフスティールも落とします。最後の覇者の重装でHPを大きく足します。',
      },
      en: {
        label: 'Faster roaming and cut enemy healing',
        when: 'When the enemy has healers or lifesteal heroes and he wants to roam widely',
        text: 'Crimson Shadow - Radiance comes first, raising his attack speed and cooldown reduction and giving allies in range half of the effect. Longnight Guardian, fourth, and Venomous Staff, fifth, add movement speed, and Venomous Staff also cuts the healing and lifesteal of enemies it hits. Overlord\'s Platemail at the end adds a lot of Health.',
      },
    },
    {
      ja: {
        label: '物理防御を厚くして受け止める型',
        when: '敵に物理アタッカーが多く、正面から受け止めたいとき',
        text: '3品目のブリザードから、防御の装備が4つ続きます。4品目の魔女のマントは魔法防御の一部を物理防御に変え、魔法ダメージを防ぐシールドも定期的に張ります。5品目の不吉な予兆は攻撃してきた相手の攻撃速度と移動速度を落とし、凍結のアクティブを持つフロストショックは最後に回ります。',
      },
      en: {
        label: 'Thick physical defense to absorb hits',
        when: 'When the enemy has many physical attackers and he wants to take them head-on',
        text: 'From Glacial Buckler, third, four defensive items follow in a row. Succubus Cloak, fourth, turns part of his magical defense into physical defense and regularly raises a shield against magical damage. Ominous Premonition, fifth, lowers the attack and movement speed of anyone who hits him, and Frigid Charge, with its freezing active, comes last.',
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
        text: 'Crimson Shadow - Redemption comes first: it raises Da Qiao\'s attack speed and cooldown reduction and gives allies in range half of the effect. Its active, Rescue, shields teammates within range, just like Build 2\'s first item. Ominous Premonition, the fourth item, lowers the attacker\'s Attack Speed and Movement Speed when she is hit, so physical attackers who focus her have a harder time. Augur\'s Word finishes the build with Magical Attack and Health, plus defense that scales with Magical Attack.',
      },
    },
    {
      ja: {
        label: '防御オーラと回復低下の型',
        when: '敵に回復やライフスティールに頼るヒーローがいるとき',
        text: '1品目をガーディアン・救済に替え、自分の物理防御と魔法防御を上げて、味方にもその半分を配ります。5品目のブリザードは、大きな一撃を受けると周りの敵の攻撃速度と移動速度を下げる装備です。最後の夢魔の牙は魔法攻撃が大きく、通常攻撃やスキルが当たった敵のHP回復とライフスティールを落とします。抵抗の靴、サンライズケープ、魔女のマントは2本で共通です。',
      },
      en: {
        label: 'Defense aura and healing cut',
        when: 'When the enemy has heroes who rely on healing or Lifesteal',
        text: 'Guardian - Redemption takes the first slot, raising her physical and magical defense and giving allies half of the effect. Glacial Buckler, the fifth item, lowers nearby enemies\' Attack Speed and Movement Speed when a single big hit lands on her. Venomous Staff closes the build with a large amount of Magical Attack and cuts Health recovery and Lifesteal on anything her Basic Attacks or skills hit. Boots of Resistance, Dawnlight and Succubus Cloak are shared by both builds.',
      },
    },
  ],
  // 黄忠（Marksman／FARM）
  '192': [
    {
      ja: {
        label: 'ジャッジメントと暴風で粘って撃つ型',
        when: '敵に回復やライフスティールを持つヒーローが多いとき',
        text: '速攻の靴のあと、シャドーブレードとエンドレスブレードでクリティカル率を積みます。4品目のジャッジメントで物理ライフスティールと、当てた敵の回復を落とす効果を持ち、5品目の暴風は、当てると攻撃速度・移動速度・ダメージが上限まで重なって上がります。物理防御貫通を持つ威光の弓は、最後の6品目です。',
      },
      en: {
        label: 'Mortal Punisher and Tempest to shoot while surviving',
        when: 'When the enemy has many heroes with healing or lifesteal',
        text: 'After Boots of Dexterity, Shadow Ripper and Eternity Blade stack critical rate. Mortal Punisher, fourth, brings physical lifesteal and cuts the healing of enemies he hits, and Tempest, fifth, stacks attack speed, movement speed and damage on hit, up to a cap. Daybreaker\'s Virtue, which carries physical pierce, comes last.',
      },
    },
    {
      ja: {
        label: '威光の弓を4品目に繰り上げる型',
        when: '敵に物理防御の高い前衛が多いとき',
        text: '3品目までは同じ並びで、4品目に威光の弓を繰り上げます。遠距離のヒーローは、威光の弓が足す物理防御貫通と通常攻撃ダメージの増加分が2倍になるので、硬い前衛を早く削れます。最後のサンセットチェイサーはアクティブで、少しの間通常攻撃の射程と移動速度を上げます。',
      },
      en: {
        label: 'Daybreaker\'s Virtue moved up to fourth',
        when: 'When the enemy has many frontliners with high physical defense',
        text: 'The first three items match, and Daybreaker\'s Virtue moves up to fourth. Ranged heroes get double the physical pierce and Basic Attack damage from Daybreaker\'s Virtue, so he chips tough frontliners down earlier. Sunchaser closes the build, with an active that briefly raises Basic Attack range and movement speed.',
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
        label: '回復と復活で居座る型',
        when: '敵の前衛が厚く、集団戦で長く殴り続けたいとき',
        text: '2品目の速攻の靴で、攻撃速度と通常攻撃のたびのHP回復を早く持ちます。4品目のブラッドエッジは物理ライフスティールを足し、スキルによる物理ライフスティールも足します。最後の賢者の庇護は、倒されても少し待ってその場で復活できる装備です。',
      },
      en: {
        label: 'Healing and a revive to stay in',
        when: 'When the enemy front line is thick and you want to keep hitting through long teamfights',
        text: 'Boots of Dexterity, second, bring early attack speed and Health on every Basic Attack. Bloodweeper, fourth, adds physical lifesteal and boosts lifesteal from skill damage. Sage\'s Sanctuary closes the build and lets him revive on the spot a moment after he falls.',
      },
    },
    {
      ja: {
        label: '防御の靴と追加HPへのダメージで硬い敵を削る型',
        when: '敵にHPの高いタンクが多いとき',
        text: '2品目の抵抗の靴で、物理防御と魔法防御、耐性を足します。マスターブレードが4品目に繰り上がり、クリティカル率がビルド1より早く入ります。アルカナは紅月を多く入れて、攻撃速度とクリティカル率を足しています。5品目のドゥームズデイは通常攻撃に相手の追加HPに応じたダメージを上乗せし、最後の蒼天の剣で物理防御も足します。',
      },
      en: {
        label: 'Defensive boots and extra-Health damage against tough targets',
        when: 'When the enemy has many high-Health tanks',
        text: 'Boots of Resistance, second, add physical defense, magical defense and Resistance. Master Sword moves up to fourth, so critical rate arrives earlier than in build 1. The arcana lean on Red Moon for attack speed and critical rate. Doomsday, fifth, adds damage based on the target\'s extra Health to his Basic Attacks, and Pure Sky at the end adds physical defense.',
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
        text: '共通の5品のあと、最後にグレートブレイカーを積みます。HPが半分を切った敵へのダメージが増えるので、削った相手を仕留める力が上がります。アルカナは略奪を10枠まで使い、ライフスティールに寄せています。最後の1品がビルド1より高いぶん、そろうのは少し遅れます。',
      },
      en: {
        label: 'Finish off wounded targets',
        when: 'When the enemy fields high-HP frontliners you need to finish off',
        text: 'After the shared five items, Overlord\'s Might fills the last slot. It adds damage against enemies below half HP, so targets already worn down are easier to finish. All ten Reaver arcana go into lifesteal. The last item costs more than build 1\'s, so it arrives a little later.',
      },
    },
  ],
  // 棋星（Mage／MID）
  '197': [
    {
      ja: {
        label: '魔法攻撃と貫通を積む型',
        when: '敵が魔法防御を積んでいて、後衛を早く落としたいとき',
        text: '秘法の靴で魔法防御貫通を早く持ち、2品目の夢魔の牙で当てた敵のHP回復とライフスティールを落とします。フローズンブレスと神喰らいの書でHPも足しつつ、5品目のヴォイドスタッフで魔法防御貫通を大きく上げます。最後の賢者の怒りが魔法攻撃を割合で伸ばすので、ビルド2より火力に寄った並びになります。',
      },
      en: {
        label: 'Magical attack and pierce',
        when: 'When the enemy builds magical defense and you want to take down back-liners quickly',
        text: 'Boots of the Arcane bring magic pierce early, and Venomous Staff, second, cuts the healing and lifesteal of enemies he hits. Frozen Breath and Insatiable Tome add Health as well, and Void Staff, fifth, raises magic pierce sharply. Savant\'s Wrath closes the build by raising magical attack by a percentage, making this the more damage-focused of the two builds.',
      },
    },
    {
      ja: {
        label: 'HPとクールダウン短縮で戦い続ける型',
        when: '敵にHPの高い前衛が多く、戦いが長引きそうなとき',
        text: '2品目の苦痛のマスクは、スキルを当てた相手の現在のHPに応じた魔法ダメージを重ねるので、HPの多い前衛ほどよく効きます。4品目のトワイライトストームは、敵ヒーローにダメージを与えるたびに魔法防御貫通を積み上げます。最後の時の預言は物理防御と魔法防御を足し、レベルアップのたびにHPとMPを戻してくれます。',
      },
      en: {
        label: 'Health and cooldown reduction to keep fighting',
        when: 'When the enemy has many high-Health frontliners and fights are likely to drag on',
        text: 'Mask of Agony, second, deals repeated magical damage based on the current Health of enemies his skills hit, so it works best against Health-heavy frontliners. Twilight Stream, fourth, builds up magic pierce each time he damages an enemy hero. Augur\'s Word closes the build, adding physical and magical defense and restoring Health and mana each time he levels up.',
      },
    },
  ],
  // モンキ（Fighter／JUNGLE）
  '198': [
    {
      ja: {
        label: 'HPと防御を厚くする型',
        when: '敵に物理と魔法の火力が両方いて、前で受けたいとき',
        text: '1品目はスマイト用のグリードバイトで、3品目までは2本とも同じ並びです。4品目の蒼天の剣はアクティブで少しの間被ダメージを軽減し、5品目のディープフロストは命中した敵の足を鈍らせて追加の物理ダメージを与えます。最後の覇者の重装でHPを大きく足し、敵の攻撃を受けていない間は回復も速くなります。',
      },
      en: {
        label: 'Thicker Health and defenses',
        when: 'When the enemy has both physical and magical damage and he wants to absorb it up front',
        text: 'The first item is Rapacious Bite, which requires Smite, and both builds share the same order through the third item. Pure Sky, fourth, briefly reduces damage taken with its active, and Deepfrost Siege, fifth, slows enemies it hits and deals extra physical damage. Overlord\'s Platemail at the end adds a lot of Health and speeds up his regeneration while enemies aren\'t attacking him.',
      },
    },
    {
      ja: {
        label: 'クリティカルで削る型',
        when: '敵の前衛が少なく、殴り続ける時間を取れるとき',
        text: '4品目をエンドレスブレードに替えて、クリティカル率とクリティカル効果を伸ばします。蒼天の剣は5品目に下がり、最後の暴風は、当てると攻撃速度・移動速度・ダメージが上限まで重なって上がります。物理防御・魔法防御とHPはビルド1より低くなります。',
      },
      en: {
        label: 'Critical hits to wear them down',
        when: 'When the enemy has few frontliners and he has time to keep attacking',
        text: 'Eternity Blade takes the fourth slot, raising critical rate and critical damage. Pure Sky drops to fifth, and Tempest at the end stacks attack speed, movement speed and damage on hit, up to a cap. His physical defense, magical defense and Health end up lower than in build 1.',
      },
    },
  ],
  // 公孫離（Marksman／FARM）
  '199': [
    {
      ja: {
        label: 'スパークダガーを先に持つ型',
        when: 'レーン戦で有利が取れていて、火力を早く持ちたいとき',
        text: '装備6品もアルカナもビルド2と同じで、違うのは最初の2品の順番だけです。このビルドはスパークダガーを先に買い、通常攻撃3回ごとに電撃を放つ効果と攻撃速度を靴より先に持ちます。そろったあとの性能はビルド2と変わりません。',
      },
      en: {
        label: 'Sparkforged Dagger first',
        when: 'When you are ahead in lane and want damage early',
        text: 'The six items and the arcana match build 2; only the order of the first two items differs. This build buys Sparkforged Dagger first, getting its lightning strike every third basic attack and its attack speed before the boots. Once complete, it performs the same as build 2.',
      },
    },
    {
      ja: {
        label: '靴を先に持つ型',
        when: '相手のガンクが早く、序盤から逃げ足を確保したいとき',
        text: '速攻の靴を先に買い、移動速度と攻撃速度を早く持ちます。速攻の靴は通常攻撃のたびにHPを少し戻すので、レーンに残りやすくなります。装備6品もアルカナもビルド1と同じで、そろったあとの性能に差はありません。',
      },
      en: {
        label: 'Boots first',
        when: 'When enemy ganks come early and you want escape speed from the start',
        text: 'Boots of Dexterity come first for early movement speed and attack speed. The boots also restore a little Health on every basic attack, which helps her stay in lane. The six items and arcana match build 1, so there is no difference once the build is complete.',
      },
    },
  ],
  // 明世隠（Support／ROAM）
  '501': [
    {
      ja: {
        label: '魔法防御とHPを先に厚くする型',
        when: '敵の主な火力が魔法ダメージで、前に出て味方を守りたいとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げて範囲内の味方にも半分を配り、アクティブで味方にシールドを張ります。装備の違いは4品目の魔女のマントと6品目の夢魔の牙だけで、アルカナはこちらが宿命、ビルド2が聖人です。このビルドは魔女のマントで魔法防御とHPを厚くします。魔女のマントは、一定時間ごとに魔法ダメージを防ぐシールドも張ります。',
      },
      en: {
        label: 'Magical defense and Health first',
        when: 'When the enemy\'s main damage is magical and he wants to step forward and protect his team',
        text: 'Guardian - Redemption comes first, raising his physical and magical defense, giving allies in range half of the effect, and shielding teammates with its active. The items differ only in Succubus Cloak, fourth, and Venomous Staff, sixth; the arcana take Fate here and Saint in build 2. This one thickens his magical defense and Health with Succubus Cloak. Succubus Cloak also periodically grants a shield against magic damage.',
      },
    },
    {
      ja: {
        label: '魔法攻撃を先に持ち、回復も落とす型',
        when: '敵に回復やライフスティールで粘るヒーローがいるとき',
        text: '4品目に賢者の怒り、5品目に賢者の天書と続け、魔法攻撃を先に大きく足します。最後の夢魔の牙で、当てた敵のHP回復とライフスティールを落とします。HPと魔法防御はビルド1より低くなります。',
      },
      en: {
        label: 'Magic attack first, plus anti-heal',
        when: 'When the enemy has heroes who hold on with healing or lifesteal',
        text: 'Savant\'s Wrath, fourth, and Sage\'s Tome, fifth, add a lot of magic attack early. Venomous Staff at the end cuts the healing and lifesteal of enemies he hits. His Health and magical defense end up lower than in build 1.',
      },
    },
  ],
  // タイガー（Fighter／JUNGLE）
  '502': [
    {
      ja: {
        label: '物理防御貫通を先に持つ型',
        when: '敵に物理防御の高い前衛が多いとき',
        text: '2本の違いは3品目と4品目の順番だけで、装備もアルカナも同じです。こちらは3品目にシャドーアックスを置き、物理防御貫通を先に持ちます。追撃の減速と物理防御が付く氷霜のグリップは、4品目に回ります。',
      },
      en: {
        label: 'Physical Pierce first',
        when: 'When the enemy has many frontliners with high physical defense',
        text: 'The only difference between the two builds is the order of the third and fourth items; the items and arcana are the same. This one puts Axe of Torment third for early Physical Pierce. Frostscar\'s Embrace, with its follow-up slow and physical defense, moves to fourth.',
      },
    },
    {
      ja: {
        label: '追撃と物理防御を先に持つ型',
        when: '敵に足の速いヒーローが多く、追いきりたいとき',
        text: 'こちらは3品目に氷霜のグリップを置きます。スキルを使ったあとの通常攻撃が範囲の敵に追加のダメージを与えて足を鈍らせ、物理防御も先に入ります。シャドーアックスの物理防御貫通は4品目に回ります。',
      },
      en: {
        label: 'Chase and physical defense first',
        when: 'When the enemy has many fast heroes and he wants to run them down',
        text: 'This one puts Frostscar\'s Embrace third. His Basic Attack after a skill deals extra damage to enemies in an area and slows them, and his physical defense comes in early. Axe of Torment\'s Physical Pierce moves to fourth.',
      },
    },
  ],
  // バイロン（Fighter／CLASH）
  '503': [
    {
      ja: {
        label: '靴から入り、HPと回復阻害を積む型',
        when: '敵に回復やライフスティールに頼るヒーローが多いとき',
        text: '1品目に抵抗の靴を置き、2品目の紅蓮のマントで周りの敵に燃焼を付けます。燃焼が当たった敵はHP回復とライフスティールが落ちるので、回復で粘る相手と殴り合う時間が長いほど効いてきます。蒼天の剣は4品目まで下がり、最後の覇者の重装で最大HPと自然回復を伸ばして仕上げます。',
      },
      en: {
        label: 'Boots first, Health and anti-healing',
        when: 'When several enemies rely on healing or lifesteal',
        text: 'Boots of Resistance come first, and Blazing Cape, the second item, burns enemies around him. Enemies hit by the burn lose some of their healing and lifesteal, so it matters more the longer he brawls with sustain-reliant opponents. Pure Sky drops to fourth, and Overlord\'s Platemail finishes the build with more max Health and natural recovery.',
      },
    },
    {
      ja: {
        label: '蒼天の剣から入り、攻撃と貫通を足す型',
        when: '敵の前衛が硬く、物理防御を積んでくるとき',
        text: '1品目に蒼天の剣を置き、スキルが最初に当たった敵ヒーローを減速させながら、受けるダメージを抑えます。5品目のフロストショックは、制圧以外のハードCCを受けたときにシールドを張る装備です。最後の砕星の槌で物理防御貫通を足すので、物理防御を積んだ前衛にもダメージが通りやすくなります。',
      },
      en: {
        label: 'Pure Sky first, attack and pierce',
        when: 'When the enemy frontline is tough and stacks physical defense',
        text: 'Pure Sky comes first: it slows the first enemy hero his skills hit and reduces the damage he takes. Frigid Charge, fifth, gives him a shield when he is hit by hard crowd control other than suppression. Starbreaker closes the build with physical pierce, so damage gets through frontliners who stack physical defense.',
      },
    },
  ],
  // ミレディ（Mage／MID）
  '504': [
    {
      ja: {
        label: '範囲の爆発を早めに持つ型',
        when: '敵にタンクやHPの多いヒーローが1体以下のとき',
        text: '2品目の残響の杖は、スキルが当たると周りに爆発を起こすので、ミニオンの列と敵をまとめて削れます。続くフローズンブレスとトワイライトストームはどちらもクールダウンを縮め、当てた相手の減速と、魔法防御貫通の積み上げを足します。アルカナは生贄でクールダウン短縮を補っているぶん、魔法防御貫通はビルド2より低めです。相手の現在HPを削る苦痛のマスクは最後に回るので、硬い相手への削りが立ち上がるのは後半になります。',
      },
      en: {
        label: 'Area explosions early',
        when: 'When the enemy has at most one tank or high-HP hero',
        text: 'Scepter of Reverberation comes second and sets off an explosion when a skill lands, so minion waves and enemies get chipped together. Frozen Breath and Twilight Stream follow; both cut cooldowns, one slowing whoever it hits and the other stacking magic pierce. The Tribute arcana cover cooldown reduction here, so magic pierce ends up lower than in build 2. Mask of Agony, which deals damage based on the target\'s current HP, comes last, so the damage against tough targets arrives late.',
      },
    },
    {
      ja: {
        label: '割合の削りを先に持つ型',
        when: '敵にタンクやHPの多いヒーローが2体以上いるとき',
        text: '2品目に苦痛のマスクを置き、スキルが当たった相手に現在HPに応じた削りを入れます。HPの多い相手ほど削る量が増えるので、前衛が並ぶ相手にも早い時間から手応えが出ます。アルカナは心眼を10枠に振り、魔法防御を積んだ相手にもダメージを通しやすくしています。最後の夢魔の牙は、当てた敵のHP回復とライフスティールを落とす装備です。',
      },
      en: {
        label: 'Percent-HP damage first',
        when: 'When the enemy draft has two or more tanks or high-HP heroes',
        text: 'Mask of Agony comes second, adding damage based on the target\'s current HP when a skill hits. The more HP a target has, the more it takes, so this pays off early against a line of frontliners. All ten Mind\'s Eye arcana go into magic pierce, which helps damage get through enemies who stack magical defense. Venomous Staff closes the build and cuts the healing and lifesteal of anyone it hits.',
      },
    },
  ],
  // 瑶（Support／ROAM）
  '505': [
    {
      ja: {
        label: '回復をつなぎ、凍らせる型',
        when: '敵に魔法ダメージのヒーローが1体以下のとき',
        text: 'ビルド2との違いは2品だけです。1品目の極影の盾・星泉は範囲内の味方とリンクして、自分と味方の両方のHPとMPを回復しますが、攻撃したりされたりすると回復量が落ちます。4品目のフロストショックはアクティブで周りの敵を減速させてから凍らせられるので、味方に飛び込んできた敵の足を止めるのに使えます。',
      },
      en: {
        label: 'Linked healing and a freeze',
        when: 'When the enemy has one magical damage hero or none',
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
        when: '敵の主な火力が物理攻撃で、集団戦が長引きやすいとき',
        text: '2本の違いは2品目の靴と最後の1品だけで、ほかの4品は同じです。2品目の速攻の靴は攻撃速度を上げ、通常攻撃のたびにHPが戻ります。最後の蒼天の剣は物理防御を足し、スキルが当たったあと少しの間被ダメージも減らします。',
      },
      en: {
        label: 'Attack speed first, toughness last',
        when: 'When the enemy\'s main damage is physical and teamfights tend to drag on',
        text: 'The only differences between the two builds are the boots, second, and the last item; the other four are the same. Boots of Dexterity, second, raise attack speed and restore Health with each Basic Attack. Pure Sky at the end adds physical defense and briefly reduces damage taken after his skill hits.',
      },
    },
    {
      ja: {
        label: '靴の時点で防御を先に取る',
        when: '敵に魔法攻撃のヒーローが多く、序盤から狙われるとき',
        text: '2品目の抵抗の靴で、物理防御・魔法防御と耐性を先に持ちます。最後の名刀・司命は、致命傷を受けても倒れずに少しの間無敵になり、攻撃速度と移動速度も上がります。最大HPはビルド1より高く、クールダウン短縮は低くなります。',
      },
      en: {
        label: 'Defense from the boots',
        when: 'When the enemy has many magical damage heroes and targets him from early on',
        text: 'Boots of Resistance, second, bring early physical defense, magical defense and Resistance. Destiny at the end keeps him from dying to a fatal blow, making him briefly invincible and raising his attack speed and movement speed. His max Health is higher than in build 1, and his cooldown reduction is lower.',
      },
    },
  ],
  // 李信（Fighter／CLASH）
  '507': [
    {
      ja: {
        label: 'クリティカルとライフスティールで殴り続ける',
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
        label: 'ライフスティールと復活で粘る型',
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
        label: '回復の妨害と自分の回復を先に持つ型',
        when: '敵に回復役やライフスティールを持つヒーローがいるとき',
        text: '2品目の夢魔の牙で、当てた敵のHP回復とライフスティールを落とします。3品目の神喰らいの書で魔法ライフスティールを足し、その値に応じてクールダウン短縮も増えます。ヴォイドスタッフは最後の6品目に回り、スペルはバーサークを持ちます。',
      },
      en: {
        label: 'Anti-heal and self-healing first',
        when: 'When the enemy has healers or heroes with lifesteal',
        text: 'Venomous Staff, second, cuts the healing and lifesteal of enemies she hits. Insatiable Tome, third, adds magical lifesteal along with cooldown reduction based on it. Void Staff moves to sixth, and the spell is Frenzy.',
      },
    },
    {
      ja: {
        label: '魔法攻撃を先に積み、保険も持つ型',
        when: '敵にCCが多く、狙われやすいとき',
        text: '2品目の残響の杖と3品目の賢者の怒りで、魔法攻撃を先に積みます。4品目の灼熱の杖は、HPが減るとかかっているCCを解除してシールドを張ります。最後の巫術の杖は、スキルのあとの通常攻撃に魔法ダメージを足し、スペルはビルド1のバーサークに代わってフラッシュを持ちます。',
      },
      en: {
        label: 'Magic attack first, with insurance',
        when: 'When the enemy has a lot of crowd control and she is likely to be targeted',
        text: 'Scepter of Reverberation, second, and Savant\'s Wrath, third, stack magic attack early. Ardent Dominion, fourth, removes crowd control and grants a shield when her Health drops. Staves of Sorcery at the end adds magical damage to the Basic Attack after a skill, and the spell is Flash instead of build 1\'s Frenzy.',
      },
    },
  ],
  // アレン（Fighter／CLASH）
  '514': [
    {
      ja: {
        label: '攻撃速度を先に持ち、CCにはシールドで備える型',
        when: '敵にハードCCが多いとき',
        text: '2品目のスパークダガーで攻撃速度と移動速度を早く持ち、通常攻撃3回ごとの電撃で魔法ダメージも足します。5品目のフロストショックは、制圧以外のハードCCを受けるとシールドを張り、アクティブで周りの敵を凍らせます。最後の覇者の重装で最大HPを大きく上げます。',
      },
      en: {
        label: 'Attack speed first, shield against crowd control',
        when: 'When the enemy has a lot of hard crowd control',
        text: 'Sparkforged Dagger, second, brings early attack speed and movement speed and adds magical damage with a lightning strike every third Basic Attack. Frigid Charge, fifth, grants a shield when hard crowd control other than suppression lands, and its active freezes nearby enemies. Overlord\'s Platemail at the end raises max Health sharply.',
      },
    },
    {
      ja: {
        label: '防御を先に固め、最後に攻撃も足す型',
        when: '敵に物理ダメージのヒーローが多く、序盤から削られやすいとき',
        text: '2品目を紅蓮のマントにして、HPと物理防御・魔法防御を先に固め、燃焼で敵のHP回復とライフスティールも落とします。最後の猛攻の鎧は、ダメージを受けると与ダメージと移動速度が上限まで重なって上がります。物理防御はビルド1より厚い並びです。',
      },
      en: {
        label: 'Defense first, damage at the end',
        when: 'When the enemy has many physical damage heroes and he is likely to be worn down early',
        text: 'Blazing Cape moves up to second, locking in Health and physical and magical defense early while its burn cuts enemy healing and lifesteal. Cuirass of Savagery at the end stacks damage and movement speed, up to a cap, as he takes damage. His physical defense is thicker than in build 1.',
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
        label: '狩猟を多めにして足を速くする型',
        when: '敵に近づいてくるヒーローが多く、距離を保ちたいとき',
        text: '装備6品も買う順もビルド2と同じで、違うのはアルカナの1枠だけです。このビルドは狩猟を1枠多く残し、攻撃速度と移動速度をわずかに上乗せしています。2品目の夢魔の牙が当てた敵のHP回復とライフスティールを落とし、5品目の賢者の怒りで魔法攻撃そのものを割合で伸ばします。',
      },
      en: {
        label: 'Extra Hunt for movement',
        when: 'When the enemy has many heroes who dive in and you want to keep your distance',
        text: 'The six items and their order match build 2; the only difference is one arcana slot. This build keeps one more Hunt slot for a little more attack speed and movement speed. Venomous Staff, second, cuts the healing and lifesteal of enemies it hits, and Savant\'s Wrath, fifth, raises magic attack itself by a percentage.',
      },
    },
    {
      ja: {
        label: '輪廻を1枠増やしてHPを吸う型',
        when: '敵に狙われやすく、レーンに長く残りたいとき',
        text: '装備6品と買う順はビルド1と同じで、アルカナの狩猟を1枠減らして輪廻を1枠増やしています。差は小さく、ライフスティールが少し厚くなるかわりに移動速度が少し落ちる程度です。4品目の神喰らいの書が魔法ダメージの一部をHPとして吸うので、輪廻の分もそこに重なります。',
      },
      en: {
        label: 'One more Reincarnation for lifesteal',
        when: 'When enemies are likely to focus you and you want to stay in lane longer',
        text: 'The six items and their order match build 1, with one Hunt slot moved to Reincarnation. The difference is small: a little more lifesteal for a little less movement speed. Insatiable Tome, fourth, turns part of her magic damage into healing, and the extra Reincarnation stacks on top of that.',
      },
    },
  ],
  // 曜（Fighter／JUNGLE）
  '522': [
    {
      ja: {
        label: 'クールダウン短縮でスキルを回す型',
        when: 'スキルの回転を上げて、ガンクの回数を増やしたいとき',
        text: '違うのは2品目の靴だけで、このビルドは静謐の靴でクールダウン短縮を足します。1品目のグリードバイトはモンスターを倒すたびに物理攻撃とクールダウン短縮が少しずつ積み上がり、靴と合わせてスキルを回す間隔が短くなります。残りのシャドーアックス・猛攻の鎧・グレートブレイカー・マスターブレードは、買う順もビルド2と同じです。',
      },
      en: {
        label: 'Cooldown reduction to cycle skills',
        when: 'When you want to cycle skills faster and gank more often',
        text: 'Only the boots differ: this build adds cooldown reduction with Boots of Tranquility. Rapacious Bite, first, gradually stacks physical attack and cooldown reduction each time he kills a monster, so together with the boots his skills come back faster. The remaining Axe of Torment, Cuirass of Savagery, Overlord\'s Might and Master Sword are bought in the same order as build 2.',
      },
    },
    {
      ja: {
        label: '抵抗の靴で耐性を足す型',
        when: '敵に魔法ダメージのヒーローや、行動を止めるスキルが多いとき',
        text: '2品目を抵抗の靴にして、物理防御と魔法防御、耐性を足します。残りの5品と買う順はビルド1と同じで、その代わりにクールダウン短縮はビルド1より低くなります。',
      },
      en: {
        label: 'Boots of Resistance for Resistance',
        when: 'When the enemy has many magic damage heroes or skills that stop him',
        text: 'Boots of Resistance take the second slot, adding physical defense, magical defense and Resistance. The other five items and their order match build 1, but his cooldown reduction is lower than in build 1.',
      },
    },
  ],
  // 西施（Mage／MID）
  '523': [
    {
      ja: {
        label: 'HPを魔法攻撃と貫通に変える型',
        when: '敵にHPの高い前衛が多いとき',
        text: '疾風の靴から5品目の神喰らいの書まで、HPの付く装備が続きます。3品目の苦痛のマスクはスキルを当てた相手の現在のHPに応じた魔法ダメージを重ね、4品目の羽化の衣が追加HPに応じて魔法攻撃と魔法防御貫通を足します。最後のムーンライトスタッフはアクティブで少しの間すべての効果を無効化しますが、その間は動けません。',
      },
      en: {
        label: 'Turning Health into magic attack and pierce',
        when: 'When the enemy has many high-Health frontliners',
        text: 'From Boots of Deftness through Insatiable Tome, fifth, every item carries Health. Mask of Agony, third, deals repeated magical damage based on the current Health of enemies her skills hit, and Breakthrough Robe, fourth, adds magic attack and magic pierce based on her extra Health. Splendor closes the build with an active that briefly nullifies all effects, though she cannot act while it lasts.',
      },
    },
    {
      ja: {
        label: '魔法攻撃を割合で伸ばす型',
        when: '敵に回復やライフスティールを持つヒーローがいるとき',
        text: '2品目の夢魔の牙で、当てた敵のHP回復とライフスティールを早く落とします。4品目の灼熱の杖はHPが減るとかかっているCCを解除してシールドを張り、近づかれたときの保険になります。そのあとの賢者の怒りが魔法攻撃を、ヴォイドスタッフが魔法防御貫通を割合で上げるので、装備がそろうほど効きが増します。最大HPはビルド1より低くなります。',
      },
      en: {
        label: 'Percentage boosts to magic attack',
        when: 'When the enemy has heroes with healing or lifesteal',
        text: 'Venomous Staff, second, cuts the healing and lifesteal of enemies she hits early on. Ardent Dominion, fourth, removes crowd control and shields her when her Health drops, acting as insurance when enemies get close. Savant\'s Wrath then raises magic attack and Void Staff raises magic pierce by percentages, so the build gets stronger as it completes. Her max Health is lower than in build 1.',
      },
    },
  ],
  // 蒙牙（Marksman／FARM）
  '524': [
    {
      ja: {
        label: '貫通を先に持って押しきる型',
        when: '敵に回復やライフスティールを持つヒーローが多いとき',
        text: '3品目に威光の弓を置き、遠距離のヒーローは2倍になる物理防御貫通を早く持ちます。5品目のジャッジメントで物理ライフスティールと、当てた敵の回復を落とす効果を足し、最後のグレートブレイカーでHPが半分を切った敵への与ダメージを上げます。',
      },
      en: {
        label: 'Pierce first to push through',
        when: 'When the enemy has many heroes with healing or lifesteal',
        text: 'Daybreaker\'s Virtue comes third, bringing early physical pierce that doubles for ranged heroes. Mortal Punisher, fifth, adds physical lifesteal and cuts the healing of enemies he hits, and Overlord\'s Might at the end raises damage against enemies below half Health.',
      },
    },
    {
      ja: {
        label: 'クリティカル率を先に持ち、硬さと射程も足す型',
        when: '敵に飛び込み役がいて、後衛が詰められやすいとき',
        text: '3品目をエンドレスブレードにして、クリティカル率とクリティカルのダメージを先に伸ばします。5品目の猛攻の鎧で物理防御とHPを足し、最後のサンセットチェイサーはアクティブで少しの間、通常攻撃の射程と移動速度を上げます。',
      },
      en: {
        label: 'Crit first, plus toughness and range',
        when: 'When the enemy has divers and his back line is likely to be jumped',
        text: 'Eternity Blade takes the third slot, raising critical rate and critical damage early. Cuirass of Savagery, fifth, adds physical defense and Health, and Sunchaser at the end has an active that briefly raises Basic Attack range and movement speed.',
      },
    },
  ],
  // 瀾（Assassin／JUNGLE）
  '528': [
    {
      ja: {
        label: '魔法にも耐える締め方',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '4品目まではビルド2と同じで、どちらもスマイトで買えるグリードバイトから入ります。5品目の不吉な予兆はダメージを受けると攻撃してきた相手の攻撃速度と移動速度を下げ、最後の破魔の霊刀は物理攻撃を保ったまま魔法防御を足します。魔法ダメージの多い相手に、攻撃を落としすぎずに守りを固める並びです。',
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
        when: '敵に魔法ダメージのヒーローが1体以下のとき',
        text: '5品目の猛攻の鎧は、ダメージを受けるたびに与ダメージと移動速度が重なるので、乱戦に長くいるほど攻撃が重くなります。最後のグレートブレイカーはHPが半分を切った敵への与ダメージを上げる装備で、削った相手を倒しきる力が伸びます。魔法防御はビルド1より薄くなるため、魔法ダメージの少ない相手を選んで使います。',
      },
      en: {
        label: 'Close out wounded targets',
        when: 'When the enemy has one magical damage hero or none',
        text: 'Cuirass of Savagery in fifth stacks damage and Movement Speed every time he takes damage, so the longer he stays in a brawl the harder he hits. Overlord\'s Might at the end raises damage against enemies below half Health, making it easier to finish the targets he has worn down. Magical defense ends up lower than in build 1, so save it for drafts with little magical damage.',
      },
    },
  ],
  // 鏡（Assassin／JUNGLE）
  '531': [
    {
      ja: {
        label: 'アルカナを貫通に寄せる型',
        when: '敵に物理防御の高い前衛が多いとき',
        text: '装備の顔ぶれも買う順も2本とも同じで、違うのはアルカナだけです。このビルドは変異を多めにして隠匿も入れ、物理攻撃と物理防御貫通に寄せています。装備は3品目のシャドーアックスと最後の砕星の槌で、物理防御貫通を固定値と割合の両方で足します。',
      },
      en: {
        label: 'Arcana leaning into pierce',
        when: 'When the enemy has many frontliners with high physical defense',
        text: 'Both builds use the same items in the same order; only the arcana differ. This one leans into Mutation and adds Stealth, favoring physical attack and physical pierce. On the item side, Axe of Torment, third, and Starbreaker at the end add physical pierce both as a flat value and as a percentage.',
      },
    },
    {
      ja: {
        label: '攻撃速度に寄せて手数を出す型',
        when: '敵の前衛が少なく、通常攻撃で削りきりたいとき',
        text: '隠匿の代わりに狩猟を入れ、紅月も増やして、攻撃速度とクリティカル率に寄せています。攻撃速度が上がるぶん、速攻の靴の通常攻撃ごとの回復も多く入ります。物理防御貫通はビルド1より低くなります。',
      },
      en: {
        label: 'Arcana leaning into attack speed',
        when: 'When the enemy has few frontliners and she wants to finish targets with Basic Attacks',
        text: 'Hunt replaces Stealth and Red Moon gets more slots, favoring attack speed and critical rate. With the higher attack speed, Boots of Dexterity\'s healing on each Basic Attack also adds up faster. Physical pierce is lower than in build 1.',
      },
    },
  ],
  // アグド（Marksman／JUNGLE）
  '533': [
    {
      ja: {
        label: 'クリティカル率で一撃を伸ばす型',
        when: '敵の前衛が少なく、後衛を早く落としたいとき',
        text: '3品目のシャドーブレードと4品目のエンドレスブレードで、クリティカル率を先に積みます。エンドレスブレードはクリティカル率に応じてクリティカルのダメージも上げるので、集めるほど一撃が伸びます。5品目のブラッドエッジで物理ライフスティールとHPを足し、物理防御貫通を持つ威光の弓は最後の6品目です。',
      },
      en: {
        label: 'Critical rate for heavier hits',
        when: 'When the enemy has few frontliners and you want to take down back-liners quickly',
        text: 'Shadow Ripper, third, and Eternity Blade, fourth, stack critical rate early. Eternity Blade also raises critical damage based on her critical rate, so the more she collects, the harder each hit lands. Bloodweeper, fifth, adds physical lifesteal and Health, and Daybreaker\'s Virtue, which carries physical pierce, comes last.',
      },
    },
    {
      ja: {
        label: 'HPと防御を足して削り続ける型',
        when: '敵にHPの高い前衛が多いとき',
        text: '3品目のディープフロストと4品目のドゥームズデイで、通常攻撃の追加ダメージとHPを一緒に積みます。ドゥームズデイの追加ダメージは相手の追加HPに応じて増えるので、HPを積んだ前衛ほど削れます。威光の弓は5品目に繰り上げ、最後の不吉な予兆で物理防御とHPを足します。',
      },
      en: {
        label: 'Health and defense to keep chipping',
        when: 'When the enemy has many high-Health frontliners',
        text: 'Deepfrost Siege, third, and Doomsday, fourth, stack extra Basic Attack damage and Health together. Doomsday\'s extra damage grows with the target\'s extra Health, so it chips Health-heavy frontliners hardest. Daybreaker\'s Virtue moves up to fifth, and Ominous Premonition at the end adds physical defense and Health.',
      },
    },
  ],
  // 啓（Support／ROAM）
  '534': [
    {
      ja: {
        label: 'HPを大きく積む前線のローム型',
        when: '敵の火力が物理と魔法に分かれていて、前で受け止めたいとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げて範囲内の味方にも半分を配り、アクティブで味方にシールドを張ります。シールドの量は最大HPに応じて増えるので、覇者の重装・不死鳥の目・不吉な予兆とHPを重ねるほど厚くなります。魔法攻撃を持つ羽化の衣は最後の6品目です。',
      },
      en: {
        label: 'Front-line roamer stacking Health',
        when: 'When the enemy\'s damage is split between physical and magical and he wants to absorb it up front',
        text: 'Crimson Shadow - Redemption comes first, raising his attack speed and cooldown reduction, giving allies in range half of the effect, and shielding teammates with its active. The shield grows with his max Health, so stacking Overlord\'s Platemail, Eye of the Phoenix and Ominous Premonition makes it thicker. Breakthrough Robe, which carries magic attack, comes last.',
      },
    },
    {
      ja: {
        label: '魔法防御貫通で削る支援型',
        when: '敵にタンクが多く、自分でも削りたいとき',
        text: '1品目のガーディアン・救済は、自分の物理防御と魔法防御を上げて範囲内の味方にも半分を配ります。秘法の靴で魔法防御貫通を早く持ち、4品目に繰り上げた羽化の衣が追加HPに応じて魔法攻撃と貫通を足します。スペルはビルド1のフラッシュに代わってヒールを持ち、最後のフローズンブレスで当てた敵の足も鈍らせます。',
      },
      en: {
        label: 'Support who chips with magic pierce',
        when: 'When the enemy has several tanks and he wants to deal damage too',
        text: 'Guardian - Redemption comes first, raising his physical and magical defense and giving allies in range half of the effect. Boots of the Arcane bring early magic pierce, and Breakthrough Robe, moved up to fourth, adds magic attack and pierce based on his extra Health. The spell is Heal instead of build 1\'s Flash, and Frozen Breath at the end also slows enemies he hits.',
      },
    },
  ],
  // シャルロット（Fighter／CLASH）
  '536': [
    {
      ja: {
        label: '貫通で削り、物理に強い型',
        when: '敵に物理ダメージのヒーローが多く、前衛も硬いとき',
        text: '1品目の静謐の靴でクールダウン短縮を先に持ち、2品目のシャドーアックスで物理防御貫通を足します。アルカナも変異と鷹の目で貫通を重ねているので、硬い前衛にもダメージが通ります。最後の不死鳥の目と不吉な予兆で守りを固め、攻撃してきた相手の攻撃速度と移動速度を下げます。',
      },
      en: {
        label: 'Pierce, tough against physical',
        when: 'When the enemy has many physical damage heroes and a tough front line',
        text: 'Boots of Tranquility bring cooldown reduction first, and Axe of Torment, second, adds physical pierce. The Mutation and Eagle Eye arcana stack even more pierce, so her damage gets through tough frontliners. Eye of the Phoenix and Ominous Premonition close the build with defense, slowing the attack speed and movement of anyone who hits her.',
      },
    },
    {
      ja: {
        label: '魔法防御とシールドで受け止める型',
        when: '敵に魔法ダメージのヒーローが2体以上いるとき',
        text: '1品目の抵抗の靴で魔法防御と耐性を先に持ちます。5品目の魔女のマントが一定の間隔で魔法ダメージを防ぐシールドを張り、6品目の猛攻の鎧は攻撃を受けるたびに与えるダメージと移動速度を重ねていきます。クールダウン短縮は靴に付かず、アルカナの虚空で少し足しています。',
      },
      en: {
        label: 'Magical defense and shields',
        when: 'When the enemy has two or more magic damage heroes',
        text: 'Boots of Resistance bring magical defense and Resistance first. Succubus Cloak, fifth, periodically shields her against magical damage, and Cuirass of Savagery, sixth, stacks damage dealt and movement speed each time she takes a hit. The boots bring no cooldown reduction, and the Void arcana add a little back.',
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
        text: 'The build splits from build 1 at the third item, where Shadow Ripper\'s critical hits briefly raise attack speed and Movement Speed. Frigid Charge in fifth grants a shield when hard crowd control other than suppression lands, and its active freezes nearby enemies. Blood Rage closes the build by adding physical damage based on extra Health to Basic Attacks, so more Health also means harder hits. The arcana switch to ones that add physical defense, and the spell is Frenzy.',
      },
    },
  ],
  // ユンエイ（Fighter／JUNGLE）
  '538': [
    {
      ja: {
        label: '防御を先に積んで最後に火力を足す型',
        when: '敵の主な火力が物理ダメージで、前衛と長く殴り合いそうなとき',
        text: '3品目にドラゴンシールドを置き、物理防御とHPを早く持ちます。ドラゴンシールドはモンスターやミニオンへのダメージを足して一部をHPとして戻し、敵ヒーローとタワーにも追加のダメージを与えます。シャドーアックスの物理防御貫通は4品目まで遅れ、最後のグレートブレイカーでHPが半分を切った敵への与ダメージを上げます。',
      },
      en: {
        label: 'Defense first, damage last',
        when: 'When the enemy\'s main damage is physical and long brawls with their front line are likely',
        text: 'Dragon\'s Rage comes third, bringing physical defense and Health early. It adds damage to monsters and minions and returns part of it as Health, and also deals extra damage to enemy heroes and towers. Axe of Torment\'s physical pierce waits until fourth, and Overlord\'s Might at the end raises damage against enemies below half Health.',
      },
    },
    {
      ja: {
        label: '貫通を先に持ち、HPと魔法防御で残る型',
        when: '敵に魔法ダメージのヒーローが多いとき',
        text: 'シャドーアックスを3品目に繰り上げ、物理防御貫通を早く持ちます。5品目のブラッドレイジは通常攻撃に追加HPに応じたダメージを乗せ、アクティブで現在のHPと引き換えにシールドを張ります。最後の魔女のマントは一定時間ごとに魔法ダメージを防ぐシールドを張り、魔法防御も大きく上げます。',
      },
      en: {
        label: 'Pierce first, then Health and magical defense',
        when: 'When the enemy has many magic damage heroes',
        text: 'Axe of Torment moves up to third for early physical pierce. Blood Rage, fifth, adds damage based on her extra Health to basic attacks, and its active trades current Health for a shield. Succubus Cloak closes the build, periodically granting a shield against magic damage and raising magical defense sharply.',
      },
    },
  ],
  // ハロルド（Assassin／JUNGLE）
  '542': [
    {
      ja: {
        label: '攻撃速度を先に伸ばす型',
        when: '敵に魔法ダメージのヒーローが少なく、通常攻撃を長く続けたいとき',
        text: '違うのは2品目の靴と5品目だけで、このビルドは速攻の靴で攻撃速度を早く持ちます。5品目の蒼天の剣は物理防御を足し、アクティブで少しの間受けるダメージを減らせます。魔法防御は付かない並びです。',
      },
      en: {
        label: 'Attack speed first',
        when: 'When the enemy has few magic damage heroes and you want to keep auto-attacking',
        text: 'Only the boots and the fifth item differ; this build takes Boots of Dexterity for early attack speed. Pure Sky, fifth, adds physical defense, and its active briefly reduces the damage he takes. This build carries no magical defense.',
      },
    },
    {
      ja: {
        label: '防御とHPを厚くする型',
        when: '敵に魔法ダメージのヒーローが多く、集団戦で狙われやすいとき',
        text: '2品目の抵抗の靴で、物理防御と魔法防御に加えて耐性を上げます。5品目のドラゴンシールドは最大HPを大きく足し、通常攻撃やスキルで敵ヒーローに追加のダメージも与えます。物理攻撃と攻撃速度は、ビルド1より低くなります。',
      },
      en: {
        label: 'Thicker defense and Health',
        when: 'When the enemy has many magic damage heroes and he is likely to be focused in teamfights',
        text: 'Boots of Resistance, second, add Resistance on top of physical and magical defense. Dragon\'s Rage, fifth, adds a large amount of max Health and extra damage to enemy heroes from Basic Attacks and skills. Physical attack and attack speed end up lower than in build 1.',
      },
    },
  ],
  // アレッシオ（Marksman／FARM）
  '545': [
    {
      ja: {
        label: 'クリティカルを先に積み、割合で締める型',
        when: '敵にHPの多い前衛が並ぶとき',
        text: '2品目にシャドーブレード、3品目にエンドレスブレードを置き、クリティカル率を早めに積みます。アルカナは禍源に無双を混ぜてクリティカルのダメージも伸ばしています。最後のドゥームズデイは、相手の追加HPに応じた追加ダメージを通常攻撃に乗せる装備で、HPを積んだ前衛ほど効いてきます。',
      },
      en: {
        label: 'Crit first, percent damage to finish',
        when: 'When the enemy fields high-Health frontliners',
        text: 'Shadow Ripper second and Eternity Blade third build critical rate early. The arcana mix Unparalleled into the Calamity slots to raise critical damage as well. Doomsday closes the build, adding damage based on the target\'s extra Health to basic attacks, so it matters most against frontliners who stack Health.',
      },
    },
    {
      ja: {
        label: '暴風でHPと攻撃速度を先に持つ型',
        when: '早い時間から前に出て、レーンを押し込みたいとき',
        text: '2品目に暴風を置き、最大HPと攻撃速度を先に持ちます。暴風は攻撃を当てるたびに攻撃速度・移動速度・ダメージが少しずつ重なっていきます。シャドーブレードとエンドレスブレードは1品ずつ後ろにずれ、ブラッドエッジも最後まで来ないので、アルカナの略奪でライフスティールを先に足しています。',
      },
      en: {
        label: 'Tempest for early Health and speed',
        when: 'When you want to step up and push the lane from early on',
        text: 'Tempest comes second, bringing Health and attack speed first. Each hit stacks a little attack speed, movement speed and damage. Shadow Ripper and Eternity Blade each move back a slot and Bloodweeper does not arrive until the end, so the Reaver arcana add lifesteal early.',
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
        label: '物理防御と反射で受ける型',
        when: '敵の主な火力が物理ダメージで、殴り合いが長引きそうなとき',
        text: '3品目に不吉な予兆を早めに入れ、攻撃してきた相手の攻撃速度と移動速度を落とします。物理防御はビルド2より厚くなり、5品目のスパイクアーマーはアクティブで少しの間、受けたダメージの一部を相手に返します。最後の永夜の守護は短い間に大きなダメージを受けるとHPを回復します。',
      },
      en: {
        label: 'Physical defense and reflection',
        when: 'When the enemy\'s main damage is physical and brawls are likely to drag on',
        text: 'Ominous Premonition comes early, third, slowing the attack and movement speed of anyone who hits him. His physical defense ends up thicker than in build 2, and Spikemail, fifth, has an active that briefly returns part of the damage he takes. Longnight Guardian closes the build, restoring Health when he takes heavy damage in a short time.',
      },
    },
    {
      ja: {
        label: 'シールドと魔法防御を足す型',
        when: '敵に魔法ダメージのヒーローが多いとき',
        text: '3品目を不死鳥の目、4品目をブラッドレイジにして、不吉な予兆は5品目まで下げています。ブラッドレイジは通常攻撃に追加HPに応じたダメージを乗せ、アクティブで現在のHPと引き換えにシールドを張ります。最後の魔女のマントは一定時間ごとに魔法ダメージを防ぐシールドを張り、魔法防御も大きく上げます。',
      },
      en: {
        label: 'Shields and magical defense',
        when: 'When the enemy has many magic damage heroes',
        text: 'Eye of the Phoenix takes the third slot and Blood Rage the fourth, pushing Ominous Premonition down to fifth. Blood Rage adds damage based on his extra Health to basic attacks, and its active trades current Health for a shield. Succubus Cloak closes the build, periodically granting a shield against magic damage and raising magical defense sharply.',
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
        label: '靴で耐性を持ち、貫通は戦いの中で重ねる型',
        when: '敵に物理と魔法の両方のダメージがあり、早くから耐性が欲しいとき',
        text: '1品目の抵抗の靴で物理防御と魔法防御、耐性を先に持ちます。4品目のトワイライトストームは、ヒーローにダメージを与えるたびに魔法防御貫通が上限まで重なるので、当て続けている間は貫通を保てます。2品目の聖杯が時間とともにMPとHPを戻すので、レーンに長く残れます。',
      },
      en: {
        label: 'Resistance boots, pierce stacked in combat',
        when: 'When the enemy deals both physical and magical damage and you want Resistance early',
        text: 'Boots of Resistance come first, bringing physical and magical defense plus Resistance. Twilight Stream, fourth, stacks magic pierce up to a cap when he damages heroes, so he keeps it while he keeps hitting. Holy Grail, second, restores mana and Health over time, keeping him in lane longer.',
      },
    },
    {
      ja: {
        label: '靴でクールダウンを縮め、貫通は常に持つ型',
        when: '敵が魔法防御を積み、短い接触で削り合う展開になりそうなとき',
        text: '1品目を静謐の靴にして、クールダウン短縮を先に持ちます。4品目の羽化の衣は、追加HPに応じて魔法攻撃と魔法防御貫通を条件なしで足すので、短い接触でも貫通が乗ります。最大HPもビルド1より少し多くなります。',
      },
      en: {
        label: 'Cooldown boots, constant pierce',
        when: 'When the enemy stacks magical defense and trades are short',
        text: 'Boots of Tranquility come first for early cooldown reduction. Breakthrough Robe, fourth, adds magic attack and magic pierce based on his extra Health with no conditions, so pierce applies even in short trades. His max Health also ends up a little higher than in build 1.',
      },
    },
  ],
  // 姫小満（Fighter／CLASH）
  '564': [
    {
      ja: {
        label: 'クールダウン短縮で手数を出す型',
        when: '敵の前衛が硬く、削りきる手数が要るとき',
        text: '静謐の靴から入り、シャドーアックス・蒼天の剣・グレートブレイカーと、クールダウン短縮と物理攻撃を重ねます。5品目の猛攻の鎧で物理防御とHPを足し、最後の破魔の霊刀は物理攻撃に応じた魔法防御を上乗せします。',
      },
      en: {
        label: 'Cooldown reduction for more moves',
        when: 'When the enemy front line is tough and she needs more attacks to wear them down',
        text: 'Boots of Tranquility come first, followed by Axe of Torment, Pure Sky and Overlord\'s Might, stacking cooldown reduction and physical attack. Cuirass of Savagery, fifth, adds physical defense and Health, and Demonsbane at the end adds magical defense based on her physical attack.',
      },
    },
    {
      ja: {
        label: 'HPと耐性で前線を保つ型',
        when: '敵の火力が物理と魔法に分かれていて、前で受け止めたいとき',
        text: '1品目の抵抗の靴で、耐性と魔法防御を早く持ちます。4品目に猛攻の鎧、5品目に不死鳥の目を置いてHPを厚くし、最後の砕星の槌で物理防御貫通を割合で上げます。',
      },
      en: {
        label: 'Health and Resistance to hold the front',
        when: 'When the enemy\'s damage is split between physical and magical and she wants to absorb it up front',
        text: 'Boots of Resistance come first for early Resistance and magical defense. Cuirass of Savagery, fourth, and Eye of the Phoenix, fifth, thicken her Health, and Starbreaker at the end raises physical pierce by a percentage.',
      },
    },
  ],
  // 少司縁（Support／ROAM）
  '577': [
    {
      ja: {
        label: '攻撃速度を配り、物理を鈍らせる型',
        when: '敵に通常攻撃で戦うマークスマンや物理ファイターが多いとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げ、範囲内の味方にもその半分を配ります。4品目の不吉な予兆は、ダメージを受けると攻撃してきた相手の攻撃速度と移動速度を下げるので、通常攻撃で殴ってくる相手ほど手が鈍ります。5品目のフローズンブレスは当てた相手を減速させ、追加の魔法ダメージも乗せます。',
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
        label: 'クールダウン短縮と削りを持つ型',
        when: '味方にほかの前衛がいて、自分も削りに回れるとき',
        text: '1品目の静謐の靴で、クールダウン短縮を先に持ちます。3品目の氷霜のグリップはスキルのあとの通常攻撃に範囲の追加ダメージと減速を乗せ、4品目のブラッドレイジは通常攻撃に追加HPに応じたダメージを足します。残りの永夜の守護と不吉な予兆で、最後は守りに寄せます。',
      },
      en: {
        label: 'Cooldown reduction with some damage',
        when: 'When your team has another frontliner and you can help deal damage',
        text: 'Boots of Tranquility come first for early cooldown reduction. Frostscar\'s Embrace, third, adds area damage and a slow to the Basic Attack after a skill, and Blood Rage, fourth, adds damage based on extra Health to basic attacks. Longnight Guardian and Ominous Premonition finish the build on the defensive side.',
      },
    },
    {
      ja: {
        label: 'HPと耐性を積む前衛型',
        when: '敵にハードCCが多く、前で耐え続けたいとき',
        text: '1品目の抵抗の靴で耐性を上げ、あとはHPと防御を積み続けます。3品目の覇者の重装は最大HPを割合で増やし、HPを毎秒少しずつ自動で回復します。5品目のフロストショックは制圧以外のハードCCを受けるとシールドを張り、アクティブで周りの敵を凍らせます。スペルはビルド1のフラッシュに代わって、ターミネートを持ちます。',
      },
      en: {
        label: 'Health and Resistance up front',
        when: 'When the enemy has a lot of hard crowd control and you want to hold the front',
        text: 'Boots of Resistance add Resistance first, and the rest of the build keeps stacking Health and defense. Overlord\'s Platemail, third, increases max Health by a percentage and restores a little Health every second. Frigid Charge, fifth, grants a shield when hard crowd control other than suppression lands, and its active freezes nearby enemies. The spell is Execute instead of build 1\'s Flash.',
      },
    },
  ],
  // 元流の子（メイジ）（Mage／MID）
  '582': [
    {
      ja: {
        label: 'HPとライフスティールで撃ち続ける型',
        when: '敵にHPの高い前衛が多く、長く撃ち合いそうなとき',
        text: '1品目の秘法の靴で、魔法防御貫通と移動速度を早く持ちます。4品目のトワイライトストームは、敵ヒーローにダメージを与えるたびに魔法防御貫通が重なります。5品目の神喰らいの書は魔法ライフスティールを足し、その量に応じてクールダウン短縮も上がります。最後の苦痛のマスクは、スキルが当たった相手の現在HPの割合で魔法ダメージを重ねます。',
      },
      en: {
        label: 'Health and lifesteal to keep firing',
        when: 'When the enemy has many high-Health frontliners and long trades are likely',
        text: 'Boots of the Arcane come first for early Magical Pierce and movement speed. Twilight Stream, fourth, stacks Magical Pierce each time they damage an enemy hero, and Insatiable Tome, fifth, adds magical lifesteal along with cooldown reduction based on it. Mask of Agony at the end adds magical damage based on a percentage of the current Health of targets their skills hit.',
      },
    },
    {
      ja: {
        label: '魔法攻撃を先に積む型',
        when: '敵の前衛が少なく、短い交戦で後衛を落としたいとき',
        text: '3品目に賢者の天書、4品目に賢者の怒りを置き、魔法攻撃を先に高めます。賢者の怒りは魔法攻撃を割合で増やすので、あとから積む夢魔の牙とヴォイドスタッフの分も伸びます。最後のヴォイドスタッフが魔法防御貫通を割合で上げ、1品目は戦闘から離れるとさらに速くなる疾風の靴です。',
      },
      en: {
        label: 'Magical attack first',
        when: 'When the enemy has few frontliners and they want to take down back-liners in short fights',
        text: 'Sage\'s Tome, third, and Savant\'s Wrath, fourth, build magical attack early. Savant\'s Wrath raises magical attack by a percentage, so it also boosts what Venomous Staff and Void Staff add later. Void Staff at the end raises Magical Pierce by a percentage, and the first item is Boots of Deftness, which get even faster out of combat.',
      },
    },
  ],
  // 元流の子（マークスマン）（Marksman／FARM）
  '584': [
    {
      ja: {
        label: '前衛を削りきる型',
        when: '敵にHPの多い前衛が2体以上いるとき',
        text: '2品目にドゥームズデイを置き、相手の追加HPに応じた追加ダメージを通常攻撃に早めに乗せます。4品目の威光の弓で物理防御貫通を足し、最後のグレートブレイカーでHPが半分を切った敵へのダメージを増やします。HPを積んだ相手ほど、この並びが効いてきます。',
      },
      en: {
        label: 'Wear down the frontline',
        when: 'When the enemy fields two or more high-Health frontliners',
        text: 'Doomsday comes second, adding damage based on the target\'s extra Health to basic attacks early. Daybreaker\'s Virtue, fourth, adds physical pierce, and Overlord\'s Might closes the build by increasing damage against enemies below half Health. The more Health the enemy stacks, the more this order pays off.',
      },
    },
    {
      ja: {
        label: '射程と手数を伸ばす型',
        when: '敵に飛び込んでくるヒーローが多く、距離を保ちたいとき',
        text: '2品目をシャドーブレードにして、クリティカル率と移動速度を先に持ちます。4品目のエンドレスブレードでクリティカルのダメージを早く伸ばし、威光の弓は5品目に回します。最後のサンセットチェイサーのアクティブは、しばらく通常攻撃の射程と移動速度を上げるので、飛び込まれたときに距離を取り直す手段にもなります。',
      },
      en: {
        label: 'Range and attack speed',
        when: 'When the enemy has many divers and you want to keep your distance',
        text: 'Shadow Ripper comes second, bringing critical rate and movement speed first. Eternity Blade, fourth, raises critical damage early, and Daybreaker\'s Virtue moves to fifth. Sunchaser\'s active closes the build, briefly extending basic attack range and movement speed, which also helps open distance when divers arrive.',
      },
    },
  ],
  // フロレンティーノ（Fighter／CLASH）
  '631': [
    {
      ja: {
        label: 'クールダウン短縮と貫通で前衛を削る型',
        when: '敵の前衛が硬く、削りきる手数が要るとき',
        text: '1品目の静謐の靴からクールダウン短縮を積み、蒼天の剣・氷霜のグリップ・サンライズケープと重ねていきます。物理防御貫通はアルカナの変異と鷹の目で装備より先に持ち、最後のグレートブレイカーでHPが半分を切った敵への与ダメージを上げます。サンライズケープは敵ヒーローにダメージを与えると、自分と近くの味方にシールドを張ります。',
      },
      en: {
        label: 'Cooldown reduction and pierce against frontliners',
        when: 'When the enemy front line is tough and he needs more casts to wear them down',
        text: 'Boots of Tranquility start the cooldown reduction, stacked further with Pure Sky, Frostscar\'s Embrace and Dawnlight. Physical pierce comes from the Mutation and Eagle Eye arcana before any items, and Overlord\'s Might at the end raises damage against enemies below half Health. Dawnlight shields him and a nearby ally when he damages an enemy hero.',
      },
    },
    {
      ja: {
        label: 'HPを厚くして前で殴り合う型',
        when: '敵に物理ダメージのヒーローが多く、前で殴り合いたいとき',
        text: '1品目の忍びの靴で物理被ダメージを減らし、3品目のシャドーアックスで物理防御貫通を持ちます。5品目のブラッドレイジは通常攻撃に追加HPに応じたダメージを乗せます。アルカナは禍源と憐憫でクリティカル率とクールダウン短縮を足し、スペルはビルド1のフラッシュに代わってウィークネスを持ちます。',
      },
      en: {
        label: 'Thicker Health to brawl up front',
        when: 'When the enemy has many physical damage heroes and he wants to brawl up front',
        text: 'Boots of Fortitude cut physical damage taken, and Axe of Torment, third, brings physical pierce. Blood Rage, fifth, adds damage based on his extra Health to Basic Attacks. The Calamity and Compassion arcana add critical rate and cooldown reduction, and the spell is Intimidate instead of build 1\'s Flash.',
      },
    },
  ],
  // ロリアン（Mage／MID）
  '635': [
    {
      ja: {
        label: 'HPを吸いながら割合で削る型',
        when: '敵にHPの高い前衛が2体以上いるとき',
        text: '2品目の神喰らいの書は、魔法ダメージの一部をHPとして吸い、魔法ライフスティールの値に応じてクールダウン短縮も付きます。そのあと残響の杖と苦痛のマスクを続けて積むので、スキルが当たると範囲の爆発と、相手の現在HPに応じた削りが重なります。苦痛のマスクの削りは相手のHPが多いほど大きくなるため、前衛が厚い相手ほどこの順番が生きます。最後は賢者の怒りと賢者の天書で、魔法攻撃をさらに伸ばして仕上げます。',
      },
      en: {
        label: 'Lifesteal plus percent-HP shred',
        when: 'When the enemy fields two or more high-HP frontliners',
        text: 'Insatiable Tome comes second: it turns part of his magic damage into healing and shortens cooldowns the more lifesteal he has. Scepter of Reverberation and Mask of Agony follow, so landing a skill adds an area explosion and damage based on the target\'s current HP. Mask of Agony\'s damage grows with the target\'s HP, so this order pays off most against thick frontliners. Savant\'s Wrath and Sage\'s Tome finish the build by pushing magic attack higher.',
      },
    },
    {
      ja: {
        label: '回復を下げてから吸う型',
        when: '敵にHP回復やライフスティールに頼るヒーローが多いとき',
        text: '2品目に夢魔の牙を置き、スキルや通常攻撃が当たった敵のHP回復とライフスティールを先に落とします。続くフローズンブレスは当てた相手を減速させるので、回復を落とした相手を逃がしにくくなります。神喰らいの書は4品目まで下がります。5品目のトワイライトストームはヒーローに当て続けるほど魔法防御貫通が重なるので、この並びは長く撃ち合う展開に向きます。',
      },
      en: {
        label: 'Cut healing first',
        when: 'When several enemies rely on healing or lifesteal',
        text: 'Venomous Staff comes second, cutting the healing and lifesteal of any enemy hit by a skill or basic attack. Frozen Breath follows and slows whoever it hits, so a target whose healing is cut has a harder time escaping. Insatiable Tome drops to fourth, but Twilight Stream in fifth keeps adding magic pierce as he keeps hitting heroes, which suits fights that drag on.',
      },
    },
  ],
  // アネット（Support／ROAM）
  '640': [
    {
      ja: {
        label: '救済のシールドと移動速度の型',
        when: '敵の瞬間火力が高く、味方へ駆けつける足も欲しいとき',
        text: '1品目の極影の盾・救済は、自分の攻撃速度とクールダウン短縮を上げて範囲内の味方にも半分を配り、アクティブで味方にシールドを張ります。2品目の疾風の靴で移動速度を大きく上げ、戦闘から離れるとさらに速くなります。3品目からはもう1本と同じ並びです。',
      },
      en: {
        label: 'Redemption shield and movement speed',
        when: 'When the enemy has heavy burst and she also wants the speed to rush to teammates',
        text: 'Crimson Shadow - Redemption comes first, raising her attack speed and cooldown reduction, giving allies in range half of the effect, and shielding teammates with its active. Boots of Deftness, second, raise her movement speed a lot, and more after leaving combat. From the third item on, it matches the other build.',
      },
    },
    {
      ja: {
        label: '星泉の回復とクールダウン短縮の型',
        when: '削り合いが長く続き、味方のHPとMPを支えたいとき',
        text: '1品目の極影の盾・星泉は、アクティブでHPの低い味方とつながり、しばらく双方のHPとMPを回復します。敵ヒーローを攻撃するか攻撃を受けると回復は弱まるので、戦いの合間に使う装備です。2品目の静謐の靴でクールダウン短縮を伸ばし、最大HPはビルド1より少し低くなります。',
      },
      en: {
        label: 'Starspring healing and cooldown reduction',
        when: 'When trades keep dragging on and she wants to sustain her team\'s Health and mana',
        text: 'Crimson Shadow - Starspring comes first; its active links her to the lowest-Health teammate and restores both their Health and mana for a while. The healing weakens if either attacks or is hit by an enemy hero, so it is an item for the gaps between fights. Boots of Tranquility, second, extend her cooldown reduction, and her max Health ends up slightly lower than in build 1.',
      },
    },
  ],
  // バタフライ（Fighter／JUNGLE）
  '646': [
    {
      ja: {
        label: '火力を伸ばし、保険を1つ積む型',
        when: '敵の瞬間火力が高く、飛び込んだ直後に倒されやすいとき',
        text: '4品目に名刀・司命を置き、致命傷を受けても少しの間倒れない保険を持ちます。マスターブレードでクリティカル率を足し、最後の蒼天の剣はアクティブで少しの間受けるダメージを減らせるので、飛び込んだあとの反撃を受け止めやすくなります。',
      },
      en: {
        label: 'More damage with one safety net',
        when: 'When the enemy has heavy burst and she tends to die right after diving in',
        text: 'Destiny comes fourth, a safety net that keeps her alive for a moment after fatal damage. Master Sword adds critical rate, and Pure Sky at the end has an active that briefly reduces the damage she takes, making it easier to absorb the counterattack after diving in.',
      },
    },
    {
      ja: {
        label: '防御を先に持って殴り合う型',
        when: '敵の主な火力が物理ダメージで、殴り合いが長引きそうなとき',
        text: '4品目をスパイクアーマーにして、物理防御とHPを先に持ちます。スパイクアーマーはアクティブで少しの間、受けたダメージの一部を相手に返します。最後の不死鳥の目でHPと魔法防御を足すぶん、物理攻撃はビルド1より低くなります。',
      },
      en: {
        label: 'Defense first for brawling',
        when: 'When the enemy\'s main damage is physical and brawls are likely to drag on',
        text: 'Spikemail takes the fourth slot, bringing physical defense and Health early. Its active briefly returns part of the damage she takes. Eye of the Phoenix at the end adds Health and magical defense, so her physical attack ends up lower than in build 1.',
      },
    },
  ],
};
