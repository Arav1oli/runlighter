import path from 'node:path';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const date = '2026-08-15';
const slug = 'what-should-a-marketing-report-show-beyond-clicks';
const contentId = 'rl-2026-08-15-aa9c292ee2';
const disclosure = 'This post has been automated so we can run lighter.';
const createdAt = '2026-08-14T23:25:06.000Z';
const outputDir = path.join(root, 'generated/drafts', date);
const sourceInput = '/Users/adrianstock/.codex/generated_images/01a00287-2c25-7e03-93ea-4488ce806281/exec-9648ffc4-0c88-4b88-b1c7-49a704b44fef.png';
const sourcePath = path.join(outputDir, 'scoreboard-source.png');

const article = `# What should a marketing report show beyond clicks?

## Short answer

A useful marketing report should connect activity and spend to enquiries, response, declared business fit and qualified conversations. It should also show where a lead stopped moving and what decision the business needs to make next.

Clicks and leads still matter. They tell you whether an audience saw an offer and whether someone took a first action. They do not tell a Sydney accounting firm, legal practice, advisory business, property company, agency or consultancy whether the right person was reached, followed up properly or moved towards work.

The better report is not necessarily longer. It joins a small number of commercial stages so the owner can see the difference between attention and progress.

## Start with the decision, not the dashboard

Before choosing metrics, ask what the report should help someone decide. A campaign report might need to answer whether to keep an offer, improve the landing page, change the qualification questions, repair follow-up or test a different creative.

Without that decision, reports expand into collections of numbers. Impressions, reach, clicks, click-through rate, cost per click and leads can all be accurate while the owner still cannot tell what needs attention.

Use one reporting period and write the decision at the top. For example: “Is this campaign creating qualified Sydney owner conversations, and where are suitable enquiries being lost?” That question gives every metric a job.

## Show five connected layers

A practical owner report can be built around five layers.

### 1. Investment and delivery

Show the approved spend, dates, campaign, audience and creative that actually ran. Include reach or impressions when they help explain delivery. Keep budgets and campaign settings separate from results so nobody mistakes a planned amount for money spent.

### 2. Attention and enquiries

Record the actions that created an identifiable enquiry, such as a form submission, call or booked request. Clicks can explain the path, but do not count a click as a lead and do not count every lead as qualified.

Use the platform's exact result label. If Meta reports Leads (Form), preserve that label. If the website records a completed request, keep that event distinct from a page visit or button click.

### 3. Response and lead handling

The report should show whether the enquiry reached the right place, whether an acknowledgement was sent, who owned the human follow-up and whether that follow-up happened within the agreed service window.

This is where marketing and operations meet. An ad can create an enquiry and the commercial result can still disappear between the form, inbox, CRM and responsible person. A [managed lead generation system](/blog/what-should-a-fully-managed-lead-generation-service-include/) needs to make that handoff visible.

### 4. Declared fit and sales progress

Define qualification using information the person supplied and criteria the business approved. For an established Sydney professional-service firm, that might include location, business type, role, need and timing.

Do not infer suitability from a person's name, appearance or another protected characteristic. Do not let the reporting system make a sensitive sales decision. A responsible person should confirm whether the enquiry is genuinely suitable and record the next commercial stage.

Useful stages may include qualified conversation, proposal requested, proposal sent, work won or not proceeding. Use only stages the team can apply consistently.

### 5. The next controlled test

End with one recommendation that follows from the evidence. It might be to keep the current campaign stable while more qualified outcomes accumulate, pause an already weak creative after an authorised review, repair a follow-up gap or test one materially different proposition.

Separate a recommendation from an action. A report can identify a pause candidate without switching it off. Budget, targeting, offer, creative and sales decisions remain with the authorised person.

## Join existing systems before buying another dashboard

The necessary facts often already exist across the advertising platform, website, form, CRM, inbox, calendar and finance system. The first improvement may be a controlled way to pass identifiers and statuses between them, not a new reporting product.

Start with one campaign and one lead path. Give each stage a clear source of truth. Record the campaign and creative identifiers with the enquiry. Preserve the original submission. Add timestamps for acknowledgement, assignment and human follow-up. Let the responsible person record qualification and the sales outcome.

Run Lighter can trace that path around the software already in use, connect the stable reporting steps and expose exceptions for review. This is part of the broader work an [external marketing function should manage](/blog/what-should-an-external-marketing-function-manage/): not just publishing, but the accountable path from priority to measurable result.

## Protect the human boundary

Reporting should reduce reconstruction, not replace judgement. The system can collect approved facts, reconcile identifiers, calculate labelled measures and show missing stages. People should decide whether a lead fits, how to handle a relationship, whether to change the offer and whether to alter spend.

Keep unknowns visible. If a provider did not expose an exact result, write “unavailable” rather than estimating it. If a lead has not been qualified, do not call the campaign successful because the form count is high. If attribution is ambiguous, say so.

This discipline makes the report more commercially useful because the owner can see what is known, what is missing and what requires a decision.

## A one-page owner view

For one campaign, a one-page view can show:

1. approved spend and actual delivery
2. exact enquiries by source
3. acknowledgement and follow-up status
4. qualified conversations and later sales stages
5. one evidence-backed recommendation and its owner

That is enough to start. Add detail only when it changes a decision or explains a meaningful exception.

This post has been automated so we can run lighter.

If your current marketing report stops at clicks or lead volume, book an on-site automation review in Sydney, starting with a short workflow call. Run Lighter can trace one campaign through follow-up and reporting, show where the commercial picture breaks and identify one controlled improvement while your team keeps qualification, budget and sales decisions human.`;

