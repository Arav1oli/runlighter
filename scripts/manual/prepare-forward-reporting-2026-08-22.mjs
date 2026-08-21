import path from 'node:path';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const date = '2026-08-22';
const slug = 'how-can-a-service-business-get-useful-weekly-reporting-without-more-manual-work';
const contentId = `rl-${date}-${createHash('sha256').update(`${date}:${slug}`).digest('hex').slice(0, 10)}`;
const disclosure = 'This post has been automated so we can run lighter.';
const createdAt = new Date().toISOString();
const sourceInput = '/Users/adrianstock/.codex/generated_images/01a02693-22aa-7301-b916-090b738d4b7e/exec-b848a22c-72bb-4818-b82f-c56d50b2355b.png';
const outputDir = path.join(root, 'generated/drafts', date);
const sourcePath = path.join(outputDir, 'rear-view-reporting-source.png');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&apos;');

const article = `# How can a service business get useful weekly reporting without more manual work?

## Short answer

Start with the decisions the owner and team need to make each week, then connect only the facts required for those decisions. A useful weekly report should show what entered the business, what moved, what is waiting, which exceptions need attention and which commercial questions still require human judgement.

Do not begin by rebuilding every dashboard or replacing working software. Agree on a small set of definitions, identify the reliable source for each fact and automate the routine collection and checking around them. The result should help the business look forward, not spend another Monday reconstructing last month.

## Start with decisions, not a dashboard

Reporting becomes expensive when a business collects numbers without deciding what they are for. A Sydney accounting, legal, finance, insurance, recruitment, property, agency or healthcare-administration team may have useful information spread across its CRM, inbox, finance system, project tool and marketing platforms. Copying all of it into one large spreadsheet does not automatically make the information useful.

List the decisions that recur each week. Which enquiries need an owner? Which work has stopped moving? Which client commitments are approaching? Which records are incomplete? Which invoices, campaign results or capacity signals need a closer look? The report exists to support those questions.

Keep the first version narrow. If a field does not change a decision, trigger a sensible action or expose a meaningful exception, it probably does not belong in the first weekly view.

## Give every fact a definition and source

Two systems can use the same word differently. A marketing platform may count a form submission as a lead. A CRM may treat a lead as a person with enough information for follow-up. The owner may care only about suitable conversations with real decision-makers.

Those measures can all be valid, but they are not interchangeable. Define each important term in plain English and nominate the system or person responsible for it. For example, the advertising platform can remain the source for spend and form leads. The CRM can remain the source for assigned, qualified and converted stages. The owner or authorised salesperson keeps the judgement about whether the opportunity is commercially suitable.

This prevents a polished report from quietly joining incompatible numbers. It also makes missing data visible. An honest blank or exception is more useful than a value assembled from guesswork.

## Connect the systems already in use

Weekly reporting should not require an immediate platform replacement. Start by tracing where the required facts already live and how they can move safely.

A controlled workflow might collect approved fields from the CRM, finance tool and campaign platform, normalise dates or identifiers, check for missing owners and write the agreed summary to one reporting view. It can preserve source links so a person can inspect the original record when context matters.

Access should stay limited to what the workflow needs. Sensitive client, employee and financial information should not be copied into another tool merely because it is convenient. The owner remains responsible for access, retention and the commercial use of the report.

## Report exceptions before totals

Totals describe what has already accumulated. Exceptions show where action may still change the result.

A practical weekly view can bring the exceptions to the top: an enquiry without an owner, an agreed follow-up that has not happened, a project with no recent movement, a missing approval, an unissued invoice or a campaign producing activity without a recorded qualification outcome. The exact exceptions depend on the service and the systems in use.

Automation can identify records that match agreed rules. It should not decide whether a client is valuable, whether advice is appropriate, whether a deadline can move or why performance changed. Those decisions need the people who understand the relationship and the business context.

## Separate campaign activity from commercial progress

Marketing reporting is a useful example. Spend, impressions, clicks and form leads explain activity. They do not prove that a suitable Sydney owner had a conversation, booked work or became a paying client.

The reporting path should preserve both levels. Keep the platform measures, then connect the lead-handling stages that show acknowledgement, ownership, qualification and outcome. This makes it possible to ask where the commercial path is weakening without pretending the advertising platform knows what happened after the form.

Run Lighter has a separate guide to [what a marketing report should show beyond clicks](/blog/what-should-a-marketing-report-show-beyond-clicks/). The same principle applies across operations: report the movement that matters, not only the easiest activity to count.

## Build a repeatable weekly rhythm

The system should prepare the routine evidence before the review, not replace the review itself. A useful rhythm is simple:

1. Collect the agreed facts from their nominated sources.
2. Check identifiers, dates, ownership and missing fields.
3. Surface exceptions and material changes first.
4. Let the responsible people add context and make decisions.
5. Record the owner and next action for each agreed exception.
6. Improve the definitions only when the team learns something useful.

That is more sustainable than rebuilding a presentation every week. It also creates an audit trail of what the team saw, what remained uncertain and who decided the next step.

## A practical first pass

Choose one weekly meeting or owner review. Write down the five questions it is meant to answer. For each question, identify the smallest reliable fact, its source and the person who interprets it. Then trace how those facts are collected today.

Automate one repeated collection or checking step. Keep the original source visible, fail safely when data is missing and review whether the new view changes a real decision. If it does, expand carefully. If it does not, remove the noise before adding more metrics.

This post has been automated so we can run lighter.

If your weekly report is still assembled by hand and arrives after the decisions it should support, book an on-site automation review in Sydney. Run Lighter can trace one reporting workflow, connect the reliable facts already in your systems and build one controlled forward-looking view while your team keeps interpretation, relationships and decisions human.`;

