import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  return {
    title: isJa ? "プライバシーポリシー" : "Privacy Policy",
    description: isJa ? "Honor of Kings Hub の個人情報・Cookie・広告配信の取り扱いについて。" : "How Honor of Kings Hub handles personal data, cookies, and advertising.",
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { 'ja': '/ja/privacy', 'en': '/en/privacy', 'x-default': '/en/privacy' },
    },
  };
}

export default function PrivacyPage() {
  const locale = useLocale();
  
  if (locale === 'en') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100 transition-colors">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Analytics Tools</h2>
            <p>
              This website uses Google Analytics to collect anonymous usage data (e.g., pages visited, browser type) to improve user experience. Traffic data is collected anonymously and does not identify individuals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Google AdSense</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
              <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Ads Settings</a>. You can also opt out of third-party vendors&apos; use of cookies for personalized advertising at <a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">www.aboutads.info</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Disclaimer</h2>
            <p>
              We accept no responsibility for the information or services provided by any site you reach through a link or banner on this website. We work to keep the content here accurate, but we do not guarantee its accuracy or completeness, and some of it will go out of date as the game is patched. We cannot accept liability for any loss arising from the use of the information published here.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Contact</h2>
            <p>
              For questions about this policy, or to request disclosure or deletion of your data, reach us at <a href="mailto:contact@hub-game.com" className="text-brand-600 hover:underline">contact@hub-game.com</a>. Other ways to get in touch are listed on the <Link href="/contact" className="text-brand-600 hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100 transition-colors">
      <h1 className="text-3xl font-black text-slate-800 mb-6">プライバシーポリシー</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">1. アクセス解析ツールについて</h2>
          <p>
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">2. Google AdSense について</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>当サイトでは、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用する場合があります。</li>
            <li>Google などの第三者配信事業者は、ユーザーの当サイトや他のウェブサイトへの過去のアクセス情報に基づいて、Cookie を使用した広告（パーソナライズド広告）を配信します。</li>
            <li>ユーザーは<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">広告設定</a>にアクセスすることで、パーソナライズド広告を無効にできます。また、<a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">www.aboutads.info</a> にアクセスすれば、第三者配信事業者の Cookie 使用を無効にできます。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">3. 免責事項</h2>
          <p>
            当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">4. プライバシーポリシーの変更について</h2>
          <p>
            当サイトは、本ポリシーの内容を適宜見直し、必要に応じて変更することがあります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">5. お問い合わせ窓口</h2>
          <p>
            本ポリシーに関するご質問、および個人情報の開示・削除のご請求は <a href="mailto:contact@hub-game.com" className="text-brand-600 hover:underline">contact@hub-game.com</a> までお願いします。その他の連絡手段は<Link href="/contact" className="text-brand-600 hover:underline">お問い合わせページ</Link>に記載しています。
          </p>
        </section>
      </div>
    </div>
  );
}

export const revalidate = 3600;
