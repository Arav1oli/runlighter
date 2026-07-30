import test from 'node:test';
import assert from 'node:assert/strict';
import { loadMarketingConfig, assertMetaWriteConfiguration } from '../../src/lib/marketing-agent/config.mjs';
import { parseCsv, stringifyCsv } from '../../src/lib/marketing-agent/csv.mjs';
import { metaLeadToRow, summariseLeadOutcomes, deliverLeadWebhook } from '../../src/lib/marketing-agent/leads.mjs';
import { analyseMarketingSnapshot } from '../../src/lib/marketing-agent/decision.mjs';
import { MetaGraphAdapter } from '../../src/lib/marketing-agent/meta.mjs';
import { dateWindow } from '../../src/lib/marketing-agent/engine.mjs';
import { scoreCandidate } from '../../src/lib/topic-engine.mjs';

test('marketing configuration keeps Meta writes off by default', () => {
  const config = loadMarketingConfig({});
  assert.equal(config.allowMetaWrites, false);
  assert.equal(config.dryRun, true);
  assert.throws(
    () => assertMetaWriteConfiguration({
      ...config,
      metaApiVersion: 'v99.0',
      metaAccessToken: 'token',
      dryRun: false
    }, true),
    /MARKETING_ALLOW_META_WRITES/
  );
});

test('CSV parser preserves commas, quotes and line breaks', () => {
  const rows = [{
    'Lead Received At': '2026-07-30T10:00:00+10:00',
    'Meta Lead ID': 'lead-1',
    'Full Name': 'Alex Example',
    Email: 'alex@example.com',
    Phone: '',
    'Campaign Name': 'Run Lighter',
    'Ad Set Name': 'Sydney',
    'Ad Name': 'Concrete problem',
    'Form Name': 'RL Ad',
    Platform: 'Meta',
    Status: 'New',
    'Follow-up Owner': 'Adrian',
    'First Contact At': '',
    Notes: 'Asked about "quotes", follow up\nFriday'
  }];
  const csv = stringifyCsv(rows);
  const parsed = parseCsv(csv);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[1][13], rows[0].Notes);
});

test('Meta lead mapping and commercial outcome summary are deterministic', () => {
  const row = metaLeadToRow({
    id: 'lead-1',
    created_time: '2026-07-30T00:00:00Z',
    ad_name: 'Concrete data entry problem',
    field_data: [
      { name: 'full_name', values: ['Alex Example'] },
      { name: 'email', values: ['alex@example.com'] }
    ]
  });
  row.Status = 'Booked';
  row['First Contact At'] = '2026-07-30T01:00:00Z';
  const summary = summariseLeadOutcomes([row]);
  assert.equal(summary.total, 1);
  assert.equal(summary.contacted, 1);
  assert.equal(summary.qualified, 1);
  assert.equal(summary.booked, 1);
  assert.equal(summary.by_ad_name['Concrete data entry problem'].leads, 1);
});

test('decision engine separates winners, weak ads and immature tests', () => {
  const config = loadMarketingConfig({
    MARKETING_MINIMUM_SPEND: '20',
    MARKETING_MINIMUM_IMPRESSIONS: '1000',
    MARKETING_MINIMUM_AGE_HOURS: '72',
    MARKETING_WINNER_LEAD_COUNT: '2'
  });
  const snapshot = {
    source: 'test',
    account_id: 'account',
    campaign_id: 'campaign',
    since: '2026-07-24',
    until: '2026-07-30',
    ads: [
      {
        ad_id: 'winner',
        ad_name: 'Destroy data entry',
        created_time: '2020-01-01T00:00:00Z',
        effective_status: 'ACTIVE',
        spend: 25,
        impressions: 1500,
        leads: 2
      },
      {
        ad_id: 'weak',
        ad_name: 'Broad AI message',
        created_time: '2020-01-01T00:00:00Z',
        effective_status: 'ACTIVE',
        spend: 24,
        impressions: 1600,
        leads: 0
      },
      {
        ad_id: 'new',
        ad_name: 'New quote workflow',
        created_time: new Date().toISOString(),
        effective_status: 'ACTIVE',
        spend: 6,
        impressions: 300,
        leads: 0
      }
    ]
  };
  const result = analyseMarketingSnapshot(snapshot, { by_ad_name: {} }, config, '2026-07-30');
  assert.equal(result.ads.find(ad => ad.ad_id === 'winner').classification, 'winner');
  assert.equal(result.ads.find(ad => ad.ad_id === 'weak').classification, 'pause-review');
  assert.equal(result.ads.find(ad => ad.ad_id === 'new').classification, 'hold');
  assert.equal(result.actions.length, 1);
  assert.equal(result.actions[0].ad_id, 'weak');
  assert.ok(result.next_test.headline.split(/\s+/).length <= 7);
  assert.match(result.theory, /Destroy data entry/);
});

test('performance evidence receives a controlled topic priority boost', () => {
  const registry = { entries: [] };
  const base = scoreCandidate({
    id: 'base',
    topic: 'manual data movement',
    angle: 'Connect the workflow',
    headline: 'Stop copying customer data',
    keywords: ['data']
  }, '2026-07-30', registry, 0);
  const evidence = scoreCandidate({
    id: 'evidence',
    topic: 'manual data movement',
    angle: 'Connect the workflow',
    headline: 'Stop copying customer data',
    keywords: ['data'],
    evidence_quality: 98,
    priority_boost: 12
  }, '2026-07-30', registry, 0);
  assert.ok(evidence.score > base.score);
});

test('Meta credentials check uses an authorisation header rather than a token query string', async () => {
  let inspected;
  const config = loadMarketingConfig({
    META_API_VERSION: 'v99.0',
    META_ACCESS_TOKEN: 'test-token',
    META_AD_ACCOUNT_ID: '123'
  });
  const adapter = new MetaGraphAdapter(config, async (url, options) => {
    inspected = { url: String(url), options };
    return {
      ok: true,
      async json() {
        return { id: 'act_123', name: 'Run Lighter test' };
      }
    };
  });
  const result = await adapter.validateCredentials();
  assert.equal(result.id, 'act_123');
  assert.equal(inspected.options.headers.Authorization, 'Bearer test-token');
  assert.equal(inspected.url.includes('access_token'), false);
});

test('lead webhook sends only when configured', async () => {
  const notConfigured = await deliverLeadWebhook({ leadWebhookUrl: '' }, [{ Email: 'a@example.com' }]);
  assert.equal(notConfigured.delivered, 0);
  let calls = 0;
  const configured = await deliverLeadWebhook(
    { leadWebhookUrl: 'https://example.com/hook', webhookSecret: 'secret' },
    [{ Email: 'a@example.com' }, { Email: 'b@example.com' }],
    async () => {
      calls += 1;
      return { ok: true };
    }
  );
  assert.equal(calls, 2);
  assert.equal(configured.delivered, 2);
});

test('lookback window includes the requested date', () => {
  assert.deepEqual(dateWindow('2026-07-30', 7), {
    since: '2026-07-24',
    until: '2026-07-30'
  });
});
