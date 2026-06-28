import json

def extract():
    path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_1.json'
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    extracted = {}
    for hero_id, hero_data in data.items():
        if 'strategy' in hero_data:
            strat = hero_data['strategy']
            fields = ['earlyGame', 'midGame', 'lateGame', 'teamfight', 'commonMistakes']
            hero_extr = {}
            for field in fields:
                if field in strat:
                    hero_extr[field] = strat[field]
            if hero_extr:
                extracted[hero_id] = hero_extr
    
    with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/extracted.json', 'w', encoding='utf-8') as f:
        json.dump(extracted, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    extract()