const caption = `Clicks are useful. They are not the finish line.

A professional-service owner needs one view that connects campaign spend to enquiries, response, declared business fit and qualified conversations.

Run Lighter can join those reporting steps around your existing marketing and lead systems, while your team keeps qualification, budget decisions and sales conversations human.

This post has been automated so we can run lighter.

If your report stops at clicks or lead volume, book a short workflow call.

#RunLighter #SydneyBusiness #MarketingReporting`;

const directAnswer = 'A useful marketing report should connect activity and spend to enquiries, response, declared business fit and qualified conversations. It should also show where a lead stopped moving and what decision the business needs to make next.';
const primaryKeyword = 'marketing report beyond clicks';
const secondaryKeywords = ['marketing reporting Sydney', 'campaign reporting', 'qualified lead reporting', 'professional services marketing'];
const sha256 = value => createHash('sha256').update(value).digest('hex');
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&apos;');

await mkdir(outputDir, { recursive: true });
await copyFile(sourceInput, sourcePath);
const source = await readFile(sourcePath);
const sourceHash = sha256(source);
const fullDataUri = `data:image/png;base64,${source.toString('base64')}`;

const specs = {
  instagram: { width: 1080, height: 1350 },
  hero: { width: 1600, height: 900 },
  og: { width: 1200, height: 630 }
};

