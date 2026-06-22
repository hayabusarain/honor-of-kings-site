'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function AdminPage() {
  // X Posting Assistant States and Helpers
  const [tweetText, setTweetText] = useState('【攻略情報更新】パッチ情報と最新Tier Listを更新しました！現環境の最強ビルドやメタ統計をチェックしよう！ ➔ https://wildrift.hub-game.com #HoK #オナーオブキングス');

  const applyTemplate = (type: 'patch' | 'tier' | 'both') => {
    switch (type) {
      case 'patch':
        setTweetText('【パッチ更新】最新パッチの情報を反映しました！バフ・ナーフの詳細はこちらからチェック ➔ https://wildrift.hub-game.com/patches #HoK #オナーオブキングス');
        break;
      case 'tier':
        setTweetText('【最新Tier表】現環境の最新Tier Listを更新しました！今一番勝率の高い最強ヒーローは誰だ？ ➔ https://wildrift.hub-game.com/tier-list #HoK #オナーオブキングス');
        break;
      case 'both':
        setTweetText('【攻略情報更新】パッチ情報と最新Tier Listを更新しました！現環境の最強ビルドやメタ統計をチェックしよう！ ➔ https://wildrift.hub-game.com #HoK #オナーオブキングス');
        break;
    }
  };

  const handleTweetShare = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10 px-4 pt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
            <Share2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">X (Twitter) 投稿アシスト</h1>
            <p className="text-slate-500 text-sm">Xで更新情報をすばやくシェアするためのアシスタント</p>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          パッチノートや最新Tier表の更新をX（旧Twitter）で告知するための投稿テキストを作成し、直接投稿ページを開くことができます。
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              テンプレートを選択
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('patch')}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-100 transition-colors"
              >
                📢 パッチ更新
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('tier')}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 transition-colors"
              >
                📊 Tierリスト更新
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('both')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                🌟 両方更新
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              投稿テキスト（編集可能）
            </label>
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-slate-800 text-sm font-medium resize-y"
              placeholder="投稿テキストを入力してください..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleTweetShare}
              className="flex items-center justify-center gap-2 bg-black hover:bg-zinc-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 text-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Xで投稿する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
