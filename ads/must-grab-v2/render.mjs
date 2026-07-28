import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const raw = fs.readFileSync(path.join(here, 'raw', 'your-business-owns-you.png')).toString('base64');
const finalDir = path.join(here, 'final');
fs.mkdirSync(finalDir, { recursive: true });

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="13" flood-color="#000" flood-opacity=".25"/></filter>
  </defs>
  <rect width="1080" height="1350" fill="#050605"/>
  <image x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${raw}"/>
  <rect x="958" y="62" width="58" height="58" rx="15" fill="#FBF8F1" filter="url(#shadow)"/>
  <text x="987" y="98" text-anchor="middle" fill="#344137" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800">R/L</text>
  <text fill="#FBF8F1" font-family="Avenir Next Condensed, Arial Narrow, Helvetica, sans-serif" font-size="124" font-weight="800" letter-spacing="-3">
    <tspan x="64" y="152">YOUR BUSINESS</tspan>
    <tspan x="64" y="262">OWNS YOU.</tspan>
  </text>
  <rect x="66" y="308" width="190" height="8" rx="4" fill="#587664"/>
</svg>`;

fs.writeFileSync(path.join(finalDir, 'your-business-owns-you.svg'), svg);
console.log('Wrote SVG master');
