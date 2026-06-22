import json, os, glob
import re

def normalize_name(name):
    if not name: return ""
    # Remove spaces and common symbols
    name = re.sub(r'[\s\u3000・()（）]', '', name)
    return name

heroes_path = 'src/data/hok_heroes.json'
with open(heroes_path, 'r', encoding='utf-8') as f:
    heroes = json.load(f)

# Build matching dictionaries
cn_map = {normalize_name(h['nameCn']): h['id'] for h in heroes}
ja_map = {normalize_name(h.get('nameJa', '')): h['id'] for h in heroes}

extracted_files = glob.glob(r'C:\Users\81901\Desktop\screenshots\processed\hero_*_data.json')

unmatched = []
matched_count = 0

parsed_skills_dir = 'src/data/parsed_skills'
os.makedirs(parsed_skills_dir, exist_ok=True)

for fpath in extracted_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    raw_name = data.get('hero_name', '')
    if not raw_name: continue
    
    # Hero name in game is often "Kanji Furigana", e.g., "廉頗 れんぱ".
    # We can split by space and try both parts.
    parts = raw_name.split()
    if not parts: parts = [raw_name]
    
    matched_id = None
    for p in parts:
        norm = normalize_name(p)
        if norm in cn_map:
            matched_id = cn_map[norm]
            break
        if norm in ja_map:
            matched_id = ja_map[norm]
            break
            
    # Fallback to loose matching if exact fails
    if not matched_id:
        for p in parts:
            for cn_name, hid in cn_map.items():
                if p in cn_name or cn_name in p:
                    matched_id = hid
                    break
            if matched_id: break
            
            for ja_name, hid in ja_map.items():
                if not ja_name: continue
                if p in ja_name or ja_name in p:
                    matched_id = hid
                    break
            if matched_id: break
            
    if matched_id:
        # Update hok_heroes.json with official Japanese text
        for h in heroes:
            if h['id'] == matched_id:
                h['nameJaOfficial'] = raw_name
                h['titleJaOfficial'] = data.get('hero_title', '')
                h['roleJa'] = data.get('role', '')
                h['subRoleJa'] = data.get('sub_role', '')
                h['difficultyJa'] = data.get('difficulty', '')
                h['gameStats'] = data.get('stats', {})
                break
                
        # Save skills to parsed_skills
        skill_data = {
            "hero_id": matched_id,
            "passive": data.get('passive', {}),
            "skill1": data.get('skill1', {}),
            "skill2": data.get('skill2', {}),
            "skill3": data.get('skill3', {}),
            "status_text": data.get('status_text', '')
        }
        
        with open(os.path.join(parsed_skills_dir, f'champ_{matched_id}.json'), 'w', encoding='utf-8') as sf:
            json.dump(skill_data, sf, ensure_ascii=False, indent=2)
            
        matched_count += 1
    else:
        unmatched.append(raw_name)

# Save updated heroes
with open(heroes_path, 'w', encoding='utf-8') as f:
    json.dump(heroes, f, ensure_ascii=False, indent=2)

print(f"Matched: {matched_count}")
print(f"Unmatched ({len(unmatched)}): {unmatched}")
