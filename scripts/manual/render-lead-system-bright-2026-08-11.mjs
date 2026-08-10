import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const outputDir = path.join(root, 'generated/2026-08-11');
const sourcePath = path.join(outputDir, 'lead-system-source-v2.png');
const source = await readFile(sourcePath);
const disclosure = 'This post has been automated so we can run lighter.';

const escapeXml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
})[character]);

function overlay({ width, height, portrait }) {
  const image = `data:image/png;base64,${source.toString('base64')}`;
  const x = portrait ? 58 : 66;
  const panelY = portrait ? 112 : 80;
  const panelW = portrait ? 660 : 760;
  const panelH = portrait ? 410 : 420;
  const brandSize = portrait ? 27 : 24;
  const headlineSize = portrait ? 94 : 94;
  const lineHeight = Math.round(headlineSize * .93);
  const footerSize = portrait ? 21 : 20;
  const footerH = portrait ? 86 : 70;
  const headlineY = panelY + (portrait ? 135 : 140);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <filter id="soft"><feDropShadow dx="0" dy="5" stdDeviation="8" flood-color="#173129" flood-opacity=".18"/></filter>
      <linearGradient id="footer" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f8f1e4" stop-opacity=".97"/>
        <stop offset=".72" stop-color="#f8f1e4" stop-opacity=".88"/>
        <stop offset="1" stop-color="#f8f1e4" stop-opacity=".62"/>
      </linearGradient>
    </defs>
    <image href="${image}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
    <rect x="${x - 24}" y="${panelY}" width="${panelW}" height="${panelH}" rx="18" fill="#f8f1e4" fill-opacity=".91" stroke="#173129" stroke-opacity=".12" stroke-width="2" filter="url(#soft)"/>
    <rect x="${x}" y="${panelY + 35}" width="6" height="${brandSize + 10}" rx="3" fill="#d39b22"/>
    <text x="${x + 20}" y="${panelY + 64}" fill="#173129" font-family="Helvetica Neue,Arial,sans-serif" font-size="${brandSize}" font-weight="800" letter-spacing="1.6">RUN / LIGHTER</text>
    <g font-family="Arial Narrow,Helvetica Neue,Arial,sans-serif" font-size="${headlineSize}" font-weight="900" letter-spacing="-3" fill="#173129">
      <text x="${x}" y="${headlineY}">LEAD</text>
      <text x="${x}" y="${headlineY + lineHeight}">GENERATION.</text>
    </g>
    <rect x="${x - 8}" y="${headlineY + lineHeight + 22}" width="${portrait ? 556 : 570}" height="${portrait ? 92 : 94}" rx="8" fill="#f2c84b"/>
    <text x="${x + 12}" y="${headlineY + lineHeight + (portrait ? 92 : 94)}" fill="#173129" font-family="Arial Narrow,Helvetica Neue,Arial,sans-serif" font-size="${portrait ? 67 : 69}" font-weight="900" letter-spacing="-2">FULLY MANAGED.</text>
    <rect x="0" y="${height - footerH}" width="${width}" height="${footerH}" fill="url(#footer)"/>
    <text x="${x}" y="${height - Math.round(footerH * .34)}" fill="#173129" font-family="Helvetica Neue,Arial,sans-serif" font-size="${footerSize}" font-weight="700">${escapeXml(disclosure)}</text>
  </svg>`;
}

const variants = [
  { name: 'instagram-v2', width: 1080, height: 1350, portrait: true },
  { name: 'hero-v2', width: 1600, height: 900, portrait: false },
  { name: 'og-v2', width: 1200, height: 630, portrait: false }
];

for (const variant of variants) {
  const svg = overlay(variant);
  const svgPath = path.join(outputDir, `${variant.name}.svg`);
  const pngPath = path.join(outputDir, `${variant.name}.png`);
  const webpPath = path.join(outputDir, `${variant.name}.webp`);
  await writeFile(svgPath, svg);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(webpPath);
}

const createdAt = new Date().toISOString();
const manifest = {
  content_id: 'rl-2026-08-11-e58c85e7b5',
  revision: 'bright-coastal-v2',
  run_date: '2026-08-11',
  created_at: createdAt,
  disclosure,
  source_asset_origin: 'created-today-imagegen',
  source_asset: 'generated/2026-08-11/lead-system-source-v2.png',
  source_prompt_summary: 'Bright Sydney beach with multiple footprints converging between red-and-yellow lifesaving flags.',
  reused_generated_asset: false,
  reference_use: 'Bright outdoor editorial energy and playful Australian coastal metaphor. The rejected dark lighthouse composition was not reused.',
  overlay_copy: 'LEAD GENERATION. FULLY MANAGED.',
  variants: Object.fromEntries(variants.map(({ name, width, height }) => [name.replace('-v2', ''), {
    png: `generated/2026-08-11/${name}.png`,
    webp: `generated/2026-08-11/${name}.webp`,
    svg: `generated/2026-08-11/${name}.svg`,
    width,
    height
  }]))
};

await writeFile(path.join(outputDir, 'creative-manifest-v2.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
