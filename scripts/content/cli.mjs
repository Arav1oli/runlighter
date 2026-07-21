#!/usr/bin/env node
import path from 'node:path';
import { appendFile, readFile } from 'node:fs/promises';
import { loadConfig, assertLiveConfiguration } from '../../src/lib/config.mjs';
import { addDays, fromRoot, inExecutionWindow, readJson, writeJson, zonedParts, exists, sleep, redact } from '../../src/lib/utils.mjs';
import { generateDay, validateDay, markWebsitePublished, recordInstagramResult, campaignSummary, contentPath, queuePath, logPath } from '../../src/lib/engine.mjs';
import { loadRegistry, saveRegistry, findByDate } from '../../src/lib/registry.mjs';
import { buildSite } from '../../src/lib/site-builder.mjs';
import { buildCampaignPreview } from '../../src/lib/preview.mjs';
import { getInstagramPublisher } from '../../src/lib/publishing/instagram.mjs';
import { withLock } from '../../src/lib/locks.mjs';
import { withRetry } from '../../src/lib/retry.mjs';
import { notify } from '../../src/lib/notifications.mjs';

const args=process.argv.slice(2);const command=args.shift()||'status';
const option=(name,fallback='')=>{const index=args.indexOf(`--${name}`);return index>=0?(args[index+1]&&!args[index+1].startsWith('--')?args[index+1]:true):fallback;};
const flag=name=>args.includes(`--${name}`);
const config=loadConfig();const local=zonedParts(new Date(),config.timezone);const date=option('date',local.date);
const control=async()=>readJson(fromRoot('data','campaign-control.json'),{paused:false});
const assertNotPaused=async()=>{if((await control()).paused)throw new Error('Campaign is paused in data/campaign-control.json');if(config.killSwitch)throw new Error('Campaign kill switch is enabled');};
const output=async(name,value)=>{if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,`${name}=${value}\n`,'utf8');console.log(`${name}=${value}`);};
const campaignDayFor=target=>{const start=config.campaignStartDate||date;const difference=Math.round((new Date(`${target}T00:00:00Z`)-new Date(`${start}T00:00:00Z`))/86400000);return difference+1;};

async function stageDay(target){await assertNotPaused();return withLock(target,'stage',async()=>{const result=await generateDay(config,target,campaignDayFor(target),{stage:true,force:flag('force')});console.log(result.idempotent?`Already generated: ${target}`:`Staged ${result.content.content_id}`);return result;});}
async function generate(target){await assertNotPaused();const result=await generateDay(config,target,campaignDayFor(target),{force:flag('force')});console.log(result.idempotent?`Already generated: ${target}`:`Generated ${result.content.content_id}`);return result;}
async function publishWebsite(target){await assertNotPaused();assertLiveConfiguration(config,'website');if(!flag('confirm-live')&&!process.env.GITHUB_ACTIONS)throw new Error('Add --confirm-live to publish intentionally');return withLock(target,'publish-website',async()=>{const result=await markWebsitePublished(config,target);const build=await buildSite(config);const log=await readJson(logPath(target));log.publish_started_at=log.publish_started_at||new Date().toISOString();log.website={status:'built',url:result.entry.website_url,build};log.status='website-published';await writeJson(logPath(target),log);if(!config.continuousContent&&result.content?.campaign_day>=config.campaignDays)await notify(config,'Run Lighter campaign complete',`${config.campaignDays} scheduled content days have reached the website publication step.`);console.log(`Website article prepared: ${result.entry.website_url}`);return result;});}
async function publishInstagram(target){await assertNotPaused();assertLiveConfiguration(config,'instagram');if(!flag('confirm-live')&&!process.env.GITHUB_ACTIONS)throw new Error('Add --confirm-live to publish intentionally');const registry=await loadRegistry();const entry=findByDate(registry,target);if(!entry)throw new Error(`No entry for ${target}`);if(entry.instagram_media_id){console.log(`Instagram already published: ${entry.instagram_media_id}`);return {idempotent:true};}if(!entry.website_url)throw new Error('Website must be published before Instagram');const content=await readJson(contentPath(entry.article_slug));const queue=await readJson(queuePath(target));const publisher=getInstagramPublisher(config,false);const imageUrl=`${config.siteUrl}${content.instagram_image}`;const persistContainer=async containerId=>{queue.instagram_container_id=containerId;queue.instagram_idempotency_key=content.content_id;await writeJson(queuePath(target),queue);};const result=await withRetry(()=>publisher.publish({imageUrl,caption:content.instagram_caption,contentId:content.content_id,timeoutSeconds:config.publishTimeoutSeconds,containerId:queue.instagram_container_id||'',onContainer:persistContainer}),{retries:config.maxRetries,baseDelayMs:2000,shouldRetry:error=>!/permission|credential|validation/i.test(error.message)});await recordInstagramResult(target,result);const log=await readJson(logPath(target));log.instagram={status:'published',media_id:result.media_id,container_id:result.container_id,idempotency_key:content.content_id};log.publish_completed_at=new Date().toISOString();log.status='published';await writeJson(logPath(target),log);console.log(`Instagram published: ${result.media_id}`);return result;}

