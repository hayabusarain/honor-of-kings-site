const http = require('http');

const url = 'http://localhost:3000/images/items/cropped/%E3%82%A4%E3%83%B3%E3%83%95%E3%82%A3%E3%83%8B%E3%83%86%E3%82%A3_%E3%82%A8%E3%83%83%E3%82%B8.png';

http.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  res.on('data', (d) => {
    // consume data
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
