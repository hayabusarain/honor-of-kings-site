import { Link } from "@/i18n/routing";
import dataFreshness from '@/data/data_freshness.json';
import { useLocale } from "next-intl";
import { PrivacySettingsLink } from "@/components/consent/PrivacySettingsLink";

export function Footer() {
  const locale = useLocale();

  return (
    <footer className="w-full bg-white border-t border-slate-200 py-8 mt-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <nav className="flex justify-center flex-wrap gap-6 text-sm my-6">
          <Link href="/tier-list" className="text-slate-400 hover:text-brand-400 transition-colors">
            {locale === 'en' ? 'Tier List' : 'Tier表'}
          </Link>
          <Link href="/guide" className="text-slate-400 hover:text-brand-400 transition-colors">
            {locale === 'en' ? 'Guide' : '初心者ガイド'}
          </Link>
          <Link href="/terms" className="text-slate-400 hover:text-brand-400 transition-colors">
            {locale === 'en' ? 'Terms' : '利用規約'}
          </Link>
          {/* プライバシーポリシーと問い合わせ先は、広告配信の同意まわりで参照されるため
              全ページ共通のフッターから1タップで開けるようにする。
              サイドバーはデスクトップ限定、タブバーはハンバーガーの中で、どちらも見つけにくい */}
          <Link href="/privacy" className="text-slate-400 hover:text-brand-400 transition-colors">
            {locale === 'en' ? 'Privacy Policy' : 'プライバシーポリシー'}
          </Link>
          <Link href="/contact" className="text-slate-400 hover:text-brand-400 transition-colors">
            {locale === 'en' ? 'Contact' : 'お問い合わせ'}
          </Link>
          <Link href="/links" className="text-slate-400 hover:text-brand-400 transition-colors">
            {locale === 'en' ? 'Links' : 'リンク集'}
          </Link>
          {/* 同意画面を出した地域でだけ表示される。プライバシーポリシーから参照している導線 */}
          <PrivacySettingsLink className="text-slate-400 hover:text-brand-400 transition-colors" />
        </nav>
        <p className="text-xs font-bold text-slate-500 mb-2">
          © {new Date().getFullYear()} Honor of Kings Hub. All rights reserved.
        </p>
        {/* どのデータがどこ由来かを分けて書く。統計と解説を同じ信頼度だと誤解されないようにする */}
        <p className="text-[10px] font-bold text-slate-400 mb-2 leading-relaxed">
          {locale === 'en'
            // 書き起こしているのは数値だけでなく説明文の全文。data_freshness の
            // noteJa は正しく「数値と説明文」と書いているので、そちらに粒度を揃える
            ? `Tier, win rate, pick rate and ban rate are taken from ${dataFreshness.campStats.sourceEn} statistics (as of ${dataFreshness.campStats.updatedAt}). Skill values and descriptions are transcribed from ${dataFreshness.skillData.sourceEn}. Patch notes are translated from ${dataFreshness.patchNotes.sourceEn}. Matchups, synergies and strategy write-ups are this site's own commentary.`
            : `Tier・勝率・出現率・BAN率は${dataFreshness.campStats.sourceJa}の統計（${dataFreshness.campStats.updatedAt}時点）です。スキルの数値と説明文は${dataFreshness.skillData.sourceJa}から書き起こしています。パッチの変更内容は${dataFreshness.patchNotes.sourceJa}の翻訳です。相性・立ち回りの解説は当サイト独自のものです。`}
        </p>
        <p className="text-[10px] font-bold text-slate-400">
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
