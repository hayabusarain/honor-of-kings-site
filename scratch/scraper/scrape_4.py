import urllib.request
import urllib.error
import gzip
import json
import re
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.in_script_or_style = False

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.in_script_or_style = True

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.in_script_or_style = False

    def handle_data(self, data):
        if not self.in_script_or_style:
            text = data.strip()
            if text:
                self.text.append(text)

def scrape_liquipedia(hero_name):
    url = f"https://liquipedia.net/honorofkings/{hero_name.replace(' ', '_')}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0',
        'Accept-Encoding': 'gzip'
    })
    try:
        with urllib.request.urlopen(req) as response:
            if response.info().get('Content-Encoding') == 'gzip':
                content = gzip.decompress(response.read()).decode('utf-8')
            else:
                content = response.read().decode('utf-8')
            
            # Basic text extraction
            extractor = TextExtractor()
            extractor.feed(content)
            full_text = ' '.join(extractor.text)
            
            # Try to grab just the mw-parser-output part if possible
            match = re.search(r'<div class="mw-parser-output">(.*?)<!-- \s*NewPP limit report', content, re.DOTALL)
            if match:
                extractor_main = TextExtractor()
                extractor_main.feed(match.group(1))
                return ' '.join(extractor_main.text)
            return full_text
            
    except urllib.error.URLError as e:
        print(f"Error scraping {hero_name}: {e}")
        return ""

heroes = {
    "hero_037": "Sima Yi",
    "hero_038": "Fuzi",
    "hero_039": "Guan Yu",
    "hero_040": "Diao Chan",
    "hero_041": "Luna",
    "hero_042": "Jiang Ziya",
    "hero_043": "Liu Bang",
    "hero_044": "Han Xin",
    "hero_045": "Wang Zhaojun",
    "hero_046": "Prince of Lanling",
    "hero_047": "Unknown",
    "hero_048": "Erin"
}

results = {}
for hero_id, name in heroes.items():
    if name == "Unknown":
        continue
    print(f"Scraping {name}...")
    text = scrape_liquipedia(name)
    results[hero_id] = text[:5000] # store first 5k characters to avoid huge files

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/scraped_4.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Scraping complete.")
