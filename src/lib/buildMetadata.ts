import type { Metadata } from 'next';

/**
 * ページ用 Metadata の共通組み立て。
 *
 * これまで各ページは title / description / alternates だけを定義しており、
 * openGraph / twitter はルートレイアウトの固定値（トップページのタイトルとURL）を
 * 継承していた。Next.js のメタデータ継承はフィールド単位の丸ごと置換なので、
 * ページの title は og:title に反映されない。結果、Tier表をXやDiscordで共有しても
 * カードはトップページのものになっていた。
 *
 * 個別に openGraph を足していくと漏れが再発するため、ここで一括生成する。
 * URL は相対で書き、ルートレイアウトの metadataBase が絶対URLへ解決する。
 */

type OgImage = { url: string; width?: number; height?: number; alt?: string };

type BuildArgs = {
  locale: string;
  title: string;
  description: string;
  /** ロケールを除いたパス。例 '/spells'。トップは '' */
  path: string;
  /** ヒーロー詳細など、既定のOG画像以外を出す場合だけ指定する */
  images?: OgImage[];
  ogType?: 'website' | 'article';
};

const DEFAULT_OG_IMAGE: OgImage = {
  url: '/images/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Honor of Kings Hub',
};

export function buildPageMetadata({ locale, title, description, path, images, ogType }: BuildArgs): Metadata {
  const url = `/${locale}${path}`;
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE];
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ja: `/ja${path}`,
        en: `/en${path}`,
        // 日英以外の全世界からの検索は英語版へ誘導する（英語圏グロース方針）
        'x-default': `/en${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Honor of Kings Hub',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      type: ogType ?? 'website',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
  };
}
