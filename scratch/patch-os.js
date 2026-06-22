const os = require('os');
const originalHostname = os.hostname;
os.hostname = function() {
  return 'toshi-pc';
};
const originalUserInfo = os.userInfo;
os.userInfo = function(options) {
  const info = originalUserInfo(options);
  if (info && info.username) {
    info.username = 'toshi';
  }
  return info;
};
