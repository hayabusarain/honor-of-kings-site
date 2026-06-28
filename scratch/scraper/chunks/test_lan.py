import urllib.request
import urllib.error
import gzip
import re

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    return re.sub(r'\s+', ' ', cleantext).strip()

def scrape(name):
    url = f"https://liquipedia.net/honorofkings/{name}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0',
        'Accept-Encoding': 'gzip'
    })
    try:
        res = urllib.request.urlopen(req)
        content = gzip.decompress(res.read()).decode('utf-8') if res.info().get('Content-Encoding') == 'gzip' else res.read().decode('utf-8')
        start = content.find('mw-content-text')
        end = content.find('printfooter')
        if start != -1 and end != -1:
            content = content[start:end]
        text = clean_html(content)
        print(f"Scraped {name} successfully: {text[:200]}")
        return text
    except Exception as e:
        print(f"Failed {name}: {e}")
        return None

t1 = scrape("Lan_(hero)")
t2 = scrape("Lan_(Honor_of_Kings)")
t3 = scrape("Lan_(character)")
t4 = scrape("Lan_An")
