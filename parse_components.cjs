const fs = require('fs');
const https = require('https');

https.get('https://barbearia-e.netlify.app/assets/index-BUzIX-Ff.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
     let formatted = data.replace(/h\.jsx/g, '\nh.jsx').replace(/h\.jsxs/g, '\nh.jsxs');
     fs.writeFileSync('all_formatted.txt', formatted);
     console.log("Written all_formatted.txt, size:", formatted.length);
  });
});
