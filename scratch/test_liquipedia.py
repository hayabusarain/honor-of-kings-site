import urllib.request
import json

url = "https://liquipedia.net/honorofkings/api.php?action=query&meta=siteinfo&format=json"

headers = {
    'User-Agent': 'HonorOfKingsStrategyBot/1.0 (contact: bot@example.com) Python-urllib/3.x',
    'Accept': 'application/json'
}

try:
    req = urllib.request.Request(url, headers=headers)
    response = urllib.request.urlopen(req)
    content = response.read()
    data = json.loads(content.decode('utf-8'))
    print(f"SUCCESS: Liquipedia API - Site Name: {data['query']['general']['sitename']}")
except Exception as e:
    print(f"ERROR: {url} - {e}")