const variants = {};
for (const [name, spec] of Object.entries(specs)) {
  const portrait = name === 'instagram';
  const panel = portrait ? 0 : Math.round(spec.width * 0.42);
  const imageX = portrait ? 0 : panel;
  const imageWidth = portrait ? spec.width : spec.width - panel;
  const titleX = portrait ? 54 : 58;
  const titleTop = portrait ? 190 : 238;
  const titleSize = portrait ? 96 : name === 'hero' ? 84 : 63;
  const lineGap = Math.round(titleSize * 1.02);
  const darkPanel = portrait
    ? `<rect width="${spec.width}" height="430" fill="#17352B" fill-opacity=".94"/>`
    : `<rect width="${panel}" height="${spec.height}" fill="#17352B"/>`;
  const footerH = portrait ? 70 : name === 'hero' ? 58 : 46;
  const footerY = spec.height - footerH;
  const brandSize = portrait ? 24 : name === 'hero' ? 25 : 19;
  const disclosureSize = portrait ? 19 : name === 'hero' ? 17 : 13;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">
  <rect width="${spec.width}" height="${spec.height}" fill="#17352B"/>
  <image href="${fullDataUri}" x="${imageX}" y="0" width="${imageWidth}" height="${spec.height}" preserveAspectRatio="xMidYMid slice"/>
  ${darkPanel}
  <text x="${titleX}" y="72" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${brandSize}" font-weight="700" letter-spacing="4">RUN / LIGHTER</text>
  <rect x="${titleX}" y="94" width="142" height="7" rx="3" fill="#D8A62B"/>
  <text x="${titleX}" y="${titleTop}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">CLICKS AREN&apos;T</text>
  <text x="${titleX}" y="${titleTop + lineGap}" fill="#D8A62B" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">CLIENTS.</text>
  <rect x="${portrait ? 28 : 0}" y="${footerY}" width="${portrait ? spec.width - 56 : panel}" height="${footerH}" ${portrait ? 'rx="10"' : ''} fill="#17352B" fill-opacity=".97"/>
  <text x="${portrait ? 54 : titleX}" y="${footerY + Math.round(footerH * .67)}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${disclosureSize}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
  const svgPath = path.join(outputDir, `${name}.svg`);
  const pngPath = path.join(outputDir, `${name}.png`);
  const webpPath = path.join(outputDir, `${name}.webp`);
  await writeFile(svgPath, `${svg.replace(fullDataUri, 'scoreboard-source.png')}\n`, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(webpPath);
  variants[name] = {
    png: path.relative(root, pngPath),
    webp: path.relative(root, webpPath),
    svg: path.relative(root, svgPath),
    width: spec.width,
    height: spec.height
  };
}

const altText = 'An operator at a Sydney suburban cricket ground swaps a large ochre panel into a weathered scoreboard while a black panel drops away.';
const creative = {
  content_id: contentId,
  revision: 'scoreboard-swap-v1',
  run_date: date,
  created_at: createdAt,
  disclosure,
  brand: 'RUN / LIGHTER',
  alt_text: altText,
  background_provider: 'imagegen-photorealistic',
  source_asset_origin: 'fresh-imagegen-current-run',
  source_asset: `generated/drafts/${date}/scoreboard-source.png`,
  source_asset_sha256: sourceHash,
  reused_generated_asset: false,
  owner_approved_prepared_asset: false,
  commercial_problem: 'Marketing reporting stops at attention metrics, so an owner cannot see whether enquiries became qualified conversations or where follow-up failed.',
  service_resolution: 'Join campaign, enquiry, response, qualification and sales stages in one controlled reporting view around the systems already in use.',
  overlay_copy: "CLICKS AREN'T CLIENTS.",
  variants
};

const candidates = [
  {
    rank: 1,
    concept: 'Scoreboard Swap',
    service_family: 'Campaign reporting and improvement',
    qualified_buyer: 'Owner of an established Sydney professional-service business running paid campaigns',
    consequence: 'Spend and lead counts cannot show whether the campaign created suitable conversations or where follow-up failed.',
    service_mechanism: 'Join campaign, lead-handling, qualification and sales stages in one decision-ready report.',
    human_boundary: 'The owner retains qualification, budget, offer and sales decisions.',
    visual_event: 'A scoreboard operator swaps an oversized measurement panel while the discarded panel drops.',
    hook: "CLICKS AREN'T CLIENTS.",
    scores: { commercial_consequence: 19, buyer_service_fit: 20, one_second_visual: 19, stopping_power: 14, novelty: 14, mobile_brand_fit: 10 },
    score: 96,
    decision: 'selected; dedicated coverage gap, decisive action and the strongest link between the image and a live Run Lighter service'
  },
  {
    rank: 2,
    concept: 'Missing Search Result',
    service_family: 'Website and local search priorities',
    qualified_buyer: 'Sydney legal, accounting or advisory principal',
    consequence: 'A ready buyer cannot find or understand the firm at the decision moment.',
    service_mechanism: 'Prioritise the service page, local signals and conversion path that matter most.',
    human_boundary: 'The firm retains positioning, claims and client acceptance decisions.',
    visual_event: 'One dark shopfront-shaped gap interrupts an otherwise lit Sydney street directory.',
    hook: "THEY SEARCHED. YOU WEREN'T THERE.",
    scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 17, stopping_power: 14, novelty: 14, mobile_brand_fit: 9 },
    score: 91,
    decision: 'rejected because the absence was less instantly legible than the physical scoreboard change'
  },
  {
    rank: 3,
    concept: 'Invisible Follow-up Clock',
    service_family: 'Paid acquisition and lead handling',
    qualified_buyer: 'Sydney agency or consultancy owner',
    consequence: 'Paid enquiries cool while ownership and response remain invisible.',
    service_mechanism: 'Acknowledge, route, assign and report each enquiry through one controlled lead path.',
    human_boundary: 'A person qualifies the lead and owns the sales conversation.',
    visual_event: 'A starting pistol fires while the nominated runner is still missing from the lane.',
    hook: 'THE LEAD STARTED WITHOUT YOU.',
    scores: { commercial_consequence: 19, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 10, mobile_brand_fit: 9 },
    score: 89,
    decision: 'rejected because lead handoff was already the central 11 August proposition'
  },
  {
    rank: 4,
    concept: 'Silent Publishing Press',
    service_family: 'Articles, social and email publishing',
    qualified_buyer: 'Principal of a specialist Sydney firm with useful expertise but inconsistent publishing',
    consequence: 'Approved expertise never reaches the buyers it could help.',
    service_mechanism: 'Coordinate approved ideas through production, review, publishing and measurement.',
    human_boundary: 'Experts retain the point of view, claims and final approval.',
    visual_event: 'A printing press runs at speed but the delivery belt is empty.',
    hook: 'GOOD IDEAS NEED A DELIVERY SYSTEM.',
    scores: { commercial_consequence: 16, buyer_service_fit: 18, one_second_visual: 18, stopping_power: 13, novelty: 14, mobile_brand_fit: 9 },
    score: 88,
    decision: 'rejected because the service result depended more heavily on the caption'
  },
  {
    rank: 5,
    concept: 'Duplicate Data Relay',
    service_family: 'Administration and data movement',
    qualified_buyer: 'Operations lead in a Sydney recruitment, property or advisory business',
    consequence: 'Skilled staff repeatedly retype the same customer facts and introduce avoidable errors.',
    service_mechanism: 'Capture approved information once and move it safely between existing systems.',
    human_boundary: 'People validate exceptions, access and sensitive information.',
    visual_event: 'One runner carries the same baton back to the starting line again.',
    hook: 'WHY TYPE IT TWICE?',
    scores: { commercial_consequence: 16, buyer_service_fit: 19, one_second_visual: 17, stopping_power: 12, novelty: 10, mobile_brand_fit: 9 },
    score: 83,
    decision: 'rejected below the threshold and too close to prior duplicate-entry work'
  },
  {
    rank: 6,
    concept: 'Onboarding False Start',
    service_family: 'Client onboarding and handovers',
    qualified_buyer: 'Sydney legal, accounting or advisory principal',
    consequence: 'A signed client waits while required checks and ownership remain unclear.',
    service_mechanism: 'Create the record, collect approved information and expose exceptions to the right person.',
    human_boundary: 'Risk, advice and acceptance decisions stay with authorised professionals.',
    visual_event: 'A starter raises the flag but one lane remains physically gated.',
    hook: "SIGNED DOESN'T MEAN STARTED.",
    scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 17, stopping_power: 13, novelty: 7, mobile_brand_fit: 9 },
    score: 83,
    decision: 'rejected below threshold and too close to the staged law-firm onboarding package'
  },
  {
    rank: 7,
    concept: 'Owner Weather Report',
    service_family: 'Reporting and visibility',
    qualified_buyer: 'Owner of a 10 to 50 person Sydney service business',
    consequence: 'The owner learns about risk only after a customer or employee escalates it.',
    service_mechanism: 'Surface agreed exceptions and overdue work before they become surprises.',
    human_boundary: 'The owner and team decide what the signals mean and how to respond.',
    visual_event: 'An outdoor storm siren stays silent under a visibly darkening sky.',
    hook: 'THE WARNING ARRIVED AFTER THE DAMAGE.',
    scores: { commercial_consequence: 18, buyer_service_fit: 18, one_second_visual: 15, stopping_power: 13, novelty: 8, mobile_brand_fit: 8 },
    score: 80,
    decision: 'rejected below threshold and too close to recent early-warning work'
  },
  {
    rank: 8,
    concept: 'Software Replacement Wrecking Ball',
    service_family: 'Cross-service existing-software integration',
    qualified_buyer: 'Established Sydney business owner considering a major platform change',
    consequence: 'The business risks disrupting working systems before testing a smaller connection.',
    service_mechanism: 'Trace the real workflow and connect existing software where safe before replacing it.',
    human_boundary: 'Leadership approves architecture, access, migration and change risk.',
    visual_event: 'A wrecking ball stops centimetres from a functioning switchboard.',
    hook: "DON'T REPLACE WHAT CAN CONNECT.",
    scores: { commercial_consequence: 17, buyer_service_fit: 18, one_second_visual: 18, stopping_power: 14, novelty: 8, mobile_brand_fit: 8 },
    score: 83,
    decision: 'rejected below threshold and not the strongest current service-rotation gap'
  }
];

