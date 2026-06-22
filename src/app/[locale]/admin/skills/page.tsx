'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, Languages, CheckCircle2, ChevronDown, Save, Loader2, Info } from 'lucide-react';
import Link from 'next/link';
export default function SkillAdminPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);
  
  // ヒーローデータ
  const [herosList, setHerosList] = useState<{id: string, jaName: string}[]>([]);
  const [allSkills, setAllSkills] = useState<Record<string, any[]>>({});
  
  const [selectedHero, setSelectedHero] = useState<string>('');
  // 編集中のスキルデータ（選択されたヒーローの配列データ）
  const [editingSkills, setEditingSkills] = useState<any[]>([]);

  // 初回データ取得
  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    setFetching(true);
    try {
      // DataDragonから日本語のヒーロー名を取得
      let jpNames: Record<string, string> = {};
      try {
        const ddRes = await fetch('https://ddragon.leagueoflegends.com/cdn/16.10.1/data/ja_JP/hero.json');
        if (ddRes.ok) {
          const ddData = await ddRes.json();
          for (const key in ddData.data) {
            jpNames[key] = ddData.data[key].name;
          }
        }
      } catch (e) {
        console.warn('Failed to fetch Japanese names from DataDragon');
      }

      const res = await fetch('/api/admin/skills');
      const data = await res.json();
      
      if (res.ok) {
        setAllSkills(data);
        
        // 英語IDと日本語名のマッピングリストを作成し、日本語名の五十音順にソート
        const champs = Object.keys(data).map(id => ({
          id,
          jaName: id === 'Norra' ? 'ノラ' : (jpNames[id] || id)
        }));
        
        champs.sort((a, b) => a.jaName.localeCompare(b.jaName, 'ja'));
        
        setHerosList(champs);
        if (champs.length > 0) {
          handleSelectHero(champs[0].id, data);
        }
      } else {
        setMessage({ text: `データ取得エラー: ${data.error}`, type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: `通信エラー: ${err.message}`, type: 'error' });
    } finally {
      setFetching(false);
    }
  };

  const handleSelectHero = (champId: string, sourceData = allSkills) => {
    setSelectedHero(champId);
    // 元のデータを破壊しないようにディープコピーしてステートにセット
    if (sourceData[champId]) {
      setEditingSkills(JSON.parse(JSON.stringify(sourceData[champId])));
    }
  };

  const handleSkillChange = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...editingSkills];
    updated[index][field] = value;
    setEditingSkills(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setMessage({ text: '管理者パスワードを入力してください。', type: 'error' });
      return;
    }
    if (!selectedHero || editingSkills.length === 0) {
      setMessage({ text: 'ヒーローデータが選択されていません。', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '翻訳・保存処理中です... (約10〜20秒かかります)', type: 'info' });

    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          heroId: selectedHero,
          updatedSkills: editingSkills
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ text: data.message || '保存と自動翻訳が完了しました！', type: 'success' });
        // ローカルステートを更新して最新の状態にする
        setAllSkills(prev => ({
          ...prev,
          [selectedHero]: editingSkills
        }));
      } else {
        setMessage({ text: `エラー: ${data.error}`, type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: `通信エラー: ${err.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Languages size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">スキル翻訳管理</h1>
            <p className="text-slate-500 text-sm">日本語を編集して保存すると、他言語に自動翻訳されて同期されます。</p>
          </div>
        </div>
        <Link href="/ja/admin" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition">
          ← 管理トップへ戻る
        </Link>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-xl flex gap-3 text-sm font-medium border ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
          message.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' : 
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          {message.type === 'success' && <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />}
          {message.type === 'error' && <ShieldAlert size={20} className="text-rose-500 shrink-0" />}
          {message.type === 'info' && <Info size={20} className="text-blue-500 shrink-0" />}
          <p>{message.text}</p>
        </div>
      )}

      {fetching ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p>スキルデータを読み込み中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* 左カラム：設定と選択 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 sticky top-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">ヒーロー選択</label>
                <div className="relative">
                  <select
                    value={selectedHero}
                    onChange={(e) => handleSelectHero(e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-medium"
                  >
                    {herosList.map(champ => (
                      <option key={champ.id} value={champ.id}>{champ.jaName}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="border-t border-slate-100 my-4 pt-4 space-y-2">
                <label className="block text-sm font-bold text-slate-700">管理者パスワード</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !password || !selectedHero}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition disabled:opacity-50 shadow-sm shadow-indigo-200"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    翻訳・保存中...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    保存して全言語に反映
                  </>
                )}
              </button>
              
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                ※「保存して全言語に反映」を押すと、右側で編集した日本語テキストが自動で英語、韓国語、ベトナム語、繁体字中国語に翻訳され、それぞれのデータファイルに上書き保存されます。<br/>
                ※HTMLタグ（&lt;span&gt;や&lt;br&gt;など）は維持されたまま翻訳されます。
              </p>
            </div>
          </div>

          {/* 右カラム：エディタ */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-800">
                  {herosList.find(c => c.id === selectedHero)?.jaName || selectedHero} のスキル編集 (日本語)
                </h2>
              </div>

              <div className="space-y-8">
                {editingSkills.map((skill, index) => (
                  <div key={`${selectedHero}-${skill.id}-${index}`} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-3">
                      {skill.icon && (
                        <img src={skill.icon} alt={skill.id} className="w-10 h-10 rounded-lg shadow-sm" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-800 text-white text-xs font-bold px-2 py-0.5 rounded">
                            {skill.id === 'P' ? 'Passive' : skill.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">スキル名</label>
                        <input
                          type="text"
                          value={skill.name || ''}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">説明文 (HTMLタグを含みます)</label>
                        <textarea
                          value={skill.description || ''}
                          onChange={(e) => handleSkillChange(index, 'description', e.target.value)}
                          className="w-full h-32 px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-700 leading-relaxed font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {editingSkills.length === 0 && (
                  <div className="text-center py-10 text-slate-500">
                    スキルデータがありません。
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