async function verifyPublic(target){const registry=await loadRegistry();const entry=findByDate(registry,target);if(!entry?.website_url)throw new Error('No public website URL recorded');const content=await readJson(contentPath(entry.article_slug));const urls=[entry.website_url,`${config.siteUrl}${content.instagram_image}`];for(const url of urls){await withRetry(async()=>{const response=await fetch(url,{method:'GET',redirect:'follow'});if(!response.ok)throw new Error(`${url} returned HTTP ${response.status}`);return true;},{retries:Math.max(config.maxRetries,8),baseDelayMs:5000});console.log(`Verified ${url}`);}return true;}

async function reconcile(target){const registry=await loadRegistry();const entry=findByDate(registry,target);if(!entry)throw new Error(`No entry for ${target}`);const queue=await readJson(queuePath(target));const content=await readJson(contentPath(entry.article_slug));let changed=false;if(queue.instagram_media_id&&!entry.instagram_media_id){entry.instagram_media_id=queue.instagram_media_id;content.instagram_media_id=queue.instagram_media_id;changed=true;}if(content.status==='published'&&!entry.website_url){entry.website_url=content.canonical_url;changed=true;}if(changed){await saveRegistry(registry);await writeJson(contentPath(content.slug),content);}console.log(changed?'Publication state reconciled':'Publication state already consistent');return {changed};}

async function scheduleCheck(){const requested=option('requested','');if(requested&&requested!=='scheduled'){await output('operation',requested);await output('date',date);return requested;}if(await control().then(value=>value.paused)||config.killSwitch||!config.campaignStartDate){await output('operation','none');await output('date',local.date);return 'none';}const day=campaignDayFor(local.date);if(day<1||(!config.continuousContent&&day>config.campaignDays)){await output('operation','none');await output('date',local.date);return 'none';}const registry=await loadRegistry();const entry=findByDate(registry,local.date);let operation='none';if(inExecutionWindow(new Date(),config.stageTime,15,config.timezone)&&(!entry||entry.status==='generated'))operation='stage';if(inExecutionWindow(new Date(),config.publishTime,15,config.timezone)&&entry?.status==='staged')operation='publish';await output('operation',operation);await output('date',local.date);return operation;}

try{
  if(command==='generate')await generate(date);
  else if(command==='stage')await stageDay(date);
  else if(command==='validate'){const validation=await validateDay(config,date);console.log(JSON.stringify(validation,null,2));if(!validation.passed)process.exitCode=1;}
  else if(command==='build')console.log(await buildSite(config));
  else if(command==='preview')console.log(await buildCampaignPreview(config));
  else if(command==='campaign'||command==='dry-run'){const start=option('start',config.campaignStartDate||date);for(let day=0;day<config.campaignDays;day+=1)await generateDay(config,addDays(start,day),day+1,{force:flag('force')});console.log(await buildCampaignPreview(config));}
  else if(command==='publish-website')await publishWebsite(date);
  else if(command==='publish-instagram')await publishInstagram(date);
  else if(command==='publish'){await publishWebsite(date);if(!flag('skip-verify'))await verifyPublic(date);if(config.instagramAutoPublish)await publishInstagram(date);}
  else if(command==='verify-public')await verifyPublic(date);
  else if(command==='reconcile')await reconcile(date);
  else if(command==='status')console.log(JSON.stringify(await campaignSummary(config),null,2));
  else if(command==='pause'){await writeJson(fromRoot('data','campaign-control.json'),{paused:true,paused_at:new Date().toISOString(),reason:option('reason','Paused by owner')});console.log('Campaign paused');}
  else if(command==='resume'){await writeJson(fromRoot('data','campaign-control.json'),{paused:false,paused_at:null,reason:null});console.log('Campaign resumed');}
  else if(command==='schedule-check'||command==='scheduled')await scheduleCheck();
  else if(command==='credentials-test'){const publisher=getInstagramPublisher(config,config.dryRun);console.log(await publisher.validateCredentials());}
  else throw new Error(`Unknown command: ${command}`);
}catch(error){const safeMessage=redact(error.message);console.error(safeMessage);if(await exists(logPath(date))){const log=await readJson(logPath(date));log.status='failed';log.errors=log.errors||[];log.errors.push({type:command,message:safeMessage,at:new Date().toISOString()});await writeJson(logPath(date),log).catch(()=>{});}if(await exists(queuePath(date))){const queue=await readJson(queuePath(date));queue.last_error=safeMessage;queue.status=queue.website_published?'instagram-failed':'failed';await writeJson(queuePath(date),queue).catch(()=>{});}await notify(config,'Run Lighter content workflow failed',`${command} for ${date}: ${safeMessage}`).catch(()=>{});process.exitCode=1;}
