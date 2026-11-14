import { Link } from "@/i18n/routing";
import dataFreshness from '@/data/data_freshness.json';
import { ORIGIN, STATIC_EXPORT } from '@/lib/basePath';
import { useLocale, useTranslations } from "next-intl";
import { PrivacySettingsLink } from "@/components/consent/PrivacySettingsLink";

/**
 * フッターのリンク。文字だけだと高さ17〜20pxの的で、全ページで押しにくかった。
 * 各リンクを44pxにし、行の間は gap-y で空けずにリンク自身の高さで取る。
 * 行の間隔は 20px＋24px から 44px になるだけで、見た目はほぼ変わらない
 */
const FOOTER_LINK = "inline-flex min-h-11 items-center text-slate-600 hover:text-brand-700 transition-colors";

/**
 * 運営者のページと姉妹サイト。
 * 2026-10-31 の案D（docs は hub-game-portal の PLAN_D_2026-10-31.md）で Wild Rift Hub を閉じ、
 * ポータルは運営者 HUB-GAME の1ページ（https://hub-game.com/）だけになった。
 * WR の行は外し、ポータルの行は「運営: HUB-GAME」として運営者のページへ向け直した。
 * 運営者のページは同じドメインなので新しいタブでは開かない（newTab: false）。
 * MLBB は日本語だけなので /mlbb/ja に直接送る。別サイトへのリンクなので next-intl の Link は使わない（/hok が付く）
 */
