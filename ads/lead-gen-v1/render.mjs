import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const rawDir = path.join(here, 'raw');
const finalDir = path.join(here, 'final');
fs.mkdirSync(finalDir, { recursive: true });

const ads = [
  {
    file: '01-owner-dependency.png',
    lines: ['YOUR BUSINESS', 'SHOULDN\u2019T NEED YOU', 'EVERYWHERE'],
    text: '#29312C', veil: '#FBF8F1', veilOpacity: 0.94,
    markBg: '#344137', markFg: '#FBF8F1', rule: '#587664', size: 94,
  },
  {
    file: '02-trades-missed-calls.png',
    lines: ['MISSED CALLS', 'BECOME', 'MISSED JOBS'],
    text: '#FBF8F1', veil: '#182A1F', veilOpacity: 0.91,
    markBg: '#FBF8F1', markFg: '#344137', rule: '#718069', size: 108,
  },
  {
    file: '03-professional-services-data.png',
    lines: ['YOUR BEST PEOPLE', 'ARE COPYING', 'DATA'],
    text: '#29312C', veil: '#FBF8F1', veilOpacity: 0.95,
    markBg: '#344137', markFg: '#FBF8F1', rule: '#587664', size: 100,
  },
];

const escapeXml = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

for (let index = 0; index < ads.length; index += 1) {
  const ad = ads[index];
  const raw = fs.readFileSync(path.join(rawDir, ad.file)).toString('base64');
  const id = String(index + 1).padStart(2, '0');
  const y = 154;
  const gap = Math.round(ad.size * 0.88);
  const spans = ad.lines.map((line, lineIndex) => `<tspan x="64" y="${y + lineIndex * gap}">${escapeXml(line)}</tspan>`).join('');
  const ruleY = y + ad.lines.length * gap + 24;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${ad.veil}" stop-opacity="${ad.veilOpacity}"/>
      <stop offset="0.33" stop-color="${ad.veil}" stop-opacity="0.72"/>
      <stop offset="0.62" stop-color="${ad.veil}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="13" flood-color="#000" flood-opacity=".18"/></filter>
  </defs>
  <image x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/png;base64,${raw}"/>
  <rect x="0" y="0" width="1080" height="1350" fill="url(#veil)"/>
  <rect x="958" y="62" width="58" height="58" rx="15" fill="${ad.markBg}" filter="url(#shadow)"/>
  <text x="987" y="98" text-anchor="middle" fill="${ad.markFg}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800">R/L</text>
  <text fill="${ad.text}" font-family="Avenir Next Condensed, Arial Narrow, Helvetica, sans-serif" font-size="${ad.size}" font-weight="800" letter-spacing="-2.5">${spans}</text>
  <rect x="66" y="${ruleY}" width="190" height="8" rx="4" fill="${ad.rule}"/>
</svg>`;
  fs.writeFileSync(path.join(finalDir, `${id}-${ad.file.replace('.png', '')}.svg`), svg);
}

console.log(`Wrote ${ads.length} SVG ad masters`);
