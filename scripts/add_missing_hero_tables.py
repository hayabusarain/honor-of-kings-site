import json

def main():
    ja_path = 'public/data/skills/ja.json'
    en_path = 'public/data/skills/en.json'

    with open(ja_path, 'r', encoding='utf-8') as f:
        ja_data = json.load(f)

    with open(en_path, 'r', encoding='utf-8') as f:
        en_data = json.load(f)

    # 1. Zhang Fei (171) Tables
    zhangfei_tables = {
        "skill1": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
            "rows": [
                { "label": "Base Damage", "values": ["600", "720", "840", "960", "1,080", "1,200"] },
                { "label": "Cooldown", "values": ["6", "5.8", "5.6", "5.4", "5.2", "5"] }
            ]
        },
        "skill2": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
            "rows": [
                { "label": "Damage Immunity", "values": ["650", "775", "900", "1,025", "1,150", "1,275"] },
                { "label": "Cooldown", "values": ["10", "9.6", "9.2", "8.8", "8.4", "8"] }
            ]
        },
        "skill3": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
            "rows": [
                { "label": "Enhanced BA", "values": ["220", "330", "440"] },
                { "label": "Base Damage", "values": ["600", "900", "1,200"] }
            ]
        }
    }

    # 2. Charlotte (536) Tables
    charlotte_tables = {
        "skill1": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
            "rows": [
                { "label": "Base Damage", "values": ["150", "180", "210", "240", "270", "300"] },
                { "label": "Cooldown", "values": ["8", "7.6", "7.2", "6.8", "6.4", "6"] }
            ]
        },
        "skill2": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
            "rows": [
                { "label": "Base Damage", "values": ["100", "120", "140", "160", "180", "200"] },
                { "label": "Cooldown", "values": ["6", "5.7", "5.4", "5.1", "4.8", "4.5"] }
            ]
        },
        "skill3": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
            "rows": [
                { "label": "Base Damage", "values": ["150", "250", "350"] },
                { "label": "Cooldown", "values": ["18", "15", "12"] }
            ]
        }
    }

    # 3. Mayene (564) Tables
    mayene_tables = {
        "skill1": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
            "rows": [
                { "label": "Base Damage", "values": ["200", "240", "280", "320", "360", "400"] },
                { "label": "Cooldown", "values": ["8", "7.6", "7.2", "6.8", "6.4", "6"] }
            ]
        },
        "skill2": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3", "Lvl 4", "Lvl 5", "Lvl 6"],
            "rows": [
                { "label": "Base Damage", "values": ["180", "216", "252", "288", "324", "360"] },
                { "label": "Cooldown", "values": ["8", "7.6", "7.2", "6.8", "6.4", "6"] }
            ]
        },
        "skill3": {
            "headers": ["Lvl 1", "Lvl 2", "Lvl 3"],
            "rows": [
                { "label": "Base Damage", "values": ["300", "450", "600"] },
                { "label": "Cooldown", "values": ["18", "15", "12"] }
            ]
        }
    }

    # Apply to EN & JA data
    updates = [
        ('171', zhangfei_tables),
        ('536', charlotte_tables),
        ('564', mayene_tables)
    ]

    for h_id, tables in updates:
        for dataset in [ja_data, en_data]:
            if h_id in dataset:
                h_obj = dataset[h_id]
                for sk_key, tbl in tables.items():
                    if sk_key in h_obj:
                        h_obj[sk_key]['table'] = tbl
                        if 'forms' in h_obj[sk_key]:
                            for form in h_obj[sk_key]['forms']:
                                if 'table' not in form or not form['table']:
                                    form['table'] = tbl

    with open(ja_path, 'w', encoding='utf-8') as f:
        json.dump(ja_data, f, ensure_ascii=False, indent=2)

    with open(en_path, 'w', encoding='utf-8') as f:
        json.dump(en_data, f, ensure_ascii=False, indent=2)

    print("Successfully populated missing damage growth tables for 171 (Zhang Fei), 536 (Charlotte), and 564 (Mayene)!")

if __name__ == '__main__':
    main()
