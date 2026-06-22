import re

guide_path = r"c:\Users\81901\Desktop\オナーオブキングスサイト\src\app\[locale]\guide\page.tsx"
with open(guide_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("champId: 'keke'", "champId: 'ake'")

with open(guide_path, "w", encoding="utf-8") as f:
    f.write(content)
