import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';

/**
 * サイトのフォント。[locale]/layout.tsx と、ロケール層の外で描く404・エラー画面
 * （global-not-found.tsx・not-found.tsx・global-error.tsx）の両方が <html> に付ける。
 * 2026-10-04 まで layout.tsx の中で定義していて、404 には変数（--font-noto-sans-jp）が付かず、
 * globals.css の :root:lang(en) の宣言ごと無効になって端末の既定の書体（Windows は Yu Gothic UI）で
 * 描かれていた。MLBB Hub が 2026-09-28 に同じ形で直している（申し送りの落とし穴 e）。
 */

// 玉璽デザイン: 英語ページの本文は Noto Sans JP、ワードマークは Noto Serif JP。
// 日本語ページの本文は端末のフォント（iPhone はヒラギノ、Android は Noto Sans CJK、
// Windows はメイリオ）で、Noto Sans JP を読まない。指定は globals.css の --font-body。
//
// 2026-09-25 に日本語ページも端末のフォントへ切り替えた。日本語の Web フォントは文字の帯ごとに
// 124個のファイルに分かれ、1ページで 1.4〜2.9MB を読み、届くたびにページ全体を組み直していた。
// スマホ想定（CPU 4倍遅く）で測ると、フォントを止めただけで読み込み中に画面が固まる時間が
// /ja/heroes 12.5秒 → 3.0秒、/ja/tier-list 10.1秒 → 2.8秒 になった（英語ページは元から1.5秒）。
// Android の標準フォントは Noto Sans JP と同じ字形なので、見た目がほぼ変わらない端末が多い。
//
// create-next-app 由来の Geist / Geist_Mono は 2026-08-31 に外した。
// font-mono の使用は0件で、font-sans も先頭が Noto Sans JP なので
// 一度も描画されないまま 52,396 B を毎ページ preload していた
//
// weight を指定せず、可変フォント（太さ100〜900を1つのファイルで持つ）として宣言する。
// 以前は 400/500/700/900 の4つを指定していたが、Google が返すファイルは4つとも同じ
// 可変フォントだった（2026-09-25 に確認。@font-face 496個に対して URL は124個で、
// 可変フォントの124個と完全に一致）。フォント本体の転送量は変わらず、宣言だけが4倍あった。
// 1つにまとめて、描画を止める CSS が 182KB → 83KB になった（スマホ幅の実測）。
// font-semibold は4つのころ 700 の宣言で描かれていたので、globals.css で 700 に固定して見た目を保つ
//
// preload しない。preload は言語を問わず全ページに付くので、このフォントを使わない
// 日本語ページでも英字の 43KB を先に取らせることになる
export const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

// 使い道はワードマーク「Honor of Kings Hub」の2箇所（Sidebar と AppBar）だけ。
// どちらも font-bold なので weight は 700 だけでよい。
// preload しないのは、preload 対象の 147,292 B のうち 113,904 B が
// U+7D57 以降の漢字帯で、ワードマークが ASCII だけである以上どのページでも
// 描画されないため。ラテン 33,388 B は描画時の遅延取得に回る
export const notoSerifJp = Noto_Serif_JP({
  variable: '--font-noto-serif-jp',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  preload: false,
});

/** <html> の className に付ける、両フォントの CSS 変数 */
export const fontVariables = `${notoSansJp.variable} ${notoSerifJp.variable}`;
