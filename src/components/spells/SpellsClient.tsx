"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ListNotes } from "@/components/ListNotes";
import Image from "next/image";
import { Zap, Clock, Search, Filter } from "lucide-react";
import spellsData from "@/data/hok_spells.json";
import { SPELL_GUIDE } from "@/content/spellGuide";

// サーバー側（spells/page.tsx）で skills/ja.json から作った逆引きの1件分。
// 大元の JSON をここで import するとクライアントに 1.6MB 載るため、props で受け取る
export interface SpellUser {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  image: string;
}
/** キーは hok_spells.json の japanese_name（正式名） */
export type SpellUserMap = Record<string, SpellUser[]>;

// フラッシュは70体超が該当するので、畳んだときはここまでしか出さない
const USERS_COLLAPSED_COUNT = 12;

export default function SpellsClient({ spellUsers = {} }: { spellUsers?: SpellUserMap }) {
  const locale = useLocale();
  const r = useTranslations("Role");
  // hok_spells.json の recommended_roles は Fighter/Tank/… という英語のまま。
  // 日本語ページでもそのまま出ていたので、ヒーロー一覧やTier表と同じ対訳に通す
  const roleLabel = (role: string) => {
    const key = String(role || '').toLowerCase();
    return ['fighter', 'tank', 'mage', 'assassin', 'marksman', 'support', 'jungle'].includes(key)
      ? r(key)
      : role;
  };
  const isJa = locale === "ja";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  // スペルごとの「ほか○体」の開閉状態。キーは spell.id
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  const rolesList = ["All", "Fighter", "Mage", "Marksman", "Assassin", "Tank", "Support"];

  const filteredSpells = spellsData.filter((spell) => {
    const guide = SPELL_GUIDE[spell.id]?.[isJa ? "ja" : "en"];
    // 表示言語の説明文と使いどころも検索対象に入れる。
    // 英語UIで english_description を見ておらず、"slow" や "shield" で引けなかった
    const haystack = [
      spell.japanese_name,
      spell.english_name,
      spell.japanese_description,
      spell.english_description,
      guide?.when,
      guide?.detail,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const nameMatch = haystack.includes(searchQuery.toLowerCase());

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
              {role === "All" ? (isJa ? "すべて" : "All") : roleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Spells Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpells.map((spell) => (
          <div
            key={spell.id}
            /* 横断検索から /spells#spell-<id> で着地する。
               scroll-mt は固定ヘッダー（AppBar 56px）ぶんの逃げ */
            id={`spell-${spell.id}`}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between relative group scroll-mt-24"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-400/50 shadow-md group-hover:scale-105 transition-transform relative flex items-center justify-center">
                  <Image 
                    src={spell.icon || `/images/summoners/${spell.summoner_id}.webp`}
                    alt={isJa ? spell.japanese_name : spell.english_name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 外部CDNへのフォールバックは廃止し、自前の画像だけで完結させる
                      const target = e.currentTarget as HTMLImageElement;
                      target.srcset = '';
                      target.src = '/images/heroes/default.webp';
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
                  {/* unlock_level はアカウントレベル。試合中のヒーローレベルと取り違えられるため
                      「Lv.3」とだけ出さず、何のレベルかを書く（値には17・19があり、
                      試合中のヒーローレベルとしては成立しない） */}
                  <div className="text-xs font-bold text-slate-500 mt-0.5">
                    {spell.english_name}
                    {spell.unlock_level
                      ? isJa
                        ? ` • アカウントLv${spell.unlock_level}で解放`
                        : ` • Unlocks at account Lv.${spell.unlock_level}`
                      : ''}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4">
                {isJa ? spell.japanese_description : spell.english_description}
              </p>

              {/* 使いどころ。ゲーム内の効果文とは別に、当サイトが書いた選択の指針 */}
              {(() => {
                const guide = SPELL_GUIDE[spell.id]?.[isJa ? "ja" : "en"];
                if (!guide) return null;
                return (
                  <div className="mb-4 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-3.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-amber-700/80">
                      {isJa ? "使いどころ" : "When to take it"}
                    </div>
                    <p className="mt-1 text-[13px] font-black leading-snug text-amber-900">
                      {guide.when}
                    </p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-700">
                      {guide.detail}
                    </p>
                  </div>
                );
              })()}

              {/* このスペルが向いているヒーロー。skills データの逆引きで、詳細ページへの入口を兼ねる */}
              {(() => {
                const users = spellUsers[spell.japanese_name];
                if (!users || users.length === 0) return null;
                const expanded = !!expandedUsers[spell.id];
                const shown = expanded ? users : users.slice(0, USERS_COLLAPSED_COUNT);
                const hiddenCount = users.length - shown.length;
                // 畳める体数を超えるときだけトグルを出す。以前は「ほか○体」と「閉じる」が
                // 別々の button で、押した瞬間に押した方が消えてフォーカスが body に落ちていた
                const canToggle = users.length > USERS_COLLAPSED_COUNT;
                const chipsId = `spell-users-${spell.id}`;
                return (
                  <div className="mb-4">
                    <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">
                      {isJa
                        ? `このスペルが向いているヒーロー（${users.length}体）`
                        : `Heroes that take this spell (${users.length})`}
                    </div>
                    <div id={chipsId} className="flex flex-wrap gap-1.5">
                      {shown.map((hero) => (
                        <Link
                          key={hero.id}
                          href={`/heroes/${hero.slug}`}
                          className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full hover:border-brand-300 hover:bg-brand-50 transition-colors"
                        >
                          <Image
                            src={hero.image}
                            alt=""
                            width={20}
                            height={20}
                            className="w-5 h-5 rounded-full object-cover bg-slate-200"
                          />
                          <span className="text-[10px] font-bold text-slate-700">
                            {isJa ? hero.name : hero.name_en}
                          </span>
                        </Link>
                      ))}
                      {canToggle && (
                        <button
                          type="button"
                          onClick={() => setExpandedUsers((prev) => ({ ...prev, [spell.id]: !expanded }))}
                          aria-expanded={expanded}
                          aria-controls={chipsId}
                          className="px-2.5 py-1 bg-white border border-dashed border-slate-300 rounded-full text-[10px] font-bold text-slate-500 hover:border-brand-400 hover:text-brand-700 transition-colors"
                        >
                          {expanded
                            ? (isJa ? "閉じる" : "Show less")
                            : (isJa ? `ほか${hiddenCount}体` : `+${hiddenCount} more`)}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Recommended Roles */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                {isJa ? "推奨ロール" : "Recommended"}
              </span>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {spell.recommended_roles.map((role, rIdx) => (
                  <span
                    key={rIdx}
                    className="px-2.5 py-1 bg-brand-50 text-brand-700 border border-brand-100 rounded-lg text-[10px] font-black"
                  >
                    {roleLabel(role)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ListNotes page="spells" locale={locale} />
    </div>
  );
}
