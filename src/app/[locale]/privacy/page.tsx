import { useLocale } from "next-intl";

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
      <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm my-8 border border-slate-100 dark:border-slate-800 transition-colors">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">1. Analytics Tools</h2>
            <p>
              This website uses Google Analytics to collect anonymous usage data (e.g., pages visited, browser type) to improve user experience. Traffic data is collected anonymously and does not identify individuals.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">2. Amazon Associate Program</h2>
            <p className="mb-2">
              Honor of Kings Hub is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.co.jp.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Third parties (including Amazon and other advertisers) may serve content and advertisements, collect information directly from visitors, and place or recognize cookies on visitors&apos; browsers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">3. Google AdSense</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.</li>
              <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Ads Settings</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">4. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm my-8 border border-slate-100 dark:border-slate-800 transition-colors">
      <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-6">プライバシーポリシー</h1>
      <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">1. アクセス解析ツールについて</h2>
          <p>
            当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">2. 広告の配信・Amazonアソシエイトについて</h2>
          <p className="mb-2">
            当サイト（Honor of Kings Hub）は、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>第三者（Amazonやその他の広告配信事業者）がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookieを設定したり、認識したりする場合があります。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">3. Google AdSense について</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>当サイトでは、第三者配信の広告サービス「Google AdSense（グーグルアドセンス）」を利用する場合があります。</li>
            <li>Google などの第三者配信事業者は、ユーザーの当サイトや他のウェブサイトへの過去のアクセス情報に基づいて、Cookie を使用した広告（パーソナライズド広告）を配信します。</li>
            <li>ユーザーは<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">広告設定</a>にアクセスすることで、パーソナライズド広告を無効にできます。また、<a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">www.aboutads.info</a> にアクセスすれば、第三者配信事業者の Cookie 使用を無効にできます。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">4. 免責事項</h2>
          <p>
            当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">5. プライバシーポリシーの変更について</h2>
          <p>
            当サイトは、本ポリシーの内容を適宜見直し、必要に応じて変更することがあります。変更後のプライバシーポリシーは、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>
      </div>
    </div>
  );
}

export const revalidate = 3600;
