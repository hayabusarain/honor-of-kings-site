import json, re

def clean_en_json():
    with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    def fix_str(s):
        if not isinstance(s, str):
            return s
        s = s.replace('スキル1', 'Skill 1').replace('スキル１', 'Skill 1')
        s = s.replace('スキル2', 'Skill 2').replace('スキル２', 'Skill 2')
        s = s.replace('スキル3', 'Skill 3').replace('スキル３', 'Skill 3')
        s = s.replace('スキル4', 'Skill 4').replace('スキル４', 'Skill 4')
        s = s.replace('パッシブ', 'Passive')
        return s

    for h_id, h in en_data.items():
        meta = h.get('meta', {})
        if 'official_skill_priority' in meta and isinstance(meta['official_skill_priority'], dict):
            pri = meta['official_skill_priority']
            if 'primary' in pri:
                pri['primary'] = fix_str(pri['primary'])
            if 'secondary' in pri:
                pri['secondary'] = fix_str(pri['secondary'])
        
        for k in ['max_skill_1', 'max_skill_2']:
            if k in meta:
                meta[k] = fix_str(meta[k])
                
        for sk_key in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            sk = h.get(sk_key, {})
            if isinstance(sk, dict):
                if 'name' in sk:
                    sk['name'] = fix_str(sk['name'])
                if 'skill_name' in sk:
                    sk['skill_name'] = fix_str(sk['skill_name'])
                if 'forms' in sk and isinstance(sk['forms'], list):
                    for form in sk['forms']:
                        if isinstance(form, dict):
                            if 'name' in form:
                                form['name'] = fix_str(form['name'])
                            if 'skill_name' in form:
                                form['skill_name'] = fix_str(form['skill_name'])

    with open('public/data/skills/en.json', 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print('Cleaned en.json skill priority strings successfully.')

if __name__ == '__main__':
    clean_en_json()
