import urllib.request

urls = [
    'https://static.wikia.nocookie.net/honorofkings/images/c/c8/Ata.png',
    'https://static.wikia.nocookie.net/arenaofvalor_gamepedia_en/images/e/ea/Ata.png',
    'https://img.utdstc.com/icon/829/c09/829c09c58514cc62a12d1b11b514d4eb89e6eb1f32a5ff50b8686d1a92e1069b:200'
]

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        urllib.request.urlopen(req)
        print('SUCCESS:', url)
    except Exception as e:
        print('FAIL:', url, e)