const caption = `Last month cannot steer this week.

Useful reporting starts with the decisions an owner and team need to make now. It connects the smallest reliable facts already in your systems, surfaces exceptions and keeps the original source visible.

Run Lighter can trace one weekly reporting workflow and automate the routine collection and checking around it. Your people keep interpretation, client context, priorities and commercial decisions human.

This post has been automated so we can run lighter.

If the report arrives after the decision, request a short workflow call.

#RunLighter #SydneyBusiness #ProfessionalServices #BusinessReporting`;

const directAnswer = 'Start with the decisions the owner and team need to make each week, then connect only the facts required for those decisions.';
const primaryKeyword = 'weekly business reporting automation';
const secondaryKeywords = ['service business reporting Sydney', 'automated weekly reporting', 'business reporting workflow', 'professional services dashboard'];

const candidates = [
  { rank: 1, concept: 'Rear-view Reporting', service_family: 'Reporting and visibility', qualified_buyer: 'Owner of an established Sydney professional-service business', consequence: 'Important weekly decisions are made from old snapshots assembled after the useful moment has passed.', service_mechanism: 'Connect agreed facts from existing systems, surface current exceptions and preserve source links in one weekly operating view.', human_boundary: 'The owner and responsible team interpret context, priorities, risk and commercial decisions.', visual_event: 'An oversized rear-view mirror blocks almost the entire windscreen of a parked right-hand-drive car.', hook: "LAST MONTH CAN'T STEER THIS WEEK.", scores: { commercial_consequence: 19, buyer_service_fit: 20, one_second_visual: 20, stopping_power: 15, novelty: 15, mobile_brand_fit: 9 }, score: 98, decision: 'selected; strongest fresh service gap, immediate jeopardy and clearest one-second forward-versus-backward idea' },
  { rank: 2, concept: 'Lead Down the Drain', service_family: 'Paid acquisition and lead handling', qualified_buyer: 'Sydney consultancy or agency owner buying lead generation', consequence: 'A paid enquiry disappears before a person owns the conversation.', service_mechanism: 'Acknowledge, route, assign and report every enquiry through one controlled path.', human_boundary: 'A person qualifies the lead and owns the sales conversation.', visual_event: 'A bright notification token rolls towards an open street drain while a hand reaches too late.', hook: 'FOLLOW-UP HAS AN EXPIRY TIME.', scores: { commercial_consequence: 20, buyer_service_fit: 19, one_second_visual: 19, stopping_power: 15, novelty: 8, mobile_brand_fit: 9 }, score: 90, decision: 'rejected because lead-loss and handoff themes are already overrepresented' },
  { rank: 3, concept: 'Publishing Blackout', service_family: 'Articles, social and email publishing', qualified_buyer: 'Principal of a specialist Sydney firm with approved expertise but inconsistent publishing', consequence: 'Useful expertise never reaches the buyers it could help.', service_mechanism: 'Coordinate approved ideas through production, review, publication and measurement.', human_boundary: 'Experts retain the point of view, claims and final approval.', visual_event: 'A live speaker addresses a full room through a microphone whose cable is visibly severed.', hook: 'YOUR EXPERTISE IS OFFLINE.', scores: { commercial_consequence: 17, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 14, mobile_brand_fit: 9 }, score: 91, decision: 'rejected because the reporting concept has a more immediate owner decision and stronger service fit today' },
  { rank: 4, concept: 'Software Wrecking Ball', service_family: 'Existing-software integration', qualified_buyer: 'Established Sydney owner considering a major platform replacement', consequence: 'Working systems and team habits are disrupted before a smaller connection is tested.', service_mechanism: 'Trace the real workflow and connect existing software before considering replacement.', human_boundary: 'Leadership approves architecture, access, migration and change risk.', visual_event: 'A wrecking ball stops centimetres from a working switchboard while one small cable remains visibly unplugged.', hook: "DON'T REPLACE WHAT CAN CONNECT.", scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 19, stopping_power: 15, novelty: 12, mobile_brand_fit: 9 }, score: 92, decision: 'rejected because reporting and visibility is a clearer current service-rotation gap' },
  { rank: 5, concept: 'Client Data Treadmill', service_family: 'Administration and data movement', qualified_buyer: 'Operations lead in a Sydney recruitment, property or advisory business', consequence: 'Skilled staff repeatedly re-enter the same client facts and introduce avoidable errors.', service_mechanism: 'Capture approved information once and move it safely between existing systems.', human_boundary: 'People validate exceptions, access and sensitive information.', visual_event: 'The same sealed client parcel circles a treadmill past three people who each relabel it.', hook: 'WHY ENTER IT AGAIN?', scores: { commercial_consequence: 17, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 13, novelty: 10, mobile_brand_fit: 9 }, score: 86, decision: 'rejected because duplicate-entry work has already appeared in the content history' },
  { rank: 6, concept: 'Locked Client Start', service_family: 'Client onboarding and handovers', qualified_buyer: 'Sydney legal, accounting or advisory principal', consequence: 'A signed client waits while checks and ownership remain unclear.', service_mechanism: 'Create the record, collect approved information and expose exceptions to the responsible person.', human_boundary: 'Risk, advice and acceptance decisions stay with authorised professionals.', visual_event: 'A signed client is ready in a starting lane while the gate remains padlocked after the flag drops.', hook: 'SIGNED. STILL NOT STARTED.', scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 8, mobile_brand_fit: 9 }, score: 86, decision: 'rejected because onboarding and handoff themes are already overrepresented' },
  { rank: 7, concept: 'Search Dead End', service_family: 'Website and local search priorities', qualified_buyer: 'Principal of an established Sydney professional-service firm', consequence: 'A ready buyer reaches a valuable service but cannot find a clear next step.', service_mechanism: 'Prioritise one service page, connect its internal and local-search path and expose the enquiry route.', human_boundary: 'Experts retain positioning, claims, advice and client-acceptance decisions.', visual_event: 'A clearly marked destination lane ends one metre before an open business entrance.', hook: 'READY BUYERS NEED A NEXT STEP.', scores: { commercial_consequence: 18, buyer_service_fit: 20, one_second_visual: 18, stopping_power: 13, novelty: 3, mobile_brand_fit: 9 }, score: 81, decision: 'rejected below threshold because yesterday used the same website access problem' },
  { rank: 8, concept: 'Alarm After Impact', service_family: 'Campaign reporting and improvement', qualified_buyer: 'Owner of a Sydney professional-service business running paid campaigns', consequence: 'The team celebrates activity before it sees that suitable conversations are not progressing.', service_mechanism: 'Join spend, lead handling, qualification and commercial stages in one report.', human_boundary: 'The owner retains qualification, budget, offer and sales decisions.', visual_event: 'A warning siren lights only after a runner has already passed the real finish line.', hook: 'THE REPORT STOPPED TOO EARLY.', scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 16, stopping_power: 13, novelty: 4, mobile_brand_fit: 8 }, score: 78, decision: 'rejected below threshold and too close to the 15 August campaign-reporting package' }
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
  const titleTop = portrait ? 132 : name === 'hero' ? 220 : 155;
  const titleSize = portrait ? 88 : name === 'hero' ? 72 : 53;
  const lineGap = Math.round(titleSize * 1.03);
  const panelMarkup = portrait ? '<rect width="1080" height="380" fill="#17352B" fill-opacity=".94"/>' : `<rect width="${panel}" height="${spec.height}" fill="#17352B"/>`;
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
  <text x="${titleX}" y="${titleTop}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">LAST MONTH</text>
  <text x="${titleX}" y="${titleTop + lineGap}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">CAN&apos;T STEER</text>
  <text x="${titleX}" y="${titleTop + lineGap * 2}" fill="#D8A62B" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">THIS WEEK.</text>
  <rect x="${portrait ? 28 : 0}" y="${footerY}" width="${portrait ? spec.width - 56 : panel}" height="${footerH}" ${portrait ? 'rx="10"' : ''} fill="#17352B" fill-opacity=".97"/>
  <text x="${portrait ? 54 : titleX}" y="${footerY + Math.round(footerH * .67)}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${disclosureSize}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
  const svgPath = path.join(outputDir, `${name}.svg`);
  const pngPath = path.join(outputDir, `${name}.png`);
  const webpPath = path.join(outputDir, `${name}.webp`);
  await writeFile(svgPath, `${svg.replace(fullDataUri, 'rear-view-reporting-source.png')}\n`, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(webpPath);
  variants[name] = { png: path.relative(root, pngPath), webp: path.relative(root, webpPath), svg: path.relative(root, svgPath), width: spec.width, height: spec.height };
}

