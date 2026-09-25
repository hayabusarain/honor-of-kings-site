import { routing } from '@/i18n/routing';
import { generateMetadata } from './page';
import { ogHeading } from '@/lib/buildMetadata';
import { renderOgImage, ogSize, ogContentType } from '@/lib/ogImage';
import { ogTitleOf } from '@/lib/ogTitle';

// OGP画像。見出しは ./page の generateMetadata が返す title から作る。
// 文言をここに書き写さないこと。タイトルを変えたときに絵だけ古いまま残る。
// [locale] の値をここで明示する。親レイアウトの generateStaticParams は
// メタデータ画像のルートには継がれず、無いとリクエストごとの生成になる。
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const md = await generateMetadata({ params });
  return renderOgImage(locale, ogHeading(ogTitleOf(md)));
}
