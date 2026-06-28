import re

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/heroes_list.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Liquipedia hero links usually look like href="/honorofkings/Arthur" title="Arthur"
heroes = re.findall(r'href="/honorofkings/([^"]+)" title="([^"]+)"', html)
# filter unique ones
unique_heroes = list(set([h[1] for h in heroes if ':' not in h[0]]))

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/all_heroes.json', 'w', encoding='utf-8') as f:
    import json
    json.dump(sorted(unique_heroes), f, indent=2)

print("Extracted heroes.")
