with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\scratch\remap_all.py", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace('"hero_051": "513", # Doria', '"hero_051": "159", # Doria')
c = c.replace('"hero_059": "113", # Chicha', '"hero_059": "172", # Chicha')
# Ensure Lapu Lapu and Fatih don't accidentally override valid heroes
# (They were mapped to 114 and 128, which overrides Liu Shan and Cao Cao! We must remove them!)
c = c.replace('"hero_056": "114", # Lapu Lapu', '"hero_056": "99991", # Lapu Lapu')
c = c.replace('"hero_029": "128", # Fatih', '"hero_029": "99992", # Fatih')

with open(r"c:\Users\81901\Desktop\オナーオブキングスサイト\scratch\remap_all.py", "w", encoding="utf-8") as f:
    f.write(c)
