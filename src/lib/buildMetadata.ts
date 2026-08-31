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
  /**
   * title に接尾辞（… | Honor of Kings Hub）を付けない。トップページ用。
   * トップの title は屋号を含んだ完成形なので、テンプレートを通すと屋号が二重になる
   */
  absoluteTitle?: boolean;
};

/**
 * Atom フィードの自動発見リンク。alternates はページ側の定義でルートレイアウトの値が
 * 丸ごと置き換わる（フィールド単位の継承）ため、ここに入れておかないと
 * buildPageMetadata を使う全ページで <link rel="alternate" type="application/atom+xml"> が消える。
 * フィード本文は日本語のみのため、日本語ページにだけ付ける。ルートレイアウトと
 * links/page.tsx もこの定数を参照する。
 */
export const FEED_ALTERNATE_TYPES = { 'application/atom+xml': '/feed.xml' } as const;

/**
 * <title> の接尾辞。ルートレイアウトが子ルートに向けて定義している。
 *
 * Next.js の title.template は、間に「文字列の title を返す layout」が挟まると
 * そこで途切れる。/arcana /items /guide は本体が 'use client' のため metadata を
 * layout に置いており、その配下（/items/usage 等）で接尾辞が消えていた。
 * 子ルートを持つ layout では withChildTitleTemplate で付け直す。
 */
export const TITLE_TEMPLATE = '%s | Honor of Kings Hub';

/** 子ルートを持つ segment の layout 用。自分の title は保ったまま、子へテンプレートを渡す */
export function withChildTitleTemplate(meta: Metadata): Metadata {
  return { ...meta, title: { default: String(meta.title ?? ''), template: TITLE_TEMPLATE } };
}

const DEFAULT_OG_IMAGE: OgImage = {
  url: '/images/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'Honor of Kings Hub',
};

export function buildPageMetadata({ locale, title, description, path, images, ogType, absoluteTitle }: BuildArgs): Metadata {
  const url = `/${locale}${path}`;
  const ogImages = images && images.length > 0 ? images : [DEFAULT_OG_IMAGE];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ja: `/ja${path}`,
        en: `/en${path}`,
        // 日英以外の全世界からの検索は英語版へ誘導する（英語圏グロース方針）
        'x-default': `/en${path}`,
      },
      // フィードは日本語のみなので、自動発見リンクも日本語ページにだけ出す
      ...(locale === 'ja' ? { types: FEED_ALTERNATE_TYPES } : {}),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Honor of Kings Hub',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
      // 相手言語版があることを OGP でも示す。hreflang は alternates 側にある
      alternateLocale: locale === 'ja' ? 'en_US' : 'ja_JP',
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
