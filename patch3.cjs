const fs = require('fs');
let code = fs.readFileSync('src/data/services.ts', 'utf8');

if (!code.includes('/images/gallery-7.jpg\'\n]')) {
    code = code.replace(/'\/images\/gallery-6\.jpg',\n\]/g, "'/images/gallery-6.jpg',\n  '/images/gallery-7.jpg',\n]");
    fs.writeFileSync('src/data/services.ts', code);
}