const altText = 'A business owner sits in the right-hand driver seat of a parked car while an oversized rear-view mirror blocks most of the Sydney street ahead.';
const creative = {
  content_id: contentId, revision: 'forward-reporting-v1', run_date: date, created_at: createdAt, disclosure,
  brand: 'RUN / LIGHTER', alt_text: altText, background_provider: 'imagegen-photorealistic',
  source_asset_origin: 'fresh-imagegen-current-run', source_asset: `generated/drafts/${date}/rear-view-reporting-source.png`, source_asset_sha256: sourceHash,
  reused_generated_asset: false, owner_approved_prepared_asset: false,
  commercial_problem: 'Important weekly decisions are made from old snapshots assembled after the useful moment has passed.',
  service_resolution: 'Connect agreed facts from existing systems, surface current exceptions and preserve source links in one weekly operating view.',
  overlay_copy: "LAST MONTH CAN'T STEER THIS WEEK.", variants
};

const brief = {
  content_id: contentId, date, campaign_day: 1, audience: 'Owners of established Sydney B2B and professional-service firms',
  problem: creative.commercial_problem, single_message: 'Weekly reporting should support the decisions ahead rather than reconstructing the month behind.',
  supporting_points: ['Start with recurring decisions, not a dashboard', 'Give each important fact a definition and reliable source', 'Surface current exceptions before totals', 'Automate collection and checking while keeping interpretation human'],
  desired_action: 'Request a short workflow call about one weekly report still assembled by hand',
  topic: 'weekly reporting and visibility for service businesses', service_family: 'Reporting and visibility',
  angle: 'Build one forward-looking weekly operating view from the reliable facts already in use.',
  headline_options: ['How can a service business get useful weekly reporting without more manual work?', 'What should a useful weekly service-business report show?', 'How do I automate weekly reporting without replacing every system?'],
  selected_headline: 'How can a service business get useful weekly reporting without more manual work?', social_headline: "LAST MONTH CAN'T STEER THIS WEEK.",
  caption_hook_options: ['Last month cannot steer this week.', 'A report should arrive before the decision.', 'Useful reporting starts with the decision, not the dashboard.'],
  selected_hook: 'Last month cannot steer this week.', caption_cta: 'Request a short workflow call.',
  visual_concept: 'A parked right-hand-drive car whose oversized rear-view mirror blocks almost the entire view ahead.',
  visual_format: 'surreal Sydney documentary reporting metaphor',
  image_generation_prompt: 'Fresh current-run editorial Sydney photograph from inside a parked right-hand-drive car with an impossibly oversized rear-view mirror blocking the road ahead. No text, logos, dashboards, papers, charts, screens, office, robot or hologram.',
  overlay_copy: ["LAST MONTH CAN'T STEER THIS WEEK."],
  article_outline: ['Short answer', 'Start with decisions', 'Define each fact and source', 'Connect existing systems', 'Report exceptions', 'Separate campaign activity from progress', 'Build a weekly rhythm', 'Practical first pass'],
  search_question: 'How can a service business get useful weekly reporting without more manual work?', search_intent: 'informational and commercial investigation', buyer_stage: 'problem aware', direct_answer: directAnswer,
  search_plan_id: 'daily-commercial-2026-08-22', primary_keyword: primaryKeyword, secondary_keywords: secondaryKeywords, source_urls: [],
  promotion_hypothesis: 'The giant rear-view mirror makes old reporting physically obstructive and leads directly to a live Run Lighter reporting-and-visibility service.',
  risk_notes: ['Do not promise savings or business results', 'Do not invent proof or benchmark data', 'Do not copy sensitive facts between systems unnecessarily', 'Do not use the organic post as paid creative']
};

