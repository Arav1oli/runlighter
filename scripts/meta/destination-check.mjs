#!/usr/bin/env node
import { assertRunLighterMetaDestination } from '../../src/lib/meta-publishing-safety.mjs';

const option = name => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : '';
};

try {
  const result = assertRunLighterMetaDestination({
    businessId: option('business-id'),
    businessAssetId: option('business-asset-id'),
    facebookPageId: option('facebook-page-id'),
    instagramUsername: option('instagram-username'),
    adAccountId: option('ad-account-id'),
    campaignId: option('campaign-id'),
    adSetId: option('ad-set-id'),
    organicAction: option('organic-action')
  });
  console.log(JSON.stringify(result));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
