import { generateMetadata } from './page';
import { ogHeading } from '@/lib/buildMetadata';
import { renderOgImage, ogSize, ogContentType } from '@/lib/ogImage';
import { ogTitleOf } from '@/lib/ogTitle';

export { generateStaticParams } from './page';

// OGP画像。見出しは ./page の generateMetadata が返す title から作る。
// 文言をここに書き写さないこと。タイトルを変えたときに絵だけ古いまま残る。
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ locale: string; date: string }> }) {
  const { locale } = await params;
  const md = await generateMetadata({ params });
  return renderOgImage(locale, ogHeading(ogTitleOf(md)));
}
