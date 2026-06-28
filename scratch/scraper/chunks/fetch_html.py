import urllib.request
import urllib.parse
import json
import gzip

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

def fetch_wiki(names):
    for name in names:
        url = f"https://liquipedia.net/honorofkings/{urllib.parse.quote(name.replace(' ', '_'))}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept-Encoding': 'gzip'
        })
        try:
            with urllib.request.urlopen(req, timeout=3) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    data = gzip.decompress(response.read()).decode('utf-8')
                else:
                    data = response.read().decode('utf-8')
                return data
        except Exception as e:
            continue
    return ""

out_dict = {}
for h_id, names in heroes.items():
    html = fetch_wiki(names)
    out_dict[h_id] = len(html)

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/html_lengths.json", "w") as f:
    json.dump(out_dict, f)

print("Fetched all HTMLs.")
