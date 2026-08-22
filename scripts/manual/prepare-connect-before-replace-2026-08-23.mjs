import path from 'node:path';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const date = '2026-08-23';
const slug = 'should-a-service-business-replace-software-that-does-not-connect';
const contentId = `rl-${date}-${createHash('sha256').update(`${date}:${slug}`).digest('hex').slice(0, 10)}`;
const disclosure = 'This post has been automated so we can run lighter.';
const createdAt = new Date().toISOString();
const sourceInput = '/Users/adrianstock/.codex/generated_images/01a02bb9-1dc2-76f0-8146-9710de0c64d2/exec-4abcab0a-1c95-4c99-94bc-c2387267539c.png';
const outputDir = path.join(root, 'generated/drafts', date);
const sourcePath = path.join(outputDir, 'connect-before-replace-source.png');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&apos;');

const article = `# Should a service business replace software that does not connect?

## Short answer

Not immediately. When useful software does not connect cleanly, first trace the real workflow, identify the smallest reliable handoff and test whether a controlled integration can remove the repeated work. Replacing a working platform can create migration risk, retraining, cost and disruption without fixing the underlying process.

Sometimes replacement is justified. A system may be unsupported, unsafe, structurally unsuitable or too limited for the business. That decision should follow an evidence-based review of the workflow, data, access, exceptions and total change burden. It should not begin with the assumption that every disconnected tool needs to be demolished.

## Start with the work, not the software list

An established Sydney accounting, legal, finance, insurance, recruitment, property, strata, agency or healthcare-administration business may have several systems that each do one important job well. The problem often appears between them.

A new enquiry may enter a form, be copied into a CRM, create a matter or project, trigger an email and later become an invoice. If staff repeatedly retype the same approved facts, chase missing identifiers or check two places for the current status, the expensive part is the handoff. Buying a larger platform before tracing that handoff can move the same confusion into a more expensive system.

Follow one real piece of work from entry to completion. Record what starts it, which facts move, who owns the normal path, where exceptions appear and which decisions need a person. That gives the business a practical basis for deciding whether to connect, simplify or replace.

## Ask whether the current systems still do their main jobs

A platform does not need to be fashionable to be useful. Check whether each current system remains reliable for the job it owns.

Useful questions include:

- Is the system supported and receiving necessary security updates?
- Does it hold the required records accurately?
- Can access be limited to the people and workflows that need it?
- Does it offer a documented API, webhook, export or other controlled integration path?
- Can staff complete the important human decisions without awkward workarounds?
- Is the repeated problem inside the system, or only between systems?

If the systems perform their core roles and the failure sits at one boundary, a focused connection may be the smaller and safer change. If the answers expose deeper capability, support or security problems, replacement becomes a more credible option.

## Define the smallest reliable connection

Do not begin by copying every field in both directions. Decide which approved event should move which minimum information to which destination.

For example, an accepted enquiry might create a CRM record with a source identifier and an owner. An approved client record might create a project shell without copying sensitive notes. A completed service milestone might prepare an invoice for human review rather than issuing it automatically.

The connection should preserve identifiers, dates and source links so a person can trace what happened. It should fail visibly when required information is missing. It should avoid creating duplicate records when the same event arrives twice. These controls matter more than the number of applications connected.

## Keep access and sensitive data narrow

Integration is not permission to move everything. Professional-service businesses may hold confidential client, financial, employee or health-related information. Each workflow should use only the fields and access required for its job.

Review who can authorise the connection, where credentials are stored, what is logged, how failures are reported and what happens when a team member or supplier changes. Keep judgement-heavy material in the system and with the people responsible for it unless there is a clear, approved reason to move it.

Run Lighter can help map the practical boundary, but the business retains authority over privacy, security, professional obligations, architecture and acceptable risk.

## Test one controlled path before expanding

A useful first test is small enough to observe and reverse. Choose one repeated handoff with a clear owner and a measurable operational check, such as whether the right record appears once, with the right identifier, for human review.

Test the normal path, missing data, duplicate events, access failure and an unusual case. Record what should stop safely. Confirm that staff can see the source and recover without reconstructing the whole job from memory.

If the connection removes repeated work without weakening control, expand carefully. If it exposes that the current platform cannot support the business safely or reliably, that evidence strengthens the case for replacement.

## When replacement is the right answer

Connection is not a rule to preserve bad software. Replacement may be sensible when a critical system is unsupported, insecure, unreliable, incapable of meeting core requirements or so restrictive that every useful workflow depends on brittle workarounds.

The decision should include migration quality, historical records, integrations, staff training, downtime, access changes, contractual terms and the temporary double running that may be needed. A lower subscription price can still produce a costly transition. A higher price can still be worthwhile when it resolves a verified structural limitation.

Make the decision around the business process and risk, not a feature checklist alone.

## A practical first pass

Choose one handoff that currently depends on copying, chasing or checking. Trace the real event, the minimum approved facts, the source system, the destination, the human decision and the failure path. Then compare three options: leave it manual with a clearer rule, connect the existing systems, or replace one component.

Test the smallest safe improvement first. Keep the original source visible and judge the result against the real work, not the promise of a new platform.

This post has been automated so we can run lighter.

If your team is considering a software replacement because information keeps stopping between systems, book an on-site automation review in Sydney. Run Lighter can trace one real workflow, test where a controlled connection is practical and help you make the replacement decision with better evidence while your team keeps architecture, access and risk decisions human.`;

