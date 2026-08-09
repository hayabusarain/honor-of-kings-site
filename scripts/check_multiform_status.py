import json

def main():
    with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
        ja = json.load(f)

    with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)

    hero_ids = ['154', '519', '191', '182', '153', '531', '171', '507', '502', '183']

    for h_id in hero_ids:
        j_h = ja.get(h_id, {})
        e_h = en.get(h_id, {})
        print(f"\n=== HERO {h_id} (JA: {j_h.get('hero_name', '')} / EN: {e_h.get('hero_name', '')}) ===")
        for k in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            if k in j_h:
                ja_forms = [f.get('form_name') for f in j_h[k].get('forms', [])]
                print(f"  JA {k}: forms={ja_forms}")
            if k in e_h:
                en_forms = [f.get('form_name') for f in e_h[k].get('forms', [])]
                print(f"  EN {k}: forms={en_forms}")

if __name__ == '__main__':
    main()
