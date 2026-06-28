import urllib.request
import urllib.error
import gzip
import json
import re
import time
from html.parser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = []
    def handle_data(self, d):
        self.text.append(d)
    def get_data(self):
        return ''.join(self.text)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

heroes = {
    "hero_001": ("元流の子（タンク）", "Yuanlius_Child"),
    "hero_002": ("元流の子（メイジ）", "Yuanlius_Child"),
    "hero_003": ("后羿", "Hou_Yi"),
    "hero_004": ("廉頗", "Lian_Po"),
    "hero_005": ("ミレディ", "Milady"),
    "hero_006": ("元流の子（マークスマン）", "Yuanlius_Child"),
    "hero_007": ("カルラ", "Garuda"),
    "hero_008": ("妲己", "Daji"),
    "hero_009": ("魯班7号", "Luban_No.7"),
    "hero_010": ("アンジェラ", "Angela"),
    "hero_011": ("小喬", "Xiao_Qiao"),
    "hero_012": ("趙雲", "Zhao_Yun")
}

output_data = {}

def fetch_wiki(name):
    url = f"https://liquipedia.net/honorofkings/{name}"
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept-Encoding': 'gzip',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
        }
    )
    for _ in range(2):
        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    html = gzip.decompress(response.read()).decode('utf-8', errors='ignore')
                else:
                    html = response.read().decode('utf-8', errors='ignore')
                
                if 'mw-parser-output' in html:
                    content = html.split('mw-parser-output')[1]
                    text = strip_tags('<div class="mw-parser-output' + content)
                    text = re.sub(r'\s+', ' ', text).strip()
                    return text[:3000]
                else:
                    return strip_tags(html)[:3000]
        except urllib.error.HTTPError as e:
            if e.code == 429:
                print("429, sleep 2")
                time.sleep(2)
                continue
            return f"HTTP Error: {e.code}"
        except Exception as e:
            return str(e)
    return "Failed after retries"

for hid, (jp_name, en_name) in heroes.items():
    print(f"Fetching {en_name}...")
    content = fetch_wiki(en_name)
    if "HTTP Error: 404" in content:
        alt_names = [en_name.replace("_", " "), en_name.replace("lius", "liu's")]
        for alt_name in alt_names:
            if alt_name != en_name:
                print(f"Retrying with {alt_name}...")
                content = fetch_wiki(alt_name.replace(" ", "_"))
                if "HTTP Error: 404" not in content:
                    break
    output_data[hid] = content
    time.sleep(1)

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/scraped_data.json", "w", encoding="utf-8") as f:
    json.dump(output_data, f, ensure_ascii=False, indent=2)

print("Scraping complete.")
