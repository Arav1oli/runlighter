import path from 'node:path';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const date = '2026-08-13';
const slug = 'how-do-i-stop-being-the-bottleneck-in-my-business';
const contentId = 'rl-2026-08-13-89b9658fe0';
const disclosure = 'This post has been automated so we can run lighter.';
const createdAt = '2026-08-12T11:23:43.000Z';
const approvedAt = '2026-08-12T11:50:45.000Z';
const outputDir = path.join(root, 'generated/drafts', date);
const sourceInput = '/Users/adrianstock/.codex/generated_images/019ff233-5ef3-7a91-9a29-a7b17186e0a4/exec-4e633c7f-ddc8-4c6a-be4b-5763d45a993d.png';
const sourcePath = path.join(outputDir, 'owner-tollbooth-source.png');
const cropPath = path.join(outputDir, 'owner-tollbooth-crop.png');

const article = `# How do I stop being the bottleneck in my business?

## Short answer

To stop being the bottleneck in your business, separate routine approvals and information movement from decisions that genuinely need your judgement, then give each workflow a clear owner, rule and exception path.

For an established Sydney professional-service or B2B business, the goal is not to remove the owner from important decisions. It is to stop every client document, internal question, status update and unusual case from joining the same queue.

When everything waits for one person, growth creates more interruption rather than more capacity. The owner becomes a tollbooth: work may be ready to move, but the barrier stays down until they notice, interpret and approve it.

## Why capable teams still wait for the owner

Owner dependency often develops for sensible reasons. The owner knows the history, understands the commercial risk and can resolve an unclear situation quickly. Staff learn that asking the owner is safer than following a rule that may not cover the exception.

Over time, that safety net becomes the normal path. A client onboarding record waits for a final check. A document approval sits in an inbox. A report needs a number confirmed. A scope change requires context. A team member forwards the issue because nobody can see whether it is routine or genuinely unusual.

The problem is not that the owner is involved. The problem is that the workflow does not distinguish between information, rules and judgement. Every item receives the same treatment, even when most could move through a controlled process.

## Find the points where work joins the queue

Start with one recent example that interrupted the owner. Follow it backwards. What triggered the request? What information was available? Which person or system held it? Why could the next step not happen without the owner?

Look for repeated signals:

- staff forward documents because the responsible reviewer is unclear
- routine discounts or variations have no agreed limits
- client onboarding cannot begin until details are manually checked across systems
- recurring reports require the owner to confirm definitions or source figures
- tasks return to the owner when information is incomplete
- approvals happen in email without updating the delivery or billing record

The most useful question is not, “Can this be automated?” Ask, “What exactly is the owner deciding here?” Sometimes the answer is a real commercial decision. Sometimes the owner is only locating information, restating a known rule or reminding the next person to act.

Run Lighter uses the same practical approach during an [on-site automation review](/blog/what-happens-during-an-on-site-automation-review/). We follow the real work before recommending software.

## Create three lanes for the workflow

A useful owner-light workflow has three lanes.

The first lane is routine movement. Approved information should travel from its source to the next responsible person or system without being copied through the owner. That might mean creating the next task when a client signs, preparing a record from confirmed details or notifying the delivery team when an approval is recorded.

The second lane is rule-based action. The business defines what can proceed when clear conditions are met. A complete onboarding pack can move to setup. A standard request can be acknowledged and assigned. An overdue document can trigger a reminder. The action is visible, reversible and recorded.

The third lane is human judgement. Exceptions, advice, pricing, unusual commitments, sensitive client situations and final responsibility stay with the authorised person. The system should bring these decisions forward with the relevant context, not bury them among routine requests.

This structure does not lower control. It makes control more deliberate. The owner sees fewer items, but the remaining items are the ones that warrant their attention.

## Give decisions a clear boundary

Delegation fails when the boundary is vague. “Use your judgement” may sound empowering, but it leaves people unsure about consequences. “Ask me about everything” feels safe, but it recreates the bottleneck.

Define the normal path with examples. State which fields must be present, which limits apply, who owns the result and what should happen when a condition is not met. Record the exception path just as carefully as the standard path.

For example, a system can prepare a scope-change record from approved inputs and route it for review. It should not decide whether the client relationship justifies a fee concession. That distinction is explored further in our guide to [preventing approved extra work from disappearing before billing](/blog/how-do-accounting-firms-stop-out-of-scope-work-becoming-unpaid-work/).

## Use the software already in the business

Reducing owner dependency does not automatically require a new platform. Many Sydney businesses already have useful workflow, permission, notification and integration features inside their CRM, practice-management, accounting or document systems.

Map the required movement first, then check whether the current tools can support it safely. A status change, approved form, signed document or completed checklist can often become a reliable trigger. A task, draft, notification or exception queue can become the controlled next step.

If the current stack cannot support the workflow, that becomes evidence for a targeted change. It is still better than buying software first and discovering that the owner remains the unofficial integration between every system. See [whether your existing business software may already be enough](/blog/your-software-may-already-be-enough/) before adding another place to check.

## Measure whether the owner is genuinely less central

Do not judge the change by the number of automations switched on. Review a small set of real cases and ask whether routine work moved without chasing, whether exceptions reached the right person with context and whether staff knew who owned the next step.

The owner should still be visible where judgement matters. They should become less necessary for copying information, confirming known rules, finding status and restarting stalled handoffs.

This post has been automated so we can run lighter.

If every approval, document or exception still waits at your desk, book an on-site automation review in Sydney. We will trace one real workflow, identify why it returns to you and design a practical first step that keeps important judgement human.`;

