import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(new URL('../..', import.meta.url).pathname);
const outputDirectory = path.join(root, 'generated', 'drafts', '2026-07-31');
const portraitSource = path.join(root, 'generated', 'backgrounds', '2026-07-31-portrait.png');
const wideSource = path.join(root, 'generated', 'backgrounds', '2026-07-31-wide.png');

const disclosure = 'This post has been automated so we can run lighter.';
const palette = {
  oat: '#f3efe5',
  paper: '#fbf8f1',
  moss: '#26382f',
  eucalyptus: '#587664',
  ochre: '#d4a544',
  terracotta: '#bd6847'
};

const escapeXml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
})[character]);

const dataUri = buffer => `data:image/png;base64,${buffer.toString('base64')}`;

function svgShell({ width, height, image, body, footerHeight }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="shade-vertical" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${palette.moss}" stop-opacity=".96"/>
      <stop offset=".46" stop-color="${palette.moss}" stop-opacity=".68"/>
      <stop offset=".72" stop-color="${palette.moss}" stop-opacity=".08"/>
    </linearGradient>
    <linearGradient id="shade-wide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${palette.moss}" stop-opacity=".96"/>
      <stop offset=".48" stop-color="${palette.moss}" stop-opacity=".78"/>
      <stop offset=".72" stop-color="${palette.moss}" stop-opacity=".08"/>
    </linearGradient>
    <filter id="type-shadow">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#132018" flood-opacity=".38"/>
    </filter>
  </defs>
  <image href="${image}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
  ${body}
  <rect y="${height - footerHeight}" width="${width}" height="${footerHeight}" fill="${palette.moss}" fill-opacity=".97"/>
  <text x="${width > height ? 64 : 70}" y="${height - (width > height ? 28 : 38)}" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="${width > height ? 18 : 23}" font-weight="700">${escapeXml(disclosure)}</text>
</svg>`;
}

function portraitSvg(image) {
  return svgShell({
    width: 1080,
    height: 1350,
    image,
    footerHeight: 104,
    body: `
  <rect width="1080" height="880" fill="url(#shade-vertical)"/>
  <text x="70" y="72" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" letter-spacing="4">RUN / LIGHTER</text>
  <rect x="70" y="112" width="322" height="48" rx="24" fill="${palette.ochre}"/>
  <text x="91" y="145" fill="${palette.moss}" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="900" letter-spacing="2">SYDNEY FIELD SERVICE</text>
  <g filter="url(#type-shadow)">
    <text x="70" y="284" fill="${palette.paper}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="88" font-weight="900" letter-spacing="-3">STOP PAYING FOR</text>
    <text x="70" y="378" fill="${palette.ochre}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="88" font-weight="900" letter-spacing="-3">STALE JOB DETAILS.</text>
  </g>
  <rect x="70" y="435" width="96" height="8" rx="4" fill="${palette.terracotta}"/>
  <text x="70" y="494" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700">Customer changes should reach the crew before dispatch.</text>`
  });
}

function wideSvg(image, width, height) {
  const footerHeight = height === 630 ? 66 : 78;
  const pad = height === 630 ? 54 : 70;
  const brandSize = height === 630 ? 20 : 25;
  const qualifierY = height === 630 ? 108 : 134;
  const headlineSize = height === 630 ? 70 : 92;
  const firstLineY = height === 630 ? 225 : 302;
  const secondLineY = firstLineY + headlineSize;
  const sublineY = secondLineY + (height === 630 ? 62 : 74);
  const sublineSize = height === 630 ? 24 : 31;
  return svgShell({
    width,
    height,
    image,
    footerHeight,
    body: `
  <rect width="${width}" height="${height - footerHeight}" fill="url(#shade-wide)"/>
  <text x="${pad}" y="${height === 630 ? 48 : 62}" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="${brandSize}" font-weight="800" letter-spacing="4">RUN / LIGHTER</text>
  <rect x="${pad}" y="${qualifierY - 29}" width="${height === 630 ? 268 : 322}" height="${height === 630 ? 40 : 48}" rx="24" fill="${palette.ochre}"/>
  <text x="${pad + 18}" y="${qualifierY}" fill="${palette.moss}" font-family="Arial, Helvetica, sans-serif" font-size="${height === 630 ? 17 : 21}" font-weight="900" letter-spacing="2">SYDNEY FIELD SERVICE</text>
  <g filter="url(#type-shadow)">
    <text x="${pad}" y="${firstLineY}" fill="${palette.paper}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${headlineSize * .82}" font-weight="900" letter-spacing="-3">STOP PAYING FOR</text>
    <text x="${pad}" y="${secondLineY}" fill="${palette.ochre}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${headlineSize * .82}" font-weight="900" letter-spacing="-3">STALE JOB DETAILS.</text>
  </g>
  <rect x="${pad}" y="${sublineY - 34}" width="${height === 630 ? 72 : 92}" height="7" rx="4" fill="${palette.terracotta}"/>
  <text x="${pad}" y="${sublineY}" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="${sublineSize}" font-weight="700">Customer changes should reach the crew before dispatch.</text>`
  });
}

async function render(name, svg, width, height) {
  const base = path.join(outputDirectory, name);
  const normalisedSvg = svg.replace(/[ \t]+$/gm, '');
  await writeFile(`${base}.svg`, `${normalisedSvg}\n`, 'utf8');
  const image = sharp(Buffer.from(normalisedSvg));
  await image.clone().png({ compressionLevel: 9 }).toFile(`${base}.png`);
  await image.clone().webp({ quality: 88 }).toFile(`${base}.webp`);
  const metadata = await sharp(`${base}.png`).metadata();
  if (metadata.width !== width || metadata.height !== height) {
    throw new Error(`${name} rendered at ${metadata.width}x${metadata.height}`);
  }
}

const portrait = dataUri(await readFile(portraitSource));
const wide = dataUri(await readFile(wideSource));

await render('instagram', portraitSvg(portrait), 1080, 1350);
await render('hero', wideSvg(wide, 1600, 900), 1600, 900);
await render('og', wideSvg(wide, 1200, 630), 1200, 630);

console.log(`Rendered 2026-07-31 creative package in ${outputDirectory}`);
