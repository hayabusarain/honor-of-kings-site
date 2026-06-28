import os
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import gzip

def fetch_fandom(hero_name):
    url = f"https://honor-of-kings.fandom.com/wiki/{urllib.parse.quote(hero_name)}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req, timeout=15).read()
        soup = BeautifulSoup(html, 'html.parser')
        content_div = soup.find('div', {'class': 'mw-parser-output'})
        if content_div:
            return content_div.get_text(separator='\n', strip=True)[:4000]
        return "Content not found"
    except Exception as e:
        return f"Error fetching Fandom: {e}"

def fetch_hokstats(hero_name):
    url = f"https://hokstats.gg/hero/{hero_name.lower().replace(' ', '-')}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req, timeout=15).read()
        soup = BeautifulSoup(html, 'html.parser')
        return soup.body.get_text(separator='\n', strip=True)[:4000]
    except Exception as e:
        return f"Error fetching HoKStats: {e}"

def fetch_liquipedia(hero_name):
    url = f"https://liquipedia.net/honorofkings/{urllib.parse.quote(hero_name)}"
    headers = {
        'User-Agent': 'HonorOfKingsStrategyBot/1.0 (contact: bot@example.com)',
        'Accept-Encoding': 'gzip'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        response = urllib.request.urlopen(req, timeout=15)
        if response.info().get('Content-Encoding') == 'gzip':
            html = gzip.decompress(response.read())
        else:
            html = response.read()
        soup = BeautifulSoup(html, 'html.parser')
        content_div = soup.find('div', {'class': 'mw-parser-output'})
        if content_div:
            return content_div.get_text(separator='\n', strip=True)[:4000]
        return "Content not found"
    except Exception as e:
        return f"Error fetching Liquipedia: {e}"

if __name__ == "__main__":
    hero_id = "hero_059"
    hero_name = "Chicha"
    
    print(f"Fetching data for {hero_name} using urllib...")
    fandom_text = fetch_fandom(hero_name)
    hokstats_text = fetch_hokstats(hero_name)
    liquipedia_text = fetch_liquipedia(hero_name)
    
    out_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/data"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{hero_id}_raw.txt")
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"--- FANDOM WIKI ---\n{fandom_text}\n\n")
        f.write(f"--- HOKSTATS ---\n{hokstats_text}\n\n")
        f.write(f"--- LIQUIPEDIA ---\n{liquipedia_text}\n\n")
        
    print(f"Saved raw data to {out_path}")