const brief = {
  content_id: contentId,
  date,
  campaign_day: 4,
  audience: 'Owners of established Sydney B2B and professional-service businesses',
  problem: 'Marketing reports stop at activity or lead volume, leaving the owner unable to see suitable conversations, follow-up gaps or the next decision.',
  single_message: 'Clicks and lead counts become useful only when the report connects them to handling, qualification and commercial progress.',
  supporting_points: ['Start with the decision the report must support', 'Join spend, enquiries, response, qualification and sales stages', 'Keep unknowns visible', 'Separate recommendations from authorised actions'],
  desired_action: 'Book a short workflow call and bring one current campaign report',
  topic: 'marketing campaign reporting for professional services',
  service_family: 'Campaign reporting and improvement',
  angle: 'Replace attention-only reporting with a decision-ready view of enquiries, handling, declared fit and qualified conversations.',
  headline_options: ['What should a marketing report show beyond clicks?', 'How do I know whether marketing is creating useful conversations?', 'Which marketing numbers should a business owner actually review?'],
  selected_headline: 'What should a marketing report show beyond clicks?',
  social_headline: "CLICKS AREN'T CLIENTS.",
  caption_hook_options: ["Clicks aren't clients.", 'A lead count is not the commercial result.', 'The report should show where progress stopped.'],
  selected_hook: "Clicks aren't clients.",
  caption_cta: 'Book a short workflow call.',
  visual_concept: 'At a Sydney suburban cricket ground, an operator actively swaps a large ochre measurement panel into a weathered scoreboard while the old black panel drops away.',
  visual_format: 'high-action Australian editorial scoreboard photograph',
  image_generation_prompt: 'Fresh current-run photorealistic Sydney suburban cricket scoreboard at the decisive instant an operator swaps an oversized blank panel. No text, numbers, logos, office, desk, documents, robots, holograms or generic stock scene.',
  overlay_copy: ["CLICKS AREN'T CLIENTS."],
  article_outline: ['Short answer', 'Start with the decision', 'Five connected reporting layers', 'Join existing systems', 'Protect the human boundary', 'One-page owner view'],
  search_question: 'What should a marketing report show beyond clicks?',
  search_intent: 'informational',
  buyer_stage: 'problem aware',
  direct_answer: directAnswer,
  search_plan_id: 'rl-search-2026-08-12',
  primary_keyword: primaryKeyword,
  secondary_keywords: secondaryKeywords,
  source_urls: [],
  promotion_hypothesis: 'The physical scoreboard change makes a familiar reporting mistake tangible and leads directly to Run Lighter campaign reporting and improvement work.',
  risk_notes: ['Do not imply clicks or leads are useless', 'Do not invent results or attribution', 'Do not infer buyer fit from protected characteristics', 'Do not change budgets, ads or delivery states', 'Do not use the organic post as paid creative']
};

