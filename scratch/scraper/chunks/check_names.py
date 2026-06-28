import urllib.request
import urllib.error
import gzip
import json

names = {
    "hero_061": ["Consort_Yu"],
    "hero_062": ["Zhong_Kui"],
    "hero_063": ["Yang_Yuhuan"],
    "hero_064": ["Cang"],
    "hero_065": ["Yang_Jian"],
    "hero_066": ["Nuwa"],
    "hero_067": ["Nezha"],
    "hero_068": ["Gan_%26_Mo", "Gan_and_Mo", "Gan_Jiang_Mo_Ye", "Gan_Jiang_and_Mo_Ye"],
    "hero_069": ["Athena"],
    "hero_070": ["Cai_Yan"],
    "hero_071": ["Donghuang"],
    "hero_072": ["Guiguzi"]
}

def fetch(name):
    req = urllib.request.Request(
        f"https://liquipedia.net/honorofkings/{name}",
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept-Encoding": "gzip"
        }
    )
    try:
        with urllib.request.urlopen(req) as response:
            if response.info().get('Content-Encoding') == 'gzip':
                content = gzip.decompress(response.read())
            else:
                content = response.read()
            return True
    except urllib.error.HTTPError as e:
        return False

for hid, options in names.items():
    found = False
    for opt in options:
        if fetch(opt):
            print(f"{hid}: {opt} SUCCESS")
            found = True
            break
    if not found:
        print(f"{hid}: FAILED for all options")
