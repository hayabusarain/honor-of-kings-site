import urllib.request
import gzip
import json

req = urllib.request.Request(
    'https://liquipedia.net/honorofkings/Portal:Heroes',
    headers={
        'User-Agent': 'Mozilla/5.0',
        'Accept-Encoding': 'gzip'
    }
)

with urllib.request.urlopen(req) as response:
    if response.info().get('Content-Encoding') == 'gzip':
        html = gzip.decompress(response.read()).decode('utf-8')
    else:
        html = response.read().decode('utf-8')

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/heroes_list.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Done")
