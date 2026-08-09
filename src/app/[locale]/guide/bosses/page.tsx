'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Shield, Zap, Award, Clock, Sparkles, Swords } from 'lucide-react';

interface BossInfo {
  id: string;
  name: { en: string; ja: string };
  spawnTime: { en: string; ja: string };
  respawnTime: { en: string; ja: string };
  phase: 'early' | 'mid' | 'late';
  type: 'tyrant' | 'overlord' | 'tempest';
  iconColor: string;
  badge: { en: string; ja: string };
  effects: { en: string[]; ja: string[] };
  strategy: { en: string; ja: string };
}

const BOSSES_DATA: BossInfo[] = [
  {
    id: 'tyrant_early',
    name: { en: 'Tyrant (Early)', ja: 'タイラント（タイラント / Tyrant）' },
    spawnTime: { en: 'Spawns at 2:00', ja: '出現: 2:00' },
    respawnTime: { en: 'Respawns: 4:00', ja: '再出現: 4:00' },
    phase: 'early',
    type: 'tyrant',
    iconColor: 'from-amber-500 to-orange-600',
    badge: { en: 'Attack / Magic Damage Buff', ja: '攻撃力・魔法威力バフ' },
    effects: {
      en: [
        'Grants the entire team extra Physical Attack and Magical Power.',
        'Adds bonus magical damage to skills and basic attacks for 90 seconds.',
        'Yields substantial teamwide Gold and Experience.'
      ],
      ja: [
        '味方全員の物理攻撃力および魔法攻撃力を上昇。',
        '90秒間、スキルおよび通常攻撃に追加魔法ダメージを付与。',
        'チーム全員にまとまったゴールドと経験値を供給。'
      ]
    },
    strategy: {
      en: 'Contest the 2-minute Tyrant when your team has a strong early 4v4/5v5 teamfight lineup or when looking to snowball an early kill lead.',
      ja: 'チームの序盤の集団戦火力が高い場合や、2分時点でのキルリードを確固たるものにしたい場面で最優先で討伐します。'
    }
  },
  {
    id: 'overlord_early',
    name: { en: 'Overlord (Early)', ja: 'オーバーロード（オーバーロード / Overlord）' },
    spawnTime: { en: 'Spawns at 2:00', ja: '出現: 2:00' },
    respawnTime: { en: 'Respawns: 4:00', ja: '再出現: 4:00' },
    phase: 'early',
    type: 'overlord',
    iconColor: 'from-blue-500 to-indigo-600',
    badge: { en: 'Dragon Vanguard Waves', ja: 'ドラゴンヴァンガード（龍兵）' },
    effects: {
      en: [
        'Replaces the next 3 minion waves across all lanes with powerful Dragon Vanguards.',
        'Dragon Vanguards have high HP and automatically push enemy turrets.',
        'Provides teamwide Gold & XP boost.'
      ],
      ja: [
        '全レーンの続く3ウェーブのミニオンが強力な「ドラゴンヴァンガード」に変化。',
        'ドラゴンヴァンガードは高い耐久力を持ち、自動的に敵のタワーを強力に押し込みます。',
        'チーム全員へのゴールド＆経験値ボーナス。'
      ]
    },
    strategy: {
      en: 'Best taken when you want to breach outer turrets early, force the enemy team to defend their lanes, and gain map control.',
      ja: '敵の第1タワーを破壊したい時や、敵レーナーを防衛に釘付けにしてマップの主導権を握りたいタイミングで有効です。'
    }
  },
  {
    id: 'shadow_tyrant',
    name: { en: 'Shadow Tyrant (Mid/Late)', ja: 'シャドウタイラント（シャドウタイラント / Shadow Tyrant）' },
    spawnTime: { en: 'Spawns at 10:00', ja: '出現: 10:00' },
    respawnTime: { en: 'Respawns: 4:00', ja: '再出現: 4:00' },
    phase: 'mid',
    type: 'tyrant',
    iconColor: 'from-orange-500 to-red-600',
    badge: { en: 'Chain Lightning & Speed Buff', ja: '連鎖稲妻 & 移動速度強化' },
    effects: {
      en: [
        'Grants the team 10% Movement Speed boost for 90 seconds.',
        'Attacks release Chain Lightning that jumps between enemies, dealing massive Magic Damage.',
        'Empowers teamfight execution drastically.'
      ],
      ja: [
        '味方全員に90秒間、10%の移動速度アップ効果を付与。',
        '攻撃時に敵間を跳ね返る「連鎖稲妻」を放ち、大ダメージを与える。',
        '集団戦における総ダメージ量を劇的に引き上げます。'
      ]
    },
    strategy: {
      en: 'Must-take objective at 10+ minutes before forcing major 5v5 teamfights or breaching the enemy high-ground base.',
      ja: '10分以降、決戦の5v5集団戦を起こす直前や高地タワー攻略の直前に取得する最重要バフです。'
    }
  },
  {
    id: 'shadow_overlord',
    name: { en: 'Shadow Overlord (Mid/Late)', ja: 'シャドウオーバーロード（シャドウオーバーロード / Shadow Overlord）' },
    spawnTime: { en: 'Spawns at 10:00', ja: '出現: 10:00' },
    respawnTime: { en: 'Respawns: 4:00', ja: '再出現: 4:00' },
    phase: 'mid',
    type: 'overlord',
    iconColor: 'from-purple-600 to-pink-600',
    badge: { en: 'Summon Shadow Vanguard Skill', ja: 'シャドウヴァンガード召喚スキル' },
    effects: {
      en: [
        'Spawns 3 waves of empowered Shadow Dragon Vanguards.',
        'Grants an active spell button allowing a teammate to summon a massive Shadow Vanguard path in any designated lane.',
        'The Shadow Vanguard path destroys enemy minion waves instantly and boosts ally movement.'
      ],
      ja: [
        '全レーンに3ウェーブの強化シャドウドラゴンヴァンガードを召喚。',
        '指定したレーンに「シャドウヴァンガード」を降臨させる専用アクティブボタンを獲得。',
        '降臨したシャドウヴァンガードは敵ミニオンを一瞬で消し去り、味方の移動速度を大幅に向上させます。'
      ]
    },
    strategy: {
      en: 'Use the active Shadow Vanguard button on the lane with the lowest health enemy High Ground Tower to force a base breach.',
      ja: '敵の高地タワーのHPが最も低いレーンに「シャドウヴァンガード」を撃ち込み、強制的に本拠地へと攻め込みます。'
    }
  },
  {
    id: 'tempest_dragon',
    name: { en: 'Tempest Dragon (Endgame Win Condition)', ja: 'テンペストドラゴン（20分・最終勝利条件）' },
    spawnTime: { en: 'Spawns at 20:00', ja: '出現: 20:00' },
    respawnTime: { en: 'Respawns: 3:00', ja: '再出現: 3:00' },
    phase: 'late',
    type: 'tempest',
    iconColor: 'from-cyan-500 via-teal-500 to-emerald-600',
    badge: { en: 'Thunder Shield & Lightning Strikes', ja: '雷霆シールド & 確定雷撃' },
    effects: {
      en: [
        'Grants all living team members a renewable Shield equal to 50% of Maximum HP.',
        'Periodic True Damage Lightning Strikes hit all nearby enemy heroes and minions.',
        'Replaces all lane minion waves with Ultimate Tempest Dragon Vanguards.'
      ],
      ja: [
        '生存している味方全員に「最大HPの50%分」の再生型雷霆シールドを付与。',
        '周囲の全敵ヒーローおよびミニオンに対して、定期的に「確定ダメージの雷撃」を自動落雷。',
        '全レーンのミニオンが最凶のテンペストドラゴンヴァンガードに変化。'
      ]
    },
    strategy: {
      en: 'The ultimate endgame decision at 20+ minutes. Securing Tempest Dragon grants virtually 95%+ win rate in the next teamfight. Never facecheck without vision!',
      ja: '20分以降の試合を即座に決着させる最強の勝敗分岐点です。このバフを得たチームは集団戦で圧倒的優位に立つため、視界確保なしでの無謀なブッシュチェックは絶対厳禁です。'
    }
  }
];

