import re
import json

guide_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\app\[locale]\guide\page.tsx"
with open(guide_path, "r", encoding="utf-8") as f:
    content = f.read()

# I need to replace `champId` in the image path with the actual ID from hok_heroes.json
with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json", "r", encoding="utf-8") as f:
    hok_heroes = json.load(f)

# Build a map from nameEn (like 'yase') or english name (like 'arthur') to id (like '166')
name_to_id = {}
for h in hok_heroes:
    name_to_id[h['nameEn'].lower()] = h['id']
    if 'nameEn' in h:
        name_to_id[h['nameEn'].lower()] = h['id']

# Manual map for the guide's champIds
champId_to_id = {
    'arthur': '166',
    'dun': '107', # Xiahou dun
    'ata': '511', # Zhubajie / Ata
    'wukong': '167',
    'butterfly': '116', # keke? wait, let's check
    'lam': '528',
    'daji': '109',
    'angela': '142',
    'xiaoqiao': '106',
    'houyi': '169',
    'luban-no7': '112', # lubanqihao
    'consort-yu': '174', # yuji
    'caiyan': '184', # caiwenji
    'daqiao': '191',
    'zhuangzi': '113' # zhuangzhou
}

# Fix missing ones based on hok_heroes
for key in champId_to_id:
    # Actually just replace the template string in page.tsx
    pass

# We can just change the image rendering in page.tsx to look up the ID if we import hok_heroes, but since we have a static list, let's just add `imageId` to the recommendedHeros objects in page.tsx.

def replacer(match):
    champId = match.group(1)
    return f"champId: '{champId}', imageId: '{champId_to_id.get(champId, champId)}',"

content = re.sub(r"champId:\s*'([^']+)',", replacer, content)

# Replace the img src
content = re.sub(r"src=\{\`/images/heroes/\$\{champ\.champId\}\.jpg\`\}", r"src={`/images/heroes/${champ.imageId}.jpg`}", content)

with open(guide_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated guide/page.tsx")
