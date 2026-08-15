/**
 * Service Worker
 *
 * リクエストの種類ごとに戦略を分ける。以前は全部を cache-first・無期限で持っており、
 * 統計やパッチを更新しても再訪ユーザーには一生古いデータが出ていた
 * （CACHE_NAME を手で上げない限りキャッシュが消えないのに、2026-07-30 から v4 のままだった）。
 *
 *   /_next/static/  … 内容ハッシュ付きURLなので cache-first で安全
 *   /images/        … 差し替え頻度が低いので stale-while-revalidate（表示は即時、更新は裏で）
 *   /data/ /api/    … network-first。統計・パッチ・スキルは鮮度が命なので必ず取りに行く
 *   ページ遷移       … network-first。失敗したときだけオフライン用ページを返す
 *
 * CACHE_NAME を上げる必要があるのは PRECACHE の中身を変えたときだけになった。
 */
const CACHE_NAME = 'hok-hub-cache-v5';
const OFFLINE_URL = '/offline.html';

// オフライン時に最低限出すもの。ページ本体は入れない
// （以前は '/' と '/ja' を入れていたが、遷移をSWから外していたため一度も配信されない死んだ登録だった）
const PRECACHE = [
  OFFLINE_URL,
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
    )
  );
  self.clients.claim();
});

const putInCache = (request, response) => {
  if (!response || response.status !== 200 || response.type === 'opaque') return;
  const clone = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
};

// キャッシュを即返しつつ、裏でネットワークから取り直して次回に備える
const staleWhileRevalidate = async (request) => {
  const cached = await caches.match(request);
  const fetching = fetch(request)
    .then((response) => {
      putInCache(request, response);
      return response;
    })
    .catch(() => null);
  if (cached) return cached;
  const fresh = await fetching;
  return fresh || Response.error();
};

// ネットワーク優先。オフラインのときだけキャッシュに落とす
const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    putInCache(request, response);
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || Response.error();
  }
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  putInCache(request, response);
  return response;
};

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 開発サーバーとクロスオリジンは素通しする
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return;
  if (!url.protocol.startsWith('http')) return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  // ページ遷移は必ずネットワークを先に見る。
  // 遷移リクエストの redirect モードは manual なので、next-intl のロケールリダイレクトは
  // opaqueredirect として素通しされ、ここで握り潰されることはない。
  // オフラインのときだけ、ブラウザの接続エラー画面の代わりに自前のページを出す
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const offline = await caches.match(OFFLINE_URL);
        return offline || Response.error();
      })
    );
    return;
  }

  if (url.pathname.startsWith('/data/') || url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});
