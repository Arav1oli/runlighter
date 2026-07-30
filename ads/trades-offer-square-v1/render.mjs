import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(new URL('../..', import.meta.url).pathname);
const campaign = path.join(root, 'ads', 'trades-offer-square-v1');
const finalDir = path.join(campaign, 'final');
const disclosure = 'This post has been automated so we can run lighter.';

const colours = {
  paper: '#fbf8f1',
  moss: '#20372d',
  deepMoss: '#14271f',
  ochre: '#e0a638',
  terracotta: '#c96f4b'
};

const ads = [
  {
    id: '01-your-quote-is-still-in-the-ute',
    source: '01-quote-still-in-ute.png',
    imageY: 0,
    hookLines: ['YOUR QUOTE IS', 'STILL IN THE UTE.'],
    hookSizes: [68, 71],
    mechanism: 'WE TRACE ONE QUOTE FROM SITE TO SEND',
    alt: 'Sydney tradie in a parked right-hand-drive ute reviewing site measurements and photos, with the offer of a zero-dollar on-site workflow review.'
  },
  {
    id: '02-busy-hands-missed-jobs',
    source: '02-busy-plumber-missed-call.png',
    imageY: -165,
    hookLines: ['BUSY HANDS.', 'MISSED JOBS.'],
    hookSizes: [78, 82],
    mechanism: 'WE TRACE ONE LEAD FROM RING TO RESPONSE',
    alt: 'Sydney plumber working safely under a kitchen sink while an incoming call waits on a nearby tool case, with the offer of a zero-dollar on-site workflow review.'
  },
  {
    id: '03-the-jobs-done-why-arent-you',
    source: '03-after-hours-paperwork.png',
    imageY: 0,
    hookLines: ['THE JOB’S DONE.', 'WHY AREN’T YOU?'],
    hookSizes: [70, 70],
    mechanism: 'WE TRACE ONE JOB FROM PHOTOS TO INVOICE',
    alt: 'Sydney trade-business owner completing paperwork at the rear of a parked work van after dark, with the offer of a zero-dollar on-site workflow review.'
  }
];

const escapeXml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
})[character]);

const asDataUri = (buffer, mime = 'image/png') => `data:${mime};base64,${buffer.toString('base64')}`;

function creativeSvg(ad, imageData, markData) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-label="${escapeXml(ad.alt)}">
  <defs>
    <linearGradient id="top-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${colours.deepMoss}" stop-opacity=".98"/>
      <stop offset=".64" stop-color="${colours.moss}" stop-opacity=".90"/>
      <stop offset="1" stop-color="${colours.moss}" stop-opacity=".08"/>
    </linearGradient>
    <linearGradient id="mid-shade" x1="0" y1="0" x2="1" y2=".45">
      <stop offset="0" stop-color="${colours.deepMoss}" stop-opacity=".52"/>
      <stop offset=".65" stop-color="${colours.deepMoss}" stop-opacity="0"/>
    </linearGradient>
    <filter id="copy-shadow">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#08140f" flood-opacity=".60"/>
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="${colours.deepMoss}"/>
  <image href="${imageData}" x="0" y="${ad.imageY}" width="1080" height="1080" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1080" height="580" fill="url(#top-shade)"/>
  <rect width="1080" height="760" fill="url(#mid-shade)"/>

  <rect x="54" y="44" width="318" height="44" rx="22" fill="${colours.ochre}"/>
  <text x="76" y="74" fill="${colours.deepMoss}" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="900" letter-spacing="1.7">SYDNEY TRADE OWNERS</text>
  <image href="${markData}" x="949" y="40" width="78" height="78" preserveAspectRatio="xMidYMid slice"/>

  <g filter="url(#copy-shadow)">
    <text x="54" y="184" fill="${colours.paper}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${ad.hookSizes[0]}" font-weight="900" letter-spacing="-2.8">${escapeXml(ad.hookLines[0])}</text>
    <text x="54" y="272" fill="${colours.ochre}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${ad.hookSizes[1]}" font-weight="900" letter-spacing="-3">${escapeXml(ad.hookLines[1])}</text>
  </g>

  <rect x="54" y="313" width="86" height="7" rx="3.5" fill="${colours.terracotta}"/>
  <text x="54" y="363" fill="${colours.paper}" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="900" letter-spacing=".2">${escapeXml(ad.mechanism)}</text>

  <rect x="42" y="760" width="996" height="254" rx="22" fill="${colours.paper}" fill-opacity=".98"/>
  <text x="72" y="889" fill="${colours.terracotta}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="122" font-weight="900" letter-spacing="-7">$0</text>
  <text x="240" y="827" fill="${colours.moss}" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="43" font-weight="900" letter-spacing="-1">ON-SITE WORKFLOW REVIEW</text>
  <text x="240" y="865" fill="${colours.moss}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800" letter-spacing=".45">FOR SUITABLE SYDNEY TRADE BUSINESSES</text>
  <rect x="240" y="894" width="540" height="70" rx="12" fill="${colours.ochre}"/>
  <text x="270" y="939" fill="${colours.deepMoss}" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="900" letter-spacing=".25">START WITH A 10-MINUTE CALL</text>

  <rect y="1014" width="1080" height="66" fill="${colours.deepMoss}"/>
  <text x="54" y="1055" fill="${colours.paper}" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">${escapeXml(disclosure)}</text>
</svg>`.replace(/[ \t]+$/gm, '');
}

await mkdir(finalDir, { recursive: true });
const mark = await sharp(path.join(campaign, 'run-lighter-mark.png')).resize(78, 78).png().toBuffer();
const markData = asDataUri(mark);
const contactTiles = [];

for (const ad of ads) {
  const source = await readFile(path.join(campaign, 'raw', ad.source));
  const svg = creativeSvg(ad, asDataUri(source), markData);
  const base = path.join(finalDir, ad.id);
  await writeFile(`${base}.svg`, `${svg}\n`, 'utf8');
  const render = sharp(Buffer.from(svg));
  await render.clone().png({ compressionLevel: 9 }).toFile(`${base}.png`);
  await render.clone().webp({ quality: 90 }).toFile(`${base}.webp`);
  contactTiles.push(await sharp(`${base}.png`).resize(360, 360).png().toBuffer());
}

await sharp({
  create: {
    width: 1120,
    height: 400,
    channels: 4,
    background: colours.deepMoss
  }
}).composite(contactTiles.map((input, index) => ({
  input,
  left: 10 + index * 370,
  top: 20
}))).png({ compressionLevel: 9 }).toFile(path.join(campaign, 'trades-offer-square-contact-sheet.png'));

console.log(`Rendered ${ads.length} square trade offer ads in ${finalDir}`);
