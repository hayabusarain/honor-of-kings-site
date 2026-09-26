import { Link } from "@/i18n/routing";
import dataFreshness from '@/data/data_freshness.json';
import { useLocale } from "next-intl";
import { PrivacySettingsLink } from "@/components/consent/PrivacySettingsLink";

/**
 * フッターのリンク。文字だけだと高さ17〜20pxの的で、全ページで押しにくかった。
 * 各リンクを44pxにし、行の間は gap-y で空けずにリンク自身の高さで取る。
 * 行の間隔は 20px＋24px から 44px になるだけで、見た目はほぼ変わらない
 */
const FOOTER_LINK = "inline-flex min-h-11 items-center text-slate-600 hover:text-brand-700 transition-colors";

/**
 * 姉妹サイト。ポータル → 個別サイトの順（まず全体の入口を見せる）。
 * MLBB Hub は 2026-08-31 にこの欄を作ったあとに公開され、2026-09-26 まで抜けていた
 * （MLBB 側のフッターは HoK を載せていた）。サイトが増えたらここに足す。
 */
const SISTER_SITES = [
  { href: 'https://hub-game.com/', ja: 'hub-game.com（ポータル）', en: 'hub-game.com (portal)' },
  { href: 'https://wildrift.hub-game.com/', ja: 'Wild Rift Hub', en: 'Wild Rift Hub' },
  { href: 'https://mlbb.hub-game.com/', ja: 'MLBB Hub', en: 'MLBB Hub' },
];

export function Footer() {
  const locale = useLocale();

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
          {/* 免責事項（AI利用の開示と非公式である旨）はサイドバーとハンバーガーの中にしか
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
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={FOOTER_LINK}>
                  {locale === 'en' ? s.en : s.ja}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm font-bold text-slate-500 mb-2">
          {/* 年は描画した時刻から取らない。フッターはクライアント部品の中にあり、年をまたぐと
              ビルド時の年とブラウザの年が食い違ってハイドレーションが失敗する（React #418） */}
          © {dataFreshness.site.lastUpdated.slice(0, 4)} Honor of Kings Hub. All rights reserved.
        </p>
        {/* どのデータがどこ由来かを分けて書く。統計と解説を同じ信頼度だと誤解されないようにする */}
        {/* slate-400 の 10px は白背景でコントラスト比が3:1を切って読めなかったため、1段濃く・大きくした。
            読む文は12px以上の方針に合わせ、11px から 12px にした（2026-09-25）。
            2026-09-26 から文字は 14px 以上なので、フッターの4段落はすべて text-sm。
            14px にすると 360〜390px で「で / す」「書き起 / こして」「2026- / 09-11」と語の途中で割れたので、
            日本語は文節で折り（auto-phrase）、日付は nowrap で1語に保つ */}
        <p className="text-sm font-bold text-slate-500 mb-2 leading-relaxed [word-break:auto-phrase]">
          {locale === 'en' ? (
            // 書き起こしているのは数値だけでなく説明文の全文。data_freshness の
            // noteJa は正しく「数値と説明文」と書いているので、そちらに粒度を揃える
            <>
              {`Tier, win rate, pick rate and ban rate are taken from ${dataFreshness.campStats.sourceEn} statistics (as of `}
              <span className="whitespace-nowrap">{dataFreshness.campStats.updatedAt}</span>
              {`). Skill values and descriptions are transcribed from ${dataFreshness.skillData.sourceEn}. Patch changes are summarised from ${dataFreshness.patchNotes.sourceEn} and written up by this site. Matchups, synergies and strategy write-ups are this site's own commentary.`}
            </>
          ) : (
            <>
              {`Tier・勝率・出現率・BAN率は${dataFreshness.campStats.sourceJa}の統計（`}
              <span className="whitespace-nowrap">{dataFreshness.campStats.updatedAt}</span>
              {`時点）です。スキルの数値と説明文は${dataFreshness.skillData.sourceJa}から書き起こしています。パッチの変更内容は${dataFreshness.patchNotes.sourceJa}をもとに当サイトがまとめています。相性・立ち回りの解説は当サイト独自のものです。`}
            </>
          )}
        </p>
        <p className="text-sm font-bold text-slate-500 [word-break:auto-phrase]">
          {locale === 'en'
            ? 'This website is an unofficial fan site and is not affiliated with Tencent or Level Infinite in any way.' 
            : '当サイトは非公式ファンサイトです。TencentやLevel Infiniteとは一切関係ありません。'
          }<br/>
          Honor of Kings is a registered trademark of Tencent.
        </p>
      </div>
    </footer>
  );
}
