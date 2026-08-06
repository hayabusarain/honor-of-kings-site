import json
import os
import re
import subprocess

base_folder = r'C:\Users\81901\Pictures\Screenshots'
subdirs = sorted([d for d in os.listdir(base_folder) if os.path.isdir(os.path.join(base_folder, d)) and d.startswith("Set_")])

with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
    heroes = json.load(f)

# Add Furigana/Katakana/Kanji mapping for HoK heroes
furigana_map = {
    "しょうき": "鐘馗",
    "りゅうぜん": "劉禅",
    "りゅうび": "劉備",
    "はくき": "白起",
    "りょふ": "呂布",
    "しゅうゆ": "周瑜",
    "しんき": "甄姫",
    "ぶそくてん": "武則天",
    "しょかつりょう": "諸葛亮",
    "しばい": "司馬懿",
    "ちょうせん": "貂蝉",
    "ちょううん": "趙雲",
    "だるま": "達磨",
    "しょうむえん": "鐘無艶",
    "かんう": "関羽",
    "あか": "阿軻",
    "うんちゅうくん": "雲中君",
    "かんしん": "韓信",
    "こうう": "項羽",
    "きこくし": "鬼谷子",
    "こうちゅう": "黄忠",
    "そうし": "荘子",
    "ひゃくりげんさく": "百里玄策",
    "さいぶんき": "蔡文姫",
    "らんりょうおう": "蘭陵王",
    "ぐびじん": "虞美人",
    "せいし": "西施",
    "びょうしゃく": "扁鵲"
}

print(f"Resolving remaining UNKNOWN set folders across all 11 screenshot images...")

renamed_count = 0

for d in subdirs:
    if "UNKNOWN" not in d:
        continue

    m = re.search(r'Set_(\d+)_(?:.*_)?(\d+-\d+)', d)
    if not m:
        continue
    set_num = m.group(1)
    range_str = m.group(2)

    sd_path = os.path.join(base_folder, d)
    files = sorted([f for f in os.listdir(sd_path) if f.endswith('.png')])
    if not files:
        continue

    matched_hero = None

    # Check OCR text of all PNGs in the folder using ocr_folder.exe
    try:
        proc = subprocess.run(['scratch\\ocr_folder.exe', os.path.abspath(sd_path)], capture_output=True, text=True, encoding='utf-8')
        full_txt = proc.stdout.replace(" ", "").replace("\n", "").replace("\r", "")
    except Exception as ex:
        full_txt = ""

    if full_txt:
        # 1. Match Furigana map first
        for furi, hname in furigana_map.items():
            if furi in full_txt:
                matched_hero = hname
                break

        # 2. Match exact hero name in hok_heroes.json
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                hname_en = h.get('name_en', '')
                if hname in full_txt or (hname_en and len(hname_en) >= 3 and hname_en.lower() in full_txt.lower()):
                    matched_hero = hname
                    break

        # 3. Match 2-char partial
        if not matched_hero:
            for h in heroes:
                hname = h['name']
                if len(hname) >= 2 and hname[:2] in full_txt:
                    matched_hero = hname
                    break

    if matched_hero:
        new_dir = f"Set_{set_num}_{matched_hero}_{range_str}"
        old_p = os.path.join(base_folder, d)
        new_p = os.path.join(base_folder, new_dir)
        if old_p != new_p:
            try:
                os.rename(old_p, new_p)
                renamed_count += 1
                print(f"  [{set_num}] RESOLVED: '{d}' -> '{new_dir}'")
            except Exception as e:
                print(f"  [{set_num}] Error: {e}")

print(f"\nSUCCESSFULLY RESOLVED AND RENAMED {renamed_count} UNKNOWN SET FOLDERS!")
