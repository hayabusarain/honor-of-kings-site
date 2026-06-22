import { useLocale } from "next-intl";
import { MessageCircle, Mail } from "lucide-react";

export default function ContactPage() {
  const locale = useLocale();

  if (locale === 'en') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Contact & About</h1>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>If you have any questions, feedback, or found a bug on the site, feel free to reach out via X (Twitter).</p>
          
          <div className="mt-8 flex flex-col gap-4">
            <a href="https://x.com/hub_gamecom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 w-fit pr-8">
              <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-800">Contact via X (Twitter)</div>
                <div className="text-sm text-slate-500">@hub_gamecom</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
      <h1 className="text-3xl font-black text-slate-800 mb-6">運営者情報・お問い合わせ</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>
          当サイトをご利用いただきありがとうございます。<br />
          サイト内のデータ間違い（スキルの数値ミスなど）やバグの報告、機能のご要望などがございましたら、運営者のX（旧Twitter）アカウントまでお気軽にお声掛けください。
        </p>
        
        <div className="mt-8 flex flex-col gap-4">
          <a href="https://x.com/hub_gamecom" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 w-fit pr-8">
            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white">
              <MessageCircle size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-800">X（旧Twitter）で連絡する</div>
              <div className="text-sm text-slate-500">@hub_gamecom</div>
            </div>
          </a>
        </div>
        
        <section className="mt-12 pt-8 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-3">運営について</h2>
          <p className="text-sm">
            本サイトはHonor of Kingsのいちプレイヤーによって開発・運営されている非公式データベースです。
            皆様のランクマッチや戦略構築のお役に立てれば幸いです。
          </p>
        </section>
      </div>
    </div>
  );
}
