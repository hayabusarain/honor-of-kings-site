import urllib.request
import gzip
import re

url = "https://liquipedia.net/honorofkings/Portal:Heroes"
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Encoding': 'gzip'
    }
)
with urllib.request.urlopen(req) as response:
    if response.info().get('Content-Encoding') == 'gzip':
        html = gzip.decompress(response.read()).decode('utf-8')
    else:
        html = response.read().decode('utf-8')

# Find all hrefs inside mw-parser-output
matches = re.findall(r'href="/honorofkings/([^"]+)" title="([^"]+)"', html)
for match in set(matches):
    print(match[0])
