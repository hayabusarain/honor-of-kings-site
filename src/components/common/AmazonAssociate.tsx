import { ExternalLink } from 'lucide-react';
import { AMAZON_ASSOCIATE, pickAmazonProduct } from '@/content/amazonAssociate';

/**
 * Amazon アソシエイトの紹介枠。**サイト内で1箇所だけ。**
 * MobileAppShell の main 先頭に置いてあるので、全ページの本文最上部に出る。
 *
 * **未設定なら何も描画しない。** トラッキングIDか商品が空のあいだは null を返すので、
 * 設定前にデプロイしても画面には出ない。出し方は src/content/amazonAssociate.ts を読むこと。
 *
 * ■ 見た目を細いバーにしている理由
 *
 * 全ページの、しかもコンテンツより上に出る。ここに大きなカードを置くと、
 * 読者が見に来た情報が画面外へ押し出される。このサイトは対戦中に開かれることが
 * 多いので、1行ぶんの高さに抑えている。**大きくしないこと。**
 *
 * ■ 必須表記
 *
 * Amazon の運営規約は「Amazonのアソシエイトとして、［名称］は適格販売により
 * 収入を得ています。」を目立つように掲示することを義務づけている。
 * リンクの隣に必ず出す。**消さないこと。** 監査の検査18が見張る。
 *
 * ■ 置き場所の根拠（2026-09-08 に本番で実測）
 *
 * フッターは論外だった。フッターの開始位置はスマホ390x844で次のとおり。
 *   トップ 1.9画面 / ヒーロー詳細 12.0画面 / Tier表 17.0画面 / 装備一覧 27.4画面
 * 装備一覧では27回スクロールしないと現れない。本文最上部なら全ページで確実に見える。
 */
export function AmazonAssociate({ locale, pathname }: { locale: string; pathname: string }) {
  const { tag } = AMAZON_ASSOCIATE;
  const isJa = locale === 'ja';

  // 出す商品はページで変える。ガイドは発熱の話をしているので冷却、それ以外は指サック。
  // 対応づけは src/content/amazonAssociate.ts の paths で決めている
  const product = pickAmazonProduct(pathname);

  // 言語ごとに文言が入っているときだけ出す。英語の文言を空にすれば英語ページには出ない。
  // いま扱っている商品は amazon.co.jp のもので、海外の読者には買えない。
  // 英語ページは海外向けに伸ばしている最中なので、買えないものを並べて雑音にしない
  const label = product ? (isJa ? product.title.ja : product.title.en) : '';
  if (!tag || !product || !label) return null;

  const note = product.note;
  const url = product.url;
  const href = `${url}${url.includes('?') ? '&' : '?'}tag=${encodeURIComponent(tag)}`;

  return (
    <aside
      aria-label={isJa ? '広告' : 'Advertisement'}
      className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2"
    >
      <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black tracking-wide text-slate-500">
        {isJa ? 'PR' : 'AD'}
      </span>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center gap-1 text-[13px] font-bold text-brand-700 underline decoration-brand-300 underline-offset-2 transition-colors hover:text-brand-800"
      >
        {label}
        <ExternalLink size={13} aria-hidden="true" />
      </a>

      {(isJa ? note.ja : note.en) && (
        <span className="text-[11px] font-medium text-slate-500">{isJa ? note.ja : note.en}</span>
      )}

      {/* Amazon の運営規約が求める表記。目立つように出すこと。消さない */}
      <span className="text-[11px] font-medium text-slate-500">
        {isJa
          ? 'Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。'
          : 'As an Amazon Associate, this site earns from qualifying purchases.'}
      </span>
    </aside>
  );
}