const content = {
  content_id: contentId, date, campaign_day: 1, title: brief.selected_headline, slug, updated: date, status: 'draft',
  excerpt: 'Build a weekly report around decisions, reliable sources and current exceptions rather than another manual spreadsheet.',
  description: 'A practical way for Sydney service businesses to automate useful weekly reporting without replacing every system.',
  seo_title: 'How to Automate Useful Weekly Service-Business Reporting',
  meta_description: 'Build useful weekly business reporting around decisions, reliable sources and current exceptions without another manual spreadsheet.',
  author: 'Run Lighter', tags: [primaryKeyword, ...secondaryKeywords], category: 'Business automation',
  hero_image: `/generated/drafts/${date}/hero.webp`, hero_image_fallback: `/generated/drafts/${date}/hero.png`, hero_image_alt: altText,
  og_image: `/generated/drafts/${date}/og.png`, instagram_image: `/generated/drafts/${date}/instagram.png`, dimensions: { instagram: '1080x1350', hero: '1600x900', open_graph: '1200x630' },
  instagram_caption: caption, instagram_media_id: '', article_markdown: article, automation_disclosure: disclosure, source_urls: [], is_topical: false,
  search_question: brief.search_question, direct_answer: directAnswer, search_intent: brief.search_intent, buyer_stage: brief.buyer_stage, search_plan_id: brief.search_plan_id,
  primary_keyword: primaryKeyword, secondary_keywords: secondaryKeywords, canonical_url: `https://runlighter.com/blog/${slug}/`,
  reading_time: Math.ceil(article.trim().split(/\s+/).length / 220), promotion_score: 98, promotion_candidate: true,
  promotion_reason: 'Underrepresented reporting-and-visibility service, strong professional-services fit, immediate commercial consequence and a fresh one-second visual event.',
  suggested_paid_audience: 'Owners of established Sydney B2B and professional-service firms',
  suggested_ad_primary_text: 'A weekly report should support the decisions ahead, not reconstruct the month behind. Start with one controlled reporting workflow.',
  suggested_ad_headline: 'Build a forward-looking weekly report', suggested_ad_description: 'Request a short workflow call.', creative,
  created_at: createdAt, published_at: '', updated_at: createdAt
};

