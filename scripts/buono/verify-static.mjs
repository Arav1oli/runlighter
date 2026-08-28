import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
const runlighterRoot = path.resolve(scriptRoot, '../..');
const sourcePublicRoot = path.resolve(runlighterRoot, '../buono-launchpad/site/public');
const outputRoot = path.resolve(runlighterRoot, 'launchpads/buono');
const canonicalUrl = 'https://runlighter.com/launchpads/buono/';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const readJson = (absolutePath) => JSON.parse(readFileSync(absolutePath, 'utf8'));

function walk(directory, prefix = '') {
  return readdirSync(directory).flatMap((name) => {
    const absolute = path.join(directory, name);
    const relative = path.posix.join(prefix, name);
    return statSync(absolute).isDirectory() ? walk(absolute, relative) : [relative];
  });
}

assert.ok(existsSync(outputRoot), `Static route is missing at ${outputRoot}`);
const outputFiles = walk(outputRoot).sort();
assert.ok(outputFiles.includes('index.html'), 'Static route is missing index.html');
assert.ok(outputFiles.includes('release-manifest.json'), 'Static route is missing release-manifest.json');

for (const forbidden of ['robots.txt', '.openai', 'server']) {
  assert.equal(
    outputFiles.some((file) => file === forbidden || file.startsWith(`${forbidden}/`)),
    false,
    `Static route contains forbidden nested hosting output: ${forbidden}`,
  );
}

const releaseManifest = readJson(path.join(outputRoot, 'release-manifest.json'));
assert.equal(releaseManifest.schema, 1);
assert.equal(releaseManifest.route, '/launchpads/buono/');
assert.equal(releaseManifest.source_publication, 'buono-launchpad/site/public/data/launchpad-evidence.json');

const manifestedFiles = outputFiles.filter((file) => file !== 'release-manifest.json');
assert.equal(releaseManifest.file_count, manifestedFiles.length, 'Release manifest file count is stale');
assert.deepEqual(releaseManifest.files.map((entry) => entry.file), manifestedFiles, 'Release manifest file list is stale');
for (const entry of releaseManifest.files) {
  const bytes = readFileSync(path.join(outputRoot, entry.file));
  assert.equal(entry.bytes, bytes.byteLength, `Release manifest byte count differs for ${entry.file}`);
  assert.equal(entry.sha256, sha256(bytes), `Release manifest SHA-256 differs for ${entry.file}`);
}

const sourceFiles = walk(sourcePublicRoot).filter((file) => file !== 'robots.txt').sort();
for (const relativePath of sourceFiles) {
  const sourceBytes = readFileSync(path.join(sourcePublicRoot, relativePath));
  const outputPath = path.join(outputRoot, relativePath);
  assert.ok(existsSync(outputPath), `Packaged route is missing source-public artifact ${relativePath}`);
  assert.equal(sha256(readFileSync(outputPath)), sha256(sourceBytes), `Packaged artifact differs from source-public artifact ${relativePath}`);
}

const html = readFileSync(path.join(outputRoot, 'index.html'), 'utf8');
assert.match(html, /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*["']/i, 'Index must carry noindex metadata');
assert.match(html, /<meta[^>]+name=["']googlebot["'][^>]+content=["'][^"']*noindex[^"']*["']/i, 'Index must carry Googlebot noindex metadata');
assert.match(html, new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${canonicalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i'), 'Canonical URL is incorrect');
assert.match(html, /Buono/i);
assert.match(html, /Modern Italian/i);
assert.match(html, /PRIVATE ALPHA/i);
assert.doesNotMatch(html, /badgerage|chatgpt\.site|localhost/i, 'Packaged index still references temporary hosting');

const documentReferences = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map((match) => match[1]);
for (const reference of documentReferences) {
  if (/^(?:https?:|data:|#)/i.test(reference)) continue;
  assert.ok(reference.startsWith('/launchpads/buono/'), `Internal document reference escapes the Buono route: ${reference}`);
}

const evidencePath = path.join(outputRoot, 'data/launchpad-evidence.json');
const publicationManifestPath = path.join(outputRoot, 'data/publication-manifest.json');
const evidence = readJson(evidencePath);
const publicationManifest = readJson(publicationManifestPath);
assert.equal(sha256(readFileSync(evidencePath)), publicationManifest.launchpad_sha256, 'Publication manifest does not authenticate the evidence payload');
assert.equal(publicationManifest.source_asset_count, 11);
assert.equal(evidence.source_manifest.assets.length, 11);
assert.equal(evidence.brand.brand.governing_source.asset_id, '11-buono-concept-board.jpg');
assert.equal(evidence.brand.brand.governing_source.authority, 'gospel');
assert.equal(evidence.brand.core_phrases.menu_promise.numerals, '6 / 6 / 6');
assert.equal(evidence.brand.core_phrases.tagline, 'GOOD FOOD. GOOD PEOPLE. EVERY DAY.');

assert.deepEqual(Object.keys(evidence.datasets), publicationManifest.present_datasets, 'Evidence dataset order and publication manifest have drifted');
for (const dataset of publicationManifest.present_datasets) {
  assert.ok(outputFiles.includes(`data/datasets/${dataset}.json`), `Published dataset is missing: ${dataset}`);
}

for (const asset of evidence.source_manifest.assets) {
  const outputPath = path.join(outputRoot, 'sources', asset.filename);
  assert.ok(existsSync(outputPath), `Source vault asset is missing: ${asset.filename}`);
  const bytes = readFileSync(outputPath);
  assert.equal(bytes.byteLength, asset.bytes, `Source vault byte count differs: ${asset.filename}`);
  assert.equal(sha256(bytes), asset.sha256, `Source vault hash differs: ${asset.filename}`);
}

assert.equal(outputFiles.filter((file) => file.startsWith('sources/') && /\.jpg$/i.test(file)).length, 11, 'Expected eleven source-vault images');
assert.equal(outputFiles.filter((file) => file.startsWith('property-assets/') && /\.jpg$/i.test(file)).length, 9, 'Expected nine property images');
assert.equal(outputFiles.filter((file) => file.startsWith('concept-visuals/') && /\.png$/i.test(file)).length, 3, 'Expected three concept visuals');
assert.equal(outputFiles.filter((file) => file.startsWith('evidence/trends/') && /\.jpg$/i.test(file)).length, 4, 'Expected four trend screenshots');
assert.equal(outputFiles.filter((file) => file.startsWith('assets/') && /\.js$/i.test(file)).length, 1, 'Expected one bundled JavaScript asset');
assert.equal(outputFiles.filter((file) => file.startsWith('assets/') && /\.css$/i.test(file)).length, 1, 'Expected one bundled CSS asset');
const bundledCssPath = outputFiles.find((file) => file.startsWith('assets/') && /\.css$/i.test(file));
const bundledCss = readFileSync(path.join(outputRoot, bundledCssPath), 'utf8');
assert.match(
  bundledCss,
  /code\{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,["']?Liberation Mono["']?,["']?Courier New["']?,monospace\}/,
  'Bundled route must preserve the original monospace treatment for code labels and source IDs',
);

console.log('BUONO_STATIC_ROUTE_VERIFIED');