const caption = `Why does every approval, handoff and exception end up back with the owner?

When the team cannot move until you review, forward or remember the next step, the problem may be the workflow rather than the people.

Run Lighter maps one real process, separates routine movement from genuine judgement and gives exceptions a clear path. You stay responsible for the decisions that matter without becoming the tollbooth for everything else.

This post has been automated so we can run lighter.

If work keeps waiting at your desk, book an on-site automation review in Sydney.

#RunLighter #SydneyBusiness #BusinessAutomation #ProfessionalServices`;

const directAnswer = 'To stop being the bottleneck in your business, separate routine approvals and information movement from decisions that genuinely need your judgement, then give each workflow a clear owner, rule and exception path.';
const primaryKeyword = 'business process automation Sydney';
const secondaryKeywords = ['owner bottleneck', 'workflow automation Sydney', 'professional services automation', 'business automation consultant Sydney'];
const sha256 = value => createHash('sha256').update(value).digest('hex');
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

await mkdir(outputDir, { recursive: true });
await copyFile(sourceInput, sourcePath);
const source = await readFile(sourcePath);
const sourceHash = sha256(source);
const fullDataUri = `data:image/png;base64,${source.toString('base64')}`;
const crop = await sharp(source).extract({ left: 80, top: 390, width: 1040, height: 900 }).png().toBuffer();
await writeFile(cropPath, crop);
const cropDataUri = `data:image/png;base64,${crop.toString('base64')}`;

const specs = {
  instagram: { width:1080, height:1350 },
  hero: { width:1600, height:900, panel:650, titleSize:70, lineY:[270,348,426] },
  og: { width:1200, height:630, panel:500, titleSize:59, lineY:[188,253,318] }
};

