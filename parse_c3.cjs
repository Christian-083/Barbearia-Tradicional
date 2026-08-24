const fs = require('fs');
const js = fs.readFileSync('all_formatted.txt', 'utf8');
const match = js.match(/c3=\(\)=>{.{0,1500}/);
console.log(match[0]);
