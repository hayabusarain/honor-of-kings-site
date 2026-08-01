import json
import os

heroes_data = {
    "187": {
        "en": {
            "earlyGame": "As Donghuang Taiyi in the Roam role, your early game power is immense. Invade the enemy jungle immediately with your Skill 1 orbs active; you can often secure a 1v3 early skirmish due to your massive lifesteal against grouped enemies. Establish dominance by securing the first mid-lane crab and harassing the enemy jungler.",
            "midGame": "Your role transitions to a hard engager and objective controller. Hover around major objectives like the Tyrant and Overlord. Use your Skill 2 to poke, slow, and stun enemies from afar. Always keep track of the enemy carry, preparing to flash-Ultimate them if they step out of line.",
            "lateGame": "In the late game, you are the ultimate anti-carry. Your sheer presence will force enemies to reposition. Do not waste your Ultimate on tanks; hold it patiently for the enemy marksman or assassin. Stick with your damage dealers and act as a human shield.",
            "teamfight": "Initiate or counter-engage by diving the most fed enemy threat. A Flash into Ultimate (Skill 3) is a guaranteed lockdown that pierces crowd-control immunity. While channeling your Ultimate, rely on your teammates to burst the suppressed target, as you take reciprocal damage.",
            "commonMistakes": "Using the Ultimate on a high-HP tank instead of a squishy priority target, or diving in without your teammates nearby to capitalize on the suppression.",
            "combos": [
                {
                    "title": "Flash Suppress Combo",
                    "description": "Skill 1 (x3) -> Skill 2 -> Flash -> Skill 3. Launch your orbs to stun the enemy, immediately Flash to close the gap, and lock them down with your Ultimate."
                },
                {
                    "title": "Invade & Sustain",
                    "description": "Skill 1 (maintain 3 orbs) -> Basic Attack -> Skill 1. Keep close to multiple enemies to maximize the healing from your dark orbs while weaving in basic attacks."
                }
            ]
        },
        "ja": {
            "earlyGame": "東皇太一としてロームでプレイする際、序盤の戦闘力は絶大です。スキル1のオーブを展開した状態で敵ジャングルに侵入し、密集した敵に対して驚異的な回復力を発揮して1v3の小競り合いを制圧しましょう。ミッドの川蟹を確保し、敵ジャングラーを徹底的に妨害します。",
            "midGame": "中盤はハードエンゲージとオブジェクト管理が役割になります。タイラントやオーバーロード周辺の視界を確保し、スキル2で遠距離からハラス、スロウ、スタンを狙います。常に敵のキャリーの位置を把握し、フラッシュからのアルティメットの準備をしておきましょう。",
            "lateGame": "終盤は究極のアンチキャリーとして機能します。あなたが立っているだけで敵はポジショニングを強要されます。アルティメットをタンクに無駄撃ちせず、敵のマークスマンやアサシンを確実に仕留めるために温存してください。味方のダメージディーラーに寄り添い、盾として立ち回ります。",
            "teamfight": "最も育っている敵の脅威に対してエンゲージ、またはカウンターエンゲージを行います。フラッシュからのアルティメット（スキル3）はCC無効を貫通する確実なロックダウンです。拘束中は受けたダメージを敵にも共有するため、味方のバーストダメージに依存することになります。",
            "commonMistakes": "柔らかい優先ターゲットではなく、HPの高いタンクにアルティメットを使ってしまうこと。または、味方が追従できない位置で単独で突っ込んでしまうこと。",
            "combos": [
                {
                    "title": "フラッシュ制圧コンボ",
                    "description": "スキル1（3個） -> スキル2 -> フラッシュ -> スキル3。オーブを放って敵をスタンさせ、即座にフラッシュで距離を詰め、アルティメットで確実な拘束を行います。"
                },
                {
                    "title": "インベード＆サステイン",
                    "description": "スキル1（オーブ3個維持） -> 通常攻撃 -> スキル1。複数の敵に密着して闇のオーブによる回復を最大化しつつ、通常攻撃を挟み込みます。"
                }
            ]
        }
    },
    "189": {
        "en": {
            "earlyGame": "Guiguzi is a playmaking Support who excels at proactive rotations. Start by helping your mid laner clear the wave quickly, then immediately look for a gank in the side lanes. Your camouflage and movement speed make you a terrifying early-game roamer. Always seek to create numerical advantages.",
            "midGame": "Control the map by constantly setting up ambushes. Your Skill 3 (Ultimate) provides invaluable team-wide camouflage and vision of the nearest enemy. Coordinate with your jungler to secure picks before objectives spawn. You dictate the pace of the game through sudden, coordinated strikes.",
            "lateGame": "Vision control and flawless initiation are your primary duties. A well-timed five-man camouflage can completely collapse the enemy's formation. Be careful not to engage too far ahead of your team; you are squishy and rely on your allies to follow up on your crowd control.",
            "teamfight": "Activate your Ultimate to cloak your team, then pop Skill 1 to debuff enemy armor and magic resist as you pass through them. Finally, channel Skill 2 to pull all nearby enemies into a devastating clump. The moment they are pulled, your team should unleash their AoE damage.",
            "commonMistakes": "Channeling Skill 2 too early or too late, resulting in missing the pull. Engaging without ensuring your team is ready and in range to follow up.",
            "combos": [
                {
                    "title": "Invisible Vacuum",
                    "description": "Skill 3 -> Skill 1 -> Skill 2 -> Flash (optional). Cloak the team, pass through targets to shred armor/resist, and time Skill 2's explosion to pull them together, flashing at the last second to adjust positioning."
                },
                {
                    "title": "Ambush Setup",
                    "description": "Skill 1 -> Skill 2 -> Basic Attack. Use camouflage to close the gap, start the pull timer, apply the enhanced basic attack slow, and gather them up."
                }
            ]
        },
        "ja": {
            "earlyGame": "鬼谷子は積極的なローテーションを得意とするプレイメイカー型サポートです。ミッドレーンのウェーブクリアを素早く手伝い、即座にサイドレーンへのガンクを狙います。カモフラージュと移動速度上昇により、序盤から脅威的なロームを展開し、常に数的有利を作り出しましょう。",
            "midGame": "絶え間ないアンブッシュ（待ち伏せ）でマップを支配します。スキル3（アルティメット）はチーム全体にカモフラージュを付与し、最も近い敵の視界を得る強力なツールです。ジャングラーと連携してオブジェクト前にピックアップを狙い、試合のペースを握りましょう。",
            "lateGame": "視界の確保と完璧なイニシエートが主な任務です。タイミングの良い5人カモフラージュは敵の陣形を完全に崩壊させます。ただし、味方から離れすぎてエンゲージしないよう注意してください。自身は耐久力が低いため、味方の追従が不可欠です。",
            "teamfight": "アルティメットでチームを隠蔽し、スキル1で敵を通り抜けて物理・魔法防御を低下させます。その後、スキル2をチャージして周囲の敵を一箇所に引き寄せます。敵が密集した瞬間に、味方に強力な範囲ダメージを叩き込んでもらいましょう。",
            "commonMistakes": "スキル2のチャージ開始タイミングを誤り、引き寄せを外してしまうこと。味方が攻撃できる範囲にいないのに単独でエンゲージしてしまうこと。",
            "combos": [
                {
                    "title": "インビジブル・バキューム",
                    "description": "スキル3 -> スキル1 -> スキル2 -> フラッシュ（任意）。チームを隠蔽し、敵を通り抜けて防御力を下げ、スキル2の爆発タイミングを合わせて引き寄せます。必要に応じて直前にフラッシュで位置調整します。"
                },
                {
                    "title": "アンブッシュ・セットアップ",
                    "description": "スキル1 -> スキル2 -> 通常攻撃。カモフラージュで接近し、引き寄せのタイマーを開始。強化通常攻撃でスロウを与え、確実に引き寄せます。"
                }
            ]
        }
    },
    "190": {
        "en": {
            "earlyGame": "Zhuge Liang thrives as a high-mobility Mid lane/Jungle assassin mage. Focus on farming efficiently to reach Level 4, as you heavily rely on your Ultimate to snowball. Stack your passive carefully on minions or jungle camps before looking for skirmishes. A fully stacked passive allows you to deal massive poke damage.",
            "midGame": "This is your time to shine. Look for low-health targets to execute with your Ultimate, which resets its cooldown upon a successful kill. Play around the edges of skirmishes, using Skill 2 to reposition and Skill 1 to poke. Once a target is low enough, dive in for the reset.",
            "lateGame": "In the late game, enemies will build magic defense, and teamfights will be more clustered. You must be extremely patient. Do not dive in first; wait for the fight to break out and frontline abilities to be burned. One Ultimate reset can chain into a complete team wipe.",
            "teamfight": "Poke with Skill 1 and keep your passive up. Use your Skill 2 blinks defensively or to reposition for a better angle. Target the squishiest or most wounded enemy with your Ultimate. If an enemy tank tries to body-block your Ultimate, reposition with Flash or Skill 2 to bypass them.",
            "commonMistakes": "Wasting the Ultimate on a target that won't die, losing the cooldown reset. Blinking forward aggressively with Skill 2 into hard crowd control.",
            "combos": [
                {
                    "title": "Execute Reset Combo",
                    "description": "Skill 2 -> Skill 1 -> Skill 3. Blink into optimal range, hit point-blank with Skill 1 to generate passive stacks quickly, and instantly channel Ultimate on the low-health target to secure the kill and reset."
                },
                {
                    "title": "Passive Stacking Poke",
                    "description": "Skill 1 -> Skill 2 (away) -> Passive procs. Cast Skill 1 to hit minions and champions, blinking away to safety while your generated passive orbs automatically seek out enemies."
                }
            ]
        },
        "ja": {
            "earlyGame": "諸葛亮は高機動力を持つミッドレーン/ジャングルのアサシンメイジとして活躍します。アルティメットによるスノーボールに強く依存するため、効率的にファームしてレベル4を目指しましょう。ミニオンや中立モンスターでパッシブを溜めてから戦闘に参加することで、強烈なポークダメージを出せます。",
            "midGame": "ここからがあなたの見せ場です。アルティメットでキルを取るとクールダウンが大幅に短縮されるため、HPの低いターゲットを常に探し求めましょう。集団戦の外周を立ち回り、スキル2で位置取りを変えながらスキル1でポークし、確殺圏内に入ったら一気に飛び込んでリセットを狙います。",
            "lateGame": "終盤は敵が魔法防御を積み、集団戦の密集度が高まります。非常に忍耐強いプレイが求められます。絶対に最初から突っ込まず、敵の主要なスキルが落ちるのを待ちましょう。一度のアルティメットリセットが連鎖し、チームワイプへと繋がります。",
            "teamfight": "スキル1でポークし、パッシブを維持します。スキル2のブリンクは防御目的、または射線を確保するために使います。最も柔らかい、あるいは負傷した敵にアルティメットを撃ちます。敵タンクがアルティメットをブロックしようとしたら、フラッシュやスキル2で射線をずらしましょう。",
            "commonMistakes": "キルを取りきれないターゲットにアルティメットを使い、リセットを逃すこと。スキル2で強引に前線にブリンクし、強力なCCを受けて即死すること。",
            "combos": [
                {
                    "title": "エクスキュート・リセット",
                    "description": "スキル2 -> スキル1 -> スキル3。最適な距離にブリンクし、至近距離でスキル1を当てて一気にパッシブを溜め、即座に低HPターゲットにアルティメットを放ちキルとリセットを獲得します。"
                },
                {
                    "title": "パッシブポーク",
                    "description": "スキル1 -> スキル2（後退） -> パッシブ発動。スキル1でミニオンや敵を巻き込んでスタックを溜め、安全圏にブリンクで下がりながら自動追尾するパッシブオーブでダメージを与えます。"
                }
            ]
        }
    },
    "191": {
        "en": {
            "earlyGame": "Da Qiao is a master of macro-level Support play. In the early game, use your Skill 3 and Skill 1 to clear waves quickly with your mid laner and harass enemies. Use your Skill 2 to send low-health allies back to base for instant full recovery, allowing your team to win the battle of attrition.",
            "midGame": "Your global presence defines the mid game. Coordinate split-pushes with your Clash laner. When the enemy team rotates to stop the split-push, use your Ultimate to instantly summon your team to an objective on the opposite side of the map. Map awareness is your strongest weapon.",
            "lateGame": "In the late game, one mistake can cost the game. Da Qiao ensures her team never has to fight at a disadvantage. Place your Skill 2 preemptively during sieges so wounded allies can recall and immediately return via your Ultimate. You create a relentless, undying siege engine.",
            "teamfight": "Stay in the backline. Drop Skill 3 to silence channeling enemies and disrupt their combos. Use Skill 1 to peel divers off your marksman. Place Skill 2 near, but not directly on top of, your carries so they can step into it when near death. Drop your Ultimate in a safe zone for reinforcements.",
            "commonMistakes": "Placing Skill 2 directly under a healthy teammate, accidentally teleporting them back to base in the middle of a winning fight. Summoning teammates with Ultimate into a deadly AoE trap.",
            "combos": [
                {
                    "title": "Elevator Strat (Recall & Return)",
                    "description": "Skill 2 -> Skill 3 (Ultimate). Place the recall circle for a low-health ally, and immediately cast your Ultimate nearby. They return to base, heal fully, and instantly take the portal back to the fight."
                },
                {
                    "title": "Disruptive Peel",
                    "description": "Skill 3 -> Skill 1. Drop the silence zone exactly where the enemy assassin lands to prevent their burst, then knock them away with the water stream."
                }
            ]
        },
        "ja": {
            "earlyGame": "大喬はマクロレベルの戦術を操るサポートの達人です。序盤はスキル3とスキル1を使ってミッドレーナーのウェーブクリアを助け、敵をハラスします。スキル2を使ってHPの減った味方を瞬時にリコール＆全回復させることで、消耗戦を圧倒的有利に進めることができます。",
            "midGame": "グローバルな展開力が中盤を支配します。クラッシュレーナーの・スプリットプッシュと連携し、敵がそれに対処しようと動いた瞬間に、アルティメットでマップの反対側にあるオブジェクトにチーム全員を召喚します。マップ全体への警戒と判断力が最大の武器です。",
            "lateGame": "終盤の小さなミスは敗北に直結しますが、大喬は味方に不利な戦闘をさせません。シージ（拠点包囲）の際はスキル2をあらかじめ配置し、傷ついた味方が帰還してすぐにアルティメットで復帰できるようにします。これにより、決して倒れない無尽蔵の攻城戦線を構築できます。",
            "teamfight": "後衛に位置取り、スキル3を敷いて敵のスキル詠唱をサイレンスで妨害します。スキル1で味方のマークスマンに飛び込んでくる敵を弾き飛ばしましょう。スキル2はキャリーの真下ではなく、ピンチの時に一歩踏み込める位置に置きます。アルティメットは安全な後方に配置して増援を呼びます。",
            "commonMistakes": "HPが十分にある味方の足元にスキル2を置き、勝っている集団戦の最中に誤って帰還させてしまうこと。敵の範囲攻撃のど真ん中にアルティメットを置き、味方を死地に召喚してしまうこと。",
            "combos": [
                {
                    "title": "エレベーター戦術（帰還と復帰）",
                    "description": "スキル2 -> スキル3（アルティメット）。低HPの味方のために帰還サークルを置き、その近くにすぐアルティメットを展開。味方はベースで全回復し、即座にポータルで戦線復帰します。"
                },
                {
                    "title": "ディスラプティブ・ピール",
                    "description": "スキル3 -> スキル1。敵アサシンが飛び込んでくる位置にサイレンス地帯を展開してバーストを防ぎ、直後に水流でノックバックさせて味方を守ります。"
                }
            ]
        }
    },
    "192": {
        "en": {
            "earlyGame": "Huang Zhong is a hyper-scaling Farm Lane marksman. In the early game, play defensively and focus entirely on farming. Use your Skill 2 mines in the river bushes to gain vision and gain a shield to survive ganks. Only trade when you have your passive stacks fully charged up.",
            "midGame": "You begin to deal noticeable damage as you acquire core critical strike and attack speed items. Rotate with your team and use your Ultimate to siege towers safely. Your Ultimate outranges enemy towers, making you a premier siege weapon. Never siege without your support providing vision.",
            "lateGame": "Huang Zhong is a late-game monster. Your 7-hit Ultimate can decimate the entire enemy team. However, you are completely immobile while entrenched. Positioning is paramount. Only deploy your Ultimate when your team has established a strong defensive perimeter around you.",
            "teamfight": "Stay in the absolute backline. Throw Skill 2 traps at choke points or directly under yourself for the shield and slow. Use Skill 1 for the movement speed boost to reposition. Only press Ultimate when the enemy's hard engage tools have been used, or you are safely hidden behind a wall.",
            "commonMistakes": "Deploying the Ultimate too early in a teamfight before enemy assassins have revealed themselves, turning yourself into a sitting duck. Forgetting to use Skill 1 to quickly cancel the Ultimate and run away.",
            "combos": [
                {
                    "title": "Entrenched Siege",
                    "description": "Skill 2 -> Skill 3 -> Basic Attacks. Place a mine at the edge of your intended zone to slow diver threats, activate Ultimate to siege out of tower range, and rain down artillery."
                },
                {
                    "title": "Kite & Reposition",
                    "description": "Basic Attack -> Skill 2 -> Skill 1 -> Basic Attack. Drop a mine on the chasing enemy for the shield/slow, pop Skill 1 to sprint away, and turn back to auto-attack once safe."
                }
            ]
        },
        "ja": {
            "earlyGame": "黄忠は超レイトゲーム向けのファームレーンのマークスマンです。序盤は防御的に立ち回り、ファームに完全に集中します。スキル2の地雷を川の茂みに置いて視界を確保し、シールドを得てガンクを凌ぎましょう。パッシブのスタックが完全に溜まっている時のみトレードを行います。",
            "midGame": "クリティカルと攻撃速度のコアアイテムが揃い始めると、目に見えて火力が上がります。味方とローテーションし、アルティメットを活用して安全にタワーをシージ（攻城）します。アルティメットはタワーの射程外から攻撃できるため、最高の攻城兵器となります。サポートの視界確保なしでの展開は厳禁です。",
            "lateGame": "終盤の黄忠は手がつけられない怪物になります。アルティメットの7発の砲撃は敵チーム全体を壊滅させます。しかし、展開中は完全に無防備で動けなくなるため、位置取りが全てです。味方があなたの周囲に強固な防衛線を構築した時のみ、アルティメットを展開してください。",
            "teamfight": "絶対に最後列をキープします。スキル2の罠をチョークポイントや自身の足元に置き、シールドとスロウを準備します。スキル1の移動速度上昇で位置を調整し、敵のハードエンゲージ（飛び込み）スキルが消費された後、または壁裏の安全な位置からのみアルティメットを使用します。",
            "commonMistakes": "敵のアサシンが見えていないのに集団戦で早々にアルティメットを展開し、格好の的になってしまうこと。スキル1を使って即座にアルティメットを解除し、逃げる操作を忘れること。",
            "combos": [
                {
                    "title": "要塞化シージ",
                    "description": "スキル2 -> スキル3 -> 通常攻撃。接近してくる脅威にスロウをかけるため射程の端に地雷を置き、アルティメットを展開してタワーの射程外から砲撃の雨を降らせます。"
                },
                {
                    "title": "カイト＆リポジショニング",
                    "description": "通常攻撃 -> スキル2 -> スキル1 -> 通常攻撃。追ってくる敵に地雷を投げてシールド/スロウを得て、スキル1でダッシュして距離を取り、安全になったら振り返って攻撃します。"
                }
            ]
        }
    },
    "193": {
        "en": {
            "earlyGame": "Kaizer is a dominant Clash Lane and Jungle fighter with immense 1v1 potential. Focus on using Skill 1 to poke and sustain in lane. Since your passive grants 50% bonus damage when hitting a single target, always try to isolate the enemy hero away from their minion wave to maximize your trading power.",
            "midGame": "With your core items and Ultimate, you become a terrifying duelist. Look to flank the enemy backline or catch enemies rotating in the jungle. When your Ultimate is active, you gain massive attack damage, movement speed, and damage block, allowing you to stat-check almost anyone on the map.",
            "lateGame": "In late-game teamfights, you cannot mindlessly charge into five people despite your tankiness. Play like a frontline assassin. Flank the enemy team, wait for the initiation, and then pop your Ultimate to dive straight for their marksman or mage. A late-game Kaizer will two-shot squishy targets.",
            "teamfight": "Wait in a flanking brush. Throw Skill 1 to slow your target and gain movement speed. Activate Skill 3 (Ultimate) for the stat boost, then use Skill 2 to knock them up and gap-close. Use your enhanced basic attack to obliterate the target.",
            "commonMistakes": "Engaging without your Ultimate available. Fighting the enemy within a large minion wave, which negates your 50% bonus single-target damage passive.",
            "combos": [
                {
                    "title": "The Demon Execution",
                    "description": "Skill 3 -> Skill 1 -> Skill 2 -> Enhanced Basic Attack. Activate Ultimate to transform, throw the blade to slow, dash in with the knock-up, and deliver a devastating empowered slash."
                },
                {
                    "title": "Flash Engage",
                    "description": "Skill 2 -> Flash -> Enhanced Basic Attack -> Skill 1. Cast Skill 2, Flash mid-animation to surprise an out-of-range target with the knock-up, strike them, and use Skill 1 to chase."
                }
            ]
        },
        "ja": {
            "earlyGame": "鎧（カイザー）は1v1のポテンシャルが極めて高い、クラッシュレーンおよびジャングル向けのファイターです。スキル1でポークと回復を行いレーンを維持します。パッシブにより単体ターゲットへの通常攻撃とスキル2のダメージが50%増加するため、常に敵ヒーローをミニオンの群れから引き離して戦うことを意識しましょう。",
            "midGame": "コアアイテムとアルティメットが揃うと、恐怖のデュエリストになります。敵の後衛をフランク（側面攻撃）するか、ジャングルでローテーション中の敵を捕まえましょう。アルティメット発動中は攻撃力、移動速度、ダメージブロックが大幅に上昇し、マップ上のほぼ誰にでもステータスの暴力で打ち勝てます。",
            "lateGame": "終盤の集団戦では、耐久力があるとはいえ、何も考えずに5人の中に突っ込んではいけません。前衛のアサシンのように振る舞いましょう。側面から回り込み、イニシエートを待ってからアルティメットを発動し、敵のマークスマンやメイジに一直線に飛び込みます。終盤のカイザーなら柔らかい敵を2撃で粉砕できます。",
            "teamfight": "側面の茂みで待機します。スキル1を投げて対象にスロウを与え、自身の移動速度を上げます。スキル3（アルティメット）を発動してステータスを強化し、スキル2でノックアップさせながら距離を詰めます。強化された通常攻撃でターゲットを一瞬で消し去りましょう。",
            "commonMistakes": "アルティメットがクールダウン中にも関わらずエンゲージしてしまうこと。巨大なミニオンウェーブの中で戦い、単体ダメージ50%増加のパッシブを無駄にしてしまうこと。",
            "combos": [
                {
                    "title": "魔神の処刑コンボ",
                    "description": "スキル3 -> スキル1 -> スキル2 -> 強化通常攻撃。アルティメットで変身し、刃を投げてスロウを与え、スキル2のノックアップで飛び込み、破壊的な強化斬撃を叩き込みます。"
                },
                {
                    "title": "フラッシュエンゲージ",
                    "description": "スキル2 -> フラッシュ -> 強化通常攻撃 -> スキル1。スキル2の発動モーション中にフラッシュを使い、射程外の敵に奇襲のノックアップを当て、斬撃を入れた後にスキル1で追撃します。"
                }
            ]
        }
    },
    "195": {
        "en": {
            "earlyGame": "Baili Xuance is a high-tempo Jungle assassin who relies on snowballing. Start at your red buff and aggressively look for a Level 2 or Level 4 gank. Your entire kit revolves around landing your Skill 2 hook. If you miss the hook, disengage immediately. Focus on securing early kills to trigger your passive frenzy state.",
            "midGame": "Control the map by finding picks on isolated targets. Charge your Skill 2 in the fog of war, run in with the speed boost, and hook the enemy carry. Throw them behind you with the second cast of Skill 2, and use your Ultimate to dash through them. Your mid-game damage is lethal to squishies.",
            "lateGame": "Teamfights are extremely dangerous if you cannot secure a kill quickly. You act as an opportunistic executioner. Wait for the enemy to use their crowd control, then hook a low-health target to secure a takedown. Once an enemy dies or assists, your passive triggers, granting massive attack speed and movement speed to clean up the rest.",
            "teamfight": "Never be the first to engage. Skirt the edges of the fight charging Skill 2. Wait for a clear shot on the marksman or mage. Once hooked, drag them out of position. The absolute key to teamfighting is getting that first kill or assist to activate your Frenzy; once active, you play like a hyper-carry marksman.",
            "commonMistakes": "Missing the Skill 2 hook and committing to the fight anyway. Engaging first into a heavy CC composition, getting locked down and instantly burst before triggering your passive.",
            "combos": [
                {
                    "title": "The Over-the-Shoulder Execute",
                    "description": "Skill 2 (Charge & Hit) -> Skill 1 -> Skill 2 (Throw) -> Skill 3 -> Basic Attacks. Hook the target, drag them slightly with Skill 1, fling them behind you with the second cast of Skill 2, and dash through them with Ultimate while auto-attacking."
                },
                {
                    "title": "Chase and Reposition",
                    "description": "Skill 1 -> Skill 2 (Charge) -> Skill 3 (If already hooked). Use Skill 1 to close the gap, immediately start charging Skill 2, and use Ultimate to reposition around a hooked target to dodge skillshots."
                }
            ]
        },
        "ja": {
            "earlyGame": "百里玄策はスノーボールに依存するハイテンポなジャングルアサシンです。赤バフからスタートし、レベル2またはレベル4で積極的にガンクを狙います。あなたの全てのスキルセットはスキル2のフックを当てることに依存しています。フックを外したら即座に撤退してください。序盤のキルでパッシブの狂乱状態を発動させることが重要です。",
            "midGame": "孤立したターゲットをピックアップしてマップを支配します。視界外でスキル2をチャージし、移動速度上昇を活かして接近し、敵のキャリーをフックします。スキル2の再発動で敵を背後に投げ飛ばし、アルティメットで敵をすり抜けてダメージを与えます。中盤の火力は柔らかい敵にとって致命的です。",
            "lateGame": "素早くキルを取れない場合、集団戦は非常に危険です。あなたは機会を伺う処刑人として振る舞います。敵がCCを使い切るのを待ち、低HPのターゲットをフックしてキルを奪います。キルまたはアシストを獲得するとパッシブが発動し、莫大な攻撃速度と移動速度を得て残りの敵を掃討できます。",
            "teamfight": "絶対に最初にエンゲージしてはいけません。集団戦の外縁を回りながらスキル2をチャージし、マークスマンやメイジへの射線が通るのを待ちます。フックできたら、敵を安全な位置から引きずり出します。集団戦の絶対的な鍵は、最初のキル/アシストを得て「狂乱」を発動させることです。発動後はハイパーキャリーのように立ち回れます。",
            "commonMistakes": "スキル2のフックを外したのにそのまま戦闘を続行すること。CCの濃い構成に対して最初に突っ込み、パッシブを発動する前にスタンされて即死すること。",
            "combos": [
                {
                    "title": "背負い投げエクスキュート",
                    "description": "スキル2（チャージ命中） -> スキル1 -> スキル2（投げ） -> スキル3 -> 通常攻撃。ターゲットをフックし、スキル1で少し引き寄せ、スキル2の再発動で背後に投げ飛ばし、アルティメットですり抜けながら通常攻撃を叩き込みます。"
                },
                {
                    "title": "チェイス＆リポジショニング",
                    "description": "スキル1 -> スキル2（チャージ） -> スキル3（フック済の場合）。スキル1で距離を詰め、即座にスキル2のチャージを開始します。フック済みのターゲットの周囲をアルティメットで移動し、敵の方向指定スキルを回避します。"
                }
            ]
        }
    },
    "196": {
        "en": {
            "earlyGame": "Baili Shouyue is a lethal sniper in the Farm Lane or Mid Lane. Use your passive camouflage near walls to safely approach the lane. In the early game, your Skill 2 deals absurd damage. Hide your laser sight by aiming backwards or into a wall, then quickly flick it to the enemy for high burst damage. Dominate the lane through relentless poke.",
            "midGame": "Vision is your priority. Place your Skill 1 vision devices in crucial jungle intersections and river bushes. This makes you entirely immune to ganks. Continue to poke the enemy team under their towers with Skill 2, forcing them to recall and allowing your team to take objectives without resistance.",
            "lateGame": "Your role is to cripple the enemy carries before the teamfight even begins. A single well-aimed late-game snipe can drop an enemy mage or marksman to half HP. Use your massive basic attack damage in between snipes, as your passive converts crit chance into pure physical attack power.",
            "teamfight": "Stay far back and snipe. Do not let enemies close the gap. If an assassin dives you, immediately use your Ultimate to deal burst damage and leap backwards, slowing them. Rely on your basic attacks when enemies are too close to safely charge a snipe, as they hit incredibly hard.",
            "commonMistakes": "Over-relying on the Skill 2 snipe in close-quarters combat while ignoring your extremely high-damage basic attacks. Leaving the laser sight clearly visible for the enemy to dodge.",
            "combos": [
                {
                    "title": "The Flick Snipe",
                    "description": "Aim Skill 2 in the opposite direction -> Snap cursor to target -> Fire. Hides the warning laser line from the enemy until the absolute last millisecond, making the shot nearly impossible to dodge."
                },
                {
                    "title": "Assassin Counter-Measure",
                    "description": "Basic Attack -> Skill 3 (Ultimate) -> Skill 2. Auto-attack the diving assassin, immediately Ultimate to leap backwards and slow them, then finish them off with a quick-cast Skill 2."
                }
            ]
        },
        "ja": {
            "earlyGame": "百里守約はファームレーンまたはミッドレーンの致命的なスナイパーです。壁際のパッシブカモフラージュを利用して安全にレーンに接近します。序盤のスキル2は理不尽なほどのダメージを叩き出します。レーザーサイトを後ろや壁に向けて隠し、素早く敵にフリックして大ダメージを与えましょう。執拗なポークでレーンを完全に制圧します。",
            "midGame": "視界確保が最優先事項です。スキル1の視界デバイスをジャングルの交差点や川の茂みに配置することで、ガンクを完全に無効化できます。タワー下の敵にスキル2でポークを続け、リコールを強要させることで、チームが抵抗なしにオブジェクトを獲得できるようになります。",
            "lateGame": "集団戦が始まる前に、敵のキャリーを半殺しにすることがあなたの役割です。終盤の正確な狙撃が一発当たるだけで、敵のメイジやマークスマンのHPを半分に削ることができます。パッシブによってクリティカル率が純粋な物理攻撃力に変換されるため、狙撃の合間には高火力の通常攻撃も積極的に使いましょう。",
            "teamfight": "はるか後方から狙撃します。絶対に敵に距離を詰めさせないでください。アサシンが飛び込んできた場合は、即座にアルティメットを使用してバーストダメージを与えつつ後方に跳躍し、スロウを与えます。敵が近すぎて安全に狙撃をチャージできない場合は、非常に威力の高い通常攻撃に頼りましょう。",
            "commonMistakes": "近接戦闘においてもスキル2の狙撃に固執し、超高火力の通常攻撃を無視すること。レーザーサイトを敵に丸見えの状態で構え続け、簡単に避けられてしまうこと。",
            "combos": [
                {
                    "title": "フリックスナイプ",
                    "description": "スキル2を反対方向にエイム -> カーソルをターゲットに弾くように合わせる -> 発射。発射の直前まで警告のレーザーラインを敵から隠すことで、回避をほぼ不可能にします。"
                },
                {
                    "title": "対アサシンカウンター",
                    "description": "通常攻撃 -> スキル3（アルティメット） -> スキル2。飛び込んでくるアサシンに通常攻撃を入れ、即座にアルティメットで後ろに跳び退きつつスロウをかけ、クイックキャストのスキル2でトドメを刺します。"
                }
            ]
        }
    },
    "197": {
        "en": {
            "earlyGame": "Yi Xing is a Mid Lane control mage who manipulates the battlefield with Go pieces. Focus on clearing the wave quickly using the collision of your black and white pieces (Skill 1 and Skill 2). Use the movement speed boost from the piece collisions to safely rotate and support your side lanes.",
            "midGame": "Your area control is phenomenal around narrow jungle chokes and objective pits. Poke constantly with your Go pieces. The slow and burst damage from the collisions will heavily chunk squishy targets. Your passive grants you temporary invulnerability upon taking fatal damage, allowing you to play slightly more aggressive baiting tactics.",
            "lateGame": "You are a master of teamfight orchestration. Your Ultimate creates a massive, inescapable chessboard. In the late game, placing this chessboard over the enemy team during a Dragon or Overlord contest is almost a guaranteed teamfight victory. Focus on capturing as many priority targets inside as possible.",
            "teamfight": "Throw Skill 1 (Black Piece) and Skill 2 (White Piece) to collide over the enemy backline for heavy AoE damage and slows. When the enemy commits to a fight or groups up tightly, drop your Ultimate. The boundary walls will trap them, allowing your team to freely rain down AoE damage.",
            "commonMistakes": "Missing the Ultimate completely or trapping only the enemy frontline tank. Failing to consistently collide the black and white pieces, which is the primary source of your damage.",
            "combos": [
                {
                    "title": "Checkmate Arena",
                    "description": "Skill 3 -> Skill 1 -> Skill 2 -> Enhanced Basic Attack. Drop the massive Ultimate chessboard to trap enemies, then continually spawn black and white pieces inside to trigger explosions, weaving in your enhanced auto-attacks."
                },
                {
                    "title": "Standard Collision Poke",
                    "description": "Skill 1 -> Skill 2 -> Basic Attack. Place a black piece, immediately place a white piece nearby to trigger the magnetic collision, and follow up with the enhanced basic attack."
                }
            ]
        },
        "ja": {
            "earlyGame": "奕星は碁石を使って戦場を操るミッドレーンのコントロールメイジです。黒石と白石（スキル1とスキル2）の衝突を利用して、素早いウェーブクリアに集中します。石の衝突時に得られる移動速度上昇を活かして、安全にサイドレーンへローテーションし、味方をサポートしましょう。",
            "midGame": "狭いジャングルの通路やオブジェクト周辺でのエリア制圧力が驚異的です。碁石を使って常にポークを行います。衝突時のスロウとバーストダメージは、柔らかいターゲットの体力を大きく削ります。致命傷を受けても一時的に無敵になるパッシブがあるため、少し強気なベイト（釣り）戦術をとることも可能です。",
            "lateGame": "あなたは集団戦を指揮するマスターです。アルティメットは巨大で脱出不可能な碁盤を作り出します。終盤、ドラゴンやオーバーロードの攻防で敵チームの上にこの碁盤を展開できれば、集団戦の勝利はほぼ確実です。できるだけ多くの優先ターゲットを盤内に閉じ込めることに集中してください。",
            "teamfight": "スキル1（黒石）とスキル2（白石）を敵の後衛の上で衝突させ、強力な範囲ダメージとスロウを与え続けます。敵が深くエンゲージしてきた時や密集した瞬間に、アルティメットを展開します。境界壁が敵を罠にかけ、味方が一方的に範囲ダメージを降らせることができます。",
            "commonMistakes": "アルティメットを完全に外したり、敵の前衛タンクだけを閉じ込めてしまうこと。主なダメージ源である黒石と白石の衝突を継続的に発生させられないこと。",
            "combos": [
                {
                    "title": "チェックメイト・アリーナ",
                    "description": "スキル3 -> スキル1 -> スキル2 -> 強化通常攻撃。巨大なアルティメットの碁盤を展開して敵を閉じ込め、その中に黒石と白石を継続的に配置して爆発を起こしつつ、強化通常攻撃を挟みます。"
                },
                {
                    "title": "スタンダード衝突ポーク",
                    "description": "スキル1 -> スキル2 -> 通常攻撃。黒石を置き、即座に近くに白石を置いて磁力による衝突を引き起こし、直後に強化通常攻撃で追撃します。"
                }
            ]
        }
    },
    "198": {
        "en": {
            "earlyGame": "Meng Qi is a versatile fighter/tank primarily played in the Clash Lane or Jungle. Manage your 'Mass' (energy) carefully. Higher Mass means more attack damage and defense but slower movement. Bully your lane opponent by using your Skill 1 shield to negate their poke while hitting them with heavy basic attacks.",
            "midGame": "You excel in side-lane pressure and skirmishes. Use your Skill 2 to throw bubbles that reduce enemy movement speed and lower their attack power, making you incredibly hard to duel. Rotate to teamfights with your Ultimate, which allows you to dash a massive distance and knock up enemies upon landing.",
            "lateGame": "Depending on your build (Physical, Magical, or Tank), your role shifts. As physical, you are a backline threat that hits like a truck. As a tank, you are a disruptor. Regardless, use your Ultimate's CC immunity and mobility to bypass the enemy frontline and dive straight onto their priority targets.",
            "teamfight": "Start by throwing Skill 2 to poke and debuff. Channel your Ultimate to traverse the battlefield and dive the enemy marksman or mage, knocking them up. Immediately use Skill 1 to gain a shield and generate Mass, then pummel them with basic attacks.",
            "commonMistakes": "Entering a fight with zero Mass, leaving you incredibly squishy and lacking damage. Using the Ultimate without predicting the enemy's movement, resulting in a completely missed landing.",
            "combos": [
                {
                    "title": "Dream Dive",
                    "description": "Skill 3 (Channel & Release) -> Skill 1 -> Basic Attacks -> Skill 2. Use Ultimate to fly to the backline and knock them up. Instantly use Skill 1 for the shield and Mass, auto-attack, and use Skill 2 to slow them if they try to run."
                },
                {
                    "title": "Trading Shield",
                    "description": "Skill 1 -> Basic Attack -> Skill 2. Pop the shield to absorb the enemy's damage ability, hit them with heavy autos, and throw the bubble to debuff them as you back off."
                }
            ]
        },
        "ja": {
            "earlyGame": "夢奇（モンキ）はクラッシュレーンやジャングルで使われる万能なファイター/タンクです。「質量」（エネルギー）の管理が重要です。質量が高いほど攻撃力と防御力が上がりますが、移動速度は落ちます。スキル1のシールドで敵のポークを無効化しつつ、重い通常攻撃を当ててレーンの主導権を握りましょう。",
            "midGame": "サイドレーンの圧力と小規模戦に優れています。スキル2で泡を投げ、敵の移動速度と攻撃力を低下させることで、1v1のデュエルにおいて圧倒的な強さを誇ります。アルティメットの長距離ダッシュと着地時のノックアップを利用して、集団戦に素早く合流しましょう。",
            "lateGame": "ビルド（物理、魔法、タンク）によって役割が変わります。物理ビルドなら後衛を破壊する脅威となり、タンクなら敵陣を掻き回すディスラプターになります。いずれにせよ、アルティメットのCC無効と機動力を活かして敵の前衛を飛び越え、優先ターゲットに直接ダイブしましょう。",
            "teamfight": "まずスキル2を投げてポークとデバフを与えます。アルティメットをチャージして戦場を横断し、敵のマークスマンやメイジにダイブしてノックアップさせます。即座にスキル1でシールドと質量を獲得し、通常攻撃で叩きのめします。",
            "commonMistakes": "質量がゼロの状態で戦闘に突入し、耐久力も火力もない状態になってしまうこと。敵の動きを予測せずにアルティメットを使い、着地地点に誰もいないという空振りをすること。",
            "combos": [
                {
                    "title": "ドリーム・ダイブ",
                    "description": "スキル3（チャージ＆解放） -> スキル1 -> 通常攻撃 -> スキル2。アルティメットで後衛に飛んでノックアップさせます。即座にスキル1でシールドと質量を得て通常攻撃を行い、逃げようとしたらスキル2でスロウをかけます。"
                },
                {
                    "title": "トレーディング・シールド",
                    "description": "スキル1 -> 通常攻撃 -> スキル2。シールドを張って敵のダメージスキルを吸収し、重い通常攻撃を当て、下がり際に泡を投げてデバフを与えます。"
                }
            ]
        }
    },
    "199": {
        "en": {
            "earlyGame": "Gongsun Li is the most agile Farm Lane marksman, functioning almost like an assassin. Your entire kit relies on managing your paper umbrella. Every skill leaves the umbrella behind, and recasting blinks you to it. Use Skill 1 to dash forward, trade basic attacks to stack your passive, and instantly blink back.",
            "midGame": "You thrive in small skirmishes due to your insane mobility and projectile deletion. Skill 2 spins the umbrella around you, blocking all incoming enemy projectiles (auto-attacks and skills). Use this to completely negate the enemy marksman's or mage's burst. Constantly weave in and out of the fight.",
            "lateGame": "Positioning is critical. You are exceptionally squishy, and hard CC is your death sentence. Play around the edges of the fight. Use your Ultimate to knock back diving assassins or frontline tanks. Your passive magic damage explosions on every 4th hit will shred even the tankiest targets if you survive.",
            "teamfight": "Never stay in one place. Use Skill 1 to poke from unpredictable angles. Reactively use Skill 2 to eat big enemy ultimates (like Zhuge Liang's or Hou Yi's). If the enemy frontline dives you, push them away with your Ultimate, then blink to the umbrella behind them to kite.",
            "commonMistakes": "Forgetting where the umbrella is and blinking directly into the enemy team. Using Skill 2 offensively and leaving yourself vulnerable to enemy projectiles.",
            "combos": [
                {
                    "title": "Hit & Run Poke",
                    "description": "Skill 1 -> Basic Attack (x2) -> Skill 1 (Recast). Dash forward from a safe position, quickly land two auto-attacks to apply passive marks, and recast to blink back to your starting position before they can react."
                },
                {
                    "title": "Self-Peel & Kite",
                    "description": "Skill 3 -> Basic Attack -> Skill 3 (Recast) -> Skill 2. Knock back an advancing threat with Ultimate, auto-attack, blink to the umbrella to reposition, and use Skill 2 to block their ranged retaliation."
                }
            ]
        },
        "ja": {
            "earlyGame": "公孫離はアサシンのように振る舞う、最も機敏なファームレーンのマークスマンです。全てのスキルは和傘の管理に依存しています。各スキルで傘をその場に残し、再発動で傘の位置にブリンク（瞬間移動）します。スキル1で前方にダッシュし、通常攻撃でパッシブのスタックを溜め、即座に元の位置に戻るハラスを徹底しましょう。",
            "midGame": "驚異的な機動力と「投射物かき消し」により、小規模戦で無類の強さを発揮します。スキル2は周囲で傘を回転させ、飛んでくる敵の攻撃（通常攻撃やスキル）を全てかき消します。これで敵マークスマンやメイジのバーストを完全に無効化し、戦闘に出入りし続けましょう。",
            "lateGame": "位置取りが極めて重要です。非常に柔らかいため、ハードCC（スタンなど）を受けると即死します。集団戦の外縁で立ち回りましょう。アルティメットを使って、飛び込んでくるアサシンや前衛タンクをノックバックさせます。生き残りさえすれば、4ヒットごとのパッシブの魔法ダメージ爆発がタンクすら粉砕します。",
            "teamfight": "決して同じ場所に留まらないでください。スキル1を使って予測不可能な角度からポークします。敵の強力なアルティメット（諸葛亮や后羿など）にはスキル2を反応させて無効化します。敵の前衛がダイブしてきたら、アルティメットで押し返し、その後ろにある傘にブリンクしてカイト（引き撃ち）します。",
            "commonMistakes": "傘がどこにあるかを忘れ、再発動して敵のど真ん中にブリンクしてしまうこと。スキル2を攻撃的に使いすぎて、敵の投射物に対する防御手段を失うこと。",
            "combos": [
                {
                    "title": "ヒット＆ラン・ポーク",
                    "description": "スキル1 -> 通常攻撃（2回） -> スキル1（再発動）。安全な位置から前方にダッシュし、素早く通常攻撃を2回入れてパッシブのマークを付与し、敵が反撃する前に再発動で元の位置に戻ります。"
                },
                {
                    "title": "セルフピール＆カイト",
                    "description": "スキル3 -> 通常攻撃 -> スキル3（再発動） -> スキル2。接近してくる脅威をアルティメットで突き飛ばし、通常攻撃を入れ、傘にブリンクして位置を調整し、敵の遠距離からの反撃をスキル2で防ぎます。"
                }
            ]
        }
    },
    "501": {
        "en": {
            "earlyGame": "Ming Shiyin is an aggressive enchanter Support who directly amplifies one ally's stats. Link to your jungler or marksman using Skill 1. In the early game, you make your tethered ally overwhelmingly strong, increasing their physical and magical attack. Play hyper-aggressively with them to invade or dominate the lane.",
            "midGame": "Stick to your most fed teammate like glue. Use Skill 2 to toggle the tether's effect between offensive (red) and defensive (yellow) stances. If your carry is full health, keep it on red for maximum damage. If they are getting focused, quickly switch to yellow to boost their armor and magic resist.",
            "lateGame": "Your positioning is tied entirely to your tethered carry. You are the ultimate stat-stick. Your Ultimate allows you to sacrifice your own HP to instantly heal your tethered ally for a massive amount (or deal true damage to a tethered enemy). Keep your hyper-carry alive at all costs.",
            "teamfight": "Stay immediately behind your tethered carry. Toggle Skill 2 based on whether they are dealing damage or taking damage. If an assassin dives your carry, instantly press your Ultimate to restore their HP pool, effectively giving them a second life. Then use your passive basic attack stun to peel.",
            "commonMistakes": "Breaking the tether by walking too far away from your ally. Forgetting to switch to the defensive yellow stance when your ally is getting bursted. Using Ultimate too late.",
            "combos": [
                {
                    "title": "The Hyper-Carry Sustainer",
                    "description": "Skill 1 (Link Ally) -> Skill 2 (Toggle Yellow) -> Skill 3 (Ultimate). Keep the ally linked, switch to defense mode as the enemy engages, and burst-heal them with the Ultimate to turn the tide."
                },
                {
                    "title": "Aggressive True Damage Execute",
                    "description": "Skill 1 (Link Enemy) -> Skill 2 (Toggle Red) -> Skill 3 (Ultimate). Link an enemy target, reduce their defense with the red tether, and use your Ultimate to deal a massive burst of true damage based on your AP."
                }
            ]
        },
        "ja": {
            "earlyGame": "明世隠（ミン・シイン）は、味方1人のステータスを直接増幅させる攻撃的なエンチャンターサポートです。スキル1でジャングラーやマークスマンにリンクします。序盤はリンクした味方の物理・魔法攻撃力を大幅に引き上げ、圧倒的な強さを与えます。味方と共に超攻撃的にインベードやレーン戦を支配しましょう。",
            "midGame": "最も育っている味方にピッタリと張り付きます。スキル2を使って、リンクの効果を攻撃（赤）と防御（黄）のスタンスに切り替えます。キャリーのHPが十分なら赤で火力を最大化し、敵のフォーカスを受けている場合は素早く黄に切り替えて物理・魔法防御を上昇させます。",
            "lateGame": "あなたの位置取りはリンクしたキャリーと完全に連動します。あなたは究極の「歩くステータスバフ」です。アルティメットは自身のHPを犠牲にして、リンクした味方のHPを即座に超回復（または敵に確定ダメージ）させます。何があってもハイパーキャリーを生かし続けてください。",
            "teamfight": "リンクしたキャリーの真後ろをキープします。キャリーが攻撃しているか、ダメージを受けているかに応じてスキル2を切り替えます。アサシンがキャリーにダイブしてきたら、即座にアルティメットを押してHPを超回復させ、実質的に2つ目の命を与えます。その後、パッシブの通常攻撃スタンでピールします。",
            "commonMistakes": "味方から離れすぎてリンクを切らしてしまうこと。味方がバーストダメージを受けているのに防御（黄）スタンスに切り替えるのを忘れること。アルティメットの回復が遅れること。",
            "combos": [
                {
                    "title": "ハイパーキャリー・サステイン",
                    "description": "スキル1（味方リンク） -> スキル2（黄に切り替え） -> スキル3（アルティメット）。味方をリンクし続け、敵がエンゲージしてきたら防御モードに切り替え、アルティメットのバースト回復で形勢を逆転させます。"
                },
                {
                    "title": "アグレッシブ確定ダメージ処刑",
                    "description": "スキル1（敵リンク） -> スキル2（赤に切り替え） -> スキル3（アルティメット）。敵ターゲットにリンクし、赤いリンクで防御力を下げ、アルティメットを使ってAPスケールの巨大な確定ダメージを叩き込みます。"
                }
            ]
        }
    },
    "502": {
        "en": {
            "earlyGame": "Pei is an aggressive dual-form Jungle assassin/marksman. You have access to your Ultimate at Level 1, allowing you to transform between Human (ranged poke) and Tiger (melee burst). Start in Tiger form for faster clear, and aggressively invade the enemy jungle at Level 2. Your early skirmishing power is unmatched.",
            "midGame": "Control the map tempo by constantly invading and securing objectives. Use Human form to poke with Skill 1 and gain attack speed with Skill 2. When an enemy is below half health, transform into Tiger form, use Skill 2 to jump walls, and burst them down with Tiger's enhanced basic attack and Skill 1 bite.",
            "lateGame": "Late game teamfights require extreme caution as you are squishy in both forms. Play purely as a Human form marksman at the start of the fight. Poke, chip down tanks, and apply red buff slows. Only commit to Tiger form when you see a clear opportunity to clean up low-health targets.",
            "teamfight": "Stay in Human form. Spam Skill 1 to poke and Skill 2 for the shield and attack speed buff. Kite the enemy frontline. Once the enemy crowd control is exhausted and targets drop below 40% HP, press Ultimate to transform into a Tiger, leap onto the squishies with Skill 2, and execute them.",
            "commonMistakes": "Jumping into a 5v5 teamfight in Tiger form first, getting instantly focused and killed. Failing to utilize walls for the Tiger form Skill 2 double-jump mechanic.",
            "combos": [
                {
                    "title": "Tiger Cleanup Execute",
                    "description": "Human Skill 1 -> Skill 3 (Transform) -> Tiger Skill 2 (Wall Jump) -> Enhanced Basic Attack -> Tiger Skill 1. Poke in human form, transform to tiger, use a wall to double-jump onto the target, bite them, and finish with the execution damage."
                },
                {
                    "title": "Human Form Kite",
                    "description": "Tiger Skill 3 (Transform) -> Human Skill 2 -> Basic Attacks -> Human Skill 1. Transform to human for range, pop the shield/attack speed steroid, kite backwards with basic attacks, and throw the energy blast to slow."
                }
            ]
        },
        "ja": {
            "earlyGame": "裴擒虎（ペイ）は、2つの形態を持つ攻撃的なジャングルのアサシン/マークスマンです。レベル1からアルティメットが使え、人間形態（遠距離ポーク）と虎形態（近接バースト）を切り替えられます。虎形態で素早くジャングルを回り、レベル2で積極的に敵ジャングルにインベードしましょう。序盤の戦闘力は無類です。",
            "midGame": "絶え間ないインベードとオブジェクト確保でマップのテンポを支配します。人間形態ではスキル1でポークし、スキル2で攻撃速度を上げます。敵のHPが半分以下になったら虎形態に変身し、スキル2で壁を越えて飛びかかり、強化通常攻撃とスキル1の噛み付きでバーストダメージを与えます。",
            "lateGame": "両形態とも耐久力が低いため、終盤の集団戦は細心の注意が必要です。戦闘の序盤は純粋な人間形態のマークスマンとして立ち回ります。ポークし、タンクを削り、赤バフのスロウを付与します。低HPのターゲットを掃討する明確なチャンスが見えた時のみ、虎形態で突っ込みます。",
            "teamfight": "人間形態を維持します。スキル1を連発してポークし、スキル2でシールドと攻撃速度バフを得て前衛をカイトします。敵のCCが枯渇し、ターゲットのHPが40%を切ったら、アルティメットで虎に変身し、スキル2で柔らかい敵に飛びかかって処刑します。",
            "commonMistakes": "5v5の集団戦に最初から虎形態で飛び込み、瞬時にフォーカスされて即死すること。虎形態のスキル2における、壁を使った2段ジャンプのメカニクスを活用できていないこと。",
            "combos": [
                {
                    "title": "タイガー・クリーンアップ",
                    "description": "人間スキル1 -> スキル3（変身） -> 虎スキル2（壁ジャンプ） -> 強化通常攻撃 -> 虎スキル1。人間形態でポークし、虎に変身、壁を利用してターゲットに2段ジャンプで接近し、強化攻撃からの噛み付きでトドメを刺します。"
                },
                {
                    "title": "ヒューマンフォーム・カイト",
                    "description": "虎スキル3（変身） -> 人間スキル2 -> 通常攻撃 -> 人間スキル1。人間形態に戻って射程を確保し、シールドと攻撃速度バフを発動、通常攻撃で引き撃ちしながらエネルギー弾を投げてスロウをかけます。"
                }
            ]
        }
    },
    "503": {
        "en": {
            "earlyGame": "Biron is a lane-dominant Clash Lane fighter focused on managing his energy bar. Basic attacks and abilities build energy. When your energy is at or above one bar (30+), your skills become enhanced and deal massive damage with lifesteal. Constantly hit minions to keep your energy high before engaging the enemy laner.",
            "midGame": "Your mid-game teamfight presence is terrifying. Look for flanks where you can engage multiple enemies. Biron deals insane AoE damage and heals heavily based on the number of targets hit. Use Skill 2 to dash and position yourself, then unleash an enhanced Skill 1 to obliterate the enemy frontline and backline simultaneously.",
            "lateGame": "In the late game, you serve as a frontline diver and disruptor. You can tank immense amounts of damage as long as you are hitting multiple targets with your enhanced Skill 1 and Ultimate. However, you are vulnerable to heavy crowd control and kiting. Ensure you have Flash ready for crucial engages.",
            "teamfight": "Stack energy on jungle camps or minions before the fight if possible. Dash in with Skill 2, knock up the primary target with the enhanced basic attack, immediately drop your Ultimate to slow them and gain a massive shield (while generating energy), and finish with an enhanced Skill 1 for massive AoE burst and healing.",
            "commonMistakes": "Engaging with zero energy, resulting in weak, unenhanced skills and no sustain. Getting kited out and missing the enhanced Skill 1 on the primary targets.",
            "combos": [
                {
                    "title": "Full Energy Annihilation",
                    "description": "Skill 2 (Dash) -> Enhanced Basic Attack (Knockup) -> Skill 3 -> Enhanced Skill 1. Dash in, knock the target up, slam the ground with Ultimate to steal shields and deal damage, then spin with enhanced Skill 1 to heal and execute."
                },
                {
                    "title": "Lane Trading Spin",
                    "description": "Build 1 Bar Energy -> Skill 1 (Enhanced) -> Skill 2 (Dash out). Walk up and use the enhanced electrical spin to deal heavy damage and heal off the enemy/minions, then dash away to safety."
                }
            ]
        },
        "ja": {
            "earlyGame": "狂鉄（ビロン）はエネルギーゲージの管理を中核とする、レーン戦に強いクラッシュレーンのファイターです。通常攻撃とスキルでエネルギーが溜まり、1メモリ（30以上）あるとスキルが強化され、絶大なダメージと回復効果を得ます。敵と交戦する前にミニオンを殴って常にエネルギーを高く保ちましょう。",
            "midGame": "中盤の集団戦における存在感は圧倒的です。複数の敵を巻き込める側面からのエンゲージを狙いましょう。ビロンは命中した敵の数に応じて強力な範囲ダメージと凄まじい回復を発揮します。スキル2のダッシュで位置取り、強化スキル1を放って敵の前衛と後衛を同時に粉砕します。",
            "lateGame": "終盤は前衛のダイバーおよびディスラプターとして機能します。強化スキル1とアルティメットで複数のターゲットを巻き込んでいる限り、膨大なダメージを耐えることができます。ただし、重いCCやカイト（引き撃ち）には弱いため、重要なエンゲージの際は必ずフラッシュを準備しておきましょう。",
            "teamfight": "可能なら戦闘前にジャングルやミニオンでエネルギーを溜めます。スキル2で飛び込み、強化通常攻撃で主要ターゲットをノックアップさせ、即座にアルティメットを叩き込んでスロウと巨大なシールドを獲得（同時にエネルギーも生成）し、最後に強化スキル1の範囲バーストと回復で締めくくります。",
            "commonMistakes": "エネルギーゼロの状態で突っ込み、強化されていない弱いスキルしか出せずに回復もできず死ぬこと。カイトされて強化スキル1を主要ターゲットに外してしまうこと。",
            "combos": [
                {
                    "title": "フルエネルギー・アナイアレーション",
                    "description": "スキル2（ダッシュ） -> 強化通常攻撃（打上） -> スキル3 -> 強化スキル1。飛び込んで敵を打ち上げ、アルティメットで地面を叩き割ってシールドを奪いダメージを与え、強化スキル1の回転斬りで回復しつつトドメを刺します。"
                },
                {
                    "title": "レーントレード・スピン",
                    "description": "エネルギーを1メモリ溜める -> スキル1（強化） -> スキル2（離脱）。近づいて強化された電撃スピンを当て、敵やミニオンから大ダメージと回復を奪い、即座にダッシュで安全圏に下がります。"
                }
            ]
        }
    },
    "504": {
        "en": {
            "earlyGame": "Milady is a Mid Lane push specialist who relies on her mechanical minions to do the dirty work. Spam your Skill 2 to summon robots and aggressively shove the minion wave into the enemy tower. By keeping the enemy mage constantly clearing under their tower, you create immense map pressure and rotational freedom for your jungler.",
            "midGame": "Your sole objective is to take down towers. Whenever the enemy mid laner roams to a side lane, brutally punish them by using your mechanical army and Ultimate (which can be cast on towers) to instantly melt their Mid tier 1 or tier 2 tower. Avoid river skirmishes without your team.",
            "lateGame": "In the late game, your raw teamfight damage falls off compared to traditional burst mages, but your siege potential is unmatched. Play safely in the backline. Send waves of robots into the enemy base to tank tower shots and slowly chip away at the high ground inhibitors. ",
            "teamfight": "Stay far away from enemy assassins. Constantly spawn robots with Skill 2 and throw Skill 1 airplanes to poke and slow. If an assassin jumps on you, drop your Ultimate directly on them to stun and amplify the damage of your robots attacking them, while you run for your life.",
            "commonMistakes": "Wandering into the unwarded river or jungle alone; Milady has absolutely no mobility and will instantly die to any gank. Forgetting that her Ultimate can and should be used on enemy towers for massive siege damage.",
            "combos": [
                {
                    "title": "Tower Demolition",
                    "description": "Skill 2 (x2) -> Skill 3 (On Tower) -> Skill 1. Summon a horde of robots, cast your Ultimate directly onto the enemy tower to amplify all damage it takes, and throw the airplane to push the lane faster."
                },
                {
                    "title": "Anti-Dive Stun",
                    "description": "Skill 3 -> Skill 2 -> Skill 1 -> Run away. When dived, instantly Ultimate the assassin to stun them and mark them, drop robots at your feet to swarm them, and throw Skill 1 while escaping."
                }
            ]
        },
        "ja": {
            "earlyGame": "ミレディは機械のミニオンを操って戦う、ミッドレーンのプッシュ特化型メイジです。スキル2を連発してロボットを召喚し、敵タワーにミニオンウェーブを激しく押し付けます。敵メイジを常にタワー下での防戦に追い込むことで、莫大なマッププレッシャーと味方ジャングラーの自由なローテーションを生み出します。",
            "midGame": "あなたの唯一の目的はタワーを折ることです。敵のミッドレーナーがサイドレーンにロームした隙を見逃さず、機械の軍団とアルティメット（タワーにも使用可能）を使って、ミッドのティア1・ティア2タワーを瞬時に溶かして致命的なペナルティを与えましょう。味方がいない川での戦闘は避けてください。",
            "lateGame": "終盤になると、従来のバーストメイジに比べて純粋な集団戦でのダメージは落ちますが、シージ（攻城）能力は右に出る者がいません。後衛で安全に立ち回り、ロボットの波を敵陣に送り込んでタワーの攻撃を引き受けさせ、高台のインヒビタータワーを徐々に削り取ります。",
            "teamfight": "敵アサシンからは遠く離れてください。常にスキル2でロボットを生み出し、スキル1の飛行機を投げてポークとスロウを行います。アサシンが飛び込んできた場合は、直接アルティメットを当ててスタンさせ、ロボットの攻撃を増幅させつつ、全力で逃げます。",
            "commonMistakes": "視界のない川やジャングルを一人で歩き回ること。ミレディは機動力が皆無なためガンクされると即死します。アルティメットが敵のタワーに対しても絶大な攻城ダメージを出せることを忘れること。",
            "combos": [
                {
                    "title": "タワー・デモリション",
                    "description": "スキル2（2回） -> スキル3（タワーへ） -> スキル1。ロボットの群れを召喚し、敵タワーに直接アルティメットを撃ち込んで被ダメージを増幅させ、飛行機を投げて高速で施設を破壊します。"
                },
                {
                    "title": "アンチダイブ・スタン",
                    "description": "スキル3 -> スキル2 -> スキル1 -> 逃走。ダイブされたら、即座にアサシンにアルティメットを撃ってスタンとマークを付与し、足元にロボットを置いて群がらせ、スキル1を投げながら逃げます。"
                }
            ]
        }
    },
    "505": {
        "en": {
            "earlyGame": "Yaria is a highly dependent Support enchanter who possesses an ally. Start by helping your mid laner clear the first wave using your Skill 2 auto-targeting magic. Then, rotate with your jungler to secure the early crabs and gank. Use Skill 1 to scout bushes; the energy blast will auto-track hidden enemies and knock them up.",
            "midGame": "Once you hit Level 4, your Ultimate allows you to attach to a teammate, granting them a massive true-damage shield. Identify the most fed player on your team (usually the Jungler or Marksman) and become their personal guardian. While attached, your Skill 1 and Skill 2 ranges are increased.",
            "lateGame": "In late-game teamfights, your true-shield is the difference between your carry dying instantly or wiping the enemy team. Do not stay attached until the shield breaks completely. If you manually detach before the shield is destroyed, your Ultimate cooldown is drastically reduced.",
            "teamfight": "Attach to your primary carry. Spam Skill 2 to deal continuous magical damage and Skill 1 to interrupt enemy channels or reveal assassins. When your shield is about to break, jump off manually, absorb a soft crowd control spell to trigger your Deer passive (invulnerability), and then jump back onto the carry once your cooldown resets.",
            "commonMistakes": "Allowing the Ultimate shield to be completely broken by enemy damage, resulting in a painfully long cooldown. Staying in human form too long during teamfights where you are incredibly squishy.",
            "combos": [
                {
                    "title": "The Infinite Shield Loop",
                    "description": "Skill 3 (Attach) -> Skill 1 -> Skill 2 -> Skill 3 (Manual Detach right before shield breaks) -> Wait briefly -> Skill 3 (Re-attach). Maximizes uptime on your carry by refunding cooldown through manual detachment."
                },
                {
                    "title": "Bush Scout & Disable",
                    "description": "Skill 1 (Into Brush) -> Wait for auto-track knockup -> Skill 3 (Attach to engaging ally). Safely check for ambushes and immediately provide a shield to the ally diving the revealed target."
                }
            ]
        },
        "ja": {
            "earlyGame": "ヤリアは味方に憑依する、非常に依存度の高いサポートエンチャンターです。序盤はスキル2の自動ターゲット魔法でミッドレーナーのウェーブクリアを手伝います。その後ジャングラーとローテーションし、川蟹を確保してガンクに向かいます。スキル1で茂みを索敵してください。エネルギー弾が隠れた敵を自動追尾して打ち上げます。",
            "midGame": "レベル4になりアルティメットを覚えると、味方に憑依して巨大な確定ダメージシールドを付与できるようになります。チーム内で最も育っているプレイヤー（通常はジャングラーかマークスマン）を見極め、彼らの専属ガーディアンになりましょう。憑依中はスキル1とスキル2の射程が伸びます。",
            "lateGame": "終盤の集団戦では、あなたの確定シールドがキャリーの即死と敵の全滅を分ける鍵となります。シールドが完全に破壊されるまで憑依したままにしないでください。シールドが壊れる前に手動で解除（降りる）すれば、アルティメットのクールダウンが大幅に短縮されます。",
            "teamfight": "メインキャリーに憑依します。スキル2を連発して継続的な魔法ダメージを与え、スキル1で敵の詠唱を妨害したりアサシンを暴き出します。シールドが割れそうになったら手動で飛び降り、わざと軽いCCを受けて鹿パッシブ（無敵）を発動させ、クールダウンが上がったら再びキャリーに飛び乗ります。",
            "commonMistakes": "敵のダメージでアルティメットのシールドを完全に破壊され、致命的に長いクールダウンを発生させてしまうこと。耐久力の低い人間形態で集団戦に長く留まりすぎること。",
            "combos": [
                {
                    "title": "無限シールドループ",
                    "description": "スキル3（憑依） -> スキル1 -> スキル2 -> スキル3（シールドが割れる直前に手動解除） -> 短時間待機 -> スキル3（再憑依）。手動解除によるクールダウン短縮を利用し、キャリーへのシールド付与時間を最大化します。"
                },
                {
                    "title": "ブッシュ索敵＆無力化",
                    "description": "スキル1（茂みへ） -> 自動追尾の打ち上げを待つ -> スキル3（エンゲージする味方に憑依）。安全に待ち伏せを確認し、暴き出されたターゲットに飛び込む味方に即座にシールドを提供します。"
                }
            ]
        }
    },
    "506": {
        "en": {
            "earlyGame": "Yunzhongjun is a unique Jungle assassin who can fly over all terrain. Exploit this passive to take completely unpredictable jungle pathing. Invade the enemy jungle relentlessly from Level 1, as your bleed passive makes your early 1v1 dueling almost unbeatable. Maintain your energy (breath) by hitting targets so you don't fall out of the sky.",
            "midGame": "You dictate the pace of the game. Ignore walls and flank from angles the enemy cannot ward. Use Skill 1 to dive-bomb priority targets. Upon hitting them, your basic attacks will shred their armor and stack a lethal bleed. If they try to flash away, the bleed will often finish them off.",
            "lateGame": "Teamfighting is difficult because you are extremely fragile. You operate strictly as a kamikaze diver or cleanup crew. Wait for the enemy tank to burn their CC, fly over the walls directly onto the enemy marksman, burst them, and use your Ultimate (which makes you untargetable) to either finish them or stall for your team to arrive.",
            "teamfight": "Never enter from the front. Hover over a wall out of vision. Dive bomb with Skill 1 onto the carry. Spam basic attacks to stack the bleed. The moment the enemy team turns to focus you, cast your Ultimate to become untargetable and drop a barrage of feathers on them.",
            "commonMistakes": "Running out of breath and walking on the ground (losing your terrain-ignoring passive) before a fight starts. Engaging first and getting CC'd before you can cast your untargetable Ultimate.",
            "combos": [
                {
                    "title": "Death from Above",
                    "description": "Skill 1 (Hold & Release) -> Basic Attacks (x4) -> Skill 2 -> Skill 3. Dive-bomb the target for a stun, rapidly apply 4 bleed stacks with basic attacks, use Skill 2 to parry their retaliation, and Ultimate to dodge their peel and secure the kill."
                },
                {
                    "title": "Untargetable Escape",
                    "description": "Skill 1 -> Basic Attack -> Skill 3 (Over Wall). Dive a target near a wall, deal a quick burst of damage, and immediately use Ultimate's untargetability and movement to glide back over the wall to safety."
                }
            ]
        },
        "ja": {
            "earlyGame": "雲中君（ユンジョンジュン）は全ての地形を飛び越えられるユニークなジャングルアサシンです。このパッシブを悪用し、完全に予測不可能なジャングルルートを取りましょう。出血パッシブにより序盤の1v1デュエルはほぼ無敵なため、レベル1から執拗に敵ジャングルにインベードします。攻撃を当てて息（エネルギー）を維持し、地上に落ちないようにしてください。",
            "midGame": "あなたがゲームのペースを支配します。壁を無視し、敵がワードを置けない角度からフランク（側面攻撃）します。スキル1で優先ターゲットに急降下爆撃を行い、命中後は通常攻撃で防御力を削り、致命的な出血スタックを付与します。敵がフラッシュで逃げても、出血ダメージで倒しきれることが多いです。",
            "lateGame": "非常に打たれ弱いため、集団戦は困難です。特攻ダイバー、または残党狩りとしてのみ機能します。敵タンクがCCを使い切るのを待ち、壁を越えて敵マークスマンに直接飛び込み、バーストを与えます。その後、対象指定不可になるアルティメットを使ってトドメを刺すか、味方の到着まで時間を稼ぎます。",
            "teamfight": "絶対に正面から入らないでください。視界外の壁の上で待機します。スキル1でキャリーに急降下し、通常攻撃を連打して出血をスタックさせます。敵チームがあなたにフォーカスを向けた瞬間にアルティメットを発動し、対象指定不可になりながら羽の雨を降らせます。",
            "commonMistakes": "戦闘が始まる前に息切れして地上を歩いてしまい、地形無視のパッシブを失うこと。最初にエンゲージしてしまい、対象指定不可のアルティメットを使う前にCCを受けて即死すること。",
            "combos": [
                {
                    "title": "デス・フロム・アバブ",
                    "description": "スキル1（長押し＆解放） -> 通常攻撃（4回） -> スキル2 -> スキル3。急降下してターゲットをスタンさせ、通常攻撃で素早く出血を4スタック付与、スキル2で反撃を弾き、アルティメットで敵のピールを避けつつキルを確実なものにします。"
                },
                {
                    "title": "アンターゲッタブル・エスケープ",
                    "description": "スキル1 -> 通常攻撃 -> スキル3（壁越え）。壁際のターゲットにダイブして瞬間火力を出し、即座にアルティメットの対象指定不可と移動を利用して、壁の向こう側へ安全に滑空して逃げます。"
                }
            ]
        }
    },
    "507": {
        "en": {
            "earlyGame": "Li Xin is a Clash Lane fighter who starts weak but unlocks two distinct forms at Level 4. Play extremely safe before Level 4, using Skill 2 to last hit minions and poke the enemy from a distance. Do not fight. Once you hit Level 4, choose Light Form for massive AoE teamfight damage, or Dark Form for split-pushing and dueling.",
            "midGame": "(Light Form): Sit behind your frontline, charge your Skill 3 (Ultimate) to unleash three massive waves of sword aura. You are essentially a physical mage. (Dark Form): Ignore teamfights. Use your insane movement speed and CC immunity (Skill 1) to ruthlessly split-push and steal the enemy jungle. Duel anyone who tries to stop you.",
            "lateGame": "(Light Form): Defend high ground or siege perfectly. Your charged Ultimate can single-handedly clear super minions or wipe out half the enemy team's HP. (Dark Form): Create immense macro pressure. While the enemy team contests a Dragon, you can take an inhibitor tower in seconds. Force them to split their attention.",
            "teamfight": "(Light Form): Stay safely in the back. Use Skill 1 to reposition. Charge Ultimate in a brush for an ambush, or use it when the enemy groups up. Spam Skill 2 waves. (Dark Form): Do not front-to-back teamfight. Flank to assassinate the enemy marksman with your rapid basic attacks, or just keep split-pushing to pull enemies away from the objective.",
            "commonMistakes": "Trying to play Dark Form like a frontline teamfighter, resulting in instant death. Using Light Form's Ultimate without charging it, severely reducing its damage and range. Feeding before reaching Level 4.",
            "combos": [
                {
                    "title": "Light Form: Radiant Annihilation",
                    "description": "Skill 1 (Dash & Empower) -> Skill 3 (Charge fully) -> Skill 2 -> Enhanced Basic Attack. Reposition for the perfect angle, unleash a fully charged Ultimate into the enemy team, follow up with the four sword waves of Skill 2, and finish with a heavy auto."
                },
                {
                    "title": "Dark Form: Shadow Execution",
                    "description": "Skill 1 (Hold for speed/CC immunity) -> Skill 3 (AoE knockup) -> Skill 2 (Slash) -> Basic Attacks. Sprint into the backline immune to CC, unleash the Ultimate to knock them up and tear them apart with Skill 2 and rapid auto-attacks."
                }
            ]
        },
        "ja": {
            "earlyGame": "李信（リ・シン）は序盤は弱いですが、レベル4で2つの全く異なる形態を解放するクラッシュレーンのファイターです。レベル4までは極めて安全に立ち回り、スキル2でミニオンのラストヒットを取りつつ遠距離からハラスします。絶対に交戦しないでください。レベル4になったら、圧倒的な範囲ダメージを誇る「光形態」か、スプリットプッシュと1v1に特化した「闇形態」を選びます。",
            "midGame": "（光形態）：前衛の後ろに陣取り、スキル3（アルティメット）をチャージして3つの巨大な剣気を放ちます。実質的に物理メイジとして機能します。（闇形態）：集団戦を無視します。異常な移動速度とCC無効（スキル1）を活かして無慈悲にスプリットプッシュを行い、敵ジャングルを荒らします。止めに来た敵は1v1で粉砕します。",
            "lateGame": "（光形態）：高台の防衛やシージで完璧な役割を果たします。チャージしたアルティメットは単独でスーパーミニオンを処理し、敵チームの半分のHPを消し飛ばします。（闇形態）：強烈なマクロプレッシャーを生み出します。敵がドラゴンを争っている間に、インヒビタータワーを数秒で破壊できます。敵の意識を分散させましょう。",
            "teamfight": "（光形態）：後方で安全を確保します。スキル1で位置取りを変え、茂みでアルティメットをチャージして奇襲するか、敵が密集した時に放ちます。スキル2の剣気を連発します。（闇形態）：正面からの集団戦は避けてください。側面から回り込んで高速の通常攻撃で敵マークスマンを暗殺するか、ひたすらスプリットプッシュして敵をオブジェクトから引き離します。",
            "commonMistakes": "闇形態で前衛のように集団戦に参加し、即死してしまうこと。光形態のアルティメットをチャージせずに撃ち、ダメージと射程を大幅に低下させること。レベル4になる前にフィードしてしまうこと。",
            "combos": [
                {
                    "title": "光形態：レイディアント・アナイアレーション",
                    "description": "スキル1（ダッシュ＆強化） -> スキル3（フルチャージ） -> スキル2 -> 強化通常攻撃。最適な角度に位置取り、フルチャージしたアルティメットを敵陣に放ち、スキル2の4つの剣気で追撃し、最後に重い通常攻撃を入れます。"
                },
                {
                    "title": "闇形態：シャドウ・エクスキュート",
                    "description": "スキル1（長押しで加速/CC無効） -> スキル3（範囲打上） -> スキル2（斬撃） -> 通常攻撃。CC無効状態で後衛に突っ込み、アルティメットで打ち上げ、スキル2と高速の通常攻撃でターゲットを引き裂きます。"
                }
            ]
        }
    },
    "508": {
        "en": {
            "earlyGame": "Garo is a late-game hyper-carry Farm Lane marksman with the longest attack range in the game when her Skill 1 is active. In the early game, turn on Skill 1 to poke enemy laners safely from afar, but watch your mana bar closely as it drains rapidly. Focus purely on farming and surviving ganks.",
            "midGame": "As you acquire core critical strike items, your passive truly shines. Every critical strike you land heavily slows the target. Use Skill 1 to siege towers from outside their retaliation range. Stay glued to your support or tank, as you have absolutely no mobility or dash abilities to escape assassins.",
            "lateGame": "You are an untouchable turret of death. With full items, a single critical hit from max range will slow an enemy so severely they can never reach you. Your Skill 2 silence is a fantastic tool to interrupt enemy initiators. If played with perfect positioning, you will melt the entire enemy team before they can touch you.",
            "teamfight": "Activate your Ultimate to boost the critical strike rate of yourself and nearby allies. Turn on Skill 1 and auto-attack the closest threat from maximum range. If an enemy diver approaches, throw Skill 2 to silence them, manually close your Ultimate to gain a burst of movement speed, and kite backward.",
            "commonMistakes": "Leaving Skill 1 active constantly and completely draining your mana, leaving you helpless in a fight. Walking forward to chase a kill and stepping out from behind your frontline.",
            "combos": [
                {
                    "title": "The Infinite Kite",
                    "description": "Skill 3 (Open) -> Skill 1 (Activate) -> Basic Attacks -> Skill 3 (Close for speed). Deploy Ultimate for the crit buff, use the long-range bow to continually land crits (applying massive slows), and close the Ultimate for a speed boost to run if they get too close."
                },
                {
                    "title": "Interrupt and Execute",
                    "description": "Skill 2 -> Skill 1 (Activate) -> Basic Attacks. Throw the piercing arrow to silence an enemy channeling a skill or engaging, immediately switch to long-range stance, and gun them down while they are silenced and slowed."
                }
            ]
        },
        "ja": {
            "earlyGame": "伽羅（ガロ）はスキル1発動時にゲーム最長の射程を誇る、終盤特化型ファームレーンハイパーキャリーです。序盤はスキル1をオンにして安全な距離から敵をポークしますが、マナが激しく消費されるためマナゲージを注視してください。ひたすらファームとガンクの回避に集中します。",
            "midGame": "クリティカル系のコアアイテムが揃い始めると、パッシブが真価を発揮します。クリティカル攻撃を当てるたびにターゲットに重いスロウを与えます。スキル1を使って、反撃を受けない射程外からタワーをシージします。機動力やダッシュスキルが一切ないため、サポートやタンクに常にピッタリと張り付いてください。",
            "lateGame": "あなたは触れることのできない死の砲台となります。フルビルド状態では、最大射程からのクリティカルが一発当たるだけで致命的なスロウがかかり、敵は永遠にあなたに近づけなくなります。スキル2のサイレンスは敵のイニシエーターを妨害する最高のツールです。完璧な位置取りをすれば、触れられる前に敵チームを溶かし尽くせます。",
            "teamfight": "アルティメットを展開し、自身と周囲の味方のクリティカル率を上げます。スキル1をオンにし、最大射程から最も近い脅威を通常攻撃し続けます。ダイバーが接近してきたら、スキル2を投げてサイレンスにし、手動でアルティメットを閉じて移動速度のバーストを得て、後ろに引き撃ち（カイト）します。",
            "commonMistakes": "スキル1を常にオンにし続けてマナを枯渇させ、いざという時に何もできなくなること。キルを追って前に出過ぎて、前衛の保護から外れてしまうこと。",
            "combos": [
                {
                    "title": "インフィニット・カイト",
                    "description": "スキル3（展開） -> スキル1（発動） -> 通常攻撃 -> スキル3（閉じて加速）。アルティメットでクリティカルバフを得て、長距離弓でクリティカル（重いスロウ）を与え続け、敵が近づきすぎたらアルティメットを閉じて加速し逃げます。"
                },
                {
                    "title": "インタラプト＆エクスキュート",
                    "description": "スキル2 -> スキル1（発動） -> 通常攻撃。貫通矢を放って詠唱中やエンゲージしてくる敵をサイレンスにし、即座に長距離構えに切り替え、サイレンスとスロウを受けている間に撃ち抜きます。"
                }
            ]
        }
    },
    "510": {
        "en": {
            "earlyGame": "Sun Ce is a high-impact Clash Lane or Jungle fighter with exceptional crowd control and global presence. In lane, aggressively trade using your Skill 1 and Skill 2. Your passive grants you armor stacks whenever you take physical damage, making you incredibly tanky against AD matchups. Clear waves fast and look for Level 4.",
            "midGame": "Your Ultimate is a game-changer. You summon a ship and sail across the map, completely ignoring crowd control while driving. Use this to constantly gank the Mid or Farm lanes. A direct crash into an enemy knocks them up, allowing you to instantly burst squishy targets. Coordinate with your jungler for unmatched map pressure.",
            "lateGame": "You are the primary initiator. A flawless ship crash into the enemy backline can win the game instantly. However, the ship's steering becomes harder the longer you sail. Plan your routes carefully and avoid crashing into terrain. If you miss the primary target, quickly jump off the ship manually to join the fight.",
            "teamfight": "Start from the jungle or a side lane out of vision. Sail your Ultimate directly into the enemy team's squishiest members. Upon crashing (or jumping off early to let the ship crash), immediately follow up with Skill 1 for a second knock-up. Then spam your Skill 2 cleaves while weaving in basic attacks to annihilate the target.",
            "commonMistakes": "Crashing the ship into a wall before reaching the teamfight. Engaging with the ship when your teammates are too far away to follow up on the massive crowd control you provide.",
            "combos": [
                {
                    "title": "The Shipwreck Combo",
                    "description": "Skill 3 (Drive) -> Skill 3 (Jump off) -> Skill 1 -> Skill 2 (x3). Sail the ship, jump off right before impact so the ship knocks them up, immediately cast Skill 1 to chain a second knock-up, and unleash all three strikes of Skill 2."
                },
                {
                    "title": "Lane Bully Lock-down",
                    "description": "Skill 1 -> Flash -> Skill 2 (x3) -> Basic Attacks. Cast Skill 1 and Flash mid-animation to guarantee the knock-up on a distant enemy, then stick to them with the slowing strikes of Skill 2."
                }
            ]
        },
        "ja": {
            "earlyGame": "孫策（スン・ツェ）は、並外れたCC（行動妨害）とグローバルな展開力を持つ、影響力の高いクラッシュレーン/ジャングルのファイターです。レーンではスキル1とスキル2を使って積極的にトレードします。パッシブにより物理ダメージを受けるたびに物理防御のスタックが溜まるため、AD対面には非常に強固です。素早くウェーブを処理し、レベル4を目指しましょう。",
            "midGame": "アルティメットが戦局を大きく変えます。船を召喚してマップを横断し、操縦中はあらゆるCCを完全に無効化します。これを駆使してミッドやファームレーンに絶え間なくガンクを仕掛けましょう。敵への直接の衝突はノックアップを与え、柔らかいターゲットを即座にバーストできます。ジャングラーと連携して圧倒的なマッププレッシャーをかけます。",
            "lateGame": "あなたがメインのイニシエーターです。敵の後衛への完璧な船の衝突は、一瞬で試合を決定づけます。ただし、航行時間が長いほど船の操縦は難しくなります。ルートを慎重に計画し、地形への衝突を避けてください。主要ターゲットを外した場合は、素早く手動で船から飛び降りて戦闘に参加します。",
            "teamfight": "視界外のジャングルやサイドレーンからスタートします。アルティメットで敵チームの最も柔らかいメンバーに直接突っ込みます。衝突時（または直前に飛び降りて船だけを衝突させる）、即座にスキル1で2回目のノックアップをチェインさせます。その後、通常攻撃を挟みながらスキル2の3連撃を叩き込み、ターゲットを粉砕します。",
            "commonMistakes": "集団戦に到達する前に船を壁に激突させてしまうこと。味方が追従できないほど遠くから単独で船で突っ込み、強力なCCを無駄にすること。",
            "combos": [
                {
                    "title": "シップレック・コンボ",
                    "description": "スキル3（操縦） -> スキル3（飛び降り） -> スキル1 -> スキル2（3回）。船を操縦し、衝突直前に飛び降りて船にノックアップさせ、即座にスキル1を撃って2回目のノックアップを繋げ、スキル2の3連撃を全て叩き込みます。"
                },
                {
                    "title": "レーンブリー・ロックダウン",
                    "description": "スキル1 -> フラッシュ -> スキル2（3回） -> 通常攻撃。スキル1の発動モーション中にフラッシュを使い、遠距離の敵に確実にノックアップを当て、スロウ効果のあるスキル2で張り付きます。"
                }
            ]
        }
    },
    "513": {
        "en": {
            "earlyGame": "Shangguan Wan'er is an incredibly high-skill-ceiling Mid Lane assassin mage. Pre-Level 4, you are quite vulnerable. Use Skill 1 and Skill 2 purely to clear waves and poke the enemy from a safe distance. The collision of her ink brush and ink blast causes an AoE explosion that deals massive damage and heals her.",
            "midGame": "At Level 4, you unlock the ability to single-handedly dive towers and assassinate targets. Your Ultimate requires you to dash 5 times (by hitting your own ink from Skill 1/2 or enemies) to fly into the air, becoming untargetable and raining down catastrophic damage. Roam aggressively to the Farm lane to execute the enemy marksman.",
            "lateGame": "Late-game teamfights require extreme precision. If you mess up your Ultimate dashes, you will be left stranded in the middle of the enemy team and die instantly. Look for flank angles or wait until crucial enemy crowd control spells (like suppression) are used before you begin your calligraphy dashes.",
            "teamfight": "Stay back and poke with the Skill 2 -> Skill 1 ink explosion combo. When a priority target drops below 70% HP, initiate your Ultimate sequence. Slide through your ink and the enemy frontline. Once you take off into the sky, position your joystick over the enemy carry to ensure the barrage of ink drops focuses them entirely.",
            "commonMistakes": "Breaking the Ultimate dash sequence by missing the ink or enemies with the joystick, resulting in a failed takeoff and certain death. Diving into hard CC (like Donghuang Taiyi's Ultimate) before taking off.",
            "combos": [
                {
                    "title": "The Standard Takeoff (2-1-3-3-3-3-3)",
                    "description": "Skill 2 -> Skill 1 -> Skill 3 (Dash x5 forward). Throw the brush (Skill 2), immediately throw the blast (Skill 1) along the same path, and use Ultimate to dash back and forth along your own ink trail 5 times to take flight."
                },
                {
                    "title": "The Step-Back Delay Flight",
                    "description": "Skill 2 -> Step Back -> Skill 3 (Dash x2 forward) -> Skill 1 -> Skill 3 (Dash x3 forward). Throw Skill 2, walk back slightly to stall, dash twice on the returning brush, throw Skill 1, and finish the last three dashes on the new ink. Very hard to predict."
                }
            ]
        },
        "ja": {
            "earlyGame": "上官婉児（シャングァン・ワンアル）は非常に操作難易度が高いミッドレーンのアサシンメイジです。レベル4以前は非常に無防備です。スキル1とスキル2は純粋にウェーブクリアと安全な距離からのポークに使用します。彼女の筆と墨の爆発が交差すると範囲爆発が起き、大ダメージを与えつつ自身を回復します。",
            "midGame": "レベル4になると、単独でタワーダイブしてターゲットを暗殺する能力が開花します。アルティメットは（スキル1/2の墨、または敵に当てて）5回ダッシュすることで空へ舞い上がり、対象指定不可となって壊滅的なダメージの雨を降らせます。ファームレーンへ積極的にロームし、敵のマークスマンを処刑しましょう。",
            "lateGame": "終盤の集団戦では極めて高い精度が求められます。アルティメットのダッシュをミスすると、敵チームのど真ん中に取り残されて即死します。側面からのアングルを探すか、敵の致命的なCC（制圧など）が消費されるのを待ってから、書道のダッシュを開始してください。",
            "teamfight": "後方に留まり、スキル2 -> スキル1の墨爆発コンボでポークします。優先ターゲットのHPが70%を切ったら、アルティメットのシーケンスを開始します。自らの墨と敵の前衛を滑るようにダッシュします。空へ舞い上がったら、ジョイスティックを敵のキャリーの上に位置づけ、墨の弾幕が完全に集中するようにします。",
            "commonMistakes": "ジョイスティックの操作ミスで墨や敵を外し、アルティメットのダッシュシーケンスが途切れて離陸に失敗し、確実な死を迎えること。離陸前にハードCC（東皇太一のアルティメットなど）に突っ込んでしまうこと。",
            "combos": [
                {
                    "title": "スタンダード・テイクオフ (2-1-3-3-3-3-3)",
                    "description": "スキル2 -> スキル1 -> スキル3（前方に5回ダッシュ）。筆（スキル2）を投げ、即座に同じ経路に墨の塊（スキル1）を投げ、アルティメットを使って自身の墨の軌跡上を前後に5回ダッシュして飛び立ちます。"
                },
                {
                    "title": "ステップバック・ディレイフライト",
                    "description": "スキル2 -> 後退 -> スキル3（前方に2回ダッシュ） -> スキル1 -> スキル3（前方に3回ダッシュ）。スキル2を投げ、少し下がってタイミングを遅らせ、戻ってくる筆で2回ダッシュし、スキル1を投げて新しい墨の上で残りの3回のダッシュを完了させます。敵にとって予測が非常に困難です。"
                }
            ]
        }
    }
}

def update_file(filename, lang):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    for hero_id, hero_info in data.items():
        if hero_id in heroes_data:
            if "strategy" not in hero_info:
                hero_info["strategy"] = {}
            hero_info["strategy"]["earlyGame"] = heroes_data[hero_id][lang]["earlyGame"]
            hero_info["strategy"]["midGame"] = heroes_data[hero_id][lang]["midGame"]
            hero_info["strategy"]["lateGame"] = heroes_data[hero_id][lang]["lateGame"]
            hero_info["strategy"]["teamfight"] = heroes_data[hero_id][lang]["teamfight"]
            hero_info["strategy"]["commonMistakes"] = heroes_data[hero_id][lang]["commonMistakes"]
            hero_info["strategy"]["combos"] = heroes_data[hero_id][lang]["combos"]
            updated_count += 1
            
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Updated {updated_count} heroes in {filename}")

if __name__ == '__main__':
    update_file(r"c:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\en.json", "en")
    update_file(r"c:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\ja.json", "ja")
