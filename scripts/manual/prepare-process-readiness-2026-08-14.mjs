import path from 'node:path';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '../..');
const date = '2026-08-14';
const slug = 'how-do-i-know-if-a-business-process-is-ready-for-automation';
const contentId = 'rl-2026-08-14-6e4c8b9a21';
const disclosure = 'This post has been automated so we can run lighter.';
const createdAt = '2026-08-13T23:14:24.000Z';
const outputDir = path.join(root, 'generated/drafts', date);
const sourceInput = '/Users/adrianstock/.codex/generated_images/019ffd60-239b-7192-99a1-85483b00b413/exec-45bfaf91-a338-4bf9-8062-d4977a7a2293.png';
const sourcePath = path.join(outputDir, 'three-rules-source.png');

const article = `# How do I know if a business process is ready for automation?

## Short answer

A business process is ready for automation when the trigger, normal path, required information, owner, expected outcome and exception path are clear enough that two capable people would handle the same routine case in the same way.

If a Sydney accounting firm, legal practice, strata business, advisory team, recruitment agency or healthcare administrator uses three different rule sets for the same work, automation will not resolve the disagreement. It will simply move inconsistent decisions faster.

The practical first step is to stabilise one useful path, not document every possible scenario. Keep judgement with the responsible person, define what routine work can move safely and give exceptions somewhere visible to go.

## The clearest warning sign is conflicting rules

Many repeated workflows look ready because they consume time. That is not enough. Repetition makes a process worth examining, but consistency makes it safe to automate.

Consider contractor access for a strata portfolio. One building requires a key register, another requires approval from a manager and a third relies on an email chain nobody can easily see. Even within one building, three team members may describe the process differently. A tool could send reminders or update records, but it cannot decide which unwritten rule should win.

The same problem appears in professional services. An accounting team may open new work differently depending on who receives the request. A law firm may have several interpretations of a complete matter file. An adviser may approve routine client communications through one system while exceptions are handled in personal inboxes.

Before automating, ask each person to explain the normal path using one recent case. If the answers conflict, the next job is process clarification.

## Check six parts of the workflow

Use one real example and write down six things.

1. **Trigger:** What starts the process? It might be a signed engagement, an approved request, a new enquiry or a status change.
2. **Required information:** Which fields, documents or approvals must be present before work can move?
3. **Normal path:** What happens for the majority of routine cases, and in what order?
4. **Owner:** Who is responsible for the outcome, not merely the next task?
5. **Expected result:** What observable state means the process is complete?
6. **Exception path:** Which cases must stop for human review, and who receives them with enough context to decide?

This is deliberately simpler than a large process-mapping exercise. The aim is to expose uncertainty early. If the team cannot agree on these six parts, building integrations or buying another platform will create a more technical version of the same confusion.

Run Lighter follows this approach during an [on-site automation review](/blog/what-happens-during-an-on-site-automation-review/). We trace the actual work before recommending software.

## Separate messy data from human judgement

Not every variation means a workflow is unstable. Good businesses make judgement calls. A legal practice should not treat unusual client risk as a routine checkbox. An accounting partner may need to decide how to handle an out-of-scope request. A strata manager may need to respond differently when safety or urgent access is involved.

The useful distinction is between an exception that deserves judgement and missing information that forces someone to reconstruct the case.

Automation can help assemble the approved facts, create the next task, send a controlled acknowledgement, update the responsible system and make an overdue step visible. It should not invent a policy, settle a disputed instruction or make a sensitive commercial decision.

This boundary protects the business. It also makes the automation easier to review because routine actions and human decisions are recorded separately.

## Test the normal path before connecting systems

Choose five to ten recent cases that should have followed the normal path. Walk them through the proposed rules. Do the same inputs produce the same next step? Can the owner see what happened? Can a mistaken action be corrected? Does an incomplete case stop safely rather than continue with a guess?

If the process passes that check, test it manually with a checklist or template before building the automation. A short manual trial often reveals missing fields, ambiguous ownership and exceptions that looked rare but occur every week.

Only then decide what the software should do. The current CRM, practice-management, document or finance system may already support the required status, permission, notification or integration. Review [whether the software already in the business may be enough](/blog/your-software-may-already-be-enough/) before adding another place for staff to check.

## Start with a narrow, valuable slice

A process does not need to be perfect before any automation can begin. It needs a stable slice with a useful outcome and a safe stopping point.

For example, a system might capture a complete request, create a record, assign an owner and acknowledge receipt. It can stop before advice, pricing or an unusual commitment. That smaller scope removes repeated administration while preserving the judgement that clients are paying for.

Avoid launching with the most complicated exception. Start where the trigger and outcome are clear, where volume is meaningful and where the team can spot an error quickly. Measure whether work moves with less chasing, whether exceptions arrive with context and whether ownership is clearer.

## A simple readiness decision

The process is ready when the normal path is agreed, the required information is available, one person owns the result, exceptions stop safely and the team can review what happened.

It is not ready when rules live in different heads, every case needs interpretation, incomplete information is normal or nobody owns the final outcome.

This post has been automated so we can run lighter.

If one repeated workflow has become a collection of conflicting instructions, book an on-site automation review in Sydney, starting with a free 15-minute call. We can identify the stable first slice, keep important judgement human and decide whether automation is the right next step.`;

