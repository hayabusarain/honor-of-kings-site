import urllib.request
import urllib.parse
import json

heroes = {
    "hero_003": "Hou_Yi"
}

for hid, name in heroes.items():
    url = f"https://liquipedia.net/honorofkings/api.php?action=parse&page={urllib.parse.quote(name)}&format=json&prop=text"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            print("Success for", name)
    except Exception as e:
        print(e)
