const fs = require('fs');
const path = require('path');

const jaPath = path.resolve('public/data/skills/ja.json');
const enPath = path.resolve('public/data/skills/en.json');

const jaData = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const getRoleEn = (roleStr) => {
    if (!roleStr) return 'fighter';
    const r = roleStr.toLowerCase();
    if (r.includes('mage') || r.includes('メイジ')) return 'mage';
    if (r.includes('tank') || r.includes('タンク')) return 'tank';
    if (r.includes('assassin') || r.includes('アサシン')) return 'assassin';
    if (r.includes('marksman') || r.includes('マークスマン')) return 'marksman';
    if (r.includes('support') || r.includes('サポート')) return 'support';
    return 'fighter';
}

const generateStrategyEn = (heroName, role) => {
    let lane, earlyGame, combos;

    switch (role) {
        case 'mage':
            lane = 'Mid Lane';
            earlyGame = `In the early game, ${heroName} must dominate the Mid Lane. Focus on cleanly clearing minion waves to hit Level 4 as quickly as possible. Use your skills to aggressively poke and harass the enemy mid-laner, whittling down their health while maintaining a safe distance. Keep a sharp eye on the river and rotate to help your Jungler secure early scuttle crabs or assist the side lanes!`;
            combos = [
                {
                    title: "Core Burst Combo",
                    description: "Skill 2 -> Skill 1 -> Ultimate. Use your crowd control to lock down the target, then immediately follow up with your primary damage abilities to obliterate them in seconds."
                },
                {
                    title: "Aggressive Poke Combo",
                    description: "Skill 1 -> Basic Attack -> Skill 2. Perfect for safely chipping away at enemy health during the laning phase before committing to a full all-in."
                }
            ];
            break;
        case 'tank':
        case 'fighter':
            lane = 'Clash Lane';
            earlyGame = `As a powerful force in the Clash Lane, ${heroName}'s early game is all about establishing dominance and trading efficiently. Prioritize wave clear to reach Level 4 and secure your ultimate. Never hesitate to trade blows when your cooldowns are ready, but always respect enemy jungle rotations. Your goal is to become an unstoppable frontliner for your team!`;
            combos = [
                {
                    title: "Devastating Engage Combo",
                    description: "Skill 3 (Ultimate) -> Skill 1 -> Skill 2 -> Basic Attack. A fierce initiation sequence that disrupts the enemy formation and locks down priority targets for your team."
                },
                {
                    title: "Lane Trading Combo",
                    description: "Skill 1 -> Basic Attack -> Skill 2. A bread-and-butter sequence for winning short trades and establishing pressure in the Clash Lane."
                }
            ];
            break;
        case 'assassin':
            lane = 'Jungle';
            earlyGame = `Operating from the Jungle, ${heroName} relies on explosive tempo. Start by efficiently clearing your camps to secure buffs and reach Level 4 rapidly. Do not waste time in the lanes hitting minions early on; instead, stalk your prey from the shadows and launch relentless ganks on overextended enemies to snowball your team to victory!`;
            combos = [
                {
                    title: "Assassination Execution",
                    description: "Skill 1 -> Skill 2 -> Basic Attack -> Ultimate. Dash in to close the gap, strike with lethal precision, and use your ultimate to guarantee the kill or reposition safely."
                },
                {
                    title: "Quick Ambush Combo",
                    description: "Skill 2 -> Skill 1 -> Basic Attack. A lightning-fast strike perfect for punishing mispositioned squishies before they can even react."
                }
            ];
            break;
        case 'marksman':
            lane = 'Farm Lane';
            earlyGame = `In the early game, ${heroName} scales best in the Farm Lane. Focus intensely on securing every last hit on minions to accelerate your gold and item progression. Play carefully around enemy ganks and use your range advantage to consistently harass the opposing marksman. Patience and positioning now will turn you into an absolute monster later!`;
            combos = [
                {
                    title: "Maximum DPS Combo",
                    description: "Skill 1 -> Basic Attack -> Skill 2 -> Basic Attack. Weave your skills flawlessly between your auto-attacks to maintain a relentless barrage of damage."
                },
                {
                    title: "Self-Peel & Kite Combo",
                    description: "Skill 2 -> Skill 1 -> Ultimate. Use your utility skills to create distance from diving assassins while shredding them from afar with your ultimate."
                }
            ];
            break;
        case 'support':
            lane = 'Support Role';
            earlyGame = `Playing the crucial Support Role, ${heroName}'s early game revolves around protecting your allies and securing vision. Help your marksman or mid-laner clear waves safely and heavily contest river vision. Use your crowd control to set up advantageous trades and keep a watchful eye on the map to thwart enemy jungle invasions!`;
            combos = [
                {
                    title: "Protector's Combo",
                    description: "Skill 1 -> Skill 2 -> Ultimate. Chain your crowd control and defensive buffs perfectly to lock down threats and keep your carry alive at all costs."
                },
                {
                    title: "Peel & Disengage Combo",
                    description: "Skill 2 -> Basic Attack -> Skill 1. A swift defensive sequence to slow down pursuers and buy crucial seconds for your team to reposition."
                }
            ];
            break;
    }

    return {
        earlyGame,
        midGame: `As the match transitions to the mid game, ${heroName} hits a massive power spike. Group up with your allies to contest critical objectives like the Dragons and Overlord. Capitalize on your core items to force highly favorable skirmishes. Constant map awareness and aggressive macro rotations are your keys to choking out the enemy team!`,
        lateGame: `In the chaotic late game, impeccable positioning is everything. Stick tight with your squad and wait for the absolute perfect moment to execute your game plan. A single well-coordinated engage or a brilliant pick can instantly wipe the enemy team and secure a glorious victory. Play smart, play bold!`,
        teamfight: `When teamfights erupt, ${heroName} must perform their role with flawless execution! Read the battlefield instantly—decide whether to dive the enemy backline to assassinate their carries or hang back to peel for your own damage dealers. Land your skills with pinpoint accuracy and break their will to fight!`,
        combos
    };
};

