import json
import urllib.request
import urllib.parse

names = ["張良", "不知火舞", "ドリア", "ナコルル", "橘右京", "アーサー", "孫悟空", "ラプール", "劉備", "張飛", "チーシャ", "李元芳"]

def search(name):
    # try searching liquipedia API
    url = f"https://liquipedia.net/honorofkings/api.php?action=query&list=search&srsearch={urllib.parse.quote(name)}&utf8=&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            return [x['title'] for x in res['query']['search']]
    except Exception as e:
        return []

out = {}
for n in names:
    out[n] = search(n)

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/search_names.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("Done")
