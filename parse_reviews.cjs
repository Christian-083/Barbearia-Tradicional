const fs = require('fs');
const js = fs.readFileSync('all_formatted.txt', 'utf8');
const match = js.match(/.{0,200}depoimento-1.{0,500}/g);
console.log(match);
