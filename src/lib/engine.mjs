import path from 'node:path';
import { readFile, rename, cp } from 'node:fs/promises';
import { DISCLOSURE, AUTHOR } from './constants.mjs';
import { addDays, ensureDir, exists, formatAuDate, fromRoot, readJson, sha256, slugify, wordCount, writeJson, writeText, zonedParts } from './utils.mjs';
import { loadRegistry, saveRegistry, findByDate, upsertRegistry } from './registry.mjs';
import { selectTopic } from './topic-engine.mjs';
import { createBrief } from './brief.mjs';
import { getResearchProvider, researchAudit } from './providers/research.mjs';
import { getTextProvider, promptAudit } from './providers/text.mjs';
import { getImageProvider } from './providers/image.mjs';
import { renderCreativePackage } from './creative.mjs';
import { validateContentFile, assertValid } from './validation.mjs';
import { scorePromotion } from './promotion.mjs';
import { withRetry } from './retry.mjs';

export const contentPath = slug => fromRoot('_content','blog',`${slug}.json`);
export const briefPath = date => fromRoot('data','daily-briefs',`${date}.json`);
export const queuePath = date => fromRoot('data','publish-queue',`${date}.json`);
export const logPath = date => fromRoot('logs','content',`${date}.json`);

function entryFrom(content, brief, status, now = new Date()) {
  return {
    content_id:content.content_id,date:content.date,campaign_day:content.campaign_day,topic:brief.topic,angle:brief.angle,
    headline:content.title,hook:brief.selected_hook,visual_format:brief.visual_format,keywords:brief.secondary_keywords,
    source_urls:content.source_urls,article_slug:content.slug,image_path:content.hero_image,
    caption_hash:sha256(content.instagram_caption),article_hash:sha256(content.article_markdown),status,
    website_url:content.status==='published'?content.canonical_url:'',instagram_media_id:content.instagram_media_id||'',
    promotion_score:content.promotion_score||0,created_at:content.created_at||now.toISOString(),published_at:content.published_at||'',error:null
  };
}

function logSkeleton(date, contentId) {
  return { content_id:contentId,date,local_timezone:'Australia/Sydney',stage_started_at:'',stage_completed_at:'',publish_started_at:'',publish_completed_at:'',candidate_topics:[],selected_topic:{},sources:[],generation_models:{},validation_results:[],website:{},instagram:{},promotion:{},status:'generated',errors:[] };
}

export async function generateDay(config, date, campaignDay, { stage = false, force = false } = {}) {
  const registry = await loadRegistry();
  const existing = findByDate(registry,date);
  if (existing && !force) {
    const content = await readJson(contentPath(existing.article_slug));
    const brief=await readJson(briefPath(date));
    if (stage && existing.status==='generated') {
      const validation=await validateContentFile(content,brief,config,registry);assertValid(validation);
      existing.status='staged';existing.error=null;await saveRegistry(registry);
      const queue=await readJson(queuePath(date));queue.status='staged';queue.validated=true;queue.last_error=null;await writeJson(queuePath(date),queue);
      const audit=await readJson(logPath(date));audit.stage_started_at=new Date().toISOString();audit.stage_completed_at=new Date().toISOString();audit.validation_results=validation.checks;audit.status='staged';await writeJson(logPath(date),audit);
      return {content,brief,registry,validation,idempotent:false,staged_existing:true};
    }
    return { content, brief, registry, idempotent:true };
  }
  if (config.killSwitch) throw new Error('Campaign kill switch is enabled');
  const researchProvider = getResearchProvider(config);
  const research = await withRetry(()=>researchProvider.research(date),{retries:config.maxRetries,shouldRetry:()=>true});
  const topicSelection = selectTopic(date,registry,config.topicSimilarityThreshold,research.candidates||[]);
  const sourceUrls = topicSelection.selected.source_urls || [];
  const brief = createBrief(date,campaignDay,topicSelection.selected,sourceUrls);
  await writeJson(briefPath(date),brief);
  const textProvider = getTextProvider(config);
  const text = await withRetry(()=>textProvider.generate(brief),{retries:config.maxRetries});
  const imageProvider = getImageProvider(config);
  const assetDirectory = fromRoot('generated','drafts',date);
  const creative = await withRetry(()=>renderCreativePackage(brief,assetDirectory,imageProvider),{retries:config.maxRetries});
  const slug = slugify(brief.selected_headline);
  const now = new Date();
  const content = {
    title:brief.selected_headline,slug,date,updated:date,status:'draft',excerpt:text.excerpt,description:text.description,
    author:AUTHOR,tags:brief.secondary_keywords.slice(0,5),category:'Practical automation',
    hero_image:`/generated/drafts/${date}/hero.webp`,hero_image_fallback:`/generated/drafts/${date}/hero.png`,
    hero_image_alt:text.hero_image_alt,og_image:`/generated/drafts/${date}/og.png`,instagram_image:`/generated/drafts/${date}/instagram.png`,
    instagram_caption:text.caption,instagram_media_id:'',source_urls:sourceUrls,
    automation_disclosure:DISCLOSURE,promotion_score:0,promotion_candidate:false,promotion_reason:'',
    suggested_paid_audience:text.suggested_paid_audience,suggested_ad_primary_text:text.suggested_ad_primary_text,suggested_ad_headline:text.suggested_ad_headline,
    campaign_day:campaignDay,content_id:brief.content_id,canonical_url:`${config.siteUrl}/blog/${slug}/`,reading_time:Math.max(1,Math.ceil(wordCount(text.article_markdown)/220)),
    seo_title:text.seo_title,meta_description:text.meta_description,primary_keyword:text.primary_keyword,secondary_keywords:text.secondary_keywords,
    article_markdown:text.article_markdown,creative,is_topical:sourceUrls.length>0,created_at:now.toISOString(),published_at:'',updated_at:now.toISOString()
  };
  const preliminary = await validateContentFile(content,brief,config,registry);
  const promotion = scorePromotion(brief,preliminary,config.promotionThreshold);
  Object.assign(content,promotion);
  const validation = await validateContentFile(content,brief,config,registry);
  const status = validation.passed ? (stage?'staged':'generated') : 'failed';
  await writeJson(contentPath(slug),content);
  await writeJson(queuePath(date),{ content_id:content.content_id,date,slug,status:validation.passed?'staged':'failed',validated:validation.passed,scheduled_publish_time:config.publishTime,website_published:false,instagram_published:false,attempts:{website:0,instagram:0},last_error:null });
  const audit = logSkeleton(date,content.content_id);
  audit.candidate_topics = topicSelection.shortlist;
  audit.selected_topic = topicSelection.selected;
  audit.sources = sourceUrls.map(url=>({url,accessed_at:now.toISOString()}));
  audit.generation_models = { text:promptAudit(brief,textProvider),image:{provider:imageProvider.name,model:imageProvider.model},research:researchAudit(researchProvider,research) };
  audit.validation_results = validation.checks;
  audit.promotion = promotion;
  audit.status = status;
  if (stage) { audit.stage_started_at=now.toISOString(); audit.stage_completed_at=new Date().toISOString(); }
  if (!validation.passed) audit.errors.push({type:'validation',message:'Critical validation failed; content was not staged.'});
  await writeJson(logPath(date),audit);
  upsertRegistry(registry,entryFrom(content,brief,status,now));
  await saveRegistry(registry);
  if (!validation.passed) assertValid(validation);
  return { content,brief,registry,validation,audit,idempotent:false };
}

