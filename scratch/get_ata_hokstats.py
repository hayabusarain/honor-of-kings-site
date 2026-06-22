import urllib.request
import re

req = urllib.request.Request(
    'https://hokstats.gg/heroes',
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'src="([^"]*(?i:ata)[^"]*png)"', html, re.IGNORECASE)
        print('Ata icons:', matches)
        # Also check for webp or jpg
        matches_webp = re.findall(r'src="([^"]*(?i:ata)[^"]*webp)"', html, re.IGNORECASE)
        print('Ata webp:', matches_webp)
except Exception as e:
    print('Error:', e)
