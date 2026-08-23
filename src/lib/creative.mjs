import path from 'node:path';
import sharp from 'sharp';
import { BRAND, BRAND_COLOURS as C, DISCLOSURE } from './constants.mjs';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { ensureDir, exists, fromRoot, writeJson, writeText, ROOT } from './utils.mjs';

const logoDataUri = variant => `data:image/svg+xml;base64,${Buffer.from(readFileSync(fromRoot('assets','brand','logo',`runlighter-logo-${variant}.svg`))).toString('base64')}`;
const LOGO_PRIMARY_URI = logoDataUri('primary');
const LOGO_REVERSE_URI = logoDataUri('reverse');

function logoMark(x, y, width, variant = 'primary', anchor = 'start') {
  const height = width * 1080 / 1600;
  const left = anchor === 'end' ? x - width : x;
  const uri = variant === 'reverse' ? LOGO_REVERSE_URI : LOGO_PRIMARY_URI;
  return `<image data-brand="runlighter-logo" data-watermark="scheduled-top-left" href="${uri}" x="${left}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMinYMin meet"/>`;
}

function logoVariantFor(colour) {
  const hex = String(colour).replace('#','');
  if (hex.length !== 6) return 'primary';
  const [r,g,b] = [0,2,4].map(index => Number.parseInt(hex.slice(index,index+2),16));
  return (r*.2126 + g*.7152 + b*.0722) / 255 > .58 ? 'reverse' : 'primary';
}

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

const SEARCH_VISUAL_INDEX = {
  'Which business process should I automate first?':0,
  'How much does business automation cost in Sydney?':1,
  'How do I automate lead follow-up without sounding robotic?':2,
  'What can AI automate in a small service business?':3,
  'Can automation work with the software my business already uses?':4,
  'How do I choose an AI automation consultant in Sydney?':5,
  'Will business automation replace my staff?':6
};

