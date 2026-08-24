const fs = require('fs');
const js = fs.readFileSync('all_formatted.txt', 'utf8');
const match = js.match(/name:"[^"]+",time:[0-9]+,price:[0-9]+,image:"[^"]+"/g);
console.log(match);
