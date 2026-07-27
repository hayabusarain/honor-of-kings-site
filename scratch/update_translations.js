const fs = require('fs');
const jaPath = 'messages/ja.json';
const enPath = 'messages/en.json';
const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// 1. Builds System & API
ja.builds = ja.builds || {};
en.builds = en.builds || {};
Object.assign(ja.builds, {
  deletePost: 'この投稿を削除',
  postDeleted: '投稿を削除しました！',
  deleteConfirm: '本当にこのビルドを削除しますか？',
  errorMissingAuth: 'IDとパスワードが必要です',
  errorNotFound: '投稿が見つかりません',
  errorWrongPassword: 'パスワードが間違っています',
  errorInternal: 'サーバーエラーが発生しました',
  deletePromptTitle: '投稿の削除',
  deletePromptDesc: '削除パスワードを入力してください:',
  deleteCancel: 'キャンセル',
  deleteSubmit: '削除する',
  dateFormat: 'ja-JP'
});
Object.assign(en.builds, {
  deletePost: 'Delete this post',
  postDeleted: 'Post deleted successfully!',
  deleteConfirm: 'Are you sure you want to delete this build?',
  errorMissingAuth: 'ID and password are required',
  errorNotFound: 'Post not found',
  errorWrongPassword: 'Incorrect password',
  errorInternal: 'Internal server error occurred',
  deletePromptTitle: 'Delete Post',
  deletePromptDesc: 'Enter delete password:',
  deleteCancel: 'Cancel',
  deleteSubmit: 'Delete',
  dateFormat: 'en-US'
});

// 2. Cookie Banner
ja.cookieBanner = {
  message: '当サイトでは、アクセス解析等のためにCookieを使用しています。',
  accept: '同意する'
};
en.cookieBanner = {
  message: 'We use cookies for analytics and to improve your experience.',
  accept: 'Accept'
};

// 3. PWA Install Banner
ja.pwa = {
  installApp: 'アプリをインストール'
};
en.pwa = {
  installApp: 'Install App'
};

// 4. Global Search Modal
ja.searchModal = {
  placeholder: 'ヒーロー名やアイテム名で検索...',
  noResults: '「{query}」に一致する結果は見つかりませんでした。',
  heroes: 'ヒーロー',
  items: 'アイテム',
  arcanas: 'アルカナ'
};
en.searchModal = {
  placeholder: 'Search for heroes or items...',
  noResults: 'No results found for "{query}".',
  heroes: 'Heroes',
  items: 'Items',
  arcanas: 'Arcanas'
};

// 5. Hero SEO Metadata
ja.heroSEO = {
  title: '【オナーオブキングス】{heroName}の評価とおすすめビルド・立ち回り | HoK Hub',
  description: '{heroName}の最新評価、おすすめビルド（装備・アルカナ・スペル）、スキル解説、立ち回りを詳しく紹介しています。'
};
en.heroSEO = {
  title: '{heroName} Build, Runes & Guide | Honor of Kings Hub',
  description: 'Latest {heroName} builds, best arcanas, skills guide, and tips for Honor of Kings.'
};

fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
console.log('Added Component, API, and SEO strings to dictionaries.');
