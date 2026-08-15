/**
 * サモナースペルの「使いどころ」解説。
 *
 * 公式はスペルごとの推奨ヒーローを公開していない。
 * skills/ja.json の meta.summoner_spells には各ヒーローのスペルらしき値が入っているが、
 * 出所の記録が無く（data_freshness.json にも同期スクリプトにも無い）、
 * 「閃現」「Flash」「フラッシュ」のように中国名・英名・カタカナが混在している。
 * 信頼できないので根拠には使わず、コンボと同じ方針で
 * 「検証済みのスペル効果とヒーローデータだけを根拠にした当サイトの解説」として書く。
 *
 * ヒーロー名を出すのは、public/data/skills/ja.json のスキル本文で裏を取れた場合だけ。
 * 例: 后羿はパッシブとスキル1〜3のどこにも移動効果が無いことを本文で確認済み。
 */

export type SpellGuide = {
  /** カードに常時出す一行。何のために持つスペルかを言い切る */
  when: string;
  /** 2〜4文の解説。効果そのものの再掲ではなく、選ぶ理由を書く */
  detail: string;
};

export const SPELL_GUIDE: Record<string, { ja: SpellGuide; en: SpellGuide }> = {
  flash: {
    ja: {
      when: '移動スキルを持たないヒーローの生命線',
      detail:
        '壁を越えられる汎用手段はこれだけ。スキルで動けるヒーローは他の選択肢も検討できるが、后羿はパッシブとスキル1〜3のどこにも移動効果が無く、位置を立て直す手段がフラッシュしかない。黄忠も砲台モード中は移動不可になるため、解除を待たずに退く用途で要る。CD120秒はスペル中で最長タイ。撃った直後の2分間は同じ逃げ方ができないと考えて前に出る。',
    },
    en: {
      when: 'The lifeline for heroes with no movement skill',
      detail:
        'Flash is the only general-purpose way to cross terrain. Heroes who can reposition with their own kit have room to pick something else, but Hou Yi has no movement effect anywhere in his passive or three skills, so Flash is his only reset. Huang Zhong also loses the ability to move during Turret Mode and needs an exit that does not wait for the mode to end. At 120s it ties for the longest cooldown in the game — assume you cannot repeat the escape for two full minutes.',
    },
  },

  smite: {
    ja: {
      when: 'ジャングル装備の購入条件。ジャングラーは実質固定',
      detail:
        'ジャングルを回るなら選択ではなく前提になる。ジャングル装備はスマイトを持っていないと購入できない。CD30秒はスペル中で最短、2番目に短いターミネート・バーサークの半分。モンスターへの1500の確定ダメージは、タイラントやオーバーロードの取り合いでそのまま横取り耐性として働く。ハンターブレードを買うとオーラスマイトに強化される。',
    },
    en: {
      when: 'Required to buy jungle items — effectively locked in for junglers',
      detail:
        'If you are clearing the jungle this is not a choice but a prerequisite: jungle items cannot be purchased without it. Its 30s cooldown is the shortest in the game, half that of the next-shortest pair (Execute and Frenzy). The 1,500 true damage to monsters doubles as steal protection when contesting the Tyrant or the Overlord. Buying the Hunting Knife upgrades it to Smite Aura.',
    },
  },

  purify: {
    ja: {
      when: 'CC一発で仕事が終わるロールが、対面を見てから積む',
      detail:
        'デバフとCCを全て解除し、1.5秒のCC無効が続く。ただし制圧効果だけは解除できない。この例外があるため、相手の構成を見てから価値が決まるスペル。スタンやノックアップで固められた瞬間に溶けるマークスマン・メイジほど、フラッシュより優先度が上がる場面が出る。CDは120秒で、フラッシュ・ヒールと並ぶ最長。',
    },
    en: {
      when: 'For roles that die to a single crowd-control hit — picked after seeing the draft',
      detail:
        'Purify clears every debuff and crowd-control effect and grants 1.5s of immunity afterward. Suppression is the one exception it cannot remove, and that exception is why its value depends on the enemy composition. For marksmen and mages who evaporate the moment they are pinned by a stun or knock-up, it can outrank Flash. The cooldown is 120s, tied with Flash and Heal for the longest.',
    },
  },

  execute: {
    ja: {
      when: '削り切れない相手を確実に落とす',
      detail:
        '敵が失っているHPの16%を確定ダメージで与える。確定ダメージなので相手がどれだけ防御を積んでいても軽減されない。効き目は相手が瀕死であるほど大きく、逆に満タンの相手にはほとんど入らない。撃破に成功するとCDが90%短縮され、実質6秒で次が撃てる。解放はLv3と早く、序盤から持ち込める。',
    },
    en: {
      when: 'Closes out the kills you cannot quite finish',
      detail:
        'Execute deals true damage equal to 16% of the target\'s missing Health. Because it is true damage, no amount of enemy defense reduces it. That also means it scales with how low they already are — against a full-health target it does almost nothing. Securing the kill cuts the cooldown by 90%, putting it back up in about six seconds. It unlocks at level 3, so it is available early.',
    },
  },

  frenzy: {
    ja: {
      when: '殴り合いが長引くヒーロー向け',
      detail:
        '7秒間、ダメージ+10%・耐性+15%・物理ライフスティール+20%・魔法ライフスティール+30%。逃げにも詰めにも使えず、撃ち合いや殴り合いが続く場面でだけ価値が出る。裏を返せば、集団戦のたびにCD60秒で回るということでもある。解放がLv17と遅いため、序盤のレーン戦では選べない。',
    },
    en: {
      when: 'For heroes whose fights go long',
      detail:
        'For 7s it grants +10% damage, +15% resistance, +20% Physical Lifesteal and +30% Magical Lifesteal. It cannot be used to escape or to close a gap, so it only pays off in extended trades. The flip side is a 60s cooldown, short enough to be up for every team fight. Unlocking at level 17 puts it out of reach during early laning.',
    },
  },

  heal: {
    ja: {
      when: '味方ごと立て直す。単独行動では効果が薄い',
      detail:
        '自身と近くの味方のHPを15%回復し、味方の移動速度を15%上げる。回復量が割合なので、最大HPの高い前衛が近くにいるほど総回復量が伸びる。逆に単独で動く時間が長いロールでは、自分の15%しか戻らない。CD120秒はスペル中で最長タイ。',
    },
    en: {
      when: 'Recovers the group, not the individual',
      detail:
        'Heal restores 15% Health to you and nearby allies and raises their Movement Speed by 15% for 2s. Because it heals a percentage, the total goes up the more high-Health frontliners are standing near you. For a hero who spends long stretches alone, it only ever returns your own 15%. Its 120s cooldown ties for the longest in the game.',
    },
  },

  stun: {
    ja: {
      when: 'CCを持たないヒーローに、集団戦の開始点を足す',
      detail:
        '近くの敵を全員0.75秒スタンさせ、1秒スローを付ける。単体指定ではなく範囲なので、密集していれば複数人に入る。自前のCCが無い、あるいは当てにくいヒーローほど、戦いの始め方が1つ増える意味が大きい。0.75秒は短く、味方が続けられる距離にいることが前提になる。',
    },
    en: {
      when: 'Gives a hero without crowd control a way to start a fight',
      detail:
        'Stun freezes every nearby enemy for 0.75s and slows them for 1s. It is an area effect rather than a targeted one, so a clumped enemy team all get hit. The heroes who gain most are the ones with no reliable crowd control of their own — it adds an opener they otherwise lack. At 0.75s it is short, and it only works if teammates are close enough to follow up.',
    },
  },

  weakness: {
    ja: {
      when: '前で受ける役が、受けきるために持つ',
      detail:
        '4秒間、周囲の敵の与ダメージを25%減らし、自身の被ダメージ軽減を20%上げる。自分が硬くなるだけでなく、敵の火力そのものを落とすのが他の防御手段との違い。ただし5秒以内に味方が同じ相手へ重ねると、ダメージ減少のデバフは半減する。前線が2人以上いるなら、撃つ相手をずらす。',
    },
    en: {
      when: 'For the player absorbing damage at the front',
      detail:
        'For 4s it cuts the damage output of nearby enemies by 25% and raises your own damage reduction by 20%. What separates it from other defensive options is that it lowers the enemy\'s damage itself, not just your intake. If a teammate applies it to the same target within 5s, though, the reduction debuff is halved — with two frontliners, split the targets.',
    },
  },

  teleport: {
    ja: {
      when: 'レーン復帰とスプリットプッシュ',
      detail:
        '2秒の詠唱後、味方のタワー・クリスタル・ミニオンの近くへ飛ぶ。壊れたタワーにも飛べるため、押し込まれた側でも復帰点が残る。詠唱中は選んだ対象がダメージを受けない。死んだあとレーンまで歩く時間を省けるぶん、押し引きの回数そのものが増える。詠唱を中断されるとCDが25秒短縮される。',
    },
    en: {
      when: 'Lane returns and split pushing',
      detail:
        'After a 2s channel you arrive next to an allied tower, crystal or minion. Destroyed towers still count as destinations, so a losing lane keeps a way back. The selected unit takes no damage while you channel. Cutting out the walk after a death is what makes the difference — you simply get more pushes per game. Cancelling the channel refunds 25s of the cooldown.',
    },
  },

  disrupt: {
    ja: {
      when: 'タワーダイブの攻めと守り、両方で効く',
      detail:
        '敵のタワーやクリスタルに撃つと2〜5秒沈黙する（4:00と10:00にそれぞれ1.5秒延びる）。味方の建造物に撃った場合は4秒間ダメージを無効化し、攻撃速度が倍になる。攻めるときはダイブできる時間を作り、守るときは落とされない時間を作るという、同じスペルで用途が反転する構造。90秒以内に重ねがけしても1秒しか伸びない。',
    },
    en: {
      when: 'Works on both sides of a tower dive',
      detail:
        'Used on an enemy structure it silences the tower for 2-5s, extending by 1.5s at 04:00 and again at 10:00. Used on your own structure it grants damage immunity and doubles attack speed for 4s. The same spell inverts its purpose depending on the target: it buys time to dive, or time to hold. Stacking it within 90s only adds one second.',
    },
  },

  sprint: {
    ja: {
      when: 'スロー対策。Lv1から持ち込める唯一のスペル',
      detail:
        '10秒間移動速度が30%増加し、発動時に自分にかかっているスローが解除される。ダッシュ中に新たに受けるスローも50%軽減される。戦闘離脱状態ならさらに20%上乗せ。ブリンクではないので壁は越えられないが、効果時間10秒はフラッシュの一瞬とは性質が違う。相手にスローが多い構成では、こちらのほうが長く効く場面がある。',
    },
    en: {
      when: 'The answer to slows — and the only spell available from level 1',
      detail:
        'Sprint grants 30% Movement Speed for 10s and clears any slow on you at the moment of activation. Slows applied during the sprint are halved, and being out of combat adds another 20%. It is not a blink, so terrain still blocks you — but ten seconds of speed is a different tool from Flash\'s single instant. Against a composition built on slows, it often does more work.',
    },
  },
};
