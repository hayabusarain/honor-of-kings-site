import json
with open('C:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    print(json.dumps(data.get('hero_001', {}), ensure_ascii=False, indent=2))
