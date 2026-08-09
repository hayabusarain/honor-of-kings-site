"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Image from "next/image";
import { Zap, Clock, Search, Filter } from "lucide-react";
import spellsData from "@/data/hok_spells.json";

export default function SpellsClient() {
  const locale = useLocale();
  const isJa = locale === "ja";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const rolesList = ["All", "Fighter", "Mage", "Marksman", "Assassin", "Tank", "Support"];

  const filteredSpells = spellsData.filter((spell) => {
    const nameMatch =
      spell.japanese_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spell.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spell.japanese_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const roleMatch =
      selectedRole === "All" ||
      spell.recommended_roles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()));

    return nameMatch && roleMatch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Standard Clean Page Header Banner */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center shadow-xs">
              <Zap size={20} className="text-white fill-white" />
            </div>
            {isJa ? "サモナースペル一覧" : "Summoner Spells"}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
            {isJa
              ? "全サモナースペルの詳細効果・クールダウン（CD）・解放条件・おすすめロール"
              : "Complete Summoner Spells database with cooldowns and recommended roles"}
          </p>
        </div>
      </div>

      {/* Controls / Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isJa ? "スペル名や効果で検索..." : "Search spells..."}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto pb-1 md:pb-0">
          <Filter size={16} className="text-slate-400 shrink-0 ml-1 mr-2 hidden sm:block" />
          {rolesList.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 border ${
                selectedRole === role
                  ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {role === "All" ? (isJa ? "すべて" : "All") : role}
            </button>
          ))}
        </div>
      </div>

      {/* Spells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpells.map((spell) => (
          <div
            key={spell.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between relative group"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/50 shadow-md group-hover:scale-105 transition-transform relative flex items-center justify-center">
                  <Image 
                    src={spell.icon || spell.cn_icon_url || `/images/spells/${spell.id}.jpg`} 
                    alt={spell.japanese_name} 
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.srcset = '';
                      if (spell.cn_icon_url && !target.src.includes('gtimg.cn')) {
                        target.src = spell.cn_icon_url;
                      } else {
                        target.src = '/images/spells/default.png';
                      }
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-black text-slate-900 truncate">
                      {isJa ? spell.japanese_name : spell.english_name}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[11px] font-black shrink-0 flex items-center gap-1">
                      <Clock size={12} />
                      {spell.cooldown}s CD
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 mt-0.5">
                    {spell.english_name} {spell.unlock_level && `• Lv.${spell.unlock_level}`}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4">
                {isJa ? spell.japanese_description : spell.english_description}
              </p>
            </div>

            {/* Recommended Roles */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                {isJa ? "推奨ロール" : "Recommended"}
              </span>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {spell.recommended_roles.map((role, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-black"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
