import { Link } from "@/i18n/routing";
import dataFreshness from '@/data/data_freshness.json';
import { useLocale } from "next-intl";
import { PrivacySettingsLink } from "@/components/consent/PrivacySettingsLink";

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 mt-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <nav
          aria-label={locale === 'en' ? 'Footer' : 'フッター'}
          className="flex justify-center flex-wrap gap-6 text-sm my-6"
        >
          <Link href="/tier-list" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'Tier List' : 'Tier表'}
          </Link>
          <Link href="/guide" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'Guide' : '初心者ガイド'}
          </Link>
          {/* データの出どころと検証範囲。運営者が誰でどう作っているかを外から確かめる入口なので、
              全ページ共通のフッターに置く */}
          <Link href="/about" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'About' : 'このサイトについて'}
          </Link>
          <Link href="/terms" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'Terms' : '利用規約'}
          </Link>
          {/* 免責事項（AI利用の開示と非公式である旨）はサイドバーとハンバーガーの中にしか
              導線が無く、モバイルからは事実上たどり着けなかった */}
          <Link href="/legal" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'Disclaimer' : '免責事項'}
          </Link>
          {/* プライバシーポリシーと問い合わせ先は、広告配信の同意まわりで参照されるため
              全ページ共通のフッターから1タップで開けるようにする。
              サイドバーはデスクトップ限定、タブバーはハンバーガーの中で、どちらも見つけにくい */}
          <Link href="/privacy" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'Privacy Policy' : 'プライバシーポリシー'}
          </Link>
          <Link href="/contact" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'Contact' : 'お問い合わせ'}
          </Link>
          <Link href="/links" className="text-slate-600 hover:text-brand-700 transition-colors">
            {locale === 'en' ? 'Links' : 'リンク集'}
          </Link>
          {/* 同意画面を出した地域でだけ表示される。プライバシーポリシーから参照している導線 */}
          <PrivacySettingsLink className="text-slate-600 hover:text-brand-700 transition-colors" />
        </nav>
        {/* 姉妹サイト。検索から下層ページに着地した読者は、ここ以外で存在を知る手段がない。
            外部URLなので next-intl の Link ではなく素の a を使う */}
        <p className="text-xs font-bold text-slate-500 mb-4">
          <span className="mr-2">{locale === 'en' ? 'Our other sites' : '姉妹サイト'}</span>
          <a
            href="https://hub-game.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-brand-700 transition-colors"
          >
            {locale === 'en' ? 'hub-game.com (portal)' : 'hub-game.com（ポータル）'}
          </a>
          <span className="mx-2 text-slate-400" aria-hidden="true">/</span>
          <a
            href="https://wildrift.hub-game.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-brand-700 transition-colors"
          >
            Wild Rift Hub
          </a>
        </p>
        <p className="text-xs font-bold text-slate-500 mb-2">
          © {new Date().getFullYear()} Honor of Kings Hub. All rights reserved.
        </p>
        {/* どのデータがどこ由来かを分けて書く。統計と解説を同じ信頼度だと誤解されないようにする */}
        {/* slate-400 の 10px は白背景でコントラスト比が3:1を切って読めなかったため、1段濃く・大きくした */}
        <p className="text-[11px] font-bold text-slate-500 mb-2 leading-relaxed">
          {locale === 'en'
            // 書き起こしているのは数値だけでなく説明文の全文。data_freshness の
            // noteJa は正しく「数値と説明文」と書いているので、そちらに粒度を揃える
            ? `Tier, win rate, pick rate and ban rate are taken from ${dataFreshness.campStats.sourceEn} statistics (as of ${dataFreshness.campStats.updatedAt}). Skill values and descriptions are transcribed from ${dataFreshness.skillData.sourceEn}. Patch changes are summarised from ${dataFreshness.patchNotes.sourceEn} and written up by this site. Matchups, synergies and strategy write-ups are this site's own commentary.`
            : `Tier・勝率・出現率・BAN率は${dataFreshness.campStats.sourceJa}の統計（${dataFreshness.campStats.updatedAt}時点）です。スキルの数値と説明文は${dataFreshness.skillData.sourceJa}から書き起こしています。パッチの変更内容は${dataFreshness.patchNotes.sourceJa}をもとに当サイトがまとめています。相性・立ち回りの解説は当サイト独自のものです。`}
        </p>
        <p className="text-[11px] font-bold text-slate-500">
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
