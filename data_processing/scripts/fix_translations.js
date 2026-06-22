const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`No changes made to ${filePath}`);
  }
}

// 1. Fix guide/page.tsx
const guidePath = 'src/app/[locale]/guide/page.tsx';
replaceInFile(guidePath, [
  {
    search: '基礎知識・総合ガイド',
    replace: "{locale === 'en' ? 'Comprehensive Guide' : '基礎知識・総合ガイド'}"
  },
  {
    search: 'Honor of Kings の初心者から上級者へのステップアップに必要な「マクロ戦略」「設定」「用語」をすべて網羅した総合ドキュメントです。',
    replace: "{locale === 'en' ? 'A comprehensive document covering macro strategies, settings, and terminology necessary to step up from beginner to advanced in Honor of Kings.' : 'Honor of Kings の初心者から上級者へのステップアップに必要な「マクロ戦略」「設定」「用語」をすべて網羅した総合ドキュメントです。'}"
  },
  {
    search: '目次 (Contents)',
    replace: "{locale === 'en' ? 'Contents' : '目次 (Contents)'}"
  },
  {
    search: '現在データを収集・生成中です...',
    replace: "{locale === 'en' ? 'Currently collecting and generating data...' : '現在データを収集・生成中です...'}"
  },
  {
    search: '>マップオブジェクト<',
    replace: ">{locale === 'en' ? 'Map Objectives' : 'マップオブジェクト'}<"
  },
  {
    search: '【効果】',
    replace: "{locale === 'en' ? '[Effect]' : '【効果】'}"
  },
  {
    search: '>経済・バトルシステム<',
    replace: ">{locale === 'en' ? 'Economy & Battle System' : '経済・バトルシステム'}<"
  },
  {
    search: '>おすすめ操作設定<',
    replace: ">{locale === 'en' ? 'Recommended Settings' : 'おすすめ操作設定'}<"
  },
  {
    search: '>MOBA・HoK 用語集<',
    replace: ">{locale === 'en' ? 'MOBA / HoK Glossary' : 'MOBA・HoK 用語集'}<"
  }
]);

// 2. Fix heroes/page.tsx
const heroesPagePath = 'src/app/[locale]/heroes/page.tsx';
replaceInFile(heroesPagePath, [
  {
    search: "{hero.title && hero.title !== 'Honor of Kings Hero' && (",
    replace: "{locale !== 'en' && hero.title && hero.title !== 'Honor of Kings Hero' && ("
  },
  {
    search: '見つかりませんでした',
    replace: "{locale === 'en' ? 'Not Found' : '見つかりませんでした'}"
  },
  {
    search: '検索条件に一致するヒーローがいません。',
    replace: "{locale === 'en' ? 'No heroes match your search criteria.' : '検索条件に一致するヒーローがいません。'}"
  }
]);

// 3. Fix heroes/[id]/page.tsx
const heroDetailPath = 'src/app/[locale]/heroes/[id]/page.tsx';
replaceInFile(heroDetailPath, [
  {
    search: '<h2 className="text-sm font-bold text-slate-500 mt-4 mb-1">{hero.title}</h2>',
    replace: '{locale !== \'en\' && <h2 className="text-sm font-bold text-slate-500 mt-4 mb-1">{hero.title}</h2>}'
  },
  {
    search: '<span className="text-[10px] font-bold text-slate-400">Tier / 人気</span>',
    replace: '<span className="text-[10px] font-bold text-slate-400">{locale === \'en\' ? \'Tier / Pop\' : \'Tier / 人気\'}</span>'
  },
  {
    search: '<span className="text-[10px] font-bold text-slate-400">勝率</span>',
    replace: '<span className="text-[10px] font-bold text-slate-400">{locale === \'en\' ? \'Win Rate\' : \'勝率\'}</span>'
  },
  {
    search: '<span className="text-[10px] font-bold text-slate-400">出現率</span>',
    replace: '<span className="text-[10px] font-bold text-slate-400">{locale === \'en\' ? \'Pick Rate\' : \'出現率\'}</span>'
  },
  {
    search: '<span className="text-[10px] font-bold text-slate-400">Ban率</span>',
    replace: '<span className="text-[10px] font-bold text-slate-400">{locale === \'en\' ? \'Ban Rate\' : \'Ban率\'}</span>'
  }
]);

// 4. Fix root page.tsx (Home page)
const rootPagePath = 'src/app/[locale]/page.tsx';
replaceInFile(rootPagePath, [
  {
    // Fix metaPicks mapping to use name_en
    search: 'hero_name: validChamps[0].name,',
    replace: 'hero_name: locale === \'en\' && validChamps[0].name_en ? validChamps[0].name_en : validChamps[0].name,'
  },
  {
    // Fix featuredItems (recent buffs) mapping to use name_en
    search: 'hero_name: locale === \'ja\' ? patch.hero_name : (patch.hero_name_en || patch.hero_name),',
    replace: 'hero_name: locale === \'en\' && matchedHero?.name_en ? matchedHero.name_en : (locale === \'ja\' ? patch.hero_name : (patch.hero_name_en || patch.hero_name)),'
  },
  {
    // Fix featuredItems title display to hide in EN
    search: 'title: patch.is_hero ? (matchedHero?.title || \'\') : \'\',',
    replace: 'title: patch.is_hero && locale !== \'en\' ? (matchedHero?.title || \'\') : \'\','
  },
  {
    // Fix metaPicks title display
    search: '<span className="block text-[8px] text-slate-500 font-medium mb-0.5">{pick.title || \'\'}</span>',
    replace: '{locale !== \'en\' && <span className="block text-[8px] text-slate-500 font-medium mb-0.5">{pick.title || \'\'}</span>}'
  }
]);

console.log("Done fixing translations.");
