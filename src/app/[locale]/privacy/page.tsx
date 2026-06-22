import { useLocale } from "next-intl";

export default function PrivacyPage() {
  const locale = useLocale();
  
  if (locale === 'en') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h2>
            <p>This website uses tools like Google Analytics to collect anonymous usage data (e.g., pages visited, browser type) to improve user experience.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Google AdSense</h2>
            <p>We may use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to this website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page.</p>
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
          <p>当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにクッキー（Cookie）を使用しております。トラフィックデータは匿名で収集されており、個人を特定するものではありません。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">2. 広告の配信について</h2>
          <p>当サイトは、第三者配信の広告サービス（Google AdSense等）を利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにクッキー（Cookie）を使用することがあります。クッキーを無効にする設定およびGoogleアドセンスに関する詳細は「広告 – ポリシーと規約 – Google」をご覧ください。</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">3. 免責事項</h2>
          <p>当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。</p>
        </section>
      </div>
    </div>
  );
}