const content = {
  content_id: contentId,
  date,
  campaign_day: 4,
  title: 'What should a marketing report show beyond clicks?',
  slug,
  updated: date,
  status: 'draft',
  excerpt: 'Connect spend and attention to enquiries, response, declared fit, qualified conversations and one clear next decision.',
  description: 'A practical reporting structure for Sydney professional-service owners who need to see what happened after the click.',
  seo_title: 'What Should a Marketing Report Show Beyond Clicks?',
  meta_description: 'Build a useful campaign report that connects spend and leads to response, qualification and commercial progress while keeping key decisions human.',
  author: 'Run Lighter',
  tags: [primaryKeyword, ...secondaryKeywords],
  category: 'Marketing systems',
  hero_image: `/generated/drafts/${date}/hero.webp`,
  hero_image_fallback: `/generated/drafts/${date}/hero.png`,
  hero_image_alt: altText,
  og_image: `/generated/drafts/${date}/og.png`,
  instagram_image: `/generated/drafts/${date}/instagram.png`,
  dimensions: { instagram: '1080x1350', hero: '1600x900', open_graph: '1200x630' },
  instagram_caption: caption,
  instagram_media_id: '',
  article_markdown: article,
  automation_disclosure: disclosure,
  source_urls: [],
  is_topical: false,
  search_question: 'What should a marketing report show beyond clicks?',
  direct_answer: directAnswer,
  search_intent: 'informational',
  buyer_stage: 'problem aware',
  search_plan_id: 'rl-search-2026-08-12',
  primary_keyword: primaryKeyword,
  secondary_keywords: secondaryKeywords,
  canonical_url: `https://runlighter.com/blog/${slug}/`,
  reading_time: Math.ceil(article.trim().split(/\s+/).length / 220),
  promotion_score: 96,
  promotion_candidate: true,
  promotion_reason: 'Dedicated service-rotation gap, clear commercial consequence, decisive Australian visual and a direct path to a qualified reporting conversation.',
  suggested_paid_audience: 'Owners of established Sydney B2B and professional-service businesses',
  suggested_ad_primary_text: 'A click can explain attention. It cannot show whether the right enquiry was handled, qualified or moved towards work. Join the reporting stages before changing spend.',
  suggested_ad_headline: 'See what happened after the click',
  suggested_ad_description: 'Book a short workflow call.',
  creative,
  created_at: createdAt,
  published_at: '',
  updated_at: createdAt
};