const caption = `One workflow. Three sets of rules.

That process is not ready for automation yet.

First define the trigger, required information, normal path, owner, expected result and exception path. Then automate the stable routine steps while keeping advice, pricing, unusual commitments and sensitive decisions with the responsible person.

Run Lighter traces the real workflow before recommending software, so a Sydney professional-service team does not make conflicting instructions move faster.

This post has been automated so we can run lighter.

If one repeated process keeps changing depending on who handles it, book a free 15-minute call.

#RunLighter #SydneyBusiness #BusinessAutomation #ProfessionalServices`;

const directAnswer = 'A business process is ready for automation when the trigger, normal path, required information, owner, expected outcome and exception path are clear enough that two capable people would handle the same routine case in the same way.';
const primaryKeyword = 'business process ready for automation';
const secondaryKeywords = ['automation readiness checklist', 'workflow mapping', 'process automation Sydney', 'professional services automation'];
const sha256 = value => createHash('sha256').update(value).digest('hex');
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

await mkdir(outputDir, { recursive: true });
await copyFile(sourceInput, sourcePath);
const source = await readFile(sourcePath);
const sourceHash = sha256(source);
const fullDataUri = `data:image/png;base64,${source.toString('base64')}`;

const specs = {
  instagram: { width: 1080, height: 1350, panelHeight: 430, titleSize: 73, titleY: [182, 266] },
  hero: { width: 1600, height: 900, panel: 660, titleSize: 70, titleY: [260, 342, 424] },
  og: { width: 1200, height: 630, panel: 505, titleSize: 54, titleY: [182, 246, 310] }
};

