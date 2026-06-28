import os
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

def fetch_fandom(hero_name):
    url = f"https://honor-of-kings.fandom.com/wiki/{urllib.parse.quote(hero_name)}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(html, 'html.parser')
        content_div = soup.find('div', {'class': 'mw-parser-output'})
        if content_div:
            return content_div.get_text(separator='\n', strip=True)[:3000] # Get first 3000 chars
        return "Content not found"
    except Exception as e:
        return f"Error fetching Fandom: {e}"

def fetch_hokstats(hero_name):
    # hokstats might format hero names like 'chicha'
    url = f"https://hokstats.gg/hero/{hero_name.lower().replace(' ', '-')}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(html, 'html.parser')
        return soup.body.get_text(separator='\n', strip=True)[:3000]
    except Exception as e:
        return f"Error fetching HoKStats: {e}"

def fetch_liquipedia(hero_name):
    url = f"https://liquipedia.net/honorofkings/{urllib.parse.quote(hero_name)}"
    headers = {
        'User-Agent': 'HonorOfKingsStrategyBot/1.0 (contact: bot@example.com) Python-urllib/3.x',
        'Accept-Encoding': 'gzip'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        response = urllib.request.urlopen(req)
        if response.info().get('Content-Encoding') == 'gzip':
            import gzip
            html = gzip.decompress(response.read())
        else:
            html = response.read()
        soup = BeautifulSoup(html, 'html.parser')
        content_div = soup.find('div', {'class': 'mw-parser-output'})
        if content_div:
            return content_div.get_text(separator='\n', strip=True)[:3000]
        return "Content not found"
    except Exception as e:
        return f"Error fetching Liquipedia: {e}"

if __name__ == "__main__":
    hero = "Chicha"
    os.makedirs("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/data", exist_ok=True)
    out_path = f"c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/data/{hero}.txt"
    
    print(f"Fetching data for {hero}...")
    fandom_text = fetch_fandom(hero)
    hokstats_text = fetch_hokstats(hero)
    liquipedia_text = fetch_liquipedia(hero)
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"--- FANDOM WIKI ---\n{fandom_text}\n\n")
        f.write(f"--- HOKSTATS ---\n{hokstats_text}\n\n")
        f.write(f"--- LIQUIPEDIA ---\n{liquipedia_text}\n\n")
        
    print(f"Saved raw data to {out_path}")
