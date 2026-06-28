import os
import json
import urllib.parse
from playwright.sync_api import sync_playwright

def get_hero_english_name(hero_id):
    # Retrieve English name from en.json
    try:
        with open('c:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/en.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            if hero_id in data:
                return data[hero_id].get('hero_name', '')
    except Exception:
        pass
    return ""

def scrape_hero(hero_name):
    print(f"Starting scrape for {hero_name}...")
    results = {"fandom": "", "hokstats": "", "liquipedia": ""}
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 1. Scraping Fandom
        try:
            url_fandom = f"https://honor-of-kings.fandom.com/wiki/{urllib.parse.quote(hero_name)}"
            page.goto(url_fandom, wait_until="domcontentloaded", timeout=30000)
            results["fandom"] = page.locator('.mw-parser-output').inner_text()[:4000]
            print("Successfully scraped Fandom.")
        except Exception as e:
            print(f"Error scraping Fandom: {e}")
            
        # 2. Scraping HoKStats
        try:
            url_hokstats = f"https://hokstats.gg/hero/{hero_name.lower().replace(' ', '-')}"
            page.goto(url_hokstats, wait_until="networkidle", timeout=30000)
            results["hokstats"] = page.locator('body').inner_text()[:4000]
            print("Successfully scraped HoKStats.")
        except Exception as e:
            print(f"Error scraping HoKStats: {e}")
            
        # 3. Scraping Liquipedia
        try:
            url_liquipedia = f"https://liquipedia.net/honorofkings/{urllib.parse.quote(hero_name)}"
            page.set_extra_http_headers({'User-Agent': 'HonorOfKingsStrategyBot/1.0 (contact: bot@example.com)'})
            page.goto(url_liquipedia, wait_until="domcontentloaded", timeout=30000)
            results["liquipedia"] = page.locator('.mw-parser-output').inner_text()[:4000]
            print("Successfully scraped Liquipedia.")
        except Exception as e:
            print(f"Error scraping Liquipedia: {e}")
            
        browser.close()
        
    return results

if __name__ == "__main__":
    hero_id = "hero_059"
    hero_name = get_hero_english_name(hero_id) or "Chicha"
    
    data = scrape_hero(hero_name)
    
    out_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/data"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{hero_id}_raw.txt")
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"--- FANDOM WIKI ---\n{data['fandom']}\n\n")
        f.write(f"--- HOKSTATS ---\n{data['hokstats']}\n\n")
        f.write(f"--- LIQUIPEDIA ---\n{data['liquipedia']}\n\n")
        
    print(f"Saved scraped data for {hero_name} to {out_path}")
