"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "@/i18n/routing";
import { BookOpen, Map, Settings, ChevronRight, ChevronDown, Flag, Target, Coins, CheckCircle2, Clock, Sparkles, Sprout } from "lucide-react";
import { glossaryAnchor } from "./glossary/anchor";

// 描画本体。ScrollSpy とタブの現在地表示にクライアントが要るのでここは 'use client'。
// ガイド本文の JSON は page.tsx がロケールに応じて片方だけ読んで渡す。
// ここで両方を import すると、読まない側の言語もクライアントバンドルに載る

// src/data/guide/{ja,en}.json の形。2026-09-25 に日英とも全項目がこの形であることを確かめた。
// 以前は any で受けて obj.name || obj.title のような取り違えの保険を掛けていたが、
// 実データに別名のフィールドは1つも無かった
export type GuideData = {
  game_flow: { phase: string; timeframe: string; goal: string; key_actions: string[] }[];
  lanes: { title: string; description: string; tips: string[] }[];
  objectives: { name: string; spawn_time: string; effects: string; strategy: string }[];
  mechanics: { title: string; description: string }[];
  settings: { setting_name: string; reason: string }[];
  // id は /guide/glossary の各語のアンカーに使う（glossary/anchor.ts）
  glossary: { id: string; term: string; definition: string }[];
};

type Props = {
  locale: string;
  // 用語集の説明文は /guide/glossary にだけ出すので、ここには渡さない
  guideData: Omit<GuideData, "glossary">;
  // 用語集の節に出す先頭の数語と、全体の語数
  glossaryPreview: Pick<GuideData["glossary"][number], "id" | "term">[];
  glossaryCount: number;
};

const SECTION_IDS = ["game_flow", "lanes", "objectives", "mechanics", "settings", "glossary"] as const;
type SectionId = (typeof SECTION_IDS)[number];

// 目次の帯に隠れない位置で節の見出しを止める。帯の実測は、チップ36px＋上下8px＋線1px＝53px。
// スマホは AppBar 56px の下に貼り付くので 109px、PC（md 以上）は画面の上端に貼り付くので 53px。
// それぞれ 15〜19px の余白を足した。以前は offsetTop - 80 で、帯の下に見出しが27px潜っていた。
// 外から /guide#glossary（用語集が独立する前のリンク）で来たときも、この値で節の見出しに止まる
const SECTION_SCROLL_MT = "scroll-mt-[124px] md:scroll-mt-[72px]";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// レーン説明の1文目と残りに分ける。1文目は畳んだカードの見出しの下に出し、
// 開いたときは残りをその続きに置く（同じ文を2回出さない）
function splitLead(text: string): [string, string] {
  const m = text.match(/^(.+?(?:。|[.!?](?=\s)))\s*([\s\S]*)$/);
  return m ? [m[1], m[2]] : [text, ""];
}

