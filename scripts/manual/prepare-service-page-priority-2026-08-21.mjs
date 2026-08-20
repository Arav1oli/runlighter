import path from 'node:path';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const date = '2026-08-21';
const slug = 'which-service-page-should-a-professional-services-firm-improve-first';
const contentId = `rl-${date}-${createHash('sha256').update(`${date}:${slug}`).digest('hex').slice(0, 10)}`;
const disclosure = 'This post has been automated so we can run lighter.';
const createdAt = new Date().toISOString();
const sourceInput = '/Users/adrianstock/.codex/generated_images/01a0216c-aede-71c0-a5d7-5a9ea3c2f139/exec-77c2a6ea-bfbe-4a2d-b6a6-3a84fe0a0969.png';
const outputDir = path.join(root, 'generated/drafts', date);
const sourcePath = path.join(outputDir, 'missing-front-door-source.png');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&apos;');

const article = `# Which service page should a professional-services firm improve first?

## Short answer

Improve the service page that sits at the intersection of strong commercial value, clear buyer intent and a weak current path to enquiry. For most established Sydney professional-services firms, that is not automatically the homepage or the service with the most search volume. It is the page for a valuable problem that suitable buyers are already trying to solve, where the firm can explain the fit clearly and offer a sensible next step.

Start with one service. Confirm what a suitable buyer needs to understand, repair the path from search or referral to the page, and make the enquiry route easy to use. Keep positioning, claims, advice and client-acceptance decisions with the firm's responsible people.

## Choose the commercial priority before the keyword

A page improvement should support a business decision, not just produce more traffic. Ask which service the firm wants more suitable conversations about over the next quarter.

Good candidates usually have a recognisable buyer problem, a meaningful commercial value, enough delivery capacity and a clear reason the firm is relevant. A Sydney accounting practice might prioritise a specialist advisory service rather than a broad page titled “Accounting”. A legal practice might choose one well-defined matter type rather than trying to make a single services page cover every possible need. A property, finance, recruitment or healthcare-administration business should apply the same discipline.

Write the intended conversation in plain English. For example: “We want more enquiries from established Sydney business owners who need help with this specific problem and are ready to discuss it.” That statement is more useful than chasing a broad phrase because it sets a boundary around the page, the audience and the next action.

## Score the candidate pages on five factors

You do not need a large SEO model to decide where to start. Compare a short list of genuine service priorities across five practical factors.

### 1. Commercial consequence

What happens if the buyer does nothing? The stronger page usually addresses a problem with a visible cost, risk, delay or missed opportunity. Do not manufacture urgency. Explain the consequence the firm can responsibly support.

### 2. Buyer intent

How close is the searcher or referral visitor to seeking help? A precise service question often signals more useful intent than a broad educational topic. Search data can inform the choice, but volume alone does not establish commercial fit.

### 3. Evidence and authority

Can the firm explain the service accurately, show the process and answer the questions buyers genuinely ask? Use only approved facts. Do not invent client results, statistics, testimonials or credentials to make the page look stronger.

### 4. Delivery capacity

Can the business handle more of this work now? Publishing a strong page for a service the team cannot deliver promptly creates another operational problem. Capacity, location, conflicts, risk checks and client acceptance remain human decisions.

### 5. Current path weakness

Is the service difficult to find, thinly explained or disconnected from the enquiry route? A valuable service may be buried in navigation, compressed into one sentence on the homepage or missing a clear next step. That is the front-door problem: the capability exists, but a ready buyer cannot reach it easily.

## Build one useful front door

Once the priority is clear, give the service its own focused path. The page should answer the buyer's first question near the top, explain who the service is for, describe the practical process and make the next step proportionate.

For professional services, a request for a short call is often more appropriate than an aggressive purchase button. State what the person should bring, what the firm will establish and what happens after the request. Link to the page from relevant navigation, articles and service summaries so it is not an isolated document.

The page should also work for referrals. Someone who already knows the firm's name may still need to confirm that it handles the exact issue, serves their location and offers a credible next step. Clear service pages support that decision even when Google was not the original source.

## Connect search, publishing and follow-up

A service page is one part of a managed system. Useful articles can answer narrower questions and link to the relevant service. Social and email publishing can carry approved expertise to the right audience. Local search signals can help a Sydney buyer understand where the firm operates. The enquiry then needs acknowledgement, ownership and human follow-up.

Run Lighter can coordinate that repeatable work around the systems already in use: prioritising the page, structuring the approved content, connecting internal links, publishing the supporting material and making the lead path visible. This is also why [marketing reporting should extend beyond clicks](/blog/what-should-a-marketing-report-show-beyond-clicks/). The useful measure is not only whether the page attracted attention, but whether suitable people reached the next step and were handled properly.

## Keep judgement with the firm

Automation can assemble approved facts, check missing fields, publish reviewed updates, preserve source identifiers and surface an unanswered enquiry. It should not decide whether a claim is legally or professionally appropriate, whether a person is a suitable client, how advice should be framed or whether the firm should accept the work.

Assign those decisions explicitly. The responsible expert approves the service definition and claims. The business owner or marketing lead approves the priority. The authorised team handles qualification and the relationship. The system reduces repeated production and chasing around those decisions.

## A practical first pass

Choose three candidate services and give each a simple score for commercial consequence, buyer intent, available evidence, delivery capacity and current path weakness. Select one. Rewrite the page around the buyer's first question. Add one clear next step. Connect the page to relevant site sections and one useful supporting article. Then review enquiries and follow-up before expanding the pattern.

That is usually more useful than rebuilding the entire website or publishing a large batch of near-identical location pages. One strong front door can prove the message and process before the business commits to a wider programme.

This post has been automated so we can run lighter.

If a valuable service is hard to find or explain on your current website, book an on-site automation review in Sydney, starting with a short workflow call. Run Lighter can trace the path from buyer question to page, enquiry and follow-up, then identify one controlled website and local-search priority while your experts keep the claims, advice and client decisions human.`;

