'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Clock, Swords, Compass, AlertCircle } from 'lucide-react';

interface TimelineStep {
  timeframe: string;
  title: { en: string; ja: string };
  priority: { en: string; ja: string };
  actions: { en: string[]; ja: string[] };
  caution: { en: string; ja: string };
}

interface RoleMacro {
  id: string;
  name: { en: string; ja: string };
  icon: string;
  summary: { en: string; ja: string };
  timeline: TimelineStep[];
}

const MACRO_DATA: RoleMacro[] = [
  {
    id: 'clash',
    name: { en: 'Clash Lane (Solo Fighter / Tank)', ja: 'クラッシュレーン（ファイター/タンク）' },
    icon: '🛡️',
    summary: {
      en: 'Requires strong 1v1 dueling, wave control, and either frontline tanking or flanking enemy backlines in teamfights.',
      ja: '1v1のレーン戦、ウェーブ管理、そして集団戦での前線タンクまたは敵バックラインへの奇襲が要求されます。'
    },
    timeline: [
      {
        timeframe: '0:00 - 1:00',
        title: { en: 'Level 1 Laning & River Sprite Pickup', ja: 'Lv1 レーン戦 & 川の精霊回収' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Secure last hits on the first minion wave to reach Level 2 — a last hit pays out roughly 1.5x the gold of a minion that dies nearby.',
            'Trade hits with enemy laner if you have skill advantage.',
            'Pick up River Sprites in the river when it is safe — they flee instead of fighting back, so each one is free gold (first spawn 0:30, then every 60s until 4:00).'
          ],
          ja: [
            '最初のミニオンウェーブで確実にラストヒットを取りLv2を目指す（トドメを取ると周囲で倒れた場合の約1.5倍のゴールド）。',
            'スキル相性が良い場合は積極的にハラスを行い対面を圧迫。',
            '手が空いたら川に湧く川の精霊を回収（0:30初出現・以後60秒毎。攻撃すると逃げるだけの無抵抗モンスターで、1体約63ゴールド）。'
          ]
        },
        caution: {
          en: 'Avoid taking unnecessary damage before the 2:00 Overlord spawns.',
          ja: '2:00のオーバーロード出現前に無駄なダメージを受けすぎてリコールを強制されないよう注意。'
        }
      },
      {
        timeframe: '1:00 - 4:00',
        title: { en: 'Level 4 Powerspike & Boss Rotations', ja: 'Lv4 パワースパイク & ボス合流' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Unlock your Ultimate at Level 4 and track the boss timers: Overlord at 2:00, Tyrant at 4:00.',
            'Clear your minion wave fast and rotate to help your team at whichever boss pit is live.',
            'Use mobility skills, portal mechanics, or movement speed boosts to return to lane quickly.'
          ],
          ja: [
            'Lv4でウルトを解放し、2:00のオーバーロード・4:00のタイラントへの寄りに備える。',
            'レーンを素早くプッシュし、ボスピット周辺の集団戦に即座に合流。',
            '移動スキルやポータル、加速効果を活用してレーンのロスを最小限に抑える。'
          ]
        },
        caution: {
          en: 'Remember enemy outer turrets have a 40% damage reduction shield during the first 4 minutes. Do not dive!',
          ja: '最初の4分間は敵タワーに40%軽減盾があるため、無理なタワーダイブは厳禁。'
        }
      },
      {
        timeframe: '4:00 - 10:00',
        title: { en: 'Tower Breach & Jungle Invasion', ja: 'タワー破壊 & 敵ジャングル侵入' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Outer turret protection shield expires at 4:00—push hard to destroy the enemy Clash turret.',
            'Invade enemy jungle to steal camps and vision after clearing your wave.',
            'Split push side lanes while keeping an eye on mid lane skirmishes.'
          ],
          ja: [
            '4分でタワー保護が切れるため、敵のクラッシュタワー破壊を狙う。',
            'ウェーブ処理後、敵のジャングルに侵入してリソースと視界を奪う。',
            'サイドレーンを押しつつ、ミッド付近の集団戦に合流できるようカメラを注視。'
          ]
        },
        caution: {
          en: 'Do not overextend without vision of the enemy jungler and roamer.',
          ja: '敵のジャングルやローマーの位置が見えない状態での過度な深追いは禁物。'
        }
      },
      {
        timeframe: '10:00+',
        title: { en: 'Shadow Bosses & Teamfight Execution', ja: '10分シャドウ系ボス & 集団戦' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Group for the 10-minute Shadow Tyrant / Shadow Overlord fights.',
            'Tank Clashers (e.g. Lian Po, Xiang Yu): Act as the sturdy frontline, taking early CC/damage to protect your carries.',
            'Fighter Clashers (e.g. Mulan, Guan Yu): Flank from bushes to bypass the frontliner and assassinate enemy Marksman/Mage.',
            'Peel for your own carries if enemy assassins attempt to dive them.'
          ],
          ja: [
            '10分目のシャドウタイラント・シャドウオーバーロードの争奪戦に必ず合流。',
            '【タンク型（廉頗、項羽等）】正面から集団戦を開戦（エンゲージ）し、敵のCCとバーストを受け止める壁となる。',
            '【ファイター型（花木蘭、関羽等）】側面のブッシュから迂回（フランカー）し、敵マークスマン・メイジを奇襲。',
            '敵アサシンが味方キャリーに突撃した場合はプロテクト（保護）へシフト。'
          ]
        },
        caution: {
          en: 'Never get caught solo at 10+ minutes as death timers are long and can cost High Ground towers.',
          ja: '10分以降の孤立死はデス時間が長く高地タワー陥落に直結するため絶対に避ける。'
        }
      }
    ]
  },
  {
    id: 'jungle',
    name: { en: 'Jungle (Assassin / Fighter / Tank)', ja: 'ジャングル（アサシン/ファイター/タンク）' },
    icon: '🗡️',
    summary: {
      en: 'Controls game rhythm, executes surprise ganks, secures the Tyrant and Overlord bosses, and snowballs economic leads.',
      ja: 'ゲーム全体のテンポと勝敗を左右するエース。高速ジャングル周回、暗殺・エンゲージガンク、タイラント/オーバーロードの奪取を担当。'
    },
    timeline: [
      {
        timeframe: '0:00 - 1:00',
        title: { en: 'First Camp Route & Level 4 Rush', ja: '初周クリア & 最速Lv4ラッシュ' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Start at Red Buff or Blue Buff depending on your level 4 target lane.',
            'Optimize spell usage and auto-attacks to reach Level 4 by 1:20.',
            'Sweep River Sprites between camps for extra gold — they cannot fight back, so never waste Smite on them.'
          ],
          ja: [
            'ガンクしたいターゲットレーンに合わせてレッドBuffかブルーBuffから狩り始める。',
            'スキルのクールダウンとAAを最適化し、1:20前後の最速Lv4到達を目指す。',
            'キャンプの合間に川の川の精霊を回収して経済を伸ばす（スマイトを使う必要はない）。'
          ]
        },
        caution: {
          en: 'Watch out for Level 1 enemy invades by strong early roamers (e.g. Donghuang Taiyi, Zhong Kui).',
          ja: '東皇太一や鍾馗などの強烈なLv1侵入持ちがいる場合は初周バフ荒らしに警戒。'
        }
      },
      {
        timeframe: '1:00 - 4:00',
        title: { en: 'First Gank & Early Boss Control', ja: '初回ガンク & 序盤ボスコントロール' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Execute your first Level 4 gank on Farm Lane or Clash Lane to claim First Blood.',
            'Secure the 2:00 Overlord (vanguard waves) after a successful gank, then set up for the 4:00 Tyrant (chain lightning buff).',
            'Upgrade your jungle item at Tier 2 to match your build: Relentless Blade (physical), Guerrilla Machete (magic), or Patrol Axe (durability). Smite itself never changes — 1500 true damage plus a 1s stun — so save it for boss last hits.'
          ],
          ja: [
            'Lv4到達直後にファームかクラッシュレーンへ初回ガンクを仕掛けファーストブラッドを狙う。',
            'ガンク成功後、2:00のオーバーロードをスマイトで確保。続く4:00のタイラント（連鎖稲妻バフ）の湧きにも合わせて動く。',
            'ジャングル装備をTier 2に強化：物理型はチェイスブレード、魔法型は三日月刀、耐久型は巡視の斧を選ぶ。スマイト自体は1500確定ダメージ+1秒スタンで固定なので、ボスのラストヒット用に温存する。'
          ]
        },
        caution: {
          en: 'Do not force boss objectives if the enemy has a numbers advantage or your Smite is on cooldown.',
          ja: 'スマイトがCD中だったり味方の寄りが遅れている状態での無理なボス確保は逆転の隙を与える。'
        }
      },
      {
        timeframe: '4:00 - 10:00',
        title: { en: 'Enemy Jungle Invades & Snowballing', ja: '敵ジャングル侵入 & 圧勝スノーボール' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Invade and steal enemy Red/Blue buffs to deny enemy jungler economy.',
            'Clear side lane turrets with your marksman to expand your map control.',
            'Continuously clear your own camps on spawn to maintain XP lead.'
          ],
          ja: [
            '敵ジャングルに侵入してバフを盗み、相手ジャングルの育成を徹底的に阻害。',
            'ガンク成功後はミニオンを即座にタワーに押し込み、外塔破壊をアシスト。',
            '自分のジャングルキャンプの沸き時間を把握し、レベルとゴールドのトップを維持。'
          ]
        },
        caution: {
          en: 'Never give away your bounty kill to enemy carries by solo diving turrets.',
          ja: '懸賞金（賞金首）が付いている時の無駄な単独タワーダイブは相手キャリーを育てるため絶対厳禁。'
        }
      },
      {
        timeframe: '10:00+',
        title: { en: 'Shadow Bosses & Execution by Jungler Subtype', ja: '10分シャドウ系ボス & タイプ別集団戦' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Secure the 10-minute Shadow Overlord / Shadow Tyrant with Smite — these buffs decide the game.',
            'Assassin Junglers (e.g. Han Xin, Li Bai): Wait for enemy hard CC to be spent, then jump in to assassinate Marksman/Mage.',
            'Tank/Fighter Junglers (e.g. Agudo, Liu Bei): frontline, soak damage, initiate fights, or lock down the objective pit.',
            'Contest the 20-minute Tempest Dragon using Smite precision.'
          ],
          ja: [
            '10分シャドウオーバーロード・シャドウタイラントを確実にスマイトで仕留め、勝利を決定づけるバフを得る。',
            '【バーストアサシン型（韓信、李白等）】敵のハードCCが出し切るのを待ち、影から一撃で敵マークスマン・メイジを暗殺。',
            '【タンク/ファイター型（アグド、劉備等）】前線を維持し、集団戦のエンゲージやボスピットのエリアを強固に制圧。',
            '20分テンペストドラゴン戦では精度高いスマイト勝負でゲームを締めくくる。'
          ]
        },
        caution: {
          en: 'Missing Smite on Tempest Dragon late game can instantly turn a winning game into a loss.',
          ja: '20分テンペストドラゴンでのスマイトミスは一発逆転敗北に直結するため、周囲の視界と敵のHP計算を完璧に行う。'
        }
      }
    ]
  },
  {
    id: 'mid',
    name: { en: 'Mid Lane (Mage / Wave Control)', ja: 'ミッドレーン（メイジ/マップ統制）' },
    icon: '🔮',
    summary: {
      en: 'Controls early game tempo, provides fast wave clears, rotates to assist side lanes, and deals magic burst/AOE damage.',
      ja: '序盤のテンポを握る心臓部。高速ウェーブ処理、サイドレーンへの即座のガンク・寄りと、集団戦での高威力範囲魔法または暗殺を担当。'
    },
    timeline: [
      {
        timeframe: '0:00 - 1:00',
        title: { en: 'Level 1 Wave Clear & Roam Support', ja: 'Lv1 高速処理 & ローマー連携' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Clear the first Mid wave as fast as possible using your Skill 1.',
            'Assist your Roamer/Jungler in checking river bushes and picking up River Sprites.',
            'Prevent enemy Mid/Roam from invading your jungle.'
          ],
          ja: [
            'スキル1をフル活用して第1ウェーブを最速クリア。',
            'ローマーと連携して川のブッシュ視界を取り、川の精霊の回収もカバー。',
            '敵のミッド＆ローマーが味方ジャングルへ侵入するのを牽制。'
          ]
        },
        caution: {
          en: 'Do not stay isolated in Mid lane after clearing your wave—always move to provide vision or gank.',
          ja: 'ウェーブクリア後にミッドに棒立ちするのはNG。必ず左右どちらかに身体を寄せて視界圧力をかける。'
        }
      },
      {
        timeframe: '1:00 - 4:00',
        title: { en: 'Side Lane Ganks & Early Boss Setup', ja: 'サイドガンク & 序盤ボスセットアップ' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Gank Farm Lane or Clash Lane after shoving Mid wave.',
            'Reach Level 4 powerspike to unlock your Ultimate AOE CC or burst assassination combo.',
            'Set up vision and zone the enemy jungler around the 2:00 Overlord pit, then the 4:00 Tyrant pit.'
          ],
          ja: [
            'ミッドを押した直後にサイドレーン（ファーム/クラッシュ）へガンクを敢行。',
            'Lv4に達したら強烈なウルト（範囲CC/単体暗殺コンボ）で敵を追い詰める。',
            '2:00のオーバーロード（続いて4:00のタイラント）の出現前に、ピット周辺のブッシュを抑えて視界を奪う。'
          ]
        },
        caution: {
          en: 'Watch out for enemy Jungler ambushes in river bushes while rotating between lanes.',
          ja: 'サイドへの寄りの最中、川のブッシュに潜む敵アサシンの奇襲に注意。安全な迂回路を使う。'
        }
      },
      {
        timeframe: '4:00 - 10:00',
        title: { en: 'Mid Turret Defense & Core Item Spike', ja: 'ミッドタワー防衛 & コア装備完成' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Mid Turret is the tactical anchor of the map—never lose it early!',
            'Complete your Venomous Staff (Anti-Heal) or Void Staff (Magic Penetration).',
            'Combine CC with your Jungler/Roamer to pick off overextended enemies.'
          ],
          ja: [
            'ミッドタワーはマップの要所。破壊されると味方ジャングル全体が危険に晒されるため死守。',
            'ヴェノムスタッフ（回復阻害）や魔法貫通装備を完成させダメージを加速。',
            '味方ジャングル・ローマーのCCに合わせて確定キルを狙う。'
          ]
        },
        caution: {
          en: 'Never wander off to farm side waves alone if your Mid Turret is under attack.',
          ja: 'ミッドウェーブが押されている時にサイドへ浮気してタワーを削られないよう注意。'
        }
      },
      {
        timeframe: '10:00+',
        title: { en: 'Late-Game Execution by Mage Subtype', ja: 'メイジのタイプ別 終盤立ち回り' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Control/Poke Mages (e.g. Angela, Xiao Qiao): Position safely behind your Tank and cast massive AOE spell damage.',
            'Assassin Mages (e.g. Mai Shiranui, Shangguan): Flank from side bushes to dive and instantly assassinate enemy Marksman.',
            'Zone enemies away from the Shadow boss and Tempest Dragon pits using spell pressure.'
          ],
          ja: [
            '10分以降のシャドウ系ボスやテンペストドラゴンを巡る集団戦でタイプ別の役割を徹底：',
            '【ポーク/コントロール型（アンジェラ、小喬等）】タンクの背後から安全にスキルを回し、集団戦で壊滅的なAOE魔法ダメージを与える。',
            '【アサシン型（不知火舞、上官婉児等）】側面のブッシュに潜み、敵マークスマンにダイブして一撃で暗殺。',
            'ブッシュチェックを行って事故を防ぎ、ドラゴンピットの周囲を牽制。'
          ]
        },
        caution: {
          en: 'Mages have spell cooldowns—getting dived by an assassin without Flash means instant death.',
          ja: 'メイジはスキルのCD中やFlashがない状態での立ち位置ミスが即死につながるため慎重に立ち回る。'
        }
      }
    ]
  },
  {
    id: 'farm',
    name: { en: 'Farm Lane (Marksman Carry)', ja: 'ファームレーン（マークスマン）' },
    icon: '🏹',
    summary: {
      en: 'Primary physical DPS carry. Requires safe farming, backline positioning, and objective melting.',
      ja: '物理DPSの絶対的要。安全なゴールド回収、後方からの正確なポジショニング、タワー破壊・ドラゴン獲得での火力発揮を担当。'
    },
    timeline: [
      {
        timeframe: '0:00 - 1:00',
        title: { en: 'Last Hit Focus & Minimap Tracking', ja: 'ラストヒット専念 & ミニマップ注視' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Focus on securing last hits — each one pays roughly 1.5x more gold than letting the minion die on its own.',
            'Stay close to your turret if your Roamer is assisting Mid.',
            'Avoid aggressive trades against high-burst enemy marksmen.'
          ],
          ja: [
            'ミニオンのラストヒットを1匹も漏らさない。トドメを取ると周囲で倒れた場合の約1.5倍のゴールドが入る。',
            'ローマーがミッド寄りの場合は自陣タワー付近で安全にファーム。',
            '序盤が強い敵ヒーローに対して無理なAAトレードを仕掛けない。'
          ]
        },
        caution: {
          en: 'Enemy Junglers often gank Farm Lane at 1:30 after completing their first jungle clear.',
          ja: '敵ジャングルが初周を終える1:30前後でガンクに来る可能性が極めて高いため警戒。'
        }
      },
      {
        timeframe: '1:00 - 4:00',
        title: { en: 'Level 4 & Core Item Buildup', ja: 'Lv4到達 & コア装備構築' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Reach Level 4 and ping your Roamer to join your lane for protection.',
            'Contest nearby neutral creeps only when you have vision of enemy jungler.',
            'Build your first core damage item ASAP.'
          ],
          ja: [
            'Lv4に到達し、ローマーに助けてもらえるようピンで合図。',
            '敵ジャングルの位置が見えている時のみ近くの野良モンスターを回収。',
            '第1コア装備の最速完成を目指す。'
          ]
        },
        caution: {
          en: 'Never wander into unlit river bushes alone without your support.',
          ja: '視界が取れていない川のブッシュに単独で足を踏み入れない。'
        }
      },
      {
        timeframe: '4:00 - 10:00',
        title: { en: 'Mid Lane Rotation & Mid-Game DPS', ja: 'ミッド合流 & 中盤火力貢献' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'After destroying enemy Farm turret, rotate to Mid Lane to group with your team.',
            'Clear side waves safely then immediately regroup with your frontline.',
            'Complete Anti-Heal item (Mortal Punisher) if facing healing tanks.'
          ],
          ja: [
            '外塔破壊後はミッドレーンに合流し、チーム全体でウェーブを処理。',
            'サイドのウェーブを処理したら即座に味方フロントラインの後ろへ復帰。',
            '敵に回復役（ドリア、程咬金等）がいる場合はモータルパニッシャーを完成させる。'
          ]
        },
        caution: {
          en: 'Always position behind your Tank or Support during teamfights.',
          ja: '集団戦では必ずタンクやサポートの真後ろに立ち、孤立しない。'
        }
      },
      {
        timeframe: '10:00+',
        title: { en: 'Late Game DPS & Tempest Dragon Objective', ja: '終盤キャリー & テンペストドラゴン攻略' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Melt the 10-minute Shadow bosses and the Tempest Dragon with your sustained DPS.',
            'Focus on attacking the closest threat safely—do not over-commit for low-HP enemies.',
            'Use your Flash / Defense skill defensively when dived by enemy assassins.'
          ],
          ja: [
            '継続DPSを活かし、10分以降のシャドウ系ボスやテンペストドラゴンのHPを最速で削り切る。',
            '集団戦では無理に奥の敵を狙わず、安全な位置から一番近い敵を確実に攻撃。',
            '敵アサシンに突っ込まれたら即座にFlashや自衛スキルで距離を取る。'
          ]
        },
        caution: {
          en: 'If the Marksman dies late game, the team loses core objective DPS and base defense capabilities—stay alive at all costs!',
          ja: '終盤にマークスマンが倒されると、タワー破壊やボス獲得の火力軸が失われチームが崩壊するため、何よりも生存を最優先してください。'
        }
      }
    ]
  },
  {
    id: 'roam',
    name: { en: 'Roam / Support (Tank / Enchanter)', ja: 'ローマー / サポート（タンク/エンチャンター）' },
    icon: '🪖',
    summary: {
      en: 'Roams across the map without a fixed lane. Responsible for river vision, initiating teamfights or healing/peeling squishy carries.',
      ja: '特定のレーンを持たずマップ全体を遊撃。川の視界確保、集団戦の開戦（エンゲージ）または味方キャリーの回復・保護を担当。'
    },
    timeline: [
      {
        timeframe: '0:00 - 1:00',
        title: { en: 'Mid Wave Assist & Safe River Vision', ja: 'ミッド高速クリア補助 & 安全な視界確保' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Buy Roaming Equipment item at 0:00 so you do not steal gold/XP when sharing lanes with allies.',
            'Help your Mid laner clear the first wave quickly to gain early rotation priority.',
            'Tank Supports: Safely check enemy Red/Blue buff to track enemy Jungler start location.',
            'Enchanter Supports: Stay close to your Mid/ADC to provide early shields/heals safely.'
          ],
          ja: [
            '0:00の時点で必ず「遊撃装備」を買い、味方と同じレーンにいてもゴールド・経験値を吸わないようにする。',
            'ミッドの第1ウェーブ処理を手伝い、相手よりも早くローテーションできる展開を作る。',
            '【タンク型サポート】耐久力を活かして敵のBuffの動きを覗き見し、敵ジャングルのスタート位置をマップピン共有。',
            '【エンチャンター型サポート（蔡文姫、ドリア等）】自陣寄りに立ち、ミッドやマークスマンに安全にシールド/回復を共有。'
          ]
        },
        caution: {
          en: 'When roaming solo, hold off on hitting minion waves until your carry arrives so they get full CS value.',
          ja: '単独行動時はキャリーが到着するまでミニオンのトドメは刺さず、キャリーにゴールドを譲る。'
        }
      },
      {
        timeframe: '1:00 - 4:00',
        title: { en: 'Jungle Protection & Farm Lane Babysit', ja: 'ジャングル保護 & ファームレーン護衛' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Protect your Jungler from level 1 invades.',
            'Rotate to Farm Lane at 1:30 to protect your Marksman from the first enemy gank.',
            'Secure bush vision around the 2:00 Overlord pit.'
          ],
          ja: [
            '味方ジャングルが初回清掃中に敵の侵入を受けないようボディガード。',
            '1:30前後にファームレーンへ移動し、敵ジャングルの初ガンクから味方マークスマンを守る。',
            '2:00のオーバーロード出現前に周辺の草むら（ブッシュ）に陣取り視界を保持する。'
          ]
        },
        caution: {
          en: 'Never facecheck bushes without using skillshots if playing a squishy support.',
          ja: '柔らかいサポートを使っている場合、身体でブッシュチェックして即死しない。'
        }
      },
      {
        timeframe: '4:00 - 10:00',
        title: { en: 'Active Spell Unlock & Support Execution', ja: 'アクティブ効果解放 & サポートタイプ別立ち回り' },
        priority: { en: 'High', ja: '高' },
        actions: {
          en: [
            'Upgrade Roaming Equipment to Tier 2 to unlock active spells (Shield, Speed Buff, or Heal).',
            'Tank Supports (e.g. Zhang Fei, Lian Po): Initiate 4v4/5v5 teamfights using hard CC and absorb burst damage.',
            'Enchanter Supports (e.g. Cai Yan, Dolia): Position near your DPS carry to provide non-stop healing, buffs, and cooldown resets.',
            'Provide continuous vision of enemy movements in the river.'
          ],
          ja: [
            '遊撃装備をTier 2にアップグレードし、専用アクティブ効果（全体シールド・加速・回復など）を解放。',
            '【タンク型サポート（張飛、廉頗等）】ハードCCで敵キャリーを捕まえて集団戦を自ら開戦し、ダメージを吸収。',
            '【エンチャンター型サポート（蔡文姫、ドリア等）】味方キャリーに張り付き、持続回復・バフ・CDリセットで味方を鉄壁アシスト。',
            '川と敵ジャングル入口の視界をキープ。'
          ]
        },
        caution: {
          en: 'Do not initiate a teamfight if your Marksman/Mage is too far away to follow up.',
          ja: '味方のメイン火力（メイジ/マークスマン）が遠くにいる状態で孤立エンゲージしない。'
        }
      },
      {
        timeframe: '10:00+',
        title: { en: 'Objective Zone Defense & Carries Peeling', ja: 'ボスエリア防衛 & キャリー絶対保護' },
        priority: { en: 'Critical', ja: '最重要' },
        actions: {
          en: [
            'Zone out the enemy jungler during the 10-minute Shadow boss and 20-minute Tempest Dragon contests.',
            'Save your CC or utility spells specifically to peel off enemy assassins diving your Marksman.',
            'Tank Supports: Bodyblock and sacrifice yourself if necessary to ensure your carry escapes safely.',
            'Enchanter Supports: Stay alive behind your frontline to maintain continuous healing and team buffs.'
          ],
          ja: [
            '10分以降のシャドウ系ボスや20分テンペストドラゴンの争奪戦では、敵ジャングルがピットに入れないようブロック。',
            '味方マークスマンに飛び込んできた敵アサシンをCCや回復・シールドで徹底保護（ピール）。',
            '【タンク型サポート】味方エースキャリーが逃げ延びられるならボディブロックや身代わりデスも辞さない。',
            '【エンチャンター型サポート】自陣後方に身を置き、自身が死なないポジショニングで回復・バフを供給し続ける。'
          ]
        },
        caution: {
          en: 'A Roamer dying alone at 20+ minutes leaves your team blind and vulnerable to Tempest Dragon steals.',
          ja: '20分以降のローマーの単独死亡は視界全滅を意味し、テンペストドラゴンスティールを招くため超厳禁。'
        }
      }
    ]
  }
];

