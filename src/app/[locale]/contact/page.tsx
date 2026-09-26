import { setRequestLocale } from 'next-intl/server';
import { MessageCircle, Mail } from "lucide-react";
import { buildPageMetadata } from '@/lib/buildMetadata';

// 夜の配色（2026-09-26）の固定ページ。冒頭は見本（Tier表・ヒーロー一覧）と同じ .page-hero の帯、
// 節は金の縦線の見出し（.section-title）を持つカードにする。影は暗い地で見えないので線で区切る
// 見出しと短い説明は [word-break:auto-phrase]（Chrome は文節で折る。ガイドのページと同じ）。
// 360px で「につい／て」「アク／セス」「ゲ／ーム攻略」など語の途中で折れていた
const CARD = 'rounded-2xl border border-slate-200 bg-white p-5 sm:p-7';
// 連絡先の2つのボタン。丸はもともと金と墨の塗りだったが、金の塗りは Tier S のバッジだけに残し、
// 墨の塗りは夜の配色で白く光るので、どちらも線と淡い地にする
const CONTACT_LINK =
  'group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 sm:w-auto sm:pr-8';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/contact',
    title: isJa ? "お問い合わせ" : "Contact Us",
    description: isJa ? "Honor of Kings Hub へのお問い合わせ・ご意見・データ修正のご報告はこちらから。" : "Contact Honor of Kings Hub for questions, feedback, or data corrections.",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。これが無いと next-intl の useLocale が
  // リクエスト時解決になり、このページだけ動的レンダリング（ƒ）に落ちる
  setRequestLocale(locale);

  if (locale === 'en') {
    return (
      <div className="pb-10">
        <div className="page-hero border-b border-slate-200">
          <div className="mx-auto max-w-3xl px-5 pt-6 pb-5 sm:px-7">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Contact & Operator Info</h1>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
          <p className="px-5 sm:px-7">
            If you have any questions, feedback, business inquiries, or found a data issue or bug on the site, feel free to reach out to us via Email or X (Twitter).
          </p>
          
          <div className={CARD}>
            <h2 className="section-title [word-break:auto-phrase]">Operator Information</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li><strong className="text-slate-900">Site Name:</strong> Honor of Kings Hub</li>
              <li><strong className="text-slate-900">Site URL:</strong> https://hok.hub-game.com</li>
              {/* 免責事項ページの「個人が運営する非公式のファンサイト」と表記を揃える */}
              <li><strong className="text-slate-900">Operated by:</strong> An individual (personal, non-official fan site)</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a 
              href="mailto:contact@hub-game.com" 
              className={CONTACT_LINK}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-500 bg-brand-50 text-brand-700">
                <Mail size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 transition-colors group-hover:text-brand-700">Email Us</div>
                <div className="text-sm text-slate-600">contact@hub-game.com</div>
              </div>
            </a>

            <a 
              href="https://x.com/hub_gamecom" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={CONTACT_LINK}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-900">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 transition-colors group-hover:text-brand-700">Contact via X (Twitter)</div>
                <div className="text-sm text-slate-600">@hub_gamecom</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="page-hero border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-5 pt-6 pb-5 sm:px-7">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">運営者情報・お問い合わせ</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl space-y-4 pt-4 text-base leading-relaxed text-slate-700">
        <p className="px-5 sm:px-7">
          当サイトをご利用いただきありがとうございます。<br />
          サイト内のデータ間違い（スキルの数値ミスなど）やバグの報告、機能のご要望、お仕事のご相談などがございましたら、以下のメールアドレスまたはX（旧Twitter）アカウントまでお気軽にご連絡ください。
        </p>
        
        <div className={CARD}>
          <h2 className="section-title [word-break:auto-phrase]">運営者情報</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li><strong className="text-slate-900">サイト名:</strong> Honor of Kings Hub（オナーオブキングス攻略データベース）</li>
            <li><strong className="text-slate-900">サイトURL:</strong> https://hok.hub-game.com</li>
            {/* 免責事項ページの「個人が運営する非公式のファンサイト」と表記を揃える */}
            <li><strong className="text-slate-900">運営主体:</strong> 個人（非公式のファンサイトです）</li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a 
            href="mailto:contact@hub-game.com" 
            className={CONTACT_LINK}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-500 bg-brand-50 text-brand-700">
              <Mail size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-900 transition-colors group-hover:text-brand-700">メールで連絡する</div>
              <div className="text-sm text-slate-600">contact@hub-game.com</div>
            </div>
          </a>

          <a 
            href="https://x.com/hub_gamecom" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={CONTACT_LINK}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-900">
              <MessageCircle size={20} />
            </div>
            <div>
              <div className="font-bold text-slate-900 transition-colors group-hover:text-brand-700">X（旧Twitter）で連絡する</div>
              <div className="text-sm text-slate-600">@hub_gamecom</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
