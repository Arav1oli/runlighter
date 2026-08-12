import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const runDir = path.join(root, 'generated/2026-08-12-second');
const sourcePath = path.join(runDir, 'approval-stuck-source.png');
const disclosure = 'This post has been automated so we can run lighter.';
const sourceDataUri = `data:image/png;base64,${(await readFile(sourcePath)).toString('base64')}`;

await mkdir(runDir, { recursive: true });

const specs = {
  instagram: { width: 1080, height: 1350, fontSize: 102, lines: ['ONE APPROVAL.', 'TWELVE', 'FOLLOW-UPS.'], lineGap: 106, top: 208, brandY: 70, disclosureY: 1318, footerHeight: 84, imagePosition: 'center' },
  hero: { width: 1600, height: 900, fontSize: 104, lines: ['ONE APPROVAL.', 'TWELVE FOLLOW-UPS.'], lineGap: 110, top: 290, brandY: 76, disclosureY: 870, footerHeight: 62, imagePosition: 'center' },
  og: { width: 1200, height: 630, fontSize: 78, lines: ['ONE APPROVAL.', 'TWELVE FOLLOW-UPS.'], lineGap: 84, top: 205, brandY: 60, disclosureY: 609, footerHeight: 50, imagePosition: 'center' },
};

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function renderSvg(spec) {
  const { width, height, fontSize, lines, lineGap, top, brandY, disclosureY, footerHeight } = spec;
  const portrait = height > width;
  const x = portrait ? 58 : 66;
  const lineNodes = lines.map((line, index) => {
    const y = top + index * lineGap;
    const highlighted = line.includes('FOLLOW-UPS');
    if (highlighted) {
      const boxWidth = portrait ? 730 : Math.min(width - x * 2, fontSize * 10.2);
      return `<rect x="${x - 7}" y="${y - fontSize + 12}" width="${boxWidth}" height="${fontSize + 19}" rx="8" fill="#D8A62B"/><text x="${x + 8}" y="${y}" fill="#102B25" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-3">${line}</text>`;
    }
    return `<text x="${x}" y="${y}" fill="#F5F1E8" font-family="Arial Black, Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900" letter-spacing="-3">${line}</text>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="shadePortrait" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#102B25" stop-opacity="0.98"/><stop offset="0.56" stop-color="#102B25" stop-opacity="0.61"/><stop offset="0.83" stop-color="#102B25" stop-opacity="0.10"/><stop offset="1" stop-color="#102B25" stop-opacity="0"/></linearGradient>
    <linearGradient id="shadeWide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#102B25" stop-opacity="0.98"/><stop offset="0.62" stop-color="#102B25" stop-opacity="0.58"/><stop offset="1" stop-color="#102B25" stop-opacity="0.02"/></linearGradient>
  </defs>
  <image href="${sourceDataUri}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
  <rect width="${portrait ? width : Math.round(width * 0.76)}" height="${height}" fill="url(#${portrait ? 'shadePortrait' : 'shadeWide'})"/>
  <text x="${x}" y="${brandY}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${portrait ? 25 : 27}" font-weight="700" letter-spacing="5">RUN / LIGHTER</text>
  <rect x="${x}" y="${brandY + 22}" width="150" height="6" rx="3" fill="#D8A62B"/>
  ${lineNodes}
  <rect x="0" y="${height - footerHeight}" width="${width}" height="${footerHeight}" fill="#102B25" fill-opacity="0.98"/>
  <text x="${x}" y="${disclosureY}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${portrait ? 21 : 19}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
}

const variants = {};
for (const [name, spec] of Object.entries(specs)) {
  const svg = renderSvg(spec);
  const svgPath = path.join(runDir, `${name}.svg`);
  const pngPath = path.join(runDir, `${name}.png`);
  const webpPath = path.join(runDir, `${name}.webp`);
  await writeFile(svgPath, `${svg}\n`, 'utf8');
  const raster = sharp(Buffer.from(svg));
  await raster.clone().png({ compressionLevel: 9 }).toFile(pngPath);
  await raster.clone().webp({ quality: 90 }).toFile(webpPath);
  variants[name] = { png: path.relative(root, pngPath), webp: path.relative(root, webpPath), svg: path.relative(root, svgPath), width: spec.width, height: spec.height };
}

const manifest = {
  content_id: 'rl-2026-08-12-ec94684653',
  revision: 'strata-approval-v1',
  run_date: '2026-08-12',
  created_at: '2026-08-12T13:06:13+10:00',
  disclosure,
  source_asset_origin: 'created-today-imagegen',
  source_asset: 'generated/2026-08-12-second/approval-stuck-source.png',
  source_asset_sha256: '6c6175f9770fc55084d07fd63d142cb18f618a2876041d24a5d4374ed7d73cab',
  source_prompt_summary: 'A realistic Sydney strata lobby where one ochre approval folder is visibly stuck in an orderly document system.',
  reused_generated_asset: false,
  commercial_problem: 'A strata approval disappears into an email chain, forcing a manager to chase a committee while the repair, contractor or resident waits.',
  service_resolution: 'Run Lighter creates one approval record with the scheme, decision owner, deadline, evidence, status and exception path connected to the systems the team already uses.',
  overlay_copy: 'ONE APPROVAL. TWELVE FOLLOW-UPS.',
  variants,
};

await writeFile(path.join(runDir, 'creative-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(manifest, null, 2));
