import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const outDir = path.join(here, 'final');
fs.mkdirSync(outDir, { recursive: true });

const posts = [
  {file:'01-ai-selective.png', lines:['AUTOMATE THE REPEATED.','KEEP THE','JUDGEMENT.'], fg:'#29312c', grad:['#fbf8f1','0.98','#fbf8f1','0.80'], markBg:'#344137', markFg:'#fbf8f1', rule:'#587664', size:82, y:154},
  {file:'02-competitors.png', lines:['YOUR COMPETITORS','ARE ALREADY','AUTOMATING'], fg:'#fbf8f1', grad:['#0c141b','0.92','#0c141b','0.35'], markBg:'#fbf8f1', markFg:'#344137', rule:'#718069', size:98, y:154},
  {file:'03-owner-dependency.png', lines:['YOUR BUSINESS','SHOULD RUN','WITHOUT YOU'], fg:'#29312c', grad:['#f3efe5','0.94','#f3efe5','0.62'], markBg:'#344137', markFg:'#fbf8f1', rule:'#587664', size:102, y:158},
  {file:'04-leads-cold.png', lines:['YOUR LEADS','ARE GOING','COLD'], fg:'#fbf8f1', grad:['#182a1f','0.94','#182a1f','0.54'], markBg:'#fbf8f1', markFg:'#344137', rule:'#718069', size:112, y:158},
  {file:'05-missed-calls.png', lines:['MISSED CALLS','BECOME','MISSED JOBS'], fg:'#fbf8f1', grad:['#0c1312','0.9','#0c1312','0.34'], markBg:'#f3efe5', markFg:'#344137', rule:'#718069', size:106, y:158},
  {file:'06-copying-data.png', lines:['YOUR BEST PEOPLE','ARE COPYING','DATA'], fg:'#29312c', grad:['#fbf8f1','0.98','#fbf8f1','0.80'], markBg:'#344137', markFg:'#fbf8f1', rule:'#587664', size:100, y:158},
  {file:'07-reporting.png', lines:['MONDAY SHOULDN\u2019T','DISAPPEAR INTO','REPORTING'], fg:'#fbf8f1', grad:['#1b3022','0.96','#1b3022','0.63'], markBg:'#f3efe5', markFg:'#344137', rule:'#718069', size:98, y:158},
  {file:'08-software-talk.png', lines:['YOUR SOFTWARE','SHOULD TALK','TOGETHER'], fg:'#29312c', grad:['#fbf8f1','0.98','#fbf8f1','0.80'], markBg:'#344137', markFg:'#fbf8f1', rule:'#587664', size:104, y:158},
  {file:'09-five-tasks.png', lines:['5 TASKS WORTH','AUTOMATING','FIRST'], fg:'#fbf8f1', grad:['#344137','0.98','#344137','0.73'], markBg:'#f3efe5', markFg:'#344137', rule:'#b7c1aa', size:108, y:158},
  {file:'10-find-first.png', lines:['WE FIND WHAT','TO AUTOMATE','FIRST'], fg:'#29312c', grad:['#dfe4d7','0.98','#dfe4d7','0.82'], markBg:'#344137', markFg:'#fbf8f1', rule:'#587664', size:106, y:158},
];

function esc(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}

posts.forEach((p, i) => {
  const raw = fs.readFileSync(path.join(here, 'raw', p.file)).toString('base64');
  const id = String(i + 1).padStart(2, '0');
  const lineGap = Math.round(p.size * .88);
  const spans = p.lines.map((line, n) => `<tspan x="64" y="${p.y + n * lineGap}">${esc(line)}</tspan>`).join('');
  const ruleY = p.y + p.lines.length * lineGap + 25;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.grad[0]}" stop-opacity="${p.grad[1]}"/>
      <stop offset="0.34" stop-color="${p.grad[2]}" stop-opacity="${p.grad[3]}"/>
      <stop offset="0.62" stop-color="${p.grad[2]}" stop-opacity="0"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="13" flood-color="#000" flood-opacity=".18"/></filter>
  </defs>
  <image x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/png;base64,${raw}"/>
  <rect x="0" y="0" width="1080" height="1350" fill="url(#veil)"/>
  <rect x="958" y="62" width="58" height="58" rx="15" fill="${p.markBg}" filter="url(#shadow)"/>
  <text x="987" y="98" text-anchor="middle" fill="${p.markFg}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="800">R/L</text>
  <text fill="${p.fg}" font-family="Avenir Next Condensed, Arial Narrow, Helvetica, sans-serif" font-size="${p.size}" font-weight="800" letter-spacing="-2.5">${spans}</text>
  <rect x="66" y="${ruleY}" width="190" height="8" rx="4" fill="${p.rule}"/>
</svg>`;
  fs.writeFileSync(path.join(outDir, `${id}-${p.file.replace('.png','')}.svg`), svg);
});

console.log(`Wrote ${posts.length} SVG masters to ${outDir}`);
