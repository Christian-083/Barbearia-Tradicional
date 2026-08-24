const fs = require('fs');
const https = require('https');

https.get('https://barbearia-e.netlify.app/assets/index-BUzIX-Ff.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
     // finding components
     const headerHeroMatches = data.match(/.{0,200}HeaderHero.{0,500}/g);
     if (headerHeroMatches) {
        fs.writeFileSync('header.txt', headerHeroMatches.join("\n\n"));
     }
  });
});
