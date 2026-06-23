import { Link } from "@/i18n/routing";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-6 mt-10">
      <div className="max-w-md mx-auto px-4 text-center">
        <nav className="flex justify-center gap-6 text-sm mb-6">
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
        <p className="text-[10px] font-bold text-slate-400">
          当サイトは非公式ファンサイトです。TencentやLevel Infiniteとは一切関係ありません。<br/>
          Honor of Kings is a registered trademark of Tencent.
        </p>
      </div>
    </footer>
  );
}
