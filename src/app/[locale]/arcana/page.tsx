import { setRequestLocale } from 'next-intl/server';
import arcanasData from '@/data/hok_arcanas.json';
import { PageFaq } from '@/components/common/PageFaq';
import { ArcanasClient, type Arcana } from './ArcanasClient';

/**
 * アルカナ一覧。表示と操作は ArcanasClient（'use client'）が持ち、データを読むのはこのサーバー部品。
 *
 * 以前は page.tsx 自体が 'use client' だった。FAQ（構造化データを含む）をサーバーで出すために分けた。
 * metadata は layout.tsx にある（'use client' だった名残）。
 *
 * FAQ は layout.tsx ではなくここに置く。layout は /arcana/calculator も包むため、
 * そこに置くと計算機のページにも /arcana の FAQ が重なって出る。
 */
export default async function ArcanaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ArcanasClient arcanas={arcanasData as Arcana[]} />
      {/* 答えの全文は src/content/faq.ts。置き場の対応は監査の検査23が見ている */}
      {/* 左右の余白は、ページ本体の内側の枠（px-4）と同じにする（揃えないとカードの端がずれる） */}
      <div className="px-4 pb-8">
        <PageFaq page="/arcana" locale={locale} className="mt-6" />
      </div>
    </>
  );
}
