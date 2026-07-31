import test from 'node:test';
import assert from 'node:assert/strict';
import { loadConfig } from '../../src/lib/config.mjs';
import { submitIndexNow } from '../../src/lib/indexing.mjs';

test('IndexNow submits unique changed URLs without secrets', async () => {
  const config = loadConfig({
    RUN_LIGHTER_SITE_URL: 'https://runlighter.com',
    INDEXNOW_ENABLED: 'true'
  });
  let request;
  const response = await submitIndexNow(config, [
    'https://runlighter.com/blog/example/',
    'https://runlighter.com/blog/example/',
    'https://runlighter.com/sitemap.xml'
  ], async (url, options) => {
    request = { url, options };
    return { status: 202 };
  });
  const body = JSON.parse(request.options.body);
  assert.equal(request.url, 'https://api.indexnow.org/indexnow');
  assert.equal(body.host, 'runlighter.com');
  assert.equal(body.urlList.length, 2);
  assert.match(body.keyLocation, /^https:\/\/runlighter\.com\/[a-f0-9]+\.txt$/);
  assert.equal(response.status, 'accepted-pending-verification');
});
