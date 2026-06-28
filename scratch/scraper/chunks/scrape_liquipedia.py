import urllib.request
import urllib.error
import gzip
import json
import re

heroes = {
    "hero_097": "Meng_Ya",
    "hero_098": "Lan",
    "hero_099": "Jing",
    "hero_100": "Agudo",
    "hero_101": "Sangqi", # Or Sakeer? Will check redirects
    "hero_102": "Charlotte",
    "hero_103": "Yunying",
    "hero_104": "Feyd",
    "hero_105": "Alessio",
    "hero_106": "Luara",
    "hero_107": "Ata",
    "hero_108": "Umbrosa"
}

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    return re.sub(r'\s+', ' ', cleantext).strip()

results = {}

for hid, en_name in heroes.items():
    url = f"https://liquipedia.net/honorofkings/{en_name}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Encoding': 'gzip'
    })
    try:
        response = urllib.request.urlopen(req)
        if response.info().get('Content-Encoding') == 'gzip':
            content = gzip.decompress(response.read()).decode('utf-8')
        else:
            content = response.read().decode('utf-8')
        
        # Extract main content
        start = content.find('mw-content-text')
        end = content.find('printfooter')
        if start != -1 and end != -1:
            content = content[start:end]
        
        text = clean_html(content)
        # truncate to first 3000 chars to avoid massive output
        results[hid] = {'name': en_name, 'text': text[:4000]}
        print(f"Scraped {en_name}")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            # Try alternative names
            if en_name == "Sangqi":
                alt = "Sakeer"
            elif en_name == "Yunying":
                alt = "Yun_Ying"
            elif en_name == "Feyd":
                alt = "Heino" # wait, Feyd is Feyd, maybe try Fei?
            elif en_name == "Umbrosa":
                alt = "Ying"
            else:
                alt = None
                
            if alt:
                url = f"https://liquipedia.net/honorofkings/{alt}"
                req = urllib.request.Request(url, headers={
                    'User-Agent': 'Mozilla/5.0',
                    'Accept-Encoding': 'gzip'
                })
                try:
                    res = urllib.request.urlopen(req)
                    if res.info().get('Content-Encoding') == 'gzip':
                        content = gzip.decompress(res.read()).decode('utf-8')
                    else:
                        content = res.read().decode('utf-8')
                    start = content.find('mw-content-text')
                    end = content.find('printfooter')
                    if start != -1 and end != -1:
                        content = content[start:end]
                    text = clean_html(content)
                    results[hid] = {'name': alt, 'text': text[:4000]}
                    print(f"Scraped {alt}")
                except Exception as e2:
                    print(f"Failed {en_name} and {alt}: {e2}")
            else:
                print(f"Failed {en_name}: {e}")
        else:
            print(f"Error {en_name}: {e}")

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/scraped_9.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Done saving to scraped_9.json")
