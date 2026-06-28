import urllib.request
import re
import json
import os

req = urllib.request.Request('https://liquipedia.net/honorofkings/Portal:Heroes', headers={'User-Agent': 'Mozilla/5.0'})
try:
    content = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'href=["\'](/honorofkings/[^"\']*)["\'][^>]*>Shao Siyuan', content, re.IGNORECASE)
    print("Shao Siyuan URLs found:", matches)
except Exception as e:
    print(e)
