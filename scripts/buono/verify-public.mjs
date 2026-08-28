import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const runlighterRoot = path.resolve(scriptRoot, '../..');
const outputRoot = path.join(runlighterRoot, 'launchpads/buono');
const baseUrl = (process.env.RUNLIGHTER_BASE_URL ?? 'https://runlighter.com').replace(/\/+$/, '');
const canonicalUrl = `${baseUrl}/launchpads/buono/`;
const noSlashUrl = `${baseUrl}/launchpads/buono`;
const rollbackUrl = process.env.BUONO_ROLLBACK_URL ?? 'https://buono-alpha-launchpad.badgerage.chatgpt.site/';
const attempts = Math.max(1, Number(process.env.BUONO_PUBLIC_ATTEMPTS ?? 1));
const retryIntervalMs = Math.max(250, Number(process.env.BUONO_PUBLIC_INTERVAL_MS ?? 5_000));
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const localReleaseManifest = JSON.parse(readFileSync(path.join(outputRoot, 'release-manifest.json'), 'utf8'));

async function fetchChecked(url, { redirect = 'manual', timeoutMs = 25_000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect,
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'cache-control': 'no-cache',
        'user-agent': 'RunLighter-Buono-Release-Verifier/1.0',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function getBytes(url, label) {
  const response = await fetchChecked(url);
  assert.equal(response.status, 200, `${label} returned HTTP ${response.status}`);
  return { response, bytes: Buffer.from(await response.arrayBuffer()) };
}

function metaTag(html, name) {
  return html.match(new RegExp(`<meta\\b[^>]*\\bname=["']${name}["'][^>]*>`, 'i'))?.[0] ?? null;
}

async function verify() {
  const pageResponse = await fetchChecked(canonicalUrl);
  assert.equal(pageResponse.status, 200, `Public Buono route returned HTTP ${pageResponse.status}`);
  assert.equal(pageResponse.url, canonicalUrl, 'Canonical Buono request was redirected elsewhere');
  const pageBytes = Buffer.from(await pageResponse.arrayBuffer());
  const html = pageBytes.toString('utf8');
  const localIndexEntry = localReleaseManifest.files.find((entry) => entry.file === 'index.html');
  assert.ok(localIndexEntry, 'Local release manifest does not contain index.html');
  assert.equal(sha256(pageBytes), localIndexEntry.sha256, 'Public index.html differs from the locally verified release');

  const robotsTag = metaTag(html, 'robots');
  const googlebotTag = metaTag(html, 'googlebot');
  assert.ok(robotsTag && /noindex/i.test(robotsTag), 'Public Buono route is missing robots noindex');
  assert.ok(googlebotTag && /noindex/i.test(googlebotTag), 'Public Buono route is missing Googlebot noindex');
  assert.match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/runlighter\.com\/launchpads\/buono\/["']/i);
  assert.match(html, /<title>Buono \| Alpha launchpad<\/title>/i);
  assert.match(html, /Modern Italian/i);
  assert.doesNotMatch(html, /badgerage|chatgpt\.site|localhost/i, 'Public Run Lighter page references temporary hosting');

  const redirectResponse = await fetchChecked(noSlashUrl);
  assert.ok([301, 302, 307, 308].includes(redirectResponse.status), `No-slash URL returned HTTP ${redirectResponse.status} instead of redirecting`);
  const redirectLocation = redirectResponse.headers.get('location');
  assert.ok(redirectLocation, 'No-slash redirect has no Location header');
  assert.equal(new URL(redirectLocation, noSlashUrl).href, canonicalUrl, 'No-slash URL does not redirect to the canonical slash URL');

  const remoteManifestResult = await getBytes(`${canonicalUrl}release-manifest.json`, 'Public release manifest');
  const remoteReleaseManifest = JSON.parse(remoteManifestResult.bytes.toString('utf8'));
  assert.deepEqual(remoteReleaseManifest, localReleaseManifest, 'Public release manifest differs from the local release manifest');

  const criticalFiles = localReleaseManifest.files
    .map((entry) => entry.file)
    .filter((file) => file.startsWith('assets/')
      || file === 'sources/11-buono-concept-board.jpg'
      || file === 'data/launchpad-evidence.json'
      || file === 'data/publication-manifest.json'
      || file === 'evidence/trends/gt-001-sandwiches.jpg'
      || file === 'concept-visuals/35c-ross-forest-lodge-concept-v2.png'
      || /property-assets\/.+\/01\.jpg$/.test(file));
  assert.ok(criticalFiles.length >= 10, 'Critical public asset set is unexpectedly small');
  for (const file of criticalFiles) {
    const entry = localReleaseManifest.files.find((item) => item.file === file);
    const { bytes } = await getBytes(new URL(file, canonicalUrl).href, `Public asset ${file}`);
    assert.equal(bytes.byteLength, entry.bytes, `Public asset byte count differs for ${file}`);
    assert.equal(sha256(bytes), entry.sha256, `Public asset SHA-256 differs for ${file}`);
  }

  for (const route of ['/', '/blog/', '/privacy/', '/robots.txt', '/sitemap.xml']) {
    const response = await fetchChecked(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `Existing Run Lighter route ${route} returned HTTP ${response.status}`);
    if (route === '/sitemap.xml') {
      const sitemap = await response.text();
      assert.doesNotMatch(sitemap, /launchpads\/buono/i, 'Private Buono route is present in the public sitemap');
    }
  }

  const homepageResponse = await fetchChecked(`${baseUrl}/`);
  const homepage = await homepageResponse.text();
  assert.doesNotMatch(homepage, /launchpads\/buono/i, 'Private Buono route is linked from the public homepage');

  const rollbackResponse = await fetchChecked(rollbackUrl);
  assert.equal(rollbackResponse.status, 200, `Rollback launchpad returned HTTP ${rollbackResponse.status}`);
  const rollbackHtml = await rollbackResponse.text();
  assert.match(rollbackHtml, /<title>Buono \| Alpha launchpad/i, 'Rollback page is not the Buono launchpad');
  const rollbackRobots = metaTag(rollbackHtml, 'robots');
  assert.ok(rollbackRobots && /noindex/i.test(rollbackRobots), 'Rollback launchpad is missing noindex');
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    await verify();
    console.log('RUNLIGHTER_BUONO_PUBLIC_VERIFIED');
    process.exit(0);
  } catch (error) {
    lastError = error;
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, retryIntervalMs));
  }
}

throw lastError;
