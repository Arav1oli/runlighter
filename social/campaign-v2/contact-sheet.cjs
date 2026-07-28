const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const finalDir = path.join(__dirname, 'final');
const files = fs.readdirSync(finalDir).filter((name) => /^\d\d-.*\.png$/.test(name)).sort();
const width = 1840;
const height = 1120;
const thumbW = 336;
const thumbH = 420;
const gap = 24;
const startX = 32;
const firstY = 142;

(async () => {
  const composites = [];
  for (let i = 0; i < files.length; i += 1) {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const x = startX + col * (thumbW + gap);
    const y = firstY + row * (thumbH + 54);
    const thumb = await sharp(path.join(finalDir, files[i])).resize(thumbW, thumbH, { fit: 'cover' }).png().toBuffer();
    composites.push({ input: thumb, left: x, top: y });
    composites.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${thumbW}" height="40"><text x="0" y="27" fill="#f3efe5" font-family="Arial" font-size="20" font-weight="700">${String(i + 1).padStart(2, '0')}</text></svg>`),
      left: x,
      top: y + thumbH + 4,
    });
  }
  composites.push({
    input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1840" height="120"><text x="32" y="58" fill="#fbf8f1" font-family="Arial" font-size="42" font-weight="700">Run Lighter campaign v2</text><text x="32" y="94" fill="#b7c1aa" font-family="Arial" font-size="22">10 original 4:5 concepts · July 2026</text></svg>`),
    left: 0,
    top: 0,
  });
  await sharp({ create: { width, height, channels: 3, background: '#253029' } })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(path.join(__dirname, 'campaign-v2-contact-sheet.png'));
  console.log('Rendered campaign-v2-contact-sheet.png');
})();
