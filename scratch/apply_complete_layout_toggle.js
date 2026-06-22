import fs from 'fs';
import path from 'path';

const filePath = 'c:/Users/81901/Desktop/ワイリフサイト/src/app/[locale]/items/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

// 1. Update imports
const originalImports = `import { Search, Trophy, ShoppingBag, X, SlidersHorizontal, ArrowUpDown, Sparkles, ShieldAlert, Award, Layers, HelpCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';`;
const newImports = `import { Search, Trophy, ShoppingBag, X, SlidersHorizontal, ArrowUpDown, Sparkles, ShieldAlert, Award, Layers, HelpCircle, ChevronDown, ChevronUp, Info, LayoutGrid, List } from 'lucide-react';`;

if (content.includes(originalImports)) {
  content = content.replace(originalImports, newImports);
  console.log('1. Updated imports.');
} else {
  console.error('Could not find imports to replace.');
}

// 2. Add state
const originalState = `  const [filterCompleted, setFilterCompleted] = useState<'all' | 'core' | 'intermediate' | 'basic' | 'boots'>('core'); // デフォルトはコア（完成品）
  const [showHelp, setShowHelp] = useState(false); // データベース仕様説明 of status`; // wait, let's search for filterCompleted to get exact line

const stateLine = `  const [filterCompleted, setFilterCompleted] = useState<'all' | 'core' | 'intermediate' | 'basic' | 'boots'>('core'); // デフォルトはコア（完成品）\n  const [showHelp, setShowHelp] = useState(false); // データベース仕様説明の表示制御用ステート`;
const newStateLine = stateLine + `\n  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // デフォルトはグリッド（スマホはコンパクト2列、PCは4列）`;

if (content.includes(stateLine)) {
  content = content.replace(stateLine, newStateLine);
  console.log('2. Updated state.');
} else {
  console.error('Could not find state lines to replace.');
}

// 3. Replace the Sorting Direction Tabs and insert the new Controls
const originalSorting = `          {/* Sorting Direction Tabs */}
          <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setSortOrder('desc')}
              className={\`px-3 py-1 rounded-xl text-xs font-black transition-all \${
                sortOrder === 'desc'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
            >
              {sortBy === 'name' ? (locale === 'ja' ? 'ん → あ' : 'Z → A') : (locale === 'ja' ? '高 → 低' : 'High → Low')}
            </button>
            <button
              onClick={() => setSortOrder('asc')}
              className={\`px-3 py-1 rounded-xl text-xs font-black transition-all \${
                sortOrder === 'asc'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
            >
              {sortBy === 'name' ? (locale === 'ja' ? 'あ → ん' : 'A → Z') : (locale === 'ja' ? '低 → 高' : 'Low → High')}
            </button>
          </div>`;

const newControls = `          {/* Sorting Direction */}
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 rounded-2xl text-xs font-black text-slate-300 hover:text-white flex items-center gap-1.5 transition-all select-none"
            title={sortOrder === 'desc' ? (locale === 'ja' ? '降順（大きい順）' : 'Descending') : (locale === 'ja' ? '昇順（小さい順）' : 'Ascending')}
          >
            <ArrowUpDown size={14} className={\`text-indigo-400 transition-transform duration-300 \${sortOrder === 'asc' ? 'rotate-180' : ''}\`} />
            <span>
              {sortOrder === 'desc'
                ? (sortBy === 'name' ? (locale === 'ja' ? 'ん → あ' : 'Z → A') : (locale === 'ja' ? '高 → 低' : 'High → Low'))
                : (sortBy === 'name' ? (locale === 'ja' ? 'あ → ん' : 'A → Z') : (locale === 'ja' ? '低 → 高' : 'Low → High'))}
            </span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={\`p-1.5 rounded-xl transition-all \${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
              title={locale === 'ja' ? 'グリッド表示' : 'Grid View'}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={\`p-1.5 rounded-xl transition-all \${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }\`}
              title={locale === 'ja' ? 'リスト表示' : 'List View'}
            >
              <List size={16} />
            </button>
          </div>`;

if (content.includes(originalSorting)) {
  content = content.replace(originalSorting, newControls);
  console.log('3. Replaced sorting direction with single button and single view switcher.');
} else {
  console.error('Could not find sorting direction tabs to replace.');
}

// 4. Replace the rendering block between start and end markers
const startMarker = '      {/* Items Grid */}';
const endMarker = '      {/* Modal Drawer */}';