const SISTER_SITES = [
  { href: 'https://hub-game.com/', ja: '運営: HUB-GAME', en: 'Operated by HUB-GAME', newTab: false },
  { href: STATIC_EXPORT ? `${ORIGIN}/mlbb/ja` : 'https://hub-game.com/mlbb/ja', ja: 'Mobare Hub', en: 'Mobare Hub', newTab: true },
];

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('Footer');

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* 上の my-6 を mt-3 にし、下の余白は外した。リンクの高さを44pxに広げたぶん
            （文字の上下に12pxずつ）を相殺して、文字どうしの間隔を前と揃えるため */}
        <nav
          aria-label={locale === 'en' ? 'Footer' : 'フッター'}
          className="flex justify-center flex-wrap gap-x-6 text-sm mt-3"
        >
          <Link href="/tier-list" className={FOOTER_LINK}>
            {locale === 'en' ? 'Tier List' : 'Tier表'}
          </Link>
          <Link href="/guide" className={FOOTER_LINK}>
            {locale === 'en' ? 'Guide' : '初心者ガイド'}
          </Link>
          {/* データの出どころと検証範囲。運営者が誰でどう作っているかを外から確かめる入口なので、
              全ページ共通のフッターに置く */}
          <Link href="/about" className={FOOTER_LINK}>
            {locale === 'en' ? 'About' : 'このサイトについて'}
          </Link>
          <Link href="/faq" className={FOOTER_LINK}>
            {locale === 'en' ? 'FAQ' : 'よくある質問'}
          </Link>
          {/* メニューの「サイトが更新されました」は一度見ると消えるので、いつでも辿れる入口をここに置く */}
          <Link href="/updates" className={FOOTER_LINK}>
            {locale === 'en' ? 'Site Updates' : '更新履歴'}
          </Link>
          <Link href="/terms" className={FOOTER_LINK}>
            {locale === 'en' ? 'Terms' : '利用規約'}
          </Link>
          {/* 免責事項（権利表記と非公式である旨）はサイドバーとハンバーガーの中にしか
              導線が無く、モバイルからは事実上たどり着けなかった */}
          <Link href="/legal" className={FOOTER_LINK}>
            {locale === 'en' ? 'Disclaimer' : '免責事項'}
          </Link>
          {/* プライバシーポリシーと問い合わせ先は、広告配信の同意まわりで参照されるため
              全ページ共通のフッターから1タップで開けるようにする。
              サイドバーはデスクトップ限定、タブバーはハンバーガーの中で、どちらも見つけにくい */}
          <Link href="/privacy" className={FOOTER_LINK}>
            {locale === 'en' ? 'Privacy Policy' : 'プライバシーポリシー'}
          </Link>
          <Link href="/contact" className={FOOTER_LINK}>
            {locale === 'en' ? 'Contact' : 'お問い合わせ'}
          </Link>
          <Link href="/links" className={FOOTER_LINK}>
            {locale === 'en' ? 'Links' : 'リンク集'}
          </Link>
          {/* 同意画面を出した地域でだけ表示される。プライバシーポリシーから参照している導線 */}
          <PrivacySettingsLink className={FOOTER_LINK} />
        </nav>
        {/* 姉妹サイト。検索から下層ページに着地した読者は、ここ以外で存在を知る手段がない。
            外部URLなので next-intl の Link ではなく素の a を使う */}
        {/* 以前は「/」で区切っていたが、3本だと 390px でも1行に収まらず、区切りが行末か行頭に残る。
            上のフッターのリンクと同じく区切りを置かずに間隔で分け、見出しは1行目に置く
            （スマホでは以前から見出しだけが1行目に来ていた） */}
        <div className="mb-1 text-sm font-bold">
          <p className="text-slate-500">{locale === 'en' ? 'Our other sites' : '姉妹サイト'}</p>
          <ul className="flex flex-wrap justify-center gap-x-6">
            {SISTER_SITES.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  {...(s.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={FOOTER_LINK}
                >
                  {locale === 'en' ? s.en : s.ja}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm font-bold text-slate-500 mb-2">
          {/* 年は描画した時刻から取らない。フッターはクライアント部品の中にあり、年をまたぐと
              ビルド時の年とブラウザの年が食い違ってハイドレーションが失敗する（React #418）。
              権利を主張するのは当サイトが書いた文章と作った図だけ。ゲームの画像やデータは下の行の権利者のもの
              （2026-11-14、AdSense の片づけ A6。以前は「All rights reserved.」とだけ書いていた） */}
          {t('copyright', { year: dataFreshness.site.lastUpdated.slice(0, 4) })}
        </p>
        {/* 出典は1行の概要と about へのリンクにする（2026-11-14、A6）。当サイトが作ったものを先に書き、
            公式のものは出典として後ろに回す。項目ごとの出どころは about の表にある。
            以前はここに4文あり、全ページの末尾で同じ説明を繰り返していた。
            14px で 360〜390px のときに語の途中で割れないよう、日本語は文節で折り（auto-phrase）、日付は nowrap で1語に保つ */}
        <p className="text-sm font-bold text-slate-500 mb-2 leading-relaxed [word-break:auto-phrase]">
          {t('made')}
          {locale === 'en' ? ' ' : ''}
          {t.rich('source', {
            source: locale === 'en' ? dataFreshness.campStats.sourceEn : dataFreshness.campStats.sourceJa,
            date: dataFreshness.campStats.updatedAt,
            nw: (chunks) => <span className="whitespace-nowrap">{chunks}</span>,
          })}
          {locale === 'en' ? ' ' : ''}
          <Link href="/about" className="text-brand-700 underline underline-offset-2 hover:text-brand-700">
            {t('aboutLink')}
          </Link>
        </p>
        <p className="text-sm font-bold text-slate-500 [word-break:auto-phrase]">
          {locale === 'en'
            ? 'This website is an unofficial fan site and is not affiliated with Tencent or Level Infinite in any way.' 
            : '当サイトは非公式ファンサイトです。TencentやLevel Infiniteとは一切関係ありません。'
          }<br/>
          Honor of Kings is a registered trademark of Tencent.
          {/* グローバル版の運営会社の権利表記（2026-11-14、A6）。Tencent と Level Infinite の行は監査（広告と法務）が必須にしている */}
          <br/>
          Game images and text © Proxima Beta Pte. Limited.
        </p>
      </div>
    </footer>
  );
}
