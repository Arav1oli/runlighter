import { readJson, redact } from '../utils.mjs';
import { assertMetaReadConfiguration, assertMetaWriteConfiguration } from './config.mjs';

const toNumber = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const actionValue = (actions = [], types = []) => actions
  .filter(action => types.some(type => action.action_type === type || action.action_type?.includes(type)))
  .reduce((total, action) => total + toNumber(action.value), 0);

function normaliseInsight(insight, ad = {}) {
  const leads = actionValue(insight.actions, ['lead', 'onsite_conversion.lead_grouped']);
  const costPerLead = (insight.cost_per_action_type || [])
    .find(action => action.action_type === 'lead' || action.action_type?.includes('lead'))?.value;
  return {
    ad_id: insight.ad_id || ad.id || '',
    ad_name: insight.ad_name || ad.name || '',
    status: ad.status || '',
    effective_status: ad.effective_status || '',
    created_time: ad.created_time || '',
    spend: toNumber(insight.spend),
    impressions: toNumber(insight.impressions),
    clicks: toNumber(insight.clicks),
    ctr: toNumber(insight.ctr),
    cpc: toNumber(insight.cpc),
    leads,
    cost_per_lead: toNumber(costPerLead),
    raw_actions: insight.actions || []
  };
}

export class MetaGraphAdapter {
  constructor(config, fetchImpl = fetch) {
    assertMetaReadConfiguration(config);
    this.config = config;
    this.fetch = fetchImpl;
    this.baseUrl = `https://graph.facebook.com/${config.metaApiVersion}`;
    this.name = 'meta-graph';
  }

  async request(endpoint, { method = 'GET', query = {}, body = null } = {}) {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`);
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
    const response = await this.fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.config.metaAccessToken}`,
        ...(body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {})
      },
      body: body ? new URLSearchParams(body) : undefined
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.error) {
      const message = payload.error?.message || `Meta API returned HTTP ${response.status}`;
      throw new Error(redact(message));
    }
    return payload;
  }

  async allPages(endpoint, query) {
    const data = [];
    let next = endpoint;
    let nextQuery = query;
    while (next) {
      const page = await this.request(next, { query: nextQuery });
      data.push(...(page.data || []));
      next = page.paging?.next || '';
      nextQuery = {};
    }
    return data;
  }

  async validateCredentials() {
    return this.request(`act_${this.config.metaAdAccountId}`, {
      query: { fields: 'id,name,account_status,currency' }
    });
  }

  async fetchSnapshot({ since, until }) {
    const [ads, insights] = await Promise.all([
      this.allPages(`act_${this.config.metaAdAccountId}/ads`, {
        fields: 'id,name,status,effective_status,created_time',
        limit: 500,
        filtering: this.config.metaCampaignId
          ? [{ field: 'campaign.id', operator: 'EQUAL', value: this.config.metaCampaignId }]
          : undefined
      }),
      this.allPages(`act_${this.config.metaAdAccountId}/insights`, {
        level: 'ad',
        fields: 'ad_id,ad_name,spend,impressions,clicks,ctr,cpc,actions,cost_per_action_type',
        time_range: { since, until },
        limit: 500,
        filtering: this.config.metaCampaignId
          ? [{ field: 'campaign.id', operator: 'EQUAL', value: this.config.metaCampaignId }]
          : undefined
      })
    ]);
    const adById = new Map(ads.map(ad => [ad.id, ad]));
    const insightIds = new Set(insights.map(item => item.ad_id));
    const rows = insights.map(item => normaliseInsight(item, adById.get(item.ad_id)));
    for (const ad of ads) if (!insightIds.has(ad.id)) rows.push(normaliseInsight({}, ad));
    return {
      source: this.name,
      fetched_at: new Date().toISOString(),
      account_id: this.config.metaAdAccountId,
      campaign_id: this.config.metaCampaignId,
      since,
      until,
      ads: rows
    };
  }

  async fetchLeads() {
    if (!this.config.metaLeadFormId) return [];
    return this.allPages(`${this.config.metaLeadFormId}/leads`, {
      fields: 'id,created_time,ad_id,ad_name,campaign_id,adset_id,field_data',
      limit: 500
    });
  }

  async pauseAd(adId, { confirmLive = false } = {}) {
    assertMetaWriteConfiguration(this.config, confirmLive);
    return this.request(adId, { method: 'POST', body: { status: 'PAUSED' } });
  }
}

export class FileMetaAdapter {
  constructor(snapshotPath) {
    this.snapshotPath = snapshotPath;
    this.name = 'file-snapshot';
  }

  async validateCredentials() {
    return { source: this.name, snapshot_path: this.snapshotPath };
  }

  async fetchSnapshot() {
    const snapshot = await readJson(this.snapshotPath);
    return { ...snapshot, source: snapshot.source || this.name };
  }

  async fetchLeads() {
    const snapshot = await readJson(this.snapshotPath);
    return snapshot.leads || [];
  }

  async pauseAd() {
    throw new Error('File snapshot adapter cannot change Meta ads');
  }
}

export function getMetaAdapter(config, { snapshotPath = '' } = {}) {
  if (snapshotPath) return new FileMetaAdapter(snapshotPath);
  return new MetaGraphAdapter(config);
}
