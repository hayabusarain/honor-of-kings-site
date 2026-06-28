import urllib.request
import urllib.error
import gzip
import json
import os
import re

heroes = {
    "hero_013": "Mozi",
    "hero_014": "Sun_Shangxiang",
    "hero_015": "Zhuangzi",
    "hero_016": "Liu_Shan",
    "hero_017": "Gao_Jianli",
    "hero_018": "Ake",
    "hero_019": "Zhong_Wuyan",
    "hero_020": "Sun_Bin",
    "hero_021": "Bian_Que",
    "hero_022": "Bai_Qi",
    "hero_023": "Miyue",
    "hero_024": "Lu_Bu"
}

output_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/texts_2"
os.makedirs(output_dir, exist_ok=True)

def strip_tags(html):
    html = re.sub(r'<style.*?>.*?</style>', '', html, flags=re.DOTALL)
    html = re.sub(r'<script.*?>.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<[^>]+>', ' ', html)
    html = re.sub(r'\s+', ' ', html)
    return html

for hid, name in heroes.items():
    url = f"https://liquipedia.net/honorofkings/{name}"
    req = urllib.request.Request(url, headers={'Accept-Encoding': 'gzip', 'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        if response.info().get('Content-Encoding') == 'gzip':
            html = gzip.decompress(response.read()).decode('utf-8')
        else:
            html = response.read().decode('utf-8')
            
        text = strip_tags(html)
        
        # Try to find the start of content
        idx = text.find('Contents')
        if idx != -1:
            text = text[idx:]
        
        out_path = os.path.join(output_dir, f"{hid}.txt")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text[:5000])  # Save first 5000 chars of relevant text
            
        print(f"Successfully scraped {name}")
    except Exception as e:
        print(f"Error scraping {name}: {e}")