const variants = {};
for (const [name, spec] of Object.entries(specs)) {
  let svg;
  if (name === 'instagram') {
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <image href="${fullDataUri}" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1080" height="${spec.panelHeight}" fill="#17352B" fill-opacity=".94"/>
  <text x="58" y="72" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="4">RUN / LIGHTER</text>
  <rect x="58" y="94" width="142" height="7" rx="3" fill="#D8A62B"/>
  <text x="58" y="${spec.titleY[0]}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">ONE WORKFLOW.</text>
  <text x="58" y="${spec.titleY[1]}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">THREE SETS OF RULES.</text>
  <rect x="34" y="1252" width="1012" height="64" rx="10" fill="#17352B" fill-opacity=".96"/>
  <text x="62" y="1293" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="19" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
  } else {
    const imageWidth = spec.width - spec.panel;
    const disclosureY = spec.height - (name === 'hero' ? 26 : 20);
    const disclosureSize = name === 'hero' ? 18 : 14;
    const brandSize = name === 'hero' ? 25 : 19;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">
  <rect width="${spec.width}" height="${spec.height}" fill="#17352B"/>
  <image href="${fullDataUri}" x="${spec.panel}" y="0" width="${imageWidth}" height="${spec.height}" preserveAspectRatio="xMidYMid slice"/>
  <rect width="${spec.panel}" height="${spec.height}" fill="#17352B"/>
  <text x="58" y="72" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${brandSize}" font-weight="700" letter-spacing="4">RUN / LIGHTER</text>
  <rect x="58" y="92" width="142" height="6" rx="3" fill="#D8A62B"/>
  <text x="58" y="${spec.titleY[0]}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">ONE WORKFLOW.</text>
  <text x="58" y="${spec.titleY[1]}" fill="#D8A62B" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">THREE SETS</text>
  <text x="58" y="${spec.titleY[2]}" fill="#F5F1E8" font-family="Arial Black, Arial, sans-serif" font-size="${spec.titleSize}" font-weight="900" letter-spacing="-2">OF RULES.</text>
  <text x="58" y="${disclosureY}" fill="#F5F1E8" font-family="Arial, Helvetica, sans-serif" font-size="${disclosureSize}" font-weight="600">${escapeXml(disclosure)}</text>
</svg>`;
  }
  const svgPath = path.join(outputDir, `${name}.svg`);
  const pngPath = path.join(outputDir, `${name}.png`);
  const webpPath = path.join(outputDir, `${name}.webp`);
  await writeFile(svgPath, `${svg.replace(fullDataUri, 'three-rules-source.png')}\n`, 'utf8');
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(pngPath);
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(webpPath);
  variants[name] = {
    png: path.relative(root, pngPath), webp: path.relative(root, webpPath), svg: path.relative(root, svgPath),
    width: spec.width, height: spec.height
  };
}

const altText = 'A Sydney apartment lobby key cabinet beside three conflicting workflow notices, with a contractor bag and document sleeve waiting below.';
const creative = {
  content_id: contentId,
  revision: 'three-rules-v1',
  run_date: date,
  created_at: createdAt,
  disclosure,
  brand: 'RUN / LIGHTER',
  alt_text: altText,
  background_provider: 'imagegen-photorealistic',
  source_asset_origin: 'fresh-imagegen-current-run',
  source_asset: `generated/drafts/${date}/three-rules-source.png`,
  source_asset_sha256: sourceHash,
  reused_generated_asset: false,
  owner_approved_prepared_asset: false,
  commercial_problem: 'One repeated workflow follows several conflicting rule sets, so work stalls and automation would repeat the inconsistency.',
  service_resolution: 'Agree the normal path, required information, owner and safe exception route before automating a narrow valuable slice.',
  overlay_copy: 'ONE WORKFLOW. THREE SETS OF RULES.',
  variants
};

const brief = {
  content_id: contentId,
  date,
  campaign_day: 3,
  audience: 'Owners of established Sydney B2B and professional-service businesses',
  problem: 'A repeated workflow appears inefficient, but different people still follow conflicting rules and nobody owns the final outcome.',
  single_message: 'Automation is useful only after the normal path and safe exception route are clear.',
  supporting_points: ['Define the trigger and required information', 'Agree the normal path and outcome owner', 'Separate incomplete information from genuine judgement', 'Test a narrow slice before connecting systems'],
  desired_action: 'Book an on-site automation review, starting with a free 15-minute call',
  topic: 'business process automation readiness',
  angle: 'Show that three rule sets for one workflow are a commercial warning sign, then give owners a six-part readiness check.',
  headline_options: ['How do I know if a business process is ready for automation?', 'Should I fix a process before automating it?', 'What makes a workflow safe to automate?'],
  selected_headline: 'How do I know if a business process is ready for automation?',
  social_headline: 'ONE WORKFLOW. THREE SETS OF RULES.',
  caption_hook_options: ['One workflow. Three sets of rules.', 'If the rules conflict, wait.', 'Automation can move the wrong rule faster.'],
  selected_hook: 'One workflow. Three sets of rules.',
  caption_cta: 'Book a free 15-minute call.',
  visual_concept: 'A real Sydney apartment contractor-access point has three conflicting internal instruction sheets while work waits below.',
  visual_format: 'idea-first operational documentary photograph',
  image_generation_prompt: 'Fresh current-run photorealistic apartment-lobby contractor-access handoff with three conflicting generic instruction notices. No people, readable generated text, logos, office, desk, robots, holograms or futuristic imagery.',
  overlay_copy: ['ONE WORKFLOW. THREE SETS OF RULES.'],
  article_outline: ['Short answer', 'Conflicting rules warning sign', 'Six-part readiness check', 'Messy data versus judgement', 'Test before connecting systems', 'Start with a narrow slice', 'Readiness decision'],
  search_question: 'How do I know if a business process is ready for automation?',
  search_intent: 'informational',
  buyer_stage: 'problem aware',
  direct_answer: directAnswer,
  search_plan_id: 'rl-search-2026-08-12',
  primary_keyword: primaryKeyword,
  secondary_keywords: secondaryKeywords,
  source_urls: [],
  promotion_hypothesis: 'The contradictory-rule visual makes a hidden operational risk clear within one second and leads to a practical workflow review for qualified Sydney owners.',
  risk_notes: ['Do not imply every variation should be removed', 'Do not invent savings or results', 'Keep advice, pricing, unusual commitments and sensitive decisions human', 'Do not use the organic post as paid creative']
};

const content = {
  content_id: contentId, date, campaign_day: 3,
  title: 'How do I know if a business process is ready for automation?', slug, updated: date, status: 'draft',
  excerpt: 'Check the trigger, required information, normal path, owner, outcome and exception route before automating a repeated workflow.',
  description: 'A practical readiness test for Sydney businesses that want to automate a repeated process without moving conflicting rules faster.',
  seo_title: 'Is Your Business Process Ready for Automation?',
  meta_description: 'Use a six-part readiness check before automating a Sydney business process. Clarify rules, ownership and exception paths while keeping judgement human.',
  author: 'Run Lighter',
  tags: [primaryKeyword, ...secondaryKeywords],
  category: 'Workflow automation',
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
  source_urls: [], is_topical: false,
  search_question: 'How do I know if a business process is ready for automation?', direct_answer: directAnswer,
  search_intent: 'informational', buyer_stage: 'problem aware', search_plan_id: 'rl-search-2026-08-12',
  primary_keyword: primaryKeyword, secondary_keywords: secondaryKeywords,
  canonical_url: `https://runlighter.com/blog/${slug}/`,
  reading_time: Math.ceil(article.trim().split(/\s+/).length / 220),
  promotion_score: 96, promotion_candidate: true,
  promotion_reason: 'Fresh professional-service concept with a specific operational consequence, strong one-second tension and a direct path to a workflow-readiness conversation.',
  suggested_paid_audience: 'Owners of established Sydney B2B and professional-service businesses',
  suggested_ad_primary_text: 'When one repeated workflow has three sets of rules, automation can make the inconsistency move faster. Clarify the normal path, owner and exception route first.',
  suggested_ad_headline: 'Is this workflow ready?',
  suggested_ad_description: 'Book a free 15-minute call.',
  creative,
  created_at: createdAt, published_at: '', updated_at: createdAt
};

const intelligence = {
  run_date: date,
  timezone: 'Australia/Sydney',
  commercial_focus: 'Qualified Sydney owner conversations in established B2B and professional-service businesses',
  recent_first_party_signal: 'The 13 August owner-bottleneck package used a direct operational consequence. Current Meta evidence shows no qualified lead outcome, so no performance winner is inferred.',
  concepts: [
    { rank: 1, concept: 'Three Rulebooks', hook: 'ONE WORKFLOW. THREE SETS OF RULES.', score: 96, decision: 'selected for commercial consequence, buyer fit and one-second tension' },
    { rank: 2, concept: 'Faster Wrong', hook: 'A MESSY PROCESS RUNS FASTER WRONG.', score: 89, decision: 'rejected as familiar automation phrasing' },
    { rank: 3, concept: 'Every Monday Changes', hook: 'THE PROCESS CHANGES EVERY MONDAY.', score: 87, decision: 'rejected because the visual was less specific' },
    { rank: 4, concept: 'Exception Pile', hook: 'EVERY CASE BECAME AN EXCEPTION.', score: 85, decision: 'rejected as document-led' },
    { rank: 5, concept: 'Missing Owner', hook: 'WHO OWNS THE FINAL STEP?', score: 83, decision: 'rejected as too close to the owner-bottleneck package' },
    { rank: 6, concept: 'Unstable Start Line', hook: 'THE TRIGGER KEEPS MOVING.', score: 81, decision: 'rejected as visually abstract' },
    { rank: 7, concept: 'Checklist Gap', hook: 'SIX ANSWERS BEFORE ONE AUTOMATION.', score: 78, decision: 'rejected as instructional rather than tense' },
    { rank: 8, concept: 'Wrong Detour', hook: 'AUTOMATE THE ROUTE, NOT DETOURS.', score: 76, decision: 'rejected as a vague workflow metaphor' }
  ],
  selected_concept: {
    commercial_failure: creative.commercial_problem,
    service_mechanism: creative.service_resolution,
    human_boundary: 'Advice, pricing, unusual commitments, sensitive cases and final responsibility remain with the authorised person.',
    source_asset: creative.source_asset,
    source_asset_sha256: sourceHash
  },
  rolling_four_audience_mix: {
    dates: ['2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14'],
    professional_service_or_b2b_led: 4,
    trade_or_field_service_led: 0,
    result: 'pass'
  },
  red_team: { generic_ai_copy: false, vague_workflow_diagram: false, decorative_office: false, robot_or_hologram: false, invented_proof: false, trades_led: false, main_copy_words: 6 }
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
  social_hook: brief.social_headline,
  direct_answer: directAnswer,
  primary_keyword: primaryKeyword,
  secondary_keywords: secondaryKeywords,
  problem: brief.problem,
  status: 'selected-and-rebuilt',
  replacement_note: 'Retained the planned buyer question but replaced the generic hook with a professional-service operational consequence.'
});
await writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');

