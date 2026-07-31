export const DEFAULT_INDEXNOW_KEY = '9f5e7a3c2d8b4a61e0f7c9d5b3a18264';

export async function submitIndexNow(config, urls, fetchImpl = fetch) {
  const uniqueUrls = [...new Set(urls.filter(Boolean))];
  if (!config.indexNowEnabled) {
    return { status: 'skipped', reason: 'IndexNow is disabled', urls: uniqueUrls };
  }
  if (!uniqueUrls.length) {
    return { status: 'skipped', reason: 'No changed URLs supplied', urls: [] };
  }
  const site = new URL(config.siteUrl);
  const response = await fetchImpl(config.indexNowEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: site.host,
      key: config.indexNowKey,
      keyLocation: `${config.siteUrl}/${config.indexNowKey}.txt`,
      urlList: uniqueUrls
    })
  });
  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow submission failed with HTTP ${response.status}`);
  }
  return {
    status: response.status === 202 ? 'accepted-pending-verification' : 'submitted',
    http_status: response.status,
    urls: uniqueUrls
  };
}
