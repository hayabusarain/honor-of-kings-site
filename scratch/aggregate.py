import os
import json
import re
import glob

# The 14 conversation IDs
conv_ids = [
    "5653aa39-ff2e-4c67-bc81-b10c3bff3033",
    "8003ed3d-bb31-4436-8554-59be9280132b",
    "0c5e9fc8-df9b-4b11-9ca2-34b8492620b1",
    "67df9681-91f6-475e-8cd1-6b0fdc493664",
    "49799e9a-3b6d-4cd3-9d73-705906c2c82e",
    "a778be5b-9f12-46fa-b264-7bf16fdfaa77",
    "98483c64-72dd-487c-ba66-80f67668b695",
    "49f1a382-49b4-4998-a26f-c80302881029",
    "2fb7fc12-476a-4eb7-aca3-eb9cada29437",
    "e2a7d986-1b68-49c5-8fb6-ece91a4cbaaf",
    "06622edf-c757-4ef0-b715-577668948d66",
    "5649a4ba-92c1-4d43-b3b4-3f258e4fa0e4",
    "8881f2f2-fbf6-4524-90a2-8afecc273098",
    "5153c41f-ab4f-4ab3-8c70-7db74c5f33fd"
]

all_heroes_data = {}

def add_data(data):
    if isinstance(data, dict):
        for k, v in data.items():
            if k.startswith("hero_") and isinstance(v, dict) and "skills" in v:
                all_heroes_data[k] = v

def parse_transcript(conv_id):
    path = f"C:\\Users\\81901\\.gemini\\antigravity\\brain\\{conv_id}\\.system_generated\\logs\\transcript_full.jsonl"
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            try:
                row = json.loads(line)
                content = row.get("content", "")
                if not content:
                    continue
                # find all markdown json blocks
                blocks = re.findall(r"```json\s*(.*?)\s*```", content, re.DOTALL)
                for block in blocks:
                    try:
                        data = json.loads(block)
                        add_data(data)
                    except:
                        pass
            except:
                pass

for cid in conv_ids:
    parse_transcript(cid)

# Check files on desktop
search_paths = [
    r"C:\Users\81901\Desktop\screenshots\*.json",
    r"C:\Users\81901\Desktop\screenshots\processed\*.json"
]

for sp in search_paths:
    for fp in glob.glob(sp):
        try:
            with open(fp, "r", encoding="utf-8") as f:
                content = f.read()
                # find json blocks in the file, sometimes they put markdown in the file
                blocks = re.findall(r"```json\s*(.*?)\s*```", content, re.DOTALL)
                if blocks:
                    for block in blocks:
                        try:
                            data = json.loads(block)
                            add_data(data)
                        except:
                            pass
                else:
                    data = json.loads(content)
                    if isinstance(data, dict):
                        if "hero_id" in data:
                            hid = str(data["hero_id"]).zfill(3)
                            hero_id_str = f"hero_{hid}"
                            lore = data.get("lore", "")
                            skills = []
                            if "passive" in data:
                                p = data["passive"]
                                skills.append({
                                    "id": "P",
                                    "name": p.get("name", ""),
                                    "tags": p.get("tags", []),
                                    "cooldown_text": p.get("cooldown_text", ""),
                                    "description": p.get("description", ""),
                                    "table": p.get("table", None)
                                })
                            for i in range(1, 5):
                                skey = f"skill{i}"
                                if skey in data:
                                    s = data[skey]
                                    skills.append({
                                        "id": skey,
                                        "name": s.get("name", ""),
                                        "tags": s.get("tags", []),
                                        "cooldown_text": s.get("cooldown_text", ""),
                                        "description": s.get("description", ""),
                                        "table": s.get("table", None)
                                    })
                            all_heroes_data[hero_id_str] = {"lore": lore, "skills": skills}
                        else:
                            has_hero_keys = any(k.startswith("hero_") for k in data.keys())
                            if has_hero_keys:
                                add_data(data)
                            elif "skills" in data and "lore" in data:
                                m = re.search(r"hero_(\d+)", fp)
                                if m:
                                    hero_id = f"hero_{m.group(1)}"
                                    all_heroes_data[hero_id] = data
        except Exception as e:
            print(f"Error reading {fp}: {e}")

# Try finding loose files by content just in case
def find_in_messages():
    pass

print(f"Collected {len(all_heroes_data)} heroes out of 112.")
missing = [f"hero_{i:03d}" for i in range(1, 113) if f"hero_{i:03d}" not in all_heroes_data]
print(f"Missing: {missing}")

out_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\public\data\skills\ja.json"
os.makedirs(os.path.dirname(out_path), exist_ok=True)

# Merge with existing if any, to be safe
if os.path.exists(out_path):
    with open(out_path, "r", encoding="utf-8") as f:
        existing = json.load(f)
    for k, v in all_heroes_data.items():
        existing[k] = v
    all_heroes_data = existing

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(all_heroes_data, f, ensure_ascii=False, indent=2)
print("Saved to", out_path)
