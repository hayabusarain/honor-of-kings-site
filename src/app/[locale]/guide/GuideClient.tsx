"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { BookOpen, Map, Settings, Info, ChevronRight, Hash, Flag, Target, Coins, CheckCircle2, Clock } from "lucide-react";

// 描画本体。ScrollSpy とタブの現在地表示にクライアントが要るのでここは 'use client'。
// ガイド本文の JSON は page.tsx がロケールに応じて片方だけ読んで渡す。
// ここで両方を import すると、読まない側の言語もクライアントバンドルに載る
type Props = {
  locale: string;
  guideData: Record<string, any>;
};

export default function GuideClient({ locale, guideData }: Props) {
  const [activeSection, setActiveSection] = useState("game_flow");

  // ScrollSpy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["game_flow", "lanes", "objectives", "mechanics", "settings", "glossary"];
      let current = "game_flow";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const menuItems = [
    { id: "game_flow", icon: Clock, title: locale === 'en' ? "Game Roadmap (1-20m)" : "ゲーム進行ロードマップ", color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "lanes", icon: Map, title: locale === 'en' ? "Lanes & Roles" : "レーンと役割", color: "text-blue-500", bg: "bg-blue-50" },
    { id: "objectives", icon: Flag, title: locale === 'en' ? "Objectives" : "マップ・オブジェクト", color: "text-purple-500", bg: "bg-purple-50" },
    { id: "mechanics", icon: Coins, title: locale === 'en' ? "Mechanics" : "経済・バトルシステム", color: "text-amber-500", bg: "bg-amber-50" },
    { id: "settings", icon: Settings, title: locale === 'en' ? "Settings" : "おすすめ操作設定", color: "text-slate-500", bg: "bg-slate-50" },
    { id: "glossary", icon: BookOpen, title: locale === 'en' ? "Glossary" : "用語集", color: "text-brand-500", bg: "bg-brand-50" }
  ];

  // Helper to safely ensure array
  const toArray = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') return Object.values(val);
    return [];
  };

  const lanesList = toArray(guideData?.lanes);
  const objectivesList = toArray(guideData?.objectives);
  const mechanicsList = toArray(guideData?.mechanics);
  const settingsList = toArray(guideData?.settings);
  const glossaryList = toArray(guideData?.glossary);
  const gameFlowList = toArray(guideData?.game_flow);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-14 md:pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 font-bold text-xs tracking-wider mb-4 border border-brand-100">
            <Info size={14} />
            COMPREHENSIVE STRATEGY GUIDE
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {locale === 'en' ? 'Honor of Kings Master Guide' : 'Honor of Kings 総合マスターガイド'}
          </h1>
          <p className="text-slate-600 font-medium max-w-2xl leading-relaxed mb-6">
            {locale === 'en' ? 'A beginner-to-advanced guide covering game flow, lane roles, objectives, economy mechanics, recommended settings, and a 25+ term MOBA glossary.' : '初心者から上級者まで使える総合ガイドです。ゲームの流れ、5レーンの立ち回り、マップオブジェクト、経済の仕組み、おすすめ操作設定、用語集（25項目以上）をこの1ページにまとめました。'}
          </p>

          {/* Quick Hub Feature Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/guide/bosses" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div>
                <div className="text-xs font-black text-amber-100 uppercase tracking-wider">SPECIAL GUIDE</div>
                <div className="font-black text-sm">{locale === 'ja' ? '🐉 モンスターバフ完全解説' : '🐉 Boss Objectives Guide'}</div>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* 「どのヒーローから始めるか」はガイドのどのセクションでも答えていなかった */}
            <Link href="/guide/beginner-heroes" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group sm:col-span-2">
              <div>
                <div className="text-xs font-black text-emerald-100 uppercase tracking-wider">FIRST PICK</div>
                <div className="font-black text-sm">{locale === 'ja' ? '🌱 レーン別・最初に選ぶヒーロー10体' : '🌱 Which Hero to Start With — 10 Picks by Lane'}</div>
              </div>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Top Quick Nav Bar (No wasteful side margin) */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs mb-8 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline-block">
            {locale === 'en' ? 'Jump to:' : '目次:'}
          </span>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                activeSection === item.id 
                  // 選択中は金ではなく墨（サイト全体で1系統に揃える）
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <item.icon size={15} />
              {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Area (Full width readable layout) */}
        <div className="space-y-12">
            
            {/* Game Flow Section */}
            {gameFlowList.length > 0 && (
              <section id="game_flow" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Clock size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'Game Roadmap (1-20 min)' : 'ゲーム進行ロードマップ（1〜20分）'}</h2>
                </div>
                <div className="space-y-4">
                  {gameFlowList.map((phase: Record<string, any>, idx: number) => (
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
                      {(() => {
                        const actions = toArray(phase.key_actions || phase.goals);
                        if (actions.length === 0) return null;
                        return (
                          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                            {actions.map((act: string, i: number) => (
                              <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                                <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                <span>{typeof act === 'string' ? act : JSON.stringify(act)}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Lanes Section */}
            <section id="lanes" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Map size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'Lanes & Roles' : 'レーンと役割'}</h2>
              </div>
              <div className="space-y-6">
                {lanesList.map((lane: Record<string, any>, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Hash size={18} className="text-slate-400" />
                        {lane.title}
                      </h3>
                    </div>
                    <div className="p-5">
                      <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{lane.description}</p>
                      {lane.tips && lane.tips.length > 0 && (
                        <div className="mt-4 p-4 bg-brand-50/50 rounded-xl border border-brand-100/50 space-y-2">
                          {lane.tips.map((tip: string, i: number) => (
                            <div key={i} className="flex gap-2 items-start text-sm text-slate-700">
                              <CheckCircle2 size={16} className="text-brand-500 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {lanesList.length === 0 && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-slate-500 text-center text-sm font-medium">{locale === 'en' ? 'This section is being prepared.' : 'このセクションは準備中です。'}</div>
                )}
              </div>
            </section>

            {/* Objectives Section */}
            <section id="objectives" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <Flag size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'Map Objectives' : 'マップオブジェクト'}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectivesList.map((obj: Record<string, any>, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-purple-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-bold text-slate-900">{obj.name || obj.title}</h3>
                      {obj.spawn_time && (
                        <span className="text-xs font-black px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{obj.spawn_time}</span>
                      )}
                    </div>
                    {(obj.effects || obj.description) && (
                      <p className="text-sm text-purple-700 font-bold mb-2">{locale === 'en' ? '[Effect]' : '【効果】'} {obj.effects || obj.description}</p>
                    )}
                    {obj.strategy && (
                      <p className="text-sm text-slate-600 leading-relaxed">{obj.strategy}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Mechanics Section */}
            <section id="mechanics" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                  <Coins size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'Economy & Battle System' : '経済・バトルシステム'}</h2>
              </div>
              <div className="space-y-4">
                {mechanicsList.map((mech: Record<string, any>, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <Target size={16} className="text-amber-500" />
                      {mech.title || mech.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{mech.description || mech.explanation}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Settings Section */}
            <section id="settings" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-slate-200 text-slate-700 rounded-xl">
                  <Settings size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'Recommended Settings' : 'おすすめ操作設定'}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settingsList.map((set: Record<string, any>, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 ml-2">{set.setting_name || set.name || set.setting}</h3>
                    <p className="text-xs text-slate-600 ml-2">{set.reason || set.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Glossary Section */}
            <section id="glossary" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <BookOpen size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'MOBA / HoK Glossary' : 'MOBA・HoK 用語集'}</h2>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {glossaryList.map((item: Record<string, any>, idx: number) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                      <div className="sm:w-1/3 flex-shrink-0">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-100">
                          {item.term || item.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed sm:flex-1">{item.meaning || item.definition || item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    );
  }
