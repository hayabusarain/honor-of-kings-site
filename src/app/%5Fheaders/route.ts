/**
 * Cloudflare の _headers を書き出す（サイト統合後の静的書き出し用、2026-09-27）。
 *
 * フォルダ名の %5F は「_」。静的書き出しでは out/_headers になり、scripts/postbuild_basepath.mjs が
 * パスの行に前置き（/hok）を付けて dist/ 直下へ置く。行頭が / の行がパスで、字下げした行がヘッダー。
 * サーバーのある今の本番（Vercel）では next.config の headers() とルートの応答ヘッダーが同じ仕事をしているので、この出力は使わない。
 *
 * セキュリティヘッダー（HSTS など）はここに書かない。ドメイン全体に効かせるものなので、
 * Cloudflare のゾーンの Transform Rules でまとめて付ける（計画の2章）。
 */
export const dynamic = 'force-static';

const RULES = `# /api/latest … ポータルが読む。拡張子が無いので Content-Type を明示する（src/app/api/latest/route.ts と同じ値）
/api/latest
  Access-Control-Allow-Origin: *
  Content-Type: application/json; charset=utf-8
  Cache-Control: public, max-age=1800, stale-while-revalidate=86400

# Atom フィード
/feed.xml
  Content-Type: application/atom+xml; charset=utf-8
  Cache-Control: public, max-age=1800, stale-while-revalidate=86400

# OGP 画像。Next.js は拡張子の付かない URL で出すので、明示しないと octet-stream として配られ、
# SNS のクローラーが画像として扱わない。深さは言語の下に最大3段（/ja/heroes/role/tank/opengraph-image）
/:locale/opengraph-image
  Content-Type: image/png
/:locale/:a/opengraph-image
  Content-Type: image/png
/:locale/:a/:b/opengraph-image
  Content-Type: image/png
/:locale/:a/:b/:c/opengraph-image
  Content-Type: image/png

# 画像は URL にハッシュが付かない。差し替える運用があるので immutable は使わず、1週間で見直させる（next.config の headers() と同じ）
/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

# Next.js がハッシュ付きで出すものは、中身が変われば名前も変わる
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`;

export function GET() {
  return new Response(RULES, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
