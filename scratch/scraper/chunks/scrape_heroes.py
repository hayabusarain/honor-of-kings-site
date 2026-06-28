import urllib.request
import urllib.error
import gzip
import json
import re
import time
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.capture = False

    def handle_data(self, data):
        text = data.strip()
        if text:
            self.text.append(text)

hero_map = {
    "hero_085": "Yaria",
    "hero_086": "Cirrus",
    "hero_087": "Li_Xin",
    "hero_088": "Garo",
    "hero_089": "Sun_Ce",
    "hero_090": "Shangguan",
    "hero_091": "Allain",
    "hero_092": "Augran",
    "hero_093": "Ao%27yin",
    "hero_094": "Hai_Yue",
    "hero_095": "Dongfang_Yao",
    "hero_096": "Xishi"
}

out = {}

for hid, en_name in hero_map.items():
    print(f"Fetching {en_name}...")
    
    success = False
    retries = 3
    while not success and retries > 0:
        req = urllib.request.Request(
            f'https://liquipedia.net/honorofkings/{en_name}',
            headers={
                'User-Agent': 'HonorOfKingsScraperBot/1.0 (contact: info@example.com)',
                'Accept-Encoding': 'gzip'
            }
        )
        
        try:
            with urllib.request.urlopen(req) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    html = gzip.decompress(response.read()).decode('utf-8')
                else:
                    html = response.read().decode('utf-8')
                    
            match = re.search(r'<div class="mw-parser-output">(.*?)<!-- \s*NewPP limit report', html, re.DOTALL)
            content = match.group(1) if match else html
            
            content = re.sub(r'<(script|style).*?>.*?</\1>', '', content, flags=re.DOTALL)
            
            parser = TextExtractor()
            parser.feed(content)
            text = ' '.join(parser.text)
            
            out[hid] = {
                "name": en_name,
                "text": text[:8000]
            }
            success = True
            time.sleep(3) # Stay well below limits (1 req per 2 seconds max)
        except urllib.error.HTTPError as e:
            print(f"HTTPError {e.code} for {en_name}. Waiting...")
            if e.code == 429:
                time.sleep(10)
                retries -= 1
            else:
                out[hid] = {"name": en_name, "text": f"Error: {e}"}
                break
        except Exception as e:
            print(f"Failed for {en_name}: {e}")
            out[hid] = {"name": en_name, "text": f"Error: {e}"}
            break

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/hero_texts.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("Done fetching hero texts")
