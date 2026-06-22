import json

new_patches = [
  {
    "version": "6.17",
    "change_type": "adjust",
    "hero_name": "司馬懿",
    "hero_name_en": "Sima Yi",
    "description": "スキルメカニクスのアップグレード。パッシブ：エネルギーゲージを削除し、マナ消費に変更。範囲2000内のスキル使用者の視界を獲得。シャドウフォースを鎌に凝縮し、強化通常攻撃と移動速度を獲得。最初の攻撃で対象の背後にダッシュする。初撃ダメージは減少。スキル1：スキル終了後にクールダウンに入るように変更。非ヒーローへの追加ダメージを削除。基本ダメージは増加。スキル2：魔法ダメージを受けた際の回復量が減少し、時間も延長。新規：制圧エリアが3秒間持続し、エリア内での回復効果が10%+増加。クールダウン増加、基本ダメージ増加。ウルト：中断された場合、クールダウンの90%が返還される。",
    "description_en": "Skill Mechanics Upgraded. Passive: Removed Energy bar, now consumes Mana. Gains vision of skill users within 2000 range. Sima Yi condenses Shadow Force into a scythe, gaining an enhanced Basic Attack and Movement Speed. 1st attack dashes behind target. First-Hit Damage reduced. Skill 1: Enters cooldown after skill ends. Removes extra damage against non-hero units. Base damage increased. Skill 2: Healing from magic damage taken reduced and delayed. New: Suppression area lasts 3s, boosting recovery by 10%+. Cooldown increased. Base damage increased. Ultimate: If interrupted, 90% of cooldown returned.",
    "is_hero": True,
    "id": "patch_6_17_1"
  },
  {
    "version": "6.17",
    "change_type": "adjust",
    "hero_name": "李信",
    "hero_name_en": "Li Xin",
    "description": "スキルメカニクスのアップグレード。パッシブ：形態切り替え時、その形態のエネルギーを最大まで獲得。エネルギー量に応じてパッシブ効果が最大100%増加。通常形態：スキル1のCD短縮、スキル2の基本ダメージ増加。復讐形態（闇）：パッシブの移動速度と追加ダメージ調整。スキル1はチャージ中に自動攻撃し、即座に攻撃速度を獲得。スキル2のダメージが2回判定に変更。スキル3は詠唱中に移動可能になり、ダメージ増加、CD短縮、変身時間短縮。ウルトは周囲の敵に物理ダメージを与える。支配形態（光）：スキル1、2、3のダメージが追加物理攻撃力依存に変更。スキル2の剣気の発射速度とスキル3のチャージ速度が攻撃速度に依存するように変更。ウルトの変身時間が短縮され、周囲の敵に物理ダメージを与える。",
    "description_en": "Skill Mechanics Upgraded. Passive: Switching forms grants full Energy for that form. Having energy boosts passive effects by up to 100%. Standard Form: Skill 1 CD reduced, Skill 2 base damage increased. Revenge Form (Dark): Passive Movement Speed and shadow damage adjusted. Skill 1 automatically attacks while charging, grants immediate Attack Speed. Skill 2 base damage changed to two instances, gouge damage adjusted. Skill 3 can move while casting, damage increased, CD reduced, transformation duration reduced. Ultimate deals physical damage to nearby enemies. Domination Form (Light): Skill 1 base damage adjusted to scale with extra PATK. Skill 2 damage scales with extra PATK, sword energy speed scales with Attack Speed. Skill 3 damage scales with extra PATK, charge speed scales with Attack Speed. Ultimate transformation duration reduced and deals physical damage to nearby enemies.",
    "is_hero": True,
    "id": "patch_6_17_2"
  },
  {
    "version": "6.17",
    "change_type": "buff",
    "hero_name": "廉頗",
    "hero_name_en": "Lian Po",
    "description": "ステータスバフ。スキルダメージの増加。スキル1：基本ダメージが追加物理攻撃力依存に変更され、最大HP5%分のスマッシュダメージを追加。スキル2：基本ダメージの追加物理攻撃力スケーリングが90%に（以前は110%）。ウルト：3回のハンマーストライクすべてのダメージが追加物理攻撃力に大きく依存するようになり、3回目のストライクには最大HP10%分のスマッシュダメージが追加。",
    "description_en": "Stats Buffed. Increased skill damage. Skill 1: Base damage changed to scale with extra PATK + 5% max HP Smash Damage. Skill 2: Base damage scales with 90% extra PATK (was 110%). Ultimate: All three hammer strikes now scale heavily with extra PATK, with the third strike adding 10% max HP Smash Damage.",
    "is_hero": True,
    "id": "patch_6_17_3"
  },
  {
    "version": "6.17",
    "change_type": "buff",
    "hero_name": "明世隠",
    "hero_name_en": "Ming",
    "description": "ステータスバフ。スキルダメージの増加。スキル1：味方に命中した際、ステータス上昇効果がさらに25%増加（4秒かけて急速に減衰）。マナ消費減少、CD増加、基本ダメージ増加。スキル2：敵に命中した際、防御力低下効果がさらに25%増加（4秒かけて急速に減衰）。マナ消費減少、CD増加、基本ダメージ増加。",
    "description_en": "Stats Buffed. Increased skill damage. Skill 1: When hitting an ally, the stat boost is increased by an extra 25% (diminishing rapidly over 4s). Mana cost reduced. CD increased. Base damage increased. Skill 2: When hitting an enemy, defense reduction is increased by an extra 25% (diminishing rapidly over 4s). Mana cost reduced. CD increased. Base damage increased.",
    "is_hero": True,
    "id": "patch_6_17_4"
  },
  {
    "version": "6.17",
    "change_type": "buff",
    "hero_name": "荘周",
    "hero_name_en": "Zhuangzi",
    "description": "ステータスバフ。スキルダメージの増加。パッシブ：6秒ごとに自動的に夢の世界に入り、追加のHP回復を獲得する効果を追加。スキル2：クールダウン短縮。基本ダメージとスタックダメージの魔法攻撃スケーリングが上昇。",
    "description_en": "Stats Buffed. Increased skill damage. Passive: Every 6s, automatically enters a Dreamscape and grants an extra Health recovery. Skill 2: Cooldown reduced. Base damage and stack damage adjusted (base AD scaling increased).",
    "is_hero": True,
    "id": "patch_6_17_5"
  },
  {
    "version": "6.17",
    "change_type": "buff",
    "hero_name": "大司命",
    "hero_name_en": "Augran",
    "description": "ステータスバフ。スキル効果のアップグレード。パッシブ：最初と最後以外のダメージに適用される通常攻撃時効果（On-Hit効果）が50%に増加（以前は40%）。スキル2：生と死の境界の生成位置を500-750の範囲で調整可能に。通常攻撃による回復量が増加。",
    "description_en": "Stats Buffed. Upgraded skill effects. Passive: Damage dealt other than the first and last hit now have a 50% on-hit effect (was 40%). Skill 2: The spawn location of the Life-Death Border can be adjusted within a 500-750 range. Basic Attack Recovery increased.",
    "is_hero": True,
    "id": "patch_6_17_6"
  },
  {
    "version": "6.17",
    "change_type": "nerf",
    "hero_name": "裴擒虎",
    "hero_name_en": "Pei",
    "description": "ステータス調整。パッシブ：虎形態での移動速度増加が25-50に減少。追加の物理攻撃力と物理・魔法防御力も減少。スキル2：クールダウン短縮効果が30%-60%に減少（以前は50%）。スキル3およびウルト：クールダウンが5.4秒にわずかに短縮されたが、強化通常攻撃の持続時間が7秒から5秒に減少。",
    "description_en": "Stats Adjusted. Passive: Movement Speed increase in Tiger form reduced to 25-50. Bonus Physical Attack and Defenses reduced. Skill 2: Cooldown reduction reduced to 30%-60% (was 50%). Skill 3 & Ultimate: Cooldown slightly reduced to 5.4s, but enhanced basic attack duration reduced from 7s to 5s.",
    "is_hero": True,
    "id": "patch_6_17_7"
  },
  {
    "version": "6.17",
    "change_type": "buff",
    "hero_name": "哪吒",
    "hero_name_en": "Nezha",
    "description": "ステータス調整。スキル2：クールダウンが2秒から1.5秒に短縮。スキル使用間隔が4秒から3秒に短縮。基本ダメージが120から150に増加。",
    "description_en": "Stats Adjusted. Skill 2: Cooldown reduced from 2s to 1.5s. Skill use interval reduced from 4s to 3s. Base damage increased from 120 to 150.",
    "is_hero": True,
    "id": "patch_6_17_8"
  }
]

