import urllib.request
import re

req = urllib.request.Request('https://liquipedia.net/honorofkings/index.php?search=Shao+Siyuan', headers={'User-Agent': 'Mozilla/5.0'})
try:
    content = urllib.request.urlopen(req).read().decode('utf-8')
    def clean_html(raw_html):
        return re.sub(r'<.*?>', '', raw_html)
    paragraphs = re.findall(r'<p>(.*?)</p>', content, re.DOTALL | re.IGNORECASE)
    print("SEARCH RESULTS:", [clean_html(p).strip() for p in paragraphs if clean_html(p).strip()])
except Exception as e:
    print(e)
