import json
import re
from deep_translator import GoogleTranslator

# Terminology mapping
TERMS = {
    "アレッシオ": "Alessio",
    "ハイノ": "Heino",
    "デーヴァラ": "Devara",
    "姫小満": "Mayene",
    "バタフライ": "Butterfly",
    "ルアンナ": "Luara",
    "ファイアホーク船長": "Captain Firehawk",
    "運命を導く者": "The Fate Guide",
    "武道の奇才": "Martial Arts Prodigy",
    "死を纏う影刃": "Shadowblade of Death",
    "ファイヤースネイク": "Fire Serpent",
    "マークスマン": "Marksman",
    "メイジ/ファイター": "Mage/Fighter",
    "メイジ": "Mage",
    "ファイター": "Fighter",
    "サポート": "Support",
    "タンク": "Tank",
    "アサシン": "Assassin",
    "俊敏型マークスマン": "Agile Marksman",
    "範囲攻撃型メイジ": "AoE Mage",
    "突撃型ファイター": "Rush Fighter",
    "アサシン型ファイター": "Assassin Fighter",
    "連射型マークスマン": "Rapid-fire Marksman",
    "ノーマル": "Normal",
    "ハード": "Hard",
    "ベリーハード": "Very Hard",
    "勇士の魂": "Courageous Resolve",
    "爆裂アタック": "Burst Charge",
    "溶岩重撃": "Magma Smash",
    "天地崩壊": "Trembling Earth",
    "リトルファイアホーク": "Rebellious Little Hawk",
    "一時強化弾": "Upgraded Shell",
    "伝説のヒーロー見参！": "Legendary Hero Debut",
    "落陽海の花火ショー": "Sunset Fireworks Show",
    "癒やしの微笑み": "Encouraging Thoughts",
    "乱れ舞う花": "Blossoming Fan",
    "恋の旋風": "Honeysweet Breeze",
    "星華の乱": "Meteor Storm",
    "蛇炎の使者": "Serpent's Envoy",
    "血潮の牙": "Deadly Fang",
    "スネイク・キス": "Furtive Attack",
    "ブレージング・グレア": "Blazing Glare",
    "ロストマインド": "Captivate",
    "ソウルショック": "Soul Impact",
    "アイドルチャーム": "Strike a Pose",
    "ハートブレイカー": "Heartbreaker",
    "運命の導き": "Fate's Guidance",
    "運命の神杖": "Scepter of Fate",
    "運命の躍進": "Leap of Fate",
    "運命の回顧": "Fate Retrospect",
    "ちょっとサボってもいいっかな…": "Slack Off a Lil Bit",
    "適当な型・その一": "Whatever (I)",
    "スキルコンボ1-1:弱い奴対策": "Skill Combo 1-1: Exploit Weakness",
    "スキルコンボ2-1:攻撃は最大の防御なり": "Skill Combo 2-1: Offense is the Best Defense",
    "適当な型・その二": "Whatever (II)",
    "スキルコンボ2-2:強い奴対策": "Skill Combo 2-2: Counter to the Strong",
    "スキルコンボ1-2:前進すなわち後退なり": "Skill Combo 1-2: Advance is Retreat",
    "ちょっと本気になろっかな～": "Get Serious",
    "争覇": "Only the Strong",
    "王者の刃": "The King's Blade",
    "城下君臨": "The King's Return",
    "聖樹の祝福": "Sacred Tree Blessing",
    "刺殺": "Assassination",
    "旋風刃": "Whirlwind",
    "飛剣": "Sword Propel",
    "暗殺剣": "Death Dealer",
    "自然の意志": "Nature's Will",
    "化蝶": "Kaleidoscope",
    "胡蝶之夢": "Sleep Starts",
    "天人合一": "Butterfly Effect",
    "パッシブスキル：衆生の祈り": "Passive: Wish of the Living",
    "衆生の祈り": "Wish of the Living",
    "スキル1：雷駆継承": "Skill 1: Thunderblaze",
    "雷駆継承": "Thunderblaze",
    "スキル2：諦聴神罰": "Skill 2: Divine Judgment",
    "諦聴神罰": "Divine Judgment",
    "スキル3：千年の残響": "Skill 3: Millennium Echo",
    "千年の残響": "Millennium Echo",
    "磁気バリア": "Magnetic Barrier",
    "小覇王のシールド": "Overcharge!",
    "機械的な魔爪": "Robo Smash",
    "暴走パンダ": "Take It for a Spin",
    "哀歌": "Guitar Solo",
    "狂歌": "Wild Chord",
    "離歌": "String Bender",
    "魔音襲来": "Rock Out!",
    "ストーンストライク": "Petrifying Strike",
    "ハリケーンショック": "Storm and Stress",
    "ショックインパクト": "Shock and Awe",
    "ストームハンマー": "Hurricane Hammer",
    "時の砂時計": "Hourglass of Time",
    "時空爆弾": "Time Bomb",
    "時の波動": "Time Flux",
    "時の流れ": "Time Lapse",
    "パッシブスキル：闇の医学": "Passive: Dark Medicine",
    "闇の医学": "Dark Medicine",
    "スキル1：死の霊薬": "Skill 1: Fatal Potion",
    "死の霊薬": "Fatal Potion",
    "スキル2：善悪診断": "Skill 2: Diagnosis",
    "善悪診断": "Diagnosis",
    "スキル3：生命の支配者": "Skill 3: Sovereign of Life",
    "生命の支配者": "Sovereign of Life"
}

def has_japanese(text):
    return bool(re.search(r'[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]', text))

translator = GoogleTranslator(source='ja', target='en')

def translate_text(text):
    if not isinstance(text, str):
        return text
    if not has_japanese(text):
        return text
    
    if text in TERMS:
        return TERMS[text]
    
    try:
        translated = translator.translate(text)
        return translated
    except Exception as e:
        print(f"Error translating: {text[:20]}... -> {e}")
        return text

def traverse(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str):
                obj[k] = translate_text(v)
            elif isinstance(v, (dict, list)):
                traverse(v)
    elif isinstance(obj, list):
        for i in range(len(obj)):
            if isinstance(obj[i], str):
                obj[i] = translate_text(obj[i])
            elif isinstance(obj[i], (dict, list)):
                traverse(obj[i])

def main():
    path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_1.json'
    out_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/chunk_1_translated.json'
    
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    print("Translating data...")
    traverse(data)
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("Done writing to", out_path)

if __name__ == '__main__':
    main()
