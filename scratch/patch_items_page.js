import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/app/[locale]/items/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
const searchImport = `import { Search, Trophy, ShoppingBag, X, SlidersHorizontal, ArrowUpDown, Sparkles, ShieldAlert, Award, Layers, HelpCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';`;
const replaceImport = `import { Search, Trophy, ShoppingBag, X, SlidersHorizontal, ArrowUpDown, Sparkles, ShieldAlert, Award, Layers, HelpCircle, ChevronDown, ChevronUp, Info, LayoutGrid, List } from 'lucide-react';`;
if (content.includes(searchImport)) {
  content = content.replace(searchImport, replaceImport);
  console.log('Updated imports.');
}

// 2. Update states
const searchState = `  const [filterCompleted, setFilterCompleted] = useState<'all' | 'core' | 'intermediate' | 'basic' | 'boots'>('core'); // デフォルトはコア（完成品）\n  const [showHelp, setShowHelp] = useState(false); // データベース仕様説明の表示制御用ステート`;
const replaceState = `  const [filterCompleted, setFilterCompleted] = useState<'all' | 'core' | 'intermediate' | 'basic' | 'boots'>('core'); // デフォルトはコア（完成品）\n  const [showHelp, setShowHelp] = useState(false); // データベース仕様説明の表示制御用ステート\n  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // デフォルトはグリッド（スマホはコンパクト2列、PCは4列）`;
const searchStateCRLF = searchState.replace(/\n/g, '\r\n');
const replaceStateCRLF = replaceState.replace(/\n/g, '\r\n');

if (content.includes(searchState)) {
  content = content.replace(searchState, replaceState);
  console.log('Updated states.');
} else if (content.includes(searchStateCRLF)) {
  content = content.replace(searchStateCRLF, replaceStateCRLF);
  console.log('Updated states (CRLF).');
}

// 3. Update view Mode Switcher in Toolbar
const searchDirection = `          {/* Sorting Direction Tabs */}\n          <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-2xl">\n            <button\n              onClick={() => setSortOrder('desc')}\n              className={\`px-3 py-1 rounded-xl text-xs font-black transition-all \${\n                sortOrder === 'desc'\n                  ? 'bg-indigo-600 text-white shadow-md'\n                  : 'text-slate-400 hover:text-slate-200'\n              }\`}\n            >\n              {sortBy === 'name' ? (locale === 'ja' ? 'ん → あ' : 'Z → A') : (locale === 'ja' ? '高 → 低' : 'High → Low')}\n            </button>\n            <button\n              onClick={() => setSortOrder('asc')}\n              className={\`px-3 py-1 rounded-xl text-xs font-black transition-all \${\n                sortOrder === 'asc'\n                  ? 'bg-indigo-600 text-white shadow-md'\n                  : 'text-slate-400 hover:text-slate-200'\n              }\`}\n            >\n              {sortBy === 'name' ? (locale === 'ja' ? 'あ → ん' : 'A → Z') : (locale === 'ja' ? '低 → 高' : 'Low → High')}\n            </button>\n          </div>`;

const replaceDirection = searchDirection + `\n\n          {/* View Mode Switcher */}\n          <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-2xl">\n            <button\n              onClick={() => setViewMode('grid')}\n              className={\`p-1.5 rounded-xl transition-all \${\n                viewMode === 'grid'\n                  ? 'bg-indigo-600 text-white shadow-md'\n                  : 'text-slate-400 hover:text-slate-200'\n              }\`}\n              title={locale === 'ja' ? 'グリッド表示' : 'Grid View'}\n            >\n              <LayoutGrid size={16} />\n            </button>\n            <button\n              onClick={() => setViewMode('list')}\n              className={\`p-1.5 rounded-xl transition-all \${\n                viewMode === 'list'\n                  ? 'bg-indigo-600 text-white shadow-md' shadow-md'\n                  : 'text-slate-400 hover:text-slate-200'\n              }\`}\n              title={locale === 'ja' ? 'リスト表示' : 'List View'}\n            >\n              <List size={16} />\n            </button>\n          </div>`;

const searchDirectionCRLF = searchDirection.replace(/\n/g, '\r\n');
const replaceDirectionCRLF = replaceDirection.replace(/\n/g, '\r\n').replace("shadow-md' shadow-md'", "shadow-md'"); // clean up typo

if (content.includes(searchDirection)) {
  content = content.replace(searchDirection, replaceDirection);
  console.log('Updated sorting row.');
} else if (content.includes(searchDirectionCRLF)) {
  content = content.replace(searchDirectionCRLF, replaceDirectionCRLF);
  console.log('Updated sorting row (CRLF).');
}

// 4. Split-based replace for the grid container
const startMarker = '      {/* Items Grid */}';
const endMarker = '      {/* Modal Drawer */}';

const replaceGrid = `      {/* Items Container */}
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
  content = parts[0] + startMarker + '\n' + replaceGrid + '\n\n' + endMarker + subParts[1];
  console.log('Successfully replaced items container using split method.');
} else {
  // Try CRLF
  const startMarkerCRLF = startMarker.replace(/\n/g, '\r\n');
  const endMarkerCRLF = endMarker.replace(/\n/g, '\r\n');
  if (content.includes(startMarkerCRLF) && content.includes(endMarkerCRLF)) {
    const parts = content.split(startMarkerCRLF);
    const subParts = parts[1].split(endMarkerCRLF);
    content = parts[0] + startMarkerCRLF + '\r\n' + replaceGrid.replace(/\n/g, '\r\n') + '\r\n\r\n' + endMarkerCRLF + subParts[1];
    console.log('Successfully replaced items container using split method (CRLF).');
  } else {
    console.log('Error: Start or End marker not found.');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patch script completed.');