const newRendering = `      {/* Items Container */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {processedItems.map(item => {
            const isOrnn = item.id.startsWith('7');
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                className="group bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col items-stretch text-left hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
              >
                {/* Highlight Ornn Upgrade */}
                {isOrnn && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent pointer-events-none rounded-bl-full border-r border-t border-amber-500/20" />
                )}
   
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 z-10">
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <img 
                      src={
                        item.image === 'default_item.png'
                          ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                          : item.image.startsWith('/')
                          ? item.image
                          : \`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/\${item.image}\`
                      }
                      alt={item.nameJa}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-slate-100 text-xs sm:text-base truncate group-hover:text-indigo-400 transition-colors">
                        {item.nameJa}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                      <span className="text-[9px] sm:text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md px-1 sm:px-1.5 py-0.5">
                        {item.gold} G
                      </span>
                      {isOrnn && (
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-400 bg-amber-400/20 border border-amber-400/30 rounded-md px-1 py-0.5 flex items-center gap-0.5">
                          <Award size={9} />
                          <span className="hidden sm:inline">傑作</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
   
                {/* Stats overview */}
                <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-1 z-10">
                  {item.stats.length > 0 ? (
                    item.stats.slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="text-[10px] sm:text-xs text-slate-300 font-bold flex items-center gap-1 sm:gap-1.5 bg-slate-950/40 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-slate-800/30">
                        <span>{getStatEmoji(stat)}</span>
                        <span className="truncate">{stat}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] sm:text-xs text-slate-500 italic font-semibold">効果のみ</div>
                  )}
                  {item.stats.length > 3 && (
                    <div className="text-[8px] sm:text-[10px] text-indigo-400 font-black pl-5 sm:pl-7">
                      他 {item.stats.length - 3} 件...
                    </div>
                  )}
                </div>
   
                {/* Passives count/preview */}
                {item.passives.length > 0 && (
                  <div className="border-t border-slate-800/60 pt-2 sm:pt-3 flex items-center justify-between text-[8px] sm:text-[10px] text-slate-400 font-bold z-10">
                    <span className="flex items-center gap-1">
                      <Layers size={10} className="text-indigo-400" />
                      パッシブ
                    </span>
                    <span className="bg-slate-950/60 px-1.5 py-0.5 rounded-full border border-slate-800/40">
                      {item.passives.length} 件
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {processedItems.map(item => {
            const isOrnn = item.id.startsWith('7');
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                className="group bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center justify-between text-left hover:scale-[1.01] hover:shadow-lg hover:border-indigo-500/50 transition-all duration-200 relative overflow-hidden"
              >
                {/* Highlight Ornn Upgrade */}
                {isOrnn && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/15 to-transparent pointer-events-none rounded-bl-full border-r border-t border-amber-500/15" />
                )}
                
                <div className="flex items-center gap-3 sm:gap-4 z-10 min-w-0 flex-1">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <img 
                      src={
                        item.image === 'default_item.png'
                          ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                          : item.image.startsWith('/')
                          ? item.image
                          : \`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/\${item.image}\`
                      }
                      alt={item.nameJa}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <h3 className="font-black text-slate-100 text-sm sm:text-base truncate group-hover:text-indigo-400 transition-colors">
                      {item.nameJa}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                      <span className="text-[9px] sm:text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded px-1 py-0.5">
                        {item.gold} G
                      </span>
                      {isOrnn && (
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-400 bg-amber-400/20 border border-amber-400/30 rounded px-1 py-0.5 flex items-center gap-0.5">
                          <Award size={8} />
                          <span>傑作</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Stats overview (compact list) */}
                <div className="hidden md:flex items-center gap-2 z-10 mr-4 shrink-0">
                  {item.stats.slice(0, 2).map((stat, idx) => (
                    <div key={idx} className="text-xs text-slate-300 font-bold flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded-lg border border-slate-800/30">
                      <span>{getStatEmoji(stat)}</span>
                      <span className="truncate max-w-[100px]">{stat}</span>
                    </div>
                  ))}
                  {item.stats.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-semibold">
                      +{item.stats.length - 2}
                    </span>
                  )}
                </div>

                {/* Passives count */}
                {item.passives.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold z-10 shrink-0 border-l border-slate-800/60 pl-3">
                    <Layers size={11} className="text-indigo-400" />
                    <span className="hidden xs:inline">パッシブ</span>
                    <span className="bg-slate-950/60 px-1.5 py-0.5 rounded-full border border-slate-800/40 text-[9px]">
                      {item.passives.length}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}`;

if (content.includes(startMarker) && content.includes(endMarker)) {
  const parts = content.split(startMarker);
  const subParts = parts[1].split(endMarker);
  content = parts[0] + startMarker + '\n' + newRendering + '\n\n' + endMarker + subParts[1];
  console.log('4. Replaced items grid container successfully.');
} else {
  console.error('Could not find grid container start/end markers.');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully completed applying complete layout toggle script.');