const variants = {};
for (const [name, spec] of Object.entries(specs)) {
  let svg;
  if (name === 'instagram') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <metadata>${escapeXml(disclosure)} | RUN / LIGHTER</metadata>
  <image href="${fullDataUri}" width="1080" height="1350" preserveAspectRatio="none"/>
  <rect x="32" y="1196" width="196" height="48" rx="24" fill="#17352B" fill-opacity=".96"/>
  <text x="55" y="1227" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="2">RUN / LIGHTER</text>
</svg>`;
  } else {
    const imageWidth = spec.width - spec.panel;
    const disclosureY = spec.height - (name === 'hero' ? 24 : 18);
    const disclosureSize = name === 'hero' ? 18 : 14;
    const brandSize = name === 'hero' ? 25 : 19;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">
  <rect width="${spec.width}" height="${spec.height}" fill="#17352B"/>
  <image href="${cropDataUri}" x="${spec.panel}" y="0" width="${imageWidth}" height="${spec.height}" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="0" width="${spec.panel}" height="${spec.height}" fill="#17352B"/>
  <text x="58" y="72" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${brandSize}" font-weight="700" letter-spacing="4">RUN / LIGHTER</text>
  <rect x="58" y="92" width="142" height="6" rx="3" fill="#D8A62B"/>
  <text x="58" y="${spec.lineY[0]}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">WHY DOES</text>
  <text x="58" y="${spec.lineY[1]}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">EVERYTHING</text>
  <text x="58" y="${spec.lineY[2]}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">WAIT FOR YOU?</text>
  <text x="58" y="${disclosureY}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${disclosureSize}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
  }
  const svgPath = path.join(outputDir, `${name}.svg`);
  const pngPath = path.join(outputDir, `${name}.png`);
  const webpPath = path.join(outputDir, `${name}.webp`);
  const portableSvg = name === 'instagram'
    ? svg.replace(fullDataUri, 'owner-tollbooth-source.png')
    : svg.replace(cropDataUri, 'owner-tollbooth-crop.png');
  await writeFile(svgPath, `${portableSvg}\n`, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel:9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality:90 }).toFile(webpPath);
  variants[name] = {
    png:path.relative(root,pngPath), webp:path.relative(root,webpPath), svg:path.relative(root,svgPath),
    width:spec.width, height:spec.height
  };
}

const creative = {
  content_id:contentId,
  revision:'owner-tollbooth-v1',
  run_date:date,
  created_at:createdAt,
  disclosure,
  brand:'RUN / LIGHTER',
  alt_text:'A business owner sits in a tollbooth blocking an office corridor while staff wait on both sides with documents.',
  background_provider:'imagegen-owner-approved-photorealistic',
  source_asset_origin:'owner-approved-imagegen',
  source_asset:`generated/drafts/${date}/owner-tollbooth-source.png`,
  source_asset_sha256:sourceHash,
  reused_generated_asset:false,
  owner_approved_prepared_asset:true,
  owner_approved_for_content_id:contentId,
  owner_approved_at:approvedAt,
  commercial_problem:'Routine approvals, handoffs and incomplete information repeatedly return to the owner and delay otherwise capable teams.',
  service_resolution:'Separate routine movement and rules from genuine judgement, then give each path a clear owner and exception route.',
  overlay_copy:'WHY DOES EVERYTHING WAIT FOR YOU?',
  variants
};

const brief = {
  content_id:contentId,
  date,
  campaign_day:2,
  audience:'Owners of established Sydney B2B and professional-service businesses',
  problem:'Routine approvals, handoffs and exceptions repeatedly return to the owner, so capable staff wait and the owner is constantly interrupted.',
  single_message:'The owner should keep important judgement without becoming the approval gate for every routine step.',
  supporting_points:['Trace where work returns to the owner','Separate information movement, rules and judgement','Give the normal and exception paths clear owners','Use existing software before adding another platform'],
  desired_action:'Book an on-site automation review',
  topic:'owner dependency in established service businesses',
  angle:'Show how routine work turns the owner into a tollbooth, then explain how clear rules and exception paths preserve judgement while work keeps moving.',
  headline_options:['How do I stop being the bottleneck in my business?','Why does every approval wait for the owner?','How can a business reduce owner dependency?'],
  selected_headline:'How do I stop being the bottleneck in my business?',
  social_headline:'WHY DOES EVERYTHING WAIT FOR YOU?',
  caption_hook_options:['Why does every approval wait for you?','Your team may be waiting at the same gate.','The owner should not be every workflow.'],
  selected_hook:'Why does every approval wait for you?',
  caption_cta:'Book an on-site automation review in Sydney.',
  visual_concept:'An owner sits inside a literal office tollbooth while professional staff queue on both sides holding paperwork.',
  visual_format:'idea-first owner tollbooth photograph',
  image_generation_prompt:'Owner-approved image already supplied and hashed. Do not regenerate or replace it for this package.',
  overlay_copy:['WHY DOES EVERYTHING WAIT FOR YOU?'],
  article_outline:['Short answer','Why capable teams still wait for the owner','Find where work joins the queue','Create three workflow lanes','Give decisions a clear boundary','Use existing software','Measure reduced owner dependency'],
  search_question:'How do I stop being the bottleneck in my business?',
  search_intent:'commercial investigation',
  buyer_stage:'problem aware',
  direct_answer:directAnswer,
  search_plan_id:'rl-search-2026-08-12',
  primary_keyword:primaryKeyword,
  secondary_keywords:secondaryKeywords,
  source_urls:[],
  promotion_hypothesis:'The tollbooth metaphor makes owner dependency understandable within one second and leads directly to a practical workflow review for qualified Sydney owners.',
  risk_notes:['Do not imply that every owner decision should be delegated','Do not invent savings or results','Keep advice, pricing, unusual cases and relationship judgement human','Use a separately uploaded creative for any paid ad']
};

const content = {
  content_id:contentId, date, campaign_day:2,
  title:'How do I stop being the bottleneck in my business?', slug, updated:date, status:'draft',
  excerpt:'Separate routine approvals from decisions that need judgement so work can move without making the owner the gate for every step.',
  description:'A practical guide for Sydney business owners who want routine approvals and handoffs to move without losing human judgement.',
  seo_title:'How to Stop Being the Business Bottleneck | Sydney',
  meta_description:'Learn how Sydney business owners can reduce approval bottlenecks, clarify workflow ownership and automate routine movement while keeping judgement human.',
  author:'Run Lighter',
  tags:[primaryKeyword,...secondaryKeywords],
  category:'Workflow automation',
  hero_image:`/generated/drafts/${date}/hero.webp`,
  hero_image_fallback:`/generated/drafts/${date}/hero.png`,
  hero_image_alt:creative.alt_text,
  og_image:`/generated/drafts/${date}/og.png`,
  instagram_image:`/generated/drafts/${date}/instagram.png`,
  dimensions:{instagram:'1080x1350',hero:'1600x900',open_graph:'1200x630'},
  instagram_caption:caption,
  instagram_media_id:'',
  article_markdown:article,
  automation_disclosure:disclosure,
  source_urls:[], is_topical:false,
  search_question:'How do I stop being the bottleneck in my business?', direct_answer:directAnswer,
  search_intent:'commercial investigation', buyer_stage:'problem aware', search_plan_id:'rl-search-2026-08-12',
  primary_keyword:primaryKeyword, secondary_keywords:secondaryKeywords,
  canonical_url:`https://runlighter.com/blog/${slug}/`,
  reading_time:Math.ceil(article.trim().split(/\s+/).length/220),
  promotion_score:95, promotion_candidate:true,
  promotion_reason:'Owner-approved concept with strong buyer fit, one-second visual tension and a direct path to an on-site workflow review. Paid use still requires a separately uploaded ad creative and explicit authority.',
  suggested_paid_audience:'Owners of established Sydney B2B and professional-service businesses',
  suggested_ad_primary_text:'When every approval, handoff and exception returns to the owner, growth creates more interruption instead of more capacity. Map the workflow, separate routine movement from real judgement and give exceptions a clear path.',
  suggested_ad_headline:'Find where work waits for you',
  suggested_ad_description:'Book an on-site automation review in Sydney.',
  creative,
  created_at:createdAt, published_at:'', updated_at:approvedAt
};

