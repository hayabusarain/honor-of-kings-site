import urllib.request
import urllib.parse
import json
import gzip
from bs4 import BeautifulSoup
import os

heroes = {
    "hero_049": ["Zhang Liang", "Liang"],
    "hero_050": ["Mai Shiranui"],
    "hero_051": ["Dolia"],
    "hero_052": ["Nakoruru"],
    "hero_053": ["Ukyo Tachibana"],
    "hero_054": ["Arthur"],
    "hero_055": ["Sun Wukong", "Wukong"],
    "hero_056": ["Lapulapu", "Lapur"],
    "hero_057": ["Liu Bei"],
    "hero_058": ["Zhang Fei"],
    "hero_059": ["Chicha"],
    "hero_060": ["Fang", "Li Yuanfang"]
}

def fetch_hero(names):
    for name in names:
        url = f"https://liquipedia.net/honorofkings/{urllib.parse.quote(name.replace(' ', '_'))}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0',
            'Accept-Encoding': 'gzip'
        })
        try:
            with urllib.request.urlopen(req) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    html = gzip.decompress(response.read()).decode('utf-8')
                else:
                    html = response.read().decode('utf-8')
                
                soup = BeautifulSoup(html, 'html.parser')
                content = soup.find('div', {'class': 'mw-parser-output'})
                if content:
                    text = content.get_text(separator=' ', strip=True)
                    return text
        except Exception as e:
            continue
    return ""

out_dir = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/pages'
os.makedirs(out_dir, exist_ok=True)

for h_id, names in heroes.items():
    text = fetch_hero(names)
    with open(f"{out_dir}/{h_id}.txt", "w", encoding="utf-8") as f:
        f.write(text)

print("Scraping finished.")
