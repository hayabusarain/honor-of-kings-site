import os

# Fix builds/page.tsx
f = 'src/app/[locale]/heroes/[id]/builds/page.tsx'
if os.path.exists(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('id={id}', '')
    content = content.replace('stats: never[]', 'stats: any')
    content = content.replace('const matchedItems =', 'const matchedItems: any =')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# Fix HeroDetailClient.tsx
f = 'src/components/heroes/HeroDetailClient.tsx'
if os.path.exists(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('null as Record<string, any>', 'null as any')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# Fix AppBar.tsx
f = 'src/components/mobile/AppBar.tsx'
if os.path.exists(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('<Search size={24} className="text-slate-400" />', '<Search size={24} />')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# Fix PatchTable.tsx
f = 'src/components/patches/PatchTable.tsx'
if os.path.exists(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('(hero.name_en || hero.name)', '(hero.name_en || hero.name || "")')
    content = content.replace('(hero.name)', '(hero.name || "")')
    content = content.replace('hero.name_en', '(hero.name_en || "")')
    content = content.replace('const meta =', 'const meta: any =')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# Fix PwaInstallBanner.tsx
f = 'src/components/pwa/PwaInstallBanner.tsx'
if os.path.exists(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('setDeferredPrompt(e)', 'setDeferredPrompt(e as any)')
    content = content.replace('isIos()', '(/iPad|iPhone|iPod/.test(navigator.userAgent))')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

# Fix GlobalSearchModal.tsx
f = 'src/components/search/GlobalSearchModal.tsx'
if os.path.exists(f):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace('h.name.toLowerCase()', 'String(h.name).toLowerCase()')
    content = content.replace('h.name_en?.toLowerCase()', 'String(h.name_en || "").toLowerCase()')
    content = content.replace('h.nameEn?.toLowerCase()', 'String(h.nameEn || "").toLowerCase()')
    content = content.replace('h.nameJa?.toLowerCase()', 'String(h.nameJa || "").toLowerCase()')
    content = content.replace('t.toLowerCase()', 'String(t).toLowerCase()')
    content = content.replace('h.aliases?.join', 'String(h.aliases || "").join')
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print('Applied fixes!')
