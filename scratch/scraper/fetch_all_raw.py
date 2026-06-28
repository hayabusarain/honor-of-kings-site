import os
import json
import time
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

base_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト"
data_dir = os.path.join(base_dir, "scratch/scraper/data")
os.makedirs(data_dir, exist_ok=True)

with open(os.path.join(base_dir, "public/data/skills/ja.json"), "r", encoding="utf-8") as f:
    ja_data = json.load(f)

def get_english_name(ja_name):
    try:
        url = f"https://honor-of-kings.fandom.com/api.php?action=query&list=search&srsearch={urllib.parse.quote(ja_name)}&utf8=&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        if res.get('query', {}).get('search'):
            return res['query']['search'][0]['title']
    except Exception as e:
        print(f"Error finding English name for {ja_name}: {e}")
    return ja_name

def fetch_fandom_text(en_name):
    try:
        url = f"https://honor-of-kings.fandom.com/api.php?action=parse&page={urllib.parse.quote(en_name)}&format=json&prop=text"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        if "parse" in res and "text" in res["parse"]:
            html = res["parse"]["text"]["*"]
            soup = BeautifulSoup(html, "html.parser")
            return soup.get_text(separator="\n", strip=True)
    except Exception as e:
        print(f"Error fetching text for {en_name}: {e}")
    return ""

print("Starting batch fetch...")
heroes_processed = 0

for hero_id, data in ja_data.items():
    if not hero_id.startswith("hero_"): continue
    
    out_path = os.path.join(data_dir, f"{hero_id}_raw.txt")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        continue # Skip already successfully fetched

    ja_name = data.get("hero_name", "")
    en_name = get_english_name(ja_name)
    
    print(f"[{hero_id}] Fetched.")
    raw_text = fetch_fandom_text(en_name)
    
    if raw_text:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(raw_text)
        heroes_processed += 1
    
    time.sleep(1.5) # Gentle rate limiting

print(f"Finished fetching {heroes_processed} heroes.")
