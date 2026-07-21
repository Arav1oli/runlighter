import { DEFAULT_CTA, VISUAL_FORMATS } from './constants.mjs';
import { stableId } from './utils.mjs';

const CTAS = [
  'Read the full article',
  'Consider where the same work repeats in your business',
  'Book an on-site automation review',
  'Save this for your next process review',
  'Share this with the person who owns the workflow'
];

export function createBrief(date, campaignDay, topic, sources = []) {
  const contentId = stableId(date, topic.topic);
  const hookOptions = [
    topic.headline,
    `Where does ${topic.topic} get stuck?`,
    `The hidden work around ${topic.topic}`
  ];
  const headlineOptions = [topic.headline, topic.angle.split(/[.!?]/)[0], `A lighter way to handle ${topic.topic}`];
  const cta = CTAS[(campaignDay-1)%CTAS.length];
  return {
    content_id:contentId,
    date,
    campaign_day:campaignDay,
    audience:'Owners and operations leaders in established Sydney service businesses',
    problem:`Routine ${topic.topic} work is spread across people and systems, creating checking, chasing and double handling.`,
    single_message:topic.angle,
    supporting_points:[
      'Map the real workflow before choosing technology',
      'Automate repeated movement and rule-based actions',
      'Keep exceptions, relationships and accountability human'
    ],
    desired_action:DEFAULT_CTA,
    topic:topic.topic,
    angle:topic.angle,
    headline_options:headlineOptions,
    selected_headline:headlineOptions[0],
    caption_hook_options:hookOptions,
    selected_hook:hookOptions[(campaignDay-1)%hookOptions.length],
    caption_cta:cta,
    visual_concept:`A ${topic.visual_format.replaceAll('-',' ')} that makes the repeated steps and the human decision point visible`,
    visual_format:topic.visual_format,
    image_generation_prompt:`Scroll-stopping editorial concept illustrating ${topic.topic} in a recognisably Australian service business, earthy green and warm neutral palette, one dominant focal idea, visible tension or transformation. Use people sparingly and only when a real human presence strengthens the concept. Avoid decorative office filler, empty rooms and generic stock-photo staging`,
    overlay_copy:[headlineOptions[0]],
    article_outline:['The operational problem','Why the problem persists','A practical way to improve it','What remains human','Implementation considerations','Conclusion'],
    primary_keyword:`${topic.topic} automation`,
    secondary_keywords:[...new Set([...(topic.keywords||[]),'business automation','Sydney business'])],
    source_urls:sources,
    promotion_hypothesis:`The ${topic.topic} problem is recognisable, the hook is direct and the visual can explain a practical improvement without hype.`,
    risk_notes:['Do not imply staff replacement','Do not invent quantified outcomes','Keep human judgement explicit']
  };
}
