const fs = require('fs');

const jaPath = 'public/data/guide/ja.json';
const enPath = 'public/data/guide/en.json';

const jaOld = JSON.parse(fs.readFileSync(jaPath, 'utf8'));

// Create perfectly structured ja.json
const ja = {
  game_flow: [
    {
      phase: '1. 序盤 (1〜4分)',
      timeframe: '1〜4分',
      goal: 'ファームの徹底、レベル4パワースパイクの獲得、1分カニ（スカトル）争奪。',
      key_actions: [
        'ミニオンのラストヒット（+20%ゴールド）を確実に獲得する。',
        '河道（川）に出現する1分カニ（スカトル）を奪い合い、序盤の経済差を作る。',
        'レベル4（アルティメット解放）のタイミングに合わせて、レーンへのファーム/ガンクを展開する。',
        '2分に出現する最初の暴君/主宰の出現位置を確認し、視界を確保する。'
      ]
    },
    {
      phase: '2. 中盤 (4〜10分)',
      timeframe: '4〜10分',
      goal: '第1タワー（アウタータワー）の破壊、マップビジョン（視界）の拡大、オブジェクト獲得。',
      key_actions: [
        'ミッドメイジとローム（サポート）が連携し、積極的にサイドレーンへローム（奇襲）を行う。',
        '暴君（火力バフ）または主宰（ドラゴンウェーブ召喚）を討伐し、チーム有利を広げる。',
        '敵の防衛盾（タワープレート）が消滅した後の外塔を積極的に破壊し、敵ジャングルへ侵入する。'
      ]
    },
    {
      phase: '3. 終盤 (10分〜)',
      timeframe: '10分以降',
      goal: '暗影暴君/暗影主宰の獲得、インヒビタータワーの破壊、5v5集団戦での勝利。',
      key_actions: [
        '不用意なソロ行動（単独孤立）を避け、5人で集団戦やオブジェクトの視界管理を行う。',
        '暗影暴君（強烈な雷撃・火力バフ）と暗影主宰（強力なドラゴンウェーブ）を討伐して強固な拠点を攻め落とす。',
        '味方のメインアタッカー（マークスマン/メイジ）を確実に保護（ピール）し、全滅を狙う。'
      ]
    },
    {
      phase: '4. 超終盤 (20分〜)',
      timeframe: '20分以降',
      goal: '風暴竜王（Tempest Dragon）の獲得とゲームエンド。',
      key_actions: [
        '20分に出現する「風暴竜王」をめぐり、全視界をクリアして決戦の準備をする。',
        '風暴竜王の獲得で得られる「巨大シールド」と「周囲への確定雷撃ダメージ」で敵陣へ一気に雪崩れ込む。'
      ]
    }
  ],
  lanes: [
    {
      title: 'ファームロード (Farm Lane / Marksman)',
      description: '主にマークスマン（ADC）が担当する右レーン。安全にゴールドを獲得し、中盤から終盤の集団戦における主要なメインダメージ源となる役割。',
      tips: [
        'ラストヒットを優先し、むやみに前に出ずミニマップの敵位置（特に敵ジャングラー）を常時確認する。',
        '序盤は自陣タワーの近くで安全にファームし、装備（コアアイテム2〜3個）が揃うまで無理な1v1は避ける。',
        '集団戦ではチームの最奥（バックライン）から、自分に一番近い敵に安全にダメージを与え続ける。'
      ]
    },
    {
      title: 'ミッドロード (Mid Lane / Mage)',
      description: '主にメイジが担当する中央レーン。マップの中央に位置するため両サイドレーンへのアクセスが良く、ゲームメイキングにおいて極めて重要な役割。',
      tips: [
        'スキルを使ってウェーブを素早く処理（プッシュ）し、即座に左右のレーンや敵ジャングルへロームする。',
        '川の草むら（ブッシュ）を利用して視界を確保し、敵ジャングラーやロームの奇襲を味方に知らせる。',
        '集団戦では高火力の範囲スキル（AOE）や行動阻害（CC）を敵の集団に撃ち込み、集団戦の口火を切る。'
      ]
    },
    {
      title: 'クラッシュロード (Clash Lane / Solo)',
      description: '主にファイターやタンクが担当する左レーン。1v1のデュエル能力と生存力が求められ、マクロ立ち回りで集団戦やスプリットプッシュを牽引する。',
      tips: [
        '1v1で優位に立ち、敵のタワープレートやゴールドを奪う。',
        '敵の攻撃を耐えられる防具や回復アイテムを積み、チームの壁（フロントライン）となる。',
        '集団戦では相手のバックライン（マークスマン・メイジ）へ裏回り（フランク）して奇襲をかける。'
      ]
    },
    {
      title: 'ジャングル (Jungle / Assassin)',
      description: '主にアサシンやファイターが担当。マップ全域の中立モンスターを狩り、ガンク（奇襲）によってチーム全体にキルとアドバンテージをもたらす。',
      tips: [
        '青バフまたは赤バフからスタートし、効率的なルートでLv.4に最速で到達する。',
        '押されている味方レーンや敵の隙を見逃さず、ガンクを仕掛けてファーストブラッドを奪う。',
        '暴君・主宰のラストヒットを懲戒（スマイト）で確実に奪取し、マップコントロールを握る。'
      ]
    },
    {
      title: 'ローム / サポート (Roam / Support)',
      description: '主にタンクやサポートが担当。特定のレーンに固定されず、マップ全体を移動して視界の確保・味方の保護・エンゲージを担うチームの司令塔。',
      tips: [
        'Lv.1ではミッドレーナーのウェーブ処理を手伝い、一緒に敵のバフやカニの視界を取りに行く。',
        '危険なブッシュに顔を出して視界を安全に確保し、敵アサシンの位置を味方に共有する。',
        '集団戦ではウルトやCCで突っ込む（エンゲージ）か、敵アサシンからキャリーを守る（ピール）かを瞬時に判断する。'
      ]
    }
  ],
  objectives: [
    {
      name: '暴君 (Tyrant) / 暗影暴君 (Shadow Tyrant)',
      spawn_time: '出現: 2分〜 / 暗影: 10分〜',
      effects: '討伐するとチーム全体に経験値とゴールド、さらに「攻撃力・魔法攻撃力増加」の強力なチームファイトバフが付与される。',
      strategy: '集団戦で敵を打ち倒したい場合や、ドラゴン合戦で有利を作りたい場合に最優先で獲得する。'
    },
    {
      name: '主宰 (Overlord) / 暗影主宰 (Shadow Overlord)',
      spawn_time: '出現: 2分〜 / 暗影: 10分〜',
      effects: '討伐するとチーム全体のミニオンが強化された「主宰の先鋒（ドラゴン）」へと変化し、全レーンを一気に押し込む。',
      strategy: '敵のタワーを破壊したい、またはレーンを自動で押し込んで敵を自陣に縛り付けたい場合に獲得する。'
    },
    {
      name: '風暴竜王 (Tempest Dragon)',
      spawn_time: '出現: 20分〜',
      effects: '討伐するとチーム全員に「巨大シールド」と「周囲の敵へ確定雷撃ダメージ」を付与。さらに全レーンに究極先鋒が出撃する。',
      strategy: '試合の勝敗を決定づける最終エンドカード。このモンスターを獲ったチームがほぼ勝利を確定させる。'
    },
    {
      name: '赤バフ (猩紅石像) / 青バフ (蔚藍石像)',
      spawn_time: 'リスポーン: 90秒',
      effects: '赤バフ: 通常攻撃にスロウと継続確定ダメージを付与（ADC/ジャングル向け）。青バフ: CD短縮+20%と激しいマナ回復（メイジ/ジャングル向け）。',
      strategy: 'ジャングラーの序盤の軸。中盤以降はキャリー（マークスマン・メイジ）へ譲る立ち回りも強力。'
    },
    {
      name: '川の精霊 (Spirit Crab / スカトル)',
      spawn_time: '出現: 1分00秒',
      effects: 'トップ/ボトムの川に出現する無抵抗の精霊。倒すと大量のゴールドと経験値を獲得できる。',
      strategy: '序盤のレーン戦で最も重要なアドバンテージ。安全にラストヒットを取れるかが序盤の勝敗を分ける。'
    }
  ],
  mechanics: [
    {
      title: 'ラストヒット（ゴールド+20%ボーナス）',
      description: 'ミニオンのHPゲージがミリ残りの時に攻撃してトドメ（ラストヒット）を刺すと、周囲で死んだ時と比べて約20%〜30%多くゴールドを獲得できます。差がつくと装備1個分以上の開きが出ます。'
    },
    {
      title: 'タワープレート（防衛盾ゴールド）',
      description: 'ゲーム開始から最初の4分間、タワーには金色に輝く保護盾が存在します。タワーにダメージを与えて盾を1枚破壊するごとに、周囲の味方に大量のボーナスゴールドが直接振り込まれます。'
    },
    {
      title: '対抗装備の買い方（回復阻害 & 防御）',
      description: '敵に回復力の高いヒーロー（貂蝉、程咬金、ドリア等）がいる場合は「夢魘の牙」「制裁の刃」などの回復阻害アイテムを早期に購入します。物理バーストが痛い場合は「不祥の兆し」を購入するのが基本です。'
    },
    {
      title: 'ビジョン（視界）コントロールとブッシュチェック',
      description: '草むら（ブッシュ）は外から中が見えません。スキルをブッシュ内に打ち込んでヒット音で敵を検知する「スキルチェック」を行わずに突っ込むと、敵の奇襲（Gank）を受けて即死します。'
    }
  ],
  settings: [
    {
      setting_name: 'ターゲット選択優先度',
      reason: '「HP絶対値が最も低い」または「割合が最も低い」に設定。アサシンやマークスマンが瀕死の敵を漏らさずターゲットするために必須。'
    },
    {
      setting_name: 'スキル指定（キャスティング）方式',
      reason: '「指追従（手動エイム）」に設定。オートエイムは移動中の敵に外れやすいため、手動操作で予測撃ちができるように練習します。'
    },
    {
      setting_name: 'カメラ操作スワイプ',
      reason: '「画面右上スワイプでのカメラ移動」を有効化。自分の画面外で起きている戦闘や敵のHP状況を即座に確認できます。'
    },
    {
      setting_name: 'ミニマップサイズと拡大',
      reason: 'ミニマップの表示サイズを大きめに調整。画面の端で常に敵ジャングラーの位置やレーンの押し具合を視界に入れて戦います。'
    }
  ],
  glossary: jaOld.glossary || []
};

fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2), 'utf8');

// Create perfectly structured en.json
const en = {
  game_flow: [
    {
      phase: '1. Early Game (1-4 min)',
      timeframe: '1-4 min',
      goal: 'Farm efficiently, reach Level 4 powerspike, and contest the 1-minute Spirit Crab.',
      key_actions: [
        'Focus on Last Hitting minions for +20% bonus gold.',
        'Contest the 1-minute Spirit Crab in the river to secure early gold and XP lead.',
        'Unlock Ultimate at Level 4 and set up initial ganks with your Jungler.',
        'Track the first Tyrant/Overlord spawn timer at 2 minutes.'
      ]
    },
    {
      phase: '2. Mid Game (4-10 min)',
      timeframe: '4-10 min',
      goal: 'Destroy outer towers, expand vision control, and secure major objectives.',
      key_actions: [
        'Mid laners and Roamers should actively rotate to side lanes for ganks.',
        'Secure Tyrant (Damage buff) or Overlord (Dragon Vanguard push) with your team.',
        'Invade enemy jungle after outer towers fall to steal buffs and deny economy.'
      ]
    },
    {
      phase: '3. Late Game (10+ min)',
      timeframe: '10+ min',
      goal: 'Secure Shadow Tyrant/Overlord, breach inhibitor towers, and win 5v5 teamfights.',
      key_actions: [
        'Group up with your team—never get caught solo as death timers are long.',
        'Contest Shadow Tyrant and Shadow Overlord to breach high-ground towers.',
        'Peel and protect your main DPS carries (Marksman/Mage) in teamfights.'
      ]
    },
    {
      phase: '4. End Game (20+ min)',
      timeframe: '20+ min',
      goal: 'Secure Tempest Dragon and push for final victory.',
      key_actions: [
        'Clear vision around the Tempest Dragon spawning at 20 minutes.',
        'Use the massive shield and True Damage lightning strikes from Tempest Dragon to end the game.'
      ]
    }
  ],
  lanes: [
    {
      title: 'Farm Lane (Marksman)',
      description: 'Assigned to the right lane. Focuses on safe farming to become the primary physical DPS carry in mid-to-late game teamfights.',
      tips: [
        'Prioritize last hits and constantly check the minimap for enemy jungler rotations.',
        'Farm safely near your tower until you get your core 2-3 damage items.',
        'Position strictly in the backline during teamfights and attack the closest threat.'
      ]
    },
    {
      title: 'Mid Lane (Mage)',
      description: 'Assigned to the center lane. Has quick access to both side lanes and controls the tempo of the early-to-mid game.',
      tips: [
        'Clear minion waves quickly with spells and rotate immediately to assist side lanes.',
        'Use river bushes to gain vision and ping enemy rotations for your team.',
        'Initiate or follow up in teamfights with high area-of-effect (AOE) damage and CC.'
      ]
    },
    {
      title: 'Clash Lane (Solo Fighter/Tank)',
      description: 'Assigned to the left lane. Requires 1v1 dueling prowess and macro awareness for split-pushing and teamfight initiation.',
      tips: [
        'Win 1v1 trades to claim tower plating gold and lane dominance.',
        'Build defensive items to serve as the sturdy frontline tank for your team.',
        'Flank the enemy backline in teamfights to eliminate their squishy Marksman/Mage.'
      ]
    },
    {
      title: 'Jungle (Assassin/Fighter)',
      description: 'Clears neutral jungle camps and executes ganks across all lanes to snowball an economic and kill lead.',
      tips: [
        'Start at Blue or Red Buff and optimize your clearing route to hit Level 4 ASAP.',
        'Look for overextended enemies to execute successful ganks and claim First Blood.',
        'Secure Tyrant and Overlord objectives using your Smite (Punish) spell.'
      ]
    },
    {
      title: 'Roam / Support',
      description: 'Roams freely across the map without a fixed lane. Responsible for vision control, peeling carries, and teamfight engagement.',
      tips: [
        'Assist your Mid laner at Level 1 to clear the first wave and contest river vision.',
        'Check bushes safely to provide vision and track enemy jungler movements.',
        'Decide whether to engage with CC or peel enemy assassins off your carries.'
      ]
    }
  ],
  objectives: [
    {
      name: 'Tyrant / Shadow Tyrant',
      spawn_time: 'Spawn: 2:00 / Shadow: 10:00',
      effects: 'Grants teamwide gold, XP, and a powerful attack/magic damage buff for teamfighting.',
      strategy: 'Prioritize when preparing for teamfights or looking to win dragon fights.'
    },
    {
      name: 'Overlord / Shadow Overlord',
      spawn_time: 'Spawn: 2:00 / Shadow: 10:00',
      effects: 'Spawns powerful Dragon Vanguards in minion waves to push lanes automatically.',
      strategy: 'Best taken when you want to breach enemy towers or apply lane pressure.'
    },
    {
      name: 'Tempest Dragon',
      spawn_time: 'Spawn: 20:00',
      effects: 'Grants a massive team shield and periodic True Damage lightning strikes to nearby enemies.',
      strategy: 'The ultimate win condition at 20+ minutes. Securing this virtually guarantees victory.'
    },
    {
      name: 'Red & Blue Buffs',
      spawn_time: 'Respawn: 90s',
      effects: 'Red Buff: Slows and deals True Damage over time. Blue Buff: +20% CD Reduction & rapid Mana regen.',
      strategy: 'Essential for Junglers early game. Pass to ADC/Mage carries in mid-to-late game.'
    },
    {
      name: 'Spirit Crab (Scuttle)',
      spawn_time: 'Spawn: 1:00',
      effects: 'Neutral river creep that yields significant gold and experience when slain.',
      strategy: 'A crucial early-game contest for lane dominance and gold lead.'
    }
  ],
  mechanics: [
    {
      title: 'Last Hitting (+20% Gold Bonus)',
      description: 'Landing the killing blow on minions yields ~20-30% more gold than just standing nearby. Essential for Farm Lane carries.'
    },
    {
      title: 'Tower Plating Gold',
      description: 'During the first 4 minutes, turrets have golden shields. Destroying plates awards massive bonus gold directly to nearby allies.'
    },
    {
      title: 'Counter-Itemization (Anti-Heal & Armor)',
      description: 'Build Grievous Wounds (Venomous Fang / Mortal Reminder) against high-heal heroes. Buy Ominous Premonition against physical burst.'
    },
    {
      title: 'Vision Control & Bush Checking',
      description: 'Bushes hide enemies. Always use long-range skillshots to check bushes before entering to avoid getting ambushed.'
    }
  ],
  settings: [
    {
      setting_name: 'Targeting Priority',
      reason: 'Set to Lowest Absolute HP so assassins and marksmen automatically target low-health squishy carries.'
    },
    {
      setting_name: 'Skill Casting Mode',
      reason: 'Use Manual Aim (Finger Drag) instead of auto-aim to reliably land skillshots on moving targets.'
    },
    {
      setting_name: 'Camera Panning',
      reason: 'Enable thumb-swipe camera panning to inspect teamfights and enemy health outside your main screen view.'
    },
    {
      setting_name: 'Minimap Size & Position',
      reason: 'Enlarge the minimap to track enemy jungler movements and lane pushes at a glance.'
    }
  ],
  glossary: jaOld.glossary || []
};

fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');

console.log('COMPLETE: Successfully updated ja.json and en.json into 100% clean matching JSON arrays!');
