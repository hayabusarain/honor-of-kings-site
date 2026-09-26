'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Calculator, Search } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { Dropdown, type DropdownOption } from '@/components/common/Dropdown';
import { ListNotes } from '@/components/ListNotes';
import { ArcanaEffects } from '@/components/arcana/ArcanaEffects';
import { ARCANA_BUILDS, type ArcanaPick } from '@/content/arcanaBuilds';

// アルカナのデータは page.tsx（サーバー部品）が読んで props で渡す。
// FAQ をこのページに出すためにサーバー部品を置いたので、装備ページと同じく読み込みもそちらへ移した
export interface Arcana {
  id: string;
  type: string;
  grade: string;
  name: string;
  name_en?: string;
  stats: string;
  stats_en?: string;
  icon?: string;
}

type ColorTab = 'all' | 'red' | 'blue' | 'green';

export function ArcanasClient({ arcanas }: { arcanas: Arcana[] }) {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ColorTab>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const STAT_FILTERS = useMemo(() => [
    { id: 'all', label: locale === 'ja' ? '効果すべて' : 'All Stats', keywords: [] },
    { id: 'ad', label: locale === 'ja' ? '物理攻撃' : 'AD', keywords: ['物理攻撃', 'ad', 'physical attack'] },
    { id: 'ap', label: locale === 'ja' ? '魔法攻撃' : 'AP', keywords: ['魔法攻撃', 'ap', 'magical attack'] },
    { id: 'def', label: locale === 'ja' ? '防御' : 'Defense', keywords: ['物理防御', '魔法防御', '防御', 'defense'] },
    { id: 'hp', label: locale === 'ja' ? 'HP' : 'HP', keywords: ['最大hp', 'hp', 'health'] },
    { id: 'crit', label: locale === 'ja' ? 'クリティカル' : 'Crit', keywords: ['クリティカル', 'crit'] },
    { id: 'pierce', label: locale === 'ja' ? '貫通' : 'Pierce', keywords: ['貫通', 'penetration', 'pierce'] },
    { id: 'lifesteal', label: locale === 'ja' ? 'ライフスティール' : 'Lifesteal', keywords: ['ライフスティール', 'lifesteal'] },
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

  // 日本語ページに「赤 (Red)」と英語を添えていたが、読者が使う情報ではないので外した（2026-09-25）
  const getTypeName = (type: string) => {
    switch (type) {
      case 'red': return locale === 'ja' ? '赤' : 'Red';
      case 'blue': return locale === 'ja' ? '青' : 'Blue';
      case 'green': return locale === 'ja' ? '緑' : 'Green';
      default: return type;
    }
  };

  // 掲載している30個の効果を集計した傾向。例外もあるので「主に」と書く
  const getTypeHint = (type: string) => {
    const hints: Record<string, { ja: string; en: string }> = {
      red: { ja: '主に攻撃力。物理・魔法攻撃、クリティカル、攻撃速度', en: 'Mostly offense: attack, crit and attack speed' },
      blue: { ja: '主に生存と機動力。最大HP、ライフスティール、移動速度', en: 'Mostly survivability: max health, lifesteal and movement speed' },
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

  // 閉じたボタンに「すべて」とだけ出ると、2つ並んだときにどちらが色か読めない。
  // 色は3色の丸と「全色」、効果は「効果すべて」と書く。360px 幅ではボタンの文字欄が
  // 約60px（14pxで全角4字）しかなく、「すべての色」も効果側のアイコンも入らなかった
  const colorOptions: DropdownOption<ColorTab>[] = [
    {
      value: 'all',
      label: isJa ? '全色' : 'All',
      icon: (
        <span aria-hidden="true" className="flex items-center gap-px">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
      ),
    },
    ...(['red', 'blue', 'green'] as const).map(type => ({
      value: type,
      label: getTypeName(type),
      icon: <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${getDotColor(type)}`} />,
    })),
  ];

  const statOptions: DropdownOption<string>[] = STAT_FILTERS.map(f => ({ value: f.id, label: f.label }));

  return (
    <div className="w-full bg-background font-sans text-slate-800">

      <BreadcrumbJsonLd locale={locale} trail={[{ name: isJa ? 'アルカナ一覧' : 'Arcana', path: '/arcana' }]} />

      {/* Header Banner */}
      {/* スマホでは固定しない。上に高さ56pxの AppBar（sticky top-0 z-40）があり、
          top-0 で貼り付くと題名がその裏に潜る。題名とリンクだけの帯を AppBar の下に
          固定し直しても、画面を狭くするだけなので、固定はPC（AppBar が無い幅）に限る。
          page-hero は夜の配色の冒頭の帯（globals.css）で、ヒーロー一覧・Tier表と揃える */}
      <div className="page-hero border-b border-slate-200 pt-6 pb-5 px-4 md:sticky md:top-0 z-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {locale === 'ja' ? 'アルカナ一覧' : 'Arcana List'}
          </h1>
          {/* 14pxにすると日本語で約200pxになり、360px幅では題名の横に入らず次の行へ回る（flex-wrap） */}
          <Link
            href="/arcana/calculator"
            className="flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Calculator size={16} aria-hidden="true" />
            {isJa ? '30枠の合計を計算する' : 'Calculate 30-slot totals'}
          </Link>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* 絞り込み。色のタブと効果のチップを別の段に並べていた頃は、390px 幅で
            約190pxを取り、効果のチップは11個中3個しか見えていなかった（中身1008px／枠300px）。
            プルダウン2つを横に並べ、検索をその下に置いて約117pxにした。
            幅の配分は候補の文字幅で決めた（14px太字の実測）。日本語は「ライフスティール」が112pxで、
            半々だと390px幅で102px、360px幅で87pxの枠に入らず切れていた。色の候補は最長28px
            なので 2:3 に割る。英語は最長が「Green」42px・「Lifesteal」59pxで、半々で入る。
            3つを1段にするのは lg から。md で1段にするとボタンが98pxになり「全色」も切れていた */}
        <div className={`grid gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,4fr)] ${isJa ? 'grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : 'grid-cols-2'}`}>
          <Dropdown
            label={isJa ? '色' : 'Colour'}
            options={colorOptions}
            value={activeTab}
            onChange={setActiveTab}
            defaultValue="all"
          />
          <Dropdown
            label={isJa ? '効果' : 'Stat'}
            options={statOptions}
            value={activeFilter}
            onChange={setActiveFilter}
            defaultValue="all"
          />
          <div className="relative col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
            {/* スマホの文字は globals.css が16pxに上げる（iPhone は16px未満の入力欄を押すと画面を拡大する） */}
            <input
              type="search"
              aria-label={isJa ? 'アルカナ名で検索' : 'Search arcana'}
              placeholder={locale === 'ja' ? 'アルカナ名で検索...' : 'Search arcana...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full pl-10 pr-4 bg-slate-100 border border-transparent rounded-xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* 色ごとに区切って並べる。効果は常時表示し、タップで詳細を開く */}
        {sections.length === 0 && (
          <p className="py-16 text-center text-sm font-bold text-slate-500">
            {locale === 'ja' ? '条件に合うアルカナがありません' : 'No arcana matches your filters'}
          </p>
        )}

        {sections.map(section => (
          <section key={section.type} className="space-y-3">
            <div className="flex items-baseline gap-x-2 gap-y-1 flex-wrap">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${getDotColor(section.type)}`} />
              <h2 className="text-lg font-black text-slate-900">
                {getTypeName(section.type)}
              </h2>
              <span className="text-sm font-bold text-slate-500">
                {section.items.length}{locale === 'ja' ? '個' : ''}
              </span>
              {/* 360px幅では2行になる。keep-all で読点の後ろでだけ折り、「クリティカル」を割らない */}
              <span className="text-sm font-bold text-slate-500 break-keep basis-full sm:basis-auto">
                {getTypeHint(section.type)}
              </span>
            </div>

            {/* 1枚の幅は14.5rem（232px）以上。効果名と数値の最長の1行（「物理ライフスティール」140px＋間8px＋「+0.5%」約52px、
                実測199.5px）が、カードの内側（枠と左右の余白で30px引く）に1行で入る幅から決めた。
                2列固定だと390px幅でカードの内側が146pxしかなく、14pxの効果文が「クリティカ／ル率」のように語の途中で折れた。
                12.5remでは768・1024・1280・1440pxのどれでも内側が181〜199pxに収まり、数値だけが次の行へ落ちていた。
                列数は幅から決まり、390px・360px・768pxで1列、1024pxで2列、1280pxで3列、1440pxで4列 */}
            <div className="grid gap-2.5 grid-cols-[repeat(auto-fill,minmax(14.5rem,1fr))]">
              {section.items.map(arcana => {
                const name = locale === 'en' && arcana.name_en ? arcana.name_en : arcana.name;
                const stats = locale === 'en' && arcana.stats_en ? arcana.stats_en : arcana.stats;

                return (
                  <div
                    key={arcana.id}
                    /* 横断検索から /arcana#arcana-<id> で着地する。
                       既定タブが全件表示なので、初回ロードでアンカーが解決する */
                    id={`arcana-${arcana.id}`}
                    className={`@container border rounded-2xl p-3.5 scroll-mt-24 ${getCardStyle(arcana.type)}`}
                  >
                    {/* カードの内側が16rem以上（スマホの1列、1024・1280pxの2〜3列）はアイコンを左に置き、
                        名前と効果を右に積む。それより狭いカード（1440pxの4列、内側約240px）は
                        アイコンと名前の下に効果を全幅で置く。効果の行に使える幅はどちらも200px以上 */}
                    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-2.5 gap-y-2 @3xs:grid-cols-[2.5rem_minmax(0,1fr)] @3xs:gap-x-3 @3xs:gap-y-1">
                      {/* アイコンは 2026-08-14 に中国版CDN由来のため削除したが、
                          グローバル版公式から取り直して 2026-08-15 に復活させた。
                          六角形の枠に等級（Lv.5のV）が入っており、色は type と一致する */}
                      {arcana.icon ? (
                        <Image
                          src={arcana.icon}
                          alt=""
                          width={40}
                          height={40}
                          className="h-9 w-9 @3xs:row-span-2 @3xs:h-10 @3xs:w-10 @3xs:self-start"
                        />
                      ) : (
                        <span aria-hidden="true" className="h-9 w-9 @3xs:row-span-2" />
                      )}
                      {/* 英語名の最長は「Reverberation」（16pxで約115px）で、狭いカードの名前欄（約150px）に入る。
                          break-words は1語が欄より長いときだけ効く */}
                      <h3 className={`break-words text-base font-black leading-tight ${getNameColor(arcana.type)}`}>
                        {name}
                      </h3>
                      <ArcanaEffects stats={stats} className="col-span-2 @3xs:col-span-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* ロール別の構成。一覧は「調べに来た人」向けなので、読み物は下に置く */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="section-title">
            {isJa ? 'ロール別のアルカナ構成' : 'Arcana Builds by Role'}
          </h2>
          {/* 節の短い説明と構成の狙い（build.target）は文節で折る（auto-phrase。ほかのページの説明と同じ指定） */}
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500 [word-break:auto-phrase]">
            {isJa
              ? '色ごとに1枚を選ぶときの目安です。数値は上の一覧と同じレベル5のものを載せています。'
              : 'A starting point for the pick in each colour. The values shown match the Level 5 figures in the list above.'}
          </p>

          <div className="mt-6 space-y-5">
            {ARCANA_BUILDS[isJa ? 'ja' : 'en'].map(build => (
              <article key={build.role} className="@container rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                <h3 className="text-base font-black text-slate-900">{build.role}</h3>
                <p className="mt-0.5 text-sm font-bold text-slate-500 [word-break:auto-phrase]">{build.target}</p>

                {/* 3色を横に並べるのは、構成の枠の内側が36rem以上あるときだけ（1枠が約185px以上）。
                    sm:grid-cols-3 のままだと、サイドバーの出る768px幅で1枠が約97pxになり、14pxの効果が語の途中で折れた */}
                <div className="mt-3.5 grid gap-2.5 @xl:grid-cols-3">
                  {([
                    { key: 'red', picks: build.red, label: isJa ? '赤' : 'Red', dot: 'bg-rose-500', card: 'bg-rose-50/70 border-rose-200', name: 'text-rose-900' },
                    { key: 'blue', picks: build.blue, label: isJa ? '青' : 'Blue', dot: 'bg-blue-500', card: 'bg-blue-50/70 border-blue-200', name: 'text-blue-900' },
                    { key: 'green', picks: build.green, label: isJa ? '緑' : 'Green', dot: 'bg-emerald-500', card: 'bg-emerald-50/70 border-emerald-200', name: 'text-emerald-900' },
                  ] as { key: string; picks: ArcanaPick[]; label: string; dot: string; card: string; name: string }[]).map(col => (
                    <div key={col.key} className={`rounded-xl border p-3 ${col.card}`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${col.dot}`} />
                        <span className="text-sm font-black text-slate-500">{col.label}</span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {col.picks.map((pick, i) => (
                          <div key={pick.name}>
                            {i > 0 && (
                              <div className="mb-1 text-sm font-black text-slate-500">
                                {isJa ? 'または' : 'or'}
                              </div>
                            )}
                            <div className={`text-base font-black leading-tight ${col.name}`}>{pick.name}</div>
                            <ArcanaEffects stats={pick.stats} className="mt-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3.5 text-sm font-medium leading-relaxed text-slate-600">{build.reason}</p>
              </article>
            ))}
          </div>

          <p className="mt-6 border-t border-slate-100 pt-4 text-sm font-medium leading-relaxed text-slate-500">
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
