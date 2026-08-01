import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(new URL('../..', import.meta.url).pathname);
const outputDirectory = path.join(root, 'generated', 'drafts', '2026-08-02');
const portraitSource = path.join(root, 'generated', 'backgrounds', '2026-08-02-inbox-triage-portrait.png');
const wideSource = path.join(root, 'generated', 'backgrounds', '2026-08-02-inbox-triage-wide.png');
const disclosure = 'This post has been automated so we can run lighter.';
const palette = { paper:'#f7f0e2', moss:'#193128', ochre:'#d5b44b', terracotta:'#c96545' };

const escapeXml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
})[character]);
const dataUri = buffer => `data:image/png;base64,${buffer.toString('base64')}`;

function shell({ width, height, image, body, footerHeight, gradient }) {
  const padding = width > height ? 58 : 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    ${gradient}
    <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#09150f" flood-opacity=".48"/></filter>
  </defs>
  <image href="${image}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
  ${body}
  <rect y="${height-footerHeight}" width="${width}" height="${footerHeight}" fill="${palette.moss}" fill-opacity=".98"/>
  <text x="${padding}" y="${height-(width>height?23:35)}" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="${width>height?17:22}" font-weight="700">${escapeXml(disclosure)}</text>
</svg>`;
}

function portraitSvg(image) {
  return shell({
    width:1080, height:1350, image, footerHeight:96,
    gradient:'<linearGradient id="wash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#193128" stop-opacity=".96"/><stop offset=".38" stop-color="#193128" stop-opacity=".66"/><stop offset=".66" stop-color="#193128" stop-opacity="0"/></linearGradient>',
    body:`
  <rect width="1080" height="770" fill="url(#wash)"/>
  <text x="64" y="72" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" letter-spacing="4">RUN / LIGHTER</text>
  <g filter="url(#shadow)">
    <text x="64" y="230" fill="${palette.paper}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="80" font-weight="900" letter-spacing="-3">YOUR INBOX IS</text>
    <text x="64" y="322" fill="${palette.ochre}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="80" font-weight="900" letter-spacing="-3">NOT A WORKFLOW</text>
  </g>
  <rect x="64" y="366" width="96" height="8" rx="4" fill="${palette.terracotta}"/>`
  });
}

function wideSvg(image, width, height) {
  const og = height === 630;
  const padding = og ? 52 : 64;
  const footerHeight = og ? 66 : 76;
  const headline = og ? 62 : 78;
  const firstY = og ? 225 : 318;
  return shell({
    width, height, image, footerHeight,
    gradient:'<linearGradient id="wash" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#193128" stop-opacity=".98"/><stop offset=".46" stop-color="#193128" stop-opacity=".82"/><stop offset=".72" stop-color="#193128" stop-opacity="0"/></linearGradient>',
    body:`
  <rect width="${width}" height="${height-footerHeight}" fill="url(#wash)"/>
  <text x="${padding}" y="${og?48:60}" fill="${palette.paper}" font-family="Arial, Helvetica, sans-serif" font-size="${og?19:23}" font-weight="800" letter-spacing="4">RUN / LIGHTER</text>
  <g filter="url(#shadow)">
    <text x="${padding}" y="${firstY}" fill="${palette.paper}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${headline}" font-weight="900" letter-spacing="-3">YOUR INBOX IS</text>
    <text x="${padding}" y="${firstY+headline*.98}" fill="${palette.ochre}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${headline}" font-weight="900" letter-spacing="-3">NOT A WORKFLOW</text>
  </g>
  <rect x="${padding}" y="${firstY+headline*1.35}" width="${og?72:90}" height="7" rx="4" fill="${palette.terracotta}"/>`
  });
}

async function render(name, svg, width, height) {
  const base = path.join(outputDirectory, name);
  const cleanSvg = `${svg.replace(/[ \t]+$/gm, '')}\n`;
  await writeFile(`${base}.svg`, cleanSvg, 'utf8');
  const source = sharp(Buffer.from(cleanSvg));
  await source.clone().png({ compressionLevel:9 }).toFile(`${base}.png`);
  await source.clone().webp({ quality:88 }).toFile(`${base}.webp`);
  const metadata = await sharp(`${base}.png`).metadata();
  if (metadata.width !== width || metadata.height !== height) throw new Error(`${name} rendered at ${metadata.width}x${metadata.height}`);
}

const portrait = dataUri(await readFile(portraitSource));
const wide = dataUri(await readFile(wideSource));
await render('instagram', portraitSvg(portrait), 1080, 1350);
await render('hero', wideSvg(wide, 1600, 900), 1600, 900);
await render('og', wideSvg(wide, 1200, 630), 1200, 630);
console.log(`Rendered 2026-08-02 creative package in ${outputDirectory}`);
