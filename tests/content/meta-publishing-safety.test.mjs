import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RUN_LIGHTER_META_POLICY,
  assertRunLighterMetaDestination
} from '../../src/lib/meta-publishing-safety.mjs';

const allowed = {
  businessId: '2419577311552088',
  businessAssetId: '1171129046091419',
  facebookPageId: '61592301111343',
  instagramUsername: '@run_lighter',
  adAccountId: '264193331473545',
  campaignId: '120252651440610735',
  adSetId: '120252651440620735',
  organicAction: 'publish-new-crosspost'
};

test('Run Lighter Meta destination allowlist accepts only the authorised package', () => {
  assert.deepEqual(assertRunLighterMetaDestination(allowed), {
    ok: true,
    facebookPageId: '61592301111343',
    instagramUsername: 'run_lighter',
    adAccountId: '264193331473545',
    campaignId: '120252651440610735',
    adSetId: '120252651440620735',
    organicAction: 'publish-new-crosspost'
  });
});

test('Run Lighter Meta destination allowlist fails closed on another Page', () => {
  assert.throws(
    () => assertRunLighterMetaDestination({ ...allowed, facebookPageId: 'another-page' }),
    /Facebook Page ID/
  );
});

test('Run Lighter Meta destination allowlist forbids updating an organic post from Ads Manager', () => {
  assert.ok(RUN_LIGHTER_META_POLICY.forbiddenActions.includes('update-original-post'));
  assert.throws(
    () => assertRunLighterMetaDestination({ ...allowed, organicAction: 'update-original-post' }),
    /forbidden Meta action/
  );
});
