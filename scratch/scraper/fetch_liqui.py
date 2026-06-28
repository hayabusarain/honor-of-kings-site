import os
import json
import time
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

base_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト"
data_dir = os.path.join(base_dir, "scratch/scraper/data_liqui")
os.makedirs(data_dir, exist_ok=True)

with open(os.path.join(base_dir, "scratch/scraper/chunks/all_heroes.json"), "r", encoding="utf-8") as f:
    # Do we have all_heroes mapping? Let's check scratch/scraper/chunks/search_names.json or something.
    pass

# We can use the chunk files 1-10 to get ja_name.
heroes = {}
for i in range(1, 11):
    chunk_path = os.path.join(base_dir, f"scratch/scraper/chunks/chunk_{i}.json")
    if os.path.exists(chunk_path):
        with open(chunk_path, "r", encoding="utf-8") as f:
            chunk = json.load(f)
            heroes.update(chunk)

def get_liqui_text(ja_name):
    try:
        # Fandom API to get EN name
        url = f"https://honor-of-kings.fandom.com/api.php?action=query&list=search&srsearch={urllib.parse.quote(ja_name)}&utf8=&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = json.loads(urllib.request.urlopen(req, timeout=5).read().decode('utf-8'))
        en_name = ja_name
        if res.get('query', {}).get('search'):
            en_name = res['query']['search'][0]['title']
        
        # Scrape Liquipedia
        l_url = f"https://liquipedia.net/honorofkings/{urllib.parse.quote(en_name)}"
        req2 = urllib.request.Request(l_url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Encoding': 'gzip, deflate'
        })
        import gzip
        response = urllib.request.urlopen(req2, timeout=10)
        if response.info().get('Content-Encoding') == 'gzip':
            html = gzip.decompress(response.read()).decode('utf-8')
        else:
            html = response.read().decode('utf-8')
        
        soup = BeautifulSoup(html, "html.parser")
        # Extract main content
        content = soup.find(id="mw-content-text")
        if content:
            return content.get_text(separator="\n", strip=True)[:15000] # Cap size
    except Exception as e:
        print(f"Error {ja_name}: {e}")
    return ""

print(f"Starting fetch for {len(heroes)} heroes...")
fetched = 0
for h_id, ja_name in heroes.items():
    out_path = os.path.join(data_dir, f"{h_id}_raw.txt")
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        continue
    
    print(f"Fetching {h_id}...")
    txt = get_liqui_text(ja_name)
    if txt:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(txt)
        fetched += 1
    time.sleep(2) # 2 seconds sleep

print(f"Done fetching {fetched} new heroes.")
