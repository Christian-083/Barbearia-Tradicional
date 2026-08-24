const Tesseract = require('tesseract.js');
const fs = require('fs');

async function check() {
  const files = ['gallery-1.jpg', 'gallery-3.jpg', 'gallery-4.jpg', 'gallery-5.jpg', 'gallery-8.jpg', 'gallery-10.jpg'];
  for (let f of files) {
    console.log('Checking ' + f);
    try {
      const { data: { text } } = await Tesseract.recognize('public/images/' + f, 'eng');
      if (text.toLowerCase().includes('2016') || text.toLowerCase().includes('tradicional') || text.toLowerCase().includes('desde')) {
         console.log('!!!!!!! MATCH !!!!!!! => ' + f);
         process.exit(0);
      }
    } catch(e) { console.log(e.message); }
  }
}
check();
