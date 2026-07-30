import { fromRoot } from '../utils.mjs';

const asBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value).toLowerCase() === 'true';
};

const asNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function loadMarketingConfig(env = process.env) {
  return {
    timezone: env.RUN_LIGHTER_TIMEZONE || 'Australia/Sydney',
    metaApiVersion: env.META_API_VERSION || '',
    metaAccessToken: env.META_ACCESS_TOKEN || '',
    metaAdAccountId: env.META_AD_ACCOUNT_ID || '264193331473545',
    metaCampaignId: env.META_CAMPAIGN_ID || '120252651440610735',
    metaAdSetId: env.META_AD_SET_ID || '120252651440620735',
    metaLeadFormId: env.META_LEAD_FORM_ID || '1035154425566494',
    leadCsvPath: env.RUN_LIGHTER_LEAD_CSV || fromRoot('leads', 'run-lighter-meta-leads.csv'),
    snapshotPath: env.MARKETING_AGENT_SNAPSHOT || '',
    lookbackDays: asNumber(env.MARKETING_LOOKBACK_DAYS, 7),
    minimumSpend: asNumber(env.MARKETING_MINIMUM_SPEND, 20),
    minimumImpressions: asNumber(env.MARKETING_MINIMUM_IMPRESSIONS, 1000),
    minimumAgeHours: asNumber(env.MARKETING_MINIMUM_AGE_HOURS, 72),
    winnerLeadCount: asNumber(env.MARKETING_WINNER_LEAD_COUNT, 2),
    maximumPauseRecommendations: asNumber(env.MARKETING_MAXIMUM_PAUSE_RECOMMENDATIONS, 4),
    allowMetaWrites: asBoolean(env.MARKETING_ALLOW_META_WRITES, false),
    dryRun: asBoolean(env.MARKETING_AGENT_DRY_RUN, true),
    killSwitch: asBoolean(env.MARKETING_AGENT_KILL_SWITCH, false),
    leadWebhookUrl: env.MARKETING_LEAD_WEBHOOK_URL || '',
    webhookSecret: env.MARKETING_LEAD_WEBHOOK_SECRET || ''
  };
}

export function assertMetaReadConfiguration(config) {
  if (!config.metaApiVersion) throw new Error('META_API_VERSION is required for live Meta reads');
  if (!config.metaAccessToken) throw new Error('META_ACCESS_TOKEN is required for live Meta reads');
  if (!config.metaAdAccountId) throw new Error('META_AD_ACCOUNT_ID is required for live Meta reads');
}

export function assertMetaWriteConfiguration(config, confirmLive = false) {
  assertMetaReadConfiguration(config);
  if (!config.allowMetaWrites) throw new Error('MARKETING_ALLOW_META_WRITES must be true for Meta changes');
  if (!confirmLive) throw new Error('Live Meta changes require --confirm-live');
  if (config.killSwitch) throw new Error('Marketing agent kill switch is enabled');
  if (config.dryRun) throw new Error('MARKETING_AGENT_DRY_RUN must be false for Meta changes');
}