const intelligence = {
  run_date:date, timezone:'Australia/Sydney', commercial_focus:'Qualified Sydney owner conversations in established B2B and professional-service businesses',
  owner_direction:'Use the approved Owner’s Tollbooth image, copy and concept in the content pipeline and create a Sydney SEO article.',
  concepts:[
    {rank:1,concept:'The Owner’s Tollbooth',hook:'WHY DOES EVERYTHING WAIT FOR YOU?',score:97,decision:'selected and owner approved'},
    {rank:2,concept:'The Approval Turnstile',hook:'EVERY DECISION NEEDS YOUR PASS.',score:89,decision:'rejected as less human'},
    {rank:3,concept:'The Owner Rubber Stamp',hook:'YOUR SIGN-OFF IS THE QUEUE.',score:87,decision:'rejected as too document-led'},
    {rank:4,concept:'The Emergency Brake',hook:'ONE PERSON CAN STOP THE FLOW.',score:84,decision:'rejected as overly alarming'},
    {rank:5,concept:'The Waiting Room',hook:'YOUR TEAM IS WAITING FOR YOU.',score:82,decision:'rejected as less distinctive'},
    {rank:6,concept:'The Approval Conveyor',hook:'EVERYTHING ENDS AT YOUR DESK.',score:80,decision:'rejected as machine-like'},
    {rank:7,concept:'The Calendar Queue',hook:'YOUR DAY IS THE WORKFLOW.',score:78,decision:'rejected as visually weak'},
    {rank:8,concept:'The Literal Bottleneck',hook:'THE BUSINESS NARROWS AT YOU.',score:76,decision:'rejected as abstract'}
  ],
  selected_concept:{commercial_failure:creative.commercial_problem,service_mechanism:creative.service_resolution,human_boundary:'The owner keeps advice, pricing, unusual commitments, relationship decisions and final responsibility.',source_asset:creative.source_asset,source_asset_sha256:sourceHash},
  red_team:{generic_ai_copy:false,vague_workflow_diagram:false,decorative_office:false,robot_or_hologram:false,invented_proof:false,trades_led:false,main_copy_words:6}
};

