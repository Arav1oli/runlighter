export const RUN_LIGHTER_META_POLICY = Object.freeze({
  businessId: '2419577311552088',
  businessAssetId: '1171129046091419',
  facebookPageId: '61592301111343',
  facebookPageName: 'Run Lighter',
  instagramUsername: 'run_lighter',
  adAccountId: '264193331473545',
  campaignId: '120252651440610735',
  adSetId: '120252651440620735',
  allowedOrganicAction: 'publish-new-crosspost',
  forbiddenActions: Object.freeze([
    'share-post',
    'repost',
    'use-existing-post',
    'update-original-post'
  ])
});

const normalise = value => String(value ?? '').trim().replace(/^@/, '');

export function assertRunLighterMetaDestination(candidate = {}) {
  const policy = RUN_LIGHTER_META_POLICY;
  const checks = [
    ['business ID', candidate.businessId, policy.businessId],
    ['business asset ID', candidate.businessAssetId, policy.businessAssetId],
    ['Facebook Page ID', candidate.facebookPageId, policy.facebookPageId],
    ['Instagram username', normalise(candidate.instagramUsername), policy.instagramUsername],
    ['ad account ID', candidate.adAccountId, policy.adAccountId],
    ['campaign ID', candidate.campaignId, policy.campaignId],
    ['ad set ID', candidate.adSetId, policy.adSetId],
    ['organic action', candidate.organicAction, policy.allowedOrganicAction]
  ];

  const mismatches = checks
    .filter(([, actual, expected]) => normalise(actual) !== normalise(expected))
    .map(([label, actual, expected]) => `${label}: expected ${expected}, received ${normalise(actual) || '(missing)'}`);

  const action = normalise(candidate.organicAction);
  if (policy.forbiddenActions.includes(action)) mismatches.push(`forbidden Meta action: ${action}`);

  if (mismatches.length) {
    throw new Error(`Run Lighter Meta destination check failed. ${mismatches.join('; ')}`);
  }

  return {
    ok: true,
    facebookPageId: policy.facebookPageId,
    instagramUsername: policy.instagramUsername,
    adAccountId: policy.adAccountId,
    campaignId: policy.campaignId,
    adSetId: policy.adSetId,
    organicAction: policy.allowedOrganicAction
  };
}
