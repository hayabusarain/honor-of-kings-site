import { useLocale } from "next-intl";
import { MessageCircle, Mail, UserCheck } from "lucide-react";

export default function ContactPage() {
  const locale = useLocale();

  if (locale === 'en') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm my-8 border border-slate-100 dark:border-slate-800 transition-colors">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-6">Contact & Operator Info</h1>
        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            If you have any questions, feedback, business inquiries, or found a data issue or bug on the site, feel free to reach out to us via Email or X (Twitter).
          </p>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <UserCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
              <span>Operator Information</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li><strong>Site Name:</strong> Honor of Kings Hub</li>
              <li><strong>Site URL:</strong> https://hok.hub-game.com</li>
              <li><strong>Management:</strong> Honor of Kings Hub Development Team</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:contact@hub-game.com" 
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-2xl border border-slate-200/80 dark:border-slate-700/80 w-full sm:w-auto pr-8 group"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Email Us</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">contact@hub-game.com</div>
              </div>
            </a>

            <a 
              href="https://x.com/hub_gamecom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-2xl border border-slate-200/80 dark:border-slate-700/80 w-full sm:w-auto pr-8 group"
            >
              <div className="w-10 h-10 bg-slate-900 dark:bg-slate-700 rounded-full flex items-center justify-center text-white shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Contact via X (Twitter)</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">@hub_gamecom</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm my-8 border border-slate-100 dark:border-slate-800 transition-colors">
      <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-6">運営者情報・お問い合わせ</h1>
      <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          当サイトをご利用いただきありがとうございます。<br />
          サイト内のデータ間違い（スキルの数値ミスなど）やバグの報告、機能のご要望、お仕事のご相談などがございましたら、以下のメールアドレスまたはX（旧Twitter）アカウントまでお気軽にご連絡ください。
        </p>
        
        <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <UserCheck className="text-indigo-600 dark:text-indigo-400" size={20} />
            <span>運営者情報</span>
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li><strong>サイト名:</strong> Honor of Kings Hub（オナー・オブ・キングス攻略データベース）</li>
            <li><strong>サイトURL:</strong> https://hok.hub-game.com</li>
            <li><strong>運営主体:</strong> Honor of Kings Hub 運営チーム</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <a 
            href="mailto:contact@hub-game.com" 
            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-2xl border border-slate-200/80 dark:border-slate-700/80 w-full sm:w-auto pr-8 group"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">メールで連絡する</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">contact@hub-game.com</div>
            </div>
          </a>

          <a 
            href="https://x.com/hub_gamecom" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-2xl border border-slate-200/80 dark:border-slate-700/80 w-full sm:w-auto pr-8 group"
          >
            <div className="w-10 h-10 bg-slate-900 dark:bg-slate-700 rounded-full flex items-center justify-center text-white shrink-0">
              <MessageCircle size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">X（旧Twitter）で連絡する</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">@hub_gamecom</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;
