import urllib.request
import urllib.error
import json
import gzip
import re
import time
import os
from io import BytesIO

heroes = {
    "hero_025": "Zhou_Yu",
    "hero_026": "Yuan_Ge",
    "hero_027": "Xiahou_Dun",
    "hero_028": "Zhen_Ji",
    "hero_029": "Fuzi",
    "hero_030": "Dian_Wei",
    "hero_031": "Musashi",
    "hero_032": "Li_Bai",
    "hero_033": "Marco_Polo",
    "hero_034": "Di_Renjie",
    "hero_035": "Dharma",
    "hero_036": "Xiang_Yu"
}

def clean_html(html):
    html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<style.*?</style>', '', html, flags=re.DOTALL)
    match = re.search(r'<div class="mw-parser-output">(.*?)<!-- \s*NewPP limit report', html, flags=re.DOTALL)
    if match:
        html = match.group(1)
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

out_file = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/scraped_3.json"
if os.path.exists(out_file):
    try:
        with open(out_file, "r", encoding="utf-8") as f:
            out = json.load(f)
    except:
        out = {}
else:
    out = {}

for hid, name in heroes.items():
    if hid in out and len(out[hid]) > 10:
        print(f"Already have {name}", flush=True)
        continue

    url = f"https://liquipedia.net/honorofkings/{name}"
    
    success = False
    retries = 2
    while not success and retries > 0:
        req = urllib.request.Request(url, headers={
            'User-Agent': f'HoKDataFetcher/2.0 (hokdata_{hid}@example.com)',
            'Accept-Encoding': 'gzip'
        })
        try:
            with urllib.request.urlopen(req) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    buf = BytesIO(response.read())
                    f = gzip.GzipFile(fileobj=buf)
                    html = f.read().decode('utf-8')
                else:
                    html = response.read().decode('utf-8')
                
                text = clean_html(html)
                out[hid] = text[:2500]
                print(f"Success: {name}", flush=True)
                success = True
                
                with open(out_file, "w", encoding="utf-8") as f:
                    json.dump(out, f, ensure_ascii=False, indent=2)
                
                time.sleep(3) 
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print(f"429 Too Many Requests for {name}, sleeping 15s...", flush=True)
                time.sleep(15)
                retries -= 1
            else:
                print(f"Failed: {name} - {e}", flush=True)
                break
        except Exception as e:
            print(f"Failed: {name} - {e}", flush=True)
            break

print("Finished!", flush=True)
