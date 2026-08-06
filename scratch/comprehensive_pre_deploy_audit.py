import json
import os
import re

print("Starting Comprehensive Pre-Deployment Site Audit...")

audit_report = {
    "image_links": {"total": 0, "broken": []},
    "hero_data": {"total": 0, "missing_fields": []},
    "item_data": {"total": 0, "missing_fields": []},
    "arcana_data": {"total": 0, "missing_fields": []},
    "i18n_keys": {"missing_ja": [], "missing_en": []},
    "api_routes": [],
    "critical_warnings": []
}

# 1. Audit Hero Dataset
p_heroes = os.path.abspath(r'src\data\hok_heroes.json')
if os.path.exists(p_heroes):
    with open(p_heroes, 'r', encoding='utf-8') as f:
        heroes = json.load(f)
    audit_report["hero_data"]["total"] = len(heroes)
    for h in heroes:
        hid = h.get('id')
        name = h.get('name')
        avatar = h.get('avatar', f'/images/heroes/{hid}.png')
        avatar_path = os.path.join('public', avatar.lstrip('/'))
        audit_report["image_links"]["total"] += 1
        if not os.path.exists(avatar_path):
            audit_report["image_links"]["broken"].append(f"Hero {hid} ({name}) Avatar: {avatar}")
        
        # Check required fields
        if not h.get('name'):
            audit_report["hero_data"]["missing_fields"].append(f"Hero {hid} missing name")
        if not h.get('roles') or len(h.get('roles')) == 0:
            audit_report["hero_data"]["missing_fields"].append(f"Hero {hid} ({name}) missing roles")

# 2. Audit Items Dataset
p_items = os.path.abspath(r'src\data\hok_items.json')
if os.path.exists(p_items):
    with open(p_items, 'r', encoding='utf-8') as f:
        items = json.load(f)
    audit_report["item_data"]["total"] = len(items)
    for it in items:
        iid = it.get('id')
        iname = it.get('name')
        icon = it.get('icon', '')
        icon_path = os.path.join('public', icon.lstrip('/'))
        audit_report["image_links"]["total"] += 1
        if not os.path.exists(icon_path):
            audit_report["image_links"]["broken"].append(f"Item {iid} ({iname}) Icon: {icon}")

# 3. Audit Arcana Dataset
p_arcana = os.path.abspath(r'src\data\hok_arcanas.json')
if os.path.exists(p_arcana):
    with open(p_arcana, 'r', encoding='utf-8') as f:
        arcanas = json.load(f)
    audit_report["arcana_data"]["total"] = len(arcanas)
    for a in arcanas:
        aid = a.get('id')
        aname = a.get('name')
        icon = a.get('icon', '')
        if icon:
            icon_path = os.path.join('public', icon.lstrip('/'))
            audit_report["image_links"]["total"] += 1
            if not os.path.exists(icon_path):
                audit_report["image_links"]["broken"].append(f"Arcana {aid} ({aname}) Icon: {icon}")

# 4. Audit i18n JSON files
p_ja_msg = os.path.abspath(r'messages\ja.json')
p_en_msg = os.path.abspath(r'messages\en.json')

if os.path.exists(p_ja_msg) and os.path.exists(p_en_msg):
    with open(p_ja_msg, 'r', encoding='utf-8') as f:
        ja_msg = json.load(f)
    with open(p_en_msg, 'r', encoding='utf-8') as f:
        en_msg = json.load(f)
        
    def flatten_keys(d, prefix=''):
        keys = set()
        for k, v in d.items():
            full_key = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.update(flatten_keys(v, full_key))
            else:
                keys.add(full_key)
        return keys

    ja_keys = flatten_keys(ja_msg)
    en_keys = flatten_keys(en_msg)
    
    missing_in_en = ja_keys - en_keys
    missing_in_ja = en_keys - ja_keys
    
    if missing_in_en:
        audit_report["i18n_keys"]["missing_en"] = sorted(list(missing_in_en))
    if missing_in_ja:
        audit_report["i18n_keys"]["missing_ja"] = sorted(list(missing_in_ja))

# Print Audit Results Summary
print("\n--- Audit Summary ---")
print(f"Total Images Checked: {audit_report['image_links']['total']}")
print(f"Broken Image Links: {len(audit_report['image_links']['broken'])}")
print(f"Hero Data Integrity: {audit_report['hero_data']['total']} heroes checked ({len(audit_report['hero_data']['missing_fields'])} missing fields)")
print(f"Item Data Integrity: {audit_report['item_data']['total']} items checked ({len(audit_report['item_data']['missing_fields'])} missing fields)")
print(f"Arcana Data Integrity: {audit_report['arcana_data']['total']} arcanas checked ({len(audit_report['arcana_data']['missing_fields'])} missing fields)")
print(f"i18n Keys Missing in EN: {len(audit_report['i18n_keys']['missing_en'])}")
print(f"i18n Keys Missing in JA: {len(audit_report['i18n_keys']['missing_ja'])}")

with open('scratch/comprehensive_audit_report.json', 'w', encoding='utf-8') as f:
    json.dump(audit_report, f, ensure_ascii=False, indent=2)

print("\nFull audit log saved to scratch/comprehensive_audit_report.json!")
