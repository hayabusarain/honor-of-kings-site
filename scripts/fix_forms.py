import json

def fix_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for hero_id, hero in data.items():
        if not isinstance(hero, dict): continue
        for sk in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            s = hero.get(sk, {})
            if 'forms' in s and len(s['forms']) > 0:
                # Check if it's the Form 1 hallucination
                if s['forms'][0].get('form_name') in ['Form 1', '形態1', 'フォーム1']:
                    form0 = s['forms'][0]
                    
                    if 'table' in form0 and 'table' not in s:
                        s['table'] = form0['table']
                    elif 'visible_growth_table' in form0 and 'visible_growth_table' not in s:
                        s['visible_growth_table'] = form0['visible_growth_table']
                    elif 'visible_growth_tables' in form0 and 'visible_growth_tables' not in s:
                        s['visible_growth_tables'] = form0['visible_growth_tables']
                    
                    if 'tags' in form0 and 'tags' not in s:
                        s['tags'] = form0['tags']
                    
                    if 'cd' in form0 and 'cd' not in s:
                        s['cd'] = form0['cd']
                    
                    if 'mana_cost' in form0 and 'mana_cost' not in s:
                        s['mana_cost'] = form0['mana_cost']
                    
                    # delete the forms array
                    del s['forms']

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Fixed {filepath}")

fix_json('public/data/skills/en.json')
fix_json('public/data/skills/ja.json')
