import process from 'node:process';

const bool = (value, fallback) => {
  if (value === undefined || value === '') return fallback;
  if (['true', '1', 'yes', 'on'].includes(String(value).toLowerCase())) return true;
  if (['false', '0', 'no', 'off'].includes(String(value).toLowerCase())) return false;
  throw new Error(`Invalid boolean configuration value: ${value}`);
};

const number = (value, fallback, minimum, maximum) => {
  const result = value === undefined || value === '' ? fallback : Number(value);
  if (!Number.isFinite(result) || result < minimum || result > maximum) {
    throw new Error(`Configuration number must be between ${minimum} and ${maximum}`);
  }
  return result;
};

const time = (value, fallback) => {
  const result = value || fallback;
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(result)) throw new Error(`Invalid HH:MM time: ${result}`);
  return result;
};

export function loadConfig(overrides = {}) {
  const env = { ...process.env, ...overrides };
  const config = {
    timezone: env.RUN_LIGHTER_TIMEZONE || 'Australia/Sydney',
    siteUrl: (env.RUN_LIGHTER_SITE_URL || 'https://arav1oli.github.io/runlighter').replace(/\/$/, ''),
    campaignStartDate: env.CAMPAIGN_START_DATE || '',
    campaignDays: number(env.CAMPAIGN_DAYS, 14, 1, 365),
    continuousContent: bool(env.CONTINUOUS_CONTENT, false),
    stageTime: time(env.CONTENT_STAGE_TIME, '05:00'),
    publishTime: time(env.CONTENT_PUBLISH_TIME, '07:00'),
    autoPublish: bool(env.AUTO_PUBLISH, false),
    instagramAutoPublish: bool(env.INSTAGRAM_AUTO_PUBLISH, false),
    killSwitch: bool(env.CONTENT_KILL_SWITCH, false),
    dryRun: bool(env.DRY_RUN, true),
    topicSimilarityThreshold: number(env.TOPIC_SIMILARITY_THRESHOLD, 0.82, 0.5, 1),
    promotionThreshold: number(env.PROMOTION_THRESHOLD, 80, 0, 100),
    maxRetries: number(env.MAX_RETRIES, 3, 0, 10),
    publishTimeoutSeconds: number(env.PUBLISH_TIMEOUT_SECONDS, 300, 30, 1800),
    captionMinWords: number(env.CAPTION_MIN_WORDS, 80, 20, 500),
    captionMaxWords: number(env.CAPTION_MAX_WORDS, 180, 40, 1000),
    articleMinWords: number(env.ARTICLE_MIN_WORDS, 700, 300, 3000),
    articleMaxWords: number(env.ARTICLE_MAX_WORDS, 1300, 500, 5000),
    textProvider: env.TEXT_PROVIDER || 'mock',
    imageProvider: env.IMAGE_PROVIDER || 'mock',
    researchProvider: env.RESEARCH_PROVIDER || 'none',
    openaiApiKey: env.OPENAI_API_KEY || '',
    textModel: env.TEXT_MODEL || 'gpt-5.6',
    imageModel: env.IMAGE_MODEL || 'gpt-image-2',
    metaAccessToken: env.META_ACCESS_TOKEN || '',
    metaIgUserId: env.META_IG_USER_ID || '',
    metaApiVersion: env.META_API_VERSION || '',
    notificationProvider: env.NOTIFICATION_PROVIDER || 'github',
    notificationWebhookUrl: env.NOTIFICATION_WEBHOOK_URL || ''
  };

  try {
    new Intl.DateTimeFormat('en-AU', { timeZone: config.timezone }).format(new Date());
  } catch {
    throw new Error(`Invalid IANA timezone: ${config.timezone}`);
  }
  if (config.captionMinWords > config.captionMaxWords) throw new Error('Caption minimum exceeds maximum');
  if (config.articleMinWords > config.articleMaxWords) throw new Error('Article minimum exceeds maximum');
  return Object.freeze(config);
}

export function assertLiveConfiguration(config, channel = 'website') {
  if (config.killSwitch) throw new Error('Campaign kill switch is enabled');
  if (config.dryRun) throw new Error('DRY_RUN must be false for live publishing');
  if (!config.autoPublish) throw new Error('AUTO_PUBLISH must be true for live publishing');
  if (channel === 'instagram') {
    if (!config.instagramAutoPublish) throw new Error('INSTAGRAM_AUTO_PUBLISH must be true');
    if (!config.metaAccessToken || !config.metaIgUserId || !config.metaApiVersion) {
      throw new Error('META_ACCESS_TOKEN, META_IG_USER_ID and META_API_VERSION are required');
    }
  }
}
