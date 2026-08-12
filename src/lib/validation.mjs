import path from 'node:path';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
import { DISCLOSURE } from './constants.mjs';
import { fromRoot, readJson, wordCount, exists, zonedParts } from './utils.mjs';
import { normalise, similarity } from './topic-engine.mjs';

const prohibited = [
  /replace (?:your|the) staff/i,
  /eliminate (?:your|the) team/i,
  /guarantee(?:d)? results?/i,
  /lorem ipsum/i,
  /\bTODO\b/i,
  /glowing brain/i,
  /humanoid robot/i,
  /—/
];
const usSpellings = [/\boptimize\b/i,/\borganization\b/i,/\bbehavior\b/i,/\bcolor\b/i,/\bcenter\b/i];

const result = (name, pass, detail, critical = true) => ({ name, pass:Boolean(pass), critical, detail });

export function validateDisclosure(value, location) {
  const count = String(value).split(DISCLOSURE).length - 1;
  return result(`disclosure:${location}`,count===1,`Expected exact disclosure once, found ${count}`);
}

export function publicationFreshnessChecks(content, runDate, timeZone = 'Australia/Sydney') {
  const createdAt = content.creative?.created_at;
  const createdRunDate = createdAt ? zonedParts(new Date(createdAt),timeZone).date : '';
  const ownerApprovedPreparedAsset = content.creative?.owner_approved_prepared_asset === true
    && content.creative?.owner_approved_for_content_id === content.content_id
    && Boolean(content.creative?.owner_approved_at)
    && Boolean(content.creative?.source_asset_sha256);
  return [
    result('daily-package-date',content.date===runDate,`Content date ${content.date||'missing'} must match run date ${runDate}`),
    result('creative-run-date',content.creative?.run_date===runDate,`Creative run date ${content.creative?.run_date||'missing'} must match ${runDate}`),
    result('creative-created-today',createdRunDate===runDate||ownerApprovedPreparedAsset,ownerApprovedPreparedAsset
      ? `Owner approved the exact hashed prepared asset for ${content.content_id}`
      : `Creative creation date ${createdRunDate||'missing'} must match ${runDate}`),
    result('creative-not-reused',content.creative?.reused_generated_asset===false,'Daily packages cannot silently reuse an earlier generated asset')
  ];
}

export function assertFreshCreativeForPublication(content, runDate, timeZone = 'Australia/Sydney') {
  const failures = publicationFreshnessChecks(content,runDate,timeZone).filter(check=>!check.pass);
  if (failures.length) throw new Error(`Fresh creative required for daily publication:\n${failures.map(check=>`${check.name}: ${check.detail}`).join('\n')}`);
}

