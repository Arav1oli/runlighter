import { sha256 } from '../utils.mjs';

const asNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const hoursSince = value => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? Math.max(0, (Date.now() - timestamp) / 3600000) : 0;
};

const inferAudience = name => {
  const value = name.toLowerCase();
  if (/account|bookkeep|finance/.test(value)) return 'Sydney accounting and advisory firms';
  if (/trad|plumb|spark|electric|build|roofer|mechanic/.test(value)) return 'Sydney trade and field-service business owners';
  if (/restaurant|booking|hospitality/.test(value)) return 'Sydney hospitality business owners';
  if (/law|legal|solicitor/.test(value)) return 'Sydney legal and professional-service firms';
  return 'Sydney owner-led service businesses';
};

const inferProblem = name => {
  const value = name.toLowerCase();
  if (/\$0|review|no obligation/.test(value)) return 'business owners who are curious about automation but do not know where to begin';
  if (/data|entry|copy|typing/.test(value)) return 'staff retyping the same customer information between paid systems';
  if (/quote/.test(value)) return 'quotes remaining unfinished while the owner is on the tools';
  if (/lead|follow/.test(value)) return 'valuable enquiries waiting too long for a useful response';
  if (/admin/.test(value)) return 'repeated administration consuming skilled staff time';
  if (/owner|everywhere/.test(value)) return 'routine work depending on the owner to keep moving';
  return 'repeated digital work slowing down a growing service business';
};

const hookForProblem = problem => {
  if (problem.includes('where to begin')) return 'Find your first useful automation';
  if (problem.includes('retyping')) return 'Stop paying staff to copy data';
  if (problem.includes('quotes')) return 'Get the quote out sooner';
  if (problem.includes('enquiries')) return 'Good leads should not wait';
  if (problem.includes('administration')) return 'Admin should not consume skilled staff';
  if (problem.includes('owner')) return 'Your business should keep moving';
  return 'Remove the work people should not repeat';
};

function classify(ad, leadOutcome, config) {
  const leads = Math.max(asNumber(ad.leads), asNumber(leadOutcome.leads));
  const qualified = asNumber(leadOutcome.qualified);
  const booked = asNumber(leadOutcome.booked);
  const won = asNumber(leadOutcome.won);
  const spend = asNumber(ad.spend);
  const impressions = asNumber(ad.impressions);
  const ageHours = hoursSince(ad.created_time);
  const enoughDelivery = spend >= config.minimumSpend || impressions >= config.minimumImpressions;
  const oldEnough = ageHours >= config.minimumAgeHours;
  let classification = 'hold';
  let reason = 'Not enough evidence yet';
  if (won > 0 || qualified > 0 || leads >= config.winnerLeadCount) {
    classification = 'winner';
    reason = won > 0
      ? 'Confirmed client outcome'
      : qualified > 0
        ? 'Qualified lead outcome recorded'
        : `${leads} leads recorded`;
  } else if (leads > 0) {
    classification = 'learning';
    reason = `${leads} lead${leads === 1 ? '' : 's'} recorded, but commercial quality is not confirmed`;
  } else if (enoughDelivery && oldEnough) {
    classification = 'pause-review';
    reason = `No leads after ${spend.toFixed(2)} spend and ${impressions} impressions`;
  } else if (enoughDelivery) {
    reason = 'Delivery threshold reached, but the observation window is still open';
  }
  return {
    ...ad,
    leads,
    qualified,
    booked,
    won,
    age_hours: Number(ageHours.toFixed(1)),
    enough_delivery: enoughDelivery,
    old_enough: oldEnough,
    classification,
    reason
  };
}

function buildTheory(ads) {
  const winners = ads.filter(ad => ad.classification === 'winner');
  const learning = ads.filter(ad => ad.classification === 'learning');
  const weak = ads.filter(ad => ad.classification === 'pause-review');
  if (winners.length) {
    const leader = [...winners].sort((left, right) => (right.qualified * 10 + right.leads) - (left.qualified * 10 + left.leads))[0];
    if (/\$0|review|no obligation/i.test(leader.ad_name)) {
      return `The clearest evidence currently favours “${leader.ad_name}”. It has produced ${leader.leads} lead${leader.leads === 1 ? '' : 's'} and suggests the low-friction review offer is doing more work than broad automation language. This is a lead-volume signal, not yet proof of lead quality. The next variation should keep the offer, qualify Sydney owner-led service businesses more sharply and name one repeated workflow the review will uncover.`;
    }
    return `The clearest evidence currently favours “${leader.ad_name}”. It names a recognisable operational problem and has produced ${leader.leads} lead${leader.leads === 1 ? '' : 's'}${leader.qualified ? `, including ${leader.qualified} qualified` : ''}. Broad or less concrete messages should not receive more weight until they show the same commercial signal. The next variation should keep the problem specific, qualify the audience more sharply and retain the low-pressure review offer.`;
  }
  if (learning.length) {
    const leader = [...learning].sort((left, right) => right.leads - left.leads)[0];
    return `“${leader.ad_name}” is producing an early lead signal, but lead quality has not yet been recorded. The immediate job is not more creative volume. It is to contact and classify those leads, then use the outcome to decide whether the angle deserves another variation.`;
  }
  if (weak.length) {
    return 'No ad has produced a recorded lead or qualified outcome after the current evidence window. The next test should narrow to one buyer, one repeated workflow and one concrete on-site review outcome instead of repeating broad automation language.';
  }
  return 'The account does not yet contain enough delivery or lead-quality evidence for a confident creative decision. Keep the current tests stable, complete lead follow-up and reassess after the minimum observation window.';
}

