import type { ReactNode } from 'react';

// 一覧ページの metadata は heroes/page.tsx の generateMetadata で定義する
// （page がサーバーコンポーネントになったため、layout に置く理由が無くなった）。
//
// 注意: この layout は /heroes/[id]（全232ページ）も包む。ここに BreadcrumbJsonLd を
// 置くと、ヒーロー詳細が自前で出している3階層のパンくずと二重になり、
// どちらがリッチリザルトに使われるか制御できなくなる（夜間レビューで検出）。
// 一覧ページ自体のパンくずは2階層で情報量が少ないため、出さない
export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
