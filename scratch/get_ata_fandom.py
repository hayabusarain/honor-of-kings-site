import urllib.request
import re

req = urllib.request.Request(
    'https://honorofkings.fandom.com/wiki/Ata',
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'src="([^"]*(?:ata|Zhu_Bajie)[^"]*\.png)"', html, re.IGNORECASE)
        print('Ata images:', [m for m in matches])
except Exception as e:
    print('Error:', e)
