const fs = require('fs');

// 1. Fix CounterPickVoting.tsx
const cpPath = 'src/components/heroes/CounterPickVoting.tsx';
let cpCode = fs.readFileSync(cpPath, 'utf8');

// Replace DDragon img src in the main counters list
cpCode = cpCode.replace(
  /c\.isStatic \? score >= 0 : score > 0;\s*\}\)\.slice\(0, 5\)\.map\(c => \{/,
  `c.isStatic ? score >= 0 : score > 0;\n          }).slice(0, 5).map(c => {\n            const matchedHero = allHeros.find(h => (h.nameEn || h.hero_name_en) === c.hero_name_en);\n            const heroImageId = matchedHero?.id || c.hero_name_en;\n            const displayName = matchedHero ? (locale === 'ja' && matchedHero.nameJa ? matchedHero.nameJa : (matchedHero.nameEn || matchedHero.hero_name_en)) : c.hero_name_en;`
);

cpCode = cpCode.replace(
  /<img[\s\S]*?src={`https:\/\/ddragon\.leagueoflegends\.com[\s\S]*?`\}[\s\S]*?alt=\{c\.hero_name_en\}[\s\S]*?onError=[\s\S]*?\/>/,
  `<img src={\`/images/heroes/\${heroImageId}.jpg\`} alt={displayName} className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300" onError={(e) => { (e.target as HTMLImageElement).src = '/images/heroes/default.png'; }} />`
);

// Replace the span that shows the name
cpCode = cpCode.replace(
  /<span className="font-bold text-sm text-slate-800 capitalize">[\s\S]*?\{c\.hero_name_en\}[\s\S]*?<\/span>/,
  `<span className="font-bold text-sm text-slate-800 capitalize">\n                    {displayName}\n                  </span>`
);

// Also replace the img tag in the modal search results
cpCode = cpCode.replace(
  /<img[\s\S]*?src={`https:\/\/ddragon\.leagueoflegends\.com[\s\S]*?`\}[\s\S]*?alt=\{c\.nameEn\}[\s\S]*?\/>/,
  `<img src={\`/images/heroes/\${c.id || c.nameEn}.jpg\`} alt={c.nameEn} className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = '/images/heroes/default.png'; }} />`
);

// Make sure c.nameEn is robust during search
cpCode = cpCode.replace(
  /c\.nameEn\.toLowerCase\(\)/g,
  `(c.nameEn || c.hero_name_en || '').toLowerCase()`
);

fs.writeFileSync(cpPath, cpCode);

// 2. Fix heroes/[id]/page.tsx to pass hokHeroes
const pagePath = 'src/app/[locale]/heroes/[id]/page.tsx';
let pageCode = fs.readFileSync(pagePath, 'utf8');

if (!pageCode.includes(`import hokHeroes from '@/data/hok_heroes.json'`)) {
  pageCode = pageCode.replace(
    /import fallbackStats from '@\/data\/hero_stats\.json';/,
    `import fallbackStats from '@/data/hero_stats.json';\nimport hokHeroes from '@/data/hok_heroes.json';`
  );
}

pageCode = pageCode.replace(
  /<CounterPickVoting[\s\S]*?allHeros=\{fallbackStats\}/,
  `<CounterPickVoting \n          heroId={hero.hero_name_en || id} \n          staticCounters={staticCounters} \n          allHeros={hokHeroes}`
);

fs.writeFileSync(pagePath, pageCode);

console.log('Fixed CounterPickVoting crash and image loading!');
