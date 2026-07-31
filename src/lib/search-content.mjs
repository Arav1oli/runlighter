import { readdir } from 'node:fs/promises';
import { addDays, exists, fromRoot, readJson, sha256, writeJson } from './utils.mjs';

export const SEARCH_QUESTION_SEEDS = [
  {
    id: 'first-automation',
    question: 'Which business process should I automate first?',
    social_hook: 'Find Your First Useful Automation',
    direct_answer: 'Start with one repeated, rules-based workflow that creates visible delay or double handling. Map the real process first, keep exceptions human and prove one useful improvement before expanding.',
    topic: 'choosing the first business automation',
    search_intent: 'commercial investigation',
    buyer_stage: 'problem aware',
    primary_keyword: 'which business process to automate first',
    secondary_keywords: ['first business automation', 'automation review Sydney', 'workflow automation'],
    problem: 'The owner is interested in automation but does not know which workflow is useful enough to justify starting.',
    priority: 100
  },
  {
    id: 'automation-cost-sydney',
    question: 'How much does business automation cost in Sydney?',
    social_hook: 'What Should Automation Actually Cost?',
    direct_answer: 'The cost depends on workflow complexity, the systems involved, exception handling, testing and ongoing support. A useful proposal should begin with a scoped workflow review rather than a generic software package.',
    topic: 'business automation cost in Sydney',
    search_intent: 'transactional',
    buyer_stage: 'solution aware',
    primary_keyword: 'business automation cost Sydney',
    secondary_keywords: ['automation consultant Sydney', 'workflow automation pricing', 'AI automation cost'],
    problem: 'Sydney business owners need a credible way to understand automation scope and cost before committing to a build.',
    priority: 98
  },
  {
    id: 'what-can-ai-automate',
    question: 'What can AI automate in a small service business?',
    social_hook: 'What Could AI Handle Here?',
    direct_answer: 'AI and workflow automation can help with repeated digital work such as enquiry capture, data movement, document preparation, reminders, reporting and triage. Commercial decisions, unusual cases and important customer conversations should stay under human judgement.',
    topic: 'AI automation for a small service business',
    search_intent: 'informational',
    buyer_stage: 'category aware',
    primary_keyword: 'AI automation for small business',
    secondary_keywords: ['small business automation Sydney', 'service business automation', 'AI workflow examples'],
    problem: 'The owner knows AI may help but cannot translate the category into practical workflows inside the business.',
    priority: 97
  },
  {
    id: 'existing-software',
    question: 'Can automation work with the software my business already uses?',
    social_hook: 'Your Software May Be Enough',
    direct_answer: 'Often, yes. The first step is to map where information enters, where it needs to move and which systems offer safe integration options. Replacing the software stack should not be the default.',
    topic: 'connecting existing business software',
    search_intent: 'commercial investigation',
    buyer_stage: 'solution aware',
    primary_keyword: 'connect existing business software automation',
    secondary_keywords: ['CRM integration Sydney', 'Xero automation', 'business software integration'],
    problem: 'The owner wants less manual work but is concerned that automation will require an expensive software replacement.',
    priority: 96
  },
  {
    id: 'lead-follow-up',
    question: 'How do I automate lead follow-up without sounding robotic?',
    social_hook: 'Automate The Reminder, Not Rapport',
    direct_answer: 'Automate acknowledgement, routing, reminders and visibility, then keep the sales conversation human. The system should help the right person respond with context rather than send an endless generic sequence.',
    topic: 'human lead follow-up automation',
    search_intent: 'informational',
    buyer_stage: 'problem aware',
    primary_keyword: 'automate lead follow up',
    secondary_keywords: ['lead response automation', 'CRM follow-up Sydney', 'sales workflow automation'],
    problem: 'Leads wait too long, but the business does not want automation to make its customer communication feel impersonal.',
    priority: 95
  },
  {
    id: 'staff-replacement',
    question: 'Will business automation replace my staff?',
    social_hook: 'Automate Repetition, Keep Human Judgement',
    direct_answer: 'Good automation should remove repeated movement, checking and reminders around the team, not erase the judgement, accountability and relationships the team provides.',
    topic: 'automation and staff roles',
    search_intent: 'informational',
    buyer_stage: 'category aware',
    primary_keyword: 'will automation replace staff',
    secondary_keywords: ['responsible business automation', 'human judgement automation', 'AI and employees'],
    problem: 'The owner and team are interested in automation but concerned about what it means for people and accountability.',
    priority: 94
  },
  {
    id: 'consultant-sydney',
    question: 'How do I choose an AI automation consultant in Sydney?',
    social_hook: 'Choose The Workflow, Not Hype',
    direct_answer: 'Choose a consultant who starts with the real workflow, explains what remains human, works with existing systems where sensible, defines testing and support, and can show a clear path from review to implementation.',
    topic: 'choosing an AI automation consultant in Sydney',
    search_intent: 'transactional',
    buyer_stage: 'provider aware',
    primary_keyword: 'AI automation consultant Sydney',
    secondary_keywords: ['business automation Sydney', 'workflow consultant Sydney', 'AI consultant for small business'],
    problem: 'The owner is comparing providers and needs practical criteria that separate workflow capability from generic AI sales language.',
    priority: 93
  },
  {
    id: 'automation-ready',
    question: 'How do I know if a business process is ready for automation?',
    social_hook: 'Is This Workflow Ready?',
    direct_answer: 'A process is usually ready when the trigger, normal path, owner, expected outcome and exception path are understood. If the rules change every week, stabilise the process before automating it.',
    topic: 'business process automation readiness',
    search_intent: 'informational',
    buyer_stage: 'problem aware',
    primary_keyword: 'business process ready for automation',
    secondary_keywords: ['automation readiness checklist', 'workflow mapping', 'process automation Sydney'],
    problem: 'The business wants to automate a workflow that may not yet have stable rules or clear ownership.',
    priority: 92
  },
  {
    id: 'on-site-review',
    question: 'What happens during an on-site automation review?',
    social_hook: 'What Happens In The Review?',
    direct_answer: 'The review follows a real workflow through the business, identifies repeated work and handover friction, separates rules from judgement and recommends one practical place to start.',
    topic: 'on-site automation review',
    search_intent: 'transactional',
    buyer_stage: 'provider aware',
    primary_keyword: 'on-site automation review Sydney',
    secondary_keywords: ['automation audit Sydney', 'workflow review', 'business process review'],
    problem: 'A prospective client wants to know what the first meeting involves and whether it will produce a practical next step.',
    priority: 91
  },
  {
    id: 'invoicing',
    question: 'How can a service business automate invoicing after a job?',
    social_hook: 'Finished Work Should Trigger Invoicing',
    direct_answer: 'Use the approved job status and confirmed commercial details to prepare the invoice workflow automatically, then keep price changes, disputes and final approval with the responsible person.',
    topic: 'service business invoicing automation',
    search_intent: 'informational',
    buyer_stage: 'solution aware',
    primary_keyword: 'service business invoicing automation',
    secondary_keywords: ['Xero workflow automation', 'job completion invoicing', 'invoice preparation automation'],
    problem: 'Finished work waits for someone to re-enter job details before invoicing can begin.',
    priority: 90
  },
  {
    id: 'data-entry',
    question: 'How can I stop entering the same customer data twice?',
    social_hook: 'Stop Typing It Twice',
    direct_answer: 'Capture the information once at an approved source, give each field a clear owner and connect downstream systems so routine data moves without being retyped.',
    topic: 'duplicate customer data entry',
    search_intent: 'informational',
    buyer_stage: 'problem aware',
    primary_keyword: 'stop duplicate data entry',
    secondary_keywords: ['CRM data automation', 'connect business systems', 'data entry automation'],
    problem: 'Customer information is repeatedly copied between email, spreadsheets, CRM and finance software.',
    priority: 89
  },
  {
    id: 'quotes',
    question: 'How can a trade business automate quotes and variations?',
    social_hook: 'Scope Changed. Did Price Change?',
    direct_answer: 'A useful workflow compares approved scope with later plans, messages and site notes, prepares a reviewable variation and keeps pricing approval with the responsible person.',
    topic: 'trade quote and variation automation',
    search_intent: 'commercial investigation',
    buyer_stage: 'solution aware',
    primary_keyword: 'trade quote automation',
    secondary_keywords: ['quote variation workflow', 'builder automation Sydney', 'trade business automation'],
    problem: 'Scope changes are recorded in several places and do not reliably reach the pricing workflow.',
    priority: 88
  },
  {
    id: 'reporting',
    question: 'Can weekly business reports be generated automatically?',
    social_hook: 'Stop Rebuilding Weekly Reports',
    direct_answer: 'Yes, when the source data, definitions and review owner are clear. Automate collection and formatting, then keep interpretation and action with the people responsible for the business.',
    topic: 'automated weekly business reporting',
    search_intent: 'informational',
    buyer_stage: 'solution aware',
    primary_keyword: 'automated weekly business reports',
    secondary_keywords: ['reporting automation', 'business dashboard Sydney', 'management reporting workflow'],
    problem: 'Staff rebuild the same weekly report by copying figures from several systems.',
    priority: 87
  },
  {
    id: 'missed-enquiries',
    question: 'How can automation stop new enquiries being missed?',
    social_hook: 'Good Enquiries Should Not Wait',
    direct_answer: 'Give every enquiry one capture path, send an immediate acknowledgement, route it to a clear owner and make overdue human follow-up visible.',
    topic: 'new enquiry automation',
    search_intent: 'commercial investigation',
    buyer_stage: 'problem aware',
    primary_keyword: 'automate new enquiries',
    secondary_keywords: ['lead capture automation', 'missed enquiry workflow', 'Sydney service business leads'],
    problem: 'New enquiries arrive through several channels and depend on someone noticing, copying and assigning them.',
    priority: 86
  }
];

