'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { ArrowLeft, Sword, Shield, Zap, Target, ChevronDown, ChevronUp, Activity, Compass, BookOpen, ShieldAlert, Sunrise, Sun, Sunset, Users, AlertTriangle, Sparkles, Mail, X, ShoppingBag } from 'lucide-react';
import { formatSkillDescription } from '@/utils/localization';
import { parseHeroSkills } from '@/lib/parseHeroSkills';
import { PatchTable } from '@/components/patches/PatchTable';
import type { PatchEntry } from '@/lib/patchData';
import { ShareButton } from '@/components/common/ShareButton';
import { StatsFreshnessNote } from '@/components/common/StatsFreshnessNote';
import { ARCANA_BUILDS, type ArcanaBuildId } from '@/content/arcanaBuilds';
import { DIFFICULTY_COLOR, isDifficultyId, difficultyLabel } from '@/content/heroDifficulty';
import { getTierBadgeStyle } from '@/lib/tierBadge';
import { useFocusTrap } from '@/components/common/useFocusTrap';

import hokHeroes from '@/data/hok_heroes.json';
// 実測値だけを収めた基本ステータス。ゲーム内のステータス画面を113体ぶん書き起こしたもの。
// 旧 hero_detailed_stats.json は穴埋め用のダミーを読んでおり、大半のヒーローに
// 「最大HP 3300」を出していたため、2026-08-29 に生成スクリプトごと削除した
import heroBaseStats from '@/data/hero_base_stats.json';

import campStatsRaw from '@/data/hero_stats_camp.json';
import dataFreshness from '@/data/data_freshness.json';
import spellsData from '@/data/hok_spells.json';
import { normalizeSummonerSpells } from '@/content/summonerSpellNames';
import { SPELL_GUIDE } from '@/content/spellGuide';
import arcanasData from '@/data/hok_arcanas.json';
import type { ResolvedBuild, ResolvedItem } from '@/lib/heroItemBuilds';

// 公式編成の既定表示件数（各サイズごと）。これを超えた分は「残り○件を表示する」で開く
const COMBO_VISIBLE_COUNT = 5;

type ArcanaEntry = {
  id: string;
  type: string;
  grade: string;
  name: string;
  stats: string;
  name_en?: string;
  stats_en?: string;
  icon?: string;
};

// アルカナ構成のピックは名前しか持たないため、マスタ（hok_arcanas.json）と名前で突き合わせて
// アイコンと効果を引く。arcanaBuilds.ts の名前は37種すべてマスタと一致することを確認済み
const ARCANA_BY_NAME: Record<string, ArcanaEntry> = {};
for (const a of arcanasData as ArcanaEntry[]) {
  ARCANA_BY_NAME[a.name] = a;
  if (a.name_en) ARCANA_BY_NAME[a.name_en] = a;
}

// 効果テキストにHTMLタグが混じることがあるので、アルカナ一覧ページと同じ方法で落とす
const stripHtml = (html: string) => (html || '').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');

const ARCANA_TYPE_STYLE: Record<string, { card: string; name: string; label: { ja: string; en: string } }> = {
  red: { card: 'bg-rose-50/70 border-rose-200', name: 'text-rose-900', label: { ja: '赤', en: 'Red' } },
  blue: { card: 'bg-blue-50/70 border-blue-200', name: 'text-blue-900', label: { ja: '青', en: 'Blue' } },
  green: { card: 'bg-emerald-50/70 border-emerald-200', name: 'text-emerald-900', label: { ja: '緑', en: 'Green' } },
};

type SpellRow = {
  id: string;
  japanese_name: string;
  english_name: string;
  icon: string;
  cooldown: number;
};

/** ゲーム内ヒーロー詳細画面の公式4軸評価（各1〜10）。
 *  書き起こしの無いヒーローは全体が null。1〜10 の整数として確認できない軸は
 *  軸単位で null（page.tsx で正規化済み）。表示側はその軸を「未確認」と出す */
export interface OfficialRatings {
  survival: number | null;
  attack: number | null;
  skill: number | null;
  difficulty: number | null;
}

interface HeroDetailData { key?: string;
  id: string;
  name: string;
  search_alias?: string;
  title: string;
  tags: string[];
  gameStats?: OfficialRatings;
  hero_name_en?: string;
  image?: string;
}

// 相性・カウンター・編成からのリンクは、canonical や sitemap と同じ slug 側を指す。
// 数値IDでも同じページは開くが、内部リンクが非正規URLに集まると評価が分散する
const getHeroSlug = (id: string) => {
  const hero = (hokHeroes as Record<string, any>[]).find((h) => h.id === id);
  return hero?.slug || id;
};

/** 基本ステータス。実測値のあるヒーローだけが載っている */
interface HeroBaseStats {
  source: string;
  stats: Record<string, string>;
  resource?: { name: string; max: string; maxLabel?: string; regen?: string; regenLabel?: string };
}


