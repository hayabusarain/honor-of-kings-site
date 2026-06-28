import json

input_path = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_4.json"
output_path = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_4_done.json"

translations = {
    # Butterfly
    "ジャングラーとして序盤は無駄な戦闘を避け、最速でレベル4を目指してファームルートを回ります。レベル4になりアルティメットを習得すると強力なガンクが可能になるため、HPの減っている敵や、逃げスキルを使った敵がいるレーンへ積極的に介入して序盤の主導権を握ります。": "As a Jungler, avoid unnecessary fights in the early game and focus on farming to reach Level 4 as fast as possible. Once you hit Level 4 and unlock your Ultimate, you can execute powerful ganks. Actively intervene in lanes where enemies have low HP or have used their escape skills to seize the initiative early on.",
    "機動力を活かして素早くジャングルをクリアし、ドラゴンや暴君などのオブジェクト管理を徹底します。自分から集団戦を仕掛けるのではなく、味方が交戦を始めたところに後から参戦し、パッシブの「キル・アシストによるスキルリセット」を活かして連続キルを狙う動きが基本となります。": "Utilize your mobility to clear the jungle quickly and ensure strict control over objectives like the Overlord and Tyrant. Instead of initiating teamfights yourself, join the fray after your allies have engaged. The basic strategy is to aim for multi-kills by utilizing your passive's skill reset upon getting a kill or assist.",
    "敵がグループして動く終盤は、不用意に飛び込むとCCチェーンを食らって一瞬で倒されてしまいます。敵の防具も揃っているため、味方のタンクが敵の主要なスキルを受け切るまでブッシュ（草むら）などで息を潜め、敵のHPが削れた瞬間に一気に飛び込んで戦場を掃除する「クリーンアップ」に徹します。": "In the late game when the enemy moves as a group, diving in carelessly will get you chain CC'd and burst down instantly. Since the enemy will have their defensive items ready, hide in bushes and wait until your allied tank absorbs the enemy's key skills. Once the enemy's HP is whittled down, jump in all at once to clean up the battlefield.",
    "集団戦では「絶対に入りのタイミングを間違えない」ことが最も重要です。乱戦状態になり、敵のメイジやマークスマンのHPが半分以下になったタイミングを見計らってアルティメットで後衛に飛び込みます。キルを取れば全スキルのクールダウンが解消されるため、次々とターゲットを変えて連続キルを叩き込みます。": "In teamfights, the most crucial thing is to absolutely never mistime your entry. Wait for a chaotic brawl and look for the moment when the enemy Mage or Marksman drops below half HP, then dive the backline with your Ultimate. Since securing a kill resets the cooldown of all your skills, you can rapidly switch targets to chain consecutive kills.",
    "初心者がやりがちなNG行動は、自分の火力を過信して、敵のCCスキルや防御スキル（砂時計など）が残っているフルヘルスの敵陣に単独で突撃してしまうことです。キルを取れずにスキルがクールダウンに入ると、逃げ手段がなくなり確実に倒されてしまいます。": "A common mistake beginners make is overestimating their own damage and diving alone into a full-HP enemy formation that still has CC and defensive skills (like Splendor) available. If you fail to secure a kill and your skills go on cooldown, you will have no escape route and will definitely be taken down.",

    # Shao Siyuan
    "序盤から味方と共に積極的に動き、スキルを当てて敵からゴールドを奪うことで経済的な有利を作ります。しかし、自分が倒されると奪ったゴールドを敵に取り返されてしまうため、ハイリスクな前衛の立ち位置は避け、機動力を活かして安全圏を保ちながらハラスを行います。": "Move proactively with your allies from the early game, and create an economic advantage by landing skills to steal gold from enemies. However, if you are defeated, the enemy will take back the stolen gold, so avoid high-risk frontline positioning and use your mobility to harass from a safe distance.",
    "小規模戦が頻発する中盤は、スキル1による味方への継続的な回復と移動速度バフでチームの機動力を底上げします。味方のジャングラーやメイジのロームに同行し、敵にスキル2を付与して位置をコントロールしつつ、味方のキルラインをサポートする動きが強力です。": "In the mid game when skirmishes frequently occur, boost your team's mobility with the continuous healing and movement speed buffs from your Skill 1. Accompany your allied Jungler or Mage on roams, and strongly support your allies' kill potential by applying Skill 2 to enemies to control their positioning.",
    "両チームの装備が揃う終盤は、サポートとしての立ち位置管理がより重要になります。これまでに稼いだ追加ゴールドによってアルティメットの回復・ダメージ量が強化されているため、集団戦の核心部分で的確にアルティメットを展開し、味方の耐久力を劇的に引き上げます。": "In the late game when both teams have their builds complete, your positioning as a Support becomes even more crucial. Since the extra gold you've earned so far amplifies your Ultimate's healing and damage, deploy your Ultimate accurately at the core of teamfights to dramatically increase your team's survivability.",
    "集団戦では決して最前線に立たず、後衛から味方キャリーを守りながらヒールとバフを撒き続けます。敵のアサシンが飛び込んできた際は、スキル2のダブルキャストでスネア（移動不可）を与えて無力化するか、スキル1のダッシュを使って味方の元へ素早く移動し、共にピンチを脱します。": "Never stand on the frontline during teamfights; stay in the backline, continuously casting heals and buffs while protecting your allied carries. When an enemy assassin dives in, either neutralize them by applying a snare (immobilize) with a double-cast of Skill 2, or use your Skill 1 dash to quickly move to your allies and escape danger together.",
    "初心者がやりがちなNG行動は、ゴールドを奪うことに夢中になって敵陣に深追いし、キルされてゴールドを還元してしまう「利敵行為」です。また、スキルを二度押しするタイミングを見誤り、不要なタイミングで敵に突撃して自ら孤立してしまうミスにも注意が必要です。": "A common beginner mistake is getting too obsessed with stealing gold, chasing too deep into enemy territory, and getting killed—effectively feeding the gold back to the enemy. Also, be careful not to misjudge the timing for double-casting your skills, which can cause you to unintentionally dash at the enemy and isolate yourself."
}

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
for hero_key, hero_data in data.items():
    if "strategy" in hero_data:
        strategy = hero_data["strategy"]
        for key in ["earlyGame", "midGame", "lateGame", "teamfight", "commonMistakes"]:
            if key in strategy:
                val = strategy[key].strip()
                for jp, en in translations.items():
                    if jp in val:
                        strategy[key] = en
                        count += 1
                        break

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Done. Translated {count} fields.")
