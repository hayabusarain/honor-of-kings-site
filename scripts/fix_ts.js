const fs = require('fs');

// Fix PatchTable.tsx
let f = 'src/components/patches/PatchTable.tsx';
if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/const meta =/g, 'const meta: any =');
    c = c.replace(/hero\.name_en \|\| hero\.name/g, 'hero.name_en || hero.name || ""');
    c = c.replace(/\(hero\.name\)/g, '(hero.name || "")');
    c = c.replace(/hero\.name_en/g, '(hero.name_en || "")');
    fs.writeFileSync(f, c);
}

// Fix PwaInstallBanner.tsx
f = 'src/components/pwa/PwaInstallBanner.tsx';
if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace('isIos()', '(/iPad|iPhone|iPod/.test(navigator.userAgent))');
    fs.writeFileSync(f, c);
}

// Fix GlobalSearchModal.tsx
f = 'src/components/search/GlobalSearchModal.tsx';
if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/h\.name\.toLowerCase/g, 'String(h.name).toLowerCase');
    c = c.replace(/h\.name_en\?\.toLowerCase/g, 'String(h.name_en || "").toLowerCase');
    c = c.replace(/h\.nameEn\?\.toLowerCase/g, 'String(h.nameEn || "").toLowerCase');
    c = c.replace(/h\.nameJa\?\.toLowerCase/g, 'String(h.nameJa || "").toLowerCase');
    c = c.replace(/t\.toLowerCase/g, 'String(t).toLowerCase');
    c = c.replace(/h\.aliases\?\.join/g, 'String(h.aliases || "").join');
    c = c.replace(/as Record<string, string>\[\]/g, 'as any');
    fs.writeFileSync(f, c);
}

console.log('Done!');
