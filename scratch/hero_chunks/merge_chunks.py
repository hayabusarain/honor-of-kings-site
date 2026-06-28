import json
import os

ja_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/ja.json'
en_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/public/data/skills/en.json'
chunk_dir = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/hero_chunks'

# Load original
with open(ja_path, 'r', encoding='utf-8') as f:
    ja_data = json.load(f)

with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

for i in range(1, 11):
    chunk_file = os.path.join(chunk_dir, f'chunk_{i}_done.json')
    if os.path.exists(chunk_file):
        with open(chunk_file, 'r', encoding='utf-8') as f:
            chunk_data = json.load(f)
            
        for hero_key, hero_val in chunk_data.items():
            if hero_key in ja_data:
                # Replace strategy entirely
                if 'strategy' in hero_val:
                    ja_data[hero_key]['strategy'] = hero_val['strategy']
                    
            if hero_key in en_data:
                if 'strategy' in en_data[hero_key]:
                    # Update English data as well (it will be Japanese for now, but better than having 'playstyle' break the UI)
                    en_strategy = en_data[hero_key]['strategy']
                    if 'playstyle' in en_strategy:
                        del en_strategy['playstyle']
                    
                    new_strat = hero_val.get('strategy', {})
                    if 'earlyGame' in new_strat:
                        en_strategy['earlyGame'] = new_strat['earlyGame']
                        en_strategy['midGame'] = new_strat['midGame']
                        en_strategy['lateGame'] = new_strat['lateGame']
                        en_strategy['teamfight'] = new_strat['teamfight']
                        en_strategy['commonMistakes'] = new_strat['commonMistakes']

# Save backups just in case
import shutil
shutil.copyfile(ja_path, ja_path + '.bak')
shutil.copyfile(en_path, en_path + '.bak')

with open(ja_path, 'w', encoding='utf-8') as f:
    json.dump(ja_data, f, ensure_ascii=False, indent=2)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print("Merged all available done chunks into ja.json and en.json successfully.")
