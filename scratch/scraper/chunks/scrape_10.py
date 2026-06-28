import urllib.request
import gzip
import json
import re
import os

heroes = {
    "hero_109": "Heino",
    "hero_110": "Mayene",
    "hero_111": "Shao_Siyuan",
    "hero_112": "Butterfly",
    "hero_113": "Devara"
}

output_dir = "c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/texts"
os.makedirs(output_dir, exist_ok=True)

for hid, en_name in heroes.items():
    url = f"https://liquipedia.net/honorofkings/{en_name}"
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0',
        'Accept-Encoding': 'gzip'
    })
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.info().get('Content-Encoding') == 'gzip':
                content = gzip.decompress(response.read()).decode('utf-8')
            else:
                content = response.read().decode('utf-8')
                
            # extract text from paragraphs
            paragraphs = re.findall(r'<p>(.*?)</p>', content, re.DOTALL | re.IGNORECASE)
            
            # also extract li elements for strengths/weaknesses if they are in bullet points
            list_items = re.findall(r'<li>(.*?)</li>', content, re.DOTALL | re.IGNORECASE)
            
            # clean html tags
            def clean_html(raw_html):
                cleanr = re.compile('<.*?>')
                cleantext = re.sub(cleanr, '', raw_html)
                return cleantext
                
            text_chunks = [clean_html(p).strip() for p in paragraphs if clean_html(p).strip()]
            list_chunks = [clean_html(li).strip() for li in list_items if clean_html(li).strip()]
            
            full_text = "PARAGRAPHS:\n" + "\n".join(text_chunks) + "\n\nLIST ITEMS:\n" + "\n".join(list_chunks)
            
            with open(f"{output_dir}/{hid}.txt", "w", encoding="utf-8") as f:
                f.write(full_text)
            print(f"Scraped {en_name}")
    except Exception as e:
        print(f"Error scraping {en_name}: {e}")
