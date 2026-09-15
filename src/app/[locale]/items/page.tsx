import { setRequestLocale } from 'next-intl/server';
import itemsData from '@/data/hok_items.json';
import { PageFaq } from '@/components/common/PageFaq';
import { ItemsClient, type Item } from './ItemsClient';

/**
 * 装備一覧。表示と操作は ItemsClient（'use client'）が持ち、
 * データを読むのはこのサーバー部品の仕事にしてある。
 *
 * 以前は page.tsx 自体が 'use client' で hok_items.json（105KB）を import していた。
 * クライアント部品が import した JSON はクライアントの共有チャンクに入るため、
 * この装備ページを開いていない訪問者にも配られていた。2026-09-05 の実測では
 * ヒーロー詳細232ページ・トップ・初心者向け・アルカナ・パッチ・スペルの6ページが、
 * 一度も参照しないこの105KB（brotli後 13.6KB）を積んでいた。
 *
 * データ自体は絞れない。検索はパッシブと発動効果まで見るし、
 * 「全アイテムの効果一覧」は 13,000 字を超える全文を初期HTMLに出している。
 * だから中身を削るのではなく、置き場所をサーバーへ移して配布先を1ページに閉じた。
 *
 * metadata は layout.tsx にある（このルートは以前 'use client' だった名残）。
 * OGP画像も layout.tsx の generateMetadata を見ているので、ここは触らなくてよい。
 *
 * FAQ は layout.tsx ではなくここに置く。layout は /items/usage と /items/simulator も包むため、
 * そこに置くと下層2ページにも /items の FAQ が重なって出る。
 */
export default async function ItemsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ItemsClient items={itemsData as unknown as Item[]} />
      {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
      {/* 左右の余白と幅は、ページ本体の内側の枠と同じにする（揃えないとカードの端がずれる） */}
      <div className="px-4 pb-8">
        <PageFaq page="/items" locale={locale} className="mt-6" />
      </div>
    </>
  );
}
