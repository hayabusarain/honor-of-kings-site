import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { HomeClient } from "@/components/home/HomeClient";
import { buildPageMetadata } from '@/lib/buildMetadata';

export const revalidate = 3600;

/**
 * トップページの canonical・hreflang・OGP。
 *
 * 以前はこれをルートレイアウトに置いていたが、レイアウトのメタデータは
 * 404 にも継承される。notFound() が投げられると Next.js はページ側の
 * generateMetadata を捨てるため、存在しないURLがすべて
 * 「noindex ＋ canonical=トップページ」を返していた。
 * title と description はレイアウトの既定値と同じ文字列を使う（Metadata 名前空間）。
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return buildPageMetadata({
    locale,
    path: '',
    title: t('defaultTitle'),
    description: t('description'),
    absoluteTitle: true,
  });
}

export default function Home() {
  return <HomeClient />;
}
