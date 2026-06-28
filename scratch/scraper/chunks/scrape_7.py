import urllib.request
import urllib.error
import gzip
import json
import re
import os
import time

heroes = {
    "hero_073": "Kongming",
    "hero_074": "Da_Qiao",
    "hero_075": "Huang_Zhong",
    "hero_076": "Kaizer",
    "hero_077": "Baili_Xuance",
    "hero_078": "Baili_Shouyue",
    "hero_079": "Yi_Xing",
    "hero_080": "Meng_Qi",
    "hero_081": "Gongsun_Li",
    "hero_082": "Ming_Shiyin",
    "hero_083": "Pei_Qinhu",
    "hero_084": "Biron"
}

output_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/texts"
os.makedirs(output_dir, exist_ok=True)

headers = {
    "User-Agent": "AntigravityBot/1.0 (antigravity@example.com)",
    "Accept-Encoding": "gzip",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
}

print("Waiting for rate limits to clear...")
time.sleep(5)

for hero_id, name in heroes.items():
    url = f"https://liquipedia.net/honorofkings/{name}"
    req = urllib.request.Request(url, headers=headers)
    success = False
    
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    content = gzip.decompress(response.read()).decode('utf-8')
                else:
                    content = response.read().decode('utf-8')
                
                match = re.search(r'<div class="mw-parser-output">(.*?)<!-- \s*NewPP limit report', content, re.DOTALL)
                if not match:
                    match = re.search(r'<div class="mw-parser-output">(.*?)</main>', content, re.DOTALL)
                    
                if match:
                    text = match.group(1)
                    text = re.sub(r'<style.*?>.*?</style>', '', text, flags=re.DOTALL)
                    text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.DOTALL)
                    text = re.sub(r'<[^>]+>', ' ', text)
                    text = re.sub(r'\s+', ' ', text).strip()
                else:
                    text = "NO CONTENT"
                
                with open(f"{output_dir}/{hero_id}.txt", "w", encoding="utf-8") as f:
                    f.write(text)
                print(f"Scraped {name}")
                success = True
                break
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"Rate limited {name}. Retrying in 10s...")
                time.sleep(10)
            else:
                print(f"Failed {name}: {e.code}")
                break
        except Exception as e:
            print(f"Failed {name}: {e}")
            time.sleep(5)
    
    time.sleep(3) # be nice to the server
