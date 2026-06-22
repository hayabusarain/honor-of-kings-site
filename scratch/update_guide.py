import json
import re

# 1. Update ja.json
ja_path = 'messages/ja.json'
with open(ja_path, 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

ja_data['Guide'] = {
    "title": "初心者ガイド",
    "subtitle": "オナーオブキングス（Honor of Kings）の世界へようこそ！ここではゲームの基本から各レーンの役割、おすすめの立ち回りまで、これから始める方に向けた攻略情報をお届けします。",
    "introTitle": "1. オナーオブキングスとは？",
    "introDesc": "オナーオブキングスは、5対5のチームバトルMOBAゲームです。個性豊かな「ヒーロー」を操作し、仲間と協力しながらマップの奥にある敵の「クリスタル」を破壊することで勝利となります。",
    "mapTitle": "2. マップと5つの役割（ロール）",
    "mapDesc": "戦場は3つの主要な道（レーン）と、モンスターが潜むジャングルに分かれています。各プレイヤーは以下の5つの役割に分担して戦うのが基本です。",
    "laneSoloTitle": "Clash Lane (クラッシュレーン)",
    "laneSoloDesc": "主に耐久力の高いタンクやファイターが担当。序盤は1対1の殴り合いが多く、フリーズ（ミニオンのコントロール）やテレポートのタイミングが重要になります。",
    "laneJungleTitle": "Jungle (ジャングル)",
    "laneJungleDesc": "レーンには行かず、森の中立モンスターを倒して成長します。最速クリアのルート構築や、他レーンへの奇襲（ギャンク）、スマイトの管理がチームの勝敗を分けます。",
    "laneMidTitle": "Mid Lane (ミッドレーン)",
    "laneMidDesc": "マップ中央の短いレーンを担当する魔法使い（メイジ）。素早くミニオンを処理（ウェーブプッシュ）し、上下のレーンへ素早く援護（ローム）に向かうことが求められます。",
    "laneDuoTitle": "Farm Lane (ファームレーン)",
    "laneDuoDesc": "遠距離から物理ダメージを出すマークスマン（ADC）の定位置。最初は弱いですが、ミニオンのトドメ（CS）をしっかり集めることで、終盤に無類の火力を発揮します。",
    "laneSupportTitle": "Roam (ローム / サポート)",
    "laneSupportDesc": "主にファームレーンを助けつつ、マップ全体を動き回って視界の確保や味方の回復、集団戦でのイニシエート（突撃）を行います。",
    "flowTitle": "3. ゲームの流れ",
    "flowLaningTitle": "序盤：レーニングフェーズ",
    "flowLaningDesc": "まずは自分のレーンでミニオンのトドメを刺し（ラストヒット）、経験値とお金を稼いでレベルアップと装備の購入を目指します。",
    "flowMidTitle": "中盤：オブジェクト確保",
    "flowMidDesc": "味方と協力してタワーを壊したり、マップに現れる「タイラント（暴君）」などの強力な中立モンスターを倒し、チーム全体にバフをもたらします。",
    "flowLateTitle": "終盤：集団戦と勝利",
    "flowLateDesc": "5人全員で集まり、大規模な戦闘（集団戦）を行います。最強のモンスター「主宰（オーバーロード）」を倒して敵の拠点を一気に崩し、クリスタルを破壊します。",
    "techTitle": "4. 初心者が覚えるべき基本技術",
    "techLastHitTitle": "ミニオンの確実な処理（CS）",
    "techLastHitDesc": "ミニオンの「トドメ（最後の1撃）」を刺した時に手に入るゴールドが勝負を分けます。体力が減った瞬間を狙って攻撃しましょう。",
    "techVisionTitle": "ブッシュ（草むら）の警戒と視界",
    "techVisionDesc": "マップの暗闇や草むらからは、いつ敵が飛び出してくるかわかりません。サポートはスキルを使って安全を確認し、味方の安全を確保しましょう。",
    "techMapTitle": "ミニマップを常に確認",
    "techMapDesc": "数秒に1回は画面左上のミニマップを確認しましょう。敵がどこに見えているかを確認することで、不意打ち（ギャンク）を防ぐことができます。",
    "recomTitle": "6. 初心者向けおすすめヒーロー",
    "recomDesc": "まずは扱いやすく、各レーンの基礎を学ぶのに最適なピック（ヒーロー）たちをご紹介します。",
    "settingsTitle": "5. スマホのおすすめ設定",
    "settingsDesc": "遅延を防ぎ、快適にプレイするためのおすすめ設定です。",
    "iosTitle": "📱 iPhone のおすすめ設定",
    "iosFps": "・フレームレート: 「高（60 FPS）」を推奨。超高は滑らかですが発熱の原因になります。",
    "iosGraphics": "・グラフィック: 「中」。エフェクトを少し下げることでバッテリー消費を抑えられます。",
    "iosFocus": "・通知防止: iOSの「集中モード」を有効にして、プレイ中の通知バナーを防ぎましょう。",
    "androidTitle": "🤖 Android のおすすめ設定",
    "androidFps": "・フレームレート: 「60 FPS」。一部の超ハイスペック端末を除き、これが最も安定します。",
    "androidBoost": "・システム最適化: 端末内蔵のゲームモード（Game Booster等）をオンにしましょう。",
    "androidGraphics": "・画質調整: カクつきを感じる場合は、解像度やエフェクトを「低〜中」に落としてください。",
    "inGameTitle": "🎮 ゲーム内の重要おすすめ設定",
    "inGameDesc": "操作性や快適さを向上させる、設定画面での変更推奨項目です。",
    "inGameCameraTitle": "・カメラの移動: オン",
    "inGameCameraDesc": "画面をドラッグしてカメラ中心をズラし、進行方向や敵がいる側の広い視野を確保できます。",
    "inGameTargetTitle": "・標的の優先順位: 「HPの最も低い敵（絶対値）」",
    "inGameTargetDesc": "通常攻撃ボタンを押した際、最もHPの数値が低い敵を自動的に狙うようになり、確実なキルに繋がります。",
    "inGameChatTitle": "・チャット設定: 「非表示」",
    "inGameChatDesc": "味方からの暴言（チャットの荒れ）を防ぎ、自分のプレイに集中できます。初心者に強く推奨します。",
    "inGameDashTitle": "・移動方向へのダッシュ: オン",
    "inGameDashDesc": "ダッシュスキルを入力した際、「自分が移動スティックを倒している方向」にダッシュし、逃げやすくなります。"
}

with open(ja_path, 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, indent=2, ensure_ascii=False)

# 2. Update page.tsx recommended heroes
page_path = 'src/app/[locale]/guide/page.tsx'
with open(page_path, 'r', encoding='utf-8') as f:
    page_content = f.read()

# Replace roles mapping
page_content = re.sub(
    r'const roles = \[[\s\S]*?\];',
    '''const roles = [
    { id: 'clash', name: locale === 'ja' ? '🛡️ Clash (クラッシュ)' : '🛡️ Clash Lane' },
    { id: 'jungle', name: locale === 'ja' ? '🌲 Jungle (ジャングル)' : '🌲 Jungle' },
    { id: 'mid', name: locale === 'ja' ? '🔥 Mid (ミッド)' : '🔥 Mid Lane' },
    { id: 'farm', name: locale === 'ja' ? '🏹 Farm (ファーム)' : '🏹 Farm Lane' },
    { id: 'roam', name: locale === 'ja' ? '💖 Roam (ローム)' : '💖 Roam' }
  ];''',
    page_content
)

# Replace recommendedHeros
page_content = re.sub(
    r'const recommendedHeros = \[[\s\S]*?\];',
    '''const recommendedHeros = [
    {
      role: 'clash',
      champId: 'arthur',
      name: locale === 'ja' ? 'アーサー' : 'Arthur',
      desc: locale === 'ja' 
        ? '非常に高い耐久力とシンプルな操作性を持つファイター兼タンク。非戦闘時の自動回復力が高く、レーニングで倒されにくいのが特徴です。' 
        : 'An extremely durable warrior with an easy kit. Excellent out-of-combat health regeneration.',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      role: 'clash',
      champId: 'dun',
      name: locale === 'ja' ? '夏侯惇 (カコウトン)' : 'Dun',
      desc: locale === 'ja' 
        ? 'シールド付与と回復力を併せ持ち、強力な鎖（アルティメット）で敵集団に飛び込んで集団戦をかき乱します。' 
        : 'Sturdy tank who excels at crowd control and shielding. Features a massive chain hook ultimate to engage.',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      role: 'clash',
      champId: 'ata',
      name: locale === 'ja' ? 'アタ' : 'Ata',
      desc: locale === 'ja' 
        ? '受けたダメージを自身の回復力に変換できるしぶといタンク。敵を地形に叩きつけたり、壁を作って退路を断つのが得意です。' 
        : 'A resilient tank who recovers lost health by dealing damage. Great at creating terrain and trapping enemies.',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      role: 'jungle',
      champId: 'wukong',
      name: locale === 'ja' ? '孫悟空 (ソンゴクウ)' : 'Wukong',
      desc: locale === 'ja' 
        ? 'ステルス（透明化）から一気に敵の後衛に忍び寄り、強烈なクリティカルの一撃で敵を粉砕するアサシンです。' 
        : 'An assassin who utilizes stealth to flank the backline, delivering devastating critical strikes.',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      role: 'jungle',
      champId: 'butterfly',
      name: locale === 'ja' ? 'バタフライ' : 'Butterfly',
      desc: locale === 'ja' 
        ? '敵をキルまたはアシストするたびに全スキルのクールダウンが解消される、連続キル（リセット）に特化したアサシン。' 
        : 'A reset-based assassin whose cooldowns refresh on takedowns, allowing her to chain kills endlessly.',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      role: 'jungle',
      champId: 'lam',
      name: locale === 'ja' ? '瀾 (ラン)' : 'Lam',
      desc: locale === 'ja' 
        ? 'サメのように地中を潜行して獲物に近づき、範囲ダメージで周囲の敵をなぎ倒す、機動力と殲滅力を兼ね備えたヒーロー。' 
        : 'Dives underground like a shark to approach targets quickly, unleashing massive AoE damage in teamfights.',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      role: 'mid',
      champId: 'daji',
      name: locale === 'ja' ? '妲己 (ダッキ)' : 'Daji',
      desc: locale === 'ja' 
        ? '確定で気絶させるハートを飛ばし、強力な狐火の連撃で敵を即死させる、シンプルかつ極めて強力なバーストメイジ。' 
        : 'A burst mage who relies on a guaranteed stun followed by a barrage of fox fires to instantly delete enemies.',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      role: 'mid',
      champId: 'angela',
      name: locale === 'ja' ? 'アンジェラ' : 'Angela',
      desc: locale === 'ja' 
        ? '火の魔法使い。直線の敵を焼き尽くす極太のレーザー（アルティメット）を放ち、圧倒的な継続火力を誇ります。' 
        : 'A fire mage known for her massive laser ultimate that melts anything standing in its path.',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      role: 'mid',
      champId: 'xiaoqiao',
      name: locale === 'ja' ? '小喬 (ショウキョウ)' : 'Xiao Qiao',
      desc: locale === 'ja' 
        ? '巨大な扇を投げて遠距離から牽制しつつ、周囲の敵に流星を降らせるアルティメットで集団戦を制圧します。' 
        : 'Throws a giant fan for long-range poke and summons meteor showers to dominate teamfights.',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      role: 'farm',
      champId: 'houyi',
      name: locale === 'ja' ? '后羿 (コウゲイ)' : 'Hou Yi',
      desc: locale === 'ja' 
        ? '通常攻撃の速度が徐々に上がり、複数の矢を同時に放つマークスマン。マップのどこからでも敵をスタンさせる魔法の鳥を放てます。' 
        : 'A rapid-fire marksman who shoots multiple arrows. Can fire a cross-map firebird to stun enemies.',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    {
      role: 'farm',
      champId: 'luban-no7',
      name: locale === 'ja' ? '魯班七号' : 'Luban No.7',
      desc: locale === 'ja' 
        ? '後方からマシンガンによる猛烈な範囲攻撃を浴びせ、敵の前衛ごと粉砕する最強クラスの火力を持っています。' 
        : 'Deals devastating machine-gun damage safely from the backline with an immense continuous barrage.',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    {
      role: 'farm',
      champId: 'consort-yu',
      name: locale === 'ja' ? '虞姫 (グキ)' : 'Consort Yu',
      desc: locale === 'ja' 
        ? '一定時間「すべての物理ダメージを無効化する」スキルを持ち、敵アサシンの急襲から自力で生き残れる貴重なマークスマンです。' 
        : 'Equipped with a physical damage immunity skill, making her uniquely resilient against enemy assassins.',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    {
      role: 'roam',
      champId: 'caiyan',
      name: locale === 'ja' ? '蔡文姫 (サイブンキ)' : 'Cai Yan',
      desc: locale === 'ja' 
        ? '自身の周囲にいる味方の体力を大幅に回復し続ける、歩く泉のようなヒーラー。敵の間を跳ね回る気絶スキルも強力。' 
        : 'A dedicated healer who acts like a walking fountain, constantly restoring health to nearby allies.',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    },
    {
      role: 'roam',
      champId: 'daqiao',
      name: locale === 'ja' ? '大喬 (ダイキョウ)' : 'Da Qiao',
      desc: locale === 'ja' 
        ? '味方を安全に本陣へ帰還させる魔法陣と、味方全員を自分の元へ瞬時に召喚するアルティメットで戦局をコントロールします。' 
        : 'Controls the map by teleporting allies back to base to heal, and summoning the entire team for instant pushes.',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    },
    {
      role: 'roam',
      champId: 'zhuangzi',
      name: locale === 'ja' ? '荘周 (ソウシュウ)' : 'Zhuangzi',
      desc: locale === 'ja' 
        ? '敵のスタンや足止めを無効化する能力に長け、味方全体を敵の拘束から解放するウルトが優秀です。' 
        : 'Excels at cleansing crowd control, featuring an ultimate that frees his entire team from enemy stuns and slows.',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    }
  ];''',
    page_content
)

# And fix the image path for DDragon since we are using local images now for HOK?
# Original: src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/hero/${champ.champId}.png`}
# Change to: src={`/images/heroes/${champ.champId}.jpg`} 
page_content = re.sub(
    r'`https://ddragon.leagueoflegends.com/cdn/16\.10\.1/img/hero/\$\{champ\.champId\}\.png`',
    r'`/images/heroes/${champ.champId}.jpg`',
    page_content
)

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(page_content)

print("Done updating ja.json and page.tsx")
