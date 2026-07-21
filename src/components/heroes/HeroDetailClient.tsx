'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Sword, Shield, Zap, Target, Star, Edit3, Save, X, Loader2, ChevronDown, ChevronUp, Activity, Plus, ChevronRight, Compass, BookOpen, ShieldAlert, Sunrise, Sun, Sunset, Users, AlertTriangle } from 'lucide-react';
import { parseLocalizedText, parseVariables, formatSkillDescription } from '@/utils/localization';
import { PatchTable } from '@/components/patches/PatchTable';
import { CounterPickVoting } from '@/components/heroes/CounterPickVoting';

import fallbackStats from '@/data/hero_stats.json';
import hokHeroes from '@/data/hok_heroes.json';
import detailedStatsDataRaw from '@/data/hero_detailed_stats.json';

import campStatsRaw from '@/data/hero_stats_camp.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface HeroDetailData { key?: string;
  id: string;
  name: string;
  search_alias?: string;
  title: string;
  tags: string[];
  gameStats?: {
    survival: number;
    attack: number;
    skill: number;
    difficulty: number | string;
  };
  difficultyJa?: string;
  hero_name_en?: string;
  detailedStats?: Record<string, string | number>;
}

const getHeroSlug = (id: string) => {
  const h = hokHeroes.find((x: any) => x.id === id);
  return (h as any)?.slug || id;
};

