import urllib.request

urls = [
    'https://www.honorofkings.com/pdir/images/global_en/hero/ata.png',
    'https://www.honorofkings.com/pdir/images/global_en/hero/Ata.png',
    'https://www.honorofkings.com/pdir/images/global_en/hero/108.png',
    'https://gcp.pbzimg.com/v3/minigame/Camp_H5_240618/src/assets/images/heroes/108.png',
    'https://gcp.pbzimg.com/v3/minigame/Camp_H5_240618/src/assets/images/heroes/Ata.png',
    'https://gcp.pbzimg.com/v3/minigame/Camp_H5_240618/src/assets/images/heroes/108.jpg',
    'https://img.hokstats.gg/heroes/108.jpg',
    'https://img.hokstats.gg/heroes/Ata.jpg',
    'https://img.hokstats.gg/heroes/ata.png'
]

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        urllib.request.urlopen(req)
        print('SUCCESS:', url)
    except Exception as e:
        pass
