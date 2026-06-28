import urllib.request
import urllib.error
import gzip
import json
import time

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
    print(f"Fetching API for {en_name}...")
    success = False
    retries = 3
    while not success and retries > 0:
        req = urllib.request.Request(
            f'https://liquipedia.net/honorofkings/api.php?action=query&prop=revisions&titles={en_name}&rvprop=content&rvslots=main&format=json',
            headers={
                'User-Agent': 'HonorOfKingsHeroScraper/1.0 (Python script)',
                'Accept-Encoding': 'gzip'
            }
        )
        try:
            with urllib.request.urlopen(req) as response:
                if response.info().get('Content-Encoding') == 'gzip':
                    data = gzip.decompress(response.read()).decode('utf-8')
                else:
                    data = response.read().decode('utf-8')
                    
            res = json.loads(data)
            pages = res.get('query', {}).get('pages', {})
            page = list(pages.values())[0]
            if 'revisions' in page:
                content = page['revisions'][0].get('slots', {}).get('main', {}).get('*', '')
                if not content:
                    content = page['revisions'][0].get('*', '')
                out[hid] = {
                    "name": en_name,
                    "text": content[:15000] # Full wikitext is good
                }
            else:
                out[hid] = {
                    "name": en_name,
                    "text": "No revisions found."
                }
            success = True
            time.sleep(3)
        except urllib.error.HTTPError as e:
            print(f"HTTPError {e.code} for {en_name}. Waiting...")
            time.sleep(10)
            retries -= 1
        except Exception as e:
            print(f"Failed for {en_name}: {e}")
            out[hid] = {"name": en_name, "text": f"Error: {e}"}
            break

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/hero_texts.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("Done fetching hero texts via API")
