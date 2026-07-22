'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ExternalLink, ShoppingCart, Sparkles } from 'lucide-react';

export interface GearProduct {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  url: string;
  imageUrl: string;
}

export const GEAR_PRODUCTS: GearProduct[] = [
  {
    id: 'finger-sleeves',
    category: '指サック',
    title: '【REJECT】プロ選手推奨 ゲーム用指サック',
    description: 'HoK必須級！超高感度・銀繊維で手汗対策と誤タップ防止に。',
    price: '￥1,980',
    url: 'https://amzn.to/4ysJgFY',
    imageUrl: 'https://m.media-amazon.com/images/I/816ODSstEdL._AC_SL1500_.jpg'
  },
  {
    id: 'phone-cooler',
    category: 'スマホクーラー',
    title: 'Black Shark マグネット式スマホクーラー',
    description: 'スマホの爆熱と処理落ち・カクつきを防ぐ！超強力な冷却ファン。',
    price: '￥4,980',
    url: 'https://amzn.to/4faMWVp',
    imageUrl: 'https://m.media-amazon.com/images/I/71WlBByy+2L._SL1500_.jpg'
  },
  {
    id: 'power-bank',
    category: 'モバイルバッテリー',
    title: 'Anker ケーブル一体型 モバイルバッテリー',
    description: '長時間プレイのお供に！ケーブル内蔵で持ち運び最強バッテリー。',
    price: '￥3,990',
    url: 'https://amzn.to/4wP2l3z',
    imageUrl: 'https://m.media-amazon.com/images/I/51SZtRaI6aL._AC_SL1500_.jpg'
  },
  {
    id: 'earphones',
    category: 'ゲーミングイヤホン',
    title: 'Razer Hammerhead ゲーミングイヤホン',
    description: 'プロゲーマー御用達。効果音や集団戦のスキル音が明確に聞き取れる！',
    price: '￥6,480',
    url: 'https://amzn.to/4wcMs7n',
    imageUrl: 'https://m.media-amazon.com/images/I/61U4l38l28L._AC_SL1500_.jpg'
  }
];

export function AmazonProductCard() {
  const [product, setProduct] = useState<GearProduct | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Pick a random product on mount / navigation
    const randomProduct = GEAR_PRODUCTS[Math.floor(Math.random() * GEAR_PRODUCTS.length)];
    setProduct(randomProduct);
  }, [pathname]);

  if (!product) {
    return (
      <div className="w-full max-w-[728px] mx-auto h-[90px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl flex items-center p-2 border border-slate-200 dark:border-slate-700">
        <div className="w-[74px] h-[74px] bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0"></div>
        <div className="ml-3 flex-1 flex flex-col gap-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <a 
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-[728px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all rounded-2xl overflow-hidden group p-2.5"
    >
      <div className="flex h-full items-center">
        {/* Product Image */}
        <div className="relative w-[74px] h-[74px] shrink-0 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="max-w-full max-h-full object-contain mix-blend-multiply"
          />
        </div>
        
        {/* Product Info */}
        <div className="ml-3 flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
              <Sparkles size={11} />
              おすすめギア: {product.category}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded shrink-0">
              PR
            </span>
          </div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mt-1">
            {product.title}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
            {product.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="ml-3 shrink-0 hidden sm:flex items-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-3.5 py-2 rounded-xl shadow-xs transition-transform active:scale-95">
            <ShoppingCart className="w-3.5 h-3.5" />
            Amazonでチェック
          </span>
        </div>
      </div>
    </a>
  );
}

export function AmazonGearGrid() {
  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>おすすめプレイ環境・ゲーミングギア</span>
        </h3>
        <span className="text-[10px] font-semibold text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
          PR
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GEAR_PRODUCTS.map((product) => (
          <a
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-amber-500 dark:hover:border-amber-500/80 hover:shadow-md transition-all group"
          >
            <div className="relative w-16 h-16 shrink-0 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1 border border-slate-100 dark:border-slate-800">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="max-w-full max-h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded mb-0.5">
                {product.category}
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {product.title}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {product.description}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                  {product.price}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 group-hover:underline">
                  Amazonで見る <ExternalLink size={10} />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
