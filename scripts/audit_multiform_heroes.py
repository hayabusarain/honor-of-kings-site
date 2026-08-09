import json, re

def main():
    with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    with open('src/data/hok_heroes.json', 'r', encoding='utf-8') as f:
        hok_heroes = json.load(f)

    hero_id_to_name = {str(h['id']): f"{h.get('name', '')} ({h.get('name_en', '')})" for h in hok_heroes}

    jp_regex = re.compile(r'[\u3040-\u30ff\u4e00-\u9faf]')

    print("=== ALL MULTI-FORM HEROES IN JA ===")
    ja_multiform_heroes = []
    for h_id, data in ja_data.items():
        if not isinstance(data, dict): continue
        has_forms = False
        skills_with_forms = []
        for k, v in data.items():
            if isinstance(v, dict) and 'forms' in v and len(v['forms']) > 1:
                has_forms = True
                form_names = [f.get('form_name') for f in v['forms']]
                skills_with_forms.append((k, v.get('name'), form_names))
        if has_forms:
            h_name = hero_id_to_name.get(h_id, h_id)
            ja_multiform_heroes.append((h_id, h_name, skills_with_forms))
            print(f"Hero {h_id} [{h_name}]: {[s[0] for s in skills_with_forms]}")

    print("\n=== CHECKING EN MATCHING FOR THESE HEROES ===")
    for h_id, h_name, ja_skills in ja_multiform_heroes:
        en_hero = en_data.get(h_id, {})
        issues = []
        for sk_key, ja_sk_name, ja_form_names in ja_skills:
            en_sk = en_hero.get(sk_key, {})
            en_forms = en_sk.get('forms', [])
            if not en_forms:
                issues.append(f"{sk_key} missing forms in EN")
            elif len(en_forms) != len(ja_form_names):
                issues.append(f"{sk_key} form count mismatch: JA={len(ja_form_names)} vs EN={len(en_forms)}")
            else:
                for idx, ef in enumerate(en_forms):
                    fname = ef.get('form_name', '')
                    sname = ef.get('skill_name', '')
                    fdesc = ef.get('description', '')
                    if jp_regex.search(fname) or jp_regex.search(sname) or jp_regex.search(fdesc):
                        issues.append(f"{sk_key}.forms[{idx}] has Japanese text")
        
        if issues:
            print(f"NEED FIX - Hero {h_id} [{h_name}]: {issues}")
        else:
            print(f"OK - Hero {h_id} [{h_name}]")

if __name__ == '__main__':
    main()
