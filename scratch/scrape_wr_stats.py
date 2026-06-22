import requests
from bs4 import BeautifulSoup
import json
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "https://leagueoflegends.fandom.com"
CATEGORY_URL = "https://leagueoflegends.fandom.com/wiki/Category:Wild_Rift_champions"

def get_champion_links():
    print("Fetching champion list via API...")
    url = "https://leagueoflegends.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Wild_Rift_champions&cmlimit=max&format=json"
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    data = response.json()
    
    links = []
    if 'query' in data and 'categorymembers' in data['query']:
        for member in data['query']['categorymembers']:
            title = member['title']
            if '/WR' in title:
                champ_name = title.replace('/WR', '').strip()
                links.append((champ_name, BASE_URL + "/wiki/" + title.replace(' ', '_')))
                
    if not links:
        # フォールバックとして、手動でいくつかのメジャーチャンピオンを指定（テスト用）
        print("API returned no WR champions (category might be wrong). Using fallback list...")
        links = [
            ("Aatrox", "https://leagueoflegends.fandom.com/wiki/Aatrox/WR"),
            ("Ahri", "https://leagueoflegends.fandom.com/wiki/Ahri/WR"),
            ("Garen", "https://leagueoflegends.fandom.com/wiki/Garen/WR"),
            ("Urgot", "https://leagueoflegends.fandom.com/wiki/Urgot/WR"),
            ("MissFortune", "https://leagueoflegends.fandom.com/wiki/Miss_Fortune/WR")
        ]
            
    print(f"Found {len(links)} champions.")
    return links

def parse_stat(stat_div):
    if not stat_div:
        return None
    text = stat_div.text.strip()
    return text

def scrape_champion_stats(champ_name, url):
    print(f"Scraping stats for {champ_name}...")
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        stats = {}
        
        # FandomのInfobox内のステータスを探す
        # 通常、data-source="health", data-source="attack damage" などの属性が使われる
        stat_sources = {
            'hp': 'health',
            'hp_per_lvl': 'health lvl',
            'mana': 'resource', # Or mana
            'mana_per_lvl': 'resource lvl',
            'ad': 'attack damage',
            'ad_per_lvl': 'attack damage lvl',
            'ap': 'ability power',
            'as': 'attack speed',
            'as_per_lvl': 'attack speed lvl',
            'armor': 'armor',
            'armor_per_lvl': 'armor lvl',
            'mr': 'magic resistance',
            'mr_per_lvl': 'magic resistance lvl',
            'ms': 'movement speed',
            'range': 'attack range'
        }
        
        # portable-infobox
        infobox = soup.find('aside', class_='portable-infobox')
        if not infobox:
            print(f"  [Warning] Infobox not found for {champ_name}")
            return None
            
        for key, source in stat_sources.items():
            elem = infobox.find(attrs={"data-source": source})
            if elem:
                val_elem = elem.find('div', class_='pi-data-value')
                if val_elem:
                    # ' + 12' のような不要な文字列をきれいに
                    val_text = val_elem.text.strip().replace('\u00a0', ' ').replace('\u2013', '-')
                    stats[key] = val_text
                    
        return stats
    except Exception as e:
        print(f"  [Error] Failed to scrape {champ_name}: {e}")
        return None

def main():
    links = get_champion_links()
    all_stats = {}
    
    # テストとして最初の10体を抽出 (レートリミット対策でとりあえず少なく)
    # 本番は links 全て
    for champ_name, url in links:
        stats = scrape_champion_stats(champ_name, url)
        if stats:
            all_stats[champ_name] = stats
        time.sleep(1) # Fandomへの負荷軽減
        
    out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'data')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'wr_base_stats.json')
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(all_stats, f, ensure_ascii=False, indent=2)
        
    print(f"Saved stats to {out_path}")

if __name__ == "__main__":
    main()