export default function BossGuidePage() {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const [activePhase, setActivePhase] = useState<'all' | 'early' | 'mid' | 'late'>('all');

  const filteredBosses = BOSSES_DATA.filter(boss => activePhase === 'all' || boss.phase === activePhase);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/guide" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100 flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="text-sm font-bold">{isJa ? 'ガイド一覧へ' : 'Back to Guides'}</span>
          </Link>
          <div className="font-black text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="text-amber-500" size={18} />
            {isJa ? 'ボスバフ完全攻略ガイド' : 'Boss Objectives & Buff Guide'}
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold mb-3 border border-amber-500/30">
              <Award size={14} />
              {isJa ? 'グローバル版HoK公式仕様 100%完全対応' : 'Official HoK Global Mechanics 100% Verified'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              {isJa ? 'タイラント / オーバーロード / テンペストドラゴン完全解説' : 'Dragon & Boss Objectives Master Guide'}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              {isJa 
                ? 'Honor of Kingsの勝敗を左右する「タイラント」「オーバーロード」「テンペストドラゴン」の出現タイミング、獲得バフ数値、戦術的使い分けをグローバル版公式名称で徹底解説。' 
                : 'Master the spawn timers, teamwide buff statistics, and tactical win conditions for Tyrant, Overlord, and Tempest Dragon in Honor of Kings.'}
            </p>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
          {[
            { id: 'all', label: isJa ? 'すべてのボス' : 'All Objectives' },
            { id: 'early', label: isJa ? '2分〜 タイラント/オーバーロード' : '2:00 Early Dragons' },
            { id: 'mid', label: isJa ? '10分〜 シャドウドラゴン' : '10:00 Shadow Dragons' },
            { id: 'late', label: isJa ? '20分〜 テンペストドラゴン' : '20:00 Tempest Dragon' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePhase(tab.id as 'all' | 'early' | 'mid' | 'late')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shadow-sm border ${
                activePhase === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Boss Cards List */}
        <div className="space-y-6">
          {filteredBosses.map(boss => (
            <div key={boss.id} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${boss.iconColor} text-white flex items-center justify-center font-black text-xl shadow-md shrink-0`}>
                    {boss.type === 'tyrant' ? '⚔️' : boss.type === 'overlord' ? '🐲' : '⚡'}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      {isJa ? boss.name.ja : boss.name.en}
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1 font-bold text-indigo-600">
                        <Clock size={13} />
                        {isJa ? boss.spawnTime.ja : boss.spawnTime.en}
                      </span>
                      <span>•</span>
                      <span>{isJa ? boss.respawnTime.ja : boss.respawnTime.en}</span>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-xl text-xs font-bold border border-amber-200/80 self-start sm:self-auto">
                  <Shield size={14} className="text-amber-600" />
                  {isJa ? boss.badge.ja : boss.badge.en}
                </div>
              </div>

              {/* Buff Effects List */}
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" />
                  {isJa ? '獲得バフ・効果一覧' : 'Acquired Buff & Effects'}
                </h3>
                <ul className="space-y-2">
                  {(isJa ? boss.effects.ja : boss.effects.en).map((eff, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span>
                      <span>{eff}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tactical Strategy */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-xs sm:text-sm text-indigo-950 font-medium">
                <span className="font-bold text-indigo-900 block mb-1 flex items-center gap-1">
                  <Swords size={14} className="text-indigo-600" />
                  {isJa ? 'おすすめ戦術・活用法' : 'Tactical Execution'}
                </span>
                {isJa ? boss.strategy.ja : boss.strategy.en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
