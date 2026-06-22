'use client';

import { useState } from 'react';
import { X, Save, Plus, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface BuildSubmitModalProps {
  heroId: string;
  allItems: any[];
  allArcanas: any[];
  allSkills: any[];
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export function BuildSubmitModal({ heroId, allItems, allArcanas, allSkills, onClose, onSubmitSuccess }: BuildSubmitModalProps) {
  const t = useTranslations('Builds');
  const locale = useLocale();
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  
  const [selectedRed, setSelectedRed] = useState<string>('');
  const [selectedBlue, setSelectedBlue] = useState<string>('');
  const [selectedYellow, setSelectedYellow] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'items' | 'arcanas'>('info');

  const redArcanas = allArcanas.filter(r => r.type === 'red' && r.grade === '5');
  const blueArcanas = allArcanas.filter(r => r.type === 'blue' && r.grade === '5');
  const yellowArcanas = allArcanas.filter(r => r.type === 'yellow' && r.grade === '5');

  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } else {
      if (selectedItems.length >= 6) {
        alert(t('maxItems'));
        return;
      }
      setSelectedItems(prev => [...prev, itemId]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert(t('requireTitle'));
      return;
    }
    if (!deletePassword.trim()) {
      alert(t('requirePassword'));
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroId,
          title,
          author_name: authorName,
          description,
          items: selectedItems,
          skills: selectedSkill ? [selectedSkill] : [],
          arcanas: {
            red: selectedRed,
            blue: selectedBlue,
            yellow: selectedYellow
          },
          delete_password: deletePassword
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit');
      
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(t('errorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-black text-slate-800">{t('modalTitle')}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex border-b border-slate-100 bg-white">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t('tabInfo')}</button>
          <button onClick={() => setActiveTab('items')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'items' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t('tabItems')} ({selectedItems.length}/6)</button>
          <button onClick={() => setActiveTab('arcanas')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'arcanas' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t('tabArcanas')}</button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 bg-slate-50/50">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formTitle')} <span className="text-rose-500">*</span></label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('formTitlePlaceholder')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formAuthor')}</label>
                <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder={t('formAuthorPlaceholder')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formDesc')}</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t('formDescPlaceholder')} className="w-full h-32 bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formPassword')} <span className="text-rose-500">*</span></label>
                <input type="text" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder={t('formPasswordPlaceholder')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div>
              <div className="flex gap-2 flex-wrap mb-4 bg-slate-100 p-3 rounded-xl min-h-[64px]">
                {selectedItems.length === 0 && <span className="text-slate-400 text-sm font-bold p-2">{t('selectItems')}</span>}
                {selectedItems.map(id => {
                  const item = allItems.find(i => i.id === id);
                  return item ? (
                    <div key={id} className="relative cursor-pointer" onClick={() => handleItemToggle(id)}>
                      <img src={item.icon} alt={item.name} className="w-10 h-10 rounded-lg border border-indigo-400" />
                      <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5"><X size={10} /></div>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {allItems.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => handleItemToggle(item.id)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedItems.includes(item.id) ? 'border-indigo-500 opacity-50' : 'border-transparent hover:border-indigo-200'}`}
                    title={item.name}
                  >
                    <img src={item.icon} alt={item.name} className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'arcanas' && (
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">サモナースキル</span>
                  <span className="text-xs text-slate-400">({selectedSkill ? 1 : 0}/1)</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {allSkills.map(skill => (
                    <button 
                      key={skill.id} 
                      onClick={() => setSelectedSkill(skill.id === selectedSkill ? '' : skill.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 ${selectedSkill === skill.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-100'}`}
                      title={skill.name}
                    >
                      <img src={skill.icon} alt={skill.name} className="w-10 h-10 rounded-lg shadow-sm" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{skill.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              {/* Red Arcanas */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">赤アルカナ</span>
                  <span className="text-xs text-slate-400">({selectedRed ? 1 : 0}/1)</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {redArcanas.map(arcana => (
                    <button 
                      key={arcana.id} 
                      onClick={() => setSelectedRed(selectedRed === arcana.id ? '' : arcana.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 ${selectedRed === arcana.id ? 'border-rose-500 bg-rose-50' : 'border-transparent hover:bg-slate-100'}`}
                      title={arcana.name}
                    >
                      <img src={arcana.icon} alt={arcana.name} className="w-10 h-10 rounded-full bg-slate-800" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{arcana.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blue Arcanas */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">青アルカナ</span>
                  <span className="text-xs text-slate-400">({selectedBlue ? 1 : 0}/1)</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {blueArcanas.map(arcana => (
                    <button 
                      key={arcana.id} 
                      onClick={() => setSelectedBlue(selectedBlue === arcana.id ? '' : arcana.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 ${selectedBlue === arcana.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-slate-100'}`}
                      title={arcana.name}
                    >
                      <img src={arcana.icon} alt={arcana.name} className="w-10 h-10 rounded-full bg-slate-800" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{arcana.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Yellow (Green in HoK) Arcanas */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">緑アルカナ</span>
                  <span className="text-xs text-slate-400">({selectedYellow ? 1 : 0}/1)</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {yellowArcanas.map(arcana => (
                    <button 
                      key={arcana.id} 
                      onClick={() => setSelectedYellow(selectedYellow === arcana.id ? '' : arcana.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 ${selectedYellow === arcana.id ? 'border-emerald-500 bg-emerald-50' : 'border-transparent hover:bg-slate-100'}`}
                      title={arcana.name}
                    >
                      <img src={arcana.icon} alt={arcana.name} className="w-10 h-10 rounded-full bg-slate-800" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{arcana.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
            {t('cancel')}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? t('submitting') : t('submitAction')}
          </button>
        </div>
      </div>
    </div>
  );
}
