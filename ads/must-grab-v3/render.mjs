import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const raw = fs.readFileSync(path.join(here, 'raw', 'losing-leads.png')).toString('base64');
const finalDir = path.join(here, 'final');
fs.mkdirSync(finalDir, { recursive: true });

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="13" flood-color="#000" flood-opacity=".25"/></filter>
  </defs>
  <image x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/png;base64,${raw}"/>
  <rect x="0" y="0" width="1080" height="348" fill="#F3FF00" fill-opacity=".94"/>
  <rect x="958" y="50" width="58" height="58" rx="15" fill="#050505" filter="url(#shadow)"/>
  <text x="987" y="86" text-anchor="middle" fill="#F3FF00" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800">R/L</text>
  <text fill="#050505" font-family="Avenir Next Condensed, Arial Narrow, Helvetica, sans-serif" font-size="102" font-weight="900" letter-spacing="-2.8">
    <tspan x="52" y="138">YOU’RE LOSING LEADS</tspan>
    <tspan x="52" y="238">WHILE YOU READ THIS.</tspan>
  </text>
  <rect x="54" y="286" width="240" height="12" rx="6" fill="#FF006E"/>
</svg>`;

fs.writeFileSync(path.join(finalDir, 'youre-losing-leads.svg'), svg);
console.log('Wrote SVG master');