await writeFile(path.join(outputDir,'creative-manifest.json'),`${JSON.stringify(creative,null,2)}\n`,'utf8');
await mkdir(path.join(root,'_content/blog'),{recursive:true});
await writeFile(path.join(root,'_content/blog',`${slug}.json`),`${JSON.stringify(content,null,2)}\n`,'utf8');
await writeFile(path.join(root,'data/daily-briefs',`${date}.json`),`${JSON.stringify(brief,null,2)}\n`,'utf8');
await writeFile(path.join(root,'data/content-intelligence',`${date}.json`),`${JSON.stringify(intelligence,null,2)}\n`,'utf8');

const planPath = path.join(root,'data/search-plans/2026-08-12.json');
const plan = JSON.parse(await readFile(planPath,'utf8'));
const planned = plan.questions.find(item=>item.date===date);
Object.assign(planned,{
  question_id:'owner-bottleneck', question:content.search_question, social_hook:brief.social_headline,
  direct_answer:directAnswer, topic:brief.topic, search_intent:brief.search_intent, buyer_stage:brief.buyer_stage,
  primary_keyword:primaryKeyword, secondary_keywords:secondaryKeywords, problem:brief.problem,
  status:'owner-approved', replacement_note:'Replaced the planned trades quote topic at Adrian’s direction with the approved Owner’s Tollbooth package for established Sydney owners.'
});
await writeFile(planPath,`${JSON.stringify(plan,null,2)}\n`,'utf8');

const registryPath = path.join(root,'data/content-registry.json');
const registry = JSON.parse(await readFile(registryPath,'utf8'));
const entry = {
  content_id:contentId,date,campaign_day:2,topic:brief.topic,angle:brief.angle,headline:content.title,hook:brief.selected_hook,
  visual_format:brief.visual_format,keywords:secondaryKeywords,source_urls:[],article_slug:slug,image_path:content.hero_image,
  caption_hash:sha256(caption),article_hash:sha256(article),status:'generated',website_url:'',instagram_media_id:'',promotion_score:95,
  created_at:createdAt,published_at:'',error:null
};
const existingIndex = registry.entries.findIndex(item=>item.date===date||item.content_id===contentId);
if(existingIndex>=0) registry.entries[existingIndex]={...registry.entries[existingIndex],...entry}; else registry.entries.push(entry);
registry.entries.sort((left,right)=>left.date.localeCompare(right.date));
await writeFile(registryPath,`${JSON.stringify(registry,null,2)}\n`,'utf8');

const queue = {content_id:contentId,date,slug,status:'generated',validated:false,scheduled_publish_time:'07:00',website_published:false,instagram_published:false,facebook_published:false,attempts:{website:0,instagram:0,facebook:0},last_error:null,prepared_social_asset:`generated/drafts/${date}/instagram.png`,caption_source:`_content/blog/${slug}.json`,owner_approved_prepared_asset:true};
await writeFile(path.join(root,'data/publish-queue',`${date}.json`),`${JSON.stringify(queue,null,2)}\n`,'utf8');

const audit = {content_id:contentId,date,local_timezone:'Australia/Sydney',stage_started_at:'',stage_completed_at:'',publish_started_at:'',publish_completed_at:'',candidate_topics:intelligence.concepts,selected_topic:intelligence.selected_concept,sources:[],generation_models:{text:{provider:'manual-owner-approved'},image:{provider:'imagegen',source_hash:sourceHash},research:{provider:'none',note:'Evergreen Sydney buyer question; no current factual claims required.'}},validation_results:[],website:{},instagram:{},facebook:{},promotion:{score:95,candidate:true},status:'generated',errors:[]};
await writeFile(path.join(root,'logs/content',`${date}.json`),`${JSON.stringify(audit,null,2)}\n`,'utf8');

console.log(JSON.stringify({content_id:contentId,slug,source_hash:sourceHash,article_words:article.trim().split(/\s+/).length,caption_words:caption.trim().split(/\s+/).length,variants},null,2));
