'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { toPng } from 'html-to-image';
import { Plus, Trash2, Crosshair } from 'lucide-react';

export default function AdvancedCalculator() {
  const t = useTranslations('Calculator');
  const calculatorRef = useRef<HTMLDivElement>(null);

  // --- 1. Target Status & EHP ---
  const [hp, setHp] = useState<number>(1000);
  const [currentHpPercent, setCurrentHpPercent] = useState<number>(100);
  const [armor, setArmor] = useState<number>(50);
  const [mr, setMr] = useState<number>(30);

  const [physicalEhp, setPhysicalEhp] = useState<number>(0);
  const [magicEhp, setMagicEhp] = useState<number>(0);
  const [physicalMitigation, setPhysicalMitigation] = useState<number>(0);
  const [magicMitigation, setMagicMitigation] = useState<number>(0);

  // --- 2. Attacker Status & Penetration ---
  const [ad, setAd] = useState<number>(60);
  const [ap, setAp] = useState<number>(0);

  // Physical Penetration
  const [pFlatRed, setPFlatRed] = useState<number>(0);
  const [pPctRed, setPPctRed] = useState<number>(0);
  const [pPctPen, setPPctPen] = useState<number>(0);
  const [pFlatPen, setPFlatPen] = useState<number>(0);

  // Magic Penetration
  const [mFlatRed, setMFlatRed] = useState<number>(0);
  const [mPctRed, setMPctRed] = useState<number>(0);
  const [mPctPen, setMPctPen] = useState<number>(0);
  const [mFlatPen, setMFlatPen] = useState<number>(0);

  // --- 3. Skill & Multipliers ---
  // Physical Skill
  const [pBaseDmg, setPBaseDmg] = useState<number>(100);
  const [pAdRatio, setPAdRatio] = useState<number>(100);
  const [pApRatio, setPApRatio] = useState<number>(0);
  const [pMaxHpRatio, setPMaxHpRatio] = useState<number>(0);
  const [pCurrentHpRatio, setPCurrentHpRatio] = useState<number>(0);
  const [pMissingHpRatio, setPMissingHpRatio] = useState<number>(0);

  // Magic Skill
  const [mBaseDmg, setMBaseDmg] = useState<number>(50);
  const [mAdRatio, setMAdRatio] = useState<number>(0);
  const [mApRatio, setMApRatio] = useState<number>(60);
  const [mMaxHpRatio, setMMaxHpRatio] = useState<number>(0);
  const [mCurrentHpRatio, setMCurrentHpRatio] = useState<number>(0);
  const [mMissingHpRatio, setMMissingHpRatio] = useState<number>(0);

  // Shared Multipliers
  const [hits, setHits] = useState<number>(1);
  const [damageIncrease, setDamageIncrease] = useState<number>(0);
  const [damageReduction, setDamageReduction] = useState<number>(0);
  const [isCritical, setIsCritical] = useState<boolean>(false);
  const [critMultiplier, setCritMultiplier] = useState<number>(175);
  const [trueDamage, setTrueDamage] = useState<number>(0);

  // --- Results ---
  const [result, setResult] = useState({
    physical: 0,
    magic: 0,
    true: 0,
    total: 0,
    effArmor: 0,
    effMr: 0,
  });

  // (A/B comparison states removed in favor of Combo Builder)

  // --- 5. Combo Builder State ---
  const [comboStack, setComboStack] = useState<{id: string, name: string, dmg: number}[]>([]);
  const [comboNameInput, setComboNameInput] = useState<string>('');

  const addToCombo = () => {
    if (result.total === 0) return;
    const newCombo = {
      id: Math.random().toString(36).substring(7),
      name: comboNameInput || `Attack ${comboStack.length + 1}`,
      dmg: result.total
    };
    setComboStack([...comboStack, newCombo]);
    setComboNameInput('');
  };

  const removeComboItem = (id: string) => {
    setComboStack(comboStack.filter(item => item.id !== id));
  };

  const clearCombo = () => {
    setComboStack([]);
  };

  const comboTotalDamage = comboStack.reduce((sum, item) => sum + item.dmg, 0);
  const comboPercent = hp > 0 ? Math.min(100, (comboTotalDamage / hp) * 100) : 0;
  const isOverkill = comboTotalDamage >= hp;

  // Calculate EHP
  useEffect(() => {
    const pMit = armor >= 0 ? armor / (100 + armor) : 1 - (2 - 100 / (100 - armor));
    const mMit = mr >= 0 ? mr / (100 + mr) : 1 - (2 - 100 / (100 - mr));
    
    setPhysicalMitigation(pMit * 100);
    setMagicMitigation(mMit * 100);
    setPhysicalEhp(hp / (1 - pMit));
    setMagicEhp(hp / (1 - mMit));
  }, [hp, armor, mr]);

  // Calculate Damage
  useEffect(() => {
    // Target HP States
    const currentHp = hp * (currentHpPercent / 100);
    const missingHp = hp - currentHp;

    // Effective Armor
    let effAr = armor - pFlatRed;
    effAr = effAr * (1 - pPctRed / 100);
    if (effAr > 0) {
      effAr = effAr * (1 - pPctPen / 100);
      effAr = effAr - pFlatPen;
      effAr = Math.max(0, effAr);
    }
    const arMit = effAr >= 0 ? 100 / (100 + effAr) : 2 - (100 / (100 - effAr));

    // Effective MR
    let effMr = mr - mFlatRed;
    effMr = effMr * (1 - mPctRed / 100);
    if (effMr > 0) {
      effMr = effMr * (1 - mPctPen / 100);
      effMr = effMr - mFlatPen;
      effMr = Math.max(0, effMr);
    }
    const mrMit = effMr >= 0 ? 100 / (100 + effMr) : 2 - (100 / (100 - effMr));

    // Critical Modifier
    const appliedCrit = isCritical ? (critMultiplier / 100) : 1;
    // Damage Modifiers
    const damageMod = (1 + damageIncrease / 100) * (1 - damageReduction / 100);

    // Raw Physical Damage
    const rawP = pBaseDmg 
               + (ad * (pAdRatio / 100)) 
               + (ap * (pApRatio / 100))
               + (hp * (pMaxHpRatio / 100))
               + (currentHp * (pCurrentHpRatio / 100))
               + (missingHp * (pMissingHpRatio / 100));
    let actualP = rawP * appliedCrit * arMit * damageMod;

    // Raw Magic Damage
    const rawM = mBaseDmg 
               + (ad * (mAdRatio / 100)) 
               + (ap * (mApRatio / 100))
               + (hp * (mMaxHpRatio / 100))
               + (currentHp * (mCurrentHpRatio / 100))
               + (missingHp * (mMissingHpRatio / 100));
    let actualM = rawM * appliedCrit * mrMit * damageMod;

    // True Damage
    let actualT = trueDamage * damageMod;

    const tHits = Math.max(1, hits);

    setResult({
      physical: Math.round(actualP * tHits),
      magic: Math.round(actualM * tHits),
      true: Math.round(actualT * tHits),
      total: Math.round((actualP + actualM + actualT) * tHits),
      effArmor: Math.round(effAr * 10) / 10,
      effMr: Math.round(effMr * 10) / 10,
    });

  }, [
    hp, currentHpPercent, armor, mr, ad, ap,
    pFlatRed, pPctRed, pPctPen, pFlatPen,
    mFlatRed, mPctRed, mPctPen, mFlatPen,
    pBaseDmg, pAdRatio, pApRatio, pMaxHpRatio, pCurrentHpRatio, pMissingHpRatio,
    mBaseDmg, mAdRatio, mApRatio, mMaxHpRatio, mCurrentHpRatio, mMissingHpRatio,
    hits, damageIncrease, damageReduction, isCritical, critMultiplier, trueDamage
  ]);

  const handleDownload = async () => {
    if (!calculatorRef.current) return;
    
    try {
      const dataUrl = await toPng(calculatorRef.current, {
        backgroundColor: '#f8fafc', // match tailwind slate-50
        pixelRatio: 2, // better quality
      });
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `WR_Damage_Result_${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  return (
    <div className="space-y-6 pb-10" ref={calculatorRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Target */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-emerald-600 text-white p-3 px-5">
              <h2 className="font-bold">{t('targetSection')}</h2>
            </div>
            <div className="p-5 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('hp')}</label>
                  <input type="number" value={hp} onChange={e => setHp(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <label className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                    <span>{t('currentHpState')}</span>
                    <span className="text-emerald-600 font-bold">{currentHpPercent}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" max="100" 
                    value={currentHpPercent} 
                    onChange={e => setCurrentHpPercent(Number(e.target.value))} 
                    className="w-full accent-emerald-500 mb-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Current: {Math.round(hp * (currentHpPercent / 100))}</span>
                    <span>Missing: {Math.round(hp - (hp * (currentHpPercent / 100)))}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t('armor')}</label>
                    <input type="number" value={armor} onChange={e => setArmor(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{t('mr')}</label>
                    <input type="number" value={mr} onChange={e => setMr(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">{t('physicalEhp')}</p>
                    <p className="text-2xl font-black text-amber-600">{Math.round(physicalEhp)}</p>
                    <p className="text-[10px] text-slate-400">{t('mitigation')}: {physicalMitigation.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">{t('magicEhp')}</p>
                    <p className="text-2xl font-black text-indigo-600">{Math.round(magicEhp)}</p>
                    <p className="text-[10px] text-slate-400">{t('mitigation')}: {magicMitigation.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Attacker */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 text-white p-3 px-5">
              <h2 className="font-bold">{t('attackerSection')}</h2>
            </div>
            <div className="p-5 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('ad')}</label>
                  <input type="number" value={ad} onChange={e => setAd(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('ap')}</label>
                  <input type="number" value={ap} onChange={e => setAp(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                </div>
              </div>

              {/* Penetration Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-amber-600 border-b border-amber-100 pb-1">{t('physicalPenetration')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('flatReduction')}</label>
                      <input type="number" value={pFlatRed} onChange={e => setPFlatRed(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('percentReduction')}</label>
                      <input type="number" value={pPctRed} onChange={e => setPPctRed(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('percentPen')}</label>
                      <input type="number" value={pPctPen} onChange={e => setPPctPen(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('pFlatPen')}</label>
                      <input type="number" value={pFlatPen} onChange={e => setPFlatPen(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-indigo-600 border-b border-indigo-100 pb-1">{t('magicPenetration')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('flatReduction')}</label>
                      <input type="number" value={mFlatRed} onChange={e => setMFlatRed(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('percentReduction')}</label>
                      <input type="number" value={mPctRed} onChange={e => setMPctRed(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('percentPen')}</label>
                      <input type="number" value={mPctPen} onChange={e => setMPctPen(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('mFlatPen')}</label>
                      <input type="number" value={mFlatPen} onChange={e => setMFlatPen(Number(e.target.value))} className="w-full text-xs border-slate-300 rounded-lg bg-white shadow-inner p-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Skill & Multipliers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-rose-600 text-white p-3 px-5">
              <h2 className="font-bold">{t('skillSection')}</h2>
            </div>
            <div className="p-5 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-3">
                  <h3 className="font-bold text-sm text-orange-700">{t('physicalDamage')}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('baseDamage')}</label>
                      <input type="number" value={pBaseDmg} onChange={e => setPBaseDmg(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('adRatio')}</label>
                      <input type="number" value={pAdRatio} onChange={e => setPAdRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('apRatio')}</label>
                      <input type="number" value={pApRatio} onChange={e => setPApRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('maxHpRatio')}</label>
                      <input type="number" value={pMaxHpRatio} onChange={e => setPMaxHpRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('currentHpRatio')}</label>
                      <input type="number" value={pCurrentHpRatio} onChange={e => setPCurrentHpRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('missingHpRatio')}</label>
                      <input type="number" value={pMissingHpRatio} onChange={e => setPMissingHpRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                  <h3 className="font-bold text-sm text-blue-700">{t('magicDamage')}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('baseDamage')}</label>
                      <input type="number" value={mBaseDmg} onChange={e => setMBaseDmg(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('adRatio')}</label>
                      <input type="number" value={mAdRatio} onChange={e => setMAdRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('apRatio')}</label>
                      <input type="number" value={mApRatio} onChange={e => setMApRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('maxHpRatio')}</label>
                      <input type="number" value={mMaxHpRatio} onChange={e => setMMaxHpRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('currentHpRatio')}</label>
                      <input type="number" value={mCurrentHpRatio} onChange={e => setMCurrentHpRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{t('missingHpRatio')}</label>
                      <input type="number" value={mMissingHpRatio} onChange={e => setMMissingHpRatio(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('hits')}</label>
                  <input type="number" value={hits} onChange={e => setHits(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('damageIncrease')}</label>
                  <input type="number" value={damageIncrease} onChange={e => setDamageIncrease(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('damageReduction')}</label>
                  <input type="number" value={damageReduction} onChange={e => setDamageReduction(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('isCritical')}</label>
                  <label className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" checked={isCritical} onChange={e => setIsCritical(e.target.checked)} className="rounded text-rose-500 focus:ring-rose-500 w-5 h-5 border-slate-300" />
                    <span className="text-sm text-slate-600 font-medium">Crit</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('critMultiplier')}</label>
                  <input type="number" value={critMultiplier} onChange={e => setCritMultiplier(Number(e.target.value))} disabled={!isCritical} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow disabled:opacity-50 disabled:bg-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{t('trueDamage')}</label>
                  <input type="number" value={trueDamage} onChange={e => setTrueDamage(Number(e.target.value))} className="w-full text-sm border-slate-300 rounded-lg bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 4: Disclaimer */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-slate-600 text-sm">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
              {t('disclaimerTitle')}
            </h3>
            <p className="leading-relaxed">
              {t('disclaimerText')}
            </p>
          </div>

        </div>

        {/* Right Column: Result */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden sticky top-6">
            <div className="p-6">
              <h2 className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-6 text-center">{t('result')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-lg border border-amber-900/30">
                  <span className="text-amber-500 text-sm font-bold">{t('actualPhysicalDamage')}</span>
                  <span className="text-amber-400 font-mono font-bold text-xl">{result.physical}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-lg border border-indigo-900/30">
                  <span className="text-indigo-400 text-sm font-bold">{t('actualMagicDamage')}</span>
                  <span className="text-indigo-300 font-mono font-bold text-xl">{result.magic}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700">
                  <span className="text-slate-300 text-sm font-bold">{t('actualTrueDamage')}</span>
                  <span className="text-white font-mono font-bold text-xl">{result.true}</span>
                </div>
              </div>

              <div className="bg-rose-500/10 p-5 rounded-2xl mb-6 border border-rose-500/20 text-center">
                <p className="text-rose-400 text-sm font-bold mb-1 uppercase tracking-wider">{t('actualDamage')}</p>
                <p className="text-6xl font-black text-rose-500 drop-shadow-sm">{result.total}</p>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <span className="text-slate-400 text-sm">{t('effectiveDefense')}</span>
                <span className="text-white font-mono font-bold text-sm">
                  <span className="text-amber-500">{result.effArmor}</span> / <span className="text-indigo-400">{result.effMr}</span>
                </span>
              </div>


              {/* Combo Builder Section */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-300 text-sm font-bold flex items-center gap-2">
                    <Crosshair size={16} className="text-rose-500" />
                    {t('comboBuilder')}
                  </h3>
                  {comboStack.length > 0 && (
                    <button onClick={clearCombo} className="text-[10px] text-slate-500 hover:text-rose-400 font-bold uppercase transition-colors">
                      {t('clearCombo')}
                    </button>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder={t('skillName')} 
                    value={comboNameInput}
                    onChange={(e) => setComboNameInput(e.target.value)}
                    className="flex-1 text-xs border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-500 rounded-lg focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-colors py-2 px-3"
                  />
                  <button 
                    onClick={addToCombo}
                    disabled={result.total === 0}
                    className="flex items-center gap-1 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                  >
                    <Plus size={14} />
                    {t('addToCombo')}
                  </button>
                </div>

                {comboStack.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1 border border-slate-700">
                      {comboStack.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-slate-800 p-2 rounded-md border border-slate-700 group">
                          <span className="text-xs font-medium text-slate-300 truncate pr-2">{item.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono font-bold text-rose-400">{item.dmg}</span>
                            <button onClick={() => removeComboItem(item.id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-inner relative overflow-hidden">
                      <div className="absolute top-0 left-0 h-1 bg-slate-800 w-full">
                        <div className={`h-full ${isOverkill ? 'bg-rose-500' : 'bg-emerald-500'} transition-all duration-500`} style={{ width: `${comboPercent}%` }} />
                      </div>
                      <div className="flex justify-between items-end mb-2 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('comboTotal')}</span>
                        <span className={`text-3xl font-black ${isOverkill ? 'text-rose-500' : 'text-white'}`}>{comboTotalDamage}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold">{t('killThreshold')}</span>
                        <span className={`text-xs font-bold ${isOverkill ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {isOverkill ? t('overkill') : `${comboPercent.toFixed(1)}% HP`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}

              <button 
                onClick={handleDownload}
                className="mt-6 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 text-sm font-bold shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
                {t('downloadResult')}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