export function HeroDetailClient({ id, initialDetails, officialRatings, officialDifficulty, shareTitle, itemBuilds, heroPatches = [] }: {
  id: string;
  initialDetails?: any;
  /** 公式4軸評価。skills/ja.json 由来で、サーバー側（page.tsx）が抽出して渡す */
  officialRatings?: OfficialRatings | null;
  /** ゲーム内の難易度表記（イージー/ノーマル/ハード/ベリーハード）。無ければ null */
  officialDifficulty?: string | null;
  /** 共有ボタンの見出し。page.tsx が heroPageTitle.ts で <title> と同じ文字列を計算して渡す */
  shareTitle?: string;
  /**
   * 人気の装備セット。装備マスタ（100KB）をクライアントへ持ち込まないよう、
   * サーバー側（heroItemBuilds.ts）で必要な分だけ解決して渡す
   */
  itemBuilds?: ResolvedBuild[];
  /**
   * このヒーローのパッチ履歴。patches.json（184KB）をクライアントへ持ち込まないよう、
   * サーバー側（patchData.ts）で該当分だけ抽出して渡す
   */
  heroPatches?: PatchEntry[];
}) {
  const locale = useLocale();
  const t = useTranslations("HeroDetail");
  const r = useTranslations("Role");
  // hero_stats_camp.json の lane は CLASH/JUNGLE/… という内部IDなので、
  // そのまま出すと日本語ページに英語が混ざる。バッジと「最新メタ」欄の両方で使う
  const laneLabel = (lane?: string) => {
    const key = String(lane || '').toLowerCase();
    return ['clash', 'jungle', 'mid', 'farm', 'roam'].includes(key) ? r(key) : (lane || '');
  };
  
  const champId = Array.isArray(id) ? id[0] : id;

  // URLはslug（例 hou-yi）で来るため、数値ID（例 169）が要る判定用に解決しておく。
  // data_freshness の patchBasisHeroIds は数値IDで持っている
  const numericHeroId = useMemo(() => {
    const m = hokHeroes.find(h => (h as Record<string, any>).slug === champId || h.id === champId);
    return m ? String(m.id) : String(champId);
  }, [champId]);

  const { initialHero, initialStats, initialWrDetails } = useMemo(() => {
    if (!champId) {
      return { initialHero: null, initialStats: [], initialWrDetails: null };
    }

    const hokMatched = hokHeroes.find(h => (h as Record<string, any>).slug === champId || h.id === champId);

    const fallbackName = champId;
    const fallbackRole = 'Mage';

    const champDetail: HeroDetailData = {
      id: champId,
      key: hokMatched?.id,
      name: hokMatched ? (locale === 'en' && hokMatched.name_en ? hokMatched.name_en : hokMatched.name) : fallbackName,
      search_alias: hokMatched ? (hokMatched as Record<string, any>).search_alias : undefined,
      title: hokMatched?.title || 'Honor of Kings Hero',
      tags: hokMatched?.role || [fallbackRole],
      // 以前は survivability:50 等の固定ダミーを入れていた。ゲーム内の公式評価
      // （skills/ja.json の stats）に置き換え、公式表記のあるヒーローだけ出す
      gameStats: officialRatings ?? undefined,
      hero_name_en: hokMatched ? hokMatched.name_en : champId,
      image: hokMatched?.image
    };

    // サーバー側で解決済みのスキル・戦略データがあれば初期状態に使う。
    // これにより初期HTML（SSR）に本文が含まれ、クローラにも内容が見える
    const wrDet = initialDetails
      ? { hero_id: champId, ...initialDetails }
      : {
          hero_id: champId,
          skills: [],
          strategy: null,
          meta: null
        };

    // Tier・勝率もサーバー側で解決して初期HTMLに含める。
    // 従来の初期値（survivability等のダミー）には tier が無く、Meta Stats
    // セクションはクライアント描画までずっと出ていなかった。
    // 取得日と「8月13日調整前」の注記もここに載るため、SSRに出ることが要る。
    // camp統計が無いヒーローは空配列にし、ダミーで埋めない
    const camp = (campStatsRaw as Record<string, any>)[hokMatched?.id ?? ''];
    const initialTierStats = camp
      ? [{
          role: camp.lane || hokMatched?.role?.[0] || 'ALL',
          tier: camp.tier,
          win_rate: camp.win_rate,
          pick_rate: camp.pick_rate,
          ban_rate: camp.ban_rate,
        }]
      : [];

    return {
      initialHero: champDetail,
      initialStats: initialTierStats,
      initialWrDetails: wrDet
    };
  }, [champId, locale, initialDetails, officialRatings]);
  
  const [hero, setHero] = useState<HeroDetailData | null>(initialHero);
  const [stats, setStats] = useState<any[]>(initialStats);
  const [wrDetails, setWrDetails] = useState<any>(initialWrDetails);
  const [loading, setLoading] = useState(false);

  // 管理用のインライン編集UI（isEditing 系）は 2026-08-15 に削除した。
  // 保存先の /api/admin/skills が存在せず（api/ 配下は latest のみ）、ローカルでも
  // 必ず404で失敗する壊れた機能のまま、全ヒーローページのバンドルに同梱されていた
  const [expandedSkills, setExpandedSkills] = useState<Record<number, boolean>>({ 0: true, 1: true, 2: true, 3: true, 4: true });
  const [activeFormIndices, setActiveFormIndices] = useState<Record<number, number>>({});
  // 公式編成は明世隠38件・瑶32件のように偏りが大きい。既定は各サイズ上位5件だけ出し、
  // 残りはここで開く（マッチ率の低い帯は「たまたま同じチームに居た」程度で判断材料にならない）
  const [expandedComboSizes, setExpandedComboSizes] = useState<Record<number, boolean>>({});
  // アルカナ構成のピックを押したときに出す詳細。アルカナ一覧には個別URLが無いため、
  // ページを離れずにこの場で中身（アイコン・色・効果）を読めるようにする
  const [openArcana, setOpenArcana] = useState<ArcanaEntry | null>(null);
  const arcanaModalRef = useRef<HTMLDivElement>(null);
  const { onKeyDown: arcanaTrapKeyDown } = useFocusTrap(arcanaModalRef, Boolean(openArcana));

  // アルカナ詳細は ESC で閉じる（検索・アイテムのモーダルと操作を揃える）
  useEffect(() => {
    if (!openArcana) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenArcana(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openArcana]);

  // 装備セットのアイテムを押したときの詳細。アイテム一覧にも個別URLが無いので、
  // アルカナと同じくこの場で読ませる
  const [openItem, setOpenItem] = useState<ResolvedItem | null>(null);
  const itemModalRef = useRef<HTMLDivElement>(null);
  const { onKeyDown: itemTrapKeyDown } = useFocusTrap(itemModalRef, Boolean(openItem));

  useEffect(() => {
    if (!openItem) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenItem(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openItem]);

  const toggleSkill = (idx: number) => {
    setExpandedSkills(prev => ({ ...prev, [idx]: !prev[idx] }));
  };


  useEffect(() => {
    async function fetchData() {
      setHero(initialHero);
      setStats(initialStats);
      setWrDetails(initialWrDetails);
      setLoading(false);
      try {
        // 2. Load Extracted Stats from OCR
        let tierData = null;
        const hokMatched = hokHeroes.find(h => (h as Record<string, any>).slug === id || h.id === id);
        const formattedId = hokMatched ? hokMatched.id : id;
        
        const campStats = (campStatsRaw as Record<string, any>)[formattedId];

        if (campStats) {
          tierData = [{
            role: campStats.lane || hokMatched?.role?.[0] || 'ALL',
            tier: campStats.tier,
            win_rate: campStats.win_rate,
            pick_rate: campStats.pick_rate,
            ban_rate: campStats.ban_rate
          }];
        }

        if (tierData) setStats(tierData);

        // サーバーから initialDetails を受け取っている場合は取得済みなので何もしない。
        // （旧実装はここでクライアント fetch + 整形をしていたが、SSR化に伴い
        //   整形ロジックは src/lib/parseHeroSkills.ts に共有化した）
        if (!initialDetails) {
          try {
            const jsonFileName = locale === 'ja' ? 'ja' : 'en';
            const skillsRes = await fetch(`/data/skills/${jsonFileName}.json`);
            if (skillsRes.ok) {
              const skillsData = await skillsRes.json();
              const hokMatch = hokHeroes.find(h => (h as Record<string, any>).slug === id || h.id === id);
              if (hokMatch && skillsData[hokMatch.id]) {
                const parsed = parseHeroSkills(skillsData[hokMatch.id], hokMatch.id, locale);
                setWrDetails((prev: any) => ({ ...prev, ...parsed }));
              }
            }
          } catch (e) {
            console.warn('Failed to load localized skills json', e);
          }
        }
        
      } catch (err) {
        console.warn('Failed to fetch hero details:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id, locale, initialHero, initialStats, initialWrDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Hero not found</h1>
        <Link href="/heroes" className="text-brand-600 hover:underline mt-4 inline-block">← Back to Roster</Link>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'CLASH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'JUNGLE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MID': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'FARM': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'ROAM': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  
  // 奥義かどうかは枠の位置では決まらない。153 蘭陵王と 176 楊貴妃はスキル4を持つが
  // 奥義はスキル3で、スキル4は追加スキル／旋律の切替。データ側の is_ultimate を正とする
  // （scripts/mark_ultimate_skills.js が、レベル表が3段のスキルに印を付けている）。
  const getSkillLabel = (id: string, type?: string, index?: number, isUltimate?: boolean) => {
    if (isUltimate) return locale === 'ja' ? '奥義' : 'Ultimate';
    const raw = String(id || type || '').toUpperCase();
    if (raw.includes('P') || raw.includes('PASSIVE')) return locale === 'ja' ? 'パッシブ' : 'Passive';
    if (raw.includes('Q') || raw.includes('1') || raw.includes('SKILL 1')) return locale === 'ja' ? 'スキル1' : 'Skill 1';
    if (raw.includes('W') || raw.includes('2') || raw.includes('SKILL 2')) return locale === 'ja' ? 'スキル2' : 'Skill 2';
    if (raw.includes('E') || raw.includes('3') || raw.includes('SKILL 3')) return locale === 'ja' ? 'スキル3' : 'Skill 3';
    if (raw.includes('R') || raw.includes('4')) return locale === 'ja' ? 'スキル4' : 'Skill 4';
    if (index === 0) return locale === 'ja' ? 'パッシブ' : 'Passive';
    if (index === 1) return locale === 'ja' ? 'スキル1' : 'Skill 1';
    if (index === 2) return locale === 'ja' ? 'スキル2' : 'Skill 2';
    if (index === 3) return locale === 'ja' ? 'スキル3' : 'Skill 3';
    return type || id || (locale === 'ja' ? 'スキル' : 'Skill');
  };

  const translateSkillTag = (rawTag: string, locale: string) => {
    if (locale !== 'en') return rawTag;
    const tag = rawTag.replace(/[\[\]]/g, '').trim();
    const map: Record<string, string> = {
      '物理': 'Physical',
      '魔法': 'Magic',
      '確定': 'True',
      'バフ': 'Buff',
      'パフ': 'Buff',
      'ハフ': 'Buff',
      'ナーフ': 'Nerf',
      '機動性': 'Mobility',
      '自動効果': 'Passive',
      'パッシブ': 'Passive',
      'アクティブ': 'Active',
      '行動妨害': 'CC',
      '妨害': 'CC',
      'デバフ': 'Debuff',
      'スロウ': 'Slow',
      'ブロック': 'Block',
      '回復': 'Heal',
      'シールド': 'Shield',
      '防御': 'Defense',
      '防御力': 'Defense',
      '範囲ダメージ': 'AoE',
      'バースト': 'Burst',
      'ダッシュ': 'Dash',
      'バリア': 'Barrier',
      'デス耐性': 'Death Resist',
    };
    return map[tag] || tag;
  };

  const translateTableLabel = (label: string, locale: string) => {
    if (locale !== 'en') return label;
    const map: Record<string, string> = {
      'クールダウン': 'Cooldown',
      '基本ダメージ': 'Base Damage',
      '追加ダメージ': 'Bonus Damage',
      '攻撃力': 'AD',
      '魔力': 'AP',
      '体力': 'Health',
      '最大体力': 'Max Health',
      'マナ': 'Mana',
      'マナコスト': 'Mana Cost',
      '防御力': 'Armor',
      '物理防御': 'Armor',
      '魔法防御': 'Magic Resist',
      'ダメージ': 'Damage',
      '最小ダメージ': 'Min Damage',
      '最大ダメージ': 'Max Damage',
      '爆発ダメージ': 'Explosion Damage',
      '移動速度': 'Move Speed',
      '射程': 'Range',
      '射程距離': 'Range',
      '範囲': 'Range',
      '持続時間': 'Duration',
      '効果時間': 'Duration',
      'チャージ時間': 'Charge Time',
      'シールド': 'Shield',
      '回復量': 'Heal Amount',
      '回復': 'Heal',
      'ダメージ反映率': 'Damage Ratio',
      '増加攻撃力': 'Bonus AD',
      'コスト': 'Cost',
      'クローンのダメージ': 'Clone Damage',
      '攻撃速度': 'Attack Speed',
      'ダメージ軽減': 'Damage Reduction',
      'クールダウン短縮': 'Cooldown Reduction',
      '物理防御貫通': 'Armor Pen',
    };
    // 汎用的な置換 (含む場合)
    let translated = map[label];
    if (!translated) {
      translated = label
        .replace('対象の最大体力', 'Target Max HP')
        .replace('対象の現在体力', 'Target Current HP')
        .replace('対象の減少体力', 'Target Missing HP')
        .replace('体力割合ダメージ', 'HP% Damage')
        .replace('ダメージ軽減率', 'Damage Reduction %')
        .replace('%ダメージ', '% Damage')
        .replace('1段目ダメージ', '1st Hit Damage')
        .replace('2段目ダメージ', '2nd Hit Damage');
    }
    return translated || label;
  };

  const translateCooldownText = (text: string, locale: string) => {
    if (locale !== 'en' || !text) return text;
    return text.replace('秒', 's');
  };

  const renderDescriptionWithIcons = (htmlContent: string) => {
    if (!htmlContent) return { __html: '' };

    // 1. Keyword based coloring
    let replaced = formatSkillDescription(htmlContent);
    
    // 改行コードを <br /> に変換
    replaced = replaced.replace(/\n/g, '<br />');
    
    // 2. Icon placeholders
    const isJa = locale === 'ja';
    replaced = replaced.replace(/\[ICON_AD\]/g, `<span class="inline-flex items-center justify-center bg-orange-100 text-orange-600 border border-orange-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '物理攻撃力 (AD)' : 'Physical Attack (AD)'}">⚔️AD</span>`);
    replaced = replaced.replace(/\[ICON_AP\]/g, `<span class="inline-flex items-center justify-center bg-purple-100 text-purple-600 border border-purple-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '魔力 (AP)' : 'Magical Attack (AP)'}">🪄AP</span>`);
    replaced = replaced.replace(/\[ICON_HP\]/g, `<span class="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 border border-emerald-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '体力 (HP)' : 'Health (HP)'}">❤️HP</span>`);
    replaced = replaced.replace(/\[ICON_HASTE\]/g, `<span class="inline-flex items-center justify-center bg-yellow-100 text-yellow-700 border border-yellow-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? 'スキルヘイスト' : 'Cooldown Reduction'}">${isJa ? '⌛ヘイスト' : '⌛CDR'}</span>`);
    replaced = replaced.replace(/\[ICON_CRIT\]/g, `<span class="inline-flex items-center justify-center bg-red-100 text-red-600 border border-red-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? 'クリティカル率' : 'Critical Rate'}">💥Crit</span>`);
    replaced = replaced.replace(/\[ICON_AR\]/g, `<span class="inline-flex items-center justify-center bg-amber-100 text-amber-700 border border-amber-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '物理防御 (AR)' : 'Physical Armor (AR)'}">🛡️AR</span>`);
    replaced = replaced.replace(/\[ICON_MR\]/g, `<span class="inline-flex items-center justify-center bg-blue-100 text-blue-700 border border-blue-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '魔法防御 (MR)' : 'Magic Defense (MR)'}">🛡️MR</span>`);
    replaced = replaced.replace(/\[ICON_LEVEL\]/g, `<span class="inline-flex items-center justify-center bg-slate-200 text-slate-700 border border-slate-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? 'レベルで変動' : 'Scales with Level'}">📈Lv</span>`);
    // 3. English OCR text icons
    replaced = replaced.replace(/physical_damage_icon/g, `<span class="inline-flex items-center justify-center bg-orange-100 text-orange-600 border border-orange-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '物理攻撃力 (AD)' : 'Physical Attack (AD)'}">⚔️AD</span>`);
    replaced = replaced.replace(/magical_damage_icon/g, `<span class="inline-flex items-center justify-center bg-purple-100 text-purple-600 border border-purple-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '魔力 (AP)' : 'Magical Attack (AP)'}">🪄AP</span>`);
    replaced = replaced.replace(/health_icon/g, `<span class="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 border border-emerald-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? '体力 (HP)' : 'Health (HP)'}">❤️HP</span>`);
    replaced = replaced.replace(/cooldown_icon/g, `<span class="inline-flex items-center justify-center bg-yellow-100 text-yellow-700 border border-yellow-300 rounded px-1 mx-0.5 text-[10px] font-black" title="${isJa ? 'スキルヘイスト' : 'Cooldown Reduction'}">${isJa ? '⌛ヘイスト' : '⌛CDR'}</span>`);

    return { __html: replaced };
  };

  // 同じレーンのヒーロー（回遊導線）。camp統計の lane が同じものを
  // Tier順（S>A>B>C）→同Tierは勝率降順で並べ、最大8体出す。自分自身は除く
  const sameLane = (() => {
    const selfId = String(hero.key || hero.id);
    const lane: string | undefined = (campStatsRaw as Record<string, any>)[selfId]?.lane;
    if (!lane) return null;
    const TIER_ORDER: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };
    const mates = Object.entries(campStatsRaw as Record<string, any>)
      .filter(([hid, s]) => s.lane === lane && hid !== selfId)
      .sort(([, a], [, b]) =>
        ((TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9)) || (b.win_rate - a.win_rate))
      .slice(0, 8);
    return mates.length > 0 ? { lane, mates } : null;
  })();

  // モバイル用セクション目次: 詳細ページは縦に非常に長い（7,000px超）ため、
  // 主要セクションへ1タップで移動できるスティッキーなチップナビを出す。
  // デスクトップ(lg)は2カラム＋左カラム固定で全体を見渡せるため不要
  const tocSections = [
    { id: 'counters', label: locale === 'ja' ? '相性' : 'Matchups', show: Boolean(wrDetails?.meta?.synergy || wrDetails?.meta?.counters) },
    { id: 'skills', label: locale === 'ja' ? 'スキル' : 'Skills', show: Boolean(wrDetails?.skills?.length) },
    { id: 'strategy', label: locale === 'ja' ? '立ち回り' : 'Strategy', show: Boolean(wrDetails?.strategy) },
    { id: 'patches', label: locale === 'ja' ? 'パッチ履歴' : 'Patches', show: heroPatches.length > 0 },
    { id: 'same-lane', label: locale === 'ja' ? '同レーン' : 'Same Lane', show: Boolean(sameLane) },
  ].filter(s => s.show);

  return (
    <div className="w-full pb-24 bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* パンくず（BreadcrumbList JSON-LD は page.tsx 側で出力） */}
      <nav aria-label="Breadcrumb" className="px-4 sm:px-0 mb-3 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-brand-600 transition-colors">{locale === 'ja' ? 'ホーム' : 'Home'}</Link>
        <span aria-hidden="true">›</span>
        <Link href="/heroes" className="hover:text-brand-600 transition-colors">{locale === 'ja' ? 'ヒーロー一覧' : 'Heroes'}</Link>
        <span aria-hidden="true">›</span>
        <span className="text-slate-700">{hero?.name}</span>
      </nav>

      {/* セクション目次（モバイル・タブレットのみ） */}
      {tocSections.length >= 2 && (
        <nav
          aria-label={locale === 'ja' ? 'ページ内目次' : 'On this page'}
          className="lg:hidden sticky top-14 md:top-0 z-30 -mx-4 sm:-mx-6 mb-4 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200"
        >
          <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tocSections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold bg-white text-slate-600 border border-slate-200 shadow-xs hover:text-brand-600 hover:border-brand-300 active:scale-95 transition-all"
              >
                {s.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4 px-4 sm:px-0">
          {/* Header Profile Section */}
          <div className="bg-white px-4 pt-6 pb-8 border border-slate-200 rounded-3xl flex flex-col items-center text-center relative shadow-xs">
            <Link href="/heroes" aria-label={locale === 'ja' ? 'ヒーロー一覧に戻る' : 'Back to hero list'} className="absolute top-4 left-4 p-2 text-slate-500 hover:text-slate-700 bg-slate-50 rounded-full active:scale-95 transition-transform">
              <ArrowLeft size={20} />
            </Link>
            {/* 共有ボタン。title はページの <title> と同じ文字列（page.tsx から受け取る）。
                共有先で見出しが揃う。手書きの重複を避けるためここでは組み立てない */}
            <ShareButton
              title={shareTitle || hero.name}
              className="absolute top-4 right-4"
            />
            <div className="relative mt-2">
              <Image 
                src={(hero?.image || `/images/heroes/${id}.webp`)}
                alt={hero.name}
                // ファーストビュー中央にある LCP 候補。lazy のままだと表示が遅れる
                priority
                className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-100 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/images/heroes/default.webp`;
                }}
                width={96} height={96}
              />
            </div>
            {locale !== 'en' && hero.title && (
              <h2 className="text-sm font-bold text-slate-500 mt-4 mb-1">
                {hero.title}
              </h2>
            )}
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
              {hero.name}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-2">
              {stats.length > 0 && stats[0].role !== 'ALL' && (
                <span className={`px-3 py-1 text-[11px] font-black rounded-full border ${getRoleColor(stats[0].role?.toUpperCase())}`}>
                  {laneLabel(stats[0].role)}
                </span>
              )}
              {hero.tags.map(tag => {
                let translatedTag = tag;
                if (tag === 'Fighter') translatedTag = t('role_fighter') || tag;
                if (tag === 'Mage') translatedTag = t('role_mage') || tag;
                if (tag === 'Assassin') translatedTag = t('role_assassin') || tag;
                if (tag === 'Marksman') translatedTag = t('role_marksman') || tag;
                if (tag === 'Tank') translatedTag = t('role_tank') || tag;
                if (tag === 'Support') translatedTag = t('role_support') || tag;

                return (
                  <span key={tag} className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getRoleColor(tag?.toUpperCase())}`}>
                    {translatedTag}
                  </span>
                );
              })}
              {/* ゲーム内の難易度表記（4段階）。対訳と配色は heroDifficulty.ts（一覧のフィルタと共通） */}
              {officialDifficulty && (
                <span className={`px-3 py-1 text-[11px] font-bold rounded-full border ${isDifficultyId(officialDifficulty) ? DIFFICULTY_COLOR[officialDifficulty] : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {locale === 'ja'
                    ? `難易度: ${officialDifficulty}`
                    : `Difficulty: ${difficultyLabel(officialDifficulty, locale)}`}
                </span>
              )}
            </div>
          </div>

          {/* Current Meta Stats */}
          {stats.length > 0 && stats[0].tier && (
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5">
              <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Target size={16} className="text-brand-500" />
                {t('latestMetaStats')}
              </h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                {stats.map((stat, idx) => (
                  <div key={`tier-${idx}`} className="flex flex-col items-center bg-slate-50 border border-slate-100 p-3 rounded-2xl col-span-4 sm:col-span-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border mb-2 ${getRoleColor(stat.role?.toUpperCase())}`}>
                      {laneLabel(stat.role)}
                    </span>
                    <div className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.tier}</div>
                    <span className="text-[10px] font-bold text-slate-500">{locale === 'en' ? 'Tier / Pop' : 'Tier / 人気'}</span>
                  </div>
                ))}
                {stats.map((stat, idx) => (
                  <div key={`wr-${idx}`} className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <div className={`text-lg font-black ${stat.win_rate >= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {stat.win_rate}%
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{locale === 'en' ? 'Win Rate' : '勝率'}</span>
                  </div>
                ))}
                {stats.map((stat, idx) => (
                  <div key={`pr-${idx}`} className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <div className="text-lg font-black text-slate-700">
                      {stat.pick_rate}%
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{locale === 'en' ? 'Pick Rate' : '出現率'}</span>
                  </div>
                ))}
                {stats.map((stat, idx) => (
                  <div key={`br-${idx}`} className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    <div className="text-lg font-black text-slate-700">
                      {stat.ban_rate}%
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{locale === 'en' ? 'Ban Rate' : 'BAN率'}</span>
                  </div>
                ))}
              </div>

              {/* 取得日と、統計取得後にパッチ調整が入ったヒーローへの注記。
                  Tier表にだけ出ていて、同じ数字を出すこのセクションには無かった。
                  同じサイトのパッチノートが后羿の弱体化を伝えながら、后羿のページは
                  調整前の勝率を無注記で出す食い違いが実際に起きていた */}
              <p className="mt-3 text-[11px] text-slate-500 font-medium leading-relaxed">
                {locale === 'ja'
                  ? `${dataFreshness.campStats.sourceJa}の統計（${dataFreshness.campStats.updatedAt}時点）。`
                  : `Statistics from ${dataFreshness.campStats.sourceEn} (as of ${dataFreshness.campStats.updatedAt}). `}
                {/* patchBasisHeroIds は統計を取り直すと空配列になり、その時点で
                    TypeScript の推論が never[] に変わって .includes(string) が型エラーになる。
                    中身は常にヒーローIDの文字列なので string[] として扱う */}
                {(dataFreshness.campStats.patchBasisHeroIds as string[]).includes(numericHeroId) && (
                  <span className="text-amber-700 font-bold">
                    {/* パッチ名は帯を出すヒーロー集合と同じ campStats から取る。
                        skillData.pendingPatch* は「スキルの書き起こしが未了のパッチ」という
                        別の意味なので、書き起こしが終わっても値が残り、ここでは意味がずれる */}
                    {locale === 'ja'
                      ? `このヒーローは${dataFreshness.campStats.patchBasisPatchJa}の調整対象です。上の数値は調整前のものです。`
                      : `This hero is adjusted in ${dataFreshness.campStats.patchBasisPatchEn}; the figures above predate it.`}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* 公式4軸評価: ゲーム内ヒーロー詳細画面の 生存/攻撃/スキル/操作難度（各1〜10）。
              書き起こしの無いヒーローはセクションごと出さない（ダミーで埋めない方針は基本ステータスと同じ）。
              値の無い軸（page.tsx で null に正規化）は行ごと出さない。「未確認」と書いても
              読者には何のことか伝わらないため、空欄を作らずに省く */}
          {hero.gameStats && Object.values(hero.gameStats).some(v => v !== null) && (
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5">
              <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Activity size={16} className="text-brand-500" />
                {locale === 'ja' ? '公式の能力評価' : 'Official Ratings'}
              </h3>
              <div className="space-y-3">
                {[
                  { label: locale === 'ja' ? '生存' : 'Survival', value: hero.gameStats.survival, bar: 'bg-emerald-500' },
                  { label: locale === 'ja' ? '攻撃' : 'Attack', value: hero.gameStats.attack, bar: 'bg-rose-500' },
                  { label: locale === 'ja' ? 'スキル' : 'Skill', value: hero.gameStats.skill, bar: 'bg-blue-500' },
                  { label: locale === 'ja' ? '操作難度' : 'Difficulty', value: hero.gameStats.difficulty, bar: 'bg-amber-500' },
                ].filter(axis => axis.value !== null).map(axis => (
                  <div key={axis.label} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-xs font-bold text-slate-600">{axis.label}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${axis.bar}`}
                        style={{ width: `${(axis.value as number) * 10}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right text-xs font-black text-slate-700 tabular-nums">
                      {axis.value}/10
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500 font-medium leading-relaxed">
                {locale === 'ja'
                  ? 'ゲーム内のヒーロー詳細画面に表示されている公式の評価です。'
                  : 'Official ratings shown on the in-game hero detail screen.'}
              </p>
            </div>
          )}

          {/* Base Stats Section
              実測値のあるヒーローだけ出す。値が無いヒーローは、以前のように既定値で
              埋めるのではなくセクションごと出さない */}
          {(() => {
            const entry = (heroBaseStats as Record<string, HeroBaseStats>)[String(hero?.key || hero?.id || champId)];
            if (!entry) return null;
            const bStats = entry.stats;
            const res = entry.resource;
            // 英語の公式表記が確認できているリソースだけ英訳する。
            // 闘志・鋭気・狂気などは公式グローバル版での呼称が未確認なので、
            // 推測で当てず Resource と出す
            const RESOURCE_EN: Record<string, string> = {
              'MP': 'MP',
              'エネルギー': 'Energy',
              'シャドウパワー': 'Shadow Power',
              'シャドーパワー': 'Shadow Power',
              'シャドー': 'Shadow Power',
            };
            const en = (ja: string) => RESOURCE_EN[ja] || 'Resource';
            // 回復欄の見出しは「5秒ごとの◯◯回復」「毎秒の◯◯回復」「闘志回復」と揃っていない。
            // 英語に直すために、周期と対象を切り分ける
            const regenParts = (label: string) => {
              const m = label.match(/^(毎秒ごとの|毎秒の|(\d+)秒ごとの)?(.+)回復$/);
              if (!m) return { per: '', word: label };
              return { per: m[2] ? ` / ${m[2]}s` : m[1] ? ' / s' : '', word: m[3] };
            };
            // 日本語はゲーム画面の見出しをそのまま出す。ヒーローごとに違い
            // （雲中君「最大オーラ」／曜「エネルギー」／デーヴァラ「電力充満」／
            //  ミーユエは最大シャドーパワーなのに回復は「5秒ごとのシャドー回復」）、
            // 組み立て直すと実機と食い違うため
            const resLabel = !res
              ? ''
              : locale === 'ja'
                ? res.maxLabel || `最大${res.name}`
                : res.maxLabel && !res.maxLabel.startsWith('最大')
                  ? en(res.name)
                  : `Max ${en(res.name)}`;
            const resRegenLabel = !res?.regenLabel
              ? ''
              : locale === 'ja'
                ? res.regenLabel
                : `${en(regenParts(res.regenLabel).word)} Regen${regenParts(res.regenLabel).per}`;
            return (
              <div className="bg-white rounded-3xl shadow-xs border border-slate-200 p-5">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                  <Activity size={17} className="text-brand-600" />
                  {locale === 'ja' ? '基本ステータス (Base Stats)' : 'Base Stats'}
                </h3>
                {/* 全ヒーローの基本ステータス一覧（/heroes/stats）への導線。
                    比べたい読者が一覧の存在に気づけるよう、見出し直下に置く */}
                <Link
                  href="/heroes/stats"
                  className="inline-block mb-3 text-[11px] font-bold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  {locale === 'ja' ? '全ヒーローの基本ステータス一覧・ランキング →' : "Compare all heroes' base stats →"}
                </Link>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {bStats['最大HP'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? '最大HP' : 'Max HP'}</span>
                      <span className="font-black text-slate-800">{bStats['最大HP']}</span>
                    </div>
                  )}
                  {/* リソースはヒーローによって MP・闘志・エネルギー・怒気などに変わる。
                      以前は一律「最大MP」と書いていたため、MPを使わない16体で誤りになっていた */}
                  {res && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{resLabel}</span>
                      <span className="font-black text-slate-800">{res.max}</span>
                    </div>
                  )}
                  {bStats['物理攻撃'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? '物理攻撃' : 'Physical Attack'}</span>
                      <span className="font-black text-slate-800">{bStats['物理攻撃']}</span>
                    </div>
                  )}
                  {bStats['魔法攻撃'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? '魔法攻撃' : 'Magic Attack'}</span>
                      <span className="font-black text-slate-800">{bStats['魔法攻撃']}</span>
                    </div>
                  )}
                  {bStats['物理防御'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? '物理防御' : 'Physical Armor'}</span>
                      <span className="font-black text-slate-800">{bStats['物理防御']}</span>
                    </div>
                  )}
                  {bStats['魔法防御'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? '魔法防御' : 'Magic Defense'}</span>
                      <span className="font-black text-slate-800">{bStats['魔法防御']}</span>
                    </div>
                  )}
                  {bStats['移動速度'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? '移動速度' : 'Movement Speed'}</span>
                      <span className="font-black text-slate-800">{bStats['移動速度']}</span>
                    </div>
                  )}
                  {bStats['攻撃範囲'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? '攻撃範囲' : 'Attack Range'}</span>
                      <span className="font-black text-slate-800">
                        {locale === 'en'
                          ? (bStats['攻撃範囲'] === '近距離' ? 'Melee' : bStats['攻撃範囲'] === '遠距離' ? 'Ranged' : bStats['攻撃範囲'])
                          : bStats['攻撃範囲']}
                      </span>
                    </div>
                  )}
                  {bStats['1秒ごとのHP回復量'] && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{locale === 'ja' ? 'HP回復/秒' : 'HP Regen / s'}</span>
                      <span className="font-black text-slate-800">{bStats['1秒ごとのHP回復量']}</span>
                    </div>
                  )}
                  {res?.regen !== undefined && (
                    <div className="flex justify-between items-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-500 font-bold">{resRegenLabel}</span>
                      <span className="font-black text-slate-800">{res.regen}</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 font-bold mt-3 leading-relaxed">
                  {locale === 'ja'
                    ? 'ゲーム内のヒーロー詳細画面から書き起こした値です。アルカナによる加算分は差し引いています。'
                    : "Transcribed from the in-game hero status screen. Arcana bonuses are excluded."}
                </p>
              </div>
            );
          })()}

          {/* 向いているサモナースペル。対応表で正式名に寄せてから、
              hok_spells.json のアイコン・CD・使いどころを引いて出す。
              データの無い4体はセクションごと出さない（基本ステータスと同じ方針） */}
          {(() => {
            const names = normalizeSummonerSpells(wrDetails?.meta?.summoner_spells);
            if (names.length === 0) return null;

            const picks = names
              .map((n) => (spellsData as SpellRow[]).find((s) => s.japanese_name === n))
              .filter((s): s is SpellRow => Boolean(s));
            if (picks.length === 0) return null;

            return (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                  <Zap size={17} className="text-amber-500" />
                  {locale === 'ja' ? '向いているサモナースペル' : 'Summoner Spells That Fit'}
                </h3>

                <div className="space-y-2.5">
                  {picks.map((spell) => {
                    const guide = SPELL_GUIDE[spell.id]?.[locale === 'ja' ? 'ja' : 'en'];
                    return (
                      <Link
                        key={spell.id}
                        href="/spells"
                        className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-3.5 transition-colors hover:border-amber-300 hover:bg-amber-50"
                      >
                        <Image
                          src={spell.icon}
                          alt=""
                          width={40}
                          height={40}
                          className="h-10 w-10 shrink-0 rounded-xl border border-amber-200/70 bg-slate-900 object-cover"
                        />
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[15px] font-black text-amber-950">
                              {locale === 'ja' ? spell.japanese_name : spell.english_name}
                            </span>
                            <span className="text-[10px] font-black text-amber-700/80">
                              CD {spell.cooldown}s
                            </span>
                          </div>
                          {guide && (
                            <p className="mt-0.5 text-[12px] font-bold leading-snug text-slate-600">
                              {guide.when}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <p className="mt-3 text-[11px] text-slate-500 font-medium leading-relaxed">
                  {locale === 'ja'
                    ? '選ぶ理由はサモナースペル一覧に書いています。1試合に持ち込めるのは1つで、相手の構成によって最適解は変わります。'
                    : 'The reasoning for each is on the summoner spells page. You may only bring one per match, and the best choice shifts with the enemy draft.'}
                </p>
              </div>
            );
          })()}

          {/* 向いているアルカナ構成。arcanaBuilds.ts のロール別の一般解から、
              主ロール（role配列の先頭）に対応する1構成を出す。ヒーロー個別の最適解では
              ないため、その旨をカード内に明記する。マークスマンは2構成あるが、
              攻撃速度型は序盤限定の変化形なのでクリティカル型を既定にする */}
          {(() => {
            // ロール→構成は arcanaBuilds.ts の id で引く（配列の並びに依存しない）
            const ROLE_TO_BUILD_ID: Record<string, ArcanaBuildId> = {
              Marksman: 'marksman-crit',
              Mage: 'mage',
              Assassin: 'assassin',
              Fighter: 'fighter',
              Tank: 'tank-support',
              Support: 'tank-support',
            };
            const mainRole = hero.tags?.[0];
            const buildId = mainRole ? ROLE_TO_BUILD_ID[mainRole] : undefined;
            if (!buildId) return null;
            const build = ARCANA_BUILDS[locale === 'ja' ? 'ja' : 'en'].find(b => b.id === buildId);
            if (!build) return null;

            // 理由文は2〜3文あるので、カードでは先頭の1文だけ出す（全文はアルカナ一覧で読める）
            const reasonSummary = locale === 'ja'
              ? `${build.reason.split('。')[0]}。`
              : `${build.reason.split('. ')[0]}.`;

            // 色の呼び方とドットの配色はアルカナ一覧ページ（arcana/page.tsx）に合わせる
            const colors = [
              { key: 'red', picks: build.red, label: locale === 'ja' ? '赤' : 'Red', dot: 'bg-rose-500' },
              { key: 'blue', picks: build.blue, label: locale === 'ja' ? '青' : 'Blue', dot: 'bg-blue-500' },
              { key: 'green', picks: build.green, label: locale === 'ja' ? '緑' : 'Green', dot: 'bg-emerald-500' },
            ];

            return (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                  <Sparkles size={17} className="text-violet-500" />
                  {locale === 'ja' ? '向いているアルカナ構成' : 'Arcana Build That Fits'}
                </h3>

                <div className="text-[11px] font-black text-slate-500 mb-2">{build.role}</div>
                <div className="space-y-2">
                  {colors.map(col => (
                    <div key={col.key} className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${col.dot}`} />
                      <span className="w-7 shrink-0 text-[11px] font-black text-slate-500">{col.label}</span>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 min-w-0">
                        {col.picks.map((p, pi) => {
                          const entry = ARCANA_BY_NAME[p.name];
                          return (
                            <span key={p.name} className="flex items-center gap-1.5">
                              {pi > 0 && (
                                <span className="text-[11px] font-bold text-slate-400">
                                  {locale === 'ja' ? 'または' : 'or'}
                                </span>
                              )}
                              {/* マスタと突き合わせられたものは押して詳細を開ける。
                                  名前が変わって引けなくなった場合も文字だけは出す */}
                              {entry ? (
                                <button
                                  type="button"
                                  onClick={() => setOpenArcana(entry)}
                                  aria-haspopup="dialog"
                                  className="flex items-center gap-1.5 rounded-lg px-1 py-0.5 hover:bg-white active:scale-95 transition focus-visible:outline-2 focus-visible:outline-brand-500"
                                >
                                  {entry.icon && (
                                    <Image src={entry.icon} alt="" width={28} height={28} className="w-7 h-7 shrink-0" />
                                  )}
                                  <span className="text-[13px] font-black text-slate-800 leading-tight underline decoration-slate-300 underline-offset-2">
                                    {p.name}
                                  </span>
                                </button>
                              ) : (
                                <span className="text-[13px] font-black text-slate-800 leading-tight">{p.name}</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-[12px] font-medium text-slate-600 leading-relaxed">{reasonSummary}</p>
                <p className="mt-2 text-[11px] text-slate-500 font-medium leading-relaxed">
                  {locale === 'ja'
                    ? 'ロール共通のおすすめ構成で、このヒーロー専用に調整したものではありません。'
                    : 'This is a role-wide recommendation, not one tuned for this hero specifically.'}
                </p>
                <Link
                  href="/arcana"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                >
                  {locale === 'ja' ? 'アルカナ一覧で全構成を見る' : 'See every build on the Arcana page'} →
                </Link>
              </div>
            );
          })()}

          {/* 最初に上げるスキル。ゲーム内公式「HoK Camp」の値をそのまま出す */}
          {(() => {
            const firstUpgrade = wrDetails?.meta?.skill_priority?.first_upgrade;
            if (!firstUpgrade) return null;

            // 「スキル2」だけではどれか分からないため、スキル名も併せて出す。
            // parseHeroSkills は各スキルに id: 'skill1' 〜 'skill4' を振っている
            const target = wrDetails?.skills?.find(
              (s: any) => String(s.id ?? '') === `skill${firstUpgrade}`
            );
            const skillLabel = locale === 'ja' ? `スキル${firstUpgrade}` : `Skill ${firstUpgrade}`;
            const skillName = target?.name ? String(target.name).replace(/^(スキル|Skill)\s*\d+\s*[:：]\s*/u, '') : '';

            return (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                  <BookOpen size={17} className="text-brand-600" />
                  {locale === 'ja' ? '最初に上げるスキル' : 'First Skill to Level Up'}
                </h3>

                <div className="bg-brand-50/70 border border-brand-100 p-4 rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-500 block mb-0.5">
                      {locale === 'ja' ? '公式の推奨' : 'Official pick'}
                    </span>
                    <span className="text-base font-black text-brand-950 break-words">
                      {skillLabel}{skillName ? (locale === 'ja' ? `：${skillName}` : `: ${skillName}`) : ''}
                    </span>
                  </div>
                  <div className="w-8 h-8 shrink-0 rounded-xl bg-brand-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {firstUpgrade}
                  </div>
                </div>

                {/* どの公式の、いつ時点の値かを読者に示す */}
                <p className="mt-3 text-[11px] text-slate-500 font-medium leading-relaxed">
                  {locale === 'ja'
                    ? `出典: ${dataFreshness.skillPriority.sourceJa}（${dataFreshness.skillPriority.updatedAt} 取得）。レベル2以降の振り方は状況で変わります。`
                    : `Source: ${dataFreshness.skillPriority.sourceEn} (fetched ${dataFreshness.skillPriority.updatedAt}). What to level after this depends on the matchup.`}
                </p>
              </div>
            );
          })()}

          {/* Counters & Synergies (Official Data & Fallback) */}
          {(() => {
            const metaData = wrDetails?.meta;
            if (!metaData || !(metaData.synergy || metaData.counters)) return null;

            // 掲載するのは、そのヒーローのページに直接書かれている counters（苦手な相手）と
            // synergy（相性の良い味方）だけ。
            // かつて併記していた「有利な相手」は、他ヒーローの counters を逆引きしただけのもので、
            // 件数がそのヒーローの強さではなく「何体から苦手と書かれたか」で決まってしまい、
            // 根拠として読者に示せる中身がなかったため廃止した。
            const pick = (k: 'counters' | 'synergy') =>
              (Array.isArray(metaData?.[k]) ? metaData[k] : []).map((c: any) => String(c.hero_id || c));

            const staticCounteredBy = pick('counters');
            const staticSynergy = pick('synergy');

            const getReason = (cId: string, type: 'counters' | 'synergy') => {
              const list = metaData?.[type];
              if (!Array.isArray(list)) return null;
              return list.find((item: any) => String(item.hero_id) === String(cId))?.reason || null;
            };

            return (
              <div id="counters" className="scroll-mt-28 lg:scroll-mt-8 bg-white rounded-3xl shadow-xs border border-slate-200 p-5">
                <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Users size={16} className="text-brand-500" />
                  {locale === 'ja' ? 'Counters & Synergies (苦手な相手・相性の良い味方)' : 'Counters & Synergies'}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {/* Weak Against / Countered By */}
                  {staticCounteredBy.length > 0 && (
                    <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100/60">
                      <div className="text-xs font-black text-rose-900 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                        <AlertTriangle size={16} className="text-rose-600" /> 
                        {locale === 'ja' ? '苦手な相手 (Countered By)' : 'Countered By'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {staticCounteredBy.map((cId: string, i: number) => {
                          const matchedHero = hokHeroes.find((h: any) => String(h.id) === String(cId));
                          const displayName = matchedHero ? (locale === 'en' && matchedHero.name_en ? matchedHero.name_en : matchedHero.name) : `Hero ${cId}`;
                          const heroImg = matchedHero?.image || `/images/heroes/${cId}.webp`;
                          const reason = getReason(cId, 'counters');
                          return (
                            <Link key={i} href={`/heroes/${getHeroSlug(cId)}`} className="bg-white p-2.5 rounded-xl border border-rose-100 flex items-start gap-3 group hover:border-rose-300 transition-all">
                              <Image src={heroImg} alt={displayName} className="w-10 h-10 rounded-full object-cover border border-rose-200 shrink-0 group-hover:scale-105 transition-transform" onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/heroes/default.webp';
                                }}
                                width={96} height={96}
                              />
                              <div className="flex flex-col flex-1">
                                <span className="text-[12px] font-bold text-slate-800 group-hover:text-rose-600 mb-0.5">{displayName}</span>
                                {reason && <span className="text-[11px] text-slate-600 leading-tight">{reason}</span>}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Best Synergy */}
                  {staticSynergy.length > 0 && (
                    <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100/60">
                      <div className="text-xs font-black text-blue-900 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                        <Shield size={16} className="text-blue-600" /> 
                        {locale === 'ja' ? '相性の良い味方 (Best Synergy)' : 'Best Synergy'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {staticSynergy.map((cId: string, i: number) => {
                          const matchedHero = hokHeroes.find((h: any) => String(h.id) === String(cId));
                          const displayName = matchedHero ? (locale === 'en' && matchedHero.name_en ? matchedHero.name_en : matchedHero.name) : `Hero ${cId}`;
                          const heroImg = matchedHero?.image || `/images/heroes/${cId}.webp`;
                          const reason = getReason(cId, 'synergy');
                          return (
                            <Link key={i} href={`/heroes/${getHeroSlug(cId)}`} className="bg-white p-2.5 rounded-xl border border-blue-100 flex items-start gap-3 group hover:border-blue-300 transition-all">
                              <Image src={heroImg} alt={displayName} className="w-10 h-10 rounded-full object-cover border border-blue-200 shrink-0 group-hover:scale-105 transition-transform" onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/heroes/default.webp';
                                }}
                                width={96} height={96}
                              />
                              <div className="flex flex-col flex-1">
                                <span className="text-[12px] font-bold text-slate-800 group-hover:text-blue-600 mb-0.5">{displayName}</span>
                                {reason && <span className="text-[11px] text-slate-600 leading-tight">{reason}</span>}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 公式の相性データではなく当サイトの解説であることを明記する */}
                <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
                  {locale === 'ja' ? dataFreshness.matchups.noteJa : dataFreshness.matchups.noteEn}
                </p>
              </div>
            );
          })()}

          {/* 公式が出している編成データ。数値は「マッチ率」＝同じチームに揃う頻度であって、
              勝率でも相性の良さでもない。ラベルを取り違えると読者を誤解させるので注意 */}
          {(() => {
            const combos = wrDetails?.meta?.official_team_combos;
            if (!Array.isArray(combos) || combos.length === 0) return null;

            const groups = [2, 3]
              .map(size => ({ size, items: combos.filter((c: any) => c.size === size) }))
              .filter(g => g.items.length > 0);
            if (!groups.length) return null;

            return (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Users size={16} className="text-brand-500" />
                  {locale === 'ja' ? 'よく一緒に選ばれる編成' : 'Frequently Paired With'}
                </h3>

                <div className="space-y-4">
                  {groups.map(group => {
                    // データはマッチ率の降順で入っているため、先頭から取れば上位N件になる
                    const isExpanded = Boolean(expandedComboSizes[group.size]);
                    const hiddenCount = group.items.length - COMBO_VISIBLE_COUNT;
                    const visibleItems = isExpanded ? group.items : group.items.slice(0, COMBO_VISIBLE_COUNT);
                    return (
                    <div key={group.size}>
                      <div className="text-[11px] font-black text-slate-500 mb-2">
                        {locale === 'ja' ? `${group.size}人編成` : `${group.size}-hero team`}
                      </div>
                      <div className="space-y-2" id={`combo-group-${group.size}`}>
                        {visibleItems.map((combo: any, i: number) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0 flex-wrap">
                              {combo.partners.map((pid: string) => {
                                const partner = hokHeroes.find((h: any) => String(h.id) === String(pid));
                                const pName = partner ? (locale === 'en' && partner.name_en ? partner.name_en : partner.name) : `Hero ${pid}`;
                                return (
                                  <Link key={pid} href={`/heroes/${getHeroSlug(pid)}`} className="flex items-center gap-1.5 group">
                                    <Image
                                      src={partner?.image || `/images/heroes/${pid}.webp`}
                                      alt={pName}
                                      width={56} height={56}
                                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/heroes/default.webp'; }}
                                    />
                                    <span className="text-[12px] font-bold text-slate-700 group-hover:text-brand-600">{pName}</span>
                                  </Link>
                                );
                              })}
                            </div>
                            <span className="text-[13px] font-black text-slate-800 shrink-0 tabular-nums">
                              {combo.match_rate}
                            </span>
                          </div>
                        ))}
                      </div>
                      {hiddenCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setExpandedComboSizes(prev => ({ ...prev, [group.size]: !isExpanded }))}
                          aria-expanded={isExpanded}
                          aria-controls={`combo-group-${group.size}`}
                          className="mt-2 w-full rounded-xl border border-slate-200 bg-white py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-50 active:scale-[0.99] transition"
                        >
                          {isExpanded
                            ? (locale === 'ja' ? '上位5件だけ表示する' : 'Show only the top 5')
                            : (locale === 'ja' ? `残り${hiddenCount}件を表示する` : `Show ${hiddenCount} more`)}
                        </button>
                      )}
                    </div>
                    );
                  })}
                </div>

                <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
                  {locale === 'ja'
                    ? `数値は${dataFreshness.teamCombos.sourceJa}が出している「マッチ率」で、その編成が同じチームに揃った試合の割合です（${dataFreshness.teamCombos.updatedAt} 取得）。勝率ではないため、割合が高いほど強いという意味ではありません。`
                    : `The figures are the "match rate" published by ${dataFreshness.teamCombos.sourceEn}: how often these heroes ended up on the same team (fetched ${dataFreshness.teamCombos.updatedAt}). It is not a win rate, so a higher number does not mean a stronger pairing.`}
                </p>
              </div>
            );
          })()}
        </div> {/* End of Left Column */}

        {/* Right Column */}
        <div className="lg:col-span-7 space-y-4 px-4 sm:px-0">

        {/* 人気の装備セット。ゲーム内「推奨セット装備」の人気タブを読み取ったもの。
            集計値なので、上手い人だけが使う構成ほど勝率が高く出る点は下に注記する */}
        {(() => {
          const builds = itemBuilds;
          if (!builds || builds.length === 0) return null;
          return (
            <div id="item-builds" className="scroll-mt-28 lg:scroll-mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider mb-4">
                <ShoppingBag size={16} className="text-brand-500" />
                {locale === 'ja' ? '人気の装備セット' : 'Popular Item Builds'}
              </h3>

              <div className="space-y-4">
                {builds.map((build, bi) => {
                  const spell = build.spell;
                  return (
                    <div key={bi} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <span className="text-[12px] font-black text-slate-700">
                          {locale === 'ja' ? `人気${bi + 1}位` : `#${bi + 1} most used`}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 tabular-nums">
                          {locale === 'ja'
                            ? `勝率 ${build.winRate}% ／ ${build.wins.toLocaleString()}勝`
                            : `${build.winRate}% win rate / ${build.wins.toLocaleString()} wins`}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-start gap-1.5">
                        {build.items.map((item, ii) => (
                          <button
                            key={`${item.id}-${ii}`}
                            type="button"
                            onClick={() => setOpenItem(item)}
                            aria-haspopup="dialog"
                            title={item.name}
                            className="flex w-[52px] shrink-0 flex-col items-center gap-1 rounded-xl p-1 transition hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-brand-500"
                          >
                            {item.icon && (
                              <Image src={item.icon} alt="" width={40} height={40} className="h-10 w-10 rounded-lg" />
                            )}
                            <span className="w-full text-center text-[9px] font-bold leading-tight text-slate-600 line-clamp-2">
                              {item.name}
                            </span>
                          </button>
                        ))}

                        {/* サモナースペルは装備ではないので、区切りを入れて並べる */}
                        {spell && (
                          <>
                            <span className="mx-1 self-center text-slate-300" aria-hidden="true">|</span>
                            <Link
                              href="/spells"
                              title={spell.name}
                              className="flex w-[52px] shrink-0 flex-col items-center gap-1 rounded-xl p-1 transition hover:bg-white active:scale-95"
                            >
                              {spell.icon && (
                                <Image src={spell.icon} alt="" width={40} height={40} className="h-10 w-10 rounded-lg" />
                              )}
                              <span className="w-full text-center text-[9px] font-bold leading-tight text-slate-600 line-clamp-2">
                                {spell.name}
                              </span>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] font-medium leading-relaxed text-slate-500">
                {locale === 'ja'
                  ? `並びはゲーム内の表示のままです。勝率はその構成を使った試合の集計なので、使い手の腕前も混ざります。${dataFreshness.staticData.itemBuilds.updatedAt} 時点。`
                  : `The order matches the in-game display. The win rate covers matches played with that build, so player skill is mixed in. Taken on ${dataFreshness.staticData.itemBuilds.updatedAt}.`}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <Link href="/items" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline">
                  {locale === 'ja' ? 'アイテム一覧で効果を調べる' : 'Look up effects on the Items page'} →
                </Link>
                {/* 「他のヒーローは何を積んでいるか」に移れるようにする */}
                <Link href="/items/usage" className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline">
                  {locale === 'ja' ? '装備の採用率ランキング' : 'Item pick rate rankings'} →
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Skills Section */}
        {wrDetails?.skills && (
          <div id="skills" className="scroll-mt-28 lg:scroll-mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Sword size={16} className="text-brand-500" />
                {t('skills')}
                {/* 書き起こしが追いついていないヒーローだけ、反映待ちであることを明示する。
                    全員分が済むと JSON 側が空配列になり never[] と推論されるため、型を明示する */}
                {(dataFreshness.skillData.pendingHeroIds as string[]).includes(String(hero?.key || hero?.id)) && (
                  <span className="normal-case tracking-normal text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                    {locale === 'ja'
                      ? `${dataFreshness.skillData.pendingPatchJa}の調整は反映待ちです`
                      : `Not yet updated for ${dataFreshness.skillData.pendingPatchEn}`}
                  </span>
                )}
              </h3>
            </div>
            
            <div className="space-y-4">
              {wrDetails.skills.map((skill: any, idx: number) => {
                const isExpanded = expandedSkills[idx] !== undefined ? expandedSkills[idx] : true;
                const activeFormIndex = activeFormIndices[idx] || 0;
                const activeForm = skill.forms && skill.forms.length > 0 ? skill.forms[activeFormIndex] : skill;
                return (
                  <div key={idx} className="flex flex-col bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all">
                    <div 
                      className={`flex gap-3 p-4 cursor-pointer hover:bg-slate-100 transition-colors items-center ${isExpanded ? 'border-b border-slate-100' : ''}`}
                      onClick={() => toggleSkill(idx)}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative group">
                        <Image 
                          src={`/images/skills/${hero?.key || id}_${idx}.webp`}
                          alt={activeForm.name || skill.name || skill.skill_name} 
                          className="w-full h-full object-cover"
                          width={96} height={96}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('/images/skills/')) {
                              target.src = activeForm.icon || skill.icon || (hero?.image || `/images/heroes/${id}.webp`);
                            } else if (!target.src.includes('/images/heroes/') && !target.src.includes('placehold.co')) {
                              target.src = (hero?.image || `/images/heroes/${id}.webp`);
                            } else if (target.src.includes('/images/heroes/')) {
                              target.src = `https://placehold.co/100x100/1e293b/ffffff?text=Skill`;
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded">
                            {getSkillLabel(skill.id, skill.type || skill.skill_type, idx, skill.is_ultimate)}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 truncate">{activeForm.name || activeForm.skill_name || skill.name || skill.skill_name}</h4>
                        </div>
                        {/* 説明文と表は activeForm を見ているので、CDバッジもそちらに揃える。
                            形態ごとにCDが違うスキルが日英とも20件あり（李信の奥義は
                            支配・バーサークが0秒）、skill 固定だと第1形態の値が残り続ける */}
                        {(activeForm.cooldown_text || skill.cooldown_text) && (
                          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                            ⏳ {translateCooldownText(activeForm.cooldown_text || skill.cooldown_text, locale)}
                          </div>
                        )}
                        {skill.tags && skill.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(Array.isArray(skill.tags) ? skill.tags : (typeof skill.tags === 'string' ? skill.tags.split(',').map((t: string) => t.trim()) : [])).map((tag: string, tIdx: number) => (
                              <span key={tIdx} className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded">
                                {translateSkillTag(tag, locale)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                                              <div className="text-slate-400 p-2">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                    
                    {isExpanded && (
                        <div className="p-4 flex flex-col gap-3 bg-white">
                          {skill.forms && skill.forms.length > 1 && (
                            <div className="flex flex-wrap gap-2 mb-2 p-1 bg-slate-100 rounded-full w-fit border border-slate-200">
                              {skill.forms.map((form: any, fIdx: number) => {
                                const isActive = activeFormIndex === fIdx;
                                return (
                                  <button
                                    key={fIdx}
                                    onClick={(e) => { e.stopPropagation(); setActiveFormIndices(prev => ({ ...prev, [idx]: fIdx })); }}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${isActive ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                                  >
                                    {form.form_name || form.name || `Form ${fIdx + 1}`}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div className="text-sm text-slate-600 leading-relaxed font-medium space-y-2" dangerouslySetInnerHTML={renderDescriptionWithIcons(activeForm.description || '')} />

                          {/* rows が空の table オブジェクトを持つスキルが日英で4件ある
                              （楊貴妃skill4・鏡passive・鏡skill3）。オブジェクトは真なので
                              条件に入れないと、見出しだけの空表が出る */}
                          {((activeForm.table || skill.table)?.rows?.length > 0) ? (
                            <div key={`table-${idx}-${activeFormIndex}`} className="mt-2 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 relative">                              <table className="w-full text-xs text-left min-w-max">
                                <thead className="text-slate-400 font-bold border-b border-slate-200">
                                  <tr>
                                    <th className="px-3 py-2 font-bold">{locale === 'ja' ? '詳細' : 'Details'}</th>
                                    {/* 先頭の「詳細」列はこの上で必ず出しているので、データ側に同じ意味の見出し（空文字を含む）が
                                        入っていると1列ずれる。空文字は落とす */}
                                    {(activeForm.table || skill.table).headers.filter((h: string) => String(h).trim() !== '' && String(h).toLowerCase() !== 'details' && String(h) !== '詳細').map((h: string, i: number) => (
                                      <th key={i} className="px-3 py-2 text-center text-slate-500 font-bold">
                                        {h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {(activeForm.table || skill.table).rows && (activeForm.table || skill.table).rows.map((row: any, rIdx: number) => (
                                    <tr key={rIdx}>
                                      <td className="px-3 py-2 bg-white border-r border-slate-100">
                                        <div className="flex items-center gap-2 font-bold text-slate-600">
                                                                                    {translateTableLabel(row.label, locale)}
                                        </div>
                                      </td>
                                      {row.values && Array.isArray(row.values) && row.values.map((v: any, vIdx: number) => {
                                        let displayValue = v;
                                        if (typeof v === 'object' && v !== null) {
                                          displayValue = v.label || v.value || JSON.stringify(v);
                                        }
                                        return (
                                          <td key={vIdx} className="px-3 py-2 text-center font-bold text-slate-700 bg-white">
                                            {displayValue}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}




        {/* 背景設定（lore）の節はここにあったが、skills/*.json に lore キーが無く
            116体すべてで空だったため削除した。載せるならデータを用意してから戻す */}

        {/* Strategy Section */}
        {wrDetails?.strategy && (
          <div id="strategy" className="scroll-mt-28 lg:scroll-mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Compass size={16} className="text-emerald-500" />
              {locale === 'ja' ? '戦術ガイド (Strategy)' : 'Strategy Guide'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                {/* Playstyle: どんなヒーローで、どんな人に向くか */}
                {wrDetails.playstyle && (
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-indigo-800">
                      <Compass size={16} className="text-indigo-500" />
                      {locale === 'ja' ? 'プレイスタイル (Playstyle)' : 'Playstyle'}
                    </div>
                    {wrDetails.playstyle.style && (
                      <p className="text-sm font-medium text-indigo-900/80 leading-relaxed">
                        {wrDetails.playstyle.style}
                      </p>
                    )}
                    {wrDetails.playstyle.suited && (
                      <p className="text-sm font-medium text-indigo-900/80 leading-relaxed mt-2">
                        <span className="font-bold">{locale === 'ja' ? '向いている人: ' : 'Best for: '}</span>
                        {wrDetails.playstyle.suited}
                      </p>
                    )}
                  </div>
                )}

                {/* Combos */}
                {wrDetails.strategy.combos && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-amber-800">
                      <Zap size={16} className="text-amber-500" />
                      {locale === 'ja' ? 'おすすめコンボ (Combos)' : 'Recommended Combos'}
                    </div>
                    {Array.isArray(wrDetails.strategy.combos) ? (
                      <div className="space-y-3">
                        {wrDetails.strategy.combos.map((combo: any, i: number) => (
                          <div key={i} className="bg-white/60 p-3 rounded-xl border border-amber-100/30">
                            {combo.title && <div className="text-xs font-black text-amber-900 mb-1">{combo.title}</div>}
                            {combo.sequence && (
                              <div className="text-xs font-bold text-amber-700 flex items-center flex-wrap gap-1.5">
                                {combo.sequence}
                              </div>
                            )}
                            {combo.description && (
                              <p className="text-sm font-medium text-amber-800/80 mt-1.5 leading-relaxed">
                                {combo.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-bold text-amber-700 leading-relaxed whitespace-pre-wrap">
                        {wrDetails.strategy.combos}
                      </p>
                    )}
                    {/* 公式にコンボのデータは存在しない（HoK Camp が持つのは動画のみ）。
                        読者が公式データと取り違えないよう、出所を欄の中に明記する */}
                    <p className="text-[11px] font-medium text-amber-700/70 mt-3 leading-relaxed">
                      {locale === 'ja' ? dataFreshness.combos.noteJa : dataFreshness.combos.noteEn}
                    </p>
                  </div>
                )}

                {/* Strengths */}
                {(wrDetails.strengths ?? wrDetails.strategy.strengths) && (
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-emerald-800">
                      <Sword size={16} className="text-emerald-500" />
                      {locale === 'ja' ? '強み (Strengths)' : 'Strengths'}
                    </div>
                    {Array.isArray((wrDetails.strengths ?? wrDetails.strategy.strengths)) ? (
                      <ul className="space-y-1.5">
                        {(wrDetails.strengths ?? wrDetails.strategy.strengths).map((str: string, i: number) => (
                          <li key={i} className="text-xs font-bold text-emerald-700 flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm font-bold text-emerald-700 leading-relaxed whitespace-pre-wrap">
                        {(wrDetails.strengths ?? wrDetails.strategy.strengths)}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Weaknesses */}
                {(wrDetails.weaknesses ?? wrDetails.strategy.weaknesses) && (
                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-rose-800">
                      <ShieldAlert size={16} className="text-rose-500" />
                      {locale === 'ja' ? '弱点 (Weaknesses)' : 'Weaknesses'}
                    </div>
                    {Array.isArray((wrDetails.weaknesses ?? wrDetails.strategy.weaknesses)) ? (
                      <ul className="space-y-1.5">
                        {(wrDetails.weaknesses ?? wrDetails.strategy.weaknesses).map((wk: string, i: number) => (
                          <li key={i} className="text-xs font-bold text-rose-700 flex items-start gap-1.5">
                            <span className="text-rose-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{wk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm font-bold text-rose-700 leading-relaxed whitespace-pre-wrap">
                        {(wrDetails.weaknesses ?? wrDetails.strategy.weaknesses)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Early Game */}
              {wrDetails.strategy.earlyGame && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-base font-bold text-slate-800">
                    <Sunrise size={18} className="text-amber-500" />
                    {locale === 'ja' ? '序盤の立ち回り' : 'Early Game Strategy'}
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {wrDetails.strategy.earlyGame}
                  </p>
                </div>
              )}

              {/* Mid Game */}
              {wrDetails.strategy.midGame && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-base font-bold text-slate-800">
                    <Sun size={18} className="text-orange-500" />
                    {locale === 'ja' ? '中盤の立ち回り' : 'Mid Game Strategy'}
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {wrDetails.strategy.midGame}
                  </p>
                </div>
              )}

              {/* Late Game */}
              {wrDetails.strategy.lateGame && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-base font-bold text-slate-800">
                    <Sunset size={18} className="text-purple-500" />
                    {locale === 'ja' ? '終盤の立ち回り' : 'Late Game Strategy'}
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {wrDetails.strategy.lateGame}
                  </p>
                </div>
              )}

              {/* Teamfight */}
              {wrDetails.strategy.teamfight && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-base font-bold text-slate-800">
                    <Users size={18} className="text-brand-500" />
                    {locale === 'ja' ? '集団戦の立ち回り' : 'Teamfight Strategy'}
                  </div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {wrDetails.strategy.teamfight}
                  </p>
                </div>
              )}



            </div>
          </div>
        )}





        {/* Patch History Section: 該当パッチが無いヒーローでは空状態を出さずセクションごと非表示 */}
        {heroPatches.length > 0 && (
        <div id="patches" className="scroll-mt-28 lg:scroll-mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="text-brand-500 text-lg">#</span>
              {t('PatchHistory') || 'Patch History'}
            </h3>
          </div>
          <div className="p-4">
            <PatchTable patches={heroPatches} compact />
          </div>
        </div>
        )}

        {/* 同じレーンのヒーロー: 読み終えた後の回遊導線。並び順は上部で算出済み。
            Tierバッジの配色は TierListClient の序列（S=金 A=翡翠 B/C=石）に合わせる */}
        {sameLane && (() => {
          // 見出しに使うレーン名。Role翻訳（例「クラッシュ (Clash)」）は括弧付きで
          // 文中に置くと読みにくいため、beginnerHeroes.ts と同じ表記を使う。
          // 英語は messages/en.json の Role と同じ
          const LANE_NAME: Record<string, { ja: string; en: string }> = {
            CLASH: { ja: 'クラッシュレーン', en: 'Clash Lane' },
            JUNGLE: { ja: 'ジャングル', en: 'Jungle' },
            MID: { ja: 'ミッドレーン', en: 'Mid Lane' },
            FARM: { ja: 'ファームレーン', en: 'Farm Lane' },
            ROAM: { ja: 'ローム', en: 'Roam' },
          };
          const laneName = LANE_NAME[sameLane.lane]?.[locale === 'ja' ? 'ja' : 'en'] || sameLane.lane;
          return (
            <div id="same-lane" className="scroll-mt-28 lg:scroll-mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Users size={16} className="text-brand-500" />
                {locale === 'ja' ? `同じ${laneName}のヒーロー` : `Other ${laneName} Heroes`}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sameLane.mates.map(([mateId, mateStats]) => {
                  const mate = hokHeroes.find((h: any) => String(h.id) === String(mateId));
                  if (!mate) return null;
                  const mateName = locale === 'en' && mate.name_en ? mate.name_en : mate.name;
                  return (
                    <Link
                      key={mateId}
                      href={`/heroes/${getHeroSlug(mateId)}`}
                      className="flex flex-col items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-2xl p-3 group hover:border-brand-300 transition-all"
                    >
                      <Image
                        src={mate.image || `/images/heroes/${mateId}.webp`}
                        alt={mateName}
                        width={96} height={96}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/heroes/default.webp'; }}
                      />
                      <span className="text-[11px] font-bold text-slate-700 group-hover:text-brand-600 text-center leading-tight">
                        {mateName}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${getTierBadgeStyle(mateStats.tier)}`}>
                        {mateStats.tier}
                      </span>
                    </Link>
                  );
                })}
              </div>
              {/* 並び順（Tier→勝率）の根拠になっている統計の取得日を示す */}
              <StatsFreshnessNote locale={locale} showPatchBasis={false} className="mt-4 pt-3 border-t border-slate-100" />
            </div>
          );
        })()}

        {/* 誤り報告の導線。URLは window ではなく canonical と同じ形で静的に組む
            （SSRとクライアントで href が揺れないようにするため）。
            件名・本文を事前入力し、報告者が書く欄を3つに絞って敷居を下げる */}
        {(() => {
          const pageUrl = `https://hok.hub-game.com/${locale}/heroes/${getHeroSlug(String(hero.key || hero.id))}`;
          const subject = locale === 'ja'
            ? `[誤り報告] ${hero.name}（${pageUrl}）`
            : `[Error report] ${hero.name} (${pageUrl})`;
          const body = locale === 'ja'
            ? '該当箇所：\n\n正しい値：\n\n確認方法：\n'
            : 'Section with the error:\n\nCorrect value:\n\nHow you verified it:\n';
          const mailto = `mailto:contact@hub-game.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          return (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
              <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                {locale === 'ja'
                  ? '掲載内容の誤りに気づいたら、メールで知らせてください。該当箇所・正しい値・確認方法が書いてあると、修正までが速くなります。'
                  : 'Spotted an error on this page? Email us. Naming the section, the correct value, and how you verified it makes the fix faster.'}
              </p>
              <a
                href={mailto}
                className="mt-3 inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Mail size={14} />
                {locale === 'ja' ? 'このページの誤りを報告' : 'Report an error on this page'}
              </a>
            </div>
          );
        })()}
        </div>
      </div>

      {/* スキンギャラリーは 2026-08 に撤去した。
          CN版未公開スキンの掲載と Tencent CDN(gtimg.cn) への直リンクは
          著作権リスクが高くファンサイトの黙認ラインを超えるため、
          表示コードと public/data/skills/ja.json のスキンデータを併せて削除している。 */}

      {/* アルカナの詳細。アルカナ一覧ページには個別URLが無いので、ページを離れずここで読ませる。
          表示項目と配色はアルカナ一覧のカードに合わせている */}
      {openArcana && (() => {
        const style = ARCANA_TYPE_STYLE[openArcana.type] ?? { card: 'bg-slate-50 border-slate-200', name: 'text-slate-900', label: { ja: '', en: '' } };
        const aName = locale === 'en' && openArcana.name_en ? openArcana.name_en : openArcana.name;
        const aStats = stripHtml(locale === 'en' && openArcana.stats_en ? openArcana.stats_en : openArcana.stats);
        return (
          <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => setOpenArcana(null)}
          >
            <div
              ref={arcanaModalRef}
              role="dialog"
              aria-modal="true"
              aria-label={aName}
              tabIndex={-1}
              onKeyDown={arcanaTrapKeyDown}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl outline-none ${style.card}`}
            >
              <div className="flex items-start gap-3">
                {openArcana.icon && (
                  <Image src={openArcana.icon} alt="" width={48} height={48} className="w-12 h-12 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className={`text-lg font-black leading-tight ${style.name}`}>{aName}</h3>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-500">
                    {locale === 'ja'
                      ? `${style.label.ja}アルカナ ／ レベル${openArcana.grade}`
                      : `${style.label.en} arcana / Level ${openArcana.grade}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenArcana(null)}
                  aria-label={locale === 'ja' ? '閉じる' : 'Close'}
                  className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-white/70"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="mt-4 rounded-2xl bg-white/70 px-3.5 py-3 text-[13px] font-bold leading-snug text-slate-700">
                {aStats}
              </p>

              <p className="mt-3 text-[11px] font-medium leading-relaxed text-slate-600">
                {locale === 'ja'
                  ? '数値はレベル5（最大）のものです。'
                  : 'Values are for Level 5 (max).'}
              </p>

              <Link
                href="/arcana"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
              >
                {locale === 'ja' ? 'アルカナ一覧で他のアルカナを見る' : 'See all arcana'} →
              </Link>
            </div>
          </div>
        );
      })()}

      {/* 装備の詳細。アイテム一覧にも個別URLが無いため、アルカナと同じ形でこの場に出す */}
      {openItem && (() => {
        const { name: iName, stats: iStats, passive: iPassive, active: iActive } = openItem;
        return (
          <div
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={() => setOpenItem(null)}
          >
            <div
              ref={itemModalRef}
              role="dialog"
              aria-modal="true"
              aria-label={iName}
              tabIndex={-1}
              onKeyDown={itemTrapKeyDown}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl outline-none"
            >
              <div className="flex items-start gap-3">
                {openItem.icon && (
                  <Image src={openItem.icon} alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-xl" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black leading-tight text-slate-900">{iName}</h3>
                  <p className="mt-0.5 text-[11px] font-bold text-slate-500 tabular-nums">
                    {locale === 'ja'
                      ? `${openItem.price.toLocaleString()}G`
                      : `${openItem.price.toLocaleString()} gold`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenItem(null)}
                  aria-label={locale === 'ja' ? '閉じる' : 'Close'}
                  className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              {iStats && (
                <p className="mt-4 rounded-2xl bg-slate-50 px-3.5 py-3 text-[13px] font-bold leading-snug text-slate-700">
                  {iStats}
                </p>
              )}
              {iPassive && (
                <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-600">{iPassive}</p>
              )}
              {iActive && (
                <p className="mt-2 text-[12px] font-medium leading-relaxed text-slate-600">{iActive}</p>
              )}

              <Link
                href="/items"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
              >
                {locale === 'ja' ? 'アイテム一覧で他の装備を見る' : 'See all items'} →
              </Link>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