function searchVisual(question, x, y, width, height, palette) {
  const index = SEARCH_VISUAL_INDEX[question] ?? 0;
  const card = (cx,cy,cw,ch,fill=palette.paper,stroke=palette.ink,rx=28) => `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
  const connector = (x1,y1,x2,y2,colour=palette.ink,widthValue=10) => `<path d="M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}" fill="none" stroke="${colour}" stroke-width="${widthValue}" stroke-linecap="round"/>`;
  if (index === 0) {
    const rows = 5, cols = 6, cw = width/cols, ch = height/rows;
    const walls = [];
    for (let row=0; row<rows; row+=1) for (let col=0; col<cols; col+=1) {
      if ((row+col)%3!==0) walls.push(`<path d="M ${x+col*cw} ${y+row*ch} h ${cw*.72}" stroke="${palette.paper}" stroke-width="18" stroke-linecap="round" opacity=".28"/>`);
    }
    return `<g>${walls.join('')}<path d="M ${x+cw*.2} ${y+ch*.35} H ${x+cw*2.55} V ${y+ch*2.4} H ${x+cw*4.6} V ${y+ch*4.55} H ${x+width-cw*.2}" fill="none" stroke="${palette.accent}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x+cw*.2}" cy="${y+ch*.35}" r="34" fill="${palette.paper}"/><circle cx="${x+width-cw*.2}" cy="${y+ch*4.55}" r="44" fill="${palette.accent}" stroke="${palette.paper}" stroke-width="12"/></g>`;
  }
  if (index === 1) {
    const centre=x+width*.5, pivotY=y+height*.44;
    return `<g><path d="M ${centre} ${y+height*.08} V ${y+height*.8}" stroke="${palette.ink}" stroke-width="24" stroke-linecap="round"/><path d="M ${x+width*.16} ${pivotY} Q ${centre} ${pivotY-height*.14} ${x+width*.84} ${pivotY}" fill="none" stroke="${palette.ink}" stroke-width="24" stroke-linecap="round"/><circle cx="${centre}" cy="${pivotY}" r="34" fill="${palette.accent}"/><path d="M ${x+width*.22} ${pivotY+12} L ${x+width*.12} ${y+height*.72} H ${x+width*.38} Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="6"/><path d="M ${x+width*.78} ${pivotY+12} L ${x+width*.62} ${y+height*.64} H ${x+width*.94} Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="6"/><rect x="${x+width*.17}" y="${y+height*.57}" width="${width*.1}" height="${height*.08}" rx="12" fill="${palette.accent}"/><rect x="${x+width*.69}" y="${y+height*.48}" width="${width*.18}" height="${height*.06}" rx="12" fill="${palette.ink}"/><rect x="${x+width*.65}" y="${y+height*.56}" width="${width*.26}" height="${height*.06}" rx="12" fill="${palette.ink}" opacity=".72"/><rect x="${centre-width*.18}" y="${y+height*.8}" width="${width*.36}" height="${height*.08}" rx="22" fill="${palette.ink}"/></g>`;
  }
  if (index === 2) {
    return `<g>${card(x,y+height*.08,width*.7,height*.42,palette.paper,palette.ink,48)}<path d="M ${x+width*.18} ${y+height*.5} l ${-width*.08} ${height*.13} l ${width*.2} ${-height*.1} Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="3"/><path d="M ${x+width*.12} ${y+height*.25} C ${x+width*.24} ${y+height*.12}, ${x+width*.38} ${y+height*.39}, ${x+width*.56} ${y+height*.2}" fill="none" stroke="${palette.accent}" stroke-width="20" stroke-linecap="round"/><circle cx="${x+width*.82}" cy="${y+height*.58}" r="${height*.18}" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="8"/><path d="M ${x+width*.76} ${y+height*.58} l ${width*.04} ${height*.04} l ${width*.09} ${-height*.12}" fill="none" stroke="${palette.paper}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M ${x+width*.42} ${y+height*.7} C ${x+width*.53} ${y+height*.58}, ${x+width*.62} ${y+height*.76}, ${x+width*.72} ${y+height*.68}" fill="none" stroke="${palette.ink}" stroke-width="12" stroke-linecap="round"/></g>`;
  }
  if (index === 3) {
    const colours=[palette.accent,palette.paper,palette.secondary,palette.paper,palette.accent];
    return `<g><path d="M ${x+width*.08} ${y+height*.18} H ${x+width*.62} L ${x+width*.86} ${y+height*.5} L ${x+width*.62} ${y+height*.82} H ${x+width*.08} Z" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="7"/>${[0,1,2,3,4].map((item)=>`<rect x="${x+width*(.12+item*.1)}" y="${y+height*(.28+(item%2)*.22)}" width="${width*.075}" height="${height*.18}" rx="16" fill="${colours[item]}" stroke="${palette.ink}" stroke-width="4"/>`).join('')}<circle cx="${x+width*.89}" cy="${y+height*.5}" r="${height*.11}" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="8"/><path d="M ${x+width*.86} ${y+height*.5} l ${width*.025} ${height*.025} l ${width*.06} ${-height*.08}" fill="none" stroke="${palette.paper}" stroke-width="13" stroke-linecap="round"/></g>`;
  }
  if (index === 4) {
    const positions=[[.08,.18],[.64,.12],[.1,.67],[.66,.64]];
    return `<g>${positions.map(([px,py],item)=>`${card(x+width*px,y+height*py,width*.26,height*.22,item%2?palette.secondary:palette.paper,palette.ink,30)}<circle cx="${x+width*(px+.13)}" cy="${y+height*(py+.11)}" r="24" fill="${item===3?palette.accent:palette.ink}" opacity="${item===3?1:.82}"/>`).join('')}${connector(x+width*.34,y+height*.29,x+width*.64,y+height*.23,palette.accent,18)}${connector(x+width*.23,y+height*.4,x+width*.23,y+height*.67,palette.accent,18)}${connector(x+width*.77,y+height*.34,x+width*.77,y+height*.64,palette.accent,18)}${connector(x+width*.36,y+height*.78,x+width*.66,y+height*.75,palette.accent,18)}<circle cx="${x+width*.5}" cy="${y+height*.5}" r="${height*.13}" fill="${palette.ink}" stroke="${palette.paper}" stroke-width="10"/><path d="M ${x+width*.45} ${y+height*.5} h ${width*.1}" stroke="${palette.accent}" stroke-width="18" stroke-linecap="round"/></g>`;
  }
  if (index === 5) {
    const centreX=x+width*.5, centreY=y+height*.5, radius=height*.31;
    return `<g><circle cx="${centreX}" cy="${centreY}" r="${radius}" fill="${palette.paper}" stroke="${palette.ink}" stroke-width="12"/><circle cx="${centreX}" cy="${centreY}" r="${radius*.62}" fill="none" stroke="${palette.secondary}" stroke-width="7"/><path d="M ${centreX-radius*.14} ${centreY+radius*.34} L ${centreX+radius*.1} ${centreY-radius*.48} L ${centreX+radius*.28} ${centreY+radius*.28} Z" fill="${palette.accent}" stroke="${palette.ink}" stroke-width="7"/><circle cx="${centreX}" cy="${centreY}" r="28" fill="${palette.ink}"/><path d="M ${x+width*.08} ${y+height*.14} H ${x+width*.3}" stroke="${palette.accent}" stroke-width="22" stroke-linecap="round"/><path d="M ${x+width*.7} ${y+height*.86} H ${x+width*.92}" stroke="${palette.accent}" stroke-width="22" stroke-linecap="round"/></g>`;
  }
  const people=[.16,.38,.62,.84];
  return `<g><circle cx="${x+width*.5}" cy="${y+height*.52}" r="${height*.28}" fill="${palette.secondary}" opacity=".5"/><path d="M ${x+width*.5} ${y+height*.2} V ${y+height*.84} M ${x+width*.18} ${y+height*.52} H ${x+width*.82}" stroke="${palette.accent}" stroke-width="18" stroke-linecap="round" opacity=".72"/>${people.map((px,item)=>`<circle cx="${x+width*px}" cy="${y+height*(.34+(item%2)*.09)}" r="${height*.07}" fill="${item===1?palette.accent:palette.paper}" stroke="${palette.ink}" stroke-width="7"/><path d="M ${x+width*(px-.08)} ${y+height*(.74+(item%2)*.02)} Q ${x+width*px} ${y+height*.52}, ${x+width*(px+.08)} ${y+height*(.74+(item%2)*.02)}" fill="${item===1?palette.accent:palette.paper}" stroke="${palette.ink}" stroke-width="7"/>`).join('')}</g>`;
}