const registryPath = path.join(root, 'data/content-registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const entry = {
  content_id: contentId, date, campaign_day: 3, topic: brief.topic, angle: brief.angle, headline: content.title, hook: brief.selected_hook,
  visual_format: brief.visual_format, keywords: secondaryKeywords, source_urls: [], article_slug: slug, image_path: content.hero_image,
  caption_hash: sha256(caption), article_hash: sha256(article), status: 'generated', website_url: '', instagram_media_id: '', promotion_score: 96,
  created_at: createdAt, published_at: '', error: null
};
const existingIndex = registry.entries.findIndex(item => item.date === date || item.content_id === contentId);
if (existingIndex >= 0) registry.entries[existingIndex] = { ...registry.entries[existingIndex], ...entry };
else registry.entries.push(entry);
registry.entries.sort((left, right) => left.date.localeCompare(right.date));
await writeFile(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');

const queue = {
  content_id: contentId, date, slug, status: 'generated', validated: false, scheduled_publish_time: '07:00',
  website_published: false, instagram_published: false, facebook_published: false,
  attempts: { website: 0, instagram: 0, facebook: 0 }, last_error: null,
  prepared_social_asset: `generated/drafts/${date}/instagram.png`, caption_source: `_content/blog/${slug}.json`
};
await writeFile(path.join(root, 'data/publish-queue', `${date}.json`), `${JSON.stringify(queue, null, 2)}\n`, 'utf8');

const audit = {
  content_id: contentId, date, local_timezone: 'Australia/Sydney', stage_started_at: createdAt, stage_completed_at: '',
  publish_started_at: '', publish_completed_at: '', candidate_topics: intelligence.concepts, selected_topic: intelligence.selected_concept,
  sources: [], generation_models: { text: { provider: 'manual' }, image: { provider: 'imagegen', source_hash: sourceHash }, research: { provider: 'none', note: 'Evergreen buyer question with no current factual claim.' } },
  validation_results: [], website: {}, instagram: {}, facebook: {}, promotion: { score: 96, candidate: true },
  meta_ads_health: {}, recent_social: {}, lead_path: {}, status: 'generated', errors: []
};
await writeFile(path.join(root, 'logs/content', `${date}.json`), `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({ content_id: contentId, slug, source_hash: sourceHash, article_words: article.trim().split(/\s+/).length, caption_words: caption.trim().split(/\s+/).length, variants }, null, 2));
