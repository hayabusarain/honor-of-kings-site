import re
import json

guide_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\app\[locale]\guide\page.tsx"
with open(guide_path, "r", encoding="utf-8") as f:
    content = f.read()

# I need to change `champId: 'arthur'` to `champId: 'yase'`, `champId: 'dun'` to `champId: 'xiahoudun'`, etc.
name_to_route = {
    'arthur': 'yase',
    'dun': 'xiahoudun',
    'ata': 'zhubajie',
    'wukong': 'sunwukong',
    'butterfly': 'keke', # Wait, butterfly is keke? Let's check hok_heroes
    'lam': 'lan',
    'daji': 'daji',
    'angela': 'anqila',
    'xiaoqiao': 'xiaoqiao',
    'houyi': 'houyi',
    'luban-no7': 'lubanqihao',
    'consort-yu': 'yuji',
    'caiyan': 'caiwenji',
    'daqiao': 'daqiao',
    'zhuangzi': 'zhuangzhou'
}

# Actually, Butterfly is 'ake' or 'keke'? Wait, Butterfly in CN is Jing (jing) or Diaochan? No, Butterfly is 'huamulan'?
# Let's read hok_heroes.json
with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json", "r", encoding="utf-8") as f:
    hok_heroes = json.load(f)

for champ_old, champ_new in name_to_route.items():
    content = re.sub(rf"champId:\s*'{champ_old}',\s*imageId:\s*'([^']+)',", rf"champId: '{champ_new}', imageId: '\1',", content)

with open(guide_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed route IDs in guide/page.tsx")