const adRows30 = [
  { ad: 'R L 1 - Copy 3', delivery: 'In draft', spend_aud: 0, leads: 0, cpl_aud: null },
  { ad: 'R L 1 - Copy', delivery: 'In draft', spend_aud: 0, leads: 0, cpl_aud: null },
  { ad: 'R L 1 - Copy 3', delivery: 'Campaign off', spend_aud: 7.05, leads: 0, cpl_aud: null },
  { ad: 'R L 1 - Copy 2', delivery: 'Campaign off', spend_aud: 136.33, leads: 5, cpl_aud: 27.27 },
  { ad: 'RL | $0 review | Violet Lime | 2026-07-29', delivery: 'Off', spend_aud: 1.21, leads: 0, cpl_aud: null },
  { ad: 'R L distroy data entry', delivery: 'Off', spend_aud: 22.46, leads: 2, cpl_aud: 11.23 },
  { ad: 'RL | $0 review | Cobalt Yellow | 2026-07-29 - Copy', delivery: 'Off', spend_aud: 0.07, leads: 0, cpl_aud: null },
  { ad: 'R L 1 - Copy 2', delivery: 'Off', spend_aud: 27.83, leads: 0, cpl_aud: null },
  { ad: 'RL | $0 review | Cobalt Yellow | 2026-07-29', delivery: 'Off', spend_aud: 14.96, leads: 0, cpl_aud: null },
  { ad: 'RL | Extra hour | Real photo | 2026-08-04', delivery: 'Off', spend_aud: 11.96, leads: 0, cpl_aud: null },
  { ad: 'RL | Missed calls become missed jobs | 2026-08-10', delivery: 'Off', spend_aud: 4.05, leads: 0, cpl_aud: null },
  { ad: 'RL | Automation evens the race | 2026-08-05', delivery: 'Off', spend_aud: 32.45, leads: 0, cpl_aud: null },
  { ad: 'RL | Ad worked, handoff did not | 2026-08-11', delivery: 'Off', spend_aud: 0.39, leads: 0, cpl_aud: null },
  { ad: 'RL | Busy hands missed jobs | 2026-07-30', delivery: 'Off', spend_aud: 1.56, leads: 0, cpl_aud: null },
  { ad: 'R L pro', delivery: 'Off', spend_aud: 0, leads: 0, cpl_aud: null },
  { ad: 'RL | Second shift admin | 2026-07-30', delivery: 'Off', spend_aud: 0.73, leads: 0, cpl_aud: null },
  { ad: 'R L 1', delivery: 'Off', spend_aud: 81.92, leads: 7, cpl_aud: 11.70 },
  { ad: 'R L 3 busienss owners', delivery: 'Off', spend_aud: 1.66, leads: 0, cpl_aud: null },
  { ad: 'RL | Workflow traffic jam | 2026-07-29', delivery: 'Off', spend_aud: 2.23, leads: 0, cpl_aud: null },
  { ad: 'RL | Owner dependency | 2026-07-28', delivery: 'Off', spend_aud: 26.32, leads: 2, cpl_aud: 13.16 },
  { ad: 'RL | Quote stuck in ute | 2026-07-30', delivery: 'Off', spend_aud: 0.16, leads: 0, cpl_aud: null },
  { ad: 'RL | Trades missed calls | 2026-07-28', delivery: 'Off', spend_aud: 11.19, leads: 1, cpl_aud: 11.19 }
];

