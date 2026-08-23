import path from 'node:path';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const logoDir = path.join(root, 'assets', 'brand', 'logo');
const socialDir = path.join(root, 'assets', 'brand', 'social');
const primaryPath = path.join(logoDir, 'runlighter-logo-primary.svg');
const primary = await readFile(primaryPath, 'utf8');
const reverse = primary
  .replaceAll('fill="#29312C"', 'fill="#FBF8F1"')
  .replaceAll('fill="#587664"', 'fill="#A7B5A5"');

await mkdir(logoDir, { recursive: true });
await mkdir(socialDir, { recursive: true });

const dataUri = source => `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`;
const primaryUri = dataUri(primary);
const reverseUri = dataUri(reverse);
const svgDocument = (width, height, body, title) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
  ${body}
</svg>`;

async function render(svg, base, sizes = []) {
  const svgPath = `${base}.svg`;
  await writeFile(svgPath, svg);
  const image = sharp(Buffer.from(svg));
  await image.clone().png({ compressionLevel: 9 }).toFile(`${base}.png`);
  for (const size of sizes) {
    await image.clone().resize(size, size, { fit: 'fill' }).png({ compressionLevel: 9 }).toFile(`${base}-${size}.png`);
  }
}

const responsiveMark = svgDocument(512, 512, `
  <rect width="512" height="512" rx="96" fill="#F3EFE5"/>
  <g fill="#29312C" transform="translate(22 429) scale(.92 -.92)">
    <path d="M35.77 383.75L201.09 383.75Q229.27 383.75 257.19 378.06Q285.10 372.37 307.05 358Q329.01 343.64 342.56 319.52Q356.11 295.40 356.11 259.09Q356.11 223.85 338.76 197.02Q321.42 170.19 288.90 155.56L386.46 0L237.95 0L164.23 137.13L160.44 137.13L160.44 0L35.77 0ZM159.35 221.69L184.83 221.69Q191.33 221.69 199.19 222.77Q207.05 223.85 213.83 227.38Q220.60 230.90 225.21 237.13Q229.82 243.37 229.82 253.66Q229.82 263.96 226.02 269.93Q222.23 275.89 216.27 278.87Q210.30 281.85 203.26 282.66Q196.21 283.48 190.25 283.48L159.35 283.48Z"/>
  </g>
  <path d="M400 424H451L490 88H439Z" fill="#587664"/>
`, 'Run Lighter R slash mark');

const profile = svgDocument(1080, 1080, `
  <rect width="1080" height="1080" fill="#F3EFE5"/>
  <circle cx="540" cy="540" r="470" fill="#FBF8F1" stroke="#D7DDD2" stroke-width="4"/>
  <image href="${primaryUri}" x="170" y="290" width="740" height="500" preserveAspectRatio="xMidYMid meet"/>
`, 'Run Lighter social profile logo');

const cover = svgDocument(1640, 624, `
  <defs>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#587664" stroke-opacity=".08"/></pattern>
    <radialGradient id="wash" cx="84%" cy="16%" r="70%"><stop stop-color="#DDE5DA"/><stop offset="1" stop-color="#F3EFE5"/></radialGradient>
  </defs>
  <rect width="1640" height="624" fill="url(#wash)"/>
  <rect width="1640" height="624" fill="url(#grid)"/>
  <image href="${primaryUri}" x="170" y="88" width="670" height="452" preserveAspectRatio="xMinYMid meet"/>
  <path d="M1030 132H1390" stroke="#587664" stroke-width="10" stroke-linecap="round"/>
  <text x="1030" y="240" fill="#29312C" font-family="Avenir Next, Arial, sans-serif" font-size="52" font-weight="600">Better systems.</text>
  <text x="1030" y="310" fill="#29312C" font-family="Avenir Next, Arial, sans-serif" font-size="52" font-weight="600">Less manual work.</text>
  <text x="1030" y="394" fill="#697068" font-family="Avenir Next, Arial, sans-serif" font-size="27" font-weight="500">Practical automation for Sydney businesses.</text>
`, 'Run Lighter Facebook cover');

const ogBrand = svgDocument(1200, 630, `
  <defs><linearGradient id="field" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FBF8F1"/><stop offset="1" stop-color="#DFE4D7"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#field)"/>
  <image href="${primaryUri}" x="95" y="92" width="560" height="378" preserveAspectRatio="xMinYMid meet"/>
  <path d="M760 154H1084" stroke="#587664" stroke-width="9" stroke-linecap="round"/>
  <text x="760" y="260" fill="#29312C" font-family="Avenir Next, Arial, sans-serif" font-size="48" font-weight="600">Better systems.</text>
  <text x="760" y="324" fill="#29312C" font-family="Avenir Next, Arial, sans-serif" font-size="48" font-weight="600">Less manual work.</text>
  <text x="760" y="403" fill="#697068" font-family="Avenir Next, Arial, sans-serif" font-size="25" font-weight="500">Sydney, Australia</text>
`, 'Run Lighter social sharing image');

const watermarkDark = svgDocument(600, 405, `<image href="${primaryUri}" x="0" y="0" width="600" height="405" opacity=".28"/>`, 'Run Lighter dark watermark');
const watermarkLight = svgDocument(600, 405, `<image href="${reverseUri}" x="0" y="0" width="600" height="405" opacity=".34"/>`, 'Run Lighter light watermark');
const overlayPortrait = svgDocument(1080, 1350, `
  <image href="${primaryUri}" x="48" y="40" width="220" height="149" preserveAspectRatio="xMinYMin meet"/>
`, 'Run Lighter portrait post watermark overlay');
const overlaySquare = svgDocument(1080, 1080, `
  <image href="${primaryUri}" x="48" y="40" width="220" height="149" preserveAspectRatio="xMinYMin meet"/>
`, 'Run Lighter square post watermark overlay');

await writeFile(path.join(logoDir, 'runlighter-logo-reverse.svg'), reverse);
await sharp(Buffer.from(reverse)).png({ compressionLevel: 9 }).toFile(path.join(logoDir, 'runlighter-logo-reverse.png'));
await render(responsiveMark, path.join(logoDir, 'runlighter-favicon'), [16, 32, 64, 180, 512]);
await copyFile(path.join(logoDir, 'runlighter-favicon-64.png'), path.join(root, 'assets', 'favicon.png'));
await render(profile, path.join(socialDir, 'runlighter-profile-logo'));
await render(cover, path.join(socialDir, 'runlighter-facebook-cover'));
await render(ogBrand, path.join(socialDir, 'runlighter-social-share'));
await render(watermarkDark, path.join(socialDir, 'runlighter-watermark-dark'));
await render(watermarkLight, path.join(socialDir, 'runlighter-watermark-light'));
await render(overlayPortrait, path.join(socialDir, 'runlighter-watermark-overlay-1080x1350'));
await render(overlaySquare, path.join(socialDir, 'runlighter-watermark-overlay-1080x1080'));

console.log(JSON.stringify({
  logo_dir: logoDir,
  social_dir: socialDir,
  generated: [
    'runlighter-favicon.svg',
    'runlighter-profile-logo.png',
    'runlighter-facebook-cover.png',
    'runlighter-social-share.png',
    'runlighter-watermark-dark.png',
    'runlighter-watermark-light.png',
    'runlighter-watermark-overlay-1080x1350.png',
    'runlighter-watermark-overlay-1080x1080.png'
  ]
}, null, 2));
