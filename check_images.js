const fs = require('fs');
const https = require('https');
const http = require('http');
const content = fs.readFileSync('src/data/items.ts', 'utf8');

const regex = /image:\s*"([^"]+)"/g;
const urls = [];
let match;
while ((match = regex.exec(content)) !== null) {
  urls.push(match[1]);
}

async function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ url, status: res.statusCode, ok: true });
      } else {
        resolve({ url, status: res.statusCode, ok: false });
      }
    });
    req.on('error', (e) => {
      resolve({ url, status: e.message, ok: false });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, status: 'timeout', ok: false });
    });
  });
}

(async () => {
  console.log(`Checking ${urls.length} images...`);
  const results = await Promise.all(urls.map(checkUrl));
  const failed = results.filter(r => !r.ok);
  console.log('--- Failed Images ---');
  failed.forEach(f => console.log(`${f.url} - ${f.status}`));
})();