const intelligence = {
  run_date: date,
  timezone: 'Australia/Sydney',
  commercial_focus: 'Qualified Sydney owner conversations in established B2B and professional-service businesses',
  thirty_day_coverage_audit: {
    period: '2026-07-22 to 2026-08-14',
    source: 'data/content-registry.json and publication logs',
    findings: [
      'Automation content dominated the period through reminders, qualifications, handovers, inbox, invoicing, owner dependency and process readiness.',
      'Paid acquisition and lead handling appeared directly on 11 August and partly on 10 August.',
      'Managed marketing appeared broadly in the 12 August external-marketing package.',
      'No successful package in the period was dedicated to campaign reporting and improvement.',
      'Website and local search priorities and articles, social and email publishing also remain thin and should rotate into later successful packages.',
      'Recent visuals overused operational still lifes, handoffs, stuck work and owner bottlenecks. The selected scoreboard swap uses a different visual archetype and active event.'
    ]
  },
  rolling_seven_service_mix: {
    successful_posts_reviewed: ['2026-08-10', '2026-08-11', '2026-08-12 on-site review', '2026-08-12 strata approvals', '2026-08-12 external marketing', '2026-08-13', '2026-08-14'],
    business_automation_families: 4,
    managed_marketing_families: 2,
    distinct_service_families: 5,
    result_before_today: 'pass at the minimum, with campaign reporting and improvement still lacking a dedicated package'
  },
  rejected_repetitive_themes: ['owner bottlenecks', 'stuck work', 'conflicting rules', 'approvals', 'handoffs', 'passive arrangements of work objects'],
  recent_first_party_signal: 'Exact authorised Meta evidence for 8 to 14 August showed A$75.72 spend and zero form leads. Exact 16 July to 14 August evidence showed A$258.50 spend, 14 form leads and A$18.46 CPL. No qualified or converted outcome was established, so no winner is named.',
  concepts: candidates,
  selected_concept: {
    commercial_failure: creative.commercial_problem,
    service_mechanism: creative.service_resolution,
    human_boundary: 'Qualification, budget, offer, relationship and sales decisions remain with the authorised people.',
    one_second_mute_test: 'At 20 per cent size, the viewer sees an active hand swapping a giant scoreboard panel while the old panel drops. The hook converts that action into a clear reporting consequence: clicks are a measure, not the client outcome.',
    source_asset: creative.source_asset,
    source_asset_sha256: sourceHash
  },
  final_prepublication_challenge: {
    live_service: 'Campaign reporting and improvement',
    capability_added: 'A dedicated commercial story about joining campaign data to follow-up, qualification and sales progress.',
    materially_different_from_last_seven: true,
    one_second_message: 'The business is changing the scoreboard because it has been measuring the wrong finish line.',
    qualified_owner_reason: 'Without the joined view, the owner cannot tell whether spend created suitable conversations or where the lead path failed.',
    engaging_not_merely_competent: 'The falling panel, active hands, oversized scoreboard and short contrarian hook create motion, surprise and Australian character.'
  },
  rolling_four_audience_mix: {
    dates: ['2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15'],
    professional_service_or_b2b_led: 4,
    trade_or_field_service_led: 0,
    result: 'pass'
  },
  red_team: { generic_ai_copy: false, vague_workflow_diagram: false, passive_still_life: false, decorative_office: false, robot_or_hologram: false, invented_proof: false, trades_led: false, main_copy_words: 3 }
};

