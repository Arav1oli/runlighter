const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'final');
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.svg')).sort();

Promise.all(files.map(async (name) => {
  const target = path.join(dir, name.replace(/^([0-9]{2})-[0-9]{2}-/, '$1-').replace('.svg', '.png'));
  await sharp(path.join(dir, name), { density: 144 })
    .resize(1080, 1350, { fit: 'fill' })
    .png({ compressionLevel: 9 })
    .toFile(target);
  return target;
})).then((targets) => {
  console.log(`Rendered ${targets.length} PNG files`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
