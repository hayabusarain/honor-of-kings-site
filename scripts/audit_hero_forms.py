import json

def check_forms():
    with open('public/data/skills/ja.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for h_id, h_obj in data.items():
        for sk in ['skill1', 'skill2', 'skill3', 'passive']:
            if sk in h_obj and 'forms' in h_obj[sk]:
                forms = h_obj[sk]['forms']
                if len(forms) > 1:
                    desc_0 = forms[0].get('description', '')
                    desc_1 = forms[1].get('description', '')
                    if desc_0 == desc_1:
                        print(f"Hero {h_id} {sk} has IDENTICAL descriptions in forms! {forms[0]['name']} vs {forms[1]['name']}")
                    else:
                        print(f"Hero {h_id} {sk} forms are DIFFERENT. OK.")

if __name__ == '__main__':
    check_forms()
