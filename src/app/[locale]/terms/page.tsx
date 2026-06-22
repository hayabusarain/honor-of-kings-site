import { useLocale } from "next-intl";

export default function TermsPage() {
  const locale = useLocale();

  if (locale === 'en') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Terms of Service</h1>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <p>
            Welcome to Honor of Kings Hub. By accessing or using our website, you agree to comply with and be bound by these Terms of Service.
          </p>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing Honor of Kings Hub, you accept these terms in full. If you disagree with any part of these terms, please do not use our website.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">2. Intellectual Property</h2>
            <p>
              All game data, images, icons, and assets shown on this site belong to Tencent Inc., Level Infinite, or their respective owners. Original content, custom calculators, and site designs are property of Honor of Kings Hub.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">3. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following activities:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Using the site for any unlawful purpose.</li>
              <li>Attempting to disrupt or interfere with the server, network, or security of the site.</li>
              <li>Scraping or harvesting data from the site without prior authorization.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">4. Limitation of Liability</h2>
            <p>
              The content on this website is provided "as is". We make no warranties, expressed or implied, regarding the accuracy, completeness, or reliability of any data. Please refer to our <a href="/legal" className="text-blue-600 hover:underline">Legal Disclaimer</a> for more details.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Your continued use of the website following any changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
      <h1 className="text-3xl font-black text-slate-800 mb-6">利用規約</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <p>
          Honor of Kings Hub（以下「当サイト」）をご利用いただきありがとうございます。当サイトをご利用いただくにあたり、以下の利用規約（以下「本規約」）にご同意いただいたものとみなします。
        </p>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">第1条（規約の適用）</h2>
          <p>
            本規約は、当サイトの利用者すべてに適用されます。本規約に同意できない場合は、当サイトのご利用をお控えください。
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">第2条（知的財産権）</h2>
          <p>
            当サイト内で使用されているゲーム内の画像、アイコン、キャラクターデータ等の知的財産権は、すべて Tencent Inc.、Level Infinite およびその他の権利者に帰属します。
            当サイトが独自に作成したテキスト、デザイン、計算ツール等に関する著作権は当サイト運営者に帰属します。
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">第3条（禁止事項）</h2>
          <p>利用者は、当サイトの利用にあたり、以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>法令または公序良俗に違反する行為。</li>
            <li>当サイトのサーバーやネットワークの機能を破壊・妨害する行為。</li>
            <li>当サイトの運営を妨害、またはその恐れのある行為。</li>
            <li>他の利用者に対する嫌がらせや誹謗中傷行為。</li>
            <li>自動スクレイピングツール等を用いて、過度な負荷をかける行為。</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">第4条（免責事項）</h2>
          <p>
            当サイトに掲載されている情報の正確性や最新性については細心の注意を払っておりますが、その保証はいたしかねます。当サイトの利用により生じた損害等について、運営者は一切の責任を負いません。
            詳細は<a href="/legal" className="text-blue-600 hover:underline">免責事項</a>のページをご確認ください。
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">第5条（規約の変更）</h2>
          <p>
            当サイトは、必要に応じて本規約を変更することがあります。変更後の規約は当サイト上に掲載された時点で効力を生じるものとします。
          </p>
        </section>
      </div>
    </div>
  );
}
