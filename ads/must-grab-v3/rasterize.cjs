const path = require('node:path');
const sharp = require('sharp');

sharp(path.join(__dirname, 'final', 'youre-losing-leads.svg'), { density: 144 })
  .resize(1080, 1350, { fit: 'fill' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(__dirname, 'final', 'youre-losing-leads.png'))
  .then(() => console.log('Rendered final PNG'))
  .catch((error) => { console.error(error); process.exitCode = 1; });
