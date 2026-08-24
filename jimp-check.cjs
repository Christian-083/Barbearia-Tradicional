const Jimp = require('jimp');
const fs = require('fs');

async function run() {
  const files = ['gallery-1.jpg', 'gallery-3.jpg', 'gallery-4.jpg', 'gallery-5.jpg', 'gallery-8.jpg', 'gallery-10.jpg', 'gallery-11.jpg', 'gallery-13.jpg', 'gallery-14.jpg'];
  for (let f of files) {
    try {
      const img = await Jimp.read('public/images/' + f);
      // get the color of pixel at 10,10
      const hex = img.getPixelColor(10, 10).toString(16);
      console.log(f, 'pixel at 10,10:', hex);
    } catch(e) {
      console.log('Error', f);
    }
  }
}
run();
