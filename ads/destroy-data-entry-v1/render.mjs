import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const raw = fs.readFileSync(path.join(here, 'raw', 'destroy-data-entry.png')).toString('base64');
const finalDir = path.join(here, 'final');
fs.mkdirSync(finalDir, { recursive: true });

const palettes = [
  ['#050505', '#FFFFFF'],
  ['#F3FF00', '#050505'],
  ['#FF006E', '#FFFFFF'],
  ['#FFFFFF', '#050505'],
];
const rotations = [-7, 4, -3, 6, -5, 3, -6, 5, -2, 6, -4, 3, -7, 5, -3, 4, -5, 2];
let tileIndex = 0;

function wordTiles(word, startX, startY) {
  const tile = 86;
  const gap = 10;
  return [...word].map((letter, index) => {
    const x = startX + index * (tile + gap);
    const y = startY;
    const cx = x + tile / 2;
    const cy = y + tile / 2;
    const [bg, fg] = palettes[tileIndex % palettes.length];
    const rotation = rotations[tileIndex % rotations.length];
    tileIndex += 1;
    return `<g transform="rotate(${rotation} ${cx} ${cy})" filter="url(#shadow)">
      <rect x="${x}" y="${y}" width="${tile}" height="${tile}" rx="13" fill="${bg}" stroke="#050505" stroke-width="4"/>
      <text x="${cx}" y="${y + 65}" text-anchor="middle" fill="${fg}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="60" font-weight="900">${letter}</text>
    </g>`;
  }).join('');
}

const tiles = [
  wordTiles('WE', 48, 48),
  wordTiles('DESTROY', 266, 48),
  wordTiles('DATA', 78, 170),
  wordTiles('ENTRY', 494, 170),
].join('');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#000" flood-opacity=".34"/></filter>
  </defs>
  <image x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/png;base64,${raw}"/>
  ${tiles}
  <rect x="960" y="1245" width="72" height="54" rx="16" fill="#050505" filter="url(#shadow)"/>
  <text x="996" y="1280" text-anchor="middle" fill="#F3FF00" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="900">R/L</text>
</svg>`;

fs.writeFileSync(path.join(finalDir, 'we-destroy-data-entry.svg'), svg);
console.log('Wrote SVG master');
