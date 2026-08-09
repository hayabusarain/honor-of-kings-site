import json

def main():
    with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
        ja = json.load(f)

    with open('public/data/skills/en.json', 'r', encoding='utf-8') as f:
        en = json.load(f)

    targets = ['154', '140', '171', '502', '507', '183']

    for h_id in targets:
        j_h = ja.get(h_id, {})
        e_h = en.get(h_id, {})
        print(f"\n==================== HERO {h_id} ====================")
        print(f"JA Name: {j_h.get('hero_name')} | EN Name: {e_h.get('hero_name')}")
        
        for k in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            j_sk = j_h.get(k, {})
            e_sk = e_h.get(k, {})
            print(f"\n--- {k} ---")
            print(f"  JA name: {j_sk.get('name')} | forms: {[f.get('form_name') for f in j_sk.get('forms', [])]}")
            print(f"  EN name: {e_sk.get('name')} | forms: {[f.get('form_name') for f in e_sk.get('forms', [])]}")

if __name__ == '__main__':
    main()