function searchCreativeSvg(brief, width, height) {
  const portrait = height > width;
  const index = SEARCH_VISUAL_INDEX[brief.search_question] ?? 0;
  const headline = brief.overlay_copy?.[0] || brief.social_headline || brief.selected_headline;
  const footerHeight = portrait ? 92 : 58;
  const grain = `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" seed="${index+31}"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .045 0"/></filter>`;
  const brand = (x,y,colour,size=portrait?24:18,anchor='start') => logoMark(x,y-(portrait?34:24),portrait?120:92,logoVariantFor(colour),anchor);
  const footer = (background,foreground) => `<rect y="${height-footerHeight}" width="${width}" height="${footerHeight}" fill="${background}"/><text x="${portrait?64:48}" y="${height-(portrait?34:20)}" fill="${foreground}" font-family="Manrope,Arial,sans-serif" font-size="${portrait?21:15}" font-weight="600">${DISCLOSURE}</text>`;
  const base = (background,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs>${grain}</defs><rect width="${width}" height="${height}" fill="${background}"/><rect width="${width}" height="${height}" filter="url(#grain)" opacity=".55"/>${body}</svg>`;

  if (index === 0) {
    const ink='#17352B', paper='#F4EDDF', lime='#D2E36D', rust='#B65A3A';
    const lines=wrap(headline,portrait?17:24,3);
    const cards = Array.from({length:8},(_,item)=>{
      const angle=[-12,6,-4,10,-8,4,-5,8][item];
      const cx=portrait?110+(item%3)*250:width*.55+(item%4)*150;
      const cy=portrait?520+Math.floor(item/3)*205:120+Math.floor(item/4)*230;
      return `<g transform="rotate(${angle} ${cx+105} ${cy+70})"><rect x="${cx}" y="${cy}" width="210" height="140" rx="18" fill="${paper}" stroke="${ink}" stroke-width="5"/><circle cx="${cx+38}" cy="${cy+38}" r="13" fill="${item===4?rust:ink}"/><path d="M ${cx+70} ${cy+38} H ${cx+172} M ${cx+38} ${cy+78} H ${cx+172} M ${cx+38} ${cy+108} H ${cx+132}" stroke="${ink}" stroke-width="10" stroke-linecap="round" opacity=".38"/></g>`;
    }).join('');
    const cutX=portrait?420:width*.73, cutY=portrait?710:315;
    return base(paper,`${brand(portrait?64:54,portrait?68:44,ink)}
      ${textBlock(lines,portrait?64:54,portrait?168:130,portrait?90:66,(portrait?90:66)*.92,ink,700)}
      <path d="${portrait?`M 74 468 C 120 370, 318 382, 410 478 C 506 580, 736 508, 830 632 C 920 750, 828 940, 684 974 C 520 1012, 372 910, 284 1018 C 186 1138, 74 1044, 84 916`:`M ${width*.49} 90 C ${width*.58} 28, ${width*.72} 50, ${width*.78} 138 C ${width*.87} 260, ${width*.96} 268, ${width*.94} 450 C ${width*.92} 610, ${width*.72} 638, ${width*.61} 550 C ${width*.49} 454, ${width*.43} 250, ${width*.49} 90`}" fill="${lime}" stroke="${ink}" stroke-width="7"/>
      ${cards}
      <circle cx="${cutX}" cy="${cutY}" r="${portrait?118:86}" fill="${lime}" stroke="${ink}" stroke-width="10"/>
      <path d="M ${cutX-(portrait?44:32)} ${cutY} l ${portrait?34:25} ${portrait?34:25} l ${portrait?70:50} ${portrait?-88:-63}" fill="none" stroke="${ink}" stroke-width="${portrait?25:18}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M ${cutX+(portrait?86:62)} ${cutY-(portrait?76:55)} l ${portrait?72:52} ${portrait?-54:-39}" stroke="${rust}" stroke-width="${portrait?20:14}" stroke-linecap="round"/>
      ${footer(ink,paper)}`);
  }

  if (index === 1) {
    const plum='#4C263A', cream='#F6E9D2', gold='#E0B43C', blush='#CFAAB5';
    const lines=wrap(headline,portrait?15:22,3);
    const cx=portrait?width*.5:width*.72, cy=portrait?825:height*.5, radius=portrait?285:210;
    return base(plum,`${brand(portrait?58:52,portrait?64:42,cream)}
      ${textBlock(lines,portrait?62:58,portrait?170:126,portrait?88:64,(portrait?88:64)*.92,cream,700)}
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${blush}" stroke-width="${portrait?70:50}" opacity=".45"/>
      <path d="M ${cx-radius*.88} ${cy+radius*.47} A ${radius} ${radius} 0 1 1 ${cx+radius*.93} ${cy+radius*.37}" fill="none" stroke="${gold}" stroke-width="${portrait?70:50}" stroke-linecap="round"/>
      ${Array.from({length:7},(_,item)=>{const a=(-145+item*48)*Math.PI/180;const x1=cx+Math.cos(a)*radius*.68;const y1=cy+Math.sin(a)*radius*.68;const x2=cx+Math.cos(a)*radius*.98;const y2=cy+Math.sin(a)*radius*.98;return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${cream}" stroke-width="${portrait?10:7}" stroke-linecap="round"/>`;}).join('')}
      <path d="M ${cx} ${cy} L ${cx+radius*.56} ${cy-radius*.32}" stroke="${cream}" stroke-width="${portrait?24:16}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${portrait?36:25}" fill="${gold}" stroke="${cream}" stroke-width="10"/>
      <text x="${cx}" y="${cy+radius*.18}" fill="${cream}" font-family="DM Sans,Arial,sans-serif" font-size="${portrait?140:92}" font-weight="700" text-anchor="middle">$?</text>
      <rect x="${portrait?84:width*.51}" y="${portrait?1120:height*.76}" width="${portrait?912:width*.42}" height="${portrait?80:54}" rx="${portrait?40:27}" fill="${cream}"/>
      <rect x="${portrait?92:width*.515}" y="${portrait?1128:height*.77}" width="${portrait?332:width*.15}" height="${portrait?64:42}" rx="${portrait?32:21}" fill="${gold}"/>
      ${footer(cream,plum)}`);
  }

  if (index === 2) {
    const yellow='#E3C84E', ink='#183129', white='#FFF9EC', coral='#C65F45';
    const lines=wrap(headline,portrait?17:25,3);
    const bubble=(x,y,w,h,fill,tail='left')=>`<path d="M ${x+32} ${y} H ${x+w-32} Q ${x+w} ${y} ${x+w} ${y+32} V ${y+h-32} Q ${x+w} ${y+h} ${x+w-32} ${y+h} H ${x+(tail==='left'?94:32)} L ${x+(tail==='left'?38:w-38)} ${y+h+56} L ${x+(tail==='left'?50:w-88)} ${y+h} H ${x+32} Q ${x} ${y+h} ${x} ${y+h-32} V ${y+32} Q ${x} ${y} ${x+32} ${y} Z" fill="${fill}" stroke="${ink}" stroke-width="7"/>`;
    return base(yellow,`${brand(portrait?58:52,portrait?66:44,ink)}
      ${textBlock(lines,portrait?58:52,portrait?165:125,portrait?86:62,(portrait?86:62)*.92,ink,700)}
      ${bubble(portrait?74:width*.53,portrait?485:100,portrait?730:width*.37,portrait?230:150,white,'left')}
      <path d="M ${portrait?142:width*.56} ${portrait?563:150} H ${portrait?690:width*.84} M ${portrait?142:width*.56} ${portrait?625:196} H ${portrait?520:width*.76}" stroke="${ink}" stroke-width="${portrait?20:14}" stroke-linecap="round" opacity=".46"/>
      ${bubble(portrait?275:width*.62,portrait?820:355,portrait?730:width*.34,portrait?230:150,ink,'right')}
      <path d="M ${portrait?350:width*.66} ${portrait?900:405} H ${portrait?890:width*.9} M ${portrait?500:width*.73} ${portrait?963:451} H ${portrait?890:width*.9}" stroke="${white}" stroke-width="${portrait?20:14}" stroke-linecap="round" opacity=".92"/>
      <circle cx="${portrait?880:width*.58}" cy="${portrait?665:320}" r="${portrait?86:58}" fill="${coral}" stroke="${ink}" stroke-width="8"/>
      <path d="M ${portrait?880:width*.58} ${portrait?618:289} V ${portrait?665:320} L ${portrait?920:width*.603} ${portrait?690:335}" fill="none" stroke="${white}" stroke-width="${portrait?18:12}" stroke-linecap="round"/>
      ${footer(ink,white)}`);
  }

  if (index === 3) {
    const rust='#B6553D', cream='#F6EAD8', ink='#1A2C25', sage='#8EA28C', yellow='#D5B84C';
    const lines=wrap(headline,portrait?15:22,3);
    const conveyorY=portrait?965:height*.67;
    const itemXs=portrait?[120,325,530,735]:[width*.52,width*.64,width*.76,width*.88];
    return base(cream,`${brand(portrait?60:54,portrait?66:44,ink)}
      ${textBlock(lines,portrait?60:54,portrait?175:135,portrait?92:68,(portrait?92:68)*.9,rust,700)}
      <path d="${portrait?'M 0 438 L 1080 300 V 688 L 0 826 Z':`M ${width*.45} 0 L ${width} 0 V ${height*.43} L ${width*.45} ${height*.67} Z`}" fill="${sage}"/>
      <path d="M ${portrait?72:width*.5} ${conveyorY} H ${portrait?1008:width*.95}" stroke="${ink}" stroke-width="${portrait?72:46}" stroke-linecap="round"/>
      ${itemXs.map((itemX,item)=>`<g transform="rotate(${[-9,6,-5,8][item]} ${itemX} ${conveyorY-150})"><rect x="${itemX-(portrait?70:48)}" y="${conveyorY-(portrait?250:170)}" width="${portrait?140:96}" height="${portrait?170:116}" rx="${portrait?22:15}" fill="${[yellow,cream,rust,ink][item]}" stroke="${ink}" stroke-width="${portrait?7:5}"/><circle cx="${itemX}" cy="${conveyorY-(portrait?208:142)}" r="${portrait?16:11}" fill="${item===3?cream:ink}"/><path d="M ${itemX-(portrait?38:26)} ${conveyorY-(portrait?156:107)} H ${itemX+(portrait?38:26)} M ${itemX-(portrait?38:26)} ${conveyorY-(portrait?120:82)} H ${itemX+(portrait?20:14)}" stroke="${item===3?cream:ink}" stroke-width="${portrait?11:7}" stroke-linecap="round" opacity=".7"/></g>`).join('')}
      ${itemXs.map(itemX=>`<circle cx="${itemX}" cy="${conveyorY}" r="${portrait?27:18}" fill="${cream}"/>`).join('')}
      <path d="M ${portrait?785:width*.82} ${portrait?520:height*.29} L ${portrait?920:width*.9} ${portrait?655:height*.44} L ${portrait?785:width*.82} ${portrait?790:height*.59}" fill="none" stroke="${yellow}" stroke-width="${portrait?34:23}" stroke-linecap="round" stroke-linejoin="round"/>
      ${footer(ink,cream)}`);
  }

  if (index === 4) {
    const mint='#C8D2B8', paper='#F7F0E2', ink='#18372C', red='#A94D38', gold='#D1AE45';
    const lines=wrap(headline,portrait?17:25,3);
    const modules=portrait?[[90,520,320,210],[670,475,310,190],[135,910,280,190],[680,900,280,210]]:[[width*.51,90,270,150],[width*.78,80,260,160],[width*.55,360,250,150],[width*.82,350,220,170]];
    return base(mint,`${brand(portrait?58:52,portrait?66:44,ink)}
      ${textBlock(lines,portrait?58:52,portrait?175:134,portrait?88:64,(portrait?88:64)*.92,ink,700)}
      <path d="${portrait?'M 250 640 C 500 640, 490 570, 825 570 M 250 640 C 250 805, 280 1000, 275 1000 M 825 570 C 825 760, 820 1005, 820 1005 M 275 1000 C 490 1000, 605 1005, 820 1005':`M ${width*.59} 165 C ${width*.68} 165, ${width*.72} 160, ${width*.83} 160 M ${width*.59} 165 C ${width*.59} 280, ${width*.63} 435, ${width*.63} 435 M ${width*.83} 160 C ${width*.83} 290, ${width*.88} 435, ${width*.88} 435 M ${width*.63} 435 H ${width*.88}`}" fill="none" stroke="${red}" stroke-width="${portrait?28:18}" stroke-linecap="round"/>
      ${modules.map(([x,y,w,h],item)=>`<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${portrait?35:25}" fill="${item===2?ink:paper}" stroke="${ink}" stroke-width="${portrait?8:5}"/><circle cx="${x+(portrait?55:38)}" cy="${y+(portrait?55:38)}" r="${portrait?18:12}" fill="${[gold,red,mint,gold][item]}"/><path d="M ${x+(portrait?95:65)} ${y+(portrait?55:38)} H ${x+w-(portrait?48:33)} M ${x+(portrait?48:33)} ${y+(portrait?115:78)} H ${x+w-(portrait?48:33)} M ${x+(portrait?48:33)} ${y+(portrait?155:106)} H ${x+w-(portrait?120:82)}" stroke="${item===2?paper:ink}" stroke-width="${portrait?13:9}" stroke-linecap="round" opacity=".48"/></g>`).join('')}
      <circle cx="${portrait?540:width*.735}" cy="${portrait?785:300}" r="${portrait?105:70}" fill="${red}" stroke="${paper}" stroke-width="${portrait?18:12}"/><path d="M ${portrait?485:width*.705} ${portrait?785:300} H ${portrait?595:width*.765}" stroke="${paper}" stroke-width="${portrait?26:17}" stroke-linecap="round"/>
      ${footer(ink,paper)}`);
  }

  if (index === 5) {
    const charcoal='#22231F', paper='#EFE5D2', gold='#C9A23D', green='#587465', coral='#B85C42';
    const lines=wrap(headline,portrait?17:25,3);
    const cx=portrait?710:width*.75, cy=portrait?785:height*.52, r=portrait?315:220;
    return base(charcoal,`${brand(portrait?58:52,portrait?66:44,paper)}
      ${textBlock(lines,portrait?60:55,portrait?175:135,portrait?88:64,(portrait?88:64)*.92,paper,700)}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${paper}" stroke="${green}" stroke-width="${portrait?38:26}"/>
      ${Array.from({length:24},(_,item)=>{const a=item*15*Math.PI/180;const inner=item%3===0?r*.72:r*.82;return `<line x1="${cx+Math.cos(a)*inner}" y1="${cy+Math.sin(a)*inner}" x2="${cx+Math.cos(a)*r*.93}" y2="${cy+Math.sin(a)*r*.93}" stroke="${charcoal}" stroke-width="${item%3===0?(portrait?13:9):(portrait?6:4)}"/>`;}).join('')}
      <path d="M ${cx-r*.13} ${cy+r*.32} L ${cx+r*.08} ${cy-r*.54} L ${cx+r*.29} ${cy+r*.26} Z" fill="${gold}" stroke="${charcoal}" stroke-width="${portrait?12:8}"/><circle cx="${cx}" cy="${cy}" r="${portrait?36:24}" fill="${charcoal}"/>
      <path d="M ${portrait?80:width*.51} ${portrait?640:height*.41} C ${portrait?230:width*.58} ${portrait?520:height*.28}, ${portrait?330:width*.64} ${portrait?510:height*.28}, ${portrait?405:width*.67} ${portrait?600:height*.38}" fill="none" stroke="${coral}" stroke-width="${portrait?30:20}" stroke-linecap="round"/>
      <path d="M ${portrait?115:width*.525} ${portrait?1015:height*.72} H ${portrait?430:width*.68}" stroke="${green}" stroke-width="${portrait?42:28}" stroke-linecap="round"/>
      ${footer(gold,charcoal)}`);
  }

  const green='#244137', cream='#F3E9D7', coral='#C16346', sage='#9EAF9A', ink='#12241D';
  const lines=wrap(headline,portrait?18:26,3);
  const people=portrait?[250,540,830]:[width*.58,width*.75,width*.91];
  return base(green,`${brand(portrait?58:52,portrait?66:44,cream)}
    ${textBlock(lines,portrait?58:52,portrait?175:135,portrait?84:62,(portrait?84:62)*.92,cream,700)}
    <path d="${portrait?'M 0 525 C 250 430, 480 590, 640 510 C 850 405, 970 455, 1080 390 V 1258 H 0 Z':`M ${width*.46} 0 C ${width*.55} ${height*.22}, ${width*.66} ${height*.15}, ${width*.76} ${height*.28} C ${width*.88} ${height*.42}, ${width*.94} ${height*.3}, ${width} ${height*.22} V ${height-footerHeight} H ${width*.46} Z`}" fill="${sage}"/>
    ${people.map((px,item)=>{const py=portrait?700+(item===1?-70:20):height*.42+(item===1?-35:15);return `<g><circle cx="${px}" cy="${py}" r="${portrait?72:48}" fill="${item===1?coral:cream}" stroke="${ink}" stroke-width="${portrait?10:7}"/><path d="M ${px-(portrait?120:80)} ${py+(portrait?255:170)} Q ${px} ${py+(portrait?70:47)}, ${px+(portrait?120:80)} ${py+(portrait?255:170)} Z" fill="${item===1?coral:cream}" stroke="${ink}" stroke-width="${portrait?10:7}"/></g>`;}).join('')}
    <path d="${portrait?'M 90 1120 H 390 C 470 1120, 470 1030, 550 1030 H 940':`M ${width*.5} ${height*.82} H ${width*.68} C ${width*.73} ${height*.82}, ${width*.73} ${height*.72}, ${width*.78} ${height*.72} H ${width*.96}`}" fill="none" stroke="${coral}" stroke-width="${portrait?34:23}" stroke-linecap="round"/>
    ${[0,1,2,3].map((item)=>`<rect x="${portrait?80+item*190:width*(.51+item*.105)}" y="${portrait?1070:height*.78}" width="${portrait?120:82}" height="${portrait?100:68}" rx="${portrait?18:12}" fill="${cream}" stroke="${ink}" stroke-width="${portrait?7:5}"/>`).join('')}
    <path d="M ${portrait?520:width*.75} ${portrait?1030:height*.72} l ${portrait?35:24} ${portrait?35:24} l ${portrait?80:54} ${portrait?-100:-68}" fill="none" stroke="${cream}" stroke-width="${portrait?24:16}" stroke-linecap="round" stroke-linejoin="round"/>
    ${footer(ink,cream)}`);
}

function firstAutomationPhotoSvg(width, height, backgroundDataUri) {
  const portrait = height > width;
  const brandX = portrait ? 64 : 58;
  const brandY = portrait ? 72 : 48;
  const tagX = portrait ? 74 : 58;
  const tagY = portrait ? 188 : 92;
  const tagWidth = portrait ? 250 : 190;
  const tagHeight = portrait ? 72 : 54;
  const headlineX = portrait ? 64 : 58;
  const headlineY = portrait ? 740 : 360;
  const headlineSize = portrait ? 108 : 72;
  const lineHeight = portrait ? 104 : 70;
  const footerY = height - (portrait ? 90 : 55);
  const gradient = portrait
    ? '<linearGradient id="editorial-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d211b" stop-opacity=".14"/><stop offset=".38" stop-color="#0d211b" stop-opacity=".42"/><stop offset=".72" stop-color="#0d211b" stop-opacity=".93"/><stop offset="1" stop-color="#0d211b"/></linearGradient>'
    : '<linearGradient id="editorial-shade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d211b" stop-opacity=".82"/><stop offset=".55" stop-color="#0d211b" stop-opacity=".5"/><stop offset="1" stop-color="#0d211b" stop-opacity=".82"/></linearGradient>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>${gradient}</defs>
    <image href="${backgroundDataUri}" width="${width}" height="${height}" preserveAspectRatio="xMinYMid slice"/>
    <rect width="${width}" height="${height}" fill="url(#editorial-shade)"/>
    ${logoMark(brandX,brandY-(portrait?38:26),portrait?126:96,'reverse')}
    <g transform="rotate(-4 ${tagX+tagWidth/2} ${tagY+tagHeight/2})">
      <rect x="${tagX}" y="${tagY}" width="${tagWidth}" height="${tagHeight}" rx="6" fill="#c96545"/>
      <text x="${tagX+tagWidth/2}" y="${tagY+tagHeight*.66}" text-anchor="middle" fill="#f5ecdc" font-family="DM Sans,Arial,sans-serif" font-size="${portrait?27:20}" font-weight="700" letter-spacing="2">START HERE</text>
      <path d="M ${tagX+tagWidth} ${tagY+tagHeight*.5} C ${tagX+tagWidth+66} ${tagY+tagHeight*.7}, ${tagX+tagWidth+96} ${tagY+tagHeight+25}, ${tagX+tagWidth+108} ${tagY+tagHeight+88}" fill="none" stroke="#c96545" stroke-width="${portrait?15:11}" stroke-linecap="round"/>
      <path d="M ${tagX+tagWidth+81} ${tagY+tagHeight+68} L ${tagX+tagWidth+110} ${tagY+tagHeight+96} L ${tagX+tagWidth+128} ${tagY+tagHeight+59}" fill="none" stroke="#c96545" stroke-width="${portrait?15:11}" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="${headlineX}" y="${headlineY}" fill="#f5ecdc" font-family="DM Sans,Arial,sans-serif" font-size="${headlineSize}" font-weight="700">
      <tspan x="${headlineX}">START WHERE</tspan>
      <tspan x="${headlineX}" dy="${lineHeight}">WORK GETS</tspan>
      <tspan x="${headlineX}" dy="${lineHeight}" fill="#d5b44b">STUCK.</tspan>
    </text>
    <line x1="${headlineX}" y1="${footerY-66}" x2="${width-headlineX}" y2="${footerY-66}" stroke="#8ba090" stroke-width="2"/>
    <text x="${headlineX}" y="${footerY}" fill="#f5ecdc" font-family="Manrope,Arial,sans-serif" font-size="${portrait?22:15}" font-weight="600">${DISCLOSURE}</text>
  </svg>`;
}

function creativeSvg(brief, width, height, kind, backgroundDataUri = '') {
  if (brief.search_question === 'Which business process should I automate first?' && backgroundDataUri) return firstAutomationPhotoSvg(width,height,backgroundDataUri);
  if (brief.search_question) return searchCreativeSvg(brief,width,height);
  const portrait = height > width;
  const padding = portrait ? 78 : 74;
  const headlineSize = portrait ? 82 : 64;
  const headlineWidth = portrait ? 18 : 25;
  const creativeHeadline = brief.overlay_copy?.[0] || brief.social_headline || brief.selected_headline;
  const headlineLines = wrap(creativeHeadline, headlineWidth, portrait ? 4 : 3);
  const visualY = portrait ? 500 : 205;
  const visualHeight = portrait ? 560 : 270;
  const visualWidth = portrait ? width - padding*2 : width*.46;
  const visualX = portrait ? padding : width*.5;
  const textY = portrait ? 205 : 175;
  const disclosureY = height - (portrait ? 70 : 42);
  if (backgroundDataUri) {
    const photoHeadlineSize = portrait ? 86 : 58;
    const photoHeadlineWidth = portrait ? 19 : 25;
    const photoHeadlineLines = wrap(creativeHeadline, photoHeadlineWidth, portrait ? 3 : 3);
    const photoTextY = portrait ? 178 : 166;
    const footerHeight = portrait ? 92 : 64;
    const overlay = portrait
      ? `<linearGradient id="photo-wash" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${C.oat}" stop-opacity=".98"/><stop offset=".34" stop-color="${C.oat}" stop-opacity=".9"/><stop offset=".58" stop-color="${C.oat}" stop-opacity="0"/></linearGradient>`
      : `<linearGradient id="photo-wash" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${C.oat}" stop-opacity=".98"/><stop offset=".48" stop-color="${C.oat}" stop-opacity=".9"/><stop offset=".72" stop-color="${C.oat}" stop-opacity="0"/></linearGradient>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>${overlay}</defs>
      <image href="${backgroundDataUri}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>
      <rect width="${width}" height="${height - footerHeight}" fill="url(#photo-wash)"/>
      ${logoMark(padding,portrait?34:24,portrait?126:96,'primary')}
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
    ${logoMark(padding,portrait?36:24,portrait?126:96,'primary')}
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
  const savedBackground = path.join(directory,'background.png');
  const hasSavedBackground = await exists(savedBackground);
  const editorialPhoto = brief.search_question === 'Which business process should I automate first?'
    ? fromRoot('assets','editorial','first-automation-source.jpg')
    : '';
  const hasEditorialPhoto = editorialPhoto && await exists(editorialPhoto);
  const background = hasEditorialPhoto
    ? await sharp(editorialPhoto).modulate({saturation:.18,brightness:.78}).tint('#657365').png().toBuffer()
    : brief.search_question
    ? null
    : hasSavedBackground
    ? await readFile(savedBackground)
    : await imageProvider.generateBackground(brief.image_generation_prompt);
  const instagram = await renderVariant(brief,path.join(directory,'instagram'),1080,1350,'instagram',background);
  const hero = await renderVariant(brief,path.join(directory,'hero'),1600,900,'hero',background);
  const og = await renderVariant(brief,path.join(directory,'og'),1200,630,'og',background);
  for (const variant of [instagram,hero,og]) {
    for (const key of ['png','webp','svg']) variant[key] = path.relative(ROOT,variant[key]);
  }
  const altText = hasEditorialPhoto
    ? 'A real office wall covered with handwritten workflow notes, with an annotation pointing to where work gets stuck.'
    : `Run Lighter ${brief.visual_format.replaceAll('-',' ')} illustrating ${brief.topic}.`;
  const sourceAssetOrigin = hasEditorialPhoto
    ? 'owned-editorial-reference'
    : brief.search_question
    ? 'new-code-native-creation'
    : hasSavedBackground
    ? 'reused-generated-background'
    : 'new-generated-background';
  const manifest = {
    content_id:brief.content_id,
    run_date:brief.date,
    created_at:new Date().toISOString(),
    disclosure:DISCLOSURE,
    brand:BRAND,
    alt_text:altText,
    background_provider:hasEditorialPhoto?'licensed-editorial-photo':brief.search_question?'code-native-editorial':hasSavedBackground?'built-in-imagegen':imageProvider.name,
    source_asset_origin:sourceAssetOrigin,
    reused_generated_asset:hasSavedBackground,
    watermark_asset:'assets/brand/social/runlighter-watermark-overlay-1080x1350.png',
    watermark_position:'top-left',
    watermark_background:'transparent',
    variants:{instagram,hero,og}
  };
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
