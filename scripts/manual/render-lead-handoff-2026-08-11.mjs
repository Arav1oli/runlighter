import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const outputDir = path.join(root, 'generated/2026-08-11');
const sourcePath = path.join(outputDir, 'lead-handoff-source-v3.png');
const source = await readFile(sourcePath);
const disclosure = 'This post has been automated so we can run lighter.';

const escapeXml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
})[character]);

function overlay({ width, height, portrait }) {
  const image = `data:image/png;base64,${source.toString('base64')}`;
  const x = portrait ? 58 : 64;
  const brandY = portrait ? 72 : 58;
  const brandSize = portrait ? 26 : 23;
  const headlineY = portrait ? 190 : 150;
  const headlineSize = portrait ? 98 : 82;
  const lineHeight = Math.round(headlineSize * .93);
  const footerH = portrait ? 84 : 64;
  const footerSize = portrait ? 21 : 18;
  const imagePosition = 'xMidYMid slice';
  const landscapePhotoWidth = Math.round(height * .75);
  const landscapePhotoX = width - landscapePhotoWidth;
  const highlightY = headlineY + lineHeight * 3 - Math.round(headlineSize * .78);
  const highlightW = portrait ? 405 : 352;
  const highlightH = portrait ? 96 : 82;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="copyShade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#102a23" stop-opacity=".44"/>
        <stop offset=".72" stop-color="#102a23" stop-opacity=".08"/>
        <stop offset="1" stop-color="#102a23" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="landscapeBase" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#073b69"/>
        <stop offset="1" stop-color="#087bc0"/>
      </linearGradient>
      <linearGradient id="seam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#087bc0" stop-opacity="1"/>
        <stop offset="1" stop-color="#087bc0" stop-opacity="0"/>
      </linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#071d18" flood-opacity=".58"/></filter>
    </defs>
    ${portrait
      ? `<image href="${image}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="${imagePosition}"/>`
      : `<rect width="${width}" height="${height}" fill="url(#landscapeBase)"/><image href="${image}" x="${landscapePhotoX}" y="0" width="${landscapePhotoWidth}" height="${height}" preserveAspectRatio="xMidYMid meet"/><rect x="${landscapePhotoX - 100}" width="150" height="${height}" fill="url(#seam)"/>`}
    <path d="M0 0 H${portrait ? 790 : Math.round(width * .56)} L${portrait ? 650 : Math.round(width * .48)} ${portrait ? 650 : Math.round(height * .66)} H0 Z" fill="url(#copyShade)"/>
    <rect x="${x - 13}" y="${brandY - brandSize}" width="5" height="${brandSize + 8}" rx="2" fill="#f2c84b"/>
    <text x="${x}" y="${brandY}" fill="#ffffff" font-family="Helvetica Neue,Arial,sans-serif" font-size="${brandSize}" font-weight="800" letter-spacing="1.6" filter="url(#shadow)">RUN / LIGHTER</text>
    <g font-family="Arial Narrow,Helvetica Neue,Arial,sans-serif" font-size="${headlineSize}" font-weight="900" letter-spacing="-3" fill="#ffffff" filter="url(#shadow)">
      <text x="${x}" y="${headlineY}">THE AD</text>
      <text x="${x}" y="${headlineY + lineHeight}">WORKED.</text>
      <text x="${x}" y="${headlineY + lineHeight * 2}">THE HANDOFF</text>
    </g>
    <rect x="${x - 8}" y="${highlightY}" width="${highlightW}" height="${highlightH}" rx="7" fill="#f2c84b"/>
    <text x="${x + 10}" y="${headlineY + lineHeight * 3}" fill="#173129" font-family="Arial Narrow,Helvetica Neue,Arial,sans-serif" font-size="${headlineSize}" font-weight="900" letter-spacing="-3">DIDN'T.</text>
    <rect x="0" y="${height - footerH}" width="${width}" height="${footerH}" fill="#173129" fill-opacity=".96"/>
    <text x="${x}" y="${height - Math.round(footerH * .34)}" fill="#f8f1e4" font-family="Helvetica Neue,Arial,sans-serif" font-size="${footerSize}" font-weight="700">${escapeXml(disclosure)}</text>
  </svg>`;
}

const variants = [
  { name: 'instagram-v3', width: 1080, height: 1350, portrait: true },
  { name: 'hero-v3', width: 1600, height: 900, portrait: false },
  { name: 'og-v3', width: 1200, height: 630, portrait: false }
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
  revision: 'lead-handoff-v3',
  run_date: '2026-08-11',
  created_at: createdAt,
  disclosure,
  source_asset_origin: 'created-today-imagegen',
  source_asset: 'generated/2026-08-11/lead-handoff-source-v3.png',
  source_prompt_summary: 'Bright outdoor relay race at the exact moment an ochre baton falls between two runners.',
  reused_generated_asset: false,
  commercial_problem: 'The ad succeeds, but the enquiry is lost between form submission and accountable human follow-up.',
  service_resolution: 'Run Lighter manages the campaign, capture, acknowledgement, routing, follow-up task and reporting while the owner keeps qualification and sales judgement.',
  overlay_copy: "THE AD WORKED. THE HANDOFF DIDN'T.",
  variants: Object.fromEntries(variants.map(({ name, width, height }) => [name.replace('-v3', ''), {
    png: `generated/2026-08-11/${name}.png`,
    webp: `generated/2026-08-11/${name}.webp`,
    svg: `generated/2026-08-11/${name}.svg`,
    width,
    height
  }]))
};

await writeFile(path.join(outputDir, 'creative-manifest-v3.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest, null, 2));
