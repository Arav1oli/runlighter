import { TOPIC_SEEDS } from './topics.mjs';
import { VISUAL_FORMATS } from './constants.mjs';
import { sha256 } from './utils.mjs';

export const normalise = value => String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
const tokens = value => new Set(normalise(value).split(' ').filter(word => word.length > 2));

export function jaccard(a, b) {
  const left = tokens(a), right = tokens(b);
  const intersection = [...left].filter(item => right.has(item)).length;
  const union = new Set([...left,...right]).size;
  return union ? intersection / union : 0;
}

export function similarity(candidate, entry) {
  const title = jaccard(candidate.headline, entry.headline || '');
  const topic = jaccard(`${candidate.topic} ${candidate.angle}`, `${entry.topic || ''} ${entry.angle || ''}`);
  const keywordLeft = new Set(candidate.keywords || []), keywordRight = new Set(entry.keywords || []);
  const keywordUnion = new Set([...keywordLeft,...keywordRight]).size;
  const keywordOverlap = keywordUnion ? [...keywordLeft].filter(item=>keywordRight.has(item)).length / keywordUnion : 0;
  return Math.max(title, topic*.75 + keywordOverlap*.25);
}

function deterministicScore(seed, date, dimension, minimum, spread) {
  const hash = sha256(`${date}:${seed.id}:${dimension}`);
  return minimum + (parseInt(hash.slice(0,8),16) % (spread + 1));
}

export function scoreCandidate(seed, date, registry, index) {
  const recent = registry.entries.filter(entry => entry.date < date).slice(-90);
  const duplication = recent.reduce((maximum, entry) => Math.max(maximum, similarity(seed,entry)),0);
  const previous = recent.at(-1);
  const visual = VISUAL_FORMATS[index % VISUAL_FORMATS.length];
  const dimensions = {
    audience_relevance:deterministicScore(seed,date,'audience',82,16),
    practical_usefulness:deterministicScore(seed,date,'usefulness',84,14),
    distinctiveness:deterministicScore(seed,date,'distinct',72,25),
    positioning_fit:deterministicScore(seed,date,'fit',86,12),
    visual_strength:deterministicScore(seed,date,'visual',75,23),
    article_strength:deterministicScore(seed,date,'article',80,18),
    timeliness:deterministicScore(seed,date,'timeliness',55,35),
    evidence_quality:82,
    promotion_potential:deterministicScore(seed,date,'promotion',68,30),
    duplication_risk:Math.round(duplication*100)
  };
  if (previous?.visual_format === visual) dimensions.visual_strength -= 20;
  const positive = Object.entries(dimensions).filter(([key])=>key!=='duplication_risk').reduce((sum,[,value])=>sum+value,0)/9;
  const score = Math.max(0,Math.min(100,Math.round(positive - duplication*30)));
  return { ...seed, visual_format:visual, dimensions, duplication_similarity:Number(duplication.toFixed(3)), score };
}

const EVERGREEN_LENSES = [
  { id:'core', topic:topic=>topic, angle:(_topic,angle)=>angle, headline:(_topic,headline)=>headline, keyword:'practical' },
  { id:'ownership', topic:topic=>`${topic} ownership`, angle:topic=>`Make ownership and the next action visible whenever ${topic} moves between people or systems`, headline:topic=>`Give ${topic} one clear owner`, keyword:'ownership' },
  { id:'rules', topic:topic=>`${topic} rules`, angle:topic=>`Define the normal path, exceptions and human decisions before automating ${topic}`, headline:topic=>`Set rules before automating ${topic}`, keyword:'rules' },
  { id:'customer', topic:topic=>`${topic} experience`, angle:topic=>`Use dependable ${topic} to improve consistency without making the customer experience impersonal`, headline:topic=>`Keep ${topic} consistent and human`, keyword:'experience' },
  { id:'timing', topic:topic=>`${topic} timing`, angle:topic=>`Remove avoidable waiting by making the trigger and response time for ${topic} explicit`, headline:topic=>`Stop waiting on ${topic}`, keyword:'timing' }
];

function evergreenCandidates() {
  return TOPIC_SEEDS.flatMap(seed=>EVERGREEN_LENSES.map(lens=>({
    ...seed,
    id:`${seed.id}-${lens.id}`,
    topic:lens.topic(seed.topic),
    angle:lens.angle(seed.topic,seed.angle),
    headline:lens.headline(seed.topic,seed.headline),
    keywords:[...new Set([...seed.keywords,lens.keyword])]
  })));
}

export function selectTopic(date, registry, threshold = .82, researchCandidates = []) {
  const candidates = [...evergreenCandidates(),...researchCandidates.map((item,index)=>({ id:`research-${index}`, keywords:item.keywords||[], ...item }))]
    .map((seed,index)=>scoreCandidate(seed,date,registry,index))
    .sort((a,b)=>b.score-a.score);
  const previousVisual = registry.entries.filter(entry=>entry.date<date).at(-1)?.visual_format;
  const selected = candidates.find(item=>item.duplication_similarity < threshold && item.visual_format !== previousVisual)
    || candidates.find(item=>item.duplication_similarity < threshold);
  if (!selected) throw new Error('No topic passed the duplication threshold');
  return { selected, shortlist:candidates.slice(0,7) };
}
