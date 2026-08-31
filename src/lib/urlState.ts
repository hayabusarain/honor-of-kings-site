/**
 * 読者が動かした状態（絞り込み・並び替え・シミュレータの構成）をURLに載せる。
 *
 * useSearchParams は使わない。使うとページが Suspense 境界を要求し、
 * 静的生成から外れる（items/page.tsx:42 の判断と同じ）。
 * 読むのは location.search、書き戻すのは history.replaceState だけにする。
 * replaceState なので戻るボタンの履歴も汚れない。
 *
 * 既定値はクエリに書かない。全部書くと ?q=&role=All&lane=All&… になり、
 * 共有されるURLが読めなくなる。空になったら「?」も残さない。
 *
 * パラメータ名と値は一度貼られたら壊せない。表示ラベルを流用せず、
 * URL専用のスラッグ表を呼び出し側に持つこと。日本語のIDをそのまま載せると、
 * 英語ページのURLに日本語が入るうえ、ラベルを直した日に共有URLが壊れる。
 */

/** マウント後に1回だけ読む。サーバー側では null を返す */
export function readQuery(): URLSearchParams | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search);
}

/**
 * クエリを書き戻す。値が null / undefined / 空文字のキーは載せない。
 * 既存のクエリのうち keys に無いものは触らない（外部リンクの utm_* を巻き添えにしない）。
 */
export function replaceQuery(next: Record<string, string | null | undefined>): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(next)) {
    if (v === null || v === undefined || v === '') url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  }
  const qs = url.searchParams.toString();
  window.history.replaceState(null, '', url.pathname + (qs ? `?${qs}` : '') + url.hash);
}

/** 列挙値だけを通す。想定外の値が来たら既定へ落とす */
export function pickEnum<T extends string>(raw: string | null | undefined, allowed: readonly T[], fallback: T): T {
  return allowed.includes(raw as T) ? (raw as T) : fallback;
}