export default function GuideClient({ locale, guideData, glossaryPreview, glossaryCount }: Props) {
  const isEn = locale === "en";
  const [activeSection, setActiveSection] = useState<SectionId>("game_flow");
  const navRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new globalThis.Map<SectionId, HTMLAnchorElement>());

  // ScrollSpy。判定線は目次の帯の下端から40px下（スマホ約149px・PC約93px）。
  // 見出しを止める位置（SECTION_SCROLL_MT）より下にあるので、目次で飛んだ直後にその節が選ばれる
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + 40;
      let current: SectionId = "game_flow";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveSection(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // #glossary 付きで開かれたときにも現在地を合わせる
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // 選択中のチップを帯の中央へ送る。チップ6つのうち、390px幅の最初の画面で見えるのは2〜3つで、
  // 「用語集」まで進んでも帯は左端のままだった（どこにいるかが帯に出ない）。
  // chip.scrollIntoView は使わない。スムーズスクロール中のページ側の送りまで止めてしまう
  useEffect(() => {
    const strip = stripRef.current;
    const chip = chipRefs.current.get(activeSection);
    if (!strip || !chip || strip.scrollWidth <= strip.clientWidth) return;
    strip.scrollTo({
      left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeSection]);

  // href="#id" のままでも飛べる（JS が動く前もそのまま使える）。動いた後はスムーズに送るだけ。
  // Ctrl/⌘/Shift/中ボタンのクリックは新しいタブで開く操作なので、ブラウザに任せる。
  // キーボード（Enter）で押したとき（detail が 0）もブラウザに任せる。preventDefault すると焦点が
  // 目次に残り、次の Tab が隣のチップへ行って本文に入れなかった。ブラウザの移動なら次の Tab は飛び先から始まる
  const jumpTo = (e: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    if (e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  };

  // 帯の見出しは短くする。節の見出しは本文側に全文がある
  const menuItems: { id: SectionId; icon: typeof Clock; title: string }[] = [
    { id: "game_flow", icon: Clock, title: isEn ? "Roadmap" : "ロードマップ" },
    { id: "lanes", icon: Map, title: isEn ? "Lanes & Roles" : "レーンと役割" },
    { id: "objectives", icon: Flag, title: isEn ? "Objectives" : "オブジェクト" },
    { id: "mechanics", icon: Coins, title: isEn ? "Mechanics" : "経済・バトル" },
    { id: "settings", icon: Settings, title: isEn ? "Settings" : "操作設定" },
    { id: "glossary", icon: BookOpen, title: isEn ? "Glossary" : "用語集" },
  ];

  const { lanes, objectives, mechanics, settings, game_flow: gameFlow } = guideData;

  return (
    <div className="bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          {/* 題名の上にあった「COMPREHENSIVE STRATEGY GUIDE」の札は外した。
              日本語ページに飾りの英語が残り、h1 と同じことを言うだけだった */}
          {/* 390px幅で「総合マ／スターガイド」と語の途中で割れていたので、文節で折る */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 [word-break:auto-phrase]">
            {isEn ? 'Honor of Kings Master Guide' : 'Honor of Kings 総合マスターガイド'}
          </h1>
          <p className="text-slate-600 font-medium max-w-2xl leading-relaxed mb-6">
            {/* 用語集は /guide/glossary に移したので、「この1ページにまとめた」ものの列挙から外した */}
            {isEn ? 'A beginner-to-advanced guide covering game flow, lane roles, objectives, economy mechanics and recommended settings.' : '初心者から上級者まで使える総合ガイドです。ゲームの流れ、5レーンの立ち回り、マップオブジェクト、経済の仕組み、おすすめ操作設定をこの1ページにまとめました。'}
          </p>

          {/* 関連ガイドへの入口。以前は橙と緑の塗りに白文字で、白と amber-500 の比は約2.2:1 と
              本文の下限（4.5:1）に届かず、金系の塗りを序列の最上位以外に使ってもいた。
              線のカードにして、色はアイコンの地にだけ残す。題名は文節で折る（360px幅で「ヒーロ／ー」と割れた）。
              英語の飾り札（SPECIAL GUIDE / FIRST PICK）も、題名の繰り返しなので外した */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/guide/bosses" className="group flex min-h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs transition-colors hover:border-brand-300">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50">
                <Sparkles size={20} className="text-amber-600" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-black text-slate-900 group-hover:text-brand-700 [word-break:auto-phrase]">
                {isEn ? 'Boss Spawn Times & Buffs' : '大型ボスの出現時刻とバフ'}
              </span>
              <ChevronRight size={18} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* 「どのヒーローから始めるか」はガイドのどのセクションでも答えていなかった */}
            <Link href="/guide/beginner-heroes" className="group flex min-h-11 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs transition-colors hover:border-brand-300">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                <Sprout size={20} className="text-emerald-600" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-black text-slate-900 group-hover:text-brand-700 [word-break:auto-phrase]">
                {isEn ? 'Which Hero to Start With — 10 Picks by Lane' : 'レーン別・最初に選ぶヒーロー'}
              </span>
              <ChevronRight size={18} className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* 目次の帯。スマホは AppBar（56px）の下、PC は AppBar が無いので画面の上端に貼り付く。
          以前は PC でも top-14 で、帯の上に56pxの隙間が空いて本文が透けていた。
          右端は mask でぼかして続きがあることを見せる（390px幅で中身が枠の2倍強ある）。
          末尾の pr-10 は、端まで送ったとき最後のチップをぼかしの外へ出すための余白。
          横スクロールの枠は縦のはみ出しも切る。枠の高さがチップと同じ36pxだと、キーボードで
          当てた焦点の輪郭（チップの外側2〜4px）が上下と左端で切れて見えなかったので、
          枠の内側に py-1 pl-1 を取り、そのぶん nav の上下と左の余白を4px減らした（帯の高さ53pxと
          チップの左端の位置は変えていない） */}
      <nav
        ref={navRef}
        aria-label={isEn ? 'On this page' : 'ページ内目次'}
        className="sticky top-14 md:top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs mb-8 py-1 pl-3 pr-4 sm:pl-5 sm:pr-6 lg:pl-7 lg:pr-8"
      >
        <div
          ref={stripRef}
          className="relative max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-1 pl-1 pr-10 [mask-image:linear-gradient(to_right,black_calc(100%-2.5rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline-block">
            {isEn ? 'Jump to:' : '目次:'}
          </span>
          {menuItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                ref={(el) => {
                  if (el) chipRefs.current.set(item.id, el);
                  else chipRefs.current.delete(item.id);
                }}
                onClick={(e) => jumpTo(e, item.id)}
                aria-current={active ? 'location' : undefined}
                className={`flex h-9 items-center gap-1.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors duration-150 shrink-0 ${
                  active
                    // 選択中は金ではなく墨（サイト全体で1系統に揃える）
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <item.icon size={15} aria-hidden="true" />
                {item.title}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Area (Full width readable layout) */}
        <div className="space-y-12">

            {/* Game Flow Section */}
            {gameFlow.length > 0 && (
              <section id="game_flow" className={SECTION_SCROLL_MT}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Clock size={24} />
                  </div>
                  {/* 英語は360px幅で「(1-」と「20 min)」がハイフンで割れていたので、括弧の中は1かたまりにする */}
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight [word-break:auto-phrase]">{isEn ? <>Game Roadmap <span className="whitespace-nowrap">(1-20 min)</span></> : 'ゲーム進行ロードマップ（1〜20分）'}</h2>
                </div>
                <div className="space-y-4">
                  {gameFlow.map((phase, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          {phase.phase}
                        </h3>
                        <span className="text-xs font-black px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                          {phase.timeframe}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">{phase.goal}</p>
                      {phase.key_actions.length > 0 && (
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                          {phase.key_actions.map((act, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                              <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Lanes Section */}
            {/* 5レーンぶん全文を開いたまま並べると、この節だけで390px幅の約5.8画面あった。
                自分のレーンだけ読みたい人のために、1枚目以外は畳む。畳んでも見出しの下に
                説明の1文目を出すので、開かなくても中身の見当がつく。
                本文は details の中に残るので、初期HTMLの量は変わらない */}
            <section id="lanes" className={SECTION_SCROLL_MT}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Map size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight [word-break:auto-phrase]">{isEn ? 'Lanes & Roles' : 'レーンと役割'}</h2>
              </div>
              <div className="space-y-4">
                {lanes.map((lane, idx) => {
                  const [lead, rest] = splitLead(lane.description);
                  // details に overflow-hidden を付けない。付けると summary の焦点の輪郭（外側2〜4px）が
                  // 全周切られ、キーボードでどのカードにいるか見えなかった。角の丸めは summary 側で持つ
                  return (
                    <details key={idx} open={idx === 0} className="group bg-white rounded-2xl border border-slate-200 shadow-sm">
                      {/* summary の中に置けるのは見出しと文中要素だけなので、div で包まず grid で組む
                          （1行目に h3 と矢印、2行目に1文目を全幅で）。1文目を矢印の列の下まで広げるのは、
                          390px幅で矢印の列（32px）に幅を取られ「レ／ーンです。」のように語の途中で割れていたため */}
                      <summary className="grid min-h-11 cursor-pointer list-none grid-cols-[1fr_auto] gap-x-3 p-5 rounded-2xl group-open:rounded-b-none group-open:pb-2 hover:bg-slate-50/60 [&::-webkit-details-marker]:hidden">
                        {/* 390px幅で「ファームレーン（マークスマン）」が「ン）」だけ次の行に割れていたので、
                            スマホでは1段小さくし、飾りの # も外した（右の矢印があれば開閉は分かる） */}
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 [word-break:auto-phrase]">{lane.title}</h3>
                        <ChevronDown size={20} aria-hidden="true" className="mt-1 text-slate-500 transition-transform group-open:rotate-180" />
                        <span className="col-span-2 mt-1.5 block text-sm text-slate-600 leading-relaxed [word-break:auto-phrase]">{lead}</span>
                      </summary>
                      <div className="px-5 pb-5">
                        {rest && <p className="text-slate-600 leading-relaxed text-sm">{rest}</p>}
                        {lane.tips.length > 0 && (
                          <div className="mt-4 p-4 bg-brand-50/50 rounded-xl border border-brand-100/50 space-y-2">
                            {lane.tips.map((tip, i) => (
                              <div key={i} className="flex gap-2 items-start text-sm text-slate-700">
                                <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
                {lanes.length === 0 && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-slate-500 text-center text-sm font-medium">{isEn ? 'This section is being prepared.' : 'このセクションは準備中です。'}</div>
                )}
              </div>
            </section>

            {/* Objectives Section */}
            <section id="objectives" className={SECTION_SCROLL_MT}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <Flag size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight [word-break:auto-phrase]">{isEn ? 'Map Objectives' : 'マップオブジェクト'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectives.map((obj, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-purple-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-bold text-slate-900">{obj.name}</h3>
                      {obj.spawn_time && (
                        <span className="text-xs font-black px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{obj.spawn_time}</span>
                      )}
                    </div>
                    {obj.effects && (
                      <p className="text-sm text-purple-700 font-bold mb-2">{isEn ? '[Effect]' : '【効果】'} {obj.effects}</p>
                    )}
                    {obj.strategy && (
                      <p className="text-sm text-slate-600 leading-relaxed">{obj.strategy}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Mechanics Section */}
            <section id="mechanics" className={SECTION_SCROLL_MT}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                  <Coins size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight [word-break:auto-phrase]">{isEn ? 'Economy & Battle System' : '経済・バトルシステム'}</h2>
              </div>
              <div className="space-y-4">
                {mechanics.map((mech, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Target size={16} className="text-amber-500" />
                      {mech.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{mech.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Settings Section */}
            <section id="settings" className={SECTION_SCROLL_MT}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-slate-200 text-slate-700 rounded-xl">
                  <Settings size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight [word-break:auto-phrase]">{isEn ? 'Recommended Settings' : 'おすすめ操作設定'}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings.map((set, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 ml-2">{set.setting_name}</h3>
                    <p className="text-xs text-slate-600 ml-2">{set.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Glossary Section */}
            {/* 用語集の本文は /guide/glossary にある。ここには先頭の数語とリンクだけを置く。
                説明文を2か所に置くと、片方だけ直して古い説明が残るため。
                節の id="glossary" は残す。目次の帯と、外から来る /guide#glossary の受け口 */}
            <section id="glossary" className={SECTION_SCROLL_MT}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight [word-break:auto-phrase]">{isEn ? 'MOBA / HoK Glossary' : 'MOBA・HoK 用語集'}</h2>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <ul className="flex flex-wrap gap-2">
                  {glossaryPreview.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/guide/glossary#${glossaryAnchor(item.id)}`}
                        className="inline-flex h-9 items-center rounded-lg border border-emerald-100 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition-colors hover:border-emerald-300"
                      >
                        {item.term}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/guide/glossary"
                  className="group mt-4 flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2 text-sm font-black sm:max-w-sm text-slate-900 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {/* 360px幅で英語の「Open the glossary (all 28 terms)」が「(all 28 / terms)」と割れたので、
                      節の見出しの直下にあることを頼りに短くした。割れても枠が伸びるよう min-h にしてある */}
                  <span className="min-w-0 [word-break:auto-phrase]">
                    {isEn ? `See all ${glossaryCount} terms` : `用語集を開く（全${glossaryCount}語）`}
                  </span>
                  <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    );
  }