export async function validateDay(config,date) {
  const registry = await loadRegistry();
  const entry = findByDate(registry,date);
  if (!entry) throw new Error(`No content registered for ${date}`);
  const content = await readJson(contentPath(entry.article_slug));
  const brief = await readJson(briefPath(date));
  return validateContentFile(content,brief,config,registry);
}

async function movePublishedAssets(content) {
  const source = fromRoot('generated','drafts',content.date);
  const destination = fromRoot('generated',content.date);
  if (await exists(source) && !await exists(destination)) await rename(source,destination);
  const replace = value => value?.replace(`/generated/drafts/${content.date}/`,`/generated/${content.date}/`);
  content.hero_image=replace(content.hero_image);content.hero_image_fallback=replace(content.hero_image_fallback);content.og_image=replace(content.og_image);content.instagram_image=replace(content.instagram_image);
  for (const variant of Object.values(content.creative.variants)) for (const key of ['png','webp','svg']) variant[key]=variant[key].replace(`generated/drafts/${content.date}/`,`generated/${content.date}/`);
}

export async function markWebsitePublished(config,date,{simulate=false}={}) {
  const registry = await loadRegistry();
  const entry = findByDate(registry,date);
  if (!entry) throw new Error(`No content registered for ${date}`);
  if (entry.status==='published' && entry.website_url) return { idempotent:true,entry };
  if (!['staged','generated','failed'].includes(entry.status)) throw new Error(`Content is not publishable from status ${entry.status}`);
  const validation = await validateDay(config,date); assertValid(validation);
  const content = await readJson(contentPath(entry.article_slug));
  await movePublishedAssets(content);
  content.status='published';content.published_at=new Date().toISOString();content.updated_at=content.published_at;
  await writeJson(contentPath(content.slug),content);
  entry.status='published';entry.website_url=content.canonical_url;entry.published_at=content.published_at;entry.image_path=content.hero_image;
  await saveRegistry(registry);
  const queue = await readJson(queuePath(date)); queue.website_published=true;queue.status='website-published';await writeJson(queuePath(date),queue);
  return { content,entry,idempotent:false,simulate };
}

export async function recordInstagramResult(date,result) {
  const registry=await loadRegistry();const entry=findByDate(registry,date);if(!entry)throw new Error(`No content registered for ${date}`);
  const content=await readJson(contentPath(entry.article_slug));content.instagram_media_id=result.media_id;await writeJson(contentPath(content.slug),content);
  entry.instagram_media_id=result.media_id;await saveRegistry(registry);
  const queue=await readJson(queuePath(date));queue.instagram_published=true;queue.instagram_media_id=result.media_id;queue.status='published';await writeJson(queuePath(date),queue);
  return {content,entry,queue};
}

export async function campaignSummary(config) {
  const registry=await loadRegistry();const entries=registry.entries;
  const completed=entries.filter(e=>e.status==='published').length;
  return { campaign_days:config.campaignDays,days_completed:completed,days_remaining:Math.max(0,config.campaignDays-completed),published_articles:entries.filter(e=>e.website_url).length,published_instagram_posts:entries.filter(e=>e.instagram_media_id).length,failed_items:entries.filter(e=>e.status==='failed').length,promotion_candidates:entries.filter(e=>e.promotion_score>=config.promotionThreshold).length,topic_distribution:Object.fromEntries(entries.map(e=>[e.topic,(entries.filter(x=>x.topic===e.topic)).length])),visual_format_distribution:Object.fromEntries(entries.map(e=>[e.visual_format,(entries.filter(x=>x.visual_format===e.visual_format)).length])),duplicate_prevention_events:entries.filter(e=>e.error?.includes('duplicate')).length };
}