const generateStrategyJa = (heroName, role) => {
    let lane, earlyGame, combos;

    switch (role) {
        case 'mage':
            lane = 'ミッドレーン';
            earlyGame = `序盤は${heroName}がミッドレーンを支配することが極めて重要です。ミニオンウェーブを素早く処理し、最速でレベル4への到達を目指しましょう。スキルを駆使して敵のミッドレーナーに強烈なハラスを仕掛け、体力を削りつつ安全な距離を保ちます。リバーの視界を確保し、ジャングラーのサポートやサイドレーンへのロームを積極的に狙いましょう！`;
            combos = [
                {
                    title: "コアバーストコンボ",
                    description: "スキル2 -> スキル1 -> アルティメット。CCでターゲットを確実に拘束し、間髪入れずにメイン火力を叩き込んで敵を一瞬で蒸発させます。"
                },
                {
                    title: "アグレッシブポークコンボ",
                    description: "スキル1 -> 通常攻撃 -> スキル2。レーン戦で安全な位置から敵の体力をじわじわと削り取る、オールイン前の完璧な下準備コンボです。"
                }
            ];
            break;
        case 'tank':
        case 'fighter':
            lane = 'クラッシュレーン';
            earlyGame = `クラッシュレーンの猛者として、${heroName}の序盤はレーンの主導権を握り、効率的なトレードを行うことが全てです。ウェーブクリアを優先してレベル4とアルティメットをいち早く確保しましょう。スキルのクールダウンが上がれば迷わず圧力をかけますが、敵ジャングルのガンクには常に警戒を怠らないように。チームの頼れる絶対的なフロントライナーを目指しましょう！`;
            combos = [
                {
                    title: "デバステイティング・エンゲージ",
                    description: "スキル3（アルティメット） -> スキル1 -> スキル2 -> 通常攻撃。敵の陣形を完全に崩壊させ、最優先ターゲットを味方のために拘束する強烈なイニシエートコンボです。"
                },
                {
                    title: "レーントレードコンボ",
                    description: "スキル1 -> 通常攻撃 -> スキル2。クラッシュレーンでの短いダメージトレードに勝ち、圧倒的なプレッシャーを築き上げるための基本コンボです。"
                }
            ];
            break;
        case 'assassin':
            lane = 'ジャングル';
            earlyGame = `ジャングルを主戦場とする${heroName}は、爆発的なテンポが命です。効率的にモンスターを狩ってバフを確保し、最速でレベル4に到達しましょう。序盤からレーンのミニオン処理に時間を割くのは厳禁です。暗闇から獲物を狙い、甘えた位置にいる敵に容赦ないガンクを突き刺して、ゲームを完全にスノーボールさせましょう！`;
            combos = [
                {
                    title: "アサシネーション・エクスキュージョン",
                    description: "スキル1 -> スキル2 -> 通常攻撃 -> アルティメット。一瞬で距離を詰め、致命的な精度で打撃を与え、アルティメットで確実なキルをもぎ取るか安全に離脱します。"
                },
                {
                    title: "クイックアンブッシュ",
                    description: "スキル2 -> スキル1 -> 通常攻撃。反応すら許さない電光石火の奇襲。立ち位置を誤った柔らかいターゲットを狩るのに最適です。"
                }
            ];
            break;
        case 'marksman':
            lane = 'ファームレーン';
            earlyGame = `序盤の${heroName}はファームレーンでのスケールアップが最優先です。ミニオンのラストヒットを完璧に取りこぼさず、ゴールドとアイテムの完成を急ぎましょう。敵のガンクを警戒しつつ、射程の優位を活かして相手マークスマンを絶え間なくハラスします。ここでの忍耐とポジショニングが、後半戦で誰も止められない怪物へと変貌する鍵となります！`;
            combos = [
                {
                    title: "マキシマムDPSコンボ",
                    description: "スキル1 -> 通常攻撃 -> スキル2 -> 通常攻撃。通常攻撃の合間にスキルを完璧に織り交ぜ、息もつかせぬ怒涛のダメージを叩き出します。"
                },
                {
                    title: "セルフピール＆カイト",
                    description: "スキル2 -> スキル1 -> アルティメット。突っ込んでくるアサシンとの距離を作り出し、安全な位置からアルティメットで蜂の巣にする自衛コンボです。"
                }
            ];
            break;
        case 'support':
            lane = 'サポート';
            earlyGame = `チームの要であるサポートとして、${heroName}の序盤は味方の保護と視界の制圧が絶対的な使命です。マークスマンやミッドレーナーが安全にウェーブを処理できるよう立ち回り、リバーの視界を強烈にコントロールしましょう。CCを駆使して有利なトレードを作り出し、敵ジャングラーの侵略を未然に防ぐためマップから決して目を離さないでください！`;
            combos = [
                {
                    title: "プロテクターズコンボ",
                    description: "スキル1 -> スキル2 -> アルティメット。CCと防御バフを完璧に繋ぎ合わせ、いかなる脅威も封殺して味方のキャリーを死守します。"
                },
                {
                    title: "ピール＆ディスエンゲージ",
                    description: "スキル2 -> 通常攻撃 -> スキル1。追撃してくる敵に強烈なスロウを与え、チームが体勢を立て直すための決定的な数秒を稼ぎ出す防衛コンボです。"
                }
            ];
            break;
    }

    return {
        earlyGame,
        midGame: `中盤戦に突入すると、${heroName}は凄まじいパワースパイクを迎えます！味方と合流し、ドラゴンやオーバーロードといった最重要オブジェクトの視界と主導権を制圧しましょう。完成したコアアイテムの力を武器に、有利な集団戦を強制します。絶え間ないマップへの意識とアグレッシブなマクロの動きで、敵チームを完全に息詰まらせましょう！`,
        lateGame: `混沌を極める終盤戦では、ミスのない完璧なポジショニングが全てを決定します。チームと固く連携し、作戦を遂行するための「最高の一瞬」を待ち構えましょう。息の合った完璧なエンゲージ、あるいは敵のキーマンを一人キャッチするだけで、一瞬にして敵陣を壊滅させ輝かしい勝利を掴むことができます。スマートに、そして大胆に戦いましょう！`,
        teamfight: `集団戦が勃発した瞬間、${heroName}は自身の役割を完璧に遂行しなければなりません！戦況を瞬時に読み解き、敵の後衛にダイブしてキャリーを暗殺するのか、あるいは後方に留まり味方のダメージディーラーを守り抜くのかを決断してください。ピンポイントの精度でスキルを命中させ、敵の戦意を完全にへし折りましょう！`,
        combos
    };
};

let count = 0;
for (let id = 105; id <= 184; id++) {
    const idStr = id.toString();
    if (jaData[idStr] && enData[idStr]) {
        const role = getRoleEn(enData[idStr].role);
        jaData[idStr].strategy = generateStrategyJa(jaData[idStr].hero_name, role);
        enData[idStr].strategy = generateStrategyEn(enData[idStr].hero_name, role);
        count++;
    }
}

fs.writeFileSync(jaPath, JSON.stringify(jaData, null, 2), 'utf8');
fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');

console.log("Successfully updated strategies for " + count + " heroes.");
