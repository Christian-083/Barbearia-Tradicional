const fs = require('fs');

const data = fs.readFileSync('header.txt', 'utf8');
console.log(data.substring(0, 2000));
