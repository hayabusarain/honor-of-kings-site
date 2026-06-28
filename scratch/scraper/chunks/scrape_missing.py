import urllib.request
import urllib.error
import urllib.parse
import gzip
import json
import os
import re
import time

missing_heroes = {
    "hero_018": ["A_Ke", "Ake", "Butterfly"],
    "hero_023": ["Mi_Yue", "Miyue"],
    "hero_024": ["Lu_Bu", "Lubu"]
}

output_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/texts_2"

def strip_tags(html):
    html = re.sub(r'<style.*?>.*?</style>', '', html, flags=re.DOTALL)
    html = re.sub(r'<script.*?>.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<[^>]+>', ' ', html)
    html = re.sub(r'\s+', ' ', html)
    return html

for hid, names in missing_heroes.items():
    for name in names:
        url = f"https://liquipedia.net/honorofkings/{urllib.parse.quote(name)}"
        req = urllib.request.Request(url, headers={'Accept-Encoding': 'gzip', 'User-Agent': 'Mozilla/5.0'})
        try:
            response = urllib.request.urlopen(req)
            if response.info().get('Content-Encoding') == 'gzip':
                html = gzip.decompress(response.read()).decode('utf-8')
            else:
                html = response.read().decode('utf-8')
                
            text = strip_tags(html)
            
            idx = text.find('Contents')
            if idx != -1:
                text = text[idx:]
            
            out_path = os.path.join(output_dir, f"{hid}.txt")
            with open(out_path, "w", encoding="utf-8") as f:
                f.write(text[:5000])
                
            print(f"Successfully scraped {name} for {hid}")
            time.sleep(1) # delay to prevent 429
            break # stop trying other names
        except urllib.error.HTTPError as e:
            print(f"HTTP Error {e.code} for {name}")
            time.sleep(1)
        except Exception as e:
            print(f"Error scraping {name}: {e}")
            time.sleep(1)