with open('src/data/patches.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# avoid duplicates if script is run multiple times
existing_ids = [p['id'] for p in data]
for np in new_patches:
    if np['id'] not in existing_ids:
        data.insert(0, np) # Put new patches at the top

with open('src/data/patches.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

new_meta = {
  "version": "6.17",
  "change_type": "adjust",
  "hero_name": "Season 15",
  "hero_name_en": "Season 15",
  "summary": "Season 15 Update: Major mechanic upgrades for Sima Yi & Li Xin, solid buffs to Lian Po, Ming, Zhuangzi, Augran.",
  "details": [
    "Sima Yi: Energy replaced with Mana, gets big combat upgrades and scythe mechanics.",
    "Li Xin: Complex form energy system introduced. Huge changes to his damage scaling (more extra PATK).",
    "Lian Po: Skills scale better with extra PATK and max HP, moving him towards a bruiser playstyle.",
    "Pei: Received noticeable stat and duration nerfs."
  ],
  "id": "patch_meta_6_17",
  "prediction_ja": "【パッチ6.17 (S15) メタ予想】\nシーズン15「The Grand Venture」開幕！今回の目玉は**司馬懿**と**李信**のメカニクスリワークです。\n\n**司馬懿**はエネルギーがマナに変更され、シャドウフォースによる鎌の強化通常攻撃を手に入れました。アサシンとしてのバースト力がよりテクニカルかつ凶悪になります。\n\n**李信**は形態ごとにエネルギーゲージが追加され、スキルダメージが「追加物理攻撃力」に強く依存するようになりました。攻撃速度もスキルの発動速度に影響するため、ビルド幅が大きく広がり、熟練度がより試されるキャリーヒーローへと進化します。\n\nまた、**廉頗**はダメージ計算式が追加物理攻撃力と対象の最大HP依存に変更され、タンクよりはファイター（ブルーザー）としての脅威度が上がります。\n一方でジャングルの強力なスノーボーラーである**裴擒虎（Pei）**は、ステータスやバフの持続時間を削られ、序盤の制圧力がややマイルドになりました。",
  "prediction_en": "[Patch 6.17 (S15) Meta Prediction]\nSeason 15 \"The Grand Venture\" is here! The highlights of this update are the massive mechanic reworks for **Sima Yi** and **Li Xin**.\n\n**Sima Yi** swaps his energy for mana and gains a new scythe mechanic with enhanced basic attacks, making his assassin burst more technical and deadlier.\n\n**Li Xin** receives a new energy system for his forms, and his damage scaling has shifted heavily towards Extra Physical Attack. With Attack Speed now affecting his cast times, his build paths will diversify, turning him into a highly rewarding carry for skilled players.\n\nAdditionally, **Lian Po**'s damage now scales with Extra PATK and target's max HP, increasing his threat level as a bruiser rather than a pure tank.\nOn the nerf side, **Pei**, the dominant snowball jungler, takes a hit to his free stats and buff durations, slightly tuning down his early-game oppression.",
  "created_at": "2026-06-18T00:00:00.000Z"
}

with open('src/data/patch_meta.json', 'r', encoding='utf-8') as f:
    meta_data = json.load(f)

existing_meta_ids = [m['id'] for m in meta_data]
if new_meta['id'] not in existing_meta_ids:
    meta_data.insert(0, new_meta)

with open('src/data/patch_meta.json', 'w', encoding='utf-8') as f:
    json.dump(meta_data, f, ensure_ascii=False, indent=2)

print("Patches updated successfully.")
EOF