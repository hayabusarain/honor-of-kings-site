import os
import re

out_dir = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/pages'
output = []

for h_id in sorted(os.listdir(out_dir)):
    if not h_id.endswith('.txt'): continue
    with open(f"{out_dir}/{h_id}", "r", encoding="utf-8") as f:
        text = f.read()
    
    # We just extract sentences containing keywords
    keywords = ["early", "mid", "late", "team", "fight", "mistake", "strength", "weakness", "pro", "con", "game"]
    sentences = re.split(r'(?<=[.!?]) +', text)
    
    useful = []
    for s in sentences:
        if any(k.lower() in s.lower() for k in keywords):
            useful.append(s)
            
    summary = ' '.join(useful)[:2000] # take up to 2000 chars of useful sentences
    output.append(f"--- {h_id} ---\n{summary}\n")

with open("c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/scraper/chunks/summary_for_model.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(output))

print("Summarized.")