const caption = `A valuable service can exist without having a usable front door.

For an established professional-services firm, the first website priority should sit where commercial value, clear buyer intent and a weak enquiry path meet.

Run Lighter can help prioritise one service page, connect the approved content and internal path, and make follow-up visible. Your experts keep positioning, claims, advice and client acceptance human.

This post has been automated so we can run lighter.

If a valuable service is hard to find or explain, request a short workflow call.

#RunLighter #SydneyBusiness #ProfessionalServices #LocalSearch`;

const directAnswer = 'Improve the service page that sits at the intersection of strong commercial value, clear buyer intent and a weak current path to enquiry.';
const primaryKeyword = 'professional services website service page';
const secondaryKeywords = ['professional services SEO Sydney', 'service page strategy', 'local search priorities', 'website conversion path'];

const candidates = [
  { rank: 1, concept: 'Missing Front Door', service_family: 'Website and local search priorities', qualified_buyer: 'Principal of an established Sydney legal, accounting, advisory, finance, property or healthcare-administration firm', consequence: 'A ready buyer cannot find, understand or reach a valuable service at the decision moment.', service_mechanism: 'Prioritise one commercially valuable service page, connect its internal and local-search path and make the enquiry route visible.', human_boundary: 'Experts retain positioning, claims, advice and client-acceptance decisions.', visual_event: 'A premium office doorway is suspended three metres above the footpath with no stairs while two ready buyers look up.', hook: 'YOUR BEST SERVICE HAS NO FRONT DOOR.', scores: { commercial_consequence: 19, buyer_service_fit: 20, one_second_visual: 20, stopping_power: 15, novelty: 15, mobile_brand_fit: 10 }, score: 99, decision: 'selected; clearest coverage gap, immediate commercial consequence and strongest one-second visual event' },
  { rank: 2, concept: 'Wrecking Ball Replacement', service_family: 'Existing-software integration', qualified_buyer: 'Established Sydney owner considering a major platform change', consequence: 'Working systems and team habits are disrupted before a smaller connection is tested.', service_mechanism: 'Trace the real workflow and connect existing software before considering replacement.', human_boundary: 'Leadership approves architecture, access, migration and change risk.', visual_event: 'A wrecking ball stops centimetres from a working switchboard.', hook: "DON'T REPLACE WHAT CAN CONNECT.", scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 19, stopping_power: 15, novelty: 13, mobile_brand_fit: 9 }, score: 93, decision: 'rejected because the website and local-search service gap is more urgent today' },
  { rank: 3, concept: 'Empty Publishing Belt', service_family: 'Articles, social and email publishing', qualified_buyer: 'Principal of a specialist Sydney firm with approved expertise but inconsistent publishing', consequence: 'Useful expertise never reaches the buyers it could help.', service_mechanism: 'Coordinate approved ideas through production, review, publishing and measurement.', human_boundary: 'Experts retain the point of view, claims and final approval.', visual_event: 'A large printing press runs while its delivery belt remains empty.', hook: 'GOOD IDEAS NEED A DELIVERY SYSTEM.', scores: { commercial_consequence: 17, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 14, mobile_brand_fit: 9 }, score: 91, decision: 'rejected because the empty belt depends more on the hook than the inaccessible door' },
  { rank: 4, concept: 'Unsigned Starting Lane', service_family: 'Client onboarding and handovers', qualified_buyer: 'Sydney legal, accounting or advisory principal', consequence: 'A signed client waits while checks and ownership remain unclear.', service_mechanism: 'Create the record, collect approved information and expose exceptions to the responsible person.', human_boundary: 'Risk, advice and acceptance decisions stay with authorised professionals.', visual_event: 'A starting flag drops while one runner remains locked outside the lane.', hook: "SIGNED DOESN'T MEAN STARTED.", scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 8, mobile_brand_fit: 9 }, score: 86, decision: 'rejected because onboarding and handoff themes are already overrepresented' },
  { rank: 5, concept: 'Vanishing Lead Chair', service_family: 'Paid acquisition and lead handling', qualified_buyer: 'Sydney agency or consultancy owner', consequence: 'Paid enquiries cool before a person owns the conversation.', service_mechanism: 'Acknowledge, route, assign and report every enquiry through one controlled path.', human_boundary: 'A person qualifies the lead and owns the sales conversation.', visual_event: 'A meeting chair rolls away just as the prospect reaches it.', hook: 'THE AD ARRIVED. NOBODY DID.', scores: { commercial_consequence: 19, buyer_service_fit: 19, one_second_visual: 17, stopping_power: 13, novelty: 8, mobile_brand_fit: 9 }, score: 85, decision: 'rejected because lead handoff has been used repeatedly' },
  { rank: 6, concept: 'Report Without a Finish Line', service_family: 'Campaign reporting and improvement', qualified_buyer: 'Owner of an established Sydney professional-service business running paid campaigns', consequence: 'Activity numbers hide whether suitable conversations occurred.', service_mechanism: 'Join spend, lead handling, qualification and commercial stages in one report.', human_boundary: 'The owner retains qualification, budget, offer and sales decisions.', visual_event: 'Runners stop at a scoreboard while the finish tape sits further ahead.', hook: 'THE REPORT STOPPED TOO EARLY.', scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 17, stopping_power: 13, novelty: 4, mobile_brand_fit: 9 }, score: 80, decision: 'rejected because campaign reporting was the 15 August package' },
  { rank: 7, concept: 'Data Goes Backwards', service_family: 'Administration and data movement', qualified_buyer: 'Operations lead in a Sydney recruitment, property or advisory business', consequence: 'Skilled staff retype the same customer facts and introduce avoidable errors.', service_mechanism: 'Capture approved information once and move it safely between existing systems.', human_boundary: 'People validate exceptions, access and sensitive information.', visual_event: 'A courier carries the same parcel back through the dispatch gate.', hook: 'WHY ENTER IT AGAIN?', scores: { commercial_consequence: 16, buyer_service_fit: 19, one_second_visual: 16, stopping_power: 12, novelty: 8, mobile_brand_fit: 9 }, score: 80, decision: 'rejected below threshold and too close to earlier duplicate-entry work' },
  { rank: 8, concept: 'Late Warning Siren', service_family: 'Reporting and visibility', qualified_buyer: 'Owner of a 10 to 50 person Sydney service business', consequence: 'The owner learns about risk only after a customer or employee escalates it.', service_mechanism: 'Surface agreed exceptions and overdue work before they become surprises.', human_boundary: 'The owner and team decide what the signals mean and how to respond.', visual_event: 'A warning siren starts only after water has crossed the threshold.', hook: 'THE WARNING CAME AFTER THE DAMAGE.', scores: { commercial_consequence: 18, buyer_service_fit: 18, one_second_visual: 18, stopping_power: 14, novelty: 5, mobile_brand_fit: 8 }, score: 81, decision: 'rejected below threshold and too close to prior early-warning work' }
];

