import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

print("Testing scrapers...")

# Test HoKStats
try:
    r = requests.get('https://hokstats.gg/heroes', headers=headers, timeout=10)
    print("HoKStats Status:", r.status_code)
    if r.status_code == 200:
        soup = BeautifulSoup(r.text, 'html.parser')
        links = [a['href'] for a in soup.find_all('a', href=True) if '/hero/' in a['href']]
        print("HoKStats Links:", links[:5])
except Exception as e:
    print("HoKStats Error:", e)

# Test ZillionGamer Tier List page
try:
    r = requests.get('https://zilliongamer.com/honor-of-kings/c/tier-list/honor-of-kings-tier-list', headers=headers, timeout=10)
    print("ZillionGamer Status:", r.status_code)
    if r.status_code == 200:
        soup = BeautifulSoup(r.text, 'html.parser')
        links = [a['href'] for a in soup.find_all('a', href=True) if '/honor-of-kings/c/' in a['href']]
        print("ZillionGamer Links:", list(set(links))[:5])
except Exception as e:
    print("ZillionGamer Error:", e)

# Test HoK Camp
try:
    r = requests.get('https://camp.levelinfinite.com/camp/v2/hok/hero-detail?id=105', headers=headers, timeout=10)
    print("HoK Camp Status:", r.status_code)
except Exception as e:
    print("HoK Camp Error:", e)
