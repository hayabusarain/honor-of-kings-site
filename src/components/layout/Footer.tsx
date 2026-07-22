import { Link } from "@/i18n/routing";
import { AmazonProductCard } from "@/components/common/AmazonProductCard";

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* ワイリフサイト同等の非侵入型 Amazon ギアバナー (指サック、クーラー、バッテリー、イヤホン) */}
        <div className="mb-6">
          <AmazonProductCard />
        </div>

        <nav className="flex justify-center flex-wrap gap-6 text-sm my-6">
          <Link href="/tier-list" className="text-slate-400 hover:text-indigo-400 transition-colors">
            Tier List
          </Link>
          <Link href="/guide" className="text-slate-400 hover:text-indigo-400 transition-colors">
            Guide
          </Link>
          <Link href="/terms" className="text-slate-400 hover:text-indigo-400 transition-colors">
            Terms
          </Link>
          <Link href="/links" className="text-slate-400 hover:text-indigo-400 transition-colors">
            Links
          </Link>
        </nav>
        <p className="text-xs font-bold text-slate-500 mb-2">
          © {new Date().getFullYear()} Honor of Kings Strategy. All rights reserved.
        </p>
        <p className="text-[10px] font-bold text-slate-400 mb-2">
          Data and materials from Liquipedia and Honor of Kings Fandom are licensed under <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">CC BY-SA</a>.
        </p>
        <p className="text-[10px] font-bold text-slate-400">
          当サイトは非公式ファンサイトです。TencentやLevel Infiniteとは一切関係ありません。<br/>
          Honor of Kings is a registered trademark of Tencent.
        </p>
      </div>
    </footer>
  );
}
