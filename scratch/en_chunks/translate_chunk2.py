import json

input_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_2.json'
output_path = 'c:/Users/81901/Desktop/オナーオブキングスサイト/scratch/en_chunks/en_chunk_2_done.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for hero_id, hero_data in data.items():
    if 'strategy' in hero_data:
        strat = hero_data['strategy']
        
        if 'earlyGame' in strat and '序盤はパッシブ' in strat['earlyGame']:
            strat['earlyGame'] = "In the early game, take advantage of the high healing effect from your passive (healing does not decay against minions) to gain an advantage in lane sustain. Actively attack minions to stack your \"Sentient Power\" gauge, and look for openings to trade damage with your enhanced basic attacks and skills to seize control of the lane."
        
        if 'midGame' in strat and '中盤は高い機動力' in strat['midGame']:
            strat['midGame'] = "In the mid game, utilize your high mobility and self-healing to simultaneously push side lanes and farm the jungle. When small skirmishes occur, arrive with your passive gauge already stacked, and use the \"Skill 1 -> Enhanced Basic Attack\" combo to quickly close the gap to the enemy backline and deal burst damage."
            
        if 'lateGame' in strat and '終盤の集団戦' in strat['lateGame']:
            strat['lateGame'] = "In late game teamfights, engaging head-on is dangerous due to the enemy's high damage output. After allied tanks have drawn the enemy's attention, activate your Ultimate (Millennium Echo) to ignore terrain and ambush the enemy backline (Marksmen and Mages), aiming for secure kills while disrupting their formation."
            
        if 'teamfight' in strat and 'アルティメット発動中' in strat['teamfight']:
            strat['teamfight'] = "The key to teamfights is how well you utilize the \"Lightning Body\" state during your Ultimate. It is powerful to invade deep into the enemy formation using the Iron Body and damage reduction provided while floating, dealing damage to multiple enemies with your ranged basic attacks that have a Chain Bolt effect, all while surviving with your self-shields."
            
        if 'commonMistakes' in strat and '初心者がやりがちな' in strat['commonMistakes']:
            strat['commonMistakes'] = "A common mistake for beginners is charging into the enemy formation with the passive gauge (Sentient Power) completely empty, failing to unleash enhanced attacks and getting counter-killed due to a lack of damage. Additionally, since this hero plays similarly to an Assassin, avoid charging straight into heavy enemy crowd control (CC) where you will be burst down by focused fire."

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Translation applied and saved.")
