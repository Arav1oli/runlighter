import { sha256 } from './utils.mjs';

const bounded = value => Math.max(0,Math.min(100,Math.round(value)));
const signal = (key, minimum, range) => minimum + (parseInt(sha256(key).slice(0,8),16) % (range+1));

export function scorePromotion(brief, validation, threshold = 80) {
  const values = {
    audience_relevance:signal(`${brief.content_id}:audience`,76,21),
    hook_strength:signal(`${brief.content_id}:hook`,62,34),
    benefit_clarity:signal(`${brief.content_id}:benefit`,72,25),
    practical_value:signal(`${brief.content_id}:practical`,78,20),
    visual_quality:signal(`${brief.content_id}:visual`,68,29),
    distinctiveness:signal(`${brief.content_id}:distinct`,60,36),
    offer_alignment:signal(`${brief.content_id}:offer`,74,23),
    misunderstanding_risk:signal(`${brief.content_id}:risk`,5,22),
    time_sensitivity:brief.source_urls.length ? signal(`${brief.content_id}:time`,20,40) : 5,
    correct_audience_likelihood:signal(`${brief.content_id}:correct`,70,27)
  };
  const positive = ['audience_relevance','hook_strength','benefit_clarity','practical_value','visual_quality','distinctiveness','offer_alignment','correct_audience_likelihood'].reduce((sum,key)=>sum+values[key],0)/8;
  const score = bounded(positive - values.misunderstanding_risk*.15 - values.time_sensitivity*.08 - 2);
  const candidate = score >= threshold && validation.passed;
  return { promotion_score:score, promotion_candidate:candidate, promotion_reason:candidate ? 'Strong practical relevance, clear hook and direct fit with the on-site review offer.' : 'Useful organic content, but the hook or breadth is not strong enough for paid promotion yet.', dimensions:values };
}
