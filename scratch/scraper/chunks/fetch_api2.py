import urllib.request
import urllib.parse
import json
import gzip
import re
import os

heroes = {
    "hero_049": ["Zhang Liang", "Liang"],
    "hero_050": ["Mai Shiranui"],
    "hero_051": ["Dolia"],
    "hero_052": ["Nakoruru"],
    "hero_053": ["Ukyo Tachibana"],
    "hero_054": ["Arthur"],
    "hero_055": ["Sun Wukong", "Wukong"],
    "hero_056": ["Lapulapu", "Lumburr"],
    "hero_057": ["Liu Bei"],
    "hero_058": ["Zhang Fei"],
    "hero_059": ["Chicha"],
    "hero_060": ["Fang", "Li Yuanfang"]
}

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    return ' '.join(cleantext.split())

def fetch_wiki(names):
    for name in names:
        url = f"https://liquipedia.net/honorofkings/api.php?action=parse&page={urllib.parse.quote(name.replace(' ', '_'))}&format=json"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept-Encoding': 'gzip'
        })
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    data = gzip.decompress(response.read()).decode('utf-8')
                else:
                    data = response.read().decode('utf-8')
                
                js = json.loads(data)
                if 'parse' in js:
                    text = js['parse']['text']['*']
                    return clean_html(text)
        except Exception as e:
            continue
    return ""

out = []
for h_id, names in heroes.items():
    text = fetch_wiki(names)
    if text:
        # get first 2000 chars of text after removing some noise
        content = text[:2000]
        out.append(f"== {h_id} {names[0]} ==\n" + content)

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/api_texts2.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(out))

print("Done")
