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

/**
 * OGP画像の見出しを title から作る。
 *
 * 日本語の title は「【オナーオブキングス】后羿の評価・おすすめ装備・…」の形。
 * 先頭の【…】を落としてから最初の「・」で切ると「后羿の評価」になる。
 * 英語は「Hou Yi Build Guide: Items, Combos & Counters - Honor of Kings (HoK)」の
 * 形なので ' - ' か ': ' で切る。
 *
 * 呼び出し側22ファイルに手を入れずに済むよう、ここで導出する。
 */
function ogHeading(title: string): string {
  let t = title.replace(/^【[^】]*】/, '').trim();
  // 末尾の屋号を落とす。カードには「HONOR OF KINGS HUB」を別に刷るので重複する
  t = t.replace(/\s*[|｜]\s*Honor of Kings Hub$/, '')
       .replace(/\s*-\s*Honor of Kings( \(HoK\))?$/, '')
       .trim();
  // トップは「Honor of Kings Hub（…）- 最新Tier表・…」の形。屋号のあとが本題
  if (t.startsWith('Honor of Kings Hub')) {
    const at = t.indexOf('- ');
    if (at > 0) t = t.slice(at + 2).trim();
  }
  // 「: 」「｜」で切る
  for (const c of [': ', '｜']) {
    const at = t.indexOf(c);
    if (at > 0) { t = t.slice(0, at); break; }
  }
  // 中黒は列挙の区切りなので最初の1つで切る。ただし括弧の中は数えない
  // （「初心者ガイド（レーン・オブジェクト・用語集）」を「初心者ガイド（レーン」に
  //   してしまうため）
  let depth = 0;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (ch === '（' || ch === '(') depth++;
    else if (ch === '）' || ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === '・' && depth === 0) { t = t.slice(0, i); break; }
  }
  return t.trim().slice(0, 60);
}

/** ページごとのOGP画像。src/app/api/og/route.tsx が描く */
function pageOgImage(locale: string, title: string): OgImage {
  const heading = ogHeading(title);
  if (!heading) return DEFAULT_OG_IMAGE;
  return {
    url: `/api/og?locale=${locale}&t=${encodeURIComponent(heading)}`,
    width: 1200,
    height: 630,
    alt: heading,
  };
}

export function buildPageMetadata({ locale, title, description, path, images, ogType, absoluteTitle }: BuildArgs): Metadata {
  const url = `/${locale}${path}`;
  const ogImages = images && images.length > 0 ? images : [pageOgImage(locale, title)];
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
