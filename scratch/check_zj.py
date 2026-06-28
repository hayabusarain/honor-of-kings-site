import json
with open('scratch/scraper/outputs/output_6.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
with open('scratch/check_zhaojun.txt', 'w', encoding='utf-8') as f:
    f.write(data['hero_059']['earlyGame'] + '\n')
    f.write(data['hero_059']['midGame'] + '\n')
    f.write(data['hero_059']['lateGame'] + '\n')
