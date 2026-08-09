import json
import re

form_name_map = {
    # 125
    "本体": "Self Form",
    "傀儡": "Puppet Form",
    # 171
    "通常": "Normal Form",
    "変身後": "Transformed Form",
    # 172 (Chicha / Meng Tian)
    "守護モード": "Guard Stance",
    "攻戦モード": "Battle Stance",
    "超殺モード": "Overkill Stance",
    # 183
    "勝利の叫び": "Empowered",
    # 502
    "人間モード": "Human Form",
    "トラモード": "Tiger Form",
    # 507
    "初期形態": "Base Form",
    "支配形態（光）": "Domination Form (Light)",
    "復讐形態（闇）": "Revenge Form (Dark)",
    # 522
    "スキル1強化:耀光・裂空斬": "Enhanced Skill 1",
    "スキル2強化:耀光・追星": "Enhanced Skill 2",
    "スキル3強化:耀光・帰塵": "Enhanced Skill 3",
    # 536
    "切り替え後": "Switched Form",
    # 538
    "共鳴・1スタック:堅意・戦止": "Enhanced Skill 1 (1 Stack)",
    "共鳴・2スタック:鋭意・破城": "Enhanced Skill 2 (2 Stacks)",
    "共鳴・3スタック:真意・燎原": "Enhanced Skill 3 (3 Stacks)",
    # 564
    "適当な型・その一": "Stance 1",
    "スキルコンボ1-1:弱い奴対策": "Combo 1-1",
    "スキルコンボ2-1:攻撃は最大の防御なり": "Combo 2-1",
    "適当な型・その二": "Stance 2",
    "スキルコンボ2-2:強い奴対策": "Combo 2-2",
    "スキルコンボ1-2:前進すなわち後退なり": "Combo 1-2"
}

def translate_table(table):
    if not table or not isinstance(table, dict):
        return table
    label_map = {
        "基本ダメージ": "Base Damage",
        "クールダウン": "Cooldown",
        "追加ダメージ": "Bonus Damage",
        "壁衝突時ダメージ": "Wall Impact Damage",
        "被ダメージ軽減割合": "Damage Reduction %",
        "HP回復": "HP Regen",
        "攻撃力": "Physical Attack",
        "魔力": "Magic Attack",
        "シールド": "Shield",
        "移動速度": "Movement Speed",
        "攻撃速度": "Attack Speed",
    }
    new_table = json.parse(json.dumps(table)) if hasattr(json, 'parse') else json.loads(json.dumps(table))
    if 'rows' in new_table:
        for r in new_table['rows']:
            if r and 'label' in r:
                r['label'] = label_map.get(r['label'], r['label'])
    return new_table

def main():
    ja_path = 'public/data/skills/ja.json'
    en_path = 'public/data/skills/en.json'

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    updated_count = 0

    for hid, ja_hero in ja_data.items():
        if not isinstance(ja_hero, dict):
            continue
        
        # Check if ja_hero has forms in any skill
        has_forms = False
        for sk in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            if sk in ja_hero and isinstance(ja_hero[sk], dict):
                if len(ja_hero[sk].get('forms', [])) > 0:
                    has_forms = True
                    break
        
        if not has_forms:
            continue
        
        en_hero = en_data.get(hid, {})
        if not isinstance(en_hero, dict):
            en_hero = {}
            en_data[hid] = en_hero

        # Reconstruct skills for this hero based on ja_hero structure
        for sk in ['passive', 'skill1', 'skill2', 'skill3', 'skill4']:
            ja_sk = ja_hero.get(sk)
            if not ja_sk:
                continue

            en_sk = en_hero.get(sk, {})
            ja_forms = ja_sk.get('forms', [])

            if ja_forms:
                # Skill has forms!
                new_forms = []
                for i, ja_f in enumerate(ja_forms):
                    ja_fname = ja_f.get('form_name', f"Form {i+1}")
                    en_fname = form_name_map.get(ja_fname, ja_fname)
                    
                    # See if en_sk already has matching form description or form
                    en_desc = ""
                    if 'forms' in en_sk and i < len(en_sk['forms']):
                        en_desc = en_sk['forms'][i].get('description', '')
                    elif 'description' in en_sk:
                        en_desc = en_sk['description']
                    
                    if not en_desc:
                        en_desc = ja_f.get('description', '')

                    form_obj = {
                        "form_name": en_fname,
                        "description": en_desc,
                        "table": translate_table(ja_f.get('table'))
                    }
                    new_forms.append(form_obj)

                # Assign back to en_sk
                sk_name = en_sk.get('name') or en_sk.get('skill_name') or ja_sk.get('name') or ja_sk.get('skill_name') or sk.capitalize()
                # Clean up Japanese text in sk_name
                sk_name = sk_name.replace('スキル1', 'Skill 1').replace('スキル2', 'Skill 2').replace('スキル3', 'Skill 3').replace('スキル4', 'Skill 4').replace('パッシブ', 'Passive')

                en_hero[sk] = {
                    "name": sk_name,
                    "description": new_forms[0]['description'] if new_forms else "",
                    "forms": new_forms
                }
                if 'table' in ja_sk:
                    en_hero[sk]['table'] = translate_table(ja_sk['table'])
            else:
                # Normal skill without forms
                if sk in en_hero:
                    # Clean up forms if en_hero incorrectly had forms dumped into it
                    if 'forms' in en_hero[sk] and len(ja_forms) == 0:
                        # Keep top level description
                        if not en_hero[sk].get('description') and len(en_hero[sk]['forms']) > 0:
                            en_hero[sk]['description'] = en_hero[sk]['forms'][0].get('description', '')
                        del en_hero[sk]['forms']
                else:
                    en_hero[sk] = {
                        "name": ja_sk.get('name', sk.capitalize()),
                        "description": ja_sk.get('description', ''),
                        "table": translate_table(ja_sk.get('table'))
                    }

        updated_count += 1
        print(f"Sync'd multi-form structure for Hero {hid} ({ja_hero.get('hero_name', '')})")

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully sync'd {updated_count} multi-form heroes to en.json!")

if __name__ == '__main__':
    main()