const planDirectory = () => fromRoot('data', 'search-plans');
export const searchPlanPath = startDate => fromRoot('data', 'search-plans', `${startDate}.json`);

async function loadPlans() {
  try {
    const files = (await readdir(planDirectory())).filter(file => file.endsWith('.json')).sort();
    return Promise.all(files.map(file => readJson(fromRoot('data', 'search-plans', file))));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

const containsDate = (plan, date) => plan.start_date <= date && plan.end_date >= date;

export function nextUnscheduledDate(date, registry) {
  let candidate = date;
  while (registry.entries.some(entry => entry.date === candidate)) candidate = addDays(candidate, 1);
  return candidate;
}

function usedQuestionIds(plans) {
  return new Set(plans.flatMap(plan => plan.questions || []).map(question => question.question_id));
}

function candidateScore(seed, startDate) {
  const variation = parseInt(sha256(`${startDate}:${seed.id}`).slice(0, 4), 16) % 7;
  return seed.priority + variation;
}

function queryTokens(value) {
  return new Set(String(value).toLowerCase().match(/[a-z0-9]+/g)?.filter(token => token.length > 2) || []);
}

function searchPerformanceBoost(seed, searchPerformance) {
  const seedTokens = queryTokens(`${seed.question} ${seed.primary_keyword} ${seed.secondary_keywords.join(' ')}`);
  return Math.max(0, ...(searchPerformance.queries || []).map(item => {
    const tokens = queryTokens(item.query);
    const shared = [...tokens].filter(token => seedTokens.has(token)).length;
    const overlap = tokens.size ? shared / tokens.size : 0;
    const demand = Math.min(4, Math.log10(Math.max(1, Number(item.impressions) || 0) + 1));
    return overlap * 12 + demand;
  }));
}

async function loadSearchPerformance() {
  const path = fromRoot('data', 'search-performance', 'latest.json');
  if (!await exists(path)) return { source: 'question-library', queries: [] };
  const performance = await readJson(path);
  return {
    source: performance.source || 'Google Search Console export',
    exported_at: performance.exported_at || '',
    queries: Array.isArray(performance.queries) ? performance.queries : []
  };
}

export async function createWeeklySearchPlan(requestedDate, registry, { force = false } = {}) {
  const plans = await loadPlans();
  const requestedExisting = plans.find(plan => containsDate(plan, requestedDate));
  if (requestedExisting && !force) return { plan: requestedExisting, idempotent: true };

  const startDate = nextUnscheduledDate(requestedDate, registry);
  const path = searchPlanPath(startDate);
  if (!force && await exists(path)) return { plan: await readJson(path), idempotent: true };

  const searchPerformance = await loadSearchPerformance();
  const used = usedQuestionIds(plans);
  const unused = SEARCH_QUESTION_SEEDS.filter(seed => !used.has(seed.id));
  const pool = (unused.length >= 7 ? unused : SEARCH_QUESTION_SEEDS)
    .map(seed => ({
      ...seed,
      score: candidateScore(seed, startDate) + searchPerformanceBoost(seed, searchPerformance)
    }))
    .sort((left, right) => right.score - left.score);
  const selected = pool.slice(0, 7);
  const questions = selected.map((seed, index) => ({
    date: addDays(startDate, index),
    day: index + 1,
    question_id: seed.id,
    question: seed.question,
    social_hook: seed.social_hook,
    direct_answer: seed.direct_answer,
    topic: seed.topic,
    search_intent: seed.search_intent,
    buyer_stage: seed.buyer_stage,
    primary_keyword: seed.primary_keyword,
    secondary_keywords: seed.secondary_keywords,
    problem: seed.problem,
    status: 'planned'
  }));
  const plan = {
    plan_id: `rl-search-${startDate}`,
    created_at: new Date().toISOString(),
    start_date: startDate,
    end_date: addDays(startDate, 6),
    audience: 'Owner-led Sydney service businesses searching for practical AI and workflow help',
    objective: 'Answer one real buyer question per day, then work backwards into a useful article, social creative and low-pressure next step.',
    search_data: {
      source: searchPerformance.source,
      exported_at: searchPerformance.exported_at || null,
      queries_considered: searchPerformance.queries.length
    },
    methodology: [
      'Prefer questions with clear Sydney buyer relevance and a practical answer',
      'Use Google Search Console query data when available',
      'Use the existing Run Lighter problem library when search data is unavailable',
      'Avoid near-duplicate fan-out pages and scaled search-first content',
      'Answer the question before explaining the workflow'
    ],
    free_tools: [
      'Google Search Console',
      'Google Trends',
      'Google Search and autocomplete review',
      'Bing Webmaster Tools',
      'IndexNow',
      'Run Lighter sitemap and RSS feed'
    ],
    questions
  };
  await writeJson(path, plan);
  return { plan, idempotent: false };
}

export async function searchQuestionCandidate(date, registry) {
  let plans = await loadPlans();
  let plan = plans.find(item => containsDate(item, date));
  if (!plan) {
    const created = await createWeeklySearchPlan(date, registry);
    plan = created.plan;
    plans = [...plans, plan];
  }
  const question = plan.questions.find(item => item.date === date);
  if (!question) return null;
  return {
    id: `search-${question.question_id}-${date}`,
    topic: question.topic,
    angle: question.direct_answer,
    headline: question.question,
    search_question: question.question,
    social_hook: question.social_hook,
    direct_answer: question.direct_answer,
    search_intent: question.search_intent,
    buyer_stage: question.buyer_stage,
    audience: plan.audience,
    problem: question.problem,
    keywords: question.secondary_keywords,
    primary_keyword: question.primary_keyword,
    supporting_points: [
      'Give the direct answer first',
      'Show the workflow and the boundary of human judgement',
      'Offer a practical next step for a Sydney business owner'
    ],
    desired_action: 'Book an on-site automation review',
    promotion_hypothesis: `The question matches ${question.search_intent} intent and can become both a useful article and a specific social hook.`,
    evidence_quality: 92,
    priority_boost: 24,
    search_plan_id: plan.plan_id
  };
}

export async function searchPlanStatus(date, registry) {
  const plans = await loadPlans();
  const active = plans.find(plan => containsDate(plan, date));
  return {
    date,
    active_plan: active?.plan_id || null,
    next_unscheduled_date: nextUnscheduledDate(date, registry),
    plans: plans.map(plan => ({
      plan_id: plan.plan_id,
      start_date: plan.start_date,
      end_date: plan.end_date,
      questions: plan.questions.length
    }))
  };
}
