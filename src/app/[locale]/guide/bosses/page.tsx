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
    id: 'overlord_early',
    name: { en: 'Overlord (Early)', ja: 'オーバーロード (Overlord)' },
    spawnTime: { en: 'Spawns at 2:00', ja: '出現: 2:00' },
    respawnTime: { en: 'Respawns 4:00 after being slain', ja: '再出現: 討伐後4分' },
    phase: 'early',
    type: 'overlord',
    iconColor: 'from-blue-500 to-brand-600',
    badge: { en: 'Dragon Vanguard Waves', ja: 'ドラゴンヴァンガード（龍兵）' },
    effects: {
      en: [
        'Replaces the slaying team\'s next 2 minion waves in every lane with powerful Dragon Vanguards.',
        'Dragon Vanguards have high HP and pressure enemy turrets on their own.',
        'Grants gold and experience to the whole team.'
      ],
      ja: [
        '討伐チームの次の2ウェーブのミニオンが、全レーンで強力な「ドラゴンヴァンガード」に変化。',
        'ドラゴンヴァンガードは耐久力が高く、放っておくだけで敵タワーに圧力をかけてくれます。',
        'チーム全員がゴールドと経験値を獲得。'
      ]
    },
    strategy: {
      en: 'The very first objective of the game (upper river pit). Taking it early lets you crack outer turrets while enemy laners are stuck defending, handing your team early map control.',
      ja: '川の上側のピットに湧く、この試合最初のオブジェクトです。序盤に取れれば敵レーナーを防衛に釘付けにしながら第1タワーを削れるので、マップの主導権争いで一歩先行できます。'
    }
  },
  {
    id: 'tyrant_early',
    name: { en: 'Tyrant (Early)', ja: 'タイラント (Tyrant)' },
    spawnTime: { en: 'Spawns at 4:00', ja: '出現: 4:00' },
    respawnTime: { en: 'Respawns 4:00 after being slain', ja: '再出現: 討伐後4分' },
    phase: 'early',
    type: 'tyrant',
    iconColor: 'from-amber-500 to-orange-600',
    badge: { en: 'Chain Lightning Buff (Tyrant\'s Arrival)', ja: '連鎖稲妻バフ（Tyrant\'s Arrival）' },
    effects: {
      en: [
        'Basic attacks and skills of the whole team gain Chain Lightning that bounces between enemies, dealing bonus magic damage.',
        'Grants gold and experience to the whole team.'
      ],
      ja: [
        'チーム全員の通常攻撃とスキルに、敵の間を跳ねる「連鎖稲妻」（追加魔法ダメージ）が付与されます。',
        'チーム全員がゴールドと経験値を獲得。'
      ]
    },
    strategy: {
      en: 'Spawns in the lower river pit at 4:00. Take it when your team is ahead in a skirmish or the enemy jungler shows on the far side of the map — the chain lightning makes your next fight and push noticeably stronger.',
      ja: '川の下側のピットに4:00に出現します。小競り合いに勝った直後や、敵ジャングラーが反対サイドに見えた瞬間が狙い目。連鎖稲妻が付くと直後の集団戦とタワー折りが目に見えて楽になります。'
    }
  },
  {
    id: 'shadow_tyrant',
    name: { en: 'Shadow Tyrant (Mid/Late)', ja: 'シャドウタイラント (Shadow Tyrant)' },
    spawnTime: { en: 'Spawns at 10:00', ja: '出現: 10:00' },
    respawnTime: { en: 'Respawns 3:30 after being slain', ja: '再出現: 討伐後3分30秒' },
    phase: 'mid',
    type: 'tyrant',
    iconColor: 'from-orange-500 to-red-600',
    badge: { en: 'Empowered Chain Lightning & Speed', ja: '強化連鎖稲妻 & 移動速度' },
    effects: {
      en: [
        'Empowered Chain Lightning: bounces deal heavy magic damage to enemy heroes (scaling with level).',
        'Grants 10% Movement Speed, plus an extra 5% while out of combat.',
        'Noticeably raises your team\'s total damage in 5v5 fights.'
      ],
      ja: [
        '連鎖稲妻が強化され、敵ヒーローに対してレベルに応じた大きな魔法ダメージを与えるようになります。',
        '移動速度が10%上昇。さらに非戦闘時は+5%され、マップ展開が速くなります。',
        '5v5の集団戦でのチーム総ダメージがはっきり伸びる、中盤以降の主役バフです。'
      ]
    },
    strategy: {
      en: 'From 10:00 onward, secure this before forcing a decisive 5v5 or sieging the enemy high ground. If you cannot fight for it, trade it for turrets on the opposite side of the map.',
      ja: '10分以降、決戦の集団戦や高地攻めの直前に確保したいバフです。正面から取り合えない盤面なら、無理せず反対サイドのタワーと交換する判断も有効です。'
    }
  },
  {
    id: 'shadow_overlord',
    name: { en: 'Shadow Overlord (Mid/Late)', ja: 'シャドウオーバーロード (Shadow Overlord)' },
    spawnTime: { en: 'Spawns at 10:00', ja: '出現: 10:00' },
    respawnTime: { en: 'Respawns 3:30 after being slain', ja: '再出現: 討伐後3分30秒' },
    phase: 'mid',
    type: 'overlord',
    iconColor: 'from-purple-600 to-pink-600',
    badge: { en: 'Summon Shadow Vanguard Skill', ja: 'シャドウヴァンガード召喚スキル' },
    effects: {
      en: [
        'The player who lands the killing blow gains an active skill: summon a Shadow Vanguard into a lane of their choice.',
        'Allies along the summon path take 10% reduced damage.',
        'The slaying team\'s minion waves are also replaced with empowered Shadow Vanguards.'
      ],
      ja: [
        'ラストヒットを取ったプレイヤーが、好きなレーンに「シャドウヴァンガード」を召喚できるアクティブスキルを獲得します。',
        '召喚経路上にいる味方は被ダメージが10%軽減されます。',
        '討伐チームのミニオンウェーブも強化シャドウヴァンガードに置き換わります。'
      ]
    },
    strategy: {
      en: 'Send the Shadow Vanguard down the lane with the weakest enemy high-ground turret to force a breach — ideally while your team groups behind it for the damage reduction.',
      ja: '敵の高地タワーが最も削れているレーンに撃ち込むのが基本です。召喚経路のダメージ軽減があるので、味方全員でヴァンガードの後ろに付いて攻めると強力です。'
    }
  },
  {
    id: 'tempest_dragon',
    name: { en: 'Tempest Dragon (Endgame Win Condition)', ja: 'テンペストドラゴン（20分・最終勝利条件）' },
    spawnTime: { en: 'Spawns at 20:00', ja: '出現: 20:00' },
    respawnTime: { en: 'Respawns 3:00 after being slain', ja: '再出現: 討伐後3分' },
    phase: 'late',
    type: 'tempest',
    iconColor: 'from-cyan-500 via-teal-500 to-emerald-600',
    badge: { en: 'Blessing of Lightning & True Damage', ja: '雷のシールド & 確定ダメージ雷撃' },
    effects: {
      en: [
        'Blessing of Lightning: all living team members gain a shield equal to 20–50% of their Maximum HP.',
        'Storm Awakening: lightning periodically strikes nearby enemies for true damage (5% of target\'s Max HP against heroes, 20% against non-heroes).',
        'Lane minions become Tempest Vanguards, which even stop enemy turrets from attacking for 5 seconds.'
      ],
      ja: [
        '生存している味方全員に、最大HPの20〜50%分のシールド（Blessing of Lightning）を付与。',
        '周囲の敵に定期的に雷が落ち、敵ヒーローには対象の最大HP5%（ヒーロー以外には20%）の確定ダメージを与えます。',
        'ミニオンがテンペストヴァンガードに変化。敵タワーの攻撃を5秒間停止させながら押し込みます。'
      ]
    },
    strategy: {
      en: 'The endgame decider from 20:00 onward. The team that secures it gains an overwhelming edge in the next fight — so never facecheck the pit without vision, and consider forcing it only when your ultimates are up.',
      ja: '20分以降の勝敗を分ける最後の大型オブジェクトです。取ったチームが次の集団戦で圧倒的に有利になるため、視界のないままピットに近づくのは厳禁。全員のアルティメットが揃ったタイミングで仕掛けましょう。'
    }
  }
];