const intelligence = {
  run_date: date, timezone: 'Australia/Sydney', commercial_focus: 'Qualified Sydney owner conversations in established B2B and professional-service businesses',
  thirty_day_coverage_audit: {
    period: '2026-07-23 to 2026-08-21', source: 'data/content-registry.json, publication logs and current authorised Business Suite content library',
    findings: [
      'Owner bottlenecks, approvals, handoffs and lead loss are already overrepresented.',
      'Campaign reporting appeared on 15 August and website and local-search priorities appeared on 21 August.',
      'Manual social posts on 17 and 20 August returned to generic automation and time-saving claims and were not coordinated website packages.',
      'Reporting and visibility remains underrepresented as an operational service distinct from campaign reporting.',
      'Recent visuals used relay, scoreboard, doorway and passive operating objects. The giant rear-view mirror is a fresh visual archetype.',
      'The rolling professional-services audience requirement is satisfied by the selected established B2B buyer.'
    ]
  },
  rolling_seven_service_mix: { result_before_today: 'Fewer than seven recent coordinated successful social packages are available. Select an underrepresented live service and record the limitation rather than manufacture coverage.' },
  rejected_repetitive_themes: ['owner bottlenecks', 'stuck work', 'conflicting rules', 'approvals', 'handoffs', 'generic time-saving', 'lead-drop relay imagery', 'the 21 August doorway'],
  recent_first_party_signal: 'Authorised Meta evidence for 15 to 21 August showed A$154.85 spend, 5 Leads (Form) and A$30.97 CPL. Exact 23 July to 21 August showed A$384.53 spend, 17 Leads (Form) and A$22.62 CPL. Leads Center showed 30 intake records, 7 new, 0 qualified and 0 converted. No commercial winner is established.',
  concepts: candidates,
  selected_concept: { commercial_failure: creative.commercial_problem, service_mechanism: creative.service_resolution, human_boundary: candidates[0].human_boundary, one_second_mute_test: 'At roughly 20 per cent size, the oversized mirror and blocked windscreen remain obvious. The viewer reads steering by the past before seeing the hook.', source_asset: creative.source_asset, source_asset_sha256: sourceHash },
  final_prepublication_challenge: {
    live_service: 'Reporting and visibility', capability_added: 'A distinct commercial story about useful weekly operational reporting, not another campaign scoreboard.', materially_different_from_last_seven: true,
    one_second_message: 'The business is trying to steer by looking backwards.', qualified_owner_reason: 'Old or manually assembled reports delay ownership of current exceptions and decisions.',
    engaging_not_merely_competent: 'The impossibly large rear-view mirror uses scale, jeopardy and an unmistakable forward-versus-backward conflict.'
  },
  rolling_four_audience_mix: { professional_service_or_b2b_led: 4, trade_or_field_service_led: 0, result: 'pass' },
  red_team: { generic_ai_copy: false, vague_workflow_diagram: false, passive_still_life: false, decorative_office: false, robot_or_hologram: false, invented_proof: false, trades_led: false, main_copy_words: 6 }
};

