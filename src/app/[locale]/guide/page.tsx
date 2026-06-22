"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { BookOpen, Map, Settings, Shield, Zap, Info, ChevronRight, Hash, Flag, Target, Coins, Heart, CheckCircle2 } from "lucide-react";

export default function GuidePage() {
  const t = useTranslations("Guide");
  const locale = useLocale();
  const [guideData, setGuideData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("lanes");
  
  useEffect(() => {
    // Fetch generated guide data
    fetch(`/data/guide/${locale}.json`)
      .then(res => res.json())
      .then(data => setGuideData(data))
      .catch(err => {
        console.error("Failed to load guide data", err);
        // Fallback or empty state if not generated yet
        setGuideData({
          lanes: [],
          objectives: [],
          mechanics: [],
          settings: [],
          glossary: []
        });
      });
  }, [locale]);

  // ScrollSpy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["lanes", "objectives", "mechanics", "settings", "glossary"];
      let current = "lanes";
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
    { id: "lanes", icon: Map, title: "レーンと役割 (Lanes & Roles)", color: "text-blue-500", bg: "bg-blue-50" },
    { id: "objectives", icon: Flag, title: "マップ・オブジェクト (Objectives)", color: "text-purple-500", bg: "bg-purple-50" },
    { id: "mechanics", icon: Coins, title: "経済・バトルシステム (Mechanics)", color: "text-amber-500", bg: "bg-amber-50" },
    { id: "settings", icon: Settings, title: "おすすめ設定 (Settings)", color: "text-slate-500", bg: "bg-slate-50" },
    { id: "glossary", icon: BookOpen, title: "用語集 (Glossary)", color: "text-emerald-500", bg: "bg-emerald-50" }
  ];

  if (!guideData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-20 pt-14">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-14 md:pt-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs tracking-wider mb-4 border border-indigo-100">
            <Info size={14} />
            COMPREHENSIVE GUIDE
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {locale === 'en' ? 'Comprehensive Guide' : '基礎知識・総合ガイド'}
          </h1>
          <p className="text-slate-600 font-medium max-w-2xl leading-relaxed">
            {locale === 'en' ? 'A comprehensive document covering macro strategies, settings, and terminology necessary to step up from beginner to advanced in Honor of Kings.' : 'Honor of Kings の初心者から上級者へのステップアップに必要な「マクロ戦略」「設定」「用語」をすべて網羅した総合ドキュメントです。'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / TOC */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-bold text-slate-900 mb-4 px-2 text-sm uppercase tracking-wider">{locale === 'en' ? 'Contents' : '目次 (Contents)'}</h3>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                      activeSection === item.id 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${activeSection === item.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      <item.icon size={16} />
                    </div>
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-12">
            
            {/* Lanes Section */}
            <section id="lanes" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Map size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'Lanes & Roles' : 'レーンと役割'}</h2>
              </div>
              <div className="space-y-6">
                {guideData.lanes?.map((lane: any, idx: number) => (
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
                        <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-2">
                          {lane.tips.map((tip: string, i: number) => (
                            <div key={i} className="flex gap-2 items-start text-sm text-slate-700">
                              <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(!guideData.lanes || guideData.lanes.length === 0) && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 text-slate-500 text-center text-sm font-medium">{locale === 'en' ? 'Currently collecting and generating data...' : '現在データを収集・生成中です...'}</div>
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
                {guideData.objectives?.map((obj: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-purple-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-bold text-slate-900">{obj.name}</h3>
                      <span className="text-xs font-black px-2 py-1 bg-slate-100 text-slate-600 rounded-md">{obj.spawn_time}</span>
                    </div>
                    <p className="text-sm text-purple-700 font-bold mb-2">{locale === 'en' ? '[Effect]' : '【効果】'} {obj.effects}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{obj.strategy}</p>
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
                {guideData.mechanics?.map((mech: any, idx: number) => (
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
            <section id="settings" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-slate-200 text-slate-700 rounded-xl">
                  <Settings size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{locale === 'en' ? 'Recommended Settings' : 'おすすめ操作設定'}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guideData.settings?.map((set: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-800"></div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 ml-2">{set.setting_name}</h3>
                    <p className="text-xs text-slate-600 ml-2">{set.reason}</p>
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
                  {guideData.glossary?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                      <div className="sm:w-1/3 flex-shrink-0">
                        <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-100">
                          {item.term}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed sm:flex-1">{item.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