export function HeroDetailClient({ id }: { id: string }) {
  const locale = useLocale();
  const t = useTranslations("HeroDetail");
  const r = useTranslations("Role");
  
  const champId = Array.isArray(id) ? id[0] : id;

  const { initialHero, initialStats, initialWrDetails } = useMemo(() => {
    if (!champId) {
      return { initialHero: null, initialStats: [], initialWrDetails: null };
    }

    const hokMatched = hokHeroes.find(h => (h as any).slug === champId || h.id === champId);

    let stats = {
      survivability: 50,
      attackDamage: 50,
      skillEffects: 50,
      difficulty: 50,
    };
    
    if (fallbackStats && typeof fallbackStats === 'object') {
      let heroStat = null;
      if (hokMatched && hokMatched.id) {
        heroStat = (fallbackStats as any)[hokMatched.id];
      } else {
        const champKey = champId.toLowerCase();
        heroStat = (fallbackStats as any)[champKey];
      }
      
      if (heroStat) {
        stats = {
          survivability: heroStat.survivability || 50,
          attackDamage: heroStat.attackDamage || 50,
          skillEffects: heroStat.skillEffects || 50,
          difficulty: heroStat.difficulty || 50,
        };
      }
    }

    let fallbackName = champId;
    let fallbackRole = 'Mage';
    
    const champDetail: HeroDetailData = {
      id: champId,
      key: hokMatched?.id,
      name: hokMatched ? (locale === 'en' && hokMatched.name_en ? hokMatched.name_en : hokMatched.name) : fallbackName,
      search_alias: hokMatched ? (hokMatched as any).search_alias : undefined,
      title: hokMatched?.title || 'Honor of Kings Hero',
      tags: hokMatched?.role || [fallbackRole],
      gameStats: {
        survival: stats.survivability / 100,
        attack: stats.attackDamage / 100,
        skill: stats.skillEffects / 100,
        difficulty: stats.difficulty / 100
      },
      hero_name_en: hokMatched ? hokMatched.name_en : champId,
      detailedStats: hokMatched?.id ? (detailedStatsDataRaw as Record<string, Record<string, string | number>>)[hokMatched.id] : undefined
    };

    const wrDet = {
      hero_id: champId,
      skills: [],
      lore: "",
      strategy: null,
      meta: null
    };

    return {
      initialHero: champDetail,
      initialStats: [stats],
      initialWrDetails: wrDet
    };
  }, [champId, locale]);
  
  const [hero, setHero] = useState<HeroDetailData | null>(initialHero);
  const [stats, setStats] = useState<any[]>(initialStats);
  const [wrDetails, setWrDetails] = useState<any>(initialWrDetails);
  const [staticCounters, setStaticCounters] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // インライン編集用のステート
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkills, setEditingSkills] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false, 3: false, 4: false });
  const [activeFormIndices, setActiveFormIndices] = useState<Record<number, number>>({});
  const [selectedSkin, setSelectedSkin] = useState<any>(null);

  const toggleSkill = (idx: number) => {
    setExpandedSkills(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' || 
       window.location.hostname.startsWith('192.168.'));
    setIsDevelopment(isLocal);
  }, []);

  const toggleEditMode = () => {
    if (!isEditing) {
      if (wrDetails?.skills && wrDetails.skills.length > 0) {
        setEditingSkills(JSON.parse(JSON.stringify(wrDetails.skills)));
      } else {
        setEditingSkills([
          { id: 'P', name: '', description: '', cooldown_text: '', table: null },
          { id: 'Q', name: '', description: '', cooldown_text: '', table: null },
          { id: 'W', name: '', description: '', cooldown_text: '', table: null },
          { id: 'E', name: '', description: '', cooldown_text: '', table: null },
          { id: 'R', name: '', description: '', cooldown_text: '', table: null },
        ]);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSkillChange = (index: number, field: string, value: any) => {
    const updated = [...editingSkills];
    updated[index][field] = value;
    setEditingSkills(updated);
  };

  const handleTableToggle = (index: number) => {
    const updated = [...editingSkills];
    if (updated[index].table) {
      updated[index].table = null;
    } else {
      updated[index].table = { headers: ['LV 1', 'LV 2', 'LV 3', 'LV 4', 'LV 5', 'LV 6'], rows: [{ label: '新規', values: ['0', '0', '0', '0', '0', '0'] }] };
    }
    setEditingSkills(updated);
  };

  const handleTableHeaderChange = (skillIndex: number, headerIndex: number, value: string) => {
    const updated = [...editingSkills];
    if (updated[skillIndex].table) {
      updated[skillIndex].table!.headers[headerIndex] = value;
      setEditingSkills(updated);
    }
  };

  const handleTableLabelChange = (skillIndex: number, rowIndex: number, value: string) => {
    const updated = [...editingSkills];
    if (updated[skillIndex].table) {
      updated[skillIndex].table!.rows[rowIndex].label = value;
      setEditingSkills(updated);
    }
  };

  const handleTableValueChange = (skillIndex: number, rowIndex: number, colIndex: number, value: string) => {
    const updated = [...editingSkills];
    if (updated[skillIndex].table) {
      updated[skillIndex].table!.rows[rowIndex].values[colIndex] = value;
      setEditingSkills(updated);
    }
  };

  const handleAddTableRow = (skillIndex: number) => {
    const updated = [...editingSkills];
    if (updated[skillIndex].table) {
      const colCount = updated[skillIndex].table!.headers.length;
      updated[skillIndex].table!.rows.push({ label: '新規', values: Array(colCount).fill('0') });
      setEditingSkills(updated);
    }
  };
  
  const handleRemoveTableRow = (skillIndex: number, rowIndex: number) => {
    const updated = [...editingSkills];
    if (updated[skillIndex].table) {
      updated[skillIndex].table!.rows.splice(rowIndex, 1);
      setEditingSkills(updated);
    }
  };

  const handleSaveSkills = async () => {
    if (!confirm('変更を保存し、他の言語にも自動翻訳を適用しますか？\n（処理には10〜20秒ほどかかります）')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: '', // ローカル開発環境ではAPI側でスキップされる
          heroId: id,
          updatedSkills: editingSkills
        })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setWrDetails({...wrDetails, skills: editingSkills});
        setIsEditing(false);
        alert(data.message || '保存と自動翻訳が完了しました！');
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (err: any) {
      alert(`通信エラー: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setHero(initialHero);
      setStats(initialStats);
      setWrDetails(initialWrDetails);
      setLoading(false);
      try {
        let langCode = 'en_US';
        switch (locale) {
          case 'ja': langCode = 'ja_JP'; break;
          case 'ko': langCode = 'ko_KR'; break;
          case 'vi': langCode = 'vn_VN'; break;
          case 'zh-TW': langCode = 'zh_TW'; break;
          default: langCode = 'en_US'; break;
        }
        

        
        // 2. Load Extracted Stats from OCR
        let tierData = null;
        const hokMatched = hokHeroes.find(h => (h as any).slug === id || h.id === id);
        let formattedId = hokMatched ? hokMatched.id : id;
        
        let campStats = (campStatsRaw as any)[formattedId];

        if (campStats) {
          tierData = [{
            role: campStats.lane || hokMatched?.role?.[0] || 'ALL',
            tier: campStats.tier,
            win_rate: campStats.win_rate,
            pick_rate: campStats.pick_rate,
            ban_rate: campStats.ban_rate
          }];
        }
          
        // 3. Fetch WR specific details (Disabled for local JSON project)
        const detailsData = null as any; // await supabase.from('wr_hero_details').select('*').eq('hero_id', id).single();

        // 4. Parse localized dictionary IDs and variables in skills
        if (detailsData && detailsData.skills) {
          let targetSkillsArray = [];
          let variables = {};

          // 新しい多言語フォーマット（オブジェクト）か、古いフォーマット（配列）かを判定
          if (Array.isArray(detailsData.skills)) {
            // 旧フォーマット (日本語のみ)
            targetSkillsArray = detailsData.skills;
          } else {
            // 新フォーマット { ja: [], en: [], variables: {} }
            const langKey = langCode.split('_')[0]; // 'ja' or 'en'
            targetSkillsArray = detailsData.skills[langKey] || detailsData.skills['en'] || detailsData.skills['ja'] || [];
            variables = detailsData.skills.variables || {};
          }

          const parsedSkills = await Promise.all(targetSkillsArray.map(async (skill: any) => {
            // 1. 変数の置換 ({var} -> 100)
            const withVars = parseVariables(skill.description, variables);
            // 2. 辞書の置換 ([item_123] -> B.F. Sword)
            const withDict = await parseLocalizedText(withVars, langCode);
            return {
              ...skill,
              description: withDict
            };
          }));
          detailsData.skills = parsedSkills;
        }


        if (tierData) setStats(tierData);
        if (detailsData) setWrDetails(detailsData);
        

        try {
          // ロケールに応じて読み込むJSONファイルを切り替える
          const jsonFileName = locale === 'ja' ? 'ja' : 
                               locale === 'ko' ? 'ko' : 
                               locale === 'vi' ? 'vi' : 
                               locale === 'zh-TW' ? 'zh-TW' : 'en';
          
          const skillsRes = await fetch(`/data/skills/${jsonFileName}.json?t=${Date.now()}`);
          if (skillsRes.ok) {
            const skillsData = await skillsRes.json();
            let skillKey = null;
            const hokMatch = hokHeroes.find(h => (h as any).slug === id || h.id === id);
            if (hokMatch && skillsData[hokMatch.id]) {
              skillKey = hokMatch.id;
            }
            if (skillKey) {
              const rawData = skillsData[skillKey];
              let parsedAsyncSkills: any[] = [];
              if (Array.isArray(rawData)) {
                parsedAsyncSkills = rawData;
              } else if (Array.isArray(rawData.skills)) {
                parsedAsyncSkills = rawData.skills;
              } else if (rawData.passive || rawData.skill1) {
                if (rawData.passive) parsedAsyncSkills.push({ id: 'P', ...rawData.passive });
                if (rawData.skill1) parsedAsyncSkills.push({ id: 'skill1', ...rawData.skill1 });
                if (rawData.skill2) parsedAsyncSkills.push({ id: 'skill2', ...rawData.skill2 });
                if (rawData.skill3) parsedAsyncSkills.push({ id: 'skill3', ...rawData.skill3 });
                if (rawData.skill4) parsedAsyncSkills.push({ id: 'skill4', ...rawData.skill4 });
              }
              setWrDetails((prev: any) => ({
                ...prev,
                skills: parsedAsyncSkills,
                lore: rawData.lore || prev?.lore || "",
                strategy: rawData.strategy || prev?.strategy || "",
                meta: rawData.meta || prev?.meta || null,
                skins: rawData.skins || []
              }));
            }
          }
        } catch (e) {
          console.warn('Failed to load localized skills json', e);
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
  }, [id, locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Hero not found</h1>
        <Link href="/heroes" className="text-indigo-600 hover:underline mt-4 inline-block">← Back to Roster</Link>
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

  const renderProgressBar = (value: number, colorClass: string) => {
    return (
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${(value / 10) * 100}%` }}></div>
      </div>
    );
  };

  const getSkillLabel = (id: string) => {
    switch (id) {
      case 'P': return 'Passive';
      case 'Q': return 'Skill 1';
      case 'W': return 'Skill 2';
      case 'E': return 'Skill 3';
      case 'R': return 'Ult';
      default: return id;
    }
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
    replaced = replaced.replace(/\[ICON_AD\]/g, '<span class="inline-flex items-center justify-center bg-orange-100 text-orange-600 border border-orange-300 rounded px-1 mx-0.5 text-[10px] font-black" title="物理攻撃力 (AD)">⚔️AD</span>');
    replaced = replaced.replace(/\[ICON_AP\]/g, '<span class="inline-flex items-center justify-center bg-purple-100 text-purple-600 border border-purple-300 rounded px-1 mx-0.5 text-[10px] font-black" title="魔力 (AP)">🪄AP</span>');
    replaced = replaced.replace(/\[ICON_HP\]/g, '<span class="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 border border-emerald-300 rounded px-1 mx-0.5 text-[10px] font-black" title="体力 (HP)">❤️HP</span>');
    replaced = replaced.replace(/\[ICON_HASTE\]/g, '<span class="inline-flex items-center justify-center bg-yellow-100 text-yellow-700 border border-yellow-300 rounded px-1 mx-0.5 text-[10px] font-black" title="スキルヘイスト">⌛ヘイスト</span>');
    replaced = replaced.replace(/\[ICON_CRIT\]/g, '<span class="inline-flex items-center justify-center bg-red-100 text-red-600 border border-red-300 rounded px-1 mx-0.5 text-[10px] font-black" title="クリティカル率">💥Crit</span>');
    replaced = replaced.replace(/\[ICON_AR\]/g, '<span class="inline-flex items-center justify-center bg-amber-100 text-amber-700 border border-amber-300 rounded px-1 mx-0.5 text-[10px] font-black" title="物理防御 (AR)">🛡️AR</span>');
    replaced = replaced.replace(/\[ICON_MR\]/g, '<span class="inline-flex items-center justify-center bg-blue-100 text-blue-700 border border-blue-300 rounded px-1 mx-0.5 text-[10px] font-black" title="魔法防御 (MR)">🛡️MR</span>');
    replaced = replaced.replace(/\[ICON_LEVEL\]/g, '<span class="inline-flex items-center justify-center bg-slate-200 text-slate-700 border border-slate-300 rounded px-1 mx-0.5 text-[10px] font-black" title="レベルで変動">📈Lv</span>');
    
    return { __html: replaced };
  };

  return (
    <main className="pb-24 bg-slate-50 min-h-screen lg:py-8 lg:px-6">
      <div className="lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 lg:space-y-4">
          {/* Header Profile Section */}
          <div className="bg-white px-4 pt-6 pb-8 border-b lg:border lg:rounded-3xl border-slate-200 flex flex-col items-center text-center relative shadow-sm">
        <Link href="/heroes" className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full active:scale-95 transition-transform">
          <ArrowLeft size={20} />
        </Link>
        <div className="relative mt-2">
          <img 
            src={`/images/heroes/${hero.key || id}.jpg`}
            alt={hero.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-100 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/images/heroes/default.png`;
            }}
          />
        </div>
        {locale !== 'en' && <h2 className="text-sm font-bold text-slate-500 mt-4 mb-1">{hero.title}</h2>}
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
          {hero.search_alias && hero.search_alias !== hero.name ? (
            <ruby>
              {hero.name}
              <rt className="text-[11px] font-bold text-slate-400 mb-1 tracking-normal">{hero.search_alias}</rt>
            </ruby>
          ) : (
            hero.name
          )}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2">
          {stats.length > 0 && stats[0].role !== 'ALL' && (
            <span className={`px-3 py-1 text-[11px] font-black rounded-full border ${getRoleColor(stats[0].role?.toUpperCase())}`}>
              {stats[0].role === 'CLASH' ? r('clash') :
               stats[0].role === 'JUNGLE' ? r('jungle') :
               stats[0].role === 'MID' ? r('mid') :
               stats[0].role === 'FARM' ? r('farm') :
               stats[0].role === 'ROAM' ? r('roam') : stats[0].role}
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
        </div>
        </div>

        <div className="px-4 mt-4 lg:px-0 lg:mt-0">
          {/* Current Meta Stats */}
        {stats.length > 0 && stats[0].tier && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Target size={16} className="text-indigo-500" />
              {t('latestMetaStats')}
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              {stats.map((stat, idx) => (
                <div key={`tier-${idx}`} className="flex flex-col items-center bg-slate-50 border border-slate-100 p-3 rounded-2xl col-span-4 sm:col-span-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border mb-2 ${getRoleColor(stat.role?.toUpperCase())}`}>
                    {stat.role}
                  </span>
                  <div className="text-2xl font-black text-slate-800 leading-none mb-1">{stat.tier}</div>
                  <span className="text-[10px] font-bold text-slate-400">{locale === 'en' ? 'Tier / Pop' : 'Tier / 人気'}</span>
                </div>
              ))}
              {stats.map((stat, idx) => (
                <div key={`wr-${idx}`} className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <div className={`text-lg font-black ${stat.win_rate >= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {stat.win_rate}%
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{locale === 'en' ? 'Win Rate' : '勝率'}</span>
                </div>
              ))}
              {stats.map((stat, idx) => (
                <div key={`pr-${idx}`} className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <div className="text-lg font-black text-slate-700">
                    {stat.pick_rate}%
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{locale === 'en' ? 'Pick Rate' : '出現率'}</span>
                </div>
              ))}
              {stats.map((stat, idx) => (
                <div key={`br-${idx}`} className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <div className="text-lg font-black text-slate-700">
                    {stat.ban_rate}%
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{locale === 'en' ? 'Ban Rate' : 'Ban率'}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div> {/* End of Left Column */}

      {/* Right Column */}
      <div className="lg:col-span-8 space-y-4 px-4 mt-4 lg:px-0 lg:mt-0">
        {/* Skills Section */}
        {wrDetails?.skills && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Sword size={16} className="text-indigo-500" />
                {t('skills')}
              </h3>
              {isDevelopment && locale === 'ja' && (
                <div className="flex items-center">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={toggleEditMode} disabled={isSaving} className="p-2 text-slate-400 bg-slate-100 rounded-full">
                        <X size={14} />
                      </button>
                      <button onClick={handleSaveSkills} disabled={isSaving} className="p-2 text-white bg-indigo-600 rounded-full">
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      </button>
                    </div>
                  ) : (
                    <button onClick={toggleEditMode} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                      編集
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {(isEditing ? editingSkills : wrDetails.skills).map((skill: any, idx: number) => {
                const isExpanded = expandedSkills[idx] || isEditing;
                const activeFormIndex = activeFormIndices[idx] || 0;
                const activeForm = skill.forms && skill.forms.length > 0 ? skill.forms[activeFormIndex] : skill;
                const isVerticalTabs = hero?.key === 'hero_110' || id === 'hero_110';
                
                return (
                  <div key={idx} className="flex flex-col bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all">
                    <div 
                      className={`flex gap-3 p-4 cursor-pointer hover:bg-slate-100 transition-colors items-center ${isExpanded ? 'border-b border-slate-100' : ''}`}
                      onClick={() => !isEditing && toggleSkill(idx)}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200 relative group">
                        <img 
                          src={`/images/skills/${hero?.key || id}_${idx}.png`} 
                          alt={activeForm.name || skill.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('/images/skills/')) {
                              target.src = activeForm.icon || skill.icon || `/images/heroes/${hero?.key || id}.jpg`;
                            } else if (!target.src.includes('/images/heroes/') && !target.src.includes('placehold.co')) {
                              target.src = `/images/heroes/${hero?.key || id}.jpg`;
                            } else if (target.src.includes('/images/heroes/')) {
                              target.src = `https://placehold.co/100x100/1e293b/ffffff?text=Skill`;
                            }
                          }}
                        />
                        {isEditing && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <input 
                              type="text"
                              value={skill.icon || ''}
                              onChange={(e) => handleSkillChange(idx, 'icon', e.target.value)}
                              className="w-[90%] text-[8px] p-1 bg-white text-black rounded"
                              placeholder="URL"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded">
                            {getSkillLabel(skill.id)}
                          </span>
                          {isEditing ? (
                            <input type="text" value={skill.name} onChange={(e) => handleSkillChange(idx, 'name', e.target.value)} className="text-base font-bold text-slate-800 border-b border-indigo-400 focus:outline-none w-full" onClick={(e) => e.stopPropagation()} />
                          ) : (
                            <h4 className="text-base font-bold text-slate-900 truncate">{skill.name}</h4>
                          )}
                        </div>
                        {skill.cooldown_text && (
                          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                            ⏳ {translateCooldownText(skill.cooldown_text, locale)}
                          </div>
                        )}
                        {skill.tags && skill.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skill.tags.map((tag: string, tIdx: number) => (
                              <span key={tIdx} className="px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded">
                                {translateSkillTag(tag, locale)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="text-slate-400 p-2">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      )}
                    </div>
                    
                    {isExpanded && (
                        <div className="p-4 flex flex-col gap-3 bg-white">
                          {!isEditing && skill.forms && skill.forms.length > 1 && (
                            <div className={isVerticalTabs ? "flex flex-col gap-1 bg-slate-100/80 p-1.5 rounded-xl w-fit mb-4" : "flex flex-wrap gap-2 mb-2 p-1 bg-slate-100 rounded-full w-fit border border-slate-200"}>
                              {skill.forms.map((form: any, fIdx: number) => {
                                const isActive = activeFormIndex === fIdx;
                                return (
                                  <button
                                    key={fIdx}
                                    onClick={(e) => { e.stopPropagation(); setActiveFormIndices(prev => ({ ...prev, [idx]: fIdx })); }}
                                    className={isVerticalTabs
                                      ? `w-full text-left px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${isActive ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`
                                      : `px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${isActive ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`
                                    }
                                  >
                                    {form.form_name}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {isEditing ? (
                            <>
                              {skill.forms && skill.forms.length > 0 && (
                                <div className="flex items-center gap-2 text-xs mb-2">
                                  <span className="text-slate-500 font-bold whitespace-nowrap">専用アイコンURL:</span>
                                  <input 
                                    type="text" 
                                    value={activeForm.icon || ''} 
                                    onChange={(e) => {
                                      const updatedForms = [...skill.forms];
                                      updatedForms[activeFormIndex] = { ...updatedForms[activeFormIndex], icon: e.target.value };
                                      handleSkillChange(idx, 'forms', updatedForms);
                                    }} 
                                    className="w-full bg-slate-50 border-b border-indigo-300 focus:outline-none p-1" 
                                    placeholder="任意（空ならメインアイコン）"
                                  />
                                </div>
                              )}
                              <textarea value={activeForm.description || skill.description || ''} onChange={(e) => {
                                if (skill.forms && skill.forms.length > 0) {
                                  const updatedForms = [...skill.forms];
                                  updatedForms[activeFormIndex] = { ...updatedForms[activeFormIndex], description: e.target.value };
                                  handleSkillChange(idx, 'forms', updatedForms);
                                } else {
                                  handleSkillChange(idx, 'description', e.target.value);
                                }
                              }} className="w-full text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-indigo-300 focus:outline-none min-h-[100px]" />
                            </>
                          ) : (
                            <div className="text-sm text-slate-600 leading-relaxed font-medium space-y-2" dangerouslySetInnerHTML={renderDescriptionWithIcons(activeForm.description || '')} />
                          )}

                          {activeForm.table ? (
                            <div className="mt-2 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50 relative">
                              {isEditing && (
                                <div className="flex gap-2 p-2 bg-slate-100 border-b border-slate-200">
                                  <button onClick={() => handleAddTableRow(idx)} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"><Plus size={12}/> {locale === 'ja' ? '行追加' : 'Add Row'}</button>
                                  <button onClick={() => handleTableToggle(idx)} className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"><X size={12}/> {locale === 'ja' ? '表を削除' : 'Remove Table'}</button>
                                </div>
                              )}
                              <table className="w-full text-xs text-left min-w-max">
                                <thead className="text-slate-400 font-bold border-b border-slate-200">
                                  <tr>
                                    <th className="px-3 py-2 font-bold">{locale === 'ja' ? '詳細' : 'Details'}</th>
                                    {activeForm.table.headers.map((h: string, i: number) => (
                                      <th key={i} className="px-3 py-2 text-center text-slate-500 font-bold">
                                        {isEditing ? <input type="text" value={h} onChange={(e) => handleTableHeaderChange(idx, i, e.target.value)} className="w-12 text-center border-b border-indigo-200 bg-transparent focus:outline-none" /> : h}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {activeForm.table.rows && activeForm.table.rows.map((row: any, rIdx: number) => (
                                    <tr key={rIdx}>
                                      <td className="px-3 py-2 font-bold text-slate-600 bg-white border-r border-slate-100 flex items-center gap-2">
                                        {isEditing && <button onClick={() => handleRemoveTableRow(idx, rIdx)} className="text-red-400 hover:text-red-600"><X size={14}/></button>}
                                        {isEditing ? <input type="text" value={row.label} onChange={(e) => handleTableLabelChange(idx, rIdx, e.target.value)} className="w-24 border-b border-indigo-200 bg-transparent focus:outline-none" /> : translateTableLabel(row.label, locale)}
                                      </td>
                                      {row.values && row.values.map((v: string, vIdx: number) => (
                                        <td key={vIdx} className="px-3 py-2 text-center font-bold text-slate-700 bg-white">
                                          {isEditing ? <input type="text" value={v} onChange={(e) => handleTableValueChange(idx, rIdx, vIdx, e.target.value)} className="w-10 text-center border-b border-indigo-200 bg-transparent focus:outline-none" /> : v}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            isEditing && !skill.forms && (
                              <button onClick={() => handleTableToggle(idx)} className="mt-2 bg-indigo-50 border border-indigo-200 text-indigo-600 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 w-fit hover:bg-indigo-100 transition-colors">
                                <Plus size={14} /> {locale === 'ja' ? 'ダメージ表を追加' : 'Add Damage Table'}
                              </button>
                            )
                          )}
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}




        {/* Lore Section */}
        {wrDetails?.lore && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Star size={16} className="text-amber-500" />
              {locale === 'ja' ? '背景設定 (Lore)' : 'Lore'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
              {wrDetails.lore}
            </p>
          </div>
        )}

        {/* Strategy Section */}
        {wrDetails?.strategy && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Compass size={16} className="text-emerald-500" />
              {locale === 'ja' ? '戦術ガイド (Strategy)' : 'Strategy Guide'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
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
                  </div>
                )}

                {/* Strengths */}
                {wrDetails.strategy.strengths && (
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-emerald-800">
                      <Sword size={16} className="text-emerald-500" />
                      {locale === 'ja' ? '強み (Strengths)' : 'Strengths'}
                    </div>
                    {Array.isArray(wrDetails.strategy.strengths) ? (
                      <ul className="space-y-1.5">
                        {wrDetails.strategy.strengths.map((str: string, i: number) => (
                          <li key={i} className="text-xs font-bold text-emerald-700 flex items-start gap-1.5">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm font-bold text-emerald-700 leading-relaxed whitespace-pre-wrap">
                        {wrDetails.strategy.strengths}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Weaknesses */}
                {wrDetails.strategy.weaknesses && (
                  <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold text-rose-800">
                      <ShieldAlert size={16} className="text-rose-500" />
                      {locale === 'ja' ? '弱点 (Weaknesses)' : 'Weaknesses'}
                    </div>
                    {Array.isArray(wrDetails.strategy.weaknesses) ? (
                      <ul className="space-y-1.5">
                        {wrDetails.strategy.weaknesses.map((wk: string, i: number) => (
                          <li key={i} className="text-xs font-bold text-rose-700 flex items-start gap-1.5">
                            <span className="text-rose-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{wk}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm font-bold text-rose-700 leading-relaxed whitespace-pre-wrap">
                        {wrDetails.strategy.weaknesses}
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
                    <Users size={18} className="text-indigo-500" />
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


        {/* Meta Guide Section */}
        {wrDetails?.meta && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Zap size={16} className="text-yellow-500" />
              {locale === 'ja' ? 'おすすめサモナースペル' : 'Summoner Spells'}
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {wrDetails.meta.summoner_spells?.map((spell: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-yellow-50 text-yellow-800 border border-yellow-200 text-xs font-bold rounded-lg shadow-sm">
                  {spell}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Synergy */}
              {wrDetails.meta.synergy && wrDetails.meta.synergy.length > 0 && (
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center gap-2 mb-3 text-sm font-bold text-blue-800">
                    <Shield size={16} className="text-blue-500" />
                    {locale === 'ja' ? '相性の良い味方 (Synergy)' : 'Best Synergy'}
                  </div>
                  <div className="space-y-3">
                    {wrDetails.meta.synergy.map((syn: any, i: number) => {
                      const matchedHero = syn.hero_id ? hokHeroes.find(h => h.id === syn.hero_id) : null;
                      const displayName = matchedHero ? (locale === 'en' && matchedHero.name_en ? matchedHero.name_en : matchedHero.name) : syn.hero_name;
                      return (
                        <div key={i} className="flex gap-3 items-start">
                          {syn.hero_id ? (
                            <Link href={`/heroes/${getHeroSlug(syn.hero_id)}` as any} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                              <img 
                                src={`/images/heroes/${syn.hero_id}.jpg`}
                                alt={displayName}
                                className="w-10 h-10 rounded-full border border-blue-200 object-cover shadow-sm hover:shadow-md transition-shadow"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `/images/heroes/default.png`;
                                }}
                              />
                            </Link>
                          ) : (
                            <img 
                              src={`/images/heroes/default.png`}
                              alt={displayName}
                              className="w-10 h-10 rounded-full border border-blue-200 object-cover flex-shrink-0 shadow-sm"
                            />
                          )}
                          <div>
                            {syn.hero_id ? (
                              <Link href={`/heroes/${getHeroSlug(syn.hero_id)}` as any} className="text-xs font-black text-slate-800 hover:text-blue-600 hover:underline transition-colors">
                                {displayName}
                              </Link>
                            ) : (
                              <div className="text-xs font-black text-slate-800">{displayName}</div>
                            )}
                            <div className="text-[11px] font-medium text-slate-600 leading-relaxed mt-0.5">{syn.reason}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Counters */}
              {wrDetails.meta.counters && wrDetails.meta.counters.length > 0 && (
                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50">
                  <div className="flex items-center gap-2 mb-3 text-sm font-bold text-rose-800">
                    <Target size={16} className="text-rose-500" />
                    {locale === 'ja' ? '苦手な敵 (Counters)' : 'Counters'}
                  </div>
                  <div className="space-y-3">
                    {wrDetails.meta.counters.map((cnt: any, i: number) => {
                      const matchedHero = cnt.hero_id ? hokHeroes.find(h => h.id === cnt.hero_id) : null;
                      const displayName = matchedHero ? (locale === 'en' && matchedHero.name_en ? matchedHero.name_en : matchedHero.name) : cnt.hero_name;
                      return (
                        <div key={i} className="flex gap-3 items-start">
                          {cnt.hero_id ? (
                            <Link href={`/heroes/${getHeroSlug(cnt.hero_id)}` as any} className="flex-shrink-0 hover:opacity-80 transition-opacity">
                              <img 
                                src={`/images/heroes/${cnt.hero_id}.jpg`}
                                alt={displayName}
                                className="w-10 h-10 rounded-full border border-rose-200 object-cover shadow-sm hover:shadow-md transition-shadow"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `/images/heroes/default.png`;
                                }}
                              />
                            </Link>
                          ) : (
                            <img 
                              src={`/images/heroes/default.png`}
                              alt={displayName}
                              className="w-10 h-10 rounded-full border border-rose-200 object-cover flex-shrink-0 shadow-sm"
                            />
                          )}
                          <div>
                            {cnt.hero_id ? (
                              <Link href={`/heroes/${getHeroSlug(cnt.hero_id)}` as any} className="text-xs font-black text-slate-800 hover:text-rose-600 hover:underline transition-colors">
                                {displayName}
                              </Link>
                            ) : (
                              <div className="text-xs font-black text-slate-800">{displayName}</div>
                            )}
                            <div className="text-[11px] font-medium text-slate-600 leading-relaxed mt-0.5">{cnt.reason}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        {hero.detailedStats && Object.keys(hero.detailedStats).length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 mt-4">
            <h3 className="text-sm font-black text-slate-500 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-indigo-500" />
              {locale === 'ja' ? '詳細ステータス' : 'Detailed Stats'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              {Object.entries(hero.detailedStats).map(([key, val]) => (
                <div key={key} className="flex flex-col border-b border-slate-100 pb-1">
                  <span className="text-[10px] font-bold text-slate-400">{key}</span>
                  <span className="text-[12px] font-black text-slate-700">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patch History Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-500 text-lg">#</span>
              {t('PatchHistory') || 'Patch History'}
            </h3>
          </div>
          <div className="p-4">
            <PatchTable heroId={hero.key || hero.id} />
          </div>
        </div>
        </div>
      </div>

      {/* Skin Gallery Section (Full Width Bottom) */}
      {wrDetails?.skins && wrDetails.skins.length > 0 && (
        <div className="lg:max-w-7xl lg:mx-auto px-4 lg:px-0 mt-8 mb-12">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 overflow-hidden">
            <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
              ✨ {locale === 'ja' ? 'スキンギャラリー' : 'Skin Gallery'}
            </h3>
            <p className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-1">
              <ShieldAlert size={14} />
              {locale === 'ja' 
                ? '※本家（中国版）のデータを含むため、グローバル未実装のスキンが含まれる場合があります。' 
                : '*Includes unreleased skins from the CN version.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {wrDetails.skins.map((skin: any, idx: number) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedSkin(skin)}
                  className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300"
                >
                  <img 
                    src={skin.url} 
                    alt={skin.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-2 left-2 text-white text-[12px] font-bold tracking-wide drop-shadow-md pr-2 leading-tight">
                    {skin.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skin Lightbox Modal */}
      {selectedSkin && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
          onClick={() => setSelectedSkin(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedSkin(null); }}
              className="absolute -top-10 right-0 text-white hover:text-slate-200 transition-colors"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedSkin.url} 
              alt={selectedSkin.name}
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="inline-block bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg text-white font-bold tracking-wide shadow-lg border border-slate-700">
                {selectedSkin.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
