import json
import re
import os

def main():
    en_path = 'public/data/skills/en.json'
    ja_path = 'public/data/skills/ja.json'

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    for hero_id, hero_en in en_data.items():
        if 'skills' not in hero_en or not isinstance(hero_en['skills'], list):
            continue
        
        flat_skills = hero_en['skills']
        grouped = {
            'passive': [],
            'skill1': [],
            'skill2': [],
            'skill3': [],
            'skill4': []
        }
        
        for skill in flat_skills:
            name = skill.get('skill_name', '').lower()
            if 'passive' in name:
                grouped['passive'].append(skill)
            elif 'skill 1' in name or 'skill1' in name:
                grouped['skill1'].append(skill)
            elif 'skill 2' in name or 'skill2' in name:
                grouped['skill2'].append(skill)
            elif 'skill 3' in name or 'skill3' in name:
                grouped['skill3'].append(skill)
            elif 'skill 4' in name or 'skill4' in name:
                grouped['skill4'].append(skill)
            else:
                # Fallback to passive if we can't figure it out? 
                # Should not happen based on OCR prompts, but just in case
                grouped['passive'].append(skill)
                
        # Now rebuild the hero_en
        ja_hero = ja_data.get(hero_id, {})
        
        for key in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            skills_in_group = grouped[key]
            if not skills_in_group:
                continue
            
            ja_skill = ja_hero.get(key, {})
            ja_forms = ja_skill.get('forms', [])
            
            if len(skills_in_group) == 1:
                hero_en[key] = skills_in_group[0]
                # Try to copy table from ja.json
                if 'table' in ja_skill:
                    hero_en[key]['table'] = ja_skill['table']
                elif len(ja_forms) > 0 and 'table' in ja_forms[0]:
                    hero_en[key]['table'] = ja_forms[0]['table']
            else:
                hero_en[key] = {
                    'name': skills_in_group[0].get('skill_name'),
                    'description': skills_in_group[0].get('description'),
                    'forms': []
                }
                for i, s in enumerate(skills_in_group):
                    form = dict(s)
                    # Try to copy form_name and table from ja.json
                    if i < len(ja_forms):
                        if 'form_name' in ja_forms[i]:
                            form['form_name'] = ja_forms[i]['form_name']
                        else:
                            form['form_name'] = f"Form {i+1}"
                            
                        if 'table' in ja_forms[i]:
                            form['table'] = ja_forms[i]['table']
                    else:
                        form['form_name'] = f"Form {i+1}"
                        # fallback table to main skill if missing in form but exists in root
                        if i == 0 and 'table' in ja_skill:
                            form['table'] = ja_skill['table']
                            
                    hero_en[key]['forms'].append(form)
                
                # Copy table to root of skill just in case
                if 'table' in ja_skill:
                    hero_en[key]['table'] = ja_skill['table']
                    
        # Remove the flat 'skills' array
        del hero_en['skills']

    # Backup original en.json just in case
    os.rename(en_path, en_path + '.bak')
    
    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully restructured en.json skills and merged tables for {len(en_data)} heroes.")

if __name__ == '__main__':
    main()
