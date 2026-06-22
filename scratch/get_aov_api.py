import urllib.request
import json

req = urllib.request.Request(
    'https://liquipedia.net/arenaofvalor/api.php?action=query&titles=Ata&prop=images&format=json',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print(html)
except Exception as e:
    print('Error:', e)
