import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(new URL('../..', import.meta.url).pathname);
const sourcePath = path.join(root, 'generated', 'backgrounds', '2026-08-10-missed-calls-portrait-v1.png');
const outputDirectory = path.join(root, 'generated', 'ads', '2026-08-10');
const articleDirectory = path.join(root, 'generated', 'published', '2026-08-10');
const disclosure = 'This post has been automated so we can run lighter.';

const escapeXml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
})[character]);

await mkdir(outputDirectory, { recursive: true });
await mkdir(articleDirectory, { recursive: true });
const background = `data:image/png;base64,${(await readFile(sourcePath)).toString('base64')}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="headline-wash" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14251f" stop-opacity=".98"/>
      <stop offset=".72" stop-color="#14251f" stop-opacity=".66"/>
      <stop offset="1" stop-color="#14251f" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#09150f" flood-opacity=".58"/></filter>
  </defs>
  <image href="${background}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1080" height="610" fill="url(#headline-wash)"/>
  <text x="66" y="76" fill="#f7f0e2" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" letter-spacing="4">RUN / LIGHTER</text>
  <g filter="url(#shadow)">
    <text x="66" y="218" fill="#f7f0e2" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="90" font-weight="900" letter-spacing="-4">MISSED CALLS</text>
    <text x="66" y="318" fill="#d5b44b" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="80" font-weight="900" letter-spacing="-3">BECOME MISSED JOBS</text>
  </g>
  <rect x="66" y="366" width="216" height="62" rx="31" fill="#f7f0e2"/>
  <text x="174" y="407" text-anchor="middle" fill="#193128" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="27" font-weight="900">$0 REVIEW</text>
  <rect y="1254" width="1080" height="96" fill="#193128" fill-opacity=".98"/>
  <text x="66" y="1315" fill="#f7f0e2" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">${escapeXml(disclosure)}</text>
</svg>\n`;

const base = path.join(outputDirectory, 'missed-calls-become-missed-jobs-v1');
await writeFile(`${base}.svg`, svg, 'utf8');
const renderer = sharp(Buffer.from(svg));
await renderer.clone().png({ compressionLevel: 9 }).toFile(`${base}.png`);
await renderer.clone().webp({ quality: 90 }).toFile(`${base}.webp`);
await sharp(sourcePath)
  .resize(1600, 900, { fit: 'cover', position: 'centre' })
  .webp({ quality: 88 })
  .toFile(path.join(articleDirectory, 'hero.webp'));
await sharp(sourcePath)
  .resize(1600, 900, { fit: 'cover', position: 'centre' })
  .png({ compressionLevel: 9 })
  .toFile(path.join(articleDirectory, 'hero.png'));
await sharp(sourcePath)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#14251f" fill-opacity=".56"/><text x="58" y="82" fill="#f7f0e2" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="4">RUN / LIGHTER</text><text x="58" y="245" fill="#f7f0e2" font-family="Arial Black, Arial, sans-serif" font-size="76" font-weight="900">MISSED CALLS</text><text x="58" y="338" fill="#d5b44b" font-family="Arial Black, Arial, sans-serif" font-size="65" font-weight="900">BECOME MISSED JOBS</text></svg>`) }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(articleDirectory, 'og.png'));
await sharp(`${base}.png`).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toFile(`${base}.jpg`);
const metadata = await sharp(`${base}.png`).metadata();
if (metadata.width !== 1080 || metadata.height !== 1350) {
  throw new Error(`Creative rendered at ${metadata.width}x${metadata.height}`);
}
console.log(`${base}.png`);
