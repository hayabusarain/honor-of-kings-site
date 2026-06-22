import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/81901/Desktop/ワイリフサイト/src/app/[locale]/spells/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF for easier replacement
content = content.replace(/\r\n/g, '\n');

const target = `          <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setSortOrder('desc')}
              className={\`px-3 py-1 rounded-xl text-xs font-black transition-all \${
                sortOrder === 'desc'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
            >
              {sortBy === 'name' ? (locale === 'ja' ? 'ん → あ' : 'Z → A') : (locale === 'ja' ? '長 → 短' : 'Long → Short')}
            </button>
            <button
              onClick={() => setSortOrder('asc')}
              className={\`px-3 py-1 rounded-xl text-xs font-black transition-all \${
                sortOrder === 'asc'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
            >
              {sortBy === 'name' ? (locale === 'ja' ? 'あ → ん' : 'A → Z') : (locale === 'ja' ? '短 → 長' : 'Short → Long')}
            </button>
          </div>`;

const replacement = `          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 rounded-2xl text-xs font-black text-slate-300 hover:text-white flex items-center gap-1.5 transition-all select-none"
            title={sortOrder === 'desc' ? (locale === 'ja' ? '降順（長い順）' : 'Descending') : (locale === 'ja' ? '昇順（短い順）' : 'Ascending')}
          >
            <ArrowUpDown size={14} className={\`text-indigo-400 transition-transform duration-300 \${sortOrder === 'asc' ? 'rotate-180' : ''}\`} />
            <span>
              {sortOrder === 'desc'
                ? (sortBy === 'name' ? (locale === 'ja' ? 'ん → あ' : 'Z → A') : (locale === 'ja' ? '長 → 短' : 'Long → Short'))
                : (sortBy === 'name' ? (locale === 'ja' ? 'あ → ん' : 'A → Z') : (locale === 'ja' ? '短 → 長' : 'Short → Long'))}
            </span>
          </button>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced sorting direction tabs in spells/page.tsx.');
} else {
  console.error('Target not found in spells/page.tsx.');
}
