import path from 'node:path';
import sharp from 'sharp';
import { BRAND, BRAND_COLOURS as C, DISCLOSURE } from './constants.mjs';
import { ensureDir, writeJson, writeText, ROOT } from './utils.mjs';

const esc = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'})[character]);

function wrap(text, maxChars, maxLines = 4) {
  const input = String(text).split(/\s+/);
  const lines = [];
  for (const word of input) {
    const current = lines.at(-1);
    if (!current || `${current} ${word}`.length > maxChars) lines.push(word);
    else lines[lines.length - 1] = `${current} ${word}`;
  }
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[.,]$/, '')}…`;
    return kept;
  }
  return lines;
}

function textBlock(lines, x, y, size, lineHeight, colour, weight = 600, anchor = 'start') {
  return `<text x="${x}" y="${y}" fill="${colour}" font-family="DM Sans, Arial, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${lines.map((line, index) => `<tspan x="${x}" dy="${index ? lineHeight : 0}">${esc(line)}</tspan>`).join('')}</text>`;
}

function visual(format, x, y, width, height, seed = 0) {
  const card = (cx, cy, cw, ch, fill = C.paper, stroke = C.moss) => `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="22" fill="${fill}" stroke="${stroke}" stroke-opacity=".17"/>`;
  const line = (x1,y1,x2,y2,colour=C.eucalyptus,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colour}" stroke-width="8" stroke-linecap="round" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
  if (format === 'workflow-diagram') {
    const gap = width * .06, cw = (width - gap * 2) / 3;
    return [0,1,2].map(i => `${card(x+i*(cw+gap),y+height*.22,cw,height*.56,i===1?C.sageWash:C.paper)}<circle cx="${x+i*(cw+gap)+cw/2}" cy="${y+height*.42}" r="21" fill="${[C.terracotta,C.ochre,C.eucalyptus][i]}"/><rect x="${x+i*(cw+gap)+cw*.2}" y="${y+height*.56}" width="${cw*.6}" height="10" rx="5" fill="${C.moss}" opacity=".25"/>${i<2?line(x+(i+1)*cw+i*gap,y+height*.5,x+(i+1)*cw+(i+1)*gap,y+height*.5,C.clay):''}`).join('');
  }
  if (format === 'before-after') {
    return `${card(x,y,width*.44,height,C.paper)}${card(x+width*.56,y,width*.44,height,C.sageWash)}${[0,1,2,3].map(i=>`<rect x="${x+width*.06}" y="${y+height*(.17+i*.18)}" width="${width*(.2+(i%2)*.12)}" height="18" rx="9" fill="${C.clay}" opacity="${.25+i*.08}"/>`).join('')}${line(x+width*.47,y+height*.5,x+width*.53,y+height*.5,C.ochre)}<circle cx="${x+width*.78}" cy="${y+height*.42}" r="48" fill="${C.eucalyptus}"/><path d="M ${x+width*.75} ${y+height*.42} l 22 22 42 -52" fill="none" stroke="${C.paper}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  if (format === 'operational-checklist') {
    return `${card(x,y,width,height,C.paper)}${[0,1,2,3].map((i)=>`<circle cx="${x+58}" cy="${y+60+i*(height-120)/3}" r="22" fill="${i<3?C.eucalyptus:C.sageWash}"/><path d="M ${x+47} ${y+60+i*(height-120)/3} l 9 9 17 -22" fill="none" stroke="${i<3?C.paper:C.sage}" stroke-width="6" stroke-linecap="round"/><rect x="${x+100}" y="${y+50+i*(height-120)/3}" width="${width*(.48+(i%2)*.18)}" height="20" rx="10" fill="${C.moss}" opacity=".2"/>`).join('')}`;
  }
  if (format === 'decision-tree') {
    return `${card(x+width*.34,y,width*.32,height*.24,C.sageWash)}${line(x+width*.5,y+height*.24,x+width*.5,y+height*.45)}${line(x+width*.25,y+height*.45,x+width*.75,y+height*.45)}${line(x+width*.25,y+height*.45,x+width*.25,y+height*.62)}${line(x+width*.75,y+height*.45,x+width*.75,y+height*.62)}${card(x,y+height*.62,width*.42,height*.3,C.paper)}${card(x+width*.58,y+height*.62,width*.42,height*.3,C.paper)}<circle cx="${x+width*.25}" cy="${y+height*.77}" r="28" fill="${C.eucalyptus}"/><circle cx="${x+width*.75}" cy="${y+height*.77}" r="28" fill="${C.terracotta}"/>`;
  }
  if (format === 'time-returned') {
    return `${card(x,y,width,height,C.paper)}<circle cx="${x+width*.34}" cy="${y+height*.5}" r="${height*.3}" fill="none" stroke="${C.sageWash}" stroke-width="34"/><path d="M ${x+width*.34} ${y+height*.2} A ${height*.3} ${height*.3} 0 1 1 ${x+width*.12} ${y+height*.7}" fill="none" stroke="${C.eucalyptus}" stroke-width="34" stroke-linecap="round"/><line x1="${x+width*.34}" y1="${y+height*.5}" x2="${x+width*.34}" y2="${y+height*.3}" stroke="${C.moss}" stroke-width="12" stroke-linecap="round"/><line x1="${x+width*.34}" y1="${y+height*.5}" x2="${x+width*.48}" y2="${y+height*.58}" stroke="${C.moss}" stroke-width="12" stroke-linecap="round"/>${[.28,.45,.62].map((v,i)=>`<rect x="${x+width*.62}" y="${y+height*v}" width="${width*(.18+i*.05)}" height="18" rx="9" fill="${[C.clay,C.ochre,C.eucalyptus][i]}"/>`).join('')}`;
  }
  if (format === 'interface-mockup') {
    return `${card(x,y,width,height,C.paper)}<rect x="${x}" y="${y}" width="${width}" height="62" rx="22" fill="${C.moss}"/><circle cx="${x+36}" cy="${y+31}" r="8" fill="${C.terracotta}"/><circle cx="${x+62}" cy="${y+31}" r="8" fill="${C.ochre}"/><circle cx="${x+88}" cy="${y+31}" r="8" fill="${C.sage}"/>${[0,1,2].map(i=>`${card(x+34,y+92+i*90,width-68,68,i===1?C.sageWash:C.oat)}<circle cx="${x+72}" cy="${y+126+i*90}" r="15" fill="${[C.clay,C.eucalyptus,C.dustyBlue][i]}"/><rect x="${x+108}" y="${y+116+i*90}" width="${width*.45}" height="12" rx="6" fill="${C.moss}" opacity=".25"/>`).join('')}`;
  }
  if (format === 'process-bottleneck') {
    return `${[0,1,2].map(i=>`<circle cx="${x+width*(.12+i*.18)}" cy="${y+height*.5}" r="35" fill="${[C.clay,C.ochre,C.dustyBlue][i]}"/>`).join('')}${line(x+width*.12,y+height*.5,x+width*.73,y+height*.5,C.sage)}<path d="M ${x+width*.73} ${y+height*.25} L ${x+width*.98} ${y+height*.5} L ${x+width*.73} ${y+height*.75} Z" fill="${C.sageWash}" stroke="${C.moss}" stroke-opacity=".2"/><circle cx="${x+width*.68}" cy="${y+height*.5}" r="72" fill="${C.paper}" stroke="${C.terracotta}" stroke-width="15"/><rect x="${x+width*.63}" y="${y+height*.45}" width="${width*.1}" height="${height*.1}" rx="10" fill="${C.terracotta}"/>`;
  }
  if (format === 'practical-principle') {
    return `${card(x,y,width,height,C.sageWash)}<circle cx="${x+width*.16}" cy="${y+height*.5}" r="64" fill="${C.eucalyptus}"/><path d="M ${x+width*.12} ${y+height*.5} l 28 28 58 -72" fill="none" stroke="${C.paper}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>${[0,1,2].map(i=>`<rect x="${x+width*.3}" y="${y+height*(.28+i*.2)}" width="${width*(.5-i*.07)}" height="20" rx="10" fill="${C.moss}" opacity="${.28-i*.05}"/>`).join('')}`;
  }
  if (format === 'workflow-cards') {
    return [0,1,2].map(i=>`${card(x+i*width*.19,y+i*height*.13,width*.62,height*.55,[C.paper,C.sageWash,C.paper][i])}<circle cx="${x+i*width*.19+48}" cy="${y+i*height*.13+48}" r="17" fill="${[C.clay,C.ochre,C.eucalyptus][i]}"/><rect x="${x+i*width*.19+82}" y="${y+i*height*.13+38}" width="${width*.34}" height="18" rx="9" fill="${C.moss}" opacity=".2"/>`).join('');
  }
  return `${card(x,y,width,height,C.paper)}${[.16,.32,.48,.64,.8].map((v,i)=>`<rect x="${x+width*(.09+i*.175)}" y="${y+height*(.78-[.28,.52,.4,.7,.58][i])}" width="${width*.09}" height="${height*[.28,.52,.4,.7,.58][i]}" rx="12" fill="${[C.clay,C.ochre,C.dustyBlue,C.eucalyptus,C.sage][i]}"/>`).join('')}`;
}

