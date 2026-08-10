import json

# Mapping tRank to tier string
# S+ は廃止（サイトは S/A/B/C の4段階）。公式 tRank 0 と 1 はどちらも S に統合する
tier_map = {
    0: "S",
    1: "S",
    2: "A",
    3: "B",
    4: "C",
    5: "C"
}

with open(r'C:\Users\81901\Desktop\8月7日ティアリスト.json', 'r', encoding='utf-8') as f:
    new_data = json.load(f)

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hero_stats_camp.json', 'r', encoding='utf-8') as f:
    old_stats = json.load(f)

# Loop through the new data list
for item in new_data['data']['list']:
    hero_id = str(item['heroId'])
    
    # If the hero exists in our stats, update it
    if hero_id in old_stats:
        old_stats[hero_id]['win_rate'] = round(item['winRate'] * 100, 2)
        old_stats[hero_id]['pick_rate'] = round(item['showRate'] * 100, 2)
        old_stats[hero_id]['ban_rate'] = round(item['banRate'] * 100, 2)
        
        trank = item.get('tRank', 3)
        old_stats[hero_id]['tier'] = tier_map.get(trank, "B")

with open(r'C:\Users\81901\Desktop\オナーオブキングスサイト\src\data\hero_stats_camp.json', 'w', encoding='utf-8') as f:
    json.dump(old_stats, f, ensure_ascii=False, indent=2)

print("Updated hero_stats_camp.json successfully!")