export function validatePackageContent(content, brief, config, registry) {
  const checks = [];
  checks.push(validateDisclosure(content.instagram_caption,'caption'));
  checks.push(validateDisclosure(content.article_markdown,'article'));
  checks.push(result('creative-disclosure-metadata',content.creative?.disclosure===DISCLOSURE,'Creative manifest contains exact disclosure'));
  checks.push(result('creative-run-date-recorded',content.creative?.run_date===content.date,`Creative run date ${content.creative?.run_date||'missing'} matches content date ${content.date}`));
  checks.push(result('creative-created-at-recorded',Boolean(content.creative?.created_at&&!Number.isNaN(new Date(content.creative.created_at).valueOf())),'Creative creation timestamp is recorded'));
  checks.push(result('creative-reuse-declared',typeof content.creative?.reused_generated_asset==='boolean','Creative manifest declares whether a generated asset was reused'));
  checks.push(result('caption-length',wordCount(content.instagram_caption)>=config.captionMinWords&&wordCount(content.instagram_caption)<=config.captionMaxWords,`Caption is ${wordCount(content.instagram_caption)} words`));
  checks.push(result('article-length',wordCount(content.article_markdown)>=config.articleMinWords&&wordCount(content.article_markdown)<=config.articleMaxWords,`Article is ${wordCount(content.article_markdown)} words`));
  checks.push(result('single-h1',(content.article_markdown.match(/^# /gm)||[]).length===1,'Article must contain exactly one H1'));
  checks.push(result('creative-copy-seven-words',wordCount(brief.overlay_copy?.[0]||'')<=7,`Creative headline is ${wordCount(brief.overlay_copy?.[0]||'')} words; maximum 7`));
  if (brief.search_question) {
    const firstWords = content.article_markdown.split(/\s+/).slice(0, 90).join(' ');
    checks.push(result('search-question-h1',content.article_markdown.startsWith(`# ${brief.search_question}`),'Search question is the article H1'));
    checks.push(result('answer-first',firstWords.includes(brief.direct_answer),'Direct answer appears near the start of the article'));
    checks.push(result('search-intent',Boolean(brief.search_intent&&brief.buyer_stage),'Search intent and buyer stage are recorded'));
  }
  checks.push(result('cta',/book an on-site automation review/i.test(content.article_markdown)||/on-site automation review/i.test(content.instagram_caption),'A clear review CTA is present'));
  checks.push(result('slug',/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.slug),'Slug is clean'));
  checks.push(result('source-requirement',!content.is_topical||content.source_urls.length>0,'Topical content must include sources'));
  const combined = `${content.title}\n${content.instagram_caption}\n${content.article_markdown}`;
  for (const pattern of prohibited) checks.push(result(`prohibited:${pattern.source}`,!pattern.test(combined),`Pattern ${pattern} must not appear`));
  for (const pattern of usSpellings) checks.push(result(`australian-english:${pattern.source}`,!pattern.test(combined),`Use Australian English instead of ${pattern}`));
  const other = registry.entries.filter(entry=>entry.content_id!==content.content_id);
  checks.push(result('unique-slug',!other.some(entry=>entry.article_slug===content.slug),'Article slug is unique'));
  checks.push(result('unique-title',!other.some(entry=>normalise(entry.headline)===normalise(content.title)),'Article title is unique'));
  const maxSimilarity = other.slice(-90).reduce((maximum,entry)=>Math.max(maximum,similarity({headline:content.title,topic:brief.topic,angle:brief.angle,keywords:brief.secondary_keywords},entry)),0);
  checks.push(result('topic-similarity',maxSimilarity<config.topicSimilarityThreshold,`Maximum recent similarity is ${maxSimilarity.toFixed(3)}`));
  return checks;
}

export async function validateImages(content) {
  const checks = [];
  const expected = { instagram:[1080,1350], hero:[1600,900], og:[1200,630] };
  for (const [name,[width,height]] of Object.entries(expected)) {
    const asset = content.creative.variants[name];
    const pngPath = path.isAbsolute(asset.png) ? asset.png : fromRoot(asset.png);
    const svgPath = path.isAbsolute(asset.svg) ? asset.svg : fromRoot(asset.svg);
    checks.push(result(`image-exists:${name}`,await exists(pngPath),`${asset.png} exists`));
    if (await exists(pngPath)) {
      const metadata = await sharp(pngPath).metadata();
      checks.push(result(`image-dimensions:${name}`,metadata.width===width&&metadata.height===height,`${metadata.width}x${metadata.height}; expected ${width}x${height}`));
    }
    const svg = await readFile(svgPath,'utf8');
    checks.push(validateDisclosure(svg,`creative-${name}`));
    checks.push(result(`brand:${name}`,svg.includes('RUN / LIGHTER'),'Run Lighter brand mark is present'));
  }
  return checks;
}

export async function validateContentFile(content, brief, config, registry) {
  const checks = [...validatePackageContent(content,brief,config,registry),...await validateImages(content)];
  return { passed:checks.every(check=>!check.critical||check.pass), checks };
}

export function assertValid(validation) {
  if (!validation.passed) {
    const failures = validation.checks.filter(check=>check.critical&&!check.pass).map(check=>`${check.name}: ${check.detail}`);
    throw new Error(`Validation failed closed:\n${failures.join('\n')}`);
  }
}
