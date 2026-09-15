import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/buildMetadata';
import { BreadcrumbJsonLd, Breadcrumb } from '@/components/seo/BreadcrumbJsonLd';
import { FaqIndex } from '@/components/common/FaqIndex';
import { PageFaq } from '@/components/common/PageFaq';

/**
 * よくある質問の索引。
 *
 * 答えの全文は話題のページの末尾に置き、ここには質問と答えの1文目だけを並べる。
 * どのページにも収まらない問い（faq.ts で page が '/faq'）だけ、下の PageFaq で全文を出す。
 * FAQPage の構造化データはここには付けない（全文を持つページだけに付ける。検査23が見ている）。
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/faq',
    title: isJa ? 'よくある質問｜ヒーロー・Tier表・サイトの使い方' : 'FAQ｜Heroes, the Tier List and This Site',
    description: isJa
      ? 'オナーオブキングス（HoK）を始めたばかりの人がつまずきやすい質問と、このサイトのデータの読み方への答えを、質問ごとにまとめています。'
      : 'Answers to common questions from new Honor of Kings (HoK) players, and to questions about how to read the data on this site.',
  });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isJa = locale === 'ja';
  const trail = [{ name: isJa ? 'よくある質問' : 'FAQ', path: '/faq' }];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <BreadcrumbJsonLd locale={locale} trail={trail} />
      <Breadcrumb locale={locale} trail={trail} className="px-1 pt-3 pb-1" />
      <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900">{isJa ? 'よくある質問' : 'FAQ'}</h1>
      <p className="mt-2 mb-6 text-sm text-slate-500 font-medium leading-relaxed">
        {isJa
          ? '答えの1文目だけを並べています。全文は、質問のリンク先のページにあります。'
          : 'Each answer is cut to its first sentence here. The question links to the page with the full answer.'}
      </p>
      <FaqIndex locale={locale} />
      <PageFaq
        page="/faq"
        locale={locale}
        title={isJa ? 'このページで答える質問' : 'Answered on this page'}
        className="mt-6"
      />
    </div>
  );
}
