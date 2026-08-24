const fs = require('fs');
let code = fs.readFileSync('src/data/services.ts', 'utf8');

// The original first array block likely had 12 and 7
code = code.replace(/'\/images\/gallery-6\.jpg',\n  '\/images\/gallery-8\.jpg'/g, "'/images/gallery-6.jpg',\n  '/images/gallery-7.jpg',\n  '/images/gallery-8.jpg'");
code = code.replace(/'\/images\/gallery-11\.jpg',\n  '\/images\/gallery-13\.jpg'/g, "'/images/gallery-11.jpg',\n  '/images/gallery-12.jpg',\n  '/images/gallery-13.jpg'");

// Second array (feed images)
code = code.replace(/'\/images\/gallery-6\.jpg'\n\]/g, "'/images/gallery-6.jpg',\n  '/images/gallery-7.jpg'\n]");

fs.writeFileSync('src/data/services.ts', code);