function creativeSvg(brief, width, height, kind, backgroundDataUri = '') {
  const portrait = height > width;
  const padding = portrait ? 78 : 74;
  const headlineSize = portrait ? 82 : 64;
  const headlineWidth = portrait ? 18 : 25;
  const headlineLines = wrap(brief.selected_headline, headlineWidth, portrait ? 4 : 3);
  const visualY = portrait ? 500 : 205;
  const visualHeight = portrait ? 560 : 270;
  const visualWidth = portrait ? width - padding*2 : width*.46;
  const visualX = portrait ? padding : width*.5;
  const textY = portrait ? 205 : 175;
  const disclosureY = height - (portrait ? 70 : 42);
  if (backgroundDataUri) {
    const photoHeadlineSize = portrait ? 86 : 58;
    const photoHeadlineWidth = portrait ? 19 : 25;
    const photoHeadlineLines = wrap(brief.selected_headline, photoHeadlineWidth, portrait ? 3 : 3);
    const photoTextY = portrait ? 178 : 166;
    const footerHeight = portrait ? 92 : 64;
    const overlay = portrait
      ? `<linearGradient id="photo-wash" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${C.oat}" stop-opacity=".98"/><stop offset=".34" stop-color="${C.oat}" stop-opacity=".9"/><stop offset=".58" stop-color="${C.oat}" stop-opacity="0"/></linearGradient>`
      : `<linearGradient id="photo-wash" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${C.oat}" stop-opacity=".98"/><stop offset=".48" stop-color="${C.oat}" stop-opacity=".9"/><stop offset=".72" stop-color="${C.oat}" stop-opacity="0"/></linearGradient>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>${overlay}</defs>
      <image href="${backgroundDataUri}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
      <rect width="${width}" height="${height - footerHeight}" fill="url(#photo-wash)"/>
      <text x="${padding}" y="${portrait ? 70 : 54}" fill="${C.moss}" font-family="DM Sans,Arial,sans-serif" font-size="${portrait ? 24 : 18}" font-weight="700" letter-spacing="3">${BRAND}</text>
      <rect x="${padding}" y="${portrait ? 102 : 76}" width="210" height="6" rx="3" fill="${C.eucalyptus}"/>
      ${textBlock(photoHeadlineLines,padding,photoTextY,photoHeadlineSize,photoHeadlineSize*.96,C.ink,650)}
      <rect y="${height-footerHeight}" width="${width}" height="${footerHeight}" fill="${C.moss}" fill-opacity=".96"/>
      <text x="${padding}" y="${height-(portrait?34:24)}" fill="${C.paper}" font-family="Manrope,Arial,sans-serif" font-size="${portrait?22:17}" font-weight="600">${DISCLOSURE}</text>
    </svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="wash" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${C.oat}"/><stop offset="1" stop-color="${C.sageWash}"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="28" flood-color="${C.moss}" flood-opacity=".12"/></filter></defs>
    <rect width="${width}" height="${height}" fill="url(#wash)"/>
    ${backgroundDataUri ? `<image href="${backgroundDataUri}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity=".16"/><rect width="${width}" height="${height}" fill="${C.oat}" opacity=".67"/>` : ''}
    <circle cx="${width*.88}" cy="${height*.12}" r="${Math.min(width,height)*.18}" fill="${C.ochre}" opacity=".12"/>
    <circle cx="${width*.08}" cy="${height*.82}" r="${Math.min(width,height)*.2}" fill="${C.clay}" opacity=".10"/>
    <text x="${padding}" y="${portrait?80:56}" fill="${C.moss}" font-family="DM Sans,Arial,sans-serif" font-size="${portrait?25:20}" font-weight="700" letter-spacing="3">${BRAND}</text>
    <rect x="${padding}" y="${portrait?116:80}" width="68" height="7" rx="4" fill="${C.terracotta}"/><rect x="${padding+76}" y="${portrait?116:80}" width="68" height="7" rx="4" fill="${C.ochre}"/><rect x="${padding+152}" y="${portrait?116:80}" width="68" height="7" rx="4" fill="${C.eucalyptus}"/>
    ${textBlock(headlineLines,padding,textY,headlineSize,headlineSize*.98,C.ink,600)}
    <g filter="url(#shadow)">${visual(brief.visual_format,visualX,visualY,visualWidth,visualHeight,brief.campaign_day)}</g>
    <rect x="${padding}" y="${disclosureY-34}" width="${width-padding*2}" height="1" fill="${C.moss}" opacity=".2"/>
    <text x="${padding}" y="${disclosureY}" fill="${C.moss}" font-family="Manrope,Arial,sans-serif" font-size="${portrait?22:17}" font-weight="600">${DISCLOSURE}</text>
  </svg>`;
}

async function renderVariant(brief, outputBase, width, height, kind, background) {
  const dataUri = background ? `data:image/png;base64,${background.toString('base64')}` : '';
  const svg = creativeSvg(brief,width,height,kind,dataUri).replace(/[ \t]+$/gm,'');
  await writeText(`${outputBase}.svg`, svg);
  const source = sharp(Buffer.from(svg));
  await source.clone().png({ compressionLevel:9 }).toFile(`${outputBase}.png`);
  await source.clone().webp({ quality:84 }).toFile(`${outputBase}.webp`);
  return { png:`${outputBase}.png`, webp:`${outputBase}.webp`, svg:`${outputBase}.svg`, width, height };
}

export async function renderCreativePackage(brief, directory, imageProvider) {
  await ensureDir(directory);
  const background = await imageProvider.generateBackground(brief.image_generation_prompt);
  const instagram = await renderVariant(brief,path.join(directory,'instagram'),1080,1350,'instagram',background);
  const hero = await renderVariant(brief,path.join(directory,'hero'),1600,900,'hero',background);
  const og = await renderVariant(brief,path.join(directory,'og'),1200,630,'og',background);
  for (const variant of [instagram,hero,og]) {
    for (const key of ['png','webp','svg']) variant[key] = path.relative(ROOT,variant[key]);
  }
  const manifest = { content_id:brief.content_id, disclosure:DISCLOSURE, brand:BRAND, alt_text:`Run Lighter ${brief.visual_format.replaceAll('-',' ')} illustrating ${brief.topic}.`, background_provider:imageProvider.name, variants:{instagram,hero,og} };
  await writeJson(path.join(directory,'creative-manifest.json'), manifest);
  return manifest;
}

export async function inspectCreative(manifest) {
  const results = [];
  for (const [name, variant] of Object.entries(manifest.variants)) {
    const metadata = await sharp(path.join(ROOT,variant.png)).metadata();
    results.push({ name, width:metadata.width, height:metadata.height, expected_width:variant.width, expected_height:variant.height, valid:metadata.width===variant.width&&metadata.height===variant.height });
  }
  return results;
}
