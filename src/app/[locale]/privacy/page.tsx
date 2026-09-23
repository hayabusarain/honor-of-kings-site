import { setRequestLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import { buildPageMetadata } from '@/lib/buildMetadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return buildPageMetadata({
    locale,
    path: '/privacy',
    title: isJa ? "プライバシーポリシー" : "Privacy Policy",
    description: isJa ? "Honor of Kings Hub の個人情報・Cookie・広告配信の取り扱いについて。" : "How Honor of Kings Hub handles personal data, cookies, and advertising.",
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // 静的プリレンダに載せるために必要。これが無いと next-intl の useLocale が
  // リクエスト時解決になり、このページだけ動的レンダリング（ƒ）に落ちる
  setRequestLocale(locale);
  
  if (locale === 'en') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Analytics Tools</h2>
            <p>
              This website uses Google Analytics to understand how the site is used (for example which pages are opened and which browser is used). Google Analytics sets cookies to collect that traffic data. The data is collected in aggregate and does not identify individuals. You can stop Google Analytics from measuring your visits entirely by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Google Analytics Opt-out Browser Add-on</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Google AdSense</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
              <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Ads Settings</a>. You can also opt out of third-party vendors&apos; use of cookies for personalized advertising at <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">www.aboutads.info</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Consent in the EEA, the UK and Switzerland</h2>
            <p className="mb-3">
              If you are visiting from the European Economic Area, the United Kingdom or Switzerland, no cookies are used for analytics or for personalised advertising until you agree to them. Until you make a choice, those categories stay switched off, and advertising identifiers are redacted from the requests we send to Google.
            </p>
            <p className="mb-3">
              You are asked for that choice in a consent dialog managed through Google&apos;s certified consent management platform. Your decision covers storage on your device, analytics measurement, and whether your data is used to personalise ads.
            </p>
            <p>
              You can change or withdraw your consent at any time. Where the consent dialog was shown, a &ldquo;Privacy settings&rdquo; link appears in the site footer to reopen it. Withdrawing consent does not affect processing that already took place while consent was in force.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Disclaimer</h2>
            <p>
              We accept no responsibility for the information or services provided by any site you reach through a link or banner on this website. We work to keep the content here accurate, but we do not guarantee its accuracy or completeness, and some of it will go out of date as the game is patched. We cannot accept liability for any loss arising from the use of the information published here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">6. Contact</h2>
            <p>
              For questions about this policy, or to request disclosure or deletion of your data, reach us at <a href="mailto:contact@hub-game.com" className="text-brand-700 underline">contact@hub-game.com</a>. Other ways to get in touch are listed on the <Link href="/contact" className="text-brand-700 underline">contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
      <h1 className="text-3xl font-black text-slate-800 mb-6">プライバシーポリシー</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">1. アクセス解析ツールについて</h2>
          <p>
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。計測そのものを停止したい場合は、<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Googleアナリティクス オプトアウト アドオン</a>をご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">2. Google AdSense について</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>当サイトでは、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用しています。</li>
            <li>Google などの第三者配信事業者は、ユーザーの当サイトや他のウェブサイトへの過去のアクセス情報に基づいて、Cookie を使用した広告（パーソナライズド広告）を配信します。</li>
            <li>ユーザーは<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">広告設定</a>にアクセスすることで、パーソナライズド広告を無効にできます。また、<a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">www.aboutads.info</a> にアクセスすれば、第三者配信事業者の Cookie 使用を無効にできます。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">3. EEA・英国・スイスからのアクセスにおける同意について</h2>
          <p className="mb-3">
            欧州経済領域（EEA）、英国、スイスからアクセスされた場合、解析用およびパーソナライズド広告用のCookieは、同意をいただくまで使用しません。選択いただくまでこれらは無効の状態で、Googleへ送る情報からも広告識別子を除去しています。
          </p>
          <p className="mb-3">
            同意の確認は、Googleの認定を受けた同意管理プラットフォーム（CMP）による画面で行います。ここでの選択は、端末への保存、アクセス解析による計測、および広告のパーソナライズに情報を使うかどうかを対象とします。
          </p>
          <p>
            同意はいつでも変更・撤回できます。同意画面が表示された環境では、フッターに「プライバシー設定」が出ますので、そこから選択をやり直してください。なお、撤回前にすでに行われた処理までは取り消されません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">4. 免責事項</h2>
          <p>
            当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">5. プライバシーポリシーの変更について</h2>
          <p>
            当サイトは、本ポリシーの内容を適宜見直し、必要に応じて変更することがあります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">6. お問い合わせ窓口</h2>
          <p>
            本ポリシーに関するご質問、および個人情報の開示・削除のご請求は <a href="mailto:contact@hub-game.com" className="text-brand-700 underline">contact@hub-game.com</a> までお願いします。その他の連絡手段は<Link href="/contact" className="text-brand-700 underline">お問い合わせページ</Link>に記載しています。
          </p>
        </section>
      </div>
    </div>
  );
}
