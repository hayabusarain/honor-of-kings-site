import urllib.request
import re

req = urllib.request.Request(
    'https://liquipedia.net/arenaofvalor/Portal:Heroes',
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'src="([^"]*ata[^"]*)"', html, re.IGNORECASE)
        print('Ata icons:', matches)
except Exception as e:
    print('Error:', e)
