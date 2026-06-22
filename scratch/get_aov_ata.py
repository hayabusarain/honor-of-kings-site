import urllib.request
import re

req = urllib.request.Request(
    'https://liquipedia.net/arenaofvalor/Ata',
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'src="([^"]*ata[^"]*png)"', html, re.IGNORECASE)
        print('Matches:', matches)
except Exception as e:
    print('Error:', e)
