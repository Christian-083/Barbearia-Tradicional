const Tesseract = require('tesseract.js');
const fs = require('fs');
const files = fs.readdirSync('public/images').filter(f => f.startsWith('gallery-') && f.endsWith('.jpg'));
(async () => {
  for(const file of files) {
    try {
      const { data: { text } } = await Tesseract.recognize('public/images/' + file, 'eng');
      console.log('FILE:', file, text.replace(/\n/g, ' '));
    } catch(e) {
      console.log('Error on', file, e.message);
    }
  }
})();