await mkdir(outputDir, { recursive: true });
await copyFile(sourceInput, sourcePath);
const source = await readFile(sourcePath);
const sourceHash = sha256(source);
const fullDataUri = `data:image/png;base64,${source.toString('base64')}`;
const specs = { instagram: { width: 1080, height: 1350 }, hero: { width: 1600, height: 900 }, og: { width: 1200, height: 630 } };
const variants = {};

for (const [name, spec] of Object.entries(specs)) {
  const portrait = name === 'instagram';
  const panel = portrait ? 0 : Math.round(spec.width * 0.43);
  const imageX = portrait ? 0 : panel;
  const imageWidth = portrait ? spec.width : spec.width - panel;
  const titleX = portrait ? 54 : 58;
  const titleTop = portrait ? 122 : name === 'hero' ? 220 : 155;
  const titleSize = portrait ? 82 : name === 'hero' ? 74 : 55;
  const lineGap = Math.round(titleSize * 1.02);
  const panelMarkup = portrait ? '<rect width="1080" height="365" fill="#17352B" fill-opacity=".94"/>' : `<rect width="${panel}" height="${spec.height}" fill="#17352B"/>`;
  const footerH = portrait ? 70 : name === 'hero' ? 58 : 46;
  const footerY = spec.height - footerH;
  const brandSize = portrait ? 23 : name === 'hero' ? 24 : 18;
  const disclosureSize = portrait ? 19 : name === 'hero' ? 17 : 13;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">
  <rect width="${spec.width}" height="${spec.height}" fill="#17352B"/>
  <image href="${fullDataUri}" x="${imageX}" y="0" width="${imageWidth}" height="${spec.height}" preserveAspectRatio="xMidYMid slice"/>
  ${panelMarkup}
  <text x="${titleX}" y="62" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${brandSize}" font-weight="700" letter-spacing="4">RUN / LIGHTER</text>
  <rect x="${titleX}" y="80" width="142" height="7" rx="3" fill="#D8A62B"/>
  <text x="${titleX}" y="${titleTop}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">YOUR BEST SERVICE</text>
  <text x="${titleX}" y="${titleTop + lineGap}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">HAS NO</text>
  <text x="${titleX}" y="${titleTop + lineGap * 2}" fill="#D8A62B" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">FRONT DOOR.</text>
  <rect x="${portrait ? 28 : 0}" y="${footerY}" width="${portrait ? spec.width - 56 : panel}" height="${footerH}" ${portrait ? 'rx="10"' : ''} fill="#17352B" fill-opacity=".97"/>
  <text x="${portrait ? 54 : titleX}" y="${footerY + Math.round(footerH * .67)}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${disclosureSize}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
  const svgPath = path.join(outputDir, `${name}.svg`);
  const pngPath = path.join(outputDir, `${name}.png`);
  const webpPath = path.join(outputDir, `${name}.webp`);
  await writeFile(svgPath, `${svg.replace(fullDataUri, 'missing-front-door-source.png')}\n`, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(webpPath);
  variants[name] = { png: path.relative(root, pngPath), webp: path.relative(root, webpPath), svg: path.relative(root, svgPath), width: spec.width, height: spec.height };
}

const altText = 'Two business owners look up at a dark green office doorway suspended high above a Sydney footpath with no stairs or landing.';
const creative = {
  content_id: contentId, revision: 'missing-front-door-v1', run_date: date, created_at: createdAt, disclosure,
  brand: 'RUN / LIGHTER', alt_text: altText, background_provider: 'imagegen-photorealistic',
  source_asset_origin: 'fresh-imagegen-current-run', source_asset: `generated/drafts/${date}/missing-front-door-source.png`, source_asset_sha256: sourceHash,
  reused_generated_asset: false, owner_approved_prepared_asset: false,
  commercial_problem: 'A ready buyer cannot find, understand or reach a valuable professional service at the decision moment.',
  service_resolution: 'Prioritise one commercially valuable service page, connect its internal and local-search path and make the enquiry route visible.',
  overlay_copy: 'YOUR BEST SERVICE HAS NO FRONT DOOR.', variants
};

const brief = {
  content_id: contentId, date, campaign_day: 1, audience: 'Principals of established Sydney B2B and professional-service firms',
  problem: creative.commercial_problem, single_message: 'A valuable service needs a clear, findable path from buyer question to enquiry.',
  supporting_points: ['Choose commercial priority before search volume', 'Score service candidates on intent, evidence, capacity and path weakness', 'Build one focused page and connect it to supporting content', 'Keep claims, advice and client acceptance human'],
  desired_action: 'Request a short workflow call about one valuable service that is difficult to find or explain',
  topic: 'website and local-search priorities for professional services', service_family: 'Website and local search priorities',
  angle: 'Treat the first service page as a commercial front door, not a volume-first SEO exercise.',
  headline_options: ['Which service page should a professional-services firm improve first?', 'What should a professional-services firm fix on its website first?', 'How do I choose the first service page to improve?'],
  selected_headline: 'Which service page should a professional-services firm improve first?', social_headline: 'YOUR BEST SERVICE HAS NO FRONT DOOR.',
  caption_hook_options: ['A valuable service can exist without a usable front door.', 'Ready buyers cannot choose what they cannot reach.', 'Search volume is not the first business decision.'],
  selected_hook: 'A valuable service can exist without a usable front door.', caption_cta: 'Request a short workflow call.',
  visual_concept: 'A premium office doorway is suspended three metres above a Sydney footpath with no stairs while two ready buyers look up.',
  visual_format: 'surreal high-key professional-services street editorial',
  image_generation_prompt: 'Fresh current-run photorealistic Sydney professional-services streetscape with a premium doorway suspended three metres above the footpath and no stairs. No text, logos, signage, office interior, desk, pot plant, robot, hologram or decorative landmark.',
  overlay_copy: ['YOUR BEST SERVICE HAS NO FRONT DOOR.'],
  article_outline: ['Short answer', 'Choose the commercial priority', 'Score five factors', 'Build one useful front door', 'Connect search, publishing and follow-up', 'Keep judgement human', 'Practical first pass'],
  search_question: 'Which service page should a professional-services firm improve first?', search_intent: 'informational and commercial investigation', buyer_stage: 'problem aware', direct_answer: directAnswer,
  search_plan_id: 'daily-commercial-2026-08-21', primary_keyword: primaryKeyword, secondary_keywords: secondaryKeywords, source_urls: [],
  promotion_hypothesis: 'The impossible doorway makes an invisible website problem physically obvious and leads directly to a live Run Lighter managed-marketing service.',
  risk_notes: ['Do not promise rankings or lead volume', 'Do not invent proof or search data', 'Do not broaden beyond Sydney professional services', 'Do not use the organic post as paid creative']
};

const content = {
  content_id: contentId, date, campaign_day: 1, title: brief.selected_headline, slug, updated: date, status: 'draft',
  excerpt: 'Choose the service page where commercial value, clear buyer intent and a weak current enquiry path meet.',
  description: 'A practical way for Sydney professional-services firms to choose the first service page worth improving.',
  seo_title: 'Which Professional-Services Page Should You Improve First?',
  meta_description: 'Choose the first professional-services page to improve using commercial value, buyer intent, evidence, capacity and the current enquiry path.',
  author: 'Run Lighter', tags: [primaryKeyword, ...secondaryKeywords], category: 'Marketing systems',
  hero_image: `/generated/drafts/${date}/hero.webp`, hero_image_fallback: `/generated/drafts/${date}/hero.png`, hero_image_alt: altText,
  og_image: `/generated/drafts/${date}/og.png`, instagram_image: `/generated/drafts/${date}/instagram.png`, dimensions: { instagram: '1080x1350', hero: '1600x900', open_graph: '1200x630' },
  instagram_caption: caption, instagram_media_id: '', article_markdown: article, automation_disclosure: disclosure, source_urls: [], is_topical: false,
  search_question: brief.search_question, direct_answer: directAnswer, search_intent: brief.search_intent, buyer_stage: brief.buyer_stage, search_plan_id: brief.search_plan_id,
  primary_keyword: primaryKeyword, secondary_keywords: secondaryKeywords, canonical_url: `https://runlighter.com/blog/${slug}/`,
  reading_time: Math.ceil(article.trim().split(/\s+/).length / 220), promotion_score: 99, promotion_candidate: true,
  promotion_reason: 'Dedicated service-rotation gap, professional-services buyer fit, strong commercial consequence and a one-second visual event.',
  suggested_paid_audience: 'Principals of established Sydney B2B and professional-service firms',
  suggested_ad_primary_text: 'A valuable service can exist without a usable path from buyer question to enquiry. Prioritise one page before rebuilding everything.',
  suggested_ad_headline: 'Give your best service a front door', suggested_ad_description: 'Request a short workflow call.', creative,
  created_at: createdAt, published_at: '', updated_at: createdAt
};

const intelligence = {
  run_date: date, timezone: 'Australia/Sydney', commercial_focus: 'Qualified Sydney owner conversations in established B2B and professional-service businesses',
  thirty_day_coverage_audit: {
    period: '2026-07-22 to 2026-08-20', source: 'data/content-registry.json, publication logs and current Business Suite content library',
    findings: [
      'Business automation, owner dependency, approvals and handoffs dominate the registered packages.',
      'Campaign reporting received a dedicated package on 15 August.',
      'Manual social posts on 17 and 20 August returned to generic automation and time-saving claims and were not coordinated website packages.',
      'Website and local search priorities remain the clearest live-service coverage gap.',
      'Articles, social and email publishing also remain thin and should rotate into a later successful package.',
      'Recent visual history overused work-stuck, relay, scoreboard and operational-still-life grammar. The impossible doorway is a new scale-shift visual archetype.'
    ]
  },
  rolling_seven_service_mix: { result_before_today: 'insufficient recent coordinated daily packages; select the strongest underrepresented managed-marketing service instead of manufacturing parity' },
  rejected_repetitive_themes: ['owner bottlenecks', 'stuck work', 'conflicting rules', 'approvals', 'handoffs', 'generic time-saving', 'passive arrangements of work objects'],
  recent_first_party_signal: 'Exact authorised Meta evidence for 14 to 20 August showed A$156.26 spend, 5 Leads (Form) and A$31.25 CPL. Exact 22 July to 20 August showed A$388.73 spend, 17 Leads (Form) and A$22.87 CPL. No qualified or converted outcome was established.',
  concepts: candidates,
  selected_concept: { commercial_failure: creative.commercial_problem, service_mechanism: creative.service_resolution, human_boundary: candidates[0].human_boundary, one_second_mute_test: 'At roughly 20 per cent size, the suspended door and two people looking up remain immediately clear. The viewer reads an inaccessible valuable destination before reading the hook.', source_asset: creative.source_asset, source_asset_sha256: sourceHash },
  final_prepublication_challenge: {
    live_service: 'Website and local search priorities', capability_added: 'A dedicated commercial story about choosing and connecting one valuable professional-services page.', materially_different_from_last_seven: true,
    one_second_message: 'The valuable destination exists but buyers cannot reach it.', qualified_owner_reason: 'A ready buyer may miss a profitable service because the website does not provide a clear path to it.',
    engaging_not_merely_competent: 'The impossible suspended doorway uses scale, jeopardy and restrained visual humour rather than a passive business scene.'
  },
  rolling_four_audience_mix: { professional_service_or_b2b_led: 4, trade_or_field_service_led: 0, result: 'pass' },
  red_team: { generic_ai_copy: false, vague_workflow_diagram: false, passive_still_life: false, decorative_office: false, robot_or_hologram: false, invented_proof: false, trades_led: false, main_copy_words: 7 }
};

await writeFile(path.join(outputDir, 'creative-manifest.json'), `${JSON.stringify(creative, null, 2)}\n`, 'utf8');
await mkdir(path.join(root, '_content/blog'), { recursive: true });
await writeFile(path.join(root, '_content/blog', `${slug}.json`), `${JSON.stringify(content, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/daily-briefs', `${date}.json`), `${JSON.stringify(brief, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/content-intelligence', `${date}.json`), `${JSON.stringify(intelligence, null, 2)}\n`, 'utf8');

const registryPath = path.join(root, 'data/content-registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const entry = { content_id: contentId, date, campaign_day: 1, topic: brief.topic, angle: brief.angle, headline: content.title, hook: brief.selected_hook, visual_format: brief.visual_format, keywords: secondaryKeywords, source_urls: [], article_slug: slug, image_path: content.hero_image, caption_hash: sha256(caption), article_hash: sha256(article), status: 'generated', website_url: '', instagram_media_id: '', promotion_score: 99, created_at: createdAt, published_at: '', error: null };
const existingIndex = registry.entries.findIndex(item => item.date === date || item.content_id === contentId);
if (existingIndex >= 0) registry.entries[existingIndex] = { ...registry.entries[existingIndex], ...entry }; else registry.entries.push(entry);
registry.entries.sort((left, right) => left.date.localeCompare(right.date));
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');

const queue = { content_id: contentId, date, slug, status: 'generated', validated: false, scheduled_publish_time: '09:00', website_published: false, instagram_published: false, facebook_published: false, attempts: { website: 0, instagram: 0, facebook: 0 }, last_error: null, prepared_social_asset: `generated/drafts/${date}/instagram.png`, caption_source: `_content/blog/${slug}.json` };
await writeFile(path.join(root, 'data/publish-queue', `${date}.json`), `${JSON.stringify(queue, null, 2)}\n`, 'utf8');

const audit = {
  content_id: contentId, date, local_timezone: 'Australia/Sydney', stage_started_at: createdAt, stage_completed_at: '', publish_started_at: '', publish_completed_at: '',
  candidate_topics: candidates, selected_topic: intelligence.selected_concept, service_coverage: intelligence.thirty_day_coverage_audit, sources: [],
  generation_models: { text: { provider: 'manual' }, image: { provider: 'imagegen', source_hash: sourceHash }, research: { provider: 'none', note: 'Evergreen buyer question. Live first-party evidence is recorded separately.' } },
  validation_results: [], website: {}, instagram: {}, facebook: {}, promotion: { score: 99, candidate: true },
  meta_ads_health: {
    scope: { business_id: '2419577311552088', business_suite_asset_id: '1171129046091419', page_id: '61592301111343', instagram: 'run_lighter', ad_account_id: '264193331473545', campaign_id: '120252651440610735', ad_set_id: '120252651440620735' },
    seven_days: { range: '2026-08-14 to 2026-08-20 inclusive, Sydney Time', spend_aud: 156.26, leads: 5, result_label: 'Leads (Form)', cpl_aud: 31.25 },
    thirty_days: { range: '2026-07-22 to 2026-08-20 inclusive, Sydney Time', spend_aud: 388.73, leads: 17, result_label: 'Leads (Form)', cpl_aud: 22.87 },
    ad_level_observations: [
      { ad: 'R L 1 - Copy 2', status: 'active', spend_7d_aud: 132.81, leads_7d: 5, cpl_7d_aud: 26.56, spend_30d_aud: 132.81, leads_30d: 5, cpl_30d_aud: 26.56 },
      { ad: 'R L 1 - Copy 3', status: 'active', spend_30d_aud: 6.85, leads_30d: 0, cpl_30d_aud: null },
      { ad: 'R L 1', status: 'off', leads_30d: 7, cpl_30d_aud: 12.77 },
      { ad: 'R L distroy data entry', status: 'off', leads_30d: 2, cpl_30d_aud: 11.40 },
      { ad: 'RL | Trades missed calls | 2026-07-28', status: 'off', leads_30d: 1, cpl_30d_aud: 11.19 },
      { ad: 'RL | Owner dependency | 2026-07-28', status: 'off', leads_30d: 2, cpl_30d_aud: 13.16 }
    ],
    recommendations: {
      keep: 'Keep R L 1 - Copy 2 under observation. It produced 5 form leads at A$26.56 CPL over both the exact 7-day and 30-day windows, but no qualified or converted outcome is established.',
      pause_candidate: 'R L 1 - Copy 3 is the current pause candidate. It is active and spent A$6.85 over 30 days with 0 form leads. This is a recommendation only.',
      next_test: 'Test the missing-front-door proposition only as a separate uploaded paid creative with its own ad-level CTA after explicit authority. Do not use the organic post as ad creative.'
    },
    preexisting_unpublished_changes_preserved: 2, changes_made: false, budget_changed: false
  },
  recent_social: {
    source: 'Authorised Business Suite content library',
    observations: [
      { id: '18102254579068387', platform: 'Instagram', published: '2026-08-20 11:09 AEST', format: 'Reel', reach: 72, shares: 0, likes_and_reactions: 0, note: 'Generic automation and unverified time-saving claim. Not used as a proof source.' },
      { id: '122108483097410037', platform: 'Facebook and Instagram', published: '2026-08-17 11:08 AEST', format: 'Photo crosspost', reach: 0, shares: 0, likes_and_reactions: 0 },
      { id: '122108479869410037', platform: 'Facebook and Instagram', published: '2026-08-17 10:25 AEST', format: 'Photo crosspost', reach: 0, shares: 0, likes_and_reactions: 0 },
      { id: '122108121393410037', platform: 'Facebook and Instagram', published: '2026-08-15 17:34 AEST', format: 'Photo crosspost', reach: 1, shares: 0, likes_and_reactions: 0 }
    ],
    interpretation: 'The latest posts provide no evidence-backed creative or commercial winner. Today avoids generic automation, time-back and conversion claims.'
  },
  lead_path: {
    existing_zap_id: '374752461', title: 'Run Lighter Meta Lead -> n8n v2', connector_state: 'on', configured: true, paused: false, last_live_at: '2026-08-16T06:50:15Z',
    definition_inspection: 'failed', definition_error: 'The Zapier definition-inspection action failed and the signed-in Chrome session redirected to Zapier login.',
    trigger_actions_mapping_acknowledgement_reverified_today: false, prior_authorised_form_id: '1049875634638986', duplicate_created: false,
    recovery_action: 'Open existing Zap 374752461 in an authenticated session and reverify trigger, actions, field mapping, destination and acknowledgement. Do not create a replacement.'
  },
  communication_window: { checked_at: createdAt, local_time_at_start: '09:06 AEST', permitted: true, final_submission_recheck_required: true },
  status: 'generated', errors: []
};
await writeFile(path.join(root, 'logs/content', `${date}.json`), `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ content_id: contentId, slug, source_hash: sourceHash, article_words: article.trim().split(/\s+/).length, caption_words: caption.trim().split(/\s+/).length, variants }, null, 2));
