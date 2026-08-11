import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const runDir = path.join(root, 'generated/2026-08-12');
const sourcePath = path.join(runDir, 'workflow-snag-source.png');
const disclosure = 'This post has been automated so we can run lighter.';
const sourceDataUri = `data:image/png;base64,${(await readFile(sourcePath)).toString('base64')}`;

await mkdir(runDir, { recursive: true });

const specs = {
  instagram: { width: 1080, height: 1350, fontSize: 111, lines: ['WE FIND', 'WHERE THE', 'WORK GETS', 'STUCK.'], lineGap: 108, top: 195, brandY: 70, disclosureY: 1318, footerHeight: 84 },
  hero: { width: 1600, height: 900, fontSize: 112, lines: ['WE FIND WHERE', 'THE WORK GETS', 'STUCK.'], lineGap: 112, top: 250, brandY: 78, disclosureY: 870, footerHeight: 62 },
  og: { width: 1200, height: 630, fontSize: 82, lines: ['WE FIND WHERE', 'THE WORK GETS', 'STUCK.'], lineGap: 83, top: 180, brandY: 61, disclosureY: 609, footerHeight: 50 },
};

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderSvg({ width, height, fontSize, lines, lineGap, top, brandY, disclosureY, footerHeight }) {
  const portrait = height > width;
  const headlineX = portrait ? 62 : 70;
  const headlineWidth = portrait ? 770 : 900;
  const lineNodes = lines.map((line, index) => {
    const y = top + index * lineGap;
    if (line === 'STUCK.') {
      return `<rect x="${headlineX - 8}" y="${y - fontSize + 12}" width="${Math.min(headlineWidth, fontSize * 4.2)}" height="${fontSize + 20}" rx="8" fill="#D8A62B"/><text x="${headlineX + 8}" y="${y}" fill="#102B25" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-3">${line}</text>`;
    }
    return `<text x="${headlineX}" y="${y}" fill="#F5F1E8" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-3">${line}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0D2D2A" stop-opacity="0.96"/>
      <stop offset="0.54" stop-color="#0D2D2A" stop-opacity="0.50"/>
      <stop offset="0.82" stop-color="#0D2D2A" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#0D2D2A" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sideShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0D2D2A" stop-opacity="0.92"/>
      <stop offset="0.60" stop-color="#0D2D2A" stop-opacity="0.30"/>
      <stop offset="1" stop-color="#0D2D2A" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <image href="${sourceDataUri}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
  <rect width="${width}" height="${portrait ? Math.round(height * 0.62) : height}" fill="url(#${portrait ? 'shade' : 'sideShade'})"/>
  <text x="${headlineX}" y="${brandY}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${portrait ? 25 : 27}" font-weight="700" letter-spacing="5">RUN / LIGHTER</text>
  <rect x="${headlineX}" y="${brandY + 22}" width="150" height="6" rx="3" fill="#D8A62B"/>
  ${lineNodes}
  <rect x="0" y="${height - footerHeight}" width="${width}" height="${footerHeight}" fill="#102B25" fill-opacity="0.97"/>
  <text x="${headlineX}" y="${disclosureY}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${portrait ? 21 : 19}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
}

const variants = {};
for (const [name, spec] of Object.entries(specs)) {
  const svg = renderSvg(spec);
  const svgPath = path.join(runDir, `${name}.svg`);
  const pngPath = path.join(runDir, `${name}.png`);
  const webpPath = path.join(runDir, `${name}.webp`);
  await writeFile(svgPath, `${svg}\n`, 'utf8');
  const raster = sharp(Buffer.from(svg)).resize(spec.width, spec.height, { fit: 'fill' });
  await raster.clone().png({ compressionLevel: 9 }).toFile(pngPath);
  await raster.clone().webp({ quality: 90 }).toFile(webpPath);
  variants[name] = {
    png: path.relative(root, pngPath),
    webp: path.relative(root, webpPath),
    svg: path.relative(root, svgPath),
    width: spec.width,
    height: spec.height,
  };
}

const manifest = {
  content_id: 'rl-2026-08-12-7c4c8dfd2a',
  revision: 'workflow-snag-v1',
  run_date: '2026-08-12',
  created_at: new Date().toISOString(),
  disclosure,
  source_asset_origin: 'created-today-imagegen',
  source_asset: 'generated/2026-08-12/workflow-snag-source.png',
  source_asset_sha256: 'b21cde920151006cd8a747792cc927abb39bf65984bc449ff282ea06238aa0c2',
  source_prompt_summary: 'A human hand follows an ochre rope to one visible snag on Sydney sandstone beside blue-green water.',
  reused_generated_asset: false,
  commercial_problem: 'Owners cannot tell whether an automation review will diagnose a real workflow or deliver a generic technology pitch.',
  service_resolution: 'Run Lighter follows one real workflow through people and systems, finds the expensive snag and recommends one practical starting point while keeping judgement human.',
  overlay_copy: 'WE FIND WHERE THE WORK GETS STUCK.',
  variants,
};

await writeFile(path.join(runDir, 'creative-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(manifest, null, 2));