await writeFile(path.join(outputDir, 'creative-manifest.json'), `${JSON.stringify(creative, null, 2)}\n`, 'utf8');
await mkdir(path.join(root, '_content/blog'), { recursive: true });
await writeFile(path.join(root, '_content/blog', `${slug}.json`), `${JSON.stringify(content, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/daily-briefs', `${date}.json`), `${JSON.stringify(brief, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/content-intelligence', `${date}.json`), `${JSON.stringify(intelligence, null, 2)}\n`, 'utf8');

const registryPath = path.join(root, 'data/content-registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const entry = { content_id: contentId, date, campaign_day: 1, topic: brief.topic, angle: brief.angle, headline: content.title, hook: brief.selected_hook, visual_format: brief.visual_format, keywords: secondaryKeywords, source_urls: [], article_slug: slug, image_path: content.hero_image, caption_hash: sha256(caption), article_hash: sha256(article), status: 'generated', website_url: '', instagram_media_id: '', promotion_score: 98, created_at: createdAt, published_at: '', error: null };
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
  validation_results: [], website: {}, instagram: {}, facebook: {}, promotion: { score: 98, candidate: true },
  meta_ads_health: {
    scope: { business_id: '2419577311552088', business_suite_asset_id: '1171129046091419', page_id: '61592301111343', instagram: 'run_lighter', ad_account_id: '264193331473545', campaign_id: '120252651440610735', ad_set_id: '120252651440620735' },
    seven_days: { range: '2026-08-15 to 2026-08-21 inclusive, Sydney Time', spend_aud: 154.85, leads: 5, result_label: 'Leads (Form)', cpl_aud: 30.97,
      ad_level_nonzero: [
        { ad: 'R L 1 - Copy 2', delivery: 'Campaign off', spend_aud: 136.33, leads: 5, cpl_aud: 27.27 },
        { ad: 'R L 1 - Copy 3', delivery: 'Campaign off', spend_aud: 7.05, leads: 0, cpl_aud: null },
        { ad: 'R L 1 - Copy 2', delivery: 'Off', spend_aud: 11.47, leads: 0, cpl_aud: null }
      ], zero_spend_rows: 19 },
    thirty_days: { range: '2026-07-23 to 2026-08-21 inclusive, Sydney Time', spend_aud: 384.53, leads: 17, result_label: 'Leads (Form)', cpl_aud: 22.62, ad_level: adRows30 },
    recommendations: {
      keep: 'Keep R L 1 - Copy 2 as the recent lead-volume reference if the campaign is later considered for reactivation. It produced all 5 form leads in the seven-day window at A$27.27 CPL, but no qualified or converted outcome is established and it is not a commercial winner.',
      pause_candidate: 'R L 1 - Copy 3 is the pause candidate before any future campaign reactivation. It spent A$7.05 in the exact seven-day and 30-day windows with 0 form leads. This is a recommendation only.',
      next_test: 'Test the forward-reporting proposition only as a separate uploaded paid creative with its own ad-level CTA after explicit authority. Do not use the organic post as ad creative.'
    },
    preexisting_unpublished_changes_preserved: 2, changes_made: false, budget_changed: false
  },
  recent_social: {
    source: 'Authorised Business Suite content library',
    observations: [
      { id: '18102254579068387', platform: 'Instagram', published: '2026-08-20 11:09 AEST', format: 'Reel', reach: 73, shares: 0, likes_and_reactions: 0, note: 'Generic automation and unverified time-saving claim. Not used as a proof source.' },
      { id: '122108483097410037', platform: 'Facebook and Instagram', published: '2026-08-17 11:08 AEST', format: 'Photo crosspost', reach: 0, shares: 0, likes_and_reactions: 0 },
      { id: '122108479869410037', platform: 'Facebook and Instagram', published: '2026-08-17 10:25 AEST', format: 'Photo crosspost', reach: 0, shares: 0, likes_and_reactions: 0 },
      { id: '122108121393410037', platform: 'Facebook and Instagram', published: '2026-08-15 17:34 AEST', format: 'Photo crosspost', reach: 1, shares: 0, likes_and_reactions: 0 }
    ],
    interpretation: 'The latest posts provide no evidence-backed creative or commercial winner. Today avoids generic automation, time-back and conversion claims.'
  },
  lead_recovery: {
    leads_center: { intake: 30, new: 7, qualified: 0, converted: 0, controlled_test_rows_visible: true },
    existing_zap_id: '374752461', title: 'Run Lighter Meta Lead -> n8n v2', connector_state: 'on', configured: true, paused: false, last_live_at: '2026-08-16T06:50:15Z',
    definition_inspection: 'failed', definition_error: 'The Zapier definition-inspection action failed and the browser redirected to Zapier login.',
    trigger_actions_mapping_destination_acknowledgement_reverified_today: false, duplicate_created: false, lead_communication_sent: false,
    reason_no_recovery_send: 'Consent fields, exact routing, acknowledgement and downstream delivery could not be reverified. No manual outreach was sent or inferred from intake status.',
    recovery_action: 'Open existing Zap 374752461 in an authenticated session and reverify trigger, actions, field mapping, destination and acknowledgement. Do not create a replacement.'
  },
  communication_window: { checked_at: createdAt, local_time_at_start: '09:08 AEST', permitted: true, final_submission_recheck_required: true },
  status: 'generated', errors: []
};
await writeFile(path.join(root, 'logs/content', `${date}.json`), `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ content_id: contentId, slug, source_hash: sourceHash, article_words: article.trim().split(/\s+/).length, caption_words: caption.trim().split(/\s+/).length, variants }, null, 2));