function buildNextTest(ads, date) {
  const candidates = ads.filter(ad => ['winner', 'learning'].includes(ad.classification));
  const leader = [...candidates].sort((left, right) => (right.qualified * 10 + right.leads) - (left.qualified * 10 + left.leads))[0];
  const audience = inferAudience(leader?.ad_name || '');
  const problem = inferProblem(leader?.ad_name || '');
  const headline = hookForProblem(problem);
  return {
    id: `marketing-signal-${date}-${sha256(`${audience}:${problem}`).slice(0, 8)}`,
    source: 'run-lighter-marketing-learning-system',
    topic: problem,
    angle: `For ${audience}, show how Run Lighter connects the workflow so information is handled once while exceptions and judgement remain human.`,
    headline,
    audience,
    problem,
    keywords: ['workflow', 'business automation', 'Sydney service business', 'operational efficiency'],
    supporting_points: [
      'Name the repeated work in plain language',
      'Show the existing tools or real work context',
      'Offer a low-pressure on-site automation review'
    ],
    desired_action: 'Book an On-Site Automation Review',
    visual_concept: `A real Australian service-business scene that makes ${problem} immediately visible, with one dominant focal point and no generic AI imagery`,
    evidence_quality: leader?.qualified ? 98 : leader?.leads ? 92 : 78,
    priority_boost: leader ? 12 : 4,
    evidence: leader ? {
      source_ad_id: leader.ad_id,
      source_ad_name: leader.ad_name,
      leads: leader.leads,
      qualified: leader.qualified,
      booked: leader.booked,
      won: leader.won
    } : null,
    suggested_ad_primary_text: `${headline}. Run Lighter finds the repeated work slowing the business down, then maps the first useful connection around the software already in place. Sydney owners can start with a no-obligation on-site automation review.`,
    suggested_ad_headline: 'Book a $0 Automation Review'
  };
}

export function analyseMarketingSnapshot(snapshot, leadSummary, config, date) {
  const outcomeByName = leadSummary.by_ad_name || {};
  const ads = (snapshot.ads || []).map(ad => classify(ad, outcomeByName[ad.ad_name] || {}, config));
  const pauseCandidates = ads
    .filter(ad => ad.classification === 'pause-review' && !['PAUSED', 'ARCHIVED', 'DELETED'].includes(ad.effective_status))
    .sort((left, right) => right.spend - left.spend || right.impressions - left.impressions)
    .slice(0, config.maximumPauseRecommendations);
  const actions = pauseCandidates.map(ad => ({
    action_id: sha256(`${date}:${ad.ad_id}:PAUSED`).slice(0, 20),
    type: 'pause-ad',
    ad_id: ad.ad_id,
    ad_name: ad.ad_name,
    proposed_status: 'PAUSED',
    reason: ad.reason,
    requires_live_confirmation: true,
    status: 'recommended'
  }));
  return {
    date,
    generated_at: new Date().toISOString(),
    source: snapshot.source || 'unknown',
    window: { since: snapshot.since || '', until: snapshot.until || '' },
    account_id: snapshot.account_id || '',
    campaign_id: snapshot.campaign_id || '',
    summary: {
      ads: ads.length,
      winners: ads.filter(ad => ad.classification === 'winner').length,
      learning: ads.filter(ad => ad.classification === 'learning').length,
      hold: ads.filter(ad => ad.classification === 'hold').length,
      pause_review: pauseCandidates.length,
      leads: ads.reduce((sum, ad) => sum + ad.leads, 0),
      qualified: ads.reduce((sum, ad) => sum + ad.qualified, 0),
      booked: ads.reduce((sum, ad) => sum + ad.booked, 0),
      won: ads.reduce((sum, ad) => sum + ad.won, 0)
    },
    theory: buildTheory(ads),
    ads,
    actions,
    next_test: buildNextTest(ads, date)
  };
}
