import json

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_7.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

extracted = {}
for k in data:
    strategy = data[k].get("strategy", {})
    extracted[k] = {sk: strategy.get(sk, "") for sk in ["earlyGame", "midGame", "lateGame", "teamfight", "commonMistakes"] if sk in strategy}

with open('c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/extracted_strategies.json', 'w', encoding='utf-8') as f:
    json.dump(extracted, f, ensure_ascii=False, indent=2)