await writeFile(path.join(outputDir, 'creative-manifest.json'), `${JSON.stringify(creative, null, 2)}\n`, 'utf8');
await mkdir(path.join(root, '_content/blog'), { recursive: true });
await writeFile(path.join(root, '_content/blog', `${slug}.json`), `${JSON.stringify(content, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/daily-briefs', `${date}.json`), `${JSON.stringify(brief, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/content-intelligence', `${date}.json`), `${JSON.stringify(intelligence, null, 2)}\n`, 'utf8');

const planPath = path.join(root, 'data/search-plans/2026-08-12.json');
const plan = JSON.parse(await readFile(planPath, 'utf8'));
const planned = plan.questions.find(item => item.date === date);
Object.assign(planned, {
  question_id: 'campaign-reporting',
  question: brief.search_question,
  social_hook: brief.social_headline,
  direct_answer: directAnswer,
  topic: brief.topic,
  primary_keyword: primaryKeyword,
  secondary_keywords: secondaryKeywords,
  problem: brief.problem,
  status: 'selected-and-rebuilt',
  replacement_note: 'The preplanned duplicate-data topic was replaced after the controlling service-rotation and novelty audit. It repeated older data-entry work and did not score strongly enough.'
});
await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');

const registryPath = path.join(root, 'data/content-registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const entry = {
  content_id: contentId,
  date,
  campaign_day: 4,
  topic: brief.topic,
  angle: brief.angle,
  headline: content.title,
  hook: brief.selected_hook,
  visual_format: brief.visual_format,
  keywords: secondaryKeywords,
  source_urls: [],
  article_slug: slug,
  image_path: content.hero_image,
  caption_hash: sha256(caption),
  article_hash: sha256(article),
  status: 'generated',
  website_url: '',
  instagram_media_id: '',
  promotion_score: 96,
  created_at: createdAt,
  published_at: '',
  error: null
};
const existingIndex = registry.entries.findIndex(item => item.date === date || item.content_id === contentId);
if (existingIndex >= 0) registry.entries[existingIndex] = { ...registry.entries[existingIndex], ...entry };
else registry.entries.push(entry);
registry.entries.sort((left, right) => left.date.localeCompare(right.date));
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');

const queue = {
  content_id: contentId,
  date,
  slug,
  status: 'generated',
  validated: false,
  scheduled_publish_time: '09:00',
  website_published: false,
  instagram_published: false,
  facebook_published: false,
  attempts: { website: 0, instagram: 0, facebook: 0 },
  last_error: null,
  prepared_social_asset: `generated/drafts/${date}/instagram.png`,
  caption_source: `_content/blog/${slug}.json`
};
await writeFile(path.join(root, 'data/publish-queue', `${date}.json`), `${JSON.stringify(queue, null, 2)}\n`, 'utf8');

const audit = {
  content_id: contentId,
  date,
  local_timezone: 'Australia/Sydney',
  stage_started_at: createdAt,
  stage_completed_at: '',
  publish_started_at: '',
  publish_completed_at: '',
  candidate_topics: candidates,
  selected_topic: intelligence.selected_concept,
  service_coverage: intelligence.thirty_day_coverage_audit,
  sources: [],
  generation_models: { text: { provider: 'manual' }, image: { provider: 'imagegen', source_hash: sourceHash }, research: { provider: 'none', note: 'Evergreen owner reporting question. Live first-party evidence is recorded separately.' } },
  validation_results: [],
  website: {},
  instagram: {},
  facebook: {},
  promotion: { score: 96, candidate: true },
  meta_ads_health: {
    scope: { business_id: '2419577311552088', ad_account_id: '264193331473545', campaign_id: '120252651440610735', ad_set_id: '120252651440620735' },
    seven_days: { range: '2026-08-08 to 2026-08-14 inclusive, Sydney Time', spend_aud: 75.72, leads: 0, cpl_aud: null, impressions: 1624, reach: 1100 },
    thirty_days: { range: '2026-07-16 to 2026-08-14 inclusive, Sydney Time', spend_aud: 258.50, leads: 14, cpl_aud: 18.46, impressions: 9202, reach: 5388 },
    ad_level_observations: [
      { ad: 'R L 1', status: 'off', spend_7d_aud: 20.94, leads_7d: 0, spend_30d_aud: 99.34, leads_30d: 9, cpl_30d_aud: 11.04 },
      { ad: 'R L 1 - Copy 2', status: 'active', spend_7d_aud: 16.36, leads_7d: 0, spend_30d_aud: 16.36, leads_30d: 0 },
      { ad: 'RL | Automation evens the race | 2026-08-05', status: 'off', spend_7d_aud: 24.59, leads_7d: 0, spend_30d_aud: 32.45, leads_30d: 0 },
      { ad: 'RL | Owner dependency | 2026-07-28', status: 'off', spend_7d_aud: 6.40, leads_7d: 0, spend_30d_aud: 26.32 },
      { ad: 'RL | Ad worked, handoff did not | 2026-08-11', status: 'off', spend_7d_aud: 0.39, leads_7d: 0, spend_30d_aud: 0.39 }
    ],
    recommendations: {
      keep: 'Keep R L 1 under observation. It produced 9 form leads at A$11.04 CPL over 30 days, but no qualified or converted outcome is established, so it is not a commercial winner.',
      pause_candidate: 'RL | Automation evens the race | 2026-08-05 remains the pause candidate and is already off. It spent A$32.45 over 30 days with 0 form leads.',
      next_test: "Test CLICKS AREN'T CLIENTS. only as a separate uploaded paid creative with its own ad-level CTA after explicit authority. Do not use the organic post as ad creative."
    },
    preexisting_unpublished_changes_preserved: 2,
    changes_made: false,
    budget_changed: false
  },
  recent_social: {
    instagram_profile: 'https://www.instagram.com/run_lighter/',
    post_count: 30,
    recent_verified_shortcodes: ['Db_7v8mIzxf', 'Db85ukpCa1d', 'Db7LojfD9ag', 'Db7H36QD2B4', 'Db4bJdfjbWi'],
    interpretation: 'Recent packages remained concentrated on readiness, owner bottlenecks, approvals, reviews and lead handoffs. No engagement or commercial winner was inferred from unlabeled profile thumbnails.'
  },
  lead_path: {
    existing_zap_id: '374752461',
    zap_url: 'https://zapier.com/editor/374752461/published',
    authorised_form_id: '1049875634638986',
    workflow_id: 'uI5as78klP0WTx1m',
    live_inspection: 'blocked',
    blocker: 'The exact existing Zap remained on Zapier Loading your Zap after one safe reload on 15 August 2026.',
    prior_configuration_not_reclaimed_as_current: true,
    duplicate_created: false,
    acknowledgement_delivery_claimed: false,
    recovery_action: 'Retry the read-only inspection of existing Zap 374752461 after Zapier loads normally. Do not create a replacement.'
  },
  status: 'generated',
  errors: []
};
await writeFile(path.join(root, 'logs/content', `${date}.json`), `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ content_id: contentId, slug, source_hash: sourceHash, article_words: article.trim().split(/\s+/).length, caption_words: caption.trim().split(/\s+/).length, variants }, null, 2));
