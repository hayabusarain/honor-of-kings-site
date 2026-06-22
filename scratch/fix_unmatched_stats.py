import json

stats_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hero_stats.json"
heroes_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hok_heroes.json"

with open(stats_path, "r", encoding="utf-8") as f:
    stats = json.load(f)

with open(heroes_path, "r", encoding="utf-8") as f:
    hok_heroes = json.load(f)

# Build a mapping of hero names (in english, romanized, jp, cn) to their nameEn route id
route_map = {}
for h in hok_heroes:
    route_map[h['nameEn'].lower()] = h['nameEn']
    if 'nameCn' in h: route_map[h['nameCn']] = h['nameEn']
    if 'nameJaOfficial' in h: route_map[h['nameJaOfficial']] = h['nameEn']
    if 'titleJaOfficial' in h: route_map[h['titleJaOfficial']] = h['nameEn']
    if 'nameJa' in h: route_map[h['nameJa']] = h['nameEn']
    # remove spaces and punctuation
    norm_en = h['nameEn'].replace('-', '').replace(' ', '').lower()
    route_map[norm_en] = h['nameEn']

manual_map = {
    'huowu': 'maishiranui',
    'milidi': 'milaidik',
    'luban-no.7': 'lubanqihao',
    'luban-no7': 'lubanqihao',
    'da-qiao': 'daqiao',
    'keke': 'ake',
    'nüwa': 'nvwa',
    'luara': 'luara', # Is there a Laura?
    'flowborn-(marksman)': 'yuanliuzhiuzi', # Assuming marksman
    'flowborn-(mage)': 'yuanliuzhiuzi', # Assuming mage
    'badian': 'dianwei', # "badian" -> dian wei? Wait, Dian Wei is dianwei
    'juyoujing': 'jvyoujing',
    'zhouyu': 'zhouyu',
    'donghuang': 'donghuangtaiyi',
    'sun-ce': 'sunce',
    'shangguan': 'shangguanwaner',
    'menki': 'mengqi',
    'wuyan': 'zhongwuyan',
    'kongming': 'zhugeliang',
    'zhuangzi': 'zhuangzhou',
    'consort-yu': 'yuji',
    'xiaoqiao': 'xiaoqiao',
    'diaochan': 'diaochan'
}

for stat in stats:
    old_en = stat['hero_name_en'].lower()
    
    if old_en in manual_map:
        stat['hero_name_en'] = manual_map[old_en]
    else:
        norm = old_en.replace('-', '').replace(' ', '').replace('.', '')
        if norm in route_map:
            stat['hero_name_en'] = route_map[norm]

with open(stats_path, "w", encoding="utf-8") as f:
    json.dump(stats, f, indent=2, ensure_ascii=False)

print("Fixed unmatched hero_stats.json")
