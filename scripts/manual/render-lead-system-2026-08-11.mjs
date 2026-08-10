import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const outputDir = path.join(root, 'generated/drafts/2026-08-11');
const sourcePath = path.join(outputDir, 'lead-system-source.png');
const disclosure = 'This post has been automated so we can run lighter.';
const source = await readFile(sourcePath);

const escapeXml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
})[character]);

function overlay({ width, height, portrait }) {
  const headlineX = portrait ? 585 : Math.round(width * 0.54);
  const headlineY = portrait ? 220 : Math.round(height * 0.17);
  const headlineSize = portrait ? 88 : Math.round(height * 0.092);
  const lineHeight = Math.round(headlineSize * 0.93);
  const brandX = portrait ? 62 : 66;
  const brandY = portrait ? 74 : 60;
  const footerY = height - (portrait ? 45 : 30);
  const footerSize = portrait ? 22 : Math.max(16, Math.round(height * 0.026));
  const brandSize = portrait ? 27 : Math.max(20, Math.round(height * 0.035));
  const image = `data:image/png;base64,${source.toString('base64')}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#182a24" stop-opacity=".66"/>
        <stop offset=".68" stop-color="#182a24" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#152620" stop-opacity="0"/>
        <stop offset="1" stop-color="#152620" stop-opacity=".84"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#07100d" flood-opacity=".58"/></filter>
    </defs>
    <image href="${image}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
    <rect width="${width}" height="${portrait ? 520 : Math.round(height * .54)}" fill="url(#top)"/>
    <rect y="${height - (portrait ? 250 : 150)}" width="${width}" height="${portrait ? 250 : 150}" fill="url(#bottom)"/>
    <rect x="${brandX - 12}" y="${brandY - brandSize}" width="4" height="${brandSize + 7}" rx="2" fill="#d7b85c"/>
    <text x="${brandX}" y="${brandY}" fill="#f8f1e4" font-family="Helvetica Neue,Arial,sans-serif" font-size="${brandSize}" font-weight="800" letter-spacing="1.2" filter="url(#shadow)">RUN / LIGHTER</text>
    <g font-family="Arial Narrow,Helvetica Neue,Arial,sans-serif" font-size="${headlineSize}" font-weight="900" letter-spacing="-2" filter="url(#shadow)">
      <text x="${headlineX}" y="${headlineY}" fill="#f8f1e4">YOUR LEAD</text>
      <text x="${headlineX}" y="${headlineY + lineHeight}" fill="#f8f1e4">SYSTEM,</text>
      <text x="${headlineX}" y="${headlineY + lineHeight * 2}" fill="#e4c15f">MANAGED.</text>
    </g>
    <line x1="${brandX}" y1="${footerY - footerSize - 16}" x2="${width - brandX}" y2="${footerY - footerSize - 16}" stroke="#d7b85c" stroke-width="2" opacity=".84"/>
    <text x="${brandX}" y="${footerY}" fill="#f8f1e4" font-family="Helvetica Neue,Arial,sans-serif" font-size="${footerSize}" font-weight="600" filter="url(#shadow)">${escapeXml(disclosure)}</text>
  </svg>`;
}

const variants = [
  { name: 'instagram', width: 1080, height: 1350, portrait: true },
  { name: 'hero', width: 1600, height: 900, portrait: false },
  { name: 'og', width: 1200, height: 630, portrait: false }
];

for (const variant of variants) {
  const svg = overlay(variant);
  const svgPath = path.join(outputDir, `${variant.name}.svg`);
  const pngPath = path.join(outputDir, `${variant.name}.png`);
  const webpPath = path.join(outputDir, `${variant.name}.webp`);
  await writeFile(svgPath, svg);
  const raster = sharp(Buffer.from(svg));
  await raster.png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(webpPath);
}

const createdAt = new Date().toISOString();
const manifest = {
  content_id: 'rl-2026-08-11-e58c85e7b5',
  run_date: '2026-08-11',
  created_at: createdAt,
  disclosure,
  source_asset_origin: 'created-today-imagegen',
  source_asset: 'generated/drafts/2026-08-11/lead-system-source.png',
  source_prompt_summary: 'Fresh Australian coastal lighthouse photograph with a warm beam guiding three small boats toward harbour.',
  reused_generated_asset: false,
  reference_use: 'Hierarchy, outdoor editorial mood and restrained branding only. No prior subject, copy or layout was copied.',
  variants: Object.fromEntries(variants.map(({ name, width, height }) => [name, {
    png: `generated/drafts/2026-08-11/${name}.png`,
    webp: `generated/drafts/2026-08-11/${name}.webp`,
    svg: `generated/drafts/2026-08-11/${name}.svg`,
    width,
    height
  }]))
};
await writeFile(path.join(outputDir, 'creative-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
