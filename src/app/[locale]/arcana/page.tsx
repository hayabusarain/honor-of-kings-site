'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search } from 'lucide-react';
import Image from 'next/image';
import arcanasData from '@/data/hok_arcanas.json';
import { ListNotes } from '@/components/ListNotes';
import { ARCANA_BUILDS, type ArcanaPick } from '@/content/arcanaBuilds';

interface Arcana {
  id: string;
  type: string;
  grade: string;
  name: string;
  name_en?: string;
  stats: string;
  stats_en?: string;
  icon?: string;
}

export default function ArcanasPage() {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const [arcanas] = useState<Arcana[]>(arcanasData as Arcana[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'red' | 'blue' | 'green'>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const STAT_FILTERS = useMemo(() => [
    { id: 'all', label: locale === 'ja' ? '効果すべて' : 'All Stats', keywords: [] },
    { id: 'ad', label: locale === 'ja' ? '物理攻撃' : 'AD', keywords: ['物理攻撃', 'ad', 'physical attack'] },
    { id: 'ap', label: locale === 'ja' ? '魔力' : 'AP', keywords: ['魔力', 'ap', 'magical attack'] },
    { id: 'def', label: locale === 'ja' ? '防御' : 'Defense', keywords: ['物理防御', '魔法防御', '防御', 'defense'] },
    { id: 'hp', label: locale === 'ja' ? 'HP' : 'HP', keywords: ['最大hp', 'hp', 'health'] },
    { id: 'crit', label: locale === 'ja' ? 'クリティカル' : 'Crit', keywords: ['クリティカル', 'crit'] },
    { id: 'pierce', label: locale === 'ja' ? '貫通' : 'Pierce', keywords: ['貫通', 'penetration', 'pierce'] },
    { id: 'lifesteal', label: locale === 'ja' ? '吸収' : 'Lifesteal', keywords: ['吸収', 'lifesteal'] },
    { id: 'cd', label: locale === 'ja' ? 'クールダウン' : 'CD', keywords: ['クールダウン', 'cooldown'] },
    { id: 'speed', label: locale === 'ja' ? '移動速度' : 'Speed', keywords: ['移動速度', 'movement speed'] },
    { id: 'atk_speed', label: locale === 'ja' ? '攻撃速度' : 'Atk Spd', keywords: ['攻撃速度', 'attack speed'] },
  ], [locale]);

  const stripHtml = (html: string) => {
    if (!html) return '';
    const str = typeof html === 'string' ? html : String(html);
    return str.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
  };

  // 並び順の基準。掲載アルカナは全て Lv.5 のため、等級で並べても順序に意味が出ない。
  // 「物理攻撃」「クリティカル率」のように、1つ目の効果名でまとめて探しやすくする。
  const firstStatName = (arcana: Arcana) => {
    const raw = locale === 'en' && arcana.stats_en ? arcana.stats_en : arcana.stats;
    const head = stripHtml(raw).split(/[,、]/)[0] || '';
    return head.replace(/[+\-0-9.%\s]+$/u, '').trim();
  };

  const processedArcanas = useMemo(() => {
    const result = arcanas.filter(arcana => {
      if (activeTab !== 'all' && arcana.type !== activeTab) return false;

      const name = locale === 'en' && arcana.name_en ? arcana.name_en : arcana.name;
      const stats = locale === 'en' && arcana.stats_en ? arcana.stats_en : arcana.stats;

      const fieldsToSearch = [name, arcana.name, arcana.name_en, stats, arcana.stats, arcana.stats_en].filter((v): v is string => Boolean(v)).map(v => v.toLowerCase());

      // Text search
      const query = searchQuery.toLowerCase();
      if (query && !fieldsToSearch.some(f => f.includes(query))) return false;

      // Filter chips
      if (activeFilter !== 'all') {
        const filter = STAT_FILTERS.find(f => f.id === activeFilter);
        if (filter && filter.keywords.length > 0) {
          const match = filter.keywords.some(kw => fieldsToSearch.some(f => f.includes(kw.toLowerCase())));
          if (!match) return false;
        }
      }
      
      return true;
    });
    
    // 効果の種類でまとめ、同じ種類の中は名前順にする
    result.sort((a, b) => firstStatName(a).localeCompare(firstStatName(b), locale) || a.name.localeCompare(b.name, locale));

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeTab, activeFilter, arcanas, locale, STAT_FILTERS]);

  // 「すべて」表示のときは赤→青→緑で区切る。個別の色を選んでいるときは1つの塊にする
  const sections = useMemo(() => {
    const order: Array<'red' | 'blue' | 'green'> = ['red', 'blue', 'green'];
    if (activeTab !== 'all') return [{ type: activeTab, items: processedArcanas }];
    return order
      .map(type => ({ type, items: processedArcanas.filter(a => a.type === type) }))
      .filter(s => s.items.length > 0);
  }, [activeTab, processedArcanas]);

  const getTypeName = (type: string) => {
    switch (type) {
      case 'red': return locale === 'ja' ? '赤 (Red)' : 'Red';
      case 'blue': return locale === 'ja' ? '青 (Blue)' : 'Blue';
      case 'green': return locale === 'ja' ? '緑 (Green)' : 'Green';
      default: return type;
    }
  };

  // 掲載している30個の効果を集計した傾向。例外もあるので「主に」と書く
  const getTypeHint = (type: string) => {
    const hints: Record<string, { ja: string; en: string }> = {
      red: { ja: '主に攻撃力。物理・魔法攻撃、クリティカル、攻撃速度', en: 'Mostly offense: attack, crit and attack speed' },
      blue: { ja: '主に生存と機動力。最大HP、吸収、移動速度', en: 'Mostly survivability: max health, lifesteal and movement speed' },
      green: { ja: '主に防御とクールダウン短縮、防御貫通', en: 'Mostly defense, cooldown reduction and pierce' },
    };
    const h = hints[type];
    return h ? (locale === 'ja' ? h.ja : h.en) : '';
  };

  const getDotColor = (type: string) => {
    switch (type) {
      case 'red': return 'bg-rose-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  // アイコンを載せていないため、色そのものが赤・青・緑の区別を担う
  const getCardStyle = (type: string) => {
    switch (type) {
      case 'red': return 'bg-rose-50/70 border-rose-200';
      case 'blue': return 'bg-blue-50/70 border-blue-200';
      case 'green': return 'bg-emerald-50/70 border-emerald-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getNameColor = (type: string) => {
    switch (type) {
      case 'red': return 'text-rose-900';
      case 'blue': return 'text-blue-900';
      case 'green': return 'text-emerald-900';
      default: return 'text-slate-900';
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {locale === 'ja' ? 'アルカナ一覧' : 'Arcana List'}
        </h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {(['all', 'red', 'blue', 'green'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeTab === tab
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab === 'all' && (locale === 'ja' ? 'すべて' : 'All')}
              {tab === 'red' && (locale === 'ja' ? '赤' : 'Red')}
              {tab === 'blue' && (locale === 'ja' ? '青' : 'Blue')}
              {tab === 'green' && (locale === 'ja' ? '緑' : 'Green')}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          
          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-1 scroll-smooth">
            {STAT_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`
                  snap-start whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold select-none transition-all border shrink-0
                  ${activeFilter === filter.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 active:bg-slate-50'
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={locale === 'ja' ? 'アルカナ名で検索...' : 'Search arcana...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-400 text-sm transition-all"
            />
          </div>

        </div>

        {/* 色ごとに区切って並べる。効果は常時表示し、タップで詳細を開く */}
        {sections.length === 0 && (
          <p className="py-16 text-center text-sm font-bold text-slate-400">
            {locale === 'ja' ? '条件に合うアルカナがありません' : 'No arcana matches your filters'}
          </p>
        )}

        {sections.map(section => (
          <section key={section.type} className="space-y-3">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotColor(section.type)}`} />
              <h2 className="text-base font-black text-slate-900">
                {getTypeName(section.type)}
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {section.items.length}{locale === 'ja' ? '個' : ''}
              </span>
              <span className="text-[11px] font-bold text-slate-400 basis-full sm:basis-auto">
                {getTypeHint(section.type)}
              </span>
            </div>

            <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {section.items.map(arcana => {
                const name = locale === 'en' && arcana.name_en ? arcana.name_en : arcana.name;
                const stats = locale === 'en' && arcana.stats_en ? arcana.stats_en : arcana.stats;

                return (
                  <div
                    key={arcana.id}
                    className={`border rounded-2xl p-3.5 flex flex-col gap-1.5 shadow-xs ${getCardStyle(arcana.type)}`}
                  >
                    <div className="flex items-center gap-2">
                      {/* アイコンは 2026-08-14 に中国版CDN由来のため削除したが、
                          グローバル版公式から取り直して 2026-08-15 に復活させた。
                          六角形の枠に等級（Lv.5のV）が入っており、色は type と一致する */}
                      {arcana.icon && (
                        <Image
                          src={arcana.icon}
                          alt=""
                          width={36}
                          height={36}
                          className="w-9 h-9 shrink-0"
                        />
                      )}
                      <h3 className={`font-black text-[15px] leading-tight ${getNameColor(arcana.type)}`}>
                        {name}
                      </h3>
                    </div>
                    {/* 効果は最長でも37字なので、折り返して全文を出せる */}
                    <p className="text-[12px] font-bold text-slate-600 leading-snug">
                      {stripHtml(stats)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* ロール別の構成。一覧は「調べに来た人」向けなので、読み物は下に置く */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            {isJa ? 'ロール別のアルカナ構成' : 'Arcana Builds by Role'}
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
            {isJa
              ? '色ごとに1枚を選ぶときの目安です。数値は上の一覧と同じレベル5のものを載せています。'
              : 'A starting point for the pick in each colour. The values shown match the Level 5 figures in the list above.'}
          </p>

          <div className="mt-6 space-y-5">
            {ARCANA_BUILDS[isJa ? 'ja' : 'en'].map(build => (
              <article key={build.role} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                <h3 className="text-[15px] font-black text-slate-900">{build.role}</h3>
                <p className="mt-0.5 text-xs font-bold text-slate-500">{build.target}</p>

                <div className="mt-3.5 grid gap-2.5 sm:grid-cols-3">
                  {([
                    { key: 'red', picks: build.red, label: isJa ? '赤' : 'Red', dot: 'bg-rose-500', card: 'bg-rose-50/70 border-rose-200', name: 'text-rose-900' },
                    { key: 'blue', picks: build.blue, label: isJa ? '青' : 'Blue', dot: 'bg-blue-500', card: 'bg-blue-50/70 border-blue-200', name: 'text-blue-900' },
                    { key: 'green', picks: build.green, label: isJa ? '緑' : 'Green', dot: 'bg-emerald-500', card: 'bg-emerald-50/70 border-emerald-200', name: 'text-emerald-900' },
                  ] as { key: string; picks: ArcanaPick[]; label: string; dot: string; card: string; name: string }[]).map(col => (
                    <div key={col.key} className={`rounded-xl border p-3 ${col.card}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${col.dot}`} />
                        <span className="text-[11px] font-black text-slate-500">{col.label}</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {col.picks.map((pick, i) => (
                          <div key={pick.name}>
                            {i > 0 && (
                              <div className="mb-1 text-[10px] font-black text-slate-400">
                                {isJa ? 'または' : 'or'}
                              </div>
                            )}
                            <div className={`text-[14px] font-black leading-tight ${col.name}`}>{pick.name}</div>
                            <div className="mt-0.5 text-[11px] font-bold leading-snug text-slate-600">{pick.stats}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3.5 text-[13px] font-medium leading-relaxed text-slate-600">{build.reason}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 border-t border-slate-100 pt-4 text-xs font-medium leading-relaxed text-slate-400">
            {isJa
              ? '※ロール別の構成は公式が公開しているデータではなく、掲載している全30種のレベル5の数値をもとにした当サイトの解説です。'
              : 'Note: these role builds are not official data. They are this site’s own reading, derived from the Level 5 values of all 30 arcana listed above.'}
          </p>
        </section>

        <ListNotes page="arcana" locale={locale} />
      </div>

    </div>
  );
}
