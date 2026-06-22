import urllib.request

url = 'https://liquipedia.net/commons/images/d/de/Ata_Child_of_the_Sea.png'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as res:
        print('Size:', len(res.read()))
        # Download it
        urllib.request.urlretrieve(url, 'public/images/heroes/hero_108.jpg')
        print('Downloaded Ata!')
except Exception as e:
    print('Error:', e)