export default function MacroGuidePage() {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const [selectedRoleId, setSelectedRoleId] = useState<string>('clash');

  const activeRole = MACRO_DATA.find(r => r.id === selectedRoleId) || MACRO_DATA[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/guide" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100 flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="text-sm font-bold">{isJa ? 'ガイド一覧へ' : 'Back to Guides'}</span>
          </Link>
          <div className="font-black text-slate-900 text-base flex items-center gap-2">
            <Compass className="text-brand-600" size={18} />
            {isJa ? '全5大ロール立ち回りマクロマップ' : '5 Lanes Macro & Rotation Timelines'}
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-brand-950 text-white rounded-3xl p-6 mb-8 shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            {isJa ? '全5大ロール時間軸立ち回りマクロガイド' : 'All 5 Lanes Macro Timeline Guide'}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            {isJa
              ? '「2分オーバーロード、4分タイラント、10分シャドウ系ボス」などの重要局面ごとに、全5ロール（クラッシュ/ジャングル/ミッド/ファーム/ローマー）の立ち回りと注意点をタイムラインで解説します。'
              : 'Master the key timestamps (2:00 Overlord, 4:00 Tyrant, 4:00 tower shield drop, 10:00 Shadow bosses) with tailored timelines for all 5 Honor of Kings roles.'}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
          {MACRO_DATA.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap border ${
                selectedRoleId === role.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">{role.icon}</span>
              {isJa ? role.name.ja.split('（')[0] : role.name.en.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Selected Role Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{activeRole.icon}</span>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {isJa ? activeRole.name.ja : activeRole.name.en}
              </h2>
            </div>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium">
            {isJa ? activeRole.summary.ja : activeRole.summary.en}
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="space-y-6 relative before:absolute before:left-4 sm:before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
          {activeRole.timeline.map((step, idx) => (
            <div key={idx} className="relative pl-10 sm:pl-14">
              {/* Timeline Marker Badge */}
              <div className="absolute left-0 top-0.5 w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-slate-900 text-white border-4 border-slate-50 flex items-center justify-center font-black text-xs sm:text-sm shadow-md z-10">
                {idx + 1}
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-brand-600 font-black text-sm">
                    <Clock size={16} />
                    <span>{step.timeframe}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {isJa ? step.title.ja : step.title.en}
                  </h3>
                </div>

                {/* Priority Actions */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Swords size={14} className="text-amber-500" />
                    {isJa ? '最優先アクション' : 'Priority Action Checklist'}
                  </h4>
                  <ul className="space-y-2">
                    {(isJa ? step.actions.ja : step.actions.en).map((action, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Caution Box */}
                <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-3.5 text-xs sm:text-sm text-rose-950 font-medium flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-900 block mb-0.5">
                      {isJa ? '事故回避注意点' : 'Risk Prevention Caution'}
                    </span>
                    {isJa ? step.caution.ja : step.caution.en}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