const caption = `A working system should not face the wrecking ball because one connection is missing.

Before replacing software, trace the real workflow. Find the smallest reliable handoff, preserve source records and test one controlled connection. If the platform is unsupported, unsafe or structurally unsuitable, that evidence can support replacement.

Run Lighter can map one workflow and test the smaller change first. Your team keeps architecture, access, privacy and commercial decisions human.

This post has been automated so we can run lighter.

Considering a platform change? Request a short workflow call.

#RunLighter #SydneyBusiness #ProfessionalServices #BusinessAutomation`;

const directAnswer = 'Not immediately. When useful software does not connect cleanly, first trace the real workflow, identify the smallest reliable handoff and test whether a controlled integration can remove the repeated work.';
const primaryKeyword = 'business software integration Sydney';
const secondaryKeywords = ['connect existing business software', 'workflow integration', 'software replacement decision', 'professional services automation'];

const candidates = [
  { rank: 1, concept: 'Wrecking Ball Connection', service_family: 'Existing-software integration', qualified_buyer: 'Owner of an established Sydney professional-service business considering a platform replacement', consequence: 'A costly migration disrupts working systems and staff before the smaller connection problem is tested.', service_mechanism: 'Trace one real workflow, define the smallest reliable handoff and test a controlled connection before deciding whether replacement is justified.', human_boundary: 'Leadership retains architecture, access, migration, privacy and change-risk decisions.', visual_event: 'A wrecking ball stops centimetres from a functioning server cabinet while one large unplugged cable sits in the foreground.', hook: "DON'T REPLACE WHAT CAN CONNECT.", scores: { commercial_consequence: 19, buyer_service_fit: 20, one_second_visual: 20, stopping_power: 15, novelty: 14, mobile_brand_fit: 9 }, score: 97, decision: 'selected; strongest underrepresented capability, immediate jeopardy and clearest one-second small-fix-versus-big-disruption contrast' },
  { rank: 2, concept: 'Publishing Blackout', service_family: 'Articles, social and email publishing', qualified_buyer: 'Principal of a specialist Sydney firm with approved expertise but inconsistent publishing', consequence: 'Useful expertise never reaches the buyers it could help.', service_mechanism: 'Coordinate approved ideas through production, review, publication and measurement.', human_boundary: 'Experts retain the point of view, claims and final approval.', visual_event: 'A speaker addresses a full outdoor audience through a microphone whose cable is visibly severed.', hook: 'YOUR EXPERTISE IS OFFLINE.', scores: { commercial_consequence: 17, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 14, mobile_brand_fit: 9 }, score: 91, decision: 'rejected because the integration concept has a larger immediate commercial consequence and less stock-scene risk' },
  { rank: 3, concept: 'Wrong-Fit Waiting Room', service_family: 'Paid acquisition and lead handling', qualified_buyer: 'Sydney advisory or consultancy owner paying for lead generation', consequence: 'Low-fit enquiries consume follow-up capacity while suitable owner conversations wait.', service_mechanism: 'Align the offer and audience, capture fit signals and report qualification rather than lead volume alone.', human_boundary: 'A person decides suitability and owns the sales conversation.', visual_event: 'A waiting room is packed with obviously misdirected visitors while the intended business owner is left outside.', hook: 'BAD FIT FILLS THE CALENDAR.', scores: { commercial_consequence: 19, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 12, mobile_brand_fit: 8 }, score: 90, decision: 'rejected because it risks caricature and current lead quality evidence does not support a stronger claim' },
  { rank: 4, concept: 'Duplicate Data Carousel', service_family: 'Administration and data movement', qualified_buyer: 'Operations lead in a Sydney recruitment, property or advisory firm', consequence: 'Skilled staff repeatedly re-enter approved client facts and introduce avoidable errors.', service_mechanism: 'Capture approved information once and move the minimum fields safely between existing systems.', human_boundary: 'People validate exceptions, access and sensitive information.', visual_event: 'One sealed client parcel circles past three stations and receives the same label each time.', hook: 'WHY ENTER IT AGAIN?', scores: { commercial_consequence: 17, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 13, novelty: 9, mobile_brand_fit: 9 }, score: 85, decision: 'rejected because duplicate-entry work is already familiar and the parcel metaphor risks a generic process scene' },
  { rank: 5, concept: 'Client Start Red Light', service_family: 'Client onboarding and handovers', qualified_buyer: 'Sydney legal, accounting or advisory principal', consequence: 'A suitable signed client waits while checks and ownership remain unclear.', service_mechanism: 'Create the record, collect approved information and surface exceptions to the responsible person.', human_boundary: 'Risk, advice and client-acceptance decisions remain with authorised professionals.', visual_event: 'A client is ready at a starting gate but the signal stays red after the race begins.', hook: 'SIGNED. STILL NOT STARTED.', scores: { commercial_consequence: 18, buyer_service_fit: 19, one_second_visual: 18, stopping_power: 14, novelty: 7, mobile_brand_fit: 9 }, score: 85, decision: 'rejected because onboarding and handoff themes remain overrepresented' },
  { rank: 6, concept: 'Lead Down the Drain', service_family: 'Lead capture and follow-up', qualified_buyer: 'Sydney consultancy or agency owner receiving digital enquiries', consequence: 'A paid enquiry disappears before a person owns the conversation.', service_mechanism: 'Acknowledge, route, assign and report every consented enquiry through one controlled path.', human_boundary: 'A person qualifies the lead and owns the sales conversation.', visual_event: 'A bright enquiry token rolls towards an open street drain while a hand reaches too late.', hook: 'FOLLOW-UP HAS AN EXPIRY TIME.', scores: { commercial_consequence: 20, buyer_service_fit: 19, one_second_visual: 19, stopping_power: 15, novelty: 7, mobile_brand_fit: 9 }, score: 89, decision: 'rejected because lead-loss and handoff imagery has been used repeatedly' },
  { rank: 7, concept: 'Search Detour', service_family: 'Website and local search priorities', qualified_buyer: 'Principal of an established Sydney professional-service firm', consequence: 'A ready buyer cannot reach the service page and enquiry route that match the need.', service_mechanism: 'Prioritise one valuable service page and connect its search, internal-link and enquiry path.', human_boundary: 'Experts retain positioning, claims, advice and client-acceptance decisions.', visual_event: 'A clearly marked destination is visible while the only road loops away from its entrance.', hook: 'READY BUYERS NEED A DIRECT PATH.', scores: { commercial_consequence: 18, buyer_service_fit: 20, one_second_visual: 18, stopping_power: 13, novelty: 2, mobile_brand_fit: 9 }, score: 80, decision: 'rejected below threshold because the 21 August package already used the inaccessible-front-door proposition' },
  { rank: 8, concept: 'Rear-View Dashboard', service_family: 'Reporting and visibility', qualified_buyer: 'Owner of an established Sydney B2B service business', consequence: 'Current decisions are delayed by manually assembled old snapshots.', service_mechanism: 'Connect agreed facts and surface current exceptions in one weekly operating view.', human_boundary: 'The owner and responsible team interpret context and make decisions.', visual_event: 'An oversized rear-view mirror blocks a car windscreen.', hook: "LAST MONTH CAN'T STEER THIS WEEK.", scores: { commercial_consequence: 19, buyer_service_fit: 20, one_second_visual: 20, stopping_power: 15, novelty: 0, mobile_brand_fit: 9 }, score: 83, decision: 'rejected below threshold because it was yesterday’s package and cannot be reused' }
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
  const titleSize = portrait ? 82 : name === 'hero' ? 66 : 49;
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
  <text x="${titleX}" y="${titleTop}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">DON&apos;T REPLACE</text>
  <text x="${titleX}" y="${titleTop + lineGap}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">WHAT CAN</text>
  <text x="${titleX}" y="${titleTop + lineGap * 2}" fill="#D8A62B" font-family="Arial Black, Arial, sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">CONNECT.</text>
  <rect x="${portrait ? 28 : 0}" y="${footerY}" width="${portrait ? spec.width - 56 : panel}" height="${footerH}" ${portrait ? 'rx="10"' : ''} fill="#17352B" fill-opacity=".97"/>
  <text x="${portrait ? 54 : titleX}" y="${footerY + Math.round(footerH * .67)}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${disclosureSize}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
  const svgPath = path.join(outputDir, `${name}.svg`);
  const pngPath = path.join(outputDir, `${name}.png`);
  const webpPath = path.join(outputDir, `${name}.webp`);
  await writeFile(svgPath, `${svg.replace(fullDataUri, 'connect-before-replace-source.png')}\n`, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(webpPath);
  variants[name] = { png: path.relative(root, pngPath), webp: path.relative(root, webpPath), svg: path.relative(root, svgPath), width: spec.width, height: spec.height };
}

const altText = 'A giant wrecking ball hangs centimetres from a functioning communications cabinet while one unplugged cable lies beside its matching socket.';
const creative = {
  content_id: contentId, revision: 'connect-before-replace-v1', run_date: date, created_at: createdAt, disclosure,
  brand: 'RUN / LIGHTER', alt_text: altText, background_provider: 'imagegen-photorealistic',
  source_asset_origin: 'fresh-imagegen-current-run', source_asset: `generated/drafts/${date}/connect-before-replace-source.png`, source_asset_sha256: sourceHash,
  reused_generated_asset: false, owner_approved_prepared_asset: false,
  commercial_problem: 'A costly software replacement disrupts working systems and staff before the smaller connection problem is tested.',
  service_resolution: 'Trace one real workflow, define the smallest reliable handoff and test a controlled connection before deciding whether replacement is justified.',
  overlay_copy: "DON'T REPLACE WHAT CAN CONNECT.", variants
};

const brief = {
  content_id: contentId, date, campaign_day: 1, audience: 'Owners of established Sydney B2B and professional-service firms',
  problem: creative.commercial_problem, single_message: 'Test whether a controlled connection can fix the workflow before replacing useful software.',
  supporting_points: ['Start with one real workflow, not a software wish list', 'Check whether current systems still do their main jobs', 'Move only the minimum approved fields with visible failure paths', 'Replace when evidence shows a structural, support or security limitation'],
  desired_action: 'Request a short workflow call before committing to a platform replacement',
  topic: 'connecting existing software before platform replacement', service_family: 'Existing-software integration',
  angle: 'Trace and test the smallest reliable connection before disrupting a working software stack.',
  headline_options: ['Should a service business replace software that does not connect?', 'Can existing business software be connected safely?', 'When should a service business replace its software?'],
  selected_headline: 'Should a service business replace software that does not connect?', social_headline: "DON'T REPLACE WHAT CAN CONNECT.",
  caption_hook_options: ['A working system should not face the wrecking ball because one connection is missing.', 'Test the connection before replacing the platform.', 'The biggest software change is not always the right first move.'],
  selected_hook: 'A working system should not face the wrecking ball because one connection is missing.', caption_cta: 'Request a short workflow call.',
  visual_concept: 'A wrecking ball about to destroy a functioning communications cabinet while one unplugged cable reveals the smaller problem.',
  visual_format: 'surreal high-jeopardy Australian commercial editorial photograph',
  image_generation_prompt: 'Fresh current-run editorial photograph of a wrecking ball centimetres from a functioning communications cabinet, with one large unplugged cable and matching socket in the foreground. No text, logos, papers, screens, office, robot or hologram.',
  overlay_copy: ["DON'T REPLACE WHAT CAN CONNECT."],
  article_outline: ['Short answer', 'Start with the work', 'Check the current systems', 'Define the smallest connection', 'Keep data narrow', 'Test one controlled path', 'When replacement is right', 'Practical first pass'],
  search_question: 'Should a service business replace software that does not connect?', search_intent: 'informational and commercial investigation', buyer_stage: 'solution aware', direct_answer: directAnswer,
  search_plan_id: 'daily-commercial-2026-08-23', primary_keyword: primaryKeyword, secondary_keywords: secondaryKeywords, source_urls: [],
  promotion_hypothesis: 'The wrecking ball makes unnecessary platform disruption physical and leads directly to Run Lighter’s verified existing-software integration capability.',
  risk_notes: ['Do not promise savings or results', 'Do not imply every platform can or should be integrated', 'Keep privacy, security and architecture decisions human', 'Do not use the organic post as paid creative']
};

const content = {
  content_id: contentId, date, campaign_day: 1, title: brief.selected_headline, slug, updated: date, status: 'draft',
  excerpt: 'Trace the real workflow and test the smallest reliable connection before replacing useful business software.',
  description: 'A practical guide for Sydney service businesses deciding whether to connect existing software or replace a platform.',
  seo_title: 'Connect or Replace Business Software? A Practical Test',
  meta_description: 'Trace one workflow and test a controlled connection before replacing useful business software across a Sydney service firm.',
  author: 'Run Lighter', tags: [primaryKeyword, ...secondaryKeywords], category: 'Business automation',
  hero_image: `/generated/drafts/${date}/hero.webp`, hero_image_fallback: `/generated/drafts/${date}/hero.png`, hero_image_alt: altText,
  og_image: `/generated/drafts/${date}/og.png`, instagram_image: `/generated/drafts/${date}/instagram.png`, dimensions: { instagram: '1080x1350', hero: '1600x900', open_graph: '1200x630' },
  instagram_caption: caption, instagram_media_id: '', article_markdown: article, automation_disclosure: disclosure, source_urls: [], is_topical: false,
  search_question: brief.search_question, direct_answer: directAnswer, search_intent: brief.search_intent, buyer_stage: brief.buyer_stage, search_plan_id: brief.search_plan_id,
  primary_keyword: primaryKeyword, secondary_keywords: secondaryKeywords, canonical_url: `https://runlighter.com/blog/${slug}/`,
  reading_time: Math.ceil(article.trim().split(/\s+/).length / 220), promotion_score: 97, promotion_candidate: true,
  promotion_reason: 'Underrepresented integration capability, strong professional-services fit, expensive disruption risk and a fresh one-second visual event.',
  suggested_paid_audience: 'Owners of established Sydney B2B and professional-service firms',
  suggested_ad_primary_text: 'Before replacing useful software, trace one real workflow and test the smallest reliable connection.',
  suggested_ad_headline: 'Test the connection before replacement', suggested_ad_description: 'Request a short workflow call.', creative,
  created_at: createdAt, published_at: '', updated_at: createdAt
};

const intelligence = {
  run_date: date, timezone: 'Australia/Sydney', commercial_focus: 'Qualified Sydney owner conversations in established B2B and professional-service businesses',
  thirty_day_coverage_audit: {
    period: '2026-07-24 to 2026-08-22', source: 'data/content-registry.json, publication logs and current authorised Business Suite content library',
    findings: [
      'Owner bottlenecks, approvals, handoffs and lead loss remain overrepresented.',
      'Campaign reporting appeared on 15 August, website and local search on 21 August, and operational reporting on 22 August.',
      'Existing-software integration appeared only once near the start of the 30-day window and remains a thinly represented verified capability.',
      'Articles, social and email publishing is also underrepresented, but the strongest candidate risked a generic speaker scene.',
      'Recent visuals used relay, scoreboard, impossible doorway and oversized rear-view mirror. The near-impact wrecking ball is a new jeopardy-led visual archetype.',
      'The rolling professional-services audience requirement is satisfied by the selected established B2B buyer.'
    ]
  },
  rolling_seven_service_mix: { business_automation_families: ['client onboarding and approvals', 'owner dependency and workflow control', 'automation readiness', 'reporting and visibility', 'existing-software integration'], managed_marketing_families: ['external marketing and publishing', 'campaign reporting and improvement', 'website and local search priorities'], result_after_today: 'pass; at least four distinct families with at least two managed-marketing and two business-automation families' },
  rejected_repetitive_themes: ['owner bottlenecks', 'stuck work', 'conflicting rules', 'approvals', 'handoffs', 'generic time-saving', 'lead-drop imagery', 'doorway', 'rear-view reporting'],
  recent_first_party_signal: 'Live Meta evidence is inspected later in this run and recorded in the structured audit. No commercial winner is assumed from prior lead volume.',
  concepts: candidates,
  selected_concept: { commercial_failure: creative.commercial_problem, service_mechanism: creative.service_resolution, human_boundary: candidates[0].human_boundary, one_second_mute_test: 'At roughly 20 per cent size, the giant wrecking ball, intact cabinet and single unplugged cable remain obvious. The viewer reads destructive overreaction before seeing the hook.', source_asset: creative.source_asset, source_asset_sha256: sourceHash },
  final_prepublication_challenge: {
    live_service: 'Existing-software integration', capability_added: 'A distinct commercial story about connecting useful systems before a risky platform replacement.', materially_different_from_last_seven: true,
    one_second_message: 'A working system is about to be destroyed even though one connection is visibly missing.', qualified_owner_reason: 'A premature platform replacement can create migration, retraining, access and continuity risk.',
    engaging_not_merely_competent: 'The near-impact wrecking ball uses scale, jeopardy and a clear small-fix-versus-big-destruction contrast.'
  },
  rolling_four_audience_mix: { professional_service_or_b2b_led: 4, trade_or_field_service_led: 0, result: 'pass' },
  red_team: { generic_ai_copy: false, vague_workflow_diagram: false, passive_still_life: false, decorative_office: false, robot_or_hologram: false, invented_proof: false, trades_led: false, main_copy_words: 5 }
};

await writeFile(path.join(outputDir, 'creative-manifest.json'), `${JSON.stringify(creative, null, 2)}\n`, 'utf8');
await mkdir(path.join(root, '_content/blog'), { recursive: true });
await writeFile(path.join(root, '_content/blog', `${slug}.json`), `${JSON.stringify(content, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/daily-briefs', `${date}.json`), `${JSON.stringify(brief, null, 2)}\n`, 'utf8');
await writeFile(path.join(root, 'data/content-intelligence', `${date}.json`), `${JSON.stringify(intelligence, null, 2)}\n`, 'utf8');

const registryPath = path.join(root, 'data/content-registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const entry = { content_id: contentId, date, campaign_day: 1, topic: brief.topic, angle: brief.angle, headline: content.title, hook: brief.selected_hook, visual_format: brief.visual_format, keywords: secondaryKeywords, source_urls: [], article_slug: slug, image_path: content.hero_image, caption_hash: sha256(caption), article_hash: sha256(article), status: 'generated', website_url: '', instagram_media_id: '', promotion_score: 97, created_at: createdAt, published_at: '', error: null };
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
  validation_results: [], website: {}, instagram: {}, facebook: {}, promotion: { score: 97, candidate: true },
  meta_ads_health: {
    scope: { business_id: '2419577311552088', business_suite_asset_id: '1171129046091419', page_id: '61592301111343', instagram: 'run_lighter', ad_account_id: '264193331473545', campaign_id: '120252651440610735', ad_set_id: '120252651440620735' },
    seven_days: { status: 'pending_live_inspection' }, thirty_days: { status: 'pending_live_inspection' }, recommendations: { status: 'pending_live_inspection' },
    changes_made: false, budget_changed: false
  },
  recent_social: { source: 'pending current authorised Business Suite inspection', observations: [], interpretation: 'No creative or commercial winner is assumed.' },
  lead_recovery: { existing_zap_id: '374752461', title: 'Run Lighter Meta Lead -> n8n v2', definition_inspection: 'pending', duplicate_created: false, lead_communication_sent: false },
  communication_window: { checked_at: createdAt, local_time_at_start: new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(new Date()), permitted_at_start: true, final_submission_recheck_required: true },
  status: 'generated', errors: []
};
await writeFile(path.join(root, 'logs/content', `${date}.json`), `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ content_id: contentId, slug, source_hash: sourceHash, article_words: article.trim().split(/\s+/).length, caption_words: caption.trim().split(/\s+/).length, variants }, null, 2));