export default function BossGuidePage() {
  const locale = useLocale();
  const isJa = locale === 'ja';
  const [activePhase, setActivePhase] = useState<'all' | 'early' | 'mid' | 'late'>('all');

  const filteredBosses = BOSSES_DATA.filter(boss => activePhase === 'all' || boss.phase === activePhase);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans">
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
        <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold mb-3 border border-amber-500/30">
              <Award size={14} />
              {isJa ? 'グローバル版準拠・パッチ更新時に随時見直し' : 'Based on HoK Global — reviewed each patch'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              {isJa ? 'タイラント / オーバーロード / テンペストドラゴン解説' : 'Dragon & Boss Objectives Master Guide'}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              {isJa
                ? '勝敗を左右する3種の大型ボスについて、出現タイミングとバフの中身、どの場面で取りに行くべきかをまとめました。'
                : 'Spawn timers, buff details, and when to actually fight for Tyrant, Overlord, and Tempest Dragon in Honor of Kings.'}
            </p>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
          {[
            { id: 'all', label: isJa ? 'すべてのボス' : 'All Objectives' },
            { id: 'early', label: isJa ? '序盤ボス（オーバーロード2:00 / タイラント4:00）' : 'Early (Overlord 2:00 / Tyrant 4:00)' },
            { id: 'mid', label: isJa ? '10分〜 シャドウ系ボス' : '10:00 Shadow Bosses' },
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
                      <span className="flex items-center gap-1 font-bold text-brand-700">
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" />
                  {isJa ? '獲得バフ・効果一覧' : 'Acquired Buff & Effects'}
                </h3>
                <ul className="space-y-2">
                  {(isJa ? boss.effects.ja : boss.effects.en).map((eff, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></span>
                      <span>{eff}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tactical Strategy */}
              <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-4 text-xs sm:text-sm text-brand-950 font-medium">
                <span className="font-bold text-brand-900 block mb-1 flex items-center gap-1">
                  <Swords size={14} className="text-brand-700" />
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
