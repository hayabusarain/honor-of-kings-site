import json
import urllib.request
import os

fixes = {
    "hero_059": "564",
    "hero_007": "162",
    "hero_062": "175",
    "hero_064": "548",
    "hero_104": "542",
    "hero_029": "514"
}

skill_keys = ["passive", "skill1", "skill2", "skill3", "ult"]
indices = ["00", "10", "20", "30", "40"]

with open("public/data/skills/ja.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for hero_id, ch_id in fixes.items():
    if hero_id not in data: continue
    print(f"Fixing {hero_id} ({ch_id})")
    
    for i, key in enumerate(skill_keys):
        if key in data[hero_id]:
            idx = indices[i]
            url = f"https://game.gtimg.cn/images/yxzj/img201606/heroimg/{ch_id}/{ch_id}{idx}.png"
            
            # For Chisha (564), wait, does she have 4 skills?
            # Actually we can just try downloading.
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                res = urllib.request.urlopen(req)
                img_data = res.read()
                
                # Update json
                data[hero_id][key]["icon"] = f"/images/skills/{hero_id}_{key}.png"
                
                # Save to disk
                with open(f"public/images/skills/{hero_id}_{key}.png", "wb") as img_f:
                    img_f.write(img_data)
                
                print(f"  Downloaded {key} from {url}")
            except Exception as e:
                print(f"  Failed {key} from {url}: {e}")

with open("public/data/skills/ja.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Done!")
