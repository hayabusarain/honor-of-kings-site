import urllib.request
import re

req = urllib.request.Request(
    'https://liquipedia.net/arenaofvalor/Ata',
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'src="([^"]*\.png)"', html, re.IGNORECASE)
        print('All PNGs:', [m for m in matches if 'Ata' in m])
        matches_jpg = re.findall(r'src="([^"]*\.jpg)"', html, re.IGNORECASE)
        print('All JPGs:', [m for m in matches_jpg if 'Ata' in m])
except Exception as e:
    print('Error:', e)
