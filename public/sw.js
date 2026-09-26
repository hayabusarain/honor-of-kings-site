/**
 * Service Worker
 *
 * リクエストの種類ごとに戦略を分ける。以前は全部を cache-first・無期限で持っており、
 * 統計やパッチを更新しても再訪ユーザーには一生古いデータが出ていた
 * （CACHE_NAME を手で上げない限りキャッシュが消えないのに、2026-07-30 から v4 のままだった）。
 *
 *   /_next/static/  … 内容ハッシュ付きURLなので cache-first で安全
 *   /images/        … 差し替え頻度が低いので stale-while-revalidate（表示は即時、更新は裏で）
 *   /api/           … network-first。返す統計は鮮度が命なので必ず取りに行く
 *   ページ遷移       … network-first。失敗したときだけオフライン用ページを返す
 *   それ以外         … 触らない（ブラウザに任せる）
 *
 * CACHE_NAME を上げる必要があるのは PRECACHE の中身を変えたときだけになった。
 *
 * 2026-09-25: 以前は「それ以外」を全部 stale-while-revalidate で持っていた。そこに
 * 画面遷移用のデータ（/ja/heroes?_rsc=… の RSC）が入り、デプロイ後もしばらく古いデータを
 * 返していた。_rsc の値はデプロイで変わらないので、同じ URL のまま前の版が出る。
 * しかも遷移のたびに URL が増えて、消えずに溜まり続ける。
 * RSC は SW を通さず、溜めるのは /images/ だけにした。溜まった分は activate で掃除する。
 * CACHE_NAME は上げない（上げると PRECACHE と画像まで全員取り直しになる）。
 */
const CACHE_NAME = 'hok-hub-cache-v5';
// 自分のキャッシュの接頭辞。サイト統合（2026-09-27）で hub-game.com の同じオリジンに
// ポータル・MLBB・Wild Rift が並ぶので、activate で消すのはこの接頭辞のものだけにする
const CACHE_PREFIX = 'hok-hub-cache-';
// 前置き（統合後は /hok、今は空）。登録の範囲から読む。PwaRegister が /hok/sw.js を範囲 /hok/ で
// 登録するので、ここを書き換えずに今の hok.hub-game.com でも統合後でも動く
const SCOPE_PATH = new URL(self.registration.scope).pathname;
const BASE = SCOPE_PATH.endsWith('/') ? SCOPE_PATH.slice(0, -1) : SCOPE_PATH;
const OFFLINE_URL = `${BASE}/offline.html`;

// オフライン時に最低限出すもの。ページ本体は入れない
// （以前は '/' と '/ja' を入れていたが、遷移をSWから外していたため一度も配信されない死んだ登録だった）
const PRECACHE = [
  OFFLINE_URL,
  `${BASE}/manifest.json`,
  `${BASE}/icon-192x192.png`,
  `${BASE}/icon-512x512.png`,
  `${BASE}/apple-icon.png`
];

// 前置きを外したパス（範囲の外なら null）
const localPath = (url) => (url.pathname.startsWith(`${BASE}/`) ? url.pathname.slice(BASE.length) : null);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

// このキャッシュに入れてよいもの。fetch の振り分けと揃えること
const isKept = (url) => {
  const path = localPath(url);
  return (
    path !== null &&
    !url.searchParams.has('_rsc') &&
    (PRECACHE.includes(url.pathname) ||
      path.startsWith('/_next/static/') ||
      path.startsWith('/images/') ||
      path.startsWith('/api/'))
  );
};

// 以前の振り分けで溜まった RSC やページ類を消す。CACHE_NAME を上げずに掃除するための処理
const pruneCache = async () => {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  await Promise.all(requests.map((request) => (isKept(new URL(request.url)) ? null : cache.delete(request))));
};

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key === CACHE_NAME || !key.startsWith(CACHE_PREFIX) ? null : caches.delete(key)))))
      .then(pruneCache)
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
  // 自分の範囲（/hok/）の外は触らない。path は前置きを外したパス
  const path = localPath(url);
  if (path === null) return;
  if (path.startsWith('/_next/webpack-hmr')) return;
  // 画面遷移用のデータ（RSC）は触らない。先頭の説明を参照
  if (url.searchParams.has('_rsc') || event.request.headers.get('RSC') === '1') return;

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

  // /api/ は鮮度が命なので必ず取りに行く。manifest とアイコンも同じ扱いにして、
  // オフラインのときだけ install で入れた分を返す
  if (PRECACHE.includes(url.pathname) || path.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  if (path.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (path.startsWith('/images/')) {
    event.respondWith(staleWhileRevalidate(event.request));
  }
  // それ以外（OGP画像・feed・robots など）は触らず、ブラウザの HTTP キャッシュに任せる
});
